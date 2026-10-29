/**
 * Header behaviour: mobile menu, sticky header state, scroll spy, back-to-top.
 */
const DESKTOP_MIN = 900;
const SCROLLED_AT = 40;
const BACK_TO_TOP_AT = 600;

export function initNav() {
  const header = document.getElementById('site-header');
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('primary-nav');
  const backToTop = document.getElementById('back-to-top');
  const links = Array.from(document.querySelectorAll('.nav__link'));

  /* ---------- Mobile menu ---------- */
  if (toggle && nav) {
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    };
    const isOpen = () => nav.classList.contains('is-open');

    toggle.addEventListener('click', () => setOpen(!isOpen()));

    // Close when any link/CTA inside the nav is used.
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if (isOpen() && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > DESKTOP_MIN && isOpen()) setOpen(false);
    });
  }

  /* ---------- Scroll-driven state (rAF throttled) ---------- */
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > SCROLLED_AT);
    if (backToTop) backToTop.classList.toggle('is-visible', y > BACK_TO_TOP_AT);
    ticking = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  onScroll();

  /* ---------- Scroll spy ---------- */
  if (!links.length || !('IntersectionObserver' in window)) return;

  const linkById = new Map();
  links.forEach((link) => {
    const hash = link.getAttribute('href') || '';
    if (!hash.startsWith('#') || hash.length < 2) return;
    const section = document.getElementById(hash.slice(1));
    if (section) linkById.set(section.id, link);
  });
  if (!linkById.size) return;

  const setActive = (id) => {
    links.forEach((link) => {
      const active = linkById.get(id) === link;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  // Track which sections are currently in the "active band" and pick the topmost.
  const visible = new Set();
  const order = Array.from(linkById.keys());
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      });
      const current = order.find((id) => visible.has(id));
      if (current) setActive(current);
    },
    // Active band: from just below the header to ~40% down the viewport.
    { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
  );
  order.forEach((id) => observer.observe(document.getElementById(id)));
}
