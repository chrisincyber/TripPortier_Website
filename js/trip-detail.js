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

      if (!this.trip.startDate || !this.trip.endDate) {
        this.showError();
        return;
      }

      this.renderTrip();
      this.renderItinerary();
      this.renderPackingList();
      this.renderTodos();
      this.renderBudget();
      this.loadWeather();
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

    } catch (error) {
      console.warn('Failed to load weather:', error);
    }
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
}

// Create global instance
window.tripDetailManager = new TripDetailManager();
