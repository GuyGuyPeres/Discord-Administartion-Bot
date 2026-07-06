const { getGuildSettings } = require('../database/guildSettings');

function sendModLog(guild, embed) {
  const settings = getGuildSettings(guild.id);
  if (!settings.mod_log_channel_id) return;

  const channel = guild.channels.cache.get(settings.mod_log_channel_id);
  if (!channel) return;

  channel.send({ embeds: [embed] }).catch(() => {});
}

module.exports = { sendModLog };
