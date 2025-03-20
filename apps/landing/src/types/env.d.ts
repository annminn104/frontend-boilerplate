declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_APP_URL: string
    NEXT_PUBLIC_API_URL: string
    NEXT_PUBLIC_WS_URL: string

    // Authentication
    NEXTAUTH_URL: string
    NEXTAUTH_SECRET: string

    // Database
    DATABASE_URL: string

    // Email
    SMTP_FROM: string
    SMTP_HOST: string
    SMTP_PORT: string
    SMTP_USER: string
    SMTP_PASSWORD: string

    // OAuth
    GITHUB_CLIENT_ID: string
    GITHUB_CLIENT_SECRET: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string

    // Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string
    CLERK_SECRET_KEY: string

    // PostHog
    NEXT_PUBLIC_POSTHOG_KEY: string
    NEXT_PUBLIC_POSTHOG_HOST: string
  }
}
