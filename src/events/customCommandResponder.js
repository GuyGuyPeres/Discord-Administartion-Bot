const { Events } = require('discord.js');
const { getCustomCommand } = require('../database/customCommands');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (!message.guild || message.author.bot) return;

    const trigger = message.content.trim();
    if (!trigger) return;

    const command = getCustomCommand(message.guild.id, trigger);
    if (!command) return;

    await message.channel.send({ content: command.response, allowedMentions: { parse: [] } }).catch(() => {});
  },
};
