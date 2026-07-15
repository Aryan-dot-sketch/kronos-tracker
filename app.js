(() => {
  const TZ = 'Asia/Kolkata';
  const KEY = 'kronos-tracker-state-v3';
  const WEIGHT = { critical: 5, high: 3, medium: 2, low: 1 };
  const PRIORITIES = ['critical', 'high', 'medium', 'low'];
  const CHAPTER_STATUSES = ['Not started', 'Theory ongoing', 'Theory done', 'Practice ongoing', 'PYQ done', 'Revision needed', 'Strong', 'Mastered'];
  const REVISION_FLOW = ['R0', 'R1', 'R2', 'R3', 'Final', 'Formula', 'PYQ done'];
  const MISTAKE_TYPES = ['Concept error', 'Calculation error', 'Silly mistake', 'Formula forgotten', 'Time pressure', 'Misread question', 'Guesswork error'];

  const VIEWS = {
    dashboard: ['Premium Daily Execution', 'Dashboard'],
    today: ['Today’s IST Mission', 'Today'],
    goal: ['Main Target Architecture', 'Main Goal'],
    calendar: ['Consistency Over Time', 'Calendar'],
    analytics: ['Performance Intelligence', 'Analytics'],
    jee: ['Exam Preparation Mode', 'JEE Tracker'],
    review: ['Night Reflection System', 'Daily Review'],
    settings: ['Kronos Control Room', 'Settings']
  };

  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => Array.from(root.querySelectorAll(q));
  const escapeHTML = value => String(value ?? '').replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
  const escapeAttr = escapeHTML;
  const uid = prefix => (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`);

  let state = loadState();
  let activeView = state.ui.activeView || 'dashboard';
  let focusTimer = { running: false, mode: 'stopwatch', startedAt: 0, elapsed: 0, subject: 'Physics', pomodoroMs: 25 * 60 * 1000 };
  let searchQuery = '';

  function istParts(date = new Date()) {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: TZ,
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    const parts = Object.fromEntries(formatter.formatToParts(date).map(part => [part.type, part.value]));
    const hour = parts.hour === '24' ? '00' : parts.hour;
    return {
      weekday: parts.weekday,
      year: Number(parts.year),
      month: Number(parts.month),
      day: Number(parts.day),
      hour: Number(hour),
      minute: Number(parts.minute),
      second: Number(parts.second),
      dateId: `${parts.year}-${parts.month}-${parts.day}`,
      timeText: `${hour}:${parts.minute}:${parts.second} IST`
    };
  }

  function todayId() {
    return istParts().dateId;
  }

  function istDateText(date = new Date()) {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: TZ,
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  function addDays(dateId, delta) {
    const [year, month, day] = dateId.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day + delta, 12)).toISOString().slice(0, 10);
  }

  function dateLabel(dateId, options = {}) {
    const [year, month, day] = dateId.split('-').map(Number);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: options.month || 'short',
      weekday: options.weekday,
      year: options.year
    }).format(new Date(Date.UTC(year, month - 1, day, 12)));
  }

  function nextISTResetMs() {
    const p = istParts();
    return Date.UTC(p.year, p.month - 1, p.day + 1, -5, -30, 0);
  }

  function formatDuration(ms, compact = false) {
    let seconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
    if (compact) return hours ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function formatMinutes(value) {
    const total = Math.round(Number(value) || 0);
    const hours = Math.floor(total / 60);
    const minutes = total % 60;
    if (!hours) return `${minutes}m`;
    return `${hours}h${minutes ? ` ${minutes}m` : ''}`;
  }

  function titleCase(value) {
    return String(value || '').replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }

  function deadlineParts() {
    const [date, rest = '09:00'] = (state.goal.deadlineISO || '2027-01-15T09:00:00+05:30').split('T');
    return { date, time: rest.slice(0, 5) };
  }

  function buildDeadlineISO(date, time) {
    return `${date}T${time || '09:00'}:00+05:30`;
  }

  function deadlineLeft() {
    const targetMs = new Date(state.goal.deadlineISO).getTime();
    const ms = Math.max(0, targetMs - Date.now());
    return {
      days: Math.floor(ms / 86400000),
      hours: Math.floor((ms % 86400000) / 3600000),
      minutes: Math.floor((ms % 3600000) / 60000),
      seconds: Math.floor((ms % 60000) / 1000)
    };
  }

  function deadlineText() {
    const left = deadlineLeft();
    return `${left.days}d ${left.hours}h ${left.minutes}m ${left.seconds}s`;
  }

  function makeTask(title, subject, priority, estimate, category, difficulty, completed = false, notes = '') {
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

  function cleanState() {
    const today = todayId();
    return {
      version: 3,
      ui: { activeView: 'dashboard', theme: 'light', taskStatusFilter: 'all', taskPriorityFilter: 'all', calendarMonthOffset: 0 },
      settings: { name: 'Aspirant', mode: 'Strict IST Mode', studyDayCutoff: '00:00', successThreshold: 70 },
      goal: {
        name: 'JEE Mains Target',
        type: 'Competitive Exam',
        target: '99 Percentile',
        deadlineISO: '2027-01-15T09:00:00+05:30',
        dailyHours: 8,
        progress: 0,
        phase: 'Syllabus Coverage & Problem Solving',
        weakArea: 'Configure Goal Weak Area in Goal View',
        riskLevel: 'On Track',
        prepStrategy: 'Consistent daily problem solving and mock analysis.',
        milestones: [],
        weeklyTargets: []
      },
      tasksByDate: { [today]: [] },
      history: {},
      reviews: {},
      sessions: [],
      backlog: [],
      mocks: [],
      mistakes: [],
      chapters: [
        { subject: 'Physics', chapter: 'Kinematics & Laws of Motion', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
        { subject: 'Physics', chapter: 'Electrostatics & Current Electricity', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
        { subject: 'Chemistry', chapter: 'GOC & Hydrocarbons', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
        { subject: 'Chemistry', chapter: 'Thermodynamics & Equilibrium', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
        { subject: 'Mathematics', chapter: 'Definite Integration & Calculus', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' },
        { subject: 'Mathematics', chapter: 'Matrices, Determinants & Algebra', status: 'Not started', theory: 0, practice: 0, pyq: 0, revision: 'R0', strength: 'Weak', lastRevised: '', nextRevision: '' }
      ]
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return normalizeState(JSON.parse(raw));
    } catch (error) {
      console.warn('Kronos state error loading state', error);
    }
    return cleanState();
  }

  function normalizeState(input) {
    const clean = cleanState();
    return {
      ...clean,
      ...input,
      version: 3,
      ui: { ...clean.ui, ...(input.ui || {}) },
      settings: { ...clean.settings, ...(input.settings || {}) },
      goal: { ...clean.goal, ...(input.goal || {}), milestones: input.goal?.milestones || [], weeklyTargets: input.goal?.weeklyTargets || [] },
      tasksByDate: input.tasksByDate || { [todayId()]: [] },
      history: input.history || {},
      reviews: input.reviews || {},
      sessions: input.sessions || [],
      backlog: input.backlog || [],
      mocks: input.mocks || [],
      mistakes: input.mistakes || [],
      chapters: input.chapters || clean.chapters
    };
  }

  function saveState() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
  }
})();
