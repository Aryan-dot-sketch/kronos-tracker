(() => {
  const TZ = 'Asia/Kolkata';
  const KEY = 'kronos-tracker-state-v1';
  const WEIGHT = { critical: 5, high: 3, medium: 2, low: 1 };
  const LABELS = {
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
  const $$ = (q, root = document) => [...root.querySelectorAll(q)];
  const esc = v => String(v ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const attr = esc;
  const uid = p => (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${p}_${Date.now()}_${Math.random().toString(16).slice(2)}`);

  let state = load();
  let view = state.ui?.activeView || 'dashboard';
  let focus = { running: false, startedAt: 0, elapsed: 0, subject: 'Physics' };

  function istParts(date = new Date()) {
    const f = new Intl.DateTimeFormat('en-GB', {
      timeZone: TZ, weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    const p = Object.fromEntries(f.formatToParts(date).map(x => [x.type, x.value]));
    const hour = p.hour === '24' ? '00' : p.hour;
    return { weekday: p.weekday, year: +p.year, month: +p.month, day: +p.day, hour: +hour, minute: +p.minute, second: +p.second, dateId: `${p.year}-${p.month}-${p.day}`, timeText: `${hour}:${p.minute}:${p.second} IST` };
  }
  const todayId = () => istParts().dateId;
  function istDateText(date = new Date()) { return new Intl.DateTimeFormat('en-IN', { timeZone: TZ, weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(date); }
  function addDays(id, n) { const [y, m, d] = id.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d + n, 12)).toISOString().slice(0, 10); }
  function dateLabel(id, opts = {}) { const [y, m, d] = id.split('-').map(Number); return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: opts.month || 'short', weekday: opts.weekday, year: opts.year }).format(new Date(Date.UTC(y, m - 1, d, 12))); }
  function nextResetMs() { const p = istParts(); return Date.UTC(p.year, p.month - 1, p.day + 1, -5, -30, 0); }
  function dur(ms, compact = false) { let s = Math.max(0, Math.floor(ms / 1000)); const h = Math.floor(s / 3600); s %= 3600; const m = Math.floor(s / 60); const sec = s % 60; return compact ? (h ? `${h}h ${m}m` : `${m}m ${sec}s`) : `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`; }
  function mins(v) { v = Math.round(Number(v) || 0); const h = Math.floor(v / 60), m = v % 60; return h ? `${h}h${m ? ` ${m}m` : ''}` : `${m}m`; }
  function deadlineParts() { const [date, rest = '09:00'] = state.goal.deadlineISO.split('T'); return { date, time: rest.slice(0, 5) }; }
  function deadlineISO(date, time) { return `${date}T${time || '09:00'}:00+05:30`; }
  function deadlineLeft() { const ms = Math.max(0, new Date(state.goal.deadlineISO).getTime() - Date.now()); return { days: Math.floor(ms / 86400000), hours: Math.floor((ms % 86400000) / 3600000), minutes: Math.floor((ms % 3600000) / 60000) }; }
  function deadlineText() { const d = deadlineLeft(); return d.days ? `${d.days} days ${d.hours}h left` : `${d.hours}h ${d.minutes}m left`; }

  function makeTask(title, subject, priority, estimate, category, difficulty, done = false, notes = '') {
    return { id: uid('task'), title, subject, priority, estimate: +estimate, category, difficulty, status: done ? 'completed' : 'not-started', completedAt: done ? new Date().toISOString() : null, notes };
  }

  function seed() {
    const today = todayId();
    const tasksByDate = { [today]: [
      makeTask('Physics Electrostatics — solve 40 PYQs', 'Physics', 'critical', 95, 'Practice', 'Hard', true, 'Electric field + potential.'),
      makeTask('Chemistry GOC revision — mechanism notes', 'Chemistry', 'high', 60, 'Revision', 'Medium', true),
      makeTask('Mathematics Definite Integration — 25 questions', 'Mathematics', 'critical', 90, 'Practice', 'Hard'),
      makeTask('Full mock analysis — error notebook', 'Mock Test', 'high', 45, 'Mock', 'Medium', true),
      makeTask('Formula revision — current electricity + calculus', 'Revision', 'medium', 30, 'Revision', 'Easy'),
      makeTask('Night review before IST reset', 'General', 'medium', 15, 'Review', 'Easy')
    ] };
    const history = {}, sample = [72, 84, 66, 91, 88, 54, 79, 82, 73, 94, 61, 76, 87, 69, 92, 71, 78, 83, 58, 89, 96, 64, 74, 81, 68, 85, 90, 77, 63, 86, 70, 93, 75, 80, 62, 88];
    for (let i = -36; i < 0; i++) {
      const date = addDays(today, i), score = sample[(i + 36) % sample.length];
      history[date] = { dateId: date, completionScore: score, timeScore: Math.max(45, Math.min(100, score + (i % 4) * 3)), focusScore: Math.max(42, Math.min(100, Math.round(score * .85 + 12))), studyMinutes: Math.round(260 + score * 2.3 + (i % 5) * 13), completedTasks: Math.round(5 + score / 14), totalTasks: 12, success: score >= 70, subjectMinutes: { Physics: 95 + (score % 5) * 18, Chemistry: 85 + (score % 7) * 14, Mathematics: 100 + (score % 6) * 15 } };
    }
    return {
      version: 1,
      ui: { activeView: 'dashboard', theme: 'light' },
      settings: { name: 'Aspirant', mode: 'Strict IST Mode', studyDayCutoff: '00:00', successThreshold: 70 },
      goal: { name: 'JEE Mains 2027', type: 'Exam Goal', target: '98 percentile', deadlineISO: '2027-01-15T09:00:00+05:30', dailyHours: 7, progress: 41, phase: 'Foundation + PYQ build', weakArea: 'Physics • Electrostatics', riskLevel: 'Medium' },
      tasksByDate, history, reviews: {}, sessions: [],
      mocks: [
        { id: uid('mock'), dateId: addDays(today, -24), total: 112, physics: 34, chemistry: 42, math: 36, accuracy: 54, silly: 9, lesson: 'Need better time split.' },
        { id: uid('mock'), dateId: addDays(today, -18), total: 126, physics: 41, chemistry: 46, math: 39, accuracy: 58, silly: 8, lesson: 'Chemistry accuracy improved.' },
        { id: uid('mock'), dateId: addDays(today, -12), total: 141, physics: 43, chemistry: 51, math: 47, accuracy: 63, silly: 6, lesson: 'Maths speed improving.' },
        { id: uid('mock'), dateId: addDays(today, -6), total: 137, physics: 39, chemistry: 52, math: 46, accuracy: 61, silly: 7, lesson: 'Physics concepts weak.' },
        { id: uid('mock'), dateId: addDays(today, -1), total: 153, physics: 48, chemistry: 55, math: 50, accuracy: 68, silly: 5, lesson: 'Good upward trend.' }
      ],
      chapters: [
        { subject: 'Physics', chapter: 'Electrostatics', status: 'Practice ongoing', theory: 85, practice: 52, pyq: 40, revision: 'R1', strength: 'Weak' },
        { subject: 'Physics', chapter: 'Current Electricity', status: 'Revision needed', theory: 100, practice: 68, pyq: 55, revision: 'R2', strength: 'Medium' },
        { subject: 'Chemistry', chapter: 'GOC', status: 'Practice ongoing', theory: 90, practice: 63, pyq: 50, revision: 'R1', strength: 'Medium' },
        { subject: 'Chemistry', chapter: 'Chemical Bonding', status: 'Strong', theory: 100, practice: 78, pyq: 72, revision: 'R2', strength: 'Strong' },
        { subject: 'Mathematics', chapter: 'Definite Integration', status: 'Practice ongoing', theory: 76, practice: 44, pyq: 31, revision: 'R1', strength: 'Weak' },
        { subject: 'Mathematics', chapter: 'Quadratic Equations', status: 'Mastered', theory: 100, practice: 92, pyq: 88, revision: 'Final', strength: 'Mastered' }
      ]
    };
  }

  function normalize(s) { const fresh = seed(), today = todayId(); const m = { ...fresh, ...s, ui: { ...fresh.ui, ...(s.ui || {}) }, settings: { ...fresh.settings, ...(s.settings || {}) }, goal: { ...fresh.goal, ...(s.goal || {}) } }; if (!m.tasksByDate?.[today]) { m.tasksByDate = m.tasksByDate || {}; m.tasksByDate[today] = fresh.tasksByDate[today]; } return m; }
  function load() { try { const raw = localStorage.getItem(KEY); if (raw) return normalize(JSON.parse(raw)); } catch (e) { console.warn(e); } return seed(); }
  function save() { updateTodayHistory(); state.ui.activeView = view; try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.warn(e); } }
  function applyTheme() { document.documentElement.dataset.theme = state.ui.theme || 'light'; }

  function dayTasks(date = todayId()) { state.tasksByDate[date] ||= []; return state.tasksByDate[date]; }
  const done = t => t.status === 'completed';
  function subjectMinutes(date = todayId()) {
    const r = { Physics: 0, Chemistry: 0, Mathematics: 0 };
    (state.tasksByDate[date] || []).filter(done).forEach(t => { if (r[t.subject] != null) r[t.subject] += +t.estimate || 0; });
    state.sessions.filter(s => s.dateId === date).forEach(s => { if (r[s.subject] != null) r[s.subject] += +s.minutes || 0; });
    return r;
  }
  function stats(date = todayId()) {
    const list = dayTasks(date), totalW = list.reduce((a, t) => a + (WEIGHT[t.priority] || 1), 0), doneW = list.filter(done).reduce((a, t) => a + (WEIGHT[t.priority] || 1), 0);
    const completionScore = totalW ? Math.round(doneW / totalW * 100) : 0;
    const criticalDone = list.filter(t => t.priority === 'critical').every(done);
    const estDone = list.filter(done).reduce((a, t) => a + (+t.estimate || 0), 0);
    const sessionMin = state.sessions.filter(s => s.dateId === date).reduce((a, s) => a + (+s.minutes || 0), 0);
    const studyMinutes = Math.max(estDone, sessionMin), plannedMinutes = (+state.goal.dailyHours || 7) * 60;
    const timeScore = Math.min(100, Math.round(studyMinutes / plannedMinutes * 100));
    const focusScore = Math.round(completionScore * .55 + timeScore * .25 + (criticalDone ? 20 : 0));
    const completedTasks = list.filter(done).length, totalTasks = list.length;
    return { list, completionScore, criticalDone, studyMinutes, plannedMinutes, timeScore, focusScore, completedTasks, totalTasks, success: totalTasks > 0 && completionScore >= (+state.settings.successThreshold || 70) && criticalDone };
  }
  function updateTodayHistory() {
    const date = todayId(), s = stats(date);
    state.history[date] = { ...(state.history[date] || {}), dateId: date, completionScore: s.completionScore, timeScore: s.timeScore, focusScore: s.focusScore, studyMinutes: s.studyMinutes, completedTasks: s.completedTasks, totalTasks: s.totalTasks, success: s.success, subjectMinutes: subjectMinutes(date) };
  }
  function streak() {
    updateTodayHistory();
    let p = state.history[todayId()]?.success ? todayId() : addDays(todayId(), -1), current = 0;
    while (state.history[p]?.success) { current++; p = addDays(p, -1); }
    let longest = 0, run = 0, prev = null;
    Object.keys(state.history).sort().forEach(d => { if (state.history[d].success) { run = prev && addDays(prev, 1) === d ? run + 1 : 1; longest = Math.max(longest, run); } else run = 0; prev = d; });
    return { current, longest };
  }
  function balance(days = 7) {
    const totals = { Physics: 0, Chemistry: 0, Mathematics: 0 };
    for (let i = days - 1; i >= 0; i--) { const d = addDays(todayId(), -i), m = state.history[d]?.subjectMinutes || subjectMinutes(d); Object.keys(totals).forEach(k => totals[k] += +m[k] || 0); }
    const total = Object.values(totals).reduce((a, b) => a + b, 0) || 1;
    return Object.fromEntries(Object.entries(totals).map(([k, v]) => [k, { minutes: v, pct: Math.round(v / total * 100) }]));
  }

  function render() {
    updateTodayHistory(); applyTheme();
    const [eye, title] = LABELS[view] || LABELS.dashboard;
    $('#viewEyebrow').textContent = eye; $('#viewTitle').textContent = title;
    $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    $('#appView').innerHTML = ({ dashboard: dashboardView, today: todayView, goal: goalView, calendar: calendarView, analytics: analyticsView, jee: jeeView, review: reviewView, settings: settingsView }[view] || dashboardView)();
    renderRightPanel(); updateClock(); save();
  }

  function metric(label, value, sub, tone = 'gold') { return `<article class="metric-card"><span class="metric-label">${label}</span><strong>${value}</strong><small><span class="pill ${tone}">${sub}</span></small></article>`; }
  function mini(label, value) { return `<article class="mini-stat"><span>${label}</span><strong>${value}</strong></article>`; }
  function empty(title, sub) { return `<div class="empty-state"><strong>${title}</strong>${sub}</div>`; }

  function dashboardView() {
    const s = stats(), st = streak(), left = deadlineLeft(), risk = s.completionScore >= 85 && s.timeScore >= 80 ? ['On Track', 'green'] : s.completionScore >= 65 ? ['Medium', 'gold'] : ['High Risk', 'red'];
    return `
      <div class="hero-grid">
        <section class="hero-card">
          <div class="hero-topline"><span class="pill gold">Primary Mission</span><span class="pill ${risk[1]}">Risk: ${risk[0]}</span></div>
          <h2>${esc(state.goal.name)}</h2>
          <p>Target: <strong>${esc(state.goal.target)}</strong>. Phase: ${esc(state.goal.phase)}. Current weak area: <strong>${esc(state.goal.weakArea)}</strong>.</p>
          <div class="hero-meta"><span class="pill green">${left.days} days left</span><span class="pill gold" id="deadlineCountdownInline">${deadlineText()}</span><span class="pill blue">${state.goal.progress}% prep progress</span><span class="pill">Deadline uses IST</span></div>
        </section>
        ${metric('Today’s Execution', `${s.completionScore}%`, `${s.completedTasks}/${s.totalTasks} tasks complete`, 'green')}
        ${metric('Current Streak', `${st.current}`, `Longest: ${st.longest} days`, 'gold')}
        ${metric('Study Time', mins(s.studyMinutes), `Target: ${mins(s.plannedMinutes)}`, 'blue')}
        ${metric('Focus Score', `${s.focusScore}`, s.criticalDone ? 'Critical tasks protected' : 'Critical pending', s.criticalDone ? 'green' : 'red')}
      </div>
      <div class="content-grid">
        <section class="panel wide"><div class="panel-header"><div><h3>Today’s Premium Checklist</h3><p class="panel-subtitle">Every completion is stamped in IST and contributes to streak, graphs, and focus score.</p></div><div class="progress-ring" style="--progress:${s.completionScore}%" data-label="${s.completionScore}%"></div></div>${taskList(dayTasks().slice(0, 6), true)}</section>
        <section class="panel"><div class="panel-header"><div><h3>Weekly Performance</h3><p class="panel-subtitle">Weighted completion score.</p></div></div>${lineChart(7, 'completionScore')}</section>
        <section class="panel"><div class="panel-header"><div><h3>Subject Balance</h3><p class="panel-subtitle">Last 7 days across PCM.</p></div></div>${balanceView()}</section>
        <section class="panel wide"><div class="panel-header"><div><h3>Kronos Consistency Heatmap</h3><p class="panel-subtitle">Gold marks elite execution days. All days are IST based.</p></div></div>${heatmap(70)}</section>
      </div>`;
  }

  function todayView() {
    const s = stats(), priorities = ['critical', 'high', 'medium', 'low'];
    const groups = priorities.map(p => { const list = dayTasks().filter(t => t.priority === p); return list.length ? `<section class="panel"><div class="panel-header"><div><h3>${p[0].toUpperCase() + p.slice(1)} Priority</h3><p class="panel-subtitle">${list.length} mission item${list.length > 1 ? 's' : ''}</p></div></div>${taskList(list)}</section>` : ''; }).join('');
    return `<div class="stat-grid" style="margin-bottom:16px">${mini('Completion', `${s.completionScore}%`)}${mini('Tasks Done', `${s.completedTasks}/${s.totalTasks}`)}${mini('Study Time', mins(s.studyMinutes))}${mini('Today Closes', `<span id="todayCloseInline">${dur(nextResetMs() - Date.now(), true)}</span>`)}</div>
      <div class="content-grid"><div style="display:grid;gap:16px">${groups || empty('No tasks yet', 'Design today’s mission and take control of your time.')}</div>
      <aside class="panel"><div class="panel-header"><div><h3>Daily Mission Control</h3><p class="panel-subtitle">Protect critical work before IST reset.</p></div></div>${scoreBars(s)}<div style="height:14px"></div><button class="primary-button" style="width:100%" data-action="open-task-dialog">+ Add mission task</button><div style="height:10px"></div><button class="ghost-button" style="width:100%" data-jump="review">Open night review</button></aside></div>`;
  }

  function goalView() {
    const p = deadlineParts(), s = stats(), left = deadlineLeft();
    return `<div class="content-grid"><section class="panel wide"><div class="panel-header"><div><h3>Main Goal Setup</h3><p class="panel-subtitle">Countdown and risk are calculated using IST.</p></div><span class="pill gold">${left.days} days ${left.hours}h left</span></div>
      <form class="goal-form" id="goalPageForm"><label>Goal name<input name="name" value="${attr(state.goal.name)}" required></label><div class="form-grid two"><label>Target result<input name="target" value="${attr(state.goal.target)}" required></label><label>Goal type<input name="type" value="${attr(state.goal.type)}"></label></div><div class="form-grid three"><label>Deadline date<input type="date" name="deadlineDate" value="${p.date}" required></label><label>Deadline time IST<input type="time" name="deadlineTime" value="${p.time}" required></label><label>Daily target hours<input type="number" min="1" max="18" step="0.5" name="dailyHours" value="${state.goal.dailyHours}" required></label></div><div class="form-grid two"><label>Current phase<input name="phase" value="${attr(state.goal.phase)}"></label><label>Weak area<input name="weakArea" value="${attr(state.goal.weakArea)}"></label></div><button class="primary-button" type="submit">Save Main Goal</button></form></section>
      <section class="panel"><div class="panel-header"><div><h3>Mission Health</h3><p class="panel-subtitle">Today’s work against the target.</p></div></div><div class="progress-ring" style="--progress:${s.completionScore}%" data-label="${s.completionScore}%"></div><div style="height:16px"></div>${scoreBars(s, state.goal.progress)}</section></div>`;
  }

  function calendarView() {
    const p = istParts(), firstId = `${p.year}-${String(p.month).padStart(2, '0')}-01`, startId = addDays(firstId, -new Date(Date.UTC(p.year, p.month - 1, 1, 12)).getUTCDay());
    let cells = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div class="calendar-head">${d}</div>`).join('');
    for (let i = 0; i < 42; i++) { const d = addDays(startId, i), [, mo, day] = d.split('-').map(Number), h = state.history[d], score = h?.completionScore || 0; cells += `<div class="calendar-day ${mo !== p.month ? 'muted-day' : ''} ${d === todayId() ? 'today' : ''}"><strong>${day}</strong><div class="calendar-score">${h ? `${score}% • ${mins(h.studyMinutes || 0)}` : 'No data'}</div><div class="bar-track" style="margin-top:8px"><div class="bar-fill" style="width:${score}%"></div></div></div>`; }
    return `<section class="panel"><div class="panel-header"><div><h3>${new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date(Date.UTC(p.year, p.month - 1, 1)))}</h3><p class="panel-subtitle">Daily scores, missed days, and perfect days use IST dates.</p></div><span class="pill gold">Today: ${todayId()}</span></div><div class="calendar-grid">${cells}</div></section>`;
  }

  function analyticsView() {
    const s = stats(), st = streak();
    return `<div class="stat-grid" style="margin-bottom:16px">${mini('Current streak', `${st.current} days`)}${mini('Longest streak', `${st.longest} days`)}${mini('Today focus', `${s.focusScore}/100`)}${mini('Time score', `${s.timeScore}%`)}</div><div class="content-grid"><section class="panel wide"><div class="panel-header"><div><h3>14-Day Completion Trend</h3><p class="panel-subtitle">Weighted completion percentage.</p></div></div>${lineChart(14, 'completionScore')}</section><section class="panel"><div class="panel-header"><div><h3>Study Hours</h3><p class="panel-subtitle">Last 7 days actual focused time.</p></div></div>${studyBars()}</section><section class="panel"><div class="panel-header"><div><h3>Subject Balance</h3><p class="panel-subtitle">Balanced PCM performance protects rank growth.</p></div></div>${balanceView()}</section><section class="panel wide"><div class="panel-header"><div><h3>Performance Heatmap</h3><p class="panel-subtitle">Long-range consistency view.</p></div></div>${heatmap(98)}</section><section class="panel wide"><div class="panel-header"><div><h3>Smart Insights</h3><p class="panel-subtitle">Early analytics based on your current execution data.</p></div></div>${insights()}</section></div>`;
  }

  function jeeView() {
    const statuses = ['Not started', 'Theory ongoing', 'Theory done', 'Practice ongoing', 'PYQ done', 'Revision needed', 'Strong', 'Mastered'];
    return `<div class="content-grid"><section class="panel wide"><div class="panel-header"><div><h3>JEE Chapter Tracker</h3><p class="panel-subtitle">Track theory, practice, PYQs, revision and strength per chapter.</p></div><span class="pill gold">PCM Mode</span></div><div class="table-wrap"><table><thead><tr><th>Subject</th><th>Chapter</th><th>Status</th><th>Theory</th><th>Practice</th><th>PYQ</th><th>Revision</th><th>Strength</th></tr></thead><tbody>${state.chapters.map((c, i) => `<tr><td><strong>${esc(c.subject)}</strong></td><td>${esc(c.chapter)}</td><td><select data-action="chapter-status" data-index="${i}">${statuses.map(s => `<option ${s === c.status ? 'selected' : ''}>${s}</option>`).join('')}</select></td><td>${progress(c.theory)}</td><td>${progress(c.practice)}</td><td>${progress(c.pyq)}</td><td>${esc(c.revision)}</td><td><span class="pill ${strengthTone(c.strength)}">${esc(c.strength)}</span></td></tr>`).join('')}</tbody></table></div></section><section class="panel"><div class="panel-header"><div><h3>Mock Trend</h3><p class="panel-subtitle">Score and accuracy momentum.</p></div></div>${mockTrend()}</section><section class="panel wide"><div class="panel-header"><div><h3>Add Mock Test</h3><p class="panel-subtitle">Log result with IST date. This powers mock graphs later.</p></div></div><form class="mock-form" id="mockForm"><div class="form-grid three"><label>Total score<input type="number" name="total" required placeholder="153"></label><label>Physics<input type="number" name="physics" required placeholder="48"></label><label>Chemistry<input type="number" name="chemistry" required placeholder="55"></label></div><div class="form-grid three"><label>Mathematics<input type="number" name="math" required placeholder="50"></label><label>Accuracy %<input type="number" name="accuracy" min="0" max="100" required placeholder="68"></label><label>Silly mistakes<input type="number" name="silly" min="0" required placeholder="5"></label></div><label>Main lesson<textarea name="lesson" placeholder="What did this mock teach you?"></textarea></label><button class="primary-button" type="submit">Save Mock Result</button></form></section></div>`;
  }

  function reviewView() {
    const r = state.reviews[todayId()] || {}, s = stats();
    return `<div class="content-grid"><section class="panel wide"><div class="panel-header"><div><h3>End-of-Day Review</h3><p class="panel-subtitle">Save reflection before IST reset.</p></div><span class="pill gold">${todayId()}</span></div><form class="review-form" id="reviewForm"><label>What went well today?<textarea name="wentWell" placeholder="Completed Physics PYQs with focus...">${esc(r.wentWell || '')}</textarea></label><label>What went wrong or got missed?<textarea name="wentWrong" placeholder="Maths delayed, phone distraction...">${esc(r.wentWrong || '')}</textarea></label><label>Tomorrow’s first priority<input name="tomorrowPriority" value="${attr(r.tomorrowPriority || '')}" placeholder="Start with Maths Integration before phone"></label><div class="form-grid two"><label>Energy level<select name="energy">${options(['Low', 'Medium', 'High', 'Elite'], r.energy || 'Medium')}</select></label><label>Mood<select name="mood">${options(['Tired', 'Calm', 'Focused', 'Intense'], r.mood || 'Focused')}</select></label></div><button class="primary-button" type="submit">Save Review with IST Timestamp</button></form></section><section class="panel"><div class="panel-header"><div><h3>Today Summary</h3><p class="panel-subtitle">Generated from checklist and time.</p></div></div>${scoreBars(s)}<div style="height:16px"></div>${r.savedAt ? `<span class="pill green">Saved at ${new Intl.DateTimeFormat('en-IN', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(new Date(r.savedAt))} IST</span>` : `<span class="pill red">Review pending</span>`}</section></div>`;
  }

  function settingsView() {
    return `<div class="content-grid"><section class="panel wide"><div class="panel-header"><div><h3>Settings</h3><p class="panel-subtitle">Kronos Tracker uses Indian Standard Time for every count, streak, reset, and graph.</p></div><span class="pill green">${state.settings.mode}</span></div><form class="settings-grid" id="settingsForm"><div class="form-grid two"><label>Name<input name="name" value="${attr(state.settings.name)}"></label><label>Theme<select name="theme">${options(['light', 'dark'], state.ui.theme || 'light')}</select></label></div><div class="form-grid two"><label>Success threshold %<input type="number" name="successThreshold" min="40" max="100" value="${state.settings.successThreshold}"></label><label>Study day cutoff<select name="studyDayCutoff">${options(['00:00', '02:30 future mode'], state.settings.studyDayCutoff)}</select></label></div><button class="primary-button" type="submit">Save Settings</button></form></section><section class="panel"><div class="panel-header"><div><h3>Data Controls</h3><p class="panel-subtitle">This MVP stores data in your browser localStorage.</p></div></div><div class="bars"><button class="ghost-button" data-action="export-data">Export JSON</button><button class="ghost-button" data-action="reset-demo">Reset Demo Data</button></div></section></div>`;
  }

  function taskList(list, compact = false) { if (!list.length) return empty('No tasks yet', 'Add a mission task to begin today.'); return `<div class="task-list">${list.map(t => taskRow(t, compact)).join('')}</div>`; }
  function taskRow(t, compact) {
    const time = t.completedAt ? new Intl.DateTimeFormat('en-IN', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(new Date(t.completedAt)) + ' IST' : 'Pending';
    return `<div class="task-row ${done(t) ? 'completed' : ''}"><button class="check-button" data-action="toggle-task" data-id="${t.id}" aria-label="Toggle task">✓</button><div><div class="task-title">${esc(t.title)}</div><div class="task-meta"><span class="priority-pill priority-${t.priority}">${esc(t.priority)}</span><span>${esc(t.subject)}</span><span>${mins(t.estimate)}</span><span>${esc(t.difficulty)}</span>${!compact ? `<span>${time}</span>` : ''}</div></div><div class="task-actions"><button class="tiny-button" data-action="log-task-time" data-id="${t.id}">Log</button><button class="tiny-button" data-action="delete-task" data-id="${t.id}">Delete</button></div></div>`;
  }
  function scoreBars(s, prep) { const rows = prep == null ? [['Completion', s.completionScore], ['Time', s.timeScore], ['Focus', Math.min(100, s.focusScore)]] : [['Prep', prep], ['Daily', s.completionScore], ['Time', s.timeScore]]; return `<div class="bars">${rows.map(([a, b]) => `<div class="bar-row"><span>${a}</span><div class="bar-track"><div class="bar-fill" style="width:${b}%"></div></div><strong>${b}${a === 'Focus' ? '' : '%'}</strong></div>`).join('')}</div>`; }
  function lineChart(days, key) {
    const vals = Array.from({ length: days }, (_, i) => { const d = addDays(todayId(), i - days + 1), v = state.history[d]?.[key] || 0; return { d, v }; });
    const w = 520, h = 210, pad = 24, step = (w - pad * 2) / Math.max(1, days - 1);
    const pts = vals.map((x, i) => [pad + i * step, h - pad - (x.v / 100) * (h - pad * 2)]);
    const line = pts.map(p => p.join(',')).join(' '), area = `${pad},${h - pad} ${line} ${w - pad},${h - pad}`;
    return `<div class="chart-wrap"><svg class="line-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><line class="chart-grid-line" x1="${pad}" y1="${h - pad}" x2="${w - pad}" y2="${h - pad}"/><line class="chart-grid-line" x1="${pad}" y1="${pad}" x2="${w - pad}" y2="${pad}"/><polygon class="chart-area" points="${area}"/><polyline class="chart-line" points="${line}"/>${pts.map((p, i) => `<circle class="chart-dot" cx="${p[0]}" cy="${p[1]}" r="5"><title>${dateLabel(vals[i].d)} • ${vals[i].v}%</title></circle>`).join('')}</svg></div>`;
  }
  function studyBars() { return `<div class="bars">${Array.from({ length: 7 }, (_, i) => { const d = addDays(todayId(), i - 6), m = state.history[d]?.studyMinutes || 0, pct = Math.min(100, Math.round(m / ((+state.goal.dailyHours || 7) * 60) * 100)); return `<div class="bar-row"><span>${dateLabel(d, { weekday: 'short' }).slice(0, 3)}</span><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div><strong>${mins(m)}</strong></div>`; }).join('')}</div>`; }
  function heatmap(days) { return `<div class="heatmap">${Array.from({ length: days }, (_, i) => { const d = addDays(todayId(), i - days + 1), score = state.history[d]?.completionScore || 0, level = score >= 90 ? 4 : score >= 75 ? 3 : score >= 55 ? 2 : score > 0 ? 1 : 0; return `<div class="heat-cell" data-level="${level}" title="${d}: ${score}%"></div>`; }).join('')}</div>`; }
  function balanceView() { const b = balance(7), p = b.Physics.pct, c = b.Chemistry.pct; return `<div class="donut" style="--physics:${p}%;--chemistry:${c}%;"></div><div class="subject-bars">${Object.entries(b).map(([k, v]) => `<div class="subject-row"><div class="subject-top"><span>${k}</span><strong>${v.pct}% • ${mins(v.minutes)}</strong></div><div class="bar-track"><div class="bar-fill" style="width:${v.pct}%"></div></div></div>`).join('')}</div>`; }
  function progress(v) { return `<div class="bar-track"><div class="bar-fill" style="width:${v}%"></div></div><small>${v}%</small>`; }
  function strengthTone(s) { return s === 'Weak' ? 'red' : s === 'Strong' || s === 'Mastered' ? 'green' : 'gold'; }
  function mockTrend() { if (!state.mocks.length) return empty('No mock tests yet', 'Add your first mock result.'); return `${lineChartMock()}<div class="bars" style="margin-top:10px">${state.mocks.slice(-4).reverse().map(m => `<div class="bar-row"><span>${dateLabel(m.dateId)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, m.total / 3)}%"></div></div><strong>${m.total}</strong></div>`).join('')}</div>`; }
  function lineChartMock() { const arr = state.mocks.slice(-7), max = 300, w = 420, h = 170, pad = 22, step = (w - pad * 2) / Math.max(1, arr.length - 1); const pts = arr.map((m, i) => [pad + i * step, h - pad - (m.total / max) * (h - pad * 2)]); const line = pts.map(p => p.join(',')).join(' '); return `<svg class="line-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><polyline class="chart-line" points="${line}"/>${pts.map((p, i) => `<circle class="chart-dot" cx="${p[0]}" cy="${p[1]}" r="5"><title>${arr[i].total}</title></circle>`).join('')}</svg>`; }
  function insights() { const b = balance(7), weakest = Object.entries(b).sort((a, z) => a[1].pct - z[1].pct)[0], s = stats(); return `<div class="task-list"><div class="task-row"><span class="nav-icon">✦</span><div><div class="task-title">${weakest[0]} needs more attention this week.</div><div class="task-meta">Only ${weakest[1].pct}% of PCM time went here.</div></div></div><div class="task-row"><span class="nav-icon">◈</span><div><div class="task-title">Today’s focus score is ${s.focusScore}/100.</div><div class="task-meta">Complete critical tasks to protect streak.</div></div></div><div class="task-row"><span class="nav-icon">✓</span><div><div class="task-title">Best next move: finish pending hard tasks before night review.</div><div class="task-meta">Kronos day closes at 11:59:59 PM IST.</div></div></div></div>`; }
  function options(arr, selected) { return arr.map(x => `<option value="${attr(x)}" ${String(x) === String(selected) ? 'selected' : ''}>${esc(x)}</option>`).join(''); }

  function renderRightPanel() {
    const s = stats(), st = streak(), left = deadlineLeft();
    $('#rightPanel').innerHTML = `<div class="side-stack"><section class="kronos-clock"><p class="eyebrow">Kronos Time</p><div class="clock-time" id="sideClockTime">--:--:--</div><div class="clock-date" id="sideClockDate">${istDateText()} • IST</div></section><section class="side-card"><h3>Today closes in</h3><div class="side-number" id="resetCountdown">${dur(nextResetMs() - Date.now(), true)}</div><p class="panel-subtitle">Strict IST reset at 12:00 AM.</p></section><section class="side-card"><h3>Focus Timer</h3><label>Subject<select id="timerSubject">${options(['Physics', 'Chemistry', 'Mathematics', 'Revision', 'Mock Test'], focus.subject)}</select></label><div class="timer-display"><strong id="timerDisplay">00:00:00</strong><span class="pill green">${mins(s.studyMinutes)} today</span></div><div class="timer-buttons"><button class="ghost-button" data-action="timer-start">${focus.running ? 'Pause' : 'Start'}</button><button class="ghost-button" data-action="timer-finish">Finish</button><button class="ghost-button" data-action="timer-25">+25m</button></div></section><section class="side-card"><h3>Mission Snapshot</h3><div class="countdown-stack"><div class="count-box"><strong>${left.days}</strong><span>Days</span></div><div class="count-box"><strong>${st.current}</strong><span>Streak</span></div><div class="count-box"><strong>${s.completionScore}</strong><span>Score</span></div></div></section><section class="side-card"><h3>Today’s Insight</h3><p class="panel-subtitle">${s.criticalDone ? 'Critical tasks are protected. Now push completion towards a perfect day.' : 'A critical task is pending. Finish it first to protect your streak.'}</p></section></div>`;
  }

  function updateClock() {
    const p = istParts(); $('#topDate').textContent = istDateText(); $('#topTime').textContent = p.timeText;
    $('#sideClockTime') && ($('#sideClockTime').textContent = p.timeText.replace(' IST', ''));
    $('#sideClockDate') && ($('#sideClockDate').textContent = `${istDateText()} • IST`);
    $('#resetCountdown') && ($('#resetCountdown').textContent = dur(nextResetMs() - Date.now(), true));
    $('#todayCloseInline') && ($('#todayCloseInline').textContent = dur(nextResetMs() - Date.now(), true));
    $('#deadlineCountdownInline') && ($('#deadlineCountdownInline').textContent = deadlineText());
    updateTimerUI();
  }
  function updateTimerUI() { const el = $('#timerDisplay'); if (!el) return; const elapsed = focus.elapsed + (focus.running ? Date.now() - focus.startedAt : 0); el.textContent = dur(elapsed); }
  function logFocus(minutes, subject = focus.subject) { if (minutes <= 0) return; state.sessions.push({ id: uid('session'), dateId: todayId(), subject, minutes: Math.round(minutes), startedAt: new Date().toISOString(), endedAt: new Date().toISOString() }); toast(`Logged ${mins(minutes)} for ${subject}`); render(); }
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.remove('show'), 2200); }

  function openGoalDialog() { const f = $('#goalDialogForm'), p = deadlineParts(); f.name.value = state.goal.name; f.target.value = state.goal.target; f.deadlineDate.value = p.date; f.deadlineTime.value = p.time; f.dailyHours.value = state.goal.dailyHours; f.phase.value = state.goal.phase; f.weakArea.value = state.goal.weakArea; $('#goalDialog').showModal(); }
  function saveGoal(form) { const data = Object.fromEntries(new FormData(form)); state.goal = { ...state.goal, name: data.name, target: data.target, type: data.type || state.goal.type, deadlineISO: deadlineISO(data.deadlineDate, data.deadlineTime), dailyHours: +data.dailyHours, phase: data.phase || '', weakArea: data.weakArea || '' }; toast('Main goal saved'); render(); }

  document.addEventListener('click', e => {
    const nav = e.target.closest('[data-view]'); if (nav) { view = nav.dataset.view; render(); return; }
    const jump = e.target.closest('[data-jump]'); if (jump) { view = jump.dataset.jump; render(); return; }
    const a = e.target.closest('[data-action]')?.dataset.action; if (!a) return;
    const id = e.target.closest('[data-id]')?.dataset.id;
    if (a === 'open-task-dialog') $('#taskDialog').showModal();
    if (a === 'close-task-dialog') $('#taskDialog').close();
    if (a === 'open-goal-dialog') openGoalDialog();
    if (a === 'close-goal-dialog') $('#goalDialog').close();
    if (a === 'toggle-theme') { state.ui.theme = state.ui.theme === 'dark' ? 'light' : 'dark'; render(); }
    if (a === 'toggle-task') { const t = dayTasks().find(x => x.id === id); if (t) { const wasDone = done(t); t.status = wasDone ? 'not-started' : 'completed'; t.completedAt = wasDone ? null : new Date().toISOString(); toast(wasDone ? 'Task reopened' : 'Task completed in IST'); render(); } }
    if (a === 'delete-task') { state.tasksByDate[todayId()] = dayTasks().filter(t => t.id !== id); toast('Task deleted'); render(); }
    if (a === 'log-task-time') { const t = dayTasks().find(x => x.id === id); if (t) logFocus(+t.estimate || 25, ['Physics', 'Chemistry', 'Mathematics'].includes(t.subject) ? t.subject : 'Revision'); }
    if (a === 'timer-start') { if (focus.running) { focus.elapsed += Date.now() - focus.startedAt; focus.running = false; } else { focus.subject = $('#timerSubject')?.value || focus.subject; focus.startedAt = Date.now(); focus.running = true; } renderRightPanel(); updateTimerUI(); }
    if (a === 'timer-finish') { const elapsed = focus.elapsed + (focus.running ? Date.now() - focus.startedAt : 0); focus.running = false; focus.elapsed = 0; logFocus(elapsed / 60000, focus.subject); }
    if (a === 'timer-25') { focus.subject = $('#timerSubject')?.value || focus.subject; logFocus(25, focus.subject); }
    if (a === 'export-data') { const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `kronos-tracker-export-${todayId()}.json`; link.click(); URL.revokeObjectURL(url); toast('Export created'); }
    if (a === 'reset-demo') { if (confirm('Reset Kronos Tracker demo data?')) { localStorage.removeItem(KEY); state = seed(); view = 'dashboard'; render(); } }
  });
  document.addEventListener('change', e => {
    if (e.target.id === 'timerSubject') focus.subject = e.target.value;
    if (e.target.matches('[data-action="chapter-status"]')) { state.chapters[+e.target.dataset.index].status = e.target.value; toast('Chapter status updated'); save(); }
  });
  document.addEventListener('submit', e => {
    e.preventDefault(); const f = e.target;
    if (f.id === 'taskForm') { const d = Object.fromEntries(new FormData(f)); dayTasks().push(makeTask(d.title, d.subject, d.priority, +d.estimate, d.category, d.difficulty, false, d.notes)); f.reset(); $('#taskDialog').close(); toast('Task added to today'); render(); }
    if (f.id === 'goalDialogForm' || f.id === 'goalPageForm') saveGoal(f);
    if (f.id === 'reviewForm') { const d = Object.fromEntries(new FormData(f)); state.reviews[todayId()] = { ...d, savedAt: new Date().toISOString() }; toast('Review saved with IST timestamp'); render(); }
    if (f.id === 'mockForm') { const d = Object.fromEntries(new FormData(f)); state.mocks.push({ id: uid('mock'), dateId: todayId(), total: +d.total, physics: +d.physics, chemistry: +d.chemistry, math: +d.math, accuracy: +d.accuracy, silly: +d.silly, lesson: d.lesson || '' }); f.reset(); toast('Mock result saved'); render(); }
    if (f.id === 'settingsForm') { const d = Object.fromEntries(new FormData(f)); state.settings.name = d.name; state.settings.successThreshold = +d.successThreshold; state.settings.studyDayCutoff = d.studyDayCutoff; state.ui.theme = d.theme; toast('Settings saved'); render(); }
  });

  setInterval(updateClock, 1000);
  render();
})();
