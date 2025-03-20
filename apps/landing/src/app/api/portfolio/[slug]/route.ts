import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug

    const portfolioItem = await prisma.portfolio.findUnique({
      where: { slug },
    })

    if (!portfolioItem) {
      return NextResponse.json({ message: 'Portfolio item not found' }, { status: 404 })
    }

    return NextResponse.json(portfolioItem)
  } catch (error) {
    console.error(`Error fetching portfolio item with slug ${params.slug}:`, error)
    return NextResponse.json({ message: 'Failed to fetch portfolio item' }, { status: 500 })
  }
}
