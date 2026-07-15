import { AppState } from '@/types';
import { supabase, isSupabaseConfigured } from './client';

/**
 * Supabase Multi-Device Real-Time Cloud Sync Module
 * Synchronizes local state with Supabase PostgreSQL tables when authenticated.
 */

export async function syncStateToCloud(state: AppState, userId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || !userId) return false;

  try {
    // 1. Sync Profile & Preferences
    await supabase.from('profiles').upsert({
      id: userId,
      name: state.settings.name,
      mode: state.settings.mode,
      study_day_cutoff: state.settings.studyDayCutoff,
      success_threshold: state.settings.successThreshold,
      theme: state.ui.theme
    });

    // 2. Sync Goal Architecture
    await supabase.from('goals').upsert({
      user_id: userId,
      name: state.goal.name,
      type: state.goal.type,
      target: state.goal.target,
      deadline_iso: state.goal.deadlineISO,
      daily_hours: state.goal.dailyHours,
      progress: state.goal.progress,
      phase: state.goal.phase,
      weak_area: state.goal.weakArea,
      risk_level: state.goal.riskLevel,
      prep_strategy: state.goal.prepStrategy,
      subjects: state.goal.subjects
    }, { onConflict: 'user_id' });

    // 3. Sync Daily Scores / History
    const scoreRows = Object.values(state.history).map(h => ({
      user_id: userId,
      date_id: h.dateId,
      completion_score: h.completionScore,
      time_score: h.timeScore,
      focus_score: h.focusScore,
      study_minutes: h.studyMinutes,
      completed_tasks: h.completedTasks,
      total_tasks: h.totalTasks,
      success: h.success,
      subject_minutes: h.subjectMinutes
    }));

    if (scoreRows.length > 0) {
      await supabase.from('daily_scores').upsert(scoreRows, { onConflict: 'user_id,date_id' });
    }

    return true;
  } catch (error) {
    console.warn('Cloud sync background error:', error);
    return false;
  }
}

export async function fetchStateFromCloud(userId: string): Promise<Partial<AppState> | null> {
  if (!isSupabaseConfigured || !supabase || !userId) return null;

  try {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    const { data: goal } = await supabase.from('goals').select('*').eq('user_id', userId).maybeSingle();
    const { data: scores } = await supabase.from('daily_scores').select('*').eq('user_id', userId);

    if (!profile && !goal) return null;

    const history: AppState['history'] = {};
    if (scores) {
      scores.forEach(s => {
        history[s.date_id] = {
          dateId: s.date_id,
          completionScore: s.completion_score,
          timeScore: s.time_score,
          focusScore: s.focus_score,
          studyMinutes: s.study_minutes,
          completedTasks: s.completed_tasks,
          totalTasks: s.total_tasks,
          success: s.success,
          subjectMinutes: s.subject_minutes || {}
        };
      });
    }

    return {
      settings: profile ? {
        name: profile.name,
        mode: profile.mode,
        studyDayCutoff: profile.study_day_cutoff,
        successThreshold: profile.success_threshold,
        fontScale: 'normal',
        density: 'comfortable',
        showSeconds: true,
        compactMode: false,
        chartStyle: 'line',
        notificationsEnabled: true,
        dailyReminderTime: '21:00',
        streakReminder: true,
        keyboardShortcutsEnabled: true,
        defaultDomain: 'General',
        analyticsOptIn: true
      } : undefined,
      goal: goal ? {
        name: goal.name,
        type: goal.type,
        target: goal.target,
        deadlineISO: goal.deadline_iso,
        dailyHours: Number(goal.daily_hours),
        progress: goal.progress,
        phase: goal.phase,
        weakArea: goal.weak_area,
        riskLevel: goal.risk_level,
        prepStrategy: goal.prep_strategy,
        subjects: goal.subjects || ['Physics', 'Chemistry', 'Mathematics'],
        milestones: [],
        weeklyTargets: []
      } : undefined,
      history
    };
  } catch (error) {
    console.warn('Cloud pull error:', error);
    return null;
  }
}
