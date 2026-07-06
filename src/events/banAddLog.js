const { Events, EmbedBuilder } = require('discord.js');
const { sendModLog } = require('../utils/modLog');

module.exports = {
  name: Events.GuildBanAdd,
  execute(ban) {
    const embed = new EmbedBuilder()
      .setTitle('Member Banned')
      .setColor(0xc0392b)
      .addFields({ name: 'User', value: `${ban.user.tag}` })
      .setTimestamp();

    sendModLog(ban.guild, embed);
  },
};
