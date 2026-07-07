const db = require('./db');

const insertStmt = db.prepare(`
  INSERT INTO reaction_roles (guild_id, message_id, emoji_key, role_id) VALUES (?, ?, ?, ?)
  ON CONFLICT(message_id, emoji_key) DO UPDATE SET role_id = excluded.role_id
`);
const getStmt = db.prepare('SELECT * FROM reaction_roles WHERE message_id = ? AND emoji_key = ?');
const removeStmt = db.prepare('DELETE FROM reaction_roles WHERE message_id = ? AND emoji_key = ?');
const listStmt = db.prepare('SELECT * FROM reaction_roles WHERE guild_id = ?');

function addReactionRole(guildId, messageId, emojiKey, roleId) {
  insertStmt.run(guildId, messageId, emojiKey, roleId);
}

function getReactionRole(messageId, emojiKey) {
  return getStmt.get(messageId, emojiKey) ?? null;
}

function removeReactionRole(messageId, emojiKey) {
  return removeStmt.run(messageId, emojiKey).changes > 0;
}

function listReactionRoles(guildId) {
  return listStmt.all(guildId);
}

module.exports = { addReactionRole, getReactionRole, removeReactionRole, listReactionRoles };
