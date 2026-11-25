// Crisp pixel-art Player ID Card PNG generator for Hannalle Dewyrose

export function downloadHannaIdCardPng(): void {
  const width = 1120;
  const height = 720;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.imageSmoothingEnabled = false;

  // Background checkerboard & dark border
  ctx.fillStyle = '#FBCFE8';
  ctx.fillRect(0, 0, width, height);

  for (let y = 0; y < height; y += 24) {
    for (let x = 0; x < width; x += 24) {
      if ((x / 24 + y / 24) % 2 === 0) {
        ctx.fillStyle = '#F5A6C8';
        ctx.fillRect(x, y, 24, 24);
      }
    }
  }

  // Outer Pixel Window Shadow & Frame
  ctx.fillStyle = '#211A2B';
  ctx.fillRect(46, 46, 1038, 638);

  // Main Pink Card Window Body
  ctx.fillStyle = '#F5A6C8';
  ctx.fillRect(38, 38, 1034, 634);
  ctx.strokeStyle = '#211A2B';
  ctx.lineWidth = 8;
  ctx.strokeRect(38, 38, 1034, 634);

  // Retro Computer Titlebar
  ctx.fillStyle = '#C24280';
  ctx.fillRect(42, 42, 1026, 60);
  ctx.fillStyle = '#FF9B38';
  ctx.fillRect(988, 56, 28, 28);
  ctx.fillStyle = '#8CE5E8';
  ctx.fillRect(946, 56, 28, 28);

  ctx.fillStyle = '#FFF0D5';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('PLAYER IDENTIFICATION CARD · HANNA-001', 66, 80);

  // Inner Cream Computer Content Box
  ctx.fillStyle = '#FFF0D5';
  ctx.fillRect(68, 128, 974, 514);
  ctx.lineWidth = 6;
  ctx.strokeRect(68, 128, 974, 514);

  // Portrait Frame (Left)
  ctx.fillStyle = '#8C265A';
  ctx.fillRect(98, 160, 270, 300);
  ctx.strokeRect(98, 160, 270, 300);

  // Draw Pixel Explorer Hanna inside Portrait
  const px = (x: number, y: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(142 + x * 10, 194 + y * 10, w * 10, h * 10);
  };
  // Hat
  px(5, 1, 8, 2, '#FF9B38');
  px(3, 3, 12, 2, '#FFB78C');
  px(8, 2, 2, 1, '#8CE5E8');
  // Hair & Face
  px(4, 5, 10, 2, '#5A334E');
  px(3, 6, 2, 6, '#5A334E');
  px(13, 6, 2, 6, '#5A334E');
  px(5, 7, 8, 5, '#FFF0D5');
  px(6, 8, 2, 2, '#211A2B');
  px(10, 8, 2, 2, '#211A2B');
  px(6, 8, 1, 1, '#8CE5E8');
  px(10, 8, 1, 1, '#8CE5E8');
  px(5, 10, 2, 1, '#F5A6C8');
  px(11, 10, 2, 1, '#F5A6C8');
  // Scarf & Jacket
  px(5, 12, 8, 2, '#FF9B38');
  px(5, 14, 8, 5, '#F5A6C8');
  px(7, 14, 1, 5, '#C24280');
  px(10, 15, 2, 2, '#8CE5E8');

  // Rarity Badge under Portrait
  ctx.fillStyle = '#FF9B38';
  ctx.fillRect(98, 480, 270, 52);
  ctx.strokeRect(98, 480, 270, 52);
  ctx.fillStyle = '#211A2B';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('RARITY: LEGENDARY ★', 120, 513);

  // Info Fields (Right)
  const fields = [
    ['NAME', 'HANNALLE DEWYROSE'],
    ['CLASS', 'SPECIAL ADVENTURER'],
    ['RANK', 'ONE OF A KIND'],
    ['STATUS', 'LEGENDARY FRIEND'],
    ['ROLE', 'MAIN CHARACTER'],
    ['SPECIAL ABILITY', 'MAKING THE WORLD MORE FUN'],
    ['CARD NUMBER', 'HANNA-001'],
  ];

  fields.forEach(([label, val], idx) => {
    const yPos = 175 + idx * 48;
    ctx.fillStyle = '#C24280';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`${label}:`, 404, yPos);
    ctx.fillStyle = '#211A2B';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(val, 404, yPos + 22);
  });

  // Bottom Quote Strip
  ctx.fillStyle = '#FFB78C';
  ctx.fillRect(98, 554, 914, 62);
  ctx.strokeRect(98, 554, 914, 62);
  ctx.fillStyle = '#211A2B';
  ctx.font = 'bold 17px monospace';
  ctx.fillText(
    '"Every great adventure needs someone who makes the journey memorable."',
    120,
    592
  );

  const link = document.createElement('a');
  link.download = 'HANNA-001-ID-CARD.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
