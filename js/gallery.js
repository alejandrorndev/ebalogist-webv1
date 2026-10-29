/**
 * Gallery: category filters + accessible lightbox.
 */
export function initGallery() {
  const items = Array.from(document.querySelectorAll('.gallery__item'));
  const filters = Array.from(document.querySelectorAll('.filter-btn'));

  /* ---------- Filters ---------- */
  if (filters.length && items.length) {
    const applyFilter = (btn) => {
      const filter = btn.dataset.filter || 'all';
      filters.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });
      items.forEach((item) => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('is-hidden', !match);
      });
    };
    filters.forEach((btn) => {
      btn.setAttribute('aria-selected', String(btn.classList.contains('is-active')));
      btn.addEventListener('click', () => applyFilter(btn));
    });
  }

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  if (!lightbox || !items.length) return;

  const img = lightbox.querySelector('.lightbox__img');
  const caption = lightbox.querySelector('.lightbox__caption');
  const btnClose = lightbox.querySelector('.lightbox__close');
  const btnPrev = lightbox.querySelector('.lightbox__prev');
  const btnNext = lightbox.querySelector('.lightbox__next');
  const refLabel = lightbox.querySelector('.lightbox__ref');
  const whatsapp = lightbox.querySelector('.lightbox__whatsapp');
  const btnQuote = lightbox.querySelector('.lightbox__quote');
  const whatsappBase = whatsapp ? whatsapp.href.split('?')[0] : '';
  if (!img) return;

  let currentRef = '';

  let current = -1; // index into the currently visible items
  let opener = null;

  const visibleItems = () => items.filter((item) => !item.classList.contains('is-hidden'));

  const show = (index) => {
    const list = visibleItems();
    if (!list.length) return;
    current = (index + list.length) % list.length;
    const item = list[current];
    const trigger = item.querySelector('.gallery__open');
    const thumb = item.querySelector('img');
    const figcaption = item.querySelector('figcaption');
    const text = figcaption ? figcaption.textContent.trim() : '';
    img.src = (trigger && trigger.dataset.full) || (thumb && (thumb.currentSrc || thumb.src)) || '';
    img.alt = (thumb && thumb.alt) || text;
    if (caption) caption.textContent = text;
    currentRef = item.dataset.ref || '';
    if (refLabel) refLabel.textContent = currentRef ? `Ref. ${currentRef}` : '';
    if (whatsapp && currentRef) {
      const message = `Hola, me interesa cotizar un trabajo como la referencia ${currentRef} (${text}).`;
      whatsapp.href = `${whatsappBase}?text=${encodeURIComponent(message)}`;
    }
    const single = list.length < 2;
    if (btnPrev) btnPrev.hidden = single;
    if (btnNext) btnNext.hidden = single;
  };

  const focusables = () =>
    Array.from(lightbox.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')).filter(
      (el) => !el.hidden && !el.disabled
    );

  const onKeydown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      show(current - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      show(current + 1);
    } else if (e.key === 'Tab') {
      // Focus trap: keep Tab / Shift+Tab cycling inside the dialog.
      const els = focusables();
      if (!els.length) {
        e.preventDefault();
        return;
      }
      const first = els[0];
      const last = els[els.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !lightbox.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !lightbox.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const open = (item, trigger) => {
    const index = visibleItems().indexOf(item);
    if (index < 0) return;
    opener = trigger;
    show(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', onKeydown);
    if (btnClose) btnClose.focus();
    else {
      lightbox.setAttribute('tabindex', '-1');
      lightbox.focus();
    }
  };

  const close = () => {
    if (!lightbox.classList.contains('is-open')) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', onKeydown);
    if (opener) opener.focus();
    opener = null;
  };

  items.forEach((item) => {
    const trigger = item.querySelector('.gallery__open');
    if (trigger) trigger.addEventListener('click', () => open(item, trigger));
  });
  if (btnClose) btnClose.addEventListener('click', close);

  // Lleva la referencia al formulario de cotización.
  if (btnQuote) {
    btnQuote.addEventListener('click', () => {
      const refField = document.getElementById('qf-ref');
      const target = document.getElementById('quote-form');
      opener = null; // no devolver el foco a la galería al cerrar
      close();
      if (refField) refField.value = currentRef;
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const next = document.getElementById('qf-name');
      if (next) next.focus({ preventScroll: true });
    });
  }
  if (btnPrev) btnPrev.addEventListener('click', () => show(current - 1));
  if (btnNext) btnNext.addEventListener('click', () => show(current + 1));

  // Clicking the backdrop (the lightbox element itself, not its content) closes it.
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
}
