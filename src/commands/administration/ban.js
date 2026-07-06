const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { canModerate } = require('../../utils/moderation');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((opt) => opt.setName('user').setDescription('The member to ban').setRequired(true))
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason for the ban'))
    .addIntegerOption((opt) =>
      opt
        .setName('delete_message_days')
        .setDescription('Days of messages to delete (0-7)')
        .setMinValue(0)
        .setMaxValue(7),
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    const deleteMessageDays = interaction.options.getInteger('delete_message_days') ?? 0;

    const targetMember = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (targetMember) {
      const blocker = canModerate(interaction, targetMember);
      if (blocker) {
        return interaction.reply({ content: blocker, ephemeral: true });
      }
      if (!targetMember.bannable) {
        return interaction.reply({ content: 'I do not have permission to ban that member.', ephemeral: true });
      }
    } else if (user.id === interaction.user.id) {
      return interaction.reply({ content: 'You cannot moderate yourself.', ephemeral: true });
    }

    await interaction.guild.members.ban(user.id, {
      reason,
      deleteMessageSeconds: deleteMessageDays * 24 * 60 * 60,
    });
    await interaction.reply(`**${user.tag}** was banned. Reason: ${reason}`);
  },
};
