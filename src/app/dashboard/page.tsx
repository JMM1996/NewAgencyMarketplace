import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  // Redirect based on user role
  if (user.role === 'CARE_HOME') {
    redirect('/dashboard/care-home')
  } else if (user.role === 'CARE_STAFF') {
    redirect('/dashboard/staff')
  } else {
    redirect('/')
  }
}
