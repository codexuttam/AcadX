'use client'

import React from 'react'
import InfoLayout from '@/components/InfoLayout'

export default function PrivacyPage() {
    return (
        <InfoLayout
            title="Privacy Policy"
            subtitle="We value your privacy. No cap. ✨"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <section>
                    <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>Data Collection</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        We collect Your Name, Your University Email, and your Department. This is only to ensure that the platform stays acad-focused and no outsiders get the main character vibes.
                    </p>
                </section>

                <section>
                    <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '1rem', color: '#a855f7' }}>Cookie Usage</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        We only use cookies to keep you logged in. No trackers, no data-shady stuff. We respect your digital space.
                    </p>
                </section>

                <section>
                    <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--success)' }}>Third Party Sharing</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        We never sell your data. We only share it if required by law or to provide you with features like Gravatar/Prisma integration.
                        Your doubts belong to you.
                    </p>
                </section>

                <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Last updated: March 2026. Stay safe.
                </div>
            </div>
        </InfoLayout>
    )
}
