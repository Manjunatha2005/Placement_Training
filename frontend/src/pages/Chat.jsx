import { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import toast from 'react-hot-toast';
import { Send, Plus, Trash2, MessageSquare, Bot, User, Zap } from 'lucide-react';

const CHAT_TYPES = [
  { value: 'general', label: '🤖 General', desc: 'General placement help' },
  { value: 'dsa', label: '💻 DSA', desc: 'Data structures & algorithms' },
  { value: 'aptitude', label: '🧮 Aptitude', desc: 'Quant, logical, verbal' },
  { value: 'interview', label: '🎯 Interview', desc: 'Mock interviews & tips' },
  { value: 'resume', label: '📄 Resume', desc: 'Resume review & feedback' },
];

const SUGGESTIONS = [
  'Explain the difference between BFS and DFS with examples',
  'Give me 5 common HR interview questions and ideal answers',
  'How do I solve Two Sum problem optimally?',
  'Create a 30-day DSA study plan for me',
  'What topics does TCS ask in their placement test?',
  'Review my resume and suggest improvements',
];

export default function Chat() {
  const [history, setHistory] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatType, setChatType] = useState('general');
  const messagesEndRef = useRef(null);

  useEffect(() => { loadHistory(); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const loadHistory = async () => {
    try { const r = await chatAPI.getHistory(); setHistory(r.data); } catch {}
  };

  const loadChat = async (chatId) => {
    try {
      const r = await chatAPI.getChat(chatId);
      setActiveChat(chatId);
      setMessages(r.data.messages || []);
      setChatType(r.data.type || 'general');
    } catch { toast.error('Failed to load chat'); }
  };

  const startNewChat = () => { setActiveChat(null); setMessages([]); };

  const deleteChat = async (chatId, e) => {
    e.stopPropagation();
    try { await chatAPI.delete(chatId); setHistory(h => h.filter(c => c._id !== chatId)); if (activeChat === chatId) startNewChat(); }
    catch { toast.error('Failed to delete'); }
  };

  const sendMessage = async (msg = input) => {
    if (!msg.trim() || loading) return;
    const userMsg = { role: 'user', content: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const r = await chatAPI.send({ message: msg, chatId: activeChat, type: chatType });
      setMessages(prev => [...prev, { role: 'assistant', content: r.data.reply, timestamp: new Date() }]);
      if (!activeChat) { setActiveChat(r.data.chatId); loadHistory(); }
    } catch (e) {
      toast.error('Failed to send message');
      setMessages(prev => prev.slice(0, -1));
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 0, height: 'calc(100vh - 100px)', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 14px', borderBottom: '1px solid var(--border)' }}>
          <button onClick={startNewChat} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', gap: 8 }}>
            <Plus size={16} /> New Chat
          </button>
        </div>

        {/* Chat type selector */}
        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mode</div>
          {CHAT_TYPES.map(t => (
            <button key={t.value} onClick={() => setChatType(t.value)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: chatType === t.value ? 'rgba(108,99,255,0.15)' : 'transparent', color: chatType === t.value ? 'var(--accent3)' : 'var(--text2)', textAlign: 'left', marginBottom: 2, fontSize: '0.85rem', fontWeight: chatType === t.value ? 600 : 400 }}>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* History */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Chats</div>
          {history.map(chat => (
            <div key={chat._id} onClick={() => loadChat(chat._id)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 6, cursor: 'pointer', background: activeChat === chat._id ? 'var(--bg4)' : 'transparent', marginBottom: 2, transition: 'background 0.15s' }}
              onMouseEnter={e => { if (activeChat !== chat._id) e.currentTarget.style.background = 'var(--bg3)'; }}
              onMouseLeave={e => { if (activeChat !== chat._id) e.currentTarget.style.background = 'transparent'; }}>
              <MessageSquare size={14} color="var(--text3)" style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: '0.83rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text2)' }}>{chat.title}</span>
              <button onClick={(e) => deleteChat(chat._id, e)} style={{ background: 'none', border: 'none', padding: 2, cursor: 'pointer', color: 'var(--text3)', opacity: 0, transition: 'opacity 0.2s', display: 'flex' }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>PlaceBot AI</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} /> Online · {CHAT_TYPES.find(t => t.value === chatType)?.desc}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.length === 0 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={32} color="white" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ marginBottom: 6 }}>PlaceBot is ready!</h3>
                <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Your AI-powered placement preparation assistant</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, width: '100%', maxWidth: 560 }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => sendMessage(s)}
                    style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text2)', textAlign: 'left', transition: 'all 0.2s', lineHeight: 1.4 }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: m.role === 'user' ? 'linear-gradient(135deg, var(--accent), var(--accent2))' : 'var(--bg4)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {m.role === 'user' ? <User size={16} color="white" /> : <Bot size={16} color="var(--accent3)" />}
              </div>
              <div style={{ maxWidth: '75%', padding: '12px 16px', borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', background: m.role === 'user' ? 'var(--accent)' : 'var(--bg3)', border: m.role === 'assistant' ? '1px solid var(--border)' : 'none', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {m.role === 'assistant' ? (
                  <div className="markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown></div>
                ) : m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg4)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={16} color="var(--accent3)" />
              </div>
              <div style={{ padding: '14px 18px', background: 'var(--bg3)', borderRadius: '4px 16px 16px 16px', border: '1px solid var(--border)', display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent3)', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 14px', transition: 'border-color 0.2s' }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask about DSA, aptitude, interview tips... (Enter to send)"
              style={{ flex: 1, background: 'none', border: 'none', resize: 'none', outline: 'none', fontSize: '0.9rem', color: 'var(--text)', minHeight: 36, maxHeight: 120, lineHeight: 1.5, padding: 0 }}
              rows={1}
            />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()} className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
              <Send size={15} />
            </button>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 6, textAlign: 'center' }}>
            Powered by Claude AI · Enter to send · Shift+Enter for new line
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      `}</style>
    </div>
  );
}
