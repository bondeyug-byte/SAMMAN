import type { Session } from './types';

// Proposed pilot structure. Not an established effective dose.
// Professional review and testing pending.

export const sessions: Session[] = [
  {
    id: 's1',
    number: '01',
    title: 'Autonomy, consent and pressure',
    duration: '90 minutes (proposed)',
    objectives: [
      'Describe consent as voluntary, specific and ongoing, and explain why earlier agreement does not decide the present.',
      'Recognise non-physical forms of pressure: repeated asking, sulking, guilt and “tests” of love.',
      'Tell the difference between educational principles and what a particular law currently says.',
    ],
    preparation: [
      'Confirm the institution’s support contacts and disclosure procedure (see Institution Readiness).',
      'Read the content notes for both scenarios. Tell participants in advance what the session covers.',
      'Agree with a co-facilitator who will step out with anyone who needs a break.',
    ],
    contentNote: 'Discusses sexual pressure within relationships. No graphic content. Participants may step out at any time without explanation.',
    sequence: [
      { time: '0–10', activity: 'Opening', detail: 'Purpose, ground rules, content information, support routes, and how to step out.' },
      { time: '10–25', activity: 'Scenario: “Only a joke”', detail: 'Individual private choice, then explanation. Warm-up on how groups set norms.' },
      { time: '25–55', activity: 'Scenario: After “not tonight”', detail: 'Private choices; small-group discussion of where pressure appears.' },
      { time: '55–75', activity: 'Principles and the law', detail: 'What SAMMAN teaches as principle; where Indian law currently differs (prepared, reviewed text only).' },
      { time: '75–85', activity: 'New-situation practice', detail: 'A different short vignette (not repeated from the session).' },
      { time: '85–90', activity: 'Close', detail: 'Take-away practice and support information.' },
    ],
    scenarioIds: ['only-a-joke', 'after-not-tonight'],
    topicIds: ['consent', 'control', 'sexism'],
    discussion: [
      'What makes stopping “cost nothing” for the other person?',
      'Why might someone agree to something they don’t want? What does that tell us about pressure?',
      'Where does the idea that a relationship creates permission come from?',
    ],
    reflection: 'Private, optional: write one sentence you could say to make it easy for someone to say no to you. You do not need to share it.',
    takeaway: 'Practise saying “okay” — and only “okay” — when someone declines something, this week.',
    followUp: 'A brief optional check-in two weeks later with a new scenario, not repeated from the session.',
  },
  {
    id: 's2',
    number: '02',
    title: 'Entitlement, rejection and peer norms',
    duration: '90 minutes (proposed)',
    objectives: [
      'Identify beliefs that turn rejection into a grievance: owed attention, gifts as obligations, persistence as romance.',
      'Practise responding to a friend’s disappointment while holding a line on harmful action.',
      'Explore how assumptions about what peers approve of can keep people silent.',
    ],
    preparation: [
      'Prepare an optional anonymous in-room poll (paper slips) on peer norms. Results are discussed only as a whole group.',
      'Plan how to respond if someone defends retaliation (see Facilitator Toolkit).',
    ],
    contentNote: 'Discusses rejection, unwanted messaging and humiliation. No graphic content.',
    sequence: [
      { time: '0–10', activity: 'Opening', detail: 'Ground rules recap, content information, support routes.' },
      { time: '10–40', activity: 'Scenario: “He’s just persistent”', detail: 'Three decisions; pair discussion after each.' },
      { time: '40–55', activity: 'Peer-norms poll', detail: 'Optional anonymous slips: “How many of your friends think…?” compared with “What do you think?”' },
      { time: '55–80', activity: 'Scenario: The plan', detail: 'Focus on separating feelings from actions.' },
      { time: '80–90', activity: 'Close', detail: 'Take-away practice and support information.' },
    ],
    scenarioIds: ['just-persistent', 'the-plan'],
    topicIds: ['entitlement', 'peer-norms'],
    discussion: [
      'What do friends usually say after someone is rejected? What does it encourage?',
      'How can you support a friend’s feelings without supporting their plan?',
    ],
    reflection: 'Private, optional: think of one phrase your group uses about rejection. What does it assume?',
    takeaway: 'Next time a friend is turned down, try: “That sucks. It’s still her call.”',
    followUp: 'Optional check-in with a new scenario about group humour.',
  },
  {
    id: 's3',
    number: '03',
    title: 'Digital boundaries, power and control',
    duration: '90 minutes (proposed)',
    objectives: [
      'Recognise digital harms: forwarding, sexualised edits, password demands and monitoring.',
      'Recognise how power over grades, roles or jobs affects whether someone can say no, and what retaliation can look like.',
      'Identify safe actions for bystanders in digital spaces, and the limits of individual action.',
    ],
    preparation: [
      'Confirm current platform reporting and cybercrime-portal information; mark anything unverified.',
      'Never show, simulate or describe abusive images. Use the text scenarios only.',
    ],
    contentNote: 'Discusses non-consensual sexualised images (never shown or described), workplace pressure and possible retaliation.',
    sequence: [
      { time: '0–10', activity: 'Opening', detail: 'Ground rules, content information, support routes.' },
      { time: '10–45', activity: 'Scenario: Forwarded, not created', detail: 'Multiple decisions; focus on forwarding and the “not real” excuse.' },
      { time: '45–75', activity: 'Scenario: The internship', detail: 'Power, financial dependence and retaliation.' },
      { time: '75–85', activity: 'Group norms exercise', detail: 'Draft a group-chat norm the room agrees with (no names, no real incidents).' },
      { time: '85–90', activity: 'Close', detail: 'Take-away practice and support information.' },
    ],
    scenarioIds: ['forwarded', 'the-internship'],
    topicIds: ['digital', 'power', 'control', 'barriers'],
    discussion: [
      'Why might “it’s not even real” be persuasive? What does it ignore?',
      'How can someone tell whether an opportunity is linked to personal attention?',
    ],
    reflection: 'Private, optional: what would you want a group chat to do if your image were shared without consent?',
    takeaway: 'Propose one consent norm in a group chat you belong to.',
    followUp: 'Optional check-in with a new scenario about monitoring presented as care.',
  },
  {
    id: 's4',
    number: '04',
    title: 'Bystander action and supportive responses',
    duration: '90 minutes (proposed)',
    objectives: [
      'Choose among safe bystander options — interrupting, getting help, checking in — without physical confrontation.',
      'Respond to a disclosure by listening, believing, avoiding blame and respecting choice, while being honest about limits.',
      'Describe what the institution is responsible for, including protection against retaliation.',
    ],
    preparation: [
      'Have the institution’s verified support information ready to hand out.',
      'Re-read the disclosure guidance and the institution’s procedure, including any different duties for under-18 participants.',
    ],
    contentNote: 'Discusses harassment, disclosure of an unwanted sexual experience (no details), and dismissal of a concern.',
    sequence: [
      { time: '0–10', activity: 'Opening', detail: 'Ground rules, content information, support routes.' },
      { time: '10–30', activity: 'Scenario: Outnumbered', detail: 'Map safe options on the board.' },
      { time: '30–55', activity: 'Scenario: “Don’t tell anyone”', detail: 'Listening is not investigating; honest limits.' },
      { time: '55–80', activity: 'Scenario: The senior everyone likes', detail: 'Power, dismissal and retaliation; the institution’s role.' },
      { time: '80–90', activity: 'Close and programme review', detail: 'Where to find support; optional anonymous feedback on the programme (not on individuals).' },
    ],
    scenarioIds: ['outnumbered', 'dont-tell-anyone', 'senior-everyone-likes'],
    topicIds: ['support', 'institutions', 'peer-norms'],
    discussion: [
      'What is one low-risk action you could take when outnumbered?',
      'What is the difference between supporting someone and taking over?',
      'What would make the college route easier to find and trust?',
    ],
    reflection: 'Private, optional: what could you honestly promise if a friend told you something difficult?',
    takeaway: 'Save the institution’s verified support contacts somewhere you can find them.',
    followUp: 'Optional follow-up with a new scenario 4–8 weeks later. Participation is voluntary.',
  },
];

export const sessionById = Object.fromEntries(sessions.map((s) => [s.id, s])) as Record<string, Session>;
