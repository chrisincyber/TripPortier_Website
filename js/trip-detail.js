/**
 * TripPortier Trip Detail Page
 * Displays full trip information with tabs matching iOS app
 * Loads real data from Firestore for cross-device sync
 */

class TripDetailManager {
  constructor() {
    this.trip = null;
    this.userId = null;
    this.selectedTab = 'hub';
    this.selectedPlanSubtab = 'packing';
    this.temperatureUnit = 'celsius'; // Default to celsius
    this.dayLocationOverrides = {}; // Key: dateKey, Value: destination name

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
    this.tripId = urlParams.get('id');

    if (!this.tripId) {
      this.showError();
      return;
    }

    // Setup tab navigation
    this.setupTabNavigation();
    this.setupPlanSubtabs();
    this.setupAIOverlay();
    this.setupQuickActions();
    this.setupAddItemForms();
    this.setupTripMenu();
    this.setupExpenseForm();
    this.setupItineraryForm();
    this.setupForecastModalHandlers();
    this.setupEssentialsModal();

    // Wait for auth to be ready
    if (window.tripPortierAuth) {
      window.tripPortierAuth.addListener((user) => {
        if (user) {
          this.userId = user.uid;
          this.loadTrip(user.uid, this.tripId);
        } else {
          this.showError();
        }
      });
    }
  }

  setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.trip-tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        this.switchTab(tabId);
      });
    });
  }

  switchTab(tabId, subtab = null) {
    // Update tab buttons
    document.querySelectorAll('.trip-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Update tab content
    document.querySelectorAll('.trip-tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `tab-${tabId}`);
    });

    this.selectedTab = tabId;

    // If switching to plan tab with a subtab specified
    if (tabId === 'plan' && subtab) {
      this.switchPlanSubtab(subtab);
    }

    // Scroll to top when switching tabs
    window.scrollTo(0, 0);
  }

  setupPlanSubtabs() {
    const subtabButtons = document.querySelectorAll('.plan-subtab');
    subtabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const subtabId = btn.dataset.subtab;
        this.switchPlanSubtab(subtabId);
      });
    });
  }

  switchPlanSubtab(subtabId) {
    // Update subtab buttons
    document.querySelectorAll('.plan-subtab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.subtab === subtabId);
    });

    // Update subtab content
    document.querySelectorAll('.plan-subtab-content').forEach(content => {
      content.classList.toggle('active', content.id === `subtab-${subtabId}`);
    });

    this.selectedPlanSubtab = subtabId;
  }

  setupQuickActions() {
    const actionCards = document.querySelectorAll('.trip-action-card[data-tab]');
    actionCards.forEach(card => {
      card.addEventListener('click', () => {
        const tabId = card.dataset.tab;
        const subtab = card.dataset.subtab;
        this.switchTab(tabId, subtab);
      });
    });
  }

  setupAIOverlay() {
    const aiFab = document.getElementById('trip-ai-fab');
    const aiOverlay = document.getElementById('trip-ai-overlay');
    const aiClose = document.getElementById('trip-ai-overlay-close');
    const aiInput = document.getElementById('ai-chat-input');
    const aiSendBtn = document.getElementById('ai-chat-send');
    const aiMessages = document.getElementById('ai-chat-messages');

    // AI chat state
    this.aiConversationHistory = [];
    this.aiIsLoading = false;

    if (aiFab && aiOverlay) {
      aiFab.addEventListener('click', () => {
        aiOverlay.classList.add('active');
        this.updateAIDestinationName();
        this.checkAIPremiumAccess();
        if (aiInput) aiInput.focus();
      });
    }

    if (aiClose && aiOverlay) {
      aiClose.addEventListener('click', () => {
        aiOverlay.classList.remove('active');
      });
    }

    // Close on overlay background click
    if (aiOverlay) {
      aiOverlay.addEventListener('click', (e) => {
        if (e.target === aiOverlay) {
          aiOverlay.classList.remove('active');
        }
      });
    }

    // Chat input handling
    if (aiInput && aiSendBtn) {
      aiInput.addEventListener('input', () => {
        aiSendBtn.disabled = !aiInput.value.trim();
      });

      aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && aiInput.value.trim() && !this.aiIsLoading) {
          this.sendAIMessage(aiInput.value.trim());
          aiInput.value = '';
          aiSendBtn.disabled = true;
        }
      });

      aiSendBtn.addEventListener('click', () => {
        if (aiInput.value.trim() && !this.aiIsLoading) {
          this.sendAIMessage(aiInput.value.trim());
          aiInput.value = '';
          aiSendBtn.disabled = true;
        }
      });
    }

    // Quick suggestion buttons
    const quickBtns = document.querySelectorAll('.ai-quick-btn');
    quickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const prompt = btn.dataset.prompt;
        if (prompt && !this.aiIsLoading) {
          this.sendAIMessage(prompt);
        }
      });
    });
  }

  updateAIDestinationName() {
    const destinationSpan = document.getElementById('ai-destination-name');
    if (destinationSpan && this.trip?.destination) {
      const shortDestination = this.trip.destination.split(',')[0].trim();
      destinationSpan.textContent = shortDestination;
    }
  }

  async checkAIPremiumAccess() {
    const premiumNotice = document.getElementById('ai-premium-notice');
    if (!premiumNotice) return;

    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        premiumNotice.style.display = 'flex';
        return;
      }

      const db = firebase.firestore();
      const subscriptionDoc = await db.collection('subscriptions').doc(user.uid).get();

      if (subscriptionDoc.exists) {
        const data = subscriptionDoc.data();
        const isPremium = data.status === 'active' || data.status === 'trialing';
        premiumNotice.style.display = isPremium ? 'none' : 'flex';
      } else {
        premiumNotice.style.display = 'flex';
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
      premiumNotice.style.display = 'none'; // Hide on error, let function handle auth
    }
  }

  async sendAIMessage(message) {
    if (this.aiIsLoading) return;

    const aiMessages = document.getElementById('ai-chat-messages');
    const welcome = document.getElementById('ai-chat-welcome');
    const quickSuggestions = document.getElementById('ai-quick-suggestions');

    // Hide welcome message
    if (welcome) welcome.style.display = 'none';

    // Add user message to chat
    this.addAIChatMessage(message, 'user');

    // Add to history
    this.aiConversationHistory.push({ role: 'user', content: message });

    // Show loading indicator
    this.aiIsLoading = true;
    const loadingEl = document.createElement('div');
    loadingEl.className = 'ai-chat-loading';
    loadingEl.innerHTML = '<span></span><span></span><span></span>';
    aiMessages.appendChild(loadingEl);
    aiMessages.scrollTop = aiMessages.scrollHeight;

    // Hide quick suggestions after first message
    if (quickSuggestions && this.aiConversationHistory.length > 0) {
      quickSuggestions.style.display = 'none';
    }

    try {
      // Call Firebase function
      const aiChat = firebase.functions().httpsCallable('aiChat');
      const result = await aiChat({
        message: message,
        destination: this.trip?.destination || 'your destination',
        tripContext: {
          tripName: this.trip?.name,
          startDate: this.trip?.startDate?.toISOString?.() || null,
          endDate: this.trip?.endDate?.toISOString?.() || null,
          budget: this.trip?.budgetAmount,
          currency: this.trip?.currency
        },
        conversationHistory: this.aiConversationHistory.slice(-6)
      });

      // Remove loading indicator
      loadingEl.remove();

      if (result.data?.success && result.data?.response) {
        this.addAIChatMessage(result.data.response, 'assistant');
        this.aiConversationHistory.push({ role: 'assistant', content: result.data.response });
      } else {
        this.addAIChatMessage('Sorry, I couldn\'t process your request. Please try again.', 'assistant');
      }
    } catch (error) {
      console.error('AI Chat error:', error);
      loadingEl.remove();

      let errorMessage = 'Sorry, something went wrong. Please try again.';
      if (error.code === 'permission-denied') {
        errorMessage = 'AI Assistant requires a TripPortier+ subscription. Upgrade to access personalized travel recommendations!';
      } else if (error.code === 'unauthenticated') {
        errorMessage = 'Please sign in to use the AI Assistant.';
      }

      this.addAIChatMessage(errorMessage, 'assistant');
    }

    this.aiIsLoading = false;
  }

  addAIChatMessage(content, role) {
    const aiMessages = document.getElementById('ai-chat-messages');
    if (!aiMessages) return;

    const messageEl = document.createElement('div');
    messageEl.className = `ai-chat-message ${role}`;

    if (role === 'assistant') {
      // Parse markdown-style formatting
      const formattedContent = this.formatAIResponse(content);
      messageEl.innerHTML = formattedContent;
    } else {
      messageEl.textContent = content;
    }

    aiMessages.appendChild(messageEl);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  formatAIResponse(text) {
    // Convert markdown to HTML
    let html = this.escapeHtml(text);

    // Bold text **text**
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Bullet points
    html = html.replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Numbered lists
    html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');

    // Line breaks to paragraphs
    html = html.split('\n\n').map(p => `<p>${p}</p>`).join('');
    html = html.replace(/<p><\/p>/g, '');

    return html;
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
        isSomedayTrip: data.isSomedayTrip || false,
        tripLength: data.tripLength || 7,
        context: data.context || null,
        customImageURL: data.customImageURL || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        // Trip data for tabs
        itineraryItems: data.itineraryItems || [],
        packingItems: data.packingItems || [],
        todos: data.todos || [],
        documents: data.documents || [],
        expenses: data.expenses || [],
        budget: data.budget || null,
        budgetSpent: data.budgetSpent || 0,
        currency: data.currency || 'USD',
        legs: data.legs || [] // Multi-destination trip legs
      };

      // Trip data loaded successfully

      // Wishlist trips don't need dates, regular trips do
      if (!this.trip.isSomedayTrip && (!this.trip.startDate || !this.trip.endDate)) {
        this.showError();
        return;
      }

      this.renderTrip();
      this.renderItinerary();
      this.renderPackingList();
      this.renderTodos();
      this.renderBudget();
      this.loadWeather();
      this.renderSuggestions();
      this.renderEssentials();
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
    const titleEl = document.getElementById('trip-title');
    const destEl = document.getElementById('trip-destination');
    if (titleEl) titleEl.textContent = trip.name;
    if (destEl) destEl.textContent = trip.destination;

    // Dates - handle wishlist trips differently
    const tripDatesEl = document.getElementById('trip-dates');
    const itineraryDates = document.getElementById('itinerary-dates');

    if (trip.isSomedayTrip) {
      // Wishlist trips show planned duration instead of dates
      if (tripDatesEl) tripDatesEl.textContent = 'Dates not set yet';
      if (itineraryDates) {
        itineraryDates.textContent = `${trip.tripLength || 7} days planned`;
      }
    } else {
      const dateOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      const startStr = trip.startDate.toLocaleDateString('en-US', dateOptions);
      const endStr = trip.endDate.toLocaleDateString('en-US', dateOptions);
      if (tripDatesEl) tripDatesEl.textContent = `${startStr} - ${endStr}`;

      if (itineraryDates) {
        const shortDateOptions = { month: 'short', day: 'numeric' };
        itineraryDates.textContent = `${trip.startDate.toLocaleDateString('en-US', shortDateOptions)} - ${trip.endDate.toLocaleDateString('en-US', shortDateOptions)}`;
      }
    }

    // Status badge
    const statusBadge = document.getElementById('trip-status-badge');
    const statusText = statusBadge?.querySelector('.trip-status-text');
    const phase = this.getTripPhase();

    if (statusBadge) {
      statusBadge.style.display = 'inline-flex';
      statusBadge.className = `trip-status-badge ${phase}`;
    }

    if (statusText) {
      if (phase === 'active') {
        const dayInfo = this.getDayInfo();
        statusText.textContent = `Day ${dayInfo.current} of ${dayInfo.total}`;
      } else if (phase === 'upcoming') {
        const countdown = this.getCountdown();
        statusText.textContent = countdown;
      } else if (phase === 'wishlist') {
        statusText.textContent = `${this.trip.tripLength || 7} days planned`;
      } else {
        statusText.textContent = 'Completed';
      }
    }

    // Duration
    const days = this.getDurationDays();
    const durationEl = document.getElementById('trip-duration');
    if (durationEl) {
      durationEl.textContent = days === 1 ? '1 day' : `${days} days`;
    }

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

    // Initialize itinerary date input with trip start date
    this.initItineraryDateInput();
  }

  initItineraryDateInput() {
    const dateInput = document.getElementById('itinerary-date-input');
    if (dateInput && this.trip && this.trip.startDate) {
      dateInput.value = this.trip.startDate.toISOString().split('T')[0];
      // Also set min and max to trip date range
      dateInput.min = this.trip.startDate.toISOString().split('T')[0];
      dateInput.max = this.trip.endDate.toISOString().split('T')[0];
    }
  }

  // Get all available destinations from trip legs or main destination
  getAvailableDestinations() {
    if (this.trip.legs && this.trip.legs.length > 1) {
      // Multi-leg trip - return unique destination names
      const destinations = this.trip.legs.map(leg => leg.destinationName);
      return [...new Set(destinations)];
    }
    // Single destination - extract just the city name
    if (this.trip.destination) {
      const primaryDest = this.trip.destination.split(',')[0].trim();
      return [primaryDest];
    }
    return [];
  }

  // Get the destination for a specific day based on legs or overrides
  getDestinationForDay(date) {
    const dateKey = date.toDateString();

    // Check if there's a manual override first
    if (this.dayLocationOverrides[dateKey]) {
      return this.dayLocationOverrides[dateKey];
    }

    // Check trip legs for multi-destination trips
    if (this.trip.legs && this.trip.legs.length > 1) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);

      for (const leg of this.trip.legs) {
        const legStart = this.parseDate(leg.startDate);
        const legEnd = this.parseDate(leg.endDate) || legStart;

        if (legStart && legEnd) {
          legStart.setHours(0, 0, 0, 0);
          legEnd.setHours(0, 0, 0, 0);

          if (dayStart >= legStart && dayStart <= legEnd) {
            return leg.destinationName;
          }
        }
      }

      // If no matching leg, use first leg's destination
      if (this.trip.legs[0]) {
        return this.trip.legs[0].destinationName;
      }
    }

    // Fallback to main destination
    if (this.trip.destination) {
      return this.trip.destination.split(',')[0].trim();
    }

    return null;
  }

  // Update destination for a day and all subsequent days
  updateDestinationFromDay(selectedDate, destination) {
    const tripStart = new Date(this.trip.startDate);
    const tripEnd = new Date(this.trip.endDate);
    const selectedDayStart = new Date(selectedDate);
    selectedDayStart.setHours(0, 0, 0, 0);

    const currentDate = new Date(tripStart);
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate <= tripEnd) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);

      if (dayStart >= selectedDayStart) {
        const dayKey = currentDate.toDateString();
        this.dayLocationOverrides[dayKey] = destination;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Re-render itinerary to reflect changes
    this.renderItinerary();
  }

  renderItinerary() {
    const items = this.trip.itineraryItems || [];
    const container = document.getElementById('itinerary-days');
    const emptyState = document.getElementById('itinerary-empty');
    const pastSection = document.getElementById('itinerary-past-section');
    const pastContent = document.getElementById('itinerary-past-content');
    const pastCountEl = document.getElementById('past-days-count');
    const ideasSection = document.getElementById('itinerary-ideas-section');
    const ideasContent = document.getElementById('itinerary-ideas-content');
    const ideasCountEl = document.getElementById('trip-ideas-count');

    // Render filter chips
    this.renderItineraryFilterChips();

    // Get trip date range
    const tripStartDate = this.trip.startDate ? new Date(this.trip.startDate) : null;
    const tripEndDate = this.trip.endDate ? new Date(this.trip.endDate) : null;

    if (!tripStartDate || !tripEndDate) {
      if (emptyState) emptyState.style.display = 'flex';
      container.innerHTML = '';
      return;
    }

    // Hide empty state - we show all days
    if (emptyState) emptyState.style.display = 'none';

    // Add original index and filter items
    items.forEach((item, index) => {
      item._originalIndex = index;
    });

    // Separate items with dates from ideas (no date)
    const scheduledItems = items.filter(item => {
      const date = this.parseDate(item.startDate || item.date);
      return date !== null;
    });
    const tripIdeas = items.filter(item => {
      const date = this.parseDate(item.startDate || item.date);
      return date === null;
    });

    // Apply active filters
    const activeFilters = this.activeItineraryFilters || ['all'];
    const filteredItems = activeFilters.includes('all')
      ? scheduledItems
      : scheduledItems.filter(item => {
          const cat = (item.category || item.type || 'other').toLowerCase();
          return activeFilters.includes(cat);
        });

    // Group items by date
    const itemsByDate = {};
    filteredItems.forEach(item => {
      const date = this.parseDate(item.startDate || item.date);
      if (!date) return;
      const dateKey = date.toDateString();
      if (!itemsByDate[dateKey]) {
        itemsByDate[dateKey] = [];
      }
      itemsByDate[dateKey].push(item);
    });

    // Generate all days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allDays = [];
    const currentDate = new Date(tripStartDate);
    currentDate.setHours(0, 0, 0, 0);
    const endDate = new Date(tripEndDate);
    endDate.setHours(0, 0, 0, 0);

    let dayNumber = 1;
    while (currentDate <= endDate) {
      allDays.push({
        date: new Date(currentDate),
        dateKey: currentDate.toDateString(),
        dayNumber: dayNumber,
        isPast: currentDate < today,
        isToday: currentDate.getTime() === today.getTime()
      });
      currentDate.setDate(currentDate.getDate() + 1);
      dayNumber++;
    }

    // Split into upcoming and past days
    const upcomingDays = allDays.filter(d => !d.isPast);
    const pastDays = allDays.filter(d => d.isPast);

    // Get available destinations
    const availableDestinations = this.getAvailableDestinations();
    const isMultiDestination = availableDestinations.length > 1;

    // Render upcoming days
    container.innerHTML = upcomingDays.map(day => this.renderDaySection(day, itemsByDate, availableDestinations, isMultiDestination, true)).join('');

    // Render past days section
    if (pastDays.length > 0 && pastSection) {
      pastSection.style.display = 'block';
      const pastItemCount = pastDays.reduce((count, day) => count + (itemsByDate[day.dateKey] || []).length, 0);
      if (pastCountEl) pastCountEl.textContent = `${pastDays.length} days, ${pastItemCount} items`;
      pastContent.innerHTML = pastDays.map(day => this.renderDaySection(day, itemsByDate, availableDestinations, isMultiDestination, false)).join('');
    } else if (pastSection) {
      pastSection.style.display = 'none';
    }

    // Render trip ideas section
    if (ideasSection) {
      if (ideasCountEl) ideasCountEl.textContent = `${tripIdeas.length} idea${tripIdeas.length !== 1 ? 's' : ''}`;
      if (tripIdeas.length > 0) {
        ideasContent.innerHTML = tripIdeas.map(idea => this.renderIdeaItem(idea)).join('');
      } else {
        ideasContent.innerHTML = '<div class="itinerary-ideas-empty">No ideas yet. Add items without dates to save them as ideas.</div>';
      }
    }
  }

  renderDaySection(day, itemsByDate, availableDestinations, isMultiDestination, autoExpand) {
    const dayItems = itemsByDate[day.dateKey] || [];

    // Sort items by time
    dayItems.sort((a, b) => {
      const aDate = this.parseDate(a.startDate || a.date);
      const bDate = this.parseDate(b.startDate || b.date);
      return (aDate || 0) - (bDate || 0);
    });

    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const formattedDate = day.date.toLocaleDateString('en-US', dateOptions);
    const dateISO = day.date.toISOString().split('T')[0];
    const dayDestination = this.getDestinationForDay(day.date);

    // Auto-expand logic
    const shouldExpand = autoExpand && (day.isToday || dayItems.length > 0);

    // Build destination selector HTML
    let destinationHtml = '';
    if (dayDestination) {
      if (isMultiDestination) {
        destinationHtml = `
          <div class="itinerary-day-location-selector" onclick="event.stopPropagation();">
            <select class="itinerary-day-location-select" onchange="window.tripDetailManager.updateDestinationFromDay(new Date('${dateISO}'), this.value)">
              ${availableDestinations.map(dest => `
                <option value="${this.escapeHtml(dest)}" ${dest === dayDestination ? 'selected' : ''}>
                  ${this.escapeHtml(dest)}
                </option>
              `).join('')}
            </select>
            <span class="itinerary-day-location-text">in ${this.escapeHtml(dayDestination)}</span>
            <svg class="itinerary-day-location-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>`;
      } else {
        destinationHtml = `<span class="itinerary-day-location">in ${this.escapeHtml(dayDestination)}</span>`;
      }
    }

    return `
      <div class="itinerary-day${shouldExpand ? ' expanded' : ''}${day.isToday ? ' today' : ''}${day.isPast ? ' past' : ''}" data-date="${day.dateKey}">
        <div class="itinerary-day-header" onclick="window.tripDetailManager.toggleItineraryDay(this)">
          <div class="itinerary-day-chevron">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
          <div class="itinerary-day-badge">Day ${day.dayNumber}</div>
          <div class="itinerary-day-info">
            <span class="itinerary-day-date">${formattedDate}</span>
            ${destinationHtml}
          </div>
          <button class="itinerary-day-add-btn" onclick="event.stopPropagation(); window.tripDetailManager.openAddItemForDay('${dateISO}')" title="Add item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>
        <div class="itinerary-day-items">
          ${dayItems.length > 0
            ? dayItems.map((item, idx) => {
                const nextItem = idx < dayItems.length - 1 ? dayItems[idx + 1] : null;
                const isLast = idx === dayItems.length - 1;
                return this.renderItineraryItemWithGap(item, item._originalIndex, day.date, nextItem, isLast);
              }).join('')
            : `<div class="itinerary-day-empty">No items planned</div>`
          }
        </div>
      </div>
    `;
  }

  renderItineraryFilterChips() {
    const container = document.getElementById('itinerary-filters');
    if (!container) return;

    if (!this.activeItineraryFilters) {
      this.activeItineraryFilters = ['all'];
    }

    const filterTypes = [
      { type: 'all', label: 'All', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>' },
      { type: 'accommodation', label: 'Hotel', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21V8a2 2 0 012-2h14a2 2 0 012 2v13"/><path d="M3 11h18"/><path d="M12 11v10"/></svg>', color: '#b399d9' },
      { type: 'activity', label: 'Activity', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="3"/><path d="M12 22V8M5 12h14"/></svg>', color: '#f2b380' },
      { type: 'food', label: 'Food', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>', color: '#80cc99' },
      { type: 'travel', label: 'Travel', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>', color: '#80b3e6' },
      { type: 'other', label: 'Other', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>', color: '#a6a6ad' }
    ];

    container.innerHTML = filterTypes.map(filter => {
      const isActive = this.activeItineraryFilters.includes(filter.type);
      const colorStyle = filter.color && isActive ? `style="color: ${filter.color}; border-color: ${filter.color}40;"` : '';
      return `
        <button class="itinerary-filter-chip${isActive ? ' active' : ''}" data-type="${filter.type}" ${colorStyle} onclick="window.tripDetailManager.toggleItineraryFilter('${filter.type}')">
          ${filter.icon}
          <span>${filter.label}</span>
        </button>
      `;
    }).join('');
  }

  renderIdeaItem(idea) {
    const category = idea.category || idea.type || 'other';
    const icon = this.getItineraryIcon(category);

    return `
      <div class="itinerary-idea-item itinerary-item-${category.toLowerCase()}" data-item-id="${idea.id || idea._originalIndex}" onclick="window.tripDetailManager.openItemDetail('${idea.id || idea._originalIndex}')">
        <div class="itinerary-item-icon-wrap">
          ${icon}
        </div>
        <div class="itinerary-item-content">
          <div class="itinerary-item-title">${this.escapeHtml(idea.name || idea.title || 'Untitled')}</div>
          <div class="itinerary-item-subtitle">${this.escapeHtml((idea.category || idea.type || 'Other').charAt(0).toUpperCase() + (idea.category || idea.type || 'Other').slice(1))}</div>
        </div>
        <div class="itinerary-item-chevron">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </div>
    `;
  }

  toggleItineraryFilter(type) {
    if (!this.activeItineraryFilters) {
      this.activeItineraryFilters = ['all'];
    }

    if (type === 'all') {
      this.activeItineraryFilters = ['all'];
    } else {
      // Remove 'all' if selecting specific filter
      this.activeItineraryFilters = this.activeItineraryFilters.filter(f => f !== 'all');

      if (this.activeItineraryFilters.includes(type)) {
        this.activeItineraryFilters = this.activeItineraryFilters.filter(f => f !== type);
      } else {
        this.activeItineraryFilters.push(type);
      }

      // If no filters selected, default to 'all'
      if (this.activeItineraryFilters.length === 0) {
        this.activeItineraryFilters = ['all'];
      }
    }

    this.renderItinerary();
  }

  toggleAllDays() {
    const days = document.querySelectorAll('.itinerary-day');
    const allExpanded = Array.from(days).every(d => d.classList.contains('expanded'));

    days.forEach(day => {
      if (allExpanded) {
        day.classList.remove('expanded');
      } else {
        day.classList.add('expanded');
      }
    });

    // Update button icon
    const btn = document.getElementById('itinerary-expand-btn');
    if (btn) {
      btn.classList.toggle('collapsed', allExpanded);
    }
  }

  togglePastDays() {
    const section = document.getElementById('itinerary-past-section');
    if (section) {
      section.classList.toggle('expanded');
    }
  }

  toggleTripIdeas() {
    const section = document.getElementById('itinerary-ideas-section');
    if (section) {
      section.classList.toggle('expanded');
    }
  }

  openAddIdeaModal() {
    // Open add item modal without a date (creates an idea)
    this.selectedAddDate = null;
    const modal = document.getElementById('add-item-type-modal');
    const dateEl = document.getElementById('add-item-modal-date');

    if (modal) {
      modal.classList.add('active');
      if (dateEl) {
        dateEl.textContent = 'Trip Idea (no date)';
      }
    }
  }

  openItemDetail(itemId) {
    // Find the item
    const items = this.trip.itineraryItems || [];
    const item = items.find(i => (i.id || i._originalIndex) == itemId);
    if (!item) return;

    this.currentDetailItem = item;
    this.currentDetailItemId = itemId;

    // Build the detail modal content
    const modal = document.getElementById('item-detail-modal');
    if (!modal) {
      this.createItemDetailModal();
    }

    this.renderItemDetailContent(item);
    document.getElementById('item-detail-modal')?.classList.add('active');
  }

  createItemDetailModal() {
    const modalHtml = `
      <div class="itinerary-modal-overlay" id="item-detail-modal" onclick="if(event.target === this) window.tripDetailManager.closeItemDetail()">
        <div class="itinerary-modal item-detail-modal">
          <div class="itinerary-modal-header">
            <button class="itinerary-modal-back" onclick="window.tripDetailManager.closeItemDetail()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <h3 class="itinerary-modal-title" id="item-detail-title">Item Details</h3>
            <button class="itinerary-modal-action" onclick="window.tripDetailManager.editCurrentItem()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>
          <div class="itinerary-modal-content" id="item-detail-content">
            <!-- Content injected dynamically -->
          </div>
          <div class="item-detail-actions">
            <button class="item-detail-delete-btn" onclick="window.tripDetailManager.deleteCurrentItem()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
              Delete Item
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  renderItemDetailContent(item) {
    const content = document.getElementById('item-detail-content');
    const titleEl = document.getElementById('item-detail-title');
    if (!content) return;

    const category = item.category || item.type || 'other';
    const icon = this.getItineraryIcon(category);

    titleEl.textContent = item.name || item.title || 'Untitled';

    // Format dates
    const startDate = this.parseDate(item.startDate || item.date);
    const endDate = this.parseDate(item.endDate);
    const dateStr = startDate ? startDate.toLocaleDateString('en-US', {
      weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'
    }) : '';
    const timeStr = startDate ? startDate.toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit'
    }) : '';

    // Build detail rows
    let detailsHtml = '';

    // Date & Time
    if (dateStr || timeStr) {
      detailsHtml += `
        <div class="item-detail-row">
          <div class="item-detail-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div class="item-detail-info">
            <span class="item-detail-label">Date & Time</span>
            <span class="item-detail-value">${dateStr}${timeStr ? ` at ${timeStr}` : ''}</span>
          </div>
        </div>
      `;
    }

    // Location
    const location = item.location || item.fromLocation || item.toLocation;
    if (location) {
      detailsHtml += `
        <div class="item-detail-row clickable" onclick="window.tripDetailManager.openItemInMaps('${this.escapeHtml(location)}')">
          <div class="item-detail-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div class="item-detail-info">
            <span class="item-detail-label">Location</span>
            <span class="item-detail-value">${this.escapeHtml(location)}</span>
          </div>
          <svg class="item-detail-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      `;
    }

    // Travel-specific: From → To
    if (item.fromLocation && item.toLocation) {
      detailsHtml += `
        <div class="item-detail-row">
          <div class="item-detail-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="5" cy="6" r="3"/><circle cx="19" cy="18" r="3"/>
              <path d="M5 9v12h14V6"/>
            </svg>
          </div>
          <div class="item-detail-info">
            <span class="item-detail-label">Route</span>
            <span class="item-detail-value">${this.escapeHtml(item.fromLocation)} → ${this.escapeHtml(item.toLocation)}</span>
          </div>
        </div>
      `;
    }

    // Flight number
    if (item.flightNumber || item.travelDetails?.flightNumber) {
      const flightNum = item.flightNumber || item.travelDetails?.flightNumber;
      detailsHtml += `
        <div class="item-detail-row">
          <div class="item-detail-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
          <div class="item-detail-info">
            <span class="item-detail-label">Flight Number</span>
            <span class="item-detail-value">${this.escapeHtml(flightNum)}</span>
          </div>
        </div>
      `;
    }

    // Confirmation number
    if (item.confirmationNumber || item.bookingRef) {
      detailsHtml += `
        <div class="item-detail-row">
          <div class="item-detail-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div class="item-detail-info">
            <span class="item-detail-label">Confirmation</span>
            <span class="item-detail-value">${this.escapeHtml(item.confirmationNumber || item.bookingRef)}</span>
          </div>
        </div>
      `;
    }

    // Cost
    if (item.cost || item.price) {
      const cost = item.cost || item.price;
      const currency = item.currency || this.trip.currency || 'USD';
      detailsHtml += `
        <div class="item-detail-row">
          <div class="item-detail-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
          </div>
          <div class="item-detail-info">
            <span class="item-detail-label">Cost</span>
            <span class="item-detail-value">${currency} ${parseFloat(cost).toFixed(2)}</span>
          </div>
        </div>
      `;
    }

    // Website
    if (item.website || item.url) {
      const url = item.website || item.url;
      detailsHtml += `
        <div class="item-detail-row clickable" onclick="window.open('${this.escapeHtml(url)}', '_blank')">
          <div class="item-detail-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
            </svg>
          </div>
          <div class="item-detail-info">
            <span class="item-detail-label">Website</span>
            <span class="item-detail-value link">${this.escapeHtml(url)}</span>
          </div>
          <svg class="item-detail-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      `;
    }

    // Notes
    if (item.notes) {
      detailsHtml += `
        <div class="item-detail-row notes">
          <div class="item-detail-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div class="item-detail-info">
            <span class="item-detail-label">Notes</span>
            <span class="item-detail-value">${this.escapeHtml(item.notes)}</span>
          </div>
        </div>
      `;
    }

    // Category badge
    const categoryName = this.getItineraryTypeName(category);
    const categoryColor = this.getCategoryColor(category);

    content.innerHTML = `
      <div class="item-detail-header">
        <div class="item-detail-type-badge" style="background: ${categoryColor}15; color: ${categoryColor};">
          ${icon}
          <span>${categoryName}</span>
        </div>
      </div>
      <div class="item-detail-rows">
        ${detailsHtml || '<p class="item-detail-empty">No additional details</p>'}
      </div>
    `;
  }

  getCategoryColor(category) {
    const colors = {
      'accommodation': '#b399d9',
      'hotel': '#b399d9',
      'activity': '#f2b380',
      'food': '#80cc99',
      'restaurant': '#80cc99',
      'travel': '#80b3e6',
      'flight': '#80b3e6',
      'transport': '#80b3e6',
      'other': '#a6a6ad',
      'event': '#a6a6ad'
    };
    return colors[category?.toLowerCase()] || '#a6a6ad';
  }

  closeItemDetail() {
    document.getElementById('item-detail-modal')?.classList.remove('active');
    this.currentDetailItem = null;
    this.currentDetailItemId = null;
  }

  editCurrentItem() {
    // Close detail modal and open edit form (for future implementation)
    this.closeItemDetail();
    this.showToast('Edit feature coming soon');
  }

  deleteCurrentItem() {
    if (!this.currentDetailItemId) return;

    if (confirm('Are you sure you want to delete this item?')) {
      this.deleteItineraryItem(this.currentDetailItemId);
      this.closeItemDetail();
    }
  }

  openAddItemForDay(dateStr) {
    // Store the selected date and open the type selector
    this.selectedAddDate = new Date(dateStr);

    const modal = document.getElementById('add-item-type-modal');
    const dateEl = document.getElementById('add-item-modal-date');

    if (modal) {
      modal.classList.add('active');

      // Set the date display
      if (dateEl) {
        const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
        dateEl.textContent = this.selectedAddDate.toLocaleDateString('en-US', options);
      }
    }
  }

  renderItineraryFilters(container, items) {
    // Check if filters already exist
    let filtersEl = container.querySelector('.itinerary-filters');
    if (filtersEl) return; // Already rendered

    // Get unique categories from items
    const categories = new Set();
    if (items) {
      items.forEach(item => {
        const cat = (item.category || item.type || 'event').toLowerCase();
        categories.add(cat);
      });
    }

    // Define filter options with icons
    const filterOptions = [
      { type: 'all', label: 'All', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' },
      { type: 'activity', label: 'Activity', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/></svg>' },
      { type: 'hotel', label: 'Hotel', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/></svg>' },
      { type: 'restaurant', label: 'Food', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>' },
      { type: 'flight', label: 'Flight', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>' },
      { type: 'transport', label: 'Transport', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>' },
      { type: 'event', label: 'Event', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>' }
    ];

    // Create filters HTML
    filtersEl = document.createElement('div');
    filtersEl.className = 'itinerary-filters';
    filtersEl.innerHTML = filterOptions.map(opt => `
      <button class="itinerary-filter-chip${opt.type === 'all' ? ' active' : ''}" data-type="${opt.type}" onclick="window.tripDetailManager.toggleItineraryFilter('${opt.type}')">
        ${opt.icon}
        <span>${opt.label}</span>
      </button>
    `).join('');

    // Insert before the add form
    const addForm = container.querySelector('.add-itinerary-form');
    if (addForm) {
      container.insertBefore(filtersEl, addForm);
    } else {
      container.prepend(filtersEl);
    }
  }

  getActiveItineraryFilters() {
    const activeChips = document.querySelectorAll('.itinerary-filter-chip.active');
    const filters = Array.from(activeChips).map(chip => chip.dataset.type);
    return filters.includes('all') ? [] : filters;
  }

  toggleItineraryDay(header) {
    const dayEl = header.closest('.itinerary-day');
    if (dayEl) {
      dayEl.classList.toggle('expanded');
    }
  }

  renderItineraryItemWithGap(item, index, displayDate, nextItem, isLast) {
    const category = item.category || item.type || 'other';
    const cat = category.toLowerCase();

    // Check if this is a flight - use special flight card
    const isFlightItem = cat === 'travel' || cat === 'flight';
    const travelMode = item.travelMode || item.travelDetails?.travelMode || '';
    const isFlight = isFlightItem && (travelMode === 'flight' || item.flightNumber || item.travelDetails?.flightNumber);

    let itemHtml = '';
    if (isFlight) {
      itemHtml = this.renderFlightCard(item, index, displayDate);
    } else {
      itemHtml = this.renderItineraryItem(item, index, displayDate);
    }

    // Calculate time gap to next item
    let gapHtml = '';
    if (nextItem && !isLast) {
      const gap = this.calculateTimeGap(item, nextItem);
      if (gap) {
        gapHtml = `
          <div class="itinerary-time-gap">
            <div class="itinerary-time-gap-line"></div>
            <div class="itinerary-time-gap-content">
              <span class="itinerary-time-gap-duration">${gap.displayString}</span>
              <svg class="itinerary-time-gap-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </div>
          </div>
        `;
      } else {
        // Just show arrow without time
        gapHtml = `
          <div class="itinerary-time-gap minimal">
            <svg class="itinerary-time-gap-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </div>
        `;
      }
    }

    return itemHtml + gapHtml;
  }

  renderFlightCard(item, index, displayDate) {
    const flightNumber = item.flightNumber || item.travelDetails?.flightNumber || '';
    const airline = item.airline || item.carrier || item.travelDetails?.airline || '';
    const fromLocation = item.fromLocation || item.travelDetails?.fromLocation || '';
    const toLocation = item.toLocation || item.travelDetails?.toLocation || '';

    const departureTime = this.parseDate(item.departureTime || item.travelDetails?.departureTime || item.startDate || item.date);
    const arrivalTime = this.parseDate(item.arrivalTime || item.travelDetails?.arrivalTime || item.endDate);

    const depTimeStr = departureTime ? departureTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '';
    const arrTimeStr = arrivalTime ? arrivalTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '';

    // Calculate flight duration
    let durationStr = '';
    if (departureTime && arrivalTime) {
      const diffMs = arrivalTime - departureTime;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      if (hours > 0) {
        durationStr = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
      } else {
        durationStr = `${mins}m`;
      }
    }

    // Check if arrival is next day
    const isNextDay = departureTime && arrivalTime &&
      departureTime.toDateString() !== arrivalTime.toDateString();

    // Extract airport codes (first 3 uppercase letters)
    const depCode = fromLocation.match(/^[A-Z]{3}/)?.[0] || fromLocation.split(/[,\s]/)[0].substring(0, 3).toUpperCase();
    const arrCode = toLocation.match(/^[A-Z]{3}/)?.[0] || toLocation.split(/[,\s]/)[0].substring(0, 3).toUpperCase();

    // Get terminal and gate info if available
    const depTerminal = item.depTerminal || item.travelDetails?.depTerminal || '';
    const depGate = item.depGate || item.travelDetails?.depGate || '';
    const arrTerminal = item.arrTerminal || item.travelDetails?.arrTerminal || '';
    const arrBaggage = item.arrBaggage || item.travelDetails?.arrBaggage || '';

    // Determine context (departing or arriving based on display date)
    const displayDateStart = new Date(displayDate);
    displayDateStart.setHours(0, 0, 0, 0);
    const depDateStart = departureTime ? new Date(departureTime) : null;
    if (depDateStart) depDateStart.setHours(0, 0, 0, 0);
    const arrDateStart = arrivalTime ? new Date(arrivalTime) : null;
    if (arrDateStart) arrDateStart.setHours(0, 0, 0, 0);

    let contextLabel = '';
    if (isNextDay && arrDateStart && displayDateStart.getTime() === arrDateStart.getTime()) {
      contextLabel = 'Arriving';
    } else if (depDateStart && displayDateStart.getTime() === depDateStart.getTime()) {
      contextLabel = 'Departing';
    }

    return `
      <div class="flight-card" data-item-id="${item.id || index}" onclick="window.tripDetailManager.openItemDetail('${item.id || index}')">
        <div class="flight-card-header">
          <div class="flight-card-live-badge">
            <span class="flight-live-dot"></span>
            <span>Live</span>
          </div>
          ${flightNumber ? `<span class="flight-card-number">${this.escapeHtml(flightNumber)}</span>` : ''}
          <span class="flight-card-status scheduled">Scheduled</span>
        </div>

        <div class="flight-card-route">
          <div class="flight-card-endpoint departure">
            <div class="flight-card-code">${this.escapeHtml(depCode)}</div>
            ${fromLocation && fromLocation !== depCode ? `<div class="flight-card-city">${this.escapeHtml(fromLocation.split(',')[0])}</div>` : ''}
            ${depTimeStr ? `<div class="flight-card-time">${depTimeStr}</div>` : ''}
          </div>

          <div class="flight-card-path">
            <svg class="flight-card-plane" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
            ${durationStr ? `<div class="flight-card-duration">${durationStr}</div>` : ''}
          </div>

          <div class="flight-card-endpoint arrival">
            <div class="flight-card-code-wrap">
              <span class="flight-card-code">${this.escapeHtml(arrCode)}</span>
              ${isNextDay ? '<span class="flight-card-next-day">+1</span>' : ''}
            </div>
            ${toLocation && toLocation !== arrCode ? `<div class="flight-card-city">${this.escapeHtml(toLocation.split(',')[0])}</div>` : ''}
            ${arrTimeStr ? `<div class="flight-card-time">${arrTimeStr}</div>` : ''}
          </div>
        </div>

        ${(depTerminal || depGate || arrTerminal || arrBaggage) ? `
          <div class="flight-card-details">
            <div class="flight-card-detail-group left">
              ${depTerminal ? `<span class="flight-detail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>T${depTerminal}</span>` : ''}
              ${depGate ? `<span class="flight-detail gate"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 4h3a2 2 0 012 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 01-1.242.97L5 20V5.562a2 2 0 011.515-1.94l4-1A2 2 0 0113 4.561z"/></svg>Gate ${depGate}</span>` : ''}
            </div>
            <div class="flight-card-detail-group right">
              ${arrTerminal ? `<span class="flight-detail">T${arrTerminal}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg></span>` : ''}
              ${arrBaggage ? `<span class="flight-detail baggage">Belt ${arrBaggage}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 20h0a2 2 0 01-2-2V8a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2h0"/><path d="M8 18V4a2 2 0 012-2h4a2 2 0 012 2v14"/><path d="M10 20h4"/><circle cx="16" cy="20" r="2"/><circle cx="8" cy="20" r="2"/></svg></span>` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderItineraryItem(item, index, displayDate) {
    const startDate = this.parseDate(item.startDate || item.date);
    const endDate = this.parseDate(item.endDate || item.checkOutTime || item.arrivalTime);
    const category = item.category || item.type || 'other';
    const icon = this.getItineraryIcon(category);

    // Get context-aware display info
    const displayInfo = this.getItemDisplayInfo(item, displayDate);

    return `
      <div class="itinerary-item itinerary-item-${category.toLowerCase()}" data-item-id="${item.id || index}" onclick="window.tripDetailManager.openItemDetail('${item.id || index}')">
        <div class="itinerary-item-icon-wrap">
          ${icon}
        </div>
        <div class="itinerary-item-content">
          <div class="itinerary-item-title">${this.escapeHtml(item.name || item.title || 'Untitled')}</div>
          ${displayInfo.subtitle ? `<div class="itinerary-item-subtitle">${displayInfo.subtitle}</div>` : ''}
        </div>
        ${displayInfo.timeLabel ? `<div class="itinerary-item-time">${displayInfo.timeLabel}</div>` : ''}
        <div class="itinerary-item-chevron">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </div>
    `;
  }

  getItemDisplayInfo(item, displayDate) {
    const category = (item.category || item.type || 'other').toLowerCase();
    const calendar = new Date(displayDate);
    calendar.setHours(0, 0, 0, 0);

    // For accommodations - show check-in/check-out/staying
    if (category === 'accommodation' || category === 'hotel') {
      const checkIn = this.parseDate(item.checkInTime || item.startDate || item.date);
      const checkOut = this.parseDate(item.checkOutTime || item.endDate);

      if (checkIn) {
        const checkInDay = new Date(checkIn);
        checkInDay.setHours(0, 0, 0, 0);

        if (checkInDay.getTime() === calendar.getTime()) {
          return {
            subtitle: 'Check-in',
            timeLabel: checkIn.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          };
        }
      }

      if (checkOut) {
        const checkOutDay = new Date(checkOut);
        checkOutDay.setHours(0, 0, 0, 0);

        if (checkOutDay.getTime() === calendar.getTime()) {
          return {
            subtitle: 'Check-out',
            timeLabel: checkOut.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          };
        }
      }

      // Middle day - staying here
      return {
        subtitle: 'Staying here',
        timeLabel: null
      };
    }

    // For travel items - show departing/arriving
    if (category === 'travel' || category === 'transport') {
      const departure = this.parseDate(item.departureTime || item.travelDetails?.departureTime || item.startDate || item.date);
      const arrival = this.parseDate(item.arrivalTime || item.travelDetails?.arrivalTime || item.endDate);

      if (departure && arrival) {
        const depDay = new Date(departure);
        depDay.setHours(0, 0, 0, 0);
        const arrDay = new Date(arrival);
        arrDay.setHours(0, 0, 0, 0);

        // Overnight travel
        if (depDay.getTime() !== arrDay.getTime()) {
          if (depDay.getTime() === calendar.getTime()) {
            return {
              subtitle: 'Departing',
              timeLabel: departure.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            };
          } else if (arrDay.getTime() === calendar.getTime()) {
            return {
              subtitle: 'Arriving',
              timeLabel: arrival.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            };
          }
        }
      }

      // Regular travel item
      const time = departure || this.parseDate(item.startDate || item.date);
      const location = item.fromLocation || item.travelDetails?.fromLocation;
      const toLocation = item.toLocation || item.travelDetails?.toLocation;
      const routeStr = location && toLocation ? `${location} → ${toLocation}` : (location || toLocation || '');

      return {
        subtitle: routeStr || item.location || null,
        timeLabel: time ? time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : null
      };
    }

    // For activities/food/other - show time range
    const startTime = this.parseDate(item.startTime || item.startDate || item.date);
    const endTime = this.parseDate(item.endTime || item.endDate);

    let subtitle = item.location || item.notes || null;
    let timeLabel = null;

    if (startTime) {
      timeLabel = startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      if (endTime && endTime > startTime) {
        const endStr = endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        subtitle = `${timeLabel} - ${endStr}` + (subtitle ? ` · ${subtitle}` : '');
        // Don't double show time
        timeLabel = startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      }
    }

    return { subtitle, timeLabel };
  }

  calculateTimeGap(fromItem, toItem) {
    // Get end time of first item
    const fromEnd = this.parseDate(
      fromItem.endTime || fromItem.arrivalTime || fromItem.travelDetails?.arrivalTime ||
      fromItem.checkOutTime || fromItem.endDate || fromItem.startDate || fromItem.date
    );

    // Get start time of next item
    const toStart = this.parseDate(
      toItem.startTime || toItem.departureTime || toItem.travelDetails?.departureTime ||
      toItem.checkInTime || toItem.startDate || toItem.date
    );

    if (!fromEnd || !toStart) return null;

    const diffMs = toStart - fromEnd;
    if (diffMs <= 0) return null;

    const minutes = Math.floor(diffMs / (1000 * 60));
    if (minutes < 5) return null; // Don't show gaps less than 5 minutes

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    let displayString;
    if (hours > 0) {
      displayString = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    } else {
      displayString = `${mins}m`;
    }

    return { minutes, displayString };
  }

  getItineraryTypeName(category) {
    const names = {
      'flight': 'Flight',
      'hotel': 'Hotel',
      'accommodation': 'Hotel',
      'restaurant': 'Food',
      'food': 'Food',
      'activity': 'Activity',
      'transport': 'Transport',
      'travel': 'Travel',
      'event': 'Event',
      'other': 'Other'
    };
    return names[category?.toLowerCase()] || 'Event';
  }

  openItemInMaps(location) {
    if (!location) return;
    const query = encodeURIComponent(location);
    // Try to open in Google Maps first, fall back to Apple Maps
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  }

  getItineraryIcon(category) {
    const icons = {
      'flight': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>',
      'hotel': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/></svg>',
      'accommodation': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/></svg>',
      'restaurant': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>',
      'food': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>',
      'activity': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/></svg>',
      'transport': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>',
      'travel': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>',
      'event': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>',
      'other': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>'
    };
    return icons[category?.toLowerCase()] || icons.event;
  }

  renderPackingList() {
    const items = this.trip.packingItems;
    const container = document.getElementById('packing-categories');
    const emptyState = document.getElementById('packing-empty');

    if (!items || items.length === 0) {
      emptyState.style.display = 'flex';
      container.innerHTML = '';
      return;
    }

    emptyState.style.display = 'none';

    // Group items by category
    const itemsByCategory = {};
    items.forEach((item, index) => {
      const category = item.category || 'Other';
      if (!itemsByCategory[category]) {
        itemsByCategory[category] = [];
      }
      itemsByCategory[category].push({ ...item, originalIndex: index });
    });

    // Render categories
    container.innerHTML = Object.entries(itemsByCategory).map(([category, categoryItems]) => {
      const packedCount = categoryItems.filter(i => i.isPacked).length;
      const totalCount = categoryItems.length;

      return `
        <div class="packing-category">
          <div class="packing-category-header">
            <span class="packing-category-icon">${this.getCategoryIcon(category)}</span>
            <h3>${this.escapeHtml(category)}</h3>
            <span class="packing-category-count">${packedCount}/${totalCount}</span>
          </div>
          <div class="packing-items">
            ${categoryItems.map(item => this.renderPackingItem(item)).join('')}
          </div>
        </div>
      `;
    }).join('');

    // Add click handlers to packing items
    this.setupPackingItemClickHandlers();
  }

  renderPackingItem(item) {
    const isPacked = item.isPacked || false;
    const quantity = item.quantity || 1;

    return `
      <div class="packing-item ${isPacked ? 'packed' : ''}" data-index="${item.originalIndex}">
        <div class="packing-item-check">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${isPacked ? '<path d="M20 6L9 17l-5-5"/>' : '<circle cx="12" cy="12" r="10"/>'}
          </svg>
        </div>
        <span class="packing-item-name">${this.escapeHtml(item.name)}</span>
        <div class="packing-item-qty-controls">
          <button class="qty-btn qty-minus" data-index="${item.originalIndex}" onclick="event.stopPropagation(); window.tripDetailManager.adjustPackingQuantity(${item.originalIndex}, -1)">−</button>
          <span class="packing-item-qty">${quantity}</span>
          <button class="qty-btn qty-plus" data-index="${item.originalIndex}" onclick="event.stopPropagation(); window.tripDetailManager.adjustPackingQuantity(${item.originalIndex}, 1)">+</button>
        </div>
        <button class="packing-item-delete" onclick="event.stopPropagation(); window.tripDetailManager.deletePackingItem(${item.originalIndex})" title="Delete">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `;
  }

  setupPackingItemClickHandlers() {
    const packingItems = document.querySelectorAll('.packing-item');
    packingItems.forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index, 10);
        this.togglePackingItem(index);
      });
    });
  }

  async togglePackingItem(index) {
    if (!this.trip.packingItems[index]) return;

    // Toggle the isPacked state
    this.trip.packingItems[index].isPacked = !this.trip.packingItems[index].isPacked;

    // Re-render the list
    this.renderPackingList();

    // Save to Firestore
    await this.savePackingItemsToFirestore();
  }

  async savePackingItemsToFirestore() {
    if (!this.userId || !this.tripId) return;

    try {
      const db = firebase.firestore();
      await db
        .collection('users')
        .doc(this.userId)
        .collection('trips')
        .doc(this.tripId)
        .update({
          packingItems: this.trip.packingItems,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      console.log('Packing items saved to Firestore');
    } catch (error) {
      console.error('Error saving packing items:', error);
    }
  }

  async deletePackingItem(index) {
    if (!this.trip.packingItems[index]) return;

    // Remove item from array
    this.trip.packingItems.splice(index, 1);

    // Re-render the list
    this.renderPackingList();

    // Save to Firestore
    await this.savePackingItemsToFirestore();

    this.showToast('Item removed');
  }

  async adjustPackingQuantity(index, delta) {
    if (!this.trip.packingItems[index]) return;

    const currentQty = this.trip.packingItems[index].quantity || 1;
    const newQty = Math.max(1, currentQty + delta); // Minimum 1

    this.trip.packingItems[index].quantity = newQty;

    // Re-render the list
    this.renderPackingList();

    // Save to Firestore
    await this.savePackingItemsToFirestore();
  }

  getCategoryIcon(category) {
    const icons = {
      'Clothing': '👕',
      'Toiletries': '🧴',
      'Electronics': '📱',
      'Documents': '📄',
      'Health': '💊',
      'Accessories': '🎒',
      'Shoes': '👟',
      'Other': '📦'
    };
    return icons[category] || icons.Other;
  }

  renderTodos() {
    const items = this.trip.todos;
    const container = document.getElementById('todos-list');
    const emptyState = document.getElementById('todos-empty');

    if (!items || items.length === 0) {
      emptyState.style.display = 'flex';
      container.innerHTML = '';
      return;
    }

    emptyState.style.display = 'none';

    // Sort: incomplete first, then by date, keeping track of original indices
    const indexedItems = items.map((item, index) => ({ ...item, originalIndex: index }));
    const sortedItems = [...indexedItems].sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      const aDate = this.parseDate(a.dueDate);
      const bDate = this.parseDate(b.dueDate);
      if (aDate && bDate) return aDate - bDate;
      if (aDate) return -1;
      if (bDate) return 1;
      return 0;
    });

    container.innerHTML = sortedItems.map(item => this.renderTodoItem(item)).join('');

    // Add click handlers to todo items
    this.setupTodoItemClickHandlers();
  }

  renderTodoItem(item) {
    const isCompleted = item.isCompleted || false;
    const dueDate = this.parseDate(item.dueDate);
    const dueDateStr = dueDate ? dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

    return `
      <div class="todo-item ${isCompleted ? 'completed' : ''}" data-index="${item.originalIndex}">
        <div class="todo-item-check">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${isCompleted ? '<path d="M20 6L9 17l-5-5"/>' : '<circle cx="12" cy="12" r="10"/>'}
          </svg>
        </div>
        <div class="todo-item-content">
          <span class="todo-item-title">${this.escapeHtml(item.title || item.name)}</span>
          ${item.notes ? `<span class="todo-item-notes">${this.escapeHtml(item.notes)}</span>` : ''}
        </div>
        ${dueDateStr ? `<span class="todo-item-due">${dueDateStr}</span>` : ''}
        <button class="todo-item-delete" onclick="event.stopPropagation(); window.tripDetailManager.deleteTodoItem(${item.originalIndex})" title="Delete">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `;
  }

  setupTodoItemClickHandlers() {
    const todoItems = document.querySelectorAll('.todo-item');
    todoItems.forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index, 10);
        this.toggleTodoItem(index);
      });
    });
  }

  async toggleTodoItem(index) {
    if (!this.trip.todos[index]) return;

    // Toggle the isCompleted state
    this.trip.todos[index].isCompleted = !this.trip.todos[index].isCompleted;

    // Re-render the list
    this.renderTodos();

    // Save to Firestore
    await this.saveTodosToFirestore();
  }

  async saveTodosToFirestore() {
    if (!this.userId || !this.tripId) return;

    try {
      const db = firebase.firestore();
      await db
        .collection('users')
        .doc(this.userId)
        .collection('trips')
        .doc(this.tripId)
        .update({
          todos: this.trip.todos,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      console.log('Todos saved to Firestore');
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  }

  async deleteTodoItem(index) {
    if (!this.trip.todos[index]) return;

    // Remove item from array
    this.trip.todos.splice(index, 1);

    // Re-render the list
    this.renderTodos();

    // Save to Firestore
    await this.saveTodosToFirestore();

    this.showToast('To-do removed');
  }

  renderBudget() {
    // Combine itinerary items with costs and standalone expenses
    const itineraryItemsWithCost = this.trip.itineraryItems.filter(item =>
      item.homeCurrencyAmount || item.currencyAmount
    );
    const expenses = this.trip.expenses || [];

    // Combine all items for display
    const allItems = [
      ...itineraryItemsWithCost.map(item => ({
        ...item,
        type: 'itinerary'
      })),
      ...expenses.map(item => ({
        ...item,
        type: 'expense'
      }))
    ];

    const container = document.getElementById('expenses-list');
    const emptyState = document.getElementById('budget-empty');
    const overview = document.getElementById('budget-overview');
    const totalAmountEl = document.getElementById('budget-total-amount');
    const breakdownEl = document.getElementById('budget-breakdown');

    if (allItems.length === 0) {
      emptyState.style.display = 'flex';
      overview.style.display = 'none';
      container.innerHTML = '';
      return;
    }

    emptyState.style.display = 'none';
    overview.style.display = 'block';

    // Calculate totals by category
    const totalsByCategory = {};
    let grandTotal = 0;

    allItems.forEach(item => {
      const amount = item.homeCurrencyAmount || item.currencyAmount || 0;
      const category = item.category || 'Other';
      totalsByCategory[category] = (totalsByCategory[category] || 0) + amount;
      grandTotal += amount;
    });

    // Update total
    const currency = this.trip.currency || 'USD';
    const currencySymbol = this.getCurrencySymbol(currency);
    totalAmountEl.textContent = `${currencySymbol}${grandTotal.toFixed(2)}`;

    // Render breakdown
    breakdownEl.innerHTML = Object.entries(totalsByCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount]) => `
        <div class="budget-category">
          <span class="budget-category-name">${this.escapeHtml(category)}</span>
          <span class="budget-category-amount">${currencySymbol}${amount.toFixed(2)}</span>
        </div>
      `).join('');

    // Render expense items sorted by date (newest first)
    const sortedItems = [...allItems].sort((a, b) => {
      const aDate = this.parseDate(a.startDate || a.date);
      const bDate = this.parseDate(b.startDate || b.date);
      return (bDate || 0) - (aDate || 0);
    });

    container.innerHTML = sortedItems.map((item, idx) => {
      const date = this.parseDate(item.startDate || item.date);
      const dateStr = date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
      const amount = item.homeCurrencyAmount || item.currencyAmount || 0;
      const isExpense = item.type === 'expense';

      return `
        <div class="expense-item" data-id="${item.id || idx}">
          <div class="expense-item-icon">${this.getExpenseIcon(item.category)}</div>
          <div class="expense-item-content">
            <span class="expense-item-name">${this.escapeHtml(item.name || item.title)}</span>
            <span class="expense-item-category">${this.escapeHtml(item.category || 'Other')}</span>
          </div>
          <div class="expense-item-right">
            <span class="expense-item-amount">${currencySymbol}${amount.toFixed(2)}</span>
            ${dateStr ? `<span class="expense-item-date">${dateStr}</span>` : ''}
          </div>
          ${isExpense ? `
            <button class="expense-item-delete" onclick="window.tripDetailManager.deleteExpense('${item.id}')" title="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  getCurrencySymbol(currency) {
    const symbols = {
      'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CHF': 'CHF ',
      'AUD': 'A$', 'CAD': 'C$', 'CNY': '¥', 'INR': '₹', 'KRW': '₩',
      'SGD': 'S$', 'THB': '฿', 'MXN': '$', 'BRL': 'R$', 'ZAR': 'R'
    };
    return symbols[currency] || '$';
  }

  getExpenseIcon(category) {
    const icons = {
      'Food': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>',
      'Transport': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>',
      'Accommodation': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/></svg>',
      'Activities': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/></svg>',
      'Shopping': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z"/></svg>',
      'Entertainment': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/></svg>',
      'Other': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>'
    };
    return icons[category] || icons.Other;
  }

  // ============================================
  // Trip Hub Suggestions
  // ============================================

  async renderSuggestions() {
    const phase = this.getTripPhase();

    // Don't show suggestions for past trips
    if (phase === 'past') return;

    const container = document.getElementById('trip-suggestions-section');
    if (!container) return;

    const config = await window.tripHubConfigService.loadConfiguration(this.tripId);
    const isPremium = await this.checkPremiumStatus();

    const suggestions = [];

    // Email Import (Premium only) - Show first
    if (isPremium && await this.shouldShowSuggestion('emailImport', config)) {
      suggestions.push(this.renderEmailImportCard(config, isPremium));
    }

    // eSIM Recommendation
    if (this.needsESIM() && await this.shouldShowSuggestion('esim', config)) {
      suggestions.push(this.renderESIMCard(config));
    }

    // Asia Transport
    if (this.isAsiaDestination() && await this.shouldShowSuggestion('asiatransport', config)) {
      suggestions.push(this.renderAsiaTransportCard(config));
    }

    // Airport Transfer
    if (await this.shouldShowSuggestion('airportTransfer', config)) {
      suggestions.push(this.renderAirportTransferCard(config));
    }

    // Render all suggestions
    if (suggestions.length > 0) {
      container.innerHTML = suggestions.join('');
      container.style.display = 'block';

      // Setup event listeners
      this.setupSuggestionEventListeners(config);
    } else {
      container.style.display = 'none';
    }

    // Render companions section separately
    await this.renderCompanionsSection(config, isPremium);
  }

  async shouldShowSuggestion(suggestionId, config) {
    // Check if dismissed
    if (config.dismissedSuggestions && config.dismissedSuggestions.includes(suggestionId)) {
      // Check if reminder is due
      const isDue = await window.tripHubConfigService.clearReminderIfDue(this.tripId, suggestionId);
      if (!isDue) return false;

      // Reload config after clearing reminder
      const updatedConfig = await window.tripHubConfigService.loadConfiguration(this.tripId);
      return !updatedConfig.dismissedSuggestions.includes(suggestionId);
    }
    return true;
  }

  needsESIM() {
    // Check if trip is international (this is a simple check - you might want to make it more sophisticated)
    if (!this.trip.destination) return false;

    // For now, assume any trip with a destination is potentially international
    // You can add more sophisticated logic here (e.g., check against user's home country)
    return true;
  }

  isAsiaDestination() {
    if (!this.trip.destination) return false;

    const asiaCountries = ['Japan', 'Korea', 'China', 'Thailand', 'Vietnam', 'Indonesia',
      'Malaysia', 'Singapore', 'Philippines', 'Taiwan', 'Hong Kong', 'India', 'Nepal',
      'Sri Lanka', 'Myanmar', 'Cambodia', 'Laos', 'Bangladesh', 'Pakistan', 'JP', 'KR',
      'CN', 'TH', 'VN', 'ID', 'MY', 'SG', 'PH', 'TW', 'HK', 'IN', 'NP', 'LK', 'MM', 'KH', 'LA', 'BD', 'PK'];

    const dest = this.trip.destination.toUpperCase();
    return asiaCountries.some(country => dest.includes(country.toUpperCase()));
  }

  renderESIMCard(config) {
    const esimState = config.esimState || 'notPurchased';

    const stateConfig = {
      notPurchased: {
        icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>',
        title: 'Stay Connected with eSIM',
        subtitle: 'Get instant mobile data without changing SIM cards',
        actionText: 'Buy eSIM',
        actionClass: 'primary',
        iconClass: 'esim-default'
      },
      purchased: {
        icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>',
        title: 'eSIM Purchased',
        subtitle: 'Install your eSIM before departure',
        actionText: 'Mark as Installed',
        actionClass: 'success',
        iconClass: 'esim-purchased'
      },
      installed: {
        icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>',
        title: 'eSIM Installed',
        subtitle: 'Activate when you arrive',
        actionText: 'Mark as Activated',
        actionClass: 'success',
        iconClass: 'esim-installed'
      },
      activated: {
        icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
        title: 'All Set!',
        subtitle: 'Your eSIM is active',
        actionText: null,
        actionClass: null,
        iconClass: 'esim-activated'
      }
    };

    const state = stateConfig[esimState];

    return `
      <div class="suggestion-card esim" data-suggestion-id="esim">
        <div class="suggestion-card-header">
          <div class="suggestion-card-icon ${state.iconClass}">${state.icon}</div>
          <div class="suggestion-card-text">
            <h3>${state.title}</h3>
            <p>${state.subtitle}</p>
          </div>
          ${esimState !== 'activated' ? `
            <button class="suggestion-card-menu-btn" data-suggestion-id="esim">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
              </svg>
            </button>
            <div class="suggestion-card-menu" data-suggestion-id="esim">
              <button class="suggestion-menu-item dismiss" data-action="dismiss" data-suggestion-id="esim">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                </svg>
                Hide
              </button>
              <button class="suggestion-menu-item remind" data-action="remind" data-suggestion-id="esim">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                Remind me in a week
              </button>
            </div>
          ` : ''}
        </div>
        ${state.actionText ? `
          <button class="suggestion-card-action ${state.actionClass}" onclick="window.tripDetailManager.handleESIMAction('${esimState}')">
            <span>${state.actionText}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        ` : ''}
      </div>
    `;
  }

  renderAsiaTransportCard(config) {
    return `
      <div class="suggestion-card transport" data-suggestion-id="asiatransport">
        <div class="suggestion-card-header">
          <div class="suggestion-card-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
          </div>
          <div class="suggestion-card-text">
            <h3>Asia Transport Pass</h3>
            <p>Save on trains, buses & ferries across Asia</p>
          </div>
          <button class="suggestion-card-menu-btn" data-suggestion-id="asiatransport">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
            </svg>
          </button>
          <div class="suggestion-card-menu" data-suggestion-id="asiatransport">
            <button class="suggestion-menu-item dismiss" data-action="dismiss" data-suggestion-id="asiatransport">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
              </svg>
              Hide
            </button>
            <button class="suggestion-menu-item remind" data-action="remind" data-suggestion-id="asiatransport">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              Remind me in a week
            </button>
          </div>
        </div>
        <a href="https://asiatransport.tripportier.com" target="_blank" class="suggestion-card-action">
          <span>Book Now</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </a>
      </div>
    `;
  }

  renderAirportTransferCard(config) {
    return `
      <div class="suggestion-card transfer" data-suggestion-id="airportTransfer">
        <div class="suggestion-card-header">
          <div class="suggestion-card-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
          </div>
          <div class="suggestion-card-text">
            <h3>Airport Transfer</h3>
            <p>Pre-book your ride to/from the airport</p>
          </div>
          <button class="suggestion-card-menu-btn" data-suggestion-id="airportTransfer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
            </svg>
          </button>
          <div class="suggestion-card-menu" data-suggestion-id="airportTransfer">
            <button class="suggestion-menu-item dismiss" data-action="dismiss" data-suggestion-id="airportTransfer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
              </svg>
              Hide
            </button>
            <button class="suggestion-menu-item remind" data-action="remind" data-suggestion-id="airportTransfer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              Remind me in a week
            </button>
          </div>
        </div>
        <a href="airport-transfers.html" target="_blank" rel="noopener" class="suggestion-card-action">
          <span>Book Transfer</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </a>
      </div>
    `;
  }

  renderEmailImportCard(config, isPremium = false) {
    // Only show premium badge if user doesn't have TripPortier+
    const premiumBadge = isPremium ? '' : '<span class="premium-badge">TripPortier+</span>';

    return `
      <div class="suggestion-card email-import" data-suggestion-id="emailImport">
        <div class="suggestion-card-header">
          <div class="suggestion-card-icon ${isPremium ? 'email-import-icon' : 'premium'}">
            <svg viewBox="0 0 24 24" fill="currentColor">
              ${isPremium
                ? '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>'
                : '<path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4L2 9.4h7.6z"/>'
              }
            </svg>
          </div>
          <div class="suggestion-card-text">
            <h3>Email Import ${premiumBadge}</h3>
            <p>Forward bookings to automatically add to your trip</p>
          </div>
          <button class="suggestion-card-menu-btn" data-suggestion-id="emailImport">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
            </svg>
          </button>
          <div class="suggestion-card-menu" data-suggestion-id="emailImport">
            <button class="suggestion-menu-item dismiss" data-action="dismiss" data-suggestion-id="emailImport">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
              </svg>
              Hide
            </button>
            <button class="suggestion-menu-item remind" data-action="remind" data-suggestion-id="emailImport">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              Remind me in a week
            </button>
          </div>
        </div>
        <div class="email-import-address" id="email-import-address">
          <span class="email-import-loading">Loading email...</span>
        </div>
      </div>
    `;
  }

  async renderCompanionsSection(config, isPremium) {
    const container = document.getElementById('trip-companions-section');
    if (!container) return;

    // For now, show invite prompt (companions integration will be added in Phase 7)
    if (config.hideCompanionsWidget || config.hasDeclinedCompanionInvite) {
      container.style.display = 'none';
      return;
    }

    container.innerHTML = `
      <div class="suggestion-card companions" data-suggestion-id="companions">
        <div class="suggestion-card-header">
          <div class="suggestion-card-icon companions-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </div>
          <div class="suggestion-card-text">
            <h3>Traveling with others?</h3>
            <p>Invite companions to collaborate on this trip</p>
          </div>
          <button class="suggestion-card-menu-btn" onclick="event.stopPropagation(); window.tripDetailManager.hideCompanionsWidget()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <button class="suggestion-card-action companions-action" onclick="window.tripDetailManager.inviteCompanions()">
          <span>Invite Now</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    `;

    container.style.display = 'block';
  }

  setupSuggestionEventListeners(config) {
    // Menu toggle buttons
    const menuBtns = document.querySelectorAll('.suggestion-card-menu-btn');
    menuBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const suggestionId = btn.dataset.suggestionId;
        const menu = document.querySelector(`.suggestion-card-menu[data-suggestion-id="${suggestionId}"]`);

        // Close all other menus
        document.querySelectorAll('.suggestion-card-menu').forEach(m => {
          if (m !== menu) m.classList.remove('active');
        });

        menu.classList.toggle('active');
      });
    });

    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.suggestion-card-menu') && !e.target.closest('.suggestion-card-menu-btn')) {
        document.querySelectorAll('.suggestion-card-menu').forEach(m => m.classList.remove('active'));
      }
    });

    // Dismiss buttons
    const dismissBtns = document.querySelectorAll('.suggestion-menu-item.dismiss');
    dismissBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const suggestionId = btn.dataset.suggestionId;
        await this.dismissSuggestion(suggestionId);
      });
    });

    // Remind buttons
    const remindBtns = document.querySelectorAll('.suggestion-menu-item.remind');
    remindBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const suggestionId = btn.dataset.suggestionId;
        await this.remindSuggestion(suggestionId);
      });
    });

    // Load email import address if shown
    const emailImportCard = document.querySelector('.suggestion-card.email-import');
    if (emailImportCard) {
      this.loadEmailImportAddress();
    }
  }

  async dismissSuggestion(suggestionId) {
    await window.tripHubConfigService.dismissSuggestion(this.tripId, suggestionId);

    // Remove the card with animation
    const card = document.querySelector(`.suggestion-card[data-suggestion-id="${suggestionId}"]`);
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      setTimeout(() => card.remove(), 300);
    }

    this.showToast('Suggestion hidden');
  }

  async remindSuggestion(suggestionId) {
    // Set reminder for 1 week from now
    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + 7);

    await window.tripHubConfigService.setReminder(this.tripId, suggestionId, reminderDate);

    // Remove the card
    const card = document.querySelector(`.suggestion-card[data-suggestion-id="${suggestionId}"]`);
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      setTimeout(() => card.remove(), 300);
    }

    this.showToast('Reminder set for 1 week');
  }

  async handleESIMAction(currentState) {
    const stateTransitions = {
      'notPurchased': 'purchased',
      'purchased': 'installed',
      'installed': 'activated'
    };

    const nextState = stateTransitions[currentState];
    if (nextState) {
      if (currentState === 'notPurchased') {
        // Open eSIM page
        window.open('esim.html', '_blank');
      } else {
        // Update state
        await window.tripHubConfigService.updateESIMState(this.tripId, nextState);
        this.renderSuggestions();

        const messages = {
          'purchased': 'eSIM marked as purchased',
          'installed': 'eSIM marked as installed',
          'activated': 'eSIM activated! Have a great trip!'
        };
        this.showToast(messages[nextState]);
      }
    }
  }

  async loadEmailImportAddress() {
    const addressEl = document.getElementById('email-import-address');
    if (!addressEl) return;

    try {
      const user = firebase.auth().currentUser;
      if (!user) return;

      // Get or create unique email address
      const db = firebase.firestore();
      const userDoc = await db.collection('users').doc(user.uid).get();
      const userData = userDoc.data();

      let forwardingEmail = userData?.forwardingEmail;
      if (!forwardingEmail) {
        // Generate unique email
        const uniqueId = user.uid.substring(0, 8);
        forwardingEmail = `${uniqueId}@bookings.tripportier.com`;

        // Save to user document
        await db.collection('users').doc(user.uid).set({
          forwardingEmail: forwardingEmail
        }, { merge: true });
      }

      // Display email with copy button
      addressEl.innerHTML = `
        <span class="email-import-text">${forwardingEmail}</span>
        <button class="email-import-copy-btn" onclick="window.tripDetailManager.copyEmailAddress('${forwardingEmail}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
          Copy
        </button>
      `;
    } catch (error) {
      console.error('Error loading email import address:', error);
      addressEl.innerHTML = '<span class="email-import-error">Failed to load email</span>';
    }
  }

  async copyEmailAddress(email) {
    try {
      await navigator.clipboard.writeText(email);
      this.showToast('Email address copied!');
    } catch (error) {
      console.error('Failed to copy:', error);
      this.showToast('Failed to copy email');
    }
  }

  async hideCompanionsWidget() {
    await window.tripHubConfigService.hideCompanionsWidget(this.tripId);
    const container = document.getElementById('trip-companions-section');
    if (container) {
      container.style.display = 'none';
    }
  }

  async declineCompanionInvite() {
    await window.tripHubConfigService.declineCompanionInvite(this.tripId);
    const container = document.getElementById('trip-companions-section');
    if (container) {
      container.style.display = 'none';
    }
    this.showToast('Companion invite declined');
  }

  inviteCompanions() {
    // Create share data
    const shareData = {
      title: `Join my trip: ${this.trip.name}`,
      text: `I'm planning a trip to ${this.trip.destination} and I'd like you to join me on TripPortier!`,
      url: window.location.href
    };

    // Try Web Share API
    if (navigator.share) {
      navigator.share(shareData).catch(err => console.log('Share cancelled'));
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.href);
      this.showToast('Trip link copied to clipboard');
    }
  }

  isDaysUntilTrip() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tripStart = new Date(
      this.trip.startDate.getFullYear(),
      this.trip.startDate.getMonth(),
      this.trip.startDate.getDate()
    );

    return Math.ceil((tripStart - today) / (1000 * 60 * 60 * 24));
  }

  async checkPremiumStatus() {
    try {
      const user = firebase.auth().currentUser;
      if (!user) return false;

      const db = firebase.firestore();
      const subscriptionDoc = await db.collection('subscriptions').doc(user.uid).get();

      if (subscriptionDoc.exists) {
        const data = subscriptionDoc.data();
        return data.status === 'active' || data.status === 'trialing';
      }
      return false;
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  }

  getTripPhase() {
    // Wishlist/someday trips have no dates
    if (this.trip.isSomedayTrip) {
      return 'wishlist';
    }

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
    // Wishlist trips use tripLength instead of calculated duration
    if (this.trip.isSomedayTrip) {
      return this.trip.tripLength || 7;
    }

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

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
    try {
      const query = this.trip.destination || this.trip.name;
      const searchQuery = `${query} travel landscape`;

      // Use Firebase Function to fetch Pexels image (keeps API key secure)
      const getPexelsImage = firebase.functions().httpsCallable('getPexelsImage');
      const result = await getPexelsImage({ query: searchQuery });

      if (result.data.success && result.data.image) {
        const imageUrl = result.data.image.src.large2x || result.data.image.src.large;

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

  // ============================================
  // Add Item Forms
  // ============================================

  setupAddItemForms() {
    // Packing item form
    const packingInput = document.getElementById('packing-item-input');
    const packingCategory = document.getElementById('packing-category-select');
    const addPackingBtn = document.getElementById('add-packing-btn');

    if (packingInput && addPackingBtn) {
      const addPackingItem = () => {
        const name = packingInput.value.trim();
        const category = packingCategory ? packingCategory.value : 'Other';

        if (name) {
          this.addPackingItem(name, category);
          packingInput.value = '';
        }
      };

      addPackingBtn.addEventListener('click', addPackingItem);
      packingInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          addPackingItem();
        }
      });
    }

    // Todo item form
    const todoInput = document.getElementById('todo-item-input');
    const todoDueDateInput = document.getElementById('todo-due-date-input');
    const addTodoBtn = document.getElementById('add-todo-btn');

    if (todoInput && addTodoBtn) {
      const addTodoItem = () => {
        const title = todoInput.value.trim();
        const dueDate = todoDueDateInput ? todoDueDateInput.value : null;

        if (title) {
          this.addTodoItem(title, dueDate);
          todoInput.value = '';
          if (todoDueDateInput) todoDueDateInput.value = '';
        }
      };

      addTodoBtn.addEventListener('click', addTodoItem);
      todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          addTodoItem();
        }
      });
    }
  }

  async addPackingItem(name, category) {
    if (!this.trip) return;

    // Initialize packingItems array if needed
    if (!this.trip.packingItems) {
      this.trip.packingItems = [];
    }

    // Generate a unique ID
    const id = `packing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create new packing item
    const newItem = {
      id: id,
      name: name,
      category: category,
      isPacked: false,
      quantity: 1,
      createdAt: new Date().toISOString()
    };

    // Add to array
    this.trip.packingItems.push(newItem);

    // Re-render the list
    this.renderPackingList();

    // Save to Firestore
    await this.savePackingItemsToFirestore();
  }

  async addTodoItem(title, dueDate = null) {
    if (!this.trip) return;

    // Initialize todos array if needed
    if (!this.trip.todos) {
      this.trip.todos = [];
    }

    // Generate a unique ID
    const id = `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create new todo item
    const newItem = {
      id: id,
      title: title,
      isCompleted: false,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      createdAt: new Date().toISOString()
    };

    // Add to array
    this.trip.todos.push(newItem);

    // Re-render the list
    this.renderTodos();

    // Save to Firestore
    await this.saveTodosToFirestore();
  }

  // ============================================
  // Expense Tracking
  // ============================================

  setupExpenseForm() {
    const nameInput = document.getElementById('expense-name-input');
    const amountInput = document.getElementById('expense-amount-input');
    const categorySelect = document.getElementById('expense-category-select');
    const addBtn = document.getElementById('add-expense-btn');

    if (nameInput && amountInput && addBtn) {
      const addExpense = () => {
        const name = nameInput.value.trim();
        const amount = parseFloat(amountInput.value);
        const category = categorySelect ? categorySelect.value : 'Other';

        if (name && !isNaN(amount) && amount > 0) {
          this.addExpense(name, amount, category);
          nameInput.value = '';
          amountInput.value = '';
        }
      };

      addBtn.addEventListener('click', addExpense);
      amountInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          addExpense();
        }
      });
    }
  }

  async addExpense(name, amount, category) {
    if (!this.trip) return;

    // Initialize expenses array if needed
    if (!this.trip.expenses) {
      this.trip.expenses = [];
    }

    // Generate a unique ID
    const id = `expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create new expense item
    const newExpense = {
      id: id,
      name: name,
      category: category,
      homeCurrencyAmount: amount,
      currencyAmount: amount,
      currency: this.trip.currency || 'USD',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    // Add to expenses array
    this.trip.expenses.push(newExpense);

    // Re-render the budget
    this.renderBudget();

    // Save to Firestore
    await this.saveExpensesToFirestore();

    this.showToast('Expense added');
  }

  async saveExpensesToFirestore() {
    if (!this.userId || !this.tripId || !this.trip) return;

    try {
      const db = firebase.firestore();
      await db
        .collection('users')
        .doc(this.userId)
        .collection('trips')
        .doc(this.tripId)
        .update({
          expenses: this.trip.expenses,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      console.log('Expenses saved to Firestore');
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  }

  async deleteExpense(expenseId) {
    if (!this.trip.expenses) return;

    // Find and remove the expense
    const index = this.trip.expenses.findIndex(e => e.id === expenseId);
    if (index === -1) return;

    this.trip.expenses.splice(index, 1);

    // Re-render the budget
    this.renderBudget();

    // Save to Firestore
    await this.saveExpensesToFirestore();

    this.showToast('Expense removed');
  }

  // ============================================
  // Itinerary Item Management
  // ============================================

  setupItineraryForm() {
    // New modal-based add item system
    this.currentItemType = null;
    this.newItemData = {};
    this.selectedLocationData = null; // Store selected location with coordinates
    this.locationSearchTimeout = null; // Debounce timer for location search

    // Close modals when clicking overlay
    document.getElementById('add-item-type-modal')?.addEventListener('click', (e) => {
      if (e.target.classList.contains('itinerary-modal-overlay')) {
        this.closeAddItemModal();
      }
    });

    document.getElementById('add-item-form-modal')?.addEventListener('click', (e) => {
      if (e.target.classList.contains('itinerary-modal-overlay')) {
        this.closeAddItemModal();
      }
    });

    // Close location results when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.location-autocomplete-wrapper')) {
        this.hideLocationResults();
      }
    });
  }

  // ============================================
  // Location Autocomplete
  // ============================================

  setupLocationAutocomplete() {
    const locationInput = document.getElementById('item-location');
    if (!locationInput) return;

    // Wrap the input in an autocomplete container if not already wrapped
    if (!locationInput.closest('.location-autocomplete-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'location-autocomplete-wrapper';
      locationInput.parentNode.insertBefore(wrapper, locationInput);
      wrapper.appendChild(locationInput);

      // Add results container
      const resultsContainer = document.createElement('div');
      resultsContainer.className = 'location-autocomplete-results';
      resultsContainer.id = 'location-results';
      wrapper.appendChild(resultsContainer);
    }

    // Add event listeners
    locationInput.addEventListener('input', (e) => {
      this.onLocationInput(e.target.value);
    });

    locationInput.addEventListener('focus', (e) => {
      if (e.target.value.trim().length >= 2) {
        this.onLocationInput(e.target.value);
      }
    });

    // Clear selected location when user types
    locationInput.addEventListener('keydown', () => {
      this.selectedLocationData = null;
    });
  }

  onLocationInput(query) {
    // Clear previous timeout
    if (this.locationSearchTimeout) {
      clearTimeout(this.locationSearchTimeout);
    }

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      this.hideLocationResults();
      return;
    }

    // Debounce the search (300ms)
    this.locationSearchTimeout = setTimeout(() => {
      this.searchLocation(trimmed);
    }, 300);
  }

  async searchLocation(query) {
    const resultsContainer = document.getElementById('location-results');
    if (!resultsContainer) return;

    // Show loading state
    resultsContainer.innerHTML = `
      <div class="location-result-item location-loading">
        <div class="location-result-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        </div>
        <div class="location-result-text">
          <span class="location-result-name">Searching...</span>
        </div>
      </div>
    `;
    resultsContainer.classList.add('active');

    try {
      // Use OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'TripPortier Web App'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const results = await response.json();
      this.renderLocationResults(results);
    } catch (error) {
      console.warn('Location search error:', error);
      resultsContainer.innerHTML = `
        <div class="location-result-item location-error">
          <div class="location-result-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div class="location-result-text">
            <span class="location-result-name">Search failed. Try again.</span>
          </div>
        </div>
      `;
    }
  }

  renderLocationResults(results) {
    const resultsContainer = document.getElementById('location-results');
    if (!resultsContainer) return;

    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="location-result-item location-empty">
          <div class="location-result-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <div class="location-result-text">
            <span class="location-result-name">No locations found</span>
          </div>
        </div>
      `;
      resultsContainer.classList.add('active');
      return;
    }

    resultsContainer.innerHTML = results.map((result, index) => {
      const name = this.getLocationName(result);
      const address = this.getLocationAddress(result);
      const icon = this.getLocationIcon(result.type, result.class);

      return `
        <div class="location-result-item" data-index="${index}" onclick="window.tripDetailManager.selectLocationResult(${index})">
          <div class="location-result-icon">
            ${icon}
          </div>
          <div class="location-result-text">
            <span class="location-result-name">${this.escapeHtml(name)}</span>
            ${address ? `<span class="location-result-address">${this.escapeHtml(address)}</span>` : ''}
          </div>
          <div class="location-result-chevron">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>
      `;
    }).join('');

    // Store results for selection
    this.locationResults = results;
    resultsContainer.classList.add('active');
  }

  getLocationName(result) {
    // Try to get a clean name
    if (result.namedetails?.name) return result.namedetails.name;
    if (result.address) {
      // Build name from address components
      const parts = [];
      if (result.address.amenity) parts.push(result.address.amenity);
      else if (result.address.shop) parts.push(result.address.shop);
      else if (result.address.tourism) parts.push(result.address.tourism);
      else if (result.address.building) parts.push(result.address.building);
      else if (result.address.road) parts.push(result.address.road);
      else if (result.address.neighbourhood) parts.push(result.address.neighbourhood);

      if (parts.length > 0) return parts.join(', ');
    }
    // Fallback to display_name first part
    return result.display_name?.split(',')[0] || 'Unknown Location';
  }

  getLocationAddress(result) {
    if (!result.address) return null;

    const parts = [];
    const addr = result.address;

    // Build a readable address
    if (addr.house_number && addr.road) {
      parts.push(`${addr.house_number} ${addr.road}`);
    } else if (addr.road) {
      parts.push(addr.road);
    }

    if (addr.city || addr.town || addr.village) {
      parts.push(addr.city || addr.town || addr.village);
    }

    if (addr.country) {
      parts.push(addr.country);
    }

    return parts.length > 0 ? parts.join(', ') : null;
  }

  getLocationIcon(type, osm_class) {
    // Return appropriate icon based on location type
    if (type === 'hotel' || type === 'hostel' || type === 'guest_house' || osm_class === 'tourism') {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
    }
    if (type === 'restaurant' || type === 'cafe' || type === 'fast_food' || osm_class === 'amenity') {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`;
    }
    if (type === 'airport' || type === 'aerodrome') {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`;
    }
    // Default map pin icon
    return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
  }

  selectLocationResult(index) {
    const result = this.locationResults?.[index];
    if (!result) return;

    const locationInput = document.getElementById('item-location');
    if (!locationInput) return;

    // Create LocationData object matching iOS structure
    const name = this.getLocationName(result);
    const address = this.getLocationAddress(result);

    this.selectedLocationData = {
      name: name,
      address: address || result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon)
    };

    // Set input value to the name
    locationInput.value = name;

    // Hide results
    this.hideLocationResults();
  }

  hideLocationResults() {
    const resultsContainer = document.getElementById('location-results');
    if (resultsContainer) {
      resultsContainer.classList.remove('active');
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  openAddItemModal() {
    const modal = document.getElementById('add-item-type-modal');
    const dateEl = document.getElementById('add-item-modal-date');

    if (modal) {
      modal.classList.add('active');

      // Set the date display
      if (dateEl && this.trip) {
        const today = new Date();
        const tripStart = this.trip.startDate || today;
        const displayDate = today >= tripStart && today <= (this.trip.endDate || today) ? today : tripStart;
        const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
        dateEl.textContent = displayDate.toLocaleDateString('en-US', options);
        this.selectedAddDate = displayDate;
      }
    }
  }

  closeAddItemModal() {
    document.getElementById('add-item-type-modal')?.classList.remove('active');
    document.getElementById('add-item-form-modal')?.classList.remove('active');
    this.currentItemType = null;
    this.newItemData = {};
    this.selectedLocationData = null;
    this.hideLocationResults();
  }

  openItemForm(type) {
    this.currentItemType = type;
    this.newItemData = { type };
    this.selectedLocationData = null; // Clear any previous location data

    // Hide type selector, show form
    document.getElementById('add-item-type-modal')?.classList.remove('active');
    const formModal = document.getElementById('add-item-form-modal');
    const titleEl = document.getElementById('item-form-title');
    const contentEl = document.getElementById('item-form-content');

    if (formModal && contentEl) {
      formModal.classList.add('active');

      // Set title based on type
      const titles = {
        activity: 'Add Activity',
        hotel: 'Add Accommodation',
        food: 'Add Food & Dining',
        flight: 'Add Travel',
        other: 'Add Other'
      };
      if (titleEl) titleEl.textContent = titles[type] || 'Add Item';

      // Generate form fields based on type
      contentEl.innerHTML = this.generateItemForm(type);

      // Setup location autocomplete after form is rendered
      requestAnimationFrame(() => {
        this.setupLocationAutocomplete();
      });
    }
  }

  backToTypeSelector() {
    document.getElementById('add-item-form-modal')?.classList.remove('active');
    document.getElementById('add-item-type-modal')?.classList.add('active');
    this.currentItemType = null;
  }

  generateItemForm(type) {
    const tripStart = this.trip?.startDate ? this.trip.startDate.toISOString().split('T')[0] : '';
    const tripEnd = this.trip?.endDate ? this.trip.endDate.toISOString().split('T')[0] : '';
    const today = new Date().toISOString().split('T')[0];
    const defaultDate = this.selectedAddDate ? this.selectedAddDate.toISOString().split('T')[0] : (tripStart || today);

    // Common fields for all types
    let html = `
      <div class="item-form-section">
        <div class="item-form-field">
          <label class="item-form-label">Title</label>
          <input type="text" class="item-form-input" id="item-title" placeholder="Enter title..." autofocus>
        </div>
      </div>
    `;

    // Type-specific fields
    switch (type) {
      case 'activity':
        html += this.generateActivityFields(defaultDate, tripStart, tripEnd);
        break;
      case 'hotel':
        html += this.generateHotelFields(defaultDate, tripStart, tripEnd);
        break;
      case 'food':
        html += this.generateFoodFields(defaultDate, tripStart, tripEnd);
        break;
      case 'flight':
        html += this.generateTravelFields(defaultDate, tripStart, tripEnd);
        break;
      case 'other':
        html += this.generateOtherFields(defaultDate, tripStart, tripEnd);
        break;
    }

    // Common fields at bottom
    html += `
      <div class="item-form-section">
        <div class="item-form-field">
          <label class="item-form-label">Cost</label>
          <div class="item-form-row">
            <select class="item-form-select" id="item-currency" style="flex: 0 0 80px;">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CHF">CHF</option>
              <option value="JPY">JPY</option>
              <option value="AUD">AUD</option>
              <option value="CAD">CAD</option>
            </select>
            <input type="number" class="item-form-input" id="item-cost" placeholder="0.00" step="0.01">
          </div>
        </div>
        <div class="item-form-field">
          <label class="item-form-label">Website</label>
          <input type="url" class="item-form-input" id="item-website" placeholder="https://...">
        </div>
        <div class="item-form-field">
          <label class="item-form-label">Phone</label>
          <input type="tel" class="item-form-input" id="item-phone" placeholder="+1 234 567 8900">
        </div>
        <div class="item-form-field">
          <label class="item-form-label">Notes</label>
          <textarea class="item-form-textarea" id="item-notes" placeholder="Additional notes..."></textarea>
        </div>
      </div>
    `;

    return html;
  }

  generateActivityFields(defaultDate, tripStart, tripEnd) {
    return `
      <div class="item-form-section">
        <div class="item-form-section-title activity">Activity Details</div>
        <div class="item-form-field">
          <label class="item-form-label">Location</label>
          <input type="text" class="item-form-input" id="item-location" placeholder="Search for a place...">
        </div>
        <div class="item-form-field">
          <label class="item-form-label">Activity Type</label>
          <select class="item-form-select" id="item-activity-type">
            <option value="">Select type...</option>
            <option value="tour">Tour</option>
            <option value="sightseeing">Sightseeing</option>
            <option value="adventure">Adventure</option>
            <option value="entertainment">Entertainment</option>
            <option value="shopping">Shopping</option>
            <option value="relaxation">Relaxation</option>
            <option value="sports">Sports</option>
            <option value="cultural">Cultural</option>
            <option value="nightlife">Nightlife</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="item-form-field">
          <label class="item-form-label">Booking Status</label>
          <select class="item-form-select" id="item-booking-status">
            <option value="">Not specified</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div class="item-form-field">
          <label class="item-form-label">Participants</label>
          <input type="number" class="item-form-input" id="item-participants" placeholder="Number of people" min="1">
        </div>
        <div class="item-form-row">
          <div class="item-form-field">
            <label class="item-form-label">Start Date & Time</label>
            <input type="date" class="item-form-input" id="item-start-date" value="${defaultDate}" min="${tripStart}" max="${tripEnd}">
            <input type="time" class="item-form-input" id="item-start-time" value="09:00" style="margin-top: 0.5rem;">
          </div>
          <div class="item-form-field">
            <label class="item-form-label">End Date & Time</label>
            <input type="date" class="item-form-input" id="item-end-date" value="${defaultDate}" min="${tripStart}" max="${tripEnd}">
            <input type="time" class="item-form-input" id="item-end-time" value="12:00" style="margin-top: 0.5rem;">
          </div>
        </div>
      </div>
    `;
  }

  generateHotelFields(defaultDate, tripStart, tripEnd) {
    // Default check-out to next day
    const checkOutDate = new Date(defaultDate);
    checkOutDate.setDate(checkOutDate.getDate() + 1);
    const checkOutStr = checkOutDate.toISOString().split('T')[0];

    return `
      <div class="item-form-section">
        <div class="item-form-section-title hotel">Accommodation Details</div>
        <div class="item-form-field">
          <label class="item-form-label">Location</label>
          <input type="text" class="item-form-input" id="item-location" placeholder="Search for hotel, Airbnb...">
        </div>
        <div class="item-form-field">
          <label class="item-form-label">Board Type</label>
          <select class="item-form-select" id="item-board-type">
            <option value="">Not specified</option>
            <option value="room-only">Room Only</option>
            <option value="bed-breakfast">Bed & Breakfast</option>
            <option value="half-board">Half Board</option>
            <option value="full-board">Full Board</option>
            <option value="all-inclusive">All Inclusive</option>
          </select>
        </div>
        <div class="item-form-field">
          <label class="item-form-label">Booking Status</label>
          <select class="item-form-select" id="item-booking-status">
            <option value="">Not specified</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div class="item-form-row">
          <div class="item-form-field">
            <label class="item-form-label">Check-in</label>
            <input type="date" class="item-form-input" id="item-checkin-date" value="${defaultDate}" min="${tripStart}" max="${tripEnd}">
            <input type="time" class="item-form-input" id="item-checkin-time" value="15:00" style="margin-top: 0.5rem;">
          </div>
          <div class="item-form-field">
            <label class="item-form-label">Check-out</label>
            <input type="date" class="item-form-input" id="item-checkout-date" value="${checkOutStr}" min="${tripStart}" max="${tripEnd}">
            <input type="time" class="item-form-input" id="item-checkout-time" value="11:00" style="margin-top: 0.5rem;">
          </div>
        </div>
        <div class="item-form-field">
          <label class="item-form-label">Confirmation Number</label>
          <input type="text" class="item-form-input" id="item-confirmation" placeholder="Booking reference...">
        </div>
      </div>
    `;
  }

  generateFoodFields(defaultDate, tripStart, tripEnd) {
    return `
      <div class="item-form-section">
        <div class="item-form-section-title food">Food & Dining Details</div>
        <div class="item-form-field">
          <label class="item-form-label">Location</label>
          <input type="text" class="item-form-input" id="item-location" placeholder="Search for restaurant, cafe...">
        </div>
        <div class="item-form-field">
          <label class="item-form-label">Meal Type</label>
          <select class="item-form-select" id="item-meal-type">
            <option value="">Select meal...</option>
            <option value="breakfast">Breakfast</option>
            <option value="brunch">Brunch</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
            <option value="coffee">Coffee / Tea</option>
            <option value="drinks">Drinks</option>
            <option value="dessert">Dessert</option>
          </select>
        </div>
        <div class="item-form-field">
          <label class="item-form-label">Cuisine</label>
          <input type="text" class="item-form-input" id="item-cuisine" placeholder="Italian, Japanese, Local...">
        </div>
        <div class="item-form-field">
          <label class="item-form-label">Booking Status</label>
          <select class="item-form-select" id="item-booking-status">
            <option value="">Not specified</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div class="item-form-row">
          <div class="item-form-field">
            <label class="item-form-label">Reservation Date</label>
            <input type="date" class="item-form-input" id="item-reservation-date" value="${defaultDate}" min="${tripStart}" max="${tripEnd}">
          </div>
          <div class="item-form-field">
            <label class="item-form-label">Time</label>
            <input type="time" class="item-form-input" id="item-reservation-time" value="19:00">
          </div>
        </div>
      </div>
    `;
  }

  generateTravelFields(defaultDate, tripStart, tripEnd) {
    return `
      <div class="item-form-section">
        <div class="item-form-section-title flight">Select Travel Mode</div>
        <input type="hidden" id="item-travel-mode" value="flight">
        <div class="travel-mode-picker">
          <div class="travel-mode-card selected" data-mode="flight" onclick="window.tripDetailManager.selectTravelMode('flight')">
            <div class="travel-mode-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
            </div>
            <span class="travel-mode-label">Flight</span>
          </div>
          <div class="travel-mode-card" data-mode="train" onclick="window.tripDetailManager.selectTravelMode('train')">
            <div class="travel-mode-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
            </div>
            <span class="travel-mode-label">Train</span>
          </div>
          <div class="travel-mode-card" data-mode="bus" onclick="window.tripDetailManager.selectTravelMode('bus')">
            <div class="travel-mode-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
              </svg>
            </div>
            <span class="travel-mode-label">Bus</span>
          </div>
          <div class="travel-mode-card" data-mode="car" onclick="window.tripDetailManager.selectTravelMode('car')">
            <div class="travel-mode-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <span class="travel-mode-label">Car</span>
          </div>
          <div class="travel-mode-card" data-mode="ferry" onclick="window.tripDetailManager.selectTravelMode('ferry')">
            <div class="travel-mode-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"/>
              </svg>
            </div>
            <span class="travel-mode-label">Ferry</span>
          </div>
          <div class="travel-mode-card" data-mode="taxi" onclick="window.tripDetailManager.selectTravelMode('taxi')">
            <div class="travel-mode-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H15V3H9v2H6.5c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <span class="travel-mode-label">Taxi</span>
          </div>
        </div>
      </div>

      <div class="item-form-section">
        <!-- Flight Search Section (Premium) -->
        <div class="flight-search-section" id="flight-search-section">
          <div class="flight-search-header">
            <span class="flight-search-label">Search Flight</span>
            <span class="flight-search-premium-badge" id="flight-search-premium-badge">TripPortier+</span>
          </div>
          <div class="flight-search-row">
            <div class="item-form-field" style="flex: 1;">
              <input type="text" class="item-form-input" id="item-flight-search" placeholder="e.g. UA123, BA456..." style="text-transform: uppercase;">
            </div>
            <div class="item-form-field" style="flex: 1;">
              <input type="date" class="item-form-input" id="item-flight-search-date" value="${defaultDate}" min="${tripStart}" max="${tripEnd}">
            </div>
            <button type="button" class="flight-search-btn" id="flight-search-btn" onclick="window.tripDetailManager.searchFlight()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>
          </div>
          <div class="flight-search-result" id="flight-search-result" style="display: none;"></div>
          <div class="flight-search-error" id="flight-search-error" style="display: none;"></div>
        </div>

        <!-- Manual Entry Toggle -->
        <div class="manual-entry-toggle" id="manual-entry-toggle">
          <button type="button" class="manual-entry-btn" onclick="window.tripDetailManager.toggleManualFlightEntry()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            <span id="manual-entry-text">Enter manually instead</span>
          </button>
        </div>

        <!-- Manual Entry Fields (shown by default for non-flights, or when toggled) -->
        <div class="manual-flight-fields" id="manual-flight-fields">
          <div class="item-form-row">
            <div class="item-form-field">
              <label class="item-form-label">From</label>
              <input type="text" class="item-form-input" id="item-from-location" placeholder="Departure location...">
            </div>
            <div class="item-form-field">
              <label class="item-form-label">To</label>
              <input type="text" class="item-form-input" id="item-to-location" placeholder="Arrival location...">
            </div>
          </div>
          <div class="item-form-row">
            <div class="item-form-field">
              <label class="item-form-label">Departure</label>
              <input type="date" class="item-form-input" id="item-departure-date" value="${defaultDate}" min="${tripStart}" max="${tripEnd}">
              <input type="time" class="item-form-input" id="item-departure-time" value="09:00" style="margin-top: 0.5rem;">
            </div>
            <div class="item-form-field">
              <label class="item-form-label">Arrival</label>
              <input type="date" class="item-form-input" id="item-arrival-date" value="${defaultDate}" min="${tripStart}" max="${tripEnd}">
              <input type="time" class="item-form-input" id="item-arrival-time" value="12:00" style="margin-top: 0.5rem;">
            </div>
          </div>
          <div class="item-form-row">
            <div class="item-form-field">
              <label class="item-form-label">Carrier / Airline</label>
              <input type="text" class="item-form-input" id="item-carrier" placeholder="Airline, train company...">
            </div>
            <div class="item-form-field">
              <label class="item-form-label">Flight / Train Number</label>
              <input type="text" class="item-form-input" id="item-flight-number" placeholder="AA123, IC456...">
            </div>
          </div>
          <div class="item-form-field">
            <label class="item-form-label">Confirmation Number</label>
            <input type="text" class="item-form-input" id="item-confirmation" placeholder="Booking reference...">
          </div>
          <div class="item-form-field">
            <label class="item-form-label">Booking Status</label>
            <select class="item-form-select" id="item-booking-status">
              <option value="">Not specified</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
    `;
  }

  selectTravelMode(mode) {
    // Update hidden input
    const modeInput = document.getElementById('item-travel-mode');
    if (modeInput) modeInput.value = mode;

    // Update visual selection
    document.querySelectorAll('.travel-mode-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.mode === mode);
    });

    // Call the mode change handler
    this.onTravelModeChange(mode);
  }

  onTravelModeChange(mode) {
    const searchSection = document.getElementById('flight-search-section');
    const manualToggle = document.getElementById('manual-entry-toggle');
    const manualFields = document.getElementById('manual-flight-fields');

    if (mode === 'flight') {
      // Show flight search section
      if (searchSection) searchSection.style.display = 'block';
      if (manualToggle) manualToggle.style.display = 'block';
      // Check if premium and update visibility
      this.updateFlightSearchVisibility();
    } else {
      // Hide flight search, show manual fields directly
      if (searchSection) searchSection.style.display = 'none';
      if (manualToggle) manualToggle.style.display = 'none';
      if (manualFields) manualFields.style.display = 'block';
    }
  }

  async updateFlightSearchVisibility() {
    const isPremium = await this.checkPremiumStatus();
    const premiumBadge = document.getElementById('flight-search-premium-badge');
    const searchBtn = document.getElementById('flight-search-btn');
    const searchInput = document.getElementById('item-flight-search');
    const manualFields = document.getElementById('manual-flight-fields');
    const manualToggle = document.getElementById('manual-entry-toggle');

    if (isPremium) {
      // Premium user - enable search, hide manual by default
      if (premiumBadge) premiumBadge.style.display = 'none';
      if (searchBtn) searchBtn.disabled = false;
      if (searchInput) searchInput.disabled = false;
      if (manualFields) manualFields.style.display = 'none';
      if (manualToggle) manualToggle.style.display = 'block';
    } else {
      // Non-premium - show badge, show manual fields by default
      if (premiumBadge) premiumBadge.style.display = 'inline-flex';
      if (manualFields) manualFields.style.display = 'block';
      if (manualToggle) manualToggle.style.display = 'none';
    }
  }

  toggleManualFlightEntry() {
    const manualFields = document.getElementById('manual-flight-fields');
    const toggleText = document.getElementById('manual-entry-text');

    if (manualFields) {
      const isHidden = manualFields.style.display === 'none';
      manualFields.style.display = isHidden ? 'block' : 'none';
      if (toggleText) {
        toggleText.textContent = isHidden ? 'Hide manual entry' : 'Enter manually instead';
      }
    }
  }

  async searchFlight() {
    const isPremium = await this.checkPremiumStatus();

    if (!isPremium) {
      // Show premium prompt
      this.showPremiumFlightPrompt();
      return;
    }

    const flightNumber = document.getElementById('item-flight-search')?.value.trim().toUpperCase();
    const flightDate = document.getElementById('item-flight-search-date')?.value;

    if (!flightNumber) {
      this.showToast('Please enter a flight number');
      return;
    }

    const searchBtn = document.getElementById('flight-search-btn');
    const resultEl = document.getElementById('flight-search-result');
    const errorEl = document.getElementById('flight-search-error');

    // Show loading state
    if (searchBtn) {
      searchBtn.disabled = true;
      searchBtn.innerHTML = '<div class="flight-search-spinner"></div>';
    }
    if (resultEl) resultEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'none';

    try {
      const getFlightStatus = firebase.functions().httpsCallable('getFlightStatusFn');
      const result = await getFlightStatus({
        flightNumber: flightNumber,
        date: flightDate
      });

      if (result.data && result.data.success && result.data.flight) {
        this.displayFlightSearchResult(result.data.flight);
      } else {
        this.showFlightSearchError(result.data?.error || 'Flight not found. Try entering details manually.');
      }
    } catch (error) {
      console.error('Flight search error:', error);
      this.showFlightSearchError('Could not search flight. Try entering details manually.');
    } finally {
      if (searchBtn) {
        searchBtn.disabled = false;
        searchBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`;
      }
    }
  }

  displayFlightSearchResult(flight) {
    const resultEl = document.getElementById('flight-search-result');
    if (!resultEl) return;

    // Format flight info
    const airline = flight.airline_name || flight.airline_iata || '';
    const flightNum = flight.flight_iata || flight.flight_number || '';
    const depAirport = flight.dep_iata || '';
    const arrAirport = flight.arr_iata || '';
    const depTime = flight.dep_time || '';
    const arrTime = flight.arr_time || '';
    const status = flight.status || 'scheduled';

    resultEl.innerHTML = `
      <div class="flight-result-card">
        <div class="flight-result-header">
          <span class="flight-result-airline">${this.escapeHtml(airline)}</span>
          <span class="flight-result-number">${this.escapeHtml(flightNum)}</span>
          <span class="flight-result-status flight-status-${status.toLowerCase()}">${status}</span>
        </div>
        <div class="flight-result-route">
          <div class="flight-result-airport">
            <span class="airport-code">${this.escapeHtml(depAirport)}</span>
            <span class="airport-time">${this.formatFlightTime(depTime)}</span>
          </div>
          <div class="flight-result-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
            </svg>
          </div>
          <div class="flight-result-airport">
            <span class="airport-code">${this.escapeHtml(arrAirport)}</span>
            <span class="airport-time">${this.formatFlightTime(arrTime)}</span>
          </div>
        </div>
        <button type="button" class="flight-result-use-btn" onclick="window.tripDetailManager.useFlightResult(${JSON.stringify(flight).replace(/"/g, '&quot;')})">
          Use This Flight
        </button>
      </div>
    `;
    resultEl.style.display = 'block';
  }

  formatFlightTime(timeStr) {
    if (!timeStr) return '--:--';
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return timeStr.split(' ')[1] || timeStr;
    }
  }

  useFlightResult(flight) {
    // Auto-fill the form fields with flight data
    const fromEl = document.getElementById('item-from-location');
    const toEl = document.getElementById('item-to-location');
    const carrierEl = document.getElementById('item-carrier');
    const flightNumEl = document.getElementById('item-flight-number');
    const depDateEl = document.getElementById('item-departure-date');
    const depTimeEl = document.getElementById('item-departure-time');
    const arrDateEl = document.getElementById('item-arrival-date');
    const arrTimeEl = document.getElementById('item-arrival-time');
    const titleEl = document.getElementById('item-title');

    // Set airport codes as locations
    if (fromEl) fromEl.value = flight.dep_iata || '';
    if (toEl) toEl.value = flight.arr_iata || '';
    if (carrierEl) carrierEl.value = flight.airline_name || flight.airline_iata || '';
    if (flightNumEl) flightNumEl.value = flight.flight_iata || flight.flight_number || '';

    // Parse and set times
    if (flight.dep_time) {
      try {
        const depDate = new Date(flight.dep_time);
        if (depDateEl) depDateEl.value = depDate.toISOString().split('T')[0];
        if (depTimeEl) depTimeEl.value = depDate.toTimeString().slice(0, 5);
      } catch (e) {}
    }

    if (flight.arr_time) {
      try {
        const arrDate = new Date(flight.arr_time);
        if (arrDateEl) arrDateEl.value = arrDate.toISOString().split('T')[0];
        if (arrTimeEl) arrTimeEl.value = arrDate.toTimeString().slice(0, 5);
      } catch (e) {}
    }

    // Auto-set title
    if (titleEl && !titleEl.value) {
      titleEl.value = `${flight.airline_iata || ''} ${flight.flight_iata || flight.flight_number || ''} ${flight.dep_iata || ''} → ${flight.arr_iata || ''}`.trim();
    }

    // Show manual fields with populated data
    const manualFields = document.getElementById('manual-flight-fields');
    if (manualFields) manualFields.style.display = 'block';

    // Hide search result
    const resultEl = document.getElementById('flight-search-result');
    if (resultEl) resultEl.style.display = 'none';

    this.showToast('Flight details added!');
  }

  showFlightSearchError(message) {
    const errorEl = document.getElementById('flight-search-error');
    if (!errorEl) return;

    errorEl.innerHTML = `
      <div class="flight-error-message">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>${this.escapeHtml(message)}</span>
      </div>
      <button type="button" class="flight-error-manual-btn" onclick="window.tripDetailManager.toggleManualFlightEntry()">
        Enter manually
      </button>
    `;
    errorEl.style.display = 'block';
  }

  showPremiumFlightPrompt() {
    const errorEl = document.getElementById('flight-search-error');
    if (!errorEl) return;

    errorEl.innerHTML = `
      <div class="flight-premium-prompt">
        <div class="flight-premium-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
          </svg>
        </div>
        <div class="flight-premium-text">
          <strong>TripPortier+ Feature</strong>
          <p>Upgrade to automatically search and track flights with real-time updates.</p>
        </div>
        <div class="flight-premium-actions">
          <a href="/premium.html?feature=flight-search" class="flight-premium-upgrade-btn">Upgrade Now</a>
          <button type="button" class="flight-premium-manual-btn" onclick="window.tripDetailManager.toggleManualFlightEntry()">Add Manually</button>
        </div>
      </div>
    `;
    errorEl.style.display = 'block';
  }

  generateOtherFields(defaultDate, tripStart, tripEnd) {
    return `
      <div class="item-form-section">
        <div class="item-form-section-title">Other Details</div>
        <div class="item-form-field">
          <label class="item-form-label">Location</label>
          <input type="text" class="item-form-input" id="item-location" placeholder="Location (optional)...">
        </div>
        <div class="item-form-row">
          <div class="item-form-field">
            <label class="item-form-label">Date</label>
            <input type="date" class="item-form-input" id="item-start-date" value="${defaultDate}" min="${tripStart}" max="${tripEnd}">
          </div>
          <div class="item-form-field">
            <label class="item-form-label">Time</label>
            <input type="time" class="item-form-input" id="item-start-time" value="09:00">
          </div>
        </div>
      </div>
    `;
  }

  async saveNewItem() {
    const title = document.getElementById('item-title')?.value.trim();

    if (!title) {
      this.showToast('Please enter a title');
      return;
    }

    // Collect common data
    const locationInputValue = document.getElementById('item-location')?.value.trim() || null;

    // Use selectedLocationData if available, otherwise create from text input
    let locationData = null;
    if (this.selectedLocationData) {
      locationData = this.selectedLocationData;
    } else if (locationInputValue) {
      // Fallback: create basic location data from text input
      locationData = {
        name: locationInputValue,
        address: null,
        latitude: null,
        longitude: null
      };
    }

    const itemData = {
      id: `itinerary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: title,
      category: this.currentItemType,
      location: locationData?.name || locationInputValue, // Keep backward compatibility
      locationData: locationData, // Full location object with coordinates
      notes: document.getElementById('item-notes')?.value.trim() || null,
      websiteURL: document.getElementById('item-website')?.value.trim() || null,
      phoneNumber: document.getElementById('item-phone')?.value.trim() || null,
      bookingStatus: document.getElementById('item-booking-status')?.value || null,
      createdAt: new Date().toISOString()
    };

    // Add cost if provided
    const cost = parseFloat(document.getElementById('item-cost')?.value);
    if (!isNaN(cost) && cost > 0) {
      itemData.currencyAmount = cost;
      itemData.currency = document.getElementById('item-currency')?.value || 'USD';
    }

    // Add type-specific fields
    switch (this.currentItemType) {
      case 'activity':
        const startDate = document.getElementById('item-start-date')?.value;
        const startTime = document.getElementById('item-start-time')?.value || '09:00';
        if (startDate) {
          const [h, m] = startTime.split(':').map(Number);
          const dt = new Date(startDate);
          dt.setHours(h, m, 0, 0);
          itemData.startDate = dt.toISOString();
        }
        const endDate = document.getElementById('item-end-date')?.value;
        const endTime = document.getElementById('item-end-time')?.value || '12:00';
        if (endDate) {
          const [h, m] = endTime.split(':').map(Number);
          const dt = new Date(endDate);
          dt.setHours(h, m, 0, 0);
          itemData.endDate = dt.toISOString();
        }
        itemData.activityType = document.getElementById('item-activity-type')?.value || null;
        itemData.participants = parseInt(document.getElementById('item-participants')?.value) || null;
        break;

      case 'hotel':
        const checkinDate = document.getElementById('item-checkin-date')?.value;
        const checkinTime = document.getElementById('item-checkin-time')?.value || '15:00';
        if (checkinDate) {
          const [h, m] = checkinTime.split(':').map(Number);
          const dt = new Date(checkinDate);
          dt.setHours(h, m, 0, 0);
          itemData.startDate = dt.toISOString();
          itemData.checkInTime = dt.toISOString();
        }
        const checkoutDate = document.getElementById('item-checkout-date')?.value;
        const checkoutTime = document.getElementById('item-checkout-time')?.value || '11:00';
        if (checkoutDate) {
          const [h, m] = checkoutTime.split(':').map(Number);
          const dt = new Date(checkoutDate);
          dt.setHours(h, m, 0, 0);
          itemData.endDate = dt.toISOString();
          itemData.checkOutTime = dt.toISOString();
        }
        itemData.boardType = document.getElementById('item-board-type')?.value || null;
        itemData.confirmationNumber = document.getElementById('item-confirmation')?.value.trim() || null;
        break;

      case 'food':
        const resDate = document.getElementById('item-reservation-date')?.value;
        const resTime = document.getElementById('item-reservation-time')?.value || '19:00';
        if (resDate) {
          const [h, m] = resTime.split(':').map(Number);
          const dt = new Date(resDate);
          dt.setHours(h, m, 0, 0);
          itemData.startDate = dt.toISOString();
          itemData.reservationTime = dt.toISOString();
        }
        itemData.mealType = document.getElementById('item-meal-type')?.value || null;
        itemData.cuisine = document.getElementById('item-cuisine')?.value.trim() || null;
        break;

      case 'flight':
        const depDate = document.getElementById('item-departure-date')?.value;
        const depTime = document.getElementById('item-departure-time')?.value || '09:00';
        if (depDate) {
          const [h, m] = depTime.split(':').map(Number);
          const dt = new Date(depDate);
          dt.setHours(h, m, 0, 0);
          itemData.startDate = dt.toISOString();
          itemData.departureTime = dt.toISOString();
        }
        const arrDate = document.getElementById('item-arrival-date')?.value;
        const arrTime = document.getElementById('item-arrival-time')?.value || '12:00';
        if (arrDate) {
          const [h, m] = arrTime.split(':').map(Number);
          const dt = new Date(arrDate);
          dt.setHours(h, m, 0, 0);
          itemData.endDate = dt.toISOString();
          itemData.arrivalTime = dt.toISOString();
        }
        itemData.travelMode = document.getElementById('item-travel-mode')?.value || 'flight';
        itemData.fromLocation = document.getElementById('item-from-location')?.value.trim() || null;
        itemData.toLocation = document.getElementById('item-to-location')?.value.trim() || null;
        itemData.carrier = document.getElementById('item-carrier')?.value.trim() || null;
        itemData.flightNumber = document.getElementById('item-flight-number')?.value.trim() || null;
        itemData.confirmationNumber = document.getElementById('item-confirmation')?.value.trim() || null;
        // For travel items, build a display location
        if (itemData.fromLocation && itemData.toLocation) {
          itemData.location = `${itemData.fromLocation} → ${itemData.toLocation}`;
        }
        break;

      case 'other':
        const otherDate = document.getElementById('item-start-date')?.value;
        const otherTime = document.getElementById('item-start-time')?.value || '09:00';
        if (otherDate) {
          const [h, m] = otherTime.split(':').map(Number);
          const dt = new Date(otherDate);
          dt.setHours(h, m, 0, 0);
          itemData.startDate = dt.toISOString();
        }
        break;
    }

    // Initialize itineraryItems if needed
    if (!this.trip.itineraryItems) {
      this.trip.itineraryItems = [];
    }

    // Add to trip
    this.trip.itineraryItems.push(itemData);

    // Close modal and re-render
    this.closeAddItemModal();
    this.renderItinerary();

    // Save to Firestore
    await this.saveItineraryToFirestore();

    this.showToast(`${title} added to itinerary`);
  }

  async addItineraryItem(name, dateStr, timeStr, category, location, notes = '') {
    if (!this.trip) return;

    // Initialize itineraryItems array if needed
    if (!this.trip.itineraryItems) {
      this.trip.itineraryItems = [];
    }

    // Generate a unique ID
    const id = `itinerary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Parse the date and time
    const [hours, minutes] = timeStr.split(':').map(Number);
    const eventDate = new Date(dateStr);
    eventDate.setHours(hours, minutes, 0, 0);

    // Create new itinerary item
    const newItem = {
      id: id,
      name: name,
      category: category,
      startDate: eventDate.toISOString(),
      location: location || null,
      notes: notes || null,
      createdAt: new Date().toISOString()
    };

    // Add to array
    this.trip.itineraryItems.push(newItem);

    // Re-render the itinerary
    this.renderItinerary();

    // Save to Firestore
    await this.saveItineraryToFirestore();

    this.showToast('Event added to itinerary');
  }

  async deleteItineraryItem(itemId) {
    if (!this.trip || !this.trip.itineraryItems) return;

    // Find item by ID or index
    const index = this.trip.itineraryItems.findIndex(item =>
      item.id === itemId || item._originalIndex === parseInt(itemId)
    );

    if (index === -1) {
      // Try treating itemId as a direct index
      const directIndex = parseInt(itemId);
      if (!isNaN(directIndex) && directIndex >= 0 && directIndex < this.trip.itineraryItems.length) {
        this.trip.itineraryItems.splice(directIndex, 1);
      } else {
        console.error('Item not found:', itemId);
        return;
      }
    } else {
      this.trip.itineraryItems.splice(index, 1);
    }

    // Re-render the itinerary
    this.renderItinerary();

    // Save to Firestore
    await this.saveItineraryToFirestore();

    this.showToast('Event removed from itinerary');
  }

  async saveItineraryToFirestore() {
    if (!this.userId || !this.tripId || !this.trip) return;

    try {
      const db = firebase.firestore();
      await db
        .collection('users')
        .doc(this.userId)
        .collection('trips')
        .doc(this.tripId)
        .update({
          itineraryItems: this.trip.itineraryItems,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      console.log('Itinerary saved to Firestore');
    } catch (error) {
      console.error('Error saving itinerary:', error);
    }
  }

  // ============================================
  // Weather Widget
  // ============================================

  async loadWeather() {
    // Only show weather for active/upcoming trips with coordinates
    const phase = this.getTripPhase();
    if (phase === 'past') return;

    // Need coordinates or destination to get weather
    if (!this.trip.latitude && !this.trip.longitude && !this.trip.destination) return;

    const weatherSection = document.getElementById('trip-weather-section');
    if (!weatherSection) return;

    try {
      // Load user's temperature preference
      await this.loadTemperaturePreference();

      let lat, lon;

      // If we have coordinates, use them
      if (this.trip.latitude && this.trip.longitude) {
        lat = this.trip.latitude;
        lon = this.trip.longitude;
      } else {
        // Try to geocode the destination
        const coords = await this.geocodeDestination(this.trip.destination);
        if (!coords) return;
        lat = coords.lat;
        lon = coords.lon;
      }

      // Fetch weather from Open-Meteo (free, no API key required)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
      );

      if (!response.ok) return;

      const data = await response.json();
      const current = data.current;

      if (!current) return;

      // Show the weather section
      weatherSection.style.display = 'block';

      // Update temperature (using user's preferred unit)
      const tempEl = document.getElementById('trip-weather-temp');
      if (tempEl) {
        tempEl.textContent = `${this.convertTemperature(current.temperature_2m)}°`;
      }

      // Update description and icon
      const weatherInfo = this.getWeatherInfo(current.weather_code);
      const descEl = document.getElementById('trip-weather-desc');
      if (descEl) {
        descEl.textContent = weatherInfo.description;
      }

      // Update icon
      const iconEl = document.getElementById('trip-weather-icon');
      if (iconEl) {
        iconEl.innerHTML = weatherInfo.icon;
      }

      // Update location
      const locationEl = document.getElementById('trip-weather-location');
      if (locationEl) {
        locationEl.textContent = this.trip.destination;
      }

      // Update extra stats (using user's preferred unit)
      const feelsEl = document.getElementById('trip-weather-feels');
      if (feelsEl) {
        feelsEl.textContent = `${this.convertTemperature(current.apparent_temperature)}°`;
      }

      const humidityEl = document.getElementById('trip-weather-humidity');
      if (humidityEl) {
        humidityEl.textContent = `${current.relative_humidity_2m}%`;
      }

      const windEl = document.getElementById('trip-weather-wind');
      if (windEl) {
        windEl.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
      }

      // Store coordinates for forecast
      this.weatherCoords = { lat, lon };

    } catch (error) {
      console.warn('Failed to load weather:', error);
    }
  }

  setupForecastModalHandlers() {
    const modal = document.getElementById('weather-forecast-modal');
    const closeBtn = document.getElementById('weather-forecast-close');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    }
  }

  async showWeatherForecast() {
    if (!this.weatherCoords) return;

    const modal = document.getElementById('weather-forecast-modal');
    const listEl = document.getElementById('weather-forecast-list');
    const locationEl = document.getElementById('weather-forecast-location');

    if (!modal || !listEl) return;

    // Show modal with loading state
    modal.classList.add('active');
    listEl.innerHTML = '<div style="text-align: center; padding: 20px; color: #64748b;">Loading forecast...</div>';

    if (locationEl) {
      locationEl.textContent = this.trip.destination;
    }

    try {
      const { lat, lon } = this.weatherCoords;

      // Fetch 10-day forecast from Open-Meteo
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=10`
      );

      if (!response.ok) throw new Error('Failed to fetch forecast');

      const data = await response.json();
      const daily = data.daily;

      if (!daily || !daily.time) throw new Error('No forecast data');

      // Get trip date range
      const tripStart = this.trip.startDate ? new Date(this.trip.startDate) : null;
      const tripEnd = this.trip.endDate ? new Date(this.trip.endDate) : null;

      // Render forecast days
      let forecastHtml = '';
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      for (let i = 0; i < daily.time.length; i++) {
        const date = new Date(daily.time[i]);
        const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[date.getDay()];
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const weatherInfo = this.getWeatherInfo(daily.weather_code[i]);
        const highTemp = this.convertTemperature(daily.temperature_2m_max[i]);
        const lowTemp = this.convertTemperature(daily.temperature_2m_min[i]);

        // Check if this date falls within trip dates
        const isTripDate = this.isDateInTripRange(date, tripStart, tripEnd);

        // Determine icon class based on weather
        let iconClass = '';
        if ([3, 45, 48].includes(daily.weather_code[i])) {
          iconClass = 'cloudy';
        } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(daily.weather_code[i])) {
          iconClass = 'rainy';
        }

        forecastHtml += `
          <div class="weather-forecast-day ${isTripDate ? 'trip-date' : ''}">
            <div class="weather-forecast-day-info">
              <div class="weather-forecast-day-name">${dayName}</div>
              <div class="weather-forecast-day-date">${dateStr}</div>
            </div>
            <div class="weather-forecast-day-icon ${iconClass}">
              ${weatherInfo.icon}
            </div>
            <div class="weather-forecast-day-temps">
              <div class="weather-forecast-day-high">${highTemp}°</div>
              <div class="weather-forecast-day-low">${lowTemp}°</div>
            </div>
            <div class="weather-forecast-day-desc">${weatherInfo.description}</div>
          </div>
        `;
      }

      listEl.innerHTML = forecastHtml;

    } catch (error) {
      console.warn('Failed to load forecast:', error);
      listEl.innerHTML = '<div style="text-align: center; padding: 20px; color: #ef4444;">Failed to load forecast</div>';
    }
  }

  isDateInTripRange(date, tripStart, tripEnd) {
    if (!tripStart) return false;

    // Normalize dates to midnight for comparison
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const start = new Date(tripStart.getFullYear(), tripStart.getMonth(), tripStart.getDate());

    if (tripEnd) {
      const end = new Date(tripEnd.getFullYear(), tripEnd.getMonth(), tripEnd.getDate());
      return checkDate >= start && checkDate <= end;
    }

    // If no end date, just check start date
    return checkDate.getTime() === start.getTime();
  }

  // Load user's temperature unit preference from Firestore
  async loadTemperaturePreference() {
    if (!this.userId) return;

    try {
      const userDoc = await firebase.firestore()
        .collection('users')
        .doc(this.userId)
        .get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData.temperatureUnit) {
          this.temperatureUnit = userData.temperatureUnit;
        }
      }
    } catch (error) {
      console.warn('Failed to load temperature preference:', error);
    }
  }

  // Convert temperature based on user preference
  convertTemperature(celsiusTemp) {
    if (this.temperatureUnit === 'fahrenheit') {
      return Math.round(celsiusTemp * 9/5 + 32);
    }
    return Math.round(celsiusTemp);
  }

  // Get temperature unit symbol
  getTempSymbol() {
    return this.temperatureUnit === 'fahrenheit' ? '°F' : '°C';
  }

  async geocodeDestination(destination) {
    try {
      // Use Open-Meteo's geocoding API (free, no key required)
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1&language=en&format=json`
      );

      if (!response.ok) return null;

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return {
          lat: data.results[0].latitude,
          lon: data.results[0].longitude
        };
      }
      return null;
    } catch (error) {
      console.warn('Geocoding failed:', error);
      return null;
    }
  }

  getWeatherInfo(code) {
    // WMO Weather interpretation codes
    const weatherCodes = {
      0: { description: 'Clear sky', icon: this.getSunIcon() },
      1: { description: 'Mainly clear', icon: this.getSunIcon() },
      2: { description: 'Partly cloudy', icon: this.getPartlyCloudyIcon() },
      3: { description: 'Overcast', icon: this.getCloudIcon() },
      45: { description: 'Foggy', icon: this.getFogIcon() },
      48: { description: 'Depositing rime fog', icon: this.getFogIcon() },
      51: { description: 'Light drizzle', icon: this.getDrizzleIcon() },
      53: { description: 'Moderate drizzle', icon: this.getDrizzleIcon() },
      55: { description: 'Dense drizzle', icon: this.getDrizzleIcon() },
      61: { description: 'Slight rain', icon: this.getRainIcon() },
      63: { description: 'Moderate rain', icon: this.getRainIcon() },
      65: { description: 'Heavy rain', icon: this.getRainIcon() },
      71: { description: 'Slight snow', icon: this.getSnowIcon() },
      73: { description: 'Moderate snow', icon: this.getSnowIcon() },
      75: { description: 'Heavy snow', icon: this.getSnowIcon() },
      77: { description: 'Snow grains', icon: this.getSnowIcon() },
      80: { description: 'Slight rain showers', icon: this.getRainIcon() },
      81: { description: 'Moderate rain showers', icon: this.getRainIcon() },
      82: { description: 'Violent rain showers', icon: this.getRainIcon() },
      85: { description: 'Slight snow showers', icon: this.getSnowIcon() },
      86: { description: 'Heavy snow showers', icon: this.getSnowIcon() },
      95: { description: 'Thunderstorm', icon: this.getThunderstormIcon() },
      96: { description: 'Thunderstorm with hail', icon: this.getThunderstormIcon() },
      99: { description: 'Thunderstorm with heavy hail', icon: this.getThunderstormIcon() }
    };

    return weatherCodes[code] || { description: 'Unknown', icon: this.getSunIcon() };
  }

  getSunIcon() {
    return `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
    </svg>`;
  }

  getPartlyCloudyIcon() {
    return `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.74 5.47C15.1 6.5 16.35 9.03 15.92 11.46c.9.4 1.54 1.18 1.78 2.08.51-.37 1.02-.81 1.4-1.36 1.56-2.26 1.15-5.39-1.05-7.14-2.05-1.63-4.95-1.52-6.85.18l1.54.25z"/>
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17-.36.23-.69.5-1 .78C5.07 4.6 3.02 5.62 2 7.32c-.69 1.14-.88 2.51-.5 3.78-.93.91-1.5 2.17-1.5 3.57 0 2.66 2.16 4.83 4.83 4.83h13.02c2.36 0 4.28-1.92 4.28-4.28 0-1.79-1.1-3.33-2.66-3.97l-.12-1.21zM18.35 18H4.83C3.27 18 2 16.73 2 15.17c0-1.38.94-2.57 2.25-2.9l.85-.22.14-.89c.22-1.4 1.45-2.43 2.85-2.43.32 0 .63.06.93.16l.77.27.62-.55c.85-.76 1.93-1.17 3.03-1.17 2.5 0 4.54 2.04 4.54 4.54 0 .49-.08.96-.22 1.41l-.34 1.07.97.48c.8.4 1.29 1.22 1.29 2.14 0 1.29-1.05 2.35-2.35 2.35z"/>
    </svg>`;
  }

  getCloudIcon() {
    return `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C8.02 7.57 9.92 6 12 6c2.76 0 5 2.24 5 5v1h2c1.65 0 3 1.35 3 3s-1.35 3-3 3z"/>
    </svg>`;
  }

  getFogIcon() {
    return `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 15h18v2H3zm0 4h18v2H3zm0-8h18v2H3zm0-4h18v2H3z"/>
    </svg>`;
  }

  getDrizzleIcon() {
    return `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-5c-.83 0-1.5-.67-1.5-1.5S11.17 8.5 12 8.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
    </svg>`;
  }

  getRainIcon() {
    return `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2z"/>
    </svg>`;
  }

  getSnowIcon() {
    return `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22z"/>
    </svg>`;
  }

  getThunderstormIcon() {
    return `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.92 7.02C17.45 4.18 14.97 2 12 2 9.82 2 7.83 3.18 6.78 5.06 4.09 5.41 2 7.74 2 10.5 2 13.53 4.47 16 7.5 16h10c2.48 0 4.5-2.02 4.5-4.5 0-2.34-1.79-4.27-4.08-4.48zM17.5 14h-4.5l2.5 4.5h-3L9 22l1-4.5H7.5l3-3.5h5l-1.5-3h3.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5z"/>
    </svg>`;
  }

  // ============================================
  // Trip Menu, Edit & Delete
  // ============================================

  setupTripMenu() {
    const menuBtn = document.getElementById('trip-menu-btn');
    const menuDropdown = document.getElementById('trip-menu-dropdown');
    const editBtn = document.getElementById('edit-trip-btn');
    const deleteBtn = document.getElementById('delete-trip-btn');

    if (menuBtn && menuDropdown) {
      // Toggle menu
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menuDropdown.classList.toggle('active');
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!menuDropdown.contains(e.target) && !menuBtn.contains(e.target)) {
          menuDropdown.classList.remove('active');
        }
      });
    }

    if (editBtn) {
      editBtn.addEventListener('click', () => {
        menuDropdown.classList.remove('active');
        this.openEditModal();
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        menuDropdown.classList.remove('active');
        this.openDeleteModal();
      });
    }

    // Edit modal close handlers
    const editModalClose = document.getElementById('edit-modal-close');
    const editModalCancel = document.getElementById('edit-modal-cancel');
    const editModalSave = document.getElementById('edit-modal-save');
    const editModalBackdrop = document.querySelector('#edit-trip-modal .trip-modal-backdrop');

    if (editModalClose) editModalClose.addEventListener('click', () => this.closeEditModal());
    if (editModalCancel) editModalCancel.addEventListener('click', () => this.closeEditModal());
    if (editModalBackdrop) editModalBackdrop.addEventListener('click', () => this.closeEditModal());
    if (editModalSave) editModalSave.addEventListener('click', () => this.saveEditedTrip());

    // Delete modal close handlers
    const deleteModalClose = document.getElementById('delete-modal-close');
    const deleteModalCancel = document.getElementById('delete-modal-cancel');
    const deleteModalConfirm = document.getElementById('delete-modal-confirm');
    const deleteModalBackdrop = document.querySelector('#delete-trip-modal .trip-modal-backdrop');

    if (deleteModalClose) deleteModalClose.addEventListener('click', () => this.closeDeleteModal());
    if (deleteModalCancel) deleteModalCancel.addEventListener('click', () => this.closeDeleteModal());
    if (deleteModalBackdrop) deleteModalBackdrop.addEventListener('click', () => this.closeDeleteModal());
    if (deleteModalConfirm) deleteModalConfirm.addEventListener('click', () => this.confirmDeleteTrip());
  }

  openEditModal() {
    if (!this.trip) return;

    // Populate form with current values
    document.getElementById('edit-trip-name').value = this.trip.name || '';
    document.getElementById('edit-trip-destination').value = this.trip.destination || '';

    // Format dates for input fields (YYYY-MM-DD)
    const formatDate = (date) => {
      if (!date) return '';
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    };

    document.getElementById('edit-trip-start').value = formatDate(this.trip.startDate);
    document.getElementById('edit-trip-end').value = formatDate(this.trip.endDate);
    document.getElementById('edit-trip-context').value = this.trip.context || '';

    // Show modal
    document.getElementById('edit-trip-modal').classList.add('active');
  }

  closeEditModal() {
    document.getElementById('edit-trip-modal').classList.remove('active');
  }

  async saveEditedTrip() {
    const saveBtn = document.getElementById('edit-modal-save');
    const name = document.getElementById('edit-trip-name').value.trim();
    const destination = document.getElementById('edit-trip-destination').value.trim();
    const startDateStr = document.getElementById('edit-trip-start').value;
    const endDateStr = document.getElementById('edit-trip-end').value;
    const context = document.getElementById('edit-trip-context').value;

    // Validation
    if (!name) {
      this.showToast('Please enter a trip name');
      return;
    }
    if (!startDateStr || !endDateStr) {
      this.showToast('Please select start and end dates');
      return;
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (endDate < startDate) {
      this.showToast('End date must be after start date');
      return;
    }

    // Disable save button
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    try {
      const db = firebase.firestore();
      await db
        .collection('users')
        .doc(this.userId)
        .collection('trips')
        .doc(this.tripId)
        .update({
          name: name,
          destination: destination,
          startDate: firebase.firestore.Timestamp.fromDate(startDate),
          endDate: firebase.firestore.Timestamp.fromDate(endDate),
          context: context || null,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

      // Update local trip data
      this.trip.name = name;
      this.trip.destination = destination;
      this.trip.startDate = startDate;
      this.trip.endDate = endDate;
      this.trip.context = context || null;

      // Re-render
      this.renderTrip();

      // Close modal and show toast
      this.closeEditModal();
      this.showToast('Trip updated successfully');
    } catch (error) {
      console.error('Error updating trip:', error);
      this.showToast('Failed to update trip');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Changes';
    }
  }

  openDeleteModal() {
    if (!this.trip) return;

    document.getElementById('delete-trip-name').textContent = this.trip.name;
    document.getElementById('delete-trip-modal').classList.add('active');
  }

  closeDeleteModal() {
    document.getElementById('delete-trip-modal').classList.remove('active');
  }

  async confirmDeleteTrip() {
    const confirmBtn = document.getElementById('delete-modal-confirm');

    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Deleting...';

    try {
      const db = firebase.firestore();
      await db
        .collection('users')
        .doc(this.userId)
        .collection('trips')
        .doc(this.tripId)
        .delete();

      // Redirect to trips page
      window.location.href = '/trips.html';
    } catch (error) {
      console.error('Error deleting trip:', error);
      this.showToast('Failed to delete trip');
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Delete Trip';
    }
  }

  showToast(message) {
    const toast = document.getElementById('trip-toast');
    const toastMessage = document.getElementById('trip-toast-message');

    if (toast && toastMessage) {
      toastMessage.textContent = message;
      toast.classList.add('show');

      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
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

    // Show the menu button
    const menuBtn = document.getElementById('trip-menu-btn');
    if (menuBtn) {
      menuBtn.style.display = 'flex';
    }
  }

  // ============================================
  // Trip Essentials (Gemini AI Integration)
  // ============================================

  setupEssentialsModal() {
    const modal = document.getElementById('essential-modal');
    const closeBtn = document.getElementById('essential-modal-close');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    }
  }

  async renderEssentials() {
    const gridEl = document.getElementById('trip-essentials-grid');
    const sectionEl = document.getElementById('trip-essentials-section');
    if (!gridEl || !sectionEl) return;

    // Check if premium user
    const isPremium = await this.checkPremiumStatus();

    // Get country code from destination
    const countryCode = await this.getCountryCodeFromDestination(this.trip.destination);

    // Define essentials tiles - ALL are TripPortier+ features
    const essentials = [
      {
        id: 'plug',
        title: 'Plug & Voltage',
        icon: this.getPlugIcon(),
        isPremium: true,
        dataKey: 'plug'
      },
      {
        id: 'visa',
        title: 'Visa Requirements',
        icon: this.getPassportIcon(),
        isPremium: true,
        dataKey: 'visa'
      },
      {
        id: 'language',
        title: 'Language',
        icon: this.getLanguageIcon(),
        isPremium: true,
        dataKey: 'culture'
      },
      {
        id: 'emergency',
        title: 'Emergency',
        icon: this.getEmergencyIcon(),
        isPremium: true,
        dataKey: 'emergency'
      },
      {
        id: 'timezone',
        title: 'Timezone',
        icon: this.getTimezoneIcon(),
        isPremium: true,
        dataKey: 'timezone'
      },
      {
        id: 'water-food',
        title: 'Water & Food',
        icon: this.getWaterFoodIcon(),
        isPremium: true,
        dataKey: 'waterFood'
      }
    ];

    let html = '';
    for (const essential of essentials) {
      const isLocked = essential.isPremium && !isPremium;

      html += `
        <div class="trip-essential-card ${essential.id}"
             data-essential-id="${essential.id}"
             data-data-key="${essential.dataKey}"
             ${isLocked ? 'data-locked="true"' : ''}
             onclick="window.tripDetailManager.openEssentialDetail('${essential.id}', '${essential.dataKey}', ${isLocked})">
          ${isLocked ? '<span class="essential-premium-badge">TripPortier+</span>' : ''}
          <div class="trip-essential-icon">
            ${essential.icon}
          </div>
          <span class="trip-essential-title">${essential.title}</span>
        </div>
      `;
    }

    gridEl.innerHTML = html;
  }

  async openEssentialDetail(essentialId, dataKey, isLocked) {
    if (isLocked) {
      // Show premium upgrade prompt
      this.showPremiumPrompt();
      return;
    }

    const modal = document.getElementById('essential-modal');
    const iconEl = document.getElementById('essential-modal-icon');
    const titleEl = document.getElementById('essential-modal-title');
    const destEl = document.getElementById('essential-modal-destination');
    const bodyEl = document.getElementById('essential-modal-body');

    if (!modal) return;

    // Show loading state
    modal.classList.add('active');
    bodyEl.innerHTML = '<div class="essential-loading"><div class="essential-loading-spinner"></div><p>Loading essential info...</p></div>';

    // Set header info
    const titles = {
      plug: 'Plug & Voltage',
      visa: 'Visa Requirements',
      language: 'Language',
      emergency: 'Emergency',
      timezone: 'Timezone',
      'water-food': 'Water & Food'
    };

    const icons = {
      plug: this.getPlugIcon(),
      visa: this.getPassportIcon(),
      language: this.getLanguageIcon(),
      emergency: this.getEmergencyIcon(),
      timezone: this.getTimezoneIcon(),
      'water-food': this.getWaterFoodIcon()
    };

    titleEl.textContent = titles[essentialId] || 'Essential Info';
    iconEl.innerHTML = icons[essentialId] || '';
    iconEl.className = `essential-modal-icon ${essentialId}`;
    destEl.textContent = this.trip.destination;

    try {
      // Fetch or load cached data
      const essentialsData = await this.fetchEssentialsData();

      if (!essentialsData) {
        bodyEl.innerHTML = '<div class="essential-error">Unable to load essentials data. Please try again later.</div>';
        return;
      }

      // Render the specific essential detail
      bodyEl.innerHTML = this.renderEssentialContent(essentialId, dataKey, essentialsData);

    } catch (error) {
      console.error('Error fetching essential:', error);
      bodyEl.innerHTML = '<div class="essential-error">Failed to load essentials. Please try again.</div>';
    }
  }

  async fetchEssentialsData() {
    const destination = this.trip.destination;
    if (!destination) return null;

    // Check cache first
    const cacheKey = `essentials_${destination.toLowerCase().replace(/\s+/g, '_')}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const { data, cachedAt } = JSON.parse(cached);
        // Cache expires after 30 days
        const expiryMs = 30 * 24 * 60 * 60 * 1000;
        if (Date.now() - cachedAt < expiryMs) {
          console.log('✅ Using cached essentials for:', destination);
          return data;
        }
      } catch (e) {
        // Invalid cache, continue to fetch
      }
    }

    // Fetch from Gemini via Firebase Cloud Function (API key stays server-side)
    console.log('🔄 Fetching essentials via Firebase Function for:', destination);

    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        console.warn('User not authenticated, using fallback data');
        return this.getFallbackEssentialsData();
      }

      // Get country code
      const countryCode = await this.getCountryCodeFromDestination(destination);
      console.log('📍 Country code:', countryCode);

      // Get user's home country from profile if available
      let userHomeCountry = 'Switzerland';
      let userNationalities = [];

      try {
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          userHomeCountry = userData.homeCountry || userData.country || 'Switzerland';
          userNationalities = userData.nationalities || [];
        }
      } catch (e) {
        console.warn('Could not fetch user profile, using defaults');
      }

      // Call Firebase Function (API key is secure on server)
      const functions = firebase.functions();
      const fetchEssentials = functions.httpsCallable('fetchTravelEssentials');

      console.log('📡 Calling fetchTravelEssentials Firebase Function...');
      const result = await fetchEssentials({
        destination: destination,
        countryCode: countryCode || 'US',
        userHomeCountry: userHomeCountry,
        userNationalities: userNationalities
      });

      console.log('📦 Function result:', result.data);

      if (result.data && result.data.success) {
        const essentialsData = result.data.essentials;

        // Cache the result
        localStorage.setItem(cacheKey, JSON.stringify({
          data: essentialsData,
          cachedAt: Date.now()
        }));

        console.log('✅ Essentials data cached successfully');
        return essentialsData;
      } else {
        console.error('Function returned error:', result.data?.error);
        throw new Error(result.data?.error || 'Failed to fetch essentials');
      }
    } catch (error) {
      console.error('❌ Error fetching essentials:', error);

      // Return fallback data for timezone at least
      return this.getFallbackEssentialsData();
    }
  }

  getFallbackEssentialsData() {
    // Basic fallback data
    return {
      timezone: {
        offset: 'Unknown',
        name: this.trip.destination
      },
      emergency: {
        police: '911',
        ambulance: '911',
        fire: '911',
        phrases: []
      }
    };
  }

  renderEssentialContent(essentialId, dataKey, data) {
    switch (essentialId) {
      case 'plug':
        return this.renderPlugContent(data.plug || data.electrical);

      case 'visa':
        return this.renderVisaContent(data.visa);

      case 'language':
        return this.renderLanguageContent(data.culture);

      case 'emergency':
        return this.renderEmergencyContent(data.emergency);

      case 'timezone':
        return this.renderTimezoneContent(data.timezone);

      case 'water-food':
        return this.renderWaterFoodContent(data.waterFood);

      default:
        return '<p>No information available.</p>';
    }
  }

  renderPlugContent(data) {
    if (!data) return '<p>Plug and voltage information not available.</p>';

    return `
      <div class="essential-detail-section">
        <h3>Plug Types</h3>
        <p>${data.plugTypes || data.types || 'Standard plug types'}</p>
      </div>
      <div class="essential-detail-section">
        <h3>Voltage</h3>
        <p>${data.voltage || '220-240V'}</p>
      </div>
      <div class="essential-detail-section">
        <h3>Frequency</h3>
        <p>${data.frequency || '50Hz'}</p>
      </div>
      ${data.adapterNeeded !== undefined ? `
        <div class="essential-detail-section">
          <h3>Adapter Needed?</h3>
          <p>${data.adapterNeeded ? 'Yes, you may need an adapter' : 'No adapter needed'}</p>
        </div>
      ` : ''}
    `;
  }

  renderVisaContent(data) {
    if (!data) return '<p>Visa information not available. Please check official sources.</p>';

    let html = `
      <div class="essential-detail-section">
        <h3>Overview</h3>
        <p>${data.description || 'Check visa requirements for your nationality.'}</p>
      </div>
    `;

    if (data.officialURL) {
      html += `
        <div class="essential-detail-section">
          <h3>Official Source</h3>
          <a href="${data.officialURL}" target="_blank" rel="noopener" class="essential-link">
            Visit official immigration website →
          </a>
        </div>
      `;
    }

    if (data.entryRequirements && data.entryRequirements.length > 0) {
      html += `<div class="essential-detail-section"><h3>Entry Requirements</h3>`;
      for (const req of data.entryRequirements) {
        html += `
          <div class="essential-requirement">
            <strong>${req.name}</strong>
            <p>${req.description}</p>
            ${req.timing ? `<p class="essential-timing">${req.timing}</p>` : ''}
            ${req.url ? `<a href="${req.url}" target="_blank" rel="noopener" class="essential-link">Complete online →</a>` : ''}
          </div>
        `;
      }
      html += '</div>';
    }

    return html;
  }

  renderLanguageContent(data) {
    if (!data) return '<p>Language information not available.</p>';

    let html = `
      <div class="essential-detail-section">
        <h3>Official Language</h3>
        <p>${data.primaryLanguage || data.language || 'Local language'}</p>
      </div>
    `;

    if (data.englishLevel) {
      html += `
        <div class="essential-detail-section">
          <h3>English Proficiency</h3>
          <p>${data.englishLevel}</p>
        </div>
      `;
    }

    if (data.usefulPhrases && data.usefulPhrases.length > 0) {
      html += `<div class="essential-detail-section"><h3>Useful Phrases</h3><div class="essential-phrases">`;
      for (const phrase of data.usefulPhrases.slice(0, 10)) {
        html += `
          <div class="essential-phrase">
            <span class="phrase-english">${phrase.english}</span>
            <span class="phrase-local">${phrase.local}</span>
            ${phrase.pronunciation ? `<span class="phrase-pronunciation">${phrase.pronunciation}</span>` : ''}
          </div>
        `;
      }
      html += '</div></div>';
    }

    return html;
  }

  renderEmergencyContent(data) {
    if (!data) return '<p>Emergency numbers not available. Dial local emergency services.</p>';

    let html = `
      <div class="essential-detail-section emergency-numbers">
        <h3>Emergency Numbers</h3>
        <div class="emergency-number-grid">
          <div class="emergency-number-item">
            <span class="emergency-label">Police</span>
            <a href="tel:${data.police}" class="emergency-number">${data.police}</a>
          </div>
          <div class="emergency-number-item">
            <span class="emergency-label">Ambulance</span>
            <a href="tel:${data.ambulance}" class="emergency-number">${data.ambulance}</a>
          </div>
          <div class="emergency-number-item">
            <span class="emergency-label">Fire</span>
            <a href="tel:${data.fire}" class="emergency-number">${data.fire}</a>
          </div>
        </div>
      </div>
    `;

    if (data.phrases && data.phrases.length > 0) {
      html += `<div class="essential-detail-section"><h3>Emergency Phrases</h3><div class="essential-phrases">`;
      for (const phrase of data.phrases) {
        html += `
          <div class="essential-phrase">
            <span class="phrase-english">${phrase.english}</span>
            <span class="phrase-local">${phrase.local}</span>
            ${phrase.pronunciation ? `<span class="phrase-pronunciation">${phrase.pronunciation}</span>` : ''}
          </div>
        `;
      }
      html += '</div></div>';
    }

    return html;
  }

  renderTimezoneContent(data) {
    // Calculate timezone info based on destination
    const now = new Date();
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    let html = `
      <div class="essential-detail-section">
        <h3>Destination Timezone</h3>
        <p>${data?.name || this.trip.destination}</p>
        ${data?.offset ? `<p class="timezone-offset">${data.offset}</p>` : ''}
      </div>
      <div class="essential-detail-section">
        <h3>Your Current Time</h3>
        <p>${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}</p>
      </div>
    `;

    if (data?.currentTime) {
      html += `
        <div class="essential-detail-section">
          <h3>Time in ${this.trip.destination}</h3>
          <p>${data.currentTime}</p>
        </div>
      `;
    }

    if (data?.difference) {
      html += `
        <div class="essential-detail-section">
          <h3>Time Difference</h3>
          <p>${data.difference}</p>
        </div>
      `;
    }

    return html;
  }

  renderWaterFoodContent(data) {
    if (!data) return '<p>Water and food safety information not available.</p>';

    let html = '';

    if (data.tapWaterSafe !== undefined) {
      html += `
        <div class="essential-detail-section">
          <h3>Tap Water</h3>
          <p class="safety-indicator ${data.tapWaterSafe ? 'safe' : 'caution'}">
            ${data.tapWaterSafe ? '✓ Generally safe to drink' : '⚠ Bottled water recommended'}
          </p>
          ${data.waterNotes ? `<p>${data.waterNotes}</p>` : ''}
        </div>
      `;
    }

    if (data.streetFoodSafe !== undefined) {
      html += `
        <div class="essential-detail-section">
          <h3>Street Food</h3>
          <p class="safety-indicator ${data.streetFoodSafe ? 'safe' : 'caution'}">
            ${data.streetFoodSafe ? '✓ Generally safe' : '⚠ Exercise caution'}
          </p>
          ${data.foodNotes ? `<p>${data.foodNotes}</p>` : ''}
        </div>
      `;
    }

    if (data.tips && data.tips.length > 0) {
      html += `<div class="essential-detail-section"><h3>Tips</h3><ul class="essential-tips">`;
      for (const tip of data.tips) {
        html += `<li>${tip}</li>`;
      }
      html += '</ul></div>';
    }

    return html || '<p>Water and food information not available.</p>';
  }

  async getCountryCodeFromDestination(destination) {
    if (!destination) return null;

    try {
      // Use geocoding API to get country
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1&language=en&format=json`
      );

      if (!response.ok) return null;

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].country_code;
      }
      return null;
    } catch (error) {
      console.warn('Failed to get country code:', error);
      return null;
    }
  }

  showPremiumPrompt() {
    // Show a toast or modal prompting upgrade
    this.showToast('Upgrade to TripPortier+ to access this feature');
  }

  // Essential Icons
  getPlugIcon() {
    return `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.06-7.44 7-7.93v15.86zm2 0V4.07c3.94.49 7 3.85 7 7.93s-3.06 7.44-7 7.93z"/>
    </svg>`;
  }

  getPassportIcon() {
    return `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H6zm6 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1z"/>
    </svg>`;
  }

  getLanguageIcon() {
    return `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
    </svg>`;
  }

  getEmergencyIcon() {
    return `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>`;
  }

  getTimezoneIcon() {
    return `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
    </svg>`;
  }

  getWaterFoodIcon() {
    return `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2z"/>
    </svg>`;
  }
}

// Create global instance
window.tripDetailManager = new TripDetailManager();
