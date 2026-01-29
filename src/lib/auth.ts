import { createClient } from '@/lib/supabase/server'
import { prisma } from './db'
import { UserRole } from '@/generated/prisma'

// Types for user authentication
export interface AuthUser {
  id: string
  email: string
  role: UserRole
}

// Get the current authenticated user from Supabase
export async function getCurrentUser(): Promise<AuthUser | null> {
  // During build time, environment variables may not be available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null
  }

  let supabaseUser: { id: string } | null = null

  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }
    supabaseUser = user
  } catch {
    return null
  }

  if (!supabaseUser) {
    return null
  }

  // Get the user's role from the database
  const dbUser = await prisma.user.findUnique({
    where: { id: supabaseUser.id },
    select: { id: true, email: true, role: true, status: true },
  })

  if (!dbUser) {
    return null
  }

  if (dbUser.status === 'SUSPENDED' || dbUser.status === 'DEACTIVATED') {
    return null
  }

  return {
    id: dbUser.id,
    email: dbUser.email,
    role: dbUser.role,
  }
}

// Check if user is authenticated and redirect if not
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Authentication required')
  }

  return user
}

// Check if user has a specific role
export async function requireRole(allowedRoles: UserRole[]): Promise<AuthUser> {
  const user = await requireAuth()

  if (!allowedRoles.includes(user.role)) {
    throw new Error('Insufficient permissions')
  }

  return user
}
