import { AppState, TaskPriority } from '@/types';
import { todayId } from '../time/ist';

export const WEIGHT: Record<TaskPriority, number> = {
  critical: 5,
  high: 3,
  medium: 2,
  low: 1
};

export function calculateSubjectMinutes(state: AppState, dateId = todayId()): Record<string, number> {
  const subjects = state.goal.subjects && state.goal.subjects.length > 0
    ? state.goal.subjects
    : ['Physics', 'Chemistry', 'Mathematics'];

  const totals: Record<string, number> = Object.fromEntries(subjects.map(s => [s, 0]));

  const tasks = state.tasksByDate[dateId] || [];
  tasks.filter(t => t.status === 'completed').forEach(t => {
    totals[t.subject] = (totals[t.subject] || 0) + (Number(t.estimate) || 0);
  });

  state.sessions.filter(s => s.dateId === dateId).forEach(s => {
    totals[s.subject] = (totals[s.subject] || 0) + (Number(s.minutes) || 0);
  });

  return totals;
}

export function calculateDailyStats(state: AppState, dateId = todayId()) {
  const tasks = state.tasksByDate[dateId] || [];
  const totalWeight = tasks.reduce((sum, task) => sum + (WEIGHT[task.priority] || 1), 0);
  const doneWeight = tasks.filter(t => t.status === 'completed').reduce((sum, task) => sum + (WEIGHT[task.priority] || 1), 0);
  const completionScore = totalWeight ? Math.round((doneWeight / totalWeight) * 100) : 0;
  
  const criticalTasks = tasks.filter(task => task.priority === 'critical');
  const criticalDone = criticalTasks.length ? criticalTasks.every(t => t.status === 'completed') : true;
  
  const completedEstimate = tasks.filter(t => t.status === 'completed').reduce((sum, task) => sum + (Number(task.estimate) || 0), 0);
  const sessionMinutes = state.sessions.filter(session => session.dateId === dateId).reduce((sum, session) => sum + (Number(session.minutes) || 0), 0);
  const studyMinutes = Math.max(completedEstimate, sessionMinutes);
  
  const plannedMinutes = (Number(state.goal.dailyHours) || 7.5) * 60;
  const timeScore = Math.min(100, Math.round((studyMinutes / plannedMinutes) * 100));
  const focusScore = Math.round(completionScore * 0.55 + timeScore * 0.25 + (criticalDone ? 20 : 0));
  
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const successThreshold = Number(state.settings.successThreshold) || 70;
  const success = totalTasks > 0 && completionScore >= successThreshold && criticalDone;
  const criticalRate = criticalTasks.length ? Math.round((criticalTasks.filter(t => t.status === 'completed').length / criticalTasks.length) * 100) : 100;
  
  return {
    tasks,
    completionScore,
    criticalDone,
    criticalRate,
    studyMinutes,
    plannedMinutes,
    timeScore,
    focusScore,
    completedTasks,
    totalTasks,
    success
  };
}
