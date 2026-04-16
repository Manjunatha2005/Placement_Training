import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Zap, Eye, EyeOff, ArrowRight } from 'lucide-react';

function AuthLayout({ children, title, subtitle, link, linkText, linkTo }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg)' }}>
      <div style={{ position: 'fixed', top: '30%', left: '30%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ width: '100%', maxWidth: 440, position: 'relative' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, justifyContent: 'center' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', background: 'linear-gradient(135deg, var(--accent3), var(--blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PlacePrep</span>
        </Link>
        <div className="card" style={{ padding: 36 }}>
          <h1 style={{ fontSize: '1.6rem', marginBottom: 6, textAlign: 'center' }}>{title}</h1>
          <p style={{ color: 'var(--text2)', textAlign: 'center', marginBottom: 32, fontSize: '0.92rem' }}>{subtitle}</p>
          {children}
          <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text2)', fontSize: '0.88rem' }}>
            {linkText} <Link to={linkTo} style={{ color: 'var(--accent3)', fontWeight: 600 }}>
              {link}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to continue your preparation" link="Register here" linkText="Don't have an account?" linkTo="/register">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontSize: '0.88rem', color: 'var(--text2)' }}>Email</label>
          <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontSize: '0.88rem', color: 'var(--text2)' }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ paddingRight: 44 }} />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', display: 'flex' }}>
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ marginTop: 8, padding: '12px', justifyContent: 'center' }} disabled={loading}>
          {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={16} /></>}
        </button>
        <div style={{ padding: '12px 16px', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text2)' }}>
          <strong style={{ color: 'var(--text)' }}>Demo accounts:</strong><br />
          Admin: admin@placeprep.com / admin123<br />
          Student: arjun@student.com / student123
        </div>
      </form>
    </AuthLayout>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', branch: '', college: '', graduationYear: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to PlacePrep!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Start your placement journey today" link="Login here" linkText="Already have an account?" linkTo="/login">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          { key: 'name', label: 'Full Name', placeholder: 'Arjun Sharma', type: 'text', required: true },
          { key: 'email', label: 'Email', placeholder: 'you@college.edu', type: 'email', required: true },
          { key: 'password', label: 'Password', placeholder: '••••••••', type: 'password', required: true },
          { key: 'college', label: 'College', placeholder: 'IIT Delhi', type: 'text' },
          { key: 'branch', label: 'Branch', placeholder: 'Computer Science', type: 'text' },
          { key: 'graduationYear', label: 'Graduation Year', placeholder: '2025', type: 'number' },
        ].map(({ key, label, placeholder, type, required }) => (
          <div key={key}>
            <label style={{ display: 'block', marginBottom: 5, fontSize: '0.85rem', color: 'var(--text2)' }}>{label}{required && ' *'}</label>
            <input type={type} placeholder={placeholder} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required={required} />
          </div>
        ))}
        <button type="submit" className="btn btn-primary" style={{ marginTop: 8, padding: '12px', justifyContent: 'center' }} disabled={loading}>
          {loading ? 'Creating account...' : <><span>Create Account</span><ArrowRight size={16} /></>}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Login;
