'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { TokenPayload } from '@/lib/jwt'
import { formatDistanceToNow } from 'date-fns'
import {
    LayoutGrid, Terminal, Cpu, Globe, Database, Hash, Workflow, Brain, Eye,
    MessageSquare, Search, Plus, TrendingUp, Award, Zap, BookOpen, Clock,
    CheckCircle2, Sparkles, Quote, Coffee, Layers, Network, Boxes, Sun, Moon, LogOut, Menu, X,
    Atom, Calculator, Lightbulb, Leaf, Shield, Lock, Dna, FlaskConical, Construction, Cloud, Settings, Scale, FileText, Hammer, UserCheck,
    User, GraduationCap, Wand2, CircuitBoard, Sigma, Activity, Languages, Monitor, Pi, Binary, Code2
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
    'C++': <Layers size={14} />,
    'Java': <Coffee size={14} />,
    'MATLAB': <Activity size={14} />,
    'Machine Learning': <Workflow size={14} />,
    'Data Structures': <Binary size={14} />,
    'Algorithms': <Sigma size={14} />,
    'Operating Systems': <Monitor size={14} />,
    'DBMS': <Database size={14} />,
    'Computer Networks': <Globe size={14} />,
    'Deep Learning': <Workflow size={14} />,
    'Computer Vision': <Eye size={14} />,
    'NLP': <Languages size={14} />,
    // B.Tech Core
    'Engineering Physics': <Atom size={14} />,
    'Mathematics-I': <Sigma size={14} />,
    'Basic Electrical Engg': <CircuitBoard size={14} />,
    'Environmental Studies': <Globe size={14} />,
    'Discrete Mathematics': <Pi size={14} />,
    'Computer Architecture': <Cpu size={14} />,
    'Theory of Computation': <Code2 size={14} /> as any, // FileText to Code2
    'Compiler Design': <Terminal size={14} />,
    // Cybersecurity
    'Cyber Security': <Shield size={14} />,
    'Network Security': <Lock size={14} />,
    'Ethical Hacking': <Binary size={14} />,
    'Cyber Law & Ethics': <Scale size={14} />,
    // Biotech
    'Cell Biology': <FlaskConical size={14} />,
    'Genetics': <Dna size={14} />,
    'Biochemistry': <FlaskConical size={14} />,
    'Bioinformatics': <Database size={14} />,
    // CSE Advanced
    'Software Engineering': <Construction size={14} />,
    'Cloud Computing': <Cloud size={14} />,
    'IoT with ML': <CircuitBoard size={14} />
}

function SubjectIcon({ name, emoji }: { name: string, emoji: string }) {
    return SUBJECT_ICON_MAP[name] || <span>{emoji}</span>
}

// Short forms for long subject names used in tight UI (sidebar)
const SUBJECT_SHORT_MAP: Record<string, string> = {
    'Basic Electrical Engg': 'B.E.E',
    'Computer Networks': 'CN',
    'Operating Systems': 'OS',
    'Data Structures': 'DS',
    'Machine Learning': 'ML',
    'Deep Learning': 'DL',
    'Software Engineering': 'SWE',
    'Computer Architecture': 'CA',
    'Compiler Design': 'CD',
    'C Programming': 'C',
    'C++': 'C++',
    'Python': 'Py',
}

function renderSubjectLabel(name: string) {
    // prefer explicit mapping, otherwise if name is long create an acronym
    if (SUBJECT_SHORT_MAP[name]) return SUBJECT_SHORT_MAP[name]
    if (name.length > 14) {
        // create acronym from capital letters or initials
        const words = name.split(/\s|-/).filter(Boolean)
        const letters = words.map(w => w[0]).join('').toUpperCase()
        return letters.length <= 4 ? letters : letters.slice(0, 4)
    }
    return name
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
    const [theme, setTheme] = useState('light')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [showSubjectExplorer, setShowSubjectExplorer] = useState(false)
    const profileRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (typeof document !== 'undefined') {
            setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
        }
    }, [])

    const toggleTheme = () => {
        if (typeof document !== 'undefined') {
            const isDark = document.documentElement.classList.contains('dark')
            if (isDark) {
                document.documentElement.classList.remove('dark')
                setTheme('light')
            } else {
                document.documentElement.classList.add('dark')
                setTheme('dark')
            }
        }
    }

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
    }, [selectedSubject, search, selectedFilter])

    useEffect(() => { fetchSubjects() }, [fetchSubjects])
    useEffect(() => {
        const t = setTimeout(fetchQuestions, search ? 400 : 0)
        return () => clearTimeout(t)
    }, [fetchQuestions, search])

    useEffect(() => {
        setSelectedFilter(urlFilter)
    }, [urlFilter])

    // Sync selected subject with URL query param so routing to /feed?subject=Name works
    useEffect(() => {
        const urlSubject = searchParams?.get('subject') || 'all'
        if (urlSubject !== selectedSubject) setSelectedSubject(urlSubject)
    }, [searchParams])

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
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Mobile Top Header */}
            <div className="mobile-only" style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '60px', background: 'var(--nav-scrolled-bg)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.25rem', zIndex: 95 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Image src="/logo.png" alt="AcadX" width={28} height={28} />
                    <span style={{ fontWeight: 900, fontSize: '1.2rem' }}>AcadX</span>
                </div>
                <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)' }}>
                    <Menu size={24} />
                </button>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && <div className="menu-overlay mobile-only" onClick={() => setIsSidebarOpen(false)} />}

            {/* Left Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div style={{ padding: '0.75rem 1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '10px', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--logo-bg)', border: '1px solid var(--border-light)', padding: '5px' }}>
                            <Image src="/logo.png" alt="AcadX Logo" fill style={{ objectFit: 'contain' }} />
                        </div>
                        <span style={{ fontSize: '1.45rem', fontWeight: '900', letterSpacing: '-0.04em', background: 'linear-gradient(to right, var(--gradient-text-start), var(--gradient-text-end))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AcadX</span>
                    </div>
                    <button className="mobile-only" onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}><X size={20} /></button>
                </div>

                <nav style={{ flex: 1, padding: '0 0.75rem' }}>
                    <Link href="/feed" className={`nav-item ${selectedSubject === 'all' ? 'active' : ''}`} style={{ marginBottom: '0.4rem', borderRadius: '14px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: selectedSubject === 'all' ? 'var(--accent)' : 'var(--text-secondary)', background: selectedSubject === 'all' ? 'var(--accent-glow)' : 'transparent', fontWeight: 700, transition: 'all 0.2s' }}>
                        <LayoutGrid size={22} />
                        <span style={{ fontSize: '0.95rem' }}>Central Feed</span>
                    </Link>
                    {user.role !== 'professor' && (
                        <button onClick={() => setShowAskModal(true)} className="nav-item" style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', marginBottom: '0.4rem', borderRadius: '14px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '6px', background: 'var(--accent)', color: 'white' }}>
                                <Plus size={16} />
                            </div>
                            <span style={{ fontSize: '0.95rem' }}>Initiate Doubt</span>
                        </button>
                    )}
                    {user.role === 'admin' && (
                        <Link href="/admin" className="nav-item" style={{ marginBottom: '0.4rem', borderRadius: '14px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                            <Shield size={22} />
                            <span style={{ fontSize: '0.95rem' }}>Nexus Control</span>
                        </Link>
                    )}
                    <Link href="/profile" className="nav-item" style={{ marginBottom: '0.4rem', borderRadius: '14px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                        <User size={22} />
                        <span style={{ fontSize: '0.95rem' }}>Profile</span>
                    </Link>
                    <div style={{ margin: '1.5rem 0 0.5rem', padding: '0 1rem', fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>System</div>
                    <button onClick={toggleTheme} className="nav-item" style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', borderRadius: '14px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, cursor: 'pointer' }}>
                        {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
                        <span style={{ fontSize: '0.95rem' }}>{theme === 'dark' ? 'Daylight' : 'Obscurity'}</span>
                    </button>

                    {/* Mobile-only: Trending Domains & Faculty (from right sidebar) */}
                    <div className="mobile-only" style={{ marginTop: '1rem' }}>
                        <div style={{ margin: '0.5rem 0 0.5rem', padding: '0 1rem', fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Trending Domains</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    {subjects.slice(0, 6).map(s => (
                                        <button key={s.id} onClick={() => { router.push(`/feed?subject=${encodeURIComponent(s.name)}`); setIsSidebarOpen(false) }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 1rem', borderRadius: '14px', border: 'none', cursor: 'pointer', background: selectedSubject === s.name ? 'var(--accent-glow)' : 'transparent', transition: 'all 0.2s', width: '100%' }} className="nav-item">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                                        <div style={{ width: 28, height: 28, borderRadius: '8px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)', color: selectedSubject === s.name ? 'var(--accent)' : 'var(--text-secondary)' }}>
                                            <SubjectIcon name={s.name} emoji={s.icon} />
                                        </div>
                                        <span title={s.name} style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 700 }}>{renderSubjectLabel(s.name)}</span>
                                    </div>
                                    <div style={{ fontSize: '0.6rem', fontWeight: 900, background: 'var(--bg-secondary)', padding: '3px 8px', borderRadius: '6px', color: 'var(--text-muted)', border: '1px solid var(--border-light)' }}>{s._count?.questions || 0}</div>
                                </button>
                            ))}
                            <button
                                onClick={() => { setShowSubjectExplorer(true); setIsSidebarOpen(false) }}
                                className="nav-item"
                                style={{ marginTop: '0.25rem', padding: '0.7rem 1rem', borderRadius: '14px', border: 'none', background: 'transparent', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', transition: 'all 0.2s', width: '100%' }}
                            >
                                <Layers size={16} /> Show All
                            </button>
                        </div>

                        <div style={{ margin: '1rem 0 0.5rem', padding: '0 1rem', fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Verified Faculty</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {[
                                { name: 'Dr. Rajesh Kumar', dept: 'CSE Dept', status: 'ACTIVE' },
                                { name: 'Prof. Sunita Mehta', dept: 'AIML Lead', status: 'ONLINE' }
                            ].map(m => (
                                <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', borderRadius: '14px' }} className="nav-item">
                                    <div style={{ width: 32, height: 32, borderRadius: '10px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)', color: 'var(--accent)' }}>
                                        <GraduationCap size={18} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {m.name} <UserCheck size={12} color="var(--accent)" />
                                        </div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>{m.dept}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 6px var(--success)' }} />
                                        <span style={{ fontSize: '0.55rem', color: 'var(--success)', fontWeight: 900 }}>{m.status}</span>
                                    </div>
                                </div>
                            ))}

                            <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                                <Link href="/faculty" style={{ padding: '0.45rem 0.75rem', borderRadius: 12, border: '1px solid var(--border-light)', background: 'transparent', color: 'var(--accent)', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none' }}>View all faculty</Link>
                            </div>
                        </div>

                        <div style={{ padding: '1rem 1rem 0', marginTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.68rem' }}>
                                <span>© 2026 AcadX</span>
                                <span>·</span>
                                <Link href="/terms" onClick={() => setIsSidebarOpen(false)}>Terms</Link>
                                <span>·</span>
                                <Link href="/privacy" onClick={() => setIsSidebarOpen(false)}>Privacy</Link>
                                <span>·</span>
                                <Link href="/rules" onClick={() => setIsSidebarOpen(false)}>Rules</Link>
                            </div>
                        </div>
                    </div>
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
                                    <button onClick={() => { setShowProfileMenu(false); router.push('/feed?filter=unanswered') }} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', width: '100%', textAlign: 'left', padding: '0.75rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 700, borderRadius: 10, transition: 'all 0.2s' }} className="nav-item">
                                        <div style={{ display: 'flex', width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: 'var(--accent)', color: 'white' }}>
                                            <MessageSquare size={16} />
                                        </div>
                                        <span style={{ fontSize: '0.85rem' }}>Resolution Tasks</span>
                                    </button>
                                )}
                                {user.role !== 'professor' && (
                                    <button onClick={() => { setShowAskModal(true); setShowProfileMenu(false) }} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', width: '100%', textAlign: 'left', padding: '0.75rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 700, borderRadius: 10, transition: 'all 0.2s' }} className="nav-item">
                                        <div style={{ display: 'flex', width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                                            <Plus size={16} />
                                        </div>
                                        <span style={{ fontSize: '0.85rem' }}>Initialize Doubt</span>
                                    </button>
                                )}
                                <div style={{ height: '1px', background: 'var(--border-light)', margin: '0.5rem 0' }} />
                                <button onClick={() => { setShowProfileMenu(false); router.push('/profile') }} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', width: '100%', textAlign: 'left', padding: '0.75rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 700, borderRadius: 10, transition: 'all 0.2s' }} className="nav-item">
                                    <div style={{ display: 'flex', width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                                        <User size={16} />
                                    </div>
                                    <span style={{ fontSize: '0.85rem' }}>View Profile</span>
                                </button>
                                <div style={{ height: '1px', background: 'var(--border-light)', margin: '0.5rem 0' }} />
                                <button onClick={() => { setShowProfileMenu(false); logout() }} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', width: '100%', textAlign: 'left', padding: '0.75rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontWeight: 700, borderRadius: 10, transition: 'all 0.2s' }} className="nav-item">
                                    <div style={{ display: 'flex', width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                                        <LogOut size={16} />
                                    </div>
                                    <span style={{ fontSize: '0.85rem' }}>Terminate Session</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', overflow: 'hidden' }} className="main-content">
                <div style={{ display: 'flex', width: '100%', maxWidth: '1100px', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', width: '100%' }} className="feed-layout">
                        <main style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ position: 'sticky', top: 0, background: 'rgba(var(--bg-primary-rgb), 0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-light)', padding: '1.5rem 2rem', zIndex: 10 }} className="feed-header">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }} />
                                            <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Live Institutional Stream</span>
                                        </div>
                                        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>Resolution Hub</h1>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active Grid</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)' }}>{questions.length} <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>UNIT(S)</span></div>
                                        </div>
                                        <div style={{ width: '1px', background: 'var(--border-light)', height: '100%' }} />
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Capacity</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)' }}>10 <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>CRC</span></div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                                    <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', opacity: 0.5 }} />
                                    <input className="input" placeholder="Search academic archives..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '1.2rem 1.2rem 1.2rem 3.25rem', borderRadius: '18px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', fontSize: '0.95rem', fontWeight: 500, width: '100%', transition: 'all 0.2s' }} />
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }} className="no-scrollbar">
                                    <button className={`filter-pill ${selectedSubject === 'all' ? 'active' : ''}`} onClick={() => setSelectedSubject('all')} style={{ borderRadius: '12px', padding: '0.6rem 1.2rem', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem', transition: 'all 0.2s' }}>
                                        <LayoutGrid size={16} /> All Protocol
                                    </button>
                                    {subjects.map(s => (
                                        <button key={s.id} className={`filter-pill ${selectedSubject === s.name ? 'active' : ''}`} onClick={() => setSelectedSubject(s.name === selectedSubject ? 'all' : s.name)} style={{ borderRadius: '12px', padding: '0.6rem 1.2rem', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                                            <SubjectIcon name={s.name} emoji={s.icon} /> {s.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {!search && selectedSubject === 'all' && (
                                <div className="animate-fadeIn" style={{ padding: '1.5rem 1rem 1rem' }}>
                                    <div className="card glass" style={{ padding: '1.5rem', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(108,99,255,0.05), rgba(0,0,0,0.4))', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}><Sparkles size={120} color="var(--accent)" /></div>
                                        <div style={{ position: 'relative', zIndex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                                <div style={{ padding: '0.4rem', background: 'var(--accent)', borderRadius: '8px', boxShadow: '0 4px 12px var(--accent-glow)' }}><Quote size={14} color="white" /></div>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)' }}>Daily Brain Fuel</span>
                                            </div>
                                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.4, color: 'var(--text-primary)' }}>
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

                        <aside className="desktop-only" style={{ width: '380px', flexShrink: 0, padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="card glass-border" style={{ padding: '2rem', borderRadius: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-light)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
                                    <TrendingUp size={20} color="var(--accent)" />
                                    <h3 style={{ fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-primary)' }}>Trending Domains</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {subjects.slice(0, 6).map(s => (
                                        <button key={s.id} onClick={() => { router.push(`/feed?subject=${encodeURIComponent(s.name)}`) }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '16px', border: '1px solid transparent', cursor: 'pointer', background: selectedSubject === s.name ? 'var(--accent-glow)' : 'var(--bg-secondary)', transition: 'all 0.2s', width: '100%' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                <div style={{ width: 32, height: 32, borderRadius: '10px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)', color: selectedSubject === s.name ? 'var(--accent)' : 'var(--text-secondary)' }}>
                                                    <SubjectIcon name={s.name} emoji={s.icon} />
                                                </div>
                                                <span title={s.name} style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 700 }}>{renderSubjectLabel(s.name)}</span>
                                            </div>
                                            <div style={{ fontSize: '0.65rem', fontWeight: 900, background: 'var(--bg-primary)', padding: '4px 10px', borderRadius: '8px', color: 'var(--text-muted)', border: '1px solid var(--border-light)' }}>{s._count?.questions || 0}</div>
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setShowSubjectExplorer(true)}
                                        style={{ marginTop: '0.5rem', padding: '1rem', borderRadius: '16px', border: '1px dashed var(--border)', background: 'transparent', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', transition: 'all 0.2s' }}
                                    >
                                        <Layers size={16} /> Show All Infrastructure
                                    </button>
                                </div>
                            </div>

                            <div className="card" style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(0,0,0,0.2))', border: '1px solid var(--border-light)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
                                    <Shield size={20} color="var(--accent)" />
                                    <h3 style={{ fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-primary)' }}>Verified Faculty</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                            {[
                                                { name: 'Dr. Rajesh Kumar', dept: 'CSE Dept', status: 'ACTIVE' },
                                                { name: 'Prof. Sunita Mehta', dept: 'AIML Lead', status: 'ONLINE' }
                                            ].map(m => (
                                                <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', borderRadius: '12px', transition: 'all 0.2s' }}>
                                                    <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)', color: 'var(--accent)' }}>
                                                        <GraduationCap size={22} />
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {m.name} <UserCheck size={14} color="var(--accent)" />
                                                        </div>
                                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{m.dept}</div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }} />
                                                        <span style={{ fontSize: '0.6rem', color: 'var(--success)', fontWeight: 900 }}>{m.status}</span>
                                                    </div>
                                                </div>
                                            ))}

                                            <div style={{ marginTop: '0.25rem', display: 'flex', justifyContent: 'center' }}>
                                                <Link href="/faculty" onClick={() => { /* sidebar will close on navigation via mobile header handler */ }} style={{ padding: '0.5rem 0.75rem', borderRadius: 12, border: '1px solid var(--border-light)', background: 'transparent', color: 'var(--accent)', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none' }}>View all faculty</Link>
                                            </div>
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

                {showSubjectExplorer && (
                    <SubjectExplorerModal subjects={subjects} onClose={() => setShowSubjectExplorer(false)} onSelect={(name) => { setSelectedSubject(name); setShowSubjectExplorer(false); }} />
                )}

                {toast && (
                    <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
                )}
            </div>
        </div>
    )
}

function QuestionCard({ question: q, currentUserId, userRole, onUpvote, onQuestionClick }: { question: Question; currentUserId: string; userRole: string; onUpvote: (id: string) => void; onQuestionClick: () => void }) {
    const isUpvoted = q.upvotes.some((u: { userId: string }) => u.userId === currentUserId)
    const timeAgo = formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="feed-item glass-hover"
            onClick={onQuestionClick}
            style={{
                padding: '1.75rem',
                borderBottom: '1px solid var(--border-light)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{ display: 'flex', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="avatar" style={{ cursor: 'default', width: 44, height: 44, borderRadius: '14px', fontSize: '1.1rem', fontWeight: 800, background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>{q.student.name.charAt(0)}</div>
                    <div style={{ height: '100%', width: '1px', background: 'linear-gradient(to bottom, var(--border-light), transparent)', margin: '4px 0' }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{q.student.name}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>[ {timeAgo} ]</span>
                        </div>
                        <span style={{ fontSize: '0.6rem', fontWeight: 900, color: q.solved ? 'var(--success)' : 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', background: q.solved ? 'rgba(5,150,105,0.1)' : 'var(--accent-glow)', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                            {q.solved ? 'RESOLVED' : 'PENDING SYNC'}
                        </span>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <span style={{ background: q.subject.color + '10', color: q.subject.color, borderRadius: '8px', padding: '0.4rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: `1px solid ${q.subject.color}20` }}>
                            <SubjectIcon name={q.subject.name} emoji={q.subject.icon} />
                            {q.subject.name}
                        </span>
                    </div>

                    <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: '1.3', letterSpacing: '-0.01em' }}>{q.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.25rem', opacity: 0.8, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>{q.description}</p>

                    {q.image && (
                        <div style={{ height: '280px', width: '100%', borderRadius: '20px', overflow: 'hidden', marginBottom: '1.25rem', border: '1px solid var(--border-light)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                            <img src={q.image} alt="Question Attachment" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                        <button onClick={(e) => { e.stopPropagation(); onUpvote(q.id) }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: isUpvoted ? 'var(--accent-glow)' : 'transparent', border: 'none', cursor: 'pointer', color: isUpvoted ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, padding: '0.4rem 0.8rem', borderRadius: '10px', transition: 'all 0.2s' }}>
                            <svg viewBox="0 0 24 24" fill={isUpvoted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" style={{ width: 18, height: 18 }}>
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            {q._count.upvotes}
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                            <MessageSquare size={18} />
                            {q._count.answers} <span style={{ opacity: 0.6 }}>LOGS</span>
                        </div>
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                            <Eye size={16} />
                            {q.views} <span style={{ opacity: 0.6 }}>UNITS</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

function AskModal({ subjects, onClose, onSuccess }: { subjects: Subject[]; onClose: () => void; onSuccess: (q: Question) => void }) {
    const [form, setForm] = useState({ title: '', description: '', subjectId: '', codeSnippet: '', image: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [aiLoading, setAiLoading] = useState(false)
    const [suggestion, setSuggestion] = useState<{ title?: string; description?: string } | null>(null)
    const [activeTab, setActiveTab] = useState('Core')

    const categories = {
        'Core': ['Python', 'C Programming', 'C++', 'Java', 'Data Structures', 'Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks', 'Software Engineering', 'Computer Architecture', 'Theory of Computation', 'Compiler Design'],
        'AI & ML': ['Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP', 'IoT with ML', 'MATLAB'],
        'Security': ['Cyber Security', 'Network Security', 'Ethical Hacking', 'Cyber Law & Ethics'],
        'Biotech': ['Cell Biology', 'Genetics', 'Biochemistry', 'Bioinformatics'],
        'Foundation': ['Engineering Physics', 'Mathematics-I', 'Basic Electrical Engg', 'Environmental Studies', 'Discrete Mathematics']
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 2 * 1024 * 1024) { setError('Image must be less than 2MB'); return }
        const reader = new FileReader()
        reader.onloadend = () => setForm(f => ({ ...f, image: reader.result as string }))
        reader.readAsDataURL(file)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.subjectId) { setError('Target subject protocol not selected'); return }
        setLoading(true); setError('')
        try {
            const res = await fetch('/api/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            onSuccess(data.question)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110, padding: '1rem', backdropFilter: 'blur(10px)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="card glass"
                style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', padding: '0', borderRadius: '32px', border: '1px solid var(--border)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', position: 'relative' }}
            >
                {/* Modal Header */}
                <div style={{ padding: '2rem 2.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', marginBottom: '0.4rem' }}>
                            <Plus size={18} />
                            <span style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Initialize Doubt Protocol</span>
                        </div>
                        <h2 style={{ fontWeight: 900, fontSize: '1.75rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Post new Resolution</h2>
                    </div>
                    <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', cursor: 'pointer', color: 'var(--text-primary)', width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>✕</button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '2.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Subject Selection */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Target Infrastructure</label>
                                <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '3px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                                    {Object.keys(categories).map(cat => (
                                        <button key={cat} type="button" onClick={() => setActiveTab(cat)} style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', border: 'none', background: activeTab === cat ? 'var(--accent)' : 'transparent', color: activeTab === cat ? 'white' : 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>{cat}</button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', maxHeight: '160px', overflowY: 'auto', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid var(--border-light)' }} className="custom-scrollbar">
                                {subjects.filter(s => (categories as any)[activeTab]?.includes(s.name)).map(s => (
                                    <button key={s.id} type="button" onClick={() => setForm(f => ({ ...f, subjectId: s.id }))} style={{ padding: '0.6rem 1rem', borderRadius: '12px', background: form.subjectId === s.id ? 'var(--accent-glow)' : 'var(--bg-card)', border: form.subjectId === s.id ? '1px solid var(--accent)' : '1px solid var(--border-light)', color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}>
                                        <SubjectIcon name={s.name} emoji={s.icon} /> {s.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Question Title */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Query Identifier</label>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <input style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', padding: '1.1rem', borderRadius: '16px', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 500, outline: 'none' }} placeholder="High-level summary of your doubt..." value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                                <button type="button" onClick={async () => {
                                    setAiLoading(true); setSuggestion(null)
                                    try {
                                        const res = await fetch('/api/ai/enhance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
                                        const data = await res.json()
                                        if (data.ok) setSuggestion(data.enhanced)
                                    } catch (e) { } finally { setAiLoading(false) }
                                }} style={{ background: 'linear-gradient(135deg, var(--accent), #6366f1)', border: 'none', color: 'white', padding: '0 1.5rem', borderRadius: '16px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap', opacity: aiLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                    <Sparkles size={16} /> {aiLoading ? 'SYNCING...' : 'Enhance with AI'}
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Full Technical Context</label>
                            <textarea style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', padding: '1.2rem', borderRadius: '16px', color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 400, outline: 'none', resize: 'vertical', minHeight: '120px', lineHeight: 1.6 }} placeholder="Describe your technical blocker, expected output, and currently observed behavior..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
                            {suggestion && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} style={{ marginTop: '1rem', border: '1px solid var(--accent-glow)', padding: '1.25rem', borderRadius: '16px', background: 'rgba(99,102,241,0.05)', position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '0.1em' }}>NEURAL SUGGESTION</span>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button type="button" onClick={() => { setForm(f => ({ ...f, title: suggestion.title || f.title, description: suggestion.description || f.description })); setSuggestion(null); }} style={{ padding: '0.4rem 1rem', background: 'var(--accent)', border: 'none', color: 'white', borderRadius: '8px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>Apply Changes</button>
                                            <button type="button" onClick={() => setSuggestion(null)} style={{ padding: '0.4rem 1rem', background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-secondary)', borderRadius: '8px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>Dismiss</button>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 700 }}>{suggestion.title}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{suggestion.description}</div>
                                </motion.div>
                            )}
                        </div>

                        {/* Code & Assets */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Code Snippet</label>
                                <textarea style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', padding: '1rem', borderRadius: '16px', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 400, outline: 'none', fontFamily: 'monospace', minHeight: '120px' }} placeholder="// Initialize code here..." value={form.codeSnippet} onChange={e => setForm(f => ({ ...f, codeSnippet: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Visual Attachment</label>
                                {!form.image ? (
                                    <div onClick={() => document.getElementById('img-up')?.click()} style={{ height: '120px', border: '2px dashed var(--border-light)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer', background: 'var(--bg-secondary)', transition: 'all 0.2s' }}>
                                        <Plus size={24} />
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, marginTop: '0.4rem' }}>UPLOAD ASSET</span>
                                        <input id="img-up" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                                    </div>
                                ) : (
                                    <div style={{ height: '120px', borderRadius: '16px', overflow: 'hidden', position: 'relative', border: '1px solid var(--border-light)' }}>
                                        <img src={form.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button type="button" onClick={() => setForm(f => ({ ...f, image: '' }))} style={{ position: 'absolute', top: 5, right: 5, background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer' }}>✕</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#ff4b4b', fontSize: '0.85rem', fontWeight: 600, padding: '1rem', background: 'rgba(255,75,75,0.1)', borderRadius: '12px', border: '1px solid rgba(255,75,75,0.2)' }}>[ERROR] {error}</motion.div>}

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
                            <button type="button" onClick={onClose} style={{ padding: '0.9rem 2rem', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 700, cursor: 'pointer' }}>Discard</button>
                            <button type="submit" disabled={loading} style={{ padding: '0.9rem 2.5rem', borderRadius: '14px', border: 'none', background: 'var(--accent)', color: 'white', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', boxShadow: '0 10px 20px var(--accent-glow)', opacity: loading ? 0.7 : 1 }}>
                                {loading ? 'DEPLOYING...' : 'INITIATE REQUEST'}
                            </button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}
function SubjectExplorerModal({ subjects, onClose, onSelect }: { subjects: Subject[]; onClose: () => void; onSelect: (name: string) => void }) {
    const categories = {
        'Core CSE': ['Python', 'C Programming', 'C++', 'Java', 'Data Structures', 'Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks', 'Software Engineering', 'Computer Architecture', 'Theory of Computation', 'Compiler Design'],
        'AI & ML': ['Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP', 'IoT with ML', 'MATLAB'],
        'Security': ['Cyber Security', 'Network Security', 'Ethical Hacking', 'Cyber Law & Ethics'],
        'Biotech faculty': ['Cell Biology', 'Genetics', 'Biochemistry', 'Bioinformatics'],
        'Foundation': ['Engineering Physics', 'Mathematics-I', 'Basic Electrical Engg', 'Environmental Studies', 'Discrete Mathematics']
    }

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem', backdropFilter: 'blur(10px)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="card glass"
                style={{ width: '100%', maxWidth: '900px', maxHeight: '85vh', borderRadius: '32px', border: '1px solid var(--border)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
                {/* Header - Fixed */}
                <div style={{ padding: '2rem 3rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', flexShrink: 0 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent)', marginBottom: '0.4rem' }}>
                            <Layers size={20} />
                            <span style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase' }}>Domain Architecture</span>
                        </div>
                        <h2 style={{ fontWeight: 900, fontSize: '2.2rem', color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>Academic Grid Explorer</h2>
                    </div>
                    <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', cursor: 'pointer', color: 'var(--text-primary)', width: 44, height: 44, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', fontSize: '1.2rem' }}>✕</button>
                </div>

                {/* Content - Scrollable */}
                <div style={{ padding: '3rem 3rem 5rem 3rem', flex: 1, overflowY: 'auto', position: 'relative' }} className="custom-scrollbar">
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(to top, var(--bg-card), transparent)', pointerEvents: 'none', zIndex: 5, opacity: 0.8 }} />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
                        {Object.entries(categories).map(([cat, list]) => (
                            <div key={cat}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>
                                    <div style={{ width: 4, height: 20, background: 'var(--accent)', borderRadius: '2px' }} />
                                    <h3 style={{ fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-primary)' }}>{cat}</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    {subjects.filter(s => list.includes(s.name)).map(s => (
                                        <motion.button
                                            key={s.id}
                                            whileHover={{ x: 6, background: 'var(--accent-glow)' }}
                                            onClick={() => onSelect(s.name)}
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: '18px', border: '1px solid var(--border-light)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s' }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)', color: 'var(--accent)', fontSize: '1.1rem' }}>
                                                    <SubjectIcon name={s.name} emoji={s.icon} />
                                                </div>
                                                <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>{s.name}</span>
                                            </div>
                                            <div style={{ opacity: 0.3 }}><Shield size={14} /></div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer - Fixed & Opaque */}
                <div style={{ padding: '2.5rem 3rem', borderTop: '1px solid var(--border)', background: 'var(--bg-card)', textAlign: 'center', flexShrink: 0, zIndex: 10, boxShadow: '0 -10px 30px rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', color: 'var(--text-primary)', opacity: 0.9, marginBottom: '0.75rem' }}>
                        <div style={{ width: 60, height: 1, background: 'linear-gradient(to left, var(--accent), transparent)' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <Shield size={16} color="var(--accent)" />
                            <p style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                                Institutional Node Infrastructure
                            </p>
                        </div>
                        <div style={{ width: 60, height: 1, background: 'linear-gradient(to right, var(--accent), transparent)' }} />
                    </div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 600, maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
                        Authorized academic synchronization protocol. All subject modules are verified by the Faculty of Engineering and Technology.
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
