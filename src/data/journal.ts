import type { JournalPost } from './types';

export const journalPosts: JournalPost[] = [
  {
    slug: 'how-to-style-a-calm-coffee-table',
    title: 'How to Style a Calm Coffee Table',
    excerpt:
      'A simple structure for trays, books and vessels that keeps living rooms usable every day.',
    publishedAt: '2026-05-12',
    readingMinutes: 4,
    body: [
      'A calm coffee table starts with one grounded tray. Give remotes, coasters and a mug a clear home so the rest of the surface can stay open.',
      'Add one vertical note—a low vase or sculptural object—then stop. Empty space is part of the composition, especially in smaller rooms.',
      'This journal is part of a fictional storefront demonstration by Che Xu Studio and uses illustrative styling guidance only.',
    ],
  },
  {
    slug: 'setting-an-everyday-table',
    title: 'Setting an Everyday Table',
    excerpt:
      'Napkins, boards and placemats can make weekday meals feel considered without becoming formal.',
    publishedAt: '2026-06-02',
    readingMinutes: 3,
    body: [
      'Begin with placemats that frame each setting, then layer a folded napkin and one shared board at the centre.',
      'Choose colours that already exist in your stoneware or wall tones so the table feels connected to the room.',
      'Harbour & Pine Home is a fictional portfolio concept. Use these notes as design inspiration, not merchant advice.',
    ],
  },
  {
    slug: 'building-a-quieter-desk',
    title: 'Building a Quieter Desk',
    excerpt:
      'Desk tools should reduce decision fatigue. Start with one tray and one living element near light.',
    publishedAt: '2026-06-24',
    readingMinutes: 3,
    body: [
      'Clear the desk first, then return only the tools used daily. A shallow tray keeps the remainder from spreading.',
      'A compact planter near natural light softens screens and shelving without crowding the work zone.',
      'This article supports the Harbour & Pine Home demonstration experience created by Che Xu Studio.',
    ],
  },
];

export function getJournalPost(slug: string): JournalPost | undefined {
  return journalPosts.find((post) => post.slug === slug);
}
