import { SupabaseClient } from '@supabase/supabase-js'

export async function createContactsTable(supabase: SupabaseClient) {
  const { error } = await supabase.rpc('run_migration_contacts', {
    migration_sql: `
      -- Create contacts table if not exists
      create table if not exists public.contacts (
        id uuid default gen_random_uuid() primary key,
        name text not null,
        email text not null,
        message text not null,
        created_at timestamp with time zone default timezone('utc'::text, now()) not null
      );

      -- Enable Row Level Security (RLS)
      alter table public.contacts enable row level security;

      -- Drop existing policies if any
      drop policy if exists "Allow anonymous insert" on public.contacts;
      drop policy if exists "Allow anonymous select" on public.contacts;

      -- Create policies
      create policy "Allow anonymous insert" on public.contacts
        for insert
        to anon
        with check (true);

      create policy "Allow anonymous select" on public.contacts
        for select
        to anon
        using (true);

      -- Grant necessary permissions
      grant usage on schema public to anon;
      grant select, insert on public.contacts to anon;
    `,
  })

  if (error) {
    console.error('Migration error:', error)
    throw error
  }
}
