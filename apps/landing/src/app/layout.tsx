import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@fe-boilerplate/ui/styles/globals.css'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { TRPCProvider } from '@/providers/trpc'
import Navbar from '@/components/layout/Navbar'
import { ThemeProvider } from '@/providers/theme'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Your Portfolio',
    template: '%s | Your Portfolio',
  },
  description: 'Your professional portfolio and blog',
  openGraph: {
    title: 'Your Portfolio',
    description: 'Your professional portfolio and blog',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Your Portfolio',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          <TRPCProvider>
            <ThemeProvider>
              <Navbar />
              <div className="pt-16">{children}</div>
            </ThemeProvider>
          </TRPCProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
