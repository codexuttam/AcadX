import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/jwt'

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, department, role, otp } = await req.json()

        if (!name || !email || !password || !otp) {
            return NextResponse.json({ error: 'All fields required, including OTP' }, { status: 400 })
        }

        // Domain check (extra safety)
        const EMAIL_REGEX = /^niu-[a-z0-9]{2}-\d{5}@niu\.edu\.in$/
        if (!EMAIL_REGEX.test(email)) {
            return NextResponse.json({ error: 'Invalid college email format' }, { status: 400 })
        }

        // Verify OTP
        const otpRecord = await prisma.verificationToken.findFirst({
            where: { email, token: otp, expires: { gt: new Date() } }
        })

        if (!otpRecord) {
            return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 })
        }

        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
        }

        const hashed = await bcrypt.hash(password, 12)

        // Delete token
        await prisma.verificationToken.deleteMany({ where: { email } })

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
                department: department || 'CSE',
                role: role === 'professor' ? 'professor' : 'student',
            },
        })

        const token = signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        })

        const response = NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                verified: user.verified,
            },
        })

        response.cookies.set('acadx_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
        })

        return response
    } catch (error) {
        console.error('Register error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
