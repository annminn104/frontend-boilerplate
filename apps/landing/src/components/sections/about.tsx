'use client'

import { motion } from 'framer-motion'
import { Image } from '@/components/ui/image'

export function About() {
  return (
    <section id="about" className="py-20">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid gap-12 md:grid-cols-2"
        >
          <div className="relative h-[400px] overflow-hidden rounded-xl">
            <Image
              src="https://images.unsplash.com/photo-1537511446984-935f663eb1f4?q=80&w=1000"
              alt="Profile"
              wrapperClassName="relative h-[400px] overflow-hidden rounded-xl"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="mb-4 text-3xl font-bold">About Me</h2>
            <p className="mb-6 text-muted-foreground">
              I'm a passionate developer with experience in building modern web applications. I
              specialize in React, Next.js, and TypeScript, with a strong focus on creating clean,
              maintainable code and delightful user experiences.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="mb-2 font-semibold">Location</h3>
                <p className="text-muted-foreground">Your City, Country</p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Experience</h3>
                <p className="text-muted-foreground">5+ Years</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
