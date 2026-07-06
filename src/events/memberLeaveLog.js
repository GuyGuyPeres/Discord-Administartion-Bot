const { Events, EmbedBuilder } = require('discord.js');
const { sendModLog } = require('../utils/modLog');

module.exports = {
  name: Events.GuildMemberRemove,
  execute(member) {
    const embed = new EmbedBuilder()
      .setTitle('Member Left')
      .setColor(0x95a5a6)
      .setThumbnail(member.user.displayAvatarURL())
      .addFields({ name: 'User', value: `${member.user.tag}` })
      .setTimestamp();

    sendModLog(member.guild, embed);
  },
};
