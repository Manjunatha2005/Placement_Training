import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, BookOpen, FileText, Code2, MessageSquare,
  Building2, Trophy, User, LogOut, Menu, X, ChevronRight,
  Zap, Shield
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/courses', icon: BookOpen, label: 'Courses' },
  { to: '/tests', icon: FileText, label: 'Tests' },
  { to: '/coding', icon: Code2, label: 'Coding' },
  { to: '/chat', icon: MessageSquare, label: 'AI Chatbot' },
  { to: '/companies', icon: Building2, label: 'Companies' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Zap size={20} color="white" />
        </div>
        {!collapsed && <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', background: 'linear-gradient(135deg, var(--accent3), var(--blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PlacePrep</span>}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
              borderRadius: 'var(--radius-sm)', transition: 'all 0.2s',
              color: isActive ? 'white' : 'var(--text2)',
              background: isActive ? 'linear-gradient(135deg, var(--accent), var(--accent2))' : 'transparent',
              fontWeight: isActive ? 600 : 400, fontSize: '0.92rem',
              boxShadow: isActive ? '0 4px 16px rgba(108,99,255,0.3)' : 'none',
              textDecoration: 'none',
            })}>
            <Icon size={18} style={{ flexShrink: 0 }} />
            {!collapsed && <span>{label}</span>}
            {!collapsed && label === 'AI Chatbot' && (
              <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', padding: '2px 6px', borderRadius: 99, fontWeight: 700 }}>AI</span>
            )}
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <NavLink to="/admin" onClick={() => setMobileOpen(false)}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
              borderRadius: 'var(--radius-sm)', transition: 'all 0.2s',
              color: isActive ? 'white' : 'var(--yellow)', background: isActive ? 'rgba(251,191,36,0.2)' : 'transparent',
              fontWeight: 600, fontSize: '0.92rem', textDecoration: 'none',
            })}>
            <Shield size={18} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Admin Panel</span>}
          </NavLink>
        )}
      </nav>

      {/* User */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg3)', marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)', textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
          )}
        </div>
        <button onClick={handleLogout} className="btn btn-ghost" style={{ width: '100%', justifyContent: collapsed ? 'center' : 'flex-start', gap: 10, padding: '8px 12px', fontSize: '0.88rem', color: 'var(--red)' }}>
          <LogOut size={16} />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="page-layout">
      {/* Desktop Sidebar */}
      <aside style={{
        width: collapsed ? 68 : 240, flexShrink: 0, background: 'var(--bg2)',
        borderRight: '1px solid var(--border)', height: '100vh', position: 'sticky',
        top: 0, transition: 'width 0.25s ease', display: 'flex', flexDirection: 'column',
        overflow: 'hidden'
      }} className="desktop-sidebar">
        <button onClick={() => setCollapsed(!collapsed)} style={{
          position: 'absolute', top: 28, right: collapsed ? '50%' : 12,
          transform: collapsed ? 'translateX(50%)' : 'none',
          background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6,
          padding: '4px 6px', cursor: 'pointer', color: 'var(--text2)', zIndex: 10, display: 'flex'
        }}>
          {collapsed ? <ChevronRight size={14} /> : <Menu size={14} />}
        </button>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 40 }} />}

      {/* Mobile Sidebar */}
      <aside style={{
        position: 'fixed', left: mobileOpen ? 0 : -280, top: 0, width: 260,
        height: '100vh', background: 'var(--bg2)', borderRight: '1px solid var(--border)',
        zIndex: 50, transition: 'left 0.3s ease', display: 'none'
      }} className="mobile-sidebar">
        <button onClick={() => setMobileOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--text2)' }}>
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="page-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Mobile topbar */}
        <header style={{ display: 'none', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', position: 'sticky', top: 0, zIndex: 30 }} className="mobile-header">
          <button onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--text)' }}><Menu size={22} /></button>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem' }}>PlacePrep</span>
        </header>
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-sidebar { display: flex !important; flex-direction: column; }
          .mobile-header { display: flex !important; }
          main { padding: 20px !important; }
        }
      `}</style>
    </div>
  );
}
