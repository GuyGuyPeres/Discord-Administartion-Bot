const { Events, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { getAutomodConfig } = require('../database/automod');
const { sendModLog } = require('../utils/modLog');
const { escapeRegex } = require('../utils/text');

const INVITE_REGEX = /(discord\.gg|discord(?:app)?\.com\/invite)\/[\w-]+/i;
const MIN_LENGTH_FOR_CAPS_CHECK = 10;
const NOTICE_DELETE_MS = 6000;

async function notifyChannel(message, reason) {
  try {
    const notice = await message.channel.send(`${message.author}, your message was removed: ${reason}`);
    setTimeout(() => notice.delete().catch(() => {}), NOTICE_DELETE_MS).unref();
  } catch {
    // Ignore - notifying is best-effort.
  }
}

function logViolation(message, reason) {
  const embed = new EmbedBuilder()
    .setTitle('Automod: Message Removed')
    .setColor(0xe67e22)
    .addFields(
      { name: 'User', value: `${message.author}`, inline: true },
      { name: 'Channel', value: `${message.channel}`, inline: true },
      { name: 'Reason', value: reason },
      { name: 'Content', value: message.content || '*No text content*' },
    )
    .setTimestamp();
  sendModLog(message.guild, embed);
}

function capsRatio(text) {
  const letters = text.replace(/[^a-zA-Z]/g, '');
  if (letters.length === 0) return 0;
  const upper = letters.replace(/[^A-Z]/g, '');
  return (upper.length / letters.length) * 100;
}

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (!message.guild || message.author.bot) return;
    if (message.member?.permissions.has(PermissionFlagsBits.ManageMessages)) return;

    const config = getAutomodConfig(message.guild.id);
    if (!config.enabled) return;

    let reason = null;

    if (config.block_invites && INVITE_REGEX.test(message.content)) {
      reason = 'Discord invite links are not allowed here.';
    }

    if (!reason && config.banned_words.length > 0) {
      const hit = config.banned_words.find((word) =>
        new RegExp(`\\b${escapeRegex(word)}\\b`, 'i').test(message.content),
      );
      if (hit) reason = 'Your message contained a banned word.';
    }

    if (!reason && config.max_mentions > 0) {
      const mentionCount = message.mentions.users.size + message.mentions.roles.size;
      if (mentionCount > config.max_mentions) {
        reason = 'Your message mentioned too many users/roles.';
      }
    }

    if (!reason && config.caps_threshold > 0 && message.content.length >= MIN_LENGTH_FOR_CAPS_CHECK) {
      if (capsRatio(message.content) >= config.caps_threshold) {
        reason = 'Please avoid excessive caps.';
      }
    }

    if (!reason || !message.deletable) return;

    await message.delete().catch(() => {});
    await notifyChannel(message, reason);
    logViolation(message, reason);
  },
};
