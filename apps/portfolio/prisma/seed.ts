import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log(`🌱 Starting database seeding...`)

  // Create owner user (first user will be the owner)
  const ownerEmail = 'admin@example.com'
  const ownerUser = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: {
      email: ownerEmail,
      name: 'Admin User',
      clerkId: 'admin_clerk_id',
      role: UserRole.OWNER,
    },
  })
  console.log(`👤 Created owner user: ${ownerUser.name} (${ownerUser.email})`)

  // Create a regular user
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      clerkId: 'user_clerk_id',
      role: UserRole.USER,
    },
  })
  console.log(`👤 Created regular user: ${regularUser.name} (${regularUser.email})`)

  // Create blog posts
  const posts = [
    {
      title: 'Getting Started with Next.js',
      content: `
# Getting Started with Next.js

Next.js is a React framework that enables server-side rendering and generating static websites.

## Why Next.js?

- **Server-side Rendering (SSR)**: Generates HTML on each request
- **Static Site Generation (SSG)**: Generates HTML at build time
- **Incremental Static Regeneration (ISR)**: Update static content after deployment
- **API Routes**: Create API endpoints easily
      `,
      published: true,
    },
    {
      title: 'The Power of TypeScript',
      content: `
# The Power of TypeScript

TypeScript adds static type definitions to JavaScript, helping you catch errors early.

## Benefits of TypeScript

- **Type Safety**: Catch errors at compile time
- **Better Tooling**: Enhanced IDE support
- **Improved Documentation**: Types serve as documentation
- **Easier Refactoring**: Confidence in code changes
      `,
      published: true,
    },
    {
      title: 'Styling with Tailwind CSS',
      content: `
# Styling with Tailwind CSS

Tailwind CSS is a utility-first CSS framework for rapidly building custom designs.

## Advantages of Tailwind

- **Utility-First**: Compose designs directly in your markup
- **Responsive**: Easy mobile-first design
- **Component-Driven**: Extract reusable components
- **Customizable**: Tailor the framework to your needs
      `,
      published: false,
    },
  ]

  for (const post of posts) {
    const createdPost = await prisma.post.create({
      data: {
        ...post,
        author: {
          connect: { id: ownerUser.id },
        },
      },
    })
    console.log(`📝 Created post: ${createdPost.title}`)
  }

  // Create projects
  const projects = [
    {
      title: 'Portfolio Website',
      description: 'A personal portfolio website built with Next.js and Tailwind CSS',
      content:
        'This is a portfolio website showcasing my work and skills as a developer. It features a blog, project showcase, and contact form.',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      githubUrl: 'https://github.com/username/portfolio',
      demoUrl: 'https://portfolio.example.com',
      tags: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
      featured: true,
      published: true,
      order: 1,
    },
    {
      title: 'E-commerce Platform',
      description: 'A fully-featured e-commerce platform with payment processing',
      content:
        'An e-commerce platform built with Next.js, Prisma, and Stripe for payment processing. Features include product listings, shopping cart, and order management.',
      imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c',
      githubUrl: 'https://github.com/username/ecommerce',
      demoUrl: 'https://ecommerce.example.com',
      tags: ['Next.js', 'Prisma', 'Stripe', 'TypeScript'],
      featured: true,
      published: true,
      order: 2,
    },
    {
      title: 'Task Management App',
      description: 'A Kanban-style task management application',
      content:
        'A task management application with drag-and-drop functionality. Users can create boards, lists, and cards to organize their work.',
      imageUrl: 'https://images.unsplash.com/photo-1540888590159-81dad95e9ab8',
      githubUrl: 'https://github.com/username/taskmanager',
      demoUrl: 'https://tasks.example.com',
      tags: ['React', 'Redux', 'Firebase'],
      featured: false,
      published: true,
      order: 3,
    },
    {
      title: 'Weather Dashboard',
      description: 'A dashboard for viewing weather forecasts',
      content: 'A weather dashboard that displays current conditions and forecasts for multiple locations.',
      imageUrl: 'https://images.unsplash.com/photo-1592210454359-9043f067919b',
      githubUrl: 'https://github.com/username/weather',
      demoUrl: 'https://weather.example.com',
      tags: ['React', 'OpenWeather API', 'Chart.js'],
      featured: false,
      published: false,
      order: 4,
    },
  ]

  for (const project of projects) {
    const createdProject = await prisma.project.create({
      data: project,
    })
    console.log(`🚀 Created project: ${createdProject.title}`)
  }

  // Create portfolio sections
  const portfolioSections = [
    {
      type: 'introduction',
      title: 'About Me',
      content: JSON.stringify({
        headline: 'Full-Stack Developer',
        subheading: 'Building modern web applications with passion and precision',
        description:
          'I am a full-stack developer with expertise in React, Next.js, and Node.js. I love creating beautiful, performant, and accessible web applications that solve real-world problems.',
        imageUrl: 'https://images.unsplash.com/photo-1544890225-2f3faec4cd60',
      }),
      order: 1,
    },
    {
      type: 'techStack',
      title: 'My Tech Stack',
      content: JSON.stringify({
        description: 'I work with a variety of technologies across the full stack.',
        categories: [
          {
            name: 'Frontend',
            technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
          },
          {
            name: 'Backend',
            technologies: ['Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Redis'],
          },
          {
            name: 'DevOps',
            technologies: ['Docker', 'GitHub Actions', 'Vercel', 'AWS'],
          },
        ],
      }),
      order: 2,
    },
    {
      type: 'workExperience',
      title: 'Work Experience',
      content: JSON.stringify({
        experiences: [
          {
            company: 'Tech Innovations Inc.',
            role: 'Senior Frontend Developer',
            period: '2021 - Present',
            description: 'Leading the frontend development team, implementing new features, and improving performance.',
            technologies: ['React', 'TypeScript', 'Next.js'],
          },
          {
            company: 'Digital Solutions LLC',
            role: 'Full-Stack Developer',
            period: '2018 - 2021',
            description: 'Developed and maintained various web applications for clients across different industries.',
            technologies: ['React', 'Node.js', 'MongoDB'],
          },
          {
            company: 'StartUp Studio',
            role: 'Junior Developer',
            period: '2016 - 2018',
            description: 'Worked on frontend development for early-stage startups.',
            technologies: ['JavaScript', 'HTML', 'CSS'],
          },
        ],
      }),
      order: 3,
    },
    {
      type: 'projects',
      title: 'Projects',
      content: JSON.stringify({
        headline: 'My Recent Work',
        description: "Here are some of the projects I've worked on recently.",
        projects: [],
      }),
      order: 4,
    },
    {
      type: 'contact',
      title: 'Contact Me',
      content: JSON.stringify({
        headline: 'Get In Touch',
        description: 'Feel free to reach out if you have any questions or want to work together.',
        email: 'contact@example.com',
        socialLinks: [
          { platform: 'GitHub', url: 'https://github.com/username' },
          { platform: 'LinkedIn', url: 'https://linkedin.com/in/username' },
          { platform: 'Twitter', url: 'https://twitter.com/username' },
        ],
      }),
      order: 5,
    },
  ]

  for (const section of portfolioSections) {
    const createdSection = await prisma.portfolioSection.create({
      data: section,
    })
    console.log(`📋 Created portfolio section: ${createdSection.title}`)
  }

  // Add some comments to the first post
  const firstPost = await prisma.post.findFirst({
    where: { published: true },
    orderBy: { createdAt: 'asc' },
  })

  if (firstPost) {
    const comments = [
      {
        content: 'Great article! Really helped me understand Next.js better.',
        authorId: regularUser.id,
        postId: firstPost.id,
      },
      {
        content: 'Thanks for sharing this valuable information.',
        authorId: regularUser.id,
        postId: firstPost.id,
      },
      {
        content: 'I have a question about SSR - how does it compare to SSG for large sites?',
        authorId: regularUser.id,
        postId: firstPost.id,
      },
    ]

    for (const comment of comments) {
      await prisma.comment.create({
        data: comment,
      })
    }
    console.log(`💬 Added ${comments.length} comments to post: ${firstPost.title}`)
  }

  console.log(`✅ Database seeding completed!`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
