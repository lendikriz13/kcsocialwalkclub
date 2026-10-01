import { categoryFor } from './site.js';

const CAL_ID = import.meta.env.GOOGLE_CALENDAR_ID;
const API_KEY = import.meta.env.GOOGLE_CALENDAR_API_KEY;

const API = 'https://www.googleapis.com/calendar/v3/calendars';

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isoDay(dateString) {
  return dateString.slice(0, 10);
}

function normalize(raw) {
  const startRaw = raw.start?.dateTime || raw.start?.date;
  const endRaw = raw.end?.dateTime || raw.end?.date;
  if (!startRaw || !raw.summary) return null;

  const allDay = !raw.start?.dateTime;
  const category = categoryFor(raw.colorId);

  return {
    id: raw.id,
    title: raw.summary.trim(),
    slug: `${slugify(raw.summary)}-${isoDay(startRaw)}`,
    start: startRaw,
    end: endRaw,
    allDay,
    location: raw.location ? raw.location.trim() : '',
    description: raw.description ? raw.description.trim() : '',
    category,
    startDate: new Date(startRaw),
  };
}

async function fetchWindow(params) {
  if (!CAL_ID || !API_KEY) {
    console.warn(
      '[calendar] GOOGLE_CALENDAR_ID or GOOGLE_CALENDAR_API_KEY is missing. Building with no events.'
    );
    return [];
  }

  const query = new URLSearchParams({
    key: API_KEY,
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '250',
    ...params,
  });

  const url = `${API}/${encodeURIComponent(CAL_ID)}/events?${query}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[calendar] Google Calendar returned ${res.status}. Building with no events.`);
      return [];
    }
    const data = await res.json();
    return (data.items || []).map(normalize).filter(Boolean);
  } catch (err) {
    console.warn('[calendar] Could not reach Google Calendar. Building with no events.', err.message);
    return [];
  }
}

let cacheUpcoming = null;
let cachePast = null;

export async function getUpcomingEvents() {
  if (cacheUpcoming) return cacheUpcoming;
  const now = new Date().toISOString();
  cacheUpcoming = await fetchWindow({ timeMin: now });
  return cacheUpcoming;
}

export async function getPastEvents() {
  if (cachePast) return cachePast;
  const now = new Date().toISOString();
  const events = await fetchWindow({ timeMax: now });
  cachePast = events.reverse();
  return cachePast;
}

export async function getAllEvents() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);
  return [...upcoming, ...past];
}

export async function getEventsByGroup(group) {
  const upcoming = await getUpcomingEvents();
  return upcoming.filter((e) => e.category.group === group);
}

export async function getPastEventsByGroup(group) {
  const past = await getPastEvents();
  return past.filter((e) => e.category.group === group);
}

export function formatDate(date, opts = {}) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    ...opts,
  }).format(new Date(date));
}

export function dayNumber(date) {
  return formatDate(date, { day: 'numeric' });
}

export function monthShort(date) {
  return formatDate(date, { month: 'short' });
}

export function weekdayShort(date) {
  return formatDate(date, { weekday: 'short' });
}

export function fullDate(date) {
  return formatDate(date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export function timeLabel(event) {
  if (event.allDay) return 'All day';
  return formatDate(event.start, { hour: 'numeric', minute: '2-digit' });
}

// Builds the "Add to Google Calendar" link used in place of RSVPs.
export function addToCalendarUrl(event) {
  const stamp = (d, allDay) => {
    const date = new Date(d);
    if (allDay) return date.toISOString().slice(0, 10).replace(/-/g, '');
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const end = event.end || event.start;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${stamp(event.start, event.allDay)}/${stamp(end, event.allDay)}`,
    details: event.description || '',
    location: event.location || '',
  });

  return `https://calendar.google.com/calendar/render?${params}`;
}
