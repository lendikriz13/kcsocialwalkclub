# KC Social Walk Club

Static site built with Astro. Events come from Google Calendar at build time.
Photos and page text are edited through Decap CMS.

---

## Part 1 — Setup (do this once)

### 1. Google Calendar

1. Create a new Google Calendar named **KC Social Walk Club Events**.
2. Settings for that calendar → **Access permissions** → check **Make available to public**.
3. Scroll to **Integrate calendar** → copy the **Calendar ID**.

### 2. Google Calendar API key

1. Go to the Google Cloud Console and create a project.
2. **APIs & Services → Library** → enable **Google Calendar API**.
3. **APIs & Services → Credentials → Create credentials → API key**.
4. Restrict the key: **API restrictions → Google Calendar API only**.

### 3. GitHub

Push this folder to a new GitHub repo.
Then open `public/admin/config.yml` and replace `REPO_OWNER/REPO_NAME` with the real repo path.

### 4. Netlify

1. New site → import from GitHub → pick the repo.
2. Build command `npm run build`, publish directory `dist` (already in `netlify.toml`).
3. **Site settings → Environment variables**, add:
   - `GOOGLE_CALENDAR_ID`
   - `GOOGLE_CALENDAR_API_KEY`
4. **Site settings → Build & deploy → Build hooks** → create one, copy the URL,
   add it as environment variable `BUILD_HOOK_URL`. This is what the nightly
   rebuild calls.
5. **Site settings → Access control → OAuth** → install the **GitHub** provider.
   This is what lets Lorenzo log in to `/admin`.

### 5. DNS at Namecheap

- `ALIAS` record, host `@` → `apex-loadbalancer.netlify.com`
- `CNAME` record, host `www` → the Netlify site subdomain

### 6. Before launch

- Fill in the social links in `src/lib/site.js`
- Add a contact email in the Get Involved page through `/admin`
- Add the site to Google Search Console and submit `sitemap-index.xml`

---

## Part 2 — How Lorenzo runs the site

### Adding an event

In the **Google Calendar app** on his phone:

1. Tap **+** → **Event**
2. Title — this becomes the event name on the site
3. Date and time
4. **Location** — the meeting spot. Type it out: *Loose Park, Kansas City, MO*
5. **Color** — this sets the category on the site:
   - **Basil** (dark green) → Green walk
   - **Tomato** (red) → Red walk
   - **Blueberry** (blue) → Run
   - **Tangerine** (orange) → Social event
   - No color → plain Walk
6. **Description** — what to expect, what to bring. This shows on the event page.
7. Save.

The site picks it up on the next rebuild. Rebuilds run every morning around 6am
Central. To push it live sooner, trigger a deploy in Netlify.

Editing or deleting an event in Google Calendar does the same thing on the site.

### Adding photos or editing page text

Go to **kcsocialwalkclub.com/admin** and log in with GitHub.

- **Photos** — add a photo, write a caption, publish. Shows on the gallery and
  the homepage strip.
- **Social Posts** — thumbnail, link, and platform for the "Follow Along" row
  on the homepage. Sort order is lowest-number-first.
- **Page text** — About and Questions. Edit and publish.

Changes go live in a minute or two.

---

## Local development

```bash
npm install
cp .env.example .env    # fill in the two Google values
npm run dev
```

---

## Notes for future edits

- Events are read at **build time**, not in the browser. That is deliberate:
  it keeps every event page as real static HTML with Event schema, which is
  what gets picked up for event rich results.
- If the Google Calendar credentials are missing or the API is unreachable,
  the build still succeeds and pages render empty states instead of crashing.
- Event page URLs are `title-YYYY-MM-DD`. Renaming an event in Google Calendar
  changes its URL.
- Type is Oswald for headings, DM Sans for body, and UnifrakturMaguntia for the
  word "Social" in the logo lockup only. Colors, radii, and the animation
  keyframes are all custom properties at the top of `src/styles/global.css`.
- Animations use transforms and opacity only. Scroll reveals come from
  `public/reveal.js` (one IntersectionObserver); elements opt in with
  `class="reveal"`, or `reveal-group` / `reveal-item` for a staggered row.
  Everything collapses to instant under `prefers-reduced-motion`.
- `public/_redirects` 301s the five consolidated URLs (`/walks`, `/runs`,
  `/social-events`, `/get-involved`, `/faq`) to their new sections. Keep it.
- The homepage TikTok slot is a placeholder until a URL is set in
  `featuredTikTok` at the top of `src/pages/index.astro`. Setting it swaps in a
  lazy-loaded iframe with no TikTok JavaScript.
- The mascot ships at two sizes: `mascot.png` (840w, hero and 404) and
  `mascot-small.png` (160w, nav, footer, mobile menu). Both are palette PNGs —
  re-export at those widths rather than dropping in the full-resolution file.
- The three Get Involved blurbs are in `src/pages/about.astro`, not the CMS.
  Editing the "Get Involved page" body in Decap no longer changes the site.
