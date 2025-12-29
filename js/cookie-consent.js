/**
 * Cookie Consent Manager
 * GDPR/CCPA compliant cookie consent banner
 */

(function() {
    'use strict';

    const CONSENT_KEY = 'cookie_consent';
    const CONSENT_EXPIRY = 365; // days

    // Check if user has Do Not Track enabled
    function isDNTEnabled() {
        return navigator.doNotTrack === '1' ||
               navigator.doNotTrack === 'yes' ||
               navigator.msDoNotTrack === '1' ||
               window.doNotTrack === '1';
    }

    // Get consent status from localStorage
    function getConsentStatus() {
        const consent = localStorage.getItem(CONSENT_KEY);
        if (!consent) return null;

        try {
            const data = JSON.parse(consent);
            const now = new Date().getTime();

            // Check if consent has expired
            if (data.expiry && now > data.expiry) {
                localStorage.removeItem(CONSENT_KEY);
                return null;
            }

            return data.analytics;
        } catch (e) {
            return null;
        }
    }

    // Save consent status
    function saveConsentStatus(analyticsConsent) {
        const now = new Date().getTime();
        const expiry = now + (CONSENT_EXPIRY * 24 * 60 * 60 * 1000);

        const consent = {
            analytics: analyticsConsent,
            timestamp: now,
            expiry: expiry
        };

        localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    }

    // Initialize Google Analytics
    function initGoogleAnalytics() {
        // Check if gtag is already loaded
        if (typeof gtag === 'function') {
            console.log('[Cookie Consent] Google Analytics already initialized');
            return;
        }

        // Load Google Analytics script
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-X9D9LXQY9Y';
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
            window.dataLayer.push(arguments);
        };
        gtag('js', new Date());
        gtag('config', 'G-X9D9LXQY9Y', {
            'anonymize_ip': true,
            'cookie_flags': 'SameSite=None;Secure'
        });

        console.log('[Cookie Consent] Google Analytics initialized');
    }

    // Disable Google Analytics
    function disableGoogleAnalytics() {
        // Set GA opt-out property
        window['ga-disable-G-X9D9LXQY9Y'] = true;

        // Delete GA cookies
        const gaCookies = ['_ga', '_gid', '_gat', '_ga_X9D9LXQY9Y'];
        gaCookies.forEach(cookieName => {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });

        console.log('[Cookie Consent] Google Analytics disabled');
    }

    // Create and show cookie banner
    function showCookieBanner() {
        // Check if banner already exists
        if (document.getElementById('cookie-consent-banner')) {
            return;
        }

        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-consent-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-live', 'polite');
        banner.setAttribute('aria-label', 'Cookie consent banner');

        banner.innerHTML = `
            <div class="cookie-consent-content">
                <div class="cookie-consent-text">
                    <h3>🍪 We value your privacy</h3>
                    <p>
                        We use cookies to enhance your browsing experience and analyze our traffic.
                        By clicking "Accept", you consent to our use of cookies for analytics purposes.
                        <a href="privacy.html" class="cookie-policy-link">Learn more</a>
                    </p>
                </div>
                <div class="cookie-consent-buttons">
                    <button id="cookie-decline" class="cookie-btn cookie-btn-decline">
                        Decline
                    </button>
                    <button id="cookie-accept" class="cookie-btn cookie-btn-accept">
                        Accept
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        // Add event listeners
        document.getElementById('cookie-accept').addEventListener('click', function() {
            acceptCookies();
        });

        document.getElementById('cookie-decline').addEventListener('click', function() {
            declineCookies();
        });

        // Animate banner in
        setTimeout(() => {
            banner.classList.add('show');
        }, 100);
    }

    // Hide cookie banner
    function hideCookieBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
    }

    // Accept cookies
    function acceptCookies() {
        saveConsentStatus(true);
        hideCookieBanner();
        initGoogleAnalytics();
    }

    // Decline cookies
    function declineCookies() {
        saveConsentStatus(false);
        hideCookieBanner();
        disableGoogleAnalytics();
    }

    // Initialize on page load
    function init() {
        // Respect Do Not Track
        if (isDNTEnabled()) {
            console.log('[Cookie Consent] Do Not Track enabled - analytics disabled');
            disableGoogleAnalytics();
            return;
        }

        // Check existing consent
        const consent = getConsentStatus();

        if (consent === null) {
            // No consent recorded - show banner
            showCookieBanner();
        } else if (consent === true) {
            // User has consented - initialize analytics
            initGoogleAnalytics();
        } else {
            // User has declined - disable analytics
            disableGoogleAnalytics();
        }
    }

    // Expose global function to manage consent
    window.CookieConsent = {
        accept: acceptCookies,
        decline: declineCookies,
        getStatus: getConsentStatus,
        revoke: function() {
            localStorage.removeItem(CONSENT_KEY);
            disableGoogleAnalytics();
            showCookieBanner();
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
