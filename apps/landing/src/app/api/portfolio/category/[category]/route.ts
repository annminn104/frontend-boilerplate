import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { category: string } }) {
  try {
    const category = params.category

    const portfolioItems = await prisma.portfolio.findMany({
      where: {
        skills: {
          has: category,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(portfolioItems)
  } catch (error) {
    console.error(`Error fetching portfolio items with category ${params.category}:`, error)
    return NextResponse.json({ message: 'Failed to fetch portfolio items' }, { status: 500 })
  }
}
