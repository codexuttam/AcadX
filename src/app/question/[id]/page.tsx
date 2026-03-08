import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/jwt'
import QuestionDetailClient from './QuestionDetailClient'

export default async function QuestionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const cookieStore = await cookies()
    const token = cookieStore.get('acadx_token')?.value
    if (!token) redirect('/login')
    const user = verifyToken(token)
    if (!user) redirect('/login')
    return <QuestionDetailClient questionId={id} user={user} />
}
