const { createCanvas, loadImage } = require('@napi-rs/canvas');

const WIDTH = 800;
const HEIGHT = 250;
const AVATAR_SIZE = 160;

async function buildWelcomeCard(member) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, '#1f2937');
  gradient.addColorStop(1, '#4338ca');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const avatarResponse = await fetch(member.user.displayAvatarURL({ extension: 'png', size: 256 }));
  const avatarBuffer = Buffer.from(await avatarResponse.arrayBuffer());
  const avatarImage = await loadImage(avatarBuffer);

  const avatarX = 45;
  const avatarY = (HEIGHT - AVATAR_SIZE) / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(avatarX + AVATAR_SIZE / 2, avatarY + AVATAR_SIZE / 2, AVATAR_SIZE / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatarImage, avatarX, avatarY, AVATAR_SIZE, AVATAR_SIZE);
  ctx.restore();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px sans-serif';
  ctx.fillText('Welcome!', avatarX + AVATAR_SIZE + 40, 110);

  ctx.font = '28px sans-serif';
  ctx.fillStyle = '#e5e7eb';
  ctx.fillText(member.user.tag, avatarX + AVATAR_SIZE + 40, 155);

  ctx.font = '20px sans-serif';
  ctx.fillStyle = '#c7d2fe';
  ctx.fillText(`Member #${member.guild.memberCount}`, avatarX + AVATAR_SIZE + 40, 190);

  return canvas.toBuffer('image/png');
}

module.exports = { buildWelcomeCard };
