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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <motion.section whileHover={{ x: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--accent-glow)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}><Shield size={24} /></div>
                        <h3 style={{ fontWeight: 900, fontSize: '1.8rem', color: 'white', letterSpacing: '-0.02em' }}>Binding Protocol</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, fontWeight: 500 }}>
                        By accessing the AcadX infrastructure, you acknowledge and agree to adhere to these operational protocols.
                        Systemic loyalty and professional integrity are the benchmarks of our collaboration.
                    </p>
                </motion.section>

                <motion.section whileHover={{ x: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(168, 85, 247, 0.2)' }}><Layers size={24} /></div>
                        <h3 style={{ fontWeight: 900, fontSize: '1.8rem', color: 'white', letterSpacing: '-0.02em' }}>Intellectual Alignment</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, fontWeight: 500 }}>
                        All queries initialized within the grid remain your intellectual property, yet you grant AcadX a perpetual synchronization license for the collective advancement of the academic grid.
                    </p>
                </motion.section>

                <motion.section whileHover={{ x: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}><X size={24} /></div>
                        <h3 style={{ fontWeight: 900, fontSize: '1.8rem', color: 'white', letterSpacing: '-0.02em' }}>System Lockout</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, fontWeight: 500 }}>
                        We reserve the absolute right to terminate any session that deviates from institutional standards or degrades the quality of the resolution loop. Stay within protocol.
                    </p>
                </motion.section>

                <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px dashed var(--danger)', borderRadius: '20px', color: 'var(--danger)', fontWeight: 900, fontSize: '0.85rem', letterSpacing: '0.1em', background: 'rgba(239, 68, 68, 0.05)', textAlign: 'center' }}>
                    NON-COMPLIANCE RESULTS IN IMMEDIATE AND IRREVERSIBLE ACCOUNT DE-SYNCHRONIZATION.
                </div>
            </div>
        </InfoLayout>
    )
}

