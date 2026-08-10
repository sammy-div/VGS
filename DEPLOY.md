# Deploying to Vercel

This is a **static site** (HTML + Tailwind CDN + vanilla JS) with **no build step**.
Supabase is reached directly from the browser via its REST/Auth endpoints.

## 1. Deploy (Vercel dashboard)

1. **vercel.com → Add New → Project**.
2. **Import** `sammy-div/VGS` (authorize the GitHub app if prompted).
3. Configure:
   - **Framework Preset:** `Other`
   - **Build Command:** *(leave empty)*
   - **Output Directory:** *(leave empty — serves the repo root)*
   - **Install Command:** *(leave empty)*
   - **Root Directory:** `./`
4. **Deploy.** `vercel.json` handles clean URLs, asset caching and security headers.

### CLI alternative
```bash
npm i -g vercel
vercel          # preview deploy
vercel --prod   # production deploy
```
Run from the repo root.

## 2. Site & admin (one project)

You do **not** need a second Vercel project. The admin lives in the same repo:

- Public site → `https://<your-domain>/`
- Admin login → `https://<your-domain>/admin/login`

## 3. Admin credentials

| | |
| --- | --- |
| Email | `admin@vatous.com` |
| Password | `VatousAdmin2026!` |

**Change this before real use:** Supabase Dashboard → **Authentication → Users** →
reset the password (or delete this user and invite your own).

## 4. Environment variables

None are required. The site is static, so Vercel env vars are not injected into the
files. The Supabase URL and **publishable** key are already in the code
(`assets/js/main.js`, `admin/admin.js`, and the two blog scripts). The publishable key
is meant to be public — Row Level Security protects the data — so committing it is safe.

If you want them recorded in Vercel for reference:

| Name | Value |
| --- | --- |
| `SUPABASE_URL` | `https://drpvjnzuqhtlvgmtrthj.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_-mBP1hR2CmFPTBg5KumEKg_AMbyTB9p` |

> **Never** add the Supabase **service_role** key to Vercel or any client-side code —
> it bypasses RLS. The site never uses it.

## 5. Post-deploy checks

1. Submit the **Contact** form → confirm a row lands in Supabase → Table Editor →
   `contact_submissions` (or in the admin **Submissions** page after signing in).
2. Sign into `/admin/login` → **Blog** → create/edit a post → confirm it appears on the
   public `/blog` page and its reader (`/blog/post.html?slug=…`).

No extra Supabase config (CORS, redirect URLs) is needed — the data API and password
login work cross-origin from your Vercel domain by default.

## 6. Custom domain (optional)

Vercel → Project → **Settings → Domains** → add your domain and follow the DNS steps.
After adding it, update the absolute URLs (`https://vatous.com/…`) in the page
`<link rel="canonical">`/Open Graph tags, `sitemap.xml`, `robots.txt` and
`.well-known/security.txt` to your real domain.
