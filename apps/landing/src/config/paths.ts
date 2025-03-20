export const paths = {
  home: '/',
  about: '/about',
  blog: '/blog',
  contact: '/contact',
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  dashboard: {
    index: '/dashboard',
    profile: '/dashboard/profile',
    settings: '/dashboard/settings',
  },
} as const
