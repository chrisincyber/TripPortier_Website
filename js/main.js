// TripPortier Website JavaScript

// Theme initialization - apply saved theme on page load
(function() {
    const savedTheme = localStorage.getItem('theme') || 'system';

    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        // System preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }

    // Listen for system theme changes
    if (savedTheme === 'system' && window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (localStorage.getItem('theme') === 'system') {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }
})();

// Mobile Menu Toggle
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');

    // Close all dropdowns when menu closes
    if (!navLinks.classList.contains('active')) {
        document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
}

// Mobile Dropdown Toggle
function toggleMobileDropdown(element, event) {
    // Only toggle on mobile
    if (window.innerWidth <= 768) {
        event.preventDefault();
        const dropdown = element.closest('.nav-dropdown');
        dropdown.classList.toggle('active');
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (navLinks && navLinks.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        !mobileMenu.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// FAQ Accordion
function toggleFaq(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');

    // Close all other FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // Toggle current FAQ
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Feature Request Voting
function upvote(featureId) {
    const voteCountEl = document.getElementById(`votes-${featureId}`);
    if (!voteCountEl) return;

    // Check if already voted (using localStorage)
    const votedFeatures = JSON.parse(localStorage.getItem('votedFeatures') || '[]');

    if (votedFeatures.includes(featureId)) {
        // Already voted - remove vote
        const index = votedFeatures.indexOf(featureId);
        votedFeatures.splice(index, 1);
        voteCountEl.textContent = parseInt(voteCountEl.textContent) - 1;

        // Reset button style
        const btn = voteCountEl.previousElementSibling;
        btn.style.background = '';
        btn.style.color = '';
    } else {
        // Add vote
        votedFeatures.push(featureId);
        voteCountEl.textContent = parseInt(voteCountEl.textContent) + 1;

        // Highlight button
        const btn = voteCountEl.previousElementSibling;
        btn.style.background = 'var(--primary)';
        btn.style.color = 'white';
    }

    localStorage.setItem('votedFeatures', JSON.stringify(votedFeatures));
}

// Initialize voted features on page load
document.addEventListener('DOMContentLoaded', () => {
    const votedFeatures = JSON.parse(localStorage.getItem('votedFeatures') || '[]');

    votedFeatures.forEach(featureId => {
        const voteCountEl = document.getElementById(`votes-${featureId}`);
        if (voteCountEl) {
            const btn = voteCountEl.previousElementSibling;
            if (btn) {
                btn.style.background = 'var(--primary)';
                btn.style.color = 'white';
            }
        }
    });
});

// Feature Request Form Submission
function submitFeature(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const featureRequest = {
        title: formData.get('title'),
        category: formData.get('category'),
        description: formData.get('description'),
        email: formData.get('email'),
        timestamp: new Date().toISOString()
    };

    // Store locally (in a real app, this would send to a backend)
    const requests = JSON.parse(localStorage.getItem('featureRequests') || '[]');
    requests.push(featureRequest);
    localStorage.setItem('featureRequests', JSON.stringify(requests));

    // Show success message
    document.getElementById('formSuccess').style.display = 'block';
    form.reset();

    // Hide success message after 5 seconds
    setTimeout(() => {
        document.getElementById('formSuccess').style.display = 'none';
    }, 5000);

    // In production, you would send this to your backend:
    // sendToBackend(featureRequest);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// Console welcome message
console.log('%cTripPortier', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%cTravel Smarter, Pack Better', 'font-size: 14px; color: #64748b;');
console.log('Interested in working with us? Contact us at info@tripportier.com');

// Currency and Language Detection & Selection
const TripPortierLocale = {
    // Map of locale codes to currencies
    localeToCurrency: {
        'en-US': 'USD', 'en-GB': 'GBP', 'en-AU': 'AUD', 'en-CA': 'CAD', 'en-NZ': 'NZD',
        'en-SG': 'SGD', 'en-HK': 'HKD', 'en-ZA': 'ZAR', 'en-IN': 'INR', 'en-PH': 'PHP',
        'de': 'EUR', 'de-DE': 'EUR', 'de-AT': 'EUR', 'de-CH': 'CHF',
        'fr': 'EUR', 'fr-FR': 'EUR', 'fr-CA': 'CAD', 'fr-CH': 'CHF',
        'es': 'EUR', 'es-ES': 'EUR', 'es-MX': 'MXN',
        'it': 'EUR', 'it-IT': 'EUR', 'it-CH': 'CHF',
        'nl': 'EUR', 'nl-NL': 'EUR',
        'pt': 'EUR', 'pt-PT': 'EUR', 'pt-BR': 'BRL',
        'ja': 'JPY', 'ja-JP': 'JPY',
        'ko': 'KRW', 'ko-KR': 'KRW',
        'zh': 'CNY', 'zh-CN': 'CNY', 'zh-Hans': 'CNY', 'zh-TW': 'TWD', 'zh-Hant': 'TWD', 'zh-HK': 'HKD',
        'ar': 'AED', 'ar-AE': 'AED', 'ar-SA': 'SAR',
        'sv': 'SEK', 'sv-SE': 'SEK',
        'da': 'DKK', 'da-DK': 'DKK',
        'nb': 'NOK', 'nb-NO': 'NOK', 'no': 'NOK',
        'fi': 'EUR', 'fi-FI': 'EUR',
        'th': 'THB', 'th-TH': 'THB',
        'tr': 'TRY', 'tr-TR': 'TRY',
        'pl': 'PLN', 'pl-PL': 'PLN',
        'cs': 'CZK', 'cs-CZ': 'CZK',
        'ms': 'MYR', 'ms-MY': 'MYR',
        'id': 'IDR', 'id-ID': 'IDR',
        'vi': 'VND', 'vi-VN': 'VND',
        'he': 'ILS', 'he-IL': 'ILS'
    },

    // Detect currency from browser locale
    detectCurrency: function() {
        const savedCurrency = localStorage.getItem('tripportier-currency');
        if (savedCurrency) return savedCurrency;

        const locale = navigator.language || navigator.userLanguage || 'en-US';

        // Try exact match first
        if (this.localeToCurrency[locale]) {
            return this.localeToCurrency[locale];
        }

        // Try language code only
        const langCode = locale.split('-')[0];
        if (this.localeToCurrency[langCode]) {
            return this.localeToCurrency[langCode];
        }

        return 'USD'; // Default
    },

    // Detect language from browser
    detectLanguage: function() {
        const savedLang = localStorage.getItem('tripportier-lang');
        if (savedLang) return savedLang;

        const supportedLangs = ['en', 'de', 'fr', 'es', 'it', 'nl', 'pt-BR', 'ja', 'ko', 'zh-Hans', 'zh-Hant', 'ar', 'sv', 'da', 'nb', 'fi', 'th', 'tr'];
        const locale = navigator.language || navigator.userLanguage || 'en';

        // Try exact match
        if (supportedLangs.includes(locale)) {
            return locale;
        }

        // Try language code only
        const langCode = locale.split('-')[0];

        // Handle Chinese variants
        if (langCode === 'zh') {
            if (locale.includes('TW') || locale.includes('HK') || locale.includes('Hant')) {
                return 'zh-Hant';
            }
            return 'zh-Hans';
        }

        // Handle Portuguese
        if (langCode === 'pt') {
            return locale.includes('BR') ? 'pt-BR' : 'pt-BR'; // Default to BR for now
        }

        // Handle Norwegian
        if (langCode === 'no' || langCode === 'nn') {
            return 'nb';
        }

        if (supportedLangs.includes(langCode)) {
            return langCode;
        }

        return 'en'; // Default
    },

    // Initialize selectors on page load
    init: function() {
        const languageSelect = document.getElementById('language-select');
        const currencySelect = document.getElementById('currency-select');

        if (languageSelect) {
            const detectedLang = this.detectLanguage();
            languageSelect.value = detectedLang;
        }

        if (currencySelect) {
            const detectedCurrency = this.detectCurrency();
            currencySelect.value = detectedCurrency;
        }
    }
};

// Language change handler
function changeLanguage(langCode) {
    localStorage.setItem('tripportier-lang', langCode);

    // Check if we're on a language-specific page or root
    const currentPath = window.location.pathname;
    const supportedLangs = ['en', 'de', 'fr', 'es', 'it', 'nl', 'pt-BR', 'ja', 'ko', 'zh-Hans', 'zh-Hant', 'ar', 'sv', 'da', 'nb', 'fi', 'th', 'tr'];

    // Extract current language from path if exists
    const pathParts = currentPath.split('/').filter(p => p);
    const currentLang = pathParts.length > 0 && supportedLangs.includes(pathParts[0]) ? pathParts[0] : null;

    if (currentLang) {
        // Replace language in path
        const newPath = '/' + langCode + '/' + pathParts.slice(1).join('/');
        window.location.href = newPath;
    } else {
        // Redirect to language-specific root
        window.location.href = '/' + langCode + '/';
    }
}

// Currency change handler
function changeCurrency(currencyCode) {
    localStorage.setItem('tripportier-currency', currencyCode);

    // Dispatch event for any components that need to update prices
    window.dispatchEvent(new CustomEvent('currencyChanged', {
        detail: { currency: currencyCode }
    }));

    // Reload page to update prices (in production, this would update via API)
    // For now, just save the preference
    console.log('Currency changed to:', currencyCode);
}

// Get current currency
function getCurrentCurrency() {
    return localStorage.getItem('tripportier-currency') || TripPortierLocale.detectCurrency();
}

// Get current language
function getCurrentLanguage() {
    return localStorage.getItem('tripportier-lang') || TripPortierLocale.detectLanguage();
}

// Initialize locale settings on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    TripPortierLocale.init();
});
