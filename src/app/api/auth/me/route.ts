import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    try {
        const userPayload = getUser(req)
        if (!userPayload) {
            return NextResponse.json({ user: null }, { status: 200 })
        }

        const user = await prisma.user.findUnique({
            where: { id: userPayload.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
                verified: true,
                avatar: true,
                credits: true,
                createdAt: true,
            }
        })

        return NextResponse.json({ user })
    } catch (error) {
        console.error('Me API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
