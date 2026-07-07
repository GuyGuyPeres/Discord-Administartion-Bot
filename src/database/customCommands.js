const db = require('./db');

const upsertStmt = db.prepare(`
  INSERT INTO custom_commands (guild_id, trigger, response) VALUES (?, ?, ?)
  ON CONFLICT(guild_id, trigger) DO UPDATE SET response = excluded.response
`);
const getStmt = db.prepare('SELECT * FROM custom_commands WHERE guild_id = ? AND trigger = ?');
const removeStmt = db.prepare('DELETE FROM custom_commands WHERE guild_id = ? AND trigger = ?');
const listStmt = db.prepare('SELECT * FROM custom_commands WHERE guild_id = ? ORDER BY trigger');

function addCustomCommand(guildId, trigger, response) {
  upsertStmt.run(guildId, trigger.toLowerCase(), response);
}

function getCustomCommand(guildId, trigger) {
  return getStmt.get(guildId, trigger.toLowerCase()) ?? null;
}

function removeCustomCommand(guildId, trigger) {
  return removeStmt.run(guildId, trigger.toLowerCase()).changes > 0;
}

function listCustomCommands(guildId) {
  return listStmt.all(guildId);
}

module.exports = { addCustomCommand, getCustomCommand, removeCustomCommand, listCustomCommands };
