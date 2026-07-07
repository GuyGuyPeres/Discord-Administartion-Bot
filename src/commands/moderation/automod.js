const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const {
  setAutomodEnabled,
  setBlockInvites,
  setMaxMentions,
  setCapsThreshold,
  addBannedWord,
  removeBannedWord,
  getAutomodConfig,
} = require('../../database/automod');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('Configure automatic message moderation')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) =>
      sub
        .setName('toggle')
        .setDescription('Enable or disable automod')
        .addBooleanOption((opt) => opt.setName('enabled').setDescription('Enabled?').setRequired(true)),
    )
    .addSubcommand((sub) =>
      sub
        .setName('invites')
        .setDescription('Block Discord invite links')
        .addBooleanOption((opt) => opt.setName('enabled').setDescription('Block invites?').setRequired(true)),
    )
    .addSubcommand((sub) =>
      sub
        .setName('mentions')
        .setDescription('Set the max mentions allowed per message (0 disables)')
        .addIntegerOption((opt) =>
          opt.setName('max').setDescription('Max mentions').setRequired(true).setMinValue(0).setMaxValue(50),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName('caps')
        .setDescription('Set the caps-lock percentage threshold (0 disables)')
        .addIntegerOption((opt) =>
          opt.setName('threshold').setDescription('Percentage (0-100)').setRequired(true).setMinValue(0).setMaxValue(100),
        ),
    )
    .addSubcommandGroup((group) =>
      group
        .setName('bannedwords')
        .setDescription('Manage the banned word list')
        .addSubcommand((sub) =>
          sub
            .setName('add')
            .setDescription('Add a banned word')
            .addStringOption((opt) => opt.setName('word').setDescription('The word to ban').setRequired(true)),
        )
        .addSubcommand((sub) =>
          sub
            .setName('remove')
            .setDescription('Remove a banned word')
            .addStringOption((opt) => opt.setName('word').setDescription('The word to unban').setRequired(true)),
        )
        .addSubcommand((sub) => sub.setName('list').setDescription('List banned words')),
    ),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const group = interaction.options.getSubcommandGroup();
    const sub = interaction.options.getSubcommand();

    if (group === 'bannedwords') {
      if (sub === 'add') {
        const word = interaction.options.getString('word', true);
        const added = addBannedWord(guildId, word);
        return interaction.reply({
          content: added ? `Added **${word}** to the banned word list.` : `**${word}** is already banned.`,
          ephemeral: true,
        });
      }
      if (sub === 'remove') {
        const word = interaction.options.getString('word', true);
        const removed = removeBannedWord(guildId, word);
        return interaction.reply({
          content: removed ? `Removed **${word}** from the banned word list.` : `**${word}** was not banned.`,
          ephemeral: true,
        });
      }
      if (sub === 'list') {
        const config = getAutomodConfig(guildId);
        const embed = new EmbedBuilder()
          .setTitle('Banned Words')
          .setColor(0xe67e22)
          .setDescription(config.banned_words.length > 0 ? config.banned_words.map((w) => `\`${w}\``).join(', ') : '*No banned words set.*');
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }
      return;
    }

    if (sub === 'toggle') {
      const enabled = interaction.options.getBoolean('enabled', true);
      setAutomodEnabled(guildId, enabled);
      return interaction.reply(`Automod is now **${enabled ? 'enabled' : 'disabled'}**.`);
    }

    if (sub === 'invites') {
      const enabled = interaction.options.getBoolean('enabled', true);
      setBlockInvites(guildId, enabled);
      return interaction.reply(`Invite link blocking is now **${enabled ? 'enabled' : 'disabled'}**.`);
    }

    if (sub === 'mentions') {
      const max = interaction.options.getInteger('max', true);
      setMaxMentions(guildId, max);
      return interaction.reply(
        max === 0 ? 'Mention spam filtering is now disabled.' : `Messages with more than **${max}** mentions will now be removed.`,
      );
    }

    if (sub === 'caps') {
      const threshold = interaction.options.getInteger('threshold', true);
      setCapsThreshold(guildId, threshold);
      return interaction.reply(
        threshold === 0 ? 'Caps filtering is now disabled.' : `Messages with **${threshold}%+** caps will now be removed.`,
      );
    }
  },
};
