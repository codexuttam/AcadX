'use client'

import { motion } from 'framer-motion'
import { Zap, Award, CheckCircle2 } from 'lucide-react'
import InfoLayout from '@/components/InfoLayout'

export default function DocsPage() {
    return (
        <InfoLayout
            title="Getting Started"
            subtitle="The authoritative technical manual for synchronizing with the AcadX Knowledge Grid."
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '10px', background: 'var(--accent-glow)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}><Zap size={22} /></div>
                        <h3 style={{ fontWeight: 950, fontSize: '1.6rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Node Initialization</h3>
                    </div>
                    <div className="proto-item-card" style={{ backdropFilter: 'blur(30px)', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {[
                                { step: "Authentication", desc: "Initialize your profile using your primary institutional email node. Unauthorized domains are blocked." },
                                { step: "Infrastructure Selection", desc: "Designate your engineering faculty to automatically filter your resolution feed." },
                                { step: "Query Deployment", desc: "Launch your first doubt protocol via the primary sidebar interface." }
                            ].map((s, i) => (
                                <div key={i} className="proto-flex-stack" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                    <div style={{ fontSize: '1rem', fontWeight: 950, color: 'var(--accent)', background: 'var(--accent-glow)', width: 36, height: 36, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border)' }}>{i + 1}</div>
                                    <div>
                                        <h4 style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{s.step}</h4>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, fontWeight: 600 }}>{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="proto-grid-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <motion.div whileHover={{ y: -5 }} className="proto-item-card" style={{ background: 'rgba(168, 85, 247, 0.03)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '16px', padding: '1.75rem' }}>
                        <h4 style={{ fontWeight: 950, fontSize: '1.25rem', color: '#a855f7', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Award size={20} /> Resolution Points</h4>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem', fontWeight: 600 }}>Contributions to the grid generate high-tier knowledge credits. Rack up solver cycles to ascend the global leaderboard.</p>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} className="proto-item-card" style={{ background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '16px', padding: '1.75rem' }}>
                        <h4 style={{ fontWeight: 950, fontSize: '1.25rem', color: '#10b981', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle2 size={20} /> Best Response</h4>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem', fontWeight: 600 }}>Marked resolutions provide maximum knowledge dividends and verify your expertise in specific engineering domains.</p>
                    </motion.div>
                </div>
            </div>
        </InfoLayout>
    )
}

