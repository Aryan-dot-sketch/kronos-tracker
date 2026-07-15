import { AppState, Task } from '@/types';
import { todayId, addDays } from '../time/ist';

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

export function seedState(): AppState {
  const today = todayId();
  const tasksByDate = {
    [today]: [
      makeTask('Physics Electrostatics — solve 40 PYQs', 'Physics', 'critical', 95, 'Practice', 'Hard', true, 'Electric field + potential integration concepts.'),
      makeTask('Chemistry GOC revision — mechanism & resonance notes', 'Chemistry', 'high', 60, 'Revision', 'Medium', true, 'Focused on inductive and electromeric effect.'),
      makeTask('Mathematics Definite Integration — 25 calculus questions', 'Mathematics', 'critical', 90, 'Practice', 'Hard', false, 'Property 4 and Leibnitz rule practice.'),
      makeTask('Full mock test detailed analysis — mistake notebook entry', 'Mock Test', 'high', 45, 'Mock', 'Medium', true, 'Analyzed Physics silly calculation errors.'),
      makeTask('Formula revision — current electricity & circuits', 'Revision', 'medium', 30, 'Revision', 'Easy', false, 'Kirchhoff laws and potentiometer concepts.'),
      makeTask('Night review before IST midnight reset', 'General', 'medium', 15, 'Review', 'Easy', false)
    ]
  };

  const history: AppState['history'] = {};
  const sample = [72, 84, 66, 91, 88, 54, 79, 82, 73, 94, 61, 76, 87, 69, 92, 71, 78, 83, 58, 89, 96, 64, 74, 81, 68, 85, 90, 77, 63, 86, 70, 93, 75, 80, 62, 88];
  
  for (let index = -36; index < 0; index++) {
    const dateId = addDays(today, index);
    const score = sample[(index + 36) % sample.length];
    history[dateId] = {
      dateId,
      completionScore: score,
      timeScore: Math.max(45, Math.min(100, score + (index % 4) * 3)),
      focusScore: Math.max(42, Math.min(100, Math.round(score * 0.85 + 12))),
      studyMinutes: Math.round(260 + score * 2.3 + (index % 5) * 13),
      completedTasks: Math.round(5 + score / 14),
      totalTasks: 12,
      success: score >= 70,
      subjectMinutes: {
        Physics: 95 + (score % 5) * 18,
        Chemistry: 85 + (score % 7) * 14,
        Mathematics: 100 + (score % 6) * 15
      }
    };
  }

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
      name: 'JEE Mains 2027 Command Target',
      type: 'Competitive Exam',
      target: '98.5 Percentile',
      deadlineISO: '2027-01-15T09:00:00+05:30',
      dailyHours: 7.5,
      progress: 45,
      phase: 'Foundation + Intensive PYQ Practice',
      weakArea: 'Physics • Electrostatics & Calculus Integration',
      riskLevel: 'Medium',
      prepStrategy: 'Consistent daily problem solving (40 PYQs/day) with strict evening mock error log review.',
      milestones: [
        { id: uid('m'), title: 'Complete Physics Mechanics & Electrostatics Theory + 200 PYQs', targetDate: addDays(today, 15), completed: true, category: 'Physics' },
        { id: uid('m'), title: 'Finish Physical Chemistry Thermodynamics & Equilibrium', targetDate: addDays(today, 30), completed: false, category: 'Chemistry' },
        { id: uid('m'), title: 'Master Definite Integration & Differential Equations', targetDate: addDays(today, 45), completed: false, category: 'Mathematics' }
      ],
      weeklyTargets: [
        { id: uid('w'), title: 'Solve 150 PYQs across Physics & Chemistry', targetHours: 18, completed: true },
        { id: uid('w'), title: 'Attempt 1 full-length chapter mock test with review', targetHours: 6, completed: false },
        { id: uid('w'), title: 'Log 40 hours of focused study time', targetHours: 40, completed: false }
      ]
    },
    tasksByDate,
    history,
    reviews: {
      [addDays(today, -1)]: {
        wentWell: 'Completed Chemistry GOC PYQs and maintained 8 hours of uninterrupted study time.',
        wentWrong: 'Maths integration practice started late due to afternoon fatigue.',
        distraction: 'Phone notifications during evening study window.',
        learned: 'Keep phone in another room during critical problem solving blocks.',
        tomorrowPriority: 'Solve Physics Electrostatics 40 PYQs first thing in the morning.',
        sleepTarget: '23:30',
        energy: 'High',
        mood: 'Focused',
        savedAt: new Date(Date.now() - 86400000).toISOString()
      }
    },
    sessions: [],
    backlog: [],
    mocks: [
      { id: uid('mock'), dateId: addDays(today, -24), total: 112, physics: 34, chemistry: 42, math: 36, attempted: 54, correct: 31, wrong: 23, accuracy: 54, silly: 9, timeIssue: 'Slow Maths section', weakChapters: 'Electrostatics, Integration', lesson: 'Need better time split.' },
      { id: uid('mock'), dateId: addDays(today, -18), total: 126, physics: 41, chemistry: 46, math: 39, attempted: 58, correct: 36, wrong: 22, accuracy: 58, silly: 8, timeIssue: 'Chemistry saved time', weakChapters: 'Rotation', lesson: 'Chemistry accuracy improved.' },
      { id: uid('mock'), dateId: addDays(today, -12), total: 141, physics: 43, chemistry: 51, math: 47, attempted: 61, correct: 41, wrong: 20, accuracy: 63, silly: 6, timeIssue: 'Maths lengthy', weakChapters: 'Definite Integration', lesson: 'Maths speed improving.' },
      { id: uid('mock'), dateId: addDays(today, -6), total: 137, physics: 39, chemistry: 52, math: 46, attempted: 60, correct: 39, wrong: 21, accuracy: 61, silly: 7, timeIssue: 'Physics took too long', weakChapters: 'Current Electricity', lesson: 'Physics concepts weak.' },
      { id: uid('mock'), dateId: addDays(today, -1), total: 153, physics: 48, chemistry: 55, math: 50, attempted: 64, correct: 46, wrong: 18, accuracy: 68, silly: 5, timeIssue: 'Balanced attempt', weakChapters: 'Electrostatics', lesson: 'Good upward trend.' }
    ],
    mistakes: [
      { id: uid('mistake'), dateId: addDays(today, -6), subject: 'Physics', chapter: 'Current Electricity', type: 'Concept error', note: 'Confused internal resistance formula in bridge circuit.' },
      { id: uid('mistake'), dateId: addDays(today, -3), subject: 'Mathematics', chapter: 'Definite Integration', type: 'Calculation error', note: 'Sign error after trigonometric substitution.' },
      { id: uid('mistake'), dateId: addDays(today, -1), subject: 'Chemistry', chapter: 'GOC', type: 'Misread question', note: 'Ignored “major product” condition in nucleophilic addition.' }
    ],
    chapters: [
      { subject: 'Physics', chapter: 'Electrostatics', status: 'Practice ongoing', theory: 85, practice: 52, pyq: 40, revision: 'R1', strength: 'Weak', lastRevised: addDays(today, -3), nextRevision: addDays(today, 2) },
      { subject: 'Physics', chapter: 'Current Electricity', status: 'Revision needed', theory: 100, practice: 68, pyq: 55, revision: 'R2', strength: 'Medium', lastRevised: addDays(today, -6), nextRevision: today },
      { subject: 'Physics', chapter: 'Rotational Motion', status: 'Theory ongoing', theory: 60, practice: 30, pyq: 20, revision: 'R0', strength: 'Weak', lastRevised: addDays(today, -8), nextRevision: addDays(today, 1) },
      { subject: 'Chemistry', chapter: 'GOC', status: 'Practice ongoing', theory: 90, practice: 63, pyq: 50, revision: 'R1', strength: 'Medium', lastRevised: addDays(today, -2), nextRevision: addDays(today, 3) },
      { subject: 'Chemistry', chapter: 'Chemical Bonding', status: 'Strong', theory: 100, practice: 78, pyq: 72, revision: 'R2', strength: 'Strong', lastRevised: addDays(today, -4), nextRevision: addDays(today, 5) },
      { subject: 'Chemistry', chapter: 'Thermodynamics', status: 'PYQ done', theory: 95, practice: 85, pyq: 80, revision: 'R3', strength: 'Strong', lastRevised: addDays(today, -7), nextRevision: addDays(today, 4) },
      { subject: 'Mathematics', chapter: 'Definite Integration', status: 'Practice ongoing', theory: 76, practice: 44, pyq: 31, revision: 'R1', strength: 'Weak', lastRevised: addDays(today, -2), nextRevision: addDays(today, 1) },
      { subject: 'Mathematics', chapter: 'Quadratic Equations', status: 'Mastered', theory: 100, practice: 92, pyq: 88, revision: 'Final', strength: 'Mastered', lastRevised: addDays(today, -5), nextRevision: addDays(today, 10) },
      { subject: 'Mathematics', chapter: 'Matrices & Determinants', status: 'Strong', theory: 100, practice: 82, pyq: 75, revision: 'R2', strength: 'Strong', lastRevised: addDays(today, -3), nextRevision: addDays(today, 6) }
    ]
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
  return seedState();
}

export function normalizeState(input: Partial<AppState>): AppState {
  const fresh = seedState();
  const merged: AppState = {
    ...fresh,
    ...input,
    version: 3,
    ui: { ...fresh.ui, ...(input.ui || {}) },
    settings: { ...fresh.settings, ...(input.settings || {}) },
    goal: {
      ...fresh.goal,
      ...(input.goal || {}),
      milestones: input.goal?.milestones || fresh.goal.milestones,
      weeklyTargets: input.goal?.weeklyTargets || fresh.goal.weeklyTargets
    },
    tasksByDate: input.tasksByDate || fresh.tasksByDate,
    history: input.history || fresh.history,
    reviews: input.reviews || fresh.reviews,
    sessions: input.sessions || fresh.sessions,
    backlog: input.backlog || [],
    mocks: (input.mocks || fresh.mocks).map(m => ({
      ...m,
      attempted: m.attempted ?? 0,
      correct: m.correct ?? 0,
      wrong: m.wrong ?? 0,
      timeIssue: m.timeIssue ?? '',
      weakChapters: m.weakChapters ?? ''
    })),
    mistakes: input.mistakes || fresh.mistakes,
    chapters: (input.chapters || fresh.chapters).map(c => ({
      ...c,
      lastRevised: c.lastRevised ?? '',
      nextRevision: c.nextRevision ?? ''
    }))
  };

  if (!merged.tasksByDate[todayId()]) {
    merged.tasksByDate[todayId()] = fresh.tasksByDate[todayId()];
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
