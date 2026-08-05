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

// Curated lifestyle product art kept outside the abstract generator:
// public/images/products/cedar-cove-throw.jpg
// public/images/products/clearpath-desk-tray.jpg
const products = {
  'harbour-linen-cushion': frame(
    `<rect x="300" y="300" width="600" height="600" rx="48" fill="${colours.harbour}"/>
     <rect x="340" y="340" width="520" height="520" rx="36" fill="none" stroke="${colours.sand}" stroke-width="10" opacity="0.45"/>`,
    'Harbour Linen Cushion',
  ),
  'softwood-serving-tray': frame(
    `<rect x="240" y="390" width="720" height="420" rx="40" fill="${colours.sand}"/>
     <rect x="280" y="430" width="640" height="340" rx="28" fill="${colours.porcelain}"/>
     <rect x="300" y="450" width="600" height="20" rx="10" fill="${colours.clay}" opacity="0.35"/>`,
    'Softwood Serving Tray',
  ),
  'riverstone-ceramic-vase': frame(
    `<path d="M520 260 C620 260,680 340,680 430 C680 560,640 720,600 820 L600 880 L500 880 L500 820 C460 720,420 560,420 430 C420 340,480 260,520 260 Z" fill="${colours.sage}"/>
     <ellipse cx="550" cy="270" rx="55" ry="22" fill="${colours.porcelain}" opacity="0.7"/>
     <path d="M560 220 C575 180,590 150,595 120" stroke="${colours.pine}" stroke-width="10" fill="none" stroke-linecap="round"/>`,
    'Riverstone Ceramic Vase',
  ),
  'daybreak-mug-set': frame(
    `<g transform="translate(250 360)">
       <path d="M40 40 h180 a30 30 0 0 1 30 30 v220 a40 40 0 0 1 -40 40 h-160 a40 40 0 0 1 -40 -40 v-220 a30 30 0 0 1 30 -30 z" fill="${colours.porcelain}" stroke="${colours.harbour}" stroke-width="12"/>
       <path d="M250 120 h50 a50 50 0 0 1 0 140 h-50" fill="none" stroke="${colours.harbour}" stroke-width="16" stroke-linecap="round"/>
     </g>
     <g transform="translate(620 360)">
       <path d="M40 40 h180 a30 30 0 0 1 30 30 v220 a40 40 0 0 1 -40 40 h-160 a40 40 0 0 1 -40 -40 v-220 a30 30 0 0 1 30 -30 z" fill="${colours.harbour}"/>
       <path d="M250 120 h50 a50 50 0 0 1 0 140 h-50" fill="none" stroke="${colours.pineDark}" stroke-width="16" stroke-linecap="round"/>
     </g>`,
    'Daybreak Mug Set',
  ),
  'grove-serving-board': frame(
    `<ellipse cx="600" cy="600" rx="360" ry="180" fill="${colours.sand}"/>
     <ellipse cx="600" cy="600" rx="300" ry="140" fill="${colours.linen}"/>
     <circle cx="860" cy="600" r="28" fill="${colours.clay}" opacity="0.5"/>`,
    'Grove Serving Board',
  ),
  'tide-linen-napkins': frame(
    `<rect x="330" y="280" width="420" height="520" rx="18" fill="${colours.sand}" transform="rotate(-8 540 540)"/>
     <rect x="370" y="300" width="420" height="520" rx="18" fill="${colours.harbour}" opacity="0.9" transform="rotate(4 580 560)"/>
     <rect x="410" y="330" width="400" height="500" rx="18" fill="${colours.linen}"/>`,
    'Tide Linen Napkins',
  ),
  'canal-table-runner': frame(
    `<rect x="220" y="470" width="760" height="180" rx="20" fill="${colours.harbour}"/>
     <rect x="250" y="500" width="700" height="20" rx="10" fill="${colours.sand}" opacity="0.35"/>
     <rect x="250" y="600" width="700" height="12" rx="6" fill="${colours.porcelain}" opacity="0.35"/>`,
    'Canal Table Runner',
  ),
  'nest-woven-basket': frame(
    `<ellipse cx="600" cy="820" rx="250" ry="60" fill="${colours.sand}"/>
     <path d="M350 420 h500 l40 400 h-580 z" fill="${colours.sand}"/>
     <path d="M370 450 h460" stroke="${colours.clay}" stroke-width="10" opacity="0.4"/>
     <path d="M380 520 h440" stroke="${colours.clay}" stroke-width="10" opacity="0.35"/>
     <path d="M390 590 h420" stroke="${colours.clay}" stroke-width="10" opacity="0.3"/>
     <ellipse cx="600" cy="420" rx="250" ry="55" fill="${colours.linen}" stroke="${colours.charcoal}" stroke-width="8"/>`,
    'Nest Woven Basket',
  ),
  'ridge-wall-hooks': frame(
    `<rect x="280" y="360" width="640" height="360" rx="28" fill="${colours.pine}"/>
     <circle cx="420" cy="540" r="34" fill="${colours.charcoal}"/>
     <circle cx="600" cy="540" r="34" fill="${colours.charcoal}"/>
     <circle cx="780" cy="540" r="34" fill="${colours.charcoal}"/>
     <path d="M420 574 v70 M600 574 v70 M780 574 v70" stroke="${colours.charcoal}" stroke-width="16" stroke-linecap="round"/>`,
    'Ridge Wall Hooks',
  ),
  'windowledge-planter': frame(
    `<rect x="430" y="520" width="340" height="280" rx="40" fill="${colours.sage}"/>
     <ellipse cx="600" cy="520" rx="170" ry="40" fill="${colours.porcelain}" opacity="0.7"/>
     <path d="M600 480 C560 400,520 340,540 280 C580 300,620 300,660 280 C680 340,640 400,600 480 Z" fill="${colours.pine}"/>
     <ellipse cx="600" cy="820" rx="150" ry="28" fill="${colours.sand}"/>`,
    'Windowledge Planter',
  ),
  'folio-document-stand': frame(
    `<path d="M320 780 L780 780 L860 420 L520 300 Z" fill="${colours.charcoal}"/>
     <path d="M360 740 L740 740 L800 450 L540 350 Z" fill="${colours.linen}"/>
     <rect x="420" y="430" width="220" height="14" rx="7" fill="${colours.harbour}" opacity="0.5"/>
     <rect x="420" y="470" width="180" height="14" rx="7" fill="${colours.harbour}" opacity="0.35"/>`,
    'Folio Document Stand',
  ),
  'ember-candle-dish': frame(
    `<ellipse cx="600" cy="700" rx="260" ry="70" fill="${colours.clay}"/>
     <ellipse cx="600" cy="670" rx="220" ry="50" fill="${colours.porcelain}"/>
     <rect x="560" y="420" width="80" height="250" rx="20" fill="${colours.sand}"/>
     <path d="M600 420 C620 360,610 300,600 260 C590 300,580 360,600 420 Z" fill="${colours.harbour}" opacity="0.45"/>`,
    'Ember Candle Dish',
  ),
  'northline-key-bowl': frame(
    `<ellipse cx="600" cy="680" rx="260" ry="90" fill="${colours.harbour}"/>
     <ellipse cx="600" cy="640" rx="210" ry="60" fill="${colours.pineDark}" opacity="0.35"/>
     <circle cx="540" cy="630" r="16" fill="${colours.sand}"/>
     <circle cx="590" cy="650" r="12" fill="${colours.clay}"/>
     <rect x="630" y="620" width="70" height="16" rx="8" fill="${colours.sand}" transform="rotate(18 665 628)"/>`,
    'Northline Key Bowl',
  ),
  'shelter-storage-bin': frame(
    `<path d="M340 380 h520 l40 420 h-600 z" fill="${colours.linen}" stroke="${colours.sand}" stroke-width="12"/>
     <path d="M360 380 C360 320,840 320,840 380" fill="none" stroke="${colours.sage}" stroke-width="18" stroke-linecap="round"/>
     <rect x="390" y="470" width="120" height="24" rx="12" fill="${colours.harbour}" opacity="0.35"/>`,
    'Shelter Storage Bin',
  ),
  'pinegrove-placemat-set': frame(
    `<rect x="280" y="300" width="520" height="360" rx="24" fill="${colours.pine}" transform="rotate(-6 540 480)"/>
     <rect x="340" y="360" width="520" height="360" rx="24" fill="${colours.sand}" transform="rotate(5 600 540)"/>
     <rect x="390" y="430" width="480" height="320" rx="24" fill="${colours.pineDark}" opacity="0.85"/>`,
    'Pinegrove Placemat Set',
  ),
  'stillwater-throw-pillow': frame(
    `<rect x="220" y="430" width="760" height="300" rx="120" fill="${colours.linen}"/>
     <rect x="260" y="470" width="680" height="220" rx="100" fill="none" stroke="${colours.harbour}" stroke-width="10" opacity="0.35"/>`,
    'Stillwater Throw Pillow',
  ),
  'ledger-pencil-cup': frame(
    `<rect x="470" y="360" width="260" height="420" rx="40" fill="${colours.charcoal}"/>
     <rect x="510" y="280" width="18" height="180" rx="9" fill="${colours.clay}"/>
     <rect x="555" y="250" width="18" height="210" rx="9" fill="${colours.harbour}"/>
     <rect x="600" y="300" width="18" height="160" rx="9" fill="${colours.sage}"/>
     <rect x="645" y="270" width="18" height="190" rx="9" fill="${colours.sand}"/>`,
    'Ledger Pencil Cup',
  ),
  'drift-decorative-object': frame(
    `<path d="M360 680 C420 520,520 420,620 400 C760 370,860 470,820 600 C790 700,640 760,520 740 C430 726,330 760,360 680 Z" fill="${colours.porcelain}" stroke="${colours.sage}" stroke-width="12"/>`,
    'Drift Decorative Object',
  ),
  'hearth-coaster-set': frame(
    `<circle cx="470" cy="520" r="140" fill="${colours.sand}"/>
     <circle cx="650" cy="540" r="140" fill="${colours.pine}"/>
     <circle cx="540" cy="700" r="140" fill="${colours.harbour}" opacity="0.85"/>
     <circle cx="700" cy="700" r="120" fill="${colours.linen}" stroke="${colours.clay}" stroke-width="10"/>`,
    'Hearth Coaster Set',
  ),
  'meadow-tea-towel': frame(
    `<rect x="420" y="240" width="360" height="700" rx="24" fill="${colours.sage}"/>
     <rect x="460" y="280" width="280" height="40" rx="12" fill="${colours.porcelain}" opacity="0.35"/>
     <circle cx="600" cy="250" r="18" fill="${colours.pine}"/>`,
    'Meadow Tea Towel',
  ),
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
  <text x="200" y="180" font-family="Georgia, serif" font-size="64" fill="${colours.pineDark}" opacity="0.55">Harbour &amp; Pine</text>
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
