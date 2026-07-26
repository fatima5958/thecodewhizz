/**
 * FRONTEND/NAVBAR.JS — Apple-Grade Luxury Navbar & Fullscreen Mobile Menu Engine
 */

class AriaNavbarEngine {
    constructor() {
        this.header = document.querySelector('.header');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = [];
        this.lastScrollY = window.scrollY;
        this.ticking = false;

        // Mobile Fullscreen Navigation Elements
        this.mobileToggle = document.getElementById('mobile-menu-toggle');
        this.mobileOverlay = document.getElementById('mobile-nav-overlay');
        this.mobileClose = document.getElementById('mobile-nav-close');
        this.mobileBackdrop = document.getElementById('mobile-nav-backdrop');
        this.mobileNavItems = document.querySelectorAll('.mobile-nav-item, .mobile-nav-cta');
        this.isOpen = false;

        this.initSections();
        this.bindScrollObserver();
        this.initActiveSectionObserver();
        this.initMobileMenu();
    }

    initSections() {
        const ids = ['hero', 'process', 'services', 'build-section', 'intelligence', 'why-us', 'future-core', 'consultant', 'projects', 'audit', 'clients', 'cases', 'comparison', 'roi-calculator', 'testimonials', 'contact', 'final-cta'];
        this.sections = ids.map(id => document.getElementById(id)).filter(Boolean);
    }

    bindScrollObserver() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.onScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });

        this.onScroll();
    }

    onScroll() {
        const currentScrollY = window.scrollY;

        if (!this.header || this.isOpen) return;

        // 1. Transparent on top, Glass Blur while scrolling
        if (currentScrollY <= 20) {
            this.header.classList.add('is-top');
            this.header.classList.remove('is-scrolled', 'is-hidden');
        } else {
            this.header.classList.remove('is-top');
            this.header.classList.add('is-scrolled');

            // 2. Smooth Hide on scroll down, Show on scroll up
            if (currentScrollY > 150 && currentScrollY > this.lastScrollY + 5) {
                this.header.classList.add('is-hidden');
            } else if (currentScrollY < this.lastScrollY - 5) {
                this.header.classList.remove('is-hidden');
            }
        }

        this.lastScrollY = currentScrollY;
    }

    /**
     * Active Section Link Indicator Observer
     */
    initActiveSectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    this.navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === `#${id}`) {
                            link.classList.add('is-active');
                        } else {
                            link.classList.remove('is-active');
                        }
                    });
                }
            });
        }, { threshold: 0.3 });

        this.sections.forEach(sec => observer.observe(sec));
    }

    /**
     * Fullscreen Mobile Navigation Menu Controller
     */
    initMobileMenu() {
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        if (this.mobileClose) {
            this.mobileClose.addEventListener('click', () => this.closeMobileMenu());
        }

        if (this.mobileBackdrop) {
            this.mobileBackdrop.addEventListener('click', () => this.closeMobileMenu());
        }

        // Close mobile overlay on item selection
        this.mobileNavItems.forEach(item => {
            item.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // ESC key listener to close menu
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        if (this.isOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.isOpen = true;
        if (this.mobileOverlay) {
            this.mobileOverlay.classList.add('is-active');
            this.mobileOverlay.setAttribute('aria-hidden', 'false');
        }
        if (this.mobileToggle) {
            this.mobileToggle.classList.add('is-active');
        }
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        this.isOpen = false;
        if (this.mobileOverlay) {
            this.mobileOverlay.classList.remove('is-active');
            this.mobileOverlay.setAttribute('aria-hidden', 'true');
        }
        if (this.mobileToggle) {
            this.mobileToggle.classList.remove('is-active');
        }
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.ariaNavbar = new AriaNavbarEngine();
});
