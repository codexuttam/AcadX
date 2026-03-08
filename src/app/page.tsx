import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/jwt'

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get('acadx_token')?.value

  if (token) {
    const user = verifyToken(token)
    if (user) {
      if (user.role === 'admin') redirect('/admin')
      redirect('/feed')
    }
  }

  redirect('/login')
}
