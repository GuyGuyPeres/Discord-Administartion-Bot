const { Events, EmbedBuilder } = require('discord.js');
const { getAntiraidConfig } = require('../database/antiraid');
const { sendModLog } = require('../utils/modLog');

const RAID_MODE_DURATION_MS = 60_000;
const raidState = new Map(); // guildId -> { joinTimestamps: number[], raidActiveUntil: number }

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const config = getAntiraidConfig(member.guild.id);
    if (!config.enabled) return;

    const now = Date.now();
    const state = raidState.get(member.guild.id) ?? { joinTimestamps: [], raidActiveUntil: 0 };
    state.joinTimestamps = state.joinTimestamps.filter((t) => now - t < config.window_seconds * 1000);
    state.joinTimestamps.push(now);

    const wasRaidActive = now < state.raidActiveUntil;

    if (!wasRaidActive && state.joinTimestamps.length >= config.join_threshold) {
      state.raidActiveUntil = now + RAID_MODE_DURATION_MS;

      const embed = new EmbedBuilder()
        .setTitle('🚨 Possible Raid Detected')
        .setColor(0xc0392b)
        .setDescription(
          `**${state.joinTimestamps.length}** members joined within ${config.window_seconds}s. ` +
            `Raid mode is active for the next ${RAID_MODE_DURATION_MS / 1000}s — new accounts under ` +
            `${config.min_account_age_days} day(s) old will be auto-kicked.`,
        )
        .setTimestamp();
      sendModLog(member.guild, embed);
    }

    raidState.set(member.guild.id, state);

    if (now < state.raidActiveUntil) {
      const accountAgeDays = (now - member.user.createdTimestamp) / (1000 * 60 * 60 * 24);
      if (accountAgeDays < config.min_account_age_days && member.kickable) {
        await member.kick('Anti-raid: new account joined during a suspected raid').catch(() => {});

        const embed = new EmbedBuilder()
          .setTitle('Anti-Raid: Member Auto-Kicked')
          .setColor(0xc0392b)
          .addFields(
            { name: 'User', value: `${member.user.tag}` },
            { name: 'Account Age', value: `${accountAgeDays.toFixed(1)} day(s)` },
          )
          .setTimestamp();
        sendModLog(member.guild, embed);
      }
    }
  },
};
