import React, { useState } from 'react';
import { useKronos } from '@/context/KronosContext';
import { calculateSubjectBalance } from '@/lib/streaks/streak-engine';
import { formatMinutes } from '@/lib/time/ist';
import { askAICoach } from '@/lib/ai/llm-client';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Sparkles } from 'lucide-react';

export const AIPoweredPlanner: React.FC = () => {
  const { state, saveTask } = useKronos();

  const [activePlan, setActivePlan] = useState<'daily' | 'weekly' | 'weakness' | 'recovery'>('daily');
  const [liveAdvice, setLiveAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const balanceData = calculateSubjectBalance(state, 7);
  const weakestSubject = Object.entries(balanceData).sort((a, b) => a[1].pct - b[1].pct)[0];

  const unresolvedBacklog = state.backlog.filter(b => b.status === 'unresolved');
  const mistakes = state.mistakes;

  // Trigger Live AI Coach Response
  const handleFetchAdvice = async () => {
    setLoadingAdvice(true);
    const result = await askAICoach("Provide a 2-sentence strategy for today's study schedule.", state);
    setLiveAdvice(result);
    setLoadingAdvice(false);
  };

  // AI Daily Task Injector
  const generateDailyTasks = () => {
    const primarySubj = state.goal.weakArea ? state.goal.weakArea.split('•')[0].trim() : (state.goal.subjects[0] || 'General');
    
    saveTask({
      title: `[AI Mission] Solve 30 practice problems in ${primarySubj}`,
      subject: primarySubj,
      priority: 'critical',
      estimate: 90,
      category: 'Practice',
      difficulty: 'Hard',
      notes: `AI Generated task based on target: ${state.goal.target}`
    });

    saveTask({
      title: `[AI Focus] Key concepts & formula revision block`,
      subject: weakestSubject ? weakestSubject[0] : 'Revision',
      priority: 'high',
      estimate: 45,
      category: 'Revision',
      difficulty: 'Medium',
      notes: `Targeted weak area recovery for ${weakestSubject ? weakestSubject[0] : 'ignored subject'}`
    });
  };

  return (
    <section className="panel wide" style={{ border: '1px solid var(--line-gold)', background: 'linear-gradient(135deg, var(--ivory-soft), var(--gold-soft))' }}>
      <div className="panel-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--gold)" />
            <h3 style={{ margin: 0 }}>AI Smart Planning & Coaching Suite</h3>
          </div>
          <p className="panel-subtitle" style={{ marginTop: '4px' }}>
            Personalized intelligence engine analyzing study time, weak subjects, mistake notes, and exam deadlines.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <Button variant={activePlan === 'daily' ? 'primary' : 'ghost'} onClick={() => setActivePlan('daily')}>
            Daily Schedule
          </Button>
          <Button variant={activePlan === 'weekly' ? 'primary' : 'ghost'} onClick={() => setActivePlan('weekly')}>
            Weekly Review
          </Button>
          <Button variant={activePlan === 'weakness' ? 'primary' : 'ghost'} onClick={() => setActivePlan('weakness')}>
            Weakness Coach
          </Button>
          <Button variant={activePlan === 'recovery' ? 'primary' : 'ghost'} onClick={() => setActivePlan('recovery')}>
            Recovery Plan
          </Button>
        </div>
      </div>

      {activePlan === 'daily' && (
        <div style={{ display: 'grid', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="panel-subtitle">
              Calculated for <strong>{state.goal.dailyHours}h daily target</strong>. Primary focus set to <strong>{state.goal.weakArea}</strong>.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="ghost" onClick={handleFetchAdvice} disabled={loadingAdvice}>
                {loadingAdvice ? 'Consulting AI...' : 'Ask AI Coach'}
              </Button>
              <Button variant="ghost" onClick={generateDailyTasks}>
                + Auto-Inject AI Suggested Tasks
              </Button>
            </div>
          </div>

          {liveAdvice && (
            <div className="panel" style={{ padding: '12px', background: 'var(--ivory)', border: '1px solid var(--line-gold)' }}>
              <strong style={{ fontSize: '12px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live AI Coach Response:</strong>
              <p style={{ margin: '4px 0 0', fontSize: '13.5px', lineHeight: 1.5 }}>{liveAdvice}</p>
            </div>
          )}

          <div className="task-list">
            <div className="task-row">
              <Badge tone="red">Critical Priority</Badge>
              <div>
                <div className="task-title">Primary Focus Problem Solving (90 mins)</div>
                <div className="task-meta">Targeting weak area: {state.goal.weakArea}. Complete before evening hours.</div>
              </div>
            </div>
            <div className="task-row">
              <Badge tone="gold">High Priority</Badge>
              <div>
                <div className="task-title">{weakestSubject[0]} Revision & Practice (60 mins)</div>
                <div className="task-meta">Only {weakestSubject[1].pct}% of study time was spent on this module over 7 days.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activePlan === 'weekly' && (
        <div style={{ display: 'grid', gap: '10px' }}>
          <p className="panel-subtitle">7-Day Analysis & AI Weekly Direction:</p>
          <div className="stat-grid">
            <article className="mini-stat"><span>Planned Daily</span><strong>{state.goal.dailyHours}h</strong></article>
            <article className="mini-stat"><span>Ignored Module</span><strong>{weakestSubject[0]}</strong></article>
            <article className="mini-stat"><span>Mistakes Logged</span><strong>{mistakes.length}</strong></article>
            <article className="mini-stat"><span>Pending Backlog</span><strong>{unresolvedBacklog.length}</strong></article>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--muted)', margin: '6px 0 0', lineHeight: 1.6 }}>
            <strong>AI Recommendation:</strong> Allocate an additional 2.5 hours of problem solving to {weakestSubject[0]} this week to prevent distribution imbalance. Clear the {unresolvedBacklog.length} pending backlog items during low-energy study slots.
          </p>
        </div>
      )}

      {activePlan === 'weakness' && (
        <div style={{ display: 'grid', gap: '10px' }}>
          <p className="panel-subtitle">Mistake Frequency & Weakness Diagnostics:</p>
          {mistakes.length === 0 ? (
            <div className="empty-state">No mistakes logged yet in error notebook. Log test errors to generate diagnostics.</div>
          ) : (
            <div className="task-list">
              {mistakes.slice(-3).map(m => (
                <div key={m.id} className="task-row">
                  <Badge tone="red">{m.type}</Badge>
                  <div>
                    <div className="task-title">{m.subject} • {m.chapter}</div>
                    <div className="task-meta">Diagnostic: {m.note}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activePlan === 'recovery' && (
        <div style={{ display: 'grid', gap: '10px' }}>
          <p className="panel-subtitle">Overload Safeguard & Backlog Recovery Plan:</p>
          {unresolvedBacklog.length === 0 ? (
            <div className="empty-state" style={{ background: 'var(--green-soft)', border: '1px solid rgba(59,110,71,0.3)' }}>
              <strong>Zero Backlog Overload</strong> Your daily execution is caught up with zero missed tasks!
            </div>
          ) : (
            <div className="task-list">
              {unresolvedBacklog.map(b => (
                <div key={b.id} className="task-row">
                  <Badge tone="amber">Missed: {b.sourceDate}</Badge>
                  <div>
                    <div className="task-title">{b.title}</div>
                    <div className="task-meta">{b.subject} • {formatMinutes(b.estimate)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
