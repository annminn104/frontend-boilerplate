create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  content text not null,
  excerpt text,
  image text,
  tags text[] default '{}',
  published boolean default false,
  author_id uuid not null references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.posts enable row level security;

-- Create policies
create policy "Public posts are viewable by everyone"
  on public.posts for select
  using (published = true);

create policy "Users can create posts"
  on public.posts for insert
  with check (auth.uid() = author_id);

create policy "Users can update their own posts"
  on public.posts for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

create policy "Users can delete their own posts"
  on public.posts for delete
  using (auth.uid() = author_id);

-- Create indexes
create index posts_slug_idx on public.posts (slug);
create index posts_author_id_idx on public.posts (author_id);
create index posts_published_idx on public.posts (published);
create index posts_tags_idx on public.posts using gin (tags);
create index posts_title_trgm_idx on public.posts using gin (title gin_trgm_ops);
create index posts_content_trgm_idx on public.posts using gin (content gin_trgm_ops);
