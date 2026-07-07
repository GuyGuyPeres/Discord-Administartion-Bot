const { Events } = require('discord.js');
const { getReactionRole } = require('../database/reactionRoles');
const { emojiKeyFromReactionEmoji } = require('../utils/emoji');

module.exports = {
  name: Events.MessageReactionAdd,
  async execute(reaction, user) {
    if (user.bot) return;

    if (reaction.partial) {
      reaction = await reaction.fetch().catch(() => null);
      if (!reaction) return;
    }
    if (!reaction.message.guild) return;

    const binding = getReactionRole(reaction.message.id, emojiKeyFromReactionEmoji(reaction.emoji));
    if (!binding) return;

    const member = await reaction.message.guild.members.fetch(user.id).catch(() => null);
    if (!member) return;

    await member.roles.add(binding.role_id).catch(() => {});
  },
};
