import { API_ENDPOINTS } from '@/config/constants'

export async function subscribeToNewsletter(email: string) {
  const res = await fetch(API_ENDPOINTS.newsletter.subscribe, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message)
  }

  return res.json()
}

export async function submitContactForm(data: { name: string; email: string; message: string }) {
  const res = await fetch(API_ENDPOINTS.contact.submit, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message)
  }

  return res.json()
}
