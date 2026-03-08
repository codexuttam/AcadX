import { NextRequest } from 'next/server'
import { verifyToken, TokenPayload } from './jwt'

export function getUser(req: NextRequest): TokenPayload | null {
    const token = req.cookies.get('acadx_token')?.value
    if (!token) return null
    return verifyToken(token)
}
