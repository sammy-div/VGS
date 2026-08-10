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

## Supabase
The MCP-connected project (`drpvjnzuqhtlvgmtrthj`) backs future features: contact/careers
form submissions, newsletter, admin authentication and content management. Front-end forms
validate client-side today and are structured for wiring to Supabase tables/RPC.
