/**
 * Days Asset Management - Interactive Features
 * Professional Corporate Website JavaScript
 */

// ==========================================
// Utility Functions
// ==========================================

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ==========================================
// Navigation functionality
// ==========================================

class Navigation {
    constructor() {
        this.header = document.querySelector('.header');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        this.handleScroll();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupActiveNavHighlight();
    }
    
    handleScroll() {
        const scrollHandler = throttle(() => {
            const scrollY = window.pageYOffset;
            
            if (scrollY > 100) {
                this.header.style.background = 'rgba(255, 255, 255, 0.98)';
                this.header.style.boxShadow = '0 2px 20px rgba(212, 175, 55, 0.15)';
            } else {
                this.header.style.background = 'rgba(255, 255, 255, 0.95)';
                this.header.style.boxShadow = '0 2px 10px rgba(212, 175, 55, 0.1)';
            }
        }, 16);
        
        window.addEventListener('scroll', scrollHandler);
    }
    
    setupMobileMenu() {
        if (!this.hamburger) return;
        
        this.hamburger.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // Close menu when clicking on nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.header.contains(e.target) && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.isMenuOpen = true;
        this.hamburger.classList.add('active');
        this.navMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate hamburger
        const spans = this.hamburger.querySelectorAll('span');
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    }
    
    closeMobileMenu() {
        this.isMenuOpen = false;
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset hamburger
        const spans = this.hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    }
    
    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const headerHeight = this.header.offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    
    setupActiveNavHighlight() {
        const sections = document.querySelectorAll('section[id]');
        
        const highlightHandler = throttle(() => {
            const scrollY = window.pageYOffset + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, 100);
        
        window.addEventListener('scroll', highlightHandler);
    }
}

// ==========================================
// Scroll Animations
// ==========================================

class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
        this.options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.options);
            this.animatedElements.forEach(el => this.observer.observe(el));
        } else {
            // Fallback for older browsers
            this.animatedElements.forEach(el => el.classList.add('visible'));
        }
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// ==========================================
// Form Validation and Submission
// ==========================================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.fields = {
            company: document.getElementById('company'),
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            phone: document.getElementById('phone'),
            service: document.getElementById('service'),
            message: document.getElementById('message')
        };
        this.errors = {
            company: document.getElementById('companyError'),
            name: document.getElementById('nameError'),
            email: document.getElementById('emailError'),
            message: document.getElementById('messageError')
        };
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.setupValidation();
        this.setupFormSubmission();
    }
    
    setupValidation() {
        // Real-time validation
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            if (field) {
                field.addEventListener('blur', () => this.validateField(fieldName));
                field.addEventListener('input', debounce(() => this.validateField(fieldName), 300));
            }
        });
    }
    
    validateField(fieldName) {
        const field = this.fields[fieldName];
        const errorElement = this.errors[fieldName];
        
        if (!field || !errorElement) return true;
        
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        switch (fieldName) {
            case 'company':
                if (!value) {
                    isValid = false;
                    errorMessage = '会社名を入力してください';
                } else if (value.length < 2) {
                    isValid = false;
                    errorMessage = '会社名は2文字以上で入力してください';
                }
                break;
                
            case 'name':
                if (!value) {
                    isValid = false;
                    errorMessage = 'お名前を入力してください';
                } else if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'お名前は2文字以上で入力してください';
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    isValid = false;
                    errorMessage = 'メールアドレスを入力してください';
                } else if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = '正しいメールアドレス形式で入力してください';
                }
                break;
                
            case 'message':
                if (!value) {
                    isValid = false;
                    errorMessage = 'お問い合わせ内容を入力してください';
                } else if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'お問い合わせ内容は10文字以上で入力してください';
                }
                break;
        }
        
        // Update field appearance and error message
        if (isValid) {
            field.style.borderColor = '#28a745';
            errorElement.textContent = '';
            field.classList.remove('error');
        } else {
            field.style.borderColor = '#e74c3c';
            errorElement.textContent = errorMessage;
            field.classList.add('error');
        }
        
        return isValid;
    }
    
    validateForm() {
        const requiredFields = ['company', 'name', 'email', 'message'];
        let isValid = true;
        
        requiredFields.forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    setupFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!this.validateForm()) {
                this.showMessage('入力内容をご確認ください', 'error');
                return;
            }
            
            const submitButton = this.form.querySelector('.btn-submit');
            const originalText = submitButton.innerHTML;
            
            try {
                // Show loading state
                submitButton.innerHTML = '<i class=\"fas fa-spinner fa-spin\"></i> 送信中...';
                submitButton.disabled = true;
                
                // Simulate form submission (replace with actual API call)
                await this.simulateFormSubmission();
                
                // Success
                this.showMessage('お問い合わせを受け付けました。担当者より3営業日以内にご連絡いたします。', 'success');
                this.form.reset();
                this.clearFieldStyles();
                
            } catch (error) {
                this.showMessage('送信中にエラーが発生しました。お手数ですが、もう一度お試しください。', 'error');
                console.error('Form submission error:', error);
            } finally {
                // Reset button state
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }
    
    async simulateFormSubmission() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    }
    
    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.innerHTML = `
            <div class=\"message-content\">
                <i class=\"fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}\"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Style the message
        Object.assign(messageElement.style, {
            padding: '15px 20px',
            marginBottom: '20px',
            borderRadius: '8px',
            border: `2px solid ${type === 'success' ? '#28a745' : '#e74c3c'}`,
            backgroundColor: type === 'success' ? '#d4edda' : '#f8d7da',
            color: type === 'success' ? '#155724' : '#721c24',
            fontSize: '0.95rem',
            lineHeight: '1.5'
        });
        
        messageElement.querySelector('.message-content').style.display = 'flex';
        messageElement.querySelector('.message-content').style.alignItems = 'center';
        messageElement.querySelector('.message-content').style.gap = '10px';
        
        // Insert message
        this.form.insertBefore(messageElement, this.form.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
        
        // Scroll to message
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    clearFieldStyles() {
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            const errorElement = this.errors[fieldName];
            
            if (field) {
                field.style.borderColor = '';
                field.classList.remove('error');
            }
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    }
}

// ==========================================
// Performance Optimizations
// ==========================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.optimizeImages();
        this.setupLazyLoading();
        this.preloadCriticalResources();
    }
    
    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add loading optimization
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add error handling
            img.addEventListener('error', () => {
                img.style.display = 'none';
                console.warn('Failed to load image:', img.src);
            });
        });
    }
    
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[loading=\"lazy\"]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
    
    preloadCriticalResources() {
        // Preload hero image
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = heroImage.src;
            document.head.appendChild(link);
        }
    }
}

// ==========================================
// Enhanced User Experience Features
// ==========================================

class UserExperience {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupScrollToTop();
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.enhanceAccessibility();
    }
    
    setupScrollToTop() {
        const scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.innerHTML = '<i class=\"fas fa-chevron-up\"></i>';
        scrollToTopBtn.className = 'scroll-to-top';
        scrollToTopBtn.setAttribute('aria-label', 'ページトップに戻る');
        
        Object.assign(scrollToTopBtn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #D4AF37, #B8941F)',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            zIndex: '1000',
            opacity: '0',
            visibility: 'hidden',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
        });
        
        document.body.appendChild(scrollToTopBtn);
        
        const scrollHandler = throttle(() => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.visibility = 'visible';
            } else {
                scrollToTopBtn.style.opacity = '0';
                scrollToTopBtn.style.visibility = 'hidden';
            }
        }, 100);
        
        window.addEventListener('scroll', scrollHandler);
        
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    setupKeyboardNavigation() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close mobile menu if open
                const nav = document.querySelector('nav');
                if (nav && nav.classList.contains('menu-open')) {
                    nav.classList.remove('menu-open');
                }
            }
        });
    }
    
    setupFocusManagement() {
        // Improve focus management for better accessibility
        const focusableElements = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex=\"0\"]';
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusable = Array.from(document.querySelectorAll(focusableElements));
                const index = focusable.indexOf(document.activeElement);
                
                if (e.shiftKey) {
                    const prevIndex = index > 0 ? index - 1 : focusable.length - 1;
                    focusable[prevIndex].focus();
                } else {
                    const nextIndex = index < focusable.length - 1 ? index + 1 : 0;
                    focusable[nextIndex].focus();
                }
            }
        });
    }
    
    enhanceAccessibility() {
        // Add skip links for screen readers
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'メインコンテンツにスキップ';
        skipLink.className = 'skip-link';
        
        Object.assign(skipLink.style, {
            position: 'absolute',
            top: '-40px',
            left: '6px',
            background: '#000',
            color: '#fff',
            padding: '8px',
            textDecoration: 'none',
            zIndex: '1001',
            transition: 'top 0.3s'
        });
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main content ID
        const mainContent = document.querySelector('main') || document.querySelector('.hero');
        if (mainContent) {
            mainContent.id = 'main-content';
        }
    }
}

// ==========================================
// Main Application Initialization
// ==========================================

class App {
    constructor() {
        this.isLoaded = false;
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }
    
    initializeApp() {
        try {
            // Initialize core features
            this.navigation = new Navigation();
            this.scrollAnimations = new ScrollAnimations();
            this.contactForm = new ContactForm();
            this.performanceOptimizer = new PerformanceOptimizer();
            this.userExperience = new UserExperience();
            
            this.isLoaded = true;
            
            // Dispatch custom event for other scripts
            window.dispatchEvent(new CustomEvent('appInitialized'));
            
            console.log('Days Asset Management website initialized successfully');
            
        } catch (error) {
            console.error('Error initializing application:', error);
        }
    }
}

// ==========================================
// Initialize Application
// ==========================================

const app = new App();

// Export for potential use by other scripts
window.DAMWebsite = {
    app: app,
    Navigation: Navigation,
    ScrollAnimations: ScrollAnimations,
    ContactForm: ContactForm,
    PerformanceOptimizer: PerformanceOptimizer,
    UserExperience: UserExperience
};