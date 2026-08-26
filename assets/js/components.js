/* ============================================================
   Vatous Global Solutions — Shared UI components
   Injects the site header (nav) and footer into every page.
   Usage: place <div id="site-header"></div> and
          <div id="site-footer"></div> in the page, then load
          this file before main.js.
   ============================================================ */

(function () {
  'use strict';

  // Head links (root-absolute so they resolve from /blog/ too).
  const addLink = (rel, href, attrs) => {
    if (document.querySelector(`link[rel="${rel}"]`)) return;
    const l = document.createElement('link');
    l.rel = rel; l.href = href;
    if (attrs) Object.assign(l, attrs);
    document.head.appendChild(l);
  };
  addLink('icon', '/favicon.svg', { type: 'image/svg+xml' });
  addLink('apple-touch-icon', '/apple-touch-icon.png');
  addLink('manifest', '/manifest.webmanifest');

  // Logo mark (SVG) — abstract "V" built from geometric planes.
  const LOGO = `
    <a href="index.html" class="js-logo flex items-center gap-2.5" aria-label="Vatous Global Solutions home">
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="30" height="30" rx="8" stroke="rgba(15,23,42,.16)"/>
        <path d="M8 9l6 14h1.5L9.8 9z" fill="#14D3C7"/>
        <path d="M22.4 9l-6 14H15L20.6 9z" fill="#537AD2"/>
      </svg>
      <span class="font-head font-extrabold tracking-tight text-[1.05rem]">Vatous<span class="teal">.</span></span>
    </a>`;

  // Primary navigation (label, href).
  const NAV = [
    ['About', 'about.html'],
    ['Services', 'services.html'],
    ['Industries', 'industries.html'],
    ['Case Studies', 'case-studies.html'],
    ['Insights', 'blog.html'],
    ['Careers', 'careers.html']
  ];

  const path = location.pathname.split('/').pop() || 'index.html';

  const navLinks = NAV.map(([label, href]) => {
    const current = href === path ? ' aria-current="page"' : '';
    return `<a href="${href}" class="nav-link"${current}>${label}</a>`;
  }).join('');

  const MOBILE_DOTS = ['#537AD2', '#14D3C7', '#8b5cf6', '#10B981', '#F59E0B', '#F43F5E', '#0EA5E9', '#6366F1'];
  const mobileLinks = [['Home', 'index.html'], ...NAV, ['Resources', 'resources.html'], ['Contact', 'contact.html']]
    .map(([label, href], i) => {
      const current = href === path ? ' aria-current="page"' : '';
      return `<a href="${href}"${current} class="flex items-center gap-3 py-2.5 text-lg font-head font-semibold text-soft hover:text-[#0F172A] transition-colors border-b border-[#0F172A]/6"><span class="w-2.5 h-2.5 rounded-full shrink-0" style="background:${MOBILE_DOTS[i % MOBILE_DOTS.length]}"></span>${label}</a>`;
    })
    .join('');

  const header = `
  <header id="nav" class="nav">
    <div class="shell flex items-center justify-between h-[72px]">
      ${LOGO}
      <nav class="hidden lg:flex items-center gap-8" aria-label="Primary">
        ${navLinks}
      </nav>
      <div class="hidden lg:flex items-center gap-3">
        <a href="contact.html" class="btn btn-primary">Book Consultation</a>
      </div>
      <button id="menu-open" class="lg:hidden text-[#0F172A] p-2 -mr-2" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
    </div>
  </header>

  <div id="mobile-menu" class="mobile-menu lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="shell pt-6 flex flex-col h-full">
      <div class="flex items-center justify-between h-[60px]">
        ${LOGO}
        <button id="menu-close" class="text-[#0F172A] p-2 -mr-2" aria-label="Close menu">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
      <nav class="mt-8 flex-1" aria-label="Mobile">${mobileLinks}</nav>
      <a href="contact.html" class="btn btn-primary w-full justify-center mb-10">Book Consultation</a>
    </div>
  </div>`;

  const year = new Date().getFullYear();
  const footer = `
  <footer class="site-footer relative pt-16 pb-8 mt-8">
    <div class="shell">
      <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
        <div class="lg:col-span-2">
          ${LOGO}
          <p class="foot-desc mt-4 max-w-xs text-sm leading-relaxed" data-setting="brand_description">Enterprise technology, AI systems and business consulting helping African organizations build dependable systems and grow with clarity.</p>
          <div class="flex items-center gap-3 mt-5">
            ${social('linkedin', 'https://www.linkedin.com/company/vatous', 'LinkedIn', 'M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM0 8h5v16H0zM8 8h4.8v2.2h.07c.67-1.2 2.3-2.5 4.73-2.5C22.4 7.7 24 10 24 14.1V24h-5v-8.8c0-2.1-.04-4.8-2.9-4.8-2.9 0-3.35 2.27-3.35 4.6V24H8z')}
            ${social('x', 'https://x.com/vatous', 'X', 'M18.9 2H22l-7.5 8.6L23 22h-6.8l-5-6.6L5.3 22H2l8-9.2L1 2h7l4.6 6zM16.8 20h1.9L7.3 4H5.3z')}
            ${social('instagram', 'https://instagram.com/vatous', 'Instagram', 'M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.4.37 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.05 1.2-.25 1.8-.42 2.2-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.4.17-1 .37-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.05-1.8-.25-2.2-.42a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.17-.4-.37-1-.42-2.2C2.21 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.2.25-1.8.42-2.2.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.4-.17 1-.37 2.2-.42C8.4 2.21 8.8 2.2 12 2.2zm0 3.5A6.3 6.3 0 1 0 18.3 12 6.3 6.3 0 0 0 12 5.7zm0 10.4A4.1 4.1 0 1 1 16.1 12 4.1 4.1 0 0 1 12 16.1zm6.5-10.9a1.47 1.47 0 1 0 1.47 1.47 1.47 1.47 0 0 0-1.47-1.47z')}
            ${social('whatsapp', 'https://wa.me/2348000000000', 'WhatsApp', 'M12.04 2C6.58 2 2.13 6.45 2.13 11.9c0 2.1.55 4.06 1.6 5.82L2 22l4.4-1.15a9.9 9.9 0 0 0 5.64 1.72c5.46 0 9.9-4.45 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.02c-.24.68-1.4 1.3-1.94 1.35-.5.05-1.13.07-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.8-4.17-4.95-4.36-.14-.19-1.18-1.57-1.18-3s.75-2.13 1.02-2.42c.27-.29.58-.36.78-.36l.56.01c.18.01.42-.07.66.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.09.19-.14.31-.28.48l-.42.49c-.14.14-.28.29-.12.57.16.28.72 1.18 1.54 1.91 1.06.95 1.95 1.24 2.23 1.38.28.14.44.12.6-.07.16-.19.69-.8.87-1.08.18-.28.36-.23.6-.14.24.09 1.55.73 1.82.86.27.14.45.21.51.32.07.11.07.64-.17 1.32z')}
            ${social('facebook', '#', 'Facebook', 'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z', true)}
            ${social('tiktok', '#', 'TikTok', 'M16 3c.3 2.1 1.5 3.6 3.6 3.8v2.5c-1.3.1-2.5-.3-3.6-1v5.9c0 3.3-2.6 5.8-5.8 5.8S4.4 17.5 4.4 14.3c0-3 2.3-5.5 5.3-5.7v2.6c-1.5.2-2.7 1.5-2.7 3.1 0 1.7 1.4 3.1 3.1 3.1s3.1-1.4 3.1-3.1V3z', true)}
            ${social('youtube', '#', 'YouTube', 'M23 12s0-3.2-.4-4.7c-.2-.9-.9-1.5-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.5c-.9.3-1.6.9-1.8 1.8C1 8.8 1 12 1 12s0 3.2.4 4.7c.2.9.9 1.5 1.8 1.8C4.7 19 12 19 12 19s7.3 0 8.8-.5c.9-.3 1.6-.9 1.8-1.8.4-1.5.4-4.7.4-4.7zM9.8 15V9l5.2 3-5.2 3z', true)}
          </div>
        </div>
        ${footerCol('Company', [['About', 'about.html'], ['Careers', 'careers.html'], ['Case Studies', 'case-studies.html'], ['Insights', 'blog.html'], ['Contact', 'contact.html']])}
        ${footerCol('Services', [['Enterprise Technology', 'enterprise-technology.html'], ['AI Solutions', 'ai-solutions.html'], ['Automation', 'automation-integrations.html'], ['Business Advisory', 'business-advisory.html'], ['Branding & Creative', 'branding-creative.html'], ['Training Academy', 'training-academy.html']])}
        ${footerCol('Explore', [['Industries', 'industries.html'], ['Resources', 'resources.html'], ['Services', 'services.html']])}
        <div>
          <h4 class="foot-head font-head font-bold text-sm mb-4">Newsletter</h4>
          <p class="foot-desc text-sm mb-3">Practical insights on systems and automation. Monthly.</p>
          <form class="js-newsletter flex flex-col gap-2" novalidate>
            <input type="email" required placeholder="Work email" class="field text-sm" aria-label="Email address" />
            <button class="btn btn-ghost justify-center text-sm">Subscribe</button>
          </form>
        </div>
      </div>
      <hr class="hairline my-8" />
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 text-sm foot-desc">
        <p>© ${year} <span data-setting="brand_name">Vatous Global Solutions</span>. All rights reserved.</p>
        <div class="flex items-center gap-5">
          <a href="privacy.html" class="foot-link transition-colors">Privacy</a>
          <a href="terms.html" class="foot-link transition-colors">Terms</a>
          <a href="contact.html" class="foot-link transition-colors">Lagos · Remote across Africa</a>
        </div>
      </div>
    </div>
  </footer>`;

  function social(key, href, label, d, hidden) {
    return `<a href="${href}" data-social="${key}"${hidden ? ' hidden' : ''} target="_blank" rel="noopener" aria-label="${label}" class="foot-social w-9 h-9 rounded-lg flex items-center justify-center transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${d}"/></svg></a>`;
  }
  function footerCol(title, items) {
    return `<div><h4 class="foot-head font-head font-bold text-sm mb-4">${title}</h4><ul class="space-y-2.5">${items.map(([l, h]) => `<li><a href="${h}" class="foot-link text-sm transition-colors">${l}</a></li>`).join('')}</ul></div>`;
  }

  // Skip-to-content link (a11y) — first focusable element on the page.
  if (!document.querySelector('.skip-link') && document.getElementById('main')) {
    const skip = document.createElement('a');
    skip.href = '#main'; skip.className = 'skip-link'; skip.textContent = 'Skip to content';
    document.body.insertBefore(skip, document.body.firstChild);
  }

  const h = document.getElementById('site-header');
  const f = document.getElementById('site-footer');
  if (h) h.innerHTML = header;
  if (f) f.innerHTML = footer;

  // Toast container
  if (!document.querySelector('.toast-wrap')) {
    const tw = document.createElement('div');
    tw.className = 'toast-wrap';
    tw.setAttribute('aria-live', 'polite');
    document.body.appendChild(tw);
  }

  // Floating WhatsApp chat button — href + label come from admin settings.
  if (!document.querySelector('.vg-fab')) {
    const fab = document.createElement('a');
    fab.className = 'vg-fab';
    fab.setAttribute('data-social', 'whatsapp');
    fab.setAttribute('data-setting-href', 'whatsapp');
    fab.setAttribute('target', '_blank');
    fab.setAttribute('rel', 'noopener');
    fab.setAttribute('aria-label', 'Chat with us on WhatsApp');
    fab.href = 'https://wa.me/2348000000000';
    fab.innerHTML =
      '<span class="vg-fab-ping" aria-hidden="true"></span>' +
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.9c0 2.1.55 4.06 1.6 5.82L2 22l4.4-1.15a9.9 9.9 0 0 0 5.64 1.72c5.46 0 9.9-4.45 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.02c-.24.68-1.4 1.3-1.94 1.35-.5.05-1.13.07-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.8-4.17-4.95-4.36-.14-.19-1.18-1.57-1.18-3s.75-2.13 1.02-2.42c.27-.29.58-.36.78-.36l.56.01c.18.01.42-.07.66.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.09.19-.14.31-.28.48l-.42.49c-.14.14-.28.29-.12.57.16.28.72 1.18 1.54 1.91 1.06.95 1.95 1.24 2.23 1.38.28.14.44.12.6-.07.16-.19.69-.8.87-1.08.18-.28.36-.23.6-.14.24.09 1.55.73 1.82.86.27.14.45.21.51.32.07.11.07.64-.17 1.32z"/></svg>' +
      '<span class="vg-fab-label" data-setting="whatsapp_text">Chat with us</span>';
    document.body.appendChild(fab);
  }

  // Cookie consent notice (shown once; choice stored in localStorage).
  (function cookieConsent() {
    let stored = null;
    try { stored = localStorage.getItem('vg_cookie_consent'); } catch (_) { return; }
    if (stored) return;

    const bar = document.createElement('div');
    bar.className = 'cookie-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Cookie notice');
    bar.innerHTML = `
      <p class="cookie-text">We use minimal, privacy-respecting cookies to run this site and understand usage. See our <a href="privacy.html">Privacy Policy</a>.</p>
      <div class="cookie-actions">
        <button type="button" class="btn btn-ghost cookie-btn" data-consent="declined">Decline</button>
        <button type="button" class="btn btn-primary cookie-btn" data-consent="accepted">Accept</button>
      </div>`;
    document.body.appendChild(bar);
    requestAnimationFrame(() => bar.classList.add('show'));

    bar.querySelectorAll('[data-consent]').forEach(btn => {
      btn.addEventListener('click', () => {
        try { localStorage.setItem('vg_cookie_consent', btn.dataset.consent); } catch (_) {}
        bar.classList.remove('show');
        setTimeout(() => bar.remove(), 350);
      });
    });
  })();

  /* ============================================================
     Admin-managed branding & contact — fetched from Supabase and
     applied everywhere on load. Logo, favicon, socials, contact
     details and WhatsApp all update the moment settings change.
     Defaults are already baked into the markup, so the site works
     fully offline / if the fetch fails.
     ============================================================ */
  (function applySettings() {
    var SB_URL = 'https://drpvjnzuqhtlvgmtrthj.supabase.co';
    var SB_KEY = 'sb_publishable_-mBP1hR2CmFPTBg5KumEKg_AMbyTB9p';
    fetch(SB_URL + '/rest/v1/site_settings?select=*&id=eq.1&limit=1', { headers: { apikey: SB_KEY } })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) {
        var s = rows && rows[0];
        if (!s) return;

        // Typography — admin-controlled 3-font system + global scale
        applyTypography(s);

        // Favicon (also apple-touch-icon if a raster is supplied)
        if (s.favicon_url) {
          var icon = document.querySelector('link[rel="icon"]');
          if (!icon) { icon = document.createElement('link'); icon.rel = 'icon'; document.head.appendChild(icon); }
          icon.removeAttribute('type'); icon.href = s.favicon_url;
          var apple = document.querySelector('link[rel="apple-touch-icon"]');
          if (apple) apple.href = s.favicon_url;
        }

        // Logo — replace the mark+wordmark with the uploaded image everywhere it appears
        if (s.logo_url) {
          document.querySelectorAll('.js-logo').forEach(function (a) {
            a.innerHTML = '<img src="' + s.logo_url + '" alt="' + (s.brand_name || 'Vatous') + '" class="h-9 w-auto object-contain" />';
          });
        }

        // Social + WhatsApp links (wherever a [data-social] element exists)
        var socials = { linkedin: s.linkedin, x: s.x_url, instagram: s.instagram, whatsapp: s.whatsapp, facebook: s.facebook, tiktok: s.tiktok, youtube: s.youtube };
        Object.keys(socials).forEach(function (k) {
          if (!socials[k]) return;
          document.querySelectorAll('[data-social="' + k + '"]').forEach(function (el) { el.href = socials[k]; el.hidden = false; });
        });

        // Text content (wherever [data-setting] exists) — contact + hero + brand copy
        var texts = {
          email: s.email, phone: s.phone, address: s.address,
          brand_name: s.brand_name, brand_description: s.brand_description, tagline: s.tagline,
          hero_eyebrow: s.hero_eyebrow, hero_subheading: s.hero_subheading,
          hero_cta: s.hero_cta, hero_cta2: s.hero_cta2, business_hours: s.business_hours,
          whatsapp_text: s.whatsapp_text
        };
        Object.keys(texts).forEach(function (k) {
          if (texts[k] == null || texts[k] === '') return;
          document.querySelectorAll('[data-setting="' + k + '"]').forEach(function (el) { el.textContent = texts[k]; });
        });

        // Contact links (mailto / tel / wa.me)
        if (s.email) document.querySelectorAll('[data-setting-href="email"]').forEach(function (el) { el.href = 'mailto:' + s.email; });
        if (s.phone) document.querySelectorAll('[data-setting-href="phone"]').forEach(function (el) { el.href = 'tel:' + s.phone.replace(/[^+0-9]/g, ''); });
        if (s.whatsapp) document.querySelectorAll('[data-setting-href="whatsapp"]').forEach(function (el) { el.href = s.whatsapp; });

        // SEO overrides (only when the page hasn't set a more specific value)
        if (s.seo_description) { var md = document.querySelector('meta[name="description"]'); if (md && !md.content) md.content = s.seo_description; }

        // Announcement bar — injected at the top of <body> when set
        if (s.announcement && !document.querySelector('.vg-announce')) {
          var bar = document.createElement('div');
          bar.className = 'vg-announce';
          bar.setAttribute('role', 'status');
          bar.textContent = s.announcement;
          document.body.insertBefore(bar, document.body.firstChild);
          document.body.classList.add('has-announce');
        }
      })
      .catch(function () { /* keep baked-in defaults */ });
  })();

  /* ---- Typography: apply admin font choices as CSS variables ---- */
  var VG_LOADED_FONTS = { Inter: 1, 'Space Grotesk': 1, Manrope: 1, 'JetBrains Mono': 1, Sora: 1 };
  function loadGoogleFont(family) {
    if (!family || VG_LOADED_FONTS[family]) return;
    VG_LOADED_FONTS[family] = 1;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=' +
      encodeURIComponent(family).replace(/%20/g, '+') +
      ':wght@400;500;600;700;800&display=swap';
    document.head.appendChild(l);
  }
  function applyTypography(s) {
    var root = document.documentElement.style;
    var stack = function (fam, fb) { return fam ? ("'" + fam + "', " + fb) : null; };
    if (s.font_primary)   { loadGoogleFont(s.font_primary);   root.setProperty('--font-primary',   stack(s.font_primary,   "'Inter', system-ui, sans-serif")); }
    if (s.font_secondary) { loadGoogleFont(s.font_secondary); root.setProperty('--font-secondary', stack(s.font_secondary, "system-ui, sans-serif")); }
    if (s.font_tertiary)  { loadGoogleFont(s.font_tertiary);  root.setProperty('--font-tertiary',  stack(s.font_tertiary,  "'Inter', system-ui, sans-serif")); }
    if (s.type_scale)     { root.setProperty('--type-scale', String(s.type_scale)); }
  }
  window.VG_applyTypography = applyTypography;
  window.VG_loadGoogleFont = loadGoogleFont;
})();
