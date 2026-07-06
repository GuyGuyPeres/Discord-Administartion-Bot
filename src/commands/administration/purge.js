const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Bulk delete recent messages in this channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((opt) =>
      opt
        .setName('count')
        .setDescription('Number of messages to delete (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100),
    )
    .addUserOption((opt) => opt.setName('user').setDescription('Only delete messages from this user')),
  async execute(interaction) {
    const count = interaction.options.getInteger('count', true);
    const user = interaction.options.getUser('user');

    await interaction.deferReply({ ephemeral: true });

    const messages = await interaction.channel.messages.fetch({ limit: 100 });
    const filtered = (user ? messages.filter((m) => m.author.id === user.id) : messages).first(count);

    const deleted = await interaction.channel.bulkDelete(filtered, true);
    await interaction.editReply(`Deleted **${deleted.size}** message(s).`);
  },
};
