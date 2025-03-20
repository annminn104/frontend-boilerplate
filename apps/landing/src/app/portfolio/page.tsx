import { Metadata } from 'next'
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid'
import { PortfolioHero } from '@/components/portfolio/PortfolioHero'
import { PortfolioFilter } from '@/components/portfolio/PortfolioFilter'

export const metadata: Metadata = {
  title: 'Portfolio | Our Work',
  description: 'Explore our portfolio of successful projects and case studies.',
}

export default function PortfolioPage() {
  return (
    <main>
      <PortfolioHero />

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PortfolioFilter />
          <PortfolioGrid />
        </div>
      </section>
    </main>
  )
}
