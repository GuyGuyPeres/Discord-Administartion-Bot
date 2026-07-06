const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { canModerate } = require('../../utils/moderation');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((opt) => opt.setName('user').setDescription('The member to kick').setRequired(true))
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason for the kick')),
  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';

    if (!target) {
      return interaction.reply({ content: 'That user is not a member of this server.', ephemeral: true });
    }

    const blocker = canModerate(interaction, target);
    if (blocker) {
      return interaction.reply({ content: blocker, ephemeral: true });
    }
    if (!target.kickable) {
      return interaction.reply({ content: 'I do not have permission to kick that member.', ephemeral: true });
    }

    await target.kick(reason);
    await interaction.reply(`**${target.user.tag}** was kicked. Reason: ${reason}`);
  },
};
