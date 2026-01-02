// Subscription Manager for TripPortier Website
// Handles cross-platform premium subscription with Stripe

class SubscriptionManager {
  constructor() {
    this.functions = window.firebaseFunctions;
    this.db = window.firebaseDb;
    this._subscription = null;
    this._isSubscribed = false;
  }

  /**
   * Get the current user's subscription status
   * @param {string} userId - Firebase user ID
   * @returns {Promise<{isSubscribed: boolean, subscription: object|null}>}
   */
  async getSubscriptionStatus(userId) {
    if (!userId) {
      return { isSubscribed: false, subscription: null };
    }

    try {
      const doc = await this.db.collection('subscriptions').doc(userId).get();

      if (!doc.exists) {
        this._subscription = null;
        this._isSubscribed = false;
        return { isSubscribed: false, subscription: null };
      }

      const data = doc.data();
      const expirationDate = data.expirationDate?.toDate();
      const isActive = data.status === 'active' && expirationDate && expirationDate > new Date();

      this._subscription = {
        ...data,
        expirationDate,
        startDate: data.startDate?.toDate(),
        cancelledAt: data.cancelledAt?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
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

    try {
      const createCheckout = this.functions.httpsCallable('createSubscriptionCheckout');

      const result = await createCheckout({
        planId,
        successUrl: window.location.origin + '/premium-success.html',
        cancelUrl: window.location.origin + '/premium.html?subscription=cancelled',
      });

      if (result.data.success && result.data.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
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
