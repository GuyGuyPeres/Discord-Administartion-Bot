const { Events, EmbedBuilder } = require('discord.js');
const { sendModLog } = require('../utils/modLog');

module.exports = {
  name: Events.GuildBanRemove,
  execute(ban) {
    const embed = new EmbedBuilder()
      .setTitle('Member Unbanned')
      .setColor(0x27ae60)
      .addFields({ name: 'User', value: `${ban.user.tag}` })
      .setTimestamp();

    sendModLog(ban.guild, embed);
  },
};
