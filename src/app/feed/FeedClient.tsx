'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { TokenPayload } from '@/lib/jwt'
import { formatDistanceToNow } from 'date-fns'
import {
    LayoutGrid, Terminal, Cpu, Globe, Database, Hash, Workflow, Brain, Eye,
    MessageSquare, Search, Plus, TrendingUp, Award, Zap, BookOpen, Clock,
    CheckCircle2, Sparkles, Quote, Coffee, Layers, Network, Boxes
} from 'lucide-react'

interface Subject { id: string; name: string; color: string; icon: string; _count?: { questions: number } }
interface User { id: string; name: string; role: string; verified: boolean; department: string; credits: number }
interface Answer { id: string; text: string; codeSnippet?: string; upvotes: number; isBest: boolean; createdAt: string; professor: User }
interface Question {
    id: string; title: string; description: string; codeSnippet?: string; image?: string
    views: number; solved: boolean; createdAt: string
    subject: Subject; student: User; answers: Answer[]
    upvotes: Array<{ userId: string }>
    _count: { answers: number; upvotes: number }
}

const GEN_Z_QUOTES = [
    "No cap, this derivation is straight fire. ✍️",
    "Manifesting an A in Operating Systems. 🕯️",
    "Debugging is my main character energy. 💅",
    "This code is living rent free in my head. 🧠",
    "Slaying the semester, one recursion at a time. ✨",
    "Validating this answer? That's period. 💅",
    "The academic rizz is real today. 📚",
    "It's the 'error: undefined' for me. 💀"
]

const DAILY_FACTS = [
    "The first computer bug was an actual moth found in a Harvard Mark II computer in 1947.",
    "Binary code was invented by Gottfried Wilhelm Leibniz in the 17th century.",
    "The term 'Robot' comes from the Czech word 'robota', meaning forced labor.",
    "Light takes 8 minutes and 20 seconds to travel from the Sun to the Earth.",
    "The SQL query 'SELECT * FROM life' returns 0 results without 'dreams'.",
    "Python was named after 'Monty Python's Flying Circus', not the snake.",
    "The first website ever went live on August 6, 1991."
]

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

export function FeedClient({ user }: { user: TokenPayload }) {
    const router = useRouter()
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [questions, setQuestions] = useState<Question[]>([])
    const [selectedSubject, setSelectedSubject] = useState('all')
    const searchParams = useSearchParams()
    const urlFilter = searchParams?.get('filter') || ''
    const [selectedFilter, setSelectedFilter] = useState(urlFilter)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [showAskModal, setShowAskModal] = useState(false)
    const [toast, setToast] = useState<{ msg: string; type: string } | null>(null)
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const profileRef = useRef<HTMLDivElement | null>(null)

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
        if (selectedFilter) params.set('filter', selectedFilter)
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

    useEffect(() => {
        // update selectedFilter when URL changes
        setSelectedFilter(urlFilter)
    }, [urlFilter])

    const handleUpvote = async (questionId: string) => {
        const res = await fetch(`/api/questions/${questionId}/upvote`, { method: 'POST' })
        if (res.ok) {
            setQuestions((prev: Question[]) => prev.map((q: Question) => {
                if (q.id !== questionId) return q
                const alreadyUpvoted = q.upvotes.some((u: { userId: string }) => u.userId === user.userId)
                return {
                    ...q,
                    upvotes: alreadyUpvoted
                        ? q.upvotes.filter((u: { userId: string }) => u.userId !== user.userId)
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

    // Close profile menu when clicking outside
    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!profileRef.current) return
            if (e.target instanceof Node && !profileRef.current.contains(e.target)) {
                setShowProfileMenu(false)
            }
        }
        document.addEventListener('click', onDocClick)
        return () => document.removeEventListener('click', onDocClick)
    }, [])

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)', paddingLeft: '260px' }}>
            {/* Left Sidebar (Fixed) */}
            <aside style={{ width: '260px', position: 'fixed', left: 0, top: 0, height: '100vh', borderRight: '1px solid var(--border-light)', zIndex: 100, background: 'var(--bg-primary)' }} className="sidebar">
                <div style={{ padding: '0.5rem 1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                            <Image src="/logo.png" alt="AcadX Logo" fill style={{ objectFit: 'contain' }} />
                        </div>
                        <span style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '-0.04em' }}>AcadX</span>
                    </div>
                </div>

                <nav style={{ flex: 1 }}>
                    <Link href="/feed" className="nav-item active">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.4 8.166L12 18.896l-7.334 4.262 1.4-8.166L.132 9.21l8.2-1.192z" /></svg>
                        <span>Feed</span>
                    </Link>
                    {user.role !== 'professor' && (
                        <button onClick={() => setShowAskModal(true)} className="nav-item" style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left' }}>
                            <Plus size={22} />
                            <span>Ask a Doubt</span>
                        </button>
                    )}
                    {user.role === 'admin' && (
                        <Link href="/admin" className="nav-item">
                            <LayoutGrid size={22} />
                            <span>Admin Panel</span>
                        </Link>
                    )}
                </nav>

                <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--border-light)', marginTop: 'auto' }}>
                    <div ref={profileRef} style={{ position: 'relative' }}>
                        <div onClick={() => setShowProfileMenu(s => !s)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem', borderRadius: '12px', cursor: 'pointer' }} className="nav-item">
                            <div className="avatar avatar-sm">{user.name.charAt(0)}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {user.name.split(' ')[0]}
                                    {(user.role === 'professor' || user.role === 'admin') && <span style={{ width: 14, height: 14, background: 'var(--accent)', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: 'white' }}>✓</span>}
                                </div>
                                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{user.role}</div>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>⋯</div>
                        </div>

                        {showProfileMenu && (
                            <div style={{ position: 'absolute', left: 8, bottom: '56px', width: 220, background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 12, boxShadow: '0 6px 20px rgba(0,0,0,0.6)', padding: '0.5rem', zIndex: 200 }}>
                                {user.role === 'professor' && (
                                    <button onClick={() => { setShowProfileMenu(false); router.push('/feed?filter=unanswered') }} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', textAlign: 'left', padding: '0.6rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 700, borderRadius: 8 }}>
                                        <span style={{ display: 'inline-flex', width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: 'linear-gradient(135deg, var(--accent), var(--success))', color: 'white', fontSize: '0.9rem' }}>✍️</span>
                                        Answer Doubts
                                    </button>
                                )}
                                {user.role !== 'professor' && (
                                    <button onClick={() => { setShowAskModal(true); setShowProfileMenu(false) }} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', textAlign: 'left', padding: '0.6rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 700, borderRadius: 8 }}>
                                        <span style={{ display: 'inline-flex', width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>＋</span>
                                        Ask a Doubt
                                    </button>
                                )}
                                <button onClick={() => { setShowProfileMenu(false); logout() }} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', textAlign: 'left', padding: '0.6rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 700, borderRadius: 8 }}>
                                    <span style={{ display: 'inline-flex', width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>↩</span>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <div style={{ display: 'flex', width: '100%', maxWidth: '1100px' }}>
                    <main style={{ flex: 1, minWidth: 0, borderRight: '1px solid var(--border-light)' }}>
                        <div style={{ position: 'sticky', top: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-light)', padding: '1.25rem 1.5rem', zIndex: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                <div>
                                    <h1 style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Dashboard</h1>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>Daily Pulse</div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{questions.length} Active Doubts</div>
                                </div>
                            </div>

                            <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                                <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input className="input" placeholder="Search academic archives..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem', borderRadius: '14px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                                <button className={`filter-pill ${selectedSubject === 'all' ? 'active' : ''}`} onClick={() => setSelectedSubject('all')} style={{ borderRadius: '10px', padding: '0.4rem 1rem' }}>
                                    <LayoutGrid size={14} /> All Subjects
                                </button>
                                {subjects.map(s => (
                                    <button key={s.id} className={`filter-pill ${selectedSubject === s.name ? 'active' : ''}`} onClick={() => setSelectedSubject(s.name === selectedSubject ? 'all' : s.name)} style={{ borderRadius: '10px', padding: '0.4rem 1rem' }}>
                                        <SubjectIcon name={s.name} emoji={s.icon} /> {s.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {!search && selectedSubject === 'all' && (
                            <div className="animate-fadeIn" style={{ padding: '1.5rem 1.5rem 1rem' }}>
                                <div className="card glass" style={{ padding: '1.5rem', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(108,99,255,0.05), rgba(0,0,0,0.4))', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}><Sparkles size={120} color="var(--accent)" /></div>
                                    <div style={{ position: 'relative', zIndex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                            <div style={{ padding: '0.4rem', background: 'var(--accent)', borderRadius: '8px' }}><Quote size={14} color="white" /></div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)' }}>Daily Brain Fuel</span>
                                        </div>
                                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.4, color: '#fff' }}>
                                            &quot;{GEN_Z_QUOTES[new Date().getDate() % GEN_Z_QUOTES.length]}&quot;
                                        </h3>
                                        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '90%' }}>
                                            <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>FACT:</span> {DAILY_FACTS[new Date().getDate() % DAILY_FACTS.length]}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

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

                    <aside style={{ width: '360px', flexShrink: 0, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                                <TrendingUp size={18} color="var(--accent)" />
                                <h3 style={{ fontWeight: 800, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trending Subjects</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {subjects.slice(0, 7).map(s => (
                                    <button key={s.id} onClick={() => setSelectedSubject(s.name === selectedSubject ? 'all' : s.name)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0.85rem', borderRadius: '12px', border: 'none', cursor: 'pointer', background: selectedSubject === s.name ? 'var(--accent-glow)' : 'transparent', transition: 'all 0.2s', width: '100%', borderLeft: selectedSubject === s.name ? '3px solid var(--accent)' : '3px solid transparent' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            <div style={{ color: selectedSubject === s.name ? 'var(--accent)' : 'var(--text-secondary)' }}>
                                                <SubjectIcon name={s.name} emoji={s.icon} />
                                            </div>
                                            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: selectedSubject === s.name ? 700 : 500 }}>{s.name}</span>
                                        </div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 700, background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '6px', color: 'var(--text-muted)' }}>{s._count?.questions || 0}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-card)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                                <Award size={18} color="var(--warning)" />
                                <h3 style={{ fontWeight: 800, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified Mentors</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { name: 'Dr. Rajesh Kumar', dept: 'CSE Dept', icon: '🧠' },
                                    { name: 'Prof. Sunita Mehta', dept: 'AIML Head', icon: '⚡' }
                                ].map(m => (
                                    <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                        <div className="avatar avatar-sm" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', fontSize: '1rem' }}>{m.icon}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                {m.name} <CheckCircle2 size={12} color="var(--accent)" fill="var(--accent-glow)" />
                                            </div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{m.dept}</div>
                                        </div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--success)', fontWeight: 800 }}>ONLINE</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ padding: '0 1rem', marginTop: '1rem' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                                <span>© 2026 AcadX Platform</span>
                                <span>·</span>
                                <Link href="/terms">Terms</Link>
                                <span>·</span>
                                <Link href="/privacy">Privacy</Link>
                                <span>·</span>
                                <Link href="/rules">Rules</Link>
                            </div>
                            <p style={{ marginTop: '1rem', fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                The official academic layer of School of Engineering. Built for high-integrity knowledge exchange.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>

            {showAskModal && (
                <AskModal subjects={subjects} onClose={() => setShowAskModal(false)} onSuccess={(q: Question) => { setQuestions(qs => [q, ...qs]); setShowAskModal(false); showToast('✅ Question posted successfully!') }} />
            )}

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

                    <div style={{ marginBottom: '0.6rem' }}>
                        <span className="tag" style={{ background: q.subject.color + '15', color: q.subject.color, borderRadius: '8px', padding: '0.3rem 0.75rem' }}>
                            <SubjectIcon name={q.subject.name} emoji={q.subject.icon} />
                            <span style={{ marginLeft: '4px' }}>{q.subject.name}</span>
                        </span>
                    </div>

                    <h3 style={{ fontWeight: 600, fontSize: '0.97rem', marginBottom: '0.3rem', lineHeight: '1.4' }}>{q.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.87rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>{q.description}</p>

                    {q.image && (
                        <div style={{ height: '240px', width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: '0.75rem', border: '1px solid var(--border-light)' }}>
                            <img src={q.image} alt="Question Attachment" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                        </div>
                    )}

                    {q.codeSnippet && (
                        <div className="code-block" style={{ maxHeight: '80px', overflow: 'hidden', fontSize: '0.75rem' }}>
                            {q.codeSnippet.substring(0, 150)}{q.codeSnippet.length > 150 ? '...' : ''}
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.75rem' }}>
                        <button onClick={(e) => { e.stopPropagation(); onUpvote(q.id) }} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: isUpvoted ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '0.83rem', fontWeight: 500, padding: 0, transition: 'color 0.2s' }}>
                            <svg viewBox="0 0 24 24" fill={isUpvoted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            {q._count.upvotes}
                        </button>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.83rem' }}>
                            <MessageSquare size={16} />
                            {q._count.answers} {q._count.answers === 1 ? 'Answer' : 'Answers'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.83rem' }}>
                            <Eye size={16} />
                            {q.views}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function AskModal({ subjects, onClose, onSuccess }: { subjects: Subject[]; onClose: () => void; onSuccess: (q: Question) => void }) {
    const [form, setForm] = useState({ title: '', description: '', subjectId: '', codeSnippet: '', image: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [aiLoading, setAiLoading] = useState(false)
    const [suggestion, setSuggestion] = useState<{ title?: string; description?: string } | null>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 2 * 1024 * 1024) { setError('Image must be less than 2MB'); return }

        const reader = new FileReader()
        reader.onloadend = () => {
            setForm(f => ({ ...f, image: reader.result as string }))
        }
        reader.readAsDataURL(file)
    }

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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 110, padding: '2rem 1rem', backdropFilter: 'blur(4px)', overflowY: 'auto' }}>
            <div className="card animate-fadeIn" style={{ width: '100%', maxWidth: '560px', padding: '1.5rem', marginTop: '2rem', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div>
                        <h2 style={{ fontWeight: 800, fontSize: '1.15rem' }}>✏️ Post a Doubt</h2>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Cost: 1 Credit (Weekly Limit Applies)</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '1.25rem', padding: '0.25rem', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>Subject *</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                            {subjects.map(s => (
                                <button key={s.id} type="button" onClick={() => setForm(f => ({ ...f, subjectId: s.id }))} className={`filter-pill ${form.subjectId === s.id ? 'active' : ''}`} style={{ fontSize: '0.8rem', borderRadius: '10px' }}>
                                    <SubjectIcon name={s.name} emoji={s.icon} /> {s.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>Question Title *</label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input className="input" placeholder="What is your doubt? (short and clear)" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required maxLength={200} />
                            <button type="button" onClick={async () => {
                                // call enhancement API
                                setAiLoading(true)
                                setSuggestion(null)
                                try {
                                    const res = await fetch('/api/ai/enhance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: form.title, description: form.description, codeSnippet: form.codeSnippet }) })
                                    const data = await res.json()
                                    if (data.ok) {
                                        setSuggestion(data.enhanced)
                                    } else {
                                        setError(data.error || 'Enhancement failed')
                                    }
                                } catch (e: any) {
                                    setError(e?.message || 'Network error')
                                } finally {
                                    setAiLoading(false)
                                }
                            }} className="btn btn-ghost" style={{ whiteSpace: 'nowrap' }} disabled={aiLoading} title="Auto-enhance title & description">{aiLoading ? 'Enhancing...' : '✨ Enhance'}</button>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>Description *</label>
                        <textarea className="input" placeholder="Explain your doubt in detail. What have you tried? What error are you getting?" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required rows={4} />
                        {suggestion && (
                            <div style={{ marginTop: '0.6rem', border: '1px dashed var(--border-light)', padding: '0.6rem', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <div style={{ fontWeight: 700 }}>AI Suggestion</div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button type="button" onClick={() => { setForm(f => ({ ...f, title: suggestion.title || f.title, description: suggestion.description || f.description })); setSuggestion(null); }} className="btn btn-primary">Apply</button>
                                        <button type="button" onClick={() => setSuggestion(null)} className="btn btn-ghost">Dismiss</button>
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}><strong>Title:</strong> {suggestion.title}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}><strong>Description:</strong>\n{suggestion.description}</div>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>Code Snippet (optional)</label>
                            <textarea className="input" style={{ fontFamily: 'monospace', fontSize: '0.82rem' }} placeholder="// Paste code..." value={form.codeSnippet} onChange={e => setForm(f => ({ ...f, codeSnippet: e.target.value }))} rows={4} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>Image (optional)</label>
                            <div style={{ position: 'relative', height: '100px' }}>
                                {!form.image ? (
                                    <div style={{ height: '100%', border: '2px dashed var(--border-light)', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', background: 'var(--bg-secondary)' }} onClick={() => document.getElementById('image-upload')?.click()}>
                                        <Plus size={20} />
                                        <span>Upload Image</span>
                                        <input id="image-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                                    </div>
                                ) : (
                                    <div style={{ height: '100%', position: 'relative' }}>
                                        <img src={form.image} alt="Preview" style={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                                        <button type="button" onClick={() => setForm(f => ({ ...f, image: '' }))} style={{ position: 'absolute', top: -5, right: -5, background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: '10px' }}>✕</button>
                                    </div>
                                )}
                            </div>
                        </div>
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
