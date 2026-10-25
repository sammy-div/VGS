module.exports = async function handler(req, res) {
  const origin = 'https://vatous.com.ng';
  const base = process.env.SUPABASE_URL || 'https://drpvjnzuqhtlvgmtrthj.supabase.co';
  const key = process.env.SUPABASE_ANON_KEY || 'sb_publishable_-mBP1hR2CmFPTBg5KumEKg_AMbyTB9p';
  const xmlEscape = value => String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  try {
    const now = new Date().toISOString();
    const url = new URL('/rest/v1/blog_posts', base);
    url.searchParams.set('select', 'slug,published_at,updated_at,canonical_url,noindex,archived_at');
    url.searchParams.set('status', 'eq.published');
    url.searchParams.set('deleted_at', 'is.null');
    url.searchParams.set('archived_at', 'is.null');
    url.searchParams.set('noindex', 'eq.false');
    url.searchParams.set('or', '(scheduled_at.is.null,scheduled_at.lte.' + now + ')');
    url.searchParams.set('order', 'published_at.desc');
    url.searchParams.set('limit', '5000');
    const response = await fetch(url, { headers: { apikey: key, Authorization: 'Bearer ' + key } });
    if (!response.ok) throw new Error('Unable to load published articles');
    const posts = await response.json();
    const fixed = ['/', '/about.html', '/services.html', '/products.html', '/insights.html', '/contact.html'];
    const urls = fixed.map(path => ({ loc: origin + path, lastmod: now.slice(0, 10) }));
    posts.forEach(post => {
      if (!post.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) return;
      const loc = origin + '/blog/' + post.slug;
      // A sitemap should contain the canonical URL only. Articles canonicalized elsewhere are omitted.
      if (post.canonical_url && post.canonical_url.replace(/\/$/, '') !== loc.replace(/\/$/, '')) return;
      urls.push({ loc, lastmod: (post.updated_at || post.published_at || '').slice(0, 10) });
    });
    const body = '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      urls.map(item => '<url><loc>' + xmlEscape(item.loc) + '</loc>' +
        (item.lastmod ? '<lastmod>' + xmlEscape(item.lastmod) + '</lastmod>' : '') +
        '</url>').join('') + '</urlset>';
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    return res.status(200).send(body);
  } catch (_) {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  }
};
