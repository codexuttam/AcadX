import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/jwt'
import AdminClient from './AdminClient'

export default async function AdminPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get('acadx_token')?.value
    if (!token) redirect('/login')
    const user = verifyToken(token)
    if (!user || user.role !== 'admin') redirect('/feed')
    return <AdminClient adminUser={user} />
}
