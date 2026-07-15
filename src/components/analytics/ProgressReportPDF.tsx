import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { todayId, istDateText, formatMinutes } from '@/lib/time/ist';
import { calculateSubjectBalance } from '@/lib/streaks/streak-engine';
import { Button } from '../ui/Button';
import { Printer, FileText } from 'lucide-react';

export const ProgressReportPDF: React.FC = () => {
  const { state, todayStats, currentStreaks } = useKronos();

  const balanceData = calculateSubjectBalance(state, 7);

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <section className="panel wide" style={{ border: '1px solid var(--border-gold)' }}>
      <div className="panel-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="var(--gold)" />
            <h3 style={{ margin: 0 }}>Progress Summary & Printable PDF Report</h3>
          </div>
          <p className="panel-subtitle" style={{ marginTop: '4px' }}>
            Generates an executive summary card for parents, mentors, or weekly progress archiving.
          </p>
        </div>

        <Button variant="primary" onClick={handlePrintPDF}>
          <Printer size={16} style={{ marginRight: '6px' }} />
          Print / Export PDF Report
        </Button>
      </div>

      <div className="panel" style={{ background: 'var(--bg-surface)', padding: '18px', border: '1px solid var(--border-line)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-line)', paddingBottom: '12px', marginBottom: '14px' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '18px', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>{state.settings.name} — Kronos Progress Audit</h4>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>Goal: {state.goal.name} ({state.goal.target})</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)' }}>
            <strong>Generated: {istDateText()}</strong>
            <div>Kronos Day: {todayId()}</div>
          </div>
        </div>

        <div className="stat-grid" style={{ marginBottom: '14px' }}>
          <article className="mini-stat"><span>Current Streak</span><strong>{currentStreaks.current}d</strong></article>
          <article className="mini-stat"><span>Longest Streak</span><strong>{currentStreaks.longest}d</strong></article>
          <article className="mini-stat"><span>Focus Score</span><strong>{todayStats.focusScore}</strong></article>
          <article className="mini-stat"><span>Prep Progress</span><strong>{state.goal.progress}%</strong></article>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
          <div style={{ background: 'var(--gold-soft)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-gold)' }}>
            <strong style={{ display: 'block', color: 'var(--gold-dark)', marginBottom: '4px' }}>7-Day Module Distribution:</strong>
            {Object.entries(balanceData).map(([subj, item]) => (
              <div key={subj} style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
                <span>{subj}:</span>
                <strong>{item.pct}% ({formatMinutes(item.minutes)})</strong>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--bg-surface-soft)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-line)' }}>
            <strong style={{ display: 'block', marginBottom: '4px' }}>Primary Strategy & Focus Area:</strong>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Weak Area: <strong>{state.goal.weakArea}</strong>.<br />
              {state.goal.prepStrategy || 'Consistent daily study blocks and mock error review.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
