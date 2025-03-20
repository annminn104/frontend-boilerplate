import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPortfolioItemBySlug } from '@/services/portfolio-service'
import { PortfolioItem } from '@/types/portfolio'
import { type Route } from 'next'

interface PortfolioDetailPageProps {
  params: {
    slug: string
  }
}

// This function gets called at build time
export async function generateStaticParams() {
  // Call an API to get all portfolio items
  // This is used for static generation of all portfolio detail pages
  try {
    const items = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio`).then((res) =>
      res.json()
    )
    return items.map((item: PortfolioItem) => ({
      slug: item.slug,
    }))
  } catch (error) {
    console.error('Error generating static params for portfolio:', error)
    return []
  }
}

async function getPortfolioData(slug: string): Promise {
  try {
    return await getPortfolioItemBySlug(slug)
  } catch (error) {
    console.error(`Error fetching portfolio item with slug ${slug}:`, error)
    return null
  }
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const portfolioItem = await getPortfolioData(params.slug)

  if (!portfolioItem) {
    notFound()
  }

  return (
    <main>
      <div className="bg-indigo-700">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              {portfolioItem.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-indigo-200">
              {portfolioItem.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/portfolio"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
          >
            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Back to Portfolio
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
              <div className="relative h-96 bg-gray-200">
                {/* Replace with actual image when available */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-4xl text-gray-500">
                  {portfolioItem.title.charAt(0)}
                </div>
                {/* <img
                  src={portfolioItem.imageUrl}
                  alt={portfolioItem.title}
                  className="w-full h-full object-cover"
                /> */}
              </div>

              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Project Overview</h3>
              </div>

              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: portfolioItem.fullDescription ?? portfolioItem.description,
                  }}
                />
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">The Challenge</h3>
              </div>

              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: portfolioItem.challenge ?? '' }}
                />
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Our Solution</h3>
              </div>

              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: portfolioItem.solution ?? '' }}
                />
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Results</h3>
              </div>

              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: portfolioItem.results ?? '' }}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Project Details</h3>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Client</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {portfolioItem.client ?? 'N/A'}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {portfolioItem.category.charAt(0).toUpperCase() +
                        portfolioItem.category.slice(1)}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Completion Date</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {new Date(portfolioItem.completionDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Technologies</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      <div className="flex flex-wrap gap-2">
                        {portfolioItem.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-8 overflow-hidden bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Need a similar solution?
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Contact us to discuss your project requirements.
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <Link
                  href={'/contact' as Route}
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
