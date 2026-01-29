'use client'

import { ReactNode } from 'react'

// Supabase handles session management via cookies and middleware
// This wrapper is kept for compatibility but no longer uses NextAuth
export function SessionProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
