/* ============================================================
   Vatous Global Solutions — Interactions
   Mobile menu · scroll reveal · counters · nav state ·
   FAQ accordion · blog filter · form validation · toasts.
   Vanilla JS only. Respects prefers-reduced-motion.
   ============================================================ */

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Supabase (REST via fetch — no client library) ---------- */
  const VG_SB = {
    url: 'https://drpvjnzuqhtlvgmtrthj.supabase.co',
    key: 'sb_publishable_-mBP1hR2CmFPTBg5KumEKg_AMbyTB9p'
  };
  // Insert a row into a Supabase table via the PostgREST endpoint.
  // Returns true on success; throws an Error with a readable message otherwise.
  async function vgInsert(table, payload) {
    const res = await fetch(`${VG_SB.url}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'apikey': VG_SB.key,
        'Authorization': `Bearer ${VG_SB.key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) return true;
    // 409 = unique violation (e.g. already-subscribed email)
    if (res.status === 409) { const e = new Error('duplicate'); e.duplicate = true; throw e; }
    let msg = 'Something went wrong. Please try again.';
    try { const j = await res.json(); msg = j.message || j.hint || msg; } catch (_) {}
    throw new Error(msg);
  }
  window.vgInsert = vgInsert;

  /* ---------- Toast helper (exposed globally) ---------- */
  window.vgToast = function (message, type) {
    const wrap = document.querySelector('.toast-wrap');
    if (!wrap) return;
    const t = document.createElement('div');
    t.className = 'toast';
    if (type === 'error') t.style.borderLeftColor = '#f87171';
    t.innerHTML = `<span>${message}</span>`;
    wrap.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 400);
    }, 3400);
  };

  /* ---------- Navbar: solid on scroll ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const menu = document.getElementById('mobile-menu');
  const openBtn = document.getElementById('menu-open');
  const closeBtn = document.getElementById('menu-close');
  const openMenu = () => { menu.classList.add('open'); document.body.classList.add('no-scroll'); openBtn?.setAttribute('aria-expanded', 'true'); };
  const closeMenu = () => { menu.classList.remove('open'); document.body.classList.remove('no-scroll'); openBtn?.setAttribute('aria-expanded', 'false'); };
  openBtn?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu?.classList.contains('open')) closeMenu(); });

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Counter animation ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const decimals = (el.dataset.decimals | 0);
    if (reduceMotion) { el.textContent = target.toFixed(decimals) + suffix; return; }
    const dur = 1600; const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { runCounter(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(c => co.observe(c));
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- Parallax on background shapes ---------- */
  if (!reduceMotion) {
    const shapes = document.querySelectorAll('[data-parallax]');
    if (shapes.length) {
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        shapes.forEach(s => {
          const speed = parseFloat(s.dataset.parallax) || 0.05;
          s.style.transform = `translateY(${y * speed}px)`;
        });
      }, { passive: true });
    }
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-a');
      const isOpen = item.classList.contains('open');
      // close siblings within same group
      const group = item.parentElement;
      group.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
    });
  });

  /* ---------- Rotating hero headlines ---------- */
  const rotator = document.querySelector('[data-rotator]');
  if (rotator) {
    const slides = Array.from(rotator.querySelectorAll('[data-slide]'));
    let idx = 0, timer = null, paused = false;
    const show = (n) => {
      slides.forEach((s, i) => {
        const active = i === n;
        s.style.opacity = active ? '1' : '0';
        s.style.transform = active ? 'translateY(0)' : 'translateY(12px)';
        s.setAttribute('aria-hidden', String(!active));
      });
    };
    const next = () => { idx = (idx + 1) % slides.length; show(idx); };
    show(0);
    if (!reduceMotion) {
      const play = () => { timer = setInterval(() => { if (!paused) next(); }, 4000); };
      play();
      rotator.addEventListener('mouseenter', () => paused = true);
      rotator.addEventListener('mouseleave', () => paused = false);
      rotator.addEventListener('focusin', () => paused = true);
      rotator.addEventListener('focusout', () => paused = false);
    }
  }

  /* ---------- Blog / case-study filter + search ----------
     Items are re-queried on every apply() so dynamically loaded
     cards (e.g. blog posts fetched from Supabase) are handled too.
     Each root exposes _applyFilter() for external refresh. */
  const initFilter = (root) => {
    if (root.dataset.filterReady) return;
    root.dataset.filterReady = '1';
    const searchInput = root.querySelector('[data-search]');
    const buttons = root.querySelectorAll('[data-filter]');
    const empty = root.querySelector('[data-empty]');
    let activeCat = 'all';

    const apply = () => {
      const items = root.querySelectorAll('[data-tags]'); // live
      const q = (searchInput?.value || '').toLowerCase().trim();
      let visible = 0;
      items.forEach(item => {
        const tags = (item.dataset.tags || '').toLowerCase();
        const text = item.textContent.toLowerCase();
        const catOk = activeCat === 'all' || tags.includes(activeCat);
        const qOk = !q || text.includes(q);
        const ok = catOk && qOk;
        item.style.display = ok ? '' : 'none';
        if (ok) visible++;
      });
      if (empty) empty.style.display = visible ? 'none' : 'block';
    };
    buttons.forEach(b => b.addEventListener('click', () => {
      activeCat = b.dataset.filter;
      buttons.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      apply();
    }));
    searchInput?.addEventListener('input', apply);
    root._applyFilter = apply;
    apply();
  };
  window.vgInitFilters = () => document.querySelectorAll('[data-filter-root]').forEach(initFilter);
  window.vgInitFilters();

  /* ---------- Form validation ---------- */
  const validators = {
    required: v => v.trim().length > 0,
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    min: (v, n) => v.trim().length >= +n
  };
  document.querySelectorAll('form.js-validate').forEach(form => {
    form.setAttribute('novalidate', '');
    const validateField = (field) => {
      const rules = (field.dataset.rules || '').split('|').filter(Boolean);
      let ok = true, msg = '';
      for (const rule of rules) {
        const [name, arg] = rule.split(':');
        if (validators[name] && !validators[name](field.value, arg)) {
          ok = false;
          msg = field.dataset[name + 'Msg'] || (name === 'email' ? 'Enter a valid email.' : name === 'min' ? `Please enter at least ${arg} characters.` : 'This field is required.');
          break;
        }
      }
      field.classList.toggle('invalid', !ok);
      const err = field.parentElement.querySelector('.field-error');
      if (err) { err.textContent = msg; err.classList.toggle('show', !ok); }
      return ok;
    };
    form.querySelectorAll('[data-rules]').forEach(f => {
      f.addEventListener('blur', () => validateField(f));
      f.addEventListener('input', () => { if (f.classList.contains('invalid')) validateField(f); });
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let ok = true;
      form.querySelectorAll('[data-rules]').forEach(f => { if (!validateField(f)) ok = false; });
      if (!ok) { window.vgToast('Please review the highlighted fields.', 'error'); return; }

      const table = form.dataset.sbTable;
      const btn = form.querySelector('button[type="submit"], button:not([type])');
      const successMsg = form.dataset.success || 'Thank you — we’ll be in touch shortly.';

      // No table wired → behave as a local demo submit.
      if (!table) { form.reset(); window.vgToast(successMsg); return; }

      // Collect named fields into a payload (skips empties).
      const payload = {};
      form.querySelectorAll('[name]').forEach(el => { if (el.value && el.value.trim() !== '') payload[el.name] = el.value.trim(); });

      const label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      try {
        await vgInsert(table, payload);
        form.reset();
        window.vgToast(successMsg);
      } catch (err) {
        window.vgToast(err.message || 'Submission failed. Please try again.', 'error');
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = label; }
      }
    });
  });

  /* ---------- Newsletter (footer) ---------- */
  document.querySelectorAll('form.js-newsletter').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const email = form.querySelector('input[type=email]');
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        window.vgToast('Please enter a valid email.', 'error');
        return;
      }
      const btn = form.querySelector('button');
      const label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = '…'; }
      try {
        await vgInsert('newsletter_subscribers', {
          email: email.value.trim(),
          source: (location.pathname.split('/').pop() || 'index.html')
        });
        form.reset();
        window.vgToast('Subscribed. Welcome aboard.');
      } catch (err) {
        if (err.duplicate) { form.reset(); window.vgToast('You’re already subscribed — thank you.'); }
        else window.vgToast(err.message || 'Subscription failed. Please try again.', 'error');
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = label; }
      }
    });
  });

  /* ---------- Resource download modal → resource_requests ---------- */
  const resModal = document.getElementById('resource-modal');
  if (resModal && typeof resModal.showModal === 'function') {
    const titleEl = resModal.querySelector('#resource-title');
    const emailEl = resModal.querySelector('#resource-email');
    const errEl = resModal.querySelector('#resource-error');
    const submitEl = resModal.querySelector('#resource-submit');
    let currentResource = '';

    document.querySelectorAll('.js-resource').forEach(btn => {
      btn.addEventListener('click', () => {
        currentResource = btn.dataset.resource || 'Resource';
        titleEl.textContent = currentResource;
        emailEl.value = '';
        emailEl.classList.remove('invalid');
        errEl.classList.remove('show');
        resModal.showModal();
        emailEl.focus();
      });
    });
    resModal.querySelector('#resource-close').addEventListener('click', () => resModal.close());

    submitEl.addEventListener('click', async () => {
      const val = emailEl.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        emailEl.classList.add('invalid');
        errEl.textContent = 'Enter a valid email.';
        errEl.classList.add('show');
        return;
      }
      const label = submitEl.textContent; submitEl.disabled = true; submitEl.textContent = 'Sending…';
      try {
        await vgInsert('resource_requests', { email: val, resource: currentResource });
        resModal.close();
        window.vgToast(`“${currentResource}” is on its way to your inbox.`);
      } catch (err) {
        errEl.textContent = err.message || 'Something went wrong. Please try again.';
        errEl.classList.add('show');
      } finally {
        submitEl.disabled = false; submitEl.textContent = label;
      }
    });
  }

  /* ---------- Drag & drop reorder (admin) ---------- */
  document.querySelectorAll('[data-sortable]').forEach(list => {
    let dragged = null;
    list.querySelectorAll('[draggable=true]').forEach(item => {
      item.addEventListener('dragstart', () => { dragged = item; item.style.opacity = '.4'; });
      item.addEventListener('dragend', () => { item.style.opacity = ''; });
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

  /* ---------- Current year fill ---------- */
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
