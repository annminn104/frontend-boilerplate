import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
// import { PortfolioEditor } from '@/components/admin/PortfolioEditor'

export default async function AdminPortfolioPage() {
  const { userId } = await auth()

  if (userId !== process.env.NEXT_PUBLIC_OWNER_USER_ID) {
    redirect('/')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Portfolio Management</h1>
      {/* <PortfolioEditor /> */}
    </div>
  )
}
