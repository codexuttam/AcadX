import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: questionId } = await params
        const user = getUser(req)
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const existing = await prisma.upvote.findUnique({
            where: { userId_questionId: { userId: user.userId, questionId } },
        })

        if (existing) {
            await prisma.upvote.delete({ where: { id: existing.id } })
            return NextResponse.json({ upvoted: false })
        } else {
            await prisma.upvote.create({ data: { userId: user.userId, questionId } })
            return NextResponse.json({ upvoted: true })
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
