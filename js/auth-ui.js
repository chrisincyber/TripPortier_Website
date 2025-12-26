/**
 * TripPortier Authentication UI
 * Handles login modal and navbar authentication state
 */

class AuthUI {
  constructor() {
    this.modal = null;
    this.mode = 'signin'; // 'signin', 'signup', or 'reset'
    this.isLoading = false;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    // Listen to auth state changes
    if (window.tripPortierAuth) {
      window.tripPortierAuth.addListener((user, profile) => {
        this.updateNavbar(user, profile);
      });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-user-dropdown')) {
        const dropdown = document.querySelector('.nav-user-dropdown.open');
        if (dropdown) dropdown.classList.remove('open');
      }
    });
  }

  // Show the authentication modal
  showModal(mode = 'signin') {
    this.mode = mode;

    // Remove existing modal if present
    const existing = document.getElementById('auth-modal');
    if (existing) existing.remove();

    // Create modal HTML
    const modalHTML = this.createModalHTML();
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    this.modal = document.getElementById('auth-modal');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Attach event listeners
    this.attachEventListeners();

    // Show modal with animation
    requestAnimationFrame(() => {
      this.modal.classList.add('show');
    });
  }

  createModalHTML() {
    let content = '';

    if (this.mode === 'reset') {
      content = this.createResetPasswordHTML();
    } else {
      content = this.createSignInSignUpHTML();
    }

    return `
    <div id="auth-modal" class="auth-modal">
      <div class="auth-modal-overlay" onclick="window.authUI.hideModal()"></div>
      <div class="auth-modal-content">
        <button class="auth-modal-close" onclick="window.authUI.hideModal()" aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        ${content}
      </div>
    </div>
    `;
  }

  createSignInSignUpHTML() {
    const isSignIn = this.mode === 'signin';

    return `
    <!-- Sign In / Sign Up Tabs -->
    <div class="auth-tabs">
      <button class="auth-tab ${isSignIn ? 'active' : ''}" onclick="window.authUI.switchMode('signin')">Sign In</button>
      <button class="auth-tab ${!isSignIn ? 'active' : ''}" onclick="window.authUI.switchMode('signup')">Sign Up</button>
    </div>

    <div class="auth-header">
      <img src="/assets/images/logo.png" alt="TripPortier" class="auth-logo">
      <h2>${isSignIn ? 'Welcome Back' : 'Create Account'}</h2>
      <p>${isSignIn ? 'Sign in to access your trips and settings' : 'Join TripPortier to sync your travel data'}</p>
    </div>

    <!-- Social Login Buttons -->
    <div class="auth-social-buttons">
      <button class="auth-btn auth-btn-apple" onclick="window.authUI.signInWithApple()" id="apple-btn">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        Continue with Apple
      </button>

      <button class="auth-btn auth-btn-google" onclick="window.authUI.signInWithGoogle()" id="google-btn">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>
    </div>

    <div class="auth-divider">
      <span>or</span>
    </div>

    <!-- Email Form -->
    <form id="auth-email-form" class="auth-form">
      ${!isSignIn ? `
      <div class="auth-field">
        <label for="auth-name">Name</label>
        <input type="text" id="auth-name" placeholder="Your name" required>
      </div>
      ` : ''}

      <div class="auth-field">
        <label for="auth-email">Email</label>
        <input type="email" id="auth-email" placeholder="your@email.com" required>
      </div>

      <div class="auth-field">
        <label for="auth-password">Password</label>
        <input type="password" id="auth-password" placeholder="••••••••" required minlength="6">
      </div>

      ${isSignIn ? `
      <div class="auth-forgot-password">
        <a onclick="window.authUI.switchMode('reset')">Forgot password?</a>
      </div>
      ` : ''}

      <div id="auth-error" class="auth-error" style="display: none;"></div>

      <button type="submit" class="auth-btn auth-btn-primary" id="submit-btn">
        ${isSignIn ? 'Sign In' : 'Create Account'}
      </button>
    </form>

    <div class="auth-footer">
      ${isSignIn ? `
        <p>Don't have an account? <a onclick="window.authUI.switchMode('signup')">Sign up</a></p>
      ` : `
        <p>Already have an account? <a onclick="window.authUI.switchMode('signin')">Sign in</a></p>
      `}
    </div>
    `;
  }

  createResetPasswordHTML() {
    return `
    <div class="auth-header">
      <img src="/assets/images/logo.png" alt="TripPortier" class="auth-logo">
      <h2>Reset Password</h2>
      <p>Enter your email and we'll send you a reset link</p>
    </div>

    <form id="auth-reset-form" class="auth-form">
      <div class="auth-field">
        <label for="auth-email">Email</label>
        <input type="email" id="auth-email" placeholder="your@email.com" required>
      </div>

      <div id="auth-error" class="auth-error" style="display: none;"></div>
      <div id="auth-success" class="auth-success" style="display: none;"></div>

      <button type="submit" class="auth-btn auth-btn-primary" id="submit-btn">
        Send Reset Link
      </button>
    </form>

    <div class="auth-footer">
      <p>Remember your password? <a onclick="window.authUI.switchMode('signin')">Sign in</a></p>
    </div>
    `;
  }

  attachEventListeners() {
    const emailForm = document.getElementById('auth-email-form');
    const resetForm = document.getElementById('auth-reset-form');

    if (emailForm) {
      emailForm.addEventListener('submit', (e) => this.handleEmailSubmit(e));
    }

    if (resetForm) {
      resetForm.addEventListener('submit', (e) => this.handleResetSubmit(e));
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal) {
        this.hideModal();
      }
    });
  }

  async handleEmailSubmit(e) {
    e.preventDefault();

    if (this.isLoading) return;

    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const errorEl = document.getElementById('auth-error');
    const submitBtn = document.getElementById('submit-btn');

    try {
      this.setLoading(true);
      errorEl.style.display = 'none';

      if (this.mode === 'signin') {
        // Check if 2FA is enabled for this user
        try {
          const checkTwoFactorStatus = firebase.functions().httpsCallable('checkTwoFactorStatus');
          const result = await checkTwoFactorStatus({ email });

          if (result.data.twoFactorEnabled) {
            // 2FA is enabled - authenticate first, then verify OTP
            await window.tripPortierAuth.signInWithEmail(email, password);

            // Sign out temporarily - user needs to complete 2FA
            await window.tripPortierAuth.auth.signOut();

            // Store credentials temporarily (will be used after OTP verification)
            this.pendingAuth = { email, password };

            // Send 2FA code
            const sendTwoFactorCode = firebase.functions().httpsCallable('sendTwoFactorCode');
            await sendTwoFactorCode({ email });

            // Show OTP verification modal
            this.showOtpModal(email);
            return;
          }
        } catch (twoFactorError) {
          // If 2FA check fails, proceed with normal login
          console.warn('2FA check failed, proceeding with normal login:', twoFactorError);
        }

        // Normal login (no 2FA)
        await window.tripPortierAuth.signInWithEmail(email, password);
        this.hideModal();
      } else {
        const name = document.getElementById('auth-name').value;
        await window.tripPortierAuth.signUpWithEmail(email, password, name);
        this.hideModal();
        // Redirect new users to account page to complete profile setup
        if (!window.location.pathname.includes('account.html')) {
          window.location.href = '/account.html';
        }
      }
    } catch (error) {
      errorEl.textContent = this.getErrorMessage(error.code);
      errorEl.style.display = 'block';
    } finally {
      this.setLoading(false);
    }
  }

  async handleResetSubmit(e) {
    e.preventDefault();

    if (this.isLoading) return;

    const email = document.getElementById('auth-email').value;
    const errorEl = document.getElementById('auth-error');
    const successEl = document.getElementById('auth-success');
    const submitBtn = document.getElementById('submit-btn');

    try {
      this.setLoading(true);
      errorEl.style.display = 'none';
      successEl.style.display = 'none';

      await window.tripPortierAuth.sendPasswordResetEmail(email);

      successEl.textContent = 'Check your email for a password reset link.';
      successEl.style.display = 'block';
      submitBtn.disabled = true;
    } catch (error) {
      errorEl.textContent = this.getErrorMessage(error.code);
      errorEl.style.display = 'block';
    } finally {
      this.setLoading(false);
    }
  }

  async signInWithGoogle() {
    if (this.isLoading) return;

    const errorEl = document.getElementById('auth-error');
    const googleBtn = document.getElementById('google-btn');
    const isSignUp = this.mode === 'signup';

    try {
      this.setLoading(true, googleBtn);
      if (errorEl) errorEl.style.display = 'none';

      const result = await window.tripPortierAuth.signInWithGoogle();
      this.hideModal();

      // Check if profile needs setup (no username)
      const profile = window.tripPortierAuth.userProfile;
      if (!profile?.username && !window.location.pathname.includes('account.html')) {
        window.location.href = '/account.html';
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      if (errorEl) {
        errorEl.textContent = this.getErrorMessage(error.code);
        errorEl.style.display = 'block';
      }
    } finally {
      this.setLoading(false, googleBtn);
    }
  }

  async signInWithApple() {
    if (this.isLoading) return;

    const errorEl = document.getElementById('auth-error');
    const appleBtn = document.getElementById('apple-btn');
    const isSignUp = this.mode === 'signup';

    try {
      this.setLoading(true, appleBtn);
      if (errorEl) errorEl.style.display = 'none';

      const result = await window.tripPortierAuth.signInWithApple();
      this.hideModal();

      // Check if profile needs setup (no username)
      const profile = window.tripPortierAuth.userProfile;
      if (!profile?.username && !window.location.pathname.includes('account.html')) {
        window.location.href = '/account.html';
      }
    } catch (error) {
      console.error('Apple sign-in error:', error);
      if (errorEl) {
        errorEl.textContent = this.getErrorMessage(error.code);
        errorEl.style.display = 'block';
      }
    } finally {
      this.setLoading(false, appleBtn);
    }
  }

  setLoading(loading, specificBtn = null) {
    this.isLoading = loading;

    const buttons = this.modal.querySelectorAll('.auth-btn');
    const inputs = this.modal.querySelectorAll('input');

    buttons.forEach(btn => {
      btn.disabled = loading;
    });

    inputs.forEach(input => {
      input.disabled = loading;
    });

    if (specificBtn && loading) {
      const originalHTML = specificBtn.innerHTML;
      specificBtn.dataset.originalHtml = originalHTML;
      specificBtn.innerHTML = '<div class="auth-loading"><div class="auth-spinner"></div><span>Please wait...</span></div>';
    } else if (specificBtn && specificBtn.dataset.originalHtml) {
      specificBtn.innerHTML = specificBtn.dataset.originalHtml;
    }
  }

  getErrorMessage(code) {
    const messages = {
      'auth/invalid-email': 'Invalid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/popup-closed-by-user': 'Sign-in was cancelled.',
      'auth/cancelled-popup-request': 'Sign-in was cancelled.',
      'auth/popup-blocked': 'Popup was blocked. Please allow popups and try again.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/operation-not-allowed': 'This sign-in method is not enabled.'
    };
    return messages[code] || 'An error occurred. Please try again.';
  }

  switchMode(mode) {
    this.hideModal();
    setTimeout(() => this.showModal(mode), 250);
  }

  hideModal() {
    if (this.modal) {
      this.modal.classList.remove('show');
      document.body.style.overflow = '';

      setTimeout(() => {
        if (this.modal) {
          this.modal.remove();
          this.modal = null;
        }
      }, 300);
    }
  }

  // ============================================
  // TWO-FACTOR AUTHENTICATION OTP MODAL
  // ============================================

  showOtpModal(email) {
    // Remove existing modal
    if (this.modal) {
      this.modal.remove();
    }

    const maskedEmail = this.maskEmail(email);

    const modalHTML = `
    <div id="auth-modal" class="auth-modal">
      <div class="auth-modal-overlay" onclick="window.authUI.cancelOtpVerification()"></div>
      <div class="auth-modal-content">
        <button class="auth-modal-close" onclick="window.authUI.cancelOtpVerification()" aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="auth-header">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 28px;">🔐</span>
          </div>
          <h2>Verify Your Identity</h2>
          <p>We sent a verification code to<br><strong>${maskedEmail}</strong></p>
        </div>

        <form id="auth-otp-form" class="auth-form">
          <div class="auth-field">
            <label for="otp-code">Enter 6-digit code</label>
            <input
              type="text"
              id="otp-code"
              placeholder="000000"
              maxlength="6"
              pattern="[0-9]{6}"
              inputmode="numeric"
              autocomplete="one-time-code"
              style="text-align: center; font-size: 1.5rem; letter-spacing: 0.5rem; font-weight: 600;"
              required
            >
          </div>

          <div id="auth-error" class="auth-error" style="display: none;"></div>

          <button type="submit" class="auth-btn auth-btn-primary" id="verify-otp-btn">
            Verify & Sign In
          </button>
        </form>

        <div class="auth-footer" style="margin-top: 1.5rem;">
          <p>Didn't receive the code? <a onclick="window.authUI.resendOtpCode()" id="resend-otp-link">Resend</a></p>
          <p style="margin-top: 0.5rem;"><a onclick="window.authUI.cancelOtpVerification()">Use a different account</a></p>
        </div>
      </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.getElementById('auth-modal');

    // Attach event listener
    const otpForm = document.getElementById('auth-otp-form');
    if (otpForm) {
      otpForm.addEventListener('submit', (e) => this.handleOtpSubmit(e));
    }

    // Auto-focus the input
    setTimeout(() => {
      document.getElementById('otp-code')?.focus();
    }, 100);

    // Show modal with animation
    requestAnimationFrame(() => {
      this.modal.classList.add('show');
    });
  }

  maskEmail(email) {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) {
      return `${localPart[0]}***@${domain}`;
    }
    return `${localPart.slice(0, 2)}***${localPart.slice(-1)}@${domain}`;
  }

  async handleOtpSubmit(e) {
    e.preventDefault();

    if (this.isLoading || !this.pendingAuth) return;

    const code = document.getElementById('otp-code').value;
    const errorEl = document.getElementById('auth-error');
    const submitBtn = document.getElementById('verify-otp-btn');

    if (!code || code.length !== 6) {
      errorEl.textContent = 'Please enter the 6-digit code';
      errorEl.style.display = 'block';
      return;
    }

    try {
      this.isLoading = true;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Verifying...';
      errorEl.style.display = 'none';

      // Verify OTP code
      const verifyTwoFactorCode = firebase.functions().httpsCallable('verifyTwoFactorCode');
      const result = await verifyTwoFactorCode({
        email: this.pendingAuth.email,
        code: code
      });

      if (result.data.success) {
        // OTP verified - now complete the sign in
        await window.tripPortierAuth.signInWithEmail(
          this.pendingAuth.email,
          this.pendingAuth.password
        );

        // Clear pending auth
        this.pendingAuth = null;

        // Close modal
        this.hideModal();
      }
    } catch (error) {
      console.error('OTP verification error:', error);

      let errorMessage = 'Invalid verification code. Please try again.';
      if (error.code === 'functions/deadline-exceeded') {
        errorMessage = 'Code expired. Please request a new one.';
      } else if (error.code === 'functions/resource-exhausted') {
        errorMessage = 'Too many attempts. Please request a new code.';
      } else if (error.code === 'functions/not-found') {
        errorMessage = 'No code found. Please request a new one.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      errorEl.textContent = errorMessage;
      errorEl.style.display = 'block';
    } finally {
      this.isLoading = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Verify & Sign In';
    }
  }

  async resendOtpCode() {
    if (this.isLoading || !this.pendingAuth) return;

    const resendLink = document.getElementById('resend-otp-link');
    const errorEl = document.getElementById('auth-error');

    try {
      resendLink.textContent = 'Sending...';
      resendLink.style.pointerEvents = 'none';
      errorEl.style.display = 'none';

      const sendTwoFactorCode = firebase.functions().httpsCallable('sendTwoFactorCode');
      await sendTwoFactorCode({ email: this.pendingAuth.email });

      resendLink.textContent = 'Sent!';

      // Re-enable after 30 seconds
      setTimeout(() => {
        resendLink.textContent = 'Resend';
        resendLink.style.pointerEvents = 'auto';
      }, 30000);

    } catch (error) {
      console.error('Resend OTP error:', error);
      resendLink.textContent = 'Resend';
      resendLink.style.pointerEvents = 'auto';
      errorEl.textContent = 'Failed to send code. Please try again.';
      errorEl.style.display = 'block';
    }
  }

  cancelOtpVerification() {
    // Clear pending auth
    this.pendingAuth = null;

    // Hide modal and show login again
    this.hideModal();

    setTimeout(() => {
      this.showModal('signin');
    }, 300);
  }

  // Update navbar based on auth state
  updateNavbar(user, profile) {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    // Request notification permission when user logs in (only once per session)
    if (user && !this._notificationPromptShown) {
      this._notificationPromptShown = true;
      this.promptForNotifications(user.uid);
    }

    // Remove existing auth element
    const existingAuth = navLinks.querySelector('.nav-auth');
    if (existingAuth) existingAuth.remove();

    // Handle My Trips nav link visibility (look for existing element first)
    const existingMyTripsNav = document.getElementById('mytrips-nav');
    const existingTripsLink = navLinks.querySelector('.nav-trips-link');
    if (existingTripsLink && !existingMyTripsNav) existingTripsLink.remove();

    // Skip adding Sign In button on account page (it has its own Sign In UI)
    const isAccountPage = window.location.pathname.includes('account.html');
    if (!user && isAccountPage) {
      // Hide My Trips if exists
      if (existingMyTripsNav) existingMyTripsNav.style.display = 'none';
      // Also update mobile menu
      this.updateMobileMenu(user, profile);
      return;
    }

    // Show/hide My Trips nav link based on login state
    if (user) {
      if (existingMyTripsNav) {
        // Use the existing element
        existingMyTripsNav.style.display = '';
        const isTripsPage = window.location.pathname.includes('trips.html');
        const tripsLink = existingMyTripsNav.querySelector('a');
        if (tripsLink && isTripsPage) tripsLink.classList.add('active');
      } else {
        // Create dynamically if not found
        const tripsLi = document.createElement('li');
        tripsLi.className = 'nav-trips-link';
        const isTripsPage = window.location.pathname.includes('trips.html');
        tripsLi.innerHTML = `<a href="/trips.html" ${isTripsPage ? 'class="active"' : ''}>My Trips</a>`;
        navLinks.appendChild(tripsLi);
      }
    } else {
      if (existingMyTripsNav) existingMyTripsNav.style.display = 'none';
    }

    // Create new auth element
    const authLi = document.createElement('li');
    authLi.className = 'nav-auth';

    if (user) {
      const displayName = profile?.displayName || user.displayName || user.email.split('@')[0];
      const avatarURL = profile?.profileImageURL || user.photoURL;
      const email = user.email;
      const initial = displayName.charAt(0).toUpperCase();

      authLi.innerHTML = `
        <div class="nav-user-dropdown">
          <button class="nav-user-btn" onclick="this.parentElement.classList.toggle('open')">
            ${avatarURL ?
              `<img src="${avatarURL}" alt="${displayName}" class="nav-user-avatar">` :
              `<div class="nav-user-avatar-placeholder">${initial}</div>`
            }
            <span>${displayName}</span>
            <svg class="nav-user-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="nav-user-menu">
            <div class="nav-user-menu-header">
              <div class="nav-user-menu-name">${displayName}</div>
              <div class="nav-user-menu-email">${email}</div>
            </div>
            <a href="/trips.html">
              <svg class="nav-user-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"></path>
              </svg>
              My Trips
            </a>
            <a href="/account.html">
              <svg class="nav-user-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path>
              </svg>
              My Account
            </a>
            <a href="/settings.html">
              <svg class="nav-user-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Settings
            </a>
            <div class="nav-user-menu-divider"></div>
            <button class="signout" onclick="window.tripPortierAuth.signOut(); this.closest('.nav-user-dropdown').classList.remove('open');">
              <svg class="nav-user-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      `;
    } else {
      authLi.innerHTML = `
        <a href="#" class="nav-signin-btn" onclick="window.authUI.showModal('signin'); return false;">Sign In</a>
      `;
    }

    navLinks.appendChild(authLi);

    // Also update mobile menu if it exists
    this.updateMobileMenu(user, profile);
  }

  // Prompt for web push notifications
  async promptForNotifications(userId) {
    // Don't prompt on localhost for now
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      console.log('Skipping notification prompt on localhost');
      return;
    }

    // Check if already have permission
    if (Notification.permission === 'granted') {
      // Already have permission, just make sure we have token saved
      this.setupNotifications(userId);
      return;
    }

    // Don't prompt if denied
    if (Notification.permission === 'denied') {
      console.log('Notification permission was denied');
      return;
    }

    // Wait a bit before prompting (don't interrupt login flow)
    setTimeout(async () => {
      try {
        const token = await window.requestNotificationPermission();
        if (token) {
          await window.saveWebFcmToken(userId, token);
          window.setupForegroundMessageHandler();
          console.log('Web notifications enabled successfully');
        }
      } catch (error) {
        console.error('Failed to setup notifications:', error);
      }
    }, 2000);
  }

  // Setup notifications for user who already granted permission
  async setupNotifications(userId) {
    try {
      await window.initializeMessaging();
      const token = await window.requestNotificationPermission();
      if (token) {
        await window.saveWebFcmToken(userId, token);
        window.setupForegroundMessageHandler();
      }
    } catch (error) {
      console.error('Failed to setup notifications:', error);
    }
  }

  updateMobileMenu(user, profile) {
    // Check if there's a mobile menu section
    const mobileMenu = document.querySelector('.mobile-nav-links');
    if (!mobileMenu) return;

    // Remove existing mobile auth section
    const existingAuth = mobileMenu.querySelector('.mobile-auth-section');
    if (existingAuth) existingAuth.remove();

    const authSection = document.createElement('div');
    authSection.className = 'mobile-auth-section';

    if (user) {
      const displayName = profile?.displayName || user.displayName || user.email.split('@')[0];
      const avatarURL = profile?.profileImageURL || user.photoURL;
      const email = user.email;

      authSection.innerHTML = `
        <div class="mobile-user-info">
          ${avatarURL ?
            `<img src="${avatarURL}" alt="${displayName}" class="mobile-user-avatar">` :
            `<div class="nav-user-avatar-placeholder">${displayName.charAt(0).toUpperCase()}</div>`
          }
          <div class="mobile-user-details">
            <div class="mobile-user-name">${displayName}</div>
            <div class="mobile-user-email">${email}</div>
          </div>
        </div>
        <a href="/trips.html" class="mobile-signin-btn" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white;">My Trips</a>
        <a href="/account.html" class="mobile-signin-btn" style="background: #f3f4f6; color: #374151; margin-top: 0.5rem;">My Account</a>
        <a href="/settings.html" class="mobile-signin-btn" style="background: #f3f4f6; color: #374151; margin-top: 0.5rem;">Settings</a>
        <button class="mobile-signout-btn" onclick="window.tripPortierAuth.signOut()">Sign Out</button>
      `;
    } else {
      authSection.innerHTML = `
        <button class="mobile-signin-btn" onclick="window.authUI.showModal('signin'); toggleMenu();">Sign In</button>
      `;
    }

    mobileMenu.appendChild(authSection);
  }
}

// Create global instance
window.authUI = new AuthUI();
