const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

const dataDir = path.join(__dirname, '..', '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'bot.sqlite'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS guild_settings (
    guild_id TEXT PRIMARY KEY,
    prefix TEXT DEFAULT '!',
    mod_log_channel_id TEXT,
    welcome_channel_id TEXT,
    welcome_message TEXT,
    modules_enabled TEXT DEFAULT '{}'
  );

  CREATE TABLE IF NOT EXISTS warnings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    moderator_id TEXT NOT NULL,
    reason TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE INDEX IF NOT EXISTS idx_warnings_guild_user ON warnings (guild_id, user_id);

  CREATE TABLE IF NOT EXISTS automod_config (
    guild_id TEXT PRIMARY KEY,
    enabled INTEGER NOT NULL DEFAULT 0,
    banned_words TEXT NOT NULL DEFAULT '[]',
    block_invites INTEGER NOT NULL DEFAULT 0,
    max_mentions INTEGER NOT NULL DEFAULT 0,
    caps_threshold INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS antiraid_config (
    guild_id TEXT PRIMARY KEY,
    enabled INTEGER NOT NULL DEFAULT 0,
    join_threshold INTEGER NOT NULL DEFAULT 10,
    window_seconds INTEGER NOT NULL DEFAULT 10,
    min_account_age_days INTEGER NOT NULL DEFAULT 7
  );

  CREATE TABLE IF NOT EXISTS reaction_roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    message_id TEXT NOT NULL,
    emoji_key TEXT NOT NULL,
    role_id TEXT NOT NULL,
    UNIQUE(message_id, emoji_key)
  );

  CREATE INDEX IF NOT EXISTS idx_reaction_roles_message ON reaction_roles (message_id);

  CREATE TABLE IF NOT EXISTS custom_commands (
    guild_id TEXT NOT NULL,
    trigger TEXT NOT NULL,
    response TEXT NOT NULL,
    PRIMARY KEY (guild_id, trigger)
  );
`);

module.exports = db;
