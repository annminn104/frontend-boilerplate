import { client } from '@/utils/api-client'

interface NewsletterSignupData {
  email: string
}

interface NewsletterResponse {
  success: boolean
  message: string
}

export async function subscribeToNewsletter(data: NewsletterSignupData): Promise {
  return client.post<NewsletterResponse>('/newsletter/subscribe', data)
}
