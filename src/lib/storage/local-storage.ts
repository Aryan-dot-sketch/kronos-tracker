import { AppState, Task, JEEChapter } from '@/types';
import { todayId } from '../time/ist';

export const KEY = 'kronos-tracker-state-v3';
export const LEGACY_KEYS = ['kronos-tracker-state-v2', 'kronos-tracker-state-v1'];

export function uid(prefix: string): string {
  return globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function makeTask(
  title: string,
  subject: string,
  priority: 'critical' | 'high' | 'medium' | 'low',
  estimate: number,
  category: string,
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme',
  completed = false,
  notes = ''
): Task {
  return {
    id: uid('task'),
    title,
    subject,
    priority,
    estimate: Number(estimate) || 0,
    category,
    difficulty,
    status: completed ? 'completed' : 'not-started',
    completedAt: completed ? new Date().toISOString() : null,
    notes,
    recoveryStatus: null,
    missedReason: ''
  };
}

// Clean Default JEE Syllabus (0% progress, clean canvas for real students)
export const DEFAULT_JEE_SYLLABUS: JEEChapter[] = [
  // Physics
  { subject: 'Physics', chapter: 'Units, Dimensions & Errors', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Physics', chapter: 'Kinematics 1D & 2D', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Physics', chapter: 'Laws of Motion & Friction', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Physics', chapter: 'Work, Energy & Power', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Physics', chapter: 'Rotational Motion', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Physics', chapter: 'Gravitation', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Physics', chapter: 'Electrostatics', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Physics', chapter: 'Current Electricity', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Physics', chapter: 'Magnetism & Matter', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Physics', chapter: 'Electromagnetic Induction & AC', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Physics', chapter: 'Optics & Wave Optics', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Physics', chapter: 'Modern Physics & Semiconductors', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },

  // Chemistry
  { subject: 'Chemistry', chapter: 'Mole Concept & Stoichiometry', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Chemistry', chapter: 'Atomic Structure', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Chemistry', chapter: 'Chemical Bonding & Molecular Structure', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Chemistry', chapter: 'Thermodynamics & Thermochemistry', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Chemistry', chapter: 'Chemical & Ionic Equilibrium', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Chemistry', chapter: 'Electrochemistry & Kinetics', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Chemistry', chapter: 'GOC — General Organic Chemistry', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Chemistry', chapter: 'Hydrocarbons', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Chemistry', chapter: 'Organic Compounds containing O, N, Halogens', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Chemistry', chapter: 'Coordination Compounds & d-Block', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },

  // Mathematics
  { subject: 'Mathematics', chapter: 'Quadratic Equations & Complex Numbers', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Mathematics', chapter: 'Matrices & Determinants', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Mathematics', chapter: 'Permutations, Combinations & Probability', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Mathematics', chapter: 'Functions, Limits & Continuity', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Mathematics', chapter: 'Differential Calculus & AOD', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Mathematics', chapter: 'Indefinite & Definite Integration', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Mathematics', chapter: 'Differential Equations & Area Under Curves', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Mathematics', chapter: 'Straight Lines & Circles', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Mathematics', chapter: 'Conic Sections', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
  { subject: 'Mathematics', chapter: 'Vectors & 3D Geometry', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' }
];

// Completely Clean Initial Production State
export function cleanState(): AppState {
  const today = todayId();
  return {
    version: 3,
    ui: {
      activeView: 'dashboard',
      theme: 'light',
      taskStatusFilter: 'all',
      taskPriorityFilter: 'all',
      calendarMonthOffset: 0
    },
    settings: {
      name: 'Aspirant',
      mode: 'Strict IST Mode',
      studyDayCutoff: '00:00',
      successThreshold: 70
    },
    goal: {
      name: 'JEE Mains Target',
      type: 'Competitive Exam',
      target: '99 Percentile',
      deadlineISO: '2027-01-15T09:00:00+05:30',
      dailyHours: 8,
      progress: 0,
      phase: 'Syllabus Coverage & PYQ Problem Solving',
      weakArea: 'Configure Weak Area in Goal View',
      riskLevel: 'On Track',
      prepStrategy: 'Focus on consistent problem solving and weekly full mock analysis.',
      milestones: [],
      weeklyTargets: []
    },
    tasksByDate: {
      [today]: []
    },
    history: {},
    reviews: {},
    sessions: [],
    backlog: [],
    mocks: [],
    mistakes: [],
    chapters: DEFAULT_JEE_SYLLABUS
  };
}

export function loadState(): AppState {
  try {
    let raw = localStorage.getItem(KEY);
    if (!raw) {
      for (const legacyKey of LEGACY_KEYS) {
        raw = localStorage.getItem(legacyKey);
        if (raw) break;
      }
    }
    if (raw) return normalizeState(JSON.parse(raw));
  } catch (error) {
    console.warn('Kronos state loading exception:', error);
  }
  return cleanState();
}

export function normalizeState(input: Partial<AppState>): AppState {
  const clean = cleanState();
  const merged: AppState = {
    ...clean,
    ...input,
    version: 3,
    ui: { ...clean.ui, ...(input.ui || {}) },
    settings: { ...clean.settings, ...(input.settings || {}) },
    goal: {
      ...clean.goal,
      ...(input.goal || {}),
      milestones: input.goal?.milestones || [],
      weeklyTargets: input.goal?.weeklyTargets || []
    },
    tasksByDate: input.tasksByDate || { [todayId()]: [] },
    history: input.history || {},
    reviews: input.reviews || {},
    sessions: input.sessions || [],
    backlog: input.backlog || [],
    mocks: (input.mocks || []).map(m => ({
      ...m,
      attempted: m.attempted ?? 0,
      correct: m.correct ?? 0,
      wrong: m.wrong ?? 0,
      timeIssue: m.timeIssue ?? '',
      weakChapters: m.weakChapters ?? ''
    })),
    mistakes: input.mistakes || [],
    chapters: (input.chapters && input.chapters.length > 0 ? input.chapters : clean.chapters).map(c => ({
      ...c,
      lastRevised: c.lastRevised ?? '',
      nextRevision: c.nextRevision ?? ''
    }))
  };

  if (!merged.tasksByDate[todayId()]) {
    merged.tasksByDate[todayId()] = [];
  }
  return merged;
}

export function saveState(state: AppState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Kronos state saving exception:', error);
  }
}
