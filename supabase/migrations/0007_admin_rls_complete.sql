-- ============================================================
-- 0007 — Complete admin write access (RLS gaps fix)
-- Idempotent. Safe to re-run.
-- Guarantees: signed-in admins can create/update/delete every
-- CMS table; the public site can read what it needs; branding
-- image uploads work through the `branding` storage bucket.
-- ============================================================

-- ---------- site_settings (table may predate committed migrations) ----------
create table if not exists public.site_settings (
  id bigint primary key default 1,
  brand_name text,
  email text,
  phone text,
  address text,
  whatsapp text,
  logo_url text,
  favicon_url text,
  linkedin text,
  x_url text,
  instagram text
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

alter table public.site_settings enable row level security;

do $$
begin
  -- Public site reads settings with the publishable key
  if not exists (select 1 from pg_policies where tablename='site_settings' and policyname='public reads site settings') then
    create policy "public reads site settings" on public.site_settings for select to anon, authenticated using (true);
  end if;
  -- Admins manage settings
  if not exists (select 1 from pg_policies where tablename='site_settings' and policyname='authenticated updates settings') then
    create policy "authenticated updates settings" on public.site_settings for update to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='site_settings' and policyname='authenticated inserts settings') then
    create policy "authenticated inserts settings" on public.site_settings for insert to authenticated with check (true);
  end if;
end $$;

-- ---------- Delete policies missing from 0001 (submissions management) ----------
do $$
begin
  if not exists (select 1 from pg_policies where tablename='contact_submissions' and policyname='authenticated deletes contact') then
    create policy "authenticated deletes contact" on public.contact_submissions for delete to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='career_applications' and policyname='authenticated deletes applications') then
    create policy "authenticated deletes applications" on public.career_applications for delete to authenticated using (true);
  end if;
  -- Subscribers & resources: full management (select existed; add update/delete)
  if not exists (select 1 from pg_policies where tablename='newsletter_subscribers' and policyname='authenticated updates subscribers') then
    create policy "authenticated updates subscribers" on public.newsletter_subscribers for update to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='newsletter_subscribers' and policyname='authenticated deletes subscribers') then
    create policy "authenticated deletes subscribers" on public.newsletter_subscribers for delete to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='resource_requests' and policyname='authenticated updates resources') then
    create policy "authenticated updates resources" on public.resource_requests for update to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='resource_requests' and policyname='authenticated deletes resources') then
    create policy "authenticated deletes resources" on public.resource_requests for delete to authenticated using (true);
  end if;
end $$;

-- ---------- Storage: branding bucket (logo / favicon / photos) ----------
-- Bucket must exist and be publicly readable (the site displays the images).
insert into storage.buckets (id, name, public)
values ('branding','branding',true)
on conflict (id) do update set public = true;

do $$
begin
  if not exists (select 1 from storage.policies where name='branding public read') then
    create policy "branding public read" on storage.objects for select to anon, authenticated using (bucket_id = 'branding');
  end if;
  if not exists (select 1 from storage.policies where name='branding admin upload') then
    create policy "branding admin upload" on storage.objects for insert to authenticated with check (bucket_id = 'branding');
  end if;
  if not exists (select 1 from storage.policies where name='branding admin update') then
    create policy "branding admin update" on storage.objects for update to authenticated using (bucket_id = 'branding') with check (bucket_id = 'branding');
  end if;
  if not exists (select 1 from storage.policies where name='branding admin delete') then
    create policy "branding admin delete" on storage.objects for delete to authenticated using (bucket_id = 'branding');
  end if;
end $$;