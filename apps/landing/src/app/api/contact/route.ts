import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contactFormSchema } from '@/lib/validations/contact'
import { sendEmail } from '@/lib/email'

interface ContactFormData {
  name: string
  email: string
  message: string
  phone?: string // Make phone optional
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactFormData

    // Save to database
    const submission = await prisma.contactSubmission.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        message: body.message,
      },
    })

    // Send notification email
    await sendEmail({
      to: process.env.CONTACT_EMAIL!,
      subject: 'New Contact Form Submission',
      text: `
        Name: ${body.name}
        Email: ${body.email}
        Phone: ${body.phone || 'Not provided'}
        Message: ${body.message}
      `,
    })

    // Send confirmation email
    await sendEmail({
      to: body.email,
      subject: 'Thank you for contacting us',
      text: `
        Dear ${body.name},

        Thank you for reaching out. We have received your message and will get back to you shortly.

        Best regards,
        Your Name
      `,
    })

    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json({ error: 'Failed to process contact form' }, { status: 500 })
  }
}
