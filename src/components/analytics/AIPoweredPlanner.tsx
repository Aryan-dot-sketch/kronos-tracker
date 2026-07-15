import React, { useState } from 'react';
import { useKronos } from '@/context/KronosContext';
import { calculateSubjectBalance } from '@/lib/streaks/streak-engine';
import { formatMinutes } from '@/lib/time/ist';
import { askAICoach, AIConfig, DEFAULT_AI_CONFIG } from '@/lib/ai/llm-client';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Sparkles, Cpu, Settings, Terminal, CheckCircle2 } from 'lucide-react';

export const AIPoweredPlanner: React.FC = () => {
  const { state, saveTask } = useKronos();

  const [activePlan, setActivePlan] = useState<'daily' | 'weekly' | 'weakness' | 'recovery'>('daily');
  const [liveAdvice, setLiveAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  // AI Configuration State (Zero API Key by default via Local Ollama / Local AI)
  const [aiConfig, setAiConfig] = useState<AIConfig>(DEFAULT_AI_CONFIG);

  const balanceData = calculateSubjectBalance(state, 7);
  const weakestSubject = Object.entries(balanceData).sort((a, b) => a[1].pct - b[1].pct)[0];

  const unresolvedBacklog = state.backlog.filter(b => b.status === 'unresolved');
  const mistakes = state.mistakes;

  // Trigger Live AI Coach Response (Ollama / Local LLM / Heuristic Engine)
  const handleFetchAdvice = async () => {
    setLoadingAdvice(true);
    const result = await askAICoach(
      "Provide a 2-sentence actionable daily focus strategy.",
      state,
      aiConfig
    );
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
            <Badge tone="green" style={{ marginLeft: '4px', fontSize: '11px' }}>
              <Cpu size={12} style={{ marginRight: '3px' }} />
              {aiConfig.provider === 'ollama' ? `Ollama (${aiConfig.ollamaModel})` : aiConfig.provider === 'custom' ? 'Local LLM' : 'Instant AI Engine'}
            </Badge>
          </div>
          <p className="panel-subtitle" style={{ marginTop: '4px' }}>
            Works 100% locally with <strong>Ollama (no API key needed)</strong>, local LLMs (LM Studio), or built-in analytics engine.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Button variant="icon" title="AI Provider Settings" onClick={() => setShowConfig(!showConfig)}>
            <Settings size={18} />
          </Button>
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

      {/* Zero-API-Key Provider Selector Drawer */}
      {showConfig && (
        <div style={{ padding: '14px', border: '1px solid var(--line-gold)', borderRadius: '16px', background: 'var(--ivory)', marginBottom: '16px', display: 'grid', gap: '10px' }}>
          <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--gold-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Terminal size={15} /> Configure Zero-API-Key Local LLM Provider
          </h4>

          <div className="form-grid two">
            <label>
              Active LLM Provider
              <select
                value={aiConfig.provider}
                onChange={e => setAiConfig({ ...aiConfig, provider: e.target.value as any })}
              >
                <option value="ollama">Local Ollama (http://localhost:11434) — $0 Keyless</option>
                <option value="custom">Custom Local Host (LM Studio / vLLM / LocalAI)</option>
                <option value="heuristic">Built-In Heuristic Analytics Core (0ms Latency)</option>
                <option value="openai_groq">Cloud API Key (Groq / OpenAI)</option>
              </select>
            </label>

            {aiConfig.provider === 'ollama' && (
              <label>
                Ollama Model Name
                <input
                  value={aiConfig.ollamaModel}
                  onChange={e => setAiConfig({ ...aiConfig, ollamaModel: e.target.value })}
                  placeholder="e.g. llama3, qwen2.5, phi3, deepseek-r1, gemma"
                />
              </label>
            )}

            {aiConfig.provider === 'custom' && (
              <label>
                Custom Local Host Endpoint URL
                <input
                  value={aiConfig.customUrl}
                  onChange={e => setAiConfig({ ...aiConfig, customUrl: e.target.value })}
                  placeholder="http://127.0.0.1:1234/v1"
                />
              </label>
            )}
          </div>

          <p className="panel-subtitle" style={{ fontSize: '12px', margin: 0 }}>
            {aiConfig.provider === 'ollama'
              ? 'To run Ollama locally for free without API keys, run: `ollama run llama3` or `ollama run qwen2.5` in your terminal.'
              : aiConfig.provider === 'custom'
              ? 'Points to your local server (LM Studio, LocalAI, vLLM) on your network with zero external costs.'
              : 'Built-in instant analysis runs completely in your browser JS engine.'}
          </p>
        </div>
      )}

      {activePlan === 'daily' && (
        <div style={{ display: 'grid', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <p className="panel-subtitle" style={{ margin: 0 }}>
              Calculated for <strong>{state.goal.dailyHours}h daily target</strong>. Primary focus set to <strong>{state.goal.weakArea}</strong>.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="ghost" onClick={handleFetchAdvice} disabled={loadingAdvice}>
                {loadingAdvice ? 'Consulting Local LLM...' : `Ask AI Coach (${aiConfig.provider.toUpperCase()})`}
              </Button>
              <Button variant="ghost" onClick={generateDailyTasks}>
                + Auto-Inject AI Suggested Tasks
              </Button>
            </div>
          </div>

          {liveAdvice && (
            <div className="panel" style={{ padding: '12px 16px', background: 'var(--ivory)', border: '1px solid var(--line-gold)' }}>
              <strong style={{ fontSize: '11px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={13} /> Live AI Advice ({aiConfig.provider === 'ollama' ? `Ollama • ${aiConfig.ollamaModel}` : 'Local Intelligence'}):
              </strong>
              <p style={{ margin: '6px 0 0', fontSize: '14px', lineHeight: 1.5, fontWeight: 500 }}>{liveAdvice}</p>
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
