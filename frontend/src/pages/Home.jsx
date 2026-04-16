import { Link } from 'react-router-dom';
import { Zap, Code2, Brain, Trophy, Building2, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';

const features = [
  { icon: Brain, color: '#6c63ff', title: 'AI-Powered Chatbot', desc: 'Get instant help with DSA, aptitude, interview questions, and personalized study plans powered by Claude AI.' },
  { icon: Code2, color: '#22d3a0', title: 'Coding Platform', desc: 'Practice DSA problems from easy to hard with an in-browser code editor, test cases, and instant feedback.' },
  { icon: FileText2, color: '#38bdf8', title: 'Mock Tests', desc: 'Timed mock placement tests with auto-evaluation, detailed score breakdowns, and performance analysis.' },
  { icon: Building2, color: '#fb923c', title: 'Company Prep', desc: 'Company-specific preparation material for TCS, Infosys, Google, Amazon, Microsoft and more.' },
  { icon: Trophy, color: '#fbbf24', title: 'Leaderboard', desc: 'Compete with peers, earn XP, maintain streaks, and climb the leaderboard to stay motivated.' },
  { icon: MessageSquare, color: '#f43f5e', title: 'Interview Prep', desc: 'HR questions, technical Q&A, and mock interview simulations to ace your placement drives.' },
];

function FileText2({ size, color }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
}

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', background: 'linear-gradient(135deg, var(--accent3), var(--blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PlacePrep</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login" className="btn btn-secondary">Login</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 48px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 99, padding: '6px 16px', marginBottom: 32, fontSize: '0.85rem', color: 'var(--accent3)' }}>
            <Zap size={14} /> AI-Powered Placement Preparation
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
            Crack Your Dream{' '}
            <span style={{ background: 'linear-gradient(135deg, var(--accent3), var(--blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Placement
            </span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text2)', maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Complete placement preparation platform with AI chatbot, coding practice, mock tests, and company-specific preparation. Everything you need to land your first job.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Preparing Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">Explore Platform</Link>
          </div>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 48, flexWrap: 'wrap' }}>
            {[['500+', 'DSA Problems'], ['50+', 'Mock Tests'], ['100+', 'Company Guides'], ['24/7', 'AI Support']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent3)' }}>{num}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontFamily: 'var(--font-display)', marginBottom: 12 }}>Everything You Need</h2>
        <p style={{ textAlign: 'center', color: 'var(--text2)', marginBottom: 56 }}>A complete ecosystem for placement success</p>
        <div className="grid-3">
          {features.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="card" style={{ transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.4)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={24} color={color} />
              </div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: 8 }}>{title}</h3>
              <p style={{ color: 'var(--text2)', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(139,92,246,0.05))', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 24, padding: '60px 40px' }}>
          <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', marginBottom: 16 }}>Ready to Get Placed?</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 32 }}>Join thousands of students who cracked their dream companies</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {['Free forever for core features', 'AI chatbot for instant doubt solving', 'Company-specific preparation guides', 'Real-time leaderboard & gamification'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
                <CheckCircle size={18} color="var(--green)" />
                <span style={{ fontSize: '0.92rem' }}>{item}</span>
              </div>
            ))}
          </div>
          <Link to="/register" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '32px 48px', borderTop: '1px solid var(--border)', color: 'var(--text3)', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <Zap size={16} color="var(--accent)" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text2)' }}>PlacePrep</span>
        </div>
        © 2025 PlacePrep. Built for placement warriors.
      </footer>
    </div>
  );
}
