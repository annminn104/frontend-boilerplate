'use client'

import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { SignInButton } from '../auth/SignInButton'
import { UserButton } from '../auth/UserButton'

export default function Navbar() {
  const { isSignedIn, isLoaded } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            Portfolio
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/admin" className="hover:text-purple-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/blog" className="hover:text-purple-600 transition-colors">
              Blog
            </Link>
            {isLoaded && (
              <div className="flex items-center gap-4">{isSignedIn ? <UserButton /> : <SignInButton />}</div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
