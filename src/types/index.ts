export type ViewType = 'dashboard' | 'today' | 'goal' | 'calendar' | 'analytics' | 'jee' | 'review' | 'settings';

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Extreme';
export type TaskStatus = 'not-started' | 'completed' | 'missed' | 'skipped';

export interface Task {
  id: string;
  title: string;
  subject: string;
  priority: TaskPriority;
  estimate: number;
  category: string;
  difficulty: TaskDifficulty;
  status: TaskStatus;
  completedAt: string | null;
  notes?: string;
  recoveryStatus?: string | null;
  missedReason?: string;
  missedAt?: string;
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  completed: boolean;
  category: string;
}

export interface WeeklyTarget {
  id: string;
  title: string;
  targetHours: number;
  completed: boolean;
}

export interface Goal {
  name: string;
  type: string;
  target: string;
  deadlineISO: string;
  dailyHours: number;
  progress: number;
  phase: string;
  weakArea: string;
  riskLevel: 'On Track' | 'Medium' | 'High Risk';
  prepStrategy: string;
  milestones: Milestone[];
  weeklyTargets: WeeklyTarget[];
}

export interface Settings {
  name: string;
  mode: string;
  studyDayCutoff: string;
  successThreshold: number;
}

export interface StudySession {
  id: string;
  dateId: string;
  subject: string;
  minutes: number;
  startedAt: string;
  endedAt: string;
  label: string;
}

export interface DailyHistory {
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
    [key: string]: number;
  };
}

export interface MockTest {
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

export interface Mistake {
  id: string;
  dateId: string;
  subject: string;
  chapter: string;
  type: string;
  note: string;
}

export interface JEEChapter {
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

export interface DailyReview {
  wentWell?: string;
  wentWrong?: string;
  distraction?: string;
  learned?: string;
  tomorrowPriority?: string;
  sleepTarget?: string;
  energy?: string;
  mood?: string;
  savedAt?: string;
}

export interface BacklogItem {
  id: string;
  sourceDate: string;
  originalTaskId: string;
  title: string;
  subject: string;
  priority: TaskPriority;
  estimate: number;
  category: string;
  difficulty: TaskDifficulty;
  notes?: string;
  status: string;
  createdAt: string;
}

export interface AppState {
  version: number;
  ui: {
    activeView: ViewType;
    theme: 'light' | 'dark';
    taskStatusFilter: string;
    taskPriorityFilter: string;
    calendarMonthOffset: number;
  };
  settings: Settings;
  goal: Goal;
  tasksByDate: Record<string, Task[]>;
  history: Record<string, DailyHistory>;
  reviews: Record<string, DailyReview>;
  sessions: StudySession[];
  backlog: BacklogItem[];
  mocks: MockTest[];
  mistakes: Mistake[];
  chapters: JEEChapter[];
}
