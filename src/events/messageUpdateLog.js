const { Events, EmbedBuilder } = require('discord.js');
const { sendModLog } = require('../utils/modLog');

module.exports = {
  name: Events.MessageUpdate,
  execute(oldMessage, newMessage) {
    if (!newMessage.guild || newMessage.partial || newMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    const embed = new EmbedBuilder()
      .setTitle('Message Edited')
      .setColor(0xf39c12)
      .addFields(
        { name: 'Author', value: `${newMessage.author}`, inline: true },
        { name: 'Channel', value: `${newMessage.channel}`, inline: true },
        { name: 'Before', value: oldMessage.content || '*No text content*' },
        { name: 'After', value: newMessage.content || '*No text content*' },
      )
      .setTimestamp();

    sendModLog(newMessage.guild, embed);
  },
};
