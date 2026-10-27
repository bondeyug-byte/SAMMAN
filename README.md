# SAMMAN — Respect in Practice

An interactive prototype of a proposed, institution-supported prevention-learning programme for college students aged 18–22.

> **Demonstration prototype.** Proposed educational content requires professional review before delivery. No real complaints or sensitive disclosures are collected. All scenarios, institutions and dashboard figures are fictional.

## What's in this repository

| Path | What it is |
|---|---|
| `index.html` | The built site in one self-contained file. Open it in a browser, or serve it with GitHub Pages. |
| `app/` | React + TypeScript source (Vite). Run `npm install` then `npm run build` inside `app/`; the build is written to `app/dist/index.html`. Copy that file to the root `index.html` to update the site. |

## Features

- Age-based start: the check uses the person's age to pick questions (18–19, 20–22, or adults supporting students). There is no content for under-18s until specialist review is done.
- Adaptive learning: a missed answer opens a short lesson, missed ideas are checked again with new situations, and the person gets a learning plan. There is no score.
- Nine fictional branching scenarios, with feedback, revision, pause, skip and support on every screen.
- A four-session proposed programme, a facilitator toolkit with a "What if this happens?" practice, institution readiness, a support directory with verification labels, and an evidence register.
- No login, analytics, tracking or storage. Answers stay in browser memory until refresh or reset.

See [`app/README.md`](app/README.md) for the structure, the final inventory and the production-readiness checklist.
