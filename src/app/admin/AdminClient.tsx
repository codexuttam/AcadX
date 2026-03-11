'use client'

import { useState, useEffect, useCallback, cloneElement, createElement } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Sun, Moon, LayoutGrid, Users, BookOpen, LogOut, ShieldCheck, ChevronRight, Menu, X,
    MessageSquareOff, HelpCircle, CheckCircle2, GraduationCap, Mail, UserCheck, Trash2,
    Plus, Info, Book, Code2, Database, Cpu, Globe, Binary, Sigma, Terminal,
    FileJson, BarChart3, Atom, Microscope, Lightbulb, Box, Layers, Landmark, School,
    FileCode, Pi,
    CircuitBoard, ShieldAlert, Languages, Construction, Monitor, Activity, Workflow,
    Coffee, Dna
} from 'lucide-react'
import Image from 'next/image'
import { TokenPayload } from '@/lib/jwt'

interface DbUser { id: string; name: string; email: string; role: string; department: string; verified: boolean; createdAt: string }
interface Subject { id: string; name: string; color: string; icon: string; _count?: { questions: number } }
interface Question { id: string; title: string; description: string; createdAt: string; student: { name: string; email: string }; subject: Subject }
interface Stats { questions: number; answers: number; subjects: number; users: number }

const DEPARTMENTS = ['CSE', 'AIML', 'IT', 'ECE', 'ME', 'CE', 'School of Engineering']
const ICON_MAP: Record<string, any> = {
    'Book': Book, 'Code2': Code2, 'Database': Database, 'Cpu': Cpu, 'Globe': Globe,
    'Binary': Binary, 'Sigma': Sigma, 'Terminal': Terminal, 'FileJson': FileJson,
    'BarChart3': BarChart3, 'Atom': Atom, 'Microscope': Microscope, 'Lightbulb': Lightbulb,
    'Box': Box, 'Layers': Layers, 'Landmark': Landmark, 'GraduationCap': GraduationCap,
    'School': School, 'FileCode': FileCode, 'Pi': Pi, 'CircuitBoard': CircuitBoard,
    'ShieldAlert': ShieldAlert, 'Languages': Languages, 'Construction': Construction,
    'Monitor': Monitor, 'Activity': Activity, 'Workflow': Workflow,
    'Coffee': Coffee, 'Dna': Dna
}
const SUBJECT_ICONS = Object.keys(ICON_MAP)
const SUBJECT_COLORS = ['#6366f1', '#3b82f6', '#ef4444', '#f97316', '#eab308', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#14b8a6', '#d946ef', '#0ea5e9', '#22c55e']

const SubjectIcon = ({ icon, size = 18, style }: { icon: string, size?: number, style?: React.CSSProperties }) => {
    // If it's an emoji (fallback for old data), show it
    if (icon && icon.length <= 4 && /\p{Emoji}/u.test(icon)) return <span style={{ ...style, fontSize: size }}>{icon}</span>
    const IconComp = ICON_MAP[icon] || Book
    return <IconComp size={size} style={style} />
}

export default function AdminClient({ adminUser }: { adminUser: TokenPayload }) {
    const router = useRouter()
    const [tab, setTab] = useState<'overview' | 'users' | 'subjects' | 'unanswered' | 'register'>('overview')
    const [users, setUsers] = useState<DbUser[]>([])
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [unanswered, setUnanswered] = useState<Question[]>([])
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState<{ msg: string; type: string } | null>(null)
    const [newSubject, setNewSubject] = useState({ name: '', color: SUBJECT_COLORS[0], icon: SUBJECT_ICONS[0] })
    const [subjectLoading, setSubjectLoading] = useState(false)
    const [lastAdded, setLastAdded] = useState<string | null>(null)
    const [theme, setTheme] = useState('light')
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [confirmModal, setConfirmModal] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null)
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

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

    const showToast = (msg: string, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }

    const fetchData = useCallback(async () => {
        setLoading(true)
        const [adminRes, subjRes] = await Promise.all([
            fetch('/api/admin'),
            fetch('/api/subjects'),
        ])
        if (adminRes.ok) {
            const data = await adminRes.json()
            setUsers(data.users)
            setStats(data.stats)
            setUnanswered(data.unanswered || [])
        }
        if (subjRes.ok) {
            const data = await subjRes.json()
            setSubjects(data.subjects)
        }
        setLoading(false)
    }, [])

    useEffect(() => { fetchData() }, [fetchData])

    const updateUser = async (userId: string, role: string, verified: boolean) => {
        const res = await fetch('/api/admin', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, role, verified }),
        })
        if (res.ok) {
            setUsers(us => us.map(u => u.id === userId ? { ...u, role, verified } : u))
            showToast('✅ User updated successfully')
        } else {
            showToast('Failed to update user', 'error')
        }
    }

    const deleteUser = async (userId: string) => {
        setConfirmModal({
            title: 'Delete User Protocol',
            message: 'Are you certain you wish to terminate this account? This action is permanent and destroys all associated records.',
            onConfirm: async () => {
                const res = await fetch('/api/admin', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                })
                if (res.ok) {
                    setUsers(us => us.filter(u => u.id !== userId))
                    showToast('User deleted')
                }
                setConfirmModal(null)
            }
        })
    }

    const addSubject = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newSubject.name.trim()) return
        setSubjectLoading(true)
        const res = await fetch('/api/subjects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSubject),
        })
        const data = await res.json()
        setSubjectLoading(false)
        if (res.ok) {
            setSubjects(ss => [...ss, data.subject])
            setLastAdded(data.subject.id)
            setNewSubject({ name: '', color: SUBJECT_COLORS[0], icon: SUBJECT_ICONS[0] })
            showToast('🏛️ Subject Registered Successfully')
            setTimeout(() => setLastAdded(null), 4000)
        } else {
            showToast(data.error || 'Registration Failed', 'error')
        }
    }

    const deleteSubject = async (id: string) => {
        setConfirmModal({
            title: 'Curriculum Removal',
            message: 'Deleting this subject will orphan all associated student inquiries. Proceed with destruction?',
            onConfirm: async () => {
                const res = await fetch('/api/subjects', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id }),
                })
                if (res.ok) {
                    setSubjects(ss => ss.filter(s => s.id !== id))
                    showToast('Subject removed', 'success')
                }
                setConfirmModal(null)
            }
        })
    }

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')
    }

    const roleColor = (role: string) => ({ admin: '#d946ef', professor: '#6366f1', student: '#06b6d4' }[role] || '#71767b')

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Sidebar Navigation */}
            <aside className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
                <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '10px', overflow: 'hidden', position: 'relative', background: 'var(--logo-bg)', border: '1px solid var(--border-light)', padding: '4px' }}>
                        <Image src="/logo.png" alt="AcadX Logo" fill style={{ objectFit: 'contain' }} />
                    </div>
                    <span style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.04em', background: 'linear-gradient(to right, var(--accent), var(--text-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AcadX</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                    <div style={{ padding: '0 1.25rem 0.5rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Management</div>
                    {[
                        { key: 'overview', label: 'Dashboard Overview', icon: <LayoutGrid size={20} /> },
                        { key: 'unanswered', label: 'Student Inquiries', icon: <MessageSquareOff size={20} />, count: unanswered.length },
                        { key: 'users', label: 'User Directory', icon: <Users size={20} /> },
                        { key: 'subjects', label: 'Academic Subjects', icon: <BookOpen size={20} /> },
                    ].map(item => (
                        <button
                            key={item.key}
                            onClick={() => { setTab(item.key as any); setIsMenuOpen(false); }}
                            className={`nav-item ${tab === item.key ? 'active' : ''}`}
                            style={{
                                background: tab === item.key ? 'var(--accent-glow)' : 'transparent',
                                color: tab === item.key ? 'var(--accent)' : 'var(--text-secondary)',
                                border: 'none',
                                textAlign: 'left',
                                width: 'auto'
                            }}
                        >
                            {item.icon}
                            <span style={{ flex: 1 }}>{item.label}</span>
                            {item.count !== undefined && item.count > 0 && (
                                <span style={{ background: 'var(--danger)', color: '#fff', borderRadius: '10px', fontSize: '0.65rem', padding: '0.1rem 0.5rem', fontWeight: 800 }}>{item.count}</span>
                            )}
                        </button>
                    ))}
                </div>

                <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button onClick={toggleTheme} className="nav-item" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '0.5rem' }}>
                        {theme === 'dark' ? <><Sun size={18} /> Light Mode</> : <><Moon size={18} /> Dark Mode</>}
                    </button>
                    <Link href="/feed" className="nav-item" style={{ background: 'transparent', color: 'var(--text-secondary)', padding: '0.5rem' }}>
                        <Globe size={18} /> Academic Feed
                    </Link>
                    <button onClick={logout} className="nav-item" style={{ background: 'transparent', border: 'none', color: 'var(--danger)', padding: '0.5rem' }}>
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Nav Header */}
            <nav className="mobile-only" style={{ background: 'var(--nav-scrolled-bg)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-light)', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 90 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button onClick={() => setIsMenuOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}>
                        <Menu size={24} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Image src="/logo.png" alt="AcadX" width={24} height={24} />
                        <span style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>AcadX</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{tab}</span>
                    <div className="live-indicator" style={{ width: 6, height: 6 }} />
                </div>
            </nav>

            {/* Overlay for mobile sidebar */}
            {isMenuOpen && (
                <div
                    className="mobile-only"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 95 }}
                />
            )}

            {/* Main Content Area */}
            <main style={{ marginLeft: 'var(--sidebar-width, 260px)', transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} className="admin-main">
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 2.5rem' }} className="admin-container">
                    {/* Page Header */}
                    <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
                                {tab === 'overview' && 'Dean\'s Dashboard'}
                                {tab === 'unanswered' && 'Pending Inquiries'}
                                {tab === 'users' && 'User Governance'}
                                {tab === 'subjects' && 'Academic Curriculum'}
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>
                                School of Engineering · Dr. Sugandha Singh (Dean)
                            </p>
                        </div>
                        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                            <div className="live-indicator" /> System Operational
                        </div>
                    </div>


                    {/* Overview Tab */}
                    {tab === 'overview' && (
                        <div className="animate-fadeIn">
                            {/* Stats in Overview */}
                            {stats && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                                    {[
                                        { label: 'Registered Scholars', value: stats.users, icon: <Users size={24} />, color: '#6366f1' },
                                        { label: 'Inquiries Logged', value: stats.questions, icon: <HelpCircle size={24} />, color: '#f97316' },
                                        { label: 'Verified Resolutions', value: stats.answers, icon: <CheckCircle2 size={24} />, color: '#10b981' },
                                        { label: 'Active Disciplines', value: stats.subjects, icon: <BookOpen size={24} />, color: '#8b5cf6' },
                                    ].map(s => (
                                        <div key={s.label} className="stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '1.75rem', position: 'relative', overflow: 'hidden', borderRadius: '20px' }}>
                                            <div style={{ color: s.color, marginBottom: '1rem', padding: '0.6rem', background: s.color + '15', border: `1px solid ${s.color}20`, borderRadius: '14px', display: 'flex' }}>{s.icon}</div>
                                            <div className="stat-number" style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.25rem' }}>{s.value}</div>
                                            <div className="stat-label" style={{ fontSize: '0.85rem', fontWeight: 650, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                                            <div style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.08, transform: 'rotate(-15deg)', color: s.color }}>
                                                {cloneElement(s.icon as any, { size: 100 })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }} className="responsive-grid">
                                {/* Recent users */}
                                <div className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                        <Users size={18} style={{ color: 'var(--accent)' }} />
                                        <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Recent User Activity</h3>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {users.slice(0, 6).map(u => (
                                            <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                                                <div className="avatar avatar-sm">{u.name.charAt(0)}</div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                                                </div>
                                                <span className="tag" style={{ background: roleColor(u.role) + '20', color: roleColor(u.role), fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700 }}>{u.role}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Subjects */}
                                <div className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                        <BookOpen size={18} style={{ color: 'var(--accent)' }} />
                                        <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Active Department Subjects</h3>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                        {subjects.map(s => (
                                            <span key={s.id} className="tag" style={{ background: s.color + '15', color: s.color, padding: '0.5rem 0.75rem', border: `1px solid ${s.color}30`, borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <SubjectIcon icon={s.icon} size={14} /> {s.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users Tab */}
                    {tab === 'users' && (
                        <div className="animate-fadeIn">
                            <div className="card" style={{ overflow: 'hidden', borderRadius: '16px' }}>
                                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <Users size={18} style={{ color: 'var(--accent)' }} />
                                        <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>User Directory <span style={{ color: 'var(--text-secondary)', fontWeight: 500, marginLeft: '0.5rem' }}>({users.length} total)</span></h3>
                                    </div>
                                </div>
                                {loading ? (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>
                                ) : (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ background: 'var(--bg-secondary)' }}>
                                                    {['User', 'Email', 'Dept', 'Role', 'Verified', 'Actions'].map(h => (
                                                        <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--border-light)' }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map(u => (
                                                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.15s' }} className="feed-item">
                                                        <td style={{ padding: '0.75rem 1rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                                <div className="avatar avatar-sm">{u.name.charAt(0)}</div>
                                                                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{u.name}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                                                        <td style={{ padding: '0.75rem 1rem' }}>
                                                            <span className="tag" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '0.72rem' }}>{u.department}</span>
                                                        </td>
                                                        <td style={{ padding: '0.75rem 1rem' }}>
                                                            <select defaultValue={u.role} onChange={e => updateUser(u.id, e.target.value, u.verified)} style={{ background: roleColor(u.role) + '20', color: roleColor(u.role), border: '1px solid ' + roleColor(u.role) + '40', borderRadius: '6px', padding: '0.25rem 0.5rem', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}>
                                                                <option value="student">student</option>
                                                                <option value="professor">professor</option>
                                                                <option value="admin">admin</option>
                                                            </select>
                                                        </td>
                                                        <td style={{ padding: '0.75rem 1rem' }}>
                                                            <button onClick={() => updateUser(u.id, u.role, !u.verified)} style={{ background: u.verified ? 'rgba(0,186,124,0.15)' : 'var(--bg-secondary)', border: `1px solid ${u.verified ? 'var(--success)' : 'var(--border)'}`, borderRadius: '6px', padding: '0.25rem 0.6rem', color: u.verified ? 'var(--success)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.2s' }}>
                                                                {u.verified ? '✓ Verified' : '○ Unverified'}
                                                            </button>
                                                        </td>
                                                        <td style={{ padding: '0.75rem 1rem' }}>
                                                            {u.id !== adminUser.userId && (
                                                                <button onClick={() => deleteUser(u.id)} className="btn btn-danger" style={{ fontSize: '0.78rem', padding: '0.3rem 0.65rem' }}>Delete</button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {/* Subjects Tab */}
                    {tab === 'subjects' && (
                        <div className="animate-fadeIn" style={{ display: 'grid', gridTemplateColumns: windowWidth < 807 ? '1fr' : 'minmax(0, 1fr) 380px', gap: '1.5rem', alignItems: 'start' }}>
                            {/* Subject list */}
                            <div className="card" style={{ overflow: 'hidden', borderRadius: '16px' }}>
                                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <BookOpen size={18} style={{ color: 'var(--accent)' }} />
                                        <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Academic Subjects Directory</h3>
                                    </div>
                                    {windowWidth < 807 && (
                                        <button
                                            onClick={() => setTab('register')}
                                            className="btn btn-primary"
                                            style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
                                        >
                                            <Plus size={14} style={{ marginRight: '0.3rem' }} /> Add New
                                        </button>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {subjects.map(s => (
                                        <div key={s.id} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '1rem 1.5rem',
                                            borderBottom: '1px solid var(--border-light)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            background: lastAdded === s.id ? 'var(--accent-glow)' : 'transparent',
                                            transform: lastAdded === s.id ? 'scale(1.02)' : 'scale(1)',
                                            borderLeft: lastAdded === s.id ? '4px solid var(--accent)' : 'none'
                                        }} className="feed-item">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: 44, height: 44, background: s.color + '15', border: `1px solid ${s.color}30`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                                                    <SubjectIcon icon={s.icon} size={20} />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{s.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                        <HelpCircle size={12} /> {s._count?.questions || 0} enrolled inquiries
                                                    </div>
                                                </div>
                                            </div>
                                            <button onClick={() => deleteSubject(s.id)} className="btn btn-danger" style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
                                                <Trash2 size={14} style={{ marginRight: '0.4rem' }} /> Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Add subject form - Hidden below 807px */}
                            {windowWidth >= 807 && (
                                <div style={{ position: 'sticky', top: '5.5rem' }}>
                                    <RegisterForm newSubject={newSubject} setNewSubject={setNewSubject} addSubject={addSubject} subjectLoading={subjectLoading} />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Separate Register Page for Mobile/Small Screens */}
                    {tab === 'register' && (
                        <div className="animate-fadeIn" style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <button onClick={() => setTab('subjects')} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>
                                <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} /> Back to Directory
                            </button>
                            <RegisterForm newSubject={newSubject} setNewSubject={setNewSubject} addSubject={async (e: any) => { await addSubject(e); setTab('subjects'); }} subjectLoading={subjectLoading} />
                        </div>
                    )}

                    {/* Unanswered Tab */}
                    {tab === 'unanswered' && (
                        <div className="animate-fadeIn">
                            <div className="card" style={{ overflow: 'hidden', borderRadius: '16px' }}>
                                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <MessageSquareOff size={18} style={{ color: 'var(--danger)' }} />
                                    <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Pending Student Inquiries <span style={{ color: 'var(--text-secondary)', fontWeight: 500, marginLeft: '0.5rem' }}>({unanswered.length})</span></h3>
                                </div>
                                {loading ? (
                                    <div style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
                                ) : unanswered.length === 0 ? (
                                    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                                        <div style={{ width: 64, height: 64, background: 'var(--bg-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--success)' }}>
                                            <CheckCircle2 size={32} />
                                        </div>
                                        <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>All Caught Up!</h4>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>There are currently no unanswered questions from students.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        {unanswered.map(q => (
                                            <div key={q.id} style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)', transition: 'background 0.2s' }} className="feed-item">
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div className="avatar avatar-sm">{q.student.name.charAt(0)}</div>
                                                        <div>
                                                            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{q.student.name}</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                                <Mail size={12} /> {q.student.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="tag" style={{ background: q.subject.color + '15', color: q.subject.color, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                        <SubjectIcon icon={q.subject.icon} size={12} /> {q.subject.name}
                                                    </span>
                                                </div>
                                                <div style={{ marginLeft: '3.25rem' }}>
                                                    <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{q.title}</h4>
                                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{q.description}</p>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Posted on {new Date(q.createdAt).toLocaleDateString()}</span>
                                                        {/* Linking to the question detail page might be useful */}
                                                        <Link href={`/question/${q.id}`} className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', border: '1px solid var(--border-light)' }}>
                                                            View Details <ChevronRight size={14} />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <style jsx global>{`
                    @media (max-width: 1024px) {
                        .admin-main {
                            margin-left: 0 !important;
                        }
                        .admin-container {
                            padding: 1.5rem 1rem !important;
                        }
                        .responsive-grid {
                            grid-template-columns: 1fr !important;
                        }
                    }
                    :root {
                        --sidebar-width: 260px;
                    }
                `}</style>
            </main>

            {/* Confirmation Modal */}
            {confirmModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                    <div className="card animate-fadeIn" style={{ maxWidth: '450px', width: '100%', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', background: 'var(--bg-card)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--danger)' }}>
                            <Trash2 size={24} />
                            <h2 style={{ fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>{confirmModal.title}</h2>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>{confirmModal.message}</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setConfirmModal(null)} className="btn btn-ghost" style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>Abort</button>
                            <button onClick={confirmModal.onConfirm} className="btn btn-danger" style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', fontWeight: 800 }}>Execute Protocol</button>
                        </div>
                    </div>
                </div>
            )}

            {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
        </div>
    )
}

function RegisterForm({ newSubject, setNewSubject, addSubject, subjectLoading }: any) {
    return (
        <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Plus size={20} style={{ color: 'var(--accent)' }} />
                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Register New Subject</h3>
            </div>
            <form onSubmit={addSubject} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>Formal Name</label>
                    <input className="input" style={{ borderRadius: '10px' }} placeholder="e.g. Advanced Calculus, OS Design" value={newSubject.name} onChange={e => setNewSubject((s: any) => ({ ...s, name: e.target.value }))} required />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>Academic Icon</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                        {SUBJECT_ICONS.map(icon => (
                            <button key={icon} type="button" onClick={() => setNewSubject((s: any) => ({ ...s, icon }))} style={{ width: '100%', aspectRatio: '1', background: newSubject.icon === icon ? 'var(--accent-glow)' : 'var(--bg-secondary)', border: `2px solid ${newSubject.icon === icon ? 'var(--accent)' : 'transparent'}`, borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: newSubject.icon === icon ? 'var(--accent)' : 'var(--text-secondary)', transition: 'all 0.15s' }}>
                                <SubjectIcon icon={icon} size={18} />
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>Brand Identity Color</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                        {SUBJECT_COLORS.map(color => (
                            <button key={color} type="button" onClick={() => setNewSubject((s: any) => ({ ...s, color }))} style={{ width: 28, height: 28, background: color, borderRadius: '8px', cursor: 'pointer', border: newSubject.color === color ? '2px solid white' : 'none', boxShadow: newSubject.color === color ? `0 0 0 2px ${color}` : 'none', transition: 'all 0.15s', transform: newSubject.color === color ? 'scale(1.1)' : 'scale(1)' }} />
                        ))}
                    </div>
                </div>

                <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '2px dashed var(--border-light)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Curriculum Preview</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{ width: 48, height: 48, background: newSubject.color + '20', border: `1px solid ${newSubject.color}40`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: newSubject.color }}>
                            <SubjectIcon icon={newSubject.icon} size={22} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: newSubject.name ? newSubject.color : 'var(--text-secondary)' }}>
                                {newSubject.name || 'Awaiting Nomenclature...'}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{newSubject.name ? 'Ready for registration' : 'Enter subject title above'}</span>
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={subjectLoading || !newSubject.name} style={{
                    justifyContent: 'center', padding: '1rem', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', gap: '0.75rem',
                    boxShadow: newSubject.name ? '0 8px 20px var(--accent-glow)' : 'none'
                }}>
                    {subjectLoading ? <div className="spinner" /> : (
                        <><Plus size={20} strokeWidth={3} /> Finalize & Register</>
                    )}
                </button>
            </form>
        </div>
    )
}
