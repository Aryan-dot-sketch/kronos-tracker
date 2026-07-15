(() => {
  const TZ = 'Asia/Kolkata';
  const KEY = 'kronos-tracker-state-v3';
  const LEGACY_KEY_V2 = 'kronos-tracker-state-v2';
  const LEGACY_KEY_V1 = 'kronos-tracker-state-v1';
  
  const WEIGHT = { critical: 5, high: 3, medium: 2, low: 1 };
  const PRIORITIES = ['critical', 'high', 'medium', 'low'];
  const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics', 'Mock Test', 'Revision', 'Health', 'Personal', 'General'];
  const CATEGORIES = ['Study', 'Practice', 'Revision', 'Mock', 'Habit', 'Health', 'Personal', 'Custom', 'Review'];
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

  // IST Date Engine Functions
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

  function seedState() {
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

    const history = {};
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

  function loadState() {
    try {
      const raw = localStorage.getItem(KEY) || localStorage.getItem(LEGACY_KEY_V2) || localStorage.getItem(LEGACY_KEY_V1);
      if (raw) return normalizeState(JSON.parse(raw));
    } catch (error) {
      console.warn('Kronos state could not be loaded.', error);
    }
    return seedState();
  }

  function normalizeState(input) {
    const fresh = seedState();
    const merged = {
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
      mocks: (input.mocks || fresh.mocks).map(mock => ({ attempted: 0, correct: 0, wrong: 0, timeIssue: '', weakChapters: '', ...mock })),
      mistakes: input.mistakes || fresh.mistakes,
      chapters: (input.chapters || fresh.chapters).map(chapter => ({ lastRevised: '', nextRevision: '', ...chapter }))
    };
    if (!merged.tasksByDate[todayId()]) merged.tasksByDate[todayId()] = fresh.tasksByDate[todayId()];
    return merged;
  }

  function saveState() {
    updateTodayHistory();
    state.ui.activeView = activeView;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Kronos state could not be saved.', error);
    }
  }

  function applyTheme() {
    document.documentElement.dataset.theme = state.ui.theme || 'light';
  }

  function dayTasks(dateId = todayId()) {
    state.tasksByDate[dateId] ||= [];
    return state.tasksByDate[dateId];
  }

  function isCompleted(task) {
    return task.status === 'completed';
  }

  function isPending(task) {
    return !['completed', 'skipped', 'missed'].includes(task.status);
  }

  function filteredTasks(tasks) {
    const status = state.ui.taskStatusFilter || 'all';
    const priority = state.ui.taskPriorityFilter || 'all';
    const query = searchQuery.trim().toLowerCase();
    return tasks.filter(task => {
      const statusMatch = status === 'all' || (status === 'pending' ? isPending(task) : task.status === status);
      const priorityMatch = priority === 'all' || task.priority === priority;
      const queryMatch = !query || task.title.toLowerCase().includes(query) || task.subject.toLowerCase().includes(query) || (task.notes || '').toLowerCase().includes(query);
      return statusMatch && priorityMatch && queryMatch;
    });
  }

  function subjectMinutes(dateId = todayId()) {
    const totals = { Physics: 0, Chemistry: 0, Mathematics: 0 };
    (state.tasksByDate[dateId] || []).filter(isCompleted).forEach(task => {
      if (totals[task.subject] != null) totals[task.subject] += Number(task.estimate) || 0;
    });
    state.sessions.filter(session => session.dateId === dateId).forEach(session => {
      if (totals[session.subject] != null) totals[session.subject] += Number(session.minutes) || 0;
    });
    return totals;
  }

  function stats(dateId = todayId()) {
    const tasks = dayTasks(dateId);
    const totalWeight = tasks.reduce((sum, task) => sum + (WEIGHT[task.priority] || 1), 0);
    const doneWeight = tasks.filter(isCompleted).reduce((sum, task) => sum + (WEIGHT[task.priority] || 1), 0);
    const completionScore = totalWeight ? Math.round((doneWeight / totalWeight) * 100) : 0;
    const criticalTasks = tasks.filter(task => task.priority === 'critical');
    const criticalDone = criticalTasks.length ? criticalTasks.every(isCompleted) : true;
    const completedEstimate = tasks.filter(isCompleted).reduce((sum, task) => sum + (Number(task.estimate) || 0), 0);
    const sessionMinutes = state.sessions.filter(session => session.dateId === dateId).reduce((sum, session) => sum + (Number(session.minutes) || 0), 0);
    const studyMinutes = Math.max(completedEstimate, sessionMinutes);
    const plannedMinutes = (Number(state.goal.dailyHours) || 7.5) * 60;
    const timeScore = Math.min(100, Math.round((studyMinutes / plannedMinutes) * 100));
    const focusScore = Math.round(completionScore * 0.55 + timeScore * 0.25 + (criticalDone ? 20 : 0));
    const completedTasks = tasks.filter(isCompleted).length;
    const totalTasks = tasks.length;
    const success = totalTasks > 0 && completionScore >= (Number(state.settings.successThreshold) || 70) && criticalDone;
    const criticalRate = criticalTasks.length ? Math.round((criticalTasks.filter(isCompleted).length / criticalTasks.length) * 100) : 100;
    return { tasks, completionScore, criticalDone, criticalRate, studyMinutes, plannedMinutes, timeScore, focusScore, completedTasks, totalTasks, success };
  }

  function updateTodayHistory() {
    const dateId = todayId();
    const todayStats = stats(dateId);
    state.history[dateId] = {
      ...(state.history[dateId] || {}),
      dateId,
      completionScore: todayStats.completionScore,
      timeScore: todayStats.timeScore,
      focusScore: todayStats.focusScore,
      studyMinutes: todayStats.studyMinutes,
      completedTasks: todayStats.completedTasks,
      totalTasks: todayStats.totalTasks,
      success: todayStats.success,
      subjectMinutes: subjectMinutes(dateId)
    };
  }

  function detectMissedTasks() {
    const today = todayId();
    Object.entries(state.tasksByDate).forEach(([dateId, tasks]) => {
      if (dateId >= today) return;
      tasks.forEach(task => {
        if (task.status === 'completed' || task.status === 'skipped' || task.recoveryStatus) return;
        task.status = 'missed';
        task.missedAt ||= new Date().toISOString();
        const exists = state.backlog.some(item => item.sourceDate === dateId && item.originalTaskId === task.id);
        if (!exists) {
          state.backlog.push({
            id: uid('backlog'),
            sourceDate: dateId,
            originalTaskId: task.id,
            title: task.title,
            subject: task.subject,
            priority: task.priority,
            estimate: task.estimate,
            category: task.category,
            difficulty: task.difficulty,
            notes: task.notes || '',
            status: 'unresolved',
            createdAt: new Date().toISOString()
          });
        }
      });
    });
  }

  function unresolvedBacklog() {
    detectMissedTasks();
    return state.backlog.filter(item => item.status === 'unresolved');
  }

  function streak() {
    updateTodayHistory();
    let pointer = state.history[todayId()]?.success ? todayId() : addDays(todayId(), -1);
    let current = 0;
    while (state.history[pointer]?.success) {
      current += 1;
      pointer = addDays(pointer, -1);
    }
    let longest = 0;
    let run = 0;
    let previous = null;
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

  function subjectStreak(subject) {
    let pointer = todayId();
    let count = 0;
    while ((state.history[pointer]?.subjectMinutes?.[subject] || subjectMinutes(pointer)[subject] || 0) > 0) {
      count += 1;
      pointer = addDays(pointer, -1);
    }
    return count;
  }

  function missedYesterday() {
    const yesterday = addDays(todayId(), -1);
    return state.history[yesterday] && !state.history[yesterday].success;
  }

  function balance(days = 7) {
    const totals = { Physics: 0, Chemistry: 0, Mathematics: 0 };
    for (let i = days - 1; i >= 0; i--) {
      const dateId = addDays(todayId(), -i);
      const minutes = state.history[dateId]?.subjectMinutes || subjectMinutes(dateId);
      Object.keys(totals).forEach(subject => totals[subject] += Number(minutes[subject]) || 0);
    }
    const total = Object.values(totals).reduce((sum, value) => sum + value, 0) || 1;
    return Object.fromEntries(Object.entries(totals).map(([subject, minutes]) => [subject, { minutes, pct: Math.round((minutes / total) * 100) }]));
  }

  function analyticsSummary() {
    updateTodayHistory();
    const entries = Object.values(state.history).sort((a, b) => a.dateId.localeCompare(b.dateId));
    const recent7 = entries.slice(-7);
    const recent30 = entries.slice(-30);
    const average = list => Math.round(list.reduce((sum, item) => sum + (Number(item.completionScore) || 0), 0) / Math.max(1, list.length));
    const best = recent30.reduce((winner, item) => !winner || item.completionScore > winner.completionScore ? item : winner, null);
    const worst = recent30.reduce((loser, item) => !loser || item.completionScore < loser.completionScore ? item : loser, null);
    const avgStudy = Math.round(recent7.reduce((sum, item) => sum + (Number(item.studyMinutes) || 0), 0) / Math.max(1, recent7.length));
    const successRate = Math.round((recent30.filter(item => item.success).length / Math.max(1, recent30.length)) * 100);
    return { avg7: average(recent7), avg30: average(recent30), best, worst, avgStudy, successRate };
  }

  // Master Render Loop
  function render() {
    detectMissedTasks();
    updateTodayHistory();
    applyTheme();
    const [eyebrow, title] = VIEWS[activeView] || VIEWS.dashboard;
    $('#viewEyebrow').textContent = eyebrow;
    $('#viewTitle').textContent = title;
    $$('.nav-item').forEach(button => button.classList.toggle('active', button.dataset.view === activeView));
    $('#appView').innerHTML = ({
      dashboard: dashboardView,
      today: todayView,
      goal: goalView,
      calendar: calendarView,
      analytics: analyticsView,
      jee: jeeView,
      review: reviewView,
      settings: settingsView
    }[activeView] || dashboardView)();
    renderRightPanel();
    updateClock();
    saveState();
  }

  // Component UI Builders
  function metric(label, value, sub, tone = 'gold') {
    return `<article class="metric-card"><span class="metric-label">${label}</span><strong>${value}</strong><small><span class="pill ${tone}">${sub}</span></small></article>`;
  }

  function mini(label, value) {
    return `<article class="mini-stat"><span>${label}</span><strong>${value}</strong></article>`;
  }

  function empty(title, sub) {
    return `<div class="empty-state"><strong>${title}</strong>${sub}</div>`;
  }

  function options(values, selected) {
    return values.map(value => `<option value="${escapeAttr(value)}" ${String(value) === String(selected) ? 'selected' : ''}>${escapeHTML(value)}</option>`).join('');
  }

  // View: Dashboard
  function dashboardView() {
    const todayStats = stats();
    const currentStreak = streak();
    const left = deadlineLeft();
    const backlogCount = unresolvedBacklog().length;
    const risk = todayStats.completionScore >= 85 && todayStats.timeScore >= 80 ? ['On Track', 'green'] : todayStats.completionScore >= 65 ? ['Medium Risk', 'gold'] : ['High Risk', 'red'];
    
    return `
      <div class="hero-grid">
        <section class="hero-card">
          <div class="hero-topline"><span class="pill gold">Primary Mission Control</span><span class="pill ${risk[1]}">${risk[0]}</span></div>
          <h2>${escapeHTML(state.goal.name)}</h2>
          <p>Target: <strong>${escapeHTML(state.goal.target)}</strong>. Phase: ${escapeHTML(state.goal.phase)}. Primary Weak Area: <strong>${escapeHTML(state.goal.weakArea)}</strong>.</p>
          <div class="hero-meta">
            <span class="pill green">${left.days} days left</span>
            <span class="pill gold" id="deadlineCountdownInline">${deadlineText()}</span>
            <span class="pill blue">${state.goal.progress}% prep progress</span>
            <span class="pill">Kronos Day: ${todayId()}</span>
            ${backlogCount ? `<span class="pill red">${backlogCount} recovery task${backlogCount > 1 ? 's' : ''} pending</span>` : ''}
          </div>
        </section>
        ${metric('Today’s Execution', `${todayStats.completionScore}%`, `${todayStats.completedTasks}/${todayStats.totalTasks} tasks complete`, 'green')}
        ${metric('Current Streak', `${currentStreak.current}d`, `Longest: ${currentStreak.longest} days`, 'gold')}
        ${metric('Study Time', formatMinutes(todayStats.studyMinutes), `Target: ${formatMinutes(todayStats.plannedMinutes)}`, 'blue')}
        ${metric('Focus Score', `${todayStats.focusScore}`, todayStats.criticalDone ? 'Critical tasks protected' : 'Critical pending', todayStats.criticalDone ? 'green' : 'red')}
      </div>

      <div class="content-grid">
        <section class="panel wide">
          <div class="panel-header">
            <div>
              <h3>Today’s Execution Mission</h3>
              <p class="panel-subtitle">Every completion is stamped in IST and powers streak, graphs, and focus scores.</p>
            </div>
            <div class="progress-ring" style="--progress:${todayStats.completionScore}%" data-label="${todayStats.completionScore}%"></div>
          </div>
          ${taskList(dayTasks().slice(0, 6), true)}
        </section>

        <section class="panel">
          <div class="panel-header">
            <div>
              <h3>Weekly Performance</h3>
              <p class="panel-subtitle">7-day weighted completion trend.</p>
            </div>
          </div>
          ${lineChart(7, 'completionScore')}
        </section>

        <section class="panel">
          <div class="panel-header">
            <div>
              <h3>Subject Balance</h3>
              <p class="panel-subtitle">Last 7 days PCM time breakdown.</p>
            </div>
          </div>
          ${balanceView()}
        </section>

        <section class="panel wide">
          <div class="panel-header">
            <div>
              <h3>Kronos Consistency Heatmap</h3>
              <p class="panel-subtitle">Gold marks elite execution days. Click any tile to inspect day performance.</p>
            </div>
          </div>
          ${heatmap(70)}
        </section>
      </div>`;
  }

  // View: Today
  function taskFilters() {
    return `
      <div class="filter-row">
        <div class="search-input-wrap">
          <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input id="taskSearchInput" placeholder="Search tasks, subjects, notes..." value="${escapeAttr(searchQuery)}" />
        </div>
        <label>
          Status
          <select data-filter="status">
            ${options(['all', 'pending', 'completed', 'missed', 'skipped'], state.ui.taskStatusFilter || 'all')}
          </select>
        </label>
        <label>
          Priority
          <select data-filter="priority">
            ${options(['all', ...PRIORITIES], state.ui.taskPriorityFilter || 'all')}
          </select>
        </label>
        <button class="ghost-button" data-action="clear-task-filters">Clear</button>
      </div>`;
  }

  function todayView() {
    const todayStats = stats();
    const filtered = filteredTasks(dayTasks());
    const groups = PRIORITIES.map(priority => {
      const list = filtered.filter(task => task.priority === priority);
      return list.length ? `
        <section class="panel">
          <div class="panel-header">
            <div>
              <h3>${titleCase(priority)} Priority</h3>
              <p class="panel-subtitle">${list.length} mission task${list.length > 1 ? 's' : ''}</p>
            </div>
          </div>
          ${taskList(list)}
        </section>` : '';
    }).join('');

    return `
      <div class="stat-grid" style="margin-bottom:16px">
        ${mini('Completion', `${todayStats.completionScore}%`)}
        ${mini('Tasks Done', `${todayStats.completedTasks}/${todayStats.totalTasks}`)}
        ${mini('Study Time', formatMinutes(todayStats.studyMinutes))}
        ${mini('Day Reset In', `<span id="todayCloseInline">${formatDuration(nextISTResetMs() - Date.now(), true)}</span>`)}
      </div>

      <div class="content-grid">
        <div style="display:grid;gap:16px">
          <section class="panel">
            <div class="panel-header">
              <div>
                <h3>Mission Filters & Search</h3>
                <p class="panel-subtitle">Filter daily tasks by title, status, or priority level.</p>
              </div>
            </div>
            ${taskFilters()}
          </section>
          ${backlogPanel()}
          ${groups || empty('No tasks match this filter', 'Clear filters or search criteria, or add a new mission task.')}
        </div>

        <aside class="panel">
          <div class="panel-header">
            <div>
              <h3>Daily Mission Control</h3>
              <p class="panel-subtitle">Protect critical work before IST midnight reset.</p>
            </div>
          </div>
          ${scoreBars(todayStats)}
          <div style="height:16px"></div>
          <button class="primary-button" style="width:100%" data-action="open-task-dialog">+ Add Mission Task</button>
          <div style="height:10px"></div>
          <button class="ghost-button" style="width:100%" data-jump="review">Open Night Reflection</button>
        </aside>
      </div>`;
  }

  function backlogPanel() {
    const backlog = unresolvedBacklog();
    if (!backlog.length) return '';
    return `
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Missed Task Recovery Backlog</h3>
            <p class="panel-subtitle">Tasks missed after IST day close. Rollover without guilt.</p>
          </div>
          <span class="pill red">${backlog.length} unresolved</span>
        </div>
        <div class="task-list">
          ${backlog.map(item => `
            <div class="task-row">
              <span class="nav-icon">↺</span>
              <div>
                <div class="task-title">${escapeHTML(item.title)}</div>
                <div class="task-meta">
                  <span class="priority-pill priority-${item.priority}">${item.priority}</span>
                  <span>Missed: ${item.sourceDate}</span>
                  <span>${escapeHTML(item.subject)}</span>
                  <span>${formatMinutes(item.estimate)}</span>
                </div>
              </div>
              <div class="task-actions">
                <button class="tiny-button" data-action="move-backlog" data-id="${item.id}">Move</button>
                <button class="tiny-button" data-action="split-backlog" data-id="${item.id}">Split</button>
                <button class="tiny-button" data-action="skip-backlog" data-id="${item.id}">Skip</button>
              </div>
            </div>`).join('')}
        </div>
      </section>`;
  }

  // View: Main Goal
  function goalView() {
    const parts = deadlineParts();
    const todayStats = stats();
    const left = deadlineLeft();
    const milestones = state.goal.milestones || [];
    const weeklyTargets = state.goal.weeklyTargets || [];

    return `
      <div class="content-grid">
        <section class="panel wide">
          <div class="panel-header">
            <div>
              <h3>Main Target Architecture</h3>
              <p class="panel-subtitle">Exam countdown and risk levels calculated strictly using IST.</p>
            </div>
            <span class="pill gold">${left.days} days ${left.hours}h left</span>
          </div>

          <form class="goal-form" id="goalPageForm">
            <label>Goal title / Name
              <input name="name" value="${escapeAttr(state.goal.name)}" required>
            </label>
            <div class="form-grid two">
              <label>Target score / Percentile
                <input name="target" value="${escapeAttr(state.goal.target)}" required>
              </label>
              <label>Goal Type
                <input name="type" value="${escapeAttr(state.goal.type || 'Competitive Exam')}">
              </label>
            </div>
            <div class="form-grid three">
              <label>Deadline date
                <input type="date" name="deadlineDate" value="${parts.date}" required>
              </label>
              <label>Deadline time IST
                <input type="time" name="deadlineTime" value="${parts.time}" required>
              </label>
              <label>Daily hours target
                <input type="number" min="1" max="18" step="0.5" name="dailyHours" value="${state.goal.dailyHours}" required>
              </label>
            </div>
            <div class="form-grid two">
              <label>Current phase
                <input name="phase" value="${escapeAttr(state.goal.phase)}">
              </label>
              <label>Weak area
                <input name="weakArea" value="${escapeAttr(state.goal.weakArea)}">
              </label>
            </div>
            <label>Strategy & Execution Notes
              <textarea name="prepStrategy" placeholder="Strategy notes...">${escapeHTML(state.goal.prepStrategy || '')}</textarea>
            </label>
            <button class="primary-button" type="submit">Save Architecture Updates</button>
          </form>
        </section>

        <section class="panel">
          <div class="panel-header">
            <div>
              <h3>Mission Health</h3>
              <p class="panel-subtitle">Current execution vs long-term target.</p>
            </div>
          </div>
          <div class="progress-ring" style="--progress:${todayStats.completionScore}%" data-label="${todayStats.completionScore}%"></div>
          <div style="height:16px"></div>
          ${scoreBars(todayStats, state.goal.progress)}
        </section>

        <!-- Milestones Section -->
        <section class="panel wide">
          <div class="panel-header">
            <div>
              <h3>Monthly Milestones</h3>
              <p class="panel-subtitle">Major phase checkpoints leading up to the target exam date.</p>
            </div>
            <button class="ghost-button" data-action="open-milestone-dialog">+ Add Milestone</button>
          </div>
          <div class="task-list">
            ${milestones.map(m => `
              <div class="task-row ${m.completed ? 'completed' : ''}">
                <button class="check-button" data-action="toggle-milestone" data-id="${m.id}">✓</button>
                <div>
                  <div class="task-title">${escapeHTML(m.title)}</div>
                  <div class="task-meta">
                    <span class="pill gold">${escapeHTML(m.category)}</span>
                    <span>Target Date: ${m.targetDate}</span>
                  </div>
                </div>
                <button class="tiny-button" data-action="delete-milestone" data-id="${m.id}">Delete</button>
              </div>`).join('') || empty('No monthly milestones set', 'Add milestones to structure your exam roadmap.')}
          </div>
        </section>

        <!-- Weekly Targets Section -->
        <section class="panel wide">
          <div class="panel-header">
            <div>
              <h3>Weekly Target Blocks</h3>
              <p class="panel-subtitle">7-day performance targets and question quotas.</p>
            </div>
          </div>
          <div class="task-list">
            ${weeklyTargets.map(w => `
              <div class="task-row ${w.completed ? 'completed' : ''}">
                <button class="check-button" data-action="toggle-weekly" data-id="${w.id}">✓</button>
                <div>
                  <div class="task-title">${escapeHTML(w.title)}</div>
                  <div class="task-meta">
                    <span>Target Hours: ${w.targetHours}h</span>
                  </div>
                </div>
                <button class="tiny-button" data-action="delete-weekly" data-id="${w.id}">Delete</button>
              </div>`).join('') || empty('No weekly targets set', 'Set 7-day target blocks to keep daily execution disciplined.')}
          </div>
        </section>
      </div>`;
  }

  // View: Calendar
  function calendarView() {
    const p = istParts();
    const viewDate = new Date(Date.UTC(p.year, p.month - 1 + (Number(state.ui.calendarMonthOffset) || 0), 1, 12));
    const year = viewDate.getUTCFullYear();
    const month = viewDate.getUTCMonth() + 1;
    const firstId = `${year}-${String(month).padStart(2, '0')}-01`;
    const startId = addDays(firstId, -new Date(Date.UTC(year, month - 1, 1, 12)).getUTCDay());
    
    let cells = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => `<div class="calendar-head">${day}</div>`).join('');
    for (let i = 0; i < 42; i++) {
      const dateId = addDays(startId, i);
      const [, cellMonth, cellDay] = dateId.split('-').map(Number);
      const h = state.history[dateId];
      const score = h?.completionScore || 0;
      const marker = score >= 90 ? 'Elite' : h?.success ? 'Success' : h ? 'Missed' : 'No Data';
      cells += `
        <button class="calendar-day ${cellMonth !== month ? 'muted-day' : ''} ${dateId === todayId() ? 'today' : ''}" data-action="show-day-detail" data-date="${dateId}">
          <strong>${cellDay}</strong>
          <div class="calendar-score">${marker}${h ? ` • ${score}%` : ''}</div>
          <div class="bar-track" style="margin-top:6px">
            <div class="bar-fill" style="width:${score}%"></div>
          </div>
        </button>`;
    }

    return `
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>${new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(viewDate)}</h3>
            <p class="panel-subtitle">Scores, streaks, and day status evaluated strictly in IST. Click any date tile for deep inspection.</p>
          </div>
          <div style="display:flex;gap:8px">
            <button class="ghost-button" data-action="calendar-prev">← Prev</button>
            <button class="ghost-button" data-action="calendar-today">Today</button>
            <button class="ghost-button" data-action="calendar-next">Next →</button>
          </div>
        </div>
        <div class="calendar-grid">${cells}</div>
      </section>`;
  }

  // View: Analytics
  function analyticsView() {
    const todayStats = stats();
    const currentStreak = streak();
    const summary = analyticsSummary();
    return `
      <div class="stat-grid" style="margin-bottom:16px">
        ${mini('Current streak', `${currentStreak.current} days`)}
        ${mini('Longest streak', `${currentStreak.longest} days`)}
        ${mini('7-day average', `${summary.avg7}%`)}
        ${mini('30-day success', `${summary.successRate}%`)}
      </div>

      <div class="content-grid">
        <section class="panel wide">
          <div class="panel-header">
            <div>
              <h3>14-Day Completion Trend</h3>
              <p class="panel-subtitle">Weighted completion percentage.</p>
            </div>
          </div>
          ${lineChart(14, 'completionScore')}
        </section>

        <section class="panel">
          <div class="panel-header">
            <div>
              <h3>Study Hours</h3>
              <p class="panel-subtitle">Last 7 days actual focused study time.</p>
            </div>
          </div>
          ${studyBars()}
        </section>

        <section class="panel">
          <div class="panel-header">
            <div>
              <h3>Subject Balance</h3>
              <p class="panel-subtitle">Balanced PCM distribution protects ranking momentum.</p>
            </div>
          </div>
          ${balanceView()}
        </section>

        <section class="panel wide">
          <div class="panel-header">
            <div>
              <h3>Performance Intelligence Summary</h3>
              <p class="panel-subtitle">Best & weak days, critical task rate, and daily averages.</p>
            </div>
          </div>
          <div class="stat-grid">
            ${mini('Best Day', `${summary.best?.completionScore || 0}%`)}
            ${mini('Weakest Day', `${summary.worst?.completionScore || 0}%`)}
            ${mini('Avg Daily Study', formatMinutes(summary.avgStudy))}
            ${mini('Critical Rate', `${todayStats.criticalRate}%`)}
          </div>
          <p class="panel-subtitle" style="margin-top:14px">Best Day ID: ${summary.best ? summary.best.dateId : 'N/A'} • Weakest Day ID: ${summary.worst ? summary.worst.dateId : 'N/A'}. Time metrics evaluate higher of estimated completed task times or stopwatch logs.</p>
        </section>

        <section class="panel wide">
          <div class="panel-header">
            <div>
              <h3>Long-Range Performance Heatmap</h3>
              <p class="panel-subtitle">100-day historical execution consistency grid.</p>
            </div>
          </div>
          ${heatmap(98)}
        </section>

        <section class="panel wide">
          <div class="panel-header">
            <div>
              <h3>Smart AI Coaching Insights</h3>
              <p class="panel-subtitle">System generated insights based on live tracking patterns.</p>
            </div>
          </div>
          ${insights()}
        </section>
      </div>`;
  }

  // View: JEE Tracker
  function subjectDashboard() {
    return `
      <div class="stat-grid" style="margin-bottom:16px">
        ${['Physics', 'Chemistry', 'Mathematics'].map(subject => {
          const chapters = state.chapters.filter(chapter => chapter.subject === subject);
          const progress = Math.round(chapters.reduce((sum, chapter) => sum + (chapter.theory + chapter.practice + chapter.pyq) / 3, 0) / Math.max(1, chapters.length));
          const weak = chapters.filter(chapter => chapter.strength === 'Weak').length;
          const minutes = balance(7)[subject]?.minutes || 0;
          return mini(subject, `${progress}%<small style="display:block;font-size:11.5px;color:var(--muted);font-family:var(--font-sans);letter-spacing:0;margin-top:4px">${formatMinutes(minutes)} • ${subjectStreak(subject)}d streak • ${weak} weak</small>`);
        }).join('')}
      </div>`;
  }

  function jeeView() {
    return `
      ${subjectDashboard()}
      <div class="content-grid">
        <section class="panel wide">
          <div class="panel-header">
            <div>
              <h3>JEE Chapter Master Syllabus</h3>
              <p class="panel-subtitle">Track theory, practice, PYQs, revision stage, and chapter strength.</p>
            </div>
            <button class="ghost-button" data-action="open-chapter-dialog">+ Add Chapter</button>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Chapter</th>
                  <th>Status</th>
                  <th>Theory</th>
                  <th>Practice</th>
                  <th>PYQ</th>
                  <th>Revision</th>
                  <th>Strength</th>
                </tr>
              </thead>
              <tbody>
                ${state.chapters.map((chapter, index) => `
                  <tr>
                    <td><strong>${escapeHTML(chapter.subject)}</strong></td>
                    <td>${escapeHTML(chapter.chapter)}</td>
                    <td>
                      <select data-action="chapter-status" data-index="${index}">
                        ${options(CHAPTER_STATUSES, chapter.status)}
                      </select>
                    </td>
                    <td>${progress(chapter.theory)}</td>
                    <td>${progress(chapter.practice)}</td>
                    <td>${progress(chapter.pyq)}</td>
                    <td>
                      <button class="tiny-button" data-action="revision-chapter" data-index="${index}">${escapeHTML(chapter.revision)}</button>
                    </td>
                    <td>
                      <span class="pill ${strengthTone(chapter.strength)}">${escapeHTML(chapter.strength)}</span>
                    </td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </section>

        <section class="panel">
          <div class="panel-header">
            <div>
              <h3>Mock Score Trend</h3>
              <p class="panel-subtitle">Test score, accuracy, and subject breakdown momentum.</p>
            </div>
          </div>
          ${mockTrend()}
        </section>

        <section class="panel wide">
          <div class="panel-header">
            <div>
              <h3>Revision Pipeline Planner</h3>
              <p class="panel-subtitle">Chapters queued for spaced repetition ordered by IST due dates.</p>
            </div>
          </div>
          ${revisionPlanner()}
        </section>

        <section class="panel wide">
          <div class="panel-header">
            <div>
              <h3>Log New Mock Test Result</h3>
              <p class="panel-subtitle">Record score, accuracy, silly mistakes, and subject breakdowns.</p>
            </div>
          </div>
          ${mockForm()}
        </section>

        <section class="panel wide">
          <div class="panel-header">
            <div>
              <h3>Mistake & Error Notebook</h3>
              <p class="panel-subtitle">Document repeated errors to build conceptual resilience.</p>
            </div>
          </div>
          ${mistakeNotebook()}
        </section>
      </div>`;
  }

  function mockForm() {
    return `
      <form class="mock-form" id="mockForm">
        <div class="form-grid three">
          <label>Total Score
            <input type="number" name="total" required placeholder="e.g. 153">
          </label>
          <label>Physics Score
            <input type="number" name="physics" required placeholder="e.g. 48">
          </label>
          <label>Chemistry Score
            <input type="number" name="chemistry" required placeholder="e.g. 55">
          </label>
        </div>
        <div class="form-grid three">
          <label>Mathematics Score
            <input type="number" name="math" required placeholder="e.g. 50">
          </label>
          <label>Attempted Questions
            <input type="number" name="attempted" min="0" placeholder="e.g. 64">
          </label>
          <label>Correct Answers
            <input type="number" name="correct" min="0" placeholder="e.g. 46">
          </label>
        </div>
        <div class="form-grid three">
          <label>Wrong Answers
            <input type="number" name="wrong" min="0" placeholder="e.g. 18">
          </label>
          <label>Accuracy %
            <input type="number" name="accuracy" min="0" max="100" required placeholder="e.g. 68">
          </label>
          <label>Silly Mistakes Count
            <input type="number" name="silly" min="0" required placeholder="e.g. 5">
          </label>
        </div>
        <div class="form-grid two">
          <label>Time Management Issue
            <input name="timeIssue" placeholder="e.g. Physics took 75 minutes, leaving Maths rushed">
          </label>
          <label>Weak Chapters Tagged
            <input name="weakChapters" placeholder="e.g. Electrostatics, Definite Integration">
          </label>
        </div>
        <label>Primary Key Takeaway / Lesson
          <textarea name="lesson" placeholder="e.g. Accuracy in Physical Chemistry was solid; need speed improvement in Maths Integration."></textarea>
        </label>
        <button class="primary-button" type="submit">Save Mock Result</button>
      </form>`;
  }

  function revisionPlanner() {
    const due = state.chapters.slice().sort((a, b) => String(a.nextRevision || '').localeCompare(String(b.nextRevision || '')));
    return `
      <div class="task-list">
        ${due.map((chapter) => `
          <div class="task-row">
            <span class="nav-icon">R</span>
            <div>
              <div class="task-title">${escapeHTML(chapter.subject)} — ${escapeHTML(chapter.chapter)}</div>
              <div class="task-meta">
                <span class="pill gold">Stage: ${escapeHTML(chapter.revision)}</span>
                <span>Last: ${chapter.lastRevised || 'None'}</span>
                <span>Next Due: ${chapter.nextRevision || 'Today'}</span>
                <span>Status: ${escapeHTML(chapter.status)}</span>
              </div>
            </div>
            <div class="task-actions">
              <button class="tiny-button" data-action="revision-chapter" data-index="${state.chapters.indexOf(chapter)}">Log Revision Done</button>
            </div>
          </div>`).join('')}
      </div>`;
  }

  function mistakeNotebook() {
    const counts = state.mistakes.reduce((acc, mistake) => { acc[mistake.type] = (acc[mistake.type] || 0) + 1; return acc; }, {});
    return `
      <form class="mock-form" id="mistakeForm">
        <div class="form-grid three">
          <label>Subject
            <select name="subject">${options(['Physics', 'Chemistry', 'Mathematics'], 'Physics')}</select>
          </label>
          <label>Chapter Name
            <input name="chapter" placeholder="Electrostatics" required>
          </label>
          <label>Error Type
            <select name="type">${options(MISTAKE_TYPES, 'Concept error')}</select>
          </label>
        </div>
        <label>Mistake Detail & Corrective Action
          <textarea name="note" placeholder="Describe what went wrong and how to avoid it next time..."></textarea>
        </label>
        <button class="primary-button" type="submit">Log Mistake in Notebook</button>
      </form>
      <div style="height:16px"></div>
      <div class="stat-grid">
        ${MISTAKE_TYPES.slice(0, 4).map(type => mini(type, `${counts[type] || 0}`)).join('')}
      </div>
      <div class="task-list" style="margin-top:14px">
        ${state.mistakes.slice(-6).reverse().map(mistake => `
          <div class="task-row">
            <span class="nav-icon">!</span>
            <div>
              <div class="task-title">${escapeHTML(mistake.subject)} • ${escapeHTML(mistake.chapter)}</div>
              <div class="task-meta">
                <span class="pill red">${escapeHTML(mistake.type)}</span>
                <span>${mistake.dateId}</span>
                <span>${escapeHTML(mistake.note)}</span>
              </div>
            </div>
            <button class="tiny-button" data-action="delete-mistake" data-id="${mistake.id}">Delete</button>
          </div>`).join('')}
      </div>`;
  }

  // View: Daily Review
  function reviewView() {
    const review = state.reviews[todayId()] || {};
    const todayStats = stats();
    return `
      <div class="content-grid">
        <section class="panel wide">
          <div class="panel-header">
            <div>
              <h3>Night Reflection & Closing Review</h3>
              <p class="panel-subtitle">Save daily reflection before the IST midnight cutoff.</p>
            </div>
            <span class="pill gold">IST Date: ${todayId()}</span>
          </div>

          <form class="review-form" id="reviewForm">
            <label>What went well today?
              <textarea name="wentWell" placeholder="Completed Physics PYQs with high focus...">${escapeHTML(review.wentWell || '')}</textarea>
            </label>
            <label>What went wrong or got missed?
              <textarea name="wentWrong" placeholder="Maths practice got delayed due to afternoon fatigue...">${escapeHTML(review.wentWrong || '')}</textarea>
            </label>
            <label>What distracted me?
              <textarea name="distraction" placeholder="Social media notifications, overthinking...">${escapeHTML(review.distraction || '')}</textarea>
            </label>
            <label>What main lesson did I learn today?
              <textarea name="learned" placeholder="Clear phone from study area before starting 90m problem solving block.">${escapeHTML(review.learned || '')}</textarea>
            </label>
            <div class="form-grid two">
              <label>Tomorrow’s top priority mission
                <input name="tomorrowPriority" value="${escapeAttr(review.tomorrowPriority || '')}" placeholder="Physics Electrostatics PYQs first thing in the morning">
              </label>
              <label>Target Sleep Time IST
                <input type="time" name="sleepTarget" value="${escapeAttr(review.sleepTarget || '23:30')}">
              </label>
            </div>
            <div class="form-grid two">
              <label>Energy Level
                <select name="energy">${options(['Low', 'Medium', 'High', 'Elite'], review.energy || 'Medium')}</select>
              </label>
              <label>Mood State
                <select name="mood">${options(['Tired', 'Calm', 'Focused', 'Intense'], review.mood || 'Focused')}</select>
              </label>
            </div>
            <button class="primary-button" type="submit">Save Night Review with IST Stamp</button>
          </form>
        </section>

        <section class="panel">
          <div class="panel-header">
            <div>
              <h3>Today Execution Summary</h3>
              <p class="panel-subtitle">Auto-evaluated from today's checklist and study logs.</p>
            </div>
          </div>
          ${scoreBars(todayStats)}
          <div style="height:16px"></div>
          ${review.savedAt ? `<span class="pill green">Saved at ${new Intl.DateTimeFormat('en-IN', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(new Date(review.savedAt))} IST</span>` : `<span class="pill red">Review Pending for Today</span>`}
        </section>
      </div>`;
  }

  // View: Settings & Data Controls
  function settingsView() {
    return `
      <div class="content-grid">
        <section class="panel wide">
          <div class="panel-header">
            <div>
              <h3>Kronos Settings & Engine Preferences</h3>
              <p class="panel-subtitle">All tracking, streaks, reset clocks, and performance evaluations enforce Indian Standard Time.</p>
            </div>
            <span class="pill green">${state.settings.mode}</span>
          </div>

          <form class="settings-grid" id="settingsForm">
            <div class="form-grid two">
              <label>User / Aspirant Name
                <input name="name" value="${escapeAttr(state.settings.name)}">
              </label>
              <label>App Visual Theme
                <select name="theme">${options(['light', 'dark'], state.ui.theme || 'light')}</select>
              </label>
            </div>
            <div class="form-grid two">
              <label>Daily Success Score Threshold %
                <input type="number" name="successThreshold" min="40" max="100" value="${state.settings.successThreshold}">
              </label>
              <label>Study Day Cutoff Mode
                <select name="studyDayCutoff">${options(['00:00', '02:30 future student mode'], state.settings.studyDayCutoff)}</select>
              </label>
            </div>
            <button class="primary-button" type="submit">Save Engine Settings</button>
          </form>
        </section>

        <section class="panel">
          <div class="panel-header">
            <div>
              <h3>Data Controls & Backup</h3>
              <p class="panel-subtitle">Manage browser storage, export backups, or restore state.</p>
            </div>
          </div>
          <div class="bars">
            <button class="ghost-button" data-action="export-json">Export Full State JSON</button>
            <button class="ghost-button" data-action="export-tasks-csv">Export Tasks CSV</button>
            <button class="ghost-button" data-action="export-mocks-csv">Export Mock Tests CSV</button>
            <button class="ghost-button" data-action="open-import-dialog">Import Backup JSON</button>
            <button class="ghost-button" style="color:var(--red);border-color:rgba(168,67,67,0.3)" data-action="reset-demo">Reset All Demo Data</button>
          </div>
        </section>
      </div>`;
  }

  // Visual Helper Components
  function taskList(tasks, compact = false) {
    if (!tasks.length) return empty('No tasks found', 'Add a mission task to populate your daily checklist.');
    return `<div class="task-list">${tasks.map(task => taskRow(task, compact)).join('')}</div>`;
  }

  function taskRow(task, compact) {
    const completionText = task.completedAt ? `${new Intl.DateTimeFormat('en-IN', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(new Date(task.completedAt))} IST` : titleCase(task.status || 'pending');
    return `
      <div class="task-row ${isCompleted(task) ? 'completed' : ''} ${task.status === 'missed' ? 'missed' : ''}">
        <button class="check-button" data-action="toggle-task" data-id="${task.id}" aria-label="Toggle completion">✓</button>
        <div>
          <div class="task-title">${escapeHTML(task.title)}</div>
          <div class="task-meta">
            <span class="priority-pill priority-${task.priority}">${escapeHTML(task.priority)}</span>
            <span>${escapeHTML(task.subject)}</span>
            <span>${formatMinutes(task.estimate)}</span>
            <span>${escapeHTML(task.difficulty)}</span>
            ${!compact ? `<span>${completionText}</span>` : ''}
          </div>
        </div>
        <div class="task-actions">
          <button class="tiny-button" data-action="edit-task" data-id="${task.id}">Edit</button>
          <button class="tiny-button" data-action="log-task-time" data-id="${task.id}">Log Time</button>
          <button class="tiny-button" data-action="delete-task" data-id="${task.id}">Delete</button>
        </div>
      </div>`;
  }

  function scoreBars(todayStats, prepProgress) {
    const rows = prepProgress == null ? [['Completion', todayStats.completionScore], ['Time', todayStats.timeScore], ['Focus', Math.min(100, todayStats.focusScore)]] : [['Prep', prepProgress], ['Daily', todayStats.completionScore], ['Time', todayStats.timeScore]];
    return `<div class="bars">${rows.map(([label, value]) => `<div class="bar-row"><span>${label}</span><div class="bar-track"><div class="bar-fill" style="width:${value}%"></div></div><strong>${value}${label === 'Focus' ? '' : '%'}</strong></div>`).join('')}</div>`;
  }

  function lineChart(days, key) {
    const values = Array.from({ length: days }, (_, index) => {
      const dateId = addDays(todayId(), index - days + 1);
      return { dateId, value: state.history[dateId]?.[key] || 0 };
    });
    const width = 520, height = 200, pad = 24, step = (width - pad * 2) / Math.max(1, days - 1);
    const points = values.map((item, index) => [pad + index * step, height - pad - (item.value / 100) * (height - pad * 2)]);
    const line = points.map(point => point.join(',')).join(' ');
    const area = `${pad},${height - pad} ${line} ${width - pad},${height - pad}`;
    return `<div class="chart-wrap"><svg class="line-chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><line class="chart-grid-line" x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}"/><line class="chart-grid-line" x1="${pad}" y1="${pad}" x2="${width - pad}" y2="${pad}"/><polygon class="chart-area" points="${area}"/><polyline class="chart-line" points="${line}"/>${points.map((point, index) => `<circle class="chart-dot" cx="${point[0]}" cy="${point[1]}" r="5" data-action="show-day-detail" data-date="${values[index].dateId}"><title>${dateLabel(values[index].dateId)} • ${values[index].value}%</title></circle>`).join('')}</svg></div>`;
  }

  function studyBars() {
    return `<div class="bars">${Array.from({ length: 7 }, (_, index) => {
      const dateId = addDays(todayId(), index - 6);
      const minutes = state.history[dateId]?.studyMinutes || 0;
      const pct = Math.min(100, Math.round((minutes / ((Number(state.goal.dailyHours) || 7.5) * 60)) * 100));
      return `<div class="bar-row"><span>${dateLabel(dateId, { weekday: 'short' }).slice(0, 3)}</span><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div><strong>${formatMinutes(minutes)}</strong></div>`;
    }).join('')}</div>`;
  }

  function heatmap(days) {
    return `<div class="heatmap">${Array.from({ length: days }, (_, index) => {
      const dateId = addDays(todayId(), index - days + 1);
      const score = state.history[dateId]?.completionScore || 0;
      const level = score >= 90 ? 4 : score >= 75 ? 3 : score >= 55 ? 2 : score > 0 ? 1 : 0;
      return `<button class="heat-cell" data-action="show-day-detail" data-date="${dateId}" data-level="${level}" title="${dateId}: ${score}% completion"></button>`;
    }).join('')}</div>`;
  }

  function balanceView() {
    const data = balance(7);
    const physics = data.Physics.pct;
    const chemistry = data.Chemistry.pct;
    return `<div class="donut" style="--physics:${physics}%;--chemistry:${chemistry}%;"></div><div class="subject-bars">${Object.entries(data).map(([subject, item]) => `<div class="subject-row"><div class="subject-top"><span>${subject}</span><strong>${item.pct}% • ${formatMinutes(item.minutes)}</strong></div><div class="bar-track"><div class="bar-fill" style="width:${item.pct}%"></div></div></div>`).join('')}</div>`;
  }

  function progress(value) {
    return `<div class="bar-track"><div class="bar-fill" style="width:${value}%"></div></div><small>${value}%</small>`;
  }

  function strengthTone(strength) {
    if (strength === 'Weak') return 'red';
    if (strength === 'Strong' || strength === 'Mastered') return 'green';
    return 'gold';
  }

  function mockTrend() {
    if (!state.mocks.length) return empty('No mock tests recorded yet', 'Add your first mock result.');
    const latest = state.mocks.slice(-4).reverse();
    return `
      ${mockLineChart('total', 300)}
      <div class="bars" style="margin-top:10px">${latest.map(mock => `<div class="bar-row"><span>${dateLabel(mock.dateId)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, mock.total / 3)}%"></div></div><strong>${mock.total}</strong></div>`).join('')}</div>
      <div style="height:14px"></div>
      <h3 style="font-size:14px;margin-bottom:8px">Accuracy % Momentum</h3>
      ${mockLineChart('accuracy', 100)}
      <div style="height:14px"></div>
      <h3 style="font-size:14px;margin-bottom:8px">Latest Mock Subject Breakdown</h3>
      ${latest[0] ? `<div class="bars"><div class="bar-row"><span>Physics</span><div class="bar-track"><div class="bar-fill" style="width:${latest[0].physics}%"></div></div><strong>${latest[0].physics}</strong></div><div class="bar-row"><span>Chemistry</span><div class="bar-track"><div class="bar-fill" style="width:${latest[0].chemistry}%"></div></div><strong>${latest[0].chemistry}</strong></div><div class="bar-row"><span>Maths</span><div class="bar-track"><div class="bar-fill" style="width:${latest[0].math}%"></div></div><strong>${latest[0].math}</strong></div></div>` : ''}`;
  }

  function mockLineChart(key, maxValue) {
    const list = state.mocks.slice(-7);
    const width = 420, height = 150, pad = 20;
    const step = (width - pad * 2) / Math.max(1, list.length - 1);
    const points = list.map((mock, index) => [pad + index * step, height - pad - ((Number(mock[key]) || 0) / maxValue) * (height - pad * 2)]);
    const line = points.map(point => point.join(',')).join(' ');
    return `<svg class="line-chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><polyline class="chart-line" points="${line}"/>${points.map((point, index) => `<circle class="chart-dot" cx="${point[0]}" cy="${point[1]}" r="5"><title>${list[index][key]}</title></circle>`).join('')}</svg>`;
  }

  function insights() {
    const data = balance(7);
    const weakest = Object.entries(data).sort((a, b) => a[1].pct - b[1].pct)[0];
    const todayStats = stats();
    const reviewMissing = !state.reviews[todayId()];
    const recoveryCount = unresolvedBacklog().length;
    return `
      <div class="task-list">
        <div class="task-row"><span class="nav-icon">✦</span><div><div class="task-title">${weakest[0]} needs additional focused study time this week.</div><div class="task-meta">Only ${weakest[1].pct}% of PCM study time went here over the last 7 days.</div></div></div>
        <div class="task-row"><span class="nav-icon">◈</span><div><div class="task-title">Today’s Focus Score is ${todayStats.focusScore}/100.</div><div class="task-meta">Critical task compliance rate: ${todayStats.criticalRate}%.</div></div></div>
        <div class="task-row"><span class="nav-icon">✓</span><div><div class="task-title">${reviewMissing ? 'Night reflection is pending for today.' : 'Night review is saved in IST.'}</div><div class="task-meta">Day closes strictly at 11:59:59 PM IST.</div></div></div>
        <div class="task-row"><span class="nav-icon">↺</span><div><div class="task-title">${recoveryCount ? `${recoveryCount} missed task${recoveryCount > 1 ? 's' : ''} in recovery backlog.` : 'No unresolved recovery items.'}</div><div class="task-meta">Use rollover controls on the Today page to clear backlog.</div></div></div>
      </div>`;
  }

  function renderRightPanel() {
    const todayStats = stats();
    const currentStreak = streak();
    const left = deadlineLeft();
    
    $('#rightPanel').innerHTML = `
      <div class="side-stack">
        <section class="kronos-clock">
          <p class="eyebrow" style="color:rgba(255,248,234,0.7)">Live IST Clock</p>
          <div class="clock-time" id="sideClockTime">--:--:--</div>
          <div class="clock-date" id="sideClockDate">${istDateText()} • IST</div>
        </section>

        <section class="side-card">
          <h3>Today Closes In</h3>
          <div class="side-number" id="resetCountdown">${formatDuration(nextISTResetMs() - Date.now(), true)}</div>
          <p class="panel-subtitle" style="margin-top:6px">Strict Midnight Reset. Kronos Day: <strong>${todayId()}</strong></p>
        </section>

        <section class="side-card">
          <h3>Stopwatch & Pomodoro Timer</h3>
          <label style="margin-bottom:8px">Subject Focus
            <select id="timerSubject">${options(['Physics', 'Chemistry', 'Mathematics', 'Revision', 'Mock Test'], focusTimer.subject)}</select>
          </label>
          <div class="timer-display">
            <strong id="timerDisplay">00:00:00</strong>
            <span class="pill green">${formatMinutes(todayStats.studyMinutes)} logged today</span>
          </div>
          <div class="timer-buttons">
            <button class="ghost-button" data-action="timer-start">${focusTimer.running && focusTimer.mode === 'stopwatch' ? 'Pause' : 'Start'}</button>
            <button class="ghost-button" data-action="timer-pomodoro">Pomodoro 25</button>
            <button class="ghost-button" data-action="timer-finish">Finish Session</button>
            <button class="ghost-button" data-action="timer-25">+25m Quick</button>
          </div>
        </section>

        <section class="side-card">
          <h3>Exam Target Countdown</h3>
          <div class="countdown-stack">
            <div class="count-box"><strong id="leftDaysCount">${left.days}</strong><span>Days</span></div>
            <div class="count-box"><strong id="leftHoursCount">${left.hours}</strong><span>Hours</span></div>
            <div class="count-box"><strong id="leftMinsCount">${left.minutes}</strong><span>Mins</span></div>
          </div>
          <div style="margin-top:8px;text-align:center;font-size:12px;color:var(--muted);font-weight:700" id="leftSecsInline">${left.seconds} seconds remaining</div>
        </section>

        <section class="side-card">
          <h3>Streaks & Mission Status</h3>
          <div class="countdown-stack">
            <div class="count-box"><strong>${currentStreak.current}d</strong><span>Current</span></div>
            <div class="count-box"><strong>${currentStreak.longest}d</strong><span>Longest</span></div>
            <div class="count-box"><strong>${todayStats.completionScore}%</strong><span>Score</span></div>
          </div>
        </section>

        <section class="side-card">
          <h3>Daily Coaching Insight</h3>
          <p class="panel-subtitle">${missedYesterday() ? 'Yesterday was below threshold. Today is your comeback day.' : todayStats.criticalDone ? 'All critical tasks protected! Push toward an elite day.' : 'Critical priority task pending. Finish it first to protect streak.'}</p>
        </section>
      </div>`;
  }

  // Ticking Timers & Clock Updates
  function updateClock() {
    const parts = istParts();
    const left = deadlineLeft();
    
    if ($('#topDate')) $('#topDate').textContent = `${istDateText()} • Day ${todayId()}`;
    if ($('#topTime')) $('#topTime').textContent = parts.timeText;
    if ($('#sideClockTime')) $('#sideClockTime').textContent = parts.timeText.replace(' IST', '');
    if ($('#sideClockDate')) $('#sideClockDate').textContent = `${istDateText()} • IST`;
    if ($('#resetCountdown')) $('#resetCountdown').textContent = formatDuration(nextISTResetMs() - Date.now(), true);
    if ($('#todayCloseInline')) $('#todayCloseInline').textContent = formatDuration(nextISTResetMs() - Date.now(), true);
    if ($('#deadlineCountdownInline')) $('#deadlineCountdownInline').textContent = deadlineText();
    
    if ($('#leftDaysCount')) $('#leftDaysCount').textContent = left.days;
    if ($('#leftHoursCount')) $('#leftHoursCount').textContent = left.hours;
    if ($('#leftMinsCount')) $('#leftMinsCount').textContent = left.minutes;
    if ($('#leftSecsInline')) $('#leftSecsInline').textContent = `${left.seconds} seconds remaining`;

    updateTimerUI();
  }

  function updateTimerUI() {
    const display = $('#timerDisplay');
    if (!display) return;
    const elapsed = focusTimer.elapsed + (focusTimer.running ? Date.now() - focusTimer.startedAt : 0);
    if (focusTimer.mode === 'pomodoro') {
      const remaining = focusTimer.pomodoroMs - elapsed;
      display.textContent = formatDuration(remaining);
      if (focusTimer.running && remaining <= 0) {
        focusTimer.running = false;
        focusTimer.elapsed = 0;
        focusTimer.mode = 'stopwatch';
        logFocus(25, focusTimer.subject, 'Pomodoro 25 Complete');
      }
    } else {
      display.textContent = formatDuration(elapsed);
    }
  }

  function logFocus(minutes, subject = focusTimer.subject, label = 'Study session logged') {
    const safeMinutes = Math.round(Number(minutes) || 0);
    if (safeMinutes <= 0) return;
    state.sessions.push({
      id: uid('session'),
      dateId: todayId(),
      subject,
      minutes: safeMinutes,
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      label
    });
    toast(`${label}: ${formatMinutes(safeMinutes)} for ${subject}`);
    render();
  }

  function toast(message) {
    const toastEl = $('#toast');
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => toastEl.classList.remove('show'), 2400);
  }

  // Dialog & Modal Handlers
  function openTaskDialog(taskId = null) {
    const dialog = $('#taskDialog');
    const form = $('#taskForm');
    const title = $('#taskDialog h2');
    form.reset();
    form.dataset.editId = taskId || '';
    title.textContent = taskId ? 'Edit Mission Task' : 'Add Mission Task';
    const task = taskId ? dayTasks().find(item => item.id === taskId) : null;
    if (task) {
      form.title.value = task.title;
      form.subject.value = task.subject;
      form.category.value = task.category;
      form.priority.value = task.priority;
      form.difficulty.value = task.difficulty;
      form.estimate.value = task.estimate;
      form.notes.value = task.notes || '';
    }
    dialog.showModal();
  }

  function openGoalDialog() {
    const form = $('#goalDialogForm');
    const parts = deadlineParts();
    form.name.value = state.goal.name;
    form.target.value = state.goal.target;
    form.type.value = state.goal.type || 'Competitive Exam';
    form.deadlineDate.value = parts.date;
    form.deadlineTime.value = parts.time;
    form.dailyHours.value = state.goal.dailyHours;
    form.progress.value = state.goal.progress || 40;
    form.phase.value = state.goal.phase || '';
    form.weakArea.value = state.goal.weakArea || '';
    $('#goalDialog').showModal();
  }

  function saveGoal(form) {
    const data = Object.fromEntries(new FormData(form));
    state.goal = {
      ...state.goal,
      name: data.name,
      target: data.target,
      type: data.type || state.goal.type,
      deadlineISO: buildDeadlineISO(data.deadlineDate, data.deadlineTime),
      dailyHours: Number(data.dailyHours),
      progress: Number(data.progress) || state.goal.progress,
      phase: data.phase || '',
      weakArea: data.weakArea || '',
      prepStrategy: data.prepStrategy || state.goal.prepStrategy || ''
    };
    toast('Main goal architecture saved');
    render();
  }

  function showDayDetail(dateId) {
    const h = state.history[dateId];
    const tasks = state.tasksByDate[dateId] || [];
    const sessions = state.sessions.filter(s => s.dateId === dateId);
    const review = state.reviews[dateId];

    $('#dayDetailTitle').textContent = `${dateLabel(dateId, { weekday: 'long', year: 'numeric', month: 'long' })} (${dateId})`;
    $('#dayDetailBody').innerHTML = `
      <div class="stat-grid" style="margin-bottom:16px">
        ${mini('Completion', `${h?.completionScore || 0}%`)}
        ${mini('Study Time', formatMinutes(h?.studyMinutes || 0))}
        ${mini('Tasks Done', `${h?.completedTasks || 0}/${h?.totalTasks || tasks.length}`)}
        ${mini('Status', h?.success ? 'Successful Day' : h ? 'Missed / Weak Day' : 'No Record')}
      </div>
      <h3 style="font-size:16px;margin-bottom:10px">Tasks Recorded on ${dateId}</h3>
      ${taskList(tasks)}
      ${sessions.length ? `<h3 style="font-size:16px;margin:16px 0 10px">Logged Stopwatch Sessions</h3><div class="task-list">${sessions.map(s => `<div class="task-row"><span class="nav-icon">⏱</span><div><div class="task-title">${escapeHTML(s.subject)} — ${formatMinutes(s.minutes)}</div><div class="task-meta"><span>${s.label}</span></div></div></div>`).join('')}</div>` : ''}
      ${review ? `<h3 style="font-size:16px;margin:16px 0 10px">Night Review Entry</h3><div class="panel" style="padding:14px"><p><strong>Well:</strong> ${escapeHTML(review.wentWell || 'None')}</p><p><strong>Distractions:</strong> ${escapeHTML(review.distraction || 'None')}</p><p><strong>Lesson:</strong> ${escapeHTML(review.learned || 'None')}</p></div>` : ''}`;
    
    $('#dayDetailDialog').showModal();
  }

  function originalTaskForBacklog(item) {
    return state.tasksByDate[item.sourceDate]?.find(task => task.id === item.originalTaskId);
  }

  function moveBacklog(id, split = false) {
    const item = state.backlog.find(entry => entry.id === id);
    if (!item) return;
    const original = originalTaskForBacklog(item);
    if (split) {
      const half = Math.max(10, Math.ceil((Number(item.estimate) || 30) / 2));
      dayTasks().push(makeTask(`${item.title} — Part 1`, item.subject, item.priority, half, item.category, item.difficulty, false, item.notes));
      dayTasks().push(makeTask(`${item.title} — Part 2`, item.subject, item.priority, half, item.category, item.difficulty, false, item.notes));
      item.status = 'split-to-today';
    } else {
      dayTasks().push(makeTask(`${item.title} (Recovered)`, item.subject, item.priority, item.estimate, item.category, item.difficulty, false, item.notes));
      item.status = 'moved-to-today';
    }
    if (original) original.recoveryStatus = item.status;
    toast(split ? 'Missed task split into 2 today tasks' : 'Missed task moved to today');
    render();
  }

  function skipBacklog(id) {
    const item = state.backlog.find(entry => entry.id === id);
    if (!item) return;
    item.status = 'skipped';
    const original = originalTaskForBacklog(item);
    if (original) {
      original.status = 'skipped';
      original.recoveryStatus = 'skipped';
    }
    toast('Missed task marked as skipped');
    render();
  }

  // Export CSV Helper
  function exportCSV(filename, headers, rows) {
    const content = [headers.join(','), ...rows.map(row => row.map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Event Listeners Routing
  document.addEventListener('click', event => {
    const nav = event.target.closest('[data-view]');
    if (nav) {
      activeView = nav.dataset.view;
      render();
      return;
    }
    const jump = event.target.closest('[data-jump]');
    if (jump) {
      activeView = jump.dataset.jump;
      render();
      return;
    }
    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.dataset.action;
    const id = event.target.closest('[data-id]')?.dataset.id;

    if (action === 'open-task-dialog') openTaskDialog();
    if (action === 'close-task-dialog') $('#taskDialog').close();
    if (action === 'open-goal-dialog') openGoalDialog();
    if (action === 'close-goal-dialog') $('#goalDialog').close();
    if (action === 'close-day-detail-dialog') $('#dayDetailDialog').close();
    if (action === 'open-milestone-dialog') $('#milestoneDialog').showModal();
    if (action === 'close-milestone-dialog') $('#milestoneDialog').close();
    if (action === 'open-chapter-dialog') $('#chapterDialog').showModal();
    if (action === 'close-chapter-dialog') $('#chapterDialog').close();
    if (action === 'open-import-dialog') $('#importDialog').showModal();
    if (action === 'close-import-dialog') $('#importDialog').close();

    if (action === 'toggle-theme') {
      state.ui.theme = state.ui.theme === 'dark' ? 'light' : 'dark';
      render();
    }
    if (action === 'clear-task-filters') {
      state.ui.taskStatusFilter = 'all';
      state.ui.taskPriorityFilter = 'all';
      searchQuery = '';
      render();
    }
    if (action === 'edit-task') openTaskDialog(id);
    if (action === 'toggle-task') {
      const task = dayTasks().find(item => item.id === id);
      if (task) {
        const wasDone = isCompleted(task);
        task.status = wasDone ? 'not-started' : 'completed';
        task.completedAt = wasDone ? null : new Date().toISOString();
        toast(wasDone ? 'Task reopened' : 'Task completed in IST');
        render();
      }
    }
    if (action === 'delete-task') {
      state.tasksByDate[todayId()] = dayTasks().filter(task => task.id !== id);
      toast('Task deleted');
      render();
    }
    if (action === 'log-task-time') {
      const task = dayTasks().find(item => item.id === id);
      if (task) logFocus(task.estimate || 25, ['Physics', 'Chemistry', 'Mathematics'].includes(task.subject) ? task.subject : 'Revision', 'Task time logged');
    }
    if (action === 'toggle-milestone') {
      const m = state.goal.milestones.find(item => item.id === id);
      if (m) { m.completed = !m.completed; toast('Milestone status toggled'); render(); }
    }
    if (action === 'delete-milestone') {
      state.goal.milestones = state.goal.milestones.filter(item => item.id !== id);
      toast('Milestone deleted');
      render();
    }
    if (action === 'toggle-weekly') {
      const w = state.goal.weeklyTargets.find(item => item.id === id);
      if (w) { w.completed = !w.completed; toast('Weekly target status toggled'); render(); }
    }
    if (action === 'delete-weekly') {
      state.goal.weeklyTargets = state.goal.weeklyTargets.filter(item => item.id !== id);
      toast('Weekly target deleted');
      render();
    }
    if (action === 'delete-mistake') {
      state.mistakes = state.mistakes.filter(m => m.id !== id);
      toast('Mistake removed');
      render();
    }

    if (action === 'move-backlog') moveBacklog(id, false);
    if (action === 'split-backlog') moveBacklog(id, true);
    if (action === 'skip-backlog') skipBacklog(id);

    if (action === 'timer-start') {
      focusTimer.subject = $('#timerSubject')?.value || focusTimer.subject;
      focusTimer.mode = 'stopwatch';
      if (focusTimer.running) { focusTimer.elapsed += Date.now() - focusTimer.startedAt; focusTimer.running = false; }
      else { focusTimer.startedAt = Date.now(); focusTimer.running = true; }
      renderRightPanel();
      updateTimerUI();
    }
    if (action === 'timer-pomodoro') {
      focusTimer.subject = $('#timerSubject')?.value || focusTimer.subject;
      focusTimer.mode = 'pomodoro';
      focusTimer.elapsed = 0;
      focusTimer.startedAt = Date.now();
      focusTimer.running = true;
      toast('Pomodoro started: 25 minutes');
      renderRightPanel();
      updateTimerUI();
    }
    if (action === 'timer-finish') {
      const elapsed = focusTimer.elapsed + (focusTimer.running ? Date.now() - focusTimer.startedAt : 0);
      const minutes = focusTimer.mode === 'pomodoro' ? Math.round((focusTimer.pomodoroMs - Math.max(0, focusTimer.pomodoroMs - elapsed)) / 60000) : elapsed / 60000;
      focusTimer.running = false;
      focusTimer.elapsed = 0;
      focusTimer.mode = 'stopwatch';
      logFocus(minutes, focusTimer.subject, 'Session finished');
    }
    if (action === 'timer-25') {
      focusTimer.subject = $('#timerSubject')?.value || focusTimer.subject;
      logFocus(25, focusTimer.subject, 'Quick 25m study block');
    }

    if (action === 'revision-chapter') {
      const chapter = state.chapters[Number(actionEl.dataset.index)];
      if (chapter) {
        const next = REVISION_FLOW[(REVISION_FLOW.indexOf(chapter.revision) + 1) % REVISION_FLOW.length] || 'R1';
        chapter.revision = next;
        chapter.lastRevised = todayId();
        chapter.nextRevision = addDays(todayId(), next === 'Final' || next === 'PYQ done' ? 7 : 3);
        toast(`${chapter.chapter} revision updated to ${next}`);
        render();
      }
    }
    if (action === 'show-day-detail') showDayDetail(actionEl.dataset.date);
    if (action === 'calendar-prev') { state.ui.calendarMonthOffset = (Number(state.ui.calendarMonthOffset) || 0) - 1; render(); }
    if (action === 'calendar-next') { state.ui.calendarMonthOffset = (Number(state.ui.calendarMonthOffset) || 0) + 1; render(); }
    if (action === 'calendar-today') { state.ui.calendarMonthOffset = 0; render(); }

    if (action === 'export-json') {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kronos-tracker-export-${todayId()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast('Export JSON generated');
    }
    if (action === 'export-tasks-csv') {
      const tasks = Object.entries(state.tasksByDate).flatMap(([date, list]) => list.map(t => [date, t.title, t.subject, t.priority, t.difficulty, t.estimate, t.status, t.completedAt || '']));
      exportCSV(`kronos-tasks-${todayId()}.csv`, ['DateID', 'Title', 'Subject', 'Priority', 'Difficulty', 'EstimateMin', 'Status', 'CompletedAt'], tasks);
      toast('Tasks CSV exported');
    }
    if (action === 'export-mocks-csv') {
      const mocks = state.mocks.map(m => [m.dateId, m.total, m.physics, m.chemistry, m.math, m.accuracy, m.silly, m.timeIssue, m.weakChapters, m.lesson]);
      exportCSV(`kronos-mocks-${todayId()}.csv`, ['DateID', 'Total', 'Physics', 'Chemistry', 'Math', 'Accuracy', 'Silly', 'TimeIssue', 'WeakChapters', 'Lesson'], mocks);
      toast('Mock Tests CSV exported');
    }
    if (action === 'reset-demo') {
      if (confirm('Reset Kronos Tracker demo state? All local storage will be refreshed.')) {
        localStorage.removeItem(KEY);
        localStorage.removeItem(LEGACY_KEY_V2);
        localStorage.removeItem(LEGACY_KEY_V1);
        state = seedState();
        activeView = 'dashboard';
        render();
      }
    }
  });

  document.addEventListener('input', event => {
    if (event.target.id === 'taskSearchInput') {
      searchQuery = event.target.value;
      const filtered = filteredTasks(dayTasks());
      const container = $('.content-grid .panel:nth-child(3)') || $('.content-grid');
      render();
    }
  });

  document.addEventListener('change', event => {
    if (event.target.id === 'timerSubject') focusTimer.subject = event.target.value;
    if (event.target.matches('[data-filter="status"]')) { state.ui.taskStatusFilter = event.target.value; render(); }
    if (event.target.matches('[data-filter="priority"]')) { state.ui.taskPriorityFilter = event.target.value; render(); }
    if (event.target.matches('[data-action="chapter-status"]')) {
      state.chapters[Number(event.target.dataset.index)].status = event.target.value;
      toast('Chapter status updated');
      saveState();
    }
  });

  document.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.target;
    
    if (form.id === 'taskForm') {
      const data = Object.fromEntries(new FormData(form));
      const editId = form.dataset.editId;
      if (editId) {
        const task = dayTasks().find(item => item.id === editId);
        if (task) Object.assign(task, { title: data.title, subject: data.subject, category: data.category, priority: data.priority, difficulty: data.difficulty, estimate: Number(data.estimate), notes: data.notes || '' });
        toast('Task updated');
      } else {
        dayTasks().push(makeTask(data.title, data.subject, data.priority, Number(data.estimate), data.category, data.difficulty, false, data.notes));
        toast('Mission task added to today');
      }
      form.reset();
      form.dataset.editId = '';
      $('#taskDialog').close();
      render();
    }

    if (form.id === 'goalDialogForm' || form.id === 'goalPageForm') saveGoal(form);

    if (form.id === 'milestoneForm') {
      const data = Object.fromEntries(new FormData(form));
      if (data.kind === 'milestone') {
        state.goal.milestones.push({ id: uid('m'), title: data.title, targetDate: data.targetDate, completed: false, category: data.category });
        toast('Monthly milestone added');
      } else {
        state.goal.weeklyTargets.push({ id: uid('w'), title: data.title, targetHours: Number(data.targetHours) || 10, completed: false });
        toast('Weekly target added');
      }
      form.reset();
      $('#milestoneDialog').close();
      render();
    }

    if (form.id === 'chapterForm') {
      const data = Object.fromEntries(new FormData(form));
      state.chapters.push({
        subject: data.subject,
        chapter: data.chapter,
        status: 'Practice ongoing',
        theory: Number(data.theory) || 50,
        practice: Number(data.practice) || 20,
        pyq: Number(data.pyq) || 10,
        revision: data.revision || 'R1',
        strength: data.strength || 'Medium',
        lastRevised: todayId(),
        nextRevision: addDays(todayId(), 3)
      });
      form.reset();
      $('#chapterDialog').close();
      toast('Chapter added to JEE tracker');
      render();
    }

    if (form.id === 'reviewForm') {
      const data = Object.fromEntries(new FormData(form));
      state.reviews[todayId()] = { ...data, savedAt: new Date().toISOString() };
      toast('Night review saved with IST timestamp');
      render();
    }

    if (form.id === 'mockForm') {
      const data = Object.fromEntries(new FormData(form));
      state.mocks.push({
        id: uid('mock'),
        dateId: todayId(),
        total: Number(data.total),
        physics: Number(data.physics),
        chemistry: Number(data.chemistry),
        math: Number(data.math),
        attempted: Number(data.attempted) || 0,
        correct: Number(data.correct) || 0,
        wrong: Number(data.wrong) || 0,
        accuracy: Number(data.accuracy),
        silly: Number(data.silly),
        timeIssue: data.timeIssue || '',
        weakChapters: data.weakChapters || '',
        lesson: data.lesson || ''
      });
      form.reset();
      toast('Mock result saved');
      render();
    }

    if (form.id === 'mistakeForm') {
      const data = Object.fromEntries(new FormData(form));
      state.mistakes.push({
        id: uid('mistake'),
        dateId: todayId(),
        subject: data.subject,
        chapter: data.chapter,
        type: data.type,
        note: data.note || ''
      });
      form.reset();
      toast('Mistake logged in notebook');
      render();
    }

    if (form.id === 'settingsForm') {
      const data = Object.fromEntries(new FormData(form));
      state.settings.name = data.name;
      state.settings.successThreshold = Number(data.successThreshold);
      state.settings.studyDayCutoff = data.studyDayCutoff;
      state.ui.theme = data.theme;
      toast('Settings saved');
      render();
    }

    if (form.id === 'importForm') {
      const data = Object.fromEntries(new FormData(form));
      try {
        const imported = JSON.parse(data.jsonContent);
        state = normalizeState(imported);
        $('#importDialog').close();
        toast('Backup state successfully restored');
        render();
      } catch (err) {
        alert('Invalid JSON content. Please check the export file and try again.');
      }
    }
  });

  // Ticking interval
  setInterval(updateClock, 1000);
  render();
})();
