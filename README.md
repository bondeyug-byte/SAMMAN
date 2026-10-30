# SAMMAN

A little more prepared. Practical situations and safer journeys, at your own pace.

> **Prototype.** Learn content is draft educational material that needs professional review. Route grades come from public OpenStreetMap data and are not a guarantee of safety. SAMMAN does not contact anyone for you; calls go through your phone.

## Open it

- **Website (GitHub Pages):** `index.html`, which loads Learn from `learn.html`. Use this on phones: location sharing and maps need a secure (https) website.
- **One file:** `SAMMAN-single-file.html` contains everything, for sharing or offline use. Opened from WhatsApp or a downloaded file, phones may block location and calls; the website version avoids that.

## Sections

| Section | What it does |
|---|---|
| Home | Short intro, daily tip, links to each section |
| Learn | Fictional scenarios with feedback, an age-based check that teaches from missed answers, a four-session programme, facilitator toolkit, institution readiness, support directory and evidence register |
| Guide (safe travel) | Compare walking routes for a chosen time, graded A–E on open places, help points, main roads, lighting and transit, with empty stretches flagged; details, directions and optional CCTV layer |
| Emergency | Hold-to-open SOS, 112 / 181 / 1098, share location or a plain "I need help" message, verified helpline directory |

## Source and build

| Path | What it is |
|---|---|
| `shell/` | Home, Guide, Emergency and the app frame: `index.html`, `styles.css`, `config.js` (all scoring numbers and the helpline list), `sample-data.js`, `scoring.js`, `app.js` |
| `app/` | Learn: React + TypeScript (Vite). See [`app/README.md`](app/README.md) |
| `build.mjs` | Builds Learn, bundles Leaflet (no CDN), and writes `index.html`, `learn.html` and `SAMMAN-single-file.html` |

```bash
npm install            # root: installs Leaflet for bundling
(cd app && npm install)
npm run build          # builds Learn and the app; use "npm run build:shell" if only shell/ changed
```

Edit `shell/` or `app/src/`, never the generated root HTML files.

## External services (free, public)

Street pictures (CARTO, then OpenStreetMap), place search (Nominatim), walking routes (OSRM at routing.openstreetmap.de) and nearby places (Overpass, with a backup server). If they are busy, SAMMAN says so: routes are shown without grades rather than with invented ones, and "Try grading again" retries. Fonts load from Google Fonts. No accounts, analytics or tracking.
