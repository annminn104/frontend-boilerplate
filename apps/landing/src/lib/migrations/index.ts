import { createClient } from '@supabase/supabase-js'
import { createContactsTable } from './001_create_contacts'

export async function runMigrations() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase credentials')
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  try {
    // Create migrations table if not exists
    const { error: setupError } = await supabase.rpc('setup_migrations')
    if (setupError) throw setupError

    // Run migrations
    await createContactsTable(supabase)

    console.log('Migrations completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}
