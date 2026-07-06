# Discord Administration Bot

A free, open-source, multi-feature Discord bot. See [PLAN.md](PLAN.md) for the module roadmap and build steps.

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and fill in your bot's `DISCORD_TOKEN`, `CLIENT_ID`, and (optionally) `DEV_GUILD_ID` for fast command registration during development.
3. Register slash commands: `npm run deploy-commands`
4. Start the bot: `npm start`
