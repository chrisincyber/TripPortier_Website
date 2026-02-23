// TripPortier Website JavaScript

// Theme initialization - always use light mode
(function() {
    document.documentElement.setAttribute('data-theme', 'light');
})();

// Mobile Menu Toggle — supports both new mobile-nav-panel and old nav-links
function toggleMenu() {
    // New two-row navbar mobile panel
    const mobilePanel = document.getElementById('mobileNavPanel');
    if (mobilePanel) {
        mobilePanel.classList.toggle('active');
        return;
    }
    // Fallback: old nav-links
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
        if (!navLinks.classList.contains('active')) {
            document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    }
}

// Mobile Dropdown Toggle (old navbar compat)
function toggleMobileDropdown(element, event) {
    if (window.innerWidth <= 768) {
        event.preventDefault();
        const dropdown = element.closest('.nav-dropdown');
        dropdown.classList.toggle('active');
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    // New mobile panel
    const mobilePanel = document.getElementById('mobileNavPanel');
    const mobileToggle = document.querySelector('.nav-mobile-toggle');
    if (mobilePanel && mobilePanel.classList.contains('active') &&
        !mobilePanel.contains(e.target) &&
        (!mobileToggle || !mobileToggle.contains(e.target))) {
        mobilePanel.classList.remove('active');
    }
    // Old nav-links
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    if (navLinks && navLinks.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
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

// Navbar scroll effect — centralized .scrolled class for all navbar-transparent pages
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    const currentScroll = window.pageYOffset;

    // Toggle .scrolled class for transparent navbar pages
    if (navbar.classList.contains('navbar-transparent')) {
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Box-shadow effect for all navbars
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '';
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

// ============================================
// Scroll Animation System (Intersection Observer)
// ============================================

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
    // Create Intersection Observer for scroll animations
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after animation (better performance)
                // scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements with animation classes
    document.addEventListener('DOMContentLoaded', () => {
        const animatedElements = document.querySelectorAll(
            '.animate-on-scroll, .animate-fade-in, .animate-slide-up, .animate-slide-left, .animate-slide-right, .animate-scale, ' +
            '.feature-card-new, .feature-card, .booking-card, .testimonial-card, ' +
            '.section-header, .features-compact-header'
        );

        animatedElements.forEach(el => {
            scrollObserver.observe(el);
        });
    });

    // Also observe dynamically added elements (for SPAs)
    const observeNewElements = () => {
        const animatedElements = document.querySelectorAll(
            '.animate-on-scroll:not(.observed), .animate-fade-in:not(.observed), .animate-slide-up:not(.observed), ' +
            '.animate-slide-left:not(.observed), .animate-slide-right:not(.observed), .animate-scale:not(.observed), ' +
            '.feature-card-new:not(.observed), .feature-card:not(.observed), .booking-card:not(.observed), ' +
            '.testimonial-card:not(.observed), .section-header:not(.observed), .features-compact-header:not(.observed)'
        );

        animatedElements.forEach(el => {
            el.classList.add('observed');
            scrollObserver.observe(el);
        });
    };

    // Run on page load and expose for manual calls
    document.addEventListener('DOMContentLoaded', observeNewElements);
    window.TripPortierAnimations = { observeNewElements };
} else {
    // If reduced motion is preferred, make all elements visible immediately
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll(
            '.animate-on-scroll, .animate-fade-in, .animate-slide-up, .animate-slide-left, .animate-slide-right, .animate-scale, ' +
            '.feature-card-new, .feature-card, .booking-card, .testimonial-card, ' +
            '.section-header, .features-compact-header'
        ).forEach(el => {
            el.classList.add('visible');
        });
    });
}

// ============================================
// Trustpilot Review Nudge (slide-in card)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Skip on esim-success page (already has a dedicated Trustpilot card)
    if (window.location.pathname.includes('esim-success')) return;

    // Skip if already dismissed this session
    if (sessionStorage.getItem('trustpilot_nudge_dismissed')) return;

    setTimeout(function() {
        var nudge = document.createElement('div');
        nudge.className = 'trustpilot-nudge';
        nudge.innerHTML =
            '<div class="trustpilot-nudge-icon">' +
                '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' +
            '</div>' +
            '<div class="trustpilot-nudge-body">' +
                '<a href="https://www.trustpilot.com/review/tripportier.com" target="_blank" rel="noopener">Check out our reviews on Trustpilot</a>' +
                '<div class="trustpilot-nudge-sub">See what travelers say about us</div>' +
            '</div>' +
            '<button class="trustpilot-nudge-dismiss" aria-label="Dismiss">&times;</button>';

        document.body.appendChild(nudge);

        // Trigger slide-in on next frame
        requestAnimationFrame(function() {
            nudge.classList.add('show');
        });

        // Dismiss handler
        nudge.querySelector('.trustpilot-nudge-dismiss').addEventListener('click', function() {
            nudge.classList.remove('show');
            sessionStorage.setItem('trustpilot_nudge_dismissed', '1');
            nudge.addEventListener('transitionend', function() {
                nudge.remove();
            }, { once: true });
        });
    }, 8000);
});
