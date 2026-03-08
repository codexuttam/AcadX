import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    try {
        const user = getUser(req)
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin only' }, { status: 403 })
        }

        const [users, questions, answers, subjects] = await Promise.all([
            prisma.user.findMany({
                select: { id: true, name: true, email: true, role: true, department: true, verified: true, createdAt: true },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.question.count(),
            prisma.answer.count(),
            prisma.subject.count(),
        ])

        return NextResponse.json({ users, stats: { questions, answers, subjects, users: users.length } })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const user = getUser(req)
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin only' }, { status: 403 })
        }

        const { userId, role, verified } = await req.json()
        const updated = await prisma.user.update({
            where: { id: userId },
            data: { role, verified },
            select: { id: true, name: true, email: true, role: true, verified: true },
        })
        return NextResponse.json({ user: updated })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const user = getUser(req)
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin only' }, { status: 403 })
        }
        const { userId } = await req.json()
        await prisma.user.delete({ where: { id: userId } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
