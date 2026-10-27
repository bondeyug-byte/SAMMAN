// Understanding checks by age group. Draft content; professional review pending.
// These check understanding of ideas. They do not assess personality, predict behaviour,
// or certify anyone. Under-18 content is intentionally NOT provided.

export interface QuizOption {
  id: string;
  text: string;
}
export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  correct: string;
  explanation: string;
  hint?: string;
  topicId: string;
}
export interface QuizGroup {
  id: string;
  label: string;
  ages: string;
  description: string;
  available: boolean;
  unavailableReason?: string;
  questions: QuizQuestion[];
}

export const quizGroups: QuizGroup[] = [
  {
    id: 'first-years',
    label: 'First-year students',
    ages: '18–19',
    description: 'New to college: orientation, hostels, seniors, group chats and new relationships.',
    available: true,
    questions: [
      {
        id: 'fy1',
        prompt: 'At an orientation party, someone agreed to kiss earlier in the evening. Later they seem hesitant. What does the earlier agreement mean now?',
        options: [
          { id: 'a', text: 'It still counts, because they already said yes tonight.' },
          { id: 'b', text: 'It doesn’t decide anything now. Hesitation means stop and check.' },
          { id: 'c', text: 'It counts unless they clearly say “no”.' },
        ],
        correct: 'b',
        explanation: 'Consent is ongoing. An earlier yes describes that moment, not this one. Hesitation is a signal to pause and check — not to wait for a firm no.',
        hint: 'Think about whether agreement can change during an evening.',
        topicId: 'consent',
      },
      {
        id: 'fy2',
        prompt: 'A senior tells first-years in the hostel to rate female classmates’ looks in a group chat “as a tradition”. Which description fits best?',
        options: [
          { id: 'a', text: 'Harmless bonding that everyone goes through.' },
          { id: 'b', text: 'Pressure from someone with power, asking juniors to take part in objectifying classmates.' },
          { id: 'c', text: 'Only a problem if the classmates find out.' },
        ],
        correct: 'b',
        explanation: 'Seniority gives the request weight, and the activity reduces classmates to their appearance. The harm doesn’t depend on whether they find out. Seniors pressuring juniors may also fall under college anti-ragging rules (verification pending).',
        topicId: 'power',
      },
      {
        id: 'fy3',
        prompt: 'An edited sexualised picture of a classmate appears in your class chat. What is the safest first step?',
        options: [
          { id: 'a', text: 'Forward it to a friend to ask whether it’s real.' },
          { id: 'b', text: 'Don’t save or forward it; report it on the platform and, if safe, ask for it to be deleted.' },
          { id: 'c', text: 'Ignore it — it’s probably AI, so it doesn’t matter.' },
        ],
        correct: 'b',
        explanation: 'Every forward makes another copy. Whether or not it is “real”, it uses a real person’s identity without consent. Reporting and asking for deletion limit spread without exposing her further.',
        topicId: 'digital',
      },
      {
        id: 'fy4',
        prompt: 'Your friend has messaged someone twelve times after she said “please stop”. He asks you to help write something funny. What does her message mean?',
        options: [
          { id: 'a', text: 'She is testing how much he likes her.' },
          { id: 'b', text: 'She wants him to wait a while and try again.' },
          { id: 'c', text: 'She has asked him to stop; continuing is unwanted contact.' },
        ],
        correct: 'c',
        explanation: '“Please stop” means stop. Treating it as a test or a delay overrides her answer. You can be kind to your friend and still decline to help.',
        topicId: 'entitlement',
      },
      {
        id: 'fy5',
        prompt: 'Five older students are making comments about a junior’s clothes at the bus stop. You are alone. Which response is reasonable?',
        options: [
          { id: 'a', text: 'You must confront them directly, or you’re part of the problem.' },
          { id: 'b', text: 'Create a distraction, such as asking her to walk with you, or get a guard — then check on her.' },
          { id: 'c', text: 'Film it and post it so people know.' },
        ],
        correct: 'b',
        explanation: 'Physical confrontation is never required. Interrupting, getting help and checking in afterwards are safe, effective options. Posting a video can expose her without her consent.',
        topicId: 'sexism',
      },
      {
        id: 'fy6',
        prompt: 'A new hostel friend tells you something unwanted happened at a party and asks you not to tell anyone. What should you avoid?',
        options: [
          { id: 'a', text: 'Asking lots of questions to work out exactly what happened.' },
          { id: 'b', text: 'Thanking her for telling you and asking what would help.' },
          { id: 'c', text: 'Being honest about what you can and can’t promise.' },
        ],
        correct: 'a',
        explanation: 'Support is not investigation. Detailed questioning can feel like being doubted. Listening, believing that it matters, and asking what would help are the core of a supportive response.',
        topicId: 'support',
      },
      {
        id: 'fy7',
        prompt: 'Where should information about who handles sexual harassment concerns at college come from?',
        options: [
          { id: 'a', text: 'Senior students’ advice in WhatsApp groups.' },
          { id: 'b', text: 'Official, current details published by the college, such as its Internal Complaints Committee.' },
          { id: 'c', text: 'There is no need to know until something happens.' },
        ],
        correct: 'b',
        explanation: 'Institutions are expected to publish committee contacts and processes. Knowing in advance makes it easier to help yourself or a friend. If you can’t find the details, that is an institutional gap worth raising.',
        topicId: 'institutions',
      },
      {
        id: 'fy8',
        prompt: 'Someone says, “If she didn’t want attention, she wouldn’t dress like that.” What is the accurate response?',
        options: [
          { id: 'a', text: 'Clothing doesn’t cause harassment; responsibility lies with the person who harasses.' },
          { id: 'b', text: 'It depends on what she was wearing.' },
          { id: 'c', text: 'Both sides have a point.' },
        ],
        correct: 'a',
        explanation: 'This is victim-blaming. Women should not have to restrict their lives to prevent someone else’s behaviour.',
        topicId: 'sexism',
      },
    ],
  },
  {
    id: 'senior-students',
    label: 'Students',
    ages: '20–22',
    description: 'Relationships, internships, leadership roles, and supporting friends.',
    available: true,
    questions: [
      {
        id: 'ss1',
        prompt: 'A couple has been together for a year. One partner says “not tonight”. Which response respects that?',
        options: [
          { id: 'a', text: '“Why? We’ve done this before.”' },
          { id: 'b', text: '“Okay.” — and no sulking afterwards.' },
          { id: 'c', text: '“Fine,” and then going quiet for the rest of the evening.' },
        ],
        correct: 'b',
        explanation: 'A relationship doesn’t create permission. Asking for reasons or going cold makes saying no costly — a form of pressure. “Okay” is a complete response.',
        topicId: 'consent',
      },
      {
        id: 'ss2',
        prompt: 'A manager says, “Let’s discuss your job offer over dinner — just us, keep it between us.” What makes this concerning?',
        options: [
          { id: 'a', text: 'Nothing; managers often have dinner with interns.' },
          { id: 'b', text: 'He controls her offer, and is mixing it with personal attention and secrecy.' },
          { id: 'c', text: 'It’s only concerning if she feels uncomfortable.' },
        ],
        correct: 'b',
        explanation: 'Power over someone’s future makes saying no harder. Secrecy and linking opportunity to personal time are warning signs, whatever she feels in the moment. Workplaces are expected to have an Internal Committee under the POSH Act (verification pending).',
        topicId: 'power',
      },
      {
        id: 'ss3',
        prompt: 'A partner demands your phone password “to prove you have nothing to hide”. Which statement is most accurate?',
        options: [
          { id: 'a', text: 'Sharing passwords on demand is the best proof of trust.' },
          { id: 'b', text: 'If saying no leads to anger or accusations, this is control presented as care.' },
          { id: 'c', text: 'One request means the whole relationship is abusive.' },
        ],
        correct: 'b',
        explanation: 'Trust that has to be enforced isn’t trust. Patterns matter more than one moment, so a single request doesn’t define a relationship — but a no that carries a cost is a warning sign.',
        topicId: 'control',
      },
      {
        id: 'ss4',
        prompt: 'As fest head, you hear a junior was moved off her team after raising a concern about a senior. What is the best description?',
        options: [
          { id: 'a', text: 'A normal reshuffle; no need to think further.' },
          { id: 'b', text: 'Possible retaliation, which is a separate concern the institution should be able to consider.' },
          { id: 'c', text: 'Proof the senior did something wrong.' },
        ],
        correct: 'b',
        explanation: 'A change that follows a concern may be retaliation. You can’t decide that yourself, but you can notice it and make sure she knows the route to raise it. UGC 2015 regulations include protection against victimisation (verification pending).',
        topicId: 'institutions',
      },
      {
        id: 'ss5',
        prompt: 'A friend was turned down and wants to post the other person’s old chats on a meme page. What response separates feeling from action?',
        options: [
          { id: 'a', text: '“That hurt — I get it. Posting her chats to humiliate her isn’t okay.”' },
          { id: 'b', text: '“Do what you want, not my business.”' },
          { id: 'c', text: '“She deserves it for embarrassing you.”' },
        ],
        correct: 'a',
        explanation: 'You can acknowledge disappointment without supporting retaliation. A no is not a debt.',
        topicId: 'entitlement',
      },
      {
        id: 'ss6',
        prompt: 'A friend wants to post an allegation online on behalf of someone else who hasn’t asked for it. What is the main problem?',
        options: [
          { id: 'a', text: 'It takes the decision away from the person affected and may expose her further.' },
          { id: 'b', text: 'Online posts are never seen by anyone.' },
          { id: 'c', text: 'There is no problem if the allegation is true.' },
        ],
        correct: 'a',
        explanation: 'Supporting someone means following their choices. Public posts can identify them, spread further harm, and carry legal risks for the poster.',
        topicId: 'support',
      },
      {
        id: 'ss7',
        prompt: 'Your friend group laughs at a joke implying a classmate got her internship through her looks. What is a realistic first step?',
        options: [
          { id: 'a', text: 'Laugh along, then apologise to her privately later.' },
          { id: 'b', text: 'Don’t laugh, and say something short like “She worked hard for that.”' },
          { id: 'c', text: 'Give a long speech about sexism.' },
        ],
        correct: 'b',
        explanation: 'A short, calm response shifts the room without escalation. Many people in a group privately disagree; someone has to say it first.',
        topicId: 'peer-norms',
      },
      {
        id: 'ss8',
        prompt: 'What does completing a programme like SAMMAN show about a person?',
        options: [
          { id: 'a', text: 'That they are safe.' },
          { id: 'b', text: 'That they have taken part — nothing about their future behaviour.' },
          { id: 'c', text: 'That they will intervene as a bystander.' },
        ],
        correct: 'b',
        explanation: 'Research finds education changes attitudes more reliably than behaviour. Completion certifies nothing about safety.',
        topicId: 'institutions',
      },
    ],
  },
  {
    id: 'supporting-adults',
    label: 'Adults supporting students',
    ages: 'Parents, teachers and staff',
    description: 'Responding to a disclosure, avoiding blame, knowing your role and its limits.',
    available: true,
    questions: [
      {
        id: 'sa1',
        prompt: 'A student tells you something happened at a party. What is the best first response?',
        options: [
          { id: 'a', text: '“Why were you there so late?”' },
          { id: 'b', text: '“Thank you for telling me. It’s not your fault. What would help right now?”' },
          { id: 'c', text: '“Tell me everything that happened, in order.”' },
        ],
        correct: 'b',
        explanation: 'Blame and detailed questioning are associated with worse outcomes for people who disclose. Listen, believe that it matters, and ask what they need.',
        topicId: 'support',
      },
      {
        id: 'sa2',
        prompt: 'As a staff member, a student asks you to promise total secrecy before telling you something. What should you do?',
        options: [
          { id: 'a', text: 'Promise, so that they will talk.' },
          { id: 'b', text: 'Explain honestly what you can and cannot keep confidential in your role, then let them decide.' },
          { id: 'c', text: 'Refuse to listen until they agree to a formal complaint.' },
        ],
        correct: 'b',
        explanation: 'A broken promise damages trust. Know your role’s duties and your institution’s procedure before such conversations, and explain them clearly.',
        topicId: 'support',
      },
      {
        id: 'sa3',
        prompt: 'The student who discloses is 17. What changes?',
        options: [
          { id: 'a', text: 'Nothing; treat them exactly as an adult.' },
          { id: 'b', text: 'Different legal duties may apply (for example under the POCSO Act). Follow the institution’s procedure and seek qualified advice.' },
          { id: 'c', text: 'You must investigate yourself before doing anything.' },
        ],
        correct: 'b',
        explanation: 'In India, legal duties can differ when someone is under 18. This summary is not legal advice; the institution’s under-18 procedure must be reviewed by a qualified lawyer. Never investigate yourself.',
        topicId: 'institutions',
      },
      {
        id: 'sa4',
        prompt: 'Your adult daughter tells you about a friend being pressured by a boyfriend. Which response avoids protective framing that limits women’s choices?',
        options: [
          { id: 'a', text: '“This is why girls shouldn’t go out with boys.”' },
          { id: 'b', text: '“That sounds hard for her. What do you think she wants? How can you support her?”' },
          { id: 'c', text: '“Tell her to stop seeing her friends so it doesn’t happen again.”' },
        ],
        correct: 'b',
        explanation: 'Restricting women’s lives isn’t prevention. Responsibility lies with the person applying pressure. Supporting the friend’s own choices matters most.',
        topicId: 'control',
      },
      {
        id: 'sa5',
        prompt: 'In class, a student says, “She was drinking, so she’s partly responsible.” What should an educator do?',
        options: [
          { id: 'a', text: 'Let the class debate it as one opinion.' },
          { id: 'b', text: 'Correct it calmly with the fact first: responsibility lies with the person who chooses to harm.' },
          { id: 'c', text: 'Ignore it to avoid conflict.' },
        ],
        correct: 'b',
        explanation: 'Victim-blaming should be corrected, not balanced. Lead with the accurate statement rather than repeating the myth, then ask what the comment assumes.',
        topicId: 'sexism',
      },
      {
        id: 'sa6',
        prompt: 'What should an institution publish so students can find help?',
        options: [
          { id: 'a', text: 'Only a general email address.' },
          { id: 'b', text: 'Committee composition and contacts, a plain-language process, confidentiality limits and protection against retaliation.' },
          { id: 'c', text: 'Nothing; students should ask a teacher.' },
        ],
        correct: 'b',
        explanation: 'Clear, accessible information is part of institutional responsibility. The Supreme Court has directed institutions to publish committee details (secondary source; verification pending).',
        topicId: 'institutions',
      },
    ],
  },
  {
    id: 'under-18',
    label: 'Under 18',
    ages: 'Children and adolescents',
    description: 'Age-appropriate content for younger people.',
    available: false,
    unavailableReason:
      'Not available. Content for children and adolescents must be developed separately — not adapted from this adult material — with specialist review, safeguarding design, permissions, developmental adaptation and checks of mandatory-reporting duties. None of that has happened yet.',
    questions: [],
  },
];
