import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const subjects = await prisma.subject.findMany({
            orderBy: { name: 'asc' },
            include: { _count: { select: { questions: true } } },
        })
        return NextResponse.json({ subjects })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = getUser(req)
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin only' }, { status: 403 })
        }
        const { name, color, icon } = await req.json()
        if (!name) return NextResponse.json({ error: 'Subject name required' }, { status: 400 })

        const subject = await prisma.subject.create({
            data: { name, color: color || '#6366f1', icon: icon || '📘' },
        })
        return NextResponse.json({ subject })
    } catch (error: any) {
        if (error?.code === 'P2002') {
            return NextResponse.json({ error: 'Subject already exists' }, { status: 409 })
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const user = getUser(req)
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin only' }, { status: 403 })
        }
        const { id } = await req.json()
        await prisma.subject.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
