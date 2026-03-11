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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--accent-glow)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}><Zap size={24} /></div>
                        <h3 style={{ fontWeight: 900, fontSize: '1.8rem', color: 'white' }}>Node Initialization</h3>
                    </div>
                    <div className="card" style={{ padding: '2.5rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)', borderRadius: '28px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {[
                                { step: "Authentification", desc: "Initialize your profile using your primary institutional email node. Unauthorized domains are blocked." },
                                { step: "Infrastructure Selection", desc: "Designate your engineering faculty to automatically filter your resolution feed." },
                                { step: "Query Deployment", desc: "Launch your first doubt protocol via the primary sidebar interface." }
                            ].map((s, i) => (
                                <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--accent)', background: 'var(--accent-glow)', width: 36, height: 36, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border)' }}>{i + 1}</div>
                                    <div>
                                        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem' }}>{s.step}</h4>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <motion.div whileHover={{ y: -5 }} style={{ padding: '2.5rem', background: 'rgba(168, 85, 247, 0.03)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '32px' }}>
                        <h4 style={{ fontWeight: 900, fontSize: '1.3rem', color: '#a855f7', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Award size={20} /> Resolution Points</h4>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', fontWeight: 500 }}>Contributions to the grid generate high-tier knowledge credits. Rack up solver cycles to ascend the global leaderboard.</p>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} style={{ padding: '2.5rem', background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '32px' }}>
                        <h4 style={{ fontWeight: 900, fontSize: '1.3rem', color: 'var(--success)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle2 size={20} /> Best Response</h4>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', fontWeight: 500 }}>Marked resolutions provide maximum knowledge dividends and verify your expertise in specific engineering domains.</p>
                    </motion.div>
                </div>
            </div>
        </InfoLayout>
    )
}

