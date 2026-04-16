import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { codingAPI } from '../services/api';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import toast from 'react-hot-toast';
import { Play, Send, ChevronLeft, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

const LANGS = ['javascript', 'python', 'java', 'cpp'];
const langExtensions = { javascript: [javascript()], python: [python()], java: [javascript()], cpp: [javascript()] };

export default function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState('description');
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    codingAPI.getOne(id).then(r => {
      setProblem(r.data);
      setCode(r.data.starterCode?.javascript || '');
    }).catch(() => toast.error('Problem not found')).finally(() => setLoading(false));
  }, [id]);

  const handleLangChange = (l) => { setLang(l); setCode(problem?.starterCode?.[l] || ''); };

  const handleRun = async () => {
    setRunning(true); setOutput(null);
    try {
      const r = await codingAPI.runCode({ code, language: lang });
      setOutput({ type: r.data.status, text: r.data.output || r.data.error });
    } catch { toast.error('Run failed'); }
    finally { setRunning(false); }
  };

  const handleSubmit = async () => {
    setSubmitting(true); setOutput(null);
    try {
      const r = await codingAPI.submit(id, { code, language: lang });
      const { submission } = r.data;
      setOutput({ type: submission.status, text: `Status: ${submission.status.replace('_', ' ').toUpperCase()}\nTest Cases: ${submission.testCasesPassed}/${submission.totalTestCases} passed` });
      if (submission.status === 'accepted') toast.success('Accepted! +50 XP 🎉');
      else toast.error(`${submission.status.replace('_', ' ')}`);
    } catch { toast.error('Submission failed'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="loader"><div className="spinner" /></div>;
  if (!problem) return <div className="empty-state"><h3>Problem not found</h3><Link to="/coding">Back</Link></div>;

  const outputColors = { success: 'var(--green)', accepted: 'var(--green)', error: 'var(--red)', runtime_error: 'var(--red)', wrong_answer: 'var(--red)', info: 'var(--blue)' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, height: 'calc(100vh - 120px)', minHeight: 600 }}>
      {/* Left: Problem */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 16px' }}>
          {[['description', 'Description'], ['examples', 'Examples'], ['hints', 'Hints']].map(([t, l]) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.88rem', color: tab === t ? 'var(--text)' : 'var(--text3)', fontWeight: tab === t ? 600 : 400, borderBottom: `2px solid ${tab === t ? 'var(--accent)' : 'transparent'}`, marginBottom: -1, transition: 'all 0.2s' }}>
              {l}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {tab === 'description' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h2 style={{ fontSize: '1.2rem' }}>{problem.title}</h2>
                <span className={`badge badge-${problem.difficulty}`}>{problem.difficulty}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                {problem.tags?.map(t => <span key={t} className="tag" style={{ fontSize: '0.75rem' }}>{t}</span>)}
                {problem.companies?.map(c => <span key={c} className="badge badge-blue" style={{ fontSize: '0.72rem' }}>{c}</span>)}
              </div>
              <div style={{ color: 'var(--text2)', lineHeight: 1.7, fontSize: '0.92rem', whiteSpace: 'pre-wrap' }}>{problem.description}</div>
              {problem.constraints && (
                <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                  <strong style={{ display: 'block', marginBottom: 6, color: 'var(--text2)' }}>Constraints:</strong>
                  <pre style={{ fontFamily: 'inherit', color: 'var(--text2)', margin: 0, whiteSpace: 'pre-wrap' }}>{problem.constraints}</pre>
                </div>
              )}
            </>
          )}

          {tab === 'examples' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {problem.examples?.map((ex, i) => (
                <div key={i} style={{ background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', padding: 16 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 10 }}>Example {i + 1}</div>
                  <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div><span style={{ color: 'var(--text3)' }}>Input: </span><span>{ex.input}</span></div>
                    <div><span style={{ color: 'var(--text3)' }}>Output: </span><span style={{ color: 'var(--green)' }}>{ex.output}</span></div>
                    {ex.explanation && <div style={{ color: 'var(--text2)', marginTop: 4 }}><span style={{ color: 'var(--text3)' }}>Explanation: </span>{ex.explanation}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'hints' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {problem.hints?.length > 0 ? problem.hints.map((h, i) => (
                <div key={i} style={{ padding: '12px 16px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 'var(--radius-sm)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Lightbulb size={16} color="var(--yellow)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: '0.88rem', color: 'var(--text2)' }}>{h}</span>
                </div>
              )) : <div style={{ color: 'var(--text3)', textAlign: 'center', padding: 32 }}>No hints available for this problem.</div>}
            </div>
          )}
        </div>
      </div>

      {/* Right: Editor */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {/* Editor toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {LANGS.map(l => (
              <button key={l} onClick={() => handleLangChange(l)}
                style={{ padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: lang === l ? 'var(--accent)' : 'var(--bg3)', color: lang === l ? 'white' : 'var(--text3)', textTransform: 'capitalize' }}>
                {l}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleRun} className="btn btn-sm btn-secondary" disabled={running}>
              <Play size={14} /> {running ? 'Running...' : 'Run'}
            </button>
            <button onClick={handleSubmit} className="btn btn-sm btn-primary" disabled={submitting}>
              <Send size={14} /> {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>

        {/* Code editor */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <CodeMirror
            value={code}
            height="100%"
            theme={oneDark}
            extensions={langExtensions[lang] || [javascript()]}
            onChange={setCode}
            style={{ fontSize: '0.88rem', height: '100%' }}
          />
        </div>

        {/* Output */}
        <div style={{ borderTop: '1px solid var(--border)', padding: 14, background: 'var(--bg)', minHeight: 100, maxHeight: 180, overflowY: 'auto' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Output</div>
          {output ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              {output.type === 'accepted' || output.type === 'success' ? <CheckCircle size={16} color="var(--green)" style={{ flexShrink: 0, marginTop: 2 }} /> : <XCircle size={16} color="var(--red)" style={{ flexShrink: 0, marginTop: 2 }} />}
              <pre style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: outputColors[output.type] || 'var(--text)', margin: 0, whiteSpace: 'pre-wrap' }}>{output.text}</pre>
            </div>
          ) : (
            <div style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>Run your code to see output here</div>
          )}
        </div>
      </div>
    </div>
  );
}
