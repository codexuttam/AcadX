'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TokenPayload } from '@/lib/jwt'
import { formatDistanceToNow } from 'date-fns'

interface Subject { id: string; name: string; color: string; icon: string; _count?: { questions: number } }
interface User { id: string; name: string; role: string; verified: boolean; department: string }
interface Answer { id: string; text: string; codeSnippet?: string; upvotes: number; isBest: boolean; createdAt: string; professor: User }
interface Question {
    id: string; title: string; description: string; codeSnippet?: string
    views: number; solved: boolean; createdAt: string
    subject: Subject; student: User; answers: Answer[]
    upvotes: Array<{ userId: string }>
    _count: { answers: number; upvotes: number }
}

export default function FeedClient({ user }: { user: TokenPayload }) {
    const router = useRouter()
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [questions, setQuestions] = useState<Question[]>([])
    const [selectedSubject, setSelectedSubject] = useState('all')
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [showAskModal, setShowAskModal] = useState(false)
    const [toast, setToast] = useState<{ msg: string; type: string } | null>(null)

    const showToast = (msg: string, type = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    const fetchSubjects = useCallback(async () => {
        const res = await fetch('/api/subjects')
        const data = await res.json()
        setSubjects(data.subjects || [])
    }, [])

    const fetchQuestions = useCallback(async () => {
        setLoading(true)
        const params = new URLSearchParams()
        if (selectedSubject !== 'all') params.set('subject', selectedSubject)
        if (search) params.set('search', search)
        const res = await fetch(`/api/questions?${params}`)
        const data = await res.json()
        setQuestions(data.questions || [])
        setLoading(false)
    }, [selectedSubject, search])

    useEffect(() => { fetchSubjects() }, [fetchSubjects])
    useEffect(() => {
        const t = setTimeout(fetchQuestions, search ? 400 : 0)
        return () => clearTimeout(t)
    }, [fetchQuestions, search])

    const handleUpvote = async (questionId: string) => {
        const res = await fetch(`/api/questions/${questionId}/upvote`, { method: 'POST' })
        if (res.ok) {
            setQuestions(qs => qs.map(q => {
                if (q.id !== questionId) return q
                const alreadyUpvoted = q.upvotes.some(u => u.userId === user.userId)
                return {
                    ...q,
                    upvotes: alreadyUpvoted
                        ? q.upvotes.filter(u => u.userId !== user.userId)
                        : [...q.upvotes, { userId: user.userId }],
                    _count: { ...q._count, upvotes: alreadyUpvoted ? q._count.upvotes - 1 : q._count.upvotes + 1 }
                }
            }))
        }
    }

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Left Sidebar */}
            <aside style={{ width: '260px', flexShrink: 0 }} className="sidebar">
                <div style={{ padding: '0.5rem 1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: 36, height: 36, background: 'var(--accent)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>⚡</div>
                        <span style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '-0.04em' }}>AcadX</span>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1 }}>
                    <Link href="/feed" className="nav-item active">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.4 8.166L12 18.896l-7.334 4.262 1.4-8.166L.132 9.21l8.2-1.192z" /></svg>
                        <span>Feed</span>
                    </Link>
                    {user.role !== 'professor' && (
                        <button onClick={() => setShowAskModal(true)} className="nav-item" style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" /></svg>
                            <span>Ask a Doubt</span>
                        </button>
                    )}
                    {user.role === 'admin' && (
                        <Link href="/admin" className="nav-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                            <span>Admin Panel</span>
                        </Link>
                    )}
                </nav>

                {/* User profile */}
                <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--border-light)', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem', borderRadius: '12px', cursor: 'pointer' }} className="nav-item">
                        <div className="avatar avatar-sm">{user.name.charAt(0)}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user.name.split(' ')[0]}
                                {user.role === 'professor' || user.role === 'admin' ? <span style={{ width: 14, height: 14, background: 'var(--accent)', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: 'white' }}>✓</span> : null}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{user.role}</div>
                        </div>
                        <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '1rem', padding: '0.25rem' }} title="Sign out">↩</button>
                    </div>
                </div>
            </aside>

            {/* Main Feed */}
            <main style={{ flex: 1, borderRight: '1px solid var(--border-light)', maxWidth: '680px' }}>
                {/* Header */}
                <div style={{ position: 'sticky', top: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-light)', padding: '1rem 1.25rem', zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h1 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Doubt Feed</h1>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '0.25rem 0.65rem', borderRadius: '20px' }}>
                            {questions.length} questions
                        </span>
                    </div>

                    {/* Search */}
                    <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                        <svg style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                        <input className="input" placeholder="Search doubts..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.25rem', borderRadius: '9999px', background: 'var(--bg-secondary)' }} />
                    </div>

                    {/* Subject filters */}
                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '2px' }}>
                        <button className={`filter-pill ${selectedSubject === 'all' ? 'active' : ''}`} onClick={() => setSelectedSubject('all')}>
                            🌐 All
                        </button>
                        {subjects.map(s => (
                            <button key={s.id} className={`filter-pill ${selectedSubject === s.name ? 'active' : ''}`} onClick={() => setSelectedSubject(s.name === selectedSubject ? 'all' : s.name)}>
                                {s.icon} {s.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Questions list */}
                {loading ? (
                    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-light)' }}>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: '0.5rem' }} />
                                        <div className="skeleton" style={{ height: 18, width: '90%', marginBottom: '0.4rem' }} />
                                        <div className="skeleton" style={{ height: 14, width: '75%' }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : questions.length === 0 ? (
                    <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💭</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No doubts found</div>
                        <div style={{ fontSize: '0.9rem' }}>{selectedSubject !== 'all' ? `No questions in ${selectedSubject} yet.` : 'Be the first to ask a question!'}</div>
                    </div>
                ) : (
                    questions.map(q => (
                        <QuestionCard key={q.id} question={q} currentUserId={user.userId} userRole={user.role} onUpvote={handleUpvote} onQuestionClick={() => router.push(`/question/${q.id}`)} />
                    ))
                )}
            </main>

            {/* Right sidebar */}
            <aside style={{ width: '340px', flexShrink: 0, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="card" style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.05rem' }}>📚 Popular Subjects</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {subjects.slice(0, 8).map(s => (
                            <button key={s.id} onClick={() => setSelectedSubject(s.name === selectedSubject ? 'all' : s.name)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', background: selectedSubject === s.name ? 'var(--accent-glow)' : 'transparent', transition: 'background 0.2s', width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <span>{s.icon}</span>
                                    <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500 }}>{s.name}</span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: selectedSubject === s.name ? 'var(--accent)' : 'var(--text-muted)' }}>{s._count?.questions || 0} Q</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="card" style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1.05rem' }}>🏫 About AcadX</h3>
                    <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        X-like doubt resolution platform for School of Engineering students. Post questions, get answers from verified professors.
                    </p>
                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span className="tag" style={{ background: 'rgba(108,99,255,0.15)', color: 'var(--accent)' }}>CSE</span>
                        <span className="tag" style={{ background: 'rgba(236,72,153,0.15)', color: '#ec4899' }}>AIML</span>
                        <span className="tag" style={{ background: 'rgba(6,182,212,0.15)', color: '#06b6d4' }}>BTech</span>
                    </div>
                </div>
            </aside>

            {/* Ask Doubt Modal */}
            {showAskModal && (
                <AskModal subjects={subjects} onClose={() => setShowAskModal(false)} onSuccess={(q) => { setQuestions(qs => [q, ...qs]); setShowAskModal(false); showToast('✅ Question posted successfully!') }} />
            )}

            {/* Toast */}
            {toast && (
                <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
            )}
        </div>
    )
}

function QuestionCard({ question: q, currentUserId, userRole, onUpvote, onQuestionClick }: { question: Question; currentUserId: string; userRole: string; onUpvote: (id: string) => void; onQuestionClick: () => void }) {
    const isUpvoted = q.upvotes.some((u: { userId: string }) => u.userId === currentUserId)
    const timeAgo = formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })

    return (
        <div className="feed-item animate-fadeIn" onClick={onQuestionClick}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div className="avatar" style={{ cursor: 'default' }}>{q.student.name.charAt(0)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.15rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{q.student.name}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>·</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{timeAgo}</span>
                        {q.solved && <span className="tag" style={{ background: 'rgba(0,186,124,0.15)', color: 'var(--success)', fontSize: '0.7rem' }}>✓ Solved</span>}
                    </div>

                    <div style={{ marginBottom: '0.5rem' }}>
                        <span className="tag" style={{ background: q.subject.color + '20', color: q.subject.color, marginBottom: '0.5rem', display: 'inline-flex' }}>
                            {q.subject.icon} {q.subject.name}
                        </span>
                    </div>

                    <h3 style={{ fontWeight: 600, fontSize: '0.97rem', marginBottom: '0.3rem', lineHeight: '1.4' }}>{q.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.87rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2 as any, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}>{q.description}</p>

                    {q.codeSnippet && (
                        <div className="code-block" style={{ maxHeight: '80px', overflow: 'hidden', fontSize: '0.75rem' }}>
                            {q.codeSnippet.substring(0, 150)}{q.codeSnippet.length > 150 ? '...' : ''}
                        </div>
                    )}

                    {/* Action bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.75rem' }}>
                        <button onClick={(e) => { e.stopPropagation(); onUpvote(q.id) }} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: isUpvoted ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '0.83rem', fontWeight: 500, padding: 0, transition: 'color 0.2s' }}>
                            <svg viewBox="0 0 24 24" fill={isUpvoted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            {q._count.upvotes}
                        </button>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.83rem' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            {q._count.answers} {q._count.answers === 1 ? 'Answer' : 'Answers'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.83rem' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                            {q.views}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function AskModal({ subjects, onClose, onSuccess }: { subjects: Subject[]; onClose: () => void; onSuccess: (q: Question) => void }) {
    const [form, setForm] = useState({ title: '', description: '', subjectId: '', codeSnippet: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.subjectId) { setError('Please select a subject'); return }
        setLoading(true)
        setError('')
        const res = await fetch('/api/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })
        const data = await res.json()
        setLoading(false)
        if (!res.ok) { setError(data.error); return }
        onSuccess(data.question)
    }

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 100, padding: '2rem 1rem', backdropFilter: 'blur(4px)', overflowY: 'auto' }}>
            <div className="card animate-fadeIn" style={{ width: '100%', maxWidth: '560px', padding: '1.5rem', marginTop: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <h2 style={{ fontWeight: 800, fontSize: '1.15rem' }}>✏️ Post a Doubt</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '1.25rem', padding: '0.25rem', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>Subject *</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                            {subjects.map(s => (
                                <button key={s.id} type="button" onClick={() => setForm(f => ({ ...f, subjectId: s.id }))} className={`filter-pill ${form.subjectId === s.id ? 'active' : ''}`} style={{ fontSize: '0.8rem' }}>
                                    {s.icon} {s.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>Question Title *</label>
                        <input className="input" placeholder="What is your doubt? (short and clear)" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required maxLength={200} />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>Description *</label>
                        <textarea className="input" placeholder="Explain your doubt in detail. What have you tried? What error are you getting?" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required rows={4} />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>Code Snippet (optional)</label>
                        <textarea className="input" style={{ fontFamily: 'monospace', fontSize: '0.82rem' }} placeholder="// Paste your code here..." value={form.codeSnippet} onChange={e => setForm(f => ({ ...f, codeSnippet: e.target.value }))} rows={4} />
                    </div>

                    {error && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', padding: '0.6rem', background: 'rgba(244,33,46,0.1)', borderRadius: '8px' }}>{error}</div>}

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <div className="spinner" /> : '🚀 Post Doubt'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
