# SAMMAN — Respect in Practice

An interactive prototype of a proposed, institution-supported prevention-learning programme for college students aged 18–22. It is a demonstration only. The educational content needs professional review before it is delivered anywhere. No real complaints or sensitive disclosures are collected.

## Run it

```bash
npm install
npm run dev      # local development server
npm run build    # type-checks, then builds one self-contained file: dist/index.html
```

Requires Node 18 or later. The build inlines all JavaScript and CSS into `dist/index.html`. The only external request is to Google Fonts (Newsreader and Inter); if that fails, system fonts are used.

## Structure

```
src/
  content/          All content, kept separate from the UI
    scenarios.ts    9 fictional scenarios; 6 have three or more decisions
    topics.ts       10 themes (A–J) with explanations, justifications and legal notes
    programme.ts    4 proposed sessions
    facilitator.ts  checklists, ground rules, guidance, "What if this happens?"
    support.ts      support directory with source, verification status, review date
    evidence.ts     evidence register and consultation wording
    institutions.ts readiness checklist and FICTIONAL dashboard data
    questions.ts    fictional Q&A with draft answers
    home.ts         homepage diagram and statement content
  components/       Layout (AppSidebar rail, mobile header, prototype bar, footer, leave, reset),
                    HomeSections (HeroSection, InteractiveTopicSymbols, TopicContextStrip, TopicColumns,
                    ScenarioPreview, PausePanel, BottomNavigationStrip), Icons (one SVG line family),
                    ScenarioPlayer, ui atoms
  pages/            one file per route
  state/            in-memory demo state (React context)
```

### Routes

Homepage is experience-first (hero, four topic symbols, one scenario preview). Detail lives on: `#why` (mission and approach), `#learn`, `#practice`, `#educators` (hub for `#facilitators` and `#institutions`), `#evidence`, `#questions-support`, `#privacy`, and `#quiz` (age-based check).


Routes run in memory (`MemoryRouter`) so the single file works on any static host. Each view is mirrored to a plain hash token so it can be linked to: `#learn`, `#practice`, `#practice.forwarded`, `#facilitators`, `#institutions`, `#questions-support`, `#evidence`. On a real server, swap in `BrowserRouter` to get the paths `/`, `/learn`, `/practice/:scenarioId` and so on.

### Scenario engine

Each scenario is a set of stages. Every option carries a `kind` (`harmful`, `partial`, `reasonable`, `needs-support`), feedback on the five questions, an optional `next` stage, and topics to suggest revisiting. People can try a different response before continuing. Pause, skip, the support link and return-to-programme are on every screen. Nothing is scored. The end screen shows the path taken and "Topics to revisit".

To add a scenario, add an object to `scenarios.ts`. The UI needs no changes.

## Privacy behaviour

- No authentication, analytics, tracking pixels, session replay, uploads, camera, microphone, location or external AI.
- Answers, reflections, typed questions and checklist entries are held only in React state. Refreshing the page, using **Reset demo** or using **Leave page** clears them. Nothing is written to `localStorage`.
- **Leave page** clears the demo and shows a neutral screen. It states that leaving does not erase browser history, downloads, screenshots or other activity on the device. It cannot close the tab.
- Call links are `tel:` links the user must tap. Nothing is dialled automatically.

## Translation readiness

All copy lives in `src/content/*.ts`. English is complete. Marathi and Hindi are shown only as "Planned — reviewed translation required"; there is no language switcher. To add a language, move the content modules behind a locale key (for example `content/en/`, `content/mr/`) and add a language selector only once a reviewed translation exists.

## Final inventory

| Working now | Demonstration only | Professional review required | Future roadmap |
|---|---|---|---|
| Navigation and all 8 views | Role labelling ("Demo view"); no real access control | All scenario text, feedback and topic content | Reviewed Marathi and Hindi versions |
| 9 scenarios, 6 with several decisions, with revise, skip, pause and topics to revisit | Institution readiness checklist (in memory, not saved) | Legal reference notes (verification and a qualified lawyer) | Additional adult settings |
| Homepage preview scenario | Aggregate dashboard (all numbers fictional) | Support directory (112 and 181 not confirmed; every entry to re-verify) | Parent and educator resources (review pending) |
| Four-session programme with sequences, prompts and reflections | Q&A typing (kept in memory, never sent, never answered) | Facilitator guidance, disclosure procedure, under-18 procedure | Separately designed children's and adolescent programmes, after specialist and safeguarding review |
| Facilitator toolkit, interactive checklist, "What if" simulator, print-friendly view | Consultation section (themes not yet supplied) | Evaluation measures and scenario comparability | Real backend for moderated Q&A, if ever justified |
| Reading settings, reset, leave page, reduced motion, keyboard access | | Evidence register entries marked "Secondary – verify" / "Verification pending" | |

## Production-readiness checklist

The items below are **not done**. The prototype makes no claim that its code has been security-audited, that its content has been validated, or that the programme reduces violence.

**Content and safeguarding**
- [ ] Independent expert review of all scenarios, feedback and topic content (gender-based violence prevention, trauma-informed practice, Indian context)
- [ ] Review of the access-barrier examples by people with relevant lived and professional expertise
- [ ] Legal review of every legal statement (BNS, BNSS, POCSO, IT Act and the 2026 IT Rules amendment, POSH, UGC 2015 Regulations)
- [ ] Disclosure procedure and under-18 procedure approved by the host institution and a qualified lawyer
- [ ] Facilitator training plan, supervision and debrief arrangements

**Support information**
- [ ] Obtain and check the official references for 112 and 181 (they were not supplied to this build, and the official pages were unreachable)
- [ ] Re-verify every support entry against its official source; record the date and a named owner
- [ ] Institution supplies verified ICC, counselling, medical and security contacts

**Evaluation and ethics**
- [ ] Ethics approval for any pilot data collection
- [ ] Measures adapted and tested for the Indian context; baseline and follow-up scenarios checked for comparability by experts
- [ ] Small-cell suppression rules (primary and complementary) agreed and documented
- [ ] Data protection assessment under the DPDP Act 2023 and Rules 2025 before collecting any personal data

**Engineering**
- [ ] Independent accessibility audit (WCAG 2.2 AA), including screen-reader testing in English, Marathi and Hindi
- [ ] Security review, CSP and hosting configuration; self-hosted fonts to avoid third-party requests
- [ ] User testing of "Leave page" with students; confirm the wording and behaviour
- [ ] Reviewed translations; locale architecture as described above
- [ ] Automated tests for the scenario engine (all branches reachable; every option has complete feedback)
