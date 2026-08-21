(() => {
  const form = document.getElementById('contact-form-el');
  if (!form) return;

  const successPanel = document.getElementById('form-success');
  const resetBtn = document.getElementById('reset-btn');
  const submitBtn = document.getElementById('submit-btn');
  const LOG_KEY = 'dnk_contact_log';

  const fields = {
    name: {
      input: document.getElementById('field-name'),
      error: document.getElementById('error-name'),
      validate(value) {
        if (!value.trim()) return 'Vui lòng nhập họ và tên.';
        if (value.trim().length < 2) return 'Họ và tên quá ngắn.';
        return null;
      },
    },
    email: {
      input: document.getElementById('field-email'),
      error: document.getElementById('error-email'),
      validate(value) {
        if (!value.trim()) return 'Vui lòng nhập email.';
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(value.trim())) return 'Email không đúng định dạng.';
        return null;
      },
    },
    phone: {
      input: document.getElementById('field-phone'),
      error: document.getElementById('error-phone'),
      validate(value) {
        if (!value.trim()) return 'Vui lòng nhập số điện thoại.';
        const digits = value.replace(/[\s.-]/g, '');
        const re = /^(\+84|0)[0-9]{9,10}$/;
        if (!re.test(digits)) return 'Số điện thoại không hợp lệ (vd: 0901 234 567).';
        return null;
      },
    },
    message: {
      input: document.getElementById('field-message'),
      error: document.getElementById('error-message'),
      validate(value) {
        if (!value.trim()) return 'Vui lòng nhập nội dung tin nhắn.';
        if (value.trim().length < 10) return 'Nội dung tin nhắn quá ngắn (tối thiểu 10 ký tự).';
        return null;
      },
    },
  };

  function setFieldError(field, message) {
    field.input.classList.toggle('has-error', Boolean(message));
    field.input.setAttribute('aria-invalid', message ? 'true' : 'false');
    field.error.textContent = message || '';
    field.error.classList.toggle('is-visible', Boolean(message));
  }

  function validateAll() {
    let firstInvalid = null;
    let isValid = true;

    Object.values(fields).forEach((field) => {
      const message = field.validate(field.input.value);
      setFieldError(field, message);
      if (message) {
        isValid = false;
        if (!firstInvalid) firstInvalid = field.input;
      }
    });

    if (firstInvalid) firstInvalid.focus();
    return isValid;
  }

  function logSubmission(data) {
    try {
      const existing = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
      existing.push({ ...data, submittedAt: new Date().toISOString() });
      localStorage.setItem(LOG_KEY, JSON.stringify(existing));
    } catch (err) {
      // localStorage có thể bị chặn (chế độ ẩn danh...) — bỏ qua, không chặn luồng submit.
    }
  }

  function showSuccess() {
    form.classList.add('is-hidden');
    successPanel.classList.add('is-visible');
    successPanel.focus?.();
  }

  function showForm() {
    successPanel.classList.remove('is-visible');
    form.classList.remove('is-hidden');
    form.reset();
    Object.values(fields).forEach((field) => setFieldError(field, null));
    fields.name.input.focus();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateAll()) return;

    const data = {
      name: fields.name.input.value.trim(),
      email: fields.email.input.value.trim(),
      phone: fields.phone.input.value.trim(),
      message: fields.message.input.value.trim(),
    };

    submitBtn.disabled = true;
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Đang gửi...';

    window.setTimeout(() => {
      logSubmission(data);
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
      showSuccess();
    }, 600);
  });

  resetBtn?.addEventListener('click', showForm);
})();
