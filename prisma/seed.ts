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
            name: 'Dr. Priya Sharma (Dean)',
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
        { name: 'Python', color: '#3b82f6', icon: '🐍' },
        { name: 'C Programming', color: '#ef4444', icon: '⚡' },
        { name: 'C++', color: '#f97316', icon: '🔷' },
        { name: 'Java', color: '#eab308', icon: '☕' },
        { name: 'MATLAB', color: '#8b5cf6', icon: '📊' },
        { name: 'Machine Learning', color: '#ec4899', icon: '🤖' },
        { name: 'Data Structures', color: '#06b6d4', icon: '🌲' },
        { name: 'Algorithms', color: '#10b981', icon: '🧮' },
        { name: 'Operating Systems', color: '#f59e0b', icon: '💻' },
        { name: 'DBMS', color: '#6366f1', icon: '🗄️' },
        { name: 'Computer Networks', color: '#14b8a6', icon: '🌐' },
        { name: 'Deep Learning', color: '#d946ef', icon: '🧠' },
        { name: 'Computer Vision', color: '#0ea5e9', icon: '👁️' },
        { name: 'NLP', color: '#22c55e', icon: '💬' },
    ]

    for (const s of subjects) {
        await prisma.subject.upsert({
            where: { name: s.name },
            update: {},
            create: s,
        })
    }
    console.log('✅ Subjects created:', subjects.length)

    const studentHash = await bcrypt.hash('student@123', 12)
    await prisma.user.upsert({
        where: { email: 'uttam@student.edu' },
        update: {},
        create: {
            name: 'Uttamraj Singh',
            email: 'uttam@student.edu',
            password: studentHash,
            role: 'student',
            department: 'CSE',
        },
    })
    console.log('✅ Student created')

    console.log('')
    console.log('🎉 Database seeded successfully!')
    console.log('')
    console.log('Login credentials:')
    console.log('  Admin (Dean): dean@engineering.edu / dean@admin123')
    console.log('  Professor:    rajesh@engineering.edu / prof@123')
    console.log('  Student:      uttam@student.edu / student@123')

    await prisma.$disconnect()
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})
