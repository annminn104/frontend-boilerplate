import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

/**
 * Check if a user has the OWNER role
 */
export async function isOwner(): Promise<boolean> {
  const { userId } = await auth()
  if (!userId) return false

  // Get the first user in the system (by createdAt)
  const owner = await prisma.user.findUnique({
    where: {
      clerkId: userId,
      role: 'OWNER',
    },
  })

  // If this user is the first user, consider them an owner
  return !!owner && owner.clerkId === userId
}

/**
 * Check if a user has owner role and redirect if not
 */
export async function requireOwner(): Promise<void> {
  const isUserOwner = await isOwner()
  if (!isUserOwner) {
    redirect('/')
  }
}

/**
 * Check if the current user ID matches the provided Clerk ID
 */
export async function isCurrentUser(clerkId: string): Promise<boolean> {
  const { userId } = await auth()
  return userId === clerkId
}

/**
 * Check if user is an owner or the specified user
 */
export async function isOwnerOrUser(clerkId: string): Promise<boolean> {
  const isUserOwner = await isOwner()
  if (isUserOwner) return true

  return await isCurrentUser(clerkId)
}
