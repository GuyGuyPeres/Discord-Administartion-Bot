const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { canModerate } = require('../../utils/moderation');

const MAX_TIMEOUT_MS = 28 * 24 * 60 * 60 * 1000; // Discord's 28-day cap

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Temporarily mute a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((opt) => opt.setName('user').setDescription('The member to timeout').setRequired(true))
    .addIntegerOption((opt) =>
      opt.setName('minutes').setDescription('Duration in minutes').setRequired(true).setMinValue(1),
    )
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason for the timeout')),
  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const minutes = interaction.options.getInteger('minutes', true);
    const reason = interaction.options.getString('reason') ?? 'No reason provided';

    if (!target) {
      return interaction.reply({ content: 'That user is not a member of this server.', ephemeral: true });
    }

    const blocker = canModerate(interaction, target);
    if (blocker) {
      return interaction.reply({ content: blocker, ephemeral: true });
    }
    if (!target.moderatable) {
      return interaction.reply({ content: 'I do not have permission to timeout that member.', ephemeral: true });
    }

    const durationMs = Math.min(minutes * 60 * 1000, MAX_TIMEOUT_MS);
    await target.timeout(durationMs, reason);
    await interaction.reply(`**${target.user.tag}** was timed out for ${minutes} minute(s). Reason: ${reason}`);
  },
};
