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
    // Same API key as iOS app (PexelsService.swift)
    this.pexelsApiKey = 'fiziyDodPH9hgsBsgMmMbojhWIBuOQD6TNarSRS4MRx96j0c7Rq0pL0h';

    // Trip creation state
    this.newTrip = {
      destination: '',
      destinationDisplay: '',
      latitude: null,
      longitude: null,
      startDate: null,
      endDate: null,
      context: null,
      name: ''
    };
    this.currentStep = 1;
    this.createdTripId = null;

    // DOM elements
    this.loadingEl = document.getElementById('trips-loading');
    this.notSignedInEl = document.getElementById('trips-not-signed-in');
    this.emptyEl = document.getElementById('trips-empty');
    this.containerEl = document.getElementById('trips-container');
    this.activeTripSection = document.getElementById('active-trip-section');
    this.upcomingTripsSection = document.getElementById('upcoming-trips-section');
    this.pastTripsSection = document.getElementById('past-trips-section');
    this.activeTripGrid = document.getElementById('active-trip-grid');
    this.upcomingTripsGrid = document.getElementById('upcoming-trips-grid');
    this.pastTripsGrid = document.getElementById('past-trips-grid');

    // Flights elements
    this.flightsContainerEl = document.getElementById('flights-container');
    this.flightsEmptyEl = document.getElementById('flights-empty');
    this.upcomingFlightsSection = document.getElementById('upcoming-flights-section');
    this.pastFlightsSection = document.getElementById('past-flights-section');
    this.upcomingFlightsGrid = document.getElementById('upcoming-flights-grid');
    this.pastFlightsGrid = document.getElementById('past-flights-grid');

    // View switcher
    this.viewSwitcherEl = document.getElementById('view-switcher');

    // Create trip elements
    this.createTripFab = document.getElementById('create-trip-fab');
    this.createTripModal = document.getElementById('create-trip-modal');

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
  }

  async handleAuthChange(user) {
    this.currentUser = user;

    if (!user) {
      this.showNotSignedIn();
      // Hide FAB and switcher when not signed in
      if (this.createTripFab) {
        this.createTripFab.style.display = 'none';
      }
      if (this.viewSwitcherEl) {
        this.viewSwitcherEl.style.display = 'none';
      }
      return;
    }

    // Show FAB and switcher when signed in
    if (this.createTripFab) {
      this.createTripFab.style.display = 'flex';
    }
    if (this.viewSwitcherEl) {
      this.viewSwitcherEl.style.display = 'flex';
    }

    this.showLoading();

    try {
      // Load both trips and flights
      await Promise.all([
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
    const past = [];

    for (const trip of this.trips) {
      // Skip someday trips
      if (trip.isSomedayTrip) continue;

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

    // Sort past by end date (most recent first)
    past.sort((a, b) => b.endDate - a.endDate);

    return { active, upcoming, past };
  }

  renderTrips() {
    const { active, upcoming, past } = this.categorizeTrips();

    // If no trips at all, show empty state
    if (active.length === 0 && upcoming.length === 0 && past.length === 0) {
      this.showEmpty();
      return;
    }

    // Clear grids
    this.activeTripGrid.innerHTML = '';
    this.upcomingTripsGrid.innerHTML = '';
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

    // Calculate days info
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

    if (!this.pexelsApiKey) return;

    try {
      // Same query format as iOS app: "{location} travel landscape"
      const searchQuery = `${query} travel landscape`;
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`,
        {
          headers: {
            'Authorization': this.pexelsApiKey
          }
        }
      );

      if (!response.ok) return;

      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        // Use large2x for better quality (same as iOS app)
        const imageUrl = data.photos[0].src.large2x || data.photos[0].src.large;
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
    if (!this.createTripFab || !this.createTripModal) return;

    // FAB click opens modal
    this.createTripFab.addEventListener('click', () => this.openCreateTripModal());

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
    this.updateProgressBar();
    this.showStep(1);

    // Show modal
    this.createTripModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus destination input
    setTimeout(() => {
      const destinationInput = document.getElementById('destination-input');
      if (destinationInput) destinationInput.focus();
    }, 300);
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
      startDate: null,
      endDate: null,
      context: null,
      name: ''
    };
    this.createdTripId = null;

    // Reset inputs
    const destinationInput = document.getElementById('destination-input');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const nameInput = document.getElementById('trip-name-input');

    if (destinationInput) destinationInput.value = '';
    if (startDateInput) startDateInput.value = '';
    if (endDateInput) endDateInput.value = '';
    if (nameInput) nameInput.value = '';

    // Reset context selection
    document.querySelectorAll('.context-option').forEach(opt => {
      opt.classList.remove('selected');
    });

    // Reset buttons
    const nextToDates = document.getElementById('next-to-dates');
    const nextToContext = document.getElementById('next-to-context');
    const nextToName = document.getElementById('next-to-name');
    const submitBtn = document.getElementById('create-trip-submit');

    if (nextToDates) nextToDates.disabled = true;
    if (nextToContext) nextToContext.disabled = true;
    if (nextToName) nextToName.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
  }

  showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.create-trip-step').forEach(step => {
      step.style.display = 'none';
    });

    // Show target step
    const stepIds = ['step-destination', 'step-dates', 'step-context', 'step-name', 'step-success'];
    const targetStep = document.getElementById(stepIds[stepNumber - 1]);
    if (targetStep) {
      targetStep.style.display = 'block';
    }

    this.currentStep = stepNumber;
    this.updateProgressBar();
  }

  updateProgressBar() {
    const progressBar = document.getElementById('create-trip-progress-bar');
    if (progressBar) {
      const percentage = (this.currentStep / 4) * 100;
      progressBar.style.width = `${Math.min(percentage, 100)}%`;
    }
  }

  setupStepNavigation() {
    // Step 1 -> Step 2
    const nextToDates = document.getElementById('next-to-dates');
    if (nextToDates) {
      nextToDates.addEventListener('click', () => this.showStep(2));
    }

    // Step 2 -> Step 1
    const backToDestination = document.getElementById('back-to-destination');
    if (backToDestination) {
      backToDestination.addEventListener('click', () => this.showStep(1));
    }

    // Step 2 -> Step 3
    const nextToContext = document.getElementById('next-to-context');
    if (nextToContext) {
      nextToContext.addEventListener('click', () => this.showStep(3));
    }

    // Step 3 -> Step 2
    const backToDates = document.getElementById('back-to-dates');
    if (backToDates) {
      backToDates.addEventListener('click', () => this.showStep(2));
    }

    // Step 3 -> Step 4
    const nextToName = document.getElementById('next-to-name');
    if (nextToName) {
      nextToName.addEventListener('click', () => {
        this.generateSuggestedNames();
        this.showStep(4);
      });
    }

    // Step 4 -> Step 3
    const backToContext = document.getElementById('back-to-context');
    if (backToContext) {
      backToContext.addEventListener('click', () => this.showStep(3));
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

    // Use a simple list of popular destinations + geocoding
    const popularDestinations = [
      { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
      { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
      { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060 },
      { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
      { name: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734 },
      { name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964 },
      { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
      { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
      { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041 },
      { name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018 },
      { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
      { name: 'Los Angeles', country: 'United States', lat: 34.0522, lng: -118.2437 },
      { name: 'Miami', country: 'United States', lat: 25.7617, lng: -80.1918 },
      { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050 },
      { name: 'Vienna', country: 'Austria', lat: 48.2082, lng: 16.3738 },
      { name: 'Prague', country: 'Czech Republic', lat: 50.0755, lng: 14.4378 },
      { name: 'Lisbon', country: 'Portugal', lat: 38.7223, lng: -9.1393 },
      { name: 'Athens', country: 'Greece', lat: 37.9838, lng: 23.7275 },
      { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784 },
      { name: 'Bali', country: 'Indonesia', lat: -8.3405, lng: 115.0920 },
      { name: 'Maldives', country: 'Maldives', lat: 3.2028, lng: 73.2207 },
      { name: 'Cancun', country: 'Mexico', lat: 21.1619, lng: -86.8515 },
      { name: 'Hawaii', country: 'United States', lat: 19.8968, lng: -155.5828 },
      { name: 'Santorini', country: 'Greece', lat: 36.3932, lng: 25.4615 },
      { name: 'Zurich', country: 'Switzerland', lat: 47.3769, lng: 8.5417 },
      { name: 'Geneva', country: 'Switzerland', lat: 46.2044, lng: 6.1432 },
      { name: 'Lucerne', country: 'Switzerland', lat: 47.0502, lng: 8.3093 },
      { name: 'Munich', country: 'Germany', lat: 48.1351, lng: 11.5820 },
      { name: 'Nice', country: 'France', lat: 43.7102, lng: 7.2620 },
      { name: 'Monaco', country: 'Monaco', lat: 43.7384, lng: 7.4246 },
      { name: 'Milan', country: 'Italy', lat: 45.4642, lng: 9.1900 },
      { name: 'Venice', country: 'Italy', lat: 45.4408, lng: 12.3155 },
      { name: 'Florence', country: 'Italy', lat: 43.7696, lng: 11.2558 },
      { name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780 },
      { name: 'Hong Kong', country: 'China', lat: 22.3193, lng: 114.1694 },
      { name: 'Kyoto', country: 'Japan', lat: 35.0116, lng: 135.7681 },
      { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357 },
      { name: 'Marrakech', country: 'Morocco', lat: 31.6295, lng: -7.9811 },
      { name: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241 },
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
        <div class="destination-suggestion" data-name="${this.escapeHtml(query)}" data-country="" data-lat="" data-lng="">
          <div class="destination-suggestion-icon">📍</div>
          <div class="destination-suggestion-text">
            <div class="destination-suggestion-name">${this.escapeHtml(query)}</div>
            <div class="destination-suggestion-country">Custom destination</div>
          </div>
        </div>
      `;
    } else {
      suggestions.innerHTML = matches.map(dest => `
        <div class="destination-suggestion" data-name="${dest.name}" data-country="${dest.country}" data-lat="${dest.lat}" data-lng="${dest.lng}">
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
    const lat = item.dataset.lat ? parseFloat(item.dataset.lat) : null;
    const lng = item.dataset.lng ? parseFloat(item.dataset.lng) : null;

    this.newTrip.destination = name;
    this.newTrip.destinationDisplay = country ? `${name}, ${country}` : name;
    this.newTrip.latitude = lat;
    this.newTrip.longitude = lng;

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
    const nextBtn = document.getElementById('next-to-context');

    if (!startInput || !endInput) return;

    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    startInput.min = today;

    const validateDates = () => {
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

  setupContextSelection() {
    const contextGrid = document.getElementById('context-grid');
    const nextBtn = document.getElementById('next-to-name');

    if (!contextGrid) return;

    contextGrid.querySelectorAll('.context-option').forEach(option => {
      option.addEventListener('click', () => {
        // Deselect all
        contextGrid.querySelectorAll('.context-option').forEach(opt => {
          opt.classList.remove('selected');
        });

        // Select this one
        option.classList.add('selected');
        this.newTrip.context = option.dataset.context;

        if (nextBtn) nextBtn.disabled = false;
      });
    });
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
    const context = this.newTrip.context;

    const suggestions = [];

    // Basic destination name
    suggestions.push(`${destination} Trip`);

    // With season/month
    if (startDate) {
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

    // Context-based
    if (context) {
      const contextNames = {
        city: 'City Break',
        beach: 'Beach Vacation',
        adventure: 'Adventure',
        business: 'Business Trip',
        winter: 'Winter Getaway',
        family: 'Family Trip'
      };
      suggestions.push(`${destination} ${contextNames[context] || ''}`);
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

      // Generate unique ID
      const tripId = db.collection('users').doc().id;

      // Build trip document matching iOS app structure
      const tripData = {
        id: tripId,
        name: this.newTrip.name,
        destination: this.newTrip.destination,
        startDate: firebase.firestore.Timestamp.fromDate(this.newTrip.startDate),
        endDate: firebase.firestore.Timestamp.fromDate(this.newTrip.endDate),
        context: this.newTrip.context,
        latitude: this.newTrip.latitude,
        longitude: this.newTrip.longitude,
        customImageURL: null,
        isArchived: false,
        isSomedayTrip: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        // Initialize empty arrays for cross-device sync
        itineraryItems: [],
        packingItems: [],
        todoItems: [],
        documents: [],
        legs: []
      };

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
        successMessage.textContent = `"${this.newTrip.name}" has been created and synced to all your devices.`;
      }

      this.showStep(5);

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

    // Show appropriate container
    if (view === 'trips') {
      this.containerEl.style.display = 'block';
      this.flightsContainerEl.style.display = 'none';
      this.renderTrips();
    } else {
      this.containerEl.style.display = 'none';
      this.flightsContainerEl.style.display = 'block';
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

    const depTime = extractTime(flight.depActual || flight.depEstimated || flight.depTime || flight.std);
    const arrTime = extractTime(flight.arrActual || flight.arrEstimated || flight.arrTime || flight.sta);
    const scheduledDepTime = extractTime(flight.depTime || flight.std);
    const scheduledArrTime = extractTime(flight.arrTime || flight.sta);

    const isDelayed = (flight.depDelayed && flight.depDelayed > 15) || (flight.arrDelayed && flight.arrDelayed > 15);
    const depDelay = flight.depDelayed || 0;
    const arrDelay = flight.arrDelayed || 0;
    const maxDelay = Math.max(depDelay, arrDelay);

    // Format duration
    const formattedDuration = flight.duration ?
      `${Math.floor(flight.duration / 60)}h ${flight.duration % 60}m` :
      '--';

    // Status classes
    const statusClass = `status-${(flight.status || 'scheduled').toLowerCase().replace(/\s+/g, '-')}`;

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
            ${isDelayed && depDelay > 0 ? `
              <div class="flight-card-time-value">
                <div class="flight-card-time-delayed">${scheduledDepTime}</div>
                <div class="flight-card-time-estimated">${depTime}</div>
              </div>
            ` : `
              <div class="flight-card-time-value">${depTime}</div>
            `}
          </div>
          <div class="flight-card-duration">
            <div class="flight-card-duration-label">Duration</div>
            <div class="flight-card-duration-value">${formattedDuration}</div>
          </div>
          <div class="flight-card-time">
            <div class="flight-card-time-label">Arrival</div>
            ${isDelayed && arrDelay > 0 ? `
              <div class="flight-card-time-value">
                <div class="flight-card-time-delayed">${scheduledArrTime}</div>
                <div class="flight-card-time-estimated">${arrTime}</div>
              </div>
            ` : `
              <div class="flight-card-time-value">${arrTime}</div>
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

        <!-- Delay indicator -->
        ${isDelayed ? `
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
}

// Create global instance
window.tripsManager = new TripsManager();
