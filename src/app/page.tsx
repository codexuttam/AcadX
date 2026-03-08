'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, MessageSquare, Shield, Users, ArrowRight, Star, Cpu, BookOpen, ChevronDown, Award } from 'lucide-react'

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

export default function LandingPage() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)

    // Auth check - client side
    const checkAuth = async () => {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        if (data.user) {
          if (data.user.role === 'admin') router.push('/admin')
          else router.push('/feed')
        }
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>⚡</div>
            <span style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.04em' }}>AcadX</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link href="/login" className="btn btn-ghost" style={{ fontSize: '0.85rem' }}>Login</Link>
            <Link href="/login?register=true" className="btn btn-primary" style={{ fontSize: '0.85rem', boxShadow: '0 0 15px var(--accent-glow)' }}>Join Now</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header ref={heroRef} onMouseMove={handleMouseMove} style={{
        padding: '10rem 2rem 6rem', textAlign: 'center', position: 'relative',
        background: 'radial-gradient(circle at 50% 50%, rgba(108, 99, 255, 0.05) 0%, transparent 70%)'
      }}>
        <div className="animate-fadeIn" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="tag" style={{ background: 'var(--accent-glow)', color: 'var(--accent)', marginBottom: '1.5rem', padding: '0.4rem 1rem' }}>
            ⚡ Official Academic Portal for Engineering Students
          </div>
          <h1 className="gradient-text" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>
            Collaborative Learning.<br />Verified Solutions.
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            A rigorous ecosystem for engineering excellence. Post your doubts, consult our network of verified professors, and contribute to the collective knowledge base.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/login?register=true" className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
              Get Started Now <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="btn btn-outline" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>How it Works</a>
          </div>
        </div>

        {/* 3D Floating Element Example */}
        <div className="perspective-1000 animate-float" style={{ marginTop: '5rem', display: 'flex', justifyContent: 'center' }}>
          <div className="glass tilt-3d glow-card" style={{
            padding: '2rem', borderRadius: '24px', width: '320px',
            transform: `perspective(1000px) rotateX(${(hoverPos.y - 0.5) * 20}deg) rotateY(${(hoverPos.x - 0.5) * 20}deg)`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="avatar avatar-sm">A</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Anushka S.</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>CSE Student</div>
              </div>
            </div>
            <h3 style={{ textAlign: 'left', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>Deriving the boundary conditions for a perfect conductor in EM fields?</h3>
            <div className="tag" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontSize: '0.65rem' }}>Electromagnetics</div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>❤️ 18</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>💬 4</span>
              </div>
              <span className="tag" style={{ background: 'var(--success)', color: 'white', fontSize: '0.6rem' }}>✓ Verified by Prof. Rajesh</span>
            </div>
          </div>
        </div>
      </header>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ padding: '6rem 2rem', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>How It Works</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Bridging the gap between confusion and clarity in 3 simple steps.</p>
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
                AcadX isn't just a forum; it's a high-performance ecosystem designed to handle the rigorous demands of engineering coursework.
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
                  <span style={{ fontWeight: 700, fontStyle: 'italic' }}>"Pehle use kar, firr reviews milenge 😉"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Acknowledgement */}
      <section style={{ padding: '6rem 2rem', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: '4rem', alignItems: 'center' }}>
          <div style={{ flex: '1 1 500px' }}>
            <div className="card glass" style={{ padding: '3rem', borderLeft: '4px solid var(--accent)' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Faculty Recognition & Rewards</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.8 }}>
                AcadX is more than a tool; it's a professional platform where expertise is valued.
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
            </div>
          </div>
          <div style={{ flex: '1 1 300px', textAlign: 'center' }}>
            <div style={{ fontSize: '5rem', display: 'block' }}>👨‍🏫</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '1.5rem', color: 'white' }}>For the Educators</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Building the future of peer-to-peer engineering education, one verified answer at a time.</p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-light)' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '3rem' }}>Current Platform Pulse</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', maxWidth: '1000px', margin: '0 auto' }}>
          {[
            { num: "2.4K+", label: "Solved Challenges" },
            { num: "12", label: "Core Subjects" },
            { num: "Real-time", label: "Technical Support" }
          ].map((stat, i) => (
            <div key={i} className="tilt-3d" style={{ background: 'var(--bg-card)', padding: '2rem 4rem', borderRadius: '24px', flex: '1 1 250px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>{stat.num}</div>
              <div style={{ color: 'var(--accent)', fontWeight: 600, marginTop: '0.5rem' }}>{stat.label}</div>
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
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Join your university's most active doubt clearing platform today. It's free, it's fast, and it works.</p>
          <Link href="/login?register=true" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid var(--border-light)', background: '#000' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'space-between' }}>
          <div style={{ maxWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>⚡</div>
              <span style={{ fontSize: '1.1rem', fontWeight: '900' }}>AcadX</span>
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
