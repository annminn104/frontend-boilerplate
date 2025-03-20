'use client'

import { Button } from '@fe-boilerplate/ui'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { contactFormSchema, type ContactFormValues } from '@/lib/validations/contact'
import { useContactStore } from '@/store/use-contact-store'
import { createContact } from '@/services/contact'
import { toast } from 'sonner'

export function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  })

  const { setEmail, setMessage } = useContactStore()

  const mutation = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      toast.success('Message sent successfully!')
      reset()
      setEmail('')
      setMessage('')
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message'
      console.error('Contact form error:', error)
      toast.error(errorMessage)
    },
  })

  const onSubmit = (data: ContactFormValues) => {
    setEmail(data.email)
    setMessage(data.message)
    mutation.mutate(data)
  }

  return (
    <section id="contact" className="bg-muted/50 py-20">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold">Get In Touch</h2>
          <p className="mb-8 text-muted-foreground">
            I'm currently available for freelance work. Let's talk about your project!
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <input
                type="text"
                {...register('name')}
                placeholder="Your Name"
                className="w-full rounded-md border border-input bg-background px-4 py-2"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div>
              <input
                type="email"
                {...register('email')}
                placeholder="Your Email"
                className="w-full rounded-md border border-input bg-background px-4 py-2"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div>
              <textarea
                {...register('message')}
                placeholder="Your Message"
                rows={5}
                className="w-full rounded-md border border-input bg-background px-4 py-2"
              />
              {errors.message && (
                <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>
              )}
            </div>
            <Button size="lg" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
