import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { testAPI } from '../services/api';
import { FileText, Clock, Target, Search, BarChart2 } from 'lucide-react';

const TYPES = ['all', 'topic-wise', 'mock', 'company'];

export default function Tests() {
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('all');
  const [tab, setTab] = useState('tests');

  useEffect(() => {
    const params = type !== 'all' ? { type } : {};
    setLoading(true);
    Promise.all([testAPI.getAll(params), testAPI.getMyResults()])
      .then(([t, r]) => { setTests(t.data); setResults(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [type]);

  const typeColors = { 'topic-wise': '#38bdf8', mock: '#6c63ff', company: '#fb923c' };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileText size={28} color="var(--accent3)" /> Tests & Quizzes
        </h1>
        <p style={{ color: 'var(--text2)' }}>Practice with timed tests and mock placement exams</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg3)', padding: 4, borderRadius: 'var(--radius-sm)', width: 'fit-content', marginBottom: 24 }}>
        {[['tests', 'Available Tests'], ['results', 'My Results']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} className="btn btn-sm"
            style={{ background: tab === t ? 'var(--accent)' : 'transparent', color: tab === t ? 'white' : 'var(--text2)', border: 'none', borderRadius: 6 }}>{l}</button>
        ))}
      </div>

      {tab === 'tests' ? (
        <>
          {/* Type Filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {TYPES.map(t => (
              <button key={t} onClick={() => setType(t)} className="btn btn-sm"
                style={{ background: type === t ? 'var(--bg4)' : 'var(--bg3)', color: type === t ? 'var(--text)' : 'var(--text2)', border: `1px solid ${type === t ? 'var(--border2)' : 'var(--border)'}`, borderRadius: 99, textTransform: 'capitalize' }}>
                {t === 'all' ? 'All Types' : t.replace('-', ' ')}
              </button>
            ))}
          </div>

          {loading ? <div className="loader"><div className="spinner" /></div> : (
            <div className="grid-3">
              {tests.map(test => (
                <div key={test._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: 42, height: 42, background: (typeColors[test.type] || 'var(--accent)') + '20', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={20} color={typeColors[test.type] || 'var(--accent)'} />
                    </div>
                    <span style={{ fontSize: '0.75rem', background: 'var(--bg4)', color: 'var(--text2)', padding: '3px 10px', borderRadius: 99, textTransform: 'capitalize', border: '1px solid var(--border)' }}>
                      {test.type?.replace('-', ' ')}
                    </span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>{test.title}</h3>
                    <p style={{ color: 'var(--text2)', fontSize: '0.83rem', lineHeight: 1.4 }}>{test.description}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: '0.82rem', color: 'var(--text3)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} /> {test.duration} min</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Target size={13} /> {test.questions?.length || 0} Qs</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><BarChart2 size={13} /> {test.attemptedCount} attempts</span>
                  </div>
                  <Link to={`/tests/${test._id}`} className="btn btn-primary btn-sm" style={{ marginTop: 'auto', justifyContent: 'center' }}>
                    Start Test
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div>
          {results.length === 0 ? (
            <div className="empty-state"><FileText size={48} /><h3>No results yet</h3><p>Take a test to see your results here</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {results.map(r => (
                <div key={r._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: r.percentage >= 70 ? 'rgba(34,211,160,0.1)' : r.percentage >= 40 ? 'rgba(251,191,36,0.1)' : 'rgba(244,63,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, color: r.percentage >= 70 ? 'var(--green)' : r.percentage >= 40 ? 'var(--yellow)' : 'var(--red)', flexShrink: 0 }}>
                    {r.percentage}%
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 3 }}>{r.test?.title || 'Test'}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>Score: {r.score}/{r.totalMarks} · {new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span className={`badge ${r.passed ? 'badge-easy' : 'badge-hard'}`}>{r.passed ? 'Passed' : 'Failed'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
