'use client'

import { SignInButton as ClerkSignInButton } from '@clerk/nextjs'
import { motion } from 'framer-motion'

export function SignInButton() {
  return (
    <ClerkSignInButton mode="modal">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
      >
        Sign In
      </motion.button>
    </ClerkSignInButton>
  )
}
