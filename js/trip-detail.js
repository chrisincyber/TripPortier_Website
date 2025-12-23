/**
 * TripPortier Trip Detail Page
 * Displays full trip information similar to iOS app
 */

class TripDetailManager {
  constructor() {
    this.trip = null;
    this.pexelsApiKey = 'fiziyDodPH9hgsBsgMmMbojhWIBuOQD6TNarSRS4MRx96j0c7Rq0pL0h';

    // DOM elements
    this.loadingEl = document.getElementById('trip-loading');
    this.errorEl = document.getElementById('trip-error');
    this.contentEl = document.getElementById('trip-content');

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    // Get trip ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tripId = urlParams.get('id');

    if (!tripId) {
      this.showError();
      return;
    }

    // Wait for auth to be ready
    if (window.tripPortierAuth) {
      window.tripPortierAuth.addListener((user) => {
        if (user) {
          this.loadTrip(user.uid, tripId);
        } else {
          this.showError();
        }
      });
    }
  }

  async loadTrip(userId, tripId) {
    try {
      const db = firebase.firestore();
      const doc = await db
        .collection('users')
        .doc(userId)
        .collection('trips')
        .doc(tripId)
        .get();

      if (!doc.exists) {
        this.showError();
        return;
      }

      const data = doc.data();
      this.trip = {
        id: doc.id,
        name: data.name || 'Untitled Trip',
        destination: data.destination || '',
        startDate: this.parseDate(data.startDate),
        endDate: this.parseDate(data.endDate),
        context: data.context || null,
        customImageURL: data.customImageURL || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null
      };

      if (!this.trip.startDate || !this.trip.endDate) {
        this.showError();
        return;
      }

      this.renderTrip();
      this.showContent();
    } catch (error) {
      console.error('Error loading trip:', error);
      this.showError();
    }
  }

  parseDate(value) {
    if (!value) return null;

    if (value.toDate && typeof value.toDate === 'function') {
      return value.toDate();
    }

    if (typeof value === 'string') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    }

    if (value instanceof Date) {
      return value;
    }

    if (typeof value === 'number') {
      return new Date(value * 1000);
    }

    if (value.seconds) {
      return new Date(value.seconds * 1000);
    }

    return null;
  }

  renderTrip() {
    const trip = this.trip;

    // Update page title
    document.title = `${trip.name} - TripPortier`;

    // Trip title and destination
    document.getElementById('trip-title').textContent = trip.name;
    document.getElementById('trip-destination').textContent = trip.destination;

    // Dates
    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const startStr = trip.startDate.toLocaleDateString('en-US', dateOptions);
    const endStr = trip.endDate.toLocaleDateString('en-US', dateOptions);
    document.getElementById('trip-dates').textContent = `${startStr} - ${endStr}`;

    // Status badge
    const statusBadge = document.getElementById('trip-status-badge');
    const statusText = statusBadge.querySelector('.trip-status-text');
    const phase = this.getTripPhase();

    statusBadge.style.display = 'inline-flex';
    statusBadge.className = `trip-status-badge ${phase}`;

    if (phase === 'active') {
      const dayInfo = this.getDayInfo();
      statusText.textContent = `Day ${dayInfo.current} of ${dayInfo.total}`;
    } else if (phase === 'upcoming') {
      const countdown = this.getCountdown();
      statusText.textContent = countdown;
    } else {
      statusText.textContent = 'Completed';
    }

    // Duration
    const days = this.getDurationDays();
    document.getElementById('trip-duration').textContent =
      days === 1 ? '1 day' : `${days} days`;

    // Context/Trip Type
    if (trip.context) {
      const contextCard = document.getElementById('trip-context-card');
      const contextIcon = document.getElementById('trip-context-icon');
      const contextValue = document.getElementById('trip-context');

      contextCard.style.display = 'block';
      contextIcon.className = 'trip-essential-icon emoji';
      contextIcon.textContent = this.getContextIcon(trip.context);
      contextValue.textContent = this.capitalizeFirst(trip.context);
    }

    // Load cover image
    this.loadCoverImage();
  }

  getTripPhase() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tripStart = new Date(
      this.trip.startDate.getFullYear(),
      this.trip.startDate.getMonth(),
      this.trip.startDate.getDate()
    );
    const tripEnd = new Date(
      this.trip.endDate.getFullYear(),
      this.trip.endDate.getMonth(),
      this.trip.endDate.getDate()
    );

    if (tripStart <= today && tripEnd >= today) {
      return 'active';
    } else if (tripStart > today) {
      return 'upcoming';
    } else {
      return 'past';
    }
  }

  getDayInfo() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tripStart = new Date(
      this.trip.startDate.getFullYear(),
      this.trip.startDate.getMonth(),
      this.trip.startDate.getDate()
    );
    const tripEnd = new Date(
      this.trip.endDate.getFullYear(),
      this.trip.endDate.getMonth(),
      this.trip.endDate.getDate()
    );

    const current = Math.floor((today - tripStart) / (1000 * 60 * 60 * 24)) + 1;
    const total = Math.floor((tripEnd - tripStart) / (1000 * 60 * 60 * 24)) + 1;

    return { current, total };
  }

  getCountdown() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tripStart = new Date(
      this.trip.startDate.getFullYear(),
      this.trip.startDate.getMonth(),
      this.trip.startDate.getDate()
    );

    const daysUntil = Math.ceil((tripStart - today) / (1000 * 60 * 60 * 24));

    if (daysUntil === 0) return 'Starts today';
    if (daysUntil === 1) return 'Starts tomorrow';
    if (daysUntil < 7) return `In ${daysUntil} days`;
    if (daysUntil < 30) {
      const weeks = Math.floor(daysUntil / 7);
      return weeks === 1 ? 'In 1 week' : `In ${weeks} weeks`;
    }
    const months = Math.floor(daysUntil / 30);
    return months === 1 ? 'In 1 month' : `In ${months} months`;
  }

  getDurationDays() {
    const tripStart = new Date(
      this.trip.startDate.getFullYear(),
      this.trip.startDate.getMonth(),
      this.trip.startDate.getDate()
    );
    const tripEnd = new Date(
      this.trip.endDate.getFullYear(),
      this.trip.endDate.getMonth(),
      this.trip.endDate.getDate()
    );

    return Math.floor((tripEnd - tripStart) / (1000 * 60 * 60 * 24)) + 1;
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

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async loadCoverImage() {
    const coverEl = document.getElementById('trip-cover');

    // Try custom image first
    if (this.trip.customImageURL) {
      const img = new Image();
      img.onload = () => {
        img.className = 'trip-cover-image';
        coverEl.insertBefore(img, coverEl.firstChild);
      };
      img.onerror = () => {
        this.loadPexelsImage(coverEl);
      };
      img.src = this.trip.customImageURL;
      return;
    }

    // Try Pexels
    await this.loadPexelsImage(coverEl);
  }

  async loadPexelsImage(coverEl) {
    if (!this.pexelsApiKey) return;

    try {
      const query = this.trip.destination || this.trip.name;
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
        const imageUrl = data.photos[0].src.large2x || data.photos[0].src.large;

        const img = new Image();
        img.onload = () => {
          img.className = 'trip-cover-image';
          coverEl.insertBefore(img, coverEl.firstChild);
        };
        img.src = imageUrl;
      }
    } catch (error) {
      console.warn('Pexels API error:', error);
    }
  }

  showLoading() {
    this.loadingEl.style.display = 'flex';
    this.errorEl.style.display = 'none';
    this.contentEl.style.display = 'none';
  }

  showError() {
    this.loadingEl.style.display = 'none';
    this.errorEl.style.display = 'flex';
    this.contentEl.style.display = 'none';
  }

  showContent() {
    this.loadingEl.style.display = 'none';
    this.errorEl.style.display = 'none';
    this.contentEl.style.display = 'block';
  }
}

// Create global instance
window.tripDetailManager = new TripDetailManager();
