const db = require('./db');

const getStmt = db.prepare('SELECT * FROM automod_config WHERE guild_id = ?');
const insertStmt = db.prepare('INSERT INTO automod_config (guild_id) VALUES (?)');
const setEnabledStmt = db.prepare('UPDATE automod_config SET enabled = ? WHERE guild_id = ?');
const setBlockInvitesStmt = db.prepare('UPDATE automod_config SET block_invites = ? WHERE guild_id = ?');
const setMaxMentionsStmt = db.prepare('UPDATE automod_config SET max_mentions = ? WHERE guild_id = ?');
const setCapsThresholdStmt = db.prepare('UPDATE automod_config SET caps_threshold = ? WHERE guild_id = ?');
const setBannedWordsStmt = db.prepare('UPDATE automod_config SET banned_words = ? WHERE guild_id = ?');

function getAutomodConfig(guildId) {
  let config = getStmt.get(guildId);
  if (!config) {
    insertStmt.run(guildId);
    config = getStmt.get(guildId);
  }
  return {
    ...config,
    enabled: Boolean(config.enabled),
    block_invites: Boolean(config.block_invites),
    banned_words: JSON.parse(config.banned_words),
  };
}

function setAutomodEnabled(guildId, enabled) {
  getAutomodConfig(guildId);
  setEnabledStmt.run(enabled ? 1 : 0, guildId);
}

function setBlockInvites(guildId, enabled) {
  getAutomodConfig(guildId);
  setBlockInvitesStmt.run(enabled ? 1 : 0, guildId);
}

function setMaxMentions(guildId, max) {
  getAutomodConfig(guildId);
  setMaxMentionsStmt.run(max, guildId);
}

function setCapsThreshold(guildId, threshold) {
  getAutomodConfig(guildId);
  setCapsThresholdStmt.run(threshold, guildId);
}

function addBannedWord(guildId, word) {
  const config = getAutomodConfig(guildId);
  const normalized = word.toLowerCase();
  if (config.banned_words.includes(normalized)) return false;
  config.banned_words.push(normalized);
  setBannedWordsStmt.run(JSON.stringify(config.banned_words), guildId);
  return true;
}

function removeBannedWord(guildId, word) {
  const config = getAutomodConfig(guildId);
  const normalized = word.toLowerCase();
  if (!config.banned_words.includes(normalized)) return false;
  setBannedWordsStmt.run(JSON.stringify(config.banned_words.filter((w) => w !== normalized)), guildId);
  return true;
}

module.exports = {
  getAutomodConfig,
  setAutomodEnabled,
  setBlockInvites,
  setMaxMentions,
  setCapsThreshold,
  addBannedWord,
  removeBannedWord,
};
