const SB_URL = 'https://drpvjnzuqhtlvgmtrthj.supabase.co';
const SB_KEY = 'sb_publishable_-mBP1hR2CmFPTBg5KumEKg_AMbyTB9p';
const xml = value => String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');
  try {
    const url = new URL(SB_URL + '/rest/v1/blog_posts');
    url.searchParams.set('select', 'slug,published_at,updated_at');
    url.searchParams.set('status', 'eq.published');
    url.searchParams.set('deleted_at', 'is.null');
    url.searchParams.set('archived_at', 'is.null');
    url.searchParams.set('order', 'published_at.desc');
    url.searchParams.set('limit', '1000');
    const response = await fetch(url, { headers: { apikey: SB_KEY } });
    if (!response.ok) throw new Error('Unable to retrieve published posts');
    const posts = await response.json();
    const entries = posts.map(post => '<url><loc>https://vatous.com.ng/blog/' + encodeURIComponent(post.slug) + '</loc>' +
      (post.updated_at || post.published_at ? '<lastmod>' + xml(new Date(post.updated_at || post.published_at).toISOString()) + '</lastmod>' : '') +
      '</url>').join('');
    res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + entries + '</urlset>');
  } catch (_) {
    res.status(503).send('<?xml version="1.0" encoding="UTF-8"?><error>Blog sitemap temporarily unavailable</error>');
  }
};
