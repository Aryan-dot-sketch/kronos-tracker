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
      name: 'Primary Target',
      type: 'Competitive Exam / Goal',
      target: '99 Percentile / Target Score',
      deadlineISO: '2027-01-15T09:00:00+05:30',
      dailyHours: 8,
      progress: 0,
      phase: 'Syllabus & Core Problem Solving',
      weakArea: 'Configure Weak Area in Goal View',
      riskLevel: 'On Track',
      prepStrategy: 'Consistent daily practice, module coverage, and weekly test evaluation.',
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
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
    chapters: []
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
      subjects: input.goal?.subjects && input.goal.subjects.length > 0
        ? input.goal.subjects
        : ['Physics', 'Chemistry', 'Mathematics'],
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
    chapters: (input.chapters || []).map(c => ({
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
