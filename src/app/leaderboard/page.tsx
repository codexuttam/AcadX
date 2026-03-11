'use client'

import { motion } from 'framer-motion'
import { Trophy, Star, TrendingUp, Award } from 'lucide-react'
import InfoLayout from '@/components/InfoLayout'

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
            subtitle="The definitive hierarchy of intellectual contribution within the knowledge grid."
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <div style={{ padding: '3rem', background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.05), rgba(168, 85, 247, 0.05))', borderRadius: '32px', border: '1px solid var(--accent-glow)', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--warning)' }}>
                        <TrendingUp size={32} /> <Star size={32} fill="var(--warning)" /> <Award size={32} />
                    </div>
                    <h3 style={{ fontWeight: 950, fontSize: '1.8rem', marginBottom: '0.75rem', color: 'white' }}>Top 1% Contributors</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', fontWeight: 500 }}>These nodes exhibit unparalleled resolution efficiency and architectural understanding.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {LEADERBOARD_DATA.map((entry, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.02, x: 5 }}
                            className="card glow-card tilt-3d"
                            style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', background: 'rgba(20,20,20,0.4)', borderRadius: '32px', border: entry.rank === 1 ? '1px solid var(--warning)' : '1px solid var(--border)' }}
                        >
                            <div style={{ fontSize: '2.5rem', fontWeight: 950, color: entry.rank === 1 ? 'var(--warning)' : 'var(--text-muted)', width: '60px', textAlign: 'center', filter: entry.rank === 1 ? 'drop-shadow(0 0 10px rgba(255,212,0,0.3))' : 'none' }}>
                                #{entry.rank}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 900, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'white' }}>
                                    {entry.name}
                                    <div className="tag" style={{ background: 'var(--accent-glow)', color: 'var(--accent)', fontSize: '0.8rem', padding: '0.4rem 0.8rem', borderRadius: '10px', border: '1px solid var(--border)', fontWeight: 800 }}>{entry.department} NODE</div>
                                </div>
                                <div style={{ display: 'flex', gap: '2rem', marginTop: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 600 }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Star size={18} color="var(--warning)" fill="var(--warning)" /> {entry.score.toLocaleString()} Rizz Units</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Trophy size={18} color="var(--success)" /> {entry.solved} Systematic Resolves</span>
                                </div>
                            </div>
                            {entry.rank === 1 && <div style={{ color: 'var(--warning)', background: 'rgba(255,212,0,0.1)', padding: '0.5rem', borderRadius: '12px' }}><Trophy size={32} /></div>}
                        </motion.div>
                    ))}
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                    <p>SYNCHRONIZATION CYCLE: 24 HOURS. MAINTAIN OPERATIONAL FOCUS. ⚡</p>
                </div>
            </div>
        </InfoLayout>
    )
}

