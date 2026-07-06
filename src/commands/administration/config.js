const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { setModLogChannel, setWelcomeChannel, setWelcomeMessage } = require('../../database/guildSettings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configure server logging and welcome messages')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommandGroup((group) =>
      group
        .setName('logs')
        .setDescription('Server logging settings')
        .addSubcommand((sub) =>
          sub
            .setName('channel')
            .setDescription('Set the channel where server logs are posted')
            .addChannelOption((opt) =>
              opt
                .setName('channel')
                .setDescription('The log channel')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true),
            ),
        ),
    )
    .addSubcommandGroup((group) =>
      group
        .setName('welcome')
        .setDescription('Welcome message settings')
        .addSubcommand((sub) =>
          sub
            .setName('channel')
            .setDescription('Set the channel where welcome messages are posted')
            .addChannelOption((opt) =>
              opt
                .setName('channel')
                .setDescription('The welcome channel')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true),
            ),
        )
        .addSubcommand((sub) =>
          sub
            .setName('message')
            .setDescription('Set the welcome message text ({user} and {server} are replaced)')
            .addStringOption((opt) =>
              opt.setName('text').setDescription('e.g. Welcome to {server}, {user}!').setRequired(true),
            ),
        ),
    ),
  async execute(interaction) {
    const group = interaction.options.getSubcommandGroup();
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    if (group === 'logs' && sub === 'channel') {
      const channel = interaction.options.getChannel('channel', true);
      setModLogChannel(guildId, channel.id);
      return interaction.reply(`Server logs will now be posted in ${channel}.`);
    }

    if (group === 'welcome' && sub === 'channel') {
      const channel = interaction.options.getChannel('channel', true);
      setWelcomeChannel(guildId, channel.id);
      return interaction.reply(`Welcome messages will now be posted in ${channel}.`);
    }

    if (group === 'welcome' && sub === 'message') {
      const text = interaction.options.getString('text', true);
      setWelcomeMessage(guildId, text);
      return interaction.reply(`Welcome message updated to:\n> ${text}`);
    }
  },
};
