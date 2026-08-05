import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const colours = {
  pine: '#173B32',
  pineDark: '#102820',
  harbour: '#285B68',
  sand: '#E8DDCC',
  linen: '#F7F3EC',
  porcelain: '#FFFEFB',
  clay: '#B96F52',
  charcoal: '#242824',
  sage: '#9EAF9D',
};

function frame(inner, label) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${colours.linen}"/>
      <stop offset="55%" stop-color="${colours.sand}"/>
      <stop offset="100%" stop-color="${colours.porcelain}"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="${colours.pineDark}" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect width="1200" height="1200" fill="url(#bg)"/>
  <circle cx="980" cy="180" r="160" fill="${colours.sage}" opacity="0.22"/>
  <circle cx="180" cy="980" r="200" fill="${colours.harbour}" opacity="0.12"/>
  <g filter="url(#soft)">
    ${inner}
  </g>
</svg>`;
}

// All catalogue product photos are curated JPGs under public/images/products/*.jpg
// and are intentionally excluded from this abstract generator.
const products = {
  placeholder: frame(
    `<rect x="360" y="360" width="480" height="480" rx="40" fill="${colours.sand}"/>
     <text x="600" y="620" text-anchor="middle" font-family="Georgia, serif" font-size="48" fill="${colours.pine}">H&amp;P</text>`,
    'Product placeholder',
  ),
};

const collections = {
  living: frame(
    `<rect x="260" y="420" width="420" height="260" rx="30" fill="${colours.pine}"/>
     <rect x="560" y="320" width="280" height="280" rx="40" fill="${colours.harbour}"/>
     <ellipse cx="420" cy="760" rx="220" ry="50" fill="${colours.sand}"/>`,
    'Living collection',
  ),
  'kitchen-dining': frame(
    `<ellipse cx="480" cy="620" rx="220" ry="90" fill="${colours.sand}"/>
     <rect x="640" y="420" width="220" height="280" rx="40" fill="${colours.harbour}"/>
     <rect x="300" y="420" width="200" height="40" rx="12" fill="${colours.linen}"/>`,
    'Kitchen and dining collection',
  ),
  textiles: frame(
    `<rect x="300" y="300" width="280" height="520" rx="24" fill="${colours.sand}"/>
     <rect x="520" y="340" width="280" height="520" rx="24" fill="${colours.sage}"/>
     <rect x="420" y="380" width="280" height="520" rx="24" fill="${colours.pine}" opacity="0.9"/>`,
    'Textiles collection',
  ),
  storage: frame(
    `<path d="M340 400 h400 l40 360 h-480 z" fill="${colours.sand}"/>
     <circle cx="780" cy="520" r="40" fill="${colours.charcoal}"/>
     <circle cx="780" cy="640" r="40" fill="${colours.charcoal}"/>`,
    'Storage collection',
  ),
  workspace: frame(
    `<rect x="280" y="480" width="640" height="220" rx="28" fill="${colours.pine}"/>
     <rect x="720" y="360" width="160" height="160" rx="28" fill="${colours.sage}"/>
     <rect x="340" y="520" width="200" height="20" rx="10" fill="${colours.sand}"/>`,
    'Workspace collection',
  ),
  gifts: frame(
    `<rect x="360" y="360" width="480" height="480" rx="36" fill="${colours.clay}"/>
     <rect x="420" y="420" width="360" height="360" rx="24" fill="${colours.porcelain}"/>
     <path d="M600 420 v360 M420 600 h360" stroke="${colours.harbour}" stroke-width="18"/>`,
    'Gifts collection',
  ),
};

const rooms = {
  'living-room': frame(
    `<rect x="220" y="560" width="760" height="180" rx="30" fill="${colours.pine}"/>
     <rect x="300" y="360" width="240" height="200" rx="24" fill="${colours.harbour}"/>
     <rect x="620" y="400" width="220" height="160" rx="24" fill="${colours.sand}"/>`,
    'Living room path',
  ),
  'dining-area': frame(
    `<ellipse cx="600" cy="620" rx="340" ry="120" fill="${colours.sand}"/>
     <rect x="360" y="420" width="480" height="40" rx="12" fill="${colours.harbour}"/>
     <circle cx="600" cy="560" r="40" fill="${colours.clay}"/>`,
    'Dining area path',
  ),
  kitchen: frame(
    `<rect x="260" y="420" width="680" height="280" rx="28" fill="${colours.linen}" stroke="${colours.sage}" stroke-width="12"/>
     <rect x="320" y="480" width="160" height="120" rx="20" fill="${colours.harbour}"/>
     <rect x="520" y="500" width="120" height="20" rx="10" fill="${colours.pine}"/>`,
    'Kitchen path',
  ),
  workspace: frame(
    `<rect x="250" y="500" width="700" height="200" rx="24" fill="${colours.charcoal}"/>
     <rect x="300" y="360" width="220" height="140" rx="20" fill="${colours.sage}"/>
     <rect x="700" y="400" width="180" height="100" rx="20" fill="${colours.sand}"/>`,
    'Workspace path',
  ),
};

const hero = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200" role="img" aria-label="Editorial still life of home accessories on a warm linen surface">
  <defs>
    <linearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${colours.linen}"/>
      <stop offset="50%" stop-color="${colours.sand}"/>
      <stop offset="100%" stop-color="#efe4d4"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1200" fill="url(#heroBg)"/>
  <circle cx="1280" cy="220" r="220" fill="${colours.sage}" opacity="0.25"/>
  <circle cx="220" cy="980" r="260" fill="${colours.harbour}" opacity="0.12"/>
  <rect x="180" y="640" width="720" height="220" rx="36" fill="${colours.pine}"/>
  <rect x="820" y="360" width="420" height="420" rx="48" fill="${colours.harbour}"/>
  <ellipse cx="520" cy="520" rx="180" ry="70" fill="${colours.sand}"/>
  <path d="M1080 420 C1120 360,1180 320,1200 280 C1220 320,1260 360,1280 430" stroke="${colours.porcelain}" stroke-width="14" fill="none" stroke-linecap="round"/>
  <rect x="260" y="700" width="240" height="28" rx="14" fill="${colours.sand}" opacity="0.45"/>
  <text x="200" y="180" font-family="Georgia, serif" font-size="56" fill="${colours.pineDark}" opacity="0.55">Harbour &amp; Pine Home</text>
</svg>`;

const og = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${colours.pineDark}"/>
  <circle cx="980" cy="120" r="160" fill="${colours.harbour}" opacity="0.35"/>
  <circle cx="160" cy="540" r="180" fill="${colours.sage}" opacity="0.25"/>
  <text x="80" y="250" font-family="Georgia, serif" font-size="72" fill="${colours.porcelain}">Harbour &amp; Pine Home</text>
  <text x="80" y="330" font-family="Arial, sans-serif" font-size="34" fill="${colours.sand}">Thoughtful pieces for everyday living.</text>
  <text x="80" y="520" font-family="Arial, sans-serif" font-size="24" fill="${colours.sage}">Portfolio concept by Che Xu Studio</text>
</svg>`;

const favicon = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${colours.pineDark}"/>
  <text x="32" y="42" text-anchor="middle" font-family="Georgia, serif" font-size="22" font-weight="700" fill="${colours.sand}">H&amp;P</text>
</svg>`;

async function writeAll() {
  const root = path.resolve('public');
  await mkdir(path.join(root, 'images/products'), { recursive: true });
  await mkdir(path.join(root, 'images/collections'), { recursive: true });
  await mkdir(path.join(root, 'images/rooms'), { recursive: true });
  await mkdir(path.join(root, 'images/brand'), { recursive: true });

  for (const [name, svg] of Object.entries(products)) {
    await writeFile(path.join(root, `images/products/${name}.svg`), svg);
  }
  for (const [name, svg] of Object.entries(collections)) {
    await writeFile(path.join(root, `images/collections/${name}.svg`), svg);
  }
  for (const [name, svg] of Object.entries(rooms)) {
    await writeFile(path.join(root, `images/rooms/${name}.svg`), svg);
  }
  await writeFile(path.join(root, 'images/brand/hero.svg'), hero);
  await writeFile(path.join(root, 'images/brand/og.svg'), og);
  await writeFile(path.join(root, 'favicon.svg'), favicon);
  console.log('Generated SVG assets');
}

writeAll();
