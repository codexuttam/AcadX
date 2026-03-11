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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    <motion.div whileHover={{ y: -5 }} className="card glass-hover" style={{ padding: '2.5rem', background: 'rgba(108, 99, 255, 0.03)', border: '1px solid var(--accent)', borderRadius: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.25rem', color: 'var(--accent)' }}>
                            <Database size={22} />
                            <h4 style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.9rem' }}>Data Core</h4>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, fontWeight: 500 }}>We encrypt and store institutional metadata (Email, Department) exclusively for grid access synchronization.</p>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="card glass-hover" style={{ padding: '2.5rem', background: 'rgba(168, 85, 247, 0.03)', border: '1px solid #a855f7', borderRadius: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.25rem', color: '#a855f7' }}>
                            <Lock size={22} />
                            <h4 style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.9rem' }}>Security Layer</h4>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, fontWeight: 500 }}>Session persistence is maintained via transient secure nodes. Zero-tracking architecture is enforced across all modules.</p>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="card glass-hover" style={{ padding: '2.5rem', background: 'rgba(16, 185, 129, 0.03)', border: '1px solid var(--success)', borderRadius: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.25rem', color: 'var(--success)' }}>
                            <Shield size={22} />
                            <h4 style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.9rem' }}>Third Party</h4>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, fontWeight: 500 }}>Proprietary data is never distributed. Integrations serve purely functional roles in the academic resolution cycle.</p>
                    </motion.div>
                </div>

                <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid var(--border-light)', borderRadius: '24px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', background: 'rgba(255,255,255,0.02)', fontWeight: 800, letterSpacing: '0.1em' }}>
                    LAST SYSTEM ACCREDITATION: MARCH 2026. PROTOCOL SECURED.
                </div>
            </div>
        </InfoLayout>
    )
}

