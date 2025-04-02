export default function ChatLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em]" />
        <p className="text-gray-500">Loading chat...</p>
      </div>
    </div>
  )
}
