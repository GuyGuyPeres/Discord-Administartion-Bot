const { Events, EmbedBuilder } = require('discord.js');
const { sendModLog } = require('../utils/modLog');

module.exports = {
  name: Events.GuildMemberUpdate,
  execute(oldMember, newMember) {
    if (oldMember.nickname !== newMember.nickname) {
      const embed = new EmbedBuilder()
        .setTitle('Nickname Changed')
        .setColor(0x3498db)
        .addFields(
          { name: 'User', value: `${newMember.user.tag}` },
          { name: 'Before', value: oldMember.nickname ?? '*None*', inline: true },
          { name: 'After', value: newMember.nickname ?? '*None*', inline: true },
        )
        .setTimestamp();
      sendModLog(newMember.guild, embed);
    }

    const addedRoles = newMember.roles.cache.filter((r) => !oldMember.roles.cache.has(r.id));
    const removedRoles = oldMember.roles.cache.filter((r) => !newMember.roles.cache.has(r.id));

    if (addedRoles.size > 0 || removedRoles.size > 0) {
      const embed = new EmbedBuilder()
        .setTitle('Member Roles Updated')
        .setColor(0x9b59b6)
        .addFields({ name: 'User', value: `${newMember.user.tag}` })
        .setTimestamp();

      if (addedRoles.size > 0) {
        embed.addFields({ name: 'Added', value: addedRoles.map((r) => `${r}`).join(', ') });
      }
      if (removedRoles.size > 0) {
        embed.addFields({ name: 'Removed', value: removedRoles.map((r) => `${r}`).join(', ') });
      }

      sendModLog(newMember.guild, embed);
    }
  },
};
