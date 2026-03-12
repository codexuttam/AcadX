import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '../../lib/jwt'
import { ProfileClient } from './ProfileClient'

export default async function ProfilePage() {
    const cookieStore = await cookies()
    const token = cookieStore.get('acadx_token')?.value
    if (!token) redirect('/login')

    const user = verifyToken(token)
    if (!user) redirect('/login')

    return <ProfileClient user={user} />
}
