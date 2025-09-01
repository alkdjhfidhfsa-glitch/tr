// نظام التقييم بالنجوم
class RatingSystem {
    constructor() {
        this.ratings = this.loadRatings();
        this.initializeRatings();
    }

    // تحميل التقييمات من localStorage
    loadRatings() {
        const saved = localStorage.getItem('serviceRatings');
        if (saved) {
            return JSON.parse(saved);
        }

        // تقييمات افتراضية للخدمات
        return this.getDefaultRatings();
    }

    // تحميل التقييمات المحفوظة للمستخدم الحالي
    loadUserRatings() {
        const saved = localStorage.getItem('userRatedServices');
        return saved ? JSON.parse(saved) : [];
    }

    // حفظ التقييمات المحفوظة للمستخدم الحالي
    saveUserRatings(ratedServices) {
        localStorage.setItem('userRatedServices', JSON.stringify(ratedServices));
    }

    // التحقق من أن المستخدم قيم هذه الخدمة من قبل
    hasUserRated(serviceId) {
        const userRatings = this.loadUserRatings();
        return userRatings.includes(serviceId);
    }

    // تقييمات افتراضية واقعية
    getDefaultRatings() {
        return {
            'مظلات السيارات': { total: 62, count: 15, ratings: [5,4,5,4,5,3,4,5,4,5,4,5,3,4,5] },
            'مظلات الحدائق': { total: 58, count: 14, ratings: [4,5,4,4,5,3,4,5,4,4,5,4,3,5] },
            'مظلات المسابح': { total: 51, count: 12, ratings: [4,5,4,4,5,4,4,3,5,4,4,5] },
            'مظلات المدارس': { total: 67, count: 16, ratings: [5,4,5,4,5,4,4,5,4,5,4,5,4,3,5,4] },
            'مظلات بي في سي': { total: 45, count: 11, ratings: [4,5,4,4,3,5,4,4,5,3,4] },
            'السواتر الخشبية': { total: 53, count: 13, ratings: [4,5,4,4,5,3,4,5,4,4,5,4,3] },
            'بيوت الشعر': { total: 71, count: 17, ratings: [5,4,5,5,4,5,4,5,4,5,4,5,3,4,5,4,5] },
            'الهناجر': { total: 48, count: 12, ratings: [4,5,4,4,3,5,4,4,5,3,4,4] },
            'القرميد': { total: 42, count: 10, ratings: [4,5,4,4,3,5,4,4,3,4] },
            'الكلادينج': { total: 39, count: 9, ratings: [4,5,4,4,3,5,4,4,3] },
            'مظلات كابولي': { total: 56, count: 13, ratings: [4,5,4,5,4,5,4,4,5,3,4,5,4] },
            'مظلات المساجد': { total: 74, count: 18, ratings: [5,4,5,5,4,5,4,5,4,5,4,5,4,4,5,4,5,3] },
            'مظلات الأسواق': { total: 49, count: 11, ratings: [4,5,4,4,5,4,4,5,4,4,5] },
            'مظلات البولي إيثيلين': { total: 44, count: 10, ratings: [4,5,4,4,5,4,4,5,4,4] },
            'مظلات مخروطية': { total: 52, count: 12, ratings: [4,5,4,5,4,4,5,4,4,5,4,4] },
            'مظلات هرمية': { total: 59, count: 14, ratings: [4,5,4,5,4,5,4,4,5,4,4,5,3,4] },
            'مظلات معلقة': { total: 47, count: 11, ratings: [4,5,4,4,5,4,4,5,3,4,4] },
            'سواتر الحديد': { total: 61, count: 15, ratings: [4,5,4,5,4,5,4,4,5,4,4,5,3,4,4] },
            'السواتر القماشية': { total: 43, count: 10, ratings: [4,5,4,4,5,4,4,3,4,4] },
            'سواتر المدارس': { total: 65, count: 16, ratings: [4,5,4,5,4,5,4,4,5,4,4,5,4,3,4,4] },
            'مظلات الشد الانشائي': { total: 68, count: 16, ratings: [5,4,5,4,5,4,4,5,4,5,4,5,3,4,4,4] },
            'الشبوك': { total: 38, count: 9, ratings: [4,5,4,4,3,5,4,4,3] },
            'مظلات خشبية': { total: 55, count: 13, ratings: [4,5,4,5,4,4,5,4,4,5,3,4,4] }
        };
    }

    // حفظ التقييمات في localStorage
    saveRatings() {
        localStorage.setItem('serviceRatings', JSON.stringify(this.ratings));
    }

    // تهيئة نظام التقييم لجميع الخدمات
    initializeRatings() {
        const serviceItems = document.querySelectorAll('.service-item');
        
        serviceItems.forEach((item, index) => {
            const serviceId = this.getServiceId(item, index);
            this.addRatingToService(item, serviceId);
        });
    }

    // الحصول على معرف الخدمة
    getServiceId(item, index) {
        const title = item.querySelector('h3');
        if (title) {
            return title.textContent.trim();
        }
        return `service-${index}`;
    }

    // إضافة نظام التقييم للخدمة
    addRatingToService(serviceItem, serviceId) {
        const serviceContent = serviceItem.querySelector('.service-content');
        if (!serviceContent) return;

        // إنشاء عنصر التقييم
        const ratingElement = document.createElement('div');
        ratingElement.className = 'service-rating';
        ratingElement.innerHTML = this.createRatingHTML(serviceId);

        // إضافة التقييم للمحتوى
        serviceContent.appendChild(ratingElement);

        // تهيئة الأحداث
        this.initializeRatingEvents(ratingElement, serviceId);
        
        // تحديث العرض
        this.updateRatingDisplay(serviceId);
    }

    // إنشاء HTML للتقييم
    createRatingHTML(serviceId) {
        return `
            <div class="rating-stars" data-service="${serviceId}">
                ${[1, 2, 3, 4, 5].map(i => 
                    `<span class="star" data-rating="${i}">★</span>`
                ).join('')}
            </div>
            <div class="rating-info">
                <span class="rating-count">0 تقييم</span>، 
                متوسط: <span class="rating-average">0.0</span>
            </div>
        `;
    }

    // تهيئة أحداث التقييم
    initializeRatingEvents(ratingElement, serviceId) {
        const stars = ratingElement.querySelectorAll('.star');
        
        stars.forEach(star => {
            // منع انتشار الحدث للبطاقة الأساسية
            star.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                const rating = parseInt(star.dataset.rating);
                this.addRating(serviceId, rating);
                
                // تأثير النقر
                star.classList.add('star-clicked');
                setTimeout(() => star.classList.remove('star-clicked'), 300);
            });

            // تأثير التمرير
            star.addEventListener('mouseenter', () => {
                this.highlightStars(ratingElement, parseInt(star.dataset.rating));
            });
        });

        // إعادة تعيين التمييز عند مغادرة منطقة النجوم
        ratingElement.addEventListener('mouseleave', () => {
            // إزالة التأثير الأخضر
            const stars = ratingElement.querySelectorAll('.star');
            stars.forEach(star => {
                star.classList.remove('hover-green');
            });

            // إعادة العرض الأصلي
            this.updateRatingDisplay(serviceId);
        });
    }

    // تمييز النجوم عند التمرير (باللون الأخضر)
    highlightStars(ratingElement, rating) {
        const stars = ratingElement.querySelectorAll('.star');
        const serviceId = ratingElement.dataset.service;
        const hasRated = this.hasUserRated(serviceId);

        stars.forEach((star, index) => {
            // إزالة جميع الكلاسات المؤقتة
            star.classList.remove('hover-green');

            if (!hasRated && index < rating) {
                // إضافة التأثير الأخضر للنجوم غير المقيمة
                star.classList.add('hover-green');
            }
        });
    }

    // إضافة تقييم جديد
    addRating(serviceId, rating) {
        // التحقق من أن المستخدم لم يقيم من قبل
        if (this.hasUserRated(serviceId)) {
            this.showAlreadyRatedMessage();
            return;
        }

        if (!this.ratings[serviceId]) {
            this.ratings[serviceId] = {
                total: 0,
                count: 0,
                ratings: []
            };
        }

        // إضافة التقييم
        this.ratings[serviceId].ratings.push(rating);
        this.ratings[serviceId].count++;
        this.ratings[serviceId].total = this.ratings[serviceId].ratings.reduce((a, b) => a + b, 0);

        // حفظ التقييمات
        this.saveRatings();

        // إضافة الخدمة لقائمة المقيمة من قبل المستخدم
        const userRatings = this.loadUserRatings();
        userRatings.push(serviceId);
        this.saveUserRatings(userRatings);

        // تحديث العرض لإظهار أنه تم التقييم
        this.updateRatingDisplay(serviceId);

        // إظهار رسالة شكر
        this.showThankYouMessage();
    }

    // تحديث عرض التقييم
    updateRatingDisplay(serviceId) {
        const ratingElement = document.querySelector(`[data-service="${serviceId}"]`);
        if (!ratingElement) return;

        const serviceRating = this.ratings[serviceId];
        const average = serviceRating ? (serviceRating.total / serviceRating.count) : 0;
        const count = serviceRating ? serviceRating.count : 0;
        const hasRated = this.hasUserRated(serviceId);

        // تحديث النجوم
        this.updateStars(ratingElement, average, hasRated);

        // تحديث النص
        const ratingInfo = ratingElement.parentElement.querySelector('.rating-info');
        if (ratingInfo) {
            if (hasRated) {
                ratingInfo.innerHTML = `
                    <span class="rating-count">${count} تقييم</span>،
                    متوسط: <span class="rating-average">${average.toFixed(1)}</span>
                    <span class="user-rated"> (تم التقييم)</span>
                `;
            } else {
                ratingInfo.innerHTML = `
                    <span class="rating-count">${count} تقييم</span>،
                    متوسط: <span class="rating-average">${average.toFixed(1)}</span>
                `;
            }
        }
    }

    // تحديث النجوم بناءً على المتوسط
    updateStars(ratingElement, average, hasRated = false) {
        const stars = ratingElement.querySelectorAll('.star');

        stars.forEach((star, index) => {
            const starValue = index + 1;
            star.classList.remove('active', 'half', 'rated');

            if (hasRated) {
                // إذا تم التقييم مسبقاً، إزالة إمكانية النقر وإضافة كلاس خاص
                star.classList.add('rated');
                star.style.cursor = 'default';
                star.title = 'تم التقييم مسبقاً';
            } else {
                // إعادة تفعيل النقر
                star.style.cursor = 'pointer';
                star.title = `تقييم ${starValue} نجوم`;
            }

            if (average >= starValue) {
                star.classList.add('active');
            } else if (average >= starValue - 0.5) {
                star.classList.add('half');
            }
        });
    }

    // إظهار رسالة شكر
    showThankYouMessage() {
        this.showMessage('شكراً لك على التقييم! 🌟', '#4CAF50');
    }

    // إظهار رسالة التقييم المسبق
    showAlreadyRatedMessage() {
        this.showMessage('لقد قمت بتقييم هذه الخدمة مسبقاً! ⭐', '#FF9800');
    }

    // دالة عامة لإظهار الرسائل
    showMessage(text, backgroundColor) {
        // إنشاء رسالة مؤقتة
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${backgroundColor};
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-family: 'Cairo', sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
        `;
        message.textContent = text;

        document.body.appendChild(message);

        // إزالة الرسالة بعد 3 ثوان
        setTimeout(() => {
            if (message.parentElement) {
                message.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (message.parentElement) {
                        message.parentElement.removeChild(message);
                    }
                }, 300);
            }
        }, 3000);
    }
}

// تهيئة نظام التقييم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new RatingSystem();
});
