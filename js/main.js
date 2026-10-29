/**
 * Entry point. Loaded as a module (deferred), so the DOM is parsed when this runs.
 */
// Enable JS-only styles (e.g. .reveal start state) as early as possible.
document.documentElement.classList.add('js');

import { initNav } from './nav.js';
import { initGallery } from './gallery.js';
import { initFaq } from './faq.js';
import { initReviews } from './reviews.js';
import { initQuoteForm } from './form.js';
import { initReveal } from './reveal.js';

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

// Run each feature in isolation so one failure never breaks the others.
[initNav, initGallery, initFaq, initReviews, initQuoteForm, initReveal].forEach((init) => {
  try {
    init();
  } catch (err) {
    console.error(`[${init.name}]`, err);
  }
});
