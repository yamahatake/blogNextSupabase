create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  content text not null,
  author_id uuid references auth.users(id) on delete cascade not null,
  author_email text not null,
  published boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  user_email text not null,
  content text not null,
  created_at timestamptz default now() not null
);

alter table posts enable row level security;
alter table comments enable row level security;

-- Anyone can read published posts; authors can read their own unpublished posts
create policy "Posts are viewable by author or if published"
  on posts for select
  using (published = true or auth.uid() = author_id);

create policy "Authenticated users can create posts"
  on posts for insert
  to authenticated
  with check (auth.uid() = author_id);

create policy "Authors can update own posts"
  on posts for update
  to authenticated
  using (auth.uid() = author_id);

create policy "Authors can delete own posts"
  on posts for delete
  to authenticated
  using (auth.uid() = author_id);

create policy "Comments are viewable by everyone"
  on comments for select
  using (true);

create policy "Authenticated users can create comments"
  on comments for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete own comments"
  on comments for delete
  to authenticated
  using (auth.uid() = user_id);

-- Auto-update updated_at on post edits
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
  before update on posts
  for each row execute function handle_updated_at();
