import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { PostDetail } from '@/components/blog/PostDetail'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  const { id } = await params
  const isOwner = userId === process.env.NEXT_PUBLIC_OWNER_USER_ID

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          clerkId: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: { likes: true, comments: true },
      },
    },
  })

  if (!post) {
    notFound()
  }

  // Transform the data to ensure name is always a string
  const transformedPost = {
    ...post,
    author: {
      ...post.author,
      name: post.author.name || post.author.email?.split('@')[0] || 'Anonymous',
    },
    comments: post.comments.map(comment => ({
      ...comment,
      author: {
        ...comment.author,
        name: comment.author.name || comment.author.email?.split('@')[0] || 'Anonymous',
      },
    })),
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PostDetail post={transformedPost} isOwner={isOwner} />
    </div>
  )
}
