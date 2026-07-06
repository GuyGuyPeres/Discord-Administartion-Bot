require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
for (const category of fs.readdirSync(commandsPath)) {
  const categoryPath = path.join(commandsPath, category);
  for (const file of fs.readdirSync(categoryPath).filter((f) => f.endsWith('.js'))) {
    const command = require(path.join(categoryPath, file));
    if (command?.data && command?.execute) {
      client.commands.set(command.data.name, command);
    } else {
      console.warn(`[WARN] Command at ${category}/${file} is missing "data" or "execute".`);
    }
  }
}

const eventsPath = path.join(__dirname, 'events');
for (const file of fs.readdirSync(eventsPath).filter((f) => f.endsWith('.js'))) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.login(process.env.DISCORD_TOKEN);
