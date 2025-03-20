import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/providers/theme-provider'
import { I18nProvider } from '@/providers/i18n-provider'
import { QueryProvider } from '@/providers/query-provider'
import { PostHogProvider } from '@/providers/posthog-provider'
import './globals.css'
import { Toaster } from 'sonner'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Providers } from '@/providers'
import { TRPCProvider } from '@/providers/trpc-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Your Brand - Modern Solutions for Your Business',
  description:
    'We provide the best tools and services to help your business grow in the digital age.',
  keywords: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className="scroll-smooth">
        <body className={inter.className}>
          <TRPCProvider>
            <QueryProvider>
              <PostHogProvider>
                <I18nProvider>
                  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <Providers>
                      <div className="flex min-h-screen flex-col">
                        <Header />
                        <main className="flex-grow">{children}</main>
                        <Footer />
                      </div>
                    </Providers>
                    <Toaster />
                  </ThemeProvider>
                </I18nProvider>
              </PostHogProvider>
            </QueryProvider>
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
