const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { clearWarnings } = require('../../database/warnings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearwarnings')
    .setDescription("Clear a member's warning history")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((opt) => opt.setName('user').setDescription('The member to clear warnings for').setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getUser('user', true);
    const cleared = clearWarnings(interaction.guild.id, target.id);

    if (cleared === 0) {
      return interaction.reply({ content: `**${target.tag}** has no warnings to clear.`, ephemeral: true });
    }

    await interaction.reply(`Cleared **${cleared}** warning(s) for **${target.tag}**.`);
  },
};
