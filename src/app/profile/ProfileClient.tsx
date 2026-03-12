'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { TokenPayload } from '@/lib/jwt'
import { formatDistanceToNow } from 'date-fns'
import {
    ArrowLeft, Camera, Edit3, Save, X, CheckCircle2, Clock, MessageSquare,
    BookOpen, Award, TrendingUp, Users, FileText, BarChart3, Shield,
    Star, Activity, Briefcase, User as UserIcon
} from 'lucide-react'

/* ───────── shared types ───────── */
interface Subject { id: string; name: string; color: string; icon: string; _count?: { questions: number } }
interface QuestionItem {
    id: string; title: string; description: string; solved: boolean; createdAt: string
    subject: Subject
    _count: { answers: number; upvotes: number }
}
interface AnswerItem {
    id: string; text: string; isBest: boolean; createdAt: string; upvotes: number
    question: { id: string; title: string; subject: Subject; student: { id: string; name: string; department: string } }
}
interface ProfRanking {
    id: string; name: string; department: string; avatar: string | null; verified: boolean
    totalAnswers: number; bestAnswers: number; last24hAnswers: number
}

export function ProfileClient({ user }: { user: TokenPayload }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [profileData, setProfileData] = useState<any>(null)
    const [userData, setUserData] = useState<any>(null)
    const [editingBio, setEditingBio] = useState(false)
    const [bio, setBio] = useState('')
    const [saving, setSaving] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/me')
            const data = await res.json()
            setUserData(data.user)
            setProfileData(data.profile)
            setBio(data.user?.bio || '')
        } catch { }
        setLoading(false)
    }

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 2 * 1024 * 1024) { alert('Image must be under 2MB'); return }
        const reader = new FileReader()
        reader.onloadend = async () => {
            setSaving(true)
            try {
                const res = await fetch('/api/me', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ avatar: reader.result }),
                })
                if (res.ok) {
                    const data = await res.json()
                    setUserData((u: any) => ({ ...u, avatar: data.user.avatar }))
                }
            } catch { }
            setSaving(false)
        }
        reader.readAsDataURL(file)
    }

    const saveBio = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/me', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bio }),
            })
            if (res.ok) {
                setUserData((u: any) => ({ ...u, bio }))
                setEditingBio(false)
            }
        } catch { }
        setSaving(false)
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner-3d" />
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Top bar */}
            <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--nav-scrolled-bg)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-light)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => router.push('/feed')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                        {user.role === 'admin' ? 'Administrative Overview' : 'Profile'}
                    </h1>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user.role === 'admin' ? 'Dean Portal' : user.role}</div>
                </div>
            </div>

            <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
                {/* Profile Header */}
                <ProfileHeader
                    userData={userData}
                    bio={bio}
                    editingBio={editingBio}
                    saving={saving}
                    fileRef={fileRef}
                    onAvatarChange={handleAvatarChange}
                    onBioChange={setBio}
                    onEditBio={() => setEditingBio(true)}
                    onCancelBio={() => { setEditingBio(false); setBio(userData?.bio || '') }}
                    onSaveBio={saveBio}
                />

                {/* Role-specific content */}
                {user.role === 'student' && <StudentProfile data={profileData} />}
                {user.role === 'professor' && <ProfessorProfile data={profileData} />}
                {user.role === 'admin' && <DeanProfile data={profileData} />}
            </div>

            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
        </div>
    )
}

/* ═══════════════════════════════════════════════════
   PROFILE HEADER — shared across all roles
   ═══════════════════════════════════════════════════ */
function ProfileHeader({ userData, bio, editingBio, saving, fileRef, onAvatarChange, onBioChange, onEditBio, onCancelBio, onSaveBio }: any) {
    const roleLabel: Record<string, string> = { student: 'Student', professor: 'Faculty Member', admin: 'Dean of Academics' }
    const roleIcon: Record<string, any> = { student: <BookOpen size={14} />, professor: <Briefcase size={14} />, admin: <Shield size={14} /> }

    return (
        <div className="card" style={{ padding: '2rem', borderRadius: '20px', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{
                        width: 96, height: 96, borderRadius: '50%', overflow: 'hidden',
                        border: '3px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'var(--bg-secondary)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)',
                        cursor: 'pointer', position: 'relative'
                    }} onClick={() => fileRef.current?.click()}>
                        {userData?.avatar
                            ? <img src={userData.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : userData?.name?.charAt(0) || '?'
                        }
                    </div>
                    <div onClick={() => fileRef.current?.click()} style={{
                        position: 'absolute', bottom: 0, right: 0, width: 32, height: 32,
                        borderRadius: '50%', background: 'var(--accent)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        border: '2px solid var(--bg-card)'
                    }}>
                        <Camera size={14} color="white" />
                    </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{userData?.name}</h2>
                        {userData?.verified && <CheckCircle2 size={18} color="var(--accent)" />}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        {roleIcon[userData?.role] || <UserIcon size={14} />}
                        <span>{roleLabel[userData?.role] || userData?.role}</span>
                        <span style={{ color: 'var(--text-muted)' }}>·</span>
                        <span>{userData?.department} Department</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Member since {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
                    </div>

                    {/* Bio */}
                    <div style={{ marginTop: '1rem' }}>
                        {editingBio ? (
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                <textarea
                                    value={bio}
                                    onChange={e => onBioChange(e.target.value)}
                                    className="input"
                                    rows={3}
                                    maxLength={500}
                                    placeholder="Write a brief description about yourself..."
                                    style={{ flex: 1, fontSize: '0.85rem' }}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <button onClick={onSaveBio} disabled={saving} style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                        <Save size={14} />
                                    </button>
                                    <button onClick={onCancelBio} style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                <p style={{ fontSize: '0.88rem', color: bio ? 'var(--text-secondary)' : 'var(--text-muted)', fontStyle: bio ? 'normal' : 'italic', margin: 0, lineHeight: 1.5 }}>
                                    {bio || 'No description added yet.'}
                                </p>
                                <button onClick={onEditBio} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}>
                                    <Edit3 size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════
   STUDENT PROFILE
   ═══════════════════════════════════════════════════ */
function StudentProfile({ data }: { data: any }) {
    const [tab, setTab] = useState<'answered' | 'unanswered' | 'recent'>('answered')

    if (!data) return null

    const statCards = [
        { label: 'Total Doubts', value: data.totalQuestions, icon: <FileText size={18} />, color: 'var(--accent)' },
        { label: 'Resolved', value: data.answeredQuestions?.length || 0, icon: <CheckCircle2 size={18} />, color: 'var(--success)' },
        { label: 'Pending', value: data.unansweredQuestions?.length || 0, icon: <Clock size={18} />, color: 'var(--warning)' },
        { label: 'Last 24h', value: data.recentActivity?.length || 0, icon: <Activity size={18} />, color: '#8b5cf6' },
    ]

    const questions: QuestionItem[] =
        tab === 'answered' ? (data.answeredQuestions || []) :
            tab === 'unanswered' ? (data.unansweredQuestions || []) :
                (data.recentActivity || [])

    return (
        <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {statCards.map(s => (
                    <div key={s.label} className="card" style={{ padding: '1.25rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 42, height: 42, borderRadius: '12px', background: s.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                            {s.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{s.value}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="card" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)' }}>
                    {[
                        { key: 'answered' as const, label: 'Resolved Doubts', icon: <CheckCircle2 size={14} /> },
                        { key: 'unanswered' as const, label: 'Pending Doubts', icon: <Clock size={14} /> },
                        { key: 'recent' as const, label: 'Last 24 Hours', icon: <Activity size={14} /> },
                    ].map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)} style={{
                            flex: 1, padding: '1rem', background: 'none', border: 'none', cursor: 'pointer',
                            fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '0.4rem',
                            color: tab === t.key ? 'var(--accent)' : 'var(--text-muted)',
                            borderBottom: tab === t.key ? '2px solid var(--accent)' : '2px solid transparent',
                        }}>
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>

                <div style={{ padding: '0.5rem' }}>
                    {questions.length === 0 ? (
                        <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <FileText size={36} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>No doubts in this category</div>
                        </div>
                    ) : (
                        questions.map(q => (
                            <Link key={q.id} href={`/question/${q.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{
                                    padding: '1rem 1.25rem', borderRadius: '12px', margin: '0.25rem 0',
                                    transition: 'background 0.15s', cursor: 'pointer', display: 'flex',
                                    alignItems: 'flex-start', gap: '0.75rem',
                                }} className="nav-item">
                                    <div style={{
                                        width: 8, height: 8, borderRadius: '50%', marginTop: '0.4rem', flexShrink: 0,
                                        background: q.solved ? 'var(--success)' : q._count.answers > 0 ? 'var(--warning)' : 'var(--text-muted)',
                                    }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.2rem' }}>{q.title}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                            <span style={{ background: q.subject.color + '15', color: q.subject.color, padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 600 }}>
                                                {q.subject.name}
                                            </span>
                                            <span>{q._count.answers} {q._count.answers === 1 ? 'response' : 'responses'}</span>
                                            <span>{formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}</span>
                                        </div>
                                    </div>
                                    {q.solved && <CheckCircle2 size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />}
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </>
    )
}

/* ═══════════════════════════════════════════════════
   PROFESSOR PROFILE
   ═══════════════════════════════════════════════════ */
function ProfessorProfile({ data }: { data: any }) {
    if (!data) return null

    const statCards = [
        { label: 'Total Resolved', value: data.totalAnswered, icon: <MessageSquare size={18} />, color: 'var(--accent)' },
        { label: 'Best Answers', value: data.bestAnswers, icon: <Award size={18} />, color: '#f59e0b' },
        { label: 'Last 24 Hours', value: data.recentAnswers, icon: <Activity size={18} />, color: 'var(--success)' },
        { label: 'Subjects', value: data.subjectsHelped?.length || 0, icon: <BookOpen size={18} />, color: '#8b5cf6' },
    ]

    const answers: AnswerItem[] = data.answers || []

    return (
        <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {statCards.map(s => (
                    <div key={s.label} className="card" style={{ padding: '1.25rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 42, height: 42, borderRadius: '12px', background: s.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                            {s.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{s.value}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Subjects helped */}
            {data.subjectsHelped?.length > 0 && (
                <div className="card" style={{ padding: '1.25rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Areas of Expertise</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {data.subjectsHelped.map((s: string) => (
                            <span key={s} style={{ padding: '0.35rem 0.85rem', borderRadius: '8px', background: 'var(--accent-glow)', color: 'var(--accent)', fontWeight: 600, fontSize: '0.8rem' }}>{s}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Answered doubts list */}
            <div className="card" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageSquare size={16} color="var(--accent)" />
                    <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Doubts Addressed</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{answers.length} total</span>
                </div>
                <div style={{ padding: '0.5rem' }}>
                    {answers.length === 0 ? (
                        <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <MessageSquare size={36} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>No responses yet</div>
                        </div>
                    ) : (
                        answers.map(a => (
                            <Link key={a.id} href={`/question/${a.question.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{ padding: '1rem 1.25rem', borderRadius: '12px', margin: '0.25rem 0', cursor: 'pointer' }} className="nav-item">
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                        <div style={{
                                            width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
                                            background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700,
                                            color: 'var(--text-secondary)'
                                        }}>
                                            {a.question.student.name.charAt(0)}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.15rem' }}>{a.question.title}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                                                Asked by {a.question.student.name} · {a.question.student.department} · {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                                            </div>
                                            <div style={{
                                                fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5,
                                                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                            } as React.CSSProperties}>
                                                {a.text}
                                            </div>
                                        </div>
                                        {a.isBest && (
                                            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.65rem', fontWeight: 800 }}>
                                                <Star size={12} fill="#f59e0b" /> BEST
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </>
    )
}

/* ═══════════════════════════════════════════════════
   DEAN / ADMIN PROFILE
   ═══════════════════════════════════════════════════ */
function DeanProfile({ data }: { data: any }) {
    if (!data) return null

    const statCards = [
        { label: 'Total Doubts', value: data.totalQuestions, icon: <FileText size={18} />, color: 'var(--accent)' },
        { label: 'Resolved', value: data.resolvedQuestions, icon: <CheckCircle2 size={18} />, color: 'var(--success)' },
        { label: 'Resolution Rate', value: data.resolutionRate + '%', icon: <BarChart3 size={18} />, color: '#f59e0b' },
        { label: 'Total Responses', value: data.totalAnswers, icon: <MessageSquare size={18} />, color: '#8b5cf6' },
        { label: 'Students', value: data.totalStudents, icon: <Users size={18} />, color: '#06b6d4' },
        { label: 'Faculty', value: data.totalProfessors, icon: <Briefcase size={18} />, color: '#ec4899' },
    ]

    const profRanking: ProfRanking[] = data.professorRanking || []
    const recentQuestions: QuestionItem[] = data.recentQuestions || []
    const subjects: Array<Subject & { _count: { questions: number } }> = data.subjectDistribution || []

    return (
        <>
            {/* Platform Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {statCards.map(s => (
                    <div key={s.label} className="card" style={{ padding: '1.25rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 42, height: 42, borderRadius: '12px', background: s.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                            {s.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{s.value}</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dean-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Faculty Performance Ranking */}
                <div className="card" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp size={16} color="var(--accent)" />
                        <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Faculty Performance</span>
                    </div>
                    <div style={{ padding: '0.5rem' }}>
                        {profRanking.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No faculty data available</div>
                        ) : (
                            profRanking.map((p, i) => (
                                <div key={p.id} style={{
                                    padding: '0.85rem 1rem', borderRadius: '12px', margin: '0.25rem 0',
                                    display: 'flex', alignItems: 'center', gap: '0.85rem', background: i === 0 ? 'var(--accent-glow)' : 'transparent'
                                }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: '8px', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem',
                                        background: i === 0 ? 'var(--accent)' : 'var(--bg-secondary)',
                                        color: i === 0 ? 'white' : 'var(--text-muted)',
                                    }}>
                                        {i + 1}
                                    </div>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-secondary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)',
                                        border: '2px solid var(--border-light)', overflow: 'hidden'
                                    }}>
                                        {p.avatar ? <img src={p.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : p.name.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            {p.name}
                                            {p.verified && <CheckCircle2 size={12} color="var(--accent)" />}
                                        </div>
                                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{p.department}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{p.totalAnswers}</div>
                                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>resolved</div>
                                    </div>
                                    {p.last24hAnswers > 0 && (
                                        <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--success)', background: 'rgba(0,186,124,0.1)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                                            +{p.last24hAnswers} today
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Subject Distribution */}
                <div className="card" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BarChart3 size={16} color="#f59e0b" />
                        <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Subject Distribution</span>
                    </div>
                    <div style={{ padding: '0.75rem' }}>
                        {subjects.map(s => {
                            const maxCount = Math.max(...subjects.map(x => x._count.questions), 1)
                            const pct = Math.round((s._count.questions / maxCount) * 100)
                            return (
                                <div key={s.id} style={{ padding: '0.6rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span style={{ fontSize: '0.82rem', fontWeight: 600, minWidth: 130 }}>{s.name}</span>
                                    <div style={{ flex: 1, height: 8, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: pct + '%', background: s.color, borderRadius: 4, transition: 'width 0.5s ease' }} />
                                    </div>
                                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', minWidth: 20, textAlign: 'right' }}>{s._count.questions}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Live Feed — Last 24h */}
            <div className="card" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={16} color="var(--success)" />
                    <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Live Feed — Last 24 Hours</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{recentQuestions.length} doubts</span>
                </div>
                <div style={{ padding: '0.5rem' }}>
                    {recentQuestions.length === 0 ? (
                        <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <Activity size={36} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>No activity in the last 24 hours</div>
                        </div>
                    ) : (
                        recentQuestions.map((q: any) => (
                            <Link key={q.id} href={`/question/${q.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{ padding: '1rem 1.25rem', borderRadius: '12px', margin: '0.25rem 0', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }} className="nav-item">
                                    <div style={{
                                        width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
                                        background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700,
                                        color: 'var(--text-secondary)'
                                    }}>
                                        {q.student?.name?.charAt(0) || '?'}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.15rem' }}>{q.title}</div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                            {q.student?.name} · {q.student?.department} · {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: '0.62rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '6px', textTransform: 'uppercase',
                                        background: q.solved ? 'rgba(0,186,124,0.1)' : 'rgba(245,158,11,0.1)',
                                        color: q.solved ? 'var(--success)' : '#f59e0b'
                                    }}>
                                        {q.solved ? 'Resolved' : q._count?.answers > 0 ? 'In Progress' : 'Pending'}
                                    </span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </>
    )
}
