// ===== العداد المتحرك والمؤثرات البصرية لقسم من نحن =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== العداد المتحرك - أبطأ =====
    function animateCounter(element, target, duration = 4000) { // زيادة المدة إلى 4 ثواني
        const start = 0;
        const increment = target / (duration / 32); // تقليل سرعة التحديث
        let current = start;

        const timer = setInterval(() => {
            current += increment;

            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            // تنسيق الأرقام
            if (element.textContent.includes('+') || element.getAttribute('data-target') === '5000' || element.getAttribute('data-target') === '15') {
                if (target >= 1000) {
                    element.textContent = Math.floor(current).toLocaleString() + '+';
                } else {
                    element.textContent = Math.floor(current) + '+';
                }
            } else if (element.textContent.includes('%') || element.getAttribute('data-target') === '100') {
                element.textContent = Math.floor(current) + '%';
            } else if (element.textContent.includes('/') || element.getAttribute('data-target') === '24') {
                // للعداد 24/7 - نعرض الرقم يزيد تدريجياً ثم نضيف /7
                if (current >= 24) {
                    element.textContent = '24/7';
                } else {
                    element.textContent = Math.floor(current) + '/7';
                }
            } else {
                element.textContent = Math.floor(current);
            }
        }, 32); // تقليل سرعة التحديث
    }
    
    // ===== مراقب التقاطع للعناصر =====
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // تشغيل العداد
                if (element.classList.contains('stat-number')) {
                    const text = element.textContent;
                    const dataTarget = element.getAttribute('data-target');
                    let target = 0;

                    // تحديد الهدف من النص أو من data-target
                    if (dataTarget) {
                        target = parseInt(dataTarget);
                    } else if (text.includes('15+')) {
                        target = 15;
                    } else if (text.includes('5000+')) {
                        target = 5000;
                    } else if (text.includes('100%')) {
                        target = 100;
                    } else if (text.includes('24/7')) {
                        target = 24; // تشغيل العداد للوصول إلى 24
                    }

                    if (target > 0) {
                        // حفظ النص الأصلي للمرجع
                        const originalText = element.textContent;
                        element.textContent = '0';

                        setTimeout(() => {
                            animateCounter(element, target);
                        }, 500); // تأخير أكبر لبداية العداد
                    }
                }
                
                // تشغيل المؤثرات البصرية
                if (element.classList.contains('animate-on-scroll')) {
                    element.classList.add('animated');
                }
                if (element.classList.contains('animate-fade-left')) {
                    element.classList.add('animated');
                }
                if (element.classList.contains('animate-fade-right')) {
                    element.classList.add('animated');
                }
                if (element.classList.contains('animate-zoom-in')) {
                    element.classList.add('animated');
                }
                
                // إيقاف المراقبة بعد التشغيل
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // ===== إضافة المؤثرات للعناصر =====
    function addAnimationClasses() {
        // العنوان الرئيسي
        const mainTitle = document.querySelector('#about .section-header h2');
        if (mainTitle) {
            mainTitle.classList.add('animate-on-scroll');
            observer.observe(mainTitle);
        }
        
        // الوصف
        const description = document.querySelector('#about .section-header p');
        if (description) {
            description.classList.add('animate-on-scroll');
            observer.observe(description);
        }
        
        // الإحصائيات - تأخير أكبر بين العدادات
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach((stat, index) => {
            stat.classList.add('animate-zoom-in');
            setTimeout(() => {
                observer.observe(stat);
            }, index * 500); // زيادة التأخير إلى 500ms بين كل عداد
        });
        
        const statLabels = document.querySelectorAll('.stat-label');
        statLabels.forEach((label, index) => {
            label.classList.add('animate-on-scroll');
            setTimeout(() => {
                observer.observe(label);
            }, index * 150);
        });
        
        // النصوص
        const aboutTexts = document.querySelectorAll('.about-text h3, .about-text p');
        aboutTexts.forEach((text, index) => {
            if (index % 2 === 0) {
                text.classList.add('animate-fade-left');
            } else {
                text.classList.add('animate-fade-right');
            }
            setTimeout(() => {
                observer.observe(text);
            }, index * 100);
        });
        
        // بطاقات الخدمات
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            card.classList.add('animate-on-scroll');
            setTimeout(() => {
                observer.observe(card);
            }, index * 150);
        });
    }
    
    // ===== مؤثرات إضافية =====
    
    // مؤثر التوهج للإحصائيات عند التمرير
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.animation = 'glow 1s ease-in-out infinite';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.animation = '';
        });
    });
    
    // مؤثر الموجة للأيقونات
    const serviceIcons = document.querySelectorAll('.service-card i');
    serviceIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.animation = 'wave 0.6s ease-in-out infinite';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.animation = '';
        });
    });
    
    // ===== مؤثر الجسيمات المتحركة =====
    function createFloatingParticles() {
        const aboutSection = document.querySelector('#about');
        if (!aboutSection) return;
        
        // إنشاء حاوية الجسيمات
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'floating-particles';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        aboutSection.style.position = 'relative';
        aboutSection.appendChild(particlesContainer);
        
        // إنشاء الجسيمات
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 6 + 2}px;
                height: ${Math.random() * 6 + 2}px;
                background: rgba(74, 144, 226, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s linear infinite;
            `;
            
            particlesContainer.appendChild(particle);
        }
        
        // إضافة CSS للحركة
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0% {
                    transform: translateY(0px) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // ===== مؤثر النص المتحرك =====
    function typewriterEffect(element, text, speed = 50) {
        element.textContent = '';
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }
    
    // ===== تشغيل جميع المؤثرات =====
    setTimeout(() => {
        addAnimationClasses();
        createFloatingParticles();
    }, 100);
    
    // ===== مؤثر التمرير السلس =====
    const aboutLink = document.querySelector('a[href="#about"]');
    if (aboutLink) {
        aboutLink.addEventListener('click', function(e) {
            e.preventDefault();
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // ===== مؤثر التحديث المستمر للإحصائيات =====
    setInterval(() => {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            if (stat.textContent.includes('5000+')) {
                // زيادة تدريجية في عدد المشاريع
                const currentNum = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
                if (currentNum < 5500) {
                    stat.textContent = (currentNum + 1).toLocaleString() + '+';
                }
            }
        });
    }, 30000); // كل 30 ثانية
    
});

// ===== مؤثرات إضافية للتفاعل =====

// مؤثر النقر على الإحصائيات
document.addEventListener('click', function(e) {
    if (e.target.closest('.stat-item')) {
        const statItem = e.target.closest('.stat-item');
        statItem.style.animation = 'pulse 0.6s ease-in-out';
        
        setTimeout(() => {
            statItem.style.animation = '';
        }, 600);
    }
});

// مؤثر التمرير على بطاقات الخدمات - ثابت بدون حركة
document.addEventListener('mouseover', function(e) {
    if (e.target.closest('.service-card') || e.target.closest('.premium-card')) {
        const card = e.target.closest('.service-card') || e.target.closest('.premium-card');

        // إزالة أي تحريك - البطاقة تبقى ثابتة
        card.style.transform = 'none !important';

        // حماية الأيقونات والروابط من الاختفاء
        const icon = card.querySelector('.service-icon-wrapper i');
        const serviceLink = card.querySelector('.service-link');
        const allElements = card.querySelectorAll('*');

        if (icon) {
            icon.style.opacity = '1';
            icon.style.visibility = 'visible';
            icon.style.display = 'flex';
            icon.style.zIndex = '100';
        }

        if (serviceLink) {
            serviceLink.style.opacity = '1';
            serviceLink.style.visibility = 'visible';
            serviceLink.style.display = 'inline-flex';
            serviceLink.style.pointerEvents = 'auto';
        }

        // حماية جميع العناصر
        allElements.forEach(element => {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            element.style.pointerEvents = 'auto';
        });
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.closest('.service-card') || e.target.closest('.premium-card')) {
        const card = e.target.closest('.service-card') || e.target.closest('.premium-card');

        // البطاقة تبقى ثابتة
        card.style.transform = 'none !important';

        // الحفاظ على جميع العناصر مرئية
        const icon = card.querySelector('.service-icon-wrapper i');
        const serviceLink = card.querySelector('.service-link');
        const allElements = card.querySelectorAll('*');

        if (icon) {
            icon.style.opacity = '1';
            icon.style.visibility = 'visible';
            icon.style.display = 'flex';
        }

        if (serviceLink) {
            serviceLink.style.opacity = '1';
            serviceLink.style.visibility = 'visible';
            serviceLink.style.display = 'inline-flex';
            serviceLink.style.pointerEvents = 'auto';
        }

        // حماية جميع العناصر
        allElements.forEach(element => {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            element.style.pointerEvents = 'auto';
        });
    }
});

// ===== مؤثرات إضافية متقدمة =====

// مؤثر الجسيمات المتحركة المحسن
function createAdvancedParticles() {
    const aboutSection = document.querySelector('#about');
    if (!aboutSection) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'advanced-particles';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;

    aboutSection.appendChild(particlesContainer);

    // إنشاء جسيمات متنوعة
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 8 + 3;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${getRandomColor()};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: 100%;
            animation: advancedFloat ${duration}s linear infinite;
            animation-delay: ${delay}s;
            opacity: 0;
        `;

        particlesContainer.appendChild(particle);
    }

    // ألوان متنوعة للجسيمات
    function getRandomColor() {
        const colors = [
            'rgba(74, 144, 226, 0.3)',
            'rgba(53, 122, 189, 0.3)',
            'rgba(44, 90, 160, 0.3)',
            'rgba(255, 255, 255, 0.5)',
            'rgba(248, 249, 250, 0.4)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // إضافة CSS للحركة المتقدمة
    const advancedStyle = document.createElement('style');
    advancedStyle.textContent = `
        @keyframes advancedFloat {
            0% {
                transform: translateY(0) translateX(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(advancedStyle);
}

// مؤثر النص المتحرك المحسن
function enhancedTypewriter() {
    const titles = document.querySelectorAll('.animate-title');
    titles.forEach(title => {
        const text = title.textContent;
        title.textContent = '';
        title.style.borderLeft = '2px solid #4a90e2';
        title.style.paddingLeft = '10px';

        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                title.style.borderLeft = 'none';
            }
        }, 100);
    });
}

// مؤثر التوهج التفاعلي
function addInteractiveGlow() {
    const statItems = document.querySelectorAll('.stat-item');

    statItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 30px rgba(74, 144, 226, 0.5)';
            this.style.transform = 'translateY(-15px) scale(1.05)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
            this.style.transform = '';
        });
    });
}

// مؤثر الموجة الصوتية
function createSoundWave() {
    const aboutSection = document.querySelector('#about');
    if (!aboutSection) return;

    const waveContainer = document.createElement('div');
    waveContainer.className = 'sound-wave';
    waveContainer.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100px;
        pointer-events: none;
        z-index: 1;
    `;

    aboutSection.appendChild(waveContainer);

    // إنشاء خطوط الموجة
    for (let i = 0; i < 50; i++) {
        const wave = document.createElement('div');
        wave.style.cssText = `
            position: absolute;
            bottom: 0;
            left: ${i * 2}%;
            width: 2px;
            height: ${Math.random() * 50 + 10}px;
            background: linear-gradient(to top, rgba(74, 144, 226, 0.3), transparent);
            animation: waveAnimation ${Math.random() * 2 + 1}s ease-in-out infinite;
            animation-delay: ${i * 0.1}s;
        `;

        waveContainer.appendChild(wave);
    }

    // CSS للموجة
    const waveStyle = document.createElement('style');
    waveStyle.textContent = `
        @keyframes waveAnimation {
            0%, 100% {
                height: 10px;
                opacity: 0.3;
            }
            50% {
                height: 60px;
                opacity: 0.8;
            }
        }
    `;
    document.head.appendChild(waveStyle);
}

// مؤثر التدرج المتحرك للخلفية
function animatedGradientBackground() {
    const aboutSection = document.querySelector('#about');
    if (!aboutSection) return;

    aboutSection.style.background = `
        linear-gradient(-45deg, #f8f9fa, #e9ecef, #dee2e6, #ced4da);
        background-size: 400% 400%;
        animation: gradientShift 15s ease infinite;
    `;
}

// مؤثر الانفجار عند النقر
function addClickExplosion() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('#about')) {
            createExplosion(e.clientX, e.clientY);
        }
    });

    function createExplosion(x, y) {
        const explosion = document.createElement('div');
        explosion.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 10px;
            height: 10px;
            background: radial-gradient(circle, #4a90e2, transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: explode 0.6s ease-out forwards;
        `;

        document.body.appendChild(explosion);

        setTimeout(() => {
            explosion.remove();
        }, 600);
    }

    // CSS للانفجار
    const explosionStyle = document.createElement('style');
    explosionStyle.textContent = `
        @keyframes explode {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(20);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(explosionStyle);
}

// مؤثر التتبع بالماوس
function addMouseTracker() {
    const aboutSection = document.querySelector('#about');
    if (!aboutSection) return;

    const tracker = document.createElement('div');
    tracker.className = 'mouse-tracker';
    tracker.style.cssText = `
        position: absolute;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(74, 144, 226, 0.3), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10;
        transition: all 0.1s ease;
    `;

    aboutSection.appendChild(tracker);

    aboutSection.addEventListener('mousemove', function(e) {
        const rect = aboutSection.getBoundingClientRect();
        tracker.style.left = (e.clientX - rect.left - 10) + 'px';
        tracker.style.top = (e.clientY - rect.top - 10) + 'px';
    });

    aboutSection.addEventListener('mouseenter', function() {
        tracker.style.opacity = '1';
    });

    aboutSection.addEventListener('mouseleave', function() {
        tracker.style.opacity = '0';
    });
}

// دالة حماية الأيقونات والصور
function protectServiceCardElements() {
    const serviceCards = document.querySelectorAll('.service-card, .premium-card');

    serviceCards.forEach(card => {
        // تأكيد عرض البطاقة نفسها
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.visibility = 'visible';

        // حماية دائمة للأيقونات
        const icon = card.querySelector('.service-icon-wrapper i');
        const iconWrapper = card.querySelector('.service-icon-wrapper');

        if (icon) {
            icon.style.opacity = '1';
            icon.style.visibility = 'visible';
            icon.style.display = 'flex';
            icon.style.position = 'relative';
            icon.style.zIndex = '100';
        }

        if (iconWrapper) {
            iconWrapper.style.overflow = 'visible';
            iconWrapper.style.position = 'relative';
        }

        // مراقبة التغييرات
        const observer = new MutationObserver(() => {
            if (icon) {
                icon.style.opacity = '1';
                icon.style.visibility = 'visible';
                icon.style.display = 'flex';
            }
        });

        observer.observe(card, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    });
}

// تشغيل جميع المؤثرات المتقدمة
setTimeout(() => {
    createAdvancedParticles();
    enhancedTypewriter();
    addInteractiveGlow();
    createSoundWave();
    animatedGradientBackground();
    addClickExplosion();
    addMouseTracker();
    protectServiceCardElements(); // حماية الأيقونات
}, 500);

// تشغيل الحماية مرة أخرى بعد تحميل كامل
window.addEventListener('load', () => {
    setTimeout(protectServiceCardElements, 1000);
});

// دالة إضافية لضمان عرض البطاقات
function ensureCardsVisible() {
    const servicesGrid = document.querySelector('.services-grid');
    const serviceCards = document.querySelectorAll('.premium-card, .service-card');

    if (servicesGrid) {
        servicesGrid.style.display = 'grid';
        servicesGrid.style.opacity = '1';
        servicesGrid.style.visibility = 'visible';
    }

    serviceCards.forEach(card => {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.visibility = 'visible';

        // تأكيد عرض جميع العناصر الداخلية
        const allElements = card.querySelectorAll('*');
        allElements.forEach(element => {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
        });
    });
}

// تشغيل الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', ensureCardsVisible);
window.addEventListener('load', ensureCardsVisible);

// تشغيل الدالة كل ثانية للتأكد
setInterval(ensureCardsVisible, 1000);

// دالة إضافية لمنع اختفاء العناصر عند الـ hover
function preventHoverHiding() {
    const cards = document.querySelectorAll('.premium-card, .service-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // منع اختفاء جميع العناصر
            const allElements = this.querySelectorAll('*');
            allElements.forEach(element => {
                element.style.opacity = '1';
                element.style.visibility = 'visible';
                element.style.pointerEvents = 'auto';
            });

            // حماية خاصة للأيقونات
            const icon = this.querySelector('.service-icon-wrapper i');
            if (icon) {
                icon.style.opacity = '1';
                icon.style.visibility = 'visible';
                icon.style.display = 'flex';
            }

            // حماية خاصة للروابط
            const link = this.querySelector('.service-link');
            if (link) {
                link.style.opacity = '1';
                link.style.visibility = 'visible';
                link.style.display = 'inline-flex';
                link.style.pointerEvents = 'auto';
            }
        });

        card.addEventListener('mouseleave', function() {
            // الحفاظ على العناصر مرئية حتى بعد مغادرة المؤشر
            const allElements = this.querySelectorAll('*');
            allElements.forEach(element => {
                element.style.opacity = '1';
                element.style.visibility = 'visible';
                element.style.pointerEvents = 'auto';
            });
        });
    });
}

// تشغيل دالة منع الاختفاء
document.addEventListener('DOMContentLoaded', preventHoverHiding);
window.addEventListener('load', preventHoverHiding);
