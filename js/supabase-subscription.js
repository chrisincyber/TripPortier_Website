// Subscription Manager for TripPortier Website (Supabase)
// Handles cross-platform premium subscription with Stripe

class SubscriptionManager {
  constructor() {
    this.supabase = window.supabaseClient;
    this._subscription = null;
    this._isSubscribed = false;
  }

  /**
   * Get the current user's subscription status
   * @param {string} userId - User ID
   * @returns {Promise<{isSubscribed: boolean, subscription: object|null}>}
   */
  async getSubscriptionStatus(userId) {
    if (!userId) {
      return { isSubscribed: false, subscription: null };
    }

    try {
      const { data, error } = await this.supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        this._subscription = null;
        this._isSubscribed = false;
        return { isSubscribed: false, subscription: null };
      }

      const expirationDate = data.current_period_end ? new Date(data.current_period_end) : null;
      const isActive = data.status === 'active' && expirationDate && expirationDate > new Date();

      this._subscription = {
        ...data,
        expirationDate,
        startDate: data.current_period_start ? new Date(data.current_period_start) : null,
      };
      this._isSubscribed = isActive;

      return {
        isSubscribed: isActive,
        subscription: this._subscription,
      };
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return { isSubscribed: false, subscription: null };
    }
  }

  /**
   * Check if current cached subscription is active
   * @returns {boolean}
   */
  get isSubscribed() {
    return this._isSubscribed;
  }

  /**
   * Get cached subscription data
   * @returns {object|null}
   */
  get subscription() {
    return this._subscription;
  }

  /**
   * Initiate subscription checkout via Stripe
   * @param {'monthly'|'yearly'} planId - The plan to subscribe to
   * @returns {Promise<void>}
   */
  async subscribe(planId) {
    // Ensure user is authenticated
    if (!window.tripPortierAuth || !window.tripPortierAuth.isAuthenticated()) {
      if (window.authUI) {
        window.authUI.showModal('signin');
      } else {
        alert('Please sign in to subscribe');
      }
      return;
    }

    // Find and update button to show loading state
    const buttons = document.querySelectorAll('.subscribe-btn');
    const clickedButton = Array.from(buttons).find(btn =>
      btn.textContent.toLowerCase().includes(planId)
    ) || buttons[planId === 'yearly' ? 1 : 0];

    const originalText = clickedButton?.textContent;
    if (clickedButton) {
      clickedButton.disabled = true;
      clickedButton.textContent = 'Loading...';
      clickedButton.style.opacity = '0.7';
    }

    try {
      console.log('Creating checkout session for:', planId);

      // Call Edge Function to create Stripe checkout
      const result = await window.callEdgeFunction('stripe-checkout', {
        planId,
        successUrl: window.location.origin + '/premium-success.html',
        cancelUrl: window.location.origin + '/premium.html?subscription=cancelled',
      });

      console.log('Checkout result:', result);

      if (result.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.url;
      } else {
        throw new Error(result.error?.message || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);

      // Reset button state
      if (clickedButton) {
        clickedButton.disabled = false;
        clickedButton.textContent = originalText;
        clickedButton.style.opacity = '1';
      }

      // Show user-friendly error
      alert('Failed to start checkout: ' + (error.message || 'Please try again.'));
    }
  }

  /**
   * Format expiration date for display
   * @param {Date} date
   * @returns {string}
   */
  formatExpirationDate(date) {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Get the plan display name
   * @param {string} planId
   * @returns {string}
   */
  getPlanName(planId) {
    const plans = {
      monthly: 'TripPortier+ Monthly',
      yearly: 'TripPortier+ Yearly',
    };
    return plans[planId] || planId;
  }

  /**
   * Get platform display name
   * @param {string} platform
   * @returns {string}
   */
  getPlatformName(platform) {
    const platforms = {
      ios: 'iOS App',
      web: 'Website',
      android: 'Android App',
    };
    return platforms[platform] || platform;
  }
}

// Create global instance
window.subscriptionManager = new SubscriptionManager();

// Check for subscription cancelled URL param
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const subscriptionStatus = urlParams.get('subscription');

  if (subscriptionStatus === 'cancelled') {
    // Clean up URL silently
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});
