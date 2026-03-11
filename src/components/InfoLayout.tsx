'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

export interface InfoLayoutProps {
    title: string
    children: React.ReactNode
    subtitle?: string
}

export default function InfoLayout({ title, children, subtitle }: InfoLayoutProps) {
    return (
        <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', padding: '6rem 2rem', position: 'relative', overflow: 'hidden' }}>
            {/* Background elements */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 10%, var(--glow-spot), transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0, opacity: 0.5 }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0, opacity: 0.5 }} />

            <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <Link href="/" className="btn btn-ghost" style={{ marginBottom: '3rem', paddingLeft: '0.75rem', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'rgba(255,255,255,0.02)' }}>
                    <ArrowLeft size={18} /> <span style={{ fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Return to Hub</span>
                </Link>

                <header style={{ marginBottom: '5rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent)', marginBottom: '1rem', background: 'var(--accent-glow)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <Shield size={16} />
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase' }}>Institutional Protocol</span>
                    </div>
                    <h1 className="gradient-text" style={{ fontSize: '4.2rem', fontWeight: 950, letterSpacing: '-0.05em', marginBottom: '1rem', lineHeight: 1 }}>{title}</h1>
                    {subtitle && <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', fontWeight: 600, maxWidth: '600px', margin: '1rem auto 0', lineHeight: 1.5 }}>{subtitle}</p>}
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card glass tilt-3d"
                    style={{ padding: '0', borderRadius: '40px', border: '1px solid var(--border)', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)', overflow: 'hidden', background: 'rgba(10,10,10,0.4)' }}
                >
                    <div style={{ padding: '4rem', color: 'var(--text-primary)' }}>
                        {children}
                    </div>
                </motion.div>

                <footer style={{ marginTop: '6rem', padding: '3rem 0', borderTop: '1px solid var(--border-light)', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: 40, height: 1, background: 'linear-gradient(to left, var(--border-light), transparent)' }} />
                        <p style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase' }}>AcadX Resolution Core</p>
                        <div style={{ width: 40, height: 1, background: 'linear-gradient(to right, var(--border-light), transparent)' }} />
                    </div>
                    <p style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.6 }}>© 2026 Institutional Knowledge Grid. All protocols verified.</p>
                </footer>
            </div>
        </div>
    )
}

