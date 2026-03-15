'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { ShieldCheck, BookOpen, Users, ArrowLeft, ChevronRight, Terminal, Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

    const [selectedRole, setSelectedRole] = useState<'admin' | 'professor' | 'student' | null>(null)
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
    const [showPassword, setShowPassword] = useState(false)

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

    const selectPortal = (role: 'admin' | 'professor' | 'student') => {
        setSelectedRole(role)
        setForm(f => ({ ...f, role }))
        if (role === 'admin') setMode('login')
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-md)', perspective: '1000px' }}>

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

            {/* Enhanced Background Mesh */}
            <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(circle at 0% 0%, var(--accent-glow) 0%, transparent 40%), radial-gradient(circle at 100% 100%, var(--accent-glow) 0%, transparent 40%), var(--bg-primary)', pointerEvents: 'none', opacity: 0.6 }} />
            <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(var(--grid-color) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', opacity: 0.2 }} />

            {/* Top Right System Status Indicator */}
            <div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 10 }}>
                <div style={{ width: 8, height: 8, background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 10px var(--success)', animation: 'pulse-glow 2s infinite' }} />
                <span style={{ fontSize: '0.65rem', fontWeight: 900, fontFamily: 'monospace', color: 'var(--text-muted)', letterSpacing: '0.2em' }}>NETWORK: ACTIVE</span>
            </div>

            <div style={{ width: '100%', maxWidth: selectedRole ? '420px' : '1080px', position: 'relative', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)', zIndex: 1 }}>

                {/* Stylish Header Section */}
                {!selectedRole && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}
                    >
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1.25rem', marginBottom: 'var(--space-md)' }}>
                            <div style={{ position: 'relative', width: 56, height: 56, overflow: 'hidden', backgroundColor: 'var(--logo-bg)', borderRadius: '14px', padding: '8px', boxShadow: '0 8px 16px rgba(0,0,0,0.06)' }}>
                                <Image src="/logo.png" alt="AcadX Logo" fill style={{ objectFit: 'contain' }} />
                            </div>
                            <span style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: '900', letterSpacing: '-0.05em', background: 'linear-gradient(to right, var(--accent), var(--text-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AcadX</span>
                        </div>
                        <h1 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--accent)', marginBottom: '1rem', opacity: 0.8 }}>SELECT ACCESS PROTOCOL</h1>

                        <div style={{ marginBottom: 'var(--space-md)' }}>
                            <p style={{ fontSize: 'clamp(1.4rem, 4vw, 2.25rem)', fontWeight: 300, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1.2, maxWidth: '800px', margin: '0 auto' }}>
                                Empowering <span style={{ fontWeight: 800, fontStyle: 'italic' }}>Academic Excellence</span> through decentralized intelligence and real-time collaboration.
                            </p>
                        </div>

                        <p style={{ maxWidth: '650px', margin: '0 auto', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 500, opacity: 0.65 }}>
                            Initialize your persistent resolution interface. Choose your entry point to synchronize with the institutional knowledge grid and resolve technical queries across the network.
                        </p>
                    </motion.div>
                )}

                {selectedRole && (
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ position: 'relative', width: 42, height: 42, overflow: 'hidden', backgroundColor: 'var(--logo-bg)', borderRadius: '10px', padding: '6px' }}>
                                <Image src="/logo.png" alt="AcadX Logo" fill style={{ objectFit: 'contain' }} />
                            </div>
                            <span style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>AcadX</span>
                        </div>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {!selectedRole ? (
                        <motion.div
                            key="portal-selection"
                            initial="hidden"
                            animate="show"
                            exit={{ opacity: 0, scale: 1.05 }}
                            variants={{
                                hidden: { opacity: 0 },
                                show: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.12 }
                                }
                            }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'var(--space-md)', width: '100%' }}
                        >
                            {[
                                { id: 'admin', title: 'The Dean', icon: <ShieldCheck size={28} />, color: '#ff0080', bg: 'linear-gradient(135deg, var(--accent), #ff0080)', code: 'AUTH-ADM-01', desc: 'Administrative center for university-wide academic oversight and high-level policy management.' },
                                { id: 'professor', title: 'The Faculty', icon: <BookOpen size={28} />, color: '#0ea5e9', bg: 'linear-gradient(135deg, #0ea5e9, #6366f1)', code: 'AUTH-FAC-02', desc: 'Expert interface for mentors to provide resolutions, guide students, and manage curriculum.' },
                                { id: 'student', title: 'The Student', icon: <Users size={28} />, color: '#10b981', bg: 'linear-gradient(135deg, #10b981, #3b82f6)', code: 'AUTH-STD-03', desc: 'Learner gateway to resolve doubts, collaborate on solutions, and retrieve academic assets.' }
                            ].map((p, i) => (
                                <motion.div
                                    key={p.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 40 },
                                        show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 100 } }
                                    }}
                                    onClick={() => selectPortal(p.id as any)}
                                    className="card glass glow-card hover-lift preserve-3d"
                                    style={{
                                        padding: 'var(--space-lg) var(--space-md)',
                                        borderRadius: '32px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '1.25rem',
                                        border: '1px solid var(--border)',
                                        background: 'var(--bg-card)',
                                        position: 'relative',
                                        overflow: 'visible'
                                    }}
                                >
                                    {/* Security Badge */}
                                    <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-primary)', padding: '0.25rem 1rem', borderRadius: '10px', fontSize: '0.6rem', fontWeight: 900, color: p.color, border: `1px solid ${p.color}`, letterSpacing: '0.15em', whiteSpace: 'nowrap' }}>
                                        [ STATUS: SECURED ]
                                    </div>

                                    <div style={{ width: 72, height: 72, background: p.bg, borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: `0 15px 35px ${p.color}25`, marginBottom: '0.5rem' }}>
                                        {p.icon}
                                    </div>

                                    <div>
                                        <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '0.2em', marginBottom: '0.4rem', fontFamily: 'monospace' }}>IDENTIFIER: {p.code}</div>
                                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{p.title}</h2>
                                    </div>

                                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, opacity: 0.8, fontWeight: 500 }}>{p.desc}</p>

                                    <div style={{ marginTop: 'auto', background: 'var(--bg-secondary)', padding: '0.75rem 1.5rem', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid var(--border-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        SYNC PROTOCOL <ChevronRight size={14} />
                                    </div>

                                    {/* Hover Glow Effect Layer */}
                                    <div className="card-glow" style={{ position: 'absolute', inset: -1, borderRadius: '40px', background: `radial-gradient(circle at 50% 100%, ${p.color}15, transparent 70%)`, opacity: 0, transition: 'opacity 0.3s ease', pointerEvents: 'none' }} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="login-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            ref={cardRef}
                            onMouseMove={handleMouseMove}
                            className="card tilt-3d glow-card preserve-3d glass"
                            style={{
                                padding: 'var(--space-lg) var(--space-md)',
                                borderRadius: '32px',
                                border: '1px solid var(--border)',
                                transform: `perspective(1000px) rotateX(${(hoverPos.y - 0.5) * -10}deg) rotateY(${(hoverPos.x - 0.5) * 10}deg)`
                            }}
                        >
                            <div style={{ transform: 'translateZ(20px)' }}> {/* Content with 3D depth */}

                                <button onClick={() => setSelectedRole(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem', padding: 0 }}>
                                    <ArrowLeft size={16} /> CHANGE ACCESS PORTAL
                                </button>

                                <div style={{ marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>
                                        <Terminal size={16} />
                                        <span style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase' }}>System Status: Operational</span>
                                    </div>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '0.75rem' }}>
                                        {selectedRole === 'admin' ? 'DEAN COMMAND' : selectedRole === 'professor' ? 'FACULTY PORTAL' : 'STUDENT GATEWAY'}
                                    </h2>
                                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 500 }}>
                                        {selectedRole === 'admin' && 'Institutional Authentication: Access high-level administration tools and university-wide oversight protocols.'}
                                        {selectedRole === 'professor' && 'Expert Interface: Synchronize with the resolution network to guide students and validate academic solutions.'}
                                        {selectedRole === 'student' && 'Learner Access: Connect to the doubt resolution grid to retrieve peer-reviewed answers and learning materials.'}
                                    </p>
                                </div>

                                {/* Tab switcher - Only for prof/student */}
                                {selectedRole !== 'admin' && (
                                    <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '12px', padding: '4px', marginBottom: '1.75rem', border: '1px solid var(--border-light)' }}>
                                        {(['login', 'register'] as const).map(m => (
                                            <button key={m} onClick={() => { setMode(m); setError('') }} style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', transition: 'all 0.2s', background: mode === m ? 'var(--accent)' : 'transparent', color: mode === m ? '#fff' : 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {m === 'login' ? 'Sign In' : 'Join Us'}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {mode === 'register' && (
                                        <div className="animate-fadeIn">
                                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                                            <input className="input" placeholder="Dr. Rajesh Kumar" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                                        </div>
                                    )}

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Network Identifier (Email)</label>
                                        <input className="input" type="email" placeholder={selectedRole === 'admin' ? 'dean@engineering.edu' : "user.name@niu.edu.in"} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                                    </div>

                                    {mode === 'register' && otpSent && (
                                        <div className="animate-fadeIn">
                                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verification Token (OTP)</label>
                                            <input className="input" placeholder="• • • • • •" value={form.otp} onChange={e => setForm(f => ({ ...f, otp: e.target.value.replace(/\D/g, '').substring(0, 6) }))} required />
                                        </div>
                                    )}

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Key (Password)</label>
                                        <div style={{ position: 'relative' }}>
                                            <input className="input" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required style={{ paddingRight: '2.75rem' }} />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(v => !v)}
                                                style={{
                                                    position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                                                    background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem',
                                                    color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'color 0.2s'
                                                }}
                                                title={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {mode === 'register' && (
                                        <div className="animate-fadeIn" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unit (Dept)</label>
                                                <select className="input" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                                                    <option value="CSE">CSE</option>
                                                    <option value="AIML">AIML</option>
                                                    <option value="IT">IT</option>
                                                    <option value="ECE">ECE</option>
                                                    <option value="ME">ME</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</label>
                                                <select className="input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} disabled>
                                                    <option value="student">Student</option>
                                                    <option value="professor">Professor</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    {error && (
                                        <div style={{ padding: '0.85rem 1rem', background: 'var(--toast-error-bg)', border: '1px solid var(--danger)', borderRadius: '12px', color: 'var(--danger)', fontSize: '0.82rem', fontWeight: 600 }}>
                                            ERROR: {error}
                                        </div>
                                    )}

                                    <button type="submit" className="btn btn-primary" disabled={loading || otpLoading || navigating} style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem', borderRadius: '12px' }}>
                                        {loading || otpLoading || navigating ? <div className="spinner" /> :
                                            mode === 'login' ? `Initialize ${selectedRole === 'admin' ? 'Dean' : selectedRole === 'professor' ? 'Faculty' : 'User'} Access` :
                                                otpSent ? 'Confirm & Register' : 'Request Security Token'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stylish Footer Info Section */}
                {!selectedRole && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        style={{ marginTop: 'var(--space-lg)', borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-lg)' }}
                    >
                        <div className="grid-responsive" style={{ textAlign: 'left' }}>
                            <div>
                                <h3 style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: '1rem' }}>Resolution Architecture</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, opacity: 0.8 }}>
                                    AcadX utilizes a peer-reviewed consensus mechanism to validate academic resolutions. Every interaction is cryptographically secured and indexed for institutional archive retrieval.
                                </p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: '1rem' }}>Network Metadata</h3>
                                <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>ENCRYPTION</span>
                                        <span style={{ color: 'var(--success)' }}>AES-256-GCM</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>LATENCY</span>
                                        <span style={{ color: 'var(--accent)' }}>12.4ms (GLOBAL)</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>NODE STATUS</span>
                                        <span style={{ color: 'var(--success)' }}>SYNCHRONIZED</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: '1rem' }}>Compliance</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, opacity: 0.8 }}>
                                    Fully compliant with Academic Tier-1 Security Standards. All data persists within the NIU Private University Cloud Infrastructure.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
