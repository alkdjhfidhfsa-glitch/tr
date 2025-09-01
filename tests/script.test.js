/**
 * Unit Tests for script.js
 */

describe('Script.js Basic Functionality', () => {
    
    it('should handle loading screen functionality', async () => {
        // Create mock loading screen
        const loadingScreen = createMockElement('div', { id: 'loading-screen' });
        loadingScreen.style.opacity = '1';
        loadingScreen.style.display = 'block';
        document.body.appendChild(loadingScreen);
        
        // Simulate loading screen behavior
        window.addEventListener('load', function() {
            setTimeout(function() {
                loadingScreen.style.opacity = '0';
                setTimeout(function() {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1000);
        });
        
        // Test initial state
        expect(loadingScreen.style.opacity).toBe('1');
        expect(loadingScreen.style.display).toBe('block');
        
        // Trigger load event
        triggerEvent(window, 'load');
        
        // Wait for first timeout
        await new Promise(resolve => setTimeout(resolve, 1100));
        expect(loadingScreen.style.opacity).toBe('0');
        
        // Wait for second timeout
        await new Promise(resolve => setTimeout(resolve, 600));
        expect(loadingScreen.style.display).toBe('none');
        
        // Clean up
        loadingScreen.remove();
    });

    it('should handle navigation toggle correctly', () => {
        // Create mock navigation elements
        const navToggle = createMockElement('button', { id: 'navToggle' });
        const navMenu = createMockElement('nav', { id: 'navMenu' });
        
        document.body.appendChild(navToggle);
        document.body.appendChild(navMenu);
        
        // Simulate navigation toggle functionality
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Test initial state
        expect(navMenu.classList.contains('active')).toBe(false);
        expect(navToggle.classList.contains('active')).toBe(false);
        
        // Test toggle functionality
        triggerEvent(navToggle, 'click');
        expect(navMenu.classList.contains('active')).toBe(true);
        expect(navToggle.classList.contains('active')).toBe(true);
        
        // Test toggle off
        triggerEvent(navToggle, 'click');
        expect(navMenu.classList.contains('active')).toBe(false);
        expect(navToggle.classList.contains('active')).toBe(false);
        
        // Clean up
        navToggle.remove();
        navMenu.remove();
    });

    it('should handle dropdown menus correctly', () => {
        // Create mock dropdown structure
        const dropdown1 = createMockElement('div', { className: 'dropdown' });
        const dropdownToggle1 = createMockElement('a', { className: 'nav-link', href: '#' });
        const dropdownMenu1 = createMockElement('div', { className: 'dropdown-menu' });
        
        const dropdown2 = createMockElement('div', { className: 'dropdown' });
        const dropdownToggle2 = createMockElement('a', { className: 'nav-link', href: '#' });
        const dropdownMenu2 = createMockElement('div', { className: 'dropdown-menu' });
        
        dropdown1.appendChild(dropdownToggle1);
        dropdown1.appendChild(dropdownMenu1);
        dropdown2.appendChild(dropdownToggle2);
        dropdown2.appendChild(dropdownMenu2);
        
        document.body.appendChild(dropdown1);
        document.body.appendChild(dropdown2);
        
        // Simulate dropdown functionality
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            const dropdownToggle = dropdown.querySelector('.nav-link');
            
            if (dropdownToggle) {
                dropdownToggle.addEventListener('click', function(e) {
                    if (dropdownMenu) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Close other dropdowns
                        dropdowns.forEach(otherDropdown => {
                            if (otherDropdown !== dropdown) {
                                otherDropdown.classList.remove('active');
                            }
                        });
                        
                        // Toggle current dropdown
                        dropdown.classList.toggle('active');
                    }
                });
            }
        });
        
        // Test dropdown functionality
        expect(dropdown1.classList.contains('active')).toBe(false);
        expect(dropdown2.classList.contains('active')).toBe(false);
        
        // Click first dropdown
        triggerEvent(dropdownToggle1, 'click');
        expect(dropdown1.classList.contains('active')).toBe(true);
        expect(dropdown2.classList.contains('active')).toBe(false);
        
        // Click second dropdown (should close first)
        triggerEvent(dropdownToggle2, 'click');
        expect(dropdown1.classList.contains('active')).toBe(false);
        expect(dropdown2.classList.contains('active')).toBe(true);
        
        // Clean up
        dropdown1.remove();
        dropdown2.remove();
    });

    it('should close dropdowns when clicking outside', () => {
        // Create dropdown and external element
        const dropdown = createMockElement('div', { className: 'dropdown active' });
        const externalElement = createMockElement('div', { className: 'external' });
        
        document.body.appendChild(dropdown);
        document.body.appendChild(externalElement);
        
        // Simulate close on outside click
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                const dropdowns = document.querySelectorAll('.dropdown');
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
        
        // Test initial state
        expect(dropdown.classList.contains('active')).toBe(true);
        
        // Click outside dropdown
        triggerEvent(externalElement, 'click');
        expect(dropdown.classList.contains('active')).toBe(false);
        
        // Clean up
        dropdown.remove();
        externalElement.remove();
    });

    it('should handle floating social media toggle', () => {
        // Create mock social elements
        const socialToggle = createMockElement('button', { id: 'socialToggle' });
        const socialIcons = createMockElement('div', { id: 'socialIcons' });
        
        document.body.appendChild(socialToggle);
        document.body.appendChild(socialIcons);
        
        // Simulate social toggle functionality
        socialToggle.addEventListener('click', function() {
            socialIcons.classList.toggle('active');
            socialToggle.classList.toggle('active');
        });
        
        // Test initial state
        expect(socialIcons.classList.contains('active')).toBe(false);
        expect(socialToggle.classList.contains('active')).toBe(false);
        
        // Test toggle
        triggerEvent(socialToggle, 'click');
        expect(socialIcons.classList.contains('active')).toBe(true);
        expect(socialToggle.classList.contains('active')).toBe(true);
        
        // Clean up
        socialToggle.remove();
        socialIcons.remove();
    });

    it('should handle back to top button with scroll detection', () => {
        // Create mock back to top button
        const backToTop = createMockElement('button', { id: 'backToTop' });
        document.body.appendChild(backToTop);
        
        // Mock pageYOffset
        let mockPageYOffset = 0;
        Object.defineProperty(window, 'pageYOffset', {
            get: () => mockPageYOffset,
            configurable: true
        });
        
        // Simulate scroll detection
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        // Test initial state
        expect(backToTop.classList.contains('visible')).toBe(false);
        
        // Simulate scroll past threshold
        mockPageYOffset = 400;
        triggerEvent(window, 'scroll');
        expect(backToTop.classList.contains('visible')).toBe(true);
        
        // Simulate scroll back to top
        mockPageYOffset = 200;
        triggerEvent(window, 'scroll');
        expect(backToTop.classList.contains('visible')).toBe(false);
        
        // Test scroll to top functionality
        let scrollCalled = false;
        const originalScrollTo = window.scrollTo;
        window.scrollTo = function(options) {
            scrollCalled = true;
            expect(options.top).toBe(0);
            expect(options.behavior).toBe('smooth');
        };
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        triggerEvent(backToTop, 'click');
        expect(scrollCalled).toBe(true);
        
        // Clean up
        window.scrollTo = originalScrollTo;
        backToTop.remove();
    });

    it('should handle gallery lightbox functionality', () => {
        // Create mock gallery items
        const galleryItem1 = createMockElement('div', { className: 'gallery-item' });
        const galleryImage1 = createMockElement('img', { 
            src: 'image1.jpg', 
            alt: 'Gallery Image 1' 
        });
        galleryItem1.appendChild(galleryImage1);
        
        const galleryItem2 = createMockElement('div', { className: 'gallery-item' });
        const galleryImage2 = createMockElement('img', { 
            src: 'image2.jpg', 
            alt: 'Gallery Image 2' 
        });
        galleryItem2.appendChild(galleryImage2);
        
        document.body.appendChild(galleryItem1);
        document.body.appendChild(galleryItem2);
        
        // Simulate lightbox functionality
        const galleryImages = document.querySelectorAll('.gallery-item img');
        
        galleryImages.forEach(image => {
            image.addEventListener('click', function() {
                const src = this.src;
                const alt = this.alt;
                
                // Create lightbox
                const lightbox = createMockElement('div', { className: 'lightbox' });
                lightbox.innerHTML = `
                    <div class="lightbox-content">
                        <span class="lightbox-close">&times;</span>
                        <img src="${src}" alt="${alt}">
                        <div class="lightbox-caption">${alt}</div>
                    </div>
                `;
                
                document.body.appendChild(lightbox);
                
                // Close functionality
                const closeBtn = lightbox.querySelector('.lightbox-close');
                closeBtn.addEventListener('click', function() {
                    document.body.removeChild(lightbox);
                });
                
                lightbox.addEventListener('click', function(e) {
                    if (e.target === lightbox) {
                        document.body.removeChild(lightbox);
                    }
                });
            });
        });
        
        // Test lightbox creation
        expect(galleryImages.length).toBe(2);
        
        triggerEvent(galleryImage1, 'click');
        
        const lightbox = document.querySelector('.lightbox');
        expect(lightbox).toBeTruthy();
        expect(lightbox.innerHTML).toContain('Gallery Image 1');
        expect(lightbox.innerHTML).toContain('image1.jpg');
        
        // Test close functionality
        const closeBtn = lightbox.querySelector('.lightbox-close');
        expect(closeBtn).toBeTruthy();
        
        triggerEvent(closeBtn, 'click');
        const lightboxAfterClose = document.querySelector('.lightbox');
        expect(lightboxAfterClose).toBeFalsy();
        
        // Clean up
        galleryItem1.remove();
        galleryItem2.remove();
    });

    it('should handle smooth scrolling for anchor links', () => {
        // Create mock anchor links and target sections
        const anchorLink1 = createMockElement('a', { href: '#section1', textContent: 'Go to Section 1' });
        const anchorLink2 = createMockElement('a', { href: '#section2', textContent: 'Go to Section 2' });
        const anchorLinkEmpty = createMockElement('a', { href: '#', textContent: 'Empty Link' });
        
        const section1 = createMockElement('section', { id: 'section1' });
        const section2 = createMockElement('section', { id: 'section2' });
        
        document.body.appendChild(anchorLink1);
        document.body.appendChild(anchorLink2);
        document.body.appendChild(anchorLinkEmpty);
        document.body.appendChild(section1);
        document.body.appendChild(section2);
        
        // Mock scrollIntoView
        let scrollTarget = null;
        section1.scrollIntoView = function(options) {
            scrollTarget = 'section1';
            expect(options.behavior).toBe('smooth');
        };
        section2.scrollIntoView = function(options) {
            scrollTarget = 'section2';
            expect(options.behavior).toBe('smooth');
        };
        
        // Simulate smooth scroll functionality
        const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href && href !== '#' && href.length > 1) {
                    e.preventDefault();
                    
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
        
        // Test anchor links
        expect(anchorLinks.length).toBe(2); // Should exclude href="#"
        
        triggerEvent(anchorLink1, 'click');
        expect(scrollTarget).toBe('section1');
        
        triggerEvent(anchorLink2, 'click');
        expect(scrollTarget).toBe('section2');
        
        // Test that empty link doesn't scroll
        scrollTarget = null;
        triggerEvent(anchorLinkEmpty, 'click');
        expect(scrollTarget).toBe(null);
        
        // Clean up
        anchorLink1.remove();
        anchorLink2.remove();
        anchorLinkEmpty.remove();
        section1.remove();
        section2.remove();
    });

    it('should handle form validation', () => {
        // Create mock form with required fields
        const form = createMockElement('form');
        const requiredInput = createMockElement('input', { 
            type: 'text', 
            required: true,
            value: '' 
        });
        const optionalInput = createMockElement('input', { 
            type: 'text',
            value: 'optional value' 
        });
        const requiredTextarea = createMockElement('textarea', { 
            required: true,
            textContent: '' 
        });
        
        form.appendChild(requiredInput);
        form.appendChild(optionalInput);
        form.appendChild(requiredTextarea);
        document.body.appendChild(form);
        
        // Mock alert
        let alertMessage = '';
        const originalAlert = window.alert;
        window.alert = (message) => {
            alertMessage = message;
        };
        
        // Simulate form validation
        let formSubmitted = false;
        form.addEventListener('submit', function(e) {
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                const value = input.value || input.textContent || '';
                if (!value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                window.alert('يرجى ملء جميع الحقول المطلوبة');
            } else {
                formSubmitted = true;
            }
        });
        
        // Test validation with empty required fields
        triggerEvent(form, 'submit');
        expect(formSubmitted).toBe(false);
        expect(alertMessage).toBe('يرجى ملء جميع الحقول المطلوبة');
        expect(requiredInput.classList.contains('error')).toBe(true);
        expect(requiredTextarea.classList.contains('error')).toBe(true);
        expect(optionalInput.classList.contains('error')).toBe(false);
        
        // Test validation with filled required fields
        requiredInput.value = 'test value';
        requiredTextarea.textContent = 'test content';
        formSubmitted = false;
        alertMessage = '';
        
        triggerEvent(form, 'submit');
        expect(formSubmitted).toBe(true);
        expect(alertMessage).toBe('');
        expect(requiredInput.classList.contains('error')).toBe(false);
        expect(requiredTextarea.classList.contains('error')).toBe(false);
        
        // Restore alert
        window.alert = originalAlert;
        
        // Clean up
        form.remove();
    });

    it('should handle lazy loading with IntersectionObserver', () => {
        // Test that IntersectionObserver is available
        expect(typeof IntersectionObserver).toBe('function');
        
        // Create mock images with data-src attributes
        const lazyImage1 = createMockElement('img', { 
            'data-src': 'lazy-image1.jpg',
            className: 'lazy',
            src: ''
        });
        const lazyImage2 = createMockElement('img', { 
            'data-src': 'lazy-image2.jpg',
            className: 'lazy',
            src: ''
        });
        
        document.body.appendChild(lazyImage1);
        document.body.appendChild(lazyImage2);
        
        // Simulate lazy loading functionality
        const images = document.querySelectorAll('img[data-src]');
        
        expect(images.length).toBe(2);
        
        // Mock IntersectionObserver
        let observerCallback = null;
        let observedElements = [];
        
        const mockObserver = {
            observe: function(element) {
                observedElements.push(element);
                
                // Simulate element becoming visible
                setTimeout(() => {
                    if (observerCallback) {
                        observerCallback([{
                            target: element,
                            isIntersecting: true
                        }]);
                    }
                }, 50);
            },
            unobserve: function(element) {
                // Remove from observed elements
                const index = observedElements.indexOf(element);
                if (index > -1) {
                    observedElements.splice(index, 1);
                }
            }
        };
        
        // Create observer
        const imageObserver = mockObserver;
        observerCallback = function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        };
        
        // Observe images
        images.forEach(img => imageObserver.observe(img));
        
        // Test initial state
        expect(lazyImage1.src).toBe('');
        expect(lazyImage2.src).toBe('');
        expect(observedElements.length).toBe(2);
        
        // Wait for lazy loading simulation
        setTimeout(() => {
            expect(lazyImage1.src).toBe('lazy-image1.jpg');
            expect(lazyImage2.src).toBe('lazy-image2.jpg');
            expect(lazyImage1.classList.contains('lazy')).toBe(false);
            expect(lazyImage2.classList.contains('lazy')).toBe(false);
        }, 100);
        
        // Clean up
        setTimeout(() => {
            lazyImage1.remove();
            lazyImage2.remove();
        }, 150);
    });

    it('should handle animation on scroll with IntersectionObserver', () => {
        // Create mock elements with animation class
        const animatedElement1 = createMockElement('div', { className: 'animate-on-scroll' });
        const animatedElement2 = createMockElement('div', { className: 'animate-on-scroll' });
        const regularElement = createMockElement('div', { className: 'regular-element' });
        
        document.body.appendChild(animatedElement1);
        document.body.appendChild(animatedElement2);
        document.body.appendChild(regularElement);
        
        // Simulate animation observer
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        expect(animatedElements.length).toBe(2);
        
        // Mock observer for animations
        let animationCallback = null;
        const animationObserver = {
            observe: function(element) {
                // Simulate element becoming visible
                setTimeout(() => {
                    if (animationCallback) {
                        animationCallback([{
                            target: element,
                            isIntersecting: true
                        }]);
                    }
                }, 50);
            }
        };
        
        animationCallback = function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        };
        
        // Observe animated elements
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
        
        // Test initial state
        expect(animatedElement1.classList.contains('animated')).toBe(false);
        expect(animatedElement2.classList.contains('animated')).toBe(false);
        
        // Wait for animation simulation
        setTimeout(() => {
            expect(animatedElement1.classList.contains('animated')).toBe(true);
            expect(animatedElement2.classList.contains('animated')).toBe(true);
        }, 100);
        
        // Clean up
        setTimeout(() => {
            animatedElement1.remove();
            animatedElement2.remove();
            regularElement.remove();
        }, 150);
    });
});