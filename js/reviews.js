/**
 * Reviews slider: paged translateX carousel with dots, autoplay and swipe.
 * Cards per view come from the CSS custom property --per-view on .reviews__slider.
 */
const AUTOPLAY_MS = 7000;
const SWIPE_THRESHOLD = 50;

export function initReviews() {
  const slider = document.querySelector('.reviews__slider');
  const track = slider ? slider.querySelector('.reviews__track') : null;
  if (!slider || !track) return;

  const cards = Array.from(track.querySelectorAll('.review-card'));
  if (!cards.length) return;

  const section = slider.closest('.reviews') || document.body;
  const btnPrev = section.querySelector('.reviews__btn--prev');
  const btnNext = section.querySelector('.reviews__btn--next');
  const dotsWrap = section.querySelector('.reviews__dots');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let perView = 1;
  let pages = 1;
  let page = 0;
  let dots = [];

  const readPerView = () => {
    const raw = parseInt(getComputedStyle(slider).getPropertyValue('--per-view'), 10);
    return Number.isFinite(raw) && raw > 0 ? Math.min(raw, cards.length) : 1;
  };

  const goTo = (index) => {
    page = (index + pages) % pages;
    // First card of this page, clamped so the last page is always full.
    const first = Math.max(0, Math.min(page * perView, cards.length - perView));
    const offset = cards[first].offsetLeft - cards[0].offsetLeft;
    track.style.transform = `translateX(${-offset}px)`;

    cards.forEach((card, i) => {
      card.setAttribute('aria-hidden', String(!(i >= first && i < first + perView)));
    });
    dots.forEach((dot, i) => {
      const active = i === page;
      dot.classList.toggle('is-active', active);
      if (active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    const single = pages < 2;
    if (btnPrev) btnPrev.disabled = single;
    if (btnNext) btnNext.disabled = single;
  };

  /* ---------- Autoplay ---------- */
  let timer = null;
  let hovering = false;
  let focused = false;

  const stop = () => {
    clearInterval(timer);
    timer = null;
  };
  // (Re)starts the timer if allowed; also used to reset it after manual navigation.
  const start = () => {
    stop();
    if (reducedMotion.matches || pages < 2 || hovering || focused || document.hidden) return;
    timer = setInterval(() => goTo(page + 1), AUTOPLAY_MS);
  };

  const buildDots = () => {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    dots = Array.from({ length: pages }, (_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'reviews__dot';
      dot.setAttribute('aria-label', `Ver página de reseñas ${i + 1} de ${pages}`);
      dot.addEventListener('click', () => {
        goTo(i);
        start();
      });
      dotsWrap.appendChild(dot);
      return dot;
    });
  };

  const layout = () => {
    const nextPerView = readPerView();
    const nextPages = Math.ceil(cards.length / nextPerView);
    if (nextPerView !== perView || nextPages !== pages || (dotsWrap && !dots.length)) {
      // Keep roughly the same first visible card across breakpoint changes.
      const firstCard = Math.min(page * perView, cards.length - 1);
      perView = nextPerView;
      pages = nextPages;
      page = Math.min(Math.floor(firstCard / perView), pages - 1);
      buildDots();
    }
    goTo(page);
    start();
  };

  section.addEventListener('mouseenter', () => {
    hovering = true;
    stop();
  });
  section.addEventListener('mouseleave', () => {
    hovering = false;
    start();
  });
  section.addEventListener('focusin', () => {
    focused = true;
    stop();
  });
  section.addEventListener('focusout', (e) => {
    if (section.contains(e.relatedTarget)) return;
    focused = false;
    start();
  });
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', start);

  /* ---------- Controls ---------- */
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      goTo(page - 1);
      start();
    });
  }
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      goTo(page + 1);
      start();
    });
  }

  /* ---------- Swipe (pointer events) ---------- */
  let startX = null;
  let startY = 0;
  slider.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    startX = e.clientX;
    startY = e.clientY;
  });
  slider.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    startX = null;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      goTo(dx < 0 ? page + 1 : page - 1);
      start();
    }
  });
  slider.addEventListener('pointercancel', () => {
    startX = null;
  });
  // Let the browser keep vertical scrolling while we handle horizontal swipes.
  slider.style.touchAction = 'pan-y';

  /* ---------- Resize ---------- */
  let resizeFrame = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(layout);
  });

  layout();
}
