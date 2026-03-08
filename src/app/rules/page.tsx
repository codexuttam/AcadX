'use client'

import React from 'react'
import InfoLayout from '@/components/InfoLayout'

export default function RulesPage() {
    return (
        <InfoLayout
            title="Community Rules"
            subtitle="Treat others with respect. Follow the code of conduct. 🔥"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 500 }}>
                    We're here to help each other grow. No toxicity, no spam, no BS. Just academic rizz and high-quality vibes.
                </p>

                <div className="card" style={{ padding: '2.5rem', border: '1px solid var(--border-light)', background: 'var(--bg-card)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[
                            { title: "No Cap, Be Honest", desc: "Don't post generative AI answers without verification. If you don't know it, don't guess it. Respect the grind of those who study." },
                            { title: "Stay Respectful", desc: "Don't flame people for having 'stupid' doubts. We've all been there. Be the helpful main character." },
                            { title: "No Academic Dishonesty", desc: "AcadX is for clearing doubts, not for cheating on your exams. We're here for the learning, not the shortcut." },
                            { title: "Clean Content", desc: "Keep it professional. No NSFW, no offensive slurs, no toxic behavior. One strike and you're out." },
                            { title: "Subject Focus", desc: "Don't post off-topic rants in the doubt feed. We have social media for that. Keep the workspace clean." }
                        ].map((rule, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1.5rem', borderBottom: i === 4 ? 'none' : '1px solid var(--border-light)', paddingBottom: '1.5rem' }}>
                                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent)', minWidth: 40 }}>0{i + 1}</div>
                                <div>
                                    <h4 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.5rem' }}>{rule.title}</h4>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>{rule.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Breaking rules leads to an immediate ban from the platform. No exceptions. 🛑</p>
                </div>
            </div>
        </InfoLayout>
    )
}
