'use client'

import { motion } from 'framer-motion'
import { BlogCard } from '../blog/blog-card'
import { useBlogPosts } from '@/hooks/use-blog-posts'

export function BlogSection() {
  const { posts, isLoading } = useBlogPosts({ limit: 3 })

  return (
    <section className="py-20">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="mb-4 text-3xl font-bold">Latest Blog Posts</h2>
          <p className="mb-12 text-muted-foreground">
            Read our latest articles and stay up to date with new technologies
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
