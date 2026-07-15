import { AppState } from '@/types';
import { todayId, addDays } from '../time/ist';
import { calculateSubjectMinutes } from '../scoring/scoring-engine';

export function calculateStreaks(state: AppState) {
  let pointer = state.history[todayId()]?.success ? todayId() : addDays(todayId(), -1);
  let current = 0;
  while (state.history[pointer]?.success) {
    current += 1;
    pointer = addDays(pointer, -1);
  }

  let longest = 0;
  let run = 0;
  let previous: string | null = null;
  
  Object.keys(state.history).sort().forEach(dateId => {
    if (state.history[dateId].success) {
      run = previous && addDays(previous, 1) === dateId ? run + 1 : 1;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
    previous = dateId;
  });

  return { current, longest };
}

export function calculateSubjectStreak(state: AppState, subject: string) {
  let pointer = todayId();
  let count = 0;
  while ((state.history[pointer]?.subjectMinutes?.[subject] || calculateSubjectMinutes(state, pointer)[subject] || 0) > 0) {
    count += 1;
    pointer = addDays(pointer, -1);
  }
  return count;
}

export function calculateSubjectBalance(state: AppState, days = 7) {
  const subjects = state.goal.subjects && state.goal.subjects.length > 0
    ? state.goal.subjects
    : ['Physics', 'Chemistry', 'Mathematics'];

  const totals: Record<string, number> = Object.fromEntries(subjects.map(s => [s, 0]));

  for (let i = days - 1; i >= 0; i--) {
    const dateId = addDays(todayId(), -i);
    const minutes = state.history[dateId]?.subjectMinutes || calculateSubjectMinutes(state, dateId);
    subjects.forEach(subject => {
      totals[subject] = (totals[subject] || 0) + (Number(minutes[subject]) || 0);
    });
  }

  const total = Object.values(totals).reduce((sum, value) => sum + value, 0) || 1;

  return Object.fromEntries(
    Object.entries(totals).map(([subject, minutes]) => [
      subject,
      { minutes, pct: Math.round((minutes / total) * 100) }
    ])
  );
}
