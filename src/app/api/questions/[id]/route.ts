import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const question = await prisma.question.findUnique({
            where: { id },
            include: {
                subject: true,
                student: { select: { id: true, name: true, role: true, verified: true, department: true } },
                answers: {
                    include: {
                        professor: { select: { id: true, name: true, role: true, verified: true, department: true } },
                    },
                    orderBy: [{ isBest: 'desc' }, { upvotes: 'desc' }, { createdAt: 'asc' }],
                },
                upvotes: true,
                _count: { select: { answers: true, upvotes: true } },
            },
        })

        if (!question) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        // Increment views
        await prisma.question.update({ where: { id }, data: { views: { increment: 1 } } })

        return NextResponse.json({ question })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const user = getUser(req)
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin only' }, { status: 403 })
        }
        const { solved } = await req.json()
        const question = await prisma.question.update({ where: { id }, data: { solved } })
        return NextResponse.json({ question })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const user = getUser(req)
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin only' }, { status: 403 })
        }
        await prisma.question.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
