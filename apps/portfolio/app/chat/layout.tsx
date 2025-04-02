import { ChatLayout } from '@/features/chat/components/ChatLayout'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <ChatLayout>{children}</ChatLayout>
}
