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
| Email | `admin@vatous.ng` |
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

## 6. Custom domains

**Primary (canonical): `vatous.ng`.** All absolute URLs (canonical / Open Graph tags,
`sitemap.xml`, `robots.txt`, `.well-known/security.txt`) point here, so search engines
index one domain and ranking never gets split.

**Secondary (alias): `vgs.ng`.** It 301-redirects to `vatous.ng`, so anyone who types it
lands on the site with no SEO penalty. The redirect is defined in `vercel.json` and is
**host-scoped** — it fires only for `vgs.ng` / `www.vgs.ng` (and `www.vatous.ng`), never
for the `*.vercel.app` preview URL or the bare `vatous.ng`.

### Connect them in Vercel
Project → **Settings → Domains**, then add all of:

- `vatous.ng`  ← set as the **Production / primary** domain
- `www.vatous.ng`
- `vgs.ng`
- `www.vgs.ng`

Point each at your registrar's DNS as Vercel instructs (A record `76.76.21.21` for apex,
or the `cname.vercel-dns.com` CNAME for `www`). Once DNS resolves, `vercel.json` handles the
redirects automatically — you don't need to configure per-domain redirects in the dashboard.

### Switching primary later
If you ever want `vgs.ng` to become the canonical domain (e.g. `vatous.ng` lapses),
search-and-replace `vatous.ng` → `vgs.ng` across the repo and flip the redirect rules in
`vercel.json`. Ask and I'll do it in one pass.
