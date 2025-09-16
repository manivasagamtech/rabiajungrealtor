// Professional Real Estate Consultation Website JavaScript

// DOM Elements  
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const header = document.querySelector('.header');
const contactForm = document.getElementById('contact-form');
const navLinks = document.querySelectorAll('.nav__link');
const videoCategories = document.querySelectorAll('.video-category');
const serviceCards = document.querySelectorAll('.service-card');
const whyCards = document.querySelectorAll('.why-card');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    setupNavigation();
    setupScrollEffects();
    setupContactForm();
    setupInteractiveElements();
    setupAnimations();
    setupScrollToTop();
    
    console.log('Rabia Jung Realtor - Professional Consultation Website Loaded Successfully!');
}

// Navigation Setup
function setupNavigation() {
    // Mobile Navigation Toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Animate hamburger menu
            animateHamburger();
        });

        // Close mobile menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Don't prevent default here - we want the smooth scrolling to work
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
                resetHamburger();
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
                resetHamburger();
            }
        });
    }

    // Smooth Scrolling for Navigation Links - Fixed Implementation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header ? header.offsetHeight : 80;
                const offsetTop = targetSection.offsetTop - headerHeight - 20; // Added extra margin
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    resetHamburger();
                }
                
                // Smooth scroll to target
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active nav link after a short delay
                setTimeout(() => {
                    updateActiveNavLink(targetId);
                }, 100);
            }
        });
    });
}

// Hamburger Menu Animation
function animateHamburger() {
    const spans = navToggle ? navToggle.querySelectorAll('span') : [];
    if (navToggle && navToggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        resetHamburger();
    }
}

function resetHamburger() {
    const spans = navToggle ? navToggle.querySelectorAll('span') : [];
    spans.forEach(span => {
        span.style.transform = 'none';
        span.style.opacity = '1';
    });
}

// Update Active Navigation Link
function updateActiveNavLink(targetId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`.nav__link[href="${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Scroll Effects Setup
function setupScrollEffects() {
    let lastScrollTop = 0;
    const headerHeight = header ? header.offsetHeight : 80;

    const throttledScroll = throttle(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for styling
        if (header) {
            if (scrollTop > headerHeight) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Update active nav link based on scroll position
        updateActiveNavOnScroll();
        
        // Show/hide scroll to top button
        const scrollToTopBtn = document.querySelector('.scroll-to-top');
        if (scrollToTopBtn) {
            if (scrollTop > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, 16);

    window.addEventListener('scroll', throttledScroll);
}

// Update Active Nav Link Based on Scroll Position
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + 150; // Increased offset for better detection

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
}

// Contact Form Setup
function setupContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!data.name || !data.email || !data.phone) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Phone validation (basic)
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(data.phone)) {
                showNotification('Please enter a valid phone number.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Scheduling Consultation...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                showNotification('Thank you! Your consultation request has been received. I will contact you within 24 hours to schedule our meeting.', 'success');
                
                // Generate WhatsApp link for consultation
                const message = `Hi Rabia, I would like to schedule a consultation for real estate services.

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Service Interest: ${data['service-interest'] || 'General Consultation'}
Goals: ${data.message || 'No additional details provided'}

Please let me know your availability for a consultation call.`;
                
                const whatsappUrl = `https://wa.me/923062136018?text=${encodeURIComponent(message)}`;
                
                // Show WhatsApp option for faster response
                setTimeout(() => {
                    if (confirm('Would you like to also send this consultation request via WhatsApp for immediate response?')) {
                        window.open(whatsappUrl, '_blank');
                    }
                }, 2000);
                
            }, 2000);
        });
        
        // Enhanced form field interactions
        const formFields = contactForm.querySelectorAll('.form-control');
        formFields.forEach(field => {
            field.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
                addFieldGlow(this);
            });
            
            field.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
                removeFieldGlow(this);
            });
            
            // Real-time validation feedback
            field.addEventListener('input', function() {
                validateFieldRealTime(this);
            });
        });
    }
}

// Field validation and styling functions
function addFieldGlow(field) {
    field.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.2)';
}

function removeFieldGlow(field) {
    field.style.boxShadow = '';
}

function validateFieldRealTime(field) {
    const value = field.value.trim();
    let isValid = true;
    
    switch(field.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
            break;
        case 'tel':
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            isValid = phoneRegex.test(value);
            break;
        default:
            isValid = value.length > 0;
    }
    
    if (value.length > 0) {
        if (isValid) {
            field.style.borderColor = '#10B981';
            field.parentElement.classList.remove('error');
        } else {
            field.style.borderColor = '#EF4444';
            field.parentElement.classList.add('error');
        }
    } else {
        field.style.borderColor = '';
        field.parentElement.classList.remove('error');
    }
}

// Interactive Elements Setup
function setupInteractiveElements() {
    // Video categories interaction
    videoCategories.forEach(category => {
        category.addEventListener('click', function() {
            const categoryTitle = this.querySelector('h4').textContent;
            showConsultationModal(categoryTitle);
        });
        
        // Add hover effects
        category.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        category.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Service cards enhanced interaction
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceName = this.querySelector('h3').textContent;
            showServiceDetailsModal(serviceName, this);
        });
    });

    // Why choose cards interaction
    whyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) rotate(1deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0deg)';
        });
    });

    // Process steps interaction
    const processSteps = document.querySelectorAll('.process-step');
    processSteps.forEach((step, index) => {
        step.addEventListener('click', function() {
            const stepTitle = this.querySelector('h3').textContent;
            const stepDescription = this.querySelector('p').textContent;
            showProcessDetailModal(stepTitle, stepDescription, index + 1);
        });
    });
}

// Modal Functions
function showConsultationModal(category) {
    const modal = createModal(`${category} - Consultation Available`, `
        <p style="margin-bottom: 1.5rem;">I provide expert insights and consultation in <strong>${category}</strong>. Let's discuss how this can benefit your property journey.</p>
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem; border-left: 4px solid #D4AF37;">
            <h4 style="color: #D4AF37; margin-bottom: 1rem;">What You'll Get:</h4>
            <ul style="margin: 0; padding-left: 1.2rem;">
                <li>Personalized consultation session</li>
                <li>Market insights and analysis</li>
                <li>Professional recommendations</li>
                <li>Ongoing support and guidance</li>
            </ul>
        </div>
        <div style="text-align: center;">
            <button class="btn btn--primary" onclick="scrollToContact(); closeModal();" style="display: inline-block; margin-right: 1rem;">Schedule Consultation</button>
            <a href="https://wa.me/923062136018?text=Hi Rabia, I'm interested in ${category}. Please let me know your availability for a consultation." target="_blank" class="btn btn--outline" style="display: inline-block;">WhatsApp Now</a>
        </div>
    `);
}

function showServiceDetailsModal(serviceName, cardElement) {
    const features = cardElement.querySelectorAll('.service-features li');
    const featuresList = Array.from(features).map(li => li.textContent).join('</li><li>');
    
    const modal = createModal(`${serviceName} - Professional Service`, `
        <div style="margin-bottom: 2rem;">
            <h4 style="color: #D4AF37; margin-bottom: 1rem;">Service Includes:</h4>
            <ul style="margin: 0 0 1.5rem 1.2rem; line-height: 1.6;">
                <li>${featuresList}</li>
            </ul>
        </div>
        <div style="background: linear-gradient(135deg, #D4AF37, #FFD700); padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem; color: #000;">
            <h4 style="margin-bottom: 1rem;">Ready to Get Started?</h4>
            <p style="margin: 0;">Book a consultation to discuss your specific needs and how I can provide expert guidance in ${serviceName}.</p>
        </div>
        <div style="text-align: center;">
            <button class="btn btn--primary" onclick="scrollToContact(); closeModal();" style="display: inline-block; margin-right: 1rem;">Book Consultation</button>
            <button onclick="closeModal()" class="btn btn--outline" style="display: inline-block;">Learn More First</button>
        </div>
    `);
}

function showProcessDetailModal(stepTitle, stepDescription, stepNumber) {
    const modal = createModal(`Step ${stepNumber}: ${stepTitle}`, `
        <div style="text-align: center; margin-bottom: 2rem;">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #D4AF37, #FFD700); color: #000; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; margin: 0 auto 1rem; box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);">
                ${stepNumber}
            </div>
        </div>
        <p style="font-size: 1.1rem; margin-bottom: 2rem; text-align: center;">${stepDescription}</p>
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;">
            <h4 style="color: #D4AF37; margin-bottom: 1rem;">What Happens in This Step:</h4>
            <div id="step-details"></div>
        </div>
        <div style="text-align: center;">
            <button class="btn btn--primary" onclick="scrollToContact(); closeModal();" style="display: inline-block;">Start This Process</button>
        </div>
    `);
    
    // Add step-specific details after modal is created
    setTimeout(() => {
        const detailsContainer = document.getElementById('step-details');
        if (detailsContainer) {
            const stepDetails = getProcessStepDetails(stepNumber);
            detailsContainer.innerHTML = stepDetails;
        }
    }, 100);
}

function scrollToContact() {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
        const headerHeight = header ? header.offsetHeight : 80;
        const offsetTop = contactSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Make scrollToContact globally accessible
window.scrollToContact = scrollToContact;

function getProcessStepDetails(stepNumber) {
    const details = {
        1: `
            <ul style="margin: 0; padding-left: 1.2rem;">
                <li>Discuss your property goals and requirements</li>
                <li>Understand your budget and timeline</li>
                <li>Assess your investment objectives</li>
                <li>Identify preferred locations and property types</li>
            </ul>
        `,
        2: `
            <ul style="margin: 0; padding-left: 1.2rem;">
                <li>Comprehensive market trend analysis</li>
                <li>Property valuation assessments</li>
                <li>Comparative market analysis (CMA)</li>
                <li>Investment opportunity identification</li>
            </ul>
        `,
        3: `
            <ul style="margin: 0; padding-left: 1.2rem;">
                <li>Curated property recommendations</li>
                <li>Detailed property evaluations</li>
                <li>Location and amenity analysis</li>
                <li>Investment potential assessment</li>
            </ul>
        `,
        4: `
            <ul style="margin: 0; padding-left: 1.2rem;">
                <li>Negotiation support and guidance</li>
                <li>Documentation assistance</li>
                <li>Legal and financial coordination</li>
                <li>Transaction process management</li>
            </ul>
        `,
        5: `
            <ul style="margin: 0; padding-left: 1.2rem;">
                <li>Regular market updates and insights</li>
                <li>Property management recommendations</li>
                <li>Future investment opportunities</li>
                <li>Long-term relationship and support</li>
            </ul>
        `
    };
    
    return details[stepNumber] || '<p>Comprehensive professional service and support.</p>';
}

function createModal(title, content) {
    // Remove existing modal
    const existingModal = document.querySelector('.consultation-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal styles
    if (!document.querySelector('.modal-styles')) {
        addModalStyles();
    }

    const modal = document.createElement('div');
    modal.className = 'consultation-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal()" aria-label="Close modal">&times;</button>
                <h3 style="color: #000; margin-bottom: 1.5rem; font-family: 'Playfair Display', serif;">${title}</h3>
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close on escape key
    const handleEscape = function(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Close on overlay click
    modal.querySelector('.modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    return modal;
}

function closeModal() {
    const modal = document.querySelector('.consultation-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
            document.body.style.overflow = '';
        }, 300);
    }
}

// Make closeModal globally accessible
window.closeModal = closeModal;

function addModalStyles() {
    const styles = document.createElement('style');
    styles.className = 'modal-styles';
    styles.textContent = `
        .consultation-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        
        .modal-content {
            background: white;
            border-radius: 20px;
            padding: 3rem;
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #D4AF37;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }
        
        .modal-close:hover {
            background: rgba(212, 175, 55, 0.1);
            transform: scale(1.1);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.9); }
        }
        
        @media (max-width: 768px) {
            .modal-content {
                padding: 2rem;
                margin: 1rem;
            }
        }
    `;
    document.head.appendChild(styles);
}

// Notification System
function showNotification(message, type = 'info') {
    // Add notification styles if not present
    if (!document.querySelector('.notification-styles')) {
        addNotificationStyles();
    }

    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <span class="notification__icon">${getNotificationIcon(type)}</span>
            <span class="notification__message">${message}</span>
            <button class="notification__close" onclick="removeNotification(this.closest('.notification'))" aria-label="Close notification">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 8 seconds for success messages, 5 seconds for others
    const autoRemoveTime = type === 'success' ? 8000 : 5000;
    const autoRemove = setTimeout(() => {
        removeNotification(notification);
    }, autoRemoveTime);
    
    // Close button functionality
    notification.querySelector('.notification__close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification(notification);
    });
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

function removeNotification(notification) {
    if (notification && document.body.contains(notification)) {
        notification.style.animation = 'slideOutRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    }
}

// Make removeNotification globally accessible
window.removeNotification = removeNotification;

function addNotificationStyles() {
    const styles = document.createElement('style');
    styles.className = 'notification-styles';
    styles.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 2rem;
            z-index: 3000;
            min-width: 350px;
            max-width: 500px;
            animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .notification__content {
            display: flex;
            align-items: flex-start;
            padding: 1.5rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            border-left: 4px solid #D4AF37;
        }
        
        .notification--success .notification__content {
            border-left-color: #10B981;
        }
        
        .notification--error .notification__content {
            border-left-color: #EF4444;
        }
        
        .notification--warning .notification__content {
            border-left-color: #F59E0B;
        }
        
        .notification__icon {
            font-size: 1.5rem;
            margin-right: 1rem;
            flex-shrink: 0;
            margin-top: 0.25rem;
        }
        
        .notification__message {
            flex: 1;
            color: #333;
            line-height: 1.5;
            font-size: 0.95rem;
        }
        
        .notification__close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #999;
            margin-left: 1rem;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 4px;
            transition: all 0.2s ease;
        }
        
        .notification__close:hover {
            color: #666;
            background: rgba(0, 0, 0, 0.05);
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
        @media (max-width: 768px) {
            .notification {
                right: 1rem;
                left: 1rem;
                min-width: auto;
            }
        }
    `;
    document.head.appendChild(styles);
}

// Animation Setup
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Elements to animate on scroll
    const animateElements = document.querySelectorAll(`
        .service-card,
        .why-card,
        .process-step,
        .video-category,
        .testimonial-card,
        .graphic-element,
        .section-header
    `);

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });

    // Initial hero animation
    const heroElements = document.querySelectorAll('.hero__text > *');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.animation = `fadeInUp 0.8s ease forwards ${index * 0.1}s`;
    });
    
    // Hero profile animation
    const heroProfile = document.querySelector('.hero__profile');
    if (heroProfile) {
        heroProfile.style.opacity = '0';
        heroProfile.style.transform = 'translateY(30px)';
        heroProfile.style.animation = 'fadeInUp 0.8s ease forwards 0.5s';
    }
}

// Scroll to Top Setup
function setupScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');

    // Add styles
    if (!document.querySelector('.scroll-to-top-styles')) {
        const styles = document.createElement('style');
        styles.className = 'scroll-to-top-styles';
        styles.textContent = `
            .scroll-to-top {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #D4AF37, #FFD700);
                color: #000;
                border: none;
                border-radius: 50%;
                font-size: 1.5rem;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
                transition: all 0.3s ease;
                opacity: 0;
                visibility: hidden;
                z-index: 1000;
            }
            
            .scroll-to-top.visible {
                opacity: 1;
                visibility: visible;
            }
            
            .scroll-to-top:hover {
                transform: translateY(-5px) scale(1.1);
                box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5);
            }
            
            @media (max-width: 768px) {
                .scroll-to-top {
                    bottom: 1.5rem;
                    right: 1.5rem;
                    width: 45px;
                    height: 45px;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(scrollToTopBtn);

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth transitions to all interactive elements
    const interactiveElements = document.querySelectorAll('button, .btn, .nav__link, .service-card, .why-card, .video-category');
    interactiveElements.forEach(el => {
        el.style.transition = 'all 0.3s ease';
    });
    
    // Add focus management for accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
});
