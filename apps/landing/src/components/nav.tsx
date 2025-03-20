'use client'

import { useTranslation } from 'react-i18next'
import { Button } from '@fe-boilerplate/ui'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function Nav() {
  const { t } = useTranslation('nav')
  const pathname = usePathname()

  const items = [
    { href: '/' as const, label: t('home') },
    { href: '/projects' as const, label: t('projects') },
  ]

  return (
    <nav className="flex gap-4">
      {items.map((item) => (
        <Button key={item.href} variant={pathname === item.href ? 'default' : 'ghost'} asChild>
          <Link href={item.href}>{item.label}</Link>
        </Button>
      ))}
    </nav>
  )
}
