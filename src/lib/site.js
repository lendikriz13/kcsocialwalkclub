export const site = {
  name: 'KC Social Walk Club',
  shortName: 'KC Social Walk Club',
  url: 'https://kcsocialwalkclub.com',
  tagline: 'Walk. Connect. Explore.',
  description:
    'A Kansas City social community built around walks, runs, and events. Free, open to everyone, come alone or bring a friend.',
  city: 'Kansas City',
  region: 'MO',
  founded: '2025',
  founder: 'Lorenzo',
  logo: '/images/logo.jpg',
  mascot: '/images/mascot.png',
  mascotSmall: '/images/mascot-small.png',

  social: {
    instagram: 'https://instagram.com/kcsocialwalkclub',
    tiktok: 'https://tiktok.com/@kcsocialwalkclub',
    facebook: 'https://facebook.com/KCSOCIALWALKCLUB',
  },

  nav: [
    { label: 'What We Do', href: '/what-we-do' },
    { label: 'Events', href: '/events' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'About', href: '/about' },
  ],
};

/*
  Google Calendar event colors map to categories.
  Lorenzo picks the color in the Google Calendar app; the site reads it.
  Google's color IDs are fixed - the names below are what he sees in the app.
*/
export const CATEGORIES = {
  10: { key: 'green-walk', label: 'Green walk', swatch: '#2E6B41', group: 'walks' }, // Basil
  11: { key: 'red-walk', label: 'Red walk', swatch: '#8E3B2E', group: 'walks' }, // Tomato
  9: { key: 'run', label: 'Run', swatch: '#33506E', group: 'runs' }, // Blueberry
  6: { key: 'social', label: 'Social event', swatch: '#B07C2E', group: 'social' }, // Tangerine
};

export const DEFAULT_CATEGORY = {
  key: 'walk',
  label: 'Walk',
  swatch: '#1F4230',
  group: 'walks',
};

export function categoryFor(colorId) {
  return CATEGORIES[colorId] || DEFAULT_CATEGORY;
}
