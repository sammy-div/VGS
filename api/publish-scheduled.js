module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ error: 'Method not allowed' }); }
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.authorization || '';
  if (!secret || auth !== 'Bearer ' + secret) return res.status(401).json({ error: 'Unauthorized scheduler request' });
  const url = process.env.SUPABASE_URL || 'https://drpvjnzuqhtlvgmtrthj.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return res.status(503).json({ error: 'Scheduled publishing is not configured' });
  try {
    const endpoint = new URL(url + '/rest/v1/blog_posts');
    endpoint.searchParams.set('status', 'eq.scheduled');
    endpoint.searchParams.set('scheduled_at', 'lte.' + new Date().toISOString());
    endpoint.searchParams.set('deleted_at', 'is.null');
    endpoint.searchParams.set('archived_at', 'is.null');
    const now = new Date().toISOString();
    const response = await fetch(endpoint, { method: 'PATCH', headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json', Prefer: 'return=representation' }, body: JSON.stringify({ status: 'published', published_at: now, updated_at: now }) });
    if (!response.ok) throw new Error('Scheduled posts could not be published');
    const posts = await response.json();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ published: posts.length });
  } catch (_) {
    return res.status(500).json({ error: 'Scheduled publishing failed' });
  }
};
