const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { canModerate } = require('../../utils/moderation');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nickname')
    .setDescription("Change a member's nickname")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption((opt) => opt.setName('user').setDescription('The member to rename').setRequired(true))
    .addStringOption((opt) =>
      opt.setName('nickname').setDescription('New nickname (omit to reset)').setMaxLength(32),
    ),
  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const nickname = interaction.options.getString('nickname');

    if (!target) {
      return interaction.reply({ content: 'That user is not a member of this server.', ephemeral: true });
    }

    const blocker = canModerate(interaction, target);
    if (blocker) {
      return interaction.reply({ content: blocker, ephemeral: true });
    }
    if (!target.manageable) {
      return interaction.reply({ content: "I do not have permission to change that member's nickname.", ephemeral: true });
    }

    await target.setNickname(nickname);
    await interaction.reply(
      nickname ? `**${target.user.tag}**'s nickname was changed to **${nickname}**.` : `**${target.user.tag}**'s nickname was reset.`,
    );
  },
};
