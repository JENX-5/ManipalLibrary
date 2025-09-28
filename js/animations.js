// Custom Animation System (AOS Replacement)
class ScrollAnimator {
    constructor() {
        this.elements = [];
        this.observer = null;
        this.init();
    }

    init() {
        // Create Intersection Observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateIn(entry.target);
                } else {
                    // Optional: animate out when element leaves viewport
                    // this.animateOut(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Find all elements with data-animate attribute
        this.elements = document.querySelectorAll('[data-animate]');
        this.elements.forEach(el => {
            this.setupAnimation(el);
            this.observer.observe(el);
        });
    }

    setupAnimation(element) {
        const animationType = element.getAttribute('data-animate');
        const delay = element.getAttribute('data-delay') || '0';
        
        // Add base animation class
        element.classList.add(`animate-${animationType}`);
        
        // Add delay class if specified
        if (delay !== '0') {
            element.classList.add(`delay-${delay}`);
        }

        // Add duration if specified
        const duration = element.getAttribute('data-duration');
        if (duration) {
            element.classList.add(`duration-${duration}`);
        }

        // Add easing if specified
        const easing = element.getAttribute('data-easing');
        if (easing) {
            element.classList.add(`ease-${easing}`);
        }
    }

    animateIn(element) {
        element.classList.add('animate-visible');
        
        // Remove observer after animation completes
        const duration = element.getAttribute('data-duration') || 600;
        setTimeout(() => {
            this.observer.unobserve(element);
        }, parseInt(duration));
    }

    animateOut(element) {
        element.classList.remove('animate-visible');
    }

    // Refresh method to re-initialize animations
    refresh() {
        this.elements.forEach(el => this.observer.unobserve(el));
        this.elements = document.querySelectorAll('[data-animate]');
        this.elements.forEach(el => {
            this.setupAnimation(el);
            this.observer.observe(el);
        });
    }

    // Add animation to dynamically loaded elements
    add(element) {
        this.setupAnimation(element);
        this.observer.observe(element);
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.scrollAnimator = new ScrollAnimator();
});

// Additional animation utilities
const AnimationUtils = {
    // Parallax effect
    parallax: function(element, speed = 0.5) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * speed;
            element.style.transform = `translateY(${rate}px)`;
        });
    },

    // Typewriter effect
    typewriter: function(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    },

    // Counter animation
    counter: function(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        updateCounter();
    }
};

// Make utilities globally available
window.AnimationUtils = AnimationUtils;