import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, ViewType, Task, Goal, JEEChapter, MockTest, Mistake, DailyReview } from '@/types';
import { loadState, saveState, cleanState, uid, makeTask, normalizeState, KEY } from '../lib/storage/local-storage';
import { todayId, addDays } from '../lib/time/ist';
import { calculateDailyStats, calculateSubjectMinutes } from '../lib/scoring/scoring-engine';
import { calculateStreaks } from '../lib/streaks/streak-engine';

interface FocusTimerState {
  running: boolean;
  mode: 'stopwatch' | 'pomodoro';
  startedAt: number;
  elapsed: number;
  subject: string;
  pomodoroMs: number;
}

interface KronosContextType {
  state: AppState;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  
  // Modals & Inspection State
  activeModal: string | null;
  openModal: (modalName: string, data?: any) => void;
  closeModal: () => void;
  selectedDayDetail: string | null;
  editingTaskId: string | null;

  // Actions
  toggleTheme: () => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  saveTask: (taskData: Partial<Task>, editId?: string | null) => void;
  logTaskTime: (taskId: string) => void;
  
  // Backlog
  moveBacklog: (id: string, split?: boolean) => void;
  skipBacklog: (id: string) => void;
  
  // Goal & Subjects
  saveGoal: (goalData: Partial<Goal>) => void;
  addSubject: (subjectName: string) => void;
  deleteSubject: (subjectName: string) => void;
  addMilestone: (title: string, targetDate: string, category: string) => void;
  toggleMilestone: (id: string) => void;
  deleteMilestone: (id: string) => void;
  addWeeklyTarget: (title: string, targetHours: number) => void;
  toggleWeeklyTarget: (id: string) => void;
  deleteWeeklyTarget: (id: string) => void;

  // JEE & Mocks
  addChapter: (chapterData: Partial<JEEChapter>) => void;
  updateChapterStatus: (index: number, status: string) => void;
  advanceChapterRevision: (index: number) => void;
  addMockTest: (mockData: Partial<MockTest>) => void;
  addMistake: (mistakeData: Partial<Mistake>) => void;
  deleteMistake: (id: string) => void;

  // Review & Settings
  saveDailyReview: (reviewData: Partial<DailyReview>) => void;
  saveSettings: (settingsData: Partial<AppState['settings']>, theme: 'light' | 'dark') => void;
  importJSONState: (jsonStr: string) => boolean;
  clearStateData: () => void;

  // Focus Timer
  focusTimer: FocusTimerState;
  startTimer: (subject?: string) => void;
  startPomodoro: (subject?: string) => void;
  finishTimer: () => void;
  addQuickTime: (minutes: number) => void;
  setTimerSubject: (subj: string) => void;

  // Computed Properties
  todayStats: ReturnType<typeof calculateDailyStats>;
  currentStreaks: ReturnType<typeof calculateStreaks>;
}

const KronosContext = createContext<KronosContextType | null>(null);

export const KronosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => loadState());
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedDayDetail, setSelectedDayDetail] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [focusTimer, setFocusTimer] = useState<FocusTimerState>({
    running: false,
    mode: 'stopwatch',
    startedAt: 0,
    elapsed: 0,
    subject: state.goal.subjects?.[0] || 'Physics',
    pomodoroMs: 25 * 60 * 1000
  });

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  const updateState = useCallback((updater: (prev: AppState) => AppState) => {
    setState(prev => {
      const today = todayId();
      const updated = updater(prev);
      
      const todayStats = calculateDailyStats(updated, today);
      updated.history[today] = {
        ...(updated.history[today] || {}),
        dateId: today,
        completionScore: todayStats.completionScore,
        timeScore: todayStats.timeScore,
        focusScore: todayStats.focusScore,
        studyMinutes: todayStats.studyMinutes,
        completedTasks: todayStats.completedTasks,
        totalTasks: todayStats.totalTasks,
        success: todayStats.success,
        subjectMinutes: calculateSubjectMinutes(updated, today)
      };

      saveState(updated);
      return updated;
    });
  }, []);

  const openModal = (modalName: string, data?: any) => {
    if (modalName === 'task') setEditingTaskId(data || null);
    if (modalName === 'dayDetail') setSelectedDayDetail(data || null);
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingTaskId(null);
  };

  const toggleTheme = () => {
    updateState(prev => ({
      ...prev,
      ui: { ...prev.ui, theme: prev.ui.theme === 'dark' ? 'light' : 'dark' }
    }));
  };

  const toggleTask = (taskId: string) => {
    const today = todayId();
    updateState(prev => {
      const tasks = (prev.tasksByDate[today] || []).map(t => {
        if (t.id === taskId) {
          const wasDone = t.status === 'completed';
          return {
            ...t,
            status: (wasDone ? 'not-started' : 'completed') as Task['status'],
            completedAt: wasDone ? null : new Date().toISOString()
          };
        }
        return t;
      });
      return { ...prev, tasksByDate: { ...prev.tasksByDate, [today]: tasks } };
    });
    showToast('Task status updated in IST');
  };

  const deleteTask = (taskId: string) => {
    const today = todayId();
    updateState(prev => ({
      ...prev,
      tasksByDate: {
        ...prev.tasksByDate,
        [today]: (prev.tasksByDate[today] || []).filter(t => t.id !== taskId)
      }
    }));
    showToast('Task removed');
  };

  const saveTask = (taskData: Partial<Task>, editId?: string | null) => {
    const today = todayId();
    updateState(prev => {
      const currentList = prev.tasksByDate[today] || [];
      let updatedList: Task[];
      
      if (editId) {
        updatedList = currentList.map(t => t.id === editId ? { ...t, ...taskData } as Task : t);
      } else {
        const newTask = makeTask(
          taskData.title || 'Untitled Mission Task',
          taskData.subject || prev.goal.subjects[0] || 'General',
          taskData.priority || 'high',
          taskData.estimate || 60,
          taskData.category || 'Practice',
          taskData.difficulty || 'Medium',
          false,
          taskData.notes || ''
        );
        updatedList = [...currentList, newTask];
      }
      return { ...prev, tasksByDate: { ...prev.tasksByDate, [today]: updatedList } };
    });
    showToast(editId ? 'Task updated' : 'Mission task added to today');
    closeModal();
  };

  const logTaskTime = (taskId: string) => {
    const today = todayId();
    const task = (state.tasksByDate[today] || []).find(t => t.id === taskId);
    if (!task) return;
    const mins = task.estimate || 25;
    
    updateState(prev => ({
      ...prev,
      sessions: [
        ...prev.sessions,
        {
          id: uid('session'),
          dateId: today,
          subject: task.subject,
          minutes: mins,
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
          label: `Task session: ${task.title}`
        }
      ]
    }));
    showToast(`Logged ${mins} mins for ${task.subject}`);
  };

  const moveBacklog = (id: string, split = false) => {
    const today = todayId();
    const item = state.backlog.find(b => b.id === id);
    if (!item) return;

    updateState(prev => {
      const backlog = prev.backlog.map(b => b.id === id ? { ...b, status: split ? 'split-to-today' : 'moved-to-today' } : b);
      const todayTasks = prev.tasksByDate[today] || [];

      if (split) {
        const half = Math.max(10, Math.ceil((item.estimate || 30) / 2));
        todayTasks.push(
          makeTask(`${item.title} — Part 1`, item.subject, item.priority, half, item.category, item.difficulty, false, item.notes),
          makeTask(`${item.title} — Part 2`, item.subject, item.priority, half, item.category, item.difficulty, false, item.notes)
        );
      } else {
        todayTasks.push(makeTask(`${item.title} (Recovered)`, item.subject, item.priority, item.estimate, item.category, item.difficulty, false, item.notes));
      }

      return {
        ...prev,
        backlog,
        tasksByDate: { ...prev.tasksByDate, [today]: todayTasks }
      };
    });
    showToast(split ? 'Task split into today' : 'Task moved to today');
  };

  const skipBacklog = (id: string) => {
    updateState(prev => ({
      ...prev,
      backlog: prev.backlog.map(b => b.id === id ? { ...b, status: 'skipped' } : b)
    }));
    showToast('Missed task skipped');
  };

  const saveGoal = (goalData: Partial<Goal>) => {
    updateState(prev => ({
      ...prev,
      goal: { ...prev.goal, ...goalData }
    }));
    showToast('Main goal updated');
    closeModal();
  };

  const addSubject = (subjectName: string) => {
    const trimmed = subjectName.trim();
    if (!trimmed) return;
    updateState(prev => {
      const existing = prev.goal.subjects || [];
      if (existing.includes(trimmed)) return prev;
      return {
        ...prev,
        goal: { ...prev.goal, subjects: [...existing, trimmed] }
      };
    });
    showToast(`Subject "${trimmed}" added`);
  };

  const deleteSubject = (subjectName: string) => {
    updateState(prev => ({
      ...prev,
      goal: { ...prev.goal, subjects: (prev.goal.subjects || []).filter(s => s !== subjectName) }
    }));
    showToast(`Subject "${subjectName}" removed`);
  };

  const addMilestone = (title: string, targetDate: string, category: string) => {
    updateState(prev => ({
      ...prev,
      goal: {
        ...prev.goal,
        milestones: [...prev.goal.milestones, { id: uid('m'), title, targetDate, category, completed: false }]
      }
    }));
    showToast('Milestone added');
    closeModal();
  };

  const toggleMilestone = (id: string) => {
    updateState(prev => ({
      ...prev,
      goal: {
        ...prev.goal,
        milestones: prev.goal.milestones.map(m => m.id === id ? { ...m, completed: !m.completed } : m)
      }
    }));
    showToast('Milestone toggled');
  };

  const deleteMilestone = (id: string) => {
    updateState(prev => ({
      ...prev,
      goal: { ...prev.goal, milestones: prev.goal.milestones.filter(m => m.id !== id) }
    }));
    showToast('Milestone deleted');
  };

  const addWeeklyTarget = (title: string, targetHours: number) => {
    updateState(prev => ({
      ...prev,
      goal: {
        ...prev.goal,
        weeklyTargets: [...prev.goal.weeklyTargets, { id: uid('w'), title, targetHours, completed: false }]
      }
    }));
    showToast('Weekly target added');
    closeModal();
  };

  const toggleWeeklyTarget = (id: string) => {
    updateState(prev => ({
      ...prev,
      goal: {
        ...prev.goal,
        weeklyTargets: prev.goal.weeklyTargets.map(w => w.id === id ? { ...w, completed: !w.completed } : w)
      }
    }));
    showToast('Weekly target toggled');
  };

  const deleteWeeklyTarget = (id: string) => {
    updateState(prev => ({
      ...prev,
      goal: { ...prev.goal, weeklyTargets: prev.goal.weeklyTargets.filter(w => w.id !== id) }
    }));
    showToast('Weekly target deleted');
  };

  const addChapter = (chapterData: Partial<JEEChapter>) => {
    updateState(prev => ({
      ...prev,
      chapters: [
        ...prev.chapters,
        {
          subject: chapterData.subject || prev.goal.subjects[0] || 'General',
          chapter: chapterData.chapter || 'New Chapter / Module',
          status: 'Not started',
          theory: Number(chapterData.theory) || 0,
          practice: Number(chapterData.practice) || 0,
          pyq: Number(chapterData.pyq) || 0,
          revision: chapterData.revision || 'R0',
          strength: chapterData.strength || 'Weak',
          lastRevised: todayId(),
          nextRevision: addDays(todayId(), 3)
        }
      ]
    }));
    showToast('Module/Chapter added to Syllabus Tracker');
    closeModal();
  };

  const updateChapterStatus = (index: number, status: string) => {
    updateState(prev => {
      const chapters = [...prev.chapters];
      if (chapters[index]) chapters[index].status = status;
      return { ...prev, chapters };
    });
    showToast('Chapter status updated');
  };

  const advanceChapterRevision = (index: number) => {
    const flow = ['R0', 'R1', 'R2', 'R3', 'Final', 'Formula', 'PYQ done'];
    updateState(prev => {
      const chapters = [...prev.chapters];
      const ch = chapters[index];
      if (ch) {
        const next = flow[(flow.indexOf(ch.revision) + 1) % flow.length] || 'R1';
        ch.revision = next;
        ch.lastRevised = todayId();
        ch.nextRevision = addDays(todayId(), next === 'Final' || next === 'PYQ done' ? 7 : 3);
      }
      return { ...prev, chapters };
    });
    showToast('Revision stage advanced');
  };

  const addMockTest = (mockData: Partial<MockTest>) => {
    updateState(prev => ({
      ...prev,
      mocks: [
        ...prev.mocks,
        {
          id: uid('mock'),
          dateId: todayId(),
          total: Number(mockData.total) || 0,
          physics: Number(mockData.physics) || 0,
          chemistry: Number(mockData.chemistry) || 0,
          math: Number(mockData.math) || 0,
          attempted: Number(mockData.attempted) || 0,
          correct: Number(mockData.correct) || 0,
          wrong: Number(mockData.wrong) || 0,
          accuracy: Number(mockData.accuracy) || 0,
          silly: Number(mockData.silly) || 0,
          timeIssue: mockData.timeIssue || '',
          weakChapters: mockData.weakChapters || '',
          lesson: mockData.lesson || ''
        }
      ]
    }));
    showToast('Test result logged');
  };

  const addMistake = (mistakeData: Partial<Mistake>) => {
    updateState(prev => ({
      ...prev,
      mistakes: [
        ...prev.mistakes,
        {
          id: uid('mistake'),
          dateId: todayId(),
          subject: mistakeData.subject || prev.goal.subjects[0] || 'General',
          chapter: mistakeData.chapter || 'General',
          type: mistakeData.type || 'Concept error',
          note: mistakeData.note || ''
        }
      ]
    }));
    showToast('Mistake logged in notebook');
  };

  const deleteMistake = (id: string) => {
    updateState(prev => ({
      ...prev,
      mistakes: prev.mistakes.filter(m => m.id !== id)
    }));
    showToast('Mistake deleted');
  };

  const saveDailyReview = (reviewData: Partial<DailyReview>) => {
    const today = todayId();
    updateState(prev => ({
      ...prev,
      reviews: {
        ...prev.reviews,
        [today]: { ...reviewData, savedAt: new Date().toISOString() }
      }
    }));
    showToast('Night review saved in IST');
  };

  const saveSettings = (settingsData: Partial<AppState['settings']>, theme: 'light' | 'dark') => {
    updateState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settingsData },
      ui: { ...prev.ui, theme }
    }));
    showToast('Settings saved');
  };

  const importJSONState = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      const normalized = normalizeState(parsed);
      setState(normalized);
      saveState(normalized);
      showToast('State imported successfully');
      closeModal();
      return true;
    } catch (e) {
      alert('Invalid JSON content. Check file and retry.');
      return false;
    }
  };

  const clearStateData = () => {
    if (confirm('Clear all data to start fresh? All local storage values will be reset.')) {
      localStorage.removeItem(KEY);
      const clean = cleanState();
      setState(clean);
      saveState(clean);
      setActiveView('dashboard');
      showToast('Tracker data cleared cleanly');
    }
  };

  // Focus Timer controls
  const startTimer = (subj?: string) => {
    setFocusTimer(prev => ({
      ...prev,
      subject: subj || prev.subject,
      mode: 'stopwatch',
      running: !prev.running,
      startedAt: Date.now()
    }));
  };

  const startPomodoro = (subj?: string) => {
    setFocusTimer({
      running: true,
      mode: 'pomodoro',
      startedAt: Date.now(),
      elapsed: 0,
      subject: subj || focusTimer.subject,
      pomodoroMs: 25 * 60 * 1000
    });
    showToast('Pomodoro started: 25 minutes');
  };

  const finishTimer = () => {
    const elapsed = focusTimer.elapsed + (focusTimer.running ? Date.now() - focusTimer.startedAt : 0);
    const minutes = focusTimer.mode === 'pomodoro'
      ? Math.round((focusTimer.pomodoroMs - Math.max(0, focusTimer.pomodoroMs - elapsed)) / 60000)
      : Math.round(elapsed / 60000);
    
    if (minutes > 0) {
      updateState(prev => ({
        ...prev,
        sessions: [
          ...prev.sessions,
          {
            id: uid('session'),
            dateId: todayId(),
            subject: focusTimer.subject,
            minutes,
            startedAt: new Date().toISOString(),
            endedAt: new Date().toISOString(),
            label: 'Timer session'
          }
        ]
      }));
      showToast(`Finished session: ${minutes}m for ${focusTimer.subject}`);
    }
    setFocusTimer(prev => ({ ...prev, running: false, elapsed: 0, mode: 'stopwatch' }));
  };

  const addQuickTime = (minutes: number) => {
    updateState(prev => ({
      ...prev,
      sessions: [
        ...prev.sessions,
        {
          id: uid('session'),
          dateId: todayId(),
          subject: focusTimer.subject,
          minutes,
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
          label: 'Quick focus block'
        }
      ]
    }));
    showToast(`Logged quick ${minutes}m for ${focusTimer.subject}`);
  };

  const setTimerSubject = (subj: string) => {
    setFocusTimer(prev => ({ ...prev, subject: subj }));
  };

  const todayStats = calculateDailyStats(state);
  const currentStreaks = calculateStreaks(state);

  return (
    <KronosContext.Provider
      value={{
        state,
        activeView,
        setActiveView,
        searchQuery,
        setSearchQuery,
        toastMessage,
        showToast,
        activeModal,
        openModal,
        closeModal,
        selectedDayDetail,
        editingTaskId,
        toggleTheme,
        toggleTask,
        deleteTask,
        saveTask,
        logTaskTime,
        moveBacklog,
        skipBacklog,
        saveGoal,
        addSubject,
        deleteSubject,
        addMilestone,
        toggleMilestone,
        deleteMilestone,
        addWeeklyTarget,
        toggleWeeklyTarget,
        deleteWeeklyTarget,
        addChapter,
        updateChapterStatus,
        advanceChapterRevision,
        addMockTest,
        addMistake,
        deleteMistake,
        saveDailyReview,
        saveSettings,
        importJSONState,
        clearStateData,
        focusTimer,
        startTimer,
        startPomodoro,
        finishTimer,
        addQuickTime,
        setTimerSubject,
        todayStats,
        currentStreaks
      }}
    >
      {children}
    </KronosContext.Provider>
  );
};

export const useKronos = () => {
  const context = useContext(KronosContext);
  if (!context) throw new Error('useKronos must be used within a KronosProvider');
  return context;
};
