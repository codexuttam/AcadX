import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: questionId } = await params
        const user = getUser(req)
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        if (user.role !== 'professor' && user.role !== 'admin') {
            return NextResponse.json({ error: 'Only professors can answer' }, { status: 403 })
        }

        const { text, codeSnippet } = await req.json()
        if (!text) return NextResponse.json({ error: 'Answer text required' }, { status: 400 })

        const answer = await prisma.answer.create({
            data: {
                text,
                codeSnippet: codeSnippet || null,
                questionId,
                professorId: user.userId,
            },
            include: {
                professor: { select: { id: true, name: true, role: true, verified: true, department: true } },
            },
        })

        return NextResponse.json({ answer })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
