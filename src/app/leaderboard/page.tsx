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
            subtitle="The definitive hierarchy of intellectual contribution within the institutional knowledge grid."
        >
            <div className="proto-flex-stack" style={{ gap: 'var(--space-lg)' }}>
                <div style={{ padding: 'var(--space-md)', background: 'rgba(44, 89, 73, 0.04)', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center', boxShadow: '0 20px 40px rgba(44, 89, 73, 0.05)', backdropFilter: 'blur(10px)' }}>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem', color: 'var(--accent)' }}>
                        <TrendingUp size={24} /> <Star size={24} fill="currentColor" /> <Award size={24} />
                    </div>
                    <h3 style={{ fontWeight: 950, fontSize: 'var(--font-h3)', marginBottom: '0.5rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Architectural Elite</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '550px', margin: '0 auto', fontWeight: 600, lineHeight: 1.6 }}>These neural nodes exhibit the highest resolution efficiency and structural mastery within the global workspace.</p>
                </div>

                <div className="proto-flex-stack" style={{ gap: '0.75rem' }}>
                    {LEADERBOARD_DATA.map((entry, i) => {
                        const isTop1 = entry.rank === 1;
                        const isTop2 = entry.rank === 2;
                        const isTop3 = entry.rank === 3;

                        const rankColor = isTop1 ? '#ffd400' : isTop2 ? '#94a3b8' : isTop3 ? '#92400e' : 'var(--text-muted)';

                        return (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.005, x: 5 }}
                                className="proto-item-card"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'clamp(0.5rem, 3vw, 1.25rem)',
                                    background: isTop1 ? 'rgba(255, 212, 0, 0.05)' : 'transparent',
                                    borderRadius: '12px',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    padding: 'var(--space-sm)'
                                }}
                            >
                                <div style={{
                                    fontSize: 'var(--font-h3)',
                                    fontWeight: 950,
                                    color: rankColor,
                                    width: 'clamp(30px, 5vw, 45px)',
                                    textAlign: 'center',
                                    filter: (isTop1 || isTop2 || isTop3) ? `drop-shadow(0 0 10px ${rankColor}44)` : 'none',
                                    fontFamily: 'monospace',
                                    flexShrink: 0
                                }}>
                                    {entry.rank}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 900, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', flexWrap: 'wrap' }}>
                                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.name}</span>
                                        <div className="tag" style={{ background: 'var(--accent-glow)', color: 'var(--accent)', fontSize: '0.6rem', padding: '0.15rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border)', fontWeight: 900, letterSpacing: '0.1em' }}>{entry.department}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 'clamp(0.5rem, 2vw, 1.5rem)', marginTop: '0.2rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, flexWrap: 'wrap' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Star size={12} color="#ffd400" fill="#ffd400" /> <b style={{ color: 'var(--text-primary)' }}>{entry.score.toLocaleString()}</b> Rizz</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Trophy size={12} color="var(--accent)" /> <b style={{ color: 'var(--text-primary)' }}>{entry.solved}</b> Resolves</span>
                                    </div>
                                </div>
                                {(isTop1 || isTop2 || isTop3) && (
                                    <div className="desktop-only" style={{ color: rankColor, background: `${rankColor}11`, padding: '0.75rem', borderRadius: '12px', border: `1px solid ${rankColor}22` }}>
                                        <Trophy size={20} />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                <div style={{ marginTop: 'var(--space-lg)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.15em', padding: '2rem 1rem', borderTop: '1px solid var(--border)', lineHeight: 1.4 }}>
                    <p>SYNCHRONIZATION CYCLE ACTIVATED — MAINTAIN OPERATIONAL FOCUS</p>
                </div>
            </div>
        </InfoLayout>
    )
}

