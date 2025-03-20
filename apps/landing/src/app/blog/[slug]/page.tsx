import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { getBlogPost } from '@/services/blog'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="container py-12">
      {post.image && (
        <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
          <img src={post.image} alt={post.title} className="object-cover" />
        </div>
      )}

      <article className="prose prose-slate dark:prose-invert mx-auto">
        <h1>{post.title}</h1>
        <div className="text-muted-foreground">{formatDate(post.createdAt)}</div>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </main>
  )
}
