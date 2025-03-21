import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/server/db'
import { PostDetail } from '@/components/blog/PostDetail'

interface BlogPostPageProps {
  params: {
    id: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { userId } = await auth()
  const isOwner = userId === process.env.NEXT_PUBLIC_OWNER_USER_ID

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: true,
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
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

  return (
    <div className="container mx-auto px-4 py-8">
      <PostDetail post={post} isOwner={isOwner} />
    </div>
  )
}
