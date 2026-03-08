'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export interface InfoLayoutProps {
    title: string
    children: React.ReactNode
    subtitle?: string
}

export default function InfoLayout({ title, children, subtitle }: InfoLayoutProps) {
    return (
        <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', padding: '4rem 2rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Link href="/" className="btn btn-ghost" style={{ marginBottom: '2rem', paddingLeft: 0 }}>
                    <ArrowLeft size={20} /> Back to Home
                </Link>

                <header style={{ marginBottom: '4rem' }}>
                    <h1 className="gradient-text" style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.04em' }}>{title}</h1>
                    {subtitle && <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '1rem' }}>{subtitle}</p>}
                </header>

                <div className="card glass" style={{ padding: '3rem', border: '1px solid var(--border-light)' }}>
                    <div style={{ lineHeight: 1.8, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                        {children}
                    </div>
                </div>

                <footer style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid var(--border-light)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    © 2026 AcadX Platform. Built for the grind.
                </footer>
            </div>
        </div>
    )
}
