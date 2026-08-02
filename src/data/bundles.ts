import type { Bundle } from './types';

export const bundles: Bundle[] = [
  {
    id: 'bundle-workspace',
    slug: 'calm-workspace-set',
    name: 'Calm Workspace Set',
    description:
      'A focused desk pairing: organizer tray, planter and pencil cup for clearer daily work.',
    productIds: ['hp-011', 'hp-012', 'hp-019'],
    illustrativeNote:
      'Bundle savings shown in a live store would be calculated from verified pricing. This demonstration lists complementary products only.',
  },
  {
    id: 'bundle-table',
    slug: 'everyday-table-set',
    name: 'Everyday Table Set',
    description:
      'A weekday table foundation with serving board, napkins and placemats that work together visually.',
    productIds: ['hp-006', 'hp-007', 'hp-017'],
    illustrativeNote:
      'No invented discount is applied. Compatible products are grouped to demonstrate bundling UX.',
  },
  {
    id: 'bundle-living',
    slug: 'soft-living-room-set',
    name: 'Soft Living Room Set',
    description:
      'Soft layers for a settled seating area—throw, lumbar pillow and serving tray.',
    productIds: ['hp-001', 'hp-018', 'hp-003'],
    illustrativeNote:
      'Illustrative compatibility set for demonstration. Real merchant bundles require approved pricing rules.',
  },
];
