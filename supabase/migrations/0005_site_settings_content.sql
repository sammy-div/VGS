-- CMS content fields so hero copy, footer description, extra socials,
-- announcement bar, business hours and SEO are all admin-controlled.
-- All nullable so the baked-in page defaults apply until an admin sets them.
alter table public.site_settings add column if not exists brand_description text;
alter table public.site_settings add column if not exists tagline          text;
alter table public.site_settings add column if not exists hero_eyebrow      text;
alter table public.site_settings add column if not exists hero_subheading   text;
alter table public.site_settings add column if not exists hero_cta          text;
alter table public.site_settings add column if not exists hero_cta2         text;
alter table public.site_settings add column if not exists announcement      text;
alter table public.site_settings add column if not exists business_hours    text;
alter table public.site_settings add column if not exists facebook          text;
alter table public.site_settings add column if not exists tiktok            text;
alter table public.site_settings add column if not exists youtube           text;
alter table public.site_settings add column if not exists seo_title         text;
alter table public.site_settings add column if not exists seo_description   text;
alter table public.site_settings add column if not exists og_image          text;
