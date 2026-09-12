/**
 * Portfolio - Main JavaScript
 */

(function() {
    'use strict';

    // ========================================
    // CONFIGURATION
    // ========================================
    const CONFIG = {
        cursorSmoothness: 0.12,
        cursorHoverScale: 2.5,
        scrollOffset: 72,
        animationThreshold: 0.15,
        scrollToTopThreshold: 300
    };

    // ========================================
    // CUSTOM CURSOR (Desktop Only)
    // ========================================
    const cursor = document.getElementById('cursor');
    const trail = document.getElementById('cursorTrail');

    // Skip cursor on touch devices
    if (!document.body.classList.contains('no-cursor') && cursor && trail) {
        let mx = 0, my = 0, tx = 0, ty = 0;

        // Track mouse position
        document.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
            cursor.style.left = mx + 'px';
            cursor.style.top = my + 'px';
        });

        // Smooth trail animation using requestAnimationFrame
        function animTrail() {
            tx += (mx - tx) * CONFIG.cursorSmoothness;
            ty += (my - ty) * CONFIG.cursorSmoothness;
            trail.style.left = tx + 'px';
            trail.style.top = ty + 'px';
            requestAnimationFrame(animTrail);
        }
        animTrail();

        // Cursor hover effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .chip, input, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = `translate(-50%,-50%) scale(${CONFIG.cursorHoverScale})`;
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%,-50%) scale(1)';
            });
        });
    }

    // ========================================
    // MOBILE NAVIGATION TOGGLE
    // ========================================
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // ========================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ========================================
    const observerOptions = {
        threshold: CONFIG.animationThreshold
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate skill bars when visible
                const skillBars = entry.target.querySelectorAll('.skill-bar-fill');
                skillBars.forEach(bar => {
                    bar.classList.add('animate');
                });
            }
        });
    }, observerOptions);

    // Observe all elements with fade-up class
    document.querySelectorAll('.fade-up').forEach(el => {
        observer.observe(el);
    });

    // ========================================
    // HERO IMMEDIATE REVEAL
    // ========================================
    setTimeout(() => {
        const heroElements = document.querySelectorAll('#hero .fade-up, .stats-bar .fade-up');
        heroElements.forEach(el => el.classList.add('visible'));
    }, 100);

    // ========================================
    // CONTACT FORM HANDLING
    // ========================================
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.btn-submit');
            const formData = new FormData(contactForm);

            // Validate
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const message = formData.get('message').trim();

            if (!name || !email || !message) {
                showFormStatus('Mohon lengkapi semua field yang diperlukan.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showFormStatus('Format email tidak valid.', 'error');
                return;
            }

            // Disable button during submission
            submitBtn.disabled = true;
            submitBtn.textContent = 'Mengirim...';

            // Simulate form submission (replace with actual API call)
            try {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Success
                showFormStatus('Pesan berhasil dikirim! Saya akan segera menghubungi Anda.', 'success');
                contactForm.reset();
                submitBtn.textContent = 'Terkirim ✓';

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Kirim Pesan →';
                }, 3000);
            } catch (error) {
                showFormStatus('Terjadi kesalahan. Silakan coba lagi nanti.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Kirim Pesan →';
            }
        });
    }

    function showFormStatus(message, type) {
        if (formStatus) {
            formStatus.textContent = message;
            formStatus.className = `form-status ${type}`;

            // Auto-hide after 5 seconds
            setTimeout(() => {
                formStatus.className = 'form-status';
            }, 5000);
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ========================================
    // BACK TO TOP BUTTON
    // ========================================
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > CONFIG.scrollToTopThreshold) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // Smooth scroll to top
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================================
    // THEME TOGGLE
    // ========================================
    const themeToggle = document.getElementById('themeToggle');

    if (themeToggle) {
        // Check for saved theme preference or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // ========================================
    // AUTO UPDATE YEAR IN FOOTER
    // ========================================
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ========================================
    // SMOOTH SCROLL FOR NAV LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - CONFIG.scrollOffset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

})();