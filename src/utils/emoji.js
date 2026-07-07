function emojiKeyFromRaw(raw) {
  const match = raw.match(/^<a?:\w+:(\d+)>$/);
  return match ? match[1] : raw;
}

function emojiKeyFromReactionEmoji(emoji) {
  return emoji.id ?? emoji.name;
}

module.exports = { emojiKeyFromRaw, emojiKeyFromReactionEmoji };
