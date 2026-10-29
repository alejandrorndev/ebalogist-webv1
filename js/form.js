/**
 * Quote form: client-side validation, then submit to Web3Forms (form action).
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Returns an error message for the field, or '' when valid. */
function validateField(field) {
  const value = (field.value || '').trim();
  const label = field.id;

  if (field.required && !value) {
    return field.tagName === 'SELECT' ? 'Por favor, elige una opción.' : 'Este campo es obligatorio.';
  }
  if (!value) return '';

  if (field.type === 'email' || label === 'qf-email') {
    if (!EMAIL_RE.test(value)) return 'Introduce un correo electrónico válido.';
  }
  if (field.type === 'tel' || label === 'qf-phone') {
    if (value.replace(/\D/g, '').length < 7) return 'Introduce un teléfono válido (mínimo 7 dígitos).';
  }
  if (label === 'qf-message' && value.length < 10) {
    return 'Cuéntanos un poco más (mínimo 10 caracteres).';
  }
  return '';
}

function setError(field, message) {
  const wrapper = field.closest('.form-field');
  const errorEl = wrapper ? wrapper.querySelector('.form-error') : null;
  const invalid = Boolean(message);

  if (wrapper) wrapper.classList.toggle('has-error', invalid);
  if (errorEl) {
    errorEl.textContent = message;
    if (!errorEl.id && field.id) errorEl.id = `${field.id}-error`;
  }
  if (invalid) {
    field.setAttribute('aria-invalid', 'true');
    if (errorEl && errorEl.id) field.setAttribute('aria-describedby', errorEl.id);
  } else {
    field.removeAttribute('aria-invalid');
  }
}

export function initQuoteForm() {
  const form = document.getElementById('quote-form');
  if (!form) return;

  const fields = Array.from(form.querySelectorAll('input, select, textarea')).filter(
    (el) => el.type !== 'submit' && el.type !== 'button' && el.type !== 'hidden' && el.name !== 'botcheck'
  );
  const submitBtn = form.querySelector('[type="submit"]');
  const success = document.getElementById('form-success');
  const failure = document.getElementById('form-error');

  const showNotice = (el) => {
    if (!el) return;
    el.hidden = false;
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus();
  };

  const check = (field) => {
    const message = validateField(field);
    setError(field, message);
    return !message;
  };

  fields.forEach((field) => {
    field.addEventListener('blur', () => check(field));
    // Once a field has shown an error, re-validate live so it clears as the user fixes it.
    const live = () => {
      if (field.getAttribute('aria-invalid') === 'true') check(field);
    };
    field.addEventListener('input', live);
    field.addEventListener('change', live);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitBtn && submitBtn.disabled) return;

    const invalid = fields.filter((field) => !check(field));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    if (success) success.hidden = true;
    if (failure) failure.hidden = true;
    if (submitBtn) {
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
    }

    let sent = false;
    try {
      const data = Object.fromEntries(new FormData(form));
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      sent = res.ok && json.success !== false;
    } catch {
      sent = false;
    }

    if (submitBtn) {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-busy');
    }

    if (sent) {
      form.reset();
      fields.forEach((field) => setError(field, ''));
      showNotice(success);
    } else {
      showNotice(failure);
    }
  });
}
