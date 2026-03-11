'use client'

import { motion } from 'framer-motion'
import { Database, Lock, Shield } from 'lucide-react'
import InfoLayout from '@/components/InfoLayout'

export default function PrivacyPage() {
    return (
        <InfoLayout
            title="Privacy Policy"
            subtitle="The fundamental security protocol protecting your digital sovereignty within the AcadX infrastructure."
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="proto-grid-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    <motion.div whileHover={{ y: -5 }} className="card glass-hover proto-item-card" style={{ transition: 'all 0.3s', borderRadius: '12px', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--accent)' }}>
                            <Database size={20} />
                            <h4 style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>Data Core</h4>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, fontWeight: 600 }}>We encrypt and store institutional metadata (Email, Department) exclusively for grid access synchronization.</p>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="card glass-hover proto-item-card" style={{ transition: 'all 0.3s', borderRadius: '12px', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#a855f7' }}>
                            <Lock size={20} />
                            <h4 style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>Security Layer</h4>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, fontWeight: 600 }}>Session persistence is maintained via transient secure nodes. Zero-tracking architecture is enforced across all modules.</p>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="card glass-hover proto-item-card" style={{ transition: 'all 0.3s', borderRadius: '12px', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#10b981' }}>
                            <Shield size={20} />
                            <h4 style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>Third Party</h4>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, fontWeight: 600 }}>Proprietary data is never distributed. Integrations serve purely functional roles in the academic resolution cycle.</p>
                    </motion.div>
                </div>

                <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', background: 'var(--bg-secondary)', fontWeight: 800, letterSpacing: '0.1em' }}>
                    LAST SYSTEM ACCREDITATION: MARCH 2026. PROTOCOL SECURED.
                </div>
            </div>
        </InfoLayout>
    )
}

