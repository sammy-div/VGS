-- Admin-controlled typography: 3-font system + global type scale.
-- Columns are nullable so existing markup defaults (Sora/Inter/Manrope) apply
-- until an admin picks otherwise.
alter table public.site_settings add column if not exists font_primary   text;
alter table public.site_settings add column if not exists font_secondary text;
alter table public.site_settings add column if not exists font_tertiary  text;
alter table public.site_settings add column if not exists type_scale     numeric not null default 1;
