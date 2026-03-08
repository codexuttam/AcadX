'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TokenPayload } from '@/lib/jwt'

interface DbUser { id: string; name: string; email: string; role: string; department: string; verified: boolean; createdAt: string }
interface Subject { id: string; name: string; color: string; icon: string; _count?: { questions: number } }
interface Stats { questions: number; answers: number; subjects: number; users: number }

const DEPARTMENTS = ['CSE', 'AIML', 'IT', 'ECE', 'ME', 'CE', 'School of Engineering']
const SUBJECT_ICONS = ['📘', '🐍', '☕', '⚡', '🔷', '📊', '🤖', '🌲', '🧮', '💻', '🗄️', '🌐', '🧠', '👁️', '💬']
const SUBJECT_COLORS = ['#6366f1', '#3b82f6', '#ef4444', '#f97316', '#eab308', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#14b8a6', '#d946ef', '#0ea5e9', '#22c55e']

export default function AdminClient({ adminUser }: { adminUser: TokenPayload }) {
    const router = useRouter()
    const [tab, setTab] = useState<'overview' | 'users' | 'subjects'>('overview')
    const [users, setUsers] = useState<DbUser[]>([])
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState<{ msg: string; type: string } | null>(null)
    const [newSubject, setNewSubject] = useState({ name: '', color: SUBJECT_COLORS[0], icon: SUBJECT_ICONS[0] })
    const [subjectLoading, setSubjectLoading] = useState(false)

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
        if (!confirm('Delete this user? This action cannot be undone.')) return
        const res = await fetch('/api/admin', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        })
        if (res.ok) {
            setUsers(us => us.filter(u => u.id !== userId))
            showToast('User deleted')
        }
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
            setNewSubject({ name: '', color: SUBJECT_COLORS[0], icon: SUBJECT_ICONS[0] })
            showToast('✅ Subject added')
        } else {
            showToast(data.error || 'Failed to add subject', 'error')
        }
    }

    const deleteSubject = async (id: string) => {
        if (!confirm('Delete this subject?')) return
        const res = await fetch('/api/subjects', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        if (res.ok) {
            setSubjects(ss => ss.filter(s => s.id !== id))
            showToast('Subject deleted')
        }
    }

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')
    }

    const roleColor = (role: string) => ({ admin: '#d946ef', professor: '#6366f1', student: '#06b6d4' }[role] || '#71767b')

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Top nav */}
            <div style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-light)', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>⚡</div>
                        <span style={{ fontSize: '1.1rem', fontWeight: '900', letterSpacing: '-0.03em' }}>AcadX Admin</span>
                    </div>
                    <span className="tag" style={{ background: 'rgba(217,70,239,0.15)', color: '#d946ef', fontSize: '0.72rem' }}>👑 Dean Access</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Link href="/feed" className="btn btn-ghost" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>← View Feed</Link>
                    <button onClick={logout} className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>Sign Out</button>
                </div>
            </div>

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                {/* Welcome */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: '900', marginBottom: '0.3rem' }}>Welcome back, Dean 👋</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>School of Engineering · Doubt Resolution Dashboard</p>
                </div>

                {/* Stats */}
                {stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                        {[
                            { label: 'Total Users', value: stats.users, icon: '👥' },
                            { label: 'Questions Asked', value: stats.questions, icon: '❓' },
                            { label: 'Answers Given', value: stats.answers, icon: '✅' },
                            { label: 'Subjects', value: stats.subjects, icon: '📚' },
                        ].map(s => (
                            <div key={s.label} className="stat-card">
                                <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>{s.icon}</div>
                                <div className="stat-number">{s.value}</div>
                                <div className="stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--bg-card)', padding: '4px', borderRadius: '12px', width: 'fit-content', border: '1px solid var(--border-light)' }}>
                    {([
                        { key: 'overview', label: '📊 Overview' },
                        { key: 'users', label: '👥 Manage Users' },
                        { key: 'subjects', label: '📚 Subjects' },
                    ] as const).map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', transition: 'all 0.2s', background: tab === t.key ? 'var(--accent)' : 'transparent', color: tab === t.key ? '#fff' : 'var(--text-secondary)' }}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {tab === 'overview' && (
                    <div className="animate-fadeIn">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            {/* Recent users */}
                            <div className="card" style={{ padding: '1.25rem' }}>
                                <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>👥 Recent Users</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {users.slice(0, 6).map(u => (
                                        <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.4rem 0' }}>
                                            <div className="avatar avatar-sm">{u.name.charAt(0)}</div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
                                                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                                            </div>
                                            <span className="tag" style={{ background: roleColor(u.role) + '20', color: roleColor(u.role), fontSize: '0.7rem' }}>{u.role}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Subjects */}
                            <div className="card" style={{ padding: '1.25rem' }}>
                                <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>📚 Active Subjects</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {subjects.map(s => (
                                        <span key={s.id} className="tag" style={{ background: s.color + '20', color: s.color }}>
                                            {s.icon} {s.name}
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
                        <div className="card" style={{ overflow: 'hidden' }}>
                            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>All Users ({users.length})</h3>
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
                    <div className="animate-fadeIn" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', alignItems: 'start' }}>
                        {/* Subject list */}
                        <div className="card" style={{ overflow: 'hidden' }}>
                            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-light)' }}>
                                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>All Subjects ({subjects.length})</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {subjects.map(s => (
                                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--border-light)', transition: 'background 0.15s' }} className="feed-item">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: 36, height: 36, background: s.color + '20', border: `1px solid ${s.color}40`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{s.icon}</div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s._count?.questions || 0} questions</div>
                                            </div>
                                        </div>
                                        <button onClick={() => deleteSubject(s.id)} className="btn btn-danger" style={{ fontSize: '0.78rem', padding: '0.3rem 0.65rem' }}>Delete</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add subject form */}
                        <div className="card" style={{ padding: '1.25rem', position: 'sticky', top: '5rem' }}>
                            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>➕ Add Subject</h3>
                            <form onSubmit={addSubject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>Subject Name *</label>
                                    <input className="input" placeholder="e.g. Python, MATLAB, C++" value={newSubject.name} onChange={e => setNewSubject(s => ({ ...s, name: e.target.value }))} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>Icon</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                        {SUBJECT_ICONS.map(icon => (
                                            <button key={icon} type="button" onClick={() => setNewSubject(s => ({ ...s, icon }))} style={{ width: 36, height: 36, background: newSubject.icon === icon ? 'var(--accent-glow)' : 'var(--bg-secondary)', border: `1px solid ${newSubject.icon === icon ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', transition: 'all 0.15s' }}>
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>Color</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                        {SUBJECT_COLORS.map(color => (
                                            <button key={color} type="button" onClick={() => setNewSubject(s => ({ ...s, color }))} style={{ width: 28, height: 28, background: color, borderRadius: '50%', cursor: 'pointer', border: newSubject.color === color ? '2px solid white' : '2px solid transparent', outline: newSubject.color === color ? `2px solid ${color}` : 'none', transition: 'all 0.15s', transform: newSubject.color === color ? 'scale(1.15)' : 'scale(1)' }} />
                                        ))}
                                    </div>
                                </div>

                                {/* Preview */}
                                <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Preview:</span>
                                    <span className="tag" style={{ background: newSubject.color + '20', color: newSubject.color }}>
                                        {newSubject.icon} {newSubject.name || 'Subject Name'}
                                    </span>
                                </div>

                                <button type="submit" className="btn btn-primary" disabled={subjectLoading || !newSubject.name} style={{ justifyContent: 'center' }}>
                                    {subjectLoading ? <div className="spinner" /> : '➕ Add Subject'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
        </div>
    )
}
