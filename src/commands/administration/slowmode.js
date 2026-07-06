const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set slowmode for this channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addIntegerOption((opt) =>
      opt
        .setName('seconds')
        .setDescription('Slowmode delay in seconds (0 to disable, max 21600)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600),
    ),
  async execute(interaction) {
    const seconds = interaction.options.getInteger('seconds', true);

    if (interaction.channel.type !== ChannelType.GuildText) {
      return interaction.reply({ content: 'Slowmode can only be set in text channels.', ephemeral: true });
    }

    await interaction.channel.setRateLimitPerUser(seconds);
    await interaction.reply(
      seconds === 0 ? 'Slowmode disabled for this channel.' : `Slowmode set to **${seconds}s** for this channel.`,
    );
  },
};
