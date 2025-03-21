'use client'

import { motion } from 'framer-motion'

export function Introduction() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-16 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Full Stack Developer
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Building modern web applications with Next.js, TypeScript, and cutting-edge technologies
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-8 py-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors">
            View Projects
          </button>
          <button className="px-8 py-3 rounded-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
            Contact Me
          </button>
        </div>
      </motion.div>
    </section>
  )
}
