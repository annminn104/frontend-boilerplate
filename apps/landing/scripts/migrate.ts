import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { runMigrations } from '../src/lib/migrations'

// Load environment variables
config({ path: '.env.local' })

async function migrate() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Create migrations table
    const { error: createTableError } = await supabase.from('migrations').select('*').limit(1)

    if (createTableError?.code === 'PGRST204') {
      // Table doesn't exist, create it
      const { error } = await supabase.rpc('create_migrations_table')
      if (error) {
        console.error('Failed to create migrations table:', error)
        process.exit(1)
      }
    }

    // Run migrations
    await runMigrations()
    console.log('Migrations completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrate()
