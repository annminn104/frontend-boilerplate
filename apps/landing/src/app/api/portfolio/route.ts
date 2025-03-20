import { NextResponse } from 'next/server'
import { getPortfolioItems, getPortfolioItemsByCategory } from '@/services/portfolio-service'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const items = category ? await getPortfolioItemsByCategory(category) : await getPortfolioItems()

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching portfolio items:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolio items' }, { status: 500 })
  }
}
