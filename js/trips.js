/**
 * TripPortier Trips Manager
 * Fetches and displays trips from Firebase Firestore
 */

class TripsManager {
  constructor() {
    this.trips = [];
    this.flights = [];
    this.imageCache = new Map();
    this.currentUser = null;
    this.currentView = 'trips'; // 'trips' or 'flights'

    // User preferences for AI personalization
    this.userPreferences = {
      interests: [],
      dietaryPreferences: [],
      travelStyle: 'balanced',
      budgetPreference: 'medium'
    };

    // Travel styles (matches iOS app - 27 categories)
    this.travelStyles = [
      { id: 'accessibility', name: 'Accessibility', emoji: '♿' },
      { id: 'adventure', name: 'Adventure', emoji: '🏔️' },
      { id: 'arts', name: 'Arts', emoji: '🎨' },
      { id: 'beaches', name: 'Beaches', emoji: '🏖️' },
      { id: 'budget', name: 'Budget Friendly', emoji: '💰' },
      { id: 'canoeing', name: 'Canoeing', emoji: '🛶' },
      { id: 'childFriendly', name: 'Child Friendly', emoji: '👶' },
      { id: 'cruise', name: 'Cruise', emoji: '🚢' },
      { id: 'cycling', name: 'Cycling', emoji: '🚴' },
      { id: 'education', name: 'Education', emoji: '📚' },
      { id: 'family', name: 'Family', emoji: '👨‍👩‍👧‍👦' },
      { id: 'fishing', name: 'Fishing', emoji: '🎣' },
      { id: 'food', name: 'Food', emoji: '🍽️' },
      { id: 'gardens', name: 'Gardens & Forests', emoji: '🌳' },
      { id: 'health', name: 'Health & Wellness', emoji: '🧘' },
      { id: 'hiddenGems', name: 'Hidden Gems', emoji: '💎' },
      { id: 'hiking', name: 'Hiking', emoji: '🥾' },
      { id: 'history', name: 'History', emoji: '🏛️' },
      { id: 'honeymoon', name: 'Honeymoon', emoji: '💕' },
      { id: 'kayaking', name: 'Kayaking', emoji: '🚣' },
      { id: 'lgbtq', name: 'LGBTQ+ Friendly', emoji: '🏳️‍🌈' },
      { id: 'luxury', name: 'Luxury', emoji: '✨' },
      { id: 'mountain', name: 'Mountain', emoji: '⛰️' },
      { id: 'nightlife', name: 'Nightlife', emoji: '🌙' },
      { id: 'religious', name: 'Religious', emoji: '🕌' },
      { id: 'sightseeing', name: 'Sightseeing', emoji: '📸' },
      { id: 'sports', name: 'Sports', emoji: '⚽' }
    ];

    // Trip creation state
    this.newTrip = {
      destination: '',
      destinationDisplay: '',
      latitude: null,
      longitude: null,
      countryCode: null,    // ISO country code for eSIM/international features
      startDate: null,
      endDate: null,
      tripLength: 7,        // For wishlist trips (days)
      isSomedayTrip: false, // true if no specific dates
      useAI: false,         // AI generation opted in
      travelStyles: [],     // Selected style IDs
      travelCompanion: null, // 'solo' | 'partner' | 'group'
      aiItinerary: [],      // Generated itinerary items
      context: null,        // Legacy context (derived from travelStyles)
      name: ''
    };
    this.currentStep = 1;
    this.createdTripId = null;
    this.isPremium = false; // Will be checked on auth

    // DOM elements
    this.loadingEl = document.getElementById('trips-loading');
    this.notSignedInEl = document.getElementById('trips-not-signed-in');
    this.emptyEl = document.getElementById('trips-empty');
    this.containerEl = document.getElementById('trips-container');
    this.activeTripSection = document.getElementById('active-trip-section');
    this.upcomingTripsSection = document.getElementById('upcoming-trips-section');
    this.wishlistTripsSection = document.getElementById('wishlist-trips-section');
    this.pastTripsSection = document.getElementById('past-trips-section');
    this.activeTripGrid = document.getElementById('active-trip-grid');
    this.upcomingTripsGrid = document.getElementById('upcoming-trips-grid');
    this.wishlistTripsGrid = document.getElementById('wishlist-trips-grid');
    this.pastTripsGrid = document.getElementById('past-trips-grid');

    // Flights elements
    this.flightsContainerEl = document.getElementById('flights-container');
    this.flightsEmptyEl = document.getElementById('flights-empty');
    this.upcomingFlightsSection = document.getElementById('upcoming-flights-section');
    this.pastFlightsSection = document.getElementById('past-flights-section');
    this.upcomingFlightsGrid = document.getElementById('upcoming-flights-grid');
    this.pastFlightsGrid = document.getElementById('past-flights-grid');

    // View switcher and controls
    this.tripsControlsEl = document.getElementById('trips-controls');
    this.viewSwitcherEl = document.getElementById('view-switcher');

    // Create trip elements
    this.createTripBtn = document.getElementById('create-trip-btn');
    this.createTripModal = document.getElementById('create-trip-modal');

    // Add flight elements
    this.addFlightBtn = document.getElementById('add-flight-btn');
    this.addFlightModal = document.getElementById('add-flight-modal');

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
        this.handleAuthChange(user);
      });
    }

    // Setup create trip functionality
    this.setupCreateTrip();

    // Setup view switcher
    this.setupViewSwitcher();

    // Setup beta badge
    this.setupBetaBadge();

    // Setup add flight functionality
    this.setupAddFlight();
  }

  async handleAuthChange(user) {
    this.currentUser = user;

    if (!user) {
      this.showNotSignedIn();
      // Hide controls when not signed in
      if (this.tripsControlsEl) {
        this.tripsControlsEl.style.display = 'none';
      }
      this.isPremium = false;
      return;
    }

    // Show controls
    if (this.tripsControlsEl) {
      this.tripsControlsEl.style.display = 'flex';
    }

    // Show appropriate button based on current view
    if (this.currentView === 'trips') {
      if (this.createTripBtn) this.createTripBtn.style.display = 'inline-flex';
      if (this.addFlightBtn) this.addFlightBtn.style.display = 'none';
    } else {
      if (this.createTripBtn) this.createTripBtn.style.display = 'none';
      if (this.addFlightBtn) this.addFlightBtn.style.display = 'inline-flex';
    }

    this.showLoading();

    try {
      // Check premium status, load user preferences, and load trips/flights
      await Promise.all([
        this.checkPremiumStatus(),
        this.loadUserPreferences(user.uid),
        this.loadTrips(user.uid),
        this.loadFlights(user.uid)
      ]);

      // Render based on current view
      if (this.currentView === 'trips') {
        this.renderTrips();
      } else {
        this.renderFlights();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      this.showEmpty();
    }
  }

  async checkPremiumStatus() {
    if (!this.currentUser) {
      this.isPremium = false;
      return;
    }

    try {
      if (window.subscriptionManager) {
        const { isSubscribed } = await window.subscriptionManager.getSubscriptionStatus(this.currentUser.uid);
        this.isPremium = isSubscribed;
      } else {
        // Fallback: check Firestore directly
        const db = firebase.firestore();
        const subDoc = await db.collection('subscriptions').doc(this.currentUser.uid).get();
        if (subDoc.exists) {
          const data = subDoc.data();
          const expirationDate = data.expirationDate?.toDate();
          this.isPremium = data.status === 'active' && expirationDate && expirationDate > new Date();
        } else {
          this.isPremium = false;
        }
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
      this.isPremium = false;
    }
  }

  async loadUserPreferences(userId) {
    try {
      const db = firebase.firestore();
      const userDoc = await db.collection('users').doc(userId).get();

      if (userDoc.exists) {
        const userData = userDoc.data();

        // Load interests (for activity recommendations)
        if (userData.interests && Array.isArray(userData.interests)) {
          this.userPreferences.interests = userData.interests;
        }

        // Load dietary preferences (for restaurant/food recommendations)
        if (userData.dietaryPreferences && Array.isArray(userData.dietaryPreferences)) {
          this.userPreferences.dietaryPreferences = userData.dietaryPreferences;
        }

        // Load travel style preference
        if (userData.travelStyle) {
          this.userPreferences.travelStyle = userData.travelStyle;
        }

        // Load budget preference
        if (userData.budgetPreference) {
          this.userPreferences.budgetPreference = userData.budgetPreference;
        }

        // User preferences loaded for AI personalization
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
      // Continue with defaults - non-critical error
    }
  }

  async loadTrips(userId) {
    const db = firebase.firestore();

    // Fetch trips from user's collection
    const snapshot = await db
      .collection('users')
      .doc(userId)
      .collection('trips')
      .get();

    this.trips = [];

    snapshot.forEach(doc => {
      const data = doc.data();

      // Parse dates - handle both Timestamp and string formats
      const startDate = this.parseDate(data.startDate);
      const endDate = this.parseDate(data.endDate);

      if (!startDate || !endDate) {
        console.warn('Trip missing valid dates:', doc.id);
        return;
      }

      this.trips.push({
        id: doc.id,
        name: data.name || 'Untitled Trip',
        destination: data.destination || '',
        startDate: startDate,
        endDate: endDate,
        context: data.context || null,
        customImageURL: data.customImageURL || null,
        isArchived: data.isArchived || false,
        isSomedayTrip: data.isSomedayTrip || false,
        latitude: data.latitude || null,
        longitude: data.longitude || null
      });
    });

    // Sort by start date (newest first for upcoming, oldest first for past)
    this.trips.sort((a, b) => a.startDate - b.startDate);

    // Log loaded trips for debugging
    console.log(`Loaded ${this.trips.length} trips from Firebase:`, this.trips.map(t => ({
      id: t.id,
      name: t.name,
      destination: t.destination,
      startDate: t.startDate.toLocaleDateString(),
      endDate: t.endDate.toLocaleDateString()
    })));
  }

  parseDate(value) {
    if (!value) return null;

    // Firebase Timestamp
    if (value.toDate && typeof value.toDate === 'function') {
      return value.toDate();
    }

    // ISO string or other date format
    if (typeof value === 'string') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    }

    // Already a Date
    if (value instanceof Date) {
      return value;
    }

    // Timestamp seconds
    if (typeof value === 'number') {
      return new Date(value * 1000);
    }

    // Object with seconds (Firestore Timestamp-like)
    if (value.seconds) {
      return new Date(value.seconds * 1000);
    }

    return null;
  }

  categorizeTrips() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const active = [];
    const upcoming = [];
    const wishlist = [];
    const past = [];

    for (const trip of this.trips) {
      // Handle wishlist/someday trips
      if (trip.isSomedayTrip) {
        wishlist.push(trip);
        continue;
      }

      const tripStart = new Date(trip.startDate.getFullYear(), trip.startDate.getMonth(), trip.startDate.getDate());
      const tripEnd = new Date(trip.endDate.getFullYear(), trip.endDate.getMonth(), trip.endDate.getDate());

      if (tripStart <= today && tripEnd >= today) {
        // Trip is currently active
        active.push(trip);
      } else if (tripStart > today) {
        // Trip is in the future
        upcoming.push(trip);
      } else {
        // Trip is in the past
        past.push(trip);
      }
    }

    // Sort upcoming by start date (soonest first)
    upcoming.sort((a, b) => a.startDate - b.startDate);

    // Sort wishlist by creation date (newest first)
    wishlist.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    // Sort past by end date (most recent first)
    past.sort((a, b) => b.endDate - a.endDate);

    return { active, upcoming, wishlist, past };
  }

  renderTrips() {
    const { active, upcoming, wishlist, past } = this.categorizeTrips();

    // If no trips at all, show empty state
    if (active.length === 0 && upcoming.length === 0 && wishlist.length === 0 && past.length === 0) {
      this.showEmpty();
      return;
    }

    // Clear grids
    this.activeTripGrid.innerHTML = '';
    this.upcomingTripsGrid.innerHTML = '';
    this.wishlistTripsGrid.innerHTML = '';
    this.pastTripsGrid.innerHTML = '';

    // Render active trips
    if (active.length > 0) {
      this.activeTripSection.style.display = 'block';
      active.forEach(trip => {
        const card = this.createTripCard(trip, 'active');
        this.activeTripGrid.appendChild(card);
      });
    } else {
      this.activeTripSection.style.display = 'none';
    }

    // Render upcoming trips
    if (upcoming.length > 0) {
      this.upcomingTripsSection.style.display = 'block';
      upcoming.forEach(trip => {
        const card = this.createTripCard(trip, 'upcoming');
        this.upcomingTripsGrid.appendChild(card);
      });
    } else {
      this.upcomingTripsSection.style.display = 'none';
    }

    // Render wishlist trips
    if (wishlist.length > 0) {
      this.wishlistTripsSection.style.display = 'block';
      wishlist.forEach(trip => {
        const card = this.createTripCard(trip, 'wishlist');
        this.wishlistTripsGrid.appendChild(card);
      });
    } else {
      this.wishlistTripsSection.style.display = 'none';
    }

    // Render past trips
    if (past.length > 0) {
      this.pastTripsSection.style.display = 'block';
      past.forEach(trip => {
        const card = this.createTripCard(trip, 'past');
        this.pastTripsGrid.appendChild(card);
      });
    } else {
      this.pastTripsSection.style.display = 'none';
    }

    this.showContainer();
  }

  createTripCard(trip, type) {
    const card = document.createElement('div');
    card.className = `trip-card trip-card-${type}`;
    card.dataset.tripId = trip.id;

    // Handle wishlist trips differently
    if (type === 'wishlist') {
      const tripLength = trip.tripLength || 7;
      const contextIcon = this.getContextIcon(trip.context);
      const contextDisplay = trip.context ? trip.context.charAt(0).toUpperCase() + trip.context.slice(1) : '';

      card.innerHTML = `
        <div class="trip-card-gradient"></div>
        <div class="trip-card-overlay"></div>

        <div class="trip-card-badges">
          <div class="trip-card-wishlist-badge">
            <span>💭</span>
            Wishlist
          </div>
        </div>

        <div class="trip-card-content">
          <h3 class="trip-card-name">${this.escapeHtml(trip.name)}</h3>

          <div class="trip-card-info">
            <span>${tripLength} day${tripLength !== 1 ? 's' : ''}</span>
            <span class="trip-card-info-dot">&bull;</span>
            <span>No dates set</span>
          </div>

          ${trip.context ? `
            <div class="trip-card-context">
              <span class="trip-card-context-icon">${contextIcon}</span>
              <span>${contextDisplay}</span>
            </div>
          ` : ''}
        </div>
      `;

      // Load background image
      this.loadBackgroundImage(card, trip);

      // Add click handler to navigate to trip detail
      card.addEventListener('click', () => {
        window.location.href = `/trip-detail.html?id=${trip.id}`;
      });

      return card;
    }

    // Calculate days info for regular trips
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tripStart = new Date(trip.startDate.getFullYear(), trip.startDate.getMonth(), trip.startDate.getDate());
    const tripEnd = new Date(trip.endDate.getFullYear(), trip.endDate.getMonth(), trip.endDate.getDate());

    // Day counter for active trips
    let dayInfo = '';
    if (type === 'active') {
      const daysSinceStart = Math.floor((today - tripStart) / (1000 * 60 * 60 * 24)) + 1;
      const totalDays = Math.floor((tripEnd - tripStart) / (1000 * 60 * 60 * 24)) + 1;
      dayInfo = `Day ${daysSinceStart} of ${totalDays}`;
    }

    // Countdown for upcoming trips
    let countdownText = '';
    if (type === 'upcoming') {
      const daysUntil = Math.ceil((tripStart - today) / (1000 * 60 * 60 * 24));
      if (daysUntil === 0) {
        countdownText = 'Today';
      } else if (daysUntil === 1) {
        countdownText = 'Tomorrow';
      } else if (daysUntil < 7) {
        countdownText = `In ${daysUntil} days`;
      } else if (daysUntil < 30) {
        const weeks = Math.floor(daysUntil / 7);
        countdownText = weeks === 1 ? 'In 1 week' : `In ${weeks} weeks`;
      } else {
        const months = Math.floor(daysUntil / 30);
        countdownText = months === 1 ? 'In 1 month' : `In ${months} months`;
      }
    }

    // Format dates
    const dateOptions = { month: 'short', day: 'numeric' };
    const startStr = trip.startDate.toLocaleDateString('en-US', dateOptions);
    const endStr = trip.endDate.toLocaleDateString('en-US', dateOptions);
    const yearOptions = { year: 'numeric' };
    const yearStr = trip.endDate.toLocaleDateString('en-US', yearOptions);

    // Context icon
    const contextIcon = this.getContextIcon(trip.context);
    const contextDisplay = trip.context ? trip.context.charAt(0).toUpperCase() + trip.context.slice(1) : '';

    // Build card HTML
    card.innerHTML = `
      <div class="trip-card-gradient"></div>
      <div class="trip-card-overlay"></div>

      ${type === 'active' ? `
        <div class="trip-card-badges">
          <div class="trip-card-live-badge">
            <span class="trip-card-live-dot"></span>
            Active
          </div>
        </div>
      ` : ''}

      <div class="trip-card-content">
        <h3 class="trip-card-name">${this.escapeHtml(trip.name)}</h3>

        ${type === 'active' ? `
          <div class="trip-card-day-counter">${dayInfo}</div>
        ` : ''}

        <div class="trip-card-info">
          <span>${startStr} - ${endStr}, ${yearStr}</span>
          ${type === 'upcoming' && countdownText ? `
            <span class="trip-card-info-dot">&bull;</span>
            <span>${countdownText}</span>
          ` : ''}
        </div>

        ${trip.context ? `
          <div class="trip-card-context">
            <span class="trip-card-context-icon">${contextIcon}</span>
            <span>${contextDisplay}</span>
          </div>
        ` : ''}
      </div>
    `;

    // Load background image
    this.loadBackgroundImage(card, trip);

    // Add click handler to navigate to trip detail
    card.addEventListener('click', () => {
      window.location.href = `/trip-detail.html?id=${trip.id}`;
    });

    return card;
  }

  async loadBackgroundImage(card, trip) {
    // Try custom image first
    if (trip.customImageURL) {
      const img = new Image();
      img.onload = () => {
        img.className = 'trip-card-image';
        const gradient = card.querySelector('.trip-card-gradient');
        if (gradient) gradient.remove();
        card.insertBefore(img, card.firstChild);
      };
      img.onerror = () => {
        // Fall back to Pexels
        this.loadPexelsImage(card, trip.destination || trip.name);
      };
      img.src = trip.customImageURL;
      return;
    }

    // Try Pexels
    await this.loadPexelsImage(card, trip.destination || trip.name);
  }

  async loadPexelsImage(card, query) {
    // Check cache first
    if (this.imageCache.has(query)) {
      this.setCardImage(card, this.imageCache.get(query));
      return;
    }

    try {
      // Use Firebase Function to fetch Pexels image (keeps API key secure)
      const searchQuery = `${query} travel landscape`;
      const getPexelsImage = firebase.functions().httpsCallable('getPexelsImage');
      const result = await getPexelsImage({ query: searchQuery });

      if (result.data.success && result.data.image) {
        // Use large2x for better quality (same as iOS app)
        const imageUrl = result.data.image.src.large2x || result.data.image.src.large;
        this.imageCache.set(query, imageUrl);
        this.setCardImage(card, imageUrl);
      }
    } catch (error) {
      console.warn('Pexels API error:', error);
    }
  }

  setCardImage(card, imageUrl) {
    const img = new Image();
    img.onload = () => {
      img.className = 'trip-card-image';
      const gradient = card.querySelector('.trip-card-gradient');
      if (gradient) gradient.remove();
      card.insertBefore(img, card.firstChild);
    };
    img.src = imageUrl;
  }

  getContextIcon(context) {
    const icons = {
      city: '🏙️',
      beach: '🏖️',
      business: '💼',
      winter: '❄️',
      family: '👨‍👩‍👧‍👦',
      adventure: '🏔️',
      generic: '🗺️'
    };
    return icons[context] || icons.generic;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // UI State Methods
  showLoading() {
    this.loadingEl.style.display = 'flex';
    this.notSignedInEl.style.display = 'none';
    this.emptyEl.style.display = 'none';
    this.containerEl.style.display = 'none';
  }

  showNotSignedIn() {
    this.loadingEl.style.display = 'none';
    this.notSignedInEl.style.display = 'flex';
    this.emptyEl.style.display = 'none';
    this.containerEl.style.display = 'none';
  }

  showEmpty() {
    this.loadingEl.style.display = 'none';
    this.notSignedInEl.style.display = 'none';
    this.emptyEl.style.display = 'flex';
    this.containerEl.style.display = 'none';
  }

  showContainer() {
    this.loadingEl.style.display = 'none';
    this.notSignedInEl.style.display = 'none';
    this.emptyEl.style.display = 'none';
    this.containerEl.style.display = 'block';
  }

  // ============================================
  // Create Trip Functionality
  // ============================================

  setupCreateTrip() {
    if (!this.createTripBtn || !this.createTripModal) return;

    // Button click opens modal
    this.createTripBtn.addEventListener('click', () => this.openCreateTripModal());

    // Close button
    const closeBtn = document.getElementById('create-trip-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeCreateTripModal());
    }

    // Click outside to close
    this.createTripModal.addEventListener('click', (e) => {
      if (e.target === this.createTripModal) {
        this.closeCreateTripModal();
      }
    });

    // Setup step navigation
    this.setupStepNavigation();

    // Setup destination input
    this.setupDestinationInput();

    // Setup date inputs
    this.setupDateInputs();

    // Setup context selection
    this.setupContextSelection();

    // Setup name input
    this.setupNameInput();
  }

  openCreateTripModal() {
    // Reset state
    this.resetCreateTripState();
    this.currentStep = 1;
    this.showStep('step-destination');

    // Populate travel styles grid
    this.populateTravelStyles();

    // Show modal
    this.createTripModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus destination input
    setTimeout(() => {
      const destinationInput = document.getElementById('destination-input');
      if (destinationInput) destinationInput.focus();
    }, 300);
  }

  populateTravelStyles() {
    const grid = document.getElementById('travel-styles-grid');
    if (!grid) return;

    grid.innerHTML = this.travelStyles.map(style => `
      <button class="travel-style-option" data-style="${style.id}">
        <span class="travel-style-emoji">${style.emoji}</span>
        <span class="travel-style-name">${style.name}</span>
      </button>
    `).join('');

    // Add click handlers
    grid.querySelectorAll('.travel-style-option').forEach(option => {
      option.addEventListener('click', () => {
        option.classList.toggle('selected');
        const styleId = option.dataset.style;

        if (option.classList.contains('selected')) {
          if (!this.newTrip.travelStyles.includes(styleId)) {
            this.newTrip.travelStyles.push(styleId);
          }
        } else {
          this.newTrip.travelStyles = this.newTrip.travelStyles.filter(s => s !== styleId);
        }

        // Enable continue button if at least one style selected
        const nextBtn = document.getElementById('next-to-companion');
        if (nextBtn) {
          nextBtn.disabled = this.newTrip.travelStyles.length === 0;
        }
      });
    });
  }

  closeCreateTripModal() {
    this.createTripModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  resetCreateTripState() {
    this.newTrip = {
      destination: '',
      destinationDisplay: '',
      latitude: null,
      longitude: null,
      countryCode: null,
      startDate: null,
      endDate: null,
      tripLength: 7,
      isSomedayTrip: false,
      useAI: false,
      travelStyles: [],
      travelCompanion: null,
      aiItinerary: [],
      context: null,
      name: ''
    };
    this.createdTripId = null;

    // Reset inputs
    const destinationInput = document.getElementById('destination-input');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const nameInput = document.getElementById('trip-name-input');
    const somedayCheckbox = document.getElementById('someday-checkbox');
    const tripLengthInput = document.getElementById('trip-length');

    if (destinationInput) destinationInput.value = '';
    if (startDateInput) startDateInput.value = '';
    if (endDateInput) endDateInput.value = '';
    if (nameInput) nameInput.value = '';
    if (somedayCheckbox) somedayCheckbox.checked = false;
    if (tripLengthInput) tripLengthInput.value = '7';

    // Show/hide date containers
    const specificDatesContainer = document.getElementById('specific-dates-container');
    const tripLengthContainer = document.getElementById('trip-length-container');
    if (specificDatesContainer) specificDatesContainer.style.display = 'flex';
    if (tripLengthContainer) tripLengthContainer.style.display = 'none';

    // Reset travel styles selection
    document.querySelectorAll('.travel-style-option').forEach(opt => {
      opt.classList.remove('selected');
    });

    // Reset companion selection
    document.querySelectorAll('.companion-option').forEach(opt => {
      opt.classList.remove('selected');
    });

    // Reset AI loading and content
    const aiLoading = document.getElementById('ai-loading');
    const aiContent = document.getElementById('ai-itinerary-content');
    if (aiLoading) aiLoading.style.display = 'flex';
    if (aiContent) aiContent.style.display = 'none';

    // Reset buttons
    const nextToDates = document.getElementById('next-to-dates');
    const nextToAiPrompt = document.getElementById('next-to-ai-prompt');
    const nextToCompanion = document.getElementById('next-to-companion');
    const submitBtn = document.getElementById('create-trip-submit');

    if (nextToDates) nextToDates.disabled = true;
    if (nextToAiPrompt) nextToAiPrompt.disabled = true;
    if (nextToCompanion) nextToCompanion.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
  }

  showStep(stepId) {
    // Hide all steps
    document.querySelectorAll('.create-trip-step').forEach(step => {
      step.style.display = 'none';
    });

    // Show target step
    const targetStep = document.getElementById(stepId);
    if (targetStep) {
      targetStep.style.display = 'block';
    }

    // Calculate progress based on flow
    const stepProgress = this.calculateStepProgress(stepId);
    this.currentStep = stepProgress.step;
    this.updateProgressBar(stepProgress.total);
  }

  calculateStepProgress(stepId) {
    // Define step order based on whether AI is being used
    if (this.newTrip.useAI) {
      // AI flow: destination -> dates -> ai-prompt -> styles -> companion -> ai-review -> name -> success
      const aiSteps = ['step-destination', 'step-dates', 'step-ai-prompt', 'step-styles', 'step-companion', 'step-ai-review', 'step-name', 'step-success'];
      const index = aiSteps.indexOf(stepId);
      return { step: index + 1, total: 7 }; // 7 steps before success
    } else {
      // Non-AI flow: destination -> dates -> ai-prompt -> name -> success
      const regularSteps = ['step-destination', 'step-dates', 'step-ai-prompt', 'step-name', 'step-success'];
      const index = regularSteps.indexOf(stepId);
      return { step: index + 1, total: 4 }; // 4 steps before success
    }
  }

  updateProgressBar(totalSteps = 4) {
    const progressBar = document.getElementById('create-trip-progress-bar');
    if (progressBar) {
      const percentage = (this.currentStep / totalSteps) * 100;
      progressBar.style.width = `${Math.min(percentage, 100)}%`;
    }
  }

  setupStepNavigation() {
    // Step 1 (Destination) -> Step 2 (Dates)
    const nextToDates = document.getElementById('next-to-dates');
    if (nextToDates) {
      nextToDates.addEventListener('click', () => this.showStep('step-dates'));
    }

    // Step 2 (Dates) -> Step 1 (Destination)
    const backToDestination = document.getElementById('back-to-destination');
    if (backToDestination) {
      backToDestination.addEventListener('click', () => this.showStep('step-destination'));
    }

    // Step 2 (Dates) -> Step 3 (AI Prompt)
    const nextToAiPrompt = document.getElementById('next-to-ai-prompt');
    if (nextToAiPrompt) {
      nextToAiPrompt.addEventListener('click', () => this.showStep('step-ai-prompt'));
    }

    // Step 3 (AI Prompt) -> Step 2 (Dates)
    const backToDates = document.getElementById('back-to-dates');
    if (backToDates) {
      backToDates.addEventListener('click', () => this.showStep('step-dates'));
    }

    // AI Prompt: Yes - go to styles
    const aiYes = document.getElementById('ai-yes');
    if (aiYes) {
      aiYes.addEventListener('click', () => {
        // Check premium status
        if (!this.isPremium) {
          // Show upgrade prompt
          window.location.href = '/premium.html?feature=ai-planner';
          return;
        }
        this.newTrip.useAI = true;
        this.showStep('step-styles');
      });
    }

    // AI Prompt: No - go directly to name
    const aiNo = document.getElementById('ai-no');
    if (aiNo) {
      aiNo.addEventListener('click', () => {
        this.newTrip.useAI = false;
        this.generateSuggestedNames();
        this.showStep('step-name');
      });
    }

    // Step 4 (Styles) -> Step 3 (AI Prompt)
    const backToAiPrompt = document.getElementById('back-to-ai-prompt');
    if (backToAiPrompt) {
      backToAiPrompt.addEventListener('click', () => this.showStep('step-ai-prompt'));
    }

    // Step 4 (Styles) -> Step 5 (Companion)
    const nextToCompanion = document.getElementById('next-to-companion');
    if (nextToCompanion) {
      nextToCompanion.addEventListener('click', () => this.showStep('step-companion'));
    }

    // Step 5 (Companion) -> Step 4 (Styles)
    const backToStyles = document.getElementById('back-to-styles');
    if (backToStyles) {
      backToStyles.addEventListener('click', () => this.showStep('step-styles'));
    }

    // Companion selection -> AI Review
    const companionOptions = document.getElementById('companion-options');
    if (companionOptions) {
      companionOptions.querySelectorAll('.companion-option').forEach(option => {
        option.addEventListener('click', () => {
          // Deselect all
          companionOptions.querySelectorAll('.companion-option').forEach(opt => {
            opt.classList.remove('selected');
          });
          // Select this one
          option.classList.add('selected');
          this.newTrip.travelCompanion = option.dataset.companion;

          // Show AI review and generate itinerary
          this.showStep('step-ai-review');
          this.generateAIItinerary();
        });
      });
    }

    // Step 5b (AI Review) -> Step 5 (Companion)
    const backToCompanion = document.getElementById('back-to-companion');
    if (backToCompanion) {
      backToCompanion.addEventListener('click', () => this.showStep('step-companion'));
    }

    // Step 5b (AI Review) -> Step 6 (Name)
    const nextToNameFromAi = document.getElementById('next-to-name-from-ai');
    if (nextToNameFromAi) {
      nextToNameFromAi.addEventListener('click', () => {
        this.generateSuggestedNames();
        this.showStep('step-name');
      });
    }

    // Regenerate itinerary
    const regenerateBtn = document.getElementById('regenerate-itinerary');
    if (regenerateBtn) {
      regenerateBtn.addEventListener('click', () => this.generateAIItinerary());
    }

    // Step 6 (Name) -> Back (dynamic based on AI flow)
    const backFromName = document.getElementById('back-from-name');
    if (backFromName) {
      backFromName.addEventListener('click', () => {
        if (this.newTrip.useAI) {
          this.showStep('step-ai-review');
        } else {
          this.showStep('step-ai-prompt');
        }
      });
    }

    // Submit
    const submitBtn = document.getElementById('create-trip-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.createTrip());
    }

    // View trip after success
    const viewTripBtn = document.getElementById('view-trip-btn');
    if (viewTripBtn) {
      viewTripBtn.addEventListener('click', () => {
        if (this.createdTripId) {
          window.location.href = `/trip-detail.html?id=${this.createdTripId}`;
        } else {
          this.closeCreateTripModal();
        }
      });
    }
  }

  setupDestinationInput() {
    const input = document.getElementById('destination-input');
    const suggestions = document.getElementById('destination-suggestions');
    const nextBtn = document.getElementById('next-to-dates');

    if (!input || !suggestions) return;

    let debounceTimer;

    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      const query = input.value.trim();

      if (query.length < 2) {
        suggestions.classList.remove('active');
        if (nextBtn) nextBtn.disabled = true;
        return;
      }

      debounceTimer = setTimeout(() => {
        this.searchDestinations(query);
      }, 300);
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !suggestions.contains(e.target)) {
        suggestions.classList.remove('active');
      }
    });
  }

  async searchDestinations(query) {
    const suggestions = document.getElementById('destination-suggestions');
    if (!suggestions) return;

    // Use a simple list of popular destinations + geocoding (with ISO country codes)
    const popularDestinations = [
      { name: 'Paris', country: 'France', code: 'FR', lat: 48.8566, lng: 2.3522 },
      { name: 'Tokyo', country: 'Japan', code: 'JP', lat: 35.6762, lng: 139.6503 },
      { name: 'New York', country: 'United States', code: 'US', lat: 40.7128, lng: -74.0060 },
      { name: 'London', country: 'United Kingdom', code: 'GB', lat: 51.5074, lng: -0.1278 },
      { name: 'Barcelona', country: 'Spain', code: 'ES', lat: 41.3851, lng: 2.1734 },
      { name: 'Rome', country: 'Italy', code: 'IT', lat: 41.9028, lng: 12.4964 },
      { name: 'Sydney', country: 'Australia', code: 'AU', lat: -33.8688, lng: 151.2093 },
      { name: 'Dubai', country: 'UAE', code: 'AE', lat: 25.2048, lng: 55.2708 },
      { name: 'Amsterdam', country: 'Netherlands', code: 'NL', lat: 52.3676, lng: 4.9041 },
      { name: 'Bangkok', country: 'Thailand', code: 'TH', lat: 13.7563, lng: 100.5018 },
      { name: 'Singapore', country: 'Singapore', code: 'SG', lat: 1.3521, lng: 103.8198 },
      { name: 'Los Angeles', country: 'United States', code: 'US', lat: 34.0522, lng: -118.2437 },
      { name: 'Miami', country: 'United States', code: 'US', lat: 25.7617, lng: -80.1918 },
      { name: 'Berlin', country: 'Germany', code: 'DE', lat: 52.5200, lng: 13.4050 },
      { name: 'Vienna', country: 'Austria', code: 'AT', lat: 48.2082, lng: 16.3738 },
      { name: 'Prague', country: 'Czech Republic', code: 'CZ', lat: 50.0755, lng: 14.4378 },
      { name: 'Lisbon', country: 'Portugal', code: 'PT', lat: 38.7223, lng: -9.1393 },
      { name: 'Athens', country: 'Greece', code: 'GR', lat: 37.9838, lng: 23.7275 },
      { name: 'Istanbul', country: 'Turkey', code: 'TR', lat: 41.0082, lng: 28.9784 },
      { name: 'Bali', country: 'Indonesia', code: 'ID', lat: -8.3405, lng: 115.0920 },
      { name: 'Maldives', country: 'Maldives', code: 'MV', lat: 3.2028, lng: 73.2207 },
      { name: 'Cancun', country: 'Mexico', code: 'MX', lat: 21.1619, lng: -86.8515 },
      { name: 'Hawaii', country: 'United States', code: 'US', lat: 19.8968, lng: -155.5828 },
      { name: 'Santorini', country: 'Greece', code: 'GR', lat: 36.3932, lng: 25.4615 },
      { name: 'Zurich', country: 'Switzerland', code: 'CH', lat: 47.3769, lng: 8.5417 },
      { name: 'Geneva', country: 'Switzerland', code: 'CH', lat: 46.2044, lng: 6.1432 },
      { name: 'Lucerne', country: 'Switzerland', code: 'CH', lat: 47.0502, lng: 8.3093 },
      { name: 'Munich', country: 'Germany', code: 'DE', lat: 48.1351, lng: 11.5820 },
      { name: 'Nice', country: 'France', code: 'FR', lat: 43.7102, lng: 7.2620 },
      { name: 'Monaco', country: 'Monaco', code: 'MC', lat: 43.7384, lng: 7.4246 },
      { name: 'Milan', country: 'Italy', code: 'IT', lat: 45.4642, lng: 9.1900 },
      { name: 'Venice', country: 'Italy', code: 'IT', lat: 45.4408, lng: 12.3155 },
      { name: 'Florence', country: 'Italy', code: 'IT', lat: 43.7696, lng: 11.2558 },
      { name: 'Seoul', country: 'South Korea', code: 'KR', lat: 37.5665, lng: 126.9780 },
      { name: 'Hong Kong', country: 'China', code: 'HK', lat: 22.3193, lng: 114.1694 },
      { name: 'Kyoto', country: 'Japan', code: 'JP', lat: 35.0116, lng: 135.7681 },
      { name: 'Cairo', country: 'Egypt', code: 'EG', lat: 30.0444, lng: 31.2357 },
      { name: 'Marrakech', country: 'Morocco', code: 'MA', lat: 31.6295, lng: -7.9811 },
      { name: 'Cape Town', country: 'South Africa', code: 'ZA', lat: -33.9249, lng: 18.4241 },
    ];

    // Filter by query
    const lowerQuery = query.toLowerCase();
    const matches = popularDestinations.filter(dest =>
      dest.name.toLowerCase().includes(lowerQuery) ||
      dest.country.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);

    if (matches.length === 0) {
      // If no match, allow custom destination
      suggestions.innerHTML = `
        <div class="destination-suggestion" data-name="${this.escapeHtml(query)}" data-country="" data-code="" data-lat="" data-lng="">
          <div class="destination-suggestion-icon">📍</div>
          <div class="destination-suggestion-text">
            <div class="destination-suggestion-name">${this.escapeHtml(query)}</div>
            <div class="destination-suggestion-country">Custom destination</div>
          </div>
        </div>
      `;
    } else {
      suggestions.innerHTML = matches.map(dest => `
        <div class="destination-suggestion" data-name="${dest.name}" data-country="${dest.country}" data-code="${dest.code || ''}" data-lat="${dest.lat}" data-lng="${dest.lng}">
          <div class="destination-suggestion-icon">📍</div>
          <div class="destination-suggestion-text">
            <div class="destination-suggestion-name">${dest.name}</div>
            <div class="destination-suggestion-country">${dest.country}</div>
          </div>
        </div>
      `).join('');
    }

    suggestions.classList.add('active');

    // Add click handlers
    suggestions.querySelectorAll('.destination-suggestion').forEach(item => {
      item.addEventListener('click', () => {
        this.selectDestination(item);
      });
    });
  }

  selectDestination(item) {
    const name = item.dataset.name;
    const country = item.dataset.country;
    const code = item.dataset.code || null;
    const lat = item.dataset.lat ? parseFloat(item.dataset.lat) : null;
    const lng = item.dataset.lng ? parseFloat(item.dataset.lng) : null;

    this.newTrip.destination = name;
    this.newTrip.destinationDisplay = country ? `${name}, ${country}` : name;
    this.newTrip.latitude = lat;
    this.newTrip.longitude = lng;
    this.newTrip.countryCode = code;

    const input = document.getElementById('destination-input');
    const suggestions = document.getElementById('destination-suggestions');
    const nextBtn = document.getElementById('next-to-dates');

    if (input) input.value = this.newTrip.destinationDisplay;
    if (suggestions) suggestions.classList.remove('active');
    if (nextBtn) nextBtn.disabled = false;
  }

  setupDateInputs() {
    const startInput = document.getElementById('start-date');
    const endInput = document.getElementById('end-date');
    const nextBtn = document.getElementById('next-to-ai-prompt');
    const somedayCheckbox = document.getElementById('someday-checkbox');
    const specificDatesContainer = document.getElementById('specific-dates-container');
    const tripLengthContainer = document.getElementById('trip-length-container');
    const tripLengthInput = document.getElementById('trip-length');
    const tripLengthMinus = document.getElementById('trip-length-minus');
    const tripLengthPlus = document.getElementById('trip-length-plus');

    if (!startInput || !endInput) return;

    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    startInput.min = today;

    const validateDates = () => {
      // If someday trip, just check trip length
      if (this.newTrip.isSomedayTrip) {
        if (nextBtn) nextBtn.disabled = false;
        return;
      }

      const start = startInput.value;
      const end = endInput.value;

      if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);

        if (endDate >= startDate) {
          this.newTrip.startDate = startDate;
          this.newTrip.endDate = endDate;
          if (nextBtn) nextBtn.disabled = false;
        } else {
          if (nextBtn) nextBtn.disabled = true;
        }
      } else {
        if (nextBtn) nextBtn.disabled = true;
      }
    };

    // Someday/Wishlist toggle
    if (somedayCheckbox) {
      somedayCheckbox.addEventListener('change', () => {
        this.newTrip.isSomedayTrip = somedayCheckbox.checked;

        if (somedayCheckbox.checked) {
          // Show trip length, hide specific dates
          if (specificDatesContainer) specificDatesContainer.style.display = 'none';
          if (tripLengthContainer) tripLengthContainer.style.display = 'block';
          // Enable continue button immediately for wishlist
          if (nextBtn) nextBtn.disabled = false;
        } else {
          // Show specific dates, hide trip length
          if (specificDatesContainer) specificDatesContainer.style.display = 'flex';
          if (tripLengthContainer) tripLengthContainer.style.display = 'none';
          // Re-validate dates
          validateDates();
        }
      });
    }

    // Trip length controls
    if (tripLengthMinus && tripLengthInput) {
      tripLengthMinus.addEventListener('click', () => {
        const current = parseInt(tripLengthInput.value) || 7;
        if (current > 1) {
          tripLengthInput.value = current - 1;
          this.newTrip.tripLength = current - 1;
        }
      });
    }

    if (tripLengthPlus && tripLengthInput) {
      tripLengthPlus.addEventListener('click', () => {
        const current = parseInt(tripLengthInput.value) || 7;
        if (current < 90) {
          tripLengthInput.value = current + 1;
          this.newTrip.tripLength = current + 1;
        }
      });
    }

    startInput.addEventListener('change', () => {
      // Update end date min
      if (startInput.value) {
        endInput.min = startInput.value;
        if (endInput.value && endInput.value < startInput.value) {
          endInput.value = startInput.value;
        }
      }
      validateDates();
    });

    endInput.addEventListener('change', validateDates);
  }

  // Context is now derived from travel styles - this method is deprecated
  // Keeping empty for backwards compatibility with setupCreateTrip call
  setupContextSelection() {
    // No longer needed - travel styles replace context
  }

  setupNameInput() {
    const input = document.getElementById('trip-name-input');
    const submitBtn = document.getElementById('create-trip-submit');

    if (!input) return;

    input.addEventListener('input', () => {
      const name = input.value.trim();
      this.newTrip.name = name;
      if (submitBtn) submitBtn.disabled = name.length === 0;
    });
  }

  generateSuggestedNames() {
    const container = document.getElementById('suggested-names');
    const input = document.getElementById('trip-name-input');
    if (!container) return;

    const destination = this.newTrip.destination || 'Trip';
    const startDate = this.newTrip.startDate;
    const travelStyles = this.newTrip.travelStyles;

    const suggestions = [];

    // Basic destination name
    suggestions.push(`${destination} Trip`);

    // With season/month (only for non-wishlist trips)
    if (startDate && !this.newTrip.isSomedayTrip) {
      const month = startDate.toLocaleString('en-US', { month: 'long' });
      const year = startDate.getFullYear();
      suggestions.push(`${destination} ${month} ${year}`);

      // Season-based
      const monthNum = startDate.getMonth();
      let season = '';
      if (monthNum >= 2 && monthNum <= 4) season = 'Spring';
      else if (monthNum >= 5 && monthNum <= 7) season = 'Summer';
      else if (monthNum >= 8 && monthNum <= 10) season = 'Fall';
      else season = 'Winter';

      suggestions.push(`${season} in ${destination}`);
    }

    // Style-based suggestions
    if (travelStyles.length > 0) {
      const styleNames = {
        adventure: 'Adventure',
        beaches: 'Beach Vacation',
        family: 'Family Trip',
        honeymoon: 'Honeymoon',
        food: 'Culinary Journey',
        hiking: 'Hiking Trip',
        history: 'Historical Tour',
        luxury: 'Luxury Escape',
        budget: 'Budget Adventure'
      };
      const firstStyle = travelStyles[0];
      if (styleNames[firstStyle]) {
        suggestions.push(`${destination} ${styleNames[firstStyle]}`);
      }
    }

    // Wishlist-specific
    if (this.newTrip.isSomedayTrip) {
      suggestions.push(`Dream ${destination} Trip`);
      suggestions.push(`${destination} Someday`);
    }

    // Render suggestions
    container.innerHTML = suggestions.slice(0, 4).map(name => `
      <span class="suggested-name">${this.escapeHtml(name)}</span>
    `).join('');

    // Add click handlers
    container.querySelectorAll('.suggested-name').forEach(item => {
      item.addEventListener('click', () => {
        if (input) {
          input.value = item.textContent;
          this.newTrip.name = item.textContent;
          const submitBtn = document.getElementById('create-trip-submit');
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    });
  }

  async generateAIItinerary() {
    const loadingEl = document.getElementById('ai-loading');
    const contentEl = document.getElementById('ai-itinerary-content');
    const daysContainer = document.getElementById('ai-itinerary-days');

    // Show loading, hide content
    if (loadingEl) loadingEl.style.display = 'flex';
    if (contentEl) contentEl.style.display = 'none';

    try {
      // Calculate trip length
      let tripDays = this.newTrip.tripLength || 7;
      if (!this.newTrip.isSomedayTrip && this.newTrip.startDate && this.newTrip.endDate) {
        const msPerDay = 1000 * 60 * 60 * 24;
        tripDays = Math.ceil((this.newTrip.endDate - this.newTrip.startDate) / msPerDay) + 1;
      }

      // Format dates for API
      const formatDate = (date) => {
        if (!date) return null;
        return date.toISOString().split('T')[0];
      };

      // Call the aiPlanTrip Firebase function
      const aiPlanTrip = firebase.functions().httpsCallable('aiPlanTrip');
      // Combine trip-specific travel styles with user's saved interests
      const combinedInterests = [
        ...this.newTrip.travelStyles,
        ...this.userPreferences.interests.filter(i => !this.newTrip.travelStyles.includes(i))
      ];

      const result = await aiPlanTrip({
        destination: this.newTrip.destination,
        startDate: this.newTrip.isSomedayTrip ? null : formatDate(this.newTrip.startDate),
        endDate: this.newTrip.isSomedayTrip ? null : formatDate(this.newTrip.endDate),
        tripDays: tripDays,
        interests: combinedInterests,
        travelStyle: this.newTrip.travelCompanion || 'solo',
        // User preferences for personalization
        dietaryPreferences: this.userPreferences.dietaryPreferences,
        budgetPreference: this.userPreferences.budgetPreference,
        userTravelStyle: this.userPreferences.travelStyle
      });

      const itinerary = result.data;

      // Store itinerary
      this.newTrip.aiItinerary = itinerary.days || [];

      // Render itinerary
      this.renderAIItinerary(itinerary.days || []);

      // Hide loading, show content
      if (loadingEl) loadingEl.style.display = 'none';
      if (contentEl) contentEl.style.display = 'block';

    } catch (error) {
      console.error('AI itinerary generation error:', error);

      // Show error message
      if (daysContainer) {
        daysContainer.innerHTML = `
          <div class="ai-error">
            <p>Unable to generate itinerary. Please try again.</p>
            <button class="ai-retry-btn" onclick="window.tripsManager.generateAIItinerary()">Retry</button>
          </div>
        `;
      }

      if (loadingEl) loadingEl.style.display = 'none';
      if (contentEl) contentEl.style.display = 'block';
    }
  }

  renderAIItinerary(days) {
    const container = document.getElementById('ai-itinerary-days');
    if (!container) return;

    if (!days || days.length === 0) {
      container.innerHTML = '<p class="ai-no-results">No activities found. Try different interests.</p>';
      return;
    }

    container.innerHTML = days.map((day, dayIndex) => `
      <div class="ai-day" data-day="${dayIndex}">
        <div class="ai-day-header">
          <h3>Day ${dayIndex + 1}</h3>
          ${day.title ? `<span class="ai-day-title">${this.escapeHtml(day.title)}</span>` : ''}
        </div>
        <div class="ai-day-activities">
          ${(day.activities || []).map((activity, actIndex) => `
            <div class="ai-activity ${activity.included !== false ? 'included' : 'excluded'}"
                 data-day="${dayIndex}"
                 data-activity="${actIndex}">
              <div class="ai-activity-toggle">
                <input type="checkbox"
                       id="activity-${dayIndex}-${actIndex}"
                       ${activity.included !== false ? 'checked' : ''}>
              </div>
              <div class="ai-activity-content">
                <div class="ai-activity-time">${activity.time || ''}</div>
                <div class="ai-activity-title">${this.escapeHtml(activity.title || activity.name || '')}</div>
                <div class="ai-activity-desc">${this.escapeHtml(activity.description || '')}</div>
                ${activity.category ? `
                  <div class="ai-activity-category">${this.escapeHtml(activity.category)}</div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    // Add toggle handlers
    container.querySelectorAll('.ai-activity input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const activityEl = e.target.closest('.ai-activity');
        const dayIndex = parseInt(activityEl.dataset.day);
        const actIndex = parseInt(activityEl.dataset.activity);

        if (e.target.checked) {
          activityEl.classList.add('included');
          activityEl.classList.remove('excluded');
          if (this.newTrip.aiItinerary[dayIndex]?.activities[actIndex]) {
            this.newTrip.aiItinerary[dayIndex].activities[actIndex].included = true;
          }
        } else {
          activityEl.classList.remove('included');
          activityEl.classList.add('excluded');
          if (this.newTrip.aiItinerary[dayIndex]?.activities[actIndex]) {
            this.newTrip.aiItinerary[dayIndex].activities[actIndex].included = false;
          }
        }
      });
    });
  }

  async createTrip() {
    if (!this.currentUser) {
      alert('Please sign in to create a trip');
      return;
    }

    const submitBtn = document.getElementById('create-trip-submit');
    if (submitBtn) {
      submitBtn.classList.add('loading');
      submitBtn.textContent = 'Creating...';
    }

    try {
      const db = firebase.firestore();

      // Generate unique ID (must be UUID format for iOS compatibility)
      const tripId = crypto.randomUUID();

      // Derive context from travel styles (for backwards compatibility)
      let derivedContext = null;
      const styleToContext = {
        beaches: 'beach',
        adventure: 'adventure',
        family: 'family',
        hiking: 'adventure',
        history: 'city',
        food: 'city',
        luxury: 'city',
        nightlife: 'city'
      };
      for (const style of this.newTrip.travelStyles) {
        if (styleToContext[style]) {
          derivedContext = styleToContext[style];
          break;
        }
      }

      // Build trip document matching iOS app structure
      const tripData = {
        id: tripId,
        name: this.newTrip.name,
        destination: this.newTrip.destination,
        context: derivedContext,
        latitude: this.newTrip.latitude,
        longitude: this.newTrip.longitude,
        countryCodes: this.newTrip.countryCode ? [this.newTrip.countryCode] : [],
        customImageURL: null,
        isArchived: false,
        isSomedayTrip: this.newTrip.isSomedayTrip,
        tripLength: this.newTrip.tripLength,
        travelStyles: this.newTrip.travelStyles,
        travelCompanion: this.newTrip.travelCompanion,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        // Initialize arrays for cross-device sync
        packingItems: [],
        todoItems: [],
        documents: [],
        legs: []
      };

      // Handle dates based on trip type
      if (this.newTrip.isSomedayTrip) {
        // Wishlist trip - use placeholder dates far in future
        const placeholderDate = new Date('2099-01-01');
        tripData.startDate = firebase.firestore.Timestamp.fromDate(placeholderDate);
        tripData.endDate = firebase.firestore.Timestamp.fromDate(placeholderDate);
      } else {
        tripData.startDate = firebase.firestore.Timestamp.fromDate(this.newTrip.startDate);
        tripData.endDate = firebase.firestore.Timestamp.fromDate(this.newTrip.endDate);
      }

      // Build itinerary items from AI suggestions if used
      const itineraryItems = [];
      if (this.newTrip.useAI && this.newTrip.aiItinerary.length > 0) {
        this.newTrip.aiItinerary.forEach((day, dayIndex) => {
          (day.activities || []).forEach((activity, actIndex) => {
            // Only include activities that are checked
            if (activity.included !== false) {
              const itemDate = this.newTrip.isSomedayTrip
                ? null
                : new Date(this.newTrip.startDate.getTime() + dayIndex * 24 * 60 * 60 * 1000);

              // Map category to iOS ItineraryItemType
              const categoryToType = {
                'accommodation': 'accommodation',
                'hotel': 'accommodation',
                'lodging': 'accommodation',
                'activity': 'activity',
                'attraction': 'activity',
                'sightseeing': 'activity',
                'food': 'food',
                'restaurant': 'food',
                'dining': 'food',
                'travel': 'travel',
                'transport': 'travel',
                'flight': 'travel',
                'other': 'other'
              };
              const itemType = categoryToType[activity.category?.toLowerCase()] || 'activity';

              itineraryItems.push({
                id: crypto.randomUUID(),
                type: itemType,
                title: activity.title || activity.name || 'Activity',
                notes: activity.description || null,
                date: itemDate ? firebase.firestore.Timestamp.fromDate(itemDate) : null,
                isStarred: false,
                tasks: [],
                attachments: [],
                backgroundImageURL: null,
                currencyAmount: activity.estimatedCost || null,
                currency: null,
                homeCurrencyAmount: null,
                conversionRate: null,
                location: activity.location || null,
                websiteURL: null,
                phoneNumber: null,
                flightTrackingId: null
              });
            }
          });
        });
      }
      tripData.itineraryItems = itineraryItems;

      // Save to Firestore
      await db
        .collection('users')
        .doc(this.currentUser.uid)
        .collection('trips')
        .doc(tripId)
        .set(tripData);

      this.createdTripId = tripId;

      // Show success
      const successMessage = document.getElementById('success-message');
      if (successMessage) {
        const tripType = this.newTrip.isSomedayTrip ? 'wishlist' : '';
        const aiNote = this.newTrip.useAI ? ` with ${itineraryItems.length} AI-generated activities` : '';
        successMessage.textContent = `"${this.newTrip.name}" has been created${aiNote} and synced to all your devices.`;
      }

      this.showStep('step-success');

      // Reload trips list
      await this.loadTrips(this.currentUser.uid);
      this.renderTrips();

    } catch (error) {
      console.error('Error creating trip:', error);
      alert('Failed to create trip. Please try again.');
    } finally {
      if (submitBtn) {
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Create Trip';
      }
    }
  }

  // ============================================
  // View Switcher
  // ============================================

  setupViewSwitcher() {
    if (!this.viewSwitcherEl) return;

    const buttons = this.viewSwitcherEl.querySelectorAll('.view-switcher-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        this.switchView(view);
      });
    });
  }

  switchView(view) {
    if (view === this.currentView) return;

    this.currentView = view;

    // Update button states
    const buttons = this.viewSwitcherEl.querySelectorAll('.view-switcher-btn');
    buttons.forEach(btn => {
      if (btn.dataset.view === view) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Show appropriate container and button
    if (view === 'trips') {
      this.containerEl.style.display = 'block';
      this.flightsContainerEl.style.display = 'none';
      if (this.createTripBtn) this.createTripBtn.style.display = 'inline-flex';
      if (this.addFlightBtn) this.addFlightBtn.style.display = 'none';
      this.renderTrips();
    } else {
      this.containerEl.style.display = 'none';
      this.flightsContainerEl.style.display = 'block';
      if (this.createTripBtn) this.createTripBtn.style.display = 'none';
      if (this.addFlightBtn) this.addFlightBtn.style.display = 'inline-flex';
      this.renderFlights();
    }
  }

  // ============================================
  // Flights Loading and Rendering
  // ============================================

  async loadFlights(userId) {
    const db = firebase.firestore();

    // Fetch flights from flights collection
    const snapshot = await db
      .collection('flights')
      .where('userId', '==', userId)
      .orderBy('departureDate', 'asc')
      .get();

    this.flights = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      this.flights.push({
        id: doc.id,
        ...data
      });
    });

    console.log(`Loaded ${this.flights.length} flights from Firebase`);
  }

  renderFlights() {
    const { upcoming, past } = this.categorizeFlights();

    // If no flights at all, show empty state
    if (upcoming.length === 0 && past.length === 0) {
      this.showFlightsEmpty();
      return;
    }

    // Clear grids
    this.upcomingFlightsGrid.innerHTML = '';
    this.pastFlightsGrid.innerHTML = '';

    // Render upcoming flights
    if (upcoming.length > 0) {
      this.upcomingFlightsSection.style.display = 'block';
      upcoming.forEach(flight => {
        const card = this.createFlightCard(flight, 'upcoming');
        this.upcomingFlightsGrid.appendChild(card);
      });
    } else {
      this.upcomingFlightsSection.style.display = 'none';
    }

    // Render past flights
    if (past.length > 0) {
      this.pastFlightsSection.style.display = 'block';
      past.forEach(flight => {
        const card = this.createFlightCard(flight, 'past');
        this.pastFlightsGrid.appendChild(card);
      });
    } else {
      this.pastFlightsSection.style.display = 'none';
    }

    this.showFlightsContainer();
  }

  categorizeFlights() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    const upcoming = [];
    const past = [];

    for (const flight of this.flights) {
      if (flight.departureDate >= today) {
        upcoming.push(flight);
      } else {
        past.push(flight);
      }
    }

    // Sort upcoming by departure date (soonest first)
    upcoming.sort((a, b) => a.departureDate.localeCompare(b.departureDate));

    // Sort past by departure date (most recent first)
    past.sort((a, b) => b.departureDate.localeCompare(a.departureDate));

    return { upcoming, past };
  }

  createFlightCard(flight, type) {
    const card = document.createElement('div');
    card.className = `flight-card ${type}`;
    card.dataset.flightId = flight.id;

    // Extract time from timestamp strings (format: "YYYY-MM-DD HH:mm:ss" or "HH:mm")
    const extractTime = (timeStr) => {
      if (!timeStr) return '--:--';
      const match = timeStr.match(/(\d{1,2}:\d{2})/);
      return match ? match[1] : '--:--';
    };

    // Scheduled (planned) times
    const scheduledDepTime = extractTime(flight.depTime || flight.std);
    const scheduledArrTime = extractTime(flight.arrTime || flight.sta);

    // Actual/Estimated times
    const actualDepTime = extractTime(flight.depActual || flight.depEstimated);
    const actualArrTime = extractTime(flight.arrActual || flight.arrEstimated);

    // Check for delays (consider any delay > 5 minutes as delayed)
    const depDelay = flight.depDelayed || 0;
    const arrDelay = flight.arrDelayed || 0;
    const isDepartureDelayed = depDelay > 5 && actualDepTime && actualDepTime !== '--:--';
    const isArrivalDelayed = arrDelay > 5 && actualArrTime && actualArrTime !== '--:--';
    const maxDelay = Math.max(depDelay, arrDelay);

    // Format duration
    const formattedDuration = flight.duration ?
      `${Math.floor(flight.duration / 60)}h ${flight.duration % 60}m` :
      '--';

    // Status classes
    const statusClass = `status-${(flight.status || 'scheduled').toLowerCase().replace(/\s+/g, '-')}`;

    // Format flight date for display
    const formatFlightDate = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    };

    const flightDate = formatFlightDate(flight.departureDate);

    card.innerHTML = `
      <div class="flight-card-header">
        <div class="flight-card-header-left">
          <div class="flight-card-airline-icon">✈️</div>
          <div>
            <div class="flight-card-flight-number">${this.escapeHtml(flight.flightNumber || flight.flightIata || 'N/A')}</div>
            ${flight.airlineIata ? `<div class="flight-card-airline-name">${this.escapeHtml(flight.airlineIata)}</div>` : ''}
          </div>
        </div>
        <div class="flight-card-status-badge ${statusClass}">
          ${this.escapeHtml(flight.status || 'Scheduled')}
        </div>
      </div>

      <div class="flight-card-body">
        <!-- Route -->
        <div class="flight-card-route">
          <div class="flight-card-airport">
            <div class="flight-card-airport-code">${this.escapeHtml(flight.departureAirportIata || flight.depIata || '???')}</div>
            <div class="flight-card-airport-name">${this.escapeHtml(flight.departureCity || '')}</div>
          </div>
          <div class="flight-card-route-line"></div>
          <div class="flight-card-airport">
            <div class="flight-card-airport-code">${this.escapeHtml(flight.arrivalAirportIata || flight.arrIata || '???')}</div>
            <div class="flight-card-airport-name">${this.escapeHtml(flight.arrivalCity || '')}</div>
          </div>
        </div>

        <!-- Times -->
        <div class="flight-card-times">
          <div class="flight-card-time">
            <div class="flight-card-time-label">Departure</div>
            ${isDepartureDelayed ? `
              <div class="flight-card-time-value">
                <div class="flight-card-time-delayed">${scheduledDepTime}</div>
                <div class="flight-card-time-estimated">${actualDepTime}</div>
              </div>
            ` : `
              <div class="flight-card-time-value">${scheduledDepTime}</div>
            `}
          </div>
          <div class="flight-card-duration">
            <div class="flight-card-duration-label">Duration</div>
            <div class="flight-card-duration-value">${formattedDuration}</div>
          </div>
          <div class="flight-card-time">
            <div class="flight-card-time-label">Arrival</div>
            ${isArrivalDelayed ? `
              <div class="flight-card-time-value">
                <div class="flight-card-time-delayed">${scheduledArrTime}</div>
                <div class="flight-card-time-estimated">${actualArrTime}</div>
              </div>
            ` : `
              <div class="flight-card-time-value">${scheduledArrTime}</div>
            `}
          </div>
        </div>

        <!-- Details -->
        ${flight.depTerminal || flight.depGate || flight.arrTerminal || flight.arrGate || flight.arrBaggage ? `
          <div class="flight-card-details">
            <!-- Departure Column -->
            <div class="flight-card-details-column">
              <div class="flight-card-details-column-title">Departure</div>
              ${flight.depTerminal ? `
                <div class="flight-card-detail">
                  <div class="flight-card-detail-icon">🏢</div>
                  <div class="flight-card-detail-text">
                    <div class="flight-card-detail-label">Terminal</div>
                    <div class="flight-card-detail-value">${this.escapeHtml(flight.depTerminal)}</div>
                  </div>
                </div>
              ` : ''}
              ${flight.depGate ? `
                <div class="flight-card-detail">
                  <div class="flight-card-detail-icon">🚪</div>
                  <div class="flight-card-detail-text">
                    <div class="flight-card-detail-label">Gate</div>
                    <div class="flight-card-detail-value">${this.escapeHtml(flight.depGate)}</div>
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Arrival Column -->
            <div class="flight-card-details-column">
              <div class="flight-card-details-column-title">Arrival</div>
              ${flight.arrTerminal ? `
                <div class="flight-card-detail">
                  <div class="flight-card-detail-icon">🏢</div>
                  <div class="flight-card-detail-text">
                    <div class="flight-card-detail-label">Terminal</div>
                    <div class="flight-card-detail-value">${this.escapeHtml(flight.arrTerminal)}</div>
                  </div>
                </div>
              ` : ''}
              ${flight.arrGate ? `
                <div class="flight-card-detail">
                  <div class="flight-card-detail-icon">🚪</div>
                  <div class="flight-card-detail-text">
                    <div class="flight-card-detail-label">Gate</div>
                    <div class="flight-card-detail-value">${this.escapeHtml(flight.arrGate)}</div>
                  </div>
                </div>
              ` : ''}
              ${flight.arrBaggage ? `
                <div class="flight-card-detail">
                  <div class="flight-card-detail-icon">🧳</div>
                  <div class="flight-card-detail-text">
                    <div class="flight-card-detail-label">Baggage</div>
                    <div class="flight-card-detail-value">${this.escapeHtml(flight.arrBaggage)}</div>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}

        <!-- Flight date (shown for past flights only) -->
        <div class="flight-card-date">
          ${flightDate}
        </div>

        <!-- Delay indicator -->
        ${(isDepartureDelayed || isArrivalDelayed) && maxDelay > 5 ? `
          <div class="flight-card-delay">
            <div class="flight-card-delay-icon">⚠️</div>
            <div class="flight-card-delay-text">Delayed by ${maxDelay} minutes</div>
          </div>
        ` : ''}
      </div>
    `;

    return card;
  }

  // UI State Methods for Flights
  showFlightsEmpty() {
    this.flightsEmptyEl.style.display = 'flex';
    this.upcomingFlightsSection.style.display = 'none';
    this.pastFlightsSection.style.display = 'none';
  }

  showFlightsContainer() {
    this.flightsEmptyEl.style.display = 'none';
  }

  // ============================================
  // Beta Badge
  // ============================================

  setupBetaBadge() {
    const betaBadge = document.getElementById('beta-badge');
    const betaModal = document.getElementById('beta-modal');
    const betaModalClose = document.getElementById('beta-modal-close');

    if (!betaBadge || !betaModal) return;

    // Open modal on beta badge click
    betaBadge.addEventListener('click', () => {
      betaModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    // Close modal on close button click
    if (betaModalClose) {
      betaModalClose.addEventListener('click', () => {
        betaModal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Close modal on outside click
    betaModal.addEventListener('click', (e) => {
      if (e.target === betaModal) {
        betaModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && betaModal.classList.contains('active')) {
        betaModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================
  // Add Flight Functionality
  // ============================================

  setupAddFlight() {
    if (!this.addFlightBtn || !this.addFlightModal) return;

    // Button click opens modal
    this.addFlightBtn.addEventListener('click', () => this.openAddFlightModal());

    // Close button
    const closeBtn = document.getElementById('add-flight-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeAddFlightModal());
    }

    // Click outside to close
    this.addFlightModal.addEventListener('click', (e) => {
      if (e.target === this.addFlightModal) {
        this.closeAddFlightModal();
      }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.addFlightModal.classList.contains('active')) {
        this.closeAddFlightModal();
      }
    });

    // Form submission
    const form = document.getElementById('add-flight-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddFlight();
      });
    }

    // Upgrade button
    const upgradeBtn = document.getElementById('add-flight-upgrade-btn');
    if (upgradeBtn) {
      upgradeBtn.addEventListener('click', () => {
        window.location.href = '/premium.html';
      });
    }
  }

  openAddFlightModal() {
    // Reset form
    const form = document.getElementById('add-flight-form');
    if (form) form.reset();

    // Clear any errors
    const errorDiv = document.getElementById('add-flight-error');
    if (errorDiv) errorDiv.style.display = 'none';

    // Show modal
    this.addFlightModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus flight number input
    setTimeout(() => {
      const flightNumberInput = document.getElementById('flight-number');
      if (flightNumberInput) flightNumberInput.focus();
    }, 300);
  }

  closeAddFlightModal() {
    this.addFlightModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  async handleAddFlight() {
    if (!this.currentUser) {
      this.showAddFlightError('Please sign in to add flights');
      return;
    }

    // Get form values
    const flightNumberInput = document.getElementById('flight-number');
    const flightDateInput = document.getElementById('flight-date');

    const flightNumber = flightNumberInput.value.trim().toUpperCase();
    const flightDate = flightDateInput.value;

    if (!flightNumber || !flightDate) {
      this.showAddFlightError('Please enter both flight number and date');
      return;
    }

    // Check premium status
    const isPremium = await this.checkPremiumStatus();

    if (!isPremium) {
      // Show upgrade prompt
      this.showUpgradePrompt();
      return;
    }

    // Show loading state
    const submitBtn = document.querySelector('#add-flight-form button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Searching...';

    try {
      // Call Firebase function to search and add flight
      const functions = firebase.functions();
      const getFlightStatusFn = functions.httpsCallable('getFlightStatusFn');

      const result = await getFlightStatusFn({
        flightNumber: flightNumber,
        date: flightDate
      });

      const flightData = result.data;

      // Add flight to Firestore
      await this.addFlightToFirestore(flightData, flightDate);

      // Check if we should auto-add to trip itinerary
      await this.autoAddFlightToTrip(flightData, flightDate);

      // Success! Reload flights and close modal
      await this.loadFlights(this.currentUser.uid);
      this.renderFlights();
      this.closeAddFlightModal();

      // Show success message
      alert(`Flight ${flightNumber} has been added to your tracking!`);

    } catch (error) {
      console.error('Error adding flight:', error);
      this.showAddFlightError(error.message || 'Failed to find flight. Please check the flight number and date.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  async checkPremiumStatus() {
    // Check premium status from auth profile
    if (window.tripPortierAuth && window.tripPortierAuth.profile) {
      return window.tripPortierAuth.profile.isPremium || false;
    }

    // Fallback: check Firestore directly
    try {
      const db = firebase.firestore();
      const userDoc = await db.collection('users').doc(this.currentUser.uid).get();
      if (userDoc.exists) {
        return userDoc.data().isPremium || false;
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
    }

    return false;
  }

  async addFlightToFirestore(flightData, departureDate) {
    const db = firebase.firestore();

    // Build flight document matching iOS app structure
    const flightDoc = {
      userId: this.currentUser.uid,
      flightNumber: flightData.flight_iata || flightData.flightNumber,
      flightIata: flightData.flight_iata,
      airlineIata: flightData.airline_iata,
      departureAirportIata: flightData.dep_iata,
      arrivalAirportIata: flightData.arr_iata,
      departureCity: flightData.dep_city || '',
      arrivalCity: flightData.arr_city || '',
      departureDate: departureDate,
      depTime: flightData.dep_time || flightData.std,
      arrTime: flightData.arr_time || flightData.sta,
      std: flightData.std,
      sta: flightData.sta,
      depEstimated: flightData.dep_estimated,
      arrEstimated: flightData.arr_estimated,
      depActual: flightData.dep_actual,
      arrActual: flightData.arr_actual,
      depDelayed: flightData.dep_delayed || 0,
      arrDelayed: flightData.arr_delayed || 0,
      depTerminal: flightData.dep_terminal || null,
      depGate: flightData.dep_gate || null,
      arrTerminal: flightData.arr_terminal || null,
      arrGate: flightData.arr_gate || null,
      arrBaggage: flightData.arr_baggage || null,
      status: flightData.status || 'Scheduled',
      duration: flightData.duration || null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Add to flights collection
    await db.collection('flights').add(flightDoc);
  }

  async autoAddFlightToTrip(flightData, departureDate) {
    // Check if there's an upcoming or active trip that matches this flight date
    const flightDateObj = new Date(departureDate);

    for (const trip of this.trips) {
      // Skip someday trips
      if (trip.isSomedayTrip) continue;

      // Check if flight date falls within trip dates
      if (flightDateObj >= trip.startDate && flightDateObj <= trip.endDate) {
        // Flight is within this trip - add to itinerary
        await this.addFlightToTripItinerary(trip, flightData, departureDate);
        console.log(`Auto-added flight to trip: ${trip.name}`);
        break; // Only add to first matching trip
      }
    }
  }

  async addFlightToTripItinerary(trip, flightData, departureDate) {
    const db = firebase.firestore();

    // Create itinerary item for the flight (matching iOS ItineraryItem structure)
    const itineraryItem = {
      id: crypto.randomUUID(),
      type: 'travel',
      title: `${flightData.dep_iata} → ${flightData.arr_iata}`,
      notes: `Flight ${flightData.flight_iata || flightData.flightNumber}`,
      date: firebase.firestore.Timestamp.fromDate(new Date(departureDate)),
      isStarred: false,
      tasks: [],
      attachments: [],
      backgroundImageURL: null,
      currencyAmount: null,
      currency: null,
      homeCurrencyAmount: null,
      conversionRate: null,
      location: null,
      websiteURL: null,
      phoneNumber: null,
      flightTrackingId: null,
      // Travel-specific details (matching iOS TravelDetails structure)
      travelDetails: {
        travelMode: 'Flight',
        fromLocation: flightData.dep_city || flightData.dep_iata || null,
        toLocation: flightData.arr_city || flightData.arr_iata || null,
        departureTime: null,
        arrivalTime: null,
        bookingReference: null,
        bookingStatus: null,
        flightNumber: flightData.flight_iata || flightData.flightNumber || null,
        airline: flightData.airline_iata || null,
        flight: null,
        flightClass: null,
        seatNumbers: null,
        trainNumber: null,
        trainClass: null,
        carRentalCompany: null,
        vehicleType: null,
        pickupLocation: null,
        dropoffLocation: null
      }
    };

    // Add to trip's itineraryItems array
    await db
      .collection('users')
      .doc(this.currentUser.uid)
      .collection('trips')
      .doc(trip.id)
      .update({
        itineraryItems: firebase.firestore.FieldValue.arrayUnion(itineraryItem),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
  }

  showAddFlightError(message) {
    const errorDiv = document.getElementById('add-flight-error');
    const errorText = document.getElementById('add-flight-error-text');

    if (errorDiv && errorText) {
      errorText.textContent = message;
      errorDiv.style.display = 'flex';
    }
  }

  showUpgradePrompt() {
    const formContainer = document.querySelector('.add-flight-form');
    const upgradePrompt = document.getElementById('add-flight-upgrade-prompt');

    if (formContainer && upgradePrompt) {
      formContainer.style.display = 'none';
      upgradePrompt.style.display = 'block';
    }
  }

  // ============================================
  // Delete Trip
  // ============================================

  async deleteTrip(tripId) {
    if (!this.currentUser) {
      console.error('User not authenticated');
      return false;
    }

    try {
      const db = firebase.firestore();

      // Delete from Firestore
      await db
        .collection('users')
        .doc(this.currentUser.uid)
        .collection('trips')
        .doc(tripId)
        .delete();

      // Remove from local array
      this.trips = this.trips.filter(t => t.id !== tripId);

      console.log(`Trip ${tripId} deleted successfully`);
      return true;
    } catch (error) {
      console.error('Error deleting trip:', error);
      return false;
    }
  }

  // Confirm and delete trip with UI feedback
  async confirmDeleteTrip(tripId, tripName) {
    const confirmed = confirm(`Delete "${tripName}"?\n\nThis will permanently remove the trip from all your devices. This action cannot be undone.`);

    if (confirmed) {
      const success = await this.deleteTrip(tripId);
      if (success) {
        // Re-render the trips list
        this.renderTrips();
        return true;
      } else {
        alert('Failed to delete trip. Please try again.');
        return false;
      }
    }
    return false;
  }
}

// Create global instance
window.tripsManager = new TripsManager();
