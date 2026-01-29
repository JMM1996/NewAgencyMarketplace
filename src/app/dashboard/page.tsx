import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Redirect based on user role
  if (session.user.role === 'CARE_HOME') {
    redirect('/dashboard/care-home')
  } else if (session.user.role === 'CARE_STAFF') {
    redirect('/dashboard/staff')
  } else {
    redirect('/')
  }
}
