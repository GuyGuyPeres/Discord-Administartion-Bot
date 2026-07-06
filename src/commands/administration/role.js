const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Add or remove a role from a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand((sub) =>
      sub
        .setName('add')
        .setDescription('Add a role to a member')
        .addUserOption((opt) => opt.setName('user').setDescription('The member').setRequired(true))
        .addRoleOption((opt) => opt.setName('role').setDescription('The role to add').setRequired(true)),
    )
    .addSubcommand((sub) =>
      sub
        .setName('remove')
        .setDescription('Remove a role from a member')
        .addUserOption((opt) => opt.setName('user').setDescription('The member').setRequired(true))
        .addRoleOption((opt) => opt.setName('role').setDescription('The role to remove').setRequired(true)),
    ),
  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const role = interaction.options.getRole('role', true);
    const subcommand = interaction.options.getSubcommand();

    if (!target) {
      return interaction.reply({ content: 'That user is not a member of this server.', ephemeral: true });
    }
    if (role.position >= interaction.member.roles.highest.position) {
      return interaction.reply({ content: 'You cannot manage a role equal to or higher than your own.', ephemeral: true });
    }
    if (role.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.reply({ content: 'I cannot manage a role equal to or higher than my own.', ephemeral: true });
    }
    if (role.managed) {
      return interaction.reply({ content: 'That role is managed by an integration and cannot be assigned manually.', ephemeral: true });
    }

    if (subcommand === 'add') {
      if (target.roles.cache.has(role.id)) {
        return interaction.reply({ content: `**${target.user.tag}** already has **${role.name}**.`, ephemeral: true });
      }
      await target.roles.add(role);
      await interaction.reply(`Added **${role.name}** to **${target.user.tag}**.`);
    } else {
      if (!target.roles.cache.has(role.id)) {
        return interaction.reply({ content: `**${target.user.tag}** does not have **${role.name}**.`, ephemeral: true });
      }
      await target.roles.remove(role);
      await interaction.reply(`Removed **${role.name}** from **${target.user.tag}**.`);
    }
  },
};
