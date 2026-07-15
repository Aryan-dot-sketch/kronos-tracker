import React, { useState } from 'react';
import { useKronos } from '@/context/KronosContext';
import { Button } from '../ui/Button';
import { dateLabel } from '@/lib/time/ist';

export const MockTestForm: React.FC = () => {
  const { state, addMockTest } = useKronos();

  const [total, setTotal] = useState('');
  const [physics, setPhysics] = useState('');
  const [chemistry, setChemistry] = useState('');
  const [math, setMath] = useState('');
  const [attempted, setAttempted] = useState('');
  const [correct, setCorrect] = useState('');
  const [wrong, setWrong] = useState('');
  const [accuracy, setAccuracy] = useState('');
  const [silly, setSilly] = useState('');
  const [timeIssue, setTimeIssue] = useState('');
  const [weakChapters, setWeakChapters] = useState('');
  const [lesson, setLesson] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMockTest({
      total: Number(total),
      physics: Number(physics),
      chemistry: Number(chemistry),
      math: Number(math),
      attempted: Number(attempted) || 0,
      correct: Number(correct) || 0,
      wrong: Number(wrong) || 0,
      accuracy: Number(accuracy) || 0,
      silly: Number(silly) || 0,
      timeIssue,
      weakChapters,
      lesson
    });
    setTotal('');
    setPhysics('');
    setChemistry('');
    setMath('');
    setAttempted('');
    setCorrect('');
    setWrong('');
    setAccuracy('');
    setSilly('');
    setTimeIssue('');
    setWeakChapters('');
    setLesson('');
  };

  const list = state.mocks.slice(-7);
  const width = 420;
  const height = 150;
  const pad = 20;
  const step = (width - pad * 2) / Math.max(1, list.length - 1);

  const pointsTotal = list.map((mock, index) => [
    pad + index * step,
    height - pad - ((Number(mock.total) || 0) / 300) * (height - pad * 2)
  ]);
  const lineTotal = pointsTotal.map(p => p.join(',')).join(' ');

  const pointsAccuracy = list.map((mock, index) => [
    pad + index * step,
    height - pad - ((Number(mock.accuracy) || 0) / 100) * (height - pad * 2)
  ]);
  const lineAccuracy = pointsAccuracy.map(p => p.join(',')).join(' ');

  const latest = state.mocks.slice(-1)[0];

  return (
    <>
      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Mock Score Trend</h3>
            <p className="panel-subtitle">Test score, accuracy, and subject breakdown momentum.</p>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="empty-state">No mock test results recorded yet.</div>
        ) : (
          <>
            <svg className="line-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
              <polyline className="chart-line" points={lineTotal} />
              {pointsTotal.map((point, index) => (
                <circle key={index} className="chart-dot" cx={point[0]} cy={point[1]} r={5}>
                  <title>{list[index].total} Marks</title>
                </circle>
              ))}
            </svg>

            <div className="bars" style={{ marginTop: '10px' }}>
              {list.slice(-4).reverse().map((mock, i) => (
                <div key={i} className="bar-row">
                  <span>{dateLabel(mock.dateId)}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${Math.min(100, mock.total / 3)}%` }} />
                  </div>
                  <strong>{mock.total}</strong>
                </div>
              ))}
            </div>

            <div style={{ height: '14px' }} />
            <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>Accuracy % Momentum</h3>
            <svg className="line-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
              <polyline className="chart-line" points={lineAccuracy} />
              {pointsAccuracy.map((point, index) => (
                <circle key={index} className="chart-dot" cx={point[0]} cy={point[1]} r={5}>
                  <title>{list[index].accuracy}% Accuracy</title>
                </circle>
              ))}
            </svg>

            {latest && (
              <>
                <div style={{ height: '14px' }} />
                <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>Latest Mock Subject Breakdown</h3>
                <div className="bars">
                  <div className="bar-row">
                    <span>Physics</span>
                    <div className="bar-track"><div className="bar-fill" style={{ width: `${latest.physics}%` }} /></div>
                    <strong>{latest.physics}</strong>
                  </div>
                  <div className="bar-row">
                    <span>Chemistry</span>
                    <div className="bar-track"><div className="bar-fill" style={{ width: `${latest.chemistry}%` }} /></div>
                    <strong>{latest.chemistry}</strong>
                  </div>
                  <div className="bar-row">
                    <span>Maths</span>
                    <div className="bar-track"><div className="bar-fill" style={{ width: `${latest.math}%` }} /></div>
                    <strong>{latest.math}</strong>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </section>

      <section className="panel wide">
        <div className="panel-header">
          <div>
            <h3>Log New Mock Test Result</h3>
            <p className="panel-subtitle">Record score, accuracy, silly mistakes, and subject breakdowns.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mock-form">
          <div className="form-grid three">
            <label>Total Score<input type="number" value={total} onChange={e => setTotal(e.target.value)} required placeholder="153" /></label>
            <label>Physics Score<input type="number" value={physics} onChange={e => setPhysics(e.target.value)} required placeholder="48" /></label>
            <label>Chemistry Score<input type="number" value={chemistry} onChange={e => setChemistry(e.target.value)} required placeholder="55" /></label>
          </div>
          <div className="form-grid three">
            <label>Mathematics Score<input type="number" value={math} onChange={e => setMath(e.target.value)} required placeholder="50" /></label>
            <label>Attempted Questions<input type="number" value={attempted} onChange={e => setAttempted(e.target.value)} min="0" placeholder="64" /></label>
            <label>Correct Answers<input type="number" value={correct} onChange={e => setCorrect(e.target.value)} min="0" placeholder="46" /></label>
          </div>
          <div className="form-grid three">
            <label>Wrong Answers<input type="number" value={wrong} onChange={e => setWrong(e.target.value)} min="0" placeholder="18" /></label>
            <label>Accuracy %<input type="number" value={accuracy} onChange={e => setAccuracy(e.target.value)} min="0" max="100" required placeholder="68" /></label>
            <label>Silly Mistakes Count<input type="number" value={silly} onChange={e => setSilly(e.target.value)} min="0" required placeholder="5" /></label>
          </div>
          <div className="form-grid two">
            <label>Time Management Note<input value={timeIssue} onChange={e => setTimeIssue(e.target.value)} placeholder="Physics took 75 minutes, leaving Maths rushed" /></label>
            <label>Weak Chapters Tagged<input value={weakChapters} onChange={e => setWeakChapters(e.target.value)} placeholder="Electrostatics, Definite Integration" /></label>
          </div>
          <label>Primary Key Takeaway / Lesson
            <textarea value={lesson} onChange={e => setLesson(e.target.value)} placeholder="Accuracy in Physical Chemistry was solid; need speed improvement in Integration." />
          </label>
          <Button variant="primary" type="submit">Save Mock Result</Button>
        </form>
      </section>
    </>
  );
};
