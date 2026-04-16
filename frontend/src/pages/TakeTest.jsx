import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { testAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function TakeTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const startTime = useRef(null);

  useEffect(() => {
    testAPI.getOne(id).then(r => { setTest(r.data); setTimeLeft(r.data.duration * 60); })
      .catch(() => toast.error('Test not found')).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const timeTaken = startTime.current ? Math.floor((Date.now() - startTime.current) / 1000) : 0;
      const answerArray = test.questions.map((_, i) => ({ selectedAnswer: answers[i] ?? -1, timeTaken: 0 }));
      const r = await testAPI.submit(id, { answers: answerArray, timeTaken });
      setResult(r.data);
      setSubmitted(true);
    } catch (e) {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  }, [id, answers, test, submitting]);

  useEffect(() => {
    if (!started || submitted || timeLeft <= 0) return;
    if (timeLeft === 0) { handleSubmit(); return; }
    const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [started, submitted, timeLeft, handleSubmit]);

  if (loading) return <div className="loader"><div className="spinner" /></div>;
  if (!test) return <div className="empty-state"><h3>Test not found</h3></div>;

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const answered = Object.keys(answers).length;
  const danger = timeLeft < 60;

  // Results screen
  if (submitted && result) {
    const { result: res, questions } = result;
    return (
      <div className="fade-in" style={{ maxWidth: 720, margin: '0 auto' }}>
        <div className="card" style={{ textAlign: 'center', marginBottom: 24, padding: 40 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: res.passed ? 'rgba(34,211,160,0.15)' : 'rgba(244,63,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            {res.passed ? <CheckCircle size={40} color="var(--green)" /> : <XCircle size={40} color="var(--red)" />}
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: 8 }}>{res.passed ? 'Congratulations! 🎉' : 'Keep Practicing!'}</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 28 }}>{res.passed ? 'You passed the test' : 'You need more practice'}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32 }}>
            {[['Score', `${res.score}/${res.totalMarks}`], ['Percentage', `${res.percentage}%`], ['XP Earned', `+${result.xpGained}`]].map(([l, v]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent3)' }}>{v}</div>
                <div style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Q review */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          {questions?.map((q, i) => {
            const isCorrect = q.userAnswer === q.correctAnswer;
            return (
              <div key={i} className="card" style={{ borderColor: isCorrect ? 'rgba(34,211,160,0.3)' : 'rgba(244,63,94,0.3)' }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  {isCorrect ? <CheckCircle size={18} color="var(--green)" style={{ flexShrink: 0, marginTop: 2 }} /> : <XCircle size={18} color="var(--red)" style={{ flexShrink: 0, marginTop: 2 }} />}
                  <span style={{ fontSize: '0.95rem' }}>{q.text}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {q.options?.map((opt, j) => (
                    <div key={j} style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', background: j === q.correctAnswer ? 'rgba(34,211,160,0.1)' : j === q.userAnswer && !isCorrect ? 'rgba(244,63,94,0.1)' : 'var(--bg3)', border: `1px solid ${j === q.correctAnswer ? 'rgba(34,211,160,0.3)' : j === q.userAnswer && !isCorrect ? 'rgba(244,63,94,0.3)' : 'var(--border)'}`, color: j === q.correctAnswer ? 'var(--green)' : j === q.userAnswer && !isCorrect ? 'var(--red)' : 'var(--text2)' }}>
                      {opt}
                    </div>
                  ))}
                </div>
                {q.explanation && <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(108,99,255,0.08)', borderRadius: 6, fontSize: '0.83rem', color: 'var(--text2)', borderLeft: '3px solid var(--accent)' }}>💡 {q.explanation}</div>}
              </div>
            );
          })}
        </div>
        <button onClick={() => navigate('/tests')} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Back to Tests</button>
      </div>
    );
  }

  // Start screen
  if (!started) {
    return (
      <div className="fade-in" style={{ maxWidth: 600, margin: '0 auto' }}>
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: 12 }}>{test.title}</h1>
          <p style={{ color: 'var(--text2)', marginBottom: 32 }}>{test.description}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 36 }}>
            {[['Questions', test.questions?.length], ['Duration', `${test.duration} min`], ['Total Marks', test.totalMarks]].map(([l, v]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent3)' }}>{v}</div>
                <div style={{ color: 'var(--text2)', fontSize: '0.82rem' }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: 16, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 'var(--radius-sm)', marginBottom: 28, display: 'flex', gap: 10, textAlign: 'left' }}>
            <AlertTriangle size={18} color="var(--yellow)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>Once started, the timer cannot be paused. The test will auto-submit when time runs out.</div>
          </div>
          <button onClick={() => { setStarted(true); startTime.current = Date.now(); }} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
            Start Test
          </button>
        </div>
      </div>
    );
  }

  const q = test.questions[currentQ];

  return (
    <div className="fade-in" style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: '12px 16px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
        <span style={{ fontSize: '0.88rem', color: 'var(--text2)' }}>{test.title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: danger ? 'var(--red)' : 'var(--text)' }}>
          <Clock size={18} color={danger ? 'var(--red)' : 'var(--text2)'} />
          {fmt(timeLeft)}
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>{answered}/{test.questions.length} answered</span>
      </div>

      {/* Question navigation */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {test.questions.map((_, i) => (
          <button key={i} onClick={() => setCurrentQ(i)}
            style={{ width: 32, height: 32, borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', background: i === currentQ ? 'var(--accent)' : answers[i] !== undefined ? 'rgba(34,211,160,0.2)' : 'var(--bg3)', color: i === currentQ ? 'white' : answers[i] !== undefined ? 'var(--green)' : 'var(--text3)' }}>
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>Question {currentQ + 1} of {test.questions.length}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <span className={`badge badge-${q.difficulty === 'easy' ? 'easy' : q.difficulty === 'hard' ? 'hard' : 'medium'}`}>{q.difficulty}</span>
            {q.topic && <span className="badge badge-accent">{q.topic}</span>}
          </div>
        </div>
        <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: 20 }}>{q.text}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.options?.map((opt, j) => (
            <button key={j} onClick={() => setAnswers(prev => ({ ...prev, [currentQ]: j }))}
              style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: `1px solid ${answers[currentQ] === j ? 'var(--accent)' : 'var(--border)'}`, background: answers[currentQ] === j ? 'rgba(108,99,255,0.12)' : 'var(--bg3)', color: answers[currentQ] === j ? 'var(--accent3)' : 'var(--text)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontWeight: answers[currentQ] === j ? 600 : 400, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: answers[currentQ] === j ? 'var(--accent)' : 'var(--bg4)', color: answers[currentQ] === j ? 'white' : 'var(--text3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0 }}>
                {String.fromCharCode(65 + j)}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} className="btn btn-secondary" disabled={currentQ === 0}>
          <ChevronLeft size={16} /> Previous
        </button>
        {currentQ < test.questions.length - 1 ? (
          <button onClick={() => setCurrentQ(currentQ + 1)} className="btn btn-primary">
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn btn-success" disabled={submitting}>
            {submitting ? 'Submitting...' : <><CheckCircle size={16} /> Submit Test</>}
          </button>
        )}
      </div>
    </div>
  );
}
