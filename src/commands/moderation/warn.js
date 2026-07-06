const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { canModerate } = require('../../utils/moderation');
const { addWarning, listWarnings } = require('../../database/warnings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((opt) => opt.setName('user').setDescription('The member to warn').setRequired(true))
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason for the warning').setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason', true);

    if (!target) {
      return interaction.reply({ content: 'That user is not a member of this server.', ephemeral: true });
    }

    const blocker = canModerate(interaction, target);
    if (blocker) {
      return interaction.reply({ content: blocker, ephemeral: true });
    }

    addWarning(interaction.guild.id, target.id, interaction.user.id, reason);
    const total = listWarnings(interaction.guild.id, target.id).length;

    await interaction.reply(`**${target.user.tag}** has been warned. Reason: ${reason} (total warnings: ${total})`);
  },
};
