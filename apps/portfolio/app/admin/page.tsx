'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { BarChart3, MessageSquare, FileText, Layers, Briefcase, ExternalLink } from 'lucide-react'
import { Button } from '@fe-boilerplate/ui'

export default function AdminDashboardPage() {
  const router = useRouter()

  const { data: posts, isLoading: postsLoading } = trpc.post.getAllForAdmin.useQuery()
  const { data: projects, isLoading: projectsLoading } = trpc.project.getAll.useQuery()
  const { data: comments, isLoading: commentsLoading } = trpc.comment.getAllForAdmin.useQuery()

  const isLoading = postsLoading || projectsLoading || commentsLoading

  const adminCards = [
    {
      title: 'Blog Posts',
      description: 'Manage your blog posts',
      icon: <FileText className="h-6 w-6" />,
      count: posts?.length || 0,
      href: '/admin/posts',
    },
    {
      title: 'Projects',
      description: 'Manage your portfolio projects',
      icon: <Briefcase className="h-6 w-6" />,
      count: projects?.length || 0,
      href: '/admin/projects',
    },
    {
      title: 'Portfolio Sections',
      description: 'Customize your portfolio sections',
      icon: <Layers className="h-6 w-6" />,
      count: 4, // Assuming there are roughly 4 sections
      href: '/admin/portfolio',
    },
    {
      title: 'Comments',
      description: 'Manage user comments',
      icon: <MessageSquare className="h-6 w-6" />,
      count: comments?.length || 0,
      href: '/admin/comments',
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => router.push('/')} className="flex items-center gap-2">
          <ExternalLink className="h-4 w-4" />
          View Site
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {adminCards.map(card => (
          <div
            key={card.title}
            className="bg-background p-6 rounded-xl shadow-sm border cursor-pointer hover:border-primary transition-colors"
            onClick={() => router.push(card.href)}
          >
            <div className="flex justify-between items-start">
              <div className="p-2 bg-primary/10 rounded-lg">{card.icon}</div>
              <div className="flex items-center justify-center rounded-full bg-muted h-8 w-8">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                ) : (
                  <span className="text-sm font-medium">{card.count}</span>
                )}
              </div>
            </div>
            <h3 className="text-lg font-semibold mt-4">{card.title}</h3>
            <p className="mt-1 text-muted-foreground text-sm">{card.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-background rounded-xl p-6 shadow-sm border">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Analytics Overview
        </h2>
        <p className="text-muted-foreground">Analytics dashboard will be implemented here.</p>
      </div>
    </div>
  )
}
