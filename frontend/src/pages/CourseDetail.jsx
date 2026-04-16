import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { BookOpen, ChevronRight, Play, FileText, Video } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeContent, setActiveContent] = useState(null);

  useEffect(() => {
    courseAPI.getOne(id).then(r => { setCourse(r.data); setActiveContent(r.data.contents?.[0] || null); })
      .catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loader"><div className="spinner" /></div>;
  if (!course) return <div className="empty-state"><h3>Course not found</h3><Link to="/courses">Back to Courses</Link></div>;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 24 }}>
        <Link to="/courses" style={{ color: 'var(--text3)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
          <BookOpen size={14} /> Courses <ChevronRight size={12} /> <span style={{ color: 'var(--text)' }}>{course.title}</span>
        </Link>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 8 }}>{course.title}</h1>
        <p style={{ color: 'var(--text2)' }}>{course.description}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
        {/* Sidebar */}
        <div className="card" style={{ height: 'fit-content', padding: 16 }}>
          <h3 style={{ fontSize: '0.92rem', color: 'var(--text2)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contents</h3>
          {course.contents?.map((c, i) => (
            <button key={c._id} onClick={() => setActiveContent(c)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', background: activeContent?._id === c._id ? 'var(--accent)' : 'transparent', color: activeContent?._id === c._id ? 'white' : 'var(--text2)', marginBottom: 2 }}>
              <span style={{ fontSize: '0.75rem', width: 20, height: 20, borderRadius: '50%', background: activeContent?._id === c._id ? 'rgba(255,255,255,0.2)' : 'var(--bg4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
              <span style={{ fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="card">
          {activeContent ? (
            <>
              <h2 style={{ fontSize: '1.3rem', marginBottom: 20 }}>{activeContent.title}</h2>
              <div className="markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeContent.body || '*Content coming soon...*'}</ReactMarkdown>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'var(--text3)' }}>
              Select a topic to start learning
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
