/**
 * FAQ accordion: one item open at a time.
 */
export function initFaq() {
  const items = Array.from(document.querySelectorAll('.faq__item'));
  if (!items.length) return;

  const setItem = (item, open) => {
    const btn = item.querySelector('.faq__question');
    const panel = btn && document.getElementById(btn.getAttribute('aria-controls'));
    if (!btn || !panel) return;
    btn.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    item.classList.toggle('is-open', open);
  };

  items.forEach((item) => {
    const btn = item.querySelector('.faq__question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const willOpen = btn.getAttribute('aria-expanded') !== 'true';
      items.forEach((other) => {
        if (other !== item) setItem(other, false);
      });
      setItem(item, willOpen);
    });
  });
}
