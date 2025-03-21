'use client'

import { motion } from 'framer-motion'

const technologies = [
  { name: 'Next.js', icon: '⚡' },
  { name: 'TypeScript', icon: '📘' },
  { name: 'React', icon: '⚛️' },
  { name: 'Node.js', icon: '🟢' },
  { name: 'Prisma', icon: '💎' },
  { name: 'tRPC', icon: '🔷' },
  { name: 'TailwindCSS', icon: '🎨' },
  { name: 'PostgreSQL', icon: '🐘' },
]

export function TechStack() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Tech Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800 text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-3">{tech.icon}</div>
              <h3 className="text-lg font-semibold">{tech.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
