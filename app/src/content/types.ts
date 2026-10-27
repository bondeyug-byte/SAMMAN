// Shared content types. All content lives in /src/content and is kept separate from UI.

/** How a response is characterised. Never a score; never a judgement of the person. */
export type ResponseKind =
  | 'harmful' // clearly harmful: requires direct correction
  | 'partial' // well-meant or understandable, but with a real problem
  | 'reasonable' // one of several reasonable, safe responses
  | 'needs-support'; // more information or professional help is needed

export const KIND_LABEL: Record<ResponseKind, string> = {
  harmful: 'Needs correcting',
  partial: 'Partly helpful — with a problem',
  reasonable: 'A reasonable response',
  'needs-support': 'Needs more support than one person can give',
};

export interface ScenarioOption {
  id: string;
  label: string;
  kind: ResponseKind;
  /** One-sentence response to the choice. Leads with the fact, not the myth. */
  headline: string;
  /** What assumption is operating? */
  assumption: string;
  /** Whose choice is being disregarded — or respected? */
  choice: string;
  /** What could be done safely? */
  safely: string;
  /** Next stage id. Omit to end the scenario. */
  next?: string;
  /** Topic ids to suggest revisiting if this option is chosen. */
  revisit?: string[];
}

export interface ScenarioStage {
  id: string;
  title: string;
  /** Short narrative paragraphs. Non-graphic. */
  narrative: string[];
  question: string;
  options: ScenarioOption[];
  /** What responsibility belongs to each person? (applies to the stage) */
  responsibility: string;
  /** What is outside your role? (applies to the stage) */
  outsideRole: string;
}

export interface Character {
  name: string;
  role: string;
}

export interface Scenario {
  id: string;
  title: string;
  summary: string;
  topicIds: string[];
  sessionId: string;
  contentNote: string;
  readingMinutes: number;
  setting: string;
  characters: Character[];
  power: string;
  perspective: string;
  stages: ScenarioStage[];
  /** Short ending text after the final stage. */
  closing: string;
  reflection: string;
  facilitatorPrompt: string;
}

export interface Topic {
  id: string;
  letter: string;
  title: string;
  summary: string;
  explanation: string[];
  justifications: { claim: string; response: string }[];
  alternatives: string[];
  reflection: string[];
  lawNote?: string;
  scenarioIds: string[];
}

export interface Session {
  id: string;
  number: string;
  title: string;
  duration: string;
  objectives: string[];
  preparation: string[];
  contentNote: string;
  sequence: { time: string; activity: string; detail: string }[];
  scenarioIds: string[];
  topicIds: string[];
  discussion: string[];
  reflection: string;
  takeaway: string;
  followUp: string;
}

export type VerificationStatus =
  | 'Official source'
  | 'Secondary'
  | 'Secondary – verify'
  | 'News'
  | 'Unverified'
  | 'Verification pending';

export interface SupportEntry {
  id: string;
  name: string;
  contact: { label: string; value: string; dial?: string }[];
  operator: string;
  purpose: string;
  stated: string;
  notStated: string;
  source: { label: string; url?: string }[];
  status: VerificationStatus;
  statusNote: string;
  reviewed: string;
  group: 'urgent' | 'national' | 'local' | 'online' | 'institution';
}

export interface EvidenceRecord {
  claim: string;
  source: string;
  url?: string;
  population: string;
  limitation: string;
  implication: string;
  status: VerificationStatus;
}
