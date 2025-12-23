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

    if (aiFab && aiOverlay) {
      aiFab.addEventListener('click', () => {
        aiOverlay.classList.add('active');
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

    // AI suggestion buttons
    const suggestions = document.querySelectorAll('.trip-ai-suggestion');
    suggestions.forEach(btn => {
      btn.addEventListener('click', () => {
        const prompt = btn.dataset.prompt;
        // For now, redirect to app store with the prompt context
        window.open('https://apps.apple.com/app/tripportier', '_blank');
      });
    });
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
        longitude: data.longitude || null,
        // Trip data for tabs
        itineraryItems: data.itineraryItems || [],
        packingItems: data.packingItems || [],
        todos: data.todos || [],
        documents: data.documents || [],
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

      if (!this.trip.startDate || !this.trip.endDate) {
        this.showError();
        return;
      }

      this.renderTrip();
      this.renderItinerary();
      this.renderPackingList();
      this.renderTodos();
      this.renderBudget();
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

    // Itinerary dates subtitle
    const itineraryDates = document.getElementById('itinerary-dates');
    if (itineraryDates) {
      const shortDateOptions = { month: 'short', day: 'numeric' };
      itineraryDates.textContent = `${trip.startDate.toLocaleDateString('en-US', shortDateOptions)} - ${trip.endDate.toLocaleDateString('en-US', shortDateOptions)}`;
    }

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
            ${dayItems.map(item => this.renderItineraryItem(item)).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  renderItineraryItem(item) {
    const startDate = this.parseDate(item.startDate || item.date);
    const timeStr = startDate ? startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';
    const icon = this.getItineraryIcon(item.category || item.type);
    const category = item.category || item.type || 'event';

    return `
      <div class="itinerary-item itinerary-item-${category.toLowerCase()}">
        <div class="itinerary-item-time">${timeStr}</div>
        <div class="itinerary-item-icon">${icon}</div>
        <div class="itinerary-item-content">
          <div class="itinerary-item-title">${this.escapeHtml(item.name || item.title || 'Untitled')}</div>
          ${item.location ? `<div class="itinerary-item-location">${this.escapeHtml(item.location)}</div>` : ''}
          ${item.notes ? `<div class="itinerary-item-notes">${this.escapeHtml(item.notes)}</div>` : ''}
        </div>
        ${item.homeCurrencyAmount ? `<div class="itinerary-item-cost">$${item.homeCurrencyAmount.toFixed(2)}</div>` : ''}
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
        ${quantity > 1 ? `<span class="packing-item-qty">x${quantity}</span>` : ''}
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

  renderBudget() {
    const items = this.trip.itineraryItems.filter(item =>
      item.homeCurrencyAmount || item.currencyAmount
    );
    const container = document.getElementById('expenses-list');
    const emptyState = document.getElementById('budget-empty');
    const overview = document.getElementById('budget-overview');
    const totalAmountEl = document.getElementById('budget-total-amount');
    const breakdownEl = document.getElementById('budget-breakdown');

    if (!items || items.length === 0) {
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

    items.forEach(item => {
      const amount = item.homeCurrencyAmount || item.currencyAmount || 0;
      const category = item.category || 'Other';
      totalsByCategory[category] = (totalsByCategory[category] || 0) + amount;
      grandTotal += amount;
    });

    // Update total
    totalAmountEl.textContent = `$${grandTotal.toFixed(2)}`;

    // Render breakdown
    breakdownEl.innerHTML = Object.entries(totalsByCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount]) => `
        <div class="budget-category">
          <span class="budget-category-name">${this.escapeHtml(category)}</span>
          <span class="budget-category-amount">$${amount.toFixed(2)}</span>
        </div>
      `).join('');

    // Render expense items
    const sortedItems = [...items].sort((a, b) => {
      const aDate = this.parseDate(a.startDate || a.date);
      const bDate = this.parseDate(b.startDate || b.date);
      return (bDate || 0) - (aDate || 0);
    });

    container.innerHTML = sortedItems.map(item => {
      const date = this.parseDate(item.startDate || item.date);
      const dateStr = date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
      const amount = item.homeCurrencyAmount || item.currencyAmount || 0;

      return `
        <div class="expense-item">
          <div class="expense-item-icon">${this.getItineraryIcon(item.category || item.type)}</div>
          <div class="expense-item-content">
            <span class="expense-item-name">${this.escapeHtml(item.name || item.title)}</span>
            <span class="expense-item-category">${this.escapeHtml(item.category || 'Other')}</span>
          </div>
          <div class="expense-item-right">
            <span class="expense-item-amount">$${amount.toFixed(2)}</span>
            ${dateStr ? `<span class="expense-item-date">${dateStr}</span>` : ''}
          </div>
        </div>
      `;
    }).join('');
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
    const addTodoBtn = document.getElementById('add-todo-btn');

    if (todoInput && addTodoBtn) {
      const addTodoItem = () => {
        const title = todoInput.value.trim();

        if (title) {
          this.addTodoItem(title);
          todoInput.value = '';
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

  async addTodoItem(title) {
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
      createdAt: new Date().toISOString()
    };

    // Add to array
    this.trip.todos.push(newItem);

    // Re-render the list
    this.renderTodos();

    // Save to Firestore
    await this.saveTodosToFirestore();
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
