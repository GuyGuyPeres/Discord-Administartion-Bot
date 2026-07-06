const { GuildMember } = require('discord.js');

function canModerate(interaction, target) {
  if (target.id === interaction.guild.ownerId) {
    return 'That member is the server owner and cannot be moderated.';
  }
  if (target.id === interaction.user.id) {
    return 'You cannot moderate yourself.';
  }
  if (target.id === interaction.client.user.id) {
    return 'I cannot moderate myself.';
  }
  if (target instanceof GuildMember) {
    if (target.roles.highest.position >= interaction.member.roles.highest.position) {
      return 'You cannot moderate someone with an equal or higher role than you.';
    }
    if (target.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
      return 'I cannot moderate someone with an equal or higher role than me.';
    }
  }
  return null;
}

module.exports = { canModerate };
