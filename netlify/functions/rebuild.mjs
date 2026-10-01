/*
  Scheduled rebuild.

  The site reads events from Google Calendar at build time, so it needs to
  rebuild for new events to appear. This runs every morning and triggers a
  build.

  Setup: create a build hook in Netlify (Site settings > Build & deploy >
  Build hooks) and save the URL as the BUILD_HOOK_URL environment variable.
*/

export default async () => {
  const hook = process.env.BUILD_HOOK_URL;

  if (!hook) {
    console.error('BUILD_HOOK_URL is not set. Skipping scheduled rebuild.');
    return new Response('Missing BUILD_HOOK_URL', { status: 500 });
  }

  const res = await fetch(hook, { method: 'POST' });
  console.log(`Rebuild triggered: ${res.status}`);
  return new Response('Rebuild triggered', { status: 200 });
};

export const config = {
  schedule: '0 11 * * *', // 11:00 UTC = 6am Central (5am during daylight saving)
};
