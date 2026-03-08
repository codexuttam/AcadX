import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOTP } from '@/lib/mail'

const EMAIL_DOMAIN = '@niu.edu.in'
// Format: niu-xx-xxxxx@niu.edu.in
const EMAIL_REGEX = /^niu-[a-z0-9]{2}-\d{5}@niu\.edu\.in$/

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        if (!EMAIL_REGEX.test(email)) {
            return NextResponse.json({
                error: 'Please use a valid college email (Format: niu-xx-xxxxx@niu.edu.in)'
            }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 mins

        // Delete old tokens for this email
        await prisma.verificationToken.deleteMany({ where: { email } })

        await prisma.verificationToken.create({
            data: { email, token: otp, expires }
        })

        const sent = await sendOTP(email, otp)
        if (!sent) {
            return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
        }

        return NextResponse.json({ message: 'OTP sent successfully' })
    } catch (error) {
        console.error('Send OTP error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
