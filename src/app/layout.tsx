import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/providers/SessionProvider'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'CareConnect UK | Care Staff Marketplace',
  description:
    'Connect with qualified, self-employed care professionals or find flexible shifts at care homes across the UK.',
  keywords: [
    'care staff',
    'care home',
    'nursing',
    'healthcare assistant',
    'carer jobs',
    'UK care',
    'agency',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SessionProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}
