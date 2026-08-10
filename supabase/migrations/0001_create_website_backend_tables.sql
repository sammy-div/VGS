-- ============================================================
-- Vatous Global Solutions — website backend schema
-- Public forms insert (anon). Only authenticated admins read.
-- Applied to project drpvjnzuqhtlvgmtrthj.
-- ============================================================

-- ---------- Contact submissions ----------
create table if not exists public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 120),
  email       text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  company     text check (char_length(company) <= 160),
  phone       text check (char_length(phone) <= 40),
  topic       text check (char_length(topic) <= 80),
  message     text not null check (char_length(message) between 1 and 5000),
  status      text not null default 'new' check (status in ('new','read','replied','archived'))
);

-- ---------- Career applications ----------
create table if not exists public.career_applications (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 120),
  email       text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  role        text check (char_length(role) <= 120),
  portfolio   text check (char_length(portfolio) <= 300),
  message     text not null check (char_length(message) between 1 and 5000),
  status      text not null default 'new' check (status in ('new','reviewing','interview','rejected','hired'))
);

-- ---------- Newsletter subscribers ----------
create table if not exists public.newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null unique check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  source      text check (char_length(source) <= 80)
);

-- ---------- Resource requests (gated downloads) ----------
create table if not exists public.resource_requests (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  resource    text not null check (char_length(resource) <= 120)
);

-- ---------- Indexes for admin listing ----------
create index if not exists idx_contact_created  on public.contact_submissions (created_at desc);
create index if not exists idx_career_created   on public.career_applications (created_at desc);
create index if not exists idx_news_created     on public.newsletter_subscribers (created_at desc);
create index if not exists idx_resource_created on public.resource_requests (created_at desc);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.contact_submissions   enable row level security;
alter table public.career_applications    enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.resource_requests      enable row level security;

-- Public (anon + authenticated) may INSERT only.
create policy "anon can submit contact"
  on public.contact_submissions for insert to anon, authenticated with check (true);
create policy "anon can submit application"
  on public.career_applications for insert to anon, authenticated with check (true);
create policy "anon can subscribe"
  on public.newsletter_subscribers for insert to anon, authenticated with check (true);
create policy "anon can request resource"
  on public.resource_requests for insert to anon, authenticated with check (true);

-- Authenticated admins may read + manage. (No SELECT policy for anon = no read access.)
create policy "authenticated can read contact"
  on public.contact_submissions for select to authenticated using (true);
create policy "authenticated can update contact"
  on public.contact_submissions for update to authenticated using (true) with check (true);

create policy "authenticated can read applications"
  on public.career_applications for select to authenticated using (true);
create policy "authenticated can update applications"
  on public.career_applications for update to authenticated using (true) with check (true);

create policy "authenticated can read subscribers"
  on public.newsletter_subscribers for select to authenticated using (true);

create policy "authenticated can read resources"
  on public.resource_requests for select to authenticated using (true);
