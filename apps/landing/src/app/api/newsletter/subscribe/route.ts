import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: body.email,
        user: body.userId
          ? {
              connect: {
                id: body.userId,
              },
            }
          : undefined,
      },
    })

    return NextResponse.json(subscriber)
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json({ error: 'Failed to subscribe to newsletter' }, { status: 500 })
  }
}
