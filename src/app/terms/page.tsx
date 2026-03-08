'use client'

import React from 'react'
import InfoLayout from '@/components/InfoLayout'

export default function TermsPage() {
    return (
        <InfoLayout
            title="Terms of Service"
            subtitle="The respect code. No cap. ✨"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <section>
                    <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>Agreement</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        By using AcadX, you agree to these rules. Breaking them means you're no longer the main character here.
                        No offense, but consistency and clarity are key to the grind.
                    </p>
                </section>

                <section>
                    <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '1rem', color: '#a855f7' }}>User-Generated Content</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        You own the doubts you post, but you give us the right to display them in the feed to help others.
                        We're here to contribute to the collective engineering brain-power.
                    </p>
                </section>

                <section>
                    <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--success)' }}>Account Termination</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        We reserve the right to ban any user who doesn't respect the community or uses the platform for academic dishonesty.
                        Stay real.
                    </p>
                </section>

                <p style={{ color: 'var(--text-secondary)', marginTop: '2rem' }}>
                    Failure to follow these rules results in a permanent ban. No refunds on the rizz you lost. 🔥
                </p>
            </div>
        </InfoLayout>
    )
}
