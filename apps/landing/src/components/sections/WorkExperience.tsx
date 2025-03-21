'use client'

import { motion } from 'framer-motion'

const experiences = [
  {
    company: 'Tech Corp',
    role: 'Senior Full Stack Developer',
    period: '2021 - Present',
    description: 'Led development of enterprise applications using Next.js and TypeScript.',
  },
  {
    company: 'Startup Inc',
    role: 'Full Stack Developer',
    period: '2019 - 2021',
    description: 'Built and maintained multiple client projects using React and Node.js.',
  },
]

export function WorkExperience() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Work Experience</h2>
        <div className="max-w-3xl mx-auto space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-bold mb-2">{exp.company}</h3>
              <div className="text-purple-600 font-semibold mb-2">{exp.role}</div>
              <div className="text-sm text-gray-500 mb-4">{exp.period}</div>
              <p className="text-gray-600 dark:text-gray-300">{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
