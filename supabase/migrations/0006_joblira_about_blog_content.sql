-- CMS content for Joblira (flagship product + case study) and the About page,
-- plus the WhatsApp chat button label. All nullable so page defaults apply
-- until an admin sets them. Blog content already lives in blog_posts.body.

-- WhatsApp floating button label
alter table public.site_settings add column if not exists whatsapp_text text;

-- Joblira product & case study
alter table public.site_settings add column if not exists joblira_name text;
alter table public.site_settings add column if not exists joblira_tagline text;
alter table public.site_settings add column if not exists joblira_intro text;
alter table public.site_settings add column if not exists joblira_link text;
alter table public.site_settings add column if not exists joblira_image text;
alter table public.site_settings add column if not exists joblira_problem text;
alter table public.site_settings add column if not exists joblira_why text;
alter table public.site_settings add column if not exists joblira_challenge text;
alter table public.site_settings add column if not exists joblira_approach text;
alter table public.site_settings add column if not exists joblira_outcome text;

-- About page
alter table public.site_settings add column if not exists about_intro text;
alter table public.site_settings add column if not exists about_story1 text;
alter table public.site_settings add column if not exists about_story2 text;
alter table public.site_settings add column if not exists about_mission text;
alter table public.site_settings add column if not exists about_vision text;
alter table public.site_settings add column if not exists about_culture text;
alter table public.site_settings add column if not exists about_milestones text;
alter table public.site_settings add column if not exists founder_name text;
alter table public.site_settings add column if not exists founder_role text;
alter table public.site_settings add column if not exists founder_bio text;
alter table public.site_settings add column if not exists founder_quote text;
alter table public.site_settings add column if not exists founder_photo text;
