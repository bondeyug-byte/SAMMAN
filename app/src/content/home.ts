// Homepage narrative content.

export const layers = [
  {
    id: 'individual',
    label: 'Individual choices',
    situation: 'Fictional: a student keeps messaging someone who has asked him to stop.',
    responsibility: 'Each person is responsible for their own conduct — for hearing a no and for not pressuring, controlling or retaliating.',
    canAddress: 'Practising recognition of pressure and entitlement, and rehearsing respectful responses to rejection.',
    broader: 'Accountability for harm requires institutional and legal processes, not a course.',
  },
  {
    id: 'peers',
    label: 'Peer expectations',
    situation: 'Fictional: friends cheer him on, saying persistence is romantic.',
    responsibility: 'Friends shape what counts as normal. Laughing along or staying silent sends a message too.',
    canAddress: 'Discussing what peers actually think, and practising low-risk ways to challenge friends.',
    broader: 'Group culture changes over time and needs more than a few sessions.',
  },
  {
    id: 'institutions',
    label: 'Institutional practices',
    situation: 'Fictional: the student targeted cannot find out who handles concerns at her college.',
    responsibility: 'Institutions are responsible for clear routes, trained contacts, fair procedures and protection from retaliation.',
    canAddress: 'Showing what readiness looks like, and making gaps visible.',
    broader: 'Staffing, policy, budgets and accountability are decisions for the institution.',
  },
  {
    id: 'society',
    label: 'Wider social norms',
    situation: 'Fictional: films, jokes and family expectations treat women’s refusal as a challenge.',
    responsibility: 'Media, families, workplaces and public institutions all contribute to what is excused.',
    canAddress: 'Helping participants notice these norms and question them.',
    broader: 'Policing, courts, law reform and public policy are outside what this prototype can change.',
  },
];

export const statements = [
  {
    text: 'It was only a joke.',
    assumption: 'That humour has no effect on what a group considers acceptable.',
    alternative: 'Don’t laugh. Try: “What do you mean by that?” — or simply, “Not funny.”',
  },
  {
    text: 'They are dating.',
    assumption: 'That a relationship creates permission, or makes pressure acceptable.',
    alternative: 'Each person keeps the right to say no, at any time, in any relationship.',
  },
  {
    text: 'He is our friend.',
    assumption: 'That loyalty means deciding nothing happened before anyone has listened.',
    alternative: 'You can care about a friend and still take a concern about him seriously.',
  },
  {
    text: 'She is overreacting.',
    assumption: 'That her discomfort matters less than everyone else’s comfort.',
    alternative: 'Ask her what she needs, rather than deciding how she should feel.',
  },
  {
    text: 'Sharing it once does not matter.',
    assumption: 'That one forward is harmless.',
    alternative: 'Each forward makes another copy. Don’t open, save or share — report it.',
  },
];

export const loop = [
  { step: 'Situation', detail: 'A short fictional scenario with a content note.' },
  { step: 'Private choice', detail: 'Each person chooses a response, privately. No one is ranked.' },
  { step: 'Explanation', detail: 'Feedback on the assumption, whose choice matters, and what could be done safely.' },
  { step: 'Guided discussion', detail: 'A trained facilitator leads discussion of ideas, not people.' },
  { step: 'New-situation practice', detail: 'A different scenario tests whether the idea transfers.' },
  { step: 'Follow-up', detail: 'An optional check-in weeks later, with a new scenario.' },
];
