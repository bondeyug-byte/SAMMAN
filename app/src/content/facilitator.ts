// Facilitator resources. Draft, non-clinical guidance.
// Local, professionally approved procedures always take precedence.

export const preparationChecklist = [
  { id: 'p1', text: 'I have read the session plan, the scenarios and their content notes.' },
  { id: 'p2', text: 'I know the institution’s disclosure procedure, and who I contact afterwards.' },
  { id: 'p3', text: 'I have the institution’s verified support information to hand out (not copied from memory).' },
  { id: 'p4', text: 'I know whether any participants may be under 18, and the different procedure that may apply.' },
  { id: 'p5', text: 'A co-facilitator or support person is available to step out with anyone who needs it.' },
  { id: 'p6', text: 'Participants were told in advance what the session covers, and that they may step out without explanation.' },
  { id: 'p7', text: 'I have planned how to stop a discussion that becomes hostile or humiliating.' },
  { id: 'p8', text: 'I have a quiet space identified for anyone who needs a break.' },
  { id: 'p9', text: 'I have arranged my own debrief after the session.' },
];

export const groundRules = [
  { rule: 'Talk about the situations, not about people in the room or real people outside it.', why: 'Protects privacy and prevents the session becoming a place for allegations.' },
  { rule: 'No one has to share personal experiences.', why: 'Disclosure is never required. Sessions are not counselling.' },
  { rule: 'Challenge ideas, not people.', why: 'People reflect more when they are not being labelled.' },
  { rule: 'You can step out at any time without explaining.', why: 'Choice and comfort matter more than completing the session.' },
  { rule: 'What others say personally stays in the room — with honest limits.', why: 'Facilitators cannot promise complete confidentiality; explain the institution’s limits at the start.' },
  { rule: 'Humiliating comments will be stopped.', why: 'Respect is the subject and the method.' },
];

export const contentReviewChecklist = [
  'Every scenario is fictional and no character resembles a real person or known incident.',
  'No graphic description of violence, bodies or abuse.',
  'Feedback leads with the fact, rather than restating the myth.',
  'Harmful responses are corrected clearly; victim-blaming is not presented as a legitimate opinion.',
  'No scenario requires or praises physical confrontation.',
  'Support means listening and choice, never investigating.',
  'Women are not framed as valuable because of their relationship to men.',
  'No group is stereotyped; access-barrier examples have been reviewed by people with relevant expertise.',
  'Legal statements are separated from principles, sourced, dated and reviewed by a qualified lawyer.',
  'Support information is verified, dated and has a named owner for updates.',
  'Marathi and Hindi versions, when created, are professionally translated and reviewed — not machine translated.',
];

export interface GuidanceSection {
  id: string;
  title: string;
  intro: string;
  points: string[];
  limit: string;
}

export const guidance: GuidanceSection[] = [
  {
    id: 'disagreement',
    title: 'Responding to disagreement',
    intro: 'Disagreement is expected and can be useful. The aim is reflection, not winning.',
    points: [
      'Acknowledge the comment and ask a clarifying question: “What makes you say that?”',
      'Restate what you understood, briefly, before responding.',
      'Give a clear, evidence-based response. State the accurate point first rather than repeating the claim you are correcting.',
      'Invite others: “Does anyone see it differently?” — without setting up a pile-on.',
      'Use a two-facilitator approach where possible: one leads, one watches the room.',
    ],
    limit: 'Not every disagreement needs resolving in the room. You can say “Let’s pick this up after the session.”',
  },
  {
    id: 'victim-blaming',
    title: 'Addressing victim-blaming',
    intro: 'Victim-blaming comments must be corrected, not treated as one view among many.',
    points: [
      'Lead with the accurate statement: “Responsibility lies with the person who chooses to harm.”',
      'Avoid repeating the myth in your correction; it can make it more memorable.',
      'Ask what the comment assumes: “What would the person have to do to be safe, by that logic?”',
      'Remember there may be people in the room for whom the comment is personal. Correct it promptly.',
    ],
    limit: 'You are correcting an idea, not diagnosing the person who said it.',
  },
  {
    id: 'mockery',
    title: 'Handling mockery without humiliating participants',
    intro: 'Mockery often signals discomfort. Respond firmly without shaming.',
    points: [
      'Name the behaviour neutrally: “Let’s keep this respectful — this matters to people here.”',
      'Re-engage: give the person a role or a question in the next activity.',
      'If it continues, speak to them privately during a break.',
      'If needed, ask them to take a short break outside. Do not make an example of them.',
    ],
    limit: 'If a participant repeatedly undermines safety, follow the institution’s conduct procedure.',
  },
  {
    id: 'distress',
    title: 'Responding to distress',
    intro: 'Some participants may find the material difficult. Respond calmly and without drawing attention.',
    points: [
      'Remind everyone at the start that they can step out at any time.',
      'If someone leaves, let the co-facilitator check in quietly, if the person wants that.',
      'Offer a glass of water, a quiet space, and the support information. Ask what they need.',
      'Do not ask why they are distressed or what happened.',
      'If you believe someone is at immediate risk, follow the institution’s emergency procedure.',
    ],
    limit: 'Facilitators are not counsellors. Refer to qualified support; do not attempt therapy.',
  },
  {
    id: 'disclosure',
    title: 'Disclosure and referral boundaries',
    intro: 'A participant may share a personal experience during or after a session.',
    points: [
      'Before the session, know the institution’s disclosure procedure and your own duties in your role.',
      'In a group: gently acknowledge, and offer to talk privately after. Protect the person from further questions.',
      'In private: listen, thank them, say it is not their fault, and ask what they would like.',
      'Explain honestly what you can and cannot keep confidential in your role.',
      'Offer verified support routes. Do not investigate, ask for details, or contact anyone named.',
      'If the person may be under 18, different legal duties may apply in India (for example under the POCSO Act). Follow the institution’s procedure and seek qualified advice.',
    ],
    limit: 'Facilitators do not determine whether something happened, and do not promise outcomes.',
  },
];

export const postSessionPrompts = [
  'Which parts of the session ran as planned? Which needed adjusting?',
  'Were any comments left uncorrected? How would you handle them next time?',
  'Did anyone need support? Was the referral route clear and working? (Record no names or details here.)',
  'Did timing allow for discussion, or did content crowd it out?',
  'What do you need for your own wellbeing after this session?',
];

export interface WhatIfOption {
  label: string;
  kind: 'harmful' | 'partial' | 'reasonable';
  feedback: string;
}
export interface WhatIf {
  id: string;
  title: string;
  situation: string;
  options: WhatIfOption[];
  procedureNote: string;
}

export const whatIfs: WhatIf[] = [
  {
    id: 'names',
    title: 'A participant names an alleged offender',
    situation: 'During discussion, a participant says, “This is exactly what [names a real student] did to my friend.”',
    options: [
      { label: 'Ask for more details so the group understands.', kind: 'harmful', feedback: 'This turns the session into an investigation and exposes everyone involved. Stop the discussion of real people.' },
      { label: 'Gently interrupt: “Let’s not name real people here. If you’d like to talk about this, I can speak with you afterwards.”', kind: 'reasonable', feedback: 'Protects privacy and fairness while keeping a door open. Follow up privately and share verified routes.' },
      { label: 'Ignore it and move on quickly.', kind: 'partial', feedback: 'Moving on is right; without naming the ground rule, the name may circulate further. Restate the rule briefly.' },
    ],
    procedureNote: 'Do not record or pass on the name except as the institution’s approved procedure requires.',
  },
  {
    id: 'degrading',
    title: 'A participant makes a degrading comment',
    situation: 'A participant says, “Girls who wear those clothes are asking for attention.” Some people laugh.',
    options: [
      { label: 'Let the group debate it as one opinion.', kind: 'harmful', feedback: 'Victim-blaming should be corrected, not balanced. Debating it can hurt people in the room.' },
      { label: 'Correct the idea calmly: “Clothing doesn’t cause harassment. Responsibility lies with the person who harasses.” Then ask the group what the comment assumes.', kind: 'reasonable', feedback: 'Leads with the fact and turns the moment into reflection without shaming the speaker.' },
      { label: 'Tell the participant to leave immediately.', kind: 'partial', feedback: 'Firmness is right, but removal as the first step can harden views. Reserve it for repeated or targeted comments.' },
    ],
    procedureNote: 'If comments target someone in the room, follow the institution’s conduct procedure.',
  },
  {
    id: 'legal',
    title: 'A participant asks for legal advice',
    situation: 'A participant asks, “If someone shared my photo, can I file a case? What section is it?”',
    options: [
      { label: 'Give a confident answer about which law applies.', kind: 'harmful', feedback: 'Facilitators are not lawyers. Incorrect advice can cause harm.' },
      { label: '“I can’t give legal advice. I can show you where to find verified information and who can advise you.”', kind: 'reasonable', feedback: 'Honest about limits and still helpful. Point to verified support information and qualified advice.' },
      { label: 'Say it’s too complicated and move on.', kind: 'partial', feedback: 'Honest, but leaves them without a route. Offer the support information.' },
    ],
    procedureNote: 'Note the question may be personal. Offer to talk privately; do not ask for details in the group.',
  },
  {
    id: 'distressed',
    title: 'A participant appears distressed',
    situation: 'A participant has gone quiet, is looking down, and seems upset during a scenario.',
    options: [
      { label: 'Ask them in front of the group if they are okay.', kind: 'partial', feedback: 'Care is right; public attention can increase distress. Check in quietly instead.' },
      { label: 'Remind the whole group they can step out; the co-facilitator quietly offers a break.', kind: 'reasonable', feedback: 'Gives choice without singling them out.' },
      { label: 'Ask them what is upsetting them.', kind: 'harmful', feedback: 'Do not ask for reasons. Ask what they need.' },
    ],
    procedureNote: 'If you believe someone is at immediate risk, follow the institution’s emergency procedure.',
  },
  {
    id: 'discloses',
    title: 'A participant discloses harm',
    situation: 'After the session, a participant tells you something similar happened to them.',
    options: [
      { label: 'Ask questions to understand what happened.', kind: 'harmful', feedback: 'Supportive listening is not investigation. Do not ask for details.' },
      { label: 'Listen, thank them, say it’s not their fault, explain your confidentiality limits honestly, and ask what they would like. Share verified routes.', kind: 'reasonable', feedback: 'This follows the principles of listening, belief, choice and honest limits.' },
      { label: 'Promise you won’t tell anyone.', kind: 'partial', feedback: 'Only promise what your role allows. Explain your limits instead.' },
    ],
    procedureNote: 'Follow the institution’s approved disclosure procedure. If the person may be under 18, different legal duties may apply.',
  },
];

export const agendaNote =
  'Each proposed agenda is in the Learning Programme. These are proposed delivery structures — not an established effective dose.';
