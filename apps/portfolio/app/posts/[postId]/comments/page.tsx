import { CommentList } from '@/features/comments/components/CommentList'

interface CommentsPageProps {
  params: {
    postId: string
  }
}

export default function CommentsPage({ params }: CommentsPageProps) {
  return <CommentList postId={params.postId} />
}
