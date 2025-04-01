'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { trpc } from '@/lib/trpc'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Input,
  Badge,
} from '@fe-boilerplate/ui'
import { PostForm } from '@/components/blog/PostForm'
import {
  PlusCircle,
  Edit2,
  Trash2,
  AlertTriangle,
  ExternalLink,
  Download,
  ArrowUpDown,
  Eye,
  EyeOff,
  BarChart3,
  TrendingUp,
  MessageSquare,
  Heart,
  Calendar,
  Search,
} from 'lucide-react'
import Link from 'next/link'
import { SearchAndFilter } from '@/components/admin/SearchAndFilter'
import { Pagination } from '@/components/admin/Pagination'
import { DateRangePicker } from '@/components/admin/DateRangePicker'
import type { TRPCClientErrorLike } from '@trpc/client'
import { DateRange } from 'react-day-picker'

type Post = {
  id: string
  title: string
  content: string
  published: boolean
  createdAt: Date
  _count: {
    comments: number
    likes: number
  }
}

type SortField = 'title' | 'createdAt' | 'comments' | 'likes'
type SortOrder = 'asc' | 'desc'
type SearchOperator = 'AND' | 'OR'

const ITEMS_PER_PAGE = 10

export default function PostsAdminPage() {
  const router = useRouter()
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set())
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [isConfirmBulkDeleteOpen, setIsConfirmBulkDeleteOpen] = useState(false)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all')
  const [engagementFilter, setEngagementFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [searchOperator, setSearchOperator] = useState<SearchOperator>('AND')
  const [searchFields, setSearchFields] = useState<Array<{ field: 'title' | 'content'; value: string }>>([])
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [isConfirmBulkPublishOpen, setIsConfirmBulkPublishOpen] = useState(false)
  const [isBulkPublishing, setIsBulkPublishing] = useState(false)
  const [bulkPublishAction, setBulkPublishAction] = useState<'publish' | 'unpublish'>('publish')

  const utils = trpc.useContext()

  const { data: posts, isLoading } = trpc.post.getAllForAdmin.useQuery(undefined, {
    refetchOnWindowFocus: false,
  })

  const { data: analyticsData } = trpc.analytics.getPostMetrics.useQuery(undefined, {
    refetchOnWindowFocus: false,
  })

  const filteredPosts = useMemo(() => {
    if (!posts) return []

    return posts
      .filter(post => {
        const searchMatches =
          searchFields.length === 0 ||
          (searchOperator === 'AND'
            ? searchFields.every(search =>
                search.field === 'title'
                  ? post.title.toLowerCase().includes(search.value.toLowerCase())
                  : post.content.toLowerCase().includes(search.value.toLowerCase())
              )
            : searchFields.some(search =>
                search.field === 'title'
                  ? post.title.toLowerCase().includes(search.value.toLowerCase())
                  : post.content.toLowerCase().includes(search.value.toLowerCase())
              ))

        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'published' && post.published) ||
          (statusFilter === 'draft' && !post.published)

        const postDate = new Date(post.createdAt)
        const matchesDateRange =
          !dateRange?.from || !dateRange?.to || (postDate >= dateRange.from && postDate <= dateRange.to)

        const now = new Date()
        const matchesDate =
          dateFilter === 'all' ||
          (dateFilter === 'today' && postDate >= new Date(now.setHours(0, 0, 0, 0))) ||
          (dateFilter === 'week' && postDate >= new Date(now.setDate(now.getDate() - 7))) ||
          (dateFilter === 'month' && postDate >= new Date(now.setMonth(now.getMonth() - 1)))

        const engagement = post._count.comments + post._count.likes
        const matchesEngagement =
          engagementFilter === 'all' ||
          (engagementFilter === 'high' && engagement >= 10) ||
          (engagementFilter === 'medium' && engagement >= 5 && engagement < 10) ||
          (engagementFilter === 'low' && engagement < 5)

        return searchMatches && matchesStatus && matchesDateRange && matchesDate && matchesEngagement
      })
      .sort((a, b) => {
        let comparison = 0
        switch (sortField) {
          case 'title':
            comparison = a.title.localeCompare(b.title)
            break
          case 'createdAt':
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            break
          case 'comments':
            comparison = a._count.comments - b._count.comments
            break
          case 'likes':
            comparison = a._count.likes - b._count.likes
            break
        }
        return sortOrder === 'asc' ? comparison : -comparison
      })
  }, [posts, searchFields, searchOperator, statusFilter, dateRange, dateFilter, engagementFilter, sortField, sortOrder])

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE)
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredPosts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredPosts, currentPage])

  const deletePost = trpc.post.delete.useMutation({
    onSuccess: () => {
      utils.post.getAllForAdmin.invalidate()
      utils.post.getAllPublished.invalidate()
      utils.post.getById.invalidate(confirmDeleteId!)
      setConfirmDeleteId(null)
      router.refresh()
    },
    onError: error => {
      console.error('Failed to delete post:', error)
      alert('Failed to delete post. Please try again.')
    },
  })

  const updatePostStatus = trpc.post.updateStatus.useMutation({
    onSuccess: () => {
      utils.post.getAllForAdmin.invalidate()
      utils.post.getAllPublished.invalidate()
      setSelectedPosts(new Set())
      setIsConfirmBulkPublishOpen(false)
      router.refresh()
    },
    onError: (error: TRPCClientErrorLike<any>) => {
      console.error('Failed to update posts:', error)
      alert('Failed to update some posts. Please try again.')
    },
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPosts(new Set(paginatedPosts.map(post => post.id)))
    } else {
      setSelectedPosts(new Set())
    }
  }

  const handleSelectPost = (postId: string, checked: boolean) => {
    const newSelected = new Set(selectedPosts)
    if (checked) {
      newSelected.add(postId)
    } else {
      newSelected.delete(postId)
    }
    setSelectedPosts(newSelected)
  }

  const handleBulkDelete = async () => {
    if (selectedPosts.size === 0) return

    setIsBulkDeleting(true)
    try {
      for (const postId of selectedPosts) {
        await deletePost.mutateAsync(postId)
      }
      setSelectedPosts(new Set())
      setIsConfirmBulkDeleteOpen(false)
    } catch (error) {
      console.error('Failed to delete posts:', error)
      alert('Failed to delete some posts. Please try again.')
    } finally {
      setIsBulkDeleting(false)
    }
  }

  const handleExportData = () => {
    const exportData = filteredPosts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      status: post.published ? 'Published' : 'Draft',
      createdAt: new Date(post.createdAt).toISOString(),
      comments: post._count.comments,
      likes: post._count.likes,
    }))

    const csv = [
      ['ID', 'Title', 'Content', 'Status', 'Created At', 'Comments', 'Likes'],
      ...exportData.map(post => [
        post.id,
        post.title,
        post.content,
        post.status,
        post.createdAt,
        post.comments,
        post.likes,
      ]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `posts-export-${new Date().toISOString()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleEditClick = (post: Post) => {
    setEditingPost(post)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (post: Post) => {
    setEditingPost(post)
    setConfirmDeleteId(post.id)
  }

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return

    setDeletingId(confirmDeleteId)
    try {
      await deletePost.mutateAsync(confirmDeleteId)
    } finally {
      setDeletingId(null)
    }
  }

  const handleFormSuccess = () => {
    setIsCreateModalOpen(false)
    setIsEditModalOpen(false)

    utils.post.getAllForAdmin.invalidate()
    utils.post.getAllPublished.invalidate()
    if (editingPost) {
      utils.post.getById.invalidate(editingPost.id)
    }

    setEditingPost(null)

    router.refresh()
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleBulkPublish = async () => {
    if (selectedPosts.size === 0) return

    setIsBulkPublishing(true)
    try {
      for (const postId of selectedPosts) {
        await updatePostStatus.mutateAsync({
          id: postId,
          published: bulkPublishAction === 'publish',
        })
      }
    } finally {
      setIsBulkPublishing(false)
    }
  }

  const handleAddSearchField = () => {
    setSearchFields([...searchFields, { field: 'title', value: '' }])
  }

  const handleRemoveSearchField = (index: number) => {
    setSearchFields(searchFields.filter((_, i) => i !== index))
  }

  const handleSearchFieldChange = (index: number, field: 'title' | 'content', value: string) => {
    const newFields = [...searchFields]
    newFields[index] = { field, value }
    setSearchFields(newFields)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.totalPosts ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData?.publishedPosts ?? 0} published, {analyticsData?.draftPosts ?? 0} drafts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.totalViews ?? 0}</div>
            <p className="text-xs text-muted-foreground">Avg. {analyticsData?.averageViewsPerPost ?? 0} per post</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.totalComments ?? 0}</div>
            <p className="text-xs text-muted-foreground">Avg. {analyticsData?.averageCommentsPerPost ?? 0} per post</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.totalLikes ?? 0}</div>
            <p className="text-xs text-muted-foreground">Avg. {analyticsData?.averageLikesPerPost ?? 0} per post</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportData} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Post
          </Button>
        </div>
      </div>

      <div className="bg-muted/30 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-sm font-medium">Advanced Search</h2>
          <Select value={searchOperator} onValueChange={(value: SearchOperator) => setSearchOperator(value)}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND">AND</SelectItem>
              <SelectItem value="OR">OR</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleAddSearchField}>
            Add Field
          </Button>
        </div>
        {searchFields.map((field, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <Select
              value={field.field}
              onValueChange={(value: 'title' | 'content') => handleSearchFieldChange(index, value, field.value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="content">Content</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={field.value}
              onChange={e => handleSearchFieldChange(index, field.field, e.target.value)}
              placeholder={`Search in ${field.field}...`}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveSearchField(index)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Select
          value={statusFilter}
          onValueChange={value => {
            setStatusFilter(value as typeof statusFilter)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Posts</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
          </SelectContent>
        </Select>

        <DateRangePicker
          value={dateRange}
          onChange={(value: DateRange | undefined) => setDateRange(value)}
          placeholder="Select date range"
        />

        <Select
          value={dateFilter}
          onValueChange={value => {
            setDateFilter(value as typeof dateFilter)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Quick Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={engagementFilter}
          onValueChange={value => {
            setEngagementFilter(value as typeof engagementFilter)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Engagement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Engagement</SelectItem>
            <SelectItem value="high">High (10+)</SelectItem>
            <SelectItem value="medium">Medium (5-9)</SelectItem>
            <SelectItem value="low">Low (0-4)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedPosts.size > 0 && (
        <div className="bg-muted/30 rounded-lg p-4 mb-4 flex items-center justify-between">
          <span className="text-sm">
            {selectedPosts.size} {selectedPosts.size === 1 ? 'post' : 'posts'} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBulkPublishAction('publish')
                setIsConfirmBulkPublishOpen(true)
              }}
              disabled={isBulkPublishing}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Publish Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBulkPublishAction('unpublish')
                setIsConfirmBulkPublishOpen(true)
              }}
              disabled={isBulkPublishing}
              className="flex items-center gap-2"
            >
              <EyeOff className="h-4 w-4" />
              Unpublish Selected
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsConfirmBulkDeleteOpen(true)}
              disabled={isBulkDeleting}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-background rounded-lg p-8 text-center">
          <p className="text-lg text-muted-foreground">No posts found</p>
          <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4 flex items-center gap-2 mx-auto">
            <PlusCircle className="h-4 w-4" />
            Create your first post
          </Button>
        </div>
      ) : (
        <>
          <div className="bg-background rounded-lg shadow overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <Checkbox
                        checked={selectedPosts.size === paginatedPosts.length}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all posts"
                      />
                    </th>
                    <th className="px-6 py-3 text-left">
                      <Button
                        variant="ghost"
                        className="h-8 flex items-center gap-1 -ml-3 font-medium text-xs uppercase text-muted-foreground"
                        onClick={() => handleSort('title')}
                      >
                        Title
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <Button
                        variant="ghost"
                        className="h-8 flex items-center gap-1 -ml-3 font-medium text-xs uppercase text-muted-foreground"
                        onClick={() => handleSort('createdAt')}
                      >
                        Date
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left">
                      <Button
                        variant="ghost"
                        className="h-8 flex items-center gap-1 -ml-3 font-medium text-xs uppercase text-muted-foreground"
                        onClick={() => handleSort('comments')}
                      >
                        Stats
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted">
                  {paginatedPosts.map(post => (
                    <tr key={post.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <Checkbox
                          checked={selectedPosts.has(post.id)}
                          onCheckedChange={checked => handleSelectPost(post.id, !!checked)}
                          aria-label={`Select post ${post.title}`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="line-clamp-1 font-medium">{post.title}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.published
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                          }`}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="text-muted-foreground flex items-center gap-3">
                          <span>{post._count.comments} comments</span>
                          <span>•</span>
                          <span>{post._count.likes} likes</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/blog/${post.id}`}
                            className="p-2 text-primary rounded-md hover:bg-primary/10"
                            title="View post"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(post)}
                            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                            title="Edit post"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(post)}
                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                            title="Delete post"
                            disabled={deletingId === post.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-6"
          />
        </>
      )}

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <PostForm onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          {editingPost && (
            <PostForm
              post={{
                id: editingPost.id,
                title: editingPost.title,
                content: editingPost.content,
                published: editingPost.published,
              }}
              onSuccess={handleFormSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmDeleteId} onOpenChange={open => !open && setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {editingPost && (
            <div className="my-4 p-4 bg-muted/50 rounded-md">
              <p className="text-sm font-medium">Post:</p>
              <p className="text-sm mt-1 font-medium">{editingPost.title}</p>
              <p className="text-sm mt-1 line-clamp-2">{editingPost.content}</p>
              <div className="mt-2 text-xs text-muted-foreground">
                {editingPost._count.comments} comments • {editingPost._count.likes} likes
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deletingId === confirmDeleteId}>
              {deletingId === confirmDeleteId ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Post'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmBulkDeleteOpen} onOpenChange={setIsConfirmBulkDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Bulk Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedPosts.size} {selectedPosts.size === 1 ? 'post' : 'posts'}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmBulkDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete} disabled={isBulkDeleting}>
              {isBulkDeleting ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Posts'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmBulkPublishOpen} onOpenChange={setIsConfirmBulkPublishOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {bulkPublishAction === 'publish' ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              Confirm {bulkPublishAction === 'publish' ? 'Publication' : 'Unpublication'}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {bulkPublishAction} {selectedPosts.size}{' '}
              {selectedPosts.size === 1 ? 'post' : 'posts'}?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmBulkPublishOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkPublish} disabled={isBulkPublishing}>
              {isBulkPublishing ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Processing...
                </>
              ) : (
                `${bulkPublishAction === 'publish' ? 'Publish' : 'Unpublish'} Posts`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
