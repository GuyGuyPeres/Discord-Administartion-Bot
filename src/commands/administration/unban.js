const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user by ID')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((opt) => opt.setName('user_id').setDescription('The user ID to unban').setRequired(true)),
  async execute(interaction) {
    const userId = interaction.options.getString('user_id', true);

    const bans = await interaction.guild.bans.fetch();
    if (!bans.has(userId)) {
      return interaction.reply({ content: 'That user is not banned.', ephemeral: true });
    }

    await interaction.guild.members.unban(userId);
    await interaction.reply(`Unbanned user with ID **${userId}**.`);
  },
};
