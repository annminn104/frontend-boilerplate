'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PostForm } from './PostForm'
import { Dialog } from '@/components/ui/Dialog'

export function CreatePostButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Create Post
      </motion.button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Content className="sm:max-w-[600px]">
          <Dialog.Header>
            <Dialog.Title>Create New Post</Dialog.Title>
          </Dialog.Header>
          <PostForm onSuccess={() => setIsOpen(false)} />
        </Dialog.Content>
      </Dialog>
    </>
  )
}
