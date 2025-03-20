import { ContactFormValues } from '@/lib/validations/contact'

export async function createContact(data: ContactFormValues) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.details || json.error || 'Failed to send message')
  }

  return json
}
