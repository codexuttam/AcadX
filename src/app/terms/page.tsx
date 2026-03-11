'use client'

import { motion } from 'framer-motion'
import { Shield, Layers, X } from 'lucide-react'
import InfoLayout from '@/components/InfoLayout'

export default function TermsPage() {
    return (
        <InfoLayout
            title="Terms of Service"
            subtitle="The fundamental agreement governing institutional participation and intellectual integrity."
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <motion.section whileHover={{ x: 5 }} className="proto-item-card" style={{ borderRadius: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '10px', background: 'var(--accent-glow)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}><Shield size={22} /></div>
                        <h3 style={{ fontWeight: 900, fontSize: '1.6rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Binding Protocol</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, fontWeight: 600 }}>
                        By accessing the AcadX infrastructure, you acknowledge and agree to adhere to these operational protocols.
                        Systemic loyalty and professional integrity are the benchmarks of our collaboration.
                    </p>
                </motion.section>

                <motion.section whileHover={{ x: 5 }} className="proto-item-card" style={{ borderRadius: '16px' }}>
                    <div className="proto-flex-stack" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '10px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(168, 85, 247, 0.2)' }}><Layers size={22} /></div>
                        <h3 style={{ fontWeight: 900, fontSize: '1.6rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Intellectual Alignment</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, fontWeight: 600 }}>
                        All queries initialized within the grid remain your intellectual property, yet you grant AcadX a perpetual synchronization license for the collective advancement of the academic grid.
                    </p>
                </motion.section>

                <motion.section whileHover={{ x: 5 }} className="proto-item-card" style={{ borderRadius: '16px' }}>
                    <div className="proto-flex-stack" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}><X size={22} /></div>
                        <h3 style={{ fontWeight: 900, fontSize: '1.6rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>System Lockout</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, fontWeight: 600 }}>
                        We reserve the absolute right to terminate any session that deviates from institutional standards or degrades the quality of the resolution loop. Stay within protocol.
                    </p>
                </motion.section>

                <div style={{ marginTop: '1rem', padding: '1.25rem', border: '1px dashed #ef4444', borderRadius: '12px', color: '#b91c1c', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.1em', background: 'rgba(239, 68, 68, 0.05)', textAlign: 'center', textTransform: 'uppercase' }}>
                    NON-COMPLIANCE RESULTS IN IMMEDIATE AND IRREVERSIBLE ACCOUNT DE-SYNCHRONIZATION.
                </div>
            </div>
        </InfoLayout>
    )
}

