// Main application functionality
document.addEventListener("DOMContentLoaded", () => {
    console.log("MIT Manipal Library Portal loaded");
    
    // Initialize animations
    if (window.scrollAnimator) {
        window.scrollAnimator.refresh();
    }

    // Add smooth scrolling for anchor links
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

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Add scroll to top button functionality
    const scrollToTop = document.createElement('button');
    scrollToTop.innerHTML = '↑';
    scrollToTop.className = 'scroll-to-top';
    scrollToTop.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 3rem;
        height: 3rem;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        opacity: 0;
        transition: opacity 0.3s, transform 0.3s;
        z-index: 1000;
    `;
    document.body.appendChild(scrollToTop);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTop.style.opacity = '1';
            scrollToTop.style.transform = 'scale(1)';
        } else {
            scrollToTop.style.opacity = '0';
            scrollToTop.style.transform = 'scale(0)';
        }
    });

    scrollToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Form handling functionality
document.addEventListener("DOMContentLoaded", () => {
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const messageEl = document.getElementById('loginMessage');
            messageEl.textContent = "Login successful (demo only).";
            messageEl.className = 'form-message success';
            loginForm.reset();
            
            // Clear message after 3 seconds
            setTimeout(() => {
                messageEl.textContent = '';
                messageEl.className = 'form-message';
            }, 3000);
        });
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const messageEl = document.getElementById('formMessage');
            messageEl.textContent = "Thank you! Your message has been sent.";
            messageEl.className = 'form-message success';
            contactForm.reset();
            
            // Clear message after 3 seconds
            setTimeout(() => {
                messageEl.textContent = '';
                messageEl.className = 'form-message';
            }, 3000);
        });
    }

    // Add form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateField(input);
            });
        });
    });

    function validateField(field) {
        if (!field.value.trim()) {
            field.style.borderColor = '#dc2626';
        } else {
            field.style.borderColor = '#d1d5db';
        }
    }

    // Enhanced navigation active state
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});