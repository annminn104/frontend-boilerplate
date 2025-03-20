'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { UserButton } from '@clerk/nextjs'
import { Button } from '@fe-boilerplate/ui'
import { Nav } from '../nav'
import { ThemeToggle } from '../theme-toggle'

export function Header() {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">Frontend Boilerplate</span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <Nav />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </header>
  )
}
