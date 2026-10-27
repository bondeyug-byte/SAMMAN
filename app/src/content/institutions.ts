// Institution readiness checklist and a FICTIONAL sample dashboard.

export type ReadinessStatus = 'Not reviewed' | 'Information supplied' | 'Verification pending';
export const READINESS_STATUSES: ReadinessStatus[] = ['Not reviewed', 'Information supplied', 'Verification pending'];

export const readinessItems = [
  { id: 'role', title: 'Authorised support role', detail: 'A named role (not a person’s name here) is authorised to receive concerns and give support.' },
  { id: 'contacts', title: 'Verified contact details', detail: 'Internal Complaints Committee composition and contacts, counselling and security details are published, current and checked.' },
  { id: 'process', title: 'Accessible process information', detail: 'Plain-language description of what happens after a concern is raised, in accessible formats.' },
  { id: 'confidentiality', title: 'Confidentiality limits', detail: 'What is and is not kept confidential, written down and explained before any conversation.' },
  { id: 'facilitators', title: 'Facilitator preparation', detail: 'Facilitators trained, briefed on the disclosure procedure, and supported with a debrief.' },
  { id: 'referral', title: 'Referral arrangements', detail: 'Agreed referral routes to counselling, medical and external services, with current details.' },
  { id: 'retaliation', title: 'Retaliation concerns', detail: 'A route for raising retaliation after a concern, and a named role responsible for responding.' },
  { id: 'under18', title: 'Under-18 procedure', detail: 'A separate procedure for any participant under 18, reviewed by a qualified lawyer.' },
  { id: 'emergency', title: 'Emergency procedure', detail: 'What staff do if someone may be at immediate risk.' },
  { id: 'review', title: 'Review dates', detail: 'Who updates this information, and when it is next reviewed.' },
];

/** FICTIONAL SAMPLE DATA. Not from any real institution or pilot. */
export const sampleDashboard = {
  label: 'Fictional sample data — “Example College”, imagined pilot cohort',
  invited: 120,
  sessions: [
    { name: 'Session 1', attended: 84 },
    { name: 'Session 2', attended: 76 },
    { name: 'Session 3', attended: 71 },
    { name: 'Session 4', attended: 66 },
  ],
  scenarioCompletion: [
    { name: 'Forwarded, not created', started: 70, completed: 61, skipped: 6 },
    { name: '“He’s just persistent”', started: 74, completed: 68, skipped: 3 },
    { name: 'After “not tonight”', started: 80, completed: 69, skipped: 9 },
    { name: 'Outnumbered', started: 65, completed: 62, skipped: 2 },
  ],
  followUp: { eligible: 66, responded: 29 },
  topicsRevisited: [
    { topic: 'Supportive responses', count: 41 },
    { topic: 'Peer norms', count: 37 },
    { topic: 'Digital boundaries', count: 30 },
    { topic: 'Entitlement and rejection', count: 22 },
    { topic: 'Power imbalances', count: 17 },
  ],
  observations: [
    'Session 3 ran over time; facilitators suggested splitting the digital and power scenarios.',
    'Participants asked for more examples of short, realistic phrases to use with friends.',
    'Two facilitators said the disclosure procedure needed a clearer contact for evenings.',
  ],
  subgroups: [
    { group: 'Year 1', n: 38 },
    { group: 'Year 2', n: 21 },
    { group: 'Year 3', n: 7 },
  ],
};

export const SUPPRESSION_THRESHOLD = 10;
