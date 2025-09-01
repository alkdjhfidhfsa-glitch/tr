// ===== DOM Content Loaded =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initLoader();
    initNavigation();
    initHeroSlider();
    initFloatingSocial();
    initScrollEffects();
    initSmoothScroll();
    initContactForm();
    initBackToTop();
    initQuoteForm();
    initGalleryFilter();
    initServicesSlideshow();
});

// ===== Loading Screen =====
function initLoader() {
    const loadingScreen = document.getElementById('loading-screen');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    });
}

// ===== Navigation =====
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Mobile dropdown toggle
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        if (link) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'white';
            header.style.backdropFilter = 'none';
        }
    });
}

// ===== Hero Slider =====
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Auto slide function
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');
        
        currentSlide = (currentSlide + 1) % totalSlides;
        
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }
    
    // Previous slide function
    function prevSlide() {
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');
        
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }
    
    // Go to specific slide
    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });
    
    // Auto play
    let autoPlay = setInterval(nextSlide, 5000);
    
    // Pause on hover
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
            clearInterval(autoPlay);
        });
        
        heroSection.addEventListener('mouseleave', () => {
            autoPlay = setInterval(nextSlide, 5000);
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            nextSlide();
        } else if (e.key === 'ArrowRight') {
            prevSlide();
        }
    });
}

// ===== Floating Social Media =====
function initFloatingSocial() {
    const socialToggle = document.getElementById('socialToggle');
    const socialIcons = document.getElementById('socialIcons');
    
    if (socialToggle && socialIcons) {
        socialToggle.addEventListener('click', function() {
            socialIcons.classList.toggle('active');
            socialToggle.style.transform = socialIcons.classList.contains('active') 
                ? 'translateY(-50%) rotate(45deg)' 
                : 'translateY(-50%) rotate(0deg)';
        });
        
        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (!socialToggle.contains(e.target) && !socialIcons.contains(e.target)) {
                socialIcons.classList.remove('active');
                socialToggle.style.transform = 'translateY(-50%) rotate(0deg)';
            }
        });
    }
}

// ===== Scroll Effects =====
function initScrollEffects() {
    // Active navigation link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    function updateActiveLink() {
        const scrollPos = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    
    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.service-card');
    
    function animateOnScroll() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial state
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navMenu = document.getElementById('navMenu');
                const navToggle = document.getElementById('navToggle');
                if (navMenu && navToggle) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });
}

// ===== Utility Functions =====

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
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

// ===== Performance Optimizations =====

// Optimize scroll events
const optimizedScrollHandler = throttle(function() {
    // Scroll-based animations and effects
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Optimize resize events
const optimizedResizeHandler = debounce(function() {
    // Resize-based calculations
}, 250);

window.addEventListener('resize', optimizedResizeHandler);

// ===== Accessibility Enhancements =====

// Keyboard navigation for slider
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        // Ensure proper tab order
    }
});

// Focus management for mobile menu
function manageFocus() {
    const navMenu = document.getElementById('navMenu');
    const firstLink = navMenu.querySelector('.nav-link');
    const lastLink = navMenu.querySelector('.nav-link:last-child');
    
    if (navMenu.classList.contains('active')) {
        firstLink.focus();
    }
}

// ===== Error Handling =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // Graceful degradation
});

// ===== Browser Compatibility =====
// Check for modern features and provide fallbacks
if (!window.IntersectionObserver) {
    // Fallback for older browsers
    console.warn('IntersectionObserver not supported');
}

// ===== Analytics and Tracking =====
function trackEvent(eventName, eventData) {
    // Add analytics tracking here
    console.log('Event tracked:', eventName, eventData);
}

// Track important interactions
document.addEventListener('click', function(e) {
    if (e.target.matches('.contact-btn')) {
        trackEvent('contact_click', { type: e.target.className });
    }
    
    if (e.target.matches('.social-icon')) {
        trackEvent('social_click', { platform: e.target.href });
    }
});

// ===== Contact Form =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const email = formData.get('email');
            const service = formData.get('service');
            const message = formData.get('message');

            // Validate required fields
            if (!name || !phone || !service || !message) {
                showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
                return;
            }

            // Create WhatsApp message
            const whatsappMessage = `
مرحباً، أريد طلب خدمة من مؤسسة حصة بادي الدعجاني للمظلات والسواتر

الاسم: ${name}
الهاتف: ${phone}
${email ? `البريد الإلكتروني: ${email}` : ''}
نوع الخدمة: ${getServiceName(service)}
تفاصيل المشروع: ${message}
            `.trim();

            // Open WhatsApp
            const whatsappUrl = `https://api.whatsapp.com/send?phone=+966504150690&text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');

            // Show success message
            showNotification('تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً', 'success');

            // Reset form
            contactForm.reset();

            // Track event
            trackEvent('form_submit', { service: service });
        });
    }
}

// Get service name in Arabic
function getServiceName(serviceValue) {
    const services = {
        'car-shades': 'مظلات السيارات',
        'garden-shades': 'مظلات الحدائق',
        'pool-shades': 'مظلات المسابح',
        'wooden-fences': 'السواتر الخشبية',
        'iron-fences': 'سواتر الحديد',
        'tents': 'بيوت الشعر',
        'hangars': 'الهناجر',
        'other': 'أخرى'
    };
    return services[serviceValue] || serviceValue;
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== Back to Top Button =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            trackEvent('back_to_top_click');
        });
    }
}

// ===== Enhanced Animations =====
// Add CSS animations for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(notificationStyles);

// ===== Quote Form =====
function initQuoteForm() {
    const quoteForm = document.getElementById('quoteForm');

    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(quoteForm);
            const name = formData.get('name') || quoteForm.querySelector('input[type="text"]').value;
            const phone = formData.get('phone') || quoteForm.querySelector('input[type="tel"]').value;
            const service = formData.get('service') || quoteForm.querySelector('select').value;
            const message = formData.get('message') || quoteForm.querySelector('textarea').value;

            // Validate required fields
            if (!name || !phone || !service || !message) {
                showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
                return;
            }

            // Create WhatsApp message
            const whatsappMessage = `
مرحباً، أريد طلب عرض سعر من مؤسسة مظلات الدعجاني

الاسم: ${name}
الهاتف: ${phone}
نوع الخدمة: ${getServiceName(service)}
تفاصيل المشروع: ${message}

أرجو التواصل معي لتقديم عرض سعر مفصل.
            `.trim();

            // Open WhatsApp
            const whatsappUrl = `https://api.whatsapp.com/send?phone=+966504150690&text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');

            // Show success message
            showNotification('تم إرسال طلب العرض بنجاح! سيتم التواصل معك قريباً', 'success');

            // Reset form
            quoteForm.reset();

            // Track event
            trackEvent('quote_request', { service: service });
        });
    }
}

// ===== Get Service Name =====
function getServiceName(serviceValue) {
    const serviceNames = {
        'car-shades': 'مظلات السيارات',
        'garden-shades': 'مظلات الحدائق',
        'pool-shades': 'مظلات المسابح',
        'wooden-fences': 'السواتر الخشبية',
        'iron-fences': 'سواتر الحديد',
        'tents': 'بيوت الشعر',
        'hangars': 'الهناجر',
        'cantilever-shades': 'مظلات كابولي',
        'pvc-shades': 'مظلات بي في سي',
        'pyramid-shades': 'مظلات هرمية',
        'polyethylene-shades': 'مظلات بولي ايثيلين',
        'school-shades': 'مظلات مدارس',
        'wooden-shades': 'مظلات خشبية',
        'school-fences': 'سواتر مدارس',
        'fabric-fences': 'سواتر قماش',
        'tensile-structures': 'مظلات الشد الانشائي',
        'market-shades': 'مظلات الأسواق',
        'mosque-shades': 'مظلات مساجد',
        'hanging-shades': 'المظلات المعلقة',
        'conical-shades': 'مظلات مخروطي',
        'tiles': 'القرميد',
        'cladding': 'الكلادينج',
        'nets': 'شبوك'
    };

    return serviceNames[serviceValue] || serviceValue;
}

// ===== Gallery Filter =====
function initGalleryFilter() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (tabBtns.length > 0 && galleryItems.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const category = this.getAttribute('data-category');

                // Update active tab
                tabBtns.forEach(tab => tab.classList.remove('active'));
                this.classList.add('active');

                // Filter gallery items
                galleryItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');

                    if (category === 'all' || itemCategory === category) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 100);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

// ===== Enhanced Smooth Scrolling =====
function smoothScrollToSection(targetId) {
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ===== Service Worker Registration =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ===== Services Slideshow =====
function initServicesSlideshow() {
    const serviceItems = document.querySelectorAll('.service-item');

    serviceItems.forEach(serviceItem => {
        const images = serviceItem.querySelectorAll('.service-image');
        let currentImageIndex = 0;

        if (images.length > 1) {
            // Start slideshow for this service
            setInterval(() => {
                // Hide current image
                images[currentImageIndex].classList.remove('active');

                // Move to next image
                currentImageIndex = (currentImageIndex + 1) % images.length;

                // Show next image
                images[currentImageIndex].classList.add('active');
            }, 5000); // Change image every 5 seconds
        }
    });
}
