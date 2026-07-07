const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { listWarnings } = require('../../database/warnings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription("View a member's warning history")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((opt) => opt.setName('user').setDescription('The member to check').setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getUser('user', true);
    const warnings = listWarnings(interaction.guild.id, target.id);

    if (warnings.length === 0) {
      return interaction.reply({ content: `**${target.tag}** has no warnings.`, ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle(`Warnings for ${target.tag}`)
      .setColor(0xf1c40f)
      .setDescription(
        warnings
          .map((w, i) => `**${i + 1}.** ${w.reason} - <@${w.moderator_id}> <t:${w.created_at}:R>`)
          .join('\n'),
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
