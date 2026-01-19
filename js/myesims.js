/**
 * My eSIMs Page Manager
 * Handles displaying and managing user's eSIM orders with real-time status from Airalo API
 */

class MyEsimsManager {
    constructor() {
        this.orders = [];
        this.currentTab = 'active';
        this.isLoading = false;

        // Active statuses
        this.activeStatuses = ['active', 'in_use', 'installed', 'not_installed', 'pending'];
        // Past statuses
        this.pastStatuses = ['expired', 'depleted'];

        this.init();
    }

    async init() {
        // Wait for auth to be ready
        if (window.tripPortierAuth) {
            window.tripPortierAuth.addListener((user) => {
                this.handleAuthChange(user);
            });
        }

        // Set up tab listeners
        this.setupTabListeners();
    }

    setupTabListeners() {
        const tabs = document.querySelectorAll('.esims-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        this.currentTab = tabName;

        // Update tab UI
        document.querySelectorAll('.esims-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Re-render orders
        this.renderOrders();
    }

    async handleAuthChange(user) {
        const loadingEl = document.getElementById('esims-loading');
        const notSignedInEl = document.getElementById('esims-not-signed-in');
        const emptyEl = document.getElementById('esims-empty');
        const tabsEl = document.getElementById('esims-tabs');
        const listEl = document.getElementById('esims-list');
        const tabEmptyEl = document.getElementById('esims-tab-empty');
        const myTripsNav = document.getElementById('mytrips-nav');

        if (!user) {
            // Not signed in - show email lookup form
            loadingEl.style.display = 'none';
            notSignedInEl.style.display = 'flex';
            emptyEl.style.display = 'none';
            tabsEl.style.display = 'none';
            listEl.style.display = 'none';
            tabEmptyEl.style.display = 'none';
            if (myTripsNav) myTripsNav.style.display = 'none';
            return;
        }

        // Show My Trips nav when logged in
        if (myTripsNav) myTripsNav.style.display = '';

        // User is signed in, load orders
        notSignedInEl.style.display = 'none';
        await this.loadOrders();
    }

    async loadOrders() {
        const loadingEl = document.getElementById('esims-loading');
        const emptyEl = document.getElementById('esims-empty');
        const tabsEl = document.getElementById('esims-tabs');
        const listEl = document.getElementById('esims-list');

        loadingEl.style.display = 'flex';
        emptyEl.style.display = 'none';
        tabsEl.style.display = 'none';
        listEl.style.display = 'none';

        try {
            const result = await window.callEdgeFunction('get-user-esim-orders', {});

            if (result?.success && result.orders) {
                this.orders = result.orders;
            } else {
                this.orders = [];
            }
        } catch (error) {
            console.error('Error loading eSIM orders:', error);
            this.orders = [];
        } finally {
            loadingEl.style.display = 'none';
            this.renderOrders();
        }
    }

    getActiveOrders() {
        return this.orders.filter(order => {
            const status = (order.esimStatus || '').toLowerCase();

            // If we have real status from API
            if (status) {
                return this.activeStatuses.some(s => status.includes(s));
            }

            // Fallback to date-based calculation
            const days = parseInt(order.days) || 30;
            const createdAt = order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000) :
                              order.orderedAt?.seconds ? new Date(order.orderedAt.seconds * 1000) :
                              new Date();
            const expirationDate = new Date(createdAt.getTime() + (days * 24 * 60 * 60 * 1000));
            return expirationDate > new Date();
        });
    }

    getHistoryOrders() {
        return this.orders.filter(order => {
            const status = (order.esimStatus || '').toLowerCase();

            // If we have real status from API
            if (status) {
                return this.pastStatuses.some(s => status.includes(s));
            }

            // Fallback to date-based calculation
            const days = parseInt(order.days) || 30;
            const createdAt = order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000) :
                              order.orderedAt?.seconds ? new Date(order.orderedAt.seconds * 1000) :
                              new Date();
            const expirationDate = new Date(createdAt.getTime() + (days * 24 * 60 * 60 * 1000));
            return expirationDate <= new Date();
        });
    }

    updateTabCounts() {
        const activeCount = this.getActiveOrders().length;
        const historyCount = this.getHistoryOrders().length;
        const activeCountEl = document.getElementById('active-count');
        const historyCountEl = document.getElementById('history-count');
        if (activeCountEl) activeCountEl.textContent = activeCount;
        if (historyCountEl) historyCountEl.textContent = historyCount;
    }

    renderOrders() {
        const emptyEl = document.getElementById('esims-empty');
        const tabsEl = document.getElementById('esims-tabs');
        const listEl = document.getElementById('esims-list');
        const tabEmptyEl = document.getElementById('esims-tab-empty');

        // Update counts
        const activeCount = this.getActiveOrders().length;
        const historyCount = this.getHistoryOrders().length;
        document.getElementById('active-count').textContent = activeCount;
        document.getElementById('history-count').textContent = historyCount;

        // No orders at all
        if (this.orders.length === 0) {
            emptyEl.style.display = 'flex';
            tabsEl.style.display = 'none';
            listEl.style.display = 'none';
            tabEmptyEl.style.display = 'none';
            return;
        }

        // Show tabs
        emptyEl.style.display = 'none';
        tabsEl.style.display = 'flex';

        // Get filtered orders
        const filteredOrders = this.currentTab === 'active' ? this.getActiveOrders() : this.getHistoryOrders();

        // Empty tab state
        if (filteredOrders.length === 0) {
            listEl.style.display = 'none';
            tabEmptyEl.style.display = 'flex';

            const titleEl = document.getElementById('esims-tab-empty-title');
            const textEl = document.getElementById('esims-tab-empty-text');

            if (this.currentTab === 'active') {
                titleEl.textContent = 'No active eSIMs';
                textEl.textContent = 'Your active eSIMs will appear here.';
            } else {
                titleEl.textContent = 'No history yet';
                textEl.textContent = 'Expired and used eSIMs will appear here.';
            }
            return;
        }

        // Render orders
        tabEmptyEl.style.display = 'none';
        listEl.style.display = 'grid';

        const html = filteredOrders.map((order, index) => this.renderOrderCard(order, index)).join('');
        listEl.innerHTML = html;
    }

    renderOrderCard(order, index) {
        const countryCode = order.countryCode || '';
        const countryTitle = order.countryTitle || 'eSIM';
        const flag = this.getCountryFlagFromCode(countryCode);
        const packageName = order.packageName || `${order.data || ''} - ${order.days || ''} Days`;
        const price = order.price || (order.amountPaid ? order.amountPaid / 100 : 0);

        // Get status from API or calculate from date
        const status = order.esimStatus || this.calculateStatus(order);
        const statusDisplay = this.getStatusDisplay(status);
        const statusClass = this.getStatusClass(status);

        // Data info
        const dataInfo = order.isUnlimited ? 'Unlimited' :
                        order.dataRemaining ? order.dataRemaining :
                        order.data || '';

        // Date
        const createdAt = order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000) :
                          order.orderedAt?.seconds ? new Date(order.orderedAt.seconds * 1000) :
                          new Date();
        const dateStr = createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        return `
            <div class="esim-card" onclick="myEsimsManager.showOrderDetail(${this.orders.indexOf(order)})">
                <div class="esim-card-header">
                    <div class="esim-card-flag">${flag}</div>
                    <div class="esim-card-info">
                        <div class="esim-card-country">${countryTitle}</div>
                        <div class="esim-card-package">${packageName}</div>
                    </div>
                    <span class="esim-card-status ${statusClass}">${statusDisplay}</span>
                </div>
                <div class="esim-card-details">
                    <div class="esim-card-detail">
                        <span class="esim-card-label">Data</span>
                        <span class="esim-card-value">${dataInfo || '-'}</span>
                    </div>
                    <div class="esim-card-detail">
                        <span class="esim-card-label">Validity</span>
                        <span class="esim-card-value">${order.validityDays || order.days || '-'} days</span>
                    </div>
                    <div class="esim-card-detail">
                        <span class="esim-card-label">Purchased</span>
                        <span class="esim-card-value">${dateStr}</span>
                    </div>
                    <div class="esim-card-detail">
                        <span class="esim-card-label">Price</span>
                        <span class="esim-card-value">$${price.toFixed(2)}</span>
                    </div>
                </div>
                <div class="esim-card-footer">
                    <span class="esim-card-view">View QR Code &rarr;</span>
                </div>
            </div>
        `;
    }

    calculateStatus(order) {
        const days = parseInt(order.days) || 30;
        const createdAt = order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000) :
                          order.orderedAt?.seconds ? new Date(order.orderedAt.seconds * 1000) :
                          new Date();
        const expirationDate = new Date(createdAt.getTime() + (days * 24 * 60 * 60 * 1000));
        return expirationDate > new Date() ? 'active' : 'expired';
    }

    getStatusDisplay(status) {
        const s = (status || '').toLowerCase();
        if (s.includes('active') || s.includes('in_use')) return 'Active';
        if (s.includes('installed')) return 'Installed';
        if (s.includes('not_installed') || s === 'pending') return 'Not Installed';
        if (s.includes('expired')) return 'Expired';
        if (s.includes('depleted')) return 'Depleted';
        return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
    }

    getStatusClass(status) {
        const s = (status || '').toLowerCase();
        if (s.includes('active') || s.includes('in_use')) return 'status-active';
        if (s.includes('installed')) return 'status-installed';
        if (s.includes('not_installed') || s === 'pending') return 'status-pending';
        if (s.includes('expired')) return 'status-expired';
        if (s.includes('depleted')) return 'status-depleted';
        return 'status-unknown';
    }

    getCountryFlagFromCode(code) {
        if (!code || code.length !== 2) return '&#127760;'; // Globe emoji
        const base = 127397;
        let flag = '';
        for (const char of code.toUpperCase()) {
            const unicode = base + char.charCodeAt(0);
            flag += `&#${unicode};`;
        }
        return flag;
    }

    showOrderDetail(index) {
        const order = this.orders[index];
        if (!order) return;

        // Get QR code URL
        const qrCodeUrl = order.esimDetails?.qrCodeUrl ||
                          order.esims?.[0]?.qrcodeUrl ||
                          order.esims?.[0]?.qrcode_url ||
                          null;

        const iccid = order.esimDetails?.iccid ||
                      order.esims?.[0]?.iccid ||
                      '-';

        const countryTitle = order.countryTitle || 'eSIM';
        const flag = this.getCountryFlagFromCode(order.countryCode || '');
        const packageName = order.packageName || `${order.data || ''} - ${order.days || ''} Days`;
        const orderCode = order.orderCode || order.airaloOrderCode || '-';
        const price = order.price || (order.amountPaid ? order.amountPaid / 100 : 0);

        const status = order.esimStatus || this.calculateStatus(order);
        const statusDisplay = this.getStatusDisplay(status);
        const statusClass = this.getStatusClass(status);

        const dataInfo = order.isUnlimited ? 'Unlimited' :
                        order.dataRemaining ? order.dataRemaining :
                        order.data || '-';

        const modal = document.createElement('div');
        modal.className = 'esim-modal active';
        modal.id = 'esim-detail-modal';
        modal.innerHTML = `
            <div class="esim-modal-backdrop" onclick="myEsimsManager.closeOrderDetail()"></div>
            <div class="esim-modal-content">
                <div class="esim-modal-header">
                    <div class="esim-modal-title">
                        <span class="esim-modal-flag">${flag}</span>
                        <h3>${countryTitle}</h3>
                    </div>
                    <button class="esim-modal-close" onclick="myEsimsManager.closeOrderDetail()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div class="esim-modal-body">
                    <span class="esim-modal-status ${statusClass}">${statusDisplay}</span>

                    ${qrCodeUrl ? `
                        <div class="esim-modal-qr">
                            <img src="${qrCodeUrl}" alt="eSIM QR Code">
                            <p>Scan to install eSIM</p>
                        </div>
                    ` : `
                        <div class="esim-modal-qr esim-modal-qr-placeholder">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.5h4.5v4.5h-4.5v-4.5z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 14.25h4.5v4.5h-4.5v-4.5z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 4.5h4.5v4.5h-4.5v-4.5z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 14.25h1.5v1.5h-1.5v-1.5z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 17.25h1.5v1.5h-1.5v-1.5z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 17.25h1.5v1.5h-1.5v-1.5z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 14.25h1.5v1.5h-1.5v-1.5z"/>
                            </svg>
                            <p>QR code was sent to your email</p>
                        </div>
                    `}

                    <div class="esim-modal-details">
                        <div class="esim-modal-row">
                            <span class="esim-modal-label">Package</span>
                            <span class="esim-modal-value">${packageName}</span>
                        </div>
                        <div class="esim-modal-row">
                            <span class="esim-modal-label">Data</span>
                            <span class="esim-modal-value">${dataInfo}</span>
                        </div>
                        <div class="esim-modal-row">
                            <span class="esim-modal-label">Validity</span>
                            <span class="esim-modal-value">${order.validityDays || order.days || '-'} days</span>
                        </div>
                        <div class="esim-modal-row">
                            <span class="esim-modal-label">ICCID</span>
                            <span class="esim-modal-value esim-modal-mono">${iccid}</span>
                        </div>
                        <div class="esim-modal-row">
                            <span class="esim-modal-label">Order #</span>
                            <span class="esim-modal-value">${orderCode}</span>
                        </div>
                        <div class="esim-modal-row">
                            <span class="esim-modal-label">Price Paid</span>
                            <span class="esim-modal-value">$${price.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
    }

    closeOrderDetail() {
        const modal = document.getElementById('esim-detail-modal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    }

    async lookupOrdersByEmail(event) {
        event.preventDefault();

        const emailInput = document.getElementById('lookup-email');
        const lookupBtn = document.getElementById('lookup-btn');
        const errorEl = document.getElementById('lookup-error');
        const loadingEl = document.getElementById('esims-loading');
        const notSignedInEl = document.getElementById('esims-not-signed-in');
        const emptyEl = document.getElementById('esims-empty');
        const tabsEl = document.getElementById('esims-tabs');
        const listEl = document.getElementById('esims-list');

        const email = emailInput.value.trim();
        if (!email) {
            errorEl.textContent = 'Please enter your email address';
            errorEl.style.display = 'block';
            return;
        }

        try {
            // Show loading state
            lookupBtn.disabled = true;
            lookupBtn.textContent = 'Searching...';
            errorEl.style.display = 'none';

            const result = await window.callEdgeFunction('lookup-esim-orders-by-email', { email });

            if (result?.success && result.orders && result.orders.length > 0) {
                this.orders = result.orders;

                // Hide not signed in, show tabs and list
                notSignedInEl.style.display = 'none';
                emptyEl.style.display = 'none';
                tabsEl.style.display = 'flex';
                listEl.style.display = 'grid';

                // Update tab counts
                this.updateTabCounts();

                // Render orders
                this.renderOrders();
            } else {
                // No orders found
                errorEl.textContent = 'No eSIM orders found for this email address. Please check and try again.';
                errorEl.style.display = 'block';
            }
        } catch (error) {
            console.error('Email lookup error:', error);
            errorEl.textContent = error.message || 'Failed to find orders. Please try again.';
            errorEl.style.display = 'block';
        } finally {
            lookupBtn.disabled = false;
            lookupBtn.textContent = 'Find Orders';
        }
    }
}

// Initialize manager
const myEsimsManager = new MyEsimsManager();
window.myEsimsManager = myEsimsManager;
window.esimManager = myEsimsManager; // Alias for HTML onclick
