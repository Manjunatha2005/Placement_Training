import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { BookOpen, Search, Filter, ChevronRight, Clock, Users } from 'lucide-react';

const CATEGORIES = ['all', 'aptitude', 'technical', 'company-wise', 'interview', 'soft-skills'];
const DIFFICULTIES = ['all', 'beginner', 'intermediate', 'advanced'];

const categoryColors = { aptitude: '#38bdf8', technical: '#6c63ff', 'company-wise': '#fb923c', interview: '#22d3a0', 'soft-skills': '#fbbf24' };

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  useEffect(() => {
    const params = {};
    if (category !== 'all') params.category = category;
    if (difficulty !== 'all') params.difficulty = difficulty;
    if (search) params.search = search;
    setLoading(true);
    courseAPI.getAll(params).then(r => setCourses(r.data)).catch(() => setCourses([])).finally(() => setLoading(false));
  }, [category, difficulty, search]);

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <BookOpen size={28} color="var(--accent3)" /> Courses
        </h1>
        <p style={{ color: 'var(--text2)' }}>Master every topic for placement success</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
          <input placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: 'auto' }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}</option>)}
        </select>
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={{ width: 'auto' }}>
          {DIFFICULTIES.map(d => <option key={d} value={d}>{d === 'all' ? 'All Levels' : d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
        </select>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {CATEGORIES.slice(1).map(cat => (
          <button key={cat} onClick={() => setCategory(category === cat ? 'all' : cat)}
            className="btn btn-sm"
            style={{ background: category === cat ? (categoryColors[cat] + '30') : 'var(--bg3)', color: category === cat ? categoryColors[cat] : 'var(--text2)', border: `1px solid ${category === cat ? categoryColors[cat] + '60' : 'var(--border)'}`, borderRadius: 99, textTransform: 'capitalize' }}>
            {cat.replace('-', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} />
          <h3>No courses found</h3>
          <p>Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid-3">
          {courses.map(course => (
            <Link key={course._id} to={`/courses/${course._id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ height: '100%', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: (categoryColors[course.category] || 'var(--accent)') + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={20} color={categoryColors[course.category] || 'var(--accent)'} />
                  </div>
                  <span className={`badge badge-${course.difficulty === 'beginner' ? 'easy' : course.difficulty === 'intermediate' ? 'medium' : 'hard'}`}>
                    {course.difficulty}
                  </span>
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: 8, lineHeight: 1.3 }}>{course.title}</h3>
                <p style={{ color: 'var(--text2)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{course.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {course.tags?.slice(0, 3).map(tag => <span key={tag} className="tag">{tag}</span>)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: '0.82rem', color: 'var(--text3)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={13} /> {course.enrolledCount} enrolled</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent3)' }}>View Course <ChevronRight size={14} /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
