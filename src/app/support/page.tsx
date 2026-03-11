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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, textAlign: 'center', maxWidth: '700px', margin: '0 auto', fontWeight: 600 }}>
                    Whether it's an architectural bug in the grid, an unauthorized user presence, or a general synchronization query, our technical resolution squad is on standby.
                </p>

                <div className="proto-grid-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    <motion.div whileHover={{ y: -5 }} className="proto-item-card" style={{ textAlign: 'center', borderRadius: '16px', padding: '2rem' }}>
                        <div style={{ width: 54, height: 54, borderRadius: '14px', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                            <Send size={24} />
                        </div>
                        <h3 style={{ fontWeight: 950, fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Direct Transmission</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.6, fontWeight: 500 }}>Formal queries typically processed within a single deployment cycle.</p>
                        <a href="mailto:supportacadx@gmail.com" style={{ display: 'block', background: 'var(--accent)', color: 'white', padding: '0.9rem', borderRadius: '12px', fontWeight: 900, textDecoration: 'none', fontSize: '0.9rem', boxShadow: '0 10px 20px rgba(44, 89, 73, 0.15)', transition: 'all 0.3s', letterSpacing: '0.05em' }}>supportacadx@gmail.com</a>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="proto-item-card" style={{ textAlign: 'center', borderRadius: '16px', padding: '2rem' }}>
                        <div style={{ width: 54, height: 54, borderRadius: '14px', background: '#a855f7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                            <Layers size={24} />
                        </div>
                        <h3 style={{ fontWeight: 950, fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Resolution Ticket</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.6, fontWeight: 500 }}>Report architectural leaks and earn verified contributor credits in the grid.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            style={{ width: '100%', background: '#a855f7', border: 'none', color: 'white', padding: '0.9rem', borderRadius: '12px', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(168, 85, 247, 0.15)', transition: 'all 0.3s', letterSpacing: '0.05em' }}
                        >
                            Open System Ticket
                        </button>
                    </motion.div>
                </div>

                <div className="proto-item-card" style={{ backdropFilter: 'blur(30px)', borderRadius: '16px', padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                        <HelpCircle size={22} />
                        <h4 style={{ fontWeight: 900, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Frequented Resolution Cycles</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {[
                            { q: "How do I change my department node?", a: "Access your profile configuration from the primary doubt feed sidebar." },
                            { q: "Can I purge my doubts once resolved?", a: "Yes, but they remain archived within the institutional grid to facilitate peer-learning efficiency. Respect the grind." },
                            { q: "Is AcadX affiliated with the university?", a: "We operate as an independent engineering resolution hub, optimized specifically for institutional subject modules." }
                        ].map((faq, i) => (
                            <div key={i} className="proto-item-card" style={{ borderBottom: i === 2 ? 'none' : '1px solid var(--border)', marginBottom: '0.25rem', padding: '1rem' }}>
                                <div style={{ fontWeight: 900, fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Q: {faq.q}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 600 }}>A: {faq.a}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ticket Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(31, 59, 48, 0.15)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
                    <div style={{ maxWidth: '600px', width: '100%', padding: '4rem', position: 'relative', border: '1px solid var(--border)', background: '#ffffff', borderRadius: '44px', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.1)' }}>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{ position: 'absolute', top: '2.5rem', right: '2.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.75rem', borderRadius: '14px', transition: 'all 0.2s' }}
                        >
                            <X size={24} />
                        </button>

                        {submitted ? (
                            <div className="animate-fadeIn" style={{ textAlign: 'center', padding: '3rem 0' }}>
                                <div style={{ color: 'var(--accent)', marginBottom: '2rem' }}>
                                    <CheckCircle size={80} style={{ margin: '0 auto' }} />
                                </div>
                                <h3 style={{ fontSize: '2.2rem', fontWeight: 950, marginBottom: '1rem', color: 'var(--text-primary)' }}>Transmission Sent</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 600 }}>Our technical resolution squad has received your transmission. Protocol response initiated.</p>
                            </div>
                        ) : (
                            <>
                                <h2 style={{ fontSize: '2.4rem', fontWeight: 950, marginBottom: '2.5rem', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>Submit Protocol Ticket</h2>
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Transmission Subject</label>
                                        <input
                                            style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '1.25rem', borderRadius: '18px', outline: 'none', fontSize: '1.1rem', fontWeight: 500 }}
                                            placeholder="Identify the architectural anomaly..."
                                            required
                                            value={form.subject}
                                            onChange={e => setForm({ ...form, subject: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Detailed Breakdown</label>
                                        <textarea
                                            style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '1.25rem', borderRadius: '18px', outline: 'none', fontSize: '1.1rem', minHeight: '160px', resize: 'vertical', fontWeight: 500 }}
                                            placeholder="Provide a detailed architectural breakdown of the issue..."
                                            required
                                            value={form.description}
                                            onChange={e => setForm({ ...form, description: e.target.value })}
                                        />
                                    </div>
                                    <button type="submit" style={{ marginTop: '1rem', background: 'var(--accent)', color: 'white', border: 'none', padding: '1.5rem', borderRadius: '20px', fontWeight: 950, fontSize: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', boxShadow: '0 10px 30px rgba(44, 89, 73, 0.2)' }}>
                                        <Send size={22} /> Initialize Resolution Protocol
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
