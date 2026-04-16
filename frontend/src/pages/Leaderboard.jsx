import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Trophy, Zap, Flame, Medal } from 'lucide-react';

export default function Leaderboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getLeaderboard().then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const medalColors = ['#fbbf24', '#94a3b8', '#b87333'];

  return (
    <div className="fade-in" style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ width: 64, height: 64, background: 'rgba(251,191,36,0.1)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <Trophy size={32} color="var(--yellow)" />
        </div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 6 }}>Leaderboard</h1>
        <p style={{ color: 'var(--text2)' }}>Top performers ranked by XP · Updated live</p>
      </div>

      {/* Top 3 podium */}
      {users.length >= 3 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 12, marginBottom: 36 }}>
          {[1, 0, 2].map(idx => {
            const u = users[idx];
            const heights = [100, 130, 80];
            const order = [1, 0, 2];
            const podiumHeight = heights[order.indexOf(idx)];
            if (!u) return null;
            return (
              <div key={u._id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 120 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${medalColors[idx]}40, ${medalColors[idx]}20)`, border: `2px solid ${medalColors[idx]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', marginBottom: 8 }}>
                  {u.name[0]}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 2, textAlign: 'center' }}>{u.name.split(' ')[0]}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: 8 }}>{u.xp} XP</div>
                <div style={{ width: '100%', height: podiumHeight, background: `linear-gradient(180deg, ${medalColors[idx]}30, ${medalColors[idx]}10)`, border: `1px solid ${medalColors[idx]}40`, borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: idx === 0 ? '1.8rem' : '1.4rem' }}>{['🥇', '🥈', '🥉'][idx]}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      {loading ? <div className="loader"><div className="spinner" /></div> : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {users.map((u, i) => {
            const isMe = u._id === user?._id || u.name === user?.name;
            return (
              <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none', background: isMe ? 'rgba(108,99,255,0.08)' : 'transparent', transition: 'background 0.15s' }}
                onMouseEnter={e => { if (!isMe) e.currentTarget.style.background = 'var(--bg3)'; }}
                onMouseLeave={e => { if (!isMe) e.currentTarget.style.background = 'transparent'; }}>
                <div style={{ width: 36, textAlign: 'center' }}>
                  {i < 3 ? <span style={{ fontSize: '1.3rem' }}>{['🥇', '🥈', '🥉'][i]}</span> : <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text3)', fontSize: '0.9rem' }}>#{i + 1}</span>}
                </div>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: isMe ? 'linear-gradient(135deg, var(--accent), var(--accent2))' : 'var(--bg4)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                  {u.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {u.name}
                    {isMe && <span style={{ fontSize: '0.7rem', background: 'rgba(108,99,255,0.2)', color: 'var(--accent3)', padding: '1px 8px', borderRadius: 99, fontWeight: 700 }}>YOU</span>}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{u.branch} {u.branch && u.college ? '·' : ''} {u.college}</div>
                </div>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--accent3)' }}>
                      <Zap size={14} /> {u.xp}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>XP</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--orange)' }}>
                      <Flame size={14} /> {u.streak}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>Streak</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
