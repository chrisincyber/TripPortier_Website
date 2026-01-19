/**
 * TripPortier Authentication Service (Supabase)
 * Handles Supabase Auth for web - compatible with iOS app accounts
 */

class TripPortierAuth {
  constructor() {
    this.supabase = window.supabaseClient;
    this.user = null;
    this.userProfile = null;
    this.isLoading = true;
    this.listeners = [];

    // Listen to auth state changes
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      this.user = session?.user || null;
      this.isLoading = false;

      if (this.user) {
        // Fetch user profile from database
        await this.fetchUserProfile(this.user.id);
        // Check subscription status
        await this.checkSubscriptionStatus(this.user.id);
        // Update last login
        this.updateLastLogin(this.user.id);
      } else {
        this.userProfile = null;
      }

      this.notifyListeners();
    });

    // Check initial session
    this.initSession();
  }

  async initSession() {
    const { data: { session } } = await this.supabase.auth.getSession();
    if (session?.user) {
      this.user = session.user;
      await this.fetchUserProfile(this.user.id);
      await this.checkSubscriptionStatus(this.user.id);
    }
    this.isLoading = false;
    this.notifyListeners();
  }

  // Fetch user profile from database
  async fetchUserProfile(userId) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        this.userProfile = data;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  // Check subscription status
  async checkSubscriptionStatus(userId) {
    try {
      if (window.subscriptionManager) {
        const status = await window.subscriptionManager.getSubscriptionStatus(userId);
        if (status.isSubscribed) {
          const platform = status.subscription?.platform || 'unknown';
          console.log(`Active subscription found (platform: ${platform})`);
        }
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/trips.html',
          scopes: 'email profile'
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  // Sign in with Apple
  async signInWithApple() {
    try {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: window.location.origin + '/trips.html',
          scopes: 'email name'
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Apple sign-in error:', error);
      throw error;
    }
  }

  // Sign in with Email/Password
  async signInWithEmail(email, password) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  }

  // Sign up with Email/Password
  async signUpWithEmail(email, password, displayName) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName
          }
        }
      });

      if (error) throw error;

      // Create user profile in database
      if (data.user) {
        await this.createUserProfile(data.user.id, email, displayName, null);
      }

      return data.user;
    } catch (error) {
      console.error('Email sign-up error:', error);
      throw error;
    }
  }

  // Create user profile in database - matches iOS structure
  async createUserProfile(userId, email, displayName, photoURL) {
    // Detect preferences from browser locale
    const locale = navigator.language || 'en-US';
    const parts = locale.split('-');
    const regionCode = parts.length > 1 ? parts[1].toUpperCase() : 'US';

    // Countries that use Fahrenheit
    const fahrenheitCountries = ['US', 'LR', 'MM', 'BS', 'BZ', 'KY', 'PW'];
    const temperatureUnit = fahrenheitCountries.includes(regionCode) ? 'fahrenheit' : 'celsius';

    const userData = {
      id: userId,
      email: email || '',
      display_name: displayName || '',
      profile_image_url: photoURL || '',
      home_country: '',
      home_country_code: regionCode,
      temperature_unit: temperatureUnit,
      currency: 'USD',
      is_premium: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const { error } = await this.supabase
        .from('users')
        .upsert(userData);

      if (error) throw error;
      this.userProfile = userData;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  // Update last login timestamp
  async updateLastLogin(userId) {
    try {
      await this.supabase
        .from('users')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      console.warn('Could not update last login:', error);
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;

      this.user = null;
      this.userProfile = null;
      this.notifyListeners();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Password reset
  async sendPasswordResetEmail(email) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password.html'
      });

      if (error) throw error;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.user !== null;
  }

  // Check if user has premium subscription
  isPremium() {
    return window.subscriptionManager?.isSubscribed || false;
  }

  // Get subscription info
  getSubscription() {
    return window.subscriptionManager?.subscription || null;
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Get user profile
  getUserProfile() {
    return this.userProfile;
  }

  // Get display name (with fallbacks)
  getDisplayName() {
    if (this.userProfile && this.userProfile.display_name) {
      return this.userProfile.display_name;
    }
    if (this.user) {
      return this.user.user_metadata?.display_name ||
             this.user.email?.split('@')[0] ||
             'User';
    }
    return 'User';
  }

  // Get avatar URL (with fallback)
  getAvatarURL() {
    if (this.userProfile && this.userProfile.profile_image_url) {
      return this.userProfile.profile_image_url;
    }
    if (this.user && this.user.user_metadata?.avatar_url) {
      return this.user.user_metadata.avatar_url;
    }
    return null;
  }

  // Get access token for API calls
  async getAccessToken() {
    const { data: { session } } = await this.supabase.auth.getSession();
    return session?.access_token || null;
  }

  // Observer pattern for UI updates
  addListener(callback) {
    this.listeners.push(callback);
    // Immediately call with current state if not loading
    if (!this.isLoading) {
      callback(this.user, this.userProfile);
    }
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }

  notifyListeners() {
    this.listeners.forEach(cb => cb(this.user, this.userProfile));
  }
}

// Create global instance
window.tripPortierAuth = new TripPortierAuth();

// Legacy compatibility alias
window.auth = {
  onAuthStateChanged: (callback) => {
    window.tripPortierAuth.addListener((user) => callback(user));
  },
  currentUser: null
};

// Keep auth.currentUser in sync
window.tripPortierAuth.addListener((user) => {
  window.auth.currentUser = user;
});
