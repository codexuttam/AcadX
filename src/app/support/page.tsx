'use client'

import { useState } from 'react'
import InfoLayout from '@/components/InfoLayout'
import { X, Send, CheckCircle, Layers, HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SupportPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [form, setForm] = useState({ subject: '', description: '' })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitted(true)
        setTimeout(() => {
            setIsModalOpen(false)
            setSubmitted(false)
            setForm({ subject: '', description: '' })
        }, 3000)
    }

    return (
        <InfoLayout
            title="Resolution Support"
            subtitle="Initiate a technical support protocol for system-wide resolution."
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', lineHeight: 1.7, textAlign: 'center', maxWidth: '700px', margin: '0 auto', fontWeight: 500 }}>
                    Whether it's an architectural bug in the grid, an unauthorized user presence, or a general synchronization query, our technical squad is on standby.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                    <motion.div whileHover={{ y: -12 }} className="card glass animate-fadeIn" style={{ padding: '3rem 2.5rem', background: 'rgba(108, 99, 255, 0.04)', border: '1px solid var(--accent)', borderRadius: '32px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                        <div style={{ width: 64, height: 64, borderRadius: '20px', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 30px var(--accent-glow)' }}>
                            <Send size={30} />
                        </div>
                        <h3 style={{ fontWeight: 950, fontSize: '1.5rem', marginBottom: '0.75rem', color: 'white', letterSpacing: '-0.02em' }}>Direct Transmission</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>Formal queries typically processed within a single deployment cycle.</p>
                        <a href="mailto:supportacadx@gmail.com" style={{ display: 'block', background: 'var(--accent)', color: 'white', padding: '1.25rem', borderRadius: '16px', fontWeight: 900, textDecoration: 'none', fontSize: '1.1rem', boxShadow: '0 8px 25px rgba(0,0,0,0.4)', transition: 'all 0.2s', letterSpacing: '0.05em' }}>supportacadx@gmail.com</a>
                    </motion.div>

                    <motion.div whileHover={{ y: -12 }} className="card glass animate-fadeIn" style={{ padding: '3rem 2.5rem', background: 'rgba(168, 85, 247, 0.04)', border: '1px solid #a855f7', borderRadius: '32px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                        <div style={{ width: 64, height: 64, borderRadius: '20px', background: '#a855f7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 30px rgba(168, 85, 247, 0.3)' }}>
                            <Layers size={30} />
                        </div>
                        <h3 style={{ fontWeight: 950, fontSize: '1.5rem', marginBottom: '0.75rem', color: 'white', letterSpacing: '-0.02em' }}>Resolution Ticket</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>Report architectural leaks and earn verified contributor credits in the grid.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            style={{ width: '100%', background: '#a855f7', border: 'none', color: 'white', padding: '1.25rem', borderRadius: '16px', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 8px 25px rgba(0,0,0,0.4)', transition: 'all 0.2s', letterSpacing: '0.05em' }}
                        >
                            Open System Ticket
                        </button>
                    </motion.div>
                </div>

                <div style={{ padding: '3rem', background: 'rgba(0,0,0,0.3)', borderRadius: '32px', border: '1px solid var(--border-light)', backdropFilter: 'blur(20px)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', color: 'var(--accent)' }}>
                        <HelpCircle size={22} />
                        <h4 style={{ fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Frequented Resolution Cycles</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { q: "How do I change my department?", a: "Go to your profile settings from the doubt feed sidebar." },
                            { q: "Can I delete my doubts once they're solved?", a: "Yes, but they will still be visible in the archive for others to learn from. Respect the grind." },
                            { q: "Is AcadX affiliated with the university?", a: "Yes, we work directly with the School of Engineering to ensure verified quality." }
                        ].map((faq, i) => (
                            <div key={i} style={{ paddingBottom: '1rem', borderBottom: i === 2 ? 'none' : '1px solid var(--border-light)' }}>
                                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Q: {faq.q}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>A: {faq.a}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ticket Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="card glass animate-fadeIn" style={{ maxWidth: '500px', width: '100%', padding: '2.5rem', position: 'relative', border: '1px solid var(--accent-glow)' }}>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        {submitted ? (
                            <div className="animate-fadeIn" style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <div style={{ color: 'var(--success)', marginBottom: '1.5rem' }}>
                                    <CheckCircle size={64} style={{ margin: '0 auto' }} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Ticket Sent!</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>The squad is on it. We'll get back to you soon. No cap.</p>
                            </div>
                        ) : (
                            <>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.5rem' }}>Submit a Ticket</h2>
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Subject</label>
                                        <input
                                            className="input"
                                            placeholder="What's the issue?"
                                            required
                                            value={form.subject}
                                            onChange={e => setForm({ ...form, subject: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Description</label>
                                        <textarea
                                            className="input"
                                            placeholder="Explain it like I'm five..."
                                            style={{ minHeight: '120px', resize: 'vertical' }}
                                            required
                                            value={form.description}
                                            onChange={e => setForm({ ...form, description: e.target.value })}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center', gap: '0.75rem' }}>
                                        <Send size={18} /> Send to the Squad
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </InfoLayout>
    )
}
