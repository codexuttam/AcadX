'use client'

import { useState } from 'react'
import InfoLayout from '@/components/InfoLayout'
import { X, Send, CheckCircle } from 'lucide-react'

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
            title="Contact Support"
            subtitle="Got a problem? Don't leave it to the gods. ✨"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1.6 }}>
                    Whether it's a bug in our code, a toxic user in the feed, or you just want to say hi, our team is always on standby for you.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div className="card" style={{ padding: '2rem', background: 'rgba(108, 99, 255, 0.05)', border: '1px solid var(--accent-glow)' }}>
                        <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>Email Us</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1rem' }}>We usually reply within 24 hours. No cap.</p>
                        <a href="mailto:supportacadx@gmail.com" style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none', borderBottom: '2px solid var(--accent)' }}>supportacadx@gmail.com</a>
                    </div>
                    <div className="card" style={{ padding: '2rem', background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                        <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem', color: '#a855f7' }}>Bug Report</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1rem' }}>Found something broken? Help us fix it and earn extra points.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            style={{ background: 'none', border: 'none', padding: 0, color: 'white', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', borderBottom: '2px solid #a855f7' }}
                        >
                            Submit a Ticket
                        </button>
                    </div>
                </div>

                <div style={{ padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>Frequently Asked</h4>
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
