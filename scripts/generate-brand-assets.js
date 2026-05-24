const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'assets', 'images');

const colors = {
  background: [11, 16, 32],
  card: [18, 25, 51],
  primary: [110, 168, 254],
  secondary: [94, 234, 212],
  text: [244, 247, 255],
};

function insideRoundedRect(x, y, left, top, right, bottom, radius) {
  if (x >= left + radius && x <= right - radius && y >= top && y <= bottom) return true;
  if (x >= left && x <= right && y >= top + radius && y <= bottom - radius) return true;

  const corners = [
    [left + radius, top + radius],
    [right - radius, top + radius],
    [left + radius, bottom - radius],
    [right - radius, bottom - radius],
  ];

  return corners.some(([cx, cy]) => (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2);
}

function drawLetterL(pixels, size, color) {
  for (let y = 58; y < 198; y++) {
    for (let x = 72; x < 98; x++) {
      pixels[y * size + x] = color;
    }
  }

  for (let y = 172; y < 198; y++) {
    for (let x = 72; x < 150; x++) {
      pixels[y * size + x] = color;
    }
  }
}

function drawLetterG(pixels, size, color) {
  for (let y = 58; y < 198; y++) {
    for (let x = 158; x < 184; x++) {
      if (x < 170 || y < 84 || y > 172 || (y > 120 && x > 170)) {
        pixels[y * size + x] = color;
      }
    }
  }

  for (let y = 58; y < 84; y++) {
    for (let x = 158; x < 222; x++) {
      pixels[y * size + x] = color;
    }
  }

  for (let y = 172; y < 198; y++) {
    for (let x = 158; x < 222; x++) {
      pixels[y * size + x] = color;
    }
  }

  for (let y = 120; y < 146; y++) {
    for (let x = 196; x < 236; x++) {
      pixels[y * size + x] = color;
    }
  }

  for (let y = 120; y < 198; y++) {
    for (let x = 210; x < 236; x++) {
      pixels[y * size + x] = color;
    }
  }
}

function writePpm(filename, size) {
  const pixels = new Array(size * size).fill(colors.background);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = y * size + x;
      const dxPrimary = x - size * 0.78;
      const dyPrimary = y - size * 0.2;
      const dxSecondary = x - size * 0.18;
      const dySecondary = y - size * 0.84;

      if (dxPrimary * dxPrimary + dyPrimary * dyPrimary < size * size * 0.045) {
        pixels[index] = [33, 59, 128];
      }

      if (dxSecondary * dxSecondary + dySecondary * dySecondary < size * size * 0.03) {
        pixels[index] = [15, 118, 110];
      }
    }
  }

  const cardLeft = Math.floor(size * 0.14);
  const cardTop = Math.floor(size * 0.14);
  const cardRight = Math.floor(size * 0.86);
  const cardBottom = Math.floor(size * 0.86);
  const radius = Math.floor(size * 0.1);

  for (let y = cardTop; y < cardBottom; y++) {
    for (let x = cardLeft; x < cardRight; x++) {
      if (insideRoundedRect(x, y, cardLeft, cardTop, cardRight, cardBottom, radius)) {
        pixels[y * size + x] = colors.card;
      }
    }
  }

  const stripeTop = Math.floor(size * 0.18);
  const stripeBottom = Math.floor(size * 0.24);
  for (let y = stripeTop; y < stripeBottom; y++) {
    for (let x = cardLeft + 22; x < cardRight - 22; x++) {
      pixels[y * size + x] = colors.primary;
    }
  }

  drawLetterL(pixels, size, colors.text);
  drawLetterG(pixels, size, colors.secondary);

  let ppm = `P3\n${size} ${size}\n255\n`;
  for (let y = 0; y < size; y++) {
    let row = '';
    for (let x = 0; x < size; x++) {
      row += `${pixels[y * size + x].join(' ')} `;
    }
    ppm += `${row}\n`;
  }

  fs.writeFileSync(path.join(outputDir, filename), ppm, 'utf8');
}

fs.mkdirSync(outputDir, { recursive: true });
writePpm('learnwordgame-icon.ppm', 256);
writePpm('learnwordgame-splash.ppm', 512);
