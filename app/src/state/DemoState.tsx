import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ReadinessStatus } from '../content/institutions';

// All demo state lives in memory only. Nothing is written to storage or sent anywhere.
// Refreshing the page or choosing “Reset demo” clears it.

export interface StageRecord {
  stageId: string;
  optionId: string;
  attempts: number; // how many responses were tried at this stage
}

export interface ScenarioProgress {
  stageId: string; // current stage
  history: StageRecord[];
  revisit: string[]; // topic ids
  status: 'in-progress' | 'completed' | 'skipped' | 'paused';
}

export type TextSize = 'standard' | 'large' | 'larger';

interface DemoState {
  progress: Record<string, ScenarioProgress>;
  reflections: Record<string, string>;
  questions: { id: string; text: string }[];
  readiness: Record<string, { status: ReadinessStatus; role: string; date: string }>;
  checks: Record<string, boolean>;
  textSize: TextSize;
  showContentNotes: boolean;
  resetCount: number;
}

interface DemoApi extends DemoState {
  setProgress: (id: string, p: ScenarioProgress | undefined) => void;
  setReflection: (key: string, text: string) => void;
  addQuestion: (text: string) => void;
  setReadiness: (id: string, v: Partial<{ status: ReadinessStatus; role: string; date: string }>) => void;
  toggleCheck: (id: string) => void;
  setTextSize: (s: TextSize) => void;
  setShowContentNotes: (v: boolean) => void;
  reset: () => void;
}

const initial = (): DemoState => ({
  progress: {},
  reflections: {},
  questions: [],
  readiness: {},
  checks: {},
  textSize: 'standard',
  showContentNotes: true,
  resetCount: 0,
});

const Ctx = createContext<DemoApi | null>(null);

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [s, set] = useState<DemoState>(initial);

  const setProgress = useCallback((id: string, p: ScenarioProgress | undefined) => {
    set((prev) => {
      const progress = { ...prev.progress };
      if (p) progress[id] = p;
      else delete progress[id];
      return { ...prev, progress };
    });
  }, []);

  const api = useMemo<DemoApi>(
    () => ({
      ...s,
      setProgress,
      setReflection: (key, text) => set((p) => ({ ...p, reflections: { ...p.reflections, [key]: text } })),
      addQuestion: (text) =>
        set((p) => ({ ...p, questions: [...p.questions, { id: String(Date.now()), text }] })),
      setReadiness: (id, v) =>
        set((p) => ({
          ...p,
          readiness: {
            ...p.readiness,
            [id]: { ...{ status: 'Not reviewed' as ReadinessStatus, role: '', date: '' }, ...p.readiness[id], ...v },
          },
        })),
      toggleCheck: (id) => set((p) => ({ ...p, checks: { ...p.checks, [id]: !p.checks[id] } })),
      setTextSize: (textSize) => set((p) => ({ ...p, textSize })),
      setShowContentNotes: (showContentNotes) => set((p) => ({ ...p, showContentNotes })),
      reset: () => set((p) => ({ ...initial(), resetCount: p.resetCount + 1 })),
    }),
    [s, setProgress],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useDemo must be used inside DemoStateProvider');
  return v;
}
