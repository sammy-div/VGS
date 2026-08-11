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
    <a href="index.html" class="flex items-center gap-2.5" aria-label="Vatous Global Solutions home">
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="30" height="30" rx="8" stroke="rgba(255,255,255,.16)"/>
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

  const mobileLinks = [['Home', 'index.html'], ...NAV, ['Resources', 'resources.html'], ['Contact', 'contact.html']]
    .map(([label, href]) => `<a href="${href}" class="block py-3 text-2xl font-head font-bold text-soft hover:text-white transition-colors border-b border-white/5">${label}</a>`)
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
      <button id="menu-open" class="lg:hidden text-white p-2 -mr-2" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
    </div>
  </header>

  <div id="mobile-menu" class="mobile-menu lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="shell pt-6 flex flex-col h-full">
      <div class="flex items-center justify-between h-[60px]">
        ${LOGO}
        <button id="menu-close" class="text-white p-2 -mr-2" aria-label="Close menu">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
      <nav class="mt-8 flex-1" aria-label="Mobile">${mobileLinks}</nav>
      <a href="contact.html" class="btn btn-primary w-full justify-center mb-10">Book Consultation</a>
    </div>
  </div>`;

  const year = new Date().getFullYear();
  const footer = `
  <footer class="relative border-t border-white/8 pt-16 pb-8 mt-8">
    <div class="shell">
      <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
        <div class="lg:col-span-2">
          ${LOGO}
          <p class="text-soft mt-4 max-w-xs text-sm leading-relaxed">Enterprise technology, AI systems and business consulting helping African organizations build dependable systems and grow with clarity.</p>
          <div class="flex items-center gap-3 mt-5">
            ${social('LinkedIn', 'M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM0 8h5v16H0zM8 8h4.8v2.2h.07c.67-1.2 2.3-2.5 4.73-2.5C22.4 7.7 24 10 24 14.1V24h-5v-8.8c0-2.1-.04-4.8-2.9-4.8-2.9 0-3.35 2.27-3.35 4.6V24H8z')}
            ${social('X', 'M18.9 2H22l-7.5 8.6L23 22h-6.8l-5-6.6L5.3 22H2l8-9.2L1 2h7l4.6 6zM16.8 20h1.9L7.3 4H5.3z')}
            ${social('Instagram', 'M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.4.37 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.05 1.2-.25 1.8-.42 2.2-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.4.17-1 .37-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.05-1.8-.25-2.2-.42a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.17-.4-.37-1-.42-2.2C2.21 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.2.25-1.8.42-2.2.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.4-.17 1-.37 2.2-.42C8.4 2.21 8.8 2.2 12 2.2zm0 3.5A6.3 6.3 0 1 0 18.3 12 6.3 6.3 0 0 0 12 5.7zm0 10.4A4.1 4.1 0 1 1 16.1 12 4.1 4.1 0 0 1 12 16.1zm6.5-10.9a1.47 1.47 0 1 0 1.47 1.47 1.47 1.47 0 0 0-1.47-1.47z')}
          </div>
        </div>
        ${footerCol('Company', [['About', 'about.html'], ['Careers', 'careers.html'], ['Case Studies', 'case-studies.html'], ['Insights', 'blog.html'], ['Contact', 'contact.html']])}
        ${footerCol('Services', [['Enterprise Technology', 'enterprise-technology.html'], ['AI Solutions', 'ai-solutions.html'], ['Automation', 'automation-integrations.html'], ['Business Advisory', 'business-advisory.html'], ['Branding & Creative', 'branding-creative.html'], ['Training Academy', 'training-academy.html']])}
        ${footerCol('Explore', [['Industries', 'industries.html'], ['Resources', 'resources.html'], ['Services', 'services.html']])}
        <div>
          <h4 class="text-white font-head font-bold text-sm mb-4">Newsletter</h4>
          <p class="text-mute text-sm mb-3">Practical insights on systems and automation. Monthly.</p>
          <form class="js-newsletter flex flex-col gap-2" novalidate>
            <input type="email" required placeholder="Work email" class="field text-sm" aria-label="Email address" />
            <button class="btn btn-ghost justify-center text-sm">Subscribe</button>
          </form>
        </div>
      </div>
      <hr class="hairline my-8" />
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-mute">
        <p>© ${year} Vatous Global Solutions. All rights reserved.</p>
        <div class="flex items-center gap-5">
          <a href="privacy.html" class="hover:text-white transition-colors">Privacy</a>
          <a href="terms.html" class="hover:text-white transition-colors">Terms</a>
          <a href="contact.html" class="hover:text-white transition-colors">Lagos · Remote across Africa</a>
        </div>
      </div>
    </div>
  </footer>`;

  function social(label, d) {
    return `<a href="#" aria-label="${label}" class="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-soft hover:text-white hover:border-white/25 transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${d}"/></svg></a>`;
  }
  function footerCol(title, items) {
    return `<div><h4 class="text-white font-head font-bold text-sm mb-4">${title}</h4><ul class="space-y-2.5">${items.map(([l, h]) => `<li><a href="${h}" class="text-soft text-sm hover:text-white transition-colors">${l}</a></li>`).join('')}</ul></div>`;
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
})();
