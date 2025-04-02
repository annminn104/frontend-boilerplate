import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MenuIcon } from 'lucide-react'
import { requireOwner } from '@/lib/auth-utils'
import { Button, Sheet, SheetContent, SheetTrigger } from '@fe-boilerplate/ui'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Protect admin routes by checking for OWNER role
  await requireOwner()

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/posts', label: 'Blog Posts' },
    { href: '/admin/projects', label: 'Projects' },
    { href: '/admin/portfolio', label: 'Portfolio Sections' },
    { href: '/admin/comments', label: 'Comments' },
  ]

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-muted/20">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 border-r bg-background p-6 md:block">
        <div className="flex flex-col space-y-6">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <nav className="flex flex-col space-y-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden p-0 h-14 w-14 flex items-center justify-center">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col space-y-6 p-6">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <nav className="flex flex-col space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1">
        {/* <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </header> */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
