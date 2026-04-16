import { useState, useEffect } from 'react';
import { companyAPI } from '../services/api';
import { Building2, ExternalLink, Star, Users, ChevronDown, ChevronUp } from 'lucide-react';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const params = search ? { search } : {};
    companyAPI.getAll(params).then(r => setCompanies(r.data)).catch(() => []).finally(() => setLoading(false));
  }, [search]);

  const diffColors = { easy: 'var(--green)', medium: 'var(--yellow)', hard: 'var(--red)' };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Building2 size={28} color="var(--accent3)" /> Companies
        </h1>
        <p style={{ color: 'var(--text2)' }}>Company-specific preparation and placement drives</p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <input placeholder="Search companies..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 360 }} />
      </div>

      {loading ? <div className="loader"><div className="spinner" /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {companies.map(c => (
            <div key={c._id} className="card" style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === c._id ? null : c._id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--accent3)' }}>
                    {c.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 3 }}>{c.name}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>{c.industry} · {c.size} employees</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '0.82rem', padding: '4px 12px', borderRadius: 99, background: diffColors[c.difficulty] + '20', color: diffColors[c.difficulty], fontWeight: 600, border: `1px solid ${diffColors[c.difficulty]}40` }}>
                    {c.difficulty} difficulty
                  </span>
                  {expanded === c._id ? <ChevronUp size={18} color="var(--text3)" /> : <ChevronDown size={18} color="var(--text3)" />}
                </div>
              </div>

              {expanded === c._id && (
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                  <div className="grid-2" style={{ gap: 20 }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>About</div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text2)', marginBottom: 14 }}>{c.description}</p>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interview Process</div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text2)' }}>{c.interviewProcess}</p>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Topics</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                        {c.topTopics?.map(t => <span key={t} className="badge badge-accent">{t}</span>)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Drives</div>
                      {c.drives?.filter(d => d.isActive).map(d => (
                        <div key={d._id} style={{ padding: '12px 14px', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', marginBottom: 8, border: '1px solid var(--border)' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>{d.title}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginBottom: 4 }}>{d.description}</div>
                          <div style={{ display: 'flex', gap: 16, fontSize: '0.78rem', color: 'var(--text3)' }}>
                            <span>CTC: <strong style={{ color: 'var(--green)' }}>{d.ctc}</strong></span>
                            <span>Eligibility: {d.eligibility}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
