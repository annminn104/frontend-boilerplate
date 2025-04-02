interface CommentsLayoutProps {
  children: React.ReactNode
}

export default function CommentsLayout({ children }: CommentsLayoutProps) {
  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h1 className="mb-6 text-2xl font-bold">Comments</h1>
        {children}
      </div>
    </div>
  )
}
