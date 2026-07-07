const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const {
  getAntiraidConfig,
  setAntiraidEnabled,
  setThreshold,
  setMinAccountAge,
} = require('../../database/antiraid');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('antiraid')
    .setDescription('Configure anti-raid protection')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) =>
      sub
        .setName('toggle')
        .setDescription('Enable or disable anti-raid protection')
        .addBooleanOption((opt) => opt.setName('enabled').setDescription('Enabled?').setRequired(true)),
    )
    .addSubcommand((sub) =>
      sub
        .setName('threshold')
        .setDescription('Set how many joins within a time window trigger raid mode')
        .addIntegerOption((opt) =>
          opt.setName('joins').setDescription('Number of joins').setRequired(true).setMinValue(2).setMaxValue(100),
        )
        .addIntegerOption((opt) =>
          opt
            .setName('window')
            .setDescription('Time window in seconds')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(300),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName('minaccountage')
        .setDescription('Accounts younger than this are auto-kicked during raid mode')
        .addIntegerOption((opt) =>
          opt.setName('days').setDescription('Account age in days').setRequired(true).setMinValue(0).setMaxValue(365),
        ),
    )
    .addSubcommand((sub) => sub.setName('status').setDescription('View current anti-raid settings')),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const sub = interaction.options.getSubcommand();

    if (sub === 'toggle') {
      const enabled = interaction.options.getBoolean('enabled', true);
      setAntiraidEnabled(guildId, enabled);
      return interaction.reply(`Anti-raid protection is now **${enabled ? 'enabled' : 'disabled'}**.`);
    }

    if (sub === 'threshold') {
      const joins = interaction.options.getInteger('joins', true);
      const window = interaction.options.getInteger('window', true);
      setThreshold(guildId, joins, window);
      return interaction.reply(`Raid mode will trigger at **${joins}** joins within **${window}s**.`);
    }

    if (sub === 'minaccountage') {
      const days = interaction.options.getInteger('days', true);
      setMinAccountAge(guildId, days);
      return interaction.reply(`Accounts younger than **${days}** day(s) will be auto-kicked during raid mode.`);
    }

    if (sub === 'status') {
      const config = getAntiraidConfig(guildId);
      const embed = new EmbedBuilder()
        .setTitle('Anti-Raid Settings')
        .setColor(0xc0392b)
        .addFields(
          { name: 'Enabled', value: config.enabled ? 'Yes' : 'No', inline: true },
          { name: 'Join Threshold', value: `${config.join_threshold} joins / ${config.window_seconds}s`, inline: true },
          { name: 'Min Account Age', value: `${config.min_account_age_days} day(s)`, inline: true },
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
