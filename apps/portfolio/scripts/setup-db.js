#!/usr/bin/env node

/**
 * This script provides a complete database setup:
 * 1. Reset the database (drop all tables)
 * 2. Apply all migrations
 * 3. Seed the database with initial data
 *
 * Intended for development/testing environments
 * WARNING: This will delete all existing data!
 *
 * Usage: node scripts/setup-db.js
 */

const { execSync } = require('child_process')

// Options for child processes
const options = {
  stdio: 'inherit',
  env: process.env,
}

console.log('🔄 Starting complete database setup...')

try {
  // Step 1: Reset the database
  console.log('\n📝 Resetting database...')
  execSync('npx prisma migrate reset --force', options)

  // Step 2: Generate Prisma client
  console.log('\n📝 Generating Prisma client...')
  execSync('npx prisma generate', options)

  // Step 3: Seed the database
  console.log('\n📝 Seeding database with initial data...')
  execSync('npx prisma db seed', options)

  console.log('\n✅ Database setup completed successfully!')
  console.log('Your database has been reset, migrated, and seeded with initial data.')
} catch (error) {
  console.error('\n❌ Database setup failed:', error.message)
  process.exit(1)
}
