/* Limbly — main.js
   Handles: mobile nav, accordions, filter sidebar, gallery, signup feedback,
            nav scroll shadow, scroll reveal */

// ── Nav shadow on scroll ───────────────────────────────────────────
const siteNav = document.querySelector('.site-nav');
if (siteNav) {
  const onScroll = () => siteNav.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Scroll reveal — only animate elements below the fold ──────────
const revealEls = document.querySelectorAll('.product-card, .creator-card, .category-card, .journal-card, .why-item');
const viewportH = window.innerHeight;

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  const rect = el.getBoundingClientRect();
  if (rect.top > viewportH) {
    // Below fold: start hidden, animate in on scroll
    el.classList.add('will-animate');
    el.style.transitionDelay = `${(i % 4) * 55}ms`;
  }
  // Above fold: already visible, no animation needed
});

const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.remove('will-animate');
      e.target.classList.add('is-visible');
      revealObserver.unobserve(e.target);
    }
  }),
  { threshold: 0.08, rootMargin: '0px 0px 80px 0px' }
);
document.querySelectorAll('.will-animate').forEach(el => revealObserver.observe(el));

// Safety fallback: show everything after 2s
setTimeout(() => {
  document.querySelectorAll('.will-animate').forEach(el => {
    el.classList.remove('will-animate');
    el.classList.add('is-visible');
  });
}, 2000);

// ── Mobile navigation ──────────────────────────────────────────────
const menuBtn  = document.getElementById('nav-menu-btn');
const mobileNav = document.getElementById('mobile-nav');

if (menuBtn && mobileNav) {
  menuBtn.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      mobileNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
      menuBtn.focus();
    }
  });
}

// ── Accordion — handles both .accordion__btn and .accordion-btn ───
document.querySelectorAll('.accordion__btn, .accordion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.accordion__item, .accordion-item');
    if (!item) return;
    const wasOpen = item.classList.contains('open');
    const parent = item.closest('.accordion');
    if (parent) {
      parent.querySelectorAll('.accordion__item.open, .accordion-item.open').forEach(i => {
        i.classList.remove('open');
        const ib = i.querySelector('.accordion__btn, .accordion-btn');
        if (ib) ib.setAttribute('aria-expanded', 'false');
        const panel = i.querySelector('.accordion__body, .accordion-panel');
        if (panel) panel.hidden = true;
      });
    }
    if (!wasOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      const panel = item.querySelector('.accordion__body, .accordion-panel');
      if (panel) panel.hidden = false;
    }
  });
});

// ── Mobile filter sidebar ──────────────────────────────────────────
const filterToggle = document.querySelector('.js-filter-toggle');
const filterSidebar = document.querySelector('.shop-sidebar, .filter-sidebar');

if (filterToggle && filterSidebar) {
  filterToggle.addEventListener('click', () => {
    const isOpen = filterSidebar.classList.toggle('is-open');
    filterToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

// ── Product gallery thumbnails ─────────────────────────────────────
document.querySelectorAll('.gallery-thumb').forEach(thumb => {
  thumb.addEventListener('click', () => {
    const gallery = thumb.closest('.product-gallery');
    if (!gallery) return;
    gallery.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    // In a real implementation, swap the main image src here
    const main = gallery.querySelector('.gallery-main .img-placeholder');
    if (main && thumb.dataset.caption) {
      main.textContent = thumb.dataset.caption;
    }
  });
});

// ── Email signup forms ─────────────────────────────────────────────
document.querySelectorAll('.js-signup-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input    = form.querySelector('input[type="email"]');
    const feedback = form.querySelector('.signup-feedback');
    if (!input || !input.value.includes('@')) {
      if (feedback) {
        feedback.textContent = 'Please enter a valid email address.';
        feedback.style.color = '#c0392b';
        feedback.removeAttribute('hidden');
        announceToSR(feedback.textContent);
      }
      return;
    }
    if (feedback) {
      feedback.textContent = "You're in. We'll be in touch.";
      feedback.style.color = 'var(--c-coral)';
      feedback.removeAttribute('hidden');
      announceToSR(feedback.textContent);
    }
    form.querySelector('button[type="submit"]').disabled = true;
    input.value = '';
  });
});

// ── Announce to screen readers ─────────────────────────────────────
function announceToSR(msg) {
  let live = document.getElementById('sr-live');
  if (!live) {
    live = document.createElement('div');
    live.id = 'sr-live';
    live.setAttribute('aria-live', 'polite');
    live.setAttribute('aria-atomic', 'true');
    live.className = 'sr-only';
    document.body.appendChild(live);
  }
  live.textContent = '';
  requestAnimationFrame(() => { live.textContent = msg; });
}

// ── Filter: clear all ─────────────────────────────────────────────
const clearFiltersBtn = document.getElementById('clear-filters');
if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener('click', () => {
    document.querySelectorAll('.filter-sidebar input[type="checkbox"], .filter-sidebar input[type="radio"]')
      .forEach(el => { el.checked = false; });
    // In real implementation: re-fetch or filter products here
  });
}

// ── Apply page: tag toggle ─────────────────────────────────────────
document.querySelectorAll('.category-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('selected');
    const selected = btn.classList.contains('selected');
    btn.setAttribute('aria-pressed', String(selected));
  });
});
