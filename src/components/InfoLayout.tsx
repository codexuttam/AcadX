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
        <div style={{ background: 'var(--body-bg, #f6fbfc)', color: 'var(--text-primary)', minHeight: '100vh', padding: '6rem 2rem', position: 'relative', overflow: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
            {/* Background elements - Light Sync */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 10%, rgba(44, 89, 73, 0.05), transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
            <div style={{ position: 'absolute', top: '-15%', left: '-15%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(46, 209, 153, 0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: '-15%', right: '-15%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(46, 89, 73, 0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

            <div className="proto-container">
                <Link href="/" className="btn btn-ghost" style={{ marginBottom: '3rem', paddingLeft: '0.75rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', boxShadow: 'var(--glass-shadow)' }}>
                    <ArrowLeft size={18} /> <span style={{ fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Return to Hub</span>
                </Link>

                <header className="proto-header" style={{ marginBottom: '5.5rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent)', marginBottom: '1.5rem', background: 'var(--accent-glow)', padding: '0.6rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <Shield size={16} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase' }}>Institutional Protocol</span>
                    </div>
                    <h1 className="proto-title" style={{ fontWeight: 950, letterSpacing: '-0.04em', marginBottom: '1.25rem', lineHeight: 1, color: 'var(--text-primary)', background: 'linear-gradient(to bottom, var(--text-primary), var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{title}</h1>
                    {subtitle && <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 600, maxWidth: '700px', margin: '1.5rem auto 0', lineHeight: 1.6 }}>{subtitle}</p>}
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        padding: '0',
                        borderRadius: '20px',
                        border: '1px solid var(--border)',
                        boxShadow: '0 50px 100px -20px rgba(44, 89, 73, 0.1)',
                        overflow: 'hidden',
                        background: 'var(--bg-card)',
                        backdropFilter: 'blur(30px)'
                    }}
                >
                    <div className="proto-card-inner" style={{ color: 'var(--text-primary)' }}>
                        {children}
                    </div>
                </motion.div>

                <footer style={{ marginTop: '7rem', padding: '4rem 0', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: 50, height: 1, background: 'linear-gradient(to left, var(--border), transparent)' }} />
                        <p style={{ fontSize: '0.85rem', fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--accent)' }}>AcadX Resolution Core</p>
                        <div style={{ width: 50, height: 1, background: 'linear-gradient(to right, var(--border), transparent)' }} />
                    </div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.8, letterSpacing: '0.05em' }}>© 2026 Institutional Knowledge Grid. All protocols verified.</p>
                </footer>
            </div>
        </div>
    )
}



