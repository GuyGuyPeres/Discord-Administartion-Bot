# Discord Bot — Project Plan

Public, free-to-use, multi-feature Discord bot. Showcase project for GitHub.

## Modules

- [ ] **Administration** (core focus)
- [ ] Moderation & Safety — automod, warn/mute/kick/ban + case history, anti-raid
- [ ] Utility — reaction roles, custom commands, reminders, polls/giveaways, tickets
  - [x] Welcome messages with generated image card (`/config welcome channel|message`)
- [ ] Engagement — leveling/XP, economy, starboard, suggestions
- [ ] Fun — games, meme commands, music
- [ ] Integrations — YouTube/Twitch/Twitter notifications, RSS, webhooks
- [x] Server management — logging (message edit/delete, joins/leaves, roles/nicknames, bans), configurable via `/config`
- [ ] Server management — config backup/restore
- [ ] Cross-cutting — slash commands, per-guild toggleable config, multi-language support

## Build Steps

1. [x] Pick stack (language/library) — Node.js + discord.js
2. [x] Scaffold project (repo structure, env config, linting, README)
   - [x] `npm init` — package.json created
   - [x] Install `discord.js` + `dotenv`
   - [x] Create folder structure (`src/commands`, `src/events`, `src/handlers`, `src/config`, `src/database`)
   - [x] Add `.gitignore` (node_modules, .env)
   - [x] Add `.env.example`
   - [x] Add base `README.md`
3. [x] Core bot setup (client init, command handler, event handler)
   - [x] `src/index.js` — client init + dynamic command/event loaders
   - [x] `src/deploy-commands.js` — registers slash commands (guild-scoped in dev via `DEV_GUILD_ID`, global otherwise)
   - [x] `src/events/ready.js`, `src/events/interactionCreate.js`
   - [x] Example command: `src/commands/administration/ping.js`
4. [x] Database setup (per-guild settings, warnings, levels, economy, etc.)
   - [x] Install `better-sqlite3`
   - [x] `src/database/db.js` — connection + schema (`guild_settings`, `warnings`)
   - [x] `src/database/guildSettings.js` — get-or-create repository helper
   - [x] Smoke-tested: schema creates and reads correctly
5. [x] Build modules incrementally — Administration + Moderation first
   - [x] `src/utils/moderation.js` — role-hierarchy/self/owner guard shared by mod commands
   - [x] Administration: `/kick`, `/ban`, `/unban`, `/timeout`, `/untimeout`, `/purge`, `/slowmode`, `/lock`, `/unlock`, `/nickname`, `/role add|remove`
   - [x] Moderation: `src/database/warnings.js` + `/warn`, `/warnings`, `/clearwarnings`
6. [ ] Per-guild config/toggle system
7. [ ] Permissions & error handling (role checks, cooldowns)
8. [ ] Testing on a dev server
9. [ ] Docs & polish (README, license, contribution guide)
10. [ ] Deployment (hosting + process manager, optional Docker)

## Decisions Log

- Stack: Node.js + discord.js
- Database: SQLite (better-sqlite3)
- Welcome card images: @napi-rs/canvas (prebuilt binaries, no native build tools needed on Windows)
