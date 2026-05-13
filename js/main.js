/* Limbly — main.js
   Handles: mobile nav, accordions, filter sidebar, gallery, signup feedback */

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

// ── Accordion ──────────────────────────────────────────────────────
document.querySelectorAll('.accordion__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.accordion__item');
    const wasOpen = item.classList.contains('open');
    // Optionally close others in same parent:
    const parent = item.closest('.accordion');
    if (parent) {
      parent.querySelectorAll('.accordion__item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.accordion__btn').setAttribute('aria-expanded', 'false');
      });
    }
    if (!wasOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ── Mobile filter sidebar ──────────────────────────────────────────
const filterToggle = document.getElementById('filter-toggle');
const filterClose  = document.getElementById('filter-close');
const filterSidebar = document.querySelector('.filter-sidebar');

if (filterToggle && filterSidebar) {
  filterToggle.addEventListener('click', () => {
    filterSidebar.classList.add('open');
    filterToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  });
}
if (filterClose && filterSidebar) {
  filterClose.addEventListener('click', () => {
    filterSidebar.classList.remove('open');
    if (filterToggle) filterToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
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
