import { client } from '@/utils/api-client'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
}

interface ContactResponse {
  success: boolean
  message: string
}

export async function submitContactForm(data: ContactFormData): Promise {
  return client.post<ContactResponse>('/contact', data)
}
