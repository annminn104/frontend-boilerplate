import { type Portfolio } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import type { PortfolioItem } from '@/types/portfolio'

function mapPortfolioToItem(item: Portfolio): PortfolioItem {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    slug: item.slug,
    imageUrl: item.image,
    category: item.skills.join(', '), // Using skills as category
    technologies: item.skills,
    completionDate: item.createdAt.toISOString(), // Using createdAt as completionDate
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }
}

export async function getPortfolioItems(): Promise {
  const items = await prisma.portfolio.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return items.map(mapPortfolioToItem)
}

export async function getPortfolioItemBySlug(slug: string): Promise {
  const item = await prisma.portfolio.findUnique({
    where: { slug },
  })

  if (!item) {
    throw new Error('Item not found')
  }

  return mapPortfolioToItem(item)
}

export async function getPortfolioItemsByCategory(category: string): Promise {
  const items = await prisma.portfolio.findMany({
    where: {
      skills: {
        has: category,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return items.map(mapPortfolioToItem)
}
