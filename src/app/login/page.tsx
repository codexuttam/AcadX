'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

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
    const [navigating, setNavigating] = useState(false)
    const [error, setError] = useState('')
    const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 })
    const cardRef = useRef<HTMLDivElement>(null)

    const [form, setForm] = useState({
        name: '', email: '', password: '', department: 'CSE', role: 'student', otp: ''
    })
    const [otpSent, setOtpSent] = useState(false)
    const [otpLoading, setOtpLoading] = useState(false)

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

    const handleSendOTP = async () => {
        if (!form.email) { setError('Please enter your email first'); return }
        setOtpLoading(true)
        setError('')
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email }),
            })
            const data = await res.json()
            if (!res.ok) { setError(data.error || 'Failed to send OTP'); return }
            setOtpSent(true)
        } catch {
            setError('Network error. Failed to send OTP.')
        } finally {
            setOtpLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (mode === 'register' && !otpSent) {
            handleSendOTP()
            return
        }
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

            setNavigating(true)
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
            {/* Full-screen instant loading overlay */}
            {navigating && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    background: 'var(--bg-primary)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    animation: 'fadeIn 0.15s ease-out'
                }}>
                    <div className="spinner-3d" />
                    <div style={{ marginTop: '1.5rem', fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', animation: 'fadeIn 0.3s ease-out' }}>
                        Logging you in...
                    </div>
                </div>
            )}

            {/* Background gradient */}
            <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 30% 20%, var(--border-light) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, var(--border-shadow-color) 0%, transparent 60%)', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ position: 'relative', width: 48, height: 48, overflow: 'hidden', backgroundColor: 'var(--logo-bg)', borderRadius: '10px', padding: '6px' }}>
                            <Image src="/logo.png" alt="AcadX Logo" fill style={{ objectFit: 'contain' }} />
                        </div>
                        <span style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.04em', background: 'linear-gradient(to right, var(--gradient-text-start), var(--gradient-text-end))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AcadX</span>
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
                                <input className="input" type="email" placeholder="niu-22-12345@niu.edu.in" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                                {mode === 'register' && !otpSent && (
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Only @niu.edu.in emails allowed.</p>
                                )}
                            </div>

                            {mode === 'register' && otpSent && (
                                <div className="animate-fadeIn">
                                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>6-Digit OTP</label>
                                    <input className="input" placeholder="123456" value={form.otp} onChange={e => setForm(f => ({ ...f, otp: e.target.value.replace(/\D/g, '').substring(0, 6) }))} required />
                                    <p style={{ fontSize: '0.7rem', color: 'var(--success)', marginTop: '0.25rem' }}>Check your college email for the code.</p>
                                </div>
                            )}

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
                                <div style={{ padding: '0.75rem 1rem', background: 'var(--toast-error-bg)', border: '1px solid var(--danger)', borderRadius: '8px', color: 'var(--danger)', fontSize: '0.85rem' }}>
                                    {error}
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary" disabled={loading || otpLoading || navigating} style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                                {loading || otpLoading || navigating ? <div className="spinner" /> :
                                    mode === 'login' ? 'Sign In to AcadX' :
                                        otpSent ? 'Verify & Register' : 'Next: Get OTP'}
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}
