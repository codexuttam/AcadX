'use client'

import React from 'react'
import InfoLayout from '@/components/InfoLayout'
import { Cpu, Library, ClipboardCheck, Bot, Microscope } from 'lucide-react'

export default function AIPage() {
    return (
        <InfoLayout
            title="Ask Artificial"
            subtitle="The advanced neural architecture for academic research and resolution."
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <div className="proto-flex-stack proto-item-card" style={{ gap: '1.25rem', transition: 'all 0.3s', borderRadius: '16px', alignItems: 'center' }}>
                    <div style={{ padding: '0.75rem', background: 'var(--accent-glow)', borderRadius: '10px', color: 'var(--accent)', border: '1px solid var(--border)', flexShrink: 0 }}>
                        <Cpu size={28} />
                    </div>
                    <div>
                        <h3 style={{ fontWeight: 900, fontSize: '1.4rem', marginBottom: '0.2rem', color: 'var(--text-primary)' }}>Neural Intelligence Core</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, fontWeight: 600 }}>Optimized for structural engineering logic and multi-phase doubt resolution.</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '0.5rem 0' }}>
                    <Library size={20} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '0.2rem' }} />
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-primary)', fontWeight: 600 }}>
                        AcadX AI is synthesized from millions of peer-reviewed engineering problems, scholarly textbooks, and institutional research papers.
                        This protocol represents our commitment to building the most sophisticated academic resolution auxiliary in the grid.
                    </p>
                </div>

                <div className="proto-grid-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                    <div className="proto-item-card" style={{ transition: 'all 0.3s', borderRadius: '12px', padding: '1.5rem' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', fontWeight: 900, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>
                            <ClipboardCheck size={18} /> Smart Suggestions
                        </h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, fontWeight: 600 }}>Identifies historically solved queries within the grid infrastructure before protocol finalization.</p>
                    </div>
                    <div className="proto-item-card" style={{ transition: 'all 0.3s', borderRadius: '12px', padding: '1.5rem' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', fontWeight: 900, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>
                            <Bot size={18} /> Step-by-Step
                        </h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, fontWeight: 600 }}>Deconstructs architectural derivations into managed, verifiable logical nodes.</p>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center', padding: '2.5rem', border: '1px dashed var(--border)', borderRadius: '32px', background: 'var(--accent-glow)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', color: 'var(--accent)' }}>
                        <Microscope size={22} />
                        <p style={{ fontWeight: 900, fontSize: '0.95rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                            Synchronizing Beta Access — Q3 2026
                        </p>
                    </div>
                </div>
            </div>
        </InfoLayout>
    )
}
