'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, MessageSquare, Shield, ArrowRight, Star, Cpu, BookOpen, ChevronDown, Award } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ENGINEERING_FACTS } from '@/data/facts'

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className="card glass glow-card"
      style={{
        padding: '1.25rem 1.5rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: isOpen ? '1px solid var(--accent)' : '1px solid var(--border-light)',
        background: isOpen ? 'rgba(108, 99, 255, 0.05)' : 'var(--bg-card)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{question}</h3>
        <ChevronDown
          size={20}
          style={{
            transition: 'transform 0.3s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: isOpen ? 'var(--accent)' : 'var(--text-secondary)'
          }}
        />
      </div>
      {isOpen && (
        <p className="animate-fadeIn" style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
          {answer}
        </p>
      )}
    </div>
  )
}

function DraggableTeacher() {
  const [fact, setFact] = useState("")
  const [showFact, setShowFact] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [message, setMessage] = useState("")

  const getRandomFact = () => {
    const randomFact = ENGINEERING_FACTS[Math.floor(Math.random() * ENGINEERING_FACTS.length)]
    setFact(randomFact)
    setShowFact(true)
    setTimeout(() => setShowFact(false), 6000)
  }

  const handleDragStart = () => {
    setIsDragging(true)
    setMessage("Don't mess with me or I'll throw a fact!")
    setShowFact(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    getRandomFact()
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <AnimatePresence>
        {showFact && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: -120, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              background: isDragging ? '#ef4444' : 'var(--accent)',
              color: 'white',
              padding: '1rem',
              borderRadius: '12px',
              width: '280px',
              zIndex: 100,
              boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
              fontSize: '0.95rem',
              fontWeight: 700,
              textAlign: 'center',
              border: '2px solid rgba(255,255,255,0.2)',
              pointerEvents: 'none'
            }}
          >
            {isDragging ? message : fact}
            <div style={{
              position: 'absolute',
              bottom: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: `12px solid ${isDragging ? '#ef4444' : 'var(--accent)'}`
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        drag
        dragConstraints={{ left: -150, right: 150, top: -150, bottom: 150 }}
        whileHover={{ scale: 1.15, rotateY: 15 }}
        whileTap={{ scale: 0.95, cursor: 'grabbing' }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={getRandomFact}
        style={{
          width: '200px',
          height: '200px',
          cursor: 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          position: 'relative',
          filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.8))',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Emo Professor Image */}
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: '30px',
          overflow: 'hidden',
          border: '2px solid rgba(168, 85, 247, 0.3)',
          background: '#0a0a0a',
          position: 'relative',
          zIndex: 2
        }}>
          <Image
            src="/emo-prof.png"
            alt="Emo Professor"
            width={200}
            height={200}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Floating Laptop */}
        <motion.div
          animate={{ rotate: [0, 10, 0], y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          style={{
            fontSize: '3.5rem',
            position: 'absolute',
            bottom: '-10px',
            right: '-20px',
            zIndex: 6,
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.6))'
          }}
        >
          💻
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function LandingPage() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)

    // Auth check - client side
    // NOTE: previously this redirected authenticated users from the landing page
    // straight to /admin or /feed. That made it impossible to view the marketing
    // landing while signed in. Keep the check for UI purposes but do NOT
    // automatically navigate away from the landing page.
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) return
        const data = await res.json()
        // we keep the user info in local state if needed in future, but do not
        // redirect from the landing page. Protected pages already perform
        // server-side redirects where necessary.
        // Example: you can still redirect programmatically where appropriate:
        // if (data.user && shouldRedirect) router.push('/feed')
        // For now, no automatic navigation.
        // (If you prefer the old behavior, set `shouldRedirect` based on a
        // query param or env variable.)
      } catch (err) {
        // fail silently
      }
    }
    checkAuth()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [router])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setHoverPos({ x, y })
  }

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 100,
        padding: '1.25rem 2rem', transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(0,0,0,0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-light)' : 'none'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative', width: 40, height: 40, overflow: 'hidden' }}>
              <Image src="/logo.png" alt="AcadX Logo" fill style={{ objectFit: 'contain' }} />
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '-0.04em', background: 'linear-gradient(to right, #fff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AcadX</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link href="/login" className="btn btn-ghost" style={{ fontSize: '0.85rem' }}>Login</Link>
            <Link href="/login?register=true" className="btn btn-primary" style={{ fontSize: '0.85rem', boxShadow: '0 0 15px var(--accent-glow)' }}>Join Now</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header ref={heroRef} onMouseMove={handleMouseMove} style={{
        padding: '12rem 2rem 8rem', textAlign: 'center', position: 'relative',
        overflow: 'hidden', background: '#000'
      }}>
        <div className="hero-4d-bg" />
        <div className="hero-layer" />
        <div className="grid-bg" />
        <div className="ambient-orb" style={{ top: '10%', left: '5%' }} />
        <div className="ambient-orb" style={{ bottom: '15%', right: '5%', animationDelay: '2s' }} />

        <div className="animate-fadeIn" style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div className="tag" style={{ background: 'var(--accent-glow)', color: 'var(--accent)', marginBottom: '2rem', padding: '0.5rem 1.25rem', fontSize: '0.85rem', fontWeight: 600, border: '1px solid var(--accent-glow)' }}>
            INSTITUTIONAL GRADE • ACADEMIC INTEGRITY • SCALE 1.0
          </div>
          <h1 className="premium-text" style={{ fontSize: 'clamp(3rem, 10vw, 5.5rem)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.05em', marginBottom: '2.5rem' }}>
            The New Standard in Engineering Logic.
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 3.5rem', lineHeight: 1.7, fontWeight: 400 }}>
            An enterprise-level knowledge exchange for technical faculty and verified students. Clear confusion with peer-reviewed derivations and real-time expert oversight.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
            <Link href="/login?register=true" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem', fontWeight: 600 }}>
              Initialize Access <ArrowRight size={18} />
            </Link>
            <a href="#pulse" className="btn btn-outline" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>View Directives</a>
          </div>
        </div>

        {/* 4D Floating System Monitor */}
        <div className="perspective-1000 animate-float" style={{ marginTop: '7rem', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
          <div className="glass tilt-3d glow-card" style={{
            padding: '2.5rem', borderRadius: '32px', width: '400px',
            transform: `perspective(1200px) rotateX(${(hoverPos.y - 0.5) * 15}deg) rotateY(${(hoverPos.x - 0.5) * 15}deg)`,
            boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(30px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="live-indicator"></div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.1em' }}>LIVE FEED</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>SEC_CODE: 0x42F</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="avatar" style={{ border: '2px solid var(--accent)' }}>A</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>Anushka S.</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Senior • CSE Department</div>
              </div>
            </div>

            <h3 style={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.4 }}>Deriving the boundary conditions for a perfect conductor in EM fields?</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div className="tag" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontSize: '0.65rem' }}>Electromagnetics</div>
              <div className="tag" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', fontSize: '0.65rem' }}>Maxwells_Eq</div>
            </div>

            <div style={{ marginTop: '2.5rem', padding: '1.25rem', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={16} color="var(--success)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Verified Resolution</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'left' }}>Professor Rajesh validated this analytical derivation on 08.03.2026</p>
            </div>
          </div>
        </div>
      </header>

      {/* Real-time Ticker */}
      <div className="ticker-wrap">
        <div className="ticker">
          {[
            "SOLVED: DERIVATION OF BERNOULLI'S PRINCIPLE • VERIFIED BY DR. MEHTA",
            "NEW: THERMODYNAMICS ASSIGNMENT D-10 POSTED IN MECHANICAL",
            "SOLVED: TRANSISTOR BIASING ANALYSIS • VERIFIED BY PROF. KAUR",
            "NEW: DATA STRUCTURES DOUBT ARCHIVED FOR CSE L300",
            "SOLVED: STOCHASTIC PROCESSES EVALUATION • VERIFIED BY DR. REDDY",
            "NEW: FLUID MECHANICS LAB SOLUTIONS NOW SYNCED"
          ].map((text, i) => (
            <div key={i} className="ticker-item">
              <span className="live-dot" /> {text}
            </div>
          ))}
          {/* Double the array for seamless loop */}
          {[
            "SOLVED: DERIVATION OF BERNOULLI'S PRINCIPLE • VERIFIED BY DR. MEHTA",
            "NEW: THERMODYNAMICS ASSIGNMENT D-10 POSTED IN MECHANICAL",
            "SOLVED: TRANSISTOR BIASING ANALYSIS • VERIFIED BY PROF. KAUR",
            "NEW: DATA STRUCTURES DOUBT ARCHIVED FOR CSE L300",
            "SOLVED: STOCHASTIC PROCESSES EVALUATION • VERIFIED BY DR. REDDY",
            "NEW: FLUID MECHANICS LAB SOLUTIONS NOW SYNCED"
          ].map((text, i) => (
            <div key={`dup-${i}`} className="ticker-item">
              <span className="live-dot" /> {text}
            </div>
          ))}
        </div>
      </div>

      <div className="section-divider" />

      {/* Institutional Directives (Formerly How It Works) */}
      <section id="pulse" style={{ padding: '8rem 2rem', background: '#020202', position: 'relative', overflow: 'hidden' }}>
        <div className="grid-bg" />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Protocol Overview</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Ensuring structural integrity and peer-reviewed clarity at every layer.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { icon: <MessageSquare size={32} />, title: "Precision Queries", desc: "Submit technical queries with LaTeX support, code blocks, and diagrams. Precision leads to clarity." },
              { icon: <Shield size={32} />, title: "Expert Verification", desc: "Our network of verified educators and domain experts provide peer-reviewed, step-by-step resolutions." },
              { icon: <CheckCircle size={32} />, title: "Academic Repository", desc: "Every solved doubt contributes to an evergreen library of engineering insights accessible to all active users." }
            ].map((step, i) => (
              <div key={i} className="card glow-card tilt-3d" style={{ padding: '2.5rem', border: '1px solid var(--border-light)', background: 'var(--bg-card)' }}>
                <div style={{ width: 64, height: 64, background: 'var(--accent-glow)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', marginBottom: '1.5rem' }}>
                  {step.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '8rem 2rem', background: '#000' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Built for the <span style={{ color: 'var(--accent)' }}>Future</span> of Learning</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                AcadX isn&apos;t just a forum; it&apos;s a high-performance ecosystem designed to handle the rigorous demands of engineering coursework.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { icon: <Cpu size={20} />, title: "Intelligent Retrieval", desc: "Our system identifies related case studies and solutions as you draft your query." },
                  { icon: <Shield size={20} />, title: "Incentivized Educators", desc: "Professors receive professional credits and compensation for high-quality doubt resolution." },
                  { icon: <BookOpen size={20} />, title: "Subject-Specific Feeds", desc: "Direct integration with CSE, AIML, ECE, ME, and Civil Engineering curricula." }
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ color: 'var(--accent)', marginTop: '0.2rem' }}>{feat.icon}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{feat.title}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{feat.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: '1 1 400px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="glass glow-card" style={{ padding: '2rem', height: '180px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>92%</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Active Resolve Rate</div>
              </div>
              <div className="glass glow-card" style={{ padding: '2rem', height: '180px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid var(--border-light)', marginTop: '2rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#a855f7' }}>24+</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Verified Faculty Members</div>
              </div>
              <div className="glass glow-card" style={{ padding: '2rem', height: '180px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid var(--border-light)', gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex' }}>
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="var(--warning)" color="var(--warning)" />)}
                  </div>
                  <span style={{ fontWeight: 700, fontStyle: 'italic' }}>&quot;Pehle use kar, firr reviews milenge 😉&quot;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Acknowledgement */}
      <section style={{ padding: '6rem 2rem', background: 'var(--bg-primary)', perspective: '1500px' }}>
        <motion.div
          initial={{ opacity: 0, rotateX: 10, y: 50 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: '4rem', alignItems: 'center' }}
        >
          <div style={{ flex: '1 1 500px' }}>
            <motion.div
              whileHover={{ rotateY: 5, rotateX: -2 }}
              className="card glass"
              style={{ padding: '3rem', borderLeft: '4px solid var(--accent)', transition: 'transform 0.4s ease' }}
            >
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Faculty Recognition & Rewards</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.8 }}>
                AcadX is more than a tool; it&apos;s a professional platform where expertise is valued.
                Professors and TAs contribute their knowledge to maintain the highest academic standards.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <div style={{ color: 'var(--accent)', marginBottom: '0.75rem' }}><Award size={24} /></div>
                  <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Professional Credits</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Each verified resolution counts towards formal institutional contribution metrics.</p>
                </div>
                <div>
                  <div style={{ color: '#a855f7', marginBottom: '0.75rem' }}><Star size={24} /></div>
                  <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Tiered Compensation</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Expert solvers are eligible for performance-based compensation and research grants.</p>
                </div>
              </div>
            </motion.div>
          </div>
          <div style={{ flex: '1 1 300px', textAlign: 'center' }}>
            <DraggableTeacher />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '1.5rem', color: 'white' }}>For the Educators</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Building the future of peer-to-peer engineering education, one verified answer at a time.</p>
            <p style={{ color: 'var(--accent)', fontSize: '0.8rem', marginTop: '1rem', fontStyle: 'italic' }}>Drag or click the Prof for some &apos;Academic Rizz&apos; facts. 👆</p>
          </div>
        </motion.div>
      </section>

      <div className="section-divider" />

      {/* Impact Section */}
      <section style={{ padding: '8rem 2rem', textAlign: 'center', background: '#000' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '4rem', color: 'var(--text-muted)', letterSpacing: '0.3em' }}>
          GLOBAL NETWORK PARAMETERS
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'center', maxWidth: '1100px', margin: '0 auto' }}>
          {[
            { num: "92.4%", label: "ANALYTICAL RESOLVE RATE", accent: "var(--accent)" },
            { num: "1.2K", label: "VERIFIED FACULTY NODE", accent: "#a855f7" },
            { num: "REAL-TIME", label: "NETWORK UPTIME", accent: "var(--success)" }
          ].map((stat, i) => (
            <div key={i} style={{ flex: '1 1 250px' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>{stat.num}</div>
              <div style={{ color: stat.accent, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.15em' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" style={{ padding: '6rem 2rem', background: '#000' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Everything you need to know about the platform. No cap.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { q: "Is AcadX really free?", a: "Yes, 100%. We're built for students, by students. The premium version is just your dedication to the grind." },
              { q: "Who answers the doubts?", a: "Verified professors from the School of Engineering and top-performing students with high 'Academic Rizz' scores." },
              { q: "Can I use it for exam prep?", a: "Absolutely. Most students use the 'Solved' archive to study for midterms and finals. It's basically a cheat-code for learning." },
              { q: "Is my data safe?", a: "We only use your university email to verify your identity. No trackers, no data selling, just pure academic focus." }
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '8rem 2rem', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', borderRadius: '50%' }} />
        </div>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>Ready to Scale Your<br />Academic Growth?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Join your university&apos;s most active doubt clearing platform today. It&apos;s free, it&apos;s fast, and it works.</p>
          <Link href="/login?register=true" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid var(--border-light)', background: '#000' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'space-between' }}>
          <div style={{ maxWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ position: 'relative', width: 36, height: 36, overflow: 'hidden' }}>
                <Image src="/logo.png" alt="AcadX Logo" fill style={{ objectFit: 'contain' }} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '900', background: 'linear-gradient(to right, #fff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AcadX</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>The academic layer for engineers. Built by students, for students, with support from professors.</p>
          </div>
          <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.9rem' }}>Platform</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Link href="/feed">Doubt Feed</Link>
                <Link href="/ai">Ask Artificial</Link>
                <Link href="/leaderboard">Leaderboard</Link>
              </div>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.9rem' }}>Resources</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Link href="/docs">Documentation</Link>
                <Link href="/rules">Community Rules</Link>
                <Link href="/support">Contact Support</Link>
              </div>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '2rem auto 0', paddingTop: '2rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <span>© 2026 AcadX Platform. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
