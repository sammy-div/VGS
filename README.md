# Vatous Global Solutions — Corporate Website

Production-ready static corporate site for **Vatous Global Solutions (VG)**, a premium African
enterprise technology and business consulting company.

## Stack
- **HTML5** (semantic, accessible)
- **Tailwind CSS** via CDN (+ small custom design system in `assets/css/styles.css`)
- **Vanilla JavaScript** — no frameworks, no jQuery, no build step
- **Supabase** — backend for forms, admin dashboard and content (integration-ready)
- Hosted on **Vercel** (static)

## Design system
Brand palette (defined as CSS variables in `assets/css/styles.css`):

| Token | Hex |
| --- | --- |
| Primary dark blue | `#071B78` |
| Secondary blue | `#537AD2` |
| Accent teal | `#14D3C7` |
| Near-black background | `#050816` |

Fonts: **Manrope** (headings) + **Plus Jakarta Sans** (body) via Google Fonts.

## Structure
```
/                     public pages (index, about, services, industries, blog, careers, contact, resources…)
/blog/                long-form articles
/admin/               static admin dashboard (Supabase-ready)
/assets/css/          styles.css — design system
/assets/js/           components.js (shared nav/footer) + main.js (interactions)
```

The shared header and footer are injected by `assets/js/components.js`, so navigation and
branding stay consistent across every page from a single source.

## Local preview
Any static server works, e.g.:
```bash
npx serve .
# or
python3 -m http.server 8000
```

## Deploy (Vercel)
This is a zero-config static deploy. Push to the connected repo or run `vercel`.
`vercel.json` enables clean URLs and long-lived caching for `/assets`.

## Supabase backend

Project `drpvjnzuqhtlvgmtrthj` is wired live. Integration uses the **PostgREST/GoTrue REST
endpoints via plain `fetch`** — no client library, so the "Tailwind-only" constraint holds.
Config lives at the top of `assets/js/main.js` (public forms) and `admin/admin.js` (auth).

### Tables (schema in `supabase/migrations/`)
| Table | Purpose | Public access |
| --- | --- | --- |
| `contact_submissions` | Contact form | INSERT only |
| `career_applications` | Careers form | INSERT only |
| `newsletter_subscribers` | Footer + resources newsletter (unique email) | INSERT only |
| `resource_requests` | Gated resource downloads | INSERT only |

### Security (Row Level Security)
RLS is **enabled on every table**. The public (`anon`) role may only `INSERT`; it has **no
`SELECT` policy**, so submissions can be written but never read from the browser. Only
`authenticated` admins can read and manage rows. `CHECK` constraints validate email format and
cap field lengths server-side. Verified: an emulated `anon` role can insert but reads return 0
rows. `get_advisors(security)` returns no lints.

The **publishable key** (`sb_publishable_…`) is intentionally client-side and safe to commit —
it grants only what RLS allows. The service-role key is never used in the front end.

### Admin authentication
The admin dashboard signs in through **Supabase Auth** (`/auth/v1/token`, password grant). A
seeded admin account exists:

- **Email:** `admin@vatous.com`
- **Password:** `VatousAdmin2026!`  ← change this in the Supabase dashboard before going live.

On success the access token is held in `sessionStorage`; the Submissions page then loads live
`contact_submissions` rows. A "Continue to demo dashboard" link keeps the UI explorable without
signing in.

### Applying the schema elsewhere
The migration is committed under `supabase/migrations/`. With the Supabase CLI:
```bash
supabase link --project-ref drpvjnzuqhtlvgmtrthj
supabase db push
```
