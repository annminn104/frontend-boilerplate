export const API_ROUTES = {
  auth: {
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
    signOut: '/api/auth/sign-out',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
  },
  users: {
    me: '/api/users/me',
    profile: '/api/users/profile',
    settings: '/api/users/settings',
  },
} as const

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
} as const
