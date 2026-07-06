const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { canModerate } = require('../../utils/moderation');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription("Remove a member's timeout")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((opt) => opt.setName('user').setDescription('The member to remove timeout from').setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getMember('user');

    if (!target) {
      return interaction.reply({ content: 'That user is not a member of this server.', ephemeral: true });
    }

    const blocker = canModerate(interaction, target);
    if (blocker) {
      return interaction.reply({ content: blocker, ephemeral: true });
    }
    if (!target.isCommunicationDisabled()) {
      return interaction.reply({ content: 'That member is not currently timed out.', ephemeral: true });
    }

    await target.timeout(null);
    await interaction.reply(`Removed timeout from **${target.user.tag}**.`);
  },
};
