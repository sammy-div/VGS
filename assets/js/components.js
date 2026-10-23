/* ============================================================
   Vatous Global Solutions — shared UI chrome
   Injects the site header (nav + mobile menu) and footer into
   every page. Usage:
     <div id="site-header"></div>  …before main.js
     <div id="site-footer"></div>
   Also loads brand head links, the toast layer, the WhatsApp
   button, the cookie notice, and applies admin-managed settings
   fetched from Supabase.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Head links (root-absolute so they resolve from /blog/ too) ---------- */
  const addLink = (rel, href, attrs) => {
    if (document.querySelector(`link[rel="${rel}"]`)) return;
    const l = document.createElement('link');
    l.rel = rel; l.href = href;
    if (attrs) Object.assign(l, attrs);
    document.head.appendChild(l);
  };
  addLink('icon', '/favicon.svg', { type: 'image/svg+xml' });
  addLink('alternate icon', '/favicon.png', { type: 'image/png' });
  addLink('apple-touch-icon', '/apple-touch-icon.png');
  addLink('manifest', '/manifest.webmanifest');

  /* ---------- Brand lockups ---------- */
  const LOGO = `
    <a href="index.html" class="js-logo" aria-label="Vatous — home">
      <img src="/assets/images/logo.png" alt="Vatous" style="height:30px;width:auto" decoding="async" />
    </a>`;
  const LOGO_LIGHT = `
    <a href="index.html" class="js-logo" aria-label="Vatous — home">
      <img src="/assets/images/logo-light.png" alt="Vatous" style="height:34px;width:auto" decoding="async" />
    </a>`;

  /* ---------- Primary navigation ---------- */
  const NAV = [
    ['Home', 'index.html'],
    ['What We Do', 'services.html'],
    ['Products', 'products.html'],
    ['About', 'about.html'],
    ['Insights', 'blog.html'],
    ['Contact', 'contact.html']
  ];

  const path = location.pathname.split('/').pop() || 'index.html';
  const isCurrent = (href) => (href === path ? ' aria-current="page"' : '');

  const navLinks = NAV.map(([label, href]) =>
    `<a href="${href}" class="nav-link"${isCurrent(href)}>${label}</a>`
  ).join('');

  const mobileLinks = [['Home', 'index.html'], ...NAV.slice(1), ['Careers', 'careers.html']]
    .map(([label, href], i) =>
      `<a href="${href}"${isCurrent(href)}>${label}<span class="mono muted">${String(i).padStart(2, '0')}</span></a>`)
    .join('');

  const header = `
  <a class="skip" href="#main">Skip to content</a>
  <header id="nav" class="nav">
    <div class="shell nav-inner">
      ${LOGO}
      <nav class="nav-links" aria-label="Primary">${navLinks}</nav>
      <div class="nav-cta">
        <a href="contact.html" class="btn btn--sm">Discuss a Project</a>
      </div>
      <button id="menu-open" class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
      </button>
    </div>
  </header>

  <div id="mobile-menu" class="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="mobile-head">
      ${LOGO}
      <button id="menu-close" class="icon-btn" aria-label="Close menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
      </button>
    </div>
    <nav class="mobile-links" aria-label="Mobile">${mobileLinks}</nav>
    <div class="mobile-foot">
      <a href="contact.html" class="btn btn--block">Discuss a Project</a>
      <a href="mailto:info@vatous.com.ng" class="btn btn--ghost btn--block" data-setting-href="email">info@vatous.com.ng</a>
    </div>
  </div>`;

  const mount = document.getElementById('site-header');
  if (mount) mount.innerHTML = header;

  /* ---------- Footer ---------- */
  const social = (key, fallback, label, pathD) => `
    <a class="social" data-social="${key}" data-setting-href="${key === 'x' ? 'x_url' : key}" href="${fallback}" target="_blank" rel="noopener" aria-label="${label}">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${pathD}"/></svg>
    </a>`;

  const footer = `
  <footer class="site-footer">
    <div class="shell">
      <div class="footer-top">
        <div>
          ${LOGO_LIGHT}
          <p class="footer-desc" data-setting="brand_description">Vatous Global develops digital products, delivers creative and technology solutions, and builds ventures that solve practical problems.</p>
          <form class="newsletter js-newsletter" novalidate>
            <label class="sr" for="foot-email">Email address</label>
            <input id="foot-email" class="field" type="email" name="email" placeholder="you@company.com" autocomplete="email" />
            <button class="btn btn--cyan btn--sm" type="submit">Subscribe</button>
          </form>
          <div class="footer-socials">
            ${social('linkedin', 'https://www.linkedin.com/company/vatous', 'LinkedIn', 'M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM0 8h5v16H0zM8 8h4.8v2.2h.07c.67-1.2 2.3-2.5 4.73-2.5C22.4 7.7 24 10 24 14.1V24h-5v-8.8c0-2.1-.04-4.8-2.9-4.8-2.9 0-3.35 2.27-3.35 4.6V24H8z')}
            ${social('x', 'https://x.com/vatous', 'X', 'M18.9 2H22l-7.5 8.6L23 22h-6.8l-5-6.6L5.3 22H2l8-9.2L1 2h7l4.6 6zM16.8 20h1.9L7.3 4H5.3z')}
            ${social('instagram', 'https://instagram.com/vatous', 'Instagram', 'M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3zm6.9-11.1a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5z')}
          </div>
        </div>

        <div class="footer-col">
          <h3>What we do</h3>
          <ul>
            <li><a href="services.html">Digital product development</a></li>
            <li><a href="ai-solutions.html">AI and intelligent systems</a></li>
            <li><a href="automation-integrations.html">Automation and integrations</a></li>
            <li><a href="branding-creative.html">Creative and brand</a></li>
            <li><a href="training-academy.html">Training and enablement</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h3>Products</h3>
          <ul>
            <li><a href="joblira.html">Joblira</a></li>
            <li><a href="products.html">All products</a></li>
            <li><a href="academy.html">Vatous Academy</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h3>Company</h3>
          <ul>
            <li><a href="about.html">About</a></li>
            <li><a href="blog.html">Insights</a></li>
            <li><a href="careers.html">Careers</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h3>Contact</h3>
          <ul>
            <li><a data-setting-href="email" data-setting="email" href="mailto:hello@vatous.ng">hello@vatous.ng</a></li>
            <li><a data-setting-href="phone" data-setting="phone" href="tel:+2348054801556">+234 805 480 1556</a></li>
            <li><span data-setting="address">Ibadan, Oyo State</span></li>
            <li><a data-setting-href="whatsapp" href="https://wa.me/2348000000000" target="_blank" rel="noopener">WhatsApp</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <span>&copy; <span data-year>2026</span> Vatous Global Solutions. All rights reserved.</span>
        <span class="footer-legal">
          <a href="privacy.html">Privacy</a>
          <a href="terms.html">Terms</a>
          <a href="contact.html">Contact</a>
        </span>
      </div>
    </div>
  </footer>`;

  const fmount = document.getElementById('site-footer');
  if (fmount) fmount.innerHTML = footer;

  /* ---------- Toast layer ---------- */
  if (!document.querySelector('.toast-wrap')) {
    const tw = document.createElement('div');
    tw.className = 'toast-wrap';
    tw.setAttribute('aria-live', 'polite');
    document.body.appendChild(tw);
  }

  /* ---------- WhatsApp chat button ---------- */
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

  /* ---------- Cookie notice ---------- */
  (function cookieConsent() {
    let stored = null;
    try { stored = localStorage.getItem('vg_cookie_consent'); } catch (_) { return; }
    if (stored) return;

    const bar = document.createElement('div');
    bar.className = 'cookie-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Cookie notice');
    bar.innerHTML = `
      <p class="cookie-text">We use minimal, privacy-respecting cookies to run this site and understand usage. See our <a href="privacy.html" style="text-decoration:underline">Privacy Policy</a>.</p>
      <div class="cookie-actions">
        <button type="button" class="btn btn--ghost btn--sm" data-consent="declined">Decline</button>
        <button type="button" class="btn btn--sm" data-consent="accepted">Accept</button>
      </div>`;
    document.body.appendChild(bar);
    requestAnimationFrame(() => bar.classList.add('show'));

    bar.querySelectorAll('[data-consent]').forEach(btn => {
      btn.addEventListener('click', () => {
        try { localStorage.setItem('vg_cookie_consent', btn.dataset.consent); } catch (_) {}
        bar.classList.remove('show');
        setTimeout(() => bar.remove(), 400);
      });
    });
  })();

  /* ============================================================
     Admin-managed branding & contact — fetched from Supabase and
     applied on load. Defaults are baked into the markup, so the
     site works fully if the fetch fails.
     ============================================================ */
  (function applySettings() {
    var SB_URL = 'https://drpvjnzuqhtlvgmtrthj.supabase.co';
    var SB_KEY = 'sb_publishable_-mBP1hR2CmFPTBg5KumEKg_AMbyTB9p';
    fetch(SB_URL + '/rest/v1/site_settings?select=*&id=eq.1&limit=1', { headers: { apikey: SB_KEY } })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) {
        var s = rows && rows[0];
        if (!s) return;

        window.VG_SETTINGS = s;
        try { document.dispatchEvent(new CustomEvent('vg:settings', { detail: s })); } catch (_) {}

        applyTypography(s);

        // Favicon (also apple-touch-icon if a raster is supplied)
        if (s.favicon_url) {
          var icon = document.querySelector('link[rel="icon"]');
          if (!icon) { icon = document.createElement('link'); icon.rel = 'icon'; document.head.appendChild(icon); }
          icon.removeAttribute('type'); icon.href = s.favicon_url;
          var apple = document.querySelector('link[rel="apple-touch-icon"]');
          if (apple) apple.href = s.favicon_url;
        }

        // Logo — replace the lockup everywhere it appears
        if (s.logo_url) {
          document.querySelectorAll('.js-logo').forEach(function (a) {
            a.innerHTML = '<img src="' + s.logo_url + '" alt="' + (s.brand_name || 'Vatous') + '" style="height:32px;width:auto" />';
          });
        }

        // Social + WhatsApp links
        var socials = { linkedin: s.linkedin, x: s.x_url, instagram: s.instagram, whatsapp: s.whatsapp, facebook: s.facebook, tiktok: s.tiktok, youtube: s.youtube };
        Object.keys(socials).forEach(function (k) {
          if (!socials[k]) return;
          document.querySelectorAll('[data-social="' + k + '"]').forEach(function (el) { el.href = socials[k]; el.hidden = false; });
        });

        // Generic text binding — [data-setting="col"]
        document.querySelectorAll('[data-setting]').forEach(function (el) {
          var k = el.getAttribute('data-setting');
          if (s[k] != null && s[k] !== '') el.textContent = s[k];
        });

        // Generic link binding — [data-setting-href="col"]
        document.querySelectorAll('[data-setting-href]').forEach(function (el) {
          var k = el.getAttribute('data-setting-href'), v = null;
          if (k === 'email' && s.email) v = 'mailto:' + s.email;
          else if (k === 'phone' && s.phone) v = 'tel:' + s.phone.replace(/[^+0-9]/g, '');
          else if (k === 'whatsapp' && s.whatsapp) v = s.whatsapp;
          else if (s[k]) v = s[k];
          if (v) el.href = v;
        });

        // Generic image binding — [data-setting-src="col"]
        document.querySelectorAll('[data-setting-src]').forEach(function (el) {
          var k = el.getAttribute('data-setting-src');
          if (!s[k]) return;
          el.src = s[k];
          el.hidden = false;
          var fb = document.querySelector('[data-fallback="' + k + '"]');
          if (fb) fb.hidden = true;
        });
      })
      .catch(function () { /* offline / blocked — baked-in defaults stand */ });
  })();

  /* Admin-controlled typography (3-font system + global scale). */
  function applyTypography(s) {
    var map = [
      [s.font_primary, '--font-sans'],
      [s.font_secondary, '--font-serif'],
      [s.font_tertiary, '--font-mono']
    ];
    map.forEach(function (pair) {
      if (pair[0]) document.documentElement.style.setProperty(pair[1], "'" + pair[0] + "', system-ui, sans-serif");
    });
    if (s.type_scale && s.type_scale !== 1) {
      document.documentElement.style.setProperty('--type-scale', s.type_scale);
      document.documentElement.style.fontSize = (16 * Number(s.type_scale)) + 'px';
    }
  }
})();
