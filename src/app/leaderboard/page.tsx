'use client'

import React from 'react'
import InfoLayout from '@/components/InfoLayout'
import { Trophy, Star, TrendingUp, Award } from 'lucide-react'

const LEADERBOARD_DATA = [
    { rank: 1, name: 'Anushka S.', score: 14200, solved: 120, department: 'CSE' },
    { rank: 2, name: 'Uttamraj Singh', score: 12850, solved: 95, department: 'AIML' },
    { rank: 3, name: 'Priya K.', score: 11200, solved: 88, department: 'IT' },
    { rank: 4, name: 'Rohan M.', score: 9600, solved: 72, department: 'ECE' },
    { rank: 5, name: 'Siddhant V.', score: 8400, solved: 64, department: 'ME' }
]

export default function LeaderboardPage() {
    return (
        <InfoLayout
            title="The Leaderboard"
            subtitle="Who's got the most academic rizz? The grind is real. 🔥"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <div style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.1), rgba(168, 85, 247, 0.1))', borderRadius: '16px', border: '1px solid var(--accent-glow)', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem', color: 'var(--warning)' }}>
                        <TrendingUp size={24} /> <Star size={24} fill="var(--warning)" /> <Award size={24} />
                    </div>
                    <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.5rem' }}>Top 1% Contributors</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>These students are literally built different. They help the most, they solve the hardest.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {LEADERBOARD_DATA.map((entry, i) => (
                        <div key={i} className="card glow-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 900, color: entry.rank === 1 ? 'var(--warning)' : 'var(--text-muted)', width: '40px', textAlign: 'center' }}>
                                #{entry.rank}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {entry.name}
                                    <span className="tag" style={{ background: 'var(--accent-glow)', color: 'var(--accent)', fontSize: '0.7rem' }}>{entry.department}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Star size={14} color="#ffd400" fill="#ffd400" /> {entry.score.toLocaleString()} Points</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Trophy size={14} color="var(--success)" /> {entry.solved} Resolves</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <p>Leaderboard refreshes every 24 hours. Keep grinding. ⚡</p>
                </div>
            </div>
        </InfoLayout>
    )
}
