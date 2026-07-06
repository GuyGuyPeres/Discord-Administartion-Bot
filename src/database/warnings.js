const db = require('./db');

const insertStmt = db.prepare(
  'INSERT INTO warnings (guild_id, user_id, moderator_id, reason) VALUES (?, ?, ?, ?)',
);
const listStmt = db.prepare(
  'SELECT * FROM warnings WHERE guild_id = ? AND user_id = ? ORDER BY created_at DESC',
);
const clearStmt = db.prepare('DELETE FROM warnings WHERE guild_id = ? AND user_id = ?');

function addWarning(guildId, userId, moderatorId, reason) {
  return insertStmt.run(guildId, userId, moderatorId, reason);
}

function listWarnings(guildId, userId) {
  return listStmt.all(guildId, userId);
}

function clearWarnings(guildId, userId) {
  return clearStmt.run(guildId, userId).changes;
}

module.exports = { addWarning, listWarnings, clearWarnings };
