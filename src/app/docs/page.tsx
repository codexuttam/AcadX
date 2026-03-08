'use client'

import React from 'react'
import InfoLayout from '@/components/InfoLayout'

export default function DocsPage() {
    return (
        <InfoLayout
            title="Documentation"
            subtitle="The ultimate guide to clearing your doubts."
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <section>
                    <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>Getting Started</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        Welcome to AcadX. This platform is built specifically for the School of Engineering.
                        If you've got a doubt, we've got the solution. No cap.
                    </p>
                    <div className="card" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-light)' }}>
                        <ol style={{ marginLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-primary)' }}>
                            <li><strong>Sign up with your university email.</strong> We only allow verified students and professors on the platform.</li>
                            <li><strong>Choose your department.</strong> This helps us tailor your feed to relevant subjects.</li>
                            <li><strong>Ask your first doubt.</strong> Use the "Ask a Doubt" button in your sidebar.</li>
                        </ol>
                    </div>
                </section>

                <section>
                    <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '1rem', color: '#a855f7' }}>How to ask a Doubt</h3>
                    <ul style={{ marginLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                        <li>Title should be clear and concise. If your title is "Help me", nobody's gonna help you. Respect the grind.</li>
                        <li>Include a code snippet or a screenshot of the problem.</li>
                        <li>Specify the subject. This sends it to the experts for that field.</li>
                    </ul>
                </section>

                <section>
                    <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--success)' }}>Points & Rewards</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        The more you help others, the more "Academic Rizz" you earn. Rack up points to reach the top of the leaderboard and unlock exclusive perks.
                    </p>
                </section>
            </div>
        </InfoLayout>
    )
}
