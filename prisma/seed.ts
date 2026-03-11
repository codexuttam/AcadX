import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'

async function main() {
    const dbPath = path.resolve(process.cwd(), 'prisma', 'dev.db')
    const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
    const prisma = new PrismaClient({ adapter } as any)

    console.log('🌱 Seeding AcadX database...')

    const adminHash = await bcrypt.hash('dean@admin123', 12)
    const admin = await prisma.user.upsert({
        where: { email: 'dean@engineering.edu' },
        update: {},
        create: {
            name: 'Dr. Sugandha Singh (Dean)',
            email: 'dean@engineering.edu',
            password: adminHash,
            role: 'admin',
            department: 'School of Engineering',
            verified: true,
        },
    })
    console.log('✅ Admin created:', admin.email)

    const profHash = await bcrypt.hash('prof@123', 12)
    const professors = [
        { name: 'Dr. Rajesh Kumar', email: 'rajesh@engineering.edu', department: 'CSE' },
        { name: 'Prof. Sunita Mehta', email: 'sunita@engineering.edu', department: 'CSE' },
        { name: 'Dr. Anil Gupta', email: 'anil@engineering.edu', department: 'AIML' },
        { name: 'Prof. Kavita Singh', email: 'kavita@engineering.edu', department: 'CSE' },
    ]

    for (const p of professors) {
        await prisma.user.upsert({
            where: { email: p.email },
            update: {},
            create: { ...p, password: profHash, role: 'professor', verified: true },
        })
        console.log('✅ Professor created:', p.email)
    }

    const subjects = [
        { name: 'Python', color: '#3b82f6', icon: 'Terminal' },
        { name: 'C Programming', color: '#ef4444', icon: 'FileCode' },
        { name: 'C++', color: '#f97316', icon: 'Layers' },
        { name: 'Java', color: '#eab308', icon: 'Coffee' },
        { name: 'MATLAB', color: '#8b5cf6', icon: 'Activity' },
        { name: 'Machine Learning', color: '#ec4899', icon: 'Workflow' },
        { name: 'Data Structures', color: '#06b6d4', icon: 'Binary' },
        { name: 'Algorithms', color: '#10b981', icon: 'Sigma' },
        { name: 'Operating Systems', color: '#f59e0b', icon: 'Monitor' },
        { name: 'DBMS', color: '#6366f1', icon: 'Database' },
        { name: 'Computer Networks', color: '#14b8a6', icon: 'Globe' },
        { name: 'Deep Learning', color: '#d946ef', icon: 'Workflow' },
        { name: 'Computer Vision', color: '#0ea5e9', icon: 'Microscope' },
        { name: 'NLP', color: '#22c55e', icon: 'Languages' },
        // Essential B.Tech Subjects
        { name: 'Engineering Physics', color: '#f43f5e', icon: 'Atom' },
        { name: 'Mathematics-I', color: '#6366f1', icon: 'Sigma' },
        { name: 'Basic Electrical Engg', color: '#eab308', icon: 'CircuitBoard' },
        { name: 'Environmental Studies', color: '#10b981', icon: 'Globe' },
        { name: 'Discrete Mathematics', color: '#8b5cf6', icon: 'Pi' },
        { name: 'Computer Architecture', color: '#f97316', icon: 'Cpu' },
        { name: 'Theory of Computation', color: '#ec4899', icon: 'Code2' },
        { name: 'Compiler Design', color: '#14b8a6', icon: 'Terminal' },
        // Cybersecurity
        { name: 'Cyber Security', color: '#ef4444', icon: 'ShieldAlert' },
        { name: 'Network Security', color: '#3b82f6', icon: 'ShieldAlert' },
        { name: 'Ethical Hacking', color: '#1f2937', icon: 'Binary' },
        { name: 'Cyber Law & Ethics', color: '#0ea5e9', icon: 'Landmark' },
        // Biotechnology
        { name: 'Cell Biology', color: '#10b981', icon: 'Microscope' },
        { name: 'Genetics', color: '#f43f5e', icon: 'Dna' },
        { name: 'Biochemistry', color: '#8b5cf6', icon: 'Microscope' },
        { name: 'Bioinformatics', color: '#06b6d4', icon: 'Database' },
        // CSE Core & Advanced
        { name: 'Software Engineering', color: '#4f46e5', icon: 'Construction' },
        { name: 'Cloud Computing', color: '#0ea5e9', icon: 'Globe' },
        { name: 'IoT with ML', color: '#14b8a6', icon: 'CircuitBoard' },
    ]

    for (const s of subjects) {
        await prisma.subject.upsert({
            where: { name: s.name },
            update: { icon: s.icon, color: s.color },
            create: s,
        })
    }
    console.log('✅ Subjects created:', subjects.length)

    const studentHash = await bcrypt.hash('student@123', 12)
    await prisma.user.upsert({
        where: { email: 'uttamrajsingh423@gmail.com' },
        update: {},
        create: {
            name: 'Uttamraj Singh',
            email: 'uttamrajsingh423@gmail.com',
            password: studentHash,
            role: 'student',
            department: 'CSE',
        },
    })
    console.log('✅ Student created (test email: uttamrajsingh423@gmail.com)')

    console.log('')
    console.log('🎉 Database seeded successfully!')
    console.log('')
    console.log('Login credentials:')
    console.log('  Admin (Dean): dean@engineering.edu / dean@admin123')
    console.log('  Professor:    rajesh@engineering.edu / prof@123')
    console.log('  Student:      uttamrajsingh423@gmail.com / student@123')

    await prisma.$disconnect()
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})
