# SAMMAN — Respect in Practice

A full-screen website: practise consent and supportive responses, plan safer walking routes, and reach help quickly.

> **Prototype.** Learning content is draft educational material that needs professional review. Route grades come from public OpenStreetMap data and are not a guarantee of safety. SAMMAN does not contact anyone for you; calls go through your phone.

## What's in it

| Section | What it does |
|---|---|
| Discover (home) | What would you do differently? Topic symbols, practice preview, safer-journeys links and a daily tip |
| Practise | Nine fictional scenarios with feedback, revision, pause and skip |
| Start | Age-based check that teaches from missed answers and ends with a learning plan |
| Learn | Four-session programme, ten themes, principles vs. Indian law |
| Safe travel | Compare walking routes for a chosen time, graded A–E on open places, help points, main roads, lighting and transit; empty stretches flagged; details, directions, CCTV layer; how grades work |
| Emergency | Hold-to-open SOS, 112 / 181 / 1098, share location or a plain "I need help" message, verified helplines |
| Help button | On every page: quick calls and sharing |
| Facilitate, Institutions, Support, Evidence | Facilitator toolkit, readiness checklist, Q&A and support directory, evidence register |

## Open it

`index.html` is the whole site in one file. Vercel and GitHub Pages serve it directly. Use the website on phones: location sharing and maps need a secure (https) page.

## Source and build

| Path | What it is |
|---|---|
| `app/` | The site: React + TypeScript (Vite). Safe travel lives in `app/src/guide/` (`config.ts` holds all scoring numbers and the helpline list), Emergency in `app/src/pages/Emergency.tsx`, the Help sheet in `app/src/help/` |
| `tools/` | Build script: builds `app/` and copies the single-file result to `index.html` |

```bash
(cd app && npm install)
cd tools && npm run build
```

Edit `app/src/`, then build and commit `index.html`.

**Deploying:** the repo root has no `package.json` on purpose, so Vercel and GitHub Pages publish the committed `index.html` with no build step. Don't add a root `package.json`, or Vercel will try to build and fail.

## External services (free, public)

Street pictures (CARTO, then OpenStreetMap), place search (Nominatim), walking routes (OSRM at routing.openstreetmap.de) and nearby places (Overpass, with a backup server). If they are busy, SAMMAN says so: routes are shown without grades rather than with invented ones, and "Try grading again" retries. Fonts load from Google Fonts. No accounts, analytics or tracking.
