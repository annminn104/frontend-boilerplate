'use client'

import { useState, useMemo, useCallback } from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  Trash2,
  AlertTriangle,
  Download,
  ArrowUpDown,
  MessageSquare,
  Flag,
  Clock,
  Users,
  Ban,
  Search,
  Check,
  Eye,
  Edit,
  Reply,
} from 'lucide-react'
import { trpc } from '@/lib/trpc'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Textarea,
} from '@fe-boilerplate/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SearchAndFilter } from '@/components/admin/SearchAndFilter'
import { Pagination } from '@/components/admin/Pagination'
import { DateRangePicker } from '@/components/admin/DateRangePicker'
import type { Comment } from '@/types/comment'
import { env } from '@/env.mjs'
import type { DateRange } from 'react-day-picker'

type SortField = 'content' | 'author' | 'post' | 'createdAt' | 'likes'
type SortOrder = 'asc' | 'desc'
type SearchOperator = 'AND' | 'OR'

const ITEMS_PER_PAGE = 10

export default function CommentsAdminPage() {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [activeComment, setActiveComment] = useState<Comment | null>(null)
  const [searchFields, setSearchFields] = useState<Array<{ field: 'content' | 'author' | 'post'; value: string }>>([])
  const [searchOperator, setSearchOperator] = useState<SearchOperator>('AND')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedComments, setSelectedComments] = useState<Set<string>>(new Set())
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [isConfirmBulkDeleteOpen, setIsConfirmBulkDeleteOpen] = useState(false)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [isConfirmBulkSpamOpen, setIsConfirmBulkSpamOpen] = useState(false)
  const [isBulkMarkingSpam, setIsBulkMarkingSpam] = useState(false)
  const [bulkSpamAction, setBulkSpamAction] = useState<'mark' | 'unmark'>('mark')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'spam' | 'reported'>('all')
  const [viewComment, setViewComment] = useState<Comment | null>(null)
  const [editComment, setEditComment] = useState<Comment | null>(null)
  const [editedContent, setEditedContent] = useState('')
  const [replyToComment, setReplyToComment] = useState<Comment | null>(null)
  const [replyContent, setReplyContent] = useState('')

  const utils = trpc.useContext()

  const { data: comments, isLoading } = trpc.comment.getAllForAdmin.useQuery(undefined, {
    refetchOnWindowFocus: false,
  })

  // Subscribe to new comments
  trpc.comment.onNewComment.useSubscription(undefined, {
    onData: (newComment: Comment) => {
      utils.comment.getAllForAdmin.setData(undefined, prevComments => {
        if (!prevComments) return [newComment]
        return [newComment, ...prevComments]
      })
    },
    onError: err => {
      console.error('WebSocket error:', err)
    },
  })

  // Subscribe to comment updates
  trpc.comment.onCommentUpdated.useSubscription(undefined, {
    onData: (updatedComment: Comment) => {
      utils.comment.getAllForAdmin.setData(undefined, prevComments => {
        if (!prevComments) return [updatedComment]
        return prevComments.map(comment => (comment.id === updatedComment.id ? updatedComment : comment))
      })
    },
    onError: err => {
      console.error('WebSocket error:', err)
    },
  })

  // Subscribe to comment deletions
  trpc.comment.onCommentDeleted.useSubscription(undefined, {
    onData: (deletedCommentId: string) => {
      utils.comment.getAllForAdmin.setData(undefined, prevComments => {
        if (!prevComments) return []
        return prevComments.filter(comment => comment.id !== deletedCommentId)
      })
    },
    onError: err => {
      console.error('WebSocket error:', err)
    },
  })

  const { data: analyticsData } = trpc.analytics.getCommentMetrics.useQuery(undefined, {
    refetchOnWindowFocus: false,
  })

  const filteredComments = useMemo(() => {
    if (!comments) return []

    return comments
      .filter(comment => {
        // Status filter
        if (statusFilter === 'spam' && !comment.isSpam) return false
        if (statusFilter === 'reported' && !comment.isReported) return false

        // Date range filter
        if (dateRange?.from) {
          const commentDate = new Date(comment.createdAt)
          if (commentDate < dateRange.from) return false
          if (dateRange.to && commentDate > dateRange.to) return false
        }

        // Date quick filter
        if (dateFilter !== 'all') {
          const now = new Date()
          const commentDate = new Date(comment.createdAt)
          switch (dateFilter) {
            case 'today':
              const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
              if (commentDate < startOfToday) return false
              break
            case 'week':
              const startOfWeek = new Date(now)
              startOfWeek.setDate(now.getDate() - now.getDay())
              startOfWeek.setHours(0, 0, 0, 0)
              if (commentDate < startOfWeek) return false
              break
            case 'month':
              const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
              if (commentDate < startOfMonth) return false
              break
          }
        }

        // Advanced search with operators
        const searchMatches =
          searchFields.length === 0 ||
          (searchOperator === 'AND'
            ? searchFields.every(search => {
                const value = search.value.toLowerCase()
                switch (search.field) {
                  case 'content':
                    return comment.content.toLowerCase().includes(value)
                  case 'author':
                    return (
                      comment.author.name?.toLowerCase().includes(value) ||
                      comment.author.email.toLowerCase().includes(value)
                    )
                  case 'post':
                    return comment.post.title.toLowerCase().includes(value)
                  default:
                    return true
                }
              })
            : searchFields.some(search => {
                const value = search.value.toLowerCase()
                switch (search.field) {
                  case 'content':
                    return comment.content.toLowerCase().includes(value)
                  case 'author':
                    return (
                      comment.author.name?.toLowerCase().includes(value) ||
                      comment.author.email.toLowerCase().includes(value)
                    )
                  case 'post':
                    return comment.post.title.toLowerCase().includes(value)
                  default:
                    return true
                }
              }))

        return searchMatches
      })
      .sort((a, b) => {
        let comparison = 0
        switch (sortField) {
          case 'content':
            comparison = a.content.localeCompare(b.content)
            break
          case 'author':
            comparison = (a.author.name || '').localeCompare(b.author.name || '')
            break
          case 'post':
            comparison = a.post.title.localeCompare(b.post.title)
            break
          case 'createdAt':
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            break
          case 'likes':
            comparison = (b._count?.likes || 0) - (a._count?.likes || 0)
            break
        }
        return sortOrder === 'asc' ? comparison : -comparison
      })
  }, [comments, searchFields, searchOperator, sortField, sortOrder, statusFilter, dateRange, dateFilter])

  const totalPages = Math.ceil(filteredComments.length / ITEMS_PER_PAGE)
  const paginatedComments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredComments.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredComments, currentPage])

  const deleteComment = trpc.comment.adminDeleteComment.useMutation({
    onSuccess: () => {
      utils.comment.getAllForAdmin.invalidate()
      utils.post.getAllPublished.invalidate()
      if (activeComment?.post.id) {
        utils.post.getById.invalidate(activeComment.post.id)
      }
      setConfirmDeleteId(null)
      router.refresh()
    },
    onError: error => {
      console.error('Failed to delete comment:', error)
      alert('Failed to delete comment. Please try again.')
    },
  })

  const updateCommentStatus = trpc.comment.updateStatus.useMutation({
    onSuccess: () => {
      utils.comment.getAllForAdmin.invalidate()
      utils.post.getAllPublished.invalidate()
      setSelectedComments(new Set())
      setIsConfirmBulkSpamOpen(false)
      router.refresh()
    },
    onError: error => {
      console.error('Failed to update comments:', error)
      alert('Failed to update some comments. Please try again.')
    },
  })

  const updateComment = trpc.comment.updateContent.useMutation({
    onSuccess: () => {
      utils.comment.getAllForAdmin.invalidate()
      utils.post.getAllPublished.invalidate()
      if (editComment?.post.id) {
        utils.post.getById.invalidate(editComment.post.id)
      }
      setEditComment(null)
      setEditedContent('')
      router.refresh()
    },
    onError: error => {
      console.error('Failed to update comment:', error)
      alert('Failed to update comment. Please try again.')
    },
  })

  const replyToCommentMutation = trpc.comment.replyToComment.useMutation({
    onSuccess: () => {
      utils.comment.getAllForAdmin.invalidate()
      utils.post.getAllPublished.invalidate()
      if (replyToComment?.post.id) {
        utils.post.getById.invalidate(replyToComment.post.id)
      }
      setReplyToComment(null)
      setReplyContent('')
      router.refresh()
    },
    onError: error => {
      console.error('Failed to reply to comment:', error)
      alert('Failed to reply to comment. Please try again.')
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
      setSelectedComments(new Set(paginatedComments.map(comment => comment.id)))
    } else {
      setSelectedComments(new Set())
    }
  }

  const handleSelectComment = (commentId: string, checked: boolean) => {
    const newSelected = new Set(selectedComments)
    if (checked) {
      newSelected.add(commentId)
    } else {
      newSelected.delete(commentId)
    }
    setSelectedComments(newSelected)
  }

  const handleBulkDelete = async () => {
    if (selectedComments.size === 0) return

    setIsBulkDeleting(true)
    try {
      // Delete comments one by one
      for (const commentId of selectedComments) {
        await deleteComment.mutateAsync(commentId)
      }
      setSelectedComments(new Set())
      setIsConfirmBulkDeleteOpen(false)
    } catch (error) {
      console.error('Failed to delete comments:', error)
      alert('Failed to delete some comments. Please try again.')
    } finally {
      setIsBulkDeleting(false)
    }
  }

  const handleExportData = () => {
    const exportData = filteredComments.map(comment => ({
      id: comment.id,
      content: comment.content,
      author: comment.author.name,
      email: comment.author.email,
      post: comment.post.title,
      createdAt: new Date(comment.createdAt).toISOString(),
    }))

    const csv = [
      ['ID', 'Content', 'Author', 'Email', 'Post', 'Created At'],
      ...exportData.map(comment => [
        comment.id,
        comment.content,
        comment.author,
        comment.email,
        comment.post,
        comment.createdAt,
      ]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `comments-export-${new Date().toISOString()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleDeleteClick = (comment: Comment) => {
    setActiveComment(comment)
    setConfirmDeleteId(comment.id)
  }

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return

    setDeletingId(confirmDeleteId)
    try {
      await deleteComment.mutateAsync(confirmDeleteId)
    } finally {
      setDeletingId(null)
    }
  }

  const handleBulkSpam = async () => {
    if (selectedComments.size === 0) return

    setIsBulkMarkingSpam(true)
    try {
      for (const commentId of selectedComments) {
        await updateCommentStatus.mutateAsync({
          id: commentId,
          isSpam: bulkSpamAction === 'mark',
        })
      }
    } finally {
      setIsBulkMarkingSpam(false)
    }
  }

  const handleAddSearchField = () => {
    setSearchFields([...searchFields, { field: 'content', value: '' }])
  }

  const handleRemoveSearchField = (index: number) => {
    setSearchFields(searchFields.filter((_, i) => i !== index))
  }

  const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
    setDateRange(range)
    setCurrentPage(1)
  }, [])

  const handleDateFilterChange = useCallback((value: typeof dateFilter) => {
    setDateFilter(value)
    setCurrentPage(1)
  }, [])

  const handleStatusFilterChange = useCallback((value: typeof statusFilter) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }, [])

  const handleSearchFieldChange = useCallback((index: number, field: 'content' | 'author' | 'post', value: string) => {
    setSearchFields(prev => {
      const newFields = [...prev]
      newFields[index] = { field, value }
      return newFields
    })
    setCurrentPage(1)
  }, [])

  const handleSearchOperatorChange = useCallback((value: SearchOperator) => {
    setSearchOperator(value)
    setCurrentPage(1)
  }, [])

  const handleBulkApprove = useCallback(async () => {
    if (selectedComments.size === 0) return

    setIsBulkMarkingSpam(true)
    try {
      for (const commentId of selectedComments) {
        await updateCommentStatus.mutateAsync({
          id: commentId,
          isReported: false,
        })
      }
    } finally {
      setIsBulkMarkingSpam(false)
    }
  }, [selectedComments, updateCommentStatus])

  const handleViewClick = (comment: Comment) => {
    setViewComment(comment)
  }

  const handleEditClick = (comment: Comment) => {
    setEditComment(comment)
    setEditedContent(comment.content)
  }

  const handleReplyClick = (comment: Comment) => {
    setReplyToComment(comment)
    setReplyContent('')
  }

  const handleEditSubmit = async () => {
    if (!editComment) return
    await updateComment.mutateAsync({
      id: editComment.id,
      content: editedContent,
    })
  }

  const handleReplySubmit = async () => {
    if (!replyToComment) return
    await replyToCommentMutation.mutateAsync({
      parentId: replyToComment.id,
      postId: replyToComment.post.id,
      content: replyContent,
    })
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8">
        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData?.totalComments ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                {analyticsData?.commentsToday ?? 0} today, {analyticsData?.commentsThisWeek ?? 0} this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Spam Comments</CardTitle>
              <Ban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData?.totalSpam ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                {(((analyticsData?.totalSpam ?? 0) / (analyticsData?.totalComments ?? 1)) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reported Comments</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData?.totalReported ?? 0}</div>
              <p className="text-xs text-muted-foreground">Requires moderation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData?.averageResponseTime ?? 0}h</div>
              <p className="text-xs text-muted-foreground">Average response time</p>
            </CardContent>
          </Card>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Comments Management</h1>
          <Button variant="outline" onClick={handleExportData} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <DateRangePicker value={dateRange} onChange={handleDateRangeChange} placeholder="Select date range" />

          <Select value={dateFilter} onValueChange={handleDateFilterChange}>
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

          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Comments</SelectItem>
              <SelectItem value="spam">Spam</SelectItem>
              <SelectItem value="reported">Reported</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Search */}
        <div className="bg-muted/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-sm font-medium">Advanced Search</h2>
            <Select value={searchOperator} onValueChange={handleSearchOperatorChange}>
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
                onValueChange={(value: 'content' | 'author' | 'post') =>
                  handleSearchFieldChange(index, value, field.value)
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="author">Author</SelectItem>
                  <SelectItem value="post">Post</SelectItem>
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

        {/* Bulk Actions Bar */}
        {selectedComments.size > 0 && (
          <div className="bg-muted/30 rounded-lg p-4 mb-4 flex items-center justify-between">
            <span className="text-sm">
              {selectedComments.size} {selectedComments.size === 1 ? 'comment' : 'comments'} selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setBulkSpamAction('mark')
                  setIsConfirmBulkSpamOpen(true)
                }}
                disabled={isBulkMarkingSpam}
                className="flex items-center gap-2"
              >
                <Ban className="h-4 w-4" />
                Mark as Spam
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setBulkSpamAction('unmark')
                  setIsConfirmBulkSpamOpen(true)
                }}
                disabled={isBulkMarkingSpam}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Mark as Not Spam
              </Button>
              {statusFilter === 'reported' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkApprove}
                  disabled={isBulkMarkingSpam}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Approve Selected
                </Button>
              )}
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
        ) : filteredComments.length === 0 ? (
          <div className="bg-background rounded-lg p-8 text-center">
            <p className="text-lg text-muted-foreground">No comments found</p>
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
                          checked={selectedComments.size === paginatedComments.length}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all comments"
                        />
                      </th>
                      <th className="px-6 py-3 text-left">
                        <Button
                          variant="ghost"
                          className="h-8 flex items-center gap-1 -ml-3 font-medium text-xs uppercase text-muted-foreground"
                          onClick={() => handleSort('content')}
                        >
                          Content
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <Button
                          variant="ghost"
                          className="h-8 flex items-center gap-1 -ml-3 font-medium text-xs uppercase text-muted-foreground"
                          onClick={() => handleSort('author')}
                        >
                          Author
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <Button
                          variant="ghost"
                          className="h-8 flex items-center gap-1 -ml-3 font-medium text-xs uppercase text-muted-foreground"
                          onClick={() => handleSort('post')}
                        >
                          Post
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
                      <th className="px-6 py-3 text-left">
                        <Button
                          variant="ghost"
                          className="h-8 flex items-center gap-1 -ml-3 font-medium text-xs uppercase text-muted-foreground"
                          onClick={() => handleSort('likes')}
                        >
                          Likes
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted">
                    {paginatedComments.map(comment => (
                      <tr key={comment.id} className="hover:bg-muted/30">
                        <td className="px-6 py-4">
                          <Checkbox
                            checked={selectedComments.has(comment.id)}
                            onCheckedChange={checked => handleSelectComment(comment.id, !!checked)}
                            aria-label={`Select comment by ${comment.author.name}`}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="line-clamp-2">{comment.content}</div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="font-medium">{comment.author.name}</div>
                          <div className="text-muted-foreground text-xs">{comment.author.email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Link href={`/blog/${comment.post.id}`} className="text-primary hover:underline">
                            {comment.post.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{comment._count?.likes || 0}</td>
                        <td className="px-6 py-4 text-sm text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleViewClick(comment)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Details</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleEditClick(comment)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit Comment</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleReplyClick(comment)}>
                                  <Reply className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Reply to Comment</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => handleDeleteClick(comment)}
                                  disabled={deletingId === comment.id}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete Comment</TooltipContent>
                            </Tooltip>
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

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!confirmDeleteId} onOpenChange={open => !open && setConfirmDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Confirm Deletion
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this comment? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            {activeComment && (
              <div className="my-4 p-4 bg-muted/50 rounded-md">
                <p className="text-sm font-medium">Comment:</p>
                <p className="text-sm mt-1">{activeComment.content}</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  By {activeComment.author.name} on post "{activeComment.post.title}"
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
                  'Delete Comment'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Delete Confirmation Dialog */}
        <Dialog open={isConfirmBulkDeleteOpen} onOpenChange={setIsConfirmBulkDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Confirm Bulk Deletion
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedComments.size}{' '}
                {selectedComments.size === 1 ? 'comment' : 'comments'}? This action cannot be undone.
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
                  'Delete Comments'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Spam Confirmation Dialog */}
        <Dialog open={isConfirmBulkSpamOpen} onOpenChange={setIsConfirmBulkSpamOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {bulkSpamAction === 'mark' ? <Ban className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                Confirm {bulkSpamAction === 'mark' ? 'Spam' : 'Not Spam'} Mark
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to mark {selectedComments.size}{' '}
                {selectedComments.size === 1 ? 'comment' : 'comments'} as{' '}
                {bulkSpamAction === 'mark' ? 'spam' : 'not spam'}?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfirmBulkSpamOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleBulkSpam} disabled={isBulkMarkingSpam}>
                {isBulkMarkingSpam ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Processing...
                  </>
                ) : (
                  `Mark as ${bulkSpamAction === 'mark' ? 'Spam' : 'Not Spam'}`
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Comment Dialog */}
        <Dialog open={!!viewComment} onOpenChange={open => !open && setViewComment(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Comment Details</DialogTitle>
            </DialogHeader>

            {viewComment && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Content</h3>
                  <p className="text-sm bg-muted/50 p-4 rounded-md">{viewComment.content}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Author</h3>
                    <div className="text-sm">
                      <p>{viewComment.author.name}</p>
                      <p className="text-muted-foreground">{viewComment.author.email}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-1">Post</h3>
                    <Link href={`/blog/${viewComment.post.id}`} className="text-sm text-primary hover:underline">
                      {viewComment.post.title}
                    </Link>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-1">Created At</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(viewComment.createdAt), { addSuffix: true })}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-1">Status</h3>
                    <div className="flex gap-2">
                      {viewComment.isSpam && (
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">Spam</span>
                      )}
                      {viewComment.isReported && (
                        <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full">Reported</span>
                      )}
                      {!viewComment.isSpam && !viewComment.isReported && (
                        <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">Active</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewComment(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Comment Dialog */}
        <Dialog open={!!editComment} onOpenChange={open => !open && setEditComment(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Comment</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label htmlFor="content" className="text-sm font-medium">
                  Content
                </label>
                <Textarea
                  id="content"
                  value={editedContent}
                  onChange={e => setEditedContent(e.target.value)}
                  rows={4}
                  className="mt-1"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditComment(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditSubmit} disabled={updateComment.isPending}>
                {updateComment.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reply to Comment Dialog */}
        <Dialog open={!!replyToComment} onOpenChange={open => !open && setReplyToComment(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reply to Comment</DialogTitle>
            </DialogHeader>

            {replyToComment && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Original Comment</h3>
                  <p className="text-sm bg-muted/50 p-4 rounded-md">{replyToComment.content}</p>
                </div>

                <div>
                  <label htmlFor="reply" className="text-sm font-medium">
                    Your Reply
                  </label>
                  <Textarea
                    id="reply"
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setReplyToComment(null)}>
                Cancel
              </Button>
              <Button onClick={handleReplySubmit} disabled={replyToCommentMutation.isPending}>
                {replyToCommentMutation.isPending ? 'Sending...' : 'Send Reply'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
