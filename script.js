/* ==========================================================================
   Florency Dalsania — Portfolio
   Vanilla JS. No dependencies. Everything degrades gracefully without JS.
   1. Theme toggle (persisted, respects system preference)
   2. Sticky header state + active nav underline (IntersectionObserver)
   3. Mobile menu (animated, focus-managed, Esc to close)
   4. Scroll reveal (IntersectionObserver)
   5. Magnetic buttons (pointer devices only, reduced-motion aware)
   6. Misc: footer year
   ========================================================================== */
(function () {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  /* ---------- 1. Theme ---------- */
  const toggle = document.getElementById('theme-toggle');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme() {
    const explicit = root.getAttribute('data-theme');
    if (explicit) return explicit;
    return systemDark.matches ? 'dark' : 'light';
  }

  function applyTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (persist) {
      try { localStorage.setItem('theme', theme); } catch (e) { /* private mode etc. */ }
    }
    syncToggle();
  }

  function syncToggle() {
    if (!toggle) return;
    const isDark = currentTheme() === 'dark';
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
    });
    // Follow the OS if the user hasn't chosen explicitly
    systemDark.addEventListener('change', () => {
      let saved = null;
      try { saved = localStorage.getItem('theme'); } catch (e) {}
      if (!saved) { root.removeAttribute('data-theme'); syncToggle(); }
    });
    syncToggle();
  }

  /* ---------- 2. Header state + active section ---------- */
  const header = document.querySelector('.site-header');
  const navLinks = Array.from(document.querySelectorAll('.nav__links a'));
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = '#' + entry.target.id;
        navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === id));
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- 3. Mobile menu ---------- */
  const menuBtn = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');

  function openMenu() {
    if (!menu) return;
    menu.hidden = false;
    // next frame so the transition runs from the hidden state
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('menu-open');
    const first = menu.querySelector('a');
    if (first) first.focus({ preventScroll: true });
  }

  function closeMenu(returnFocus) {
    if (!menu || menu.hidden) return;
    menu.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
    const done = () => { menu.hidden = true; };
    if (reduceMotion.matches) done(); else setTimeout(done, 380);
    if (returnFocus) menuBtn.focus({ preventScroll: true });
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      menu.hidden ? openMenu() : closeMenu(false);
    });
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) closeMenu(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu(true);
    });
    // Close if the viewport grows past the mobile breakpoint
    window.matchMedia('(min-width: 961px)').addEventListener('change', (mq) => {
      if (mq.matches) closeMenu(false);
    });
  }

  /* ---------- 4. Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    revealEls.forEach(el => {
      // Anything already on screen at load (the hero) reveals immediately,
      // staggered by its own --d delay, instead of waiting for a scroll.
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-visible');
      else io.observe(el);
    });
  }

  /* ---------- 5. Magnetic buttons ---------- */
  // Subtle: the button leans a few pixels toward the cursor and eases back.
  if (finePointer.matches && !reduceMotion.matches) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      const strength = 0.22; // fraction of the pointer offset
      let raf = null;

      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * strength;
        const dy = (e.clientY - (r.top + r.height / 2)) * strength;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          btn.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
        });
      });

      btn.addEventListener('pointerleave', () => {
        if (raf) cancelAnimationFrame(raf);
        btn.style.transform = '';
      });
    });
  }

  /* ---------- 6. Project summary modals ---------- */
  // Each .card__hit button carries data-modal="<id>". The dialog traps focus,
  // closes on Esc / backdrop / × and returns focus to the opener.
  let openModal = null;
  let opener = null;
  const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function showModal(id, from) {
    const m = document.getElementById(id);
    if (!m) return;
    opener = from || document.activeElement;
    openModal = m;
    m.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => m.classList.add('is-open')));
    document.body.classList.add('modal-open');
    const first = m.querySelector('.modal__close');
    if (first) first.focus({ preventScroll: true });
  }

  function hideModal() {
    if (!openModal) return;
    const m = openModal;
    m.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    const done = () => { m.hidden = true; };
    if (reduceMotion.matches) done(); else setTimeout(done, 320);
    if (opener && typeof opener.focus === 'function') opener.focus({ preventScroll: true });
    openModal = null; opener = null;
  }

  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => showModal(btn.getAttribute('data-modal'), btn));
  });
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', (e) => {
      if (e.target === m || e.target.closest('.modal__close')) hideModal();
    });
  });
  document.addEventListener('keydown', (e) => {
    if (!openModal) return;
    if (e.key === 'Escape') { hideModal(); return; }
    if (e.key === 'Tab') {
      const items = Array.from(openModal.querySelectorAll(FOCUSABLE));
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- 7. Misc ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
