/**
 * TripPortier Authentication Service
 * Handles Firebase Auth for web - compatible with iOS app accounts
 */

class TripPortierAuth {
  constructor() {
    this.auth = window.firebaseAuth;
    this.db = window.firebaseDb;
    this.user = null;
    this.userProfile = null;
    this.isLoading = true;
    this.listeners = [];

    // Listen to auth state changes
    this.auth.onAuthStateChanged(async (user) => {
      this.user = user;
      this.isLoading = false;

      if (user) {
        // Fetch user profile from Firestore
        await this.fetchUserProfile(user.uid);
        // Update last login
        this.updateLastLogin(user.uid);
      } else {
        this.userProfile = null;
      }

      this.notifyListeners();
    });
  }

  // Fetch user profile from Firestore
  async fetchUserProfile(userId) {
    try {
      const doc = await this.db.collection('users').doc(userId).get();
      if (doc.exists) {
        this.userProfile = doc.data();
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  // Sign in with Google
  async signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');

    try {
      const result = await this.auth.signInWithPopup(provider);

      // Check if this is a new user
      if (result.additionalUserInfo && result.additionalUserInfo.isNewUser) {
        await this.createUserProfile(
          result.user.uid,
          result.user.email,
          result.user.displayName,
          result.user.photoURL
        );
      }

      return result.user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  // Sign in with Apple
  async signInWithApple() {
    const provider = new firebase.auth.OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');

    try {
      const result = await this.auth.signInWithPopup(provider);

      // Check if this is a new user
      if (result.additionalUserInfo && result.additionalUserInfo.isNewUser) {
        // Apple may not provide name after first sign-in
        const displayName = result.user.displayName ||
          (result.additionalUserInfo.profile ?
            `${result.additionalUserInfo.profile.firstName || ''} ${result.additionalUserInfo.profile.lastName || ''}`.trim() :
            '');

        await this.createUserProfile(
          result.user.uid,
          result.user.email,
          displayName,
          result.user.photoURL
        );
      }

      return result.user;
    } catch (error) {
      console.error('Apple sign-in error:', error);
      throw error;
    }
  }

  // Sign in with Email/Password
  async signInWithEmail(email, password) {
    try {
      const result = await this.auth.signInWithEmailAndPassword(email, password);
      return result.user;
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  }

  // Sign up with Email/Password
  async signUpWithEmail(email, password, displayName) {
    try {
      const result = await this.auth.createUserWithEmailAndPassword(email, password);

      // Update display name in Firebase Auth
      await result.user.updateProfile({ displayName });

      // Create Firestore profile (matching iOS structure)
      await this.createUserProfile(
        result.user.uid,
        email,
        displayName,
        null
      );

      return result.user;
    } catch (error) {
      console.error('Email sign-up error:', error);
      throw error;
    }
  }

  // Create user profile in Firestore - MUST match iOS AuthenticationService.swift structure
  async createUserProfile(userId, email, displayName, photoURL) {
    const now = firebase.firestore.Timestamp.now();

    // Detect preferences from browser locale (matching iOS behavior)
    const locale = navigator.language || 'en-US';
    const parts = locale.split('-');
    const regionCode = parts.length > 1 ? parts[1].toUpperCase() : 'US';

    // Countries that use Fahrenheit
    const fahrenheitCountries = ['US', 'LR', 'MM', 'BS', 'BZ', 'KY', 'PW'];
    const temperatureUnit = fahrenheitCountries.includes(regionCode) ? 'fahrenheit' : 'celsius';

    const userData = {
      uid: userId,
      email: email || '',
      displayName: displayName || '',
      photoURL: photoURL || '',
      username: '',
      profileImageURL: photoURL || '',
      homeCountry: '',
      homeCountryCode: regionCode,
      temperatureUnit: temperatureUnit,
      powerOutletType: '',
      currency: '',
      memberSince: now,
      shareAvatar: true,
      shareStats: true,
      followerCount: 0,
      followingCount: 0,
      tripsCount: 0,
      countriesVisited: 0,
      daysTraveled: 0,
      createdAt: now,
      lastLoginAt: now,
      updatedAt: now,
      nationalities: []
    };

    try {
      await this.db.collection('users').doc(userId).set(userData);
      this.userProfile = userData;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  // Update last login timestamp
  async updateLastLogin(userId) {
    try {
      await this.db.collection('users').doc(userId).update({
        lastLoginAt: firebase.firestore.Timestamp.now()
      });
    } catch (error) {
      // Silently fail - user might not have a profile yet
      console.warn('Could not update last login:', error);
    }
  }

  // Sign out
  async signOut() {
    try {
      await this.auth.signOut();
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
      await this.auth.sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.user !== null;
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
    if (this.userProfile && this.userProfile.displayName) {
      return this.userProfile.displayName;
    }
    if (this.user) {
      return this.user.displayName || this.user.email.split('@')[0];
    }
    return 'User';
  }

  // Get avatar URL (with fallback)
  getAvatarURL() {
    if (this.userProfile && this.userProfile.profileImageURL) {
      return this.userProfile.profileImageURL;
    }
    if (this.user && this.user.photoURL) {
      return this.user.photoURL;
    }
    return null;
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
