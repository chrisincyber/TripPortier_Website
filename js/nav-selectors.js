/**
 * TripPortier Nav Selectors
 * Shared currency/language selector rendering + localStorage sync
 * Includes currency conversion with approximate exchange rates
 */

const NavSelectors = {
  // Currency data with symbols and approximate exchange rates from USD
  currencies: [
    { code: 'USD', symbol: '$', label: 'USD', rate: 1 },
    { code: 'EUR', symbol: '\u20AC', label: 'EUR', rate: 0.92 },
    { code: 'GBP', symbol: '\u00A3', label: 'GBP', rate: 0.79 },
    { code: 'CHF', symbol: 'CHF', label: 'CHF', rate: 0.88 },
    { code: 'JPY', symbol: '\u00A5', label: 'JPY', rate: 149.5, decimals: 0 },
    { code: 'CNY', symbol: '\u00A5', label: 'CNY', rate: 7.25 },
    { code: 'KRW', symbol: '\u20A9', label: 'KRW', rate: 1320, decimals: 0 },
    { code: 'AUD', symbol: 'A$', label: 'AUD', rate: 1.53 },
    { code: 'CAD', symbol: 'C$', label: 'CAD', rate: 1.36 },
    { code: 'NZD', symbol: 'NZ$', label: 'NZD', rate: 1.67 },
    { code: 'SGD', symbol: 'S$', label: 'SGD', rate: 1.34 },
    { code: 'HKD', symbol: 'HK$', label: 'HKD', rate: 7.82 },
    { code: 'SEK', symbol: 'kr', label: 'SEK', rate: 10.45 },
    { code: 'NOK', symbol: 'kr', label: 'NOK', rate: 10.65 },
    { code: 'DKK', symbol: 'kr', label: 'DKK', rate: 6.88 },
    { code: 'PLN', symbol: 'z\u0142', label: 'PLN', rate: 4.02 },
    { code: 'CZK', symbol: 'K\u010D', label: 'CZK', rate: 23.5, decimals: 0 },
    { code: 'THB', symbol: '\u0E3F', label: 'THB', rate: 34.5, decimals: 0 },
    { code: 'MYR', symbol: 'RM', label: 'MYR', rate: 4.42 },
    { code: 'INR', symbol: '\u20B9', label: 'INR', rate: 83.5, decimals: 0 },
    { code: 'BRL', symbol: 'R$', label: 'BRL', rate: 4.95 },
    { code: 'MXN', symbol: 'MX$', label: 'MXN', rate: 17.15 },
    { code: 'AED', symbol: 'AED', label: 'AED', rate: 3.67 },
    { code: 'SAR', symbol: 'SAR', label: 'SAR', rate: 3.75 },
    { code: 'TRY', symbol: '\u20BA', label: 'TRY', rate: 30.5, decimals: 0 },
    { code: 'ZAR', symbol: 'R', label: 'ZAR', rate: 18.6 },
    { code: 'ILS', symbol: '\u20AA', label: 'ILS', rate: 3.65 },
    { code: 'TWD', symbol: 'NT$', label: 'TWD', rate: 31.5, decimals: 0 },
    { code: 'PHP', symbol: '\u20B1', label: 'PHP', rate: 55.8, decimals: 0 },
    { code: 'IDR', symbol: 'Rp', label: 'IDR', rate: 15600, decimals: 0 },
    { code: 'VND', symbol: '\u20AB', label: 'VND', rate: 24500, decimals: 0 }
  ],

  // Language data — only English for now
  languages: [
    { code: 'en', flag: '🇬🇧', label: 'English' }
  ],

  /**
   * Format a USD price in the user's selected currency
   * @param {number} usdAmount - Price in USD
   * @returns {string} Formatted price string (e.g. "€11.04", "¥1,794")
   */
  formatPrice: function(usdAmount) {
    var curr = this._getCurrencyData(this.getCurrency());
    var converted = usdAmount * curr.rate;
    var decimals = curr.decimals !== undefined ? curr.decimals : 2;
    var formatted = converted.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return curr.symbol + formatted;
  },

  // Initialize selectors when DOM is ready
  init: function() {
    // Migrate old localStorage keys
    this._migrateKeys();

    // Get current values
    var currentCurrency = this.getCurrency();
    var currentLang = this.getLanguage();

    // Render desktop dropdowns
    this._renderCurrencyDropdown(currentCurrency);
    this._renderLanguageDropdown(currentLang);

    // Update button labels
    this._updateCurrencyButton(currentCurrency);
    this._updateLanguageButton(currentLang);

    // Render mobile selects
    this._renderMobileSelects(currentCurrency, currentLang);

    // Also sync footer currency select if present
    this._syncFooterCurrency(currentCurrency);

    // Setup click-outside handlers
    this._setupClickOutside();
  },

  // Get current currency from localStorage or detect
  getCurrency: function() {
    return localStorage.getItem('tripportier-currency') ||
           (typeof TripPortierLocale !== 'undefined' ? TripPortierLocale.detectCurrency() : 'USD');
  },

  // Get current language from localStorage or detect
  getLanguage: function() {
    return localStorage.getItem('tripportier-lang') ||
           (typeof TripPortierLocale !== 'undefined' ? TripPortierLocale.detectLanguage() : 'en');
  },

  // Set currency and dispatch event
  setCurrency: function(code) {
    localStorage.setItem('tripportier-currency', code);

    // Update UI
    this._updateCurrencyButton(code);
    this._closeCurrencyDropdown();

    // Sync footer select
    this._syncFooterCurrency(code);

    // Sync mobile select
    var mobileSelect = document.getElementById('mobileCurrencySelect');
    if (mobileSelect) mobileSelect.value = code;

    // Dispatch event for pages to update prices
    window.dispatchEvent(new CustomEvent('currencyChanged', {
      detail: { currency: code }
    }));

    // Also call global changeCurrency if available (for backward compat)
    if (typeof changeCurrency === 'function') {
      changeCurrency(code);
    }

    // Force reload to apply new currency across the page
    window.location.reload();
  },

  // Set language and dispatch event
  setLanguage: function(code) {
    localStorage.setItem('tripportier-lang', code);

    // Update UI
    this._updateLanguageButton(code);
    this._closeLanguageDropdown();

    // Sync mobile select
    var mobileSelect = document.getElementById('mobileLanguageSelect');
    if (mobileSelect) mobileSelect.value = code;

    // Dispatch custom event for esim.html translation system etc.
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: code }
    }));

    // Also call global changeLanguage if available
    if (typeof changeLanguage === 'function') {
      changeLanguage(code);
    }
  },

  // Toggle currency dropdown
  toggleCurrency: function() {
    var dropdown = document.getElementById('currencyDropdown');
    var langDropdown = document.getElementById('languageDropdown');
    if (langDropdown) langDropdown.classList.remove('show');
    if (dropdown) dropdown.classList.toggle('show');
  },

  // Toggle language dropdown
  toggleLanguage: function() {
    var dropdown = document.getElementById('languageDropdown');
    var currDropdown = document.getElementById('currencyDropdown');
    if (currDropdown) currDropdown.classList.remove('show');
    if (dropdown) dropdown.classList.toggle('show');
  },

  // --- Private methods ---

  _getCurrencyData: function(code) {
    for (var i = 0; i < this.currencies.length; i++) {
      if (this.currencies[i].code === code) return this.currencies[i];
    }
    return this.currencies[0]; // fallback to USD
  },

  _migrateKeys: function() {
    var oldCurrency = localStorage.getItem('preferredCurrency');
    if (oldCurrency && !localStorage.getItem('tripportier-currency')) {
      localStorage.setItem('tripportier-currency', oldCurrency);
    }
    var oldLang = localStorage.getItem('esimLanguage');
    if (oldLang && !localStorage.getItem('tripportier-lang')) {
      localStorage.setItem('tripportier-lang', oldLang);
    }
  },

  _renderCurrencyDropdown: function(currentCode) {
    var dropdown = document.getElementById('currencyDropdown');
    if (!dropdown) return;

    var html = '';
    for (var i = 0; i < this.currencies.length; i++) {
      var c = this.currencies[i];
      var active = c.code === currentCode ? ' active' : '';
      html += '<div class="nav-selector-option' + active + '" onclick="NavSelectors.setCurrency(\'' + c.code + '\')">' +
              '<span class="selector-option-symbol">' + c.symbol + '</span>' +
              '<span>' + c.label + '</span>' +
              '</div>';
    }
    dropdown.innerHTML = html;
  },

  _renderLanguageDropdown: function(currentCode) {
    var dropdown = document.getElementById('languageDropdown');
    if (!dropdown) return;

    var html = '';
    // English option
    var l = this.languages[0];
    var active = currentCode === 'en' ? ' active' : '';
    html += '<div class="nav-selector-option' + active + '" onclick="NavSelectors.setLanguage(\'' + l.code + '\')">' +
            '<span class="selector-option-flag">' + l.flag + '</span>' +
            '<span>' + l.label + '</span>' +
            '</div>';
    // "More coming soon" hint
    html += '<div class="nav-selector-hint">More languages coming soon</div>';

    dropdown.innerHTML = html;
  },

  _updateCurrencyButton: function(code) {
    var symbolEl = document.getElementById('currencySymbol');
    var labelEl = document.getElementById('currencyLabel');
    if (!symbolEl || !labelEl) return;

    var curr = this._getCurrencyData(code);
    symbolEl.textContent = curr.symbol;
    labelEl.textContent = curr.label;

    // Update dropdown active state
    var dropdown = document.getElementById('currencyDropdown');
    if (dropdown) {
      var options = dropdown.querySelectorAll('.nav-selector-option');
      for (var j = 0; j < options.length; j++) {
        options[j].classList.toggle('active', options[j].textContent.trim().indexOf(code) !== -1);
      }
    }
  },

  _updateLanguageButton: function(code) {
    var flagEl = document.getElementById('languageFlag');
    var labelEl = document.getElementById('languageLabel');
    if (!flagEl || !labelEl) return;

    // Only English for now
    flagEl.textContent = '🇬🇧';
    labelEl.textContent = 'EN';
  },

  _renderMobileSelects: function(currentCurrency, currentLang) {
    // Currency mobile select
    var mobileCurrency = document.getElementById('mobileCurrencySelect');
    if (mobileCurrency) {
      var currHtml = '';
      for (var i = 0; i < this.currencies.length; i++) {
        var c = this.currencies[i];
        var selected = c.code === currentCurrency ? ' selected' : '';
        currHtml += '<option value="' + c.code + '"' + selected + '>' + c.symbol + ' ' + c.label + '</option>';
      }
      mobileCurrency.innerHTML = currHtml;
    }

    // Language mobile select — only English
    var mobileLang = document.getElementById('mobileLanguageSelect');
    if (mobileLang) {
      mobileLang.innerHTML = '<option value="en" selected>🇬🇧 English</option>';
      mobileLang.disabled = true;
      mobileLang.style.opacity = '0.6';
    }
  },

  _syncFooterCurrency: function(code) {
    var footerSelect = document.getElementById('currency-select');
    if (footerSelect) footerSelect.value = code;
  },

  _closeCurrencyDropdown: function() {
    var dropdown = document.getElementById('currencyDropdown');
    if (dropdown) dropdown.classList.remove('show');
  },

  _closeLanguageDropdown: function() {
    var dropdown = document.getElementById('languageDropdown');
    if (dropdown) dropdown.classList.remove('show');
  },

  _setupClickOutside: function() {
    document.addEventListener('click', function(e) {
      if (!e.target.closest('#navCurrencySelector')) {
        var currDropdown = document.getElementById('currencyDropdown');
        if (currDropdown) currDropdown.classList.remove('show');
      }
      if (!e.target.closest('#navLanguageSelector')) {
        var langDropdown = document.getElementById('languageDropdown');
        if (langDropdown) langDropdown.classList.remove('show');
      }
    });
  }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() { NavSelectors.init(); });
} else {
  NavSelectors.init();
}
