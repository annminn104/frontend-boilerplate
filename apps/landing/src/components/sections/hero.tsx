'use client'

import { Button } from '@fe-boilerplate/ui'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="container flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
        Build your next project faster with our boilerplate
      </h1>
      <p className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
        A Next.js starter template with clean architecture, best practices, and essential tools
      </p>
      <div className="flex gap-4">
        <Button size="lg" asChild>
          <Link href="/projects">View Projects</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="https://github.com/yourusername/frontend-boilerplate" target="_blank">
            GitHub
          </Link>
        </Button>
      </div>
    </section>
  )
}
