const { Events, EmbedBuilder } = require('discord.js');
const { sendModLog } = require('../utils/modLog');

module.exports = {
  name: Events.MessageDelete,
  execute(message) {
    if (!message.guild || message.partial || message.author?.bot) return;

    const embed = new EmbedBuilder()
      .setTitle('Message Deleted')
      .setColor(0xe74c3c)
      .addFields(
        { name: 'Author', value: `${message.author}`, inline: true },
        { name: 'Channel', value: `${message.channel}`, inline: true },
        { name: 'Content', value: message.content || '*No text content*' },
      )
      .setTimestamp();

    sendModLog(message.guild, embed);
  },
};
