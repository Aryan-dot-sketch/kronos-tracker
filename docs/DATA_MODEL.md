# Kronos Tracker — Data Model

## Current Persistence

The MVP uses browser localStorage.

Future backend: Supabase.

## User / Settings

```ts
type Settings = {
  name: string;
  mode: 'Strict IST Mode';
  studyDayCutoff: string;
  successThreshold: number;
}
```

## Goal

```ts
type Goal = {
  name: string;
  type: string;
  target: string;
  deadlineISO: string;
  dailyHours: number;
  progress: number;
  phase: string;
  weakArea: string;
  riskLevel: string;
}
```

## Task

```ts
type Task = {
  id: string;
  title: string;
  subject: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimate: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  status: 'not-started' | 'completed' | 'missed' | 'skipped';
  completedAt: string | null;
  notes: string;
  recoveryStatus?: string | null;
  missedReason?: string;
}
```

## Study Session

```ts
type StudySession = {
  id: string;
  dateId: string;
  subject: string;
  minutes: number;
  startedAt: string;
  endedAt: string;
  label: string;
}
```

## Daily History

```ts
type DailyHistory = {
  dateId: string;
  completionScore: number;
  timeScore: number;
  focusScore: number;
  studyMinutes: number;
  completedTasks: number;
  totalTasks: number;
  success: boolean;
  subjectMinutes: {
    Physics: number;
    Chemistry: number;
    Mathematics: number;
  };
}
```

## Mock Test

```ts
type MockTest = {
  id: string;
  dateId: string;
  total: number;
  physics: number;
  chemistry: number;
  math: number;
  attempted: number;
  correct: number;
  wrong: number;
  accuracy: number;
  silly: number;
  timeIssue: string;
  weakChapters: string;
  lesson: string;
}
```

## Mistake

```ts
type Mistake = {
  id: string;
  dateId: string;
  subject: string;
  chapter: string;
  type: string;
  note: string;
}
```

## JEE Chapter

```ts
type JEEChapter = {
  subject: string;
  chapter: string;
  status: string;
  theory: number;
  practice: number;
  pyq: number;
  revision: string;
  strength: string;
  lastRevised: string;
  nextRevision: string;
}
```

## Supabase Note

When Supabase is added, every table must include:

- `id`
- `user_id`
- `created_at`
- `updated_at`

All user data must be protected by Row Level Security.

