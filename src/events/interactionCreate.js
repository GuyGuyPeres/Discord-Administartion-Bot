const { Events, Collection } = require('discord.js');
const { isModuleEnabled } = require('../database/guildSettings');
const { getFriendlyErrorMessage } = require('../utils/errorMessages');

const ALWAYS_ON_CATEGORY = 'administration';
const DEFAULT_COOLDOWN_SECONDS = 3;

const cooldowns = new Collection(); // commandName -> Collection<userId, expiresAtMs>

function checkCooldown(command, userId) {
  const cooldownSeconds = command.cooldown ?? DEFAULT_COOLDOWN_SECONDS;
  if (!cooldowns.has(command.data.name)) {
    cooldowns.set(command.data.name, new Collection());
  }
  const timestamps = cooldowns.get(command.data.name);
  const now = Date.now();
  const expiresAt = timestamps.get(userId);

  if (expiresAt && now < expiresAt) {
    return (expiresAt - now) / 1000;
  }

  timestamps.set(userId, now + cooldownSeconds * 1000);
  setTimeout(() => timestamps.delete(userId), cooldownSeconds * 1000).unref();
  return 0;
}

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      console.warn(`No command matching "${interaction.commandName}" was found.`);
      return;
    }

    if (
      interaction.inGuild() &&
      command.category !== ALWAYS_ON_CATEGORY &&
      !isModuleEnabled(interaction.guild.id, command.category)
    ) {
      return interaction.reply({
        content: `The **${command.category}** module is disabled in this server.`,
        ephemeral: true,
      });
    }

    const remaining = checkCooldown(command, interaction.user.id);
    if (remaining > 0) {
      return interaction.reply({
        content: `Please wait ${remaining.toFixed(1)}s before using \`/${command.data.name}\` again.`,
        ephemeral: true,
      });
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing "${interaction.commandName}":`, error);

      const reply = { content: getFriendlyErrorMessage(error), ephemeral: true };
      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(reply);
        } else {
          await interaction.reply(reply);
        }
      } catch (replyError) {
        console.error(`Failed to send error reply for "${interaction.commandName}":`, replyError);
      }
    }
  },
};
