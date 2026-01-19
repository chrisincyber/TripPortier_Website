/**
 * TripPortier Settings Page
 * Manages user preferences with Supabase sync
 */

class SettingsManager {
    constructor() {
        this.user = null;
        this.settings = this.getDefaultSettings();
        this.selectedPassports = [];

        // Available options (matching iOS app)
        this.countries = [
            "Argentina", "Australia", "Austria", "Belgium", "Brazil", "Bulgaria",
            "Canada", "Chile", "China", "Colombia", "Croatia", "Czech Republic",
            "Denmark", "Egypt", "Estonia", "Finland", "France", "Germany",
            "Greece", "Hungary", "Iceland", "India", "Indonesia", "Ireland",
            "Israel", "Italy", "Japan", "Jordan", "Kenya", "Latvia",
            "Lithuania", "Luxembourg", "Malaysia", "Mexico", "Morocco", "Netherlands",
            "New Zealand", "Norway", "Peru", "Philippines", "Poland", "Portugal",
            "Romania", "Russia", "Saudi Arabia", "Singapore", "Slovakia", "Slovenia",
            "South Africa", "South Korea", "Spain", "Sweden", "Switzerland", "Thailand",
            "Turkey", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Vietnam"
        ];

        this.currencies = [
            { code: 'USD', name: 'US Dollar', symbol: '$' },
            { code: 'EUR', name: 'Euro', symbol: '\u20ac' },
            { code: 'GBP', name: 'British Pound', symbol: '\u00a3' },
            { code: 'JPY', name: 'Japanese Yen', symbol: '\u00a5' },
            { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
            { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
            { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
            { code: 'CNY', name: 'Chinese Yuan', symbol: '\u00a5' },
            { code: 'INR', name: 'Indian Rupee', symbol: '\u20b9' },
            { code: 'KRW', name: 'South Korean Won', symbol: '\u20a9' },
            { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
            { code: 'THB', name: 'Thai Baht', symbol: '\u0e3f' },
            { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
            { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
            { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
            { code: 'AED', name: 'UAE Dirham', symbol: '\u062f.\u0625' },
            { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
            { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
            { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
            { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
            { code: 'PLN', name: 'Polish Zloty', symbol: 'z\u0142' },
            { code: 'TRY', name: 'Turkish Lira', symbol: '\u20ba' },
            { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
            { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
            { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
            { code: 'PHP', name: 'Philippine Peso', symbol: '\u20b1' },
            { code: 'VND', name: 'Vietnamese Dong', symbol: '\u20ab' },
            { code: 'CZK', name: 'Czech Koruna', symbol: 'K\u010d' },
            { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
            { code: 'ILS', name: 'Israeli Shekel', symbol: '\u20aa' }
        ];

        this.interests = [
            "Photography", "Food tours", "History", "Art", "Architecture",
            "Nature", "Hiking", "Beaches", "Nightlife", "Shopping",
            "Local markets", "Museums", "Wine & spirits", "Adventure sports",
            "Wildlife", "Wellness & spa"
        ];

        this.dietaryOptions = [
            "Vegetarian", "Vegan", "Pescatarian", "Halal", "Kosher",
            "Gluten-free", "Dairy-free", "Nut allergy", "No pork", "No seafood"
        ];

        this.countryToCode = {
            "Argentina": "AR", "Australia": "AU", "Austria": "AT", "Belgium": "BE",
            "Brazil": "BR", "Bulgaria": "BG", "Canada": "CA", "Chile": "CL",
            "China": "CN", "Colombia": "CO", "Croatia": "HR", "Czech Republic": "CZ",
            "Denmark": "DK", "Egypt": "EG", "Estonia": "EE", "Finland": "FI",
            "France": "FR", "Germany": "DE", "Greece": "GR", "Hungary": "HU",
            "Iceland": "IS", "India": "IN", "Indonesia": "ID", "Ireland": "IE",
            "Israel": "IL", "Italy": "IT", "Japan": "JP", "Jordan": "JO",
            "Kenya": "KE", "Latvia": "LV", "Lithuania": "LT", "Luxembourg": "LU",
            "Malaysia": "MY", "Mexico": "MX", "Morocco": "MA", "Netherlands": "NL",
            "New Zealand": "NZ", "Norway": "NO", "Peru": "PE", "Philippines": "PH",
            "Poland": "PL", "Portugal": "PT", "Romania": "RO", "Russia": "RU",
            "Saudi Arabia": "SA", "Singapore": "SG", "Slovakia": "SK", "Slovenia": "SI",
            "South Africa": "ZA", "South Korea": "KR", "Spain": "ES", "Sweden": "SE",
            "Switzerland": "CH", "Thailand": "TH", "Turkey": "TR", "Ukraine": "UA",
            "United Arab Emirates": "AE", "United Kingdom": "GB", "United States": "US", "Vietnam": "VN"
        };

        this.init();
    }

    getDefaultSettings() {
        return {
            theme: 'system',
            homeCountry: '',
            homeCurrency: 'USD',
            passports: [],
            temperatureUnit: 'celsius',
            travelStyle: 'balanced',
            budgetPreference: 'medium',
            packingGender: 'neutral',
            interests: [],
            dietaryPreferences: [],
            showActiveTripsToFriends: true,
            showUpcomingTripsToFriends: true
        };
    }

    async init() {
        // Wait for auth to be ready
        if (window.tripPortierAuth) {
            window.tripPortierAuth.addListener((user) => this.handleAuthChange(user));
        }

        // Setup event listeners
        this.setupEventListeners();
        this.populateDropdowns();
        this.renderChips();

        // Load local settings first
        this.loadLocalSettings();
        this.applySettingsToUI();
    }

    handleAuthChange(user) {
        this.user = user;

        const loadingEl = document.getElementById('settings-loading');
        const notSignedInEl = document.getElementById('settings-not-signed-in');
        const contentEl = document.getElementById('settings-content');

        loadingEl.style.display = 'none';

        if (user) {
            notSignedInEl.style.display = 'none';
            contentEl.style.display = 'flex';
            this.loadSettingsFromSupabase();
        } else {
            notSignedInEl.style.display = 'block';
            contentEl.style.display = 'none';
        }
    }

    setupEventListeners() {
        // Theme toggle
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.addEventListener('click', () => this.setTheme(btn.dataset.theme));
        });

        // Home country
        const countrySelect = document.getElementById('home-country-select');
        if (countrySelect) {
            countrySelect.addEventListener('change', () => {
                this.settings.homeCountry = countrySelect.value;
                this.saveSettings();
            });
        }

        // Home currency
        const currencySelect = document.getElementById('home-currency-select');
        if (currencySelect) {
            currencySelect.addEventListener('change', () => {
                this.settings.homeCurrency = currencySelect.value;
                this.saveSettings();
            });
        }

        // Temperature unit
        const tempUnitSelect = document.getElementById('temperature-unit-select');
        if (tempUnitSelect) {
            tempUnitSelect.addEventListener('change', () => {
                this.settings.temperatureUnit = tempUnitSelect.value;
                this.saveSettings();
            });
        }

        // Travel style
        const travelStyleSelect = document.getElementById('travel-style-select');
        if (travelStyleSelect) {
            travelStyleSelect.addEventListener('change', () => {
                this.settings.travelStyle = travelStyleSelect.value;
                this.saveSettings();
            });
        }

        // Budget preference
        const budgetSelect = document.getElementById('budget-pref-select');
        if (budgetSelect) {
            budgetSelect.addEventListener('change', () => {
                this.settings.budgetPreference = budgetSelect.value;
                this.saveSettings();
            });
        }

        // Packing gender
        const packingGenderSelect = document.getElementById('packing-gender-select');
        if (packingGenderSelect) {
            packingGenderSelect.addEventListener('change', () => {
                this.settings.packingGender = packingGenderSelect.value;
                this.saveSettings();
            });
        }

        // Privacy toggles
        const showActiveTrips = document.getElementById('show-active-trips');
        if (showActiveTrips) {
            showActiveTrips.addEventListener('change', () => {
                this.settings.showActiveTripsToFriends = showActiveTrips.checked;
                this.saveSettings();
            });
        }

        const showUpcomingTrips = document.getElementById('show-upcoming-trips');
        if (showUpcomingTrips) {
            showUpcomingTrips.addEventListener('change', () => {
                this.settings.showUpcomingTripsToFriends = showUpcomingTrips.checked;
                this.saveSettings();
            });
        }

        // Passports button
        const passportsBtn = document.getElementById('passports-btn');
        if (passportsBtn) {
            passportsBtn.addEventListener('click', () => this.openPassportsModal());
        }

        // Passport search
        const passportSearch = document.getElementById('passport-search');
        if (passportSearch) {
            passportSearch.addEventListener('input', (e) => this.filterPassportList(e.target.value));
        }

        // Modal backdrop close
        const modalBackdrop = document.querySelector('.settings-modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', () => this.closePassportsModal());
        }

        // Sign out button
        const signOutBtn = document.getElementById('sign-out-btn');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', () => this.signOut());
        }
    }

    populateDropdowns() {
        // Countries dropdown
        const countrySelect = document.getElementById('home-country-select');
        if (countrySelect) {
            this.countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = `${this.getFlagEmoji(this.countryToCode[country])} ${country}`;
                countrySelect.appendChild(option);
            });
        }

        // Currencies dropdown
        const currencySelect = document.getElementById('home-currency-select');
        if (currencySelect) {
            this.currencies.forEach(currency => {
                const option = document.createElement('option');
                option.value = currency.code;
                option.textContent = `${currency.code} - ${currency.name}`;
                currencySelect.appendChild(option);
            });
        }

        // Passport list
        this.renderPassportList();
    }

    renderPassportList(filter = '') {
        const passportList = document.getElementById('passport-list');
        if (!passportList) return;

        const filterLower = filter.toLowerCase();
        const filteredCountries = this.countries.filter(country =>
            country.toLowerCase().includes(filterLower)
        );

        passportList.innerHTML = filteredCountries.map(country => {
            const code = this.countryToCode[country];
            const isSelected = this.selectedPassports.includes(code);
            return `
                <label class="settings-checkbox-item">
                    <input type="checkbox" value="${code}" ${isSelected ? 'checked' : ''}>
                    <span class="flag">${this.getFlagEmoji(code)}</span>
                    <span class="name">${country}</span>
                </label>
            `;
        }).join('');

        // Add change listeners
        passportList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    if (!this.selectedPassports.includes(checkbox.value)) {
                        this.selectedPassports.push(checkbox.value);
                    }
                } else {
                    this.selectedPassports = this.selectedPassports.filter(p => p !== checkbox.value);
                }
            });
        });
    }

    renderChips() {
        // Interests chips
        const interestsContainer = document.getElementById('interests-chips');
        if (interestsContainer) {
            interestsContainer.innerHTML = this.interests.map(interest => {
                const isActive = this.settings.interests.includes(interest);
                return `<button class="settings-chip ${isActive ? 'active' : ''}" data-value="${interest}">${interest}</button>`;
            }).join('');

            interestsContainer.querySelectorAll('.settings-chip').forEach(chip => {
                chip.addEventListener('click', () => this.toggleChip('interests', chip));
            });
        }

        // Dietary chips
        const dietaryContainer = document.getElementById('dietary-chips');
        if (dietaryContainer) {
            dietaryContainer.innerHTML = this.dietaryOptions.map(option => {
                const isActive = this.settings.dietaryPreferences.includes(option);
                return `<button class="settings-chip ${isActive ? 'active' : ''}" data-value="${option}">${option}</button>`;
            }).join('');

            dietaryContainer.querySelectorAll('.settings-chip').forEach(chip => {
                chip.addEventListener('click', () => this.toggleChip('dietaryPreferences', chip));
            });
        }
    }

    toggleChip(settingKey, chip) {
        const value = chip.dataset.value;
        const index = this.settings[settingKey].indexOf(value);

        if (index > -1) {
            this.settings[settingKey].splice(index, 1);
            chip.classList.remove('active');
        } else {
            this.settings[settingKey].push(value);
            chip.classList.add('active');
        }

        this.saveSettings();
    }

    getFlagEmoji(countryCode) {
        if (!countryCode) return '';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    }

    setTheme(theme) {
        this.settings.theme = theme;

        // Update UI
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });

        // Apply theme
        this.applyTheme(theme);

        this.saveSettings();
    }

    applyTheme(theme) {
        const root = document.documentElement;

        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else if (theme === 'light') {
            root.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            // System
            root.removeAttribute('data-theme');
            localStorage.setItem('theme', 'system');

            // Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                root.setAttribute('data-theme', 'dark');
            }
        }
    }

    openPassportsModal() {
        this.selectedPassports = [...this.settings.passports];
        this.renderPassportList();
        document.getElementById('passports-modal').classList.add('active');
        document.getElementById('passport-search').value = '';
    }

    filterPassportList(filter) {
        this.renderPassportList(filter);
    }

    savePassports() {
        this.settings.passports = [...this.selectedPassports];
        this.updatePassportsDisplay();
        this.closePassportsModal();
        this.saveSettings();
    }

    updatePassportsDisplay() {
        const display = document.getElementById('passports-display');
        if (display) {
            if (this.settings.passports.length === 0) {
                display.textContent = 'Add passports';
            } else {
                const flags = this.settings.passports.map(code => this.getFlagEmoji(code)).join(' ');
                display.textContent = flags;
            }
        }
    }

    applySettingsToUI() {
        // Theme
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === this.settings.theme);
        });
        this.applyTheme(this.settings.theme);

        // Dropdowns
        const countrySelect = document.getElementById('home-country-select');
        if (countrySelect) countrySelect.value = this.settings.homeCountry;

        const currencySelect = document.getElementById('home-currency-select');
        if (currencySelect) currencySelect.value = this.settings.homeCurrency;

        const tempUnitSelect = document.getElementById('temperature-unit-select');
        if (tempUnitSelect) tempUnitSelect.value = this.settings.temperatureUnit || 'celsius';

        const travelStyleSelect = document.getElementById('travel-style-select');
        if (travelStyleSelect) travelStyleSelect.value = this.settings.travelStyle;

        const budgetSelect = document.getElementById('budget-pref-select');
        if (budgetSelect) budgetSelect.value = this.settings.budgetPreference;

        const packingGenderSelect = document.getElementById('packing-gender-select');
        if (packingGenderSelect) packingGenderSelect.value = this.settings.packingGender;

        // Privacy toggles
        const showActiveTrips = document.getElementById('show-active-trips');
        if (showActiveTrips) showActiveTrips.checked = this.settings.showActiveTripsToFriends;

        const showUpcomingTrips = document.getElementById('show-upcoming-trips');
        if (showUpcomingTrips) showUpcomingTrips.checked = this.settings.showUpcomingTripsToFriends;

        // Passports display
        this.updatePassportsDisplay();

        // Re-render chips with updated state
        this.renderChips();
    }

    loadLocalSettings() {
        const saved = localStorage.getItem('tripportier_settings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.settings = { ...this.getDefaultSettings(), ...parsed };
            } catch (e) {
                console.error('Failed to parse local settings:', e);
            }
        }
    }

    async loadSettingsFromSupabase() {
        if (!this.user) return;

        try {
            // Load user data from users table (snake_case columns)
            const { data: userData, error: userError } = await supabaseClient
                .from('users')
                .select('home_country, temperature_unit, currency')
                .eq('id', this.user.id)
                .single();

            if (userError && userError.code !== 'PGRST116') {
                throw userError;
            }

            // Load passports from user_passports table
            const { data: passportsData, error: passportsError } = await supabaseClient
                .from('user_passports')
                .select('country_code')
                .eq('user_id', this.user.id);

            if (passportsError) {
                console.error('Error loading passports:', passportsError);
            }

            // Map Supabase data to settings (snake_case to camelCase)
            if (userData) {
                this.settings.homeCountry = userData.home_country || '';
                this.settings.temperatureUnit = userData.temperature_unit || 'celsius';
                this.settings.homeCurrency = userData.currency || 'USD';
            }

            // Map passports
            if (passportsData && passportsData.length > 0) {
                this.settings.passports = passportsData.map(p => p.country_code);
            }

            // Extended settings are stored locally (theme, travelStyle, budgetPreference, etc.)
            // These are loaded from localStorage and saved there as the primary source
            // This keeps the database schema simple while still syncing core settings

            this.applySettingsToUI();

            // Also save locally for offline access
            localStorage.setItem('tripportier_settings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error loading settings from Supabase:', error);
        }
    }

    async saveSettings() {
        // Save locally first (includes all settings)
        localStorage.setItem('tripportier_settings', JSON.stringify(this.settings));

        // Save to Supabase if logged in
        if (this.user) {
            try {
                // Update users table (snake_case columns)
                const { error: userError } = await supabaseClient
                    .from('users')
                    .update({
                        home_country: this.settings.homeCountry || null,
                        temperature_unit: this.settings.temperatureUnit || 'celsius',
                        currency: this.settings.homeCurrency || 'USD',
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', this.user.id);

                if (userError) {
                    throw userError;
                }

                // Sync passports to user_passports table
                await this.syncPassportsToSupabase();

                this.showToast('Settings saved');
            } catch (error) {
                console.error('Error saving settings to Supabase:', error);
                this.showToast('Failed to save settings');
            }
        }
    }

    async syncPassportsToSupabase() {
        if (!this.user) return;

        try {
            // Get current passports from database
            const { data: existingPassports, error: fetchError } = await supabaseClient
                .from('user_passports')
                .select('country_code')
                .eq('user_id', this.user.id);

            if (fetchError) {
                throw fetchError;
            }

            const existingCodes = (existingPassports || []).map(p => p.country_code);
            const newCodes = this.settings.passports || [];

            // Determine what to add and what to remove
            const toAdd = newCodes.filter(code => !existingCodes.includes(code));
            const toRemove = existingCodes.filter(code => !newCodes.includes(code));

            // Remove passports that are no longer selected
            if (toRemove.length > 0) {
                const { error: deleteError } = await supabaseClient
                    .from('user_passports')
                    .delete()
                    .eq('user_id', this.user.id)
                    .in('country_code', toRemove);

                if (deleteError) {
                    console.error('Error removing passports:', deleteError);
                }
            }

            // Add new passports
            if (toAdd.length > 0) {
                const passportsToInsert = toAdd.map(code => ({
                    user_id: this.user.id,
                    country_code: code
                }));

                const { error: insertError } = await supabaseClient
                    .from('user_passports')
                    .insert(passportsToInsert);

                if (insertError) {
                    console.error('Error adding passports:', insertError);
                }
            }
        } catch (error) {
            console.error('Error syncing passports:', error);
        }
    }

    showToast(message) {
        const toast = document.getElementById('settings-toast');
        const toastMessage = document.getElementById('settings-toast-message');

        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
            }, 2000);
        }
    }

    async signOut() {
        if (confirm('Are you sure you want to sign out?')) {
            await window.tripPortierAuth.signOut();
            window.location.href = 'index.html';
        }
    }
}

// Global functions for modal
function closePassportsModal() {
    document.getElementById('passports-modal').classList.remove('active');
}

function savePassports() {
    if (window.settingsManager) {
        window.settingsManager.savePassports();
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
});
