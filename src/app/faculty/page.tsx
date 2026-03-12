import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const metadata = {
    title: 'Faculty — AcadX',
    description: 'Browse verified professors and assistant professors on AcadX.'
}

export default async function FacultyPage() {
    // Fetch up to 20 professors from the database
    const profs = await prisma.user.findMany({ where: { role: 'professor' }, take: 20, orderBy: { createdAt: 'desc' } })

    // If DB has fewer than 8, provide mock entries (so page looks full during dev)
    const fallback = [
        'Dr. Rajesh Kumar', 'Prof. Sunita Mehta', 'Dr. Neha Sharma', 'Prof. Amit Verma', 'Dr. Priya Singh',
        'Dr. Karan Joshi', 'Prof. Meera Nair', 'Dr. Suresh Patil', 'Prof. Anjali Rao', 'Dr. Vikram Gupta',
        'Prof. Rakesh Yadav', 'Dr. Leena Das', 'Prof. Harish Bhat', 'Dr. Aisha Khan', 'Prof. Rohit Sinha',
        'Dr. Nitin Agarwal', 'Prof. Kavita Menon', 'Dr. Sandeep Mishra', 'Prof. Divya Iyer', 'Dr. Arjun Das'
    ]

    const people = profs.length >= 8 ? profs : fallback.map((name, i) => ({ id: `mock-${i}`, name, department: ['CSE Dept','AIML Dept','ECE Dept'][i%3], verified: true }))

    return (
        <div style={{ padding: '3rem', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 900 }}>All Faculty</h1>
                    <Link href="/feed" style={{ color: 'var(--accent)', fontWeight: 800 }}>Back to feed</Link>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Browse verified professors and assistant professors who contribute to AcadX. Click a profile to view full details.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                    {people.map((p: any) => (
                        <Link key={p.id} href={`/profile`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="card" style={{ padding: '1rem', borderRadius: 12, display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'var(--accent)', fontSize: '1rem' }}>{p.name.split(' ').map((n: string) => n[0]).slice(0,2).join('')}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{p.name}</div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{p.department || p.dept || 'CSE Dept'}</div>
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 800 }}>Verified</div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </div>
    )
}
