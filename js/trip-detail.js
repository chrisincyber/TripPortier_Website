/**
 * TripPortier Trip Detail Page
 * Displays full trip information with tabs matching iOS app
 * Loads real data from Firestore for cross-device sync
 */

class TripDetailManager {
  constructor() {
    this.trip = null;
    this.userId = null;
    this.pexelsApiKey = 'fiziyDodPH9hgsBsgMmMbojhWIBuOQD6TNarSRS4MRx96j0c7Rq0pL0h';
    this.selectedTab = 'hub';
    this.selectedPlanSubtab = 'packing';

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
        currency: data.currency || 'USD'
      };

      console.log('Loaded trip data:', {
        id: this.trip.id,
        name: this.trip.name,
        itineraryCount: this.trip.itineraryItems.length,
        packingCount: this.trip.packingItems.length,
        todosCount: this.trip.todos.length
      });

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

  renderItinerary() {
    const items = this.trip.itineraryItems;
    const container = document.getElementById('itinerary-days');
    const emptyState = document.getElementById('itinerary-empty');

    if (!items || items.length === 0) {
      emptyState.style.display = 'flex';
      container.innerHTML = '';
      return;
    }

    emptyState.style.display = 'none';

    // Group items by date
    const itemsByDate = {};
    items.forEach(item => {
      const date = this.parseDate(item.startDate || item.date);
      if (!date) return;
      const dateKey = date.toDateString();
      if (!itemsByDate[dateKey]) {
        itemsByDate[dateKey] = [];
      }
      itemsByDate[dateKey].push(item);
    });

    // Sort dates
    const sortedDates = Object.keys(itemsByDate).sort((a, b) => new Date(a) - new Date(b));

    // Add original index to items for tracking
    items.forEach((item, index) => {
      item._originalIndex = index;
    });

    // Render days
    container.innerHTML = sortedDates.map(dateKey => {
      const date = new Date(dateKey);
      const dayItems = itemsByDate[dateKey].sort((a, b) => {
        const aDate = this.parseDate(a.startDate || a.date);
        const bDate = this.parseDate(b.startDate || b.date);
        return (aDate || 0) - (bDate || 0);
      });

      const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
      const formattedDate = date.toLocaleDateString('en-US', dateOptions);

      return `
        <div class="itinerary-day">
          <div class="itinerary-day-header">
            <h3>${formattedDate}</h3>
            <span class="itinerary-day-count">${dayItems.length} ${dayItems.length === 1 ? 'event' : 'events'}</span>
          </div>
          <div class="itinerary-day-items">
            ${dayItems.map(item => this.renderItineraryItem(item, item._originalIndex)).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  renderItineraryItem(item, index) {
    const startDate = this.parseDate(item.startDate || item.date);
    const timeStr = startDate ? startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';
    const icon = this.getItineraryIcon(item.category || item.type);
    const category = item.category || item.type || 'event';

    return `
      <div class="itinerary-item itinerary-item-${category.toLowerCase()}" data-item-id="${item.id || index}">
        <div class="itinerary-item-time">${timeStr}</div>
        <div class="itinerary-item-icon">${icon}</div>
        <div class="itinerary-item-content">
          <div class="itinerary-item-title">${this.escapeHtml(item.name || item.title || 'Untitled')}</div>
          ${item.location ? `<div class="itinerary-item-location">${this.escapeHtml(item.location)}</div>` : ''}
          ${item.notes ? `<div class="itinerary-item-notes">${this.escapeHtml(item.notes)}</div>` : ''}
        </div>
        ${item.homeCurrencyAmount ? `<div class="itinerary-item-cost">$${item.homeCurrencyAmount.toFixed(2)}</div>` : ''}
        <div class="itinerary-item-actions">
          <button class="itinerary-action-btn delete" onclick="event.stopPropagation(); window.tripDetailManager.deleteItineraryItem('${item.id || index}')" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  getItineraryIcon(category) {
    const icons = {
      'flight': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>',
      'hotel': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/></svg>',
      'restaurant': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>',
      'activity': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/></svg>',
      'transport': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>',
      'event': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>'
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
        <a href="airport-transfers.html" class="suggestion-card-action">
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
    const nameInput = document.getElementById('itinerary-name-input');
    const dateInput = document.getElementById('itinerary-date-input');
    const timeInput = document.getElementById('itinerary-time-input');
    const categorySelect = document.getElementById('itinerary-category-select');
    const locationInput = document.getElementById('itinerary-location-input');
    const notesInput = document.getElementById('itinerary-notes-input');
    const addBtn = document.getElementById('add-itinerary-btn');

    // Set default date to trip start date when trip loads
    if (dateInput && this.trip) {
      const startDate = this.trip.startDate;
      if (startDate) {
        dateInput.value = startDate.toISOString().split('T')[0];
      }
    }

    if (nameInput && addBtn) {
      const addItineraryItem = () => {
        const name = nameInput.value.trim();
        const dateStr = dateInput ? dateInput.value : '';
        const timeStr = timeInput ? timeInput.value : '09:00';
        const category = categorySelect ? categorySelect.value : 'activity';
        const location = locationInput ? locationInput.value.trim() : '';
        const notes = notesInput ? notesInput.value.trim() : '';

        if (name && dateStr) {
          this.addItineraryItem(name, dateStr, timeStr, category, location, notes);
          nameInput.value = '';
          if (locationInput) locationInput.value = '';
          if (notesInput) notesInput.value = '';
        } else if (!name) {
          this.showToast('Please enter an event name');
        } else if (!dateStr) {
          this.showToast('Please select a date');
        }
      };

      addBtn.addEventListener('click', addItineraryItem);
      nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          addItineraryItem();
        }
      });
    }
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

      // Update temperature
      const tempEl = document.getElementById('trip-weather-temp');
      if (tempEl) {
        tempEl.textContent = `${Math.round(current.temperature_2m)}°`;
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

      // Update extra stats
      const feelsEl = document.getElementById('trip-weather-feels');
      if (feelsEl) {
        feelsEl.textContent = `${Math.round(current.apparent_temperature)}°`;
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
        const highTemp = Math.round(daily.temperature_2m_max[i]);
        const lowTemp = Math.round(daily.temperature_2m_min[i]);

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

    // Define essentials tiles - matching iOS app
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
        isPremium: false,
        dataKey: 'emergency'
      },
      {
        id: 'timezone',
        title: 'Timezone',
        icon: this.getTimezoneIcon(),
        isPremium: false,
        dataKey: 'timezone'
      },
      {
        id: 'water-food',
        title: 'Water & Food',
        icon: this.getWaterFoodIcon(),
        isPremium: false,
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

    // Fetch from Gemini via Firebase function
    console.log('🔄 Fetching essentials from Gemini for:', destination);

    try {
      const user = firebase.auth().currentUser;
      if (!user) throw new Error('Not authenticated');

      // Get country code
      const countryCode = await this.getCountryCodeFromDestination(destination);

      // Call Firebase function
      const fetchEssentials = firebase.functions().httpsCallable('fetchTravelEssentials');
      const result = await fetchEssentials({
        destination: destination,
        countryCode: countryCode || 'US'
      });

      if (result.data && result.data.success) {
        const essentialsData = result.data.essentials;

        // Cache the result
        localStorage.setItem(cacheKey, JSON.stringify({
          data: essentialsData,
          cachedAt: Date.now()
        }));

        return essentialsData;
      } else {
        throw new Error(result.data?.error || 'Failed to fetch essentials');
      }
    } catch (error) {
      console.error('Error fetching essentials:', error);

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
