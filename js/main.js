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
