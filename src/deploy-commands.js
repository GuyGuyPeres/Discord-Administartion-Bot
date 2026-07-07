require('dotenv').config({ quiet: true });
const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
for (const category of fs.readdirSync(commandsPath)) {
  const categoryPath = path.join(commandsPath, category);
  for (const file of fs.readdirSync(categoryPath).filter((f) => f.endsWith('.js'))) {
    const command = require(path.join(categoryPath, file));
    if (command?.data) commands.push(command.data.toJSON());
  }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  const route = process.env.DEV_GUILD_ID
    ? Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.DEV_GUILD_ID)
    : Routes.applicationCommands(process.env.CLIENT_ID);

  const data = await rest.put(route, { body: commands });
  console.log(`Registered ${data.length} application (/) commands${process.env.DEV_GUILD_ID ? ' for dev guild' : ' globally'}.`);
})().catch(console.error);
