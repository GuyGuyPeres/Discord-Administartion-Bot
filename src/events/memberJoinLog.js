const { Events, EmbedBuilder } = require('discord.js');
const { sendModLog } = require('../utils/modLog');

module.exports = {
  name: Events.GuildMemberAdd,
  execute(member) {
    const embed = new EmbedBuilder()
      .setTitle('Member Joined')
      .setColor(0x2ecc71)
      .setThumbnail(member.user.displayAvatarURL())
      .addFields(
        { name: 'User', value: `${member.user} (${member.user.tag})` },
        { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>` },
      )
      .setTimestamp();

    sendModLog(member.guild, embed);
  },
};
