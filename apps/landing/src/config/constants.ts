export const SITE_CONFIG = {
  name: 'Frontend Boilerplate',
  description: 'Next.js starter template with clean architecture',
  url: process.env.NEXT_PUBLIC_APP_URL,
  ogImage: `${process.env.NEXT_PUBLIC_APP_URL}/og.jpg`,
}

export const NAVIGATION = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Projects',
    href: '/projects',
  },
  {
    title: 'Blog',
    href: '/blog',
  },
  {
    title: 'Contact',
    href: '/contact',
  },
]

export const API_ENDPOINTS = {
  auth: {
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
    signOut: '/api/auth/sign-out',
  },
  newsletter: {
    subscribe: '/api/newsletter/subscribe',
  },
  contact: {
    submit: '/api/contact',
  },
}
