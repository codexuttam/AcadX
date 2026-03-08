import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const subject = searchParams.get('subject')
        const search = searchParams.get('search')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = 20

        const where: any = {}
        if (subject && subject !== 'all') {
            where.subject = { name: subject }
        }
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
            ]
        }

        const [questions, total] = await Promise.all([
            prisma.question.findMany({
                where,
                include: {
                    subject: true,
                    student: { select: { id: true, name: true, role: true, verified: true, department: true } },
                    answers: {
                        include: {
                            professor: { select: { id: true, name: true, role: true, verified: true } },
                        },
                        orderBy: { upvotes: 'desc' },
                    },
                    upvotes: true,
                    _count: { select: { answers: true, upvotes: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.question.count({ where }),
        ])

        return NextResponse.json({ questions, total, page, limit })
    } catch (error) {
        console.error('Questions GET error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = getUser(req)
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        if (user.role === 'professor') return NextResponse.json({ error: 'Professors cannot post questions' }, { status: 403 })

        const { title, description, subjectId, codeSnippet } = await req.json()
        if (!title || !description || !subjectId) {
            return NextResponse.json({ error: 'Title, description and subject required' }, { status: 400 })
        }

        const question = await prisma.question.create({
            data: {
                title,
                description,
                codeSnippet: codeSnippet || null,
                subjectId,
                studentId: user.userId,
            },
            include: {
                subject: true,
                student: { select: { id: true, name: true, role: true, verified: true } },
                answers: true,
                upvotes: true,
                _count: { select: { answers: true, upvotes: true } },
            },
        })

        return NextResponse.json({ question })
    } catch (error) {
        console.error('Questions POST error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
