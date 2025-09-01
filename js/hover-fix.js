// ملف إصلاح مشكلة اختفاء البيانات عند الـ hover

// دالة لضمان عرض جميع عناصر البطاقات
function forceShowCardElements() {
    const cards = document.querySelectorAll('.premium-card, .service-card');
    
    cards.forEach(card => {
        // تأكيد عرض البطاقة نفسها
        card.style.opacity = '1';
        card.style.visibility = 'visible';
        card.style.display = 'block';
        
        // تأكيد عرض جميع العناصر الداخلية
        const allElements = card.querySelectorAll('*');
        allElements.forEach(element => {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            element.style.pointerEvents = 'auto';
        });
        
        // حماية خاصة للعناصر المهمة
        const title = card.querySelector('h4');
        const description = card.querySelector('p');
        const link = card.querySelector('.service-link');
        const icon = card.querySelector('.service-icon-wrapper i');
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
            icon.style.fontFamily = '"Font Awesome 6 Free"';
            icon.style.fontWeight = '900';
            icon.style.alignItems = 'center';
            icon.style.justifyContent = 'center';
            icon.style.position = 'relative';
            icon.style.zIndex = '999';
        }
    });
}

// دالة لإزالة تأثيرات الـ hover المضرة
function removeHarmfulHoverEffects() {
    const cards = document.querySelectorAll('.premium-card, .service-card');
    
    cards.forEach(card => {
        // إزالة event listeners الضارة
        card.addEventListener('mouseenter', function(e) {
            e.preventDefault();
            forceShowCardElements();
        });
        
        card.addEventListener('mouseleave', function(e) {
            e.preventDefault();
            forceShowCardElements();
        });
        
        card.addEventListener('mouseover', function(e) {
            e.preventDefault();
            forceShowCardElements();
        });
        
        card.addEventListener('mouseout', function(e) {
            e.preventDefault();
            forceShowCardElements();
        });
    });
}

// تشغيل الإصلاحات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    forceShowCardElements();
    removeHarmfulHoverEffects();
    fixSocialIcons();
});

// تشغيل الإصلاحات عند اكتمال التحميل
window.addEventListener('load', function() {
    setTimeout(forceShowCardElements, 100);
    setTimeout(removeHarmfulHoverEffects, 200);
    setTimeout(fixSocialIcons, 300);
});

// تشغيل الإصلاحات بشكل دوري
setInterval(forceShowCardElements, 2000);

// دالة خاصة لحماية الأيقونات
function protectIcons() {
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

        // منع أي event يخفي الأيقونة
        icon.addEventListener('mouseover', function(e) {
            e.stopPropagation();
            this.style.opacity = '1';
            this.style.visibility = 'visible';
            this.style.display = 'flex';
        });

        icon.addEventListener('mouseout', function(e) {
            e.stopPropagation();
            this.style.opacity = '1';
            this.style.visibility = 'visible';
            this.style.display = 'flex';
        });
    });
}

// تشغيل حماية الأيقونات
setInterval(protectIcons, 1000);

// دالة لإصلاح أيقونات التواصل الاجتماعي
function fixSocialIcons() {
    const socialIcons = document.querySelectorAll('.footer-social a i');

    socialIcons.forEach(icon => {
        icon.style.opacity = '1';
        icon.style.visibility = 'visible';
        icon.style.display = 'inline-block';
        icon.style.color = 'white';
        icon.style.fontSize = '16px';

        // تحديد نوع الأيقونة وتطبيق الخط المناسب
        if (icon.classList.contains('fab')) {
            icon.style.fontFamily = '"Font Awesome 6 Brands"';
            icon.style.fontWeight = '400';
        } else if (icon.classList.contains('fas')) {
            icon.style.fontFamily = '"Font Awesome 6 Free"';
            icon.style.fontWeight = '900';
        }
    });

    // إصلاح الروابط نفسها
    const socialLinks = document.querySelectorAll('.footer-social a');
    socialLinks.forEach(link => {
        link.style.opacity = '1';
        link.style.visibility = 'visible';
        link.style.display = 'flex';
        link.style.pointerEvents = 'auto';
    });
}

// تشغيل إصلاح أيقونات التواصل الاجتماعي
setInterval(fixSocialIcons, 1000);

// مراقبة التغييرات في DOM
if (window.MutationObserver) {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                setTimeout(forceShowCardElements, 50);
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });
}
