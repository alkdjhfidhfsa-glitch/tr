/**
 * Unit Tests for rating-system.js
 */

describe('RatingSystem Class', () => {
    
    let ratingSystem;
    let originalLocalStorage;

    // Mock localStorage before each test
    beforeEach(() => {
        originalLocalStorage = window.localStorage;
        
        // Mock localStorage
        const mockStorage = {
            data: {},
            getItem(key) {
                return this.data[key] || null;
            },
            setItem(key, value) {
                this.data[key] = value;
            },
            removeItem(key) {
                delete this.data[key];
            },
            clear() {
                this.data = {};
            }
        };
        
        Object.defineProperty(window, 'localStorage', {
            value: mockStorage,
            writable: true
        });
        
        // Clear any existing service items
        document.querySelectorAll('.service-item').forEach(item => item.remove());
        
        // Create a fresh rating system instance
        ratingSystem = new RatingSystem();
    });

    afterEach(() => {
        // Restore localStorage
        Object.defineProperty(window, 'localStorage', {
            value: originalLocalStorage,
            writable: true
        });
    });

    it('should initialize with default ratings', () => {
        expect(ratingSystem.ratings).toBeTruthy();
        expect(typeof ratingSystem.ratings).toBe('object');
        
        // Check that default ratings exist
        expect(ratingSystem.ratings['مظلات السيارات']).toBeTruthy();
        expect(ratingSystem.ratings['مظلات الحدائق']).toBeTruthy();
        expect(ratingSystem.ratings['مظلات المسابح']).toBeTruthy();
    });

    it('should load ratings from localStorage if available', () => {
        const testRatings = {
            'Test Service': { total: 20, count: 5, ratings: [4, 4, 4, 4, 4] }
        };
        
        localStorage.setItem('serviceRatings', JSON.stringify(testRatings));
        
        const newRatingSystem = new RatingSystem();
        expect(newRatingSystem.ratings['Test Service']).toEqual(testRatings['Test Service']);
    });

    it('should save ratings to localStorage', () => {
        ratingSystem.ratings['Test Service'] = { total: 15, count: 3, ratings: [5, 5, 5] };
        ratingSystem.saveRatings();
        
        const saved = JSON.parse(localStorage.getItem('serviceRatings'));
        expect(saved['Test Service']).toEqual({ total: 15, count: 3, ratings: [5, 5, 5] });
    });

    it('should track user-rated services', () => {
        expect(ratingSystem.hasUserRated('Test Service')).toBe(false);
        
        // Mark service as rated
        const userRatings = ratingSystem.loadUserRatings();
        userRatings.push('Test Service');
        ratingSystem.saveUserRatings(userRatings);
        
        expect(ratingSystem.hasUserRated('Test Service')).toBe(true);
    });

    it('should create correct rating HTML', () => {
        const html = ratingSystem.createRatingHTML('Test Service');
        
        expect(html).toContain('rating-stars');
        expect(html).toContain('data-service="Test Service"');
        expect(html).toContain('rating-info');
        expect(html).toContain('rating-count');
        expect(html).toContain('rating-average');
        
        // Should contain 5 stars
        const starCount = (html.match(/data-rating="/g) || []).length;
        expect(starCount).toBe(5);
    });

    it('should get service ID from service item', () => {
        // Create mock service item with title
        const serviceItem = createMockElement('div', { className: 'service-item' });
        const title = createMockElement('h3', { textContent: 'Test Service Title' });
        serviceItem.appendChild(title);
        
        const serviceId = ratingSystem.getServiceId(serviceItem, 0);
        expect(serviceId).toBe('Test Service Title');
        
        // Test fallback when no title
        const serviceItemNoTitle = createMockElement('div', { className: 'service-item' });
        const fallbackId = ratingSystem.getServiceId(serviceItemNoTitle, 5);
        expect(fallbackId).toBe('service-5');
        
        serviceItem.remove();
        serviceItemNoTitle.remove();
    });

    it('should add new rating correctly', () => {
        const serviceId = 'Test Service';
        
        // Initially service should not exist
        expect(ratingSystem.ratings[serviceId]).toBeUndefined();
        
        // Add a rating
        ratingSystem.addRating(serviceId, 5);
        
        // Check that rating was added
        expect(ratingSystem.ratings[serviceId]).toBeTruthy();
        expect(ratingSystem.ratings[serviceId].count).toBe(1);
        expect(ratingSystem.ratings[serviceId].total).toBe(5);
        expect(ratingSystem.ratings[serviceId].ratings).toEqual([5]);
        
        // Check that user is marked as having rated
        expect(ratingSystem.hasUserRated(serviceId)).toBe(true);
    });

    it('should prevent duplicate ratings from same user', () => {
        const serviceId = 'Test Service';
        
        // Add first rating
        ratingSystem.addRating(serviceId, 5);
        expect(ratingSystem.ratings[serviceId].count).toBe(1);
        
        // Try to add another rating from same user
        ratingSystem.addRating(serviceId, 4);
        expect(ratingSystem.ratings[serviceId].count).toBe(1); // Should still be 1
    });

    it('should show correct messages', () => {
        // Mock showMessage method
        let lastMessage = '';
        let lastBackgroundColor = '';
        
        ratingSystem.showMessage = function(text, backgroundColor) {
            lastMessage = text;
            lastBackgroundColor = backgroundColor;
        };
        
        // Test thank you message
        ratingSystem.showThankYouMessage();
        expect(lastMessage).toContain('شكراً لك على التقييم');
        expect(lastBackgroundColor).toBe('#4CAF50');
        
        // Test already rated message
        ratingSystem.showAlreadyRatedMessage();
        expect(lastMessage).toContain('لقد قمت بتقييم هذه الخدمة مسبقاً');
        expect(lastBackgroundColor).toBe('#FF9800');
    });

    it('should update star display based on rating', () => {
        // Create mock rating element
        const ratingElement = createMockElement('div', { 
            className: 'rating-stars',
            'data-service': 'Test Service'
        });
        
        // Add 5 stars
        for (let i = 1; i <= 5; i++) {
            const star = createMockElement('span', { 
                className: 'star',
                'data-rating': i.toString()
            });
            ratingElement.appendChild(star);
        }
        
        document.body.appendChild(ratingElement);
        
        // Test with rating of 3.5
        ratingSystem.updateStars(ratingElement, 3.5, false);
        
        const stars = ratingElement.querySelectorAll('.star');
        expect(stars[0].classList.contains('active')).toBe(true); // Star 1
        expect(stars[1].classList.contains('active')).toBe(true); // Star 2
        expect(stars[2].classList.contains('active')).toBe(true); // Star 3
        expect(stars[3].classList.contains('half')).toBe(true);   // Star 4 (half)
        expect(stars[4].classList.contains('active')).toBe(false); // Star 5
        
        ratingElement.remove();
    });

    it('should handle rated stars correctly', () => {
        // Create mock rating element
        const ratingElement = createMockElement('div', { 
            className: 'rating-stars',
            'data-service': 'Test Service'
        });
        
        // Add 5 stars
        for (let i = 1; i <= 5; i++) {
            const star = createMockElement('span', { 
                className: 'star',
                'data-rating': i.toString()
            });
            ratingElement.appendChild(star);
        }
        
        document.body.appendChild(ratingElement);
        
        // Test with rated service
        ratingSystem.updateStars(ratingElement, 4.0, true);
        
        const stars = ratingElement.querySelectorAll('.star');
        stars.forEach(star => {
            expect(star.classList.contains('rated')).toBe(true);
            expect(star.style.cursor).toBe('default');
            expect(star.title).toBe('تم التقييم مسبقاً');
        });
        
        ratingElement.remove();
    });

    it('should initialize ratings for service items', () => {
        // Create mock service item
        const serviceItem = createMockElement('div', { className: 'service-item' });
        const serviceContent = createMockElement('div', { className: 'service-content' });
        const title = createMockElement('h3', { textContent: 'Test Service' });
        
        serviceItem.appendChild(serviceContent);
        serviceItem.appendChild(title);
        document.body.appendChild(serviceItem);
        
        // Add rating to service
        ratingSystem.addRatingToService(serviceItem, 'Test Service');
        
        // Check that rating element was added
        const ratingElement = serviceContent.querySelector('.service-rating');
        expect(ratingElement).toBeTruthy();
        
        // Check that rating HTML was created
        expect(ratingElement.innerHTML).toContain('rating-stars');
        expect(ratingElement.innerHTML).toContain('rating-info');
        
        serviceItem.remove();
    });

    it('should highlight stars on hover', () => {
        // Create mock rating element
        const ratingElement = createMockElement('div', { 
            className: 'rating-stars',
            'data-service': 'Test Service'
        });
        ratingElement.dataset.service = 'Test Service';
        
        // Add 5 stars
        for (let i = 1; i <= 5; i++) {
            const star = createMockElement('span', { 
                className: 'star',
                'data-rating': i.toString()
            });
            ratingElement.appendChild(star);
        }
        
        document.body.appendChild(ratingElement);
        
        // Test highlighting 3 stars
        ratingSystem.highlightStars(ratingElement, 3);
        
        const stars = ratingElement.querySelectorAll('.star');
        expect(stars[0].classList.contains('hover-green')).toBe(true);
        expect(stars[1].classList.contains('hover-green')).toBe(true);
        expect(stars[2].classList.contains('hover-green')).toBe(true);
        expect(stars[3].classList.contains('hover-green')).toBe(false);
        expect(stars[4].classList.contains('hover-green')).toBe(false);
        
        ratingElement.remove();
    });
});

describe('RatingSystem DOM Integration', () => {
    
    it('should initialize rating system on DOM content loaded', () => {
        // Create mock service items
        const serviceItem1 = createMockElement('div', { className: 'service-item' });
        const serviceContent1 = createMockElement('div', { className: 'service-content' });
        const title1 = createMockElement('h3', { textContent: 'Service 1' });
        
        serviceItem1.appendChild(serviceContent1);
        serviceItem1.appendChild(title1);
        document.body.appendChild(serviceItem1);
        
        const serviceItem2 = createMockElement('div', { className: 'service-item' });
        const serviceContent2 = createMockElement('div', { className: 'service-content' });
        const title2 = createMockElement('h3', { textContent: 'Service 2' });
        
        serviceItem2.appendChild(serviceContent2);
        serviceItem2.appendChild(title2);
        document.body.appendChild(serviceItem2);
        
        // Create new rating system instance (simulates DOM content loaded)
        const newRatingSystem = new RatingSystem();
        newRatingSystem.initializeRatings();
        
        // Check that ratings were added to both service items
        const ratingElement1 = serviceContent1.querySelector('.service-rating');
        const ratingElement2 = serviceContent2.querySelector('.service-rating');
        
        expect(ratingElement1).toBeTruthy();
        expect(ratingElement2).toBeTruthy();
        
        serviceItem1.remove();
        serviceItem2.remove();
    });

    it('should handle star click events', () => {
        const serviceId = 'Test Service';
        
        // Create mock rating element with proper structure
        const serviceItem = createMockElement('div', { className: 'service-item' });
        const serviceContent = createMockElement('div', { className: 'service-content' });
        const ratingElement = createMockElement('div', { className: 'service-rating' });
        
        const ratingStars = createMockElement('div', { 
            className: 'rating-stars'
        });
        ratingStars.dataset.service = serviceId;
        
        const ratingInfo = createMockElement('div', { className: 'rating-info' });
        ratingInfo.innerHTML = '<span class="rating-count">0 تقييم</span>، متوسط: <span class="rating-average">0.0</span>';
        
        // Add 5 stars
        for (let i = 1; i <= 5; i++) {
            const star = createMockElement('span', { 
                className: 'star',
                'data-rating': i.toString(),
                textContent: '★'
            });
            ratingStars.appendChild(star);
        }
        
        ratingElement.appendChild(ratingStars);
        ratingElement.appendChild(ratingInfo);
        serviceContent.appendChild(ratingElement);
        serviceItem.appendChild(serviceContent);
        document.body.appendChild(serviceItem);
        
        // Create new rating system and initialize
        const newRatingSystem = new RatingSystem();
        newRatingSystem.initializeRatingEvents(ratingElement, serviceId);
        
        // Test clicking on star 4
        const star4 = ratingStars.children[3]; // 4th star (index 3)
        
        // Mock the addRating method to track if it was called
        let ratingAdded = false;
        let addedRating = 0;
        newRatingSystem.addRating = function(serviceId, rating) {
            ratingAdded = true;
            addedRating = rating;
        };
        
        // Trigger click event
        const clickEvent = new Event('click');
        clickEvent.stopPropagation = () => {};
        clickEvent.preventDefault = () => {};
        star4.dispatchEvent(clickEvent);
        
        expect(ratingAdded).toBe(true);
        expect(addedRating).toBe(4);
        
        serviceItem.remove();
    });
});