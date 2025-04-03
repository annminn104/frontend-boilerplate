import { CommentList } from '@/features/comments/components/CommentList'

interface Props {
  params: Promise<{ postId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CommentsPage({ params }: Props) {
  const { postId } = await params
  return <CommentList postId={postId} />
}
