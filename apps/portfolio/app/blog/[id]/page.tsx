import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PostDetail from '@/components/blog/PostDetail'
import { isOwner } from '@/lib/auth-utils'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params
  const isUserOwner = await isOwner()

  try {
    // Fetch the post directly with Prisma since we're on the server
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

    return <PostDetail post={transformedPost} isOwner={isUserOwner} />
  } catch (error) {
    notFound()
  }
}
