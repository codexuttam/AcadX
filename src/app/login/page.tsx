'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginContent />
        </Suspense>
    )
}

function LoginContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const registerMode = searchParams.get('register') === 'true'

    const [mode, setMode] = useState<'login' | 'register'>(registerMode ? 'register' : 'login')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 })
    const cardRef = useRef<HTMLDivElement>(null)

    const [form, setForm] = useState({
        name: '', email: '', password: '', department: 'CSE', role: 'student'
    })

    useEffect(() => {
        if (registerMode) setMode('register')
        else setMode('login')
    }, [registerMode])

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
        setHoverPos({ x, y })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
        const body = mode === 'login'
            ? { email: form.email, password: form.password }
            : form

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            const data = await res.json()
            if (!res.ok) { setError(data.error || 'Something went wrong'); return }

            if (data.user?.role === 'admin') { router.push('/admin'); return }
            router.push('/feed')
            router.refresh()
        } catch {
            setError('Network error. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', perspective: '1000px' }}>
            {/* Background gradient */}
            <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 30% 20%, rgba(108,99,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(168,85,247,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ width: 44, height: 44, background: 'var(--accent)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '0 0 30px var(--accent-glow)' }}>⚡</div>
                        <span style={{ fontSize: '1.8rem', fontWeight: '900', letterSpacing: '-0.04em' }}>AcadX</span>
                    </div>
                </div>

                {/* Card */}
                <div ref={cardRef} onMouseMove={handleMouseMove} className="card tilt-3d glow-card preserve-3d"
                    style={{
                        padding: '2rem',
                        transform: `perspective(1000px) rotateX(${(hoverPos.y - 0.5) * -10}deg) rotateY(${(hoverPos.x - 0.5) * 10}deg)`
                    }}>
                    <div style={{ transform: 'translateZ(20px)' }}> {/* Content with 3D depth */}
                        {/* Tab switcher */}
                        <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '10px', padding: '4px', marginBottom: '1.75rem' }}>
                            {(['login', 'register'] as const).map(m => (
                                <button key={m} onClick={() => { setMode(m); setError('') }} style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s', background: mode === m ? 'var(--accent)' : 'transparent', color: mode === m ? '#fff' : 'var(--text-secondary)' }}>
                                    {m === 'login' ? 'Sign In' : 'Register'}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {mode === 'register' && (
                                <div className="animate-fadeIn">
                                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>Full Name</label>
                                    <input className="input" placeholder="Uttamraj Singh" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                                </div>
                            )}

                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>Email Address</label>
                                <input className="input" type="email" placeholder="you@student.edu" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>Password</label>
                                <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                            </div>

                            {mode === 'register' && (
                                <div className="animate-fadeIn" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>Dept</label>
                                        <select className="input" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                                            <option value="CSE">CSE</option>
                                            <option value="AIML">AIML</option>
                                            <option value="IT">IT</option>
                                            <option value="ECE">ECE</option>
                                            <option value="ME">ME</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>Role</label>
                                        <select className="input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                                            <option value="student">Student</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div style={{ padding: '0.75rem 1rem', background: 'rgba(244,33,46,0.1)', border: '1px solid var(--danger)', borderRadius: '8px', color: 'var(--danger)', fontSize: '0.85rem' }}>
                                    {error}
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                                {loading ? <div className="spinner" /> : mode === 'login' ? 'Sign In to AcadX' : 'Create Account'}
                            </button>
                        </form>

                        {/* Demo credentials */}
                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Demo Accounts</p>
                            {[
                                { label: '🎓 Student', cred: 'uttam@student.edu / student@123' },
                                { label: '👨‍🏫 Professor', cred: 'rajesh@engineering.edu / prof@123' },
                            ].map(({ label, cred }) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', padding: '0.1rem 0' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                                    <code style={{ color: 'var(--accent)' }}>{cred}</code>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
