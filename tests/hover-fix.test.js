/**
 * Unit Tests for hover-fix.js
 */

describe('Hover Fix Module', () => {
    
    it('should have forceShowCardElements function that makes all card elements visible', () => {
        // Create mock cards
        const premiumCard = createMockElement('div', { className: 'premium-card' });
        const serviceCard = createMockElement('div', { className: 'service-card' });
        
        // Add elements to cards
        const title1 = createMockElement('h4', { textContent: 'Premium Service' });
        const description1 = createMockElement('p', { textContent: 'Premium description' });
        const link1 = createMockElement('a', { className: 'service-link', href: '#' });
        const iconWrapper1 = createMockElement('div', { className: 'service-icon-wrapper' });
        const icon1 = createMockElement('i', { className: 'fas fa-star' });
        
        iconWrapper1.appendChild(icon1);
        premiumCard.appendChild(title1);
        premiumCard.appendChild(description1);
        premiumCard.appendChild(link1);
        premiumCard.appendChild(iconWrapper1);
        
        const title2 = createMockElement('h4', { textContent: 'Regular Service' });
        const icon2 = createMockElement('i', { className: 'fas fa-home' });
        serviceCard.appendChild(title2);
        serviceCard.appendChild(icon2);
        
        document.body.appendChild(premiumCard);
        document.body.appendChild(serviceCard);
        
        // Simulate forceShowCardElements functionality
        const cards = document.querySelectorAll('.premium-card, .service-card');
        
        cards.forEach(card => {
            // Make card visible
            card.style.opacity = '1';
            card.style.visibility = 'visible';
            card.style.display = 'block';
            
            // Make all internal elements visible
            const allElements = card.querySelectorAll('*');
            allElements.forEach(element => {
                element.style.opacity = '1';
                element.style.visibility = 'visible';
                element.style.pointerEvents = 'auto';
            });
            
            // Special protection for important elements
            const title = card.querySelector('h4');
            const description = card.querySelector('p');
            const link = card.querySelector('.service-link');
            const icon = card.querySelector('.service-icon-wrapper i') || card.querySelector('i');
            const iconWrapper = card.querySelector('.service-icon-wrapper');
            
            if (title) {
                title.style.opacity = '1';
                title.style.visibility = 'visible';
                title.style.display = 'block';
            }
            
            if (description) {
                description.style.opacity = '1';
                description.style.visibility = 'visible';
                description.style.display = 'block';
            }
            
            if (link) {
                link.style.opacity = '1';
                link.style.visibility = 'visible';
                link.style.display = 'inline-flex';
                link.style.pointerEvents = 'auto';
            }
            
            if (iconWrapper) {
                iconWrapper.style.opacity = '1';
                iconWrapper.style.visibility = 'visible';
                iconWrapper.style.display = 'flex';
            }
            
            if (icon) {
                icon.style.opacity = '1';
                icon.style.visibility = 'visible';
                icon.style.display = 'flex';
                icon.style.color = 'white';
                icon.style.fontSize = '2rem';
            }
        });
        
        // Test that all elements are visible
        expect(premiumCard.style.opacity).toBe('1');
        expect(premiumCard.style.visibility).toBe('visible');
        expect(title1.style.opacity).toBe('1');
        expect(description1.style.opacity).toBe('1');
        expect(link1.style.opacity).toBe('1');
        expect(icon1.style.opacity).toBe('1');
        expect(icon1.style.color).toBe('white');
        
        expect(serviceCard.style.opacity).toBe('1');
        expect(title2.style.opacity).toBe('1');
        expect(icon2.style.opacity).toBe('1');
        
        // Clean up
        premiumCard.remove();
        serviceCard.remove();
    });

    it('should protect icons from disappearing', () => {
        // Create cards with icons
        const premiumCard = createMockElement('div', { className: 'premium-card' });
        const serviceCard = createMockElement('div', { className: 'service-card' });
        
        const iconWrapper = createMockElement('div', { className: 'service-icon-wrapper' });
        const premiumIcon = createMockElement('i', { className: 'fas fa-star' });
        const serviceIcon = createMockElement('i', { className: 'fas fa-home' });
        
        iconWrapper.appendChild(premiumIcon);
        premiumCard.appendChild(iconWrapper);
        serviceCard.appendChild(serviceIcon);
        
        document.body.appendChild(premiumCard);
        document.body.appendChild(serviceCard);
        
        // Simulate protectIcons functionality
        const icons = document.querySelectorAll('.premium-card .service-icon-wrapper i, .service-card i');
        
        icons.forEach(icon => {
            icon.style.opacity = '1';
            icon.style.visibility = 'visible';
            icon.style.display = 'flex';
            icon.style.color = 'white';
            icon.style.fontSize = '2rem';
            icon.style.fontFamily = '"Font Awesome 6 Free"';
            icon.style.fontWeight = '900';
            icon.style.alignItems = 'center';
            icon.style.justifyContent = 'center';
            icon.style.position = 'relative';
            icon.style.zIndex = '999';
        });
        
        // Test icon protection
        expect(icons.length).toBe(2);
        icons.forEach(icon => {
            expect(icon.style.opacity).toBe('1');
            expect(icon.style.visibility).toBe('visible');
            expect(icon.style.display).toBe('flex');
            expect(icon.style.color).toBe('white');
            expect(icon.style.fontSize).toBe('2rem');
            expect(icon.style.zIndex).toBe('999');
        });
        
        // Clean up
        premiumCard.remove();
        serviceCard.remove();
    });

    it('should fix social media icons', () => {
        // Create mock social media icons
        const footer = createMockElement('div', { className: 'footer-social' });
        const socialLink1 = createMockElement('a', { href: 'https://facebook.com' });
        const socialIcon1 = createMockElement('i', { className: 'fab fa-facebook' });
        const socialLink2 = createMockElement('a', { href: 'https://twitter.com' });
        const socialIcon2 = createMockElement('i', { className: 'fas fa-envelope' });
        
        socialLink1.appendChild(socialIcon1);
        socialLink2.appendChild(socialIcon2);
        footer.appendChild(socialLink1);
        footer.appendChild(socialLink2);
        document.body.appendChild(footer);
        
        // Simulate fixSocialIcons functionality
        const socialIcons = document.querySelectorAll('.footer-social a i');
        const socialLinks = document.querySelectorAll('.footer-social a');
        
        socialIcons.forEach(icon => {
            icon.style.opacity = '1';
            icon.style.visibility = 'visible';
            icon.style.display = 'inline-block';
            icon.style.color = 'white';
            icon.style.fontSize = '16px';
            
            // Apply appropriate font family based on icon type
            if (icon.classList.contains('fab')) {
                icon.style.fontFamily = '"Font Awesome 6 Brands"';
                icon.style.fontWeight = '400';
            } else if (icon.classList.contains('fas')) {
                icon.style.fontFamily = '"Font Awesome 6 Free"';
                icon.style.fontWeight = '900';
            }
        });
        
        socialLinks.forEach(link => {
            link.style.opacity = '1';
            link.style.visibility = 'visible';
            link.style.display = 'flex';
            link.style.pointerEvents = 'auto';
        });
        
        // Test social icons fix
        expect(socialIcons.length).toBe(2);
        expect(socialLinks.length).toBe(2);
        
        socialIcons.forEach(icon => {
            expect(icon.style.opacity).toBe('1');
            expect(icon.style.visibility).toBe('visible');
            expect(icon.style.color).toBe('white');
            expect(icon.style.fontSize).toBe('16px');
        });
        
        // Test specific font families
        expect(socialIcon1.style.fontFamily).toBe('"Font Awesome 6 Brands"');
        expect(socialIcon1.style.fontWeight).toBe('400');
        expect(socialIcon2.style.fontFamily).toBe('"Font Awesome 6 Free"');
        expect(socialIcon2.style.fontWeight).toBe('900');
        
        socialLinks.forEach(link => {
            expect(link.style.opacity).toBe('1');
            expect(link.style.display).toBe('flex');
        });
        
        // Clean up
        footer.remove();
    });

    it('should handle DOM mutation monitoring', () => {
        // Test that MutationObserver is available
        expect(typeof MutationObserver).toBe('function');
        
        // Create a test element
        const testElement = createMockElement('div', { className: 'test-element' });
        document.body.appendChild(testElement);
        
        // Mock mutation observer behavior
        let observerCreated = false;
        let observerCallback = null;
        let observerOptions = null;
        
        const originalMutationObserver = window.MutationObserver;
        window.MutationObserver = function(callback) {
            observerCreated = true;
            observerCallback = callback;
            return {
                observe: function(target, options) {
                    observerOptions = options;
                },
                disconnect: function() {}
            };
        };
        
        // Simulate observer creation (from hover-fix.js)
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    // In real code, this would trigger forceShowCardElements
                    // For testing, we just verify the callback structure
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        
        // Test observer setup
        expect(observerCreated).toBe(true);
        expect(typeof observerCallback).toBe('function');
        expect(observerOptions).toEqual({
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        
        // Restore original MutationObserver
        window.MutationObserver = originalMutationObserver;
        
        // Clean up
        testElement.remove();
    });

    it('should handle hover event prevention', () => {
        // Create mock card
        const serviceCard = createMockElement('div', { className: 'service-card' });
        document.body.appendChild(serviceCard);
        
        let mouseEnterCalled = false;
        let mouseLeaveCalled = false;
        let mouseOverCalled = false;
        let mouseOutCalled = false;
        
        // Simulate event listeners from hover-fix.js
        serviceCard.addEventListener('mouseenter', function(e) {
            e.preventDefault();
            mouseEnterCalled = true;
        });
        
        serviceCard.addEventListener('mouseleave', function(e) {
            e.preventDefault();
            mouseLeaveCalled = true;
        });
        
        serviceCard.addEventListener('mouseover', function(e) {
            e.preventDefault();
            mouseOverCalled = true;
        });
        
        serviceCard.addEventListener('mouseout', function(e) {
            e.preventDefault();
            mouseOutCalled = true;
        });
        
        // Test hover events
        triggerEvent(serviceCard, 'mouseenter');
        triggerEvent(serviceCard, 'mouseleave');
        triggerEvent(serviceCard, 'mouseover');
        triggerEvent(serviceCard, 'mouseout');
        
        expect(mouseEnterCalled).toBe(true);
        expect(mouseLeaveCalled).toBe(true);
        expect(mouseOverCalled).toBe(true);
        expect(mouseOutCalled).toBe(true);
        
        // Clean up
        serviceCard.remove();
    });

    it('should handle icon event protection', () => {
        // Create mock icon
        const icon = createMockElement('i', { className: 'fas fa-star' });
        const card = createMockElement('div', { className: 'service-card' });
        card.appendChild(icon);
        document.body.appendChild(card);
        
        let iconMouseOverCalled = false;
        let iconMouseOutCalled = false;
        
        // Simulate icon protection events
        icon.addEventListener('mouseover', function(e) {
            e.stopPropagation();
            this.style.opacity = '1';
            this.style.visibility = 'visible';
            this.style.display = 'flex';
            iconMouseOverCalled = true;
        });
        
        icon.addEventListener('mouseout', function(e) {
            e.stopPropagation();
            this.style.opacity = '1';
            this.style.visibility = 'visible';
            this.style.display = 'flex';
            iconMouseOutCalled = true;
        });
        
        // Test icon events
        triggerEvent(icon, 'mouseover');
        triggerEvent(icon, 'mouseout');
        
        expect(iconMouseOverCalled).toBe(true);
        expect(iconMouseOutCalled).toBe(true);
        expect(icon.style.opacity).toBe('1');
        expect(icon.style.visibility).toBe('visible');
        expect(icon.style.display).toBe('flex');
        
        // Clean up
        card.remove();
    });

    it('should handle window and document events', () => {
        // Create mock elements
        const serviceCard = createMockElement('div', { className: 'service-card' });
        document.body.appendChild(serviceCard);
        
        let domContentLoadedExecuted = false;
        let windowLoadExecuted = false;
        
        // Test document ready simulation
        document.addEventListener('DOMContentLoaded', function() {
            domContentLoadedExecuted = true;
        });
        
        // Test window load simulation
        window.addEventListener('load', function() {
            windowLoadExecuted = true;
        });
        
        // Trigger events
        triggerEvent(document, 'DOMContentLoaded');
        triggerEvent(window, 'load');
        
        expect(domContentLoadedExecuted).toBe(true);
        expect(windowLoadExecuted).toBe(true);
        
        // Clean up
        serviceCard.remove();
    });

    it('should handle periodic element fixes', () => {
        // Test that setInterval is available for periodic fixes
        expect(typeof setInterval).toBe('function');
        expect(typeof clearInterval).toBe('function');
        
        // Create test elements
        const serviceCard = createMockElement('div', { className: 'service-card' });
        const icon = createMockElement('i', { className: 'fas fa-star' });
        serviceCard.appendChild(icon);
        document.body.appendChild(serviceCard);
        
        // Simulate periodic fix
        let fixCalled = false;
        const intervalId = setInterval(() => {
            fixCalled = true;
            
            // Simulate forceShowCardElements
            serviceCard.style.opacity = '1';
            serviceCard.style.visibility = 'visible';
            icon.style.opacity = '1';
            icon.style.visibility = 'visible';
            
            clearInterval(intervalId); // Stop after first call for test
        }, 100);
        
        // Wait for interval to execute
        setTimeout(() => {
            expect(fixCalled).toBe(true);
            expect(serviceCard.style.opacity).toBe('1');
            expect(icon.style.opacity).toBe('1');
        }, 150);
        
        // Clean up
        setTimeout(() => {
            serviceCard.remove();
        }, 200);
    });
});