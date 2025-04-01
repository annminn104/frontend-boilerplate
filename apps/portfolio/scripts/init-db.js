#!/usr/bin/env node

/**
 * This script initializes the database by:
 * 1. Creating the database if it doesn't exist
 * 2. Setting up the schema
 * 3. Running initial migrations
 *
 * It's designed to be run once when setting up a new development environment
 * or when deploying to a new environment.
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Options for child processes
const options = {
  stdio: 'inherit',
  env: process.env,
}

console.log('🚀 Initializing database...')

try {
  // Step 1: Verify environment variables
  console.log('\n📋 Checking environment variables...')

  // Read .env file to see if DATABASE_URL is set
  let envContent = ''
  try {
    envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8')
  } catch (err) {
    console.log('No .env file found, checking for DATABASE_URL in environment')
  }

  // Check if DATABASE_URL is set either in .env or environment
  const hasDbUrl = envContent.includes('DATABASE_URL=') || process.env.DATABASE_URL

  if (!hasDbUrl) {
    console.error('❌ DATABASE_URL environment variable is not set.')
    console.log('Please set DATABASE_URL in your .env file or environment variables.')
    console.log('Example: DATABASE_URL="postgresql://username:password@localhost:5432/mydatabase"')
    process.exit(1)
  }

  console.log('✅ DATABASE_URL is set')

  // Step 2: Generate Prisma client
  console.log('\n📦 Generating Prisma client...')
  execSync('npx prisma generate', options)

  // Step 3: Push schema to database (for development, safer than migrate)
  console.log('\n🔄 Pushing schema to database...')
  execSync('npx prisma db push --accept-data-loss', options)

  // Step 4: Seed the database with initial data
  console.log('\n🌱 Seeding database with initial data...')
  execSync('npx prisma db seed', options)

  console.log('\n✅ Database initialization completed successfully!')
  console.log('Your database has been set up with the required schema and initial data.')
} catch (error) {
  console.error('\n❌ Database initialization failed:')
  console.error(error.message)

  // Provide more helpful error messages based on common issues
  if (error.message.includes('ECONNREFUSED')) {
    console.log('\n🔍 Troubleshooting connection issues:')
    console.log('1. Ensure your database server is running')
    console.log('2. Verify the hostname, port, username, and password in DATABASE_URL')
    console.log('3. Check if database server allows connections from your IP address')
  } else if (error.message.includes('permission denied')) {
    console.log('\n🔍 Troubleshooting permission issues:')
    console.log('1. Verify your database username and password')
    console.log('2. Ensure the user has permission to create databases/tables')
  }

  process.exit(1)
}
