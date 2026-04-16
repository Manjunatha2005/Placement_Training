import { useState, useEffect } from 'react';
import { dashboardAPI, testAPI, courseAPI, codingAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Shield, Users, FileText, BookOpen, Code2, BarChart2, Plus } from 'lucide-react';

export default function AdminPanel() {
  const [stats, setStats] = useState({});
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [newTest, setNewTest] = useState({ title: '', description: '', type: 'mock', category: 'aptitude', duration: 60, totalMarks: 10, passingMarks: 4, questions: [] });
  const [newCourse, setNewCourse] = useState({ title: '', description: '', category: 'technical', difficulty: 'beginner' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dashboardAPI.getAdmin()
      .then(r => { setStats(r.data.stats || {}); setRecentUsers(r.data.recentUsers || []); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const createTest = async () => {
    setSaving(true);
    try {
      await testAPI.create(newTest);
      toast.success('Test created!');
      setNewTest({ title: '', description: '', type: 'mock', category: 'aptitude', duration: 60, totalMarks: 10, passingMarks: 4, questions: [] });
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to create test'); }
    finally { setSaving(false); }
  };

  const createCourse = async () => {
    setSaving(true);
    try {
      await courseAPI.create(newCourse);
      toast.success('Course created!');
      setNewCourse({ title: '', description: '', category: 'technical', difficulty: 'beginner' });
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to create course'); }
    finally { setSaving(false); }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'tests', label: 'Add Test', icon: FileText },
    { id: 'courses', label: 'Add Course', icon: BookOpen },
    { id: 'users', label: 'Users', icon: Users },
  ];

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, background: 'rgba(251,191,36,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={24} color="var(--yellow)" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.6rem' }}>Admin Panel</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>Manage content, users, and platform settings</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg3)', padding: 4, borderRadius: 'var(--radius-sm)', width: 'fit-content', marginBottom: 28 }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', background: activeTab === id ? 'var(--accent)' : 'transparent', color: activeTab === id ? 'white' : 'var(--text2)', fontWeight: 600, fontSize: '0.88rem' }}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {loading ? <div className="loader"><div className="spinner" /></div> : (
        <>
          {activeTab === 'overview' && (
            <div>
              <div className="grid-4" style={{ marginBottom: 28 }}>
                {[
                  { icon: Users, color: '#38bdf8', bg: 'rgba(56,189,248,0.1)', label: 'Total Students', value: stats.totalUsers },
                  { icon: FileText, color: '#6c63ff', bg: 'rgba(108,99,255,0.1)', label: 'Total Tests', value: stats.totalTests },
                  { icon: BookOpen, color: '#22d3a0', bg: 'rgba(34,211,160,0.1)', label: 'Courses', value: stats.totalCourses },
                  { icon: Code2, color: '#fb923c', bg: 'rgba(251,146,60,0.1)', label: 'Submissions', value: stats.totalSubmissions },
                ].map(({ icon: Icon, color, bg, label, value }) => (
                  <div key={label} className="stat-card">
                    <div className="stat-icon" style={{ background: bg }}><Icon size={22} color={color} /></div>
                    <div><div className="stat-value">{value || 0}</div><div className="stat-label">{label}</div></div>
                  </div>
                ))}
              </div>

              <div className="card">
                <h3 style={{ fontSize: '1rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Users size={16} /> Recent Registrations</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{['Name', 'Email', 'Branch', 'Joined'].map(h => <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '0.78rem', color: 'var(--text3)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {recentUsers.map(u => (
                      <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                        {[u.name, u.email, u.branch || '-', new Date(u.createdAt).toLocaleDateString()].map((v, i) => (
                          <td key={i} style={{ padding: '10px 12px', fontSize: '0.88rem', color: 'var(--text2)' }}>{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="card" style={{ maxWidth: 640 }}>
              <h3 style={{ fontSize: '1rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><Plus size={16} /> Create New Test</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="grid-2">
                  <div>
                    <label style={{ display: 'block', marginBottom: 5, fontSize: '0.83rem', color: 'var(--text2)' }}>Title *</label>
                    <input placeholder="Test title" value={newTest.title} onChange={e => setNewTest({ ...newTest, title: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 5, fontSize: '0.83rem', color: 'var(--text2)' }}>Type</label>
                    <select value={newTest.type} onChange={e => setNewTest({ ...newTest, type: e.target.value })}>
                      {['topic-wise', 'mock', 'company'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 5, fontSize: '0.83rem', color: 'var(--text2)' }}>Description</label>
                  <textarea placeholder="Test description" value={newTest.description} onChange={e => setNewTest({ ...newTest, description: e.target.value })} rows={2} />
                </div>
                <div className="grid-3">
                  {[['duration', 'Duration (min)', 'number'], ['totalMarks', 'Total Marks', 'number'], ['passingMarks', 'Passing Marks', 'number']].map(([k, l, t]) => (
                    <div key={k}>
                      <label style={{ display: 'block', marginBottom: 5, fontSize: '0.83rem', color: 'var(--text2)' }}>{l}</label>
                      <input type={t} value={newTest[k]} onChange={e => setNewTest({ ...newTest, [k]: e.target.value })} />
                    </div>
                  ))}
                </div>
                <div style={{ padding: '12px 14px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 'var(--radius-sm)', fontSize: '0.83rem', color: 'var(--blue)' }}>
                  💡 After creating the test, add questions via the API or database directly. Questions can include MCQ with options, correct answer index, and explanation.
                </div>
                <button onClick={createTest} className="btn btn-primary" disabled={saving || !newTest.title} style={{ justifyContent: 'center' }}>
                  <Plus size={16} /> {saving ? 'Creating...' : 'Create Test'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="card" style={{ maxWidth: 640 }}>
              <h3 style={{ fontSize: '1rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><Plus size={16} /> Create New Course</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 5, fontSize: '0.83rem', color: 'var(--text2)' }}>Title *</label>
                  <input placeholder="Course title" value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 5, fontSize: '0.83rem', color: 'var(--text2)' }}>Description *</label>
                  <textarea placeholder="Course description" value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} rows={3} />
                </div>
                <div className="grid-2">
                  <div>
                    <label style={{ display: 'block', marginBottom: 5, fontSize: '0.83rem', color: 'var(--text2)' }}>Category</label>
                    <select value={newCourse.category} onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}>
                      {['aptitude', 'technical', 'company-wise', 'interview', 'soft-skills'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 5, fontSize: '0.83rem', color: 'var(--text2)' }}>Difficulty</label>
                    <select value={newCourse.difficulty} onChange={e => setNewCourse({ ...newCourse, difficulty: e.target.value })}>
                      {['beginner', 'intermediate', 'advanced'].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={createCourse} className="btn btn-primary" disabled={saving || !newCourse.title || !newCourse.description} style={{ justifyContent: 'center' }}>
                  <Plus size={16} /> {saving ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>All Students ({stats.totalUsers || 0})</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Name', 'Email', 'Branch', 'College', 'XP', 'Joined'].map(h => <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.78rem', color: 'var(--text3)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>)}</tr></thead>
                <tbody>
                  {recentUsers.map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}>
                      {[u.name, u.email, u.branch || '-', u.college || '-', u.xp || 0, new Date(u.createdAt).toLocaleDateString()].map((v, i) => (
                        <td key={i} style={{ padding: '12px 16px', fontSize: '0.88rem', color: 'var(--text2)' }}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
