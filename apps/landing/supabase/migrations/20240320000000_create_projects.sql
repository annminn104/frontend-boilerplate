create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  image text,
  url text,
  github text,
  tags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.projects enable row level security;

-- Create policies
create policy "Public projects are viewable by everyone"
  on public.projects for select
  using (true);

create policy "Authenticated users can create projects"
  on public.projects for insert
  with check (auth.role() = 'authenticated');

create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

create policy "Users can delete their own projects"
  on public.projects for delete
  using (auth.uid() = created_by);

-- Create indexes
create index projects_title_idx on public.projects using gin (to_tsvector('english', title));
create index projects_description_idx on public.projects using gin (to_tsvector('english', description));
create index projects_tags_idx on public.projects using gin (tags); 