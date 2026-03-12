import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    try {
        const userPayload = getUser(req)
        if (!userPayload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const dbUser = await prisma.user.findUnique({
            where: { id: userPayload.userId },
            select: {
                id: true, name: true, email: true, role: true,
                department: true, verified: true, avatar: true,
                bio: true, credits: true, createdAt: true,
            },
        })
        if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        const now = new Date()
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)

        if (dbUser.role === 'student') {
            // Student profile data
            const questions = await prisma.question.findMany({
                where: { studentId: dbUser.id },
                orderBy: { createdAt: 'desc' },
                include: {
                    subject: true,
                    _count: { select: { answers: true, upvotes: true } },
                },
            })
            const answered = questions.filter(q => q.solved || q._count.answers > 0)
            const unanswered = questions.filter(q => !q.solved && q._count.answers === 0)
            const recentActivity = questions.filter(q => new Date(q.createdAt) >= last24h)

            return NextResponse.json({
                user: dbUser,
                profile: {
                    totalQuestions: questions.length,
                    answeredQuestions: answered,
                    unansweredQuestions: unanswered,
                    recentActivity,
                },
            })
        }

        if (dbUser.role === 'professor') {
            // Professor profile data
            const answers = await prisma.answer.findMany({
                where: { professorId: dbUser.id },
                orderBy: { createdAt: 'desc' },
                include: {
                    question: {
                        include: {
                            subject: true,
                            student: { select: { id: true, name: true, department: true } },
                        },
                    },
                },
            })
            const recentAnswers = answers.filter(a => new Date(a.createdAt) >= last24h)
            const bestAnswers = answers.filter(a => a.isBest)
            const subjectsHelped = [...new Set(answers.map(a => a.question.subject.name))]

            return NextResponse.json({
                user: dbUser,
                profile: {
                    totalAnswered: answers.length,
                    recentAnswers: recentAnswers.length,
                    bestAnswers: bestAnswers.length,
                    subjectsHelped,
                    answers,
                },
            })
        }

        if (dbUser.role === 'admin') {
            // Dean/Admin profile data
            const totalQuestions = await prisma.question.count()
            const totalAnswers = await prisma.answer.count()
            const resolvedQuestions = await prisma.question.count({ where: { solved: true } })
            const recentQuestions = await prisma.question.findMany({
                where: { createdAt: { gte: last24h } },
                orderBy: { createdAt: 'desc' },
                include: {
                    subject: true,
                    student: { select: { id: true, name: true, department: true } },
                    _count: { select: { answers: true, upvotes: true } },
                },
            })

            // Most active professors
            const professors = await prisma.user.findMany({
                where: { role: 'professor' },
                select: {
                    id: true, name: true, department: true, avatar: true, verified: true,
                    answers: {
                        select: { id: true, isBest: true, createdAt: true },
                    },
                },
            })
            const profStats = professors.map(p => ({
                id: p.id, name: p.name, department: p.department,
                avatar: p.avatar, verified: p.verified,
                totalAnswers: p.answers.length,
                bestAnswers: p.answers.filter(a => a.isBest).length,
                last24hAnswers: p.answers.filter(a => new Date(a.createdAt) >= last24h).length,
            })).sort((a, b) => b.totalAnswers - a.totalAnswers)

            // Subject distribution
            const subjects = await prisma.subject.findMany({
                include: { _count: { select: { questions: true } } },
            })

            const totalStudents = await prisma.user.count({ where: { role: 'student' } })
            const totalProfessors = await prisma.user.count({ where: { role: 'professor' } })
            const resolutionRate = totalQuestions > 0 ? Math.round((resolvedQuestions / totalQuestions) * 100) : 0

            return NextResponse.json({
                user: dbUser,
                profile: {
                    totalQuestions, totalAnswers, resolvedQuestions, resolutionRate,
                    totalStudents, totalProfessors,
                    recentQuestions,
                    professorRanking: profStats,
                    subjectDistribution: subjects,
                },
            })
        }

        return NextResponse.json({ user: dbUser, profile: {} })
    } catch (error) {
        console.error('Profile API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const userPayload = getUser(req)
        if (!userPayload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await req.json()
        const { avatar, bio } = body

        const updateData: Record<string, string> = {}
        if (typeof bio === 'string') updateData.bio = bio.substring(0, 500)
        if (typeof avatar === 'string' && avatar.startsWith('data:image/')) {
            if (avatar.length > 2 * 1024 * 1024) {
                return NextResponse.json({ error: 'Image must be under 2MB' }, { status: 400 })
            }
            updateData.avatar = avatar
        }

        const user = await prisma.user.update({
            where: { id: userPayload.userId },
            data: updateData,
            select: { id: true, name: true, avatar: true, bio: true },
        })

        return NextResponse.json({ ok: true, user })
    } catch (error) {
        console.error('Profile update error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
