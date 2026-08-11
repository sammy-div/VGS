/* ============================================================
   Vatous Admin — shared shell (sidebar + topbar) + interactions
   Static, Supabase-integration-ready. Vanilla JS only.
   ============================================================ */
(function () {
  'use strict';

  // Favicon
  if (!document.querySelector('link[rel="icon"]')) {
    const fav = document.createElement('link');
    fav.rel = 'icon'; fav.type = 'image/svg+xml'; fav.href = '/favicon.svg';
    document.head.appendChild(fav);
  }

  const NAV = [
    ['index.html', 'Dashboard', 'M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6V11h-6v9zm0-16v5h6V4h-6z'],
    ['pages.html', 'Pages', 'M6 2h9l5 5v15H6z M15 2v5h5'],
    ['services.html', 'Services', 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z'],
    ['blog.html', 'Blog', 'M4 4h16v16H4z M8 8h8M8 12h8M8 16h5'],
    ['case-studies.html', 'Case Studies', 'M3 3h18v4H3z M3 10h18v11H3z'],
    ['media.html', 'Media', 'M3 5h18v14H3z M8 11l3 3 5-6'],
    ['navigation.html', 'Navigation', 'M4 6h16M4 12h16M4 18h10'],
    ['theme.html', 'Theme', 'M12 2a10 10 0 100 20 3 3 0 010-6h2a4 4 0 004-4A10 10 0 0012 2z'],
    ['contact.html', 'Submissions', 'M4 4h16v12H7l-3 3z'],
    ['settings.html', 'Settings', 'M12 8a4 4 0 100 8 4 4 0 000-8z M2 12h3m14 0h3M12 2v3m0 14v3']
  ];

  const path = location.pathname.split('/').pop() || 'index.html';

  const links = NAV.map(([href, label, d]) =>
    `<a href="${href}" class="admin-sidebar-link ${href === path ? 'active' : ''}">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="${d}"/></svg>
      <span>${label}</span>
    </a>`).join('');

  const logo = `<a href="index.html" class="flex items-center gap-2.5 px-2">
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none"><rect x="1" y="1" width="30" height="30" rx="8" stroke="rgba(255,255,255,.16)"/><path d="M8 9l6 14h1.5L9.8 9z" fill="#14D3C7"/><path d="M22.4 9l-6 14H15L20.6 9z" fill="#537AD2"/></svg>
      <span class="font-head font-extrabold tracking-tight">Vatous<span class="teal">.</span> <span class="text-mute font-medium text-xs">admin</span></span>
    </a>`;

  const sidebar = document.getElementById('admin-sidebar');
  if (sidebar) {
    sidebar.innerHTML = `
      <div class="h-16 flex items-center border-b border-white/8">${logo}</div>
      <nav class="p-3 space-y-1 flex-1 overflow-y-auto" aria-label="Admin">${links}</nav>
      <div class="p-3 border-t border-white/8">
        <a href="../index.html" class="admin-sidebar-link"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M15 18l-6-6 6-6"/></svg><span>View site</span></a>
        <a href="login.html" class="admin-sidebar-link"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M16 17l5-5-5-5M21 12H9M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/></svg><span>Sign out</span></a>
      </div>`;
  }

  const topbar = document.getElementById('admin-topbar');
  if (topbar) {
    const title = topbar.dataset.title || 'Dashboard';
    topbar.innerHTML = `
      <button id="admin-menu" class="lg:hidden p-2 -ml-2 text-white" aria-label="Toggle menu"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
      <h1 class="font-head font-extrabold text-lg">${title}</h1>
      <div class="ml-auto flex items-center gap-3">
        <div class="relative hidden sm:block">
          <input type="search" placeholder="Search…" class="field !py-2 pl-9 w-56" aria-label="Search admin" />
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-mute" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
        </div>
        <button class="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-soft hover:text-white" aria-label="Notifications"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></svg></button>
        <span class="w-9 h-9 rounded-full bg-vgblue/50 flex items-center justify-center font-head font-bold text-sm">SA</span>
      </div>`;
    const menuBtn = document.getElementById('admin-menu');
    menuBtn?.addEventListener('click', () => {
      document.getElementById('admin-sidebar')?.classList.toggle('-translate-x-full');
    });
  }

  // Toast
  if (!document.querySelector('.toast-wrap')) {
    const tw = document.createElement('div'); tw.className = 'toast-wrap'; tw.setAttribute('aria-live', 'polite'); document.body.appendChild(tw);
  }
  window.vgToast = window.vgToast || function (m, type) {
    const wrap = document.querySelector('.toast-wrap'); if (!wrap) return;
    const t = document.createElement('div'); t.className = 'toast'; if (type === 'error') t.style.borderLeftColor = '#f87171';
    t.innerHTML = `<span>${m}</span>`; wrap.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3000);
  };

  // Save / reset buttons
  document.addEventListener('click', (e) => {
    const save = e.target.closest('[data-save]');
    if (save) { e.preventDefault(); window.vgToast(save.dataset.save || 'Changes saved.'); }
    const reset = e.target.closest('[data-reset]');
    if (reset) { e.preventDefault(); window.vgToast('Changes reset.'); }
  });

  // Drag & drop reorder
  document.querySelectorAll('[data-sortable]').forEach(list => {
    let dragged = null;
    list.querySelectorAll('[draggable=true]').forEach(item => {
      item.addEventListener('dragstart', () => { dragged = item; item.style.opacity = '.4'; });
      item.addEventListener('dragend', () => { item.style.opacity = ''; window.vgToast('Order updated.'); });
      item.addEventListener('dragover', e => e.preventDefault());
      item.addEventListener('drop', e => {
        e.preventDefault();
        if (dragged && dragged !== item) {
          const rect = item.getBoundingClientRect();
          const after = e.clientY > rect.top + rect.height / 2;
          list.insertBefore(dragged, after ? item.nextSibling : item);
        }
      });
    });
  });

  // Media upload UI (drag/drop visual)
  document.querySelectorAll('[data-drop]').forEach(zone => {
    ['dragover', 'dragenter'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add('border-vgteal'); }));
    ['dragleave', 'drop'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove('border-vgteal'); }));
    zone.addEventListener('drop', () => window.vgToast('Upload queued (demo).'));
    zone.addEventListener('click', () => window.vgToast('File picker (demo).'));
  });

  /* ============================================================
     Supabase authentication (REST — no client library)
     ============================================================ */
  const VG_SB = {
    url: 'https://drpvjnzuqhtlvgmtrthj.supabase.co',
    key: 'sb_publishable_-mBP1hR2CmFPTBg5KumEKg_AMbyTB9p'
  };
  const TOKEN_KEY = 'vg_admin_token';

  async function vgAuthSignIn(email, password) {
    const res = await fetch(`${VG_SB.url}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { 'apikey': VG_SB.key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error_description || data.msg || data.error || 'Invalid email or password.');
    sessionStorage.setItem(TOKEN_KEY, data.access_token);
    sessionStorage.setItem('vg_admin_email', email);
    return data;
  }
  function vgSignOut() { sessionStorage.removeItem(TOKEN_KEY); sessionStorage.removeItem('vg_admin_email'); }
  const vgToken = () => sessionStorage.getItem(TOKEN_KEY);

  // Login form (admin/login.html)
  const loginForm = document.getElementById('admin-login');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('input[type=email]').value.trim();
      const pw = loginForm.querySelector('input[type=password]').value;
      const err = document.getElementById('login-error');
      const btn = loginForm.querySelector('button[type=submit]');
      if (!email || !pw) { if (err) { err.textContent = 'Enter your email and password.'; err.classList.add('show'); } return; }
      if (err) err.classList.remove('show');
      const label = btn.textContent; btn.disabled = true; btn.textContent = 'Signing in…';
      try {
        await vgAuthSignIn(email, pw);
        window.vgToast('Signed in.');
        setTimeout(() => location.href = 'index.html', 400);
      } catch (ex) {
        if (err) { err.textContent = ex.message; err.classList.add('show'); }
        btn.disabled = false; btn.textContent = label;
      }
    });
  }

  // Sign-out links
  document.querySelectorAll('[data-signout], a[href="login.html"]').forEach(el => {
    if (el.dataset.bound) return; el.dataset.bound = '1';
    el.addEventListener('click', () => vgSignOut());
  });

  // Reflect signed-in email in the top bar avatar tooltip, if present.
  const who = sessionStorage.getItem('vg_admin_email');
  if (who) { const av = document.querySelector('#admin-topbar .rounded-full'); if (av) av.title = who; }

  /* ---------- Live dashboard counts (when signed in) ---------- */
  const countEls = document.querySelectorAll('[data-sb-count]');
  if (countEls.length && vgToken()) {
    countEls.forEach(async (el) => {
      try {
        const res = await fetch(`${VG_SB.url}/rest/v1/${el.dataset.sbCount}?select=id`, {
          method: 'HEAD',
          headers: { 'apikey': VG_SB.key, 'Authorization': `Bearer ${vgToken()}`, 'Prefer': 'count=exact', 'Range-Unit': 'items', 'Range': '0-0' }
        });
        const range = res.headers.get('content-range'); // e.g. "0-0/37"
        if (range && range.includes('/')) {
          const total = range.split('/')[1];
          if (total && total !== '*') el.textContent = Number(total).toLocaleString();
        }
      } catch (_) { /* keep placeholder */ }
    });
  }

  /* ---------- Live "recent submissions" widget (dashboard, when signed in) ---------- */
  const recentEl = document.querySelector('[data-sb-recent]');
  if (recentEl && vgToken()) {
    (async () => {
      try {
        const res = await fetch(`${VG_SB.url}/rest/v1/contact_submissions?select=name,topic,created_at&order=created_at.desc&limit=4`, {
          headers: { 'apikey': VG_SB.key, 'Authorization': `Bearer ${vgToken()}` }
        });
        if (!res.ok) return;
        const rows = await res.json();
        if (!Array.isArray(rows) || rows.length === 0) return;
        const tint = ['bg-vgblue/40', 'bg-vgteal/20', 'bg-indigo-500/25', 'bg-vgblue2/30'];
        recentEl.innerHTML = rows.map((r, i) => {
          const initials = String(r.name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
          return `<li class="flex items-center gap-3"><span class="w-8 h-8 rounded-full ${tint[i % 4]} flex items-center justify-center text-xs font-bold">${esc(initials)}</span><div><p class="text-white">${esc(r.name)}</p><p class="text-mute text-xs">${esc(r.topic || '—')} · ${timeAgo(r.created_at)}</p></div></li>`;
        }).join('');
      } catch (_) { /* keep demo rows */ }
    })();
  }
  function timeAgo(iso) {
    const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    return Math.floor(s / 86400) + 'd ago';
  }

  /* ---------- Live submissions (Submissions page, when signed in) ---------- */
  const subsTable = document.querySelector('[data-sb-submissions] tbody');
  if (subsTable && vgToken()) {
    (async () => {
      try {
        const res = await fetch(`${VG_SB.url}/rest/v1/contact_submissions?select=name,email,topic,created_at&order=created_at.desc&limit=25`, {
          headers: { 'apikey': VG_SB.key, 'Authorization': `Bearer ${vgToken()}` }
        });
        if (!res.ok) return; // keep demo rows on failure
        const rows = await res.json();
        if (!Array.isArray(rows) || rows.length === 0) return;
        subsTable.innerHTML = rows.map(r => {
          const when = new Date(r.created_at).toLocaleString();
          return `<tr class="border-b border-white/8"><td class="py-3 pr-4"><p class="font-semibold text-sm">${esc(r.name)}</p><p class="text-mute text-xs">${esc(r.email)}</p></td><td class="py-3 pr-4"><span class="pill">${esc(r.topic || '—')}</span></td><td class="py-3 pr-4 text-mute text-sm">${esc(when)}</td><td class="py-3 text-right"><button class="btn btn-ghost !py-1.5 !px-3 text-xs" data-save="Opened message.">View</button></td></tr>`;
        }).join('');
      } catch (_) { /* keep demo rows */ }
    })();
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  /* ============================================================
     Blog posts — full CRUD (admin/blog.html), when signed in.
     ============================================================ */
  const blogBody = document.querySelector('[data-sb-blog]');
  if (blogBody) {
    const modal = document.getElementById('blog-modal');
    const statusEl = document.getElementById('blog-status');
    const g = (id) => document.getElementById(id);
    const CATLABEL = { automation: 'Automation', ai: 'AI', strategy: 'Strategy', engineering: 'Engineering' };
    const authHeaders = () => ({ 'apikey': VG_SB.key, 'Authorization': `Bearer ${vgToken()}`, 'Content-Type': 'application/json' });
    const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

    async function loadPosts() {
      if (!vgToken()) {
        statusEl.textContent = 'Sign in to manage posts.';
        blogBody.innerHTML = '<tr><td colspan="5" class="py-8 text-center text-mute">Sign in to load and manage posts.</td></tr>';
        return;
      }
      statusEl.textContent = 'Loading…';
      try {
        const res = await fetch(`${VG_SB.url}/rest/v1/blog_posts?select=id,title,slug,category,author,status,created_at&order=created_at.desc`, { headers: authHeaders() });
        if (!res.ok) throw new Error('load');
        const posts = await res.json();
        statusEl.textContent = `${posts.length} post${posts.length === 1 ? '' : 's'}`;
        if (!posts.length) {
          blogBody.innerHTML = '<tr><td colspan="5" class="py-8 text-center text-mute">No posts yet — create your first article.</td></tr>';
          return;
        }
        blogBody.innerHTML = posts.map(p => {
          const pub = p.status === 'published';
          return `<tr class="border-b border-white/8">
            <td class="py-3 pr-4"><p class="font-semibold text-sm">${esc(p.title)}</p><p class="text-mute text-xs">/${esc(p.slug)}</p></td>
            <td class="py-3 pr-4"><span class="pill">${esc(CATLABEL[p.category] || p.category)}</span></td>
            <td class="py-3 pr-4 text-mute text-sm">${esc(p.author)}</td>
            <td class="py-3 pr-4"><span class="pill ${pub ? 'pill-live' : ''}">${pub ? 'Published' : 'Draft'}</span></td>
            <td class="py-3 text-right whitespace-nowrap">
              <button class="btn btn-ghost !py-1.5 !px-2.5 text-xs" data-edit="${p.id}">Edit</button>
              <button class="btn btn-ghost !py-1.5 !px-2.5 text-xs" data-toggle="${p.id}" data-status="${p.status}">${pub ? 'Unpublish' : 'Publish'}</button>
              <button class="btn btn-ghost !py-1.5 !px-2.5 text-xs" data-del="${p.id}" data-title="${esc(p.title)}">Delete</button>
            </td></tr>`;
        }).join('');
      } catch (_) {
        statusEl.textContent = 'Could not load posts.';
        window.vgToast('Could not load posts. Check your session.', 'error');
      }
    }

    function openModal(post) {
      g('blog-form-error').classList.remove('show');
      g('f-id').value = post ? post.id : '';
      g('f-title').value = post ? post.title : '';
      g('f-slug').value = post ? post.slug : '';
      g('f-slug').dataset.touched = post ? '1' : '';
      g('f-category').value = post ? post.category : 'automation';
      g('f-author').value = post ? post.author : 'Vatous Team';
      g('f-read').value = post ? post.read_minutes : 5;
      g('f-excerpt').value = post ? (post.excerpt || '') : '';
      g('f-body').value = post ? (post.body || '') : '';
      g('f-status').value = post ? post.status : 'published';
      g('blog-modal-title').textContent = post ? 'Edit article' : 'New article';
      if (modal.showModal) modal.showModal();
      g('f-title').focus();
    }

    g('f-title').addEventListener('input', () => {
      if (!g('f-id').value && !g('f-slug').dataset.touched) g('f-slug').value = slugify(g('f-title').value);
    });
    g('f-slug').addEventListener('input', () => { g('f-slug').dataset.touched = '1'; });

    async function savePost() {
      const err = g('blog-form-error');
      const payload = {
        title: g('f-title').value.trim(),
        slug: slugify(g('f-slug').value || g('f-title').value),
        category: g('f-category').value,
        author: g('f-author').value.trim() || 'Vatous Team',
        read_minutes: Math.min(60, Math.max(1, parseInt(g('f-read').value, 10) || 5)),
        excerpt: g('f-excerpt').value.trim(),
        body: g('f-body').value.trim() || null,
        status: g('f-status').value
      };
      if (!payload.title || !payload.slug || !payload.excerpt) {
        err.textContent = 'Title, slug and excerpt are required.'; err.classList.add('show'); return;
      }
      const id = g('f-id').value;
      const btn = g('blog-save'); const label = btn.textContent; btn.disabled = true; btn.textContent = 'Saving…';
      try {
        const url = id ? `${VG_SB.url}/rest/v1/blog_posts?id=eq.${id}` : `${VG_SB.url}/rest/v1/blog_posts`;
        const res = await fetch(url, { method: id ? 'PATCH' : 'POST', headers: { ...authHeaders(), 'Prefer': 'return=minimal' }, body: JSON.stringify(payload) });
        if (res.status === 409) { err.textContent = 'That slug is already in use — choose another.'; err.classList.add('show'); return; }
        if (!res.ok) { const j = await res.json().catch(() => ({})); err.textContent = j.message || 'Save failed.'; err.classList.add('show'); return; }
        modal.close(); window.vgToast(id ? 'Post updated.' : 'Post created.'); loadPosts();
      } catch (_) { err.textContent = 'Network error. Please try again.'; err.classList.add('show'); }
      finally { btn.disabled = false; btn.textContent = label; }
    }

    async function toggleStatus(id, current) {
      const next = current === 'published' ? 'draft' : 'published';
      try {
        const res = await fetch(`${VG_SB.url}/rest/v1/blog_posts?id=eq.${id}`, { method: 'PATCH', headers: { ...authHeaders(), 'Prefer': 'return=minimal' }, body: JSON.stringify({ status: next }) });
        if (!res.ok) throw new Error();
        window.vgToast(next === 'published' ? 'Published.' : 'Moved to draft.'); loadPosts();
      } catch (_) { window.vgToast('Update failed.', 'error'); }
    }

    async function deletePost(id, title) {
      if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;
      try {
        const res = await fetch(`${VG_SB.url}/rest/v1/blog_posts?id=eq.${id}`, { method: 'DELETE', headers: authHeaders() });
        if (!res.ok) throw new Error();
        window.vgToast('Post deleted.'); loadPosts();
      } catch (_) { window.vgToast('Delete failed.', 'error'); }
    }

    g('blog-new').addEventListener('click', () => {
      if (!vgToken()) { window.vgToast('Sign in first.', 'error'); return; }
      openModal(null);
    });
    g('blog-cancel').addEventListener('click', () => modal.close());
    g('blog-cancel2').addEventListener('click', () => modal.close());
    g('blog-save').addEventListener('click', savePost);

    blogBody.addEventListener('click', async (e) => {
      const edit = e.target.closest('[data-edit]');
      const tog = e.target.closest('[data-toggle]');
      const del = e.target.closest('[data-del]');
      if (edit) {
        try {
          const res = await fetch(`${VG_SB.url}/rest/v1/blog_posts?id=eq.${edit.dataset.edit}&limit=1`, { headers: authHeaders() });
          const rows = await res.json();
          if (rows && rows[0]) openModal(rows[0]);
        } catch (_) { window.vgToast('Could not open post.', 'error'); }
      } else if (tog) {
        toggleStatus(tog.dataset.toggle, tog.dataset.status);
      } else if (del) {
        deletePost(del.dataset.del, del.dataset.title);
      }
    });

    loadPosts();
  }

  /* ============================================================
     Site settings — branding (logo/favicon uploads), contact,
     socials & WhatsApp. Persists to Supabase; renders site-wide.
     ============================================================ */
  const settingsRoot = document.querySelector('[data-settings-root]');
  if (settingsRoot) {
    const g = (id) => document.getElementById(id);
    const authH = () => ({ 'apikey': VG_SB.key, 'Authorization': `Bearer ${vgToken()}`, 'Content-Type': 'application/json' });
    const FIELDS = { brand: 'brand_name', email: 'email', phone: 'phone', address: 'address', whatsapp: 'whatsapp', linkedin: 'linkedin', x: 'x_url', instagram: 'instagram' };
    let current = {};

    function fillPreview(kind, url) {
      const img = g(kind + '-preview'), empty = g(kind + '-empty');
      if (url) { img.src = url; img.classList.remove('hidden'); empty.classList.add('hidden'); }
      else { img.removeAttribute('src'); img.classList.add('hidden'); empty.classList.remove('hidden'); }
    }

    async function loadSettings() {
      if (!vgToken()) { g('settings-status').textContent = 'Sign in to load and edit live site settings.'; return; }
      g('settings-status').textContent = 'Loading…';
      try {
        const res = await fetch(`${VG_SB.url}/rest/v1/site_settings?select=*&id=eq.1&limit=1`, { headers: authH() });
        const rows = await res.json(); current = (rows && rows[0]) || {};
        Object.keys(FIELDS).forEach(k => { const el = g('set-' + k); if (el) el.value = current[FIELDS[k]] || ''; });
        fillPreview('logo', current.logo_url); fillPreview('favicon', current.favicon_url);
        g('settings-status').textContent = 'Live settings loaded.';
      } catch (_) { g('settings-status').textContent = 'Could not load settings.'; }
    }

    async function patch(payload) {
      const res = await fetch(`${VG_SB.url}/rest/v1/site_settings?id=eq.1`, { method: 'PATCH', headers: { ...authH(), 'Prefer': 'return=minimal' }, body: JSON.stringify(payload) });
      if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.message || 'Save failed'); }
    }

    async function saveSettings() {
      if (!vgToken()) { window.vgToast('Sign in first.', 'error'); return; }
      const btn = g('settings-save'); const label = btn.textContent; btn.disabled = true; btn.textContent = 'Saving…';
      const payload = {};
      Object.keys(FIELDS).forEach(k => { const el = g('set-' + k); if (el) payload[FIELDS[k]] = el.value.trim() || null; });
      try { await patch(payload); window.vgToast('Settings saved — live on the site.'); }
      catch (e) { window.vgToast(e.message || 'Save failed.', 'error'); }
      finally { btn.disabled = false; btn.textContent = label; }
    }

    async function uploadBranding(kind, file) {
      if (!vgToken()) { window.vgToast('Sign in first.', 'error'); return; }
      if (!file) return;
      if (file.size > 3 * 1024 * 1024) { window.vgToast('File too large (max 3MB).', 'error'); return; }
      const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
      const path = `${kind}-${Date.now()}.${ext}`;
      window.vgToast('Uploading…');
      try {
        const up = await fetch(`${VG_SB.url}/storage/v1/object/branding/${path}`, {
          method: 'POST',
          headers: { 'apikey': VG_SB.key, 'Authorization': `Bearer ${vgToken()}`, 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': 'true' },
          body: file
        });
        if (!up.ok) { const j = await up.json().catch(() => ({})); throw new Error(j.message || j.error || 'Upload failed'); }
        const publicUrl = `${VG_SB.url}/storage/v1/object/public/branding/${path}`;
        const col = kind === 'logo' ? 'logo_url' : 'favicon_url';
        await patch({ [col]: publicUrl });
        current[col] = publicUrl; fillPreview(kind, publicUrl);
        window.vgToast(kind === 'logo' ? 'Logo updated — live across the site.' : 'Favicon updated — live across the site.');
      } catch (e) { window.vgToast(e.message || 'Upload failed.', 'error'); }
    }

    async function clearBranding(kind) {
      if (!vgToken()) { window.vgToast('Sign in first.', 'error'); return; }
      const col = kind === 'logo' ? 'logo_url' : 'favicon_url';
      try { await patch({ [col]: null }); current[col] = null; fillPreview(kind, null); window.vgToast(kind === 'logo' ? 'Logo removed — default restored.' : 'Favicon reset to default.'); }
      catch (e) { window.vgToast(e.message || 'Failed.', 'error'); }
    }

    g('logo-btn').addEventListener('click', () => g('logo-file').click());
    g('favicon-btn').addEventListener('click', () => g('favicon-file').click());
    g('logo-file').addEventListener('change', (e) => uploadBranding('logo', e.target.files[0]));
    g('favicon-file').addEventListener('change', (e) => uploadBranding('favicon', e.target.files[0]));
    g('logo-clear').addEventListener('click', () => clearBranding('logo'));
    g('favicon-clear').addEventListener('click', () => clearBranding('favicon'));
    g('settings-save').addEventListener('click', saveSettings);
    g('settings-reload').addEventListener('click', loadSettings);
    loadSettings();
  }
})();
