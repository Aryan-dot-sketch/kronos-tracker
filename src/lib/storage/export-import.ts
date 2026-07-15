import { AppState } from '@/types';
import { todayId } from '../time/ist';

export function exportJSON(state: AppState) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `kronos-tracker-export-${todayId()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportTasksCSV(state: AppState) {
  const rows = Object.entries(state.tasksByDate).flatMap(([date, list]) =>
    list.map(t => [date, t.title, t.subject, t.priority, t.difficulty, t.estimate, t.status, t.completedAt || ''])
  );
  const headers = ['DateID', 'Title', 'Subject', 'Priority', 'Difficulty', 'EstimateMin', 'Status', 'CompletedAt'];
  downloadCSV(`kronos-tasks-${todayId()}.csv`, headers, rows);
}

export function exportMocksCSV(state: AppState) {
  const rows = state.mocks.map(m => [m.dateId, m.total, m.physics, m.chemistry, m.math, m.accuracy, m.silly, m.timeIssue, m.weakChapters, m.lesson]);
  const headers = ['DateID', 'Total', 'Physics', 'Chemistry', 'Math', 'Accuracy', 'Silly', 'TimeIssue', 'WeakChapters', 'Lesson'];
  downloadCSV(`kronos-mocks-${todayId()}.csv`, headers, rows);
}

function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const content = [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
