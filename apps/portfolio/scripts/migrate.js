#!/usr/bin/env node

/**
 * This script runs prisma migrations in development or production
 * It handles the different environments and database connection options
 *
 * Usage:
 * - For local development: node scripts/migrate.js
 * - For initial migration creation: node scripts/migrate.js init
 * - For production deployment: node scripts/migrate.js deploy
 */

const { execSync } = require('child_process')

// Get command line arguments
const args = process.argv.slice(2)
const command = args[0] || 'dev'

// Environment variables and connection strings are already configured in schema.prisma

// Set the execution options
const options = {
  stdio: 'inherit',
  env: process.env,
}

console.log(`Running prisma migration ${command}...`)

try {
  switch (command) {
    case 'init':
      // Create the initial migration
      execSync('npx prisma migrate dev --name init', options)
      break

    case 'dev':
      // Development migration (creates and applies migrations)
      execSync('npx prisma migrate dev', options)
      break

    case 'deploy':
      // Production deployment (applies migrations but doesn't create new ones)
      execSync('npx prisma migrate deploy', options)
      break

    case 'reset':
      // Reset the database (drop all tables and recreate)
      execSync('npx prisma migrate reset --force', options)
      break

    default:
      console.error(`Unknown command: ${command}`)
      console.log('Valid commands: init, dev, deploy, reset')
      process.exit(1)
  }

  console.log('Migration completed successfully')
} catch (error) {
  console.error('Migration failed:', error.message)
  process.exit(1)
}
