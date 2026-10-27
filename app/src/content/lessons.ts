import type { QuizQuestion } from './quiz';

// Short lessons shown when an answer suggests a topic is worth revisiting,
// and one "check again" question per topic using a new situation.
// Draft content; professional review pending.

export interface Lesson {
  topicId: string;
  title: string;
  keyIdea: string;
  points: string[];
  trySaying: string;
  scenarioId: string;
}

export const lessons: Record<string, Lesson> = {
  consent: {
    topicId: 'consent',
    title: 'Consent is a present-tense yes',
    keyIdea: 'Consent is voluntary, specific and ongoing. It can change at any moment, and earlier agreement doesn’t decide now.',
    points: [
      'Hesitation, silence or going still is a signal to pause and check, not to wait for a firm no.',
      'A relationship, past intimacy or flirting earlier does not create permission.',
      'If someone may be too intoxicated to decide clearly, the respectful choice is to stop.',
    ],
    trySaying: '“Want to keep going, or stop here? Either is completely fine.”',
    scenarioId: 'after-not-tonight',
  },
  entitlement: {
    topicId: 'entitlement',
    title: 'A no is not a debt',
    keyIdea: 'No one owes attention, affection or a second chance — not for gifts, persistence or strong feelings.',
    points: [
      'Repeating requests after “please stop” overrides the other person’s answer.',
      'Disappointment is real and belongs to the person feeling it; it is not the other person’s job to fix.',
      'As a friend, you can support the feeling and still refuse to help with the plan.',
    ],
    trySaying: '“That really hurts, I get it. It’s still her call.”',
    scenarioId: 'just-persistent',
  },
  sexism: {
    topicId: 'sexism',
    title: 'Responsibility sits with the person who harms',
    keyIdea: 'Clothing, drinking or being out late do not cause harassment. Jokes that degrade women tell a group what is acceptable.',
    points: [
      'Correct victim-blaming with the fact first, rather than repeating the claim.',
      'Not laughing is already a response; a short sentence can shift a room.',
      'A sexist joke and an assault are different in seriousness. Challenging one is not accusing someone of the other.',
    ],
    trySaying: '“What she wore isn’t the reason. The person who did it is.”',
    scenarioId: 'only-a-joke',
  },
  'peer-norms': {
    topicId: 'peer-norms',
    title: 'Someone has to say it first',
    keyIdea: 'People often go along with a group because they assume everyone else approves. Often, many privately disagree.',
    points: [
      'Short, calm responses work better than long speeches.',
      'Speaking privately to a friend can be easier and more effective.',
      'Challenge what was said, not who the person is — and avoid organising a pile-on.',
    ],
    trySaying: '“Not funny, man.” — then move the conversation on.',
    scenarioId: 'only-a-joke',
  },
  digital: {
    topicId: 'digital',
    title: 'Every forward is another copy',
    keyIdea: 'Sharing someone’s private or sexualised images without consent is a serious harm, whether or not the image is “real”.',
    points: [
      'Don’t open, save or forward. Report it on the platform.',
      'If it’s safe, ask the sender privately to delete it.',
      'If you tell the person affected, share what you know and offer options — let them decide.',
    ],
    trySaying: '“Delete this. She didn’t agree to it.”',
    scenarioId: 'forwarded',
  },
  power: {
    topicId: 'power',
    title: 'Power changes what “yes” means',
    keyIdea: 'When someone controls grades, roles, jobs or belonging, the other person may not feel free to say no.',
    points: [
      'Secrecy and linking opportunities to personal attention are warning signs.',
      'A change in treatment after someone raises a concern may be retaliation — a separate concern.',
      'Institutions are expected to provide a route; individuals don’t need to handle this alone.',
    ],
    trySaying: '“The secrecy part seems off to me. What would you like to do?”',
    scenarioId: 'the-internship',
  },
  control: {
    topicId: 'control',
    title: 'Care respects a no; control punishes it',
    keyIdea: 'Checking phones, limiting friends or clothes, or demanding proof of loyalty can be presented as love. It is control when saying no has a cost.',
    points: [
      'Look at patterns, not one moment.',
      'Restricting women’s lives is not protection. Responsibility lies with the person applying pressure.',
      'If something feels familiar, general support routes are on the Support page.',
    ],
    trySaying: '“I trust you — and I don’t need your password to do that.”',
    scenarioId: 'after-not-tonight',
  },
  support: {
    topicId: 'support',
    title: 'Listen, believe, ask — don’t investigate',
    keyIdea: 'When someone shares something difficult, your role is to listen and support their choices — not to find out exactly what happened.',
    points: [
      'Say: thank you for telling me; it’s not your fault; what would help?',
      'Don’t promise secrecy you can’t keep; be honest about your limits.',
      'Don’t take over — don’t report, post or confront on their behalf without asking.',
    ],
    trySaying: '“Thank you for telling me. What would help right now?”',
    scenarioId: 'dont-tell-anyone',
  },
  institutions: {
    topicId: 'institutions',
    title: 'Institutions have a job to do',
    keyIdea: 'Colleges are expected to publish clear routes: committee contacts, process, confidentiality limits and protection from retaliation.',
    points: [
      'Know where the official information is before you need it.',
      'One staff member’s dismissal is not the institution’s final answer.',
      'Completing a programme certifies nothing about anyone’s safety.',
    ],
    trySaying: '“Could you tell us what the college’s process is, or who handles this?”',
    scenarioId: 'senior-everyone-likes',
  },
  barriers: {
    topicId: 'barriers',
    title: 'Open is not the same as accessible',
    keyIdea: 'Language, disability, money and discrimination can make the same support route harder for some people to use.',
    points: ['Ask what would make support easier to reach.', 'Don’t assume anyone’s experience from a group they belong to.'],
    trySaying: '“What would make this easier for you?”',
    scenarioId: 'the-internship',
  },
};

/** One new-situation question per topic, used to check again after a lesson. */
export const rechecks: Record<string, QuizQuestion> = {
  consent: {
    id: 'rc-consent',
    prompt: 'Two people are making out. One goes quiet and stops kissing back, but doesn’t say anything. What should the other person do?',
    options: [
      { id: 'a', text: 'Keep going — they haven’t said no.' },
      { id: 'b', text: 'Pause and check in, making it easy to stop.' },
      { id: 'c', text: 'Ask why they’re being weird.' },
    ],
    correct: 'b',
    explanation: 'Silence and stillness are not agreement. Pausing and making stopping easy is the respectful response.',
    topicId: 'consent',
  },
  entitlement: {
    id: 'rc-entitlement',
    prompt: 'Someone bought a classmate an expensive birthday gift. She then says she isn’t interested in dating him. What does she owe him?',
    options: [
      { id: 'a', text: 'At least one date, to be fair.' },
      { id: 'b', text: 'Nothing — a gift is not a contract.' },
      { id: 'c', text: 'The money back.' },
    ],
    correct: 'b',
    explanation: 'A gift that comes with conditions isn’t a gift. Her answer stands.',
    topicId: 'entitlement',
  },
  sexism: {
    id: 'rc-sexism',
    prompt: 'A friend says, “She shouldn’t have gone to that party if she didn’t want trouble.” What is the accurate response?',
    options: [
      { id: 'a', text: 'He has a point about being careful.' },
      { id: 'b', text: 'Going to a party doesn’t cause harm; the person who harms is responsible.' },
      { id: 'c', text: 'Say nothing to keep the peace.' },
    ],
    correct: 'b',
    explanation: 'Placing responsibility on her for someone else’s choice is victim-blaming. Lead with the fact.',
    topicId: 'sexism',
  },
  'peer-norms': {
    id: 'rc-peer',
    prompt: 'In a group, everyone laughs at a joke about a classmate’s body. You think most people are uncomfortable but laughing anyway. What is a realistic step?',
    options: [
      { id: 'a', text: 'Laugh too — everyone else is.' },
      { id: 'b', text: 'Don’t laugh, and say something short like “Not cool.”' },
      { id: 'c', text: 'Post about it publicly to shame the person who joked.' },
    ],
    correct: 'b',
    explanation: 'A short response can give others permission to disagree too, without humiliating anyone.',
    topicId: 'peer-norms',
  },
  digital: {
    id: 'rc-digital',
    prompt: 'A friend shows you private screenshots of his ex’s messages and says he’ll send them to her new class group. What is the best response?',
    options: [
      { id: 'a', text: 'Tell him not to — sharing her private messages without consent is harmful — and don’t forward them yourself.' },
      { id: 'b', text: 'Ask him to send them to you first.' },
      { id: 'c', text: 'It’s fine if the messages are true.' },
    ],
    correct: 'a',
    explanation: 'Private material shared to humiliate someone is harmful whether or not it is true. Refuse to take part.',
    topicId: 'digital',
  },
  power: {
    id: 'rc-power',
    prompt: 'A professor offers a student extra marks if she helps him “privately” at his home on weekends. Why is this concerning?',
    options: [
      { id: 'a', text: 'It isn’t; extra marks are a good deal.' },
      { id: 'b', text: 'He controls her grades and is linking them to private time — she may not feel free to refuse.' },
      { id: 'c', text: 'Only if other students find out.' },
    ],
    correct: 'b',
    explanation: 'Linking academic benefits to private time is a power imbalance. Institutions are expected to provide a route for concerns.',
    topicId: 'power',
  },
  control: {
    id: 'rc-control',
    prompt: 'A partner tracks your location “because I worry” and gets angry when you turn it off. What does the anger tell you?',
    options: [
      { id: 'a', text: 'That they love you a lot.' },
      { id: 'b', text: 'That saying no has a cost — a sign of control rather than care.' },
      { id: 'c', text: 'Nothing; everyone shares locations.' },
    ],
    correct: 'b',
    explanation: 'Care can accept a no. When declining leads to anger or punishment, it’s control presented as care.',
    topicId: 'control',
  },
  support: {
    id: 'rc-support',
    prompt: 'A friend tells you a senior touched her without consent. She hasn’t decided what to do. What should you avoid?',
    options: [
      { id: 'a', text: 'Saying it isn’t her fault.' },
      { id: 'b', text: 'Going to the committee yourself with her name, without asking her.' },
      { id: 'c', text: 'Offering to find information about support options.' },
    ],
    correct: 'b',
    explanation: 'Taking over removes her choice. Support her decision; offer information and company.',
    topicId: 'support',
  },
  institutions: {
    id: 'rc-institutions',
    prompt: 'You look for your college’s committee contacts and can’t find them anywhere. What does that suggest?',
    options: [
      { id: 'a', text: 'Students don’t need to know.' },
      { id: 'b', text: 'An institutional gap — this information should be published and easy to find.' },
      { id: 'c', text: 'The college doesn’t have any problems.' },
    ],
    correct: 'b',
    explanation: 'Clear, published routes are part of an institution’s responsibility. Missing information is worth raising.',
    topicId: 'institutions',
  },
  barriers: {
    id: 'rc-barriers',
    prompt: 'The complaint form is only in English and only available at an office up two flights of stairs. Who might find it harder to use?',
    options: [
      { id: 'a', text: 'No one — it’s open to everyone.' },
      { id: 'b', text: 'People less comfortable in English, or with mobility needs, among others.' },
      { id: 'c', text: 'Only people who don’t really need it.' },
    ],
    correct: 'b',
    explanation: 'Open is not the same as accessible. Ask who finds a route hardest to use.',
    topicId: 'barriers',
  },
};
