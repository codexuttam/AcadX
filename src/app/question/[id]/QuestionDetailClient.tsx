'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TokenPayload } from '@/lib/jwt'
import { formatDistanceToNow } from 'date-fns'
import {
    ArrowLeft, MessageSquare, Heart, Eye, Sparkles, Quote, CheckCircle2,
    Terminal, Cpu, Boxes, Coffee, Hash, Brain, Layers, Zap, LayoutGrid, Database, Globe, Network
} from 'lucide-react'
import Image from 'next/image'

const SUBJECT_ICON_MAP: Record<string, any> = {
    'Python': <Terminal size={14} />,
    'C Programming': <Cpu size={14} />,
    'C++': <Boxes size={14} />,
    'Java': <Coffee size={14} />,
    'MATLAB': <Hash size={14} />,
    'Machine Learning': <Brain size={14} />,
    'Data Structures': <Layers size={14} />,
    'Algorithms': <Zap size={14} />,
    'Operating Systems': <LayoutGrid size={14} />,
    'DBMS': <Database size={14} />,
    'Computer Networks': <Globe size={14} />,
    'Deep Learning': <Network size={14} />,
    'Computer Vision': <Eye size={14} />,
    'NLP': <MessageSquare size={14} />
}

function SubjectIcon({ name, emoji }: { name: string, emoji: string }) {
    return SUBJECT_ICON_MAP[name] || <span>{emoji}</span>
}

interface User { id: string; name: string; role: string; verified: boolean; department: string }
interface Answer { id: string; text: string; codeSnippet?: string; upvotes: number; isBest: boolean; createdAt: string; professor: User }
interface Question {
    id: string; title: string; description: string; codeSnippet?: string
    views: number; solved: boolean; createdAt: string
    subject: { id: string; name: string; color: string; icon: string }
    student: User; answers: Answer[]
    upvotes: Array<{ userId: string }>
    _count: { answers: number; upvotes: number }
}

export default function QuestionDetailClient({ questionId, user }: { questionId: string; user: TokenPayload }) {
    const router = useRouter()
    const [question, setQuestion] = useState<Question | null>(null)
    const [loading, setLoading] = useState(true)
    const [answerText, setAnswerText] = useState('')
    const [answerCode, setAnswerCode] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [toast, setToast] = useState<{ msg: string; type: string } | null>(null)

    const showToast = (msg: string, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }

    useEffect(() => {
        fetch(`/api/questions/${questionId}`)
            .then(r => r.json())
            .then(d => { setQuestion(d.question); setLoading(false) })
            .catch(() => setLoading(false))
    }, [questionId])

    const handleUpvote = async () => {
        if (!question) return
        const res = await fetch(`/api/questions/${questionId}/upvote`, { method: 'POST' })
        if (res.ok) {
            const alreadyUpvoted = question.upvotes.some(u => u.userId === user.userId)
            setQuestion(q => q ? {
                ...q,
                upvotes: alreadyUpvoted ? q.upvotes.filter(u => u.userId !== user.userId) : [...q.upvotes, { userId: user.userId }],
                _count: { ...q._count, upvotes: alreadyUpvoted ? q._count.upvotes - 1 : q._count.upvotes + 1 }
            } : q)
        }
    }

    const handleAnswer = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        const res = await fetch(`/api/questions/${questionId}/answers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: answerText, codeSnippet: answerCode || undefined }),
        })
        const data = await res.json()
        setSubmitting(false)
        if (res.ok) {
            setQuestion(q => q ? { ...q, answers: [...q.answers, data.answer], _count: { ...q._count, answers: q._count.answers + 1 } } : q)
            setAnswerText('')
            setAnswerCode('')
            showToast('✅ Answer posted!')
        } else {
            showToast(data.error || 'Failed to post answer', 'error')
        }
    }

    if (loading) return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner" style={{ width: 32, height: 32 }} />
        </div>
    )
    if (!question) return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '3rem' }}>🔍</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Question not found</div>
            <Link href="/feed" className="btn btn-primary">← Back to Feed</Link>
        </div>
    )

    const isUpvoted = question.upvotes.some(u => u.userId === user.userId)
    const timeAgo = formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Top nav */}
            <nav style={{ position: 'sticky', top: 0, background: 'var(--nav-scrolled-bg)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-light)', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100 }}>
                <button onClick={() => router.back()} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, padding: '0.4rem 0.8rem', borderRadius: '10px', transition: 'all 0.2s' }} className="hover:scale-105">
                    <ArrowLeft size={16} />
                    Back
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ position: 'relative', width: 32, height: 32, overflow: 'hidden', backgroundColor: 'var(--logo-bg)', borderRadius: '8px', padding: '4px', border: '1px solid var(--border-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.5s ease' }}>
                        <Image src="/logo.png" alt="AcadX Logo" fill style={{ objectFit: 'contain' }} />
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: '900', letterSpacing: '-0.04em', background: 'linear-gradient(to right, var(--gradient-text-start), var(--gradient-text-end))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AcadX</span>
                </div>

                <div style={{ width: '80px' }} className="desktop-only" />
            </nav>

            <div style={{ maxWidth: '720px', margin: '0 auto', padding: '1.5rem 1.25rem' }}>
                {/* Question */}
                <div className="card animate-fadeIn" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                    {/* Author */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div className="avatar avatar-lg">{question.student.name.charAt(0)}</div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{question.student.name}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{question.student.department} · {timeAgo}</div>
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                            <span className="tag" style={{ background: question.subject.color + '20', color: question.subject.color, borderRadius: '8px', padding: '0.3rem 0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <SubjectIcon name={question.subject.name} emoji={question.subject.icon} />
                                <span style={{ fontWeight: 600 }}>{question.subject.name}</span>
                            </span>
                        </div>
                    </div>

                    {question.solved && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,186,124,0.1)', border: '1px solid var(--success)', borderRadius: '8px', padding: '0.4rem 0.75rem', marginBottom: '1rem', color: 'var(--success)', fontSize: '0.82rem', fontWeight: 600 }}>
                            ✓ This question has been solved
                        </div>
                    )}

                    <h1 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: '1.4' }}>{question.title}</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>{question.description}</p>

                    {question.codeSnippet && (
                        <div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>📋 Code</div>
                            <div className="code-block">{question.codeSnippet}</div>
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                        <button onClick={handleUpvote} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: isUpvoted ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.2s' }}>
                            <Heart size={18} fill={isUpvoted ? "currentColor" : "none"} />
                            {question._count.upvotes} {isUpvoted ? 'Liked' : 'Like'}
                        </button>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <MessageSquare size={18} /> {question._count.answers} {question._count.answers === 1 ? 'Answer' : 'Answers'}
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Eye size={18} /> {question.views} views
                        </span>
                    </div>
                </div>

                {/* Answers */}
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem' }}>
                    {question.answers.length === 0 ? '💭 No answers yet' : `💬 ${question.answers.length} ${question.answers.length === 1 ? 'Answer' : 'Answers'}`}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    {question.answers.map(ans => (
                        <div key={ans.id} className="card animate-fadeIn" style={{ padding: '1.25rem', borderColor: ans.isBest ? 'var(--success)' : 'var(--border-light)' }}>
                            {ans.isBest && (
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,186,124,0.1)', color: 'var(--success)', borderRadius: '8px', padding: '0.3rem 0.65rem', marginBottom: '0.75rem', fontSize: '0.78rem', fontWeight: 700 }}>
                                    ⭐ Best Answer
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div className="avatar">{ans.professor.name.charAt(0)}</div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{ans.professor.name}</span>
                                        {(ans.professor.role === 'professor' || ans.professor.role === 'admin') && (
                                            <CheckCircle2 size={14} color="var(--accent)" fill="var(--accent-glow)" />
                                        )}
                                    </div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                                        {ans.professor.role === 'professor' ? '👨‍🏫 Professor' : '👑 Admin'} · {ans.professor.department} · {formatDistanceToNow(new Date(ans.createdAt), { addSuffix: true })}
                                    </div>
                                </div>
                            </div>
                            <p style={{ color: 'var(--text-primary)', fontSize: '0.93rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{ans.text}</p>
                            {ans.codeSnippet && (
                                <div className="code-block" style={{ marginTop: '1rem' }}>{ans.codeSnippet}</div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Answer form (for professors only) */}
                {(user.role === 'professor' || user.role === 'admin') && (
                    <div className="card animate-slideIn" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>✍️ Write Your Answer</h3>
                        <form onSubmit={handleAnswer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <textarea className="input" placeholder="Write your answer here. Be clear and helpful..." value={answerText} onChange={e => setAnswerText(e.target.value)} rows={5} required />
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>Code Example (optional)</label>
                                <textarea className="input" style={{ fontFamily: 'monospace', fontSize: '0.82rem' }} placeholder="// Add example code here..." value={answerCode} onChange={e => setAnswerCode(e.target.value)} rows={4} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" className="btn btn-primary" disabled={submitting || !answerText.trim()}>
                                    {submitting ? <div className="spinner" /> : '✅ Post Answer'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {user.role === 'student' && question.answers.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-secondary)', background: 'linear-gradient(135deg, var(--bg-card), var(--bg-primary))', border: '1px dashed var(--border-light)', borderRadius: '16px', marginTop: '1rem' }} className="animate-fadeIn">
                        <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '50%', marginBottom: '1.25rem', border: '1px solid var(--border-light)' }}>
                            <Coffee size={32} color="var(--accent)" opacity={0.6} />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No professor has approached yet</h3>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '280px', margin: '0 auto', lineHeight: 1.6 }}>Professors are notified of new doubts. Keep an eye on your notification bell!</p>
                    </div>
                )}
            </div>

            {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
        </div>
    )
}
