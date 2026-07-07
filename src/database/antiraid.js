const db = require('./db');

const getStmt = db.prepare('SELECT * FROM antiraid_config WHERE guild_id = ?');
const insertStmt = db.prepare('INSERT INTO antiraid_config (guild_id) VALUES (?)');
const setEnabledStmt = db.prepare('UPDATE antiraid_config SET enabled = ? WHERE guild_id = ?');
const setThresholdStmt = db.prepare(
  'UPDATE antiraid_config SET join_threshold = ?, window_seconds = ? WHERE guild_id = ?',
);
const setMinAccountAgeStmt = db.prepare('UPDATE antiraid_config SET min_account_age_days = ? WHERE guild_id = ?');

function getAntiraidConfig(guildId) {
  let config = getStmt.get(guildId);
  if (!config) {
    insertStmt.run(guildId);
    config = getStmt.get(guildId);
  }
  return { ...config, enabled: Boolean(config.enabled) };
}

function setAntiraidEnabled(guildId, enabled) {
  getAntiraidConfig(guildId);
  setEnabledStmt.run(enabled ? 1 : 0, guildId);
}

function setThreshold(guildId, joinThreshold, windowSeconds) {
  getAntiraidConfig(guildId);
  setThresholdStmt.run(joinThreshold, windowSeconds, guildId);
}

function setMinAccountAge(guildId, days) {
  getAntiraidConfig(guildId);
  setMinAccountAgeStmt.run(days, guildId);
}

module.exports = { getAntiraidConfig, setAntiraidEnabled, setThreshold, setMinAccountAge };
