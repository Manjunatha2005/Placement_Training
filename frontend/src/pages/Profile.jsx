import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Save, Upload, Github, Linkedin, Zap, Flame } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', branch: '', college: '', graduationYear: '', bio: '', skills: '', targetCompanies: '', linkedIn: '', github: '' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '', branch: user.branch || '', college: user.college || '',
        graduationYear: user.graduationYear || '', bio: user.bio || '',
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : user.skills || '',
        targetCompanies: Array.isArray(user.targetCompanies) ? user.targetCompanies.join(', ') : user.targetCompanies || '',
        linkedIn: user.linkedIn || '', github: user.github || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean), targetCompanies: form.targetCompanies.split(',').map(s => s.trim()).filter(Boolean) };
      const r = await userAPI.updateProfile(data);
      updateUser(r.data);
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
    finally { setLoading(false); }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const r = await userAPI.uploadResume(formData);
      updateUser({ resume: r.data.resumeUrl });
      toast.success('Resume uploaded!');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
    { key: 'branch', label: 'Branch', type: 'text', placeholder: 'CSE / IT / ECE' },
    { key: 'college', label: 'College', type: 'text', placeholder: 'Your college name' },
    { key: 'graduationYear', label: 'Graduation Year', type: 'number', placeholder: '2025' },
    { key: 'linkedIn', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/...' },
    { key: 'github', label: 'GitHub URL', type: 'url', placeholder: 'https://github.com/...' },
  ];

  return (
    <div className="fade-in" style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
        <User size={28} color="var(--accent3)" /> Profile
      </h1>
      <p style={{ color: 'var(--text2)', marginBottom: 28 }}>Manage your profile and preferences</p>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Avatar card */}
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2rem', color: 'white' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', marginBottom: 4 }}>{user?.name}</div>
            <div style={{ color: 'var(--text3)', fontSize: '0.85rem', marginBottom: 16 }}>{user?.email}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--accent3)', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}><Zap size={16} />{user?.xp || 0}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>XP</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--orange)', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}><Flame size={16} />{user?.streak || 0}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Streak</div>
              </div>
            </div>
          </div>

          {/* Resume card */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: 14 }}>Resume</h3>
            {user?.resume && (
              <div style={{ padding: '10px 12px', background: 'rgba(34,211,160,0.08)', border: '1px solid rgba(34,211,160,0.2)', borderRadius: 'var(--radius-sm)', marginBottom: 12, fontSize: '0.85rem', color: 'var(--green)' }}>
                ✓ Resume uploaded
              </div>
            )}
            <label style={{ display: 'block', cursor: 'pointer' }}>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} style={{ display: 'none' }} />
              <div className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Resume'}
              </div>
            </label>
            <p style={{ color: 'var(--text3)', fontSize: '0.78rem', marginTop: 8, textAlign: 'center' }}>PDF, DOC or DOCX · Max 5MB</p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', marginBottom: 20 }}>Edit Profile</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="grid-2">
              {fields.slice(0, 4).map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label style={{ display: 'block', marginBottom: 5, fontSize: '0.83rem', color: 'var(--text2)' }}>{label}</label>
                  <input type={type} placeholder={placeholder} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 5, fontSize: '0.83rem', color: 'var(--text2)' }}>Bio</label>
              <textarea placeholder="Tell us about yourself..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 5, fontSize: '0.83rem', color: 'var(--text2)' }}>Skills <span style={{ color: 'var(--text3)', fontSize: '0.75rem' }}>(comma-separated)</span></label>
              <input placeholder="JavaScript, Python, DSA, SQL..." value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 5, fontSize: '0.83rem', color: 'var(--text2)' }}>Target Companies <span style={{ color: 'var(--text3)', fontSize: '0.75rem' }}>(comma-separated)</span></label>
              <input placeholder="Google, Microsoft, Amazon..." value={form.targetCompanies} onChange={e => setForm({ ...form, targetCompanies: e.target.value })} />
            </div>
            {fields.slice(4).map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label style={{ display: 'block', marginBottom: 5, fontSize: '0.83rem', color: 'var(--text2)' }}>{label}</label>
                <input type={type} placeholder={placeholder} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <button onClick={handleSave} className="btn btn-primary" style={{ marginTop: 6, justifyContent: 'center' }} disabled={loading}>
              <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
