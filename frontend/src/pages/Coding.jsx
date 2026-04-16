import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { codingAPI } from '../services/api';
import { Code2, CheckCircle, Search } from 'lucide-react';

const DIFFICULTIES = ['all', 'easy', 'medium', 'hard'];
const TAGS = ['all', 'array', 'string', 'stack', 'binary-search', 'dynamic-programming', 'tree', 'graph', 'hash-map'];

export default function Coding() {
  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState('all');
  const [tag, setTag] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = {};
    if (difficulty !== 'all') params.difficulty = difficulty;
    if (tag !== 'all') params.tag = tag;
    if (search) params.search = search;
    setLoading(true);
    Promise.all([codingAPI.getAll(params), codingAPI.getMySubmissions()])
      .then(([p, s]) => { setProblems(p.data); setSubmissions(s.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [difficulty, tag, search]);

  const solvedIds = new Set(submissions.filter(s => s.status === 'accepted').map(s => s.problem?._id));
  const diffCount = { easy: problems.filter(p => p.difficulty === 'easy').length, medium: problems.filter(p => p.difficulty === 'medium').length, hard: problems.filter(p => p.difficulty === 'hard').length };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Code2 size={28} color="var(--accent3)" /> Coding Practice
          </h1>
          <p style={{ color: 'var(--text2)' }}>Sharpen your problem-solving skills</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[['Easy', diffCount.easy, 'var(--green)'], ['Medium', diffCount.medium, 'var(--yellow)'], ['Hard', diffCount.hard, 'var(--red)']].map(([l, c, col]) => (
            <div key={l} style={{ textAlign: 'center', padding: '8px 16px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: col }}>{c}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <div style={{ position: 'relative', minWidth: 200, flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
          <input placeholder="Search problems..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {DIFFICULTIES.map(d => (
            <button key={d} onClick={() => setDifficulty(d)} className="btn btn-sm"
              style={{ background: difficulty === d ? 'var(--bg4)' : 'var(--bg3)', color: difficulty === d ? (d === 'easy' ? 'var(--green)' : d === 'medium' ? 'var(--yellow)' : d === 'hard' ? 'var(--red)' : 'var(--text)') : 'var(--text2)', border: `1px solid ${difficulty === d ? 'var(--border2)' : 'var(--border)'}`, borderRadius: 99, textTransform: 'capitalize' }}>
              {d === 'all' ? 'All' : d}
            </button>
          ))}
        </div>
      </div>

      {/* Tag filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        {TAGS.map(t => (
          <button key={t} onClick={() => setTag(t)} className="btn btn-sm"
            style={{ background: tag === t ? 'rgba(108,99,255,0.15)' : 'var(--bg3)', color: tag === t ? 'var(--accent3)' : 'var(--text3)', border: `1px solid ${tag === t ? 'rgba(108,99,255,0.4)' : 'var(--border)'}`, borderRadius: 99, textTransform: 'capitalize', fontSize: '0.78rem' }}>
            {t.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Problems Table */}
      {loading ? <div className="loader"><div className="spinner" /></div> : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Status', 'Title', 'Difficulty', 'Tags', 'Acceptance', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {problems.map((p, i) => (
                <tr key={p._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <td style={{ padding: '14px 16px', width: 50 }}>
                    {solvedIds.has(p._id) ? <CheckCircle size={18} color="var(--green)" /> : <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--border2)' }} />}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Link to={`/coding/${p._id}`} style={{ fontWeight: 500, color: 'var(--text)', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--accent3)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}>
                      {p.title}
                    </Link>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge badge-${p.difficulty}`}>{p.difficulty}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {p.tags?.slice(0, 2).map(t => <span key={t} className="tag" style={{ fontSize: '0.72rem' }}>{t}</span>)}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text3)', fontSize: '0.85rem' }}>
                    {p.acceptanceRate ? `${p.acceptanceRate}%` : 'N/A'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Link to={`/coding/${p._id}`} className="btn btn-sm btn-primary">Solve</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {problems.length === 0 && (
            <div className="empty-state"><Code2 size={40} /><h3>No problems found</h3><p>Try adjusting filters</p></div>
          )}
        </div>
      )}
    </div>
  );
}
