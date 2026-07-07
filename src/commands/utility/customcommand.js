const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const {
  addCustomCommand,
  removeCustomCommand,
  listCustomCommands,
} = require('../../database/customCommands');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('customcommand')
    .setDescription('Manage custom auto-responder commands')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) =>
      sub
        .setName('add')
        .setDescription('Add or update a custom command')
        .addStringOption((opt) =>
          opt.setName('trigger').setDescription('The word/phrase that triggers it').setRequired(true).setMaxLength(50),
        )
        .addStringOption((opt) =>
          opt.setName('response').setDescription('The bot response').setRequired(true).setMaxLength(1500),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName('remove')
        .setDescription('Remove a custom command')
        .addStringOption((opt) => opt.setName('trigger').setDescription('The trigger to remove').setRequired(true)),
    )
    .addSubcommand((sub) => sub.setName('list').setDescription('List custom commands in this server')),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const sub = interaction.options.getSubcommand();

    if (sub === 'add') {
      const trigger = interaction.options.getString('trigger', true);
      const response = interaction.options.getString('response', true);
      addCustomCommand(guildId, trigger, response);
      return interaction.reply(`Custom command **${trigger.toLowerCase()}** saved.`);
    }

    if (sub === 'remove') {
      const trigger = interaction.options.getString('trigger', true);
      const removed = removeCustomCommand(guildId, trigger);
      return interaction.reply({
        content: removed ? `Removed custom command **${trigger.toLowerCase()}**.` : `No custom command found for **${trigger.toLowerCase()}**.`,
        ephemeral: true,
      });
    }

    if (sub === 'list') {
      const rows = listCustomCommands(guildId);
      if (rows.length === 0) {
        return interaction.reply({ content: 'No custom commands configured in this server.', ephemeral: true });
      }
      const embed = new EmbedBuilder()
        .setTitle('Custom Commands')
        .setColor(0x3498db)
        .setDescription(rows.map((r) => `\`${r.trigger}\``).join(', '));
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
