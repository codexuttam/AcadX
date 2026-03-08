'use client'

import React from 'react'
import InfoLayout from '@/components/InfoLayout'
import { Cpu, Sparkles, MessageSquare } from 'lucide-react'

export default function AIPage() {
    return (
        <InfoLayout
            title="Ask Artificial"
            subtitle="The AI that gets your academic rizz level."
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--accent-glow)' }}>
                    <div style={{ padding: '1rem', background: 'var(--accent-glow)', borderRadius: '12px', color: 'var(--accent)' }}>
                        <Cpu size={32} />
                    </div>
                    <div>
                        <h3 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.25rem' }}>Next-Gen Intelligence</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Optimized for engineering logic and complex doubt resolution.</p>
                    </div>
                </div>

                <p>
                    AcadX AI is trained on millions of engineering problems, textbooks, and research papers from premium sources like IEEE, ACM, and MIT OpenCourseWare.
                    No cap, we're building the most advanced academic assistant ever.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="card" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: 600 }}><Sparkles size={18} color="var(--accent)" /> Smart Suggestions</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Identifies similar solved questions before you even finish typing.</p>
                    </div>
                    <div className="card" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: 600 }}><MessageSquare size={18} color="#a855f7" /> Step-by-Step</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Breaks down complex derivations into simple, manageable logical steps.</p>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem' }}>✨ Launching in Beta Q3 2026</p>
                </div>
            </div>
        </InfoLayout>
    )
}
