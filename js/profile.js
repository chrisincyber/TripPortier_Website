// TripPortier Profile Page Manager

class ProfileManager {
    constructor() {
        this.user = null;
        this.trips = [];
        this.esimOrders = [];
        this.selectedAvatarFile = null;

        // Achievement definitions
        this.achievements = [
            { id: 'first_trip', name: 'First Steps', desc: 'Complete your first trip', icon: '🎒', check: (stats) => stats.completedTrips >= 1 },
            { id: 'five_trips', name: 'Seasoned Traveler', desc: 'Complete 5 trips', icon: '✈️', check: (stats) => stats.completedTrips >= 5 },
            { id: 'ten_trips', name: 'Globetrotter', desc: 'Complete 10 trips', icon: '🌍', check: (stats) => stats.completedTrips >= 10 },
            { id: 'three_countries', name: 'Explorer', desc: 'Visit 3 countries', icon: '🗺️', check: (stats) => stats.countries.length >= 3 },
            { id: 'ten_countries', name: 'World Wanderer', desc: 'Visit 10 countries', icon: '🌏', check: (stats) => stats.countries.length >= 10 },
            { id: 'week_trip', name: 'Extended Stay', desc: 'Take a 7+ day trip', icon: '📅', check: (stats) => stats.longestTrip >= 7 },
            { id: 'month_travel', name: 'Month Abroad', desc: 'Travel 30+ days total', icon: '🏖️', check: (stats) => stats.totalDays >= 30 },
            { id: 'solo_trip', name: 'Solo Adventurer', desc: 'Complete a solo trip', icon: '🎯', check: (stats) => stats.hasSoloTrip },
            { id: 'family_trip', name: 'Family Fun', desc: 'Complete a family trip', icon: '👨‍👩‍👧‍👦', check: (stats) => stats.hasFamilyTrip },
            { id: 'planner', name: 'Master Planner', desc: 'Plan 3 upcoming trips', icon: '📋', check: (stats) => stats.upcomingTrips >= 3 },
        ];

        this.init();
    }

    async init() {
        // Wait for auth to be ready
        if (window.auth) {
            window.auth.onAuthStateChanged((user) => this.handleAuthChange(user));
        } else {
            // Fallback if auth not ready
            setTimeout(() => this.init(), 100);
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Avatar input change
        const avatarInput = document.getElementById('avatar-input');
        if (avatarInput) {
            avatarInput.addEventListener('change', (e) => this.handleAvatarSelect(e));
        }

        // Close modal on backdrop click
        const modal = document.getElementById('avatar-modal');
        if (modal) {
            const backdrop = modal.querySelector('.profile-modal-backdrop');
            backdrop?.addEventListener('click', () => this.closeAvatarModal());
        }

        // Avatar edit button
        const avatarEditBtn = document.getElementById('avatar-edit-btn');
        if (avatarEditBtn) {
            avatarEditBtn.addEventListener('click', () => this.openAvatarModal());
        }
    }

    async handleAuthChange(user) {
        this.user = user;

        const loadingEl = document.getElementById('profile-loading');
        const notSignedInEl = document.getElementById('profile-not-signed-in');
        const contentEl = document.getElementById('profile-content');
        const headerContent = document.querySelector('.profile-header-content');

        if (user) {
            // Show loading
            loadingEl.style.display = 'flex';
            notSignedInEl.style.display = 'none';
            contentEl.style.display = 'none';
            headerContent.style.opacity = '0.5';

            // Load user data
            await this.loadUserProfile();
            await this.loadTrips();
            this.loadEsimOrders(); // Load async, don't await

            // Update UI
            this.updateProfileHeader();
            this.calculateAndDisplayStats();
            this.renderAchievements();
            this.renderCountries();
            this.renderRecentTrips();

            // Show content
            loadingEl.style.display = 'none';
            contentEl.style.display = 'flex';
            headerContent.style.opacity = '1';
        } else {
            loadingEl.style.display = 'none';
            notSignedInEl.style.display = 'block';
            contentEl.style.display = 'none';
            headerContent.style.opacity = '0.5';
        }
    }

    async loadUserProfile() {
        try {
            const db = firebase.firestore();
            const userDoc = await db.collection('users').doc(this.user.uid).get();

            if (userDoc.exists) {
                this.userProfile = userDoc.data();
            } else {
                this.userProfile = {};
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
            this.userProfile = {};
        }
    }

    async loadTrips() {
        try {
            const db = firebase.firestore();
            const tripsSnapshot = await db.collection('users').doc(this.user.uid)
                .collection('trips')
                .orderBy('startDate', 'desc')
                .get();

            this.trips = tripsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error loading trips:', error);
            this.trips = [];
        }
    }

    updateProfileHeader() {
        const nameEl = document.getElementById('profile-name');
        const emailEl = document.getElementById('profile-email');
        const memberSinceEl = document.getElementById('profile-member-since');
        const avatarEl = document.getElementById('profile-avatar');

        // Set name
        if (this.user.displayName) {
            nameEl.textContent = this.user.displayName;
        } else if (this.userProfile?.name) {
            nameEl.textContent = this.userProfile.name;
        } else {
            nameEl.textContent = 'Traveler';
        }

        // Set email
        emailEl.textContent = this.user.email || '';

        // Set member since
        if (this.user.metadata?.creationTime) {
            const createdDate = new Date(this.user.metadata.creationTime);
            const monthYear = createdDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            memberSinceEl.textContent = `Member since ${monthYear}`;
        }

        // Set avatar
        if (this.user.photoURL) {
            avatarEl.innerHTML = `<img src="${this.user.photoURL}" alt="Profile">`;
        } else if (this.userProfile?.photoURL) {
            avatarEl.innerHTML = `<img src="${this.userProfile.photoURL}" alt="Profile">`;
        }
    }

    calculateAndDisplayStats() {
        const now = new Date();
        const stats = {
            totalTrips: this.trips.length,
            completedTrips: 0,
            upcomingTrips: 0,
            activeTrips: 0,
            countries: new Set(),
            totalDays: 0,
            longestTrip: 0,
            hasSoloTrip: false,
            hasFamilyTrip: false,
            totalDistance: 0
        };

        this.trips.forEach(trip => {
            const startDate = trip.startDate?.toDate ? trip.startDate.toDate() : new Date(trip.startDate);
            const endDate = trip.endDate?.toDate ? trip.endDate.toDate() : new Date(trip.endDate);

            // Calculate trip duration
            const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

            // Categorize trip
            if (endDate < now) {
                stats.completedTrips++;
                stats.totalDays += duration;
                if (duration > stats.longestTrip) {
                    stats.longestTrip = duration;
                }
            } else if (startDate > now) {
                stats.upcomingTrips++;
            } else {
                stats.activeTrips++;
            }

            // Extract country from destination
            if (trip.destination) {
                const country = this.extractCountry(trip.destination);
                if (country) {
                    stats.countries.add(country);
                }
            }

            // Check trip types
            if (trip.tripType === 'solo') stats.hasSoloTrip = true;
            if (trip.tripType === 'family') stats.hasFamilyTrip = true;

            // Estimate distance (rough calculation based on international travel)
            if (stats.countries.size > 1) {
                stats.totalDistance = stats.countries.size * 3000; // Rough avg km per country
            }
        });

        // Convert countries Set to array for achievements
        stats.countries = Array.from(stats.countries);
        this.stats = stats;

        // Update display
        document.getElementById('stat-trips').textContent = stats.totalTrips.toLocaleString();
        document.getElementById('stat-countries').textContent = stats.countries.length.toLocaleString();
        document.getElementById('stat-days').textContent = stats.totalDays.toLocaleString();
        document.getElementById('stat-distance').textContent = this.formatDistance(stats.totalDistance);
    }

    extractCountry(destination) {
        if (!destination) return null;

        // Common country patterns
        const parts = destination.split(',').map(p => p.trim());
        if (parts.length >= 2) {
            return parts[parts.length - 1];
        }
        return destination;
    }

    formatDistance(km) {
        if (km >= 1000) {
            return (km / 1000).toFixed(1) + 'k';
        }
        return km.toLocaleString();
    }

    renderAchievements() {
        const grid = document.getElementById('achievements-grid');
        if (!grid) return;

        const html = this.achievements.map(achievement => {
            const unlocked = achievement.check(this.stats);
            return `
                <div class="profile-achievement ${unlocked ? '' : 'locked'}">
                    <div class="profile-achievement-icon">${achievement.icon}</div>
                    <div class="profile-achievement-name">${achievement.name}</div>
                    <div class="profile-achievement-desc">${achievement.desc}</div>
                </div>
            `;
        }).join('');

        grid.innerHTML = html;
    }

    renderCountries() {
        const listEl = document.getElementById('countries-list');
        const emptyEl = document.getElementById('countries-empty');

        if (!this.stats.countries || this.stats.countries.length === 0) {
            listEl.style.display = 'none';
            emptyEl.style.display = 'block';
            return;
        }

        listEl.style.display = 'flex';
        emptyEl.style.display = 'none';

        const html = this.stats.countries.map(country => {
            const flag = this.getCountryFlag(country);
            return `
                <div class="profile-country-tag">
                    <span class="profile-country-flag">${flag}</span>
                    <span>${country}</span>
                </div>
            `;
        }).join('');

        listEl.innerHTML = html;
    }

    getCountryFlag(country) {
        // Map common country names to flag emojis
        const flagMap = {
            'United States': '🇺🇸', 'USA': '🇺🇸', 'US': '🇺🇸',
            'United Kingdom': '🇬🇧', 'UK': '🇬🇧', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
            'France': '🇫🇷', 'Germany': '🇩🇪', 'Italy': '🇮🇹', 'Spain': '🇪🇸',
            'Portugal': '🇵🇹', 'Netherlands': '🇳🇱', 'Belgium': '🇧🇪',
            'Switzerland': '🇨🇭', 'Austria': '🇦🇹', 'Greece': '🇬🇷',
            'Japan': '🇯🇵', 'China': '🇨🇳', 'South Korea': '🇰🇷', 'Korea': '🇰🇷',
            'Thailand': '🇹🇭', 'Vietnam': '🇻🇳', 'Indonesia': '🇮🇩',
            'Singapore': '🇸🇬', 'Malaysia': '🇲🇾', 'Philippines': '🇵🇭',
            'India': '🇮🇳', 'Australia': '🇦🇺', 'New Zealand': '🇳🇿',
            'Canada': '🇨🇦', 'Mexico': '🇲🇽', 'Brazil': '🇧🇷',
            'Argentina': '🇦🇷', 'Chile': '🇨🇱', 'Peru': '🇵🇪',
            'Colombia': '🇨🇴', 'Egypt': '🇪🇬', 'Morocco': '🇲🇦',
            'South Africa': '🇿🇦', 'Kenya': '🇰🇪', 'Turkey': '🇹🇷',
            'United Arab Emirates': '🇦🇪', 'UAE': '🇦🇪', 'Dubai': '🇦🇪',
            'Saudi Arabia': '🇸🇦', 'Israel': '🇮🇱', 'Russia': '🇷🇺',
            'Poland': '🇵🇱', 'Czech Republic': '🇨🇿', 'Hungary': '🇭🇺',
            'Croatia': '🇭🇷', 'Sweden': '🇸🇪', 'Norway': '🇳🇴',
            'Denmark': '🇩🇰', 'Finland': '🇫🇮', 'Iceland': '🇮🇸',
            'Ireland': '🇮🇪', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
            'Taiwan': '🇹🇼', 'Hong Kong': '🇭🇰', 'Macao': '🇲🇴',
            'Cambodia': '🇰🇭', 'Laos': '🇱🇦', 'Myanmar': '🇲🇲',
            'Nepal': '🇳🇵', 'Sri Lanka': '🇱🇰', 'Maldives': '🇲🇻',
            'Fiji': '🇫🇯', 'Hawaii': '🇺🇸', 'Bali': '🇮🇩',
        };

        return flagMap[country] || '🌍';
    }

    renderRecentTrips() {
        const listEl = document.getElementById('recent-trips');
        const emptyEl = document.getElementById('trips-empty');

        if (!this.trips || this.trips.length === 0) {
            listEl.style.display = 'none';
            emptyEl.style.display = 'block';
            return;
        }

        listEl.style.display = 'flex';
        emptyEl.style.display = 'none';

        // Show up to 5 recent trips
        const recentTrips = this.trips.slice(0, 5);
        const now = new Date();

        const html = recentTrips.map(trip => {
            const startDate = trip.startDate?.toDate ? trip.startDate.toDate() : new Date(trip.startDate);
            const endDate = trip.endDate?.toDate ? trip.endDate.toDate() : new Date(trip.endDate);

            let status, statusClass;
            if (endDate < now) {
                status = 'Past';
                statusClass = 'past';
            } else if (startDate > now) {
                status = 'Upcoming';
                statusClass = 'upcoming';
            } else {
                status = 'Active';
                statusClass = 'active';
            }

            const dateStr = this.formatTripDates(startDate, endDate);

            return `
                <a href="trip-detail.html?id=${trip.id}" class="profile-trip-card">
                    <div class="profile-trip-icon">
                        ${this.getTripIcon(trip.tripType)}
                    </div>
                    <div class="profile-trip-info">
                        <div class="profile-trip-name">${trip.name || 'Untitled Trip'}</div>
                        <div class="profile-trip-destination">${trip.destination || 'No destination'}</div>
                    </div>
                    <div class="profile-trip-dates">
                        <span class="profile-trip-status ${statusClass}">${status}</span>
                        <div>${dateStr}</div>
                    </div>
                </a>
            `;
        }).join('');

        listEl.innerHTML = html;
    }

    getTripIcon(tripType) {
        const icons = {
            solo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>`,
            couple: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>`,
            family: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/></svg>`,
            friends: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>`,
            business: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"/></svg>`,
        };
        return icons[tripType] || `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>`;
    }

    formatTripDates(start, end) {
        const options = { month: 'short', day: 'numeric' };
        const startStr = start.toLocaleDateString('en-US', options);
        const endStr = end.toLocaleDateString('en-US', options);

        if (start.getFullYear() !== end.getFullYear()) {
            return `${startStr}, ${start.getFullYear()} - ${endStr}, ${end.getFullYear()}`;
        }

        return `${startStr} - ${endStr}`;
    }

    openAvatarModal() {
        const modal = document.getElementById('avatar-modal');
        if (modal) {
            modal.classList.add('active');
            // Reset preview to current avatar
            const preview = document.getElementById('avatar-preview');
            const currentAvatar = document.getElementById('profile-avatar');
            preview.innerHTML = currentAvatar.innerHTML;
            this.selectedAvatarFile = null;
            document.getElementById('save-avatar-btn').disabled = true;
        }
    }

    closeAvatarModal() {
        const modal = document.getElementById('avatar-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    handleAvatarSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            this.showToast('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this.showToast('Image must be less than 5MB');
            return;
        }

        this.selectedAvatarFile = file;

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('avatar-preview');
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);

        // Enable save button
        document.getElementById('save-avatar-btn').disabled = false;
    }

    async saveAvatar() {
        if (!this.selectedAvatarFile || !this.user) return;

        const saveBtn = document.getElementById('save-avatar-btn');
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        try {
            // Upload to Firebase Storage
            const storage = firebase.storage();
            const ref = storage.ref(`avatars/${this.user.uid}`);
            await ref.put(this.selectedAvatarFile);
            const photoURL = await ref.getDownloadURL();

            // Update user profile
            await this.user.updateProfile({ photoURL });

            // Update Firestore
            const db = firebase.firestore();
            await db.collection('users').doc(this.user.uid).set({
                photoURL
            }, { merge: true });

            // Update UI
            const avatarEl = document.getElementById('profile-avatar');
            avatarEl.innerHTML = `<img src="${photoURL}" alt="Profile">`;

            this.closeAvatarModal();
            this.showToast('Profile picture updated');
        } catch (error) {
            console.error('Error uploading avatar:', error);
            this.showToast('Failed to update profile picture');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save';
        }
    }

    showToast(message) {
        const toast = document.getElementById('profile-toast');
        const messageEl = document.getElementById('profile-toast-message');

        if (toast && messageEl) {
            messageEl.textContent = message;
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    async loadEsimOrders() {
        const loadingEl = document.getElementById('esim-orders-loading');
        const listEl = document.getElementById('esim-orders-list');
        const emptyEl = document.getElementById('esim-orders-empty');

        if (!loadingEl || !listEl) return;

        // Show loading
        loadingEl.style.display = 'flex';
        listEl.innerHTML = '';
        emptyEl.style.display = 'none';

        try {
            // Call Firebase function to get orders
            const functions = firebase.functions();
            const getUserEsimOrders = functions.httpsCallable('getUserEsimOrders');
            const result = await getUserEsimOrders();

            if (result.data?.success && result.data.orders) {
                this.esimOrders = result.data.orders;
                this.renderEsimOrders();
            } else {
                this.esimOrders = [];
                this.renderEsimOrders();
            }
        } catch (error) {
            console.error('Error loading eSIM orders:', error);
            this.esimOrders = [];
            this.renderEsimOrders();
        } finally {
            loadingEl.style.display = 'none';
        }
    }

    renderEsimOrders() {
        const listEl = document.getElementById('esim-orders-list');
        const emptyEl = document.getElementById('esim-orders-empty');

        if (!listEl) return;

        if (!this.esimOrders || this.esimOrders.length === 0) {
            listEl.innerHTML = '';
            emptyEl.style.display = 'block';
            return;
        }

        emptyEl.style.display = 'none';

        const now = new Date();

        const html = this.esimOrders.map((order, index) => {
            const countryCode = order.countryCode || '';
            const countryTitle = order.countryTitle || 'eSIM';
            const flag = this.getCountryFlagFromCode(countryCode);
            const packageName = order.packageName || `${order.data || ''} - ${order.days || ''} Days`;
            const price = order.price || (order.amountPaid ? order.amountPaid / 100 : 0);

            // Calculate status based on validity
            const days = parseInt(order.days) || 30;
            const createdAt = order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000) :
                              order.orderedAt?.seconds ? new Date(order.orderedAt.seconds * 1000) :
                              new Date();
            const expirationDate = new Date(createdAt.getTime() + (days * 24 * 60 * 60 * 1000));
            const isActive = expirationDate > now;

            const dateStr = createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            return `
                <div class="profile-order-card" onclick="profileManager.showOrderDetail(${index})">
                    <div class="profile-order-flag">${flag}</div>
                    <div class="profile-order-info">
                        <div class="profile-order-country">${countryTitle}</div>
                        <div class="profile-order-package">${packageName}</div>
                    </div>
                    <div class="profile-order-right">
                        <span class="profile-order-status ${isActive ? 'active' : 'expired'}">${isActive ? 'Active' : 'Expired'}</span>
                        <div class="profile-order-date">${dateStr}</div>
                        <div class="profile-order-price">$${price.toFixed(2)}</div>
                    </div>
                </div>
            `;
        }).join('');

        listEl.innerHTML = html;
    }

    getCountryFlagFromCode(code) {
        if (!code || code.length !== 2) return '🌍';
        const base = 127397;
        let flag = '';
        for (const char of code.toUpperCase()) {
            const unicode = base + char.charCodeAt(0);
            flag += String.fromCodePoint(unicode);
        }
        return flag;
    }

    showOrderDetail(index) {
        const order = this.esimOrders[index];
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
        const packageName = order.packageName || `${order.data || ''} - ${order.days || ''} Days`;
        const orderCode = order.orderCode || order.airaloOrderCode || '-';
        const price = order.price || (order.amountPaid ? order.amountPaid / 100 : 0);

        const modal = document.createElement('div');
        modal.className = 'order-detail-modal active';
        modal.id = 'order-detail-modal';
        modal.innerHTML = `
            <div class="order-detail-backdrop" onclick="profileManager.closeOrderDetail()"></div>
            <div class="order-detail-content">
                <div class="order-detail-header">
                    <h3>${countryTitle}</h3>
                    <button class="order-detail-close" onclick="profileManager.closeOrderDetail()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div class="order-detail-body">
                    ${qrCodeUrl ? `
                        <div class="order-detail-qr">
                            <img src="${qrCodeUrl}" alt="eSIM QR Code">
                            <p>Scan to install eSIM</p>
                        </div>
                    ` : `
                        <div class="order-detail-qr" style="padding: 40px; background: var(--theme-bg-secondary); border-radius: 16px; margin-bottom: 24px;">
                            <p style="margin: 0; color: var(--theme-text-secondary);">QR code was sent to your email</p>
                        </div>
                    `}
                    <div class="order-detail-rows">
                        <div class="order-detail-row">
                            <span class="order-detail-label">Package</span>
                            <span class="order-detail-value">${packageName}</span>
                        </div>
                        <div class="order-detail-row">
                            <span class="order-detail-label">Data</span>
                            <span class="order-detail-value">${order.data || '-'}</span>
                        </div>
                        <div class="order-detail-row">
                            <span class="order-detail-label">Validity</span>
                            <span class="order-detail-value">${order.days ? order.days + ' days' : '-'}</span>
                        </div>
                        <div class="order-detail-row">
                            <span class="order-detail-label">ICCID</span>
                            <span class="order-detail-value" style="font-family: monospace; font-size: 12px;">${iccid}</span>
                        </div>
                        <div class="order-detail-row">
                            <span class="order-detail-label">Order #</span>
                            <span class="order-detail-value">${orderCode}</span>
                        </div>
                        <div class="order-detail-row">
                            <span class="order-detail-label">Price Paid</span>
                            <span class="order-detail-value">$${price.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    closeOrderDetail() {
        const modal = document.getElementById('order-detail-modal');
        if (modal) {
            modal.remove();
        }
    }
}

// Initialize
const profileManager = new ProfileManager();

// Global functions for onclick handlers
function closeAvatarModal() {
    profileManager.closeAvatarModal();
}

function saveAvatar() {
    profileManager.saveAvatar();
}
