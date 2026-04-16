import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Zap, Flame, Target, Code2, FileText, ArrowRight, Trophy, TrendingUp, Calendar } from 'lucide-react';

const COLORS = ['#22d3a0', '#fbbf24', '#f43f5e', '#6c63ff'];

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.getStudent().then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  const stats = data?.stats || {};
  const weeklyActivity = data?.weeklyActivity || [];
  const categoryStats = data?.categoryStats || [];
  const difficultyDist = data?.difficultyDist || {};

  const pieData = Object.entries(difficultyDist).filter(([, v]) => v > 0).map(([k, v]) => ({ name: k, value: v }));

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 6 }}>
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text2)' }}>Here's your placement preparation overview</p>
      </div>

      {/* Stats Row */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {[
          { icon: <Zap size={22} color="#6c63ff" />, bg: 'rgba(108,99,255,0.12)', value: stats.xp || 0, label: 'XP Earned', suffix: ' XP' },
          { icon: <Flame size={22} color="#fb923c" />, bg: 'rgba(251,146,60,0.12)', value: stats.streak || 0, label: 'Day Streak', suffix: ' days' },
          { icon: <FileText size={22} color="#38bdf8" />, bg: 'rgba(56,189,248,0.12)', value: stats.totalTests || 0, label: 'Tests Taken', suffix: '' },
          { icon: <Code2 size={22} color="#22d3a0" />, bg: 'rgba(34,211,160,0.12)', value: stats.totalSolved || 0, label: 'Problems Solved', suffix: '' },
        ].map(({ icon, bg, value, label, suffix }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon" style={{ background: bg }}>{icon}</div>
            <div>
              <div className="stat-value">{value}{suffix}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        {/* Weekly Activity */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Calendar size={18} color="var(--accent3)" />
            <h3 style={{ fontSize: '1rem' }}>Weekly Activity</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyActivity} barSize={14}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text3)', fontSize: 12 }} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
              <Bar dataKey="tests" name="Tests" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="solves" name="Solves" fill="var(--green)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Performance */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <TrendingUp size={18} color="var(--accent3)" />
            <h3 style={{ fontSize: '1rem' }}>Performance by Category</h3>
          </div>
          {categoryStats.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {categoryStats.map(({ category, avgScore }) => (
                <div key={category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '0.85rem' }}>
                    <span style={{ textTransform: 'capitalize' }}>{category}</span>
                    <span style={{ color: avgScore >= 70 ? 'var(--green)' : avgScore >= 40 ? 'var(--yellow)' : 'var(--red)' }}>{avgScore}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg4)', borderRadius: 99 }}>
                    <div style={{ height: '100%', width: `${avgScore}%`, background: avgScore >= 70 ? 'var(--green)' : avgScore >= 40 ? 'var(--yellow)' : 'var(--red)', borderRadius: 99, transition: 'width 1s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: '0.9rem' }}>
              Take some tests to see your performance
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid-2">
        {/* Recent Results */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={16} /> Recent Test Results</h3>
            <Link to="/tests" style={{ fontSize: '0.82rem', color: 'var(--accent3)', display: 'flex', alignItems: 'center', gap: 4 }}>View all <ArrowRight size={14} /></Link>
          </div>
          {data?.recentResults?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.recentResults.slice(0, 4).map(r => (
                <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 500 }}>{r.test?.title || 'Test'}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text3)', textTransform: 'capitalize' }}>{r.test?.category || ''}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: r.percentage >= 70 ? 'var(--green)' : r.percentage >= 40 ? 'var(--yellow)' : 'var(--red)' }}>{r.percentage}%</span>
                    <span className={`badge ${r.passed ? 'badge-easy' : 'badge-hard'}`}>{r.passed ? 'Pass' : 'Fail'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text3)', fontSize: '0.9rem' }}>
              No tests taken yet. <Link to="/tests" style={{ color: 'var(--accent3)' }}>Start now →</Link>
            </div>
          )}
        </div>

        {/* Quick Access */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Target size={16} /> Quick Access</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { to: '/tests', icon: FileText, label: 'Take a Mock Test', desc: 'Test your knowledge', color: 'var(--blue)' },
              { to: '/coding', icon: Code2, label: 'Solve DSA Problem', desc: 'Practice coding', color: 'var(--green)' },
              { to: '/chat', icon: Zap, label: 'Ask AI Chatbot', desc: 'Get instant help', color: 'var(--accent3)' },
              { to: '/leaderboard', icon: Trophy, label: 'View Leaderboard', desc: 'Check your rank', color: 'var(--yellow)' },
            ].map(({ to, icon: Icon, label, desc, color }) => (
              <Link key={to} to={to} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', transition: 'all 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg4)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg3)'}>
                <div style={{ width: 36, height: 36, background: `${color}18`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color={color} />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{desc}</div>
                </div>
                <ArrowRight size={16} color="var(--text3)" style={{ marginLeft: 'auto' }} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
