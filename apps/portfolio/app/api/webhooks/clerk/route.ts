import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // Verify webhook signature
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    throw NextResponse.json(
      { message: 'Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env' },
      { status: 500 }
    )
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ message: 'Error occured -- no svix headers' }, { status: 400 })
  }

  // Get the body
  const payload = await req.json()

  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (error) {
    return NextResponse.json({ message: 'Error occurred', error }, { status: 400 })
  }

  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, username, first_name, last_name } = evt.data

    const email = email_addresses[0]?.email_address
    const name = [first_name, last_name].filter(Boolean).join(' ') || username || email?.split('@')[0]

    if (!email) {
      return NextResponse.json({ message: 'No email found' }, { status: 400 })
    }

    try {
      const user = await prisma.user.upsert({
        where: { clerkId: id },
        create: {
          clerkId: id,
          email: email,
          name: name,
        },
        update: {
          email: email,
          name: name,
        },
      })

      return NextResponse.json({ message: 'User synchronized', user }, { status: 200 })
    } catch (error) {
      return NextResponse.json({ message: 'Error syncing user', error }, { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    try {
      const user = await prisma.user.delete({
        where: { clerkId: id },
      })

      return NextResponse.json({ message: 'User deleted', user }, { status: 200 })
    } catch (error) {
      return NextResponse.json({ message: 'Error deleting user', error }, { status: 500 })
    }
  }

  return NextResponse.json({ message: 'Webhook received' }, { status: 200 })
}

export const runtime = 'edge'
