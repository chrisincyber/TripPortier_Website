/**
 * TripPortier Trips Manager
 * Fetches and displays trips from Firebase Firestore
 */

class TripsManager {
  constructor() {
    this.trips = [];
    this.imageCache = new Map();
    this.pexelsApiKey = ''; // Will be loaded from Firebase

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
  }

  async handleAuthChange(user) {
    if (!user) {
      this.showNotSignedIn();
      return;
    }

    this.showLoading();

    try {
      await this.loadTrips(user.uid);
      this.renderTrips();
    } catch (error) {
      console.error('Error loading trips:', error);
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

    // Load Pexels API key if not loaded
    if (!this.pexelsApiKey) {
      try {
        const db = firebase.firestore();
        const configDoc = await db.collection('config').doc('api_keys').get();
        if (configDoc.exists) {
          this.pexelsApiKey = configDoc.data().pexels || '';
        }
      } catch (error) {
        console.warn('Could not load Pexels API key');
        return;
      }
    }

    if (!this.pexelsApiKey) return;

    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
        {
          headers: {
            'Authorization': this.pexelsApiKey
          }
        }
      );

      if (!response.ok) return;

      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        const imageUrl = data.photos[0].src.large;
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
}

// Create global instance
window.tripsManager = new TripsManager();
