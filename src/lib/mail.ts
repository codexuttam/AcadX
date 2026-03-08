import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

export async function sendOTP(email: string, otp: string) {
    // If SMTP is not configured, log to console for development
    if (!process.env.SMTP_USER) {
        console.log('---------------------------------')
        console.log(`OTP for ${email}: ${otp}`)
        console.log('---------------------------------')
        return true
    }

    try {
        await transporter.sendMail({
            from: '"AcadX Verification" <no-reply@acadx.edu.in>',
            to: email,
            subject: 'Your AcadX Verification Code',
            text: `Your verification code is: ${otp}. This code expires in 10 minutes.`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #6c63ff;">AcadX Verification</h2>
                    <p>Your verification code for signing up is:</p>
                    <div style="font-size: 24px; font-weight: bold; color: #6c63ff; padding: 10px; background: #f4f4f4; border-radius: 5px; display: inline-block;">
                        ${otp}
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                </div>
            `,
        })
        return true
    } catch (error) {
        console.error('Email error:', error)
        return false
    }
}
