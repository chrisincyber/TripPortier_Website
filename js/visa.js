/**
 * TripPortier Visa Check Page
 * Handles country selection, API calls, and result display
 */

// Country data with ISO 3166 ALPHA-3 codes (3-letter) and flag emojis
// SimpleVisa API requires 3-letter codes
const COUNTRIES = [
    { code: 'AFG', name: 'Afghanistan', flag: '🇦🇫' },
    { code: 'ALB', name: 'Albania', flag: '🇦🇱' },
    { code: 'DZA', name: 'Algeria', flag: '🇩🇿' },
    { code: 'AND', name: 'Andorra', flag: '🇦🇩' },
    { code: 'AGO', name: 'Angola', flag: '🇦🇴' },
    { code: 'ATG', name: 'Antigua and Barbuda', flag: '🇦🇬' },
    { code: 'ARG', name: 'Argentina', flag: '🇦🇷' },
    { code: 'ARM', name: 'Armenia', flag: '🇦🇲' },
    { code: 'AUS', name: 'Australia', flag: '🇦🇺' },
    { code: 'AUT', name: 'Austria', flag: '🇦🇹' },
    { code: 'AZE', name: 'Azerbaijan', flag: '🇦🇿' },
    { code: 'BHS', name: 'Bahamas', flag: '🇧🇸' },
    { code: 'BHR', name: 'Bahrain', flag: '🇧🇭' },
    { code: 'BGD', name: 'Bangladesh', flag: '🇧🇩' },
    { code: 'BRB', name: 'Barbados', flag: '🇧🇧' },
    { code: 'BLR', name: 'Belarus', flag: '🇧🇾' },
    { code: 'BEL', name: 'Belgium', flag: '🇧🇪' },
    { code: 'BLZ', name: 'Belize', flag: '🇧🇿' },
    { code: 'BEN', name: 'Benin', flag: '🇧🇯' },
    { code: 'BTN', name: 'Bhutan', flag: '🇧🇹' },
    { code: 'BOL', name: 'Bolivia', flag: '🇧🇴' },
    { code: 'BIH', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
    { code: 'BWA', name: 'Botswana', flag: '🇧🇼' },
    { code: 'BRA', name: 'Brazil', flag: '🇧🇷' },
    { code: 'BRN', name: 'Brunei', flag: '🇧🇳' },
    { code: 'BGR', name: 'Bulgaria', flag: '🇧🇬' },
    { code: 'BFA', name: 'Burkina Faso', flag: '🇧🇫' },
    { code: 'BDI', name: 'Burundi', flag: '🇧🇮' },
    { code: 'CPV', name: 'Cabo Verde', flag: '🇨🇻' },
    { code: 'KHM', name: 'Cambodia', flag: '🇰🇭' },
    { code: 'CMR', name: 'Cameroon', flag: '🇨🇲' },
    { code: 'CAN', name: 'Canada', flag: '🇨🇦' },
    { code: 'CAF', name: 'Central African Republic', flag: '🇨🇫' },
    { code: 'TCD', name: 'Chad', flag: '🇹🇩' },
    { code: 'CHL', name: 'Chile', flag: '🇨🇱' },
    { code: 'CHN', name: 'China', flag: '🇨🇳' },
    { code: 'COL', name: 'Colombia', flag: '🇨🇴' },
    { code: 'COM', name: 'Comoros', flag: '🇰🇲' },
    { code: 'COG', name: 'Congo', flag: '🇨🇬' },
    { code: 'COD', name: 'Congo (DRC)', flag: '🇨🇩' },
    { code: 'CRI', name: 'Costa Rica', flag: '🇨🇷' },
    { code: 'CIV', name: "Côte d'Ivoire", flag: '🇨🇮' },
    { code: 'HRV', name: 'Croatia', flag: '🇭🇷' },
    { code: 'CUB', name: 'Cuba', flag: '🇨🇺' },
    { code: 'CYP', name: 'Cyprus', flag: '🇨🇾' },
    { code: 'CZE', name: 'Czech Republic', flag: '🇨🇿' },
    { code: 'DNK', name: 'Denmark', flag: '🇩🇰' },
    { code: 'DJI', name: 'Djibouti', flag: '🇩🇯' },
    { code: 'DMA', name: 'Dominica', flag: '🇩🇲' },
    { code: 'DOM', name: 'Dominican Republic', flag: '🇩🇴' },
    { code: 'ECU', name: 'Ecuador', flag: '🇪🇨' },
    { code: 'EGY', name: 'Egypt', flag: '🇪🇬' },
    { code: 'SLV', name: 'El Salvador', flag: '🇸🇻' },
    { code: 'GNQ', name: 'Equatorial Guinea', flag: '🇬🇶' },
    { code: 'ERI', name: 'Eritrea', flag: '🇪🇷' },
    { code: 'EST', name: 'Estonia', flag: '🇪🇪' },
    { code: 'SWZ', name: 'Eswatini', flag: '🇸🇿' },
    { code: 'ETH', name: 'Ethiopia', flag: '🇪🇹' },
    { code: 'FJI', name: 'Fiji', flag: '🇫🇯' },
    { code: 'FIN', name: 'Finland', flag: '🇫🇮' },
    { code: 'FRA', name: 'France', flag: '🇫🇷' },
    { code: 'GAB', name: 'Gabon', flag: '🇬🇦' },
    { code: 'GMB', name: 'Gambia', flag: '🇬🇲' },
    { code: 'GEO', name: 'Georgia', flag: '🇬🇪' },
    { code: 'DEU', name: 'Germany', flag: '🇩🇪' },
    { code: 'GHA', name: 'Ghana', flag: '🇬🇭' },
    { code: 'GRC', name: 'Greece', flag: '🇬🇷' },
    { code: 'GRD', name: 'Grenada', flag: '🇬🇩' },
    { code: 'GTM', name: 'Guatemala', flag: '🇬🇹' },
    { code: 'GIN', name: 'Guinea', flag: '🇬🇳' },
    { code: 'GNB', name: 'Guinea-Bissau', flag: '🇬🇼' },
    { code: 'GUY', name: 'Guyana', flag: '🇬🇾' },
    { code: 'HTI', name: 'Haiti', flag: '🇭🇹' },
    { code: 'HND', name: 'Honduras', flag: '🇭🇳' },
    { code: 'HUN', name: 'Hungary', flag: '🇭🇺' },
    { code: 'ISL', name: 'Iceland', flag: '🇮🇸' },
    { code: 'IND', name: 'India', flag: '🇮🇳' },
    { code: 'IDN', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'IRN', name: 'Iran', flag: '🇮🇷' },
    { code: 'IRQ', name: 'Iraq', flag: '🇮🇶' },
    { code: 'IRL', name: 'Ireland', flag: '🇮🇪' },
    { code: 'ISR', name: 'Israel', flag: '🇮🇱' },
    { code: 'ITA', name: 'Italy', flag: '🇮🇹' },
    { code: 'JAM', name: 'Jamaica', flag: '🇯🇲' },
    { code: 'JPN', name: 'Japan', flag: '🇯🇵' },
    { code: 'JOR', name: 'Jordan', flag: '🇯🇴' },
    { code: 'KAZ', name: 'Kazakhstan', flag: '🇰🇿' },
    { code: 'KEN', name: 'Kenya', flag: '🇰🇪' },
    { code: 'KIR', name: 'Kiribati', flag: '🇰🇮' },
    { code: 'PRK', name: 'North Korea', flag: '🇰🇵' },
    { code: 'KOR', name: 'South Korea', flag: '🇰🇷' },
    { code: 'KWT', name: 'Kuwait', flag: '🇰🇼' },
    { code: 'KGZ', name: 'Kyrgyzstan', flag: '🇰🇬' },
    { code: 'LAO', name: 'Laos', flag: '🇱🇦' },
    { code: 'LVA', name: 'Latvia', flag: '🇱🇻' },
    { code: 'LBN', name: 'Lebanon', flag: '🇱🇧' },
    { code: 'LSO', name: 'Lesotho', flag: '🇱🇸' },
    { code: 'LBR', name: 'Liberia', flag: '🇱🇷' },
    { code: 'LBY', name: 'Libya', flag: '🇱🇾' },
    { code: 'LIE', name: 'Liechtenstein', flag: '🇱🇮' },
    { code: 'LTU', name: 'Lithuania', flag: '🇱🇹' },
    { code: 'LUX', name: 'Luxembourg', flag: '🇱🇺' },
    { code: 'MDG', name: 'Madagascar', flag: '🇲🇬' },
    { code: 'MWI', name: 'Malawi', flag: '🇲🇼' },
    { code: 'MYS', name: 'Malaysia', flag: '🇲🇾' },
    { code: 'MDV', name: 'Maldives', flag: '🇲🇻' },
    { code: 'MLI', name: 'Mali', flag: '🇲🇱' },
    { code: 'MLT', name: 'Malta', flag: '🇲🇹' },
    { code: 'MHL', name: 'Marshall Islands', flag: '🇲🇭' },
    { code: 'MRT', name: 'Mauritania', flag: '🇲🇷' },
    { code: 'MUS', name: 'Mauritius', flag: '🇲🇺' },
    { code: 'MEX', name: 'Mexico', flag: '🇲🇽' },
    { code: 'FSM', name: 'Micronesia', flag: '🇫🇲' },
    { code: 'MDA', name: 'Moldova', flag: '🇲🇩' },
    { code: 'MCO', name: 'Monaco', flag: '🇲🇨' },
    { code: 'MNG', name: 'Mongolia', flag: '🇲🇳' },
    { code: 'MNE', name: 'Montenegro', flag: '🇲🇪' },
    { code: 'MAR', name: 'Morocco', flag: '🇲🇦' },
    { code: 'MOZ', name: 'Mozambique', flag: '🇲🇿' },
    { code: 'MMR', name: 'Myanmar', flag: '🇲🇲' },
    { code: 'NAM', name: 'Namibia', flag: '🇳🇦' },
    { code: 'NRU', name: 'Nauru', flag: '🇳🇷' },
    { code: 'NPL', name: 'Nepal', flag: '🇳🇵' },
    { code: 'NLD', name: 'Netherlands', flag: '🇳🇱' },
    { code: 'NZL', name: 'New Zealand', flag: '🇳🇿' },
    { code: 'NIC', name: 'Nicaragua', flag: '🇳🇮' },
    { code: 'NER', name: 'Niger', flag: '🇳🇪' },
    { code: 'NGA', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'MKD', name: 'North Macedonia', flag: '🇲🇰' },
    { code: 'NOR', name: 'Norway', flag: '🇳🇴' },
    { code: 'OMN', name: 'Oman', flag: '🇴🇲' },
    { code: 'PAK', name: 'Pakistan', flag: '🇵🇰' },
    { code: 'PLW', name: 'Palau', flag: '🇵🇼' },
    { code: 'PSE', name: 'Palestine', flag: '🇵🇸' },
    { code: 'PAN', name: 'Panama', flag: '🇵🇦' },
    { code: 'PNG', name: 'Papua New Guinea', flag: '🇵🇬' },
    { code: 'PRY', name: 'Paraguay', flag: '🇵🇾' },
    { code: 'PER', name: 'Peru', flag: '🇵🇪' },
    { code: 'PHL', name: 'Philippines', flag: '🇵🇭' },
    { code: 'POL', name: 'Poland', flag: '🇵🇱' },
    { code: 'PRT', name: 'Portugal', flag: '🇵🇹' },
    { code: 'QAT', name: 'Qatar', flag: '🇶🇦' },
    { code: 'ROU', name: 'Romania', flag: '🇷🇴' },
    { code: 'RUS', name: 'Russia', flag: '🇷🇺' },
    { code: 'RWA', name: 'Rwanda', flag: '🇷🇼' },
    { code: 'KNA', name: 'Saint Kitts and Nevis', flag: '🇰🇳' },
    { code: 'LCA', name: 'Saint Lucia', flag: '🇱🇨' },
    { code: 'VCT', name: 'Saint Vincent and the Grenadines', flag: '🇻🇨' },
    { code: 'WSM', name: 'Samoa', flag: '🇼🇸' },
    { code: 'SMR', name: 'San Marino', flag: '🇸🇲' },
    { code: 'STP', name: 'Sao Tome and Principe', flag: '🇸🇹' },
    { code: 'SAU', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'SEN', name: 'Senegal', flag: '🇸🇳' },
    { code: 'SRB', name: 'Serbia', flag: '🇷🇸' },
    { code: 'SYC', name: 'Seychelles', flag: '🇸🇨' },
    { code: 'SLE', name: 'Sierra Leone', flag: '🇸🇱' },
    { code: 'SGP', name: 'Singapore', flag: '🇸🇬' },
    { code: 'SVK', name: 'Slovakia', flag: '🇸🇰' },
    { code: 'SVN', name: 'Slovenia', flag: '🇸🇮' },
    { code: 'SLB', name: 'Solomon Islands', flag: '🇸🇧' },
    { code: 'SOM', name: 'Somalia', flag: '🇸🇴' },
    { code: 'ZAF', name: 'South Africa', flag: '🇿🇦' },
    { code: 'SSD', name: 'South Sudan', flag: '🇸🇸' },
    { code: 'ESP', name: 'Spain', flag: '🇪🇸' },
    { code: 'LKA', name: 'Sri Lanka', flag: '🇱🇰' },
    { code: 'SDN', name: 'Sudan', flag: '🇸🇩' },
    { code: 'SUR', name: 'Suriname', flag: '🇸🇷' },
    { code: 'SWE', name: 'Sweden', flag: '🇸🇪' },
    { code: 'CHE', name: 'Switzerland', flag: '🇨🇭' },
    { code: 'SYR', name: 'Syria', flag: '🇸🇾' },
    { code: 'TWN', name: 'Taiwan', flag: '🇹🇼' },
    { code: 'TJK', name: 'Tajikistan', flag: '🇹🇯' },
    { code: 'TZA', name: 'Tanzania', flag: '🇹🇿' },
    { code: 'THA', name: 'Thailand', flag: '🇹🇭' },
    { code: 'TLS', name: 'Timor-Leste', flag: '🇹🇱' },
    { code: 'TGO', name: 'Togo', flag: '🇹🇬' },
    { code: 'TON', name: 'Tonga', flag: '🇹🇴' },
    { code: 'TTO', name: 'Trinidad and Tobago', flag: '🇹🇹' },
    { code: 'TUN', name: 'Tunisia', flag: '🇹🇳' },
    { code: 'TUR', name: 'Turkey', flag: '🇹🇷' },
    { code: 'TKM', name: 'Turkmenistan', flag: '🇹🇲' },
    { code: 'TUV', name: 'Tuvalu', flag: '🇹🇻' },
    { code: 'UGA', name: 'Uganda', flag: '🇺🇬' },
    { code: 'UKR', name: 'Ukraine', flag: '🇺🇦' },
    { code: 'ARE', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: 'GBR', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'USA', name: 'United States', flag: '🇺🇸' },
    { code: 'URY', name: 'Uruguay', flag: '🇺🇾' },
    { code: 'UZB', name: 'Uzbekistan', flag: '🇺🇿' },
    { code: 'VUT', name: 'Vanuatu', flag: '🇻🇺' },
    { code: 'VAT', name: 'Vatican City', flag: '🇻🇦' },
    { code: 'VEN', name: 'Venezuela', flag: '🇻🇪' },
    { code: 'VNM', name: 'Vietnam', flag: '🇻🇳' },
    { code: 'YEM', name: 'Yemen', flag: '🇾🇪' },
    { code: 'ZMB', name: 'Zambia', flag: '🇿🇲' },
    { code: 'ZWE', name: 'Zimbabwe', flag: '🇿🇼' }
];

// State management
const state = {
    passportCountry: null,
    destination: null,
    transitCountries: [],
    activeSelector: null,
    highlightedIndex: -1
};

// Constants
const MAX_TRANSIT_COUNTRIES = 3;
const SUPABASE_FUNCTION_URL = window.supabaseConfig?.url
    ? `${window.supabaseConfig.url}/functions/v1/visa-check`
    : 'https://bomkdhuckqosvuhfhyci.supabase.co/functions/v1/visa-check';

// DOM Elements
let passportTrigger, passportDropdown, passportList;
let destinationTrigger, destinationDropdown, destinationList;
let transitContainer, addTransitBtn;
let visaCheckBtn, visaResults;
let bottomSheet, bottomSheetTitle, bottomSheetSearchInput, bottomSheetList;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initVisaChecker);

function initVisaChecker() {
    // Get DOM elements
    passportTrigger = document.getElementById('passport-trigger');
    passportDropdown = document.getElementById('passport-dropdown');
    passportList = passportDropdown?.querySelector('.country-list');

    destinationTrigger = document.getElementById('destination-trigger');
    destinationDropdown = document.getElementById('destination-dropdown');
    destinationList = destinationDropdown?.querySelector('.country-list');

    transitContainer = document.getElementById('transit-countries');
    addTransitBtn = document.getElementById('add-transit-btn');

    visaCheckBtn = document.getElementById('visa-check-btn');
    visaResults = document.getElementById('visa-results');

    bottomSheet = document.getElementById('country-bottom-sheet');
    bottomSheetTitle = document.getElementById('bottom-sheet-title');
    bottomSheetSearchInput = document.getElementById('bottom-sheet-search-input');
    bottomSheetList = document.getElementById('bottom-sheet-list');

    // Populate country lists
    populateCountryList(passportList, 'passport');
    populateCountryList(destinationList, 'destination');
    populateCountryList(bottomSheetList, 'bottomsheet');

    // Setup event listeners
    setupSelectorEvents('passport', passportTrigger, passportDropdown, passportList);
    setupSelectorEvents('destination', destinationTrigger, destinationDropdown, destinationList);

    // Transit country add button
    addTransitBtn?.addEventListener('click', addTransitCountry);

    // Check button
    visaCheckBtn?.addEventListener('click', checkVisaRequirements);

    // Bottom sheet events
    setupBottomSheet();

    // FAQ accordion
    setupFaqAccordion();

    // Close dropdowns when clicking outside
    document.addEventListener('click', handleOutsideClick);
}

function populateCountryList(listElement, type) {
    if (!listElement) return;

    listElement.innerHTML = COUNTRIES.map((country, index) => `
        <li role="option"
            data-code="${country.code}"
            data-name="${country.name}"
            data-flag="${country.flag}"
            data-index="${index}"
            tabindex="-1">
            <span class="country-flag">${country.flag}</span>
            <span class="country-name">${country.name}</span>
        </li>
    `).join('');
}

function setupSelectorEvents(type, trigger, dropdown, list) {
    if (!trigger || !dropdown || !list) return;

    const searchInput = dropdown.querySelector('.country-search');

    // Toggle dropdown on trigger click
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();

        // On mobile, use bottom sheet
        if (window.innerWidth <= 768) {
            openBottomSheet(type);
            return;
        }

        const isOpen = dropdown.classList.contains('open');
        closeAllDropdowns();

        if (!isOpen) {
            dropdown.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
            state.activeSelector = type;
            state.highlightedIndex = -1;
            searchInput?.focus();
        }
    });

    // Search functionality
    searchInput?.addEventListener('input', (e) => {
        filterCountries(list, e.target.value);
    });

    // Keyboard navigation
    searchInput?.addEventListener('keydown', (e) => {
        handleKeyboardNavigation(e, list, type);
    });

    // Country selection
    list.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (li && !li.classList.contains('no-results')) {
            selectCountry(type, {
                code: li.dataset.code,
                name: li.dataset.name,
                flag: li.dataset.flag
            });
        }
    });
}

function filterCountries(list, query) {
    const items = list.querySelectorAll('li[data-code]');
    const normalizedQuery = query.toLowerCase().trim();
    let visibleCount = 0;

    items.forEach(item => {
        const name = item.dataset.name.toLowerCase();
        const code = item.dataset.code.toLowerCase();
        const matches = name.includes(normalizedQuery) || code.includes(normalizedQuery);

        item.style.display = matches ? '' : 'none';
        if (matches) visibleCount++;
    });

    // Show no results message
    let noResults = list.querySelector('.no-results');
    if (visibleCount === 0) {
        if (!noResults) {
            noResults = document.createElement('li');
            noResults.className = 'no-results';
            noResults.textContent = 'No countries found';
            list.appendChild(noResults);
        }
        noResults.style.display = '';
    } else if (noResults) {
        noResults.style.display = 'none';
    }

    state.highlightedIndex = -1;
}

function handleKeyboardNavigation(e, list, type) {
    const visibleItems = Array.from(list.querySelectorAll('li[data-code]'))
        .filter(item => item.style.display !== 'none');

    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            state.highlightedIndex = Math.min(state.highlightedIndex + 1, visibleItems.length - 1);
            updateHighlight(visibleItems);
            break;

        case 'ArrowUp':
            e.preventDefault();
            state.highlightedIndex = Math.max(state.highlightedIndex - 1, 0);
            updateHighlight(visibleItems);
            break;

        case 'Enter':
            e.preventDefault();
            if (state.highlightedIndex >= 0 && visibleItems[state.highlightedIndex]) {
                const item = visibleItems[state.highlightedIndex];
                selectCountry(type, {
                    code: item.dataset.code,
                    name: item.dataset.name,
                    flag: item.dataset.flag
                });
            }
            break;

        case 'Escape':
            closeAllDropdowns();
            break;
    }
}

function updateHighlight(visibleItems) {
    visibleItems.forEach((item, index) => {
        item.classList.toggle('highlighted', index === state.highlightedIndex);
        if (index === state.highlightedIndex) {
            item.scrollIntoView({ block: 'nearest' });
        }
    });
}

function selectCountry(type, country, transitIndex = null) {
    if (type === 'passport') {
        state.passportCountry = country;
        updateTriggerDisplay(passportTrigger, country);
    } else if (type === 'destination') {
        state.destination = country;
        updateTriggerDisplay(destinationTrigger, country);
    } else if (type === 'transit' && transitIndex !== null) {
        state.transitCountries[transitIndex] = country;
        const transitItem = transitContainer.children[transitIndex];
        const trigger = transitItem?.querySelector('.country-selector-trigger');
        if (trigger) {
            updateTriggerDisplay(trigger, country);
        }
    }

    closeAllDropdowns();
    closeBottomSheet();
}

function updateTriggerDisplay(trigger, country) {
    const flagSpan = trigger.querySelector('.country-flag');
    const nameSpan = trigger.querySelector('.country-name');

    if (flagSpan) flagSpan.textContent = country.flag;
    if (nameSpan) nameSpan.textContent = country.name;

    trigger.classList.add('has-selection');
}

function closeAllDropdowns() {
    document.querySelectorAll('.country-dropdown').forEach(dropdown => {
        dropdown.classList.remove('open');
    });
    document.querySelectorAll('.country-selector-trigger').forEach(trigger => {
        trigger.setAttribute('aria-expanded', 'false');
    });
    state.activeSelector = null;
    state.highlightedIndex = -1;
}

function handleOutsideClick(e) {
    if (!e.target.closest('.country-selector')) {
        closeAllDropdowns();
    }
}

// Transit country management
function addTransitCountry() {
    if (state.transitCountries.length >= MAX_TRANSIT_COUNTRIES) return;

    const index = state.transitCountries.length;
    state.transitCountries.push(null);

    const transitItem = document.createElement('div');
    transitItem.className = 'transit-country-item';
    transitItem.dataset.index = index;
    transitItem.innerHTML = `
        <div class="country-selector" id="transit-selector-${index}">
            <button type="button" class="country-selector-trigger" aria-haspopup="listbox" aria-expanded="false">
                <span class="selected-country">
                    <span class="country-flag">🌍</span>
                    <span class="country-name">Select transit country</span>
                </span>
                <span class="selector-arrow">▼</span>
            </button>
            <div class="country-dropdown" role="listbox">
                <div class="country-search-wrapper">
                    <input type="text" class="country-search" placeholder="Search countries..." aria-label="Search countries">
                </div>
                <ul class="country-list" role="presentation"></ul>
            </div>
        </div>
        <button type="button" class="remove-transit-btn" aria-label="Remove transit country">×</button>
    `;

    transitContainer.appendChild(transitItem);

    // Setup events for new transit selector
    const trigger = transitItem.querySelector('.country-selector-trigger');
    const dropdown = transitItem.querySelector('.country-dropdown');
    const list = transitItem.querySelector('.country-list');
    const removeBtn = transitItem.querySelector('.remove-transit-btn');

    populateCountryList(list, `transit-${index}`);

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();

        if (window.innerWidth <= 768) {
            openBottomSheet('transit', index);
            return;
        }

        const isOpen = dropdown.classList.contains('open');
        closeAllDropdowns();

        if (!isOpen) {
            dropdown.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
            state.activeSelector = `transit-${index}`;
            dropdown.querySelector('.country-search')?.focus();
        }
    });

    const searchInput = dropdown.querySelector('.country-search');
    searchInput?.addEventListener('input', (e) => filterCountries(list, e.target.value));
    searchInput?.addEventListener('keydown', (e) => handleKeyboardNavigation(e, list, `transit-${index}`));

    list.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (li && !li.classList.contains('no-results')) {
            selectCountry('transit', {
                code: li.dataset.code,
                name: li.dataset.name,
                flag: li.dataset.flag
            }, index);
        }
    });

    removeBtn.addEventListener('click', () => removeTransitCountry(index));

    updateAddTransitButton();
}

function removeTransitCountry(index) {
    state.transitCountries.splice(index, 1);

    // Rebuild transit UI
    transitContainer.innerHTML = '';
    const countries = [...state.transitCountries];
    state.transitCountries = [];

    countries.forEach(country => {
        addTransitCountry();
        if (country) {
            const newIndex = state.transitCountries.length - 1;
            state.transitCountries[newIndex] = country;
            const transitItem = transitContainer.children[newIndex];
            const trigger = transitItem?.querySelector('.country-selector-trigger');
            if (trigger) {
                updateTriggerDisplay(trigger, country);
            }
        }
    });

    updateAddTransitButton();
}

function updateAddTransitButton() {
    if (addTransitBtn) {
        addTransitBtn.disabled = state.transitCountries.length >= MAX_TRANSIT_COUNTRIES;
    }
}

// Bottom sheet for mobile
function setupBottomSheet() {
    if (!bottomSheet) return;

    const overlay = bottomSheet.querySelector('.bottom-sheet-overlay');
    const closeBtn = bottomSheet.querySelector('.bottom-sheet-close');

    overlay?.addEventListener('click', closeBottomSheet);
    closeBtn?.addEventListener('click', closeBottomSheet);

    bottomSheetSearchInput?.addEventListener('input', (e) => {
        filterCountries(bottomSheetList, e.target.value);
    });

    bottomSheetList?.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (li && !li.classList.contains('no-results')) {
            const [type, indexStr] = (state.activeSelector || '').split('-');
            const index = indexStr ? parseInt(indexStr) : null;

            selectCountry(type === 'transit' ? 'transit' : type, {
                code: li.dataset.code,
                name: li.dataset.name,
                flag: li.dataset.flag
            }, type === 'transit' ? index : null);
        }
    });
}

function openBottomSheet(type, transitIndex = null) {
    if (!bottomSheet) return;

    state.activeSelector = transitIndex !== null ? `transit-${transitIndex}` : type;

    // Update title
    const titles = {
        passport: 'Select Passport Country',
        destination: 'Select Destination',
        transit: 'Select Transit Country'
    };
    if (bottomSheetTitle) {
        bottomSheetTitle.textContent = titles[type] || 'Select Country';
    }

    // Reset search
    if (bottomSheetSearchInput) {
        bottomSheetSearchInput.value = '';
    }
    filterCountries(bottomSheetList, '');

    // Mark current selection
    const currentSelection = type === 'passport' ? state.passportCountry :
                            type === 'destination' ? state.destination :
                            state.transitCountries[transitIndex];

    bottomSheetList?.querySelectorAll('li').forEach(li => {
        li.classList.toggle('selected', currentSelection?.code === li.dataset.code);
    });

    // Open sheet
    bottomSheet.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus search after animation
    setTimeout(() => bottomSheetSearchInput?.focus(), 300);
}

function closeBottomSheet() {
    if (!bottomSheet) return;

    bottomSheet.classList.remove('open');
    document.body.style.overflow = '';
    state.activeSelector = null;
}

// Visa check API call
async function checkVisaRequirements() {
    if (!state.passportCountry || !state.destination) {
        showError('Please select both passport country and destination.');
        return;
    }

    // Show loading state
    setLoadingState(true);
    showLoadingSkeleton();

    try {
        const response = await fetch(SUPABASE_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.supabaseConfig?.anonKey || ''}`
            },
            body: JSON.stringify({
                passportCountry: state.passportCountry.code,
                destination: state.destination.code,
                transitCountries: state.transitCountries
                    .filter(c => c !== null)
                    .map(c => c.code)
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to check visa requirements');
        }

        displayResults(data);
    } catch (error) {
        console.error('Visa check error:', error);
        showError(error.message || 'Something went wrong. Please try again.');
    } finally {
        setLoadingState(false);
    }
}

function setLoadingState(loading) {
    if (!visaCheckBtn) return;

    const btnText = visaCheckBtn.querySelector('.btn-text');
    const btnLoading = visaCheckBtn.querySelector('.btn-loading');

    visaCheckBtn.disabled = loading;
    if (btnText) btnText.style.display = loading ? 'none' : '';
    if (btnLoading) btnLoading.style.display = loading ? 'flex' : 'none';
}

function showLoadingSkeleton() {
    if (!visaResults) return;

    visaResults.style.display = 'block';
    visaResults.innerHTML = `
        <div class="result-skeleton">
            <div class="skeleton skeleton-header"></div>
            <div class="skeleton skeleton-route"></div>
            <div class="skeleton skeleton-program"></div>
            <div class="skeleton skeleton-program"></div>
            <div class="skeleton skeleton-btn"></div>
        </div>
    `;
}

function displayResults(data) {
    if (!visaResults) return;

    visaResults.style.display = 'block';

    if (!data.success) {
        showError(data.error || 'Unable to retrieve visa information.');
        return;
    }

    const { visaRequired, programs, checkoutURL, stayDuration } = data;

    const passportFlag = state.passportCountry.flag;
    const passportName = state.passportCountry.name;
    const destFlag = state.destination.flag;
    const destName = state.destination.name;

    if (visaRequired) {
        // Visa required
        visaResults.innerHTML = `
            <div class="result-card visa-required">
                <div class="result-header">
                    <span class="result-icon">⚠️</span>
                    <span class="result-title">Visa Required</span>
                </div>

                <div class="result-route">
                    <span class="country-flag">${passportFlag}</span>
                    <span>${passportName}</span>
                    <span class="route-arrow">→</span>
                    <span class="country-flag">${destFlag}</span>
                    <span>${destName}</span>
                </div>

                ${programs && programs.length > 0 ? `
                    <div class="visa-programs">
                        ${programs.map(program => `
                            <div class="visa-program-card">
                                <div class="program-info">
                                    <h4>${program.name || 'Tourist Visa'}</h4>
                                    <div class="program-details">
                                        ${program.processingTime ? `<span>📅 ${program.processingTime}</span>` : ''}
                                        ${program.validity ? `<span>⏱️ ${program.validity}</span>` : ''}
                                    </div>
                                </div>
                                ${program.price ? `<span class="program-price">From $${program.price}</span>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                ${checkoutURL ? `
                    <a href="${checkoutURL}" target="_blank" rel="noopener noreferrer" class="apply-btn">
                        Apply for Visa →
                    </a>
                ` : ''}

                <div class="sandbox-disclaimer">
                    <span>🧪</span>
                    <span>Sandbox Mode - This is test data only</span>
                </div>
            </div>
        `;
    } else {
        // Visa free
        visaResults.innerHTML = `
            <div class="result-card visa-free">
                <div class="result-header">
                    <span class="result-icon">✅</span>
                    <span class="result-title">No Visa Required!</span>
                </div>

                <div class="result-route">
                    <span class="country-flag">${passportFlag}</span>
                    <span>${passportName}</span>
                    <span class="route-arrow">→</span>
                    <span class="country-flag">${destFlag}</span>
                    <span>${destName}</span>
                </div>

                <p class="result-description">
                    ${stayDuration
                        ? `You can visit visa-free for up to ${stayDuration}.`
                        : 'You can visit without a visa. Check entry requirements for specific stay duration.'}
                </p>

                <div class="sandbox-disclaimer">
                    <span>🧪</span>
                    <span>Sandbox Mode - This is test data only</span>
                </div>
            </div>
        `;
    }
}

function showError(message) {
    if (!visaResults) return;

    visaResults.style.display = 'block';
    visaResults.innerHTML = `
        <div class="result-error">
            <div class="error-icon">❌</div>
            <h3>Something went wrong</h3>
            <p>${message}</p>
        </div>
    `;
}

// FAQ Accordion
function setupFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question?.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}
