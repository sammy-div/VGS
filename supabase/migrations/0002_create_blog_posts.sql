-- ============================================================
-- Blog posts — public reads published rows; admins manage all.
-- ============================================================
create table if not exists public.blog_posts (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  slug          text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title         text not null check (char_length(title) between 1 and 160),
  category      text not null check (category in ('automation','ai','strategy','engineering')),
  excerpt       text not null check (char_length(excerpt) <= 400),
  body          text,
  author        text not null default 'Vatous Team' check (char_length(author) <= 80),
  read_minutes  int not null default 5 check (read_minutes between 1 and 60),
  path          text check (char_length(path) <= 120),   -- static article file, if any
  status        text not null default 'published' check (status in ('draft','published')),
  featured      boolean not null default false
);

create index if not exists idx_blog_status_created
  on public.blog_posts (status, created_at desc);

-- keep updated_at fresh (search_path pinned for safety)
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_blog_updated on public.blog_posts;
create trigger trg_blog_updated before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.blog_posts enable row level security;

create policy "public reads published posts"
  on public.blog_posts for select to anon using (status = 'published');
create policy "authenticated reads all posts"
  on public.blog_posts for select to authenticated using (true);
create policy "authenticated inserts posts"
  on public.blog_posts for insert to authenticated with check (true);
create policy "authenticated updates posts"
  on public.blog_posts for update to authenticated using (true) with check (true);
create policy "authenticated deletes posts"
  on public.blog_posts for delete to authenticated using (true);
