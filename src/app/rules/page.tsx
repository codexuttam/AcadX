'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, Scale, Layers, CheckCircle2 } from 'lucide-react'
import InfoLayout from '@/components/InfoLayout'

export default function RulesPage() {
    return (
        <InfoLayout
            title="Community Rules"
            subtitle="The fundamental code of conduct for institutional collaboration and resolution integrity."
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {[
                        { title: "Verifiable Accuracy", icon: <CheckCircle2 size={24} />, desc: "Do not disseminate AI-generated content without rigorous individual verification. Respect the intellectual integrity of the grid." },
                        { title: "Protocol Decorum", icon: <Shield size={24} />, desc: "Maintain absolute professional decorum. Constructive criticism only. Aggressive behaviors result in immediate lockout." },
                        { title: "Academic Integrity", icon: <Lock size={24} />, desc: "AcadX is a resolution hub, not a circumvention utility. Use it to expand knowledge, not to automate shortcuts." },
                        { title: "Grid Standards", icon: <Scale size={24} />, desc: "The platform maintains engineering-grade standards. Offensive or irrelevant data nodes will be purged on detection." },
                        { title: "Subject Relevance", icon: <Layers size={24} />, desc: "Initialize doubts only within their designated infrastructures. Keep the collaborative workspace logically filtered." }
                    ].map((rule, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ x: 10, background: 'rgba(255,255,255,0.02)' }}
                            style={{ display: 'flex', gap: '2rem', background: 'rgba(0,0,0,0.2)', padding: '2.5rem', borderRadius: '28px', border: '1px solid var(--border-light)', transition: 'all 0.2s' }}
                        >
                            <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'var(--accent-glow)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border)' }}>
                                {rule.icon}
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 950, fontSize: '1.4rem', marginBottom: '0.6rem', color: 'white', letterSpacing: '-0.02em' }}>{rule.title}</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, fontWeight: 500 }}>{rule.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '1rem', padding: '1.5rem', border: '1px dashed var(--danger)', borderRadius: '20px', color: 'var(--danger)', fontWeight: 900, fontSize: '0.85rem', letterSpacing: '0.1em', background: 'rgba(239, 68, 68, 0.05)' }}>
                    VIOLATION DETECTION TRIGGERS IMMEDIATE AND PERMANENT DE-SYNCHRONIZATION.
                </div>
            </div>
        </InfoLayout>
    )
}

