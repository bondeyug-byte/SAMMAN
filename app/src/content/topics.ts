import type { Topic } from './types';

// Draft educational content. Requires professional review before delivery.
// Legal notes are reference points only, not legal advice, and carry verification labels.

export const topics: Topic[] = [
  {
    id: 'consent',
    letter: 'A',
    title: 'Consent and autonomy',
    summary: 'Voluntary choice, boundaries, pressure, changing one’s mind, and assumptions based on relationships or earlier interactions.',
    explanation: [
      'Consent is a voluntary, specific and ongoing agreement. It applies to a particular act at a particular time, and either person can change their mind.',
      'Agreement given because someone feels worn down, afraid of the consequences, or unable to say no freely is not the same as a free choice. Silence, stillness or not pushing someone away is not agreement.',
      'Being in a relationship, having agreed before, or having flirted earlier does not create permission now. Each person keeps the right to decide.',
      'Alcohol and drugs can affect a person’s ability to understand and choose. If you are unsure whether someone is able to decide, the respectful choice is to stop.',
    ],
    justifications: [
      { claim: '“We have done this before.”', response: 'Past agreement describes the past. It does not decide what someone wants today.' },
      { claim: '“She didn’t say no.”', response: 'The question is whether there was a clear, willing yes — not whether someone managed to refuse.' },
      { claim: '“I only asked a few more times.”', response: 'Repeated asking after a no or a hesitation is pressure. It makes the other person responsible for refusing again and again.' },
    ],
    alternatives: [
      'Ask, and treat hesitation as a no for now.',
      'Make stopping easy and free of sulking, guilt or cost.',
      'Check in again rather than assuming the earlier answer still stands.',
    ],
    reflection: [
      'What makes it hard for someone to say no in a relationship that matters to them?',
      'How can a person make it clear that stopping will not cost the other person anything?',
    ],
    lawNote:
      'Indian criminal law (Bharatiya Nyaya Sanhita, 2023, s.63, Explanation 2) describes consent as an unequivocal voluntary agreement to the specific act, and says lack of physical resistance is not, by that fact alone, consent. The same section keeps an exception for married couples that is under constitutional challenge, and most sexual-offence sections are framed around women as victims. SAMMAN’s principles apply to everyone and are educational, not a statement of what the law currently provides. Status: secondary sources; legal review required.',
    scenarioIds: ['after-not-tonight', 'only-a-joke'],
  },
  {
    id: 'entitlement',
    letter: 'B',
    title: 'Entitlement and rejection',
    summary: 'Believing attention, intimacy or affection is owed; treating gifts or spending as an obligation; accepting rejection without pressure or retaliation.',
    explanation: [
      'Entitlement is the belief that someone owes you attention, affection, time or intimacy — because you were kind, spent money, waited, or feel strongly.',
      'Rejection can hurt. The disappointment is real, and it belongs to the person who feels it. It is not the other person’s job to manage it.',
      'Responding to a no with bargaining, guilt, persistence, humiliation, threats or retaliation turns disappointment into harm. Most people who are rejected do none of these things; the point is to recognise the pattern early.',
    ],
    justifications: [
      { claim: '“I spent so much on her.”', response: 'A gift is not a contract. If it came with conditions, it was not a gift.' },
      { claim: '“Persistence is romantic.”', response: 'After a clear no, persistence tells the other person their answer does not count.' },
      { claim: '“She led me on.”', response: 'Friendliness, replies or past interest do not oblige anyone to continue.' },
    ],
    alternatives: [
      'Say: “Okay. Thanks for being straight with me.”',
      'Talk to a friend or counsellor about the disappointment, not about getting back at someone.',
      'As a friend, separate the feeling (“that hurts”) from the action (“and posting her chats is not okay”).',
    ],
    reflection: [
      'What do friends say after someone is rejected? What do those words encourage?',
      'What does it look like to take responsibility for your own disappointment?',
    ],
    scenarioIds: ['just-persistent', 'the-plan'],
  },
  {
    id: 'sexism',
    letter: 'C',
    title: 'Everyday sexism',
    summary: 'Objectification, degrading jokes, victim-blaming, unequal standards, and dismissing discomfort.',
    explanation: [
      'Everyday sexism includes reducing a person to how they look, jokes that degrade women, holding women to different standards, and treating a woman’s boundary-setting as arrogance.',
      'These behaviours differ in seriousness and consequences from assault. They are not all the same thing, and one does not inevitably lead to another. They can, however, share an assumption: that women’s comfort, choices or achievements matter less.',
      'Challenging conduct is different from diagnosing someone’s character. The aim is to question what was said or done.',
    ],
    justifications: [
      { claim: '“It was only a joke.”', response: 'A joke can still tell people what the group finds acceptable. Who is the joke at the expense of?' },
      { claim: '“She’s overreacting.”', response: 'Discomfort is information. Dismissing it teaches people not to raise it.' },
      { claim: '“Look at what she was wearing.”', response: 'Clothing does not cause harassment or assault. Responsibility lies with the person who chooses to harm.' },
    ],
    alternatives: [
      'Don’t laugh. A flat “not funny” changes the room more than people expect.',
      'Ask a genuine question: “What do you mean by that?”',
      'Check in privately with the person targeted, if they want that.',
    ],
    reflection: ['Which comments do you hear often enough that they stop being noticed?'],
    scenarioIds: ['only-a-joke', 'outnumbered'],
  },
  {
    id: 'peer-norms',
    letter: 'D',
    title: 'Peer norms',
    summary: 'Laughing along, defending friends automatically, challenging harmful conduct, and seeking support safely.',
    explanation: [
      'People often laugh along or stay quiet to keep their place in a group. Research in the US suggests many young men overestimate how much their peers approve of sexist talk, and that this belief makes them less likely to speak up. Whether this holds among Indian students has not been measured.',
      'A group can set clear expectations: “we don’t share people’s pictures”, “we don’t pile on someone who said no”.',
      'Challenging a friend does not require public humiliation. Organising a pile-on can create a new harm.',
    ],
    justifications: [
      { claim: '“He’s our friend — he’d never do that.”', response: 'Loyalty to a friend does not require deciding what happened before anyone has listened.' },
      { claim: '“Everyone thinks the same; I’d look weird.”', response: 'Others in the group may privately disagree too. Someone has to say it first.' },
    ],
    alternatives: [
      'Speak to the friend privately and directly.',
      'Find one other person who agrees before raising it with the group.',
      'Name the group expectation, not the person’s character.',
    ],
    reflection: ['What would it take for your group to change one shared habit?'],
    scenarioIds: ['just-persistent', 'forwarded', 'the-plan'],
  },
  {
    id: 'digital',
    letter: 'E',
    title: 'Digital boundaries',
    summary: 'Repeated unwanted contact, password demands, location monitoring, sharing private material, and non-consensual sexualised edits.',
    explanation: [
      'Repeated messages after someone has asked you to stop, creating new accounts to reach them, and asking friends to message on your behalf are all ways of overriding their choice.',
      'Demanding passwords or tracking someone’s location can be presented as care or trust. It is control when one person cannot say no without consequences.',
      'Sharing a person’s private messages or images without permission — or creating or forwarding a sexualised edit of them — is a serious harm, whether or not the image is “real”. Forwarding it once still spreads it.',
      'This module describes the harm and how to respond. It does not, and will not, explain how such material is made or distributed.',
    ],
    justifications: [
      { claim: '“It’s AI, it isn’t even real.”', response: 'The harm is real: it uses a real person’s identity without their consent and others can still see it.' },
      { claim: '“Sharing it once doesn’t matter.”', response: 'Each forward creates another copy outside anyone’s control.' },
      { claim: '“If you have nothing to hide, show me your phone.”', response: 'Privacy is not a confession. Trust that is enforced is not trust.' },
    ],
    alternatives: [
      'Don’t open, save or forward. Report the content on the platform.',
      'Ask the sender privately to delete it, if that is safe.',
      'Tell the person affected only in a way that respects their choices, and share options rather than taking over.',
    ],
    reflection: ['What group-chat norms would make forwarding less likely?'],
    lawNote:
      'Reference points (verification pending, not legal advice): BNS 2023 s.77 covers voyeurism and sharing intimate images without consent, even where the original capture was agreed; s.78 covers repeated unwanted contact and monitoring of a woman’s electronic communication. IT Act 2000 s.66E (privacy) is gender-neutral. Under 2026 amendments to the IT Rules, platforms are reportedly required to remove non-consensual intimate or morphed imagery within 2 hours of a complaint (previously 24). Status: secondary sources; official gazette text not checked; legal review required.',
    scenarioIds: ['forwarded', 'just-persistent'],
  },
  {
    id: 'power',
    letter: 'F',
    title: 'Power imbalances',
    summary: 'Senior–junior, teacher–student and supervisor–intern situations; fear of losing opportunities; retaliation; conflicts of interest.',
    explanation: [
      'When one person controls grades, references, roles, accommodation or belonging, the other person may go along with things they do not want. Apparent agreement does not mean they had an equal choice.',
      'Pressure can be disguised as opportunity: “let’s discuss your future over dinner”, “keep this between us”.',
      'Retaliation after a concern is raised — losing a role, being excluded, being given worse work — is a separate harm. Institutions are expected to protect against it.',
    ],
    justifications: [
      { claim: '“She agreed to go.”', response: 'Ask what she believed would happen if she said no.' },
      { claim: '“He’s brilliant at his job.”', response: 'Being good at a role does not decide whether a concern is valid. It can make speaking up harder.' },
    ],
    alternatives: [
      'Keep work and personal attention separate if you hold power.',
      'If you notice a pattern, check in with the junior person privately and share options.',
      'Know who in the institution handles these concerns, and how.',
    ],
    reflection: ['Where in your college does one person’s decision affect another’s future?'],
    lawNote:
      'Institutional routes (verification pending): the UGC 2015 regulations on sexual harassment in higher education require an Internal Complaints Committee with student members and protection against victimisation. The POSH Act 2013 applies to workplaces, which can include internships. Exact provisions and how they apply must be confirmed with the host institution and a qualified lawyer.',
    scenarioIds: ['senior-everyone-likes', 'the-internship'],
  },
  {
    id: 'control',
    letter: 'G',
    title: 'Control disguised as care',
    summary: 'Restrictions on friendships or communication, demands to prove loyalty, and jealousy used as justification.',
    explanation: [
      'Controlling behaviour often arrives with a caring explanation: “I just worry about you”, “I only want to know you’re safe”.',
      'Patterns matter more than single moments: limiting who someone sees, what they wear, where they go, or checking their phone, especially when saying no leads to anger, sulking or threats.',
      'One answer in a scenario or quiz cannot describe a whole relationship. If something here feels familiar, general support routes are listed on the Support page.',
    ],
    justifications: [
      { claim: '“I’m jealous because I love you.”', response: 'Feelings are real; the choice to restrict someone because of them is still a choice.' },
      { claim: '“If you loved me, you’d share your password.”', response: 'Love does not require giving up privacy on demand.' },
    ],
    alternatives: [
      'Talk about the worry instead of making a rule for the other person.',
      'Agree on shared expectations that both people can freely decline.',
    ],
    reflection: ['How do you tell the difference between care and control?'],
    scenarioIds: ['after-not-tonight'],
  },
  {
    id: 'support',
    letter: 'H',
    title: 'Supportive responses',
    summary: 'Listening without blame, respecting choices, avoiding interrogation, and explaining limits.',
    explanation: [
      'How someone responds when a person shares a difficult experience matters. Research links blaming, disbelieving or taking control with worse wellbeing for the person who disclosed. These studies are correlational, but taking control — pushing someone to report, or acting without asking — is a common reaction even among well-meaning friends.',
      'Supportive listening is not an investigation. You do not need proof, details or a decision about what happened. Your role is to listen, believe that this matters to them, and ask what they want.',
      'Be honest about your limits. Don’t promise secrecy you cannot keep. If you hold a formal role, find out before any conversation what you are required to do.',
    ],
    justifications: [
      { claim: '“I need to know exactly what happened to help.”', response: 'You do not. Asking for details can feel like being questioned. Ask what would help.' },
      { claim: '“If it was serious, she would have reported it.”', response: 'People have many reasons not to report, including fear of being judged or not believed.' },
    ],
    alternatives: [
      '“Thank you for telling me. It’s not your fault. What would help right now?”',
      '“I won’t share this without your OK.” (Only if true for your role.)',
      '“Would you like me to find out what support is available, or come with you?”',
    ],
    reflection: ['What would you want someone to say if you shared something difficult?'],
    scenarioIds: ['dont-tell-anyone', 'outnumbered'],
  },
  {
    id: 'barriers',
    letter: 'I',
    title: 'Access barriers',
    summary: 'Fictional examples of how language, disability, financial dependence or discrimination can affect access to support.',
    explanation: [
      'The same support route can be harder to use for some people. A form only in English, an office up a flight of stairs, a scholarship that depends on staying quiet, or a fear of being treated differently because of caste, community or sexuality can each stand in the way.',
      'Examples here are fictional and are not descriptions of any group. Experiences differ between people within every group.',
      'SAMMAN does not ask for, record or infer anyone’s caste, religion, sexuality, disability or personal history.',
    ],
    justifications: [
      { claim: '“The process is open to everyone.”', response: 'Open is not the same as accessible. Ask who finds it hardest to use and why.' },
    ],
    alternatives: [
      'Offer information in more than one format and language (once reviewed translations exist).',
      'Ask the person what would make support easier to reach, rather than assuming.',
    ],
    reflection: ['Fictional example: a student whose fee waiver depends on a staff member’s recommendation. What might make raising a concern harder for her?'],
    scenarioIds: ['the-internship', 'senior-everyone-likes'],
  },
  {
    id: 'institutions',
    letter: 'J',
    title: 'Institutional responsibility',
    summary: 'Clear support roles, accessible information, appropriate procedures and fair handling.',
    explanation: [
      'A course cannot substitute for a responsible institution. Students need to know who to contact, what will happen next, what is kept confidential and what is not, and how they will be protected from retaliation.',
      'Fair procedures matter for everyone involved. Education is not adjudication: this programme does not decide whether something happened.',
      'Reviews of prevention programmes suggest institution-wide measures — policy, staffing, safe environments — matter alongside classroom sessions.',
    ],
    justifications: [
      { claim: '“We have a committee; that’s enough.”', response: 'A committee that students cannot find, reach or trust does not function as support.' },
    ],
    alternatives: [
      'Publish committee composition, contacts and process in plain language.',
      'Review the information regularly and name who is responsible for updates.',
    ],
    reflection: ['If you needed help tomorrow, would you know where to go?'],
    scenarioIds: ['senior-everyone-likes', 'the-internship'],
  },
];

export const topicById = Object.fromEntries(topics.map((t) => [t.id, t])) as Record<string, Topic>;
