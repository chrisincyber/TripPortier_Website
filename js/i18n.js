/**
 * TripPortier Internationalization (i18n) Module
 * Handles language detection, redirection, and switching
 */

const TripPortierI18n = (function() {
    // Supported languages (must match translations.json)
    const SUPPORTED_LANGUAGES = [
        'en', 'de', 'fr', 'es', 'it', 'nl', 'pt-BR',
        'ja', 'ko', 'zh-Hans', 'zh-Hant', 'ar',
        'sv', 'da', 'nb', 'fi', 'th', 'tr'
    ];

    // Default language
    const DEFAULT_LANGUAGE = 'en';

    // localStorage key for language preference
    const STORAGE_KEY = 'tripportier_lang';

    /**
     * Get the current language from URL path
     * e.g., /de/index.html -> 'de'
     */
    function getCurrentLanguageFromPath() {
        const path = window.location.pathname;
        const match = path.match(/^\/([a-z]{2}(?:-[A-Za-z]+)?)\//);
        if (match && SUPPORTED_LANGUAGES.includes(match[1])) {
            return match[1];
        }
        return null;
    }

    /**
     * Get saved language preference from localStorage
     */
    function getSavedLanguage() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    /**
     * Save language preference to localStorage
     */
    function saveLanguage(lang) {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {
            // localStorage not available
        }
    }

    /**
     * Detect browser language and map to supported language
     */
    function detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage || '';

        // Direct match (e.g., 'de' or 'pt-BR')
        if (SUPPORTED_LANGUAGES.includes(browserLang)) {
            return browserLang;
        }

        // Handle Chinese variants
        if (browserLang.startsWith('zh')) {
            if (browserLang.includes('TW') || browserLang.includes('HK') || browserLang.includes('Hant')) {
                return 'zh-Hant';
            }
            return 'zh-Hans';
        }

        // Handle Portuguese variants
        if (browserLang.startsWith('pt')) {
            return 'pt-BR';
        }

        // Handle Norwegian variants
        if (browserLang.startsWith('no') || browserLang.startsWith('nn')) {
            return 'nb';
        }

        // Get base language (e.g., 'de-AT' -> 'de')
        const baseLang = browserLang.split('-')[0];
        if (SUPPORTED_LANGUAGES.includes(baseLang)) {
            return baseLang;
        }

        return DEFAULT_LANGUAGE;
    }

    /**
     * Get the best language for the user
     * Priority: 1. URL path, 2. Saved preference, 3. Browser language, 4. Default
     */
    function getBestLanguage() {
        // Check URL first
        const urlLang = getCurrentLanguageFromPath();
        if (urlLang) {
            saveLanguage(urlLang); // Update preference
            return urlLang;
        }

        // Check saved preference
        const savedLang = getSavedLanguage();
        if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang)) {
            return savedLang;
        }

        // Detect from browser
        return detectBrowserLanguage();
    }

    /**
     * Redirect to the appropriate language version
     * Only runs on root pages (not already in a language subdirectory)
     */
    function redirectToLanguage() {
        const currentLang = getCurrentLanguageFromPath();

        // Already in a language subdirectory, don't redirect
        if (currentLang) {
            return;
        }

        const bestLang = getBestLanguage();
        const currentPath = window.location.pathname;

        // Build new URL
        let newPath;
        if (currentPath === '/' || currentPath === '/index.html') {
            newPath = '/' + bestLang + '/';
        } else {
            // For other pages like /faq.html -> /de/faq.html
            newPath = '/' + bestLang + currentPath;
        }

        // Redirect
        window.location.replace(newPath);
    }

    /**
     * Switch to a different language
     * @param {string} lang - Language code to switch to
     */
    function switchLanguage(lang) {
        if (!SUPPORTED_LANGUAGES.includes(lang)) {
            console.error('Unsupported language:', lang);
            return;
        }

        saveLanguage(lang);

        const currentLang = getCurrentLanguageFromPath();
        let currentPath = window.location.pathname;

        if (currentLang) {
            // Replace current language in path
            currentPath = currentPath.replace('/' + currentLang + '/', '/' + lang + '/');
        } else {
            // Add language to path
            if (currentPath === '/' || currentPath === '/index.html') {
                currentPath = '/' + lang + '/';
            } else {
                currentPath = '/' + lang + currentPath;
            }
        }

        window.location.href = currentPath;
    }

    /**
     * Get language display info
     */
    function getLanguageInfo(lang) {
        const info = {
            'en': { name: 'English', native: 'English', flag: '🇬🇧' },
            'de': { name: 'German', native: 'Deutsch', flag: '🇩🇪' },
            'fr': { name: 'French', native: 'Français', flag: '🇫🇷' },
            'es': { name: 'Spanish', native: 'Español', flag: '🇪🇸' },
            'it': { name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
            'nl': { name: 'Dutch', native: 'Nederlands', flag: '🇳🇱' },
            'pt-BR': { name: 'Portuguese', native: 'Português', flag: '🇧🇷' },
            'ja': { name: 'Japanese', native: '日本語', flag: '🇯🇵' },
            'ko': { name: 'Korean', native: '한국어', flag: '🇰🇷' },
            'zh-Hans': { name: 'Chinese (Simplified)', native: '简体中文', flag: '🇨🇳' },
            'zh-Hant': { name: 'Chinese (Traditional)', native: '繁體中文', flag: '🇹🇼' },
            'ar': { name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
            'sv': { name: 'Swedish', native: 'Svenska', flag: '🇸🇪' },
            'da': { name: 'Danish', native: 'Dansk', flag: '🇩🇰' },
            'nb': { name: 'Norwegian', native: 'Norsk', flag: '🇳🇴' },
            'fi': { name: 'Finnish', native: 'Suomi', flag: '🇫🇮' },
            'th': { name: 'Thai', native: 'ไทย', flag: '🇹🇭' },
            'tr': { name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' }
        };
        return info[lang] || info[DEFAULT_LANGUAGE];
    }

    /**
     * Initialize the language switcher dropdown
     */
    function initLanguageSwitcher() {
        const switcher = document.getElementById('language-switcher');
        if (!switcher) return;

        const currentLang = getCurrentLanguageFromPath() || getBestLanguage();
        const currentInfo = getLanguageInfo(currentLang);

        // Update the current language display
        const currentDisplay = switcher.querySelector('.current-lang');
        if (currentDisplay) {
            currentDisplay.innerHTML = currentInfo.flag + ' ' + currentInfo.native;
        }

        // Add click handlers to language options
        const options = switcher.querySelectorAll('[data-lang]');
        options.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                const lang = this.getAttribute('data-lang');
                switchLanguage(lang);
            });
        });
    }

    // Public API
    return {
        SUPPORTED_LANGUAGES,
        DEFAULT_LANGUAGE,
        getCurrentLanguageFromPath,
        getBestLanguage,
        redirectToLanguage,
        switchLanguage,
        getLanguageInfo,
        initLanguageSwitcher,
        saveLanguage
    };
})();

// Auto-initialize language switcher when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    TripPortierI18n.initLanguageSwitcher();
});
