import { create } from 'zustand'

interface ContactState {
  email: string
  message: string
  setEmail: (email: string) => void
  setMessage: (message: string) => void
  reset: () => void
}

export const useContactStore = create<ContactState>((set) => ({
  email: '',
  message: '',
  setEmail: (email) => set({ email }),
  setMessage: (message) => set({ message }),
  reset: () => set({ email: '', message: '' }),
}))
