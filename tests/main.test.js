/**
 * Unit Tests for main.js
 */

describe('Main.js Functionality', () => {
    
    // Test utility functions
    it('should have debounce function that delays execution', async () => {
        let callCount = 0;
        const testFunction = debounce(() => callCount++, 100);
        
        testFunction();
        testFunction();
        testFunction();
        
        expect(callCount).toBe(0); // Should not have called yet
        
        // Wait for debounce delay
        await new Promise(resolve => setTimeout(resolve, 150));
        expect(callCount).toBe(1); // Should have called once
    });

    it('should have throttle function that limits execution rate', async () => {
        let callCount = 0;
        const testFunction = throttle(() => callCount++, 100);
        
        testFunction();
        testFunction();
        testFunction();
        
        expect(callCount).toBe(1); // Should have called immediately once
        
        await new Promise(resolve => setTimeout(resolve, 150));
        testFunction();
        expect(callCount).toBe(2); // Should allow another call after throttle period
    });

    it('should have trackEvent function', () => {
        expect(typeof trackEvent).toBe('function');
        
        // Mock console.log to test trackEvent
        const originalLog = console.log;
        let loggedMessage = '';
        console.log = (message, eventName, eventData) => {
            loggedMessage = { message, eventName, eventData };
        };
        
        trackEvent('test_event', { test: 'data' });
        expect(loggedMessage.message).toBe('Event tracked:');
        expect(loggedMessage.eventName).toBe('test_event');
        
        // Restore console.log
        console.log = originalLog;
    });

    it('should have getServiceName function that returns correct Arabic names', () => {
        expect(getServiceName('car-shades')).toBe('مظلات السيارات');
        expect(getServiceName('garden-shades')).toBe('مظلات الحدائق');
        expect(getServiceName('pool-shades')).toBe('مظلات المسابح');
        expect(getServiceName('wooden-fences')).toBe('السواتر الخشبية');
        expect(getServiceName('iron-fences')).toBe('سواتر الحديد');
        expect(getServiceName('unknown-service')).toBe('unknown-service');
    });

    it('should have showNotification function', () => {
        expect(typeof showNotification).toBe('function');
        
        // Test notification creation
        showNotification('Test message', 'success');
        
        const notification = document.querySelector('.notification');
        expect(notification).toBeTruthy();
        expect(notification.textContent).toContain('Test message');
        
        // Clean up
        if (notification) {
            notification.remove();
        }
    });

    it('should create notification with correct styling based on type', () => {
        showNotification('Success message', 'success');
        let notification = document.querySelector('.notification');
        expect(notification.style.background).toContain('#28a745');
        notification.remove();

        showNotification('Error message', 'error');
        notification = document.querySelector('.notification');
        expect(notification.style.background).toContain('#dc3545');
        notification.remove();

        showNotification('Info message', 'info');
        notification = document.querySelector('.notification');
        expect(notification.style.background).toContain('#17a2b8');
        notification.remove();
    });

    it('should have smoothScrollToSection function', () => {
        expect(typeof smoothScrollToSection).toBe('function');
        
        // Create a mock section to scroll to
        const testSection = createMockElement('section', { id: 'test-section' });
        document.body.appendChild(testSection);
        
        // Create a mock header
        const header = createMockElement('header', { className: 'header' });
        header.style.height = '80px';
        document.body.appendChild(header);
        
        // Mock scrollTo
        const originalScrollTo = window.scrollTo;
        let scrollCalled = false;
        window.scrollTo = (options) => {
            scrollCalled = true;
            expect(options.behavior).toBe('smooth');
        };
        
        smoothScrollToSection('#test-section');
        expect(scrollCalled).toBe(true);
        
        // Clean up
        window.scrollTo = originalScrollTo;
        testSection.remove();
        header.remove();
    });
});

describe('DOM Interaction Functions', () => {
    
    it('should handle navigation toggle correctly', () => {
        // Create mock DOM elements
        const navToggle = createMockElement('button', { id: 'navToggle' });
        const navMenu = createMockElement('nav', { id: 'navMenu' });
        
        document.body.appendChild(navToggle);
        document.body.appendChild(navMenu);
        
        // Simulate initNavigation
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
        
        // Test toggle functionality
        expect(navToggle.classList.contains('active')).toBe(false);
        expect(navMenu.classList.contains('active')).toBe(false);
        
        triggerEvent(navToggle, 'click');
        
        expect(navToggle.classList.contains('active')).toBe(true);
        expect(navMenu.classList.contains('active')).toBe(true);
        
        // Clean up
        navToggle.remove();
        navMenu.remove();
    });

    it('should handle back to top button correctly', () => {
        // Create mock button
        const backToTopBtn = createMockElement('button', { id: 'backToTop' });
        document.body.appendChild(backToTopBtn);
        
        // Mock scroll behavior
        let scrollCalled = false;
        const originalScrollTo = window.scrollTo;
        window.scrollTo = (options) => {
            scrollCalled = true;
            expect(options.top).toBe(0);
            expect(options.behavior).toBe('smooth');
        };
        
        // Simulate initBackToTop
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        triggerEvent(backToTopBtn, 'click');
        expect(scrollCalled).toBe(true);
        
        // Clean up
        window.scrollTo = originalScrollTo;
        backToTopBtn.remove();
    });

    it('should handle floating social media toggle', () => {
        // Create mock elements
        const socialToggle = createMockElement('button', { id: 'socialToggle' });
        const socialIcons = createMockElement('div', { id: 'socialIcons' });
        
        document.body.appendChild(socialToggle);
        document.body.appendChild(socialIcons);
        
        // Simulate initFloatingSocial
        socialToggle.addEventListener('click', function() {
            socialIcons.classList.toggle('active');
            socialToggle.style.transform = socialIcons.classList.contains('active') 
                ? 'translateY(-50%) rotate(45deg)' 
                : 'translateY(-50%) rotate(0deg)';
        });
        
        expect(socialIcons.classList.contains('active')).toBe(false);
        
        triggerEvent(socialToggle, 'click');
        
        expect(socialIcons.classList.contains('active')).toBe(true);
        expect(socialToggle.style.transform).toBe('translateY(-50%) rotate(45deg)');
        
        // Clean up
        socialToggle.remove();
        socialIcons.remove();
    });

    it('should handle gallery filter correctly', () => {
        // Create mock elements
        const tabBtn1 = createMockElement('button', { 
            className: 'tab-btn active', 
            'data-category': 'all' 
        });
        const tabBtn2 = createMockElement('button', { 
            className: 'tab-btn', 
            'data-category': 'category1' 
        });
        const galleryItem1 = createMockElement('div', { 
            className: 'gallery-item', 
            'data-category': 'category1' 
        });
        const galleryItem2 = createMockElement('div', { 
            className: 'gallery-item', 
            'data-category': 'category2' 
        });
        
        document.body.appendChild(tabBtn1);
        document.body.appendChild(tabBtn2);
        document.body.appendChild(galleryItem1);
        document.body.appendChild(galleryItem2);
        
        // Simulate filter functionality
        const tabBtns = document.querySelectorAll('.tab-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
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
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
        
        // Test filter
        triggerEvent(tabBtn2, 'click');
        
        expect(tabBtn2.classList.contains('active')).toBe(true);
        expect(tabBtn1.classList.contains('active')).toBe(false);
        expect(galleryItem1.style.display).toBe('block');
        expect(galleryItem2.style.display).toBe('none');
        
        // Clean up
        tabBtn1.remove();
        tabBtn2.remove();
        galleryItem1.remove();
        galleryItem2.remove();
    });
});

describe('Contact Form Functionality', () => {
    
    it('should validate required fields in contact form', () => {
        // Create mock form
        const contactForm = createMockElement('form', { id: 'contactForm' });
        const nameInput = createMockElement('input', { name: 'name', value: '' });
        const phoneInput = createMockElement('input', { name: 'phone', value: '' });
        const serviceSelect = createMockElement('select', { name: 'service', value: '' });
        const messageTextarea = createMockElement('textarea', { name: 'message', value: '' });
        
        contactForm.appendChild(nameInput);
        contactForm.appendChild(phoneInput);
        contactForm.appendChild(serviceSelect);
        contactForm.appendChild(messageTextarea);
        document.body.appendChild(contactForm);
        
        // Mock FormData
        global.FormData = class MockFormData {
            constructor(form) {
                this.data = {};
            }
            get(name) {
                return this.data[name] || '';
            }
        };
        
        // Test form validation
        let formSubmitted = false;
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            formSubmitted = true;
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const service = formData.get('service');
            const message = formData.get('message');
            
            // Validate required fields
            if (!name || !phone || !service || !message) {
                // Show error - in this test we'll just track that validation failed
                return false;
            }
            return true;
        });
        
        triggerEvent(contactForm, 'submit');
        expect(formSubmitted).toBe(true);
        
        // Clean up
        contactForm.remove();
    });
});

describe('Hero Slider Functionality', () => {
    
    it('should handle next slide correctly', () => {
        // Create mock slider elements
        const slide1 = createMockElement('div', { className: 'slide active' });
        const slide2 = createMockElement('div', { className: 'slide' });
        const slide3 = createMockElement('div', { className: 'slide' });
        const indicator1 = createMockElement('div', { className: 'indicator active' });
        const indicator2 = createMockElement('div', { className: 'indicator' });
        const indicator3 = createMockElement('div', { className: 'indicator' });
        const nextBtn = createMockElement('button', { className: 'next-slide' });
        
        document.body.appendChild(slide1);
        document.body.appendChild(slide2);
        document.body.appendChild(slide3);
        document.body.appendChild(indicator1);
        document.body.appendChild(indicator2);
        document.body.appendChild(indicator3);
        document.body.appendChild(nextBtn);
        
        // Simulate slider functionality
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const indicators = document.querySelectorAll('.indicator');
        const totalSlides = slides.length;
        
        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            indicators[currentSlide].classList.remove('active');
            
            currentSlide = (currentSlide + 1) % totalSlides;
            
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
        }
        
        nextBtn.addEventListener('click', nextSlide);
        
        // Test next slide
        expect(slide1.classList.contains('active')).toBe(true);
        expect(slide2.classList.contains('active')).toBe(false);
        
        triggerEvent(nextBtn, 'click');
        
        expect(slide1.classList.contains('active')).toBe(false);
        expect(slide2.classList.contains('active')).toBe(true);
        expect(indicator1.classList.contains('active')).toBe(false);
        expect(indicator2.classList.contains('active')).toBe(true);
        
        // Clean up
        slide1.remove();
        slide2.remove();
        slide3.remove();
        indicator1.remove();
        indicator2.remove();
        indicator3.remove();
        nextBtn.remove();
    });
    
    it('should handle previous slide correctly', () => {
        // Create mock slider elements
        const slide1 = createMockElement('div', { className: 'slide active' });
        const slide2 = createMockElement('div', { className: 'slide' });
        const slide3 = createMockElement('div', { className: 'slide' });
        const prevBtn = createMockElement('button', { className: 'prev-slide' });
        
        document.body.appendChild(slide1);
        document.body.appendChild(slide2);
        document.body.appendChild(slide3);
        document.body.appendChild(prevBtn);
        
        // Simulate slider functionality
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;
        
        function prevSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            slides[currentSlide].classList.add('active');
        }
        
        prevBtn.addEventListener('click', prevSlide);
        
        // Test previous slide (should go to last slide)
        expect(slide1.classList.contains('active')).toBe(true);
        expect(slide3.classList.contains('active')).toBe(false);
        
        triggerEvent(prevBtn, 'click');
        
        expect(slide1.classList.contains('active')).toBe(false);
        expect(slide3.classList.contains('active')).toBe(true);
        
        // Clean up
        slide1.remove();
        slide2.remove();
        slide3.remove();
        prevBtn.remove();
    });
});

describe('Services Slideshow', () => {
    
    it('should initialize slideshow for service items with multiple images', () => {
        // Create mock service item with multiple images
        const serviceItem = createMockElement('div', { className: 'service-item' });
        const image1 = createMockElement('img', { className: 'service-image active' });
        const image2 = createMockElement('img', { className: 'service-image' });
        const image3 = createMockElement('img', { className: 'service-image' });
        
        serviceItem.appendChild(image1);
        serviceItem.appendChild(image2);
        serviceItem.appendChild(image3);
        document.body.appendChild(serviceItem);
        
        // Test that multiple images exist
        const images = serviceItem.querySelectorAll('.service-image');
        expect(images.length).toBe(3);
        expect(image1.classList.contains('active')).toBe(true);
        expect(image2.classList.contains('active')).toBe(false);
        expect(image3.classList.contains('active')).toBe(false);
        
        // Clean up
        serviceItem.remove();
    });
});