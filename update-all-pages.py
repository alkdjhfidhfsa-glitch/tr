#!/usr/bin/env python3
"""
سكريبت لإضافة ملفات CSS و JavaScript المطلوبة لجميع صفحات HTML
"""

import os
import re

def update_html_file(file_path):
    """تحديث ملف HTML واحد"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        changed = False
        
        # إضافة mobile-drawer.css بعد responsive.css إن لم تكن موجودة
        if 'mobile-drawer.css' not in content:
            new_content, n = re.subn(
                r'(<link rel="stylesheet" href="css/responsive\.css">)',
                r'\1\n    <link rel="stylesheet" href="css/mobile-drawer.css">',
                content
            )
            if n > 0:
                content = new_content
                changed = True
                print(f"✅ تم إضافة mobile-drawer.css إلى {file_path}")

        # التحقق من وجود hover-fix.css وإضافته بعد responsive.css إذا غاب
        if 'hover-fix.css' not in content:
            new_content, n = re.subn(
                r'(<link rel="stylesheet" href="css/responsive\.css">)',
                r'\1\n    <link rel="stylesheet" href="css/hover-fix.css">',
                content
            )
            if n > 0:
                content = new_content
                changed = True
                print(f"✅ تم إضافة hover-fix.css إلى {file_path}")
        
        # إضافة كتلة الـ Drawer بعد إغلاق الهيدر مباشرة إذا لم تكن موجودة
        if 'id="mobileDrawer"' not in content:
            drawer_block = (
                '\n    <!-- Backdrop and Mobile Drawer -->\n'
                '    <div class="backdrop" id="drawerBackdrop" aria-hidden="true"></div>\n\n'
                '    <aside id="mobileDrawer" class="mobile-drawer" aria-hidden="true" role="navigation" dir="rtl">\n'
                '      <div class="drawer-header">\n'
                '        <button class="drawer-close" id="drawerClose" aria-label="إغلاق القائمة">\n'
                '          <i class="fas fa-times"></i>\n'
                '        </button>\n'
                '      </div>\n'
                '      <nav class="mobile-nav">\n'
                '        <ul class="mobile-menu" id="mobileMenu"></ul>\n'
                '      </nav>\n'
                '    </aside>\n\n'
            )
            new_content, n = re.subn(r'(</header>\s*)', r"</header>\n" + drawer_block, content, count=1)
            if n == 0:
                # كحل بديل: إدراج قبل أول قسم رئيسي معروف
                new_content, n = re.subn(r'(<!-- Breadcrumb -->|<main|<section)', drawer_block + r'\1', content, count=1)
            if n > 0:
                content = new_content
                changed = True
                print(f"✅ تم إدراج كتلة القائمة الجانبية في {file_path}")

        # التحقق من وجود hover-fix.js بعد main.js إذا كان main.js موجود
        if 'hover-fix.js' not in content and 'js/main.js' in content:
            new_content, n = re.subn(
                r'(<script src="js/main\.js"></script>)',
                r'\1\n    <script src="js/hover-fix.js"></script>',
                content
            )
            if n > 0:
                content = new_content
                changed = True
                print(f"✅ تم إضافة hover-fix.js إلى {file_path}")
        
        # حفظ الملف فقط إذا حدث تغيير
        if changed:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
        
        return True
        
    except Exception as e:
        print(f"❌ خطأ في تحديث {file_path}: {e}")
        return False

def main():
    """الدالة الرئيسية"""
    # قائمة الصفحات المراد تحديثها (باستثناء index.html)
    html_files = [
        'car-shades.html',
        'garden-shades.html',
        'pool-shades.html',
        'school-shades.html',
        'pvc-shades.html',
        'wooden-fences.html',
        'iron-fences.html',
        'fabric-fences.html',
        'hair-houses.html',
        'hangars.html',
        'tiles.html',
        'cladding.html',
        'cantilever-shades.html',
        'pyramid-shades.html',
        'polyethylene-shades.html',
        'wooden-shades.html',
        'tensile-structures.html',
        'market-shades.html',
        'mosque-shades.html',
        'hanging-shades.html',
        'conical-shades.html',
        'school-fences.html',
        'nets.html',
        'shades.html',
        'fences.html',
        'gallery.html',
        'latest-works.html'
    ]
    
    updated_count = 0
    total_count = 0
    
    for file_name in html_files:
        if os.path.exists(file_name):
            total_count += 1
            if update_html_file(file_name):
                updated_count += 1
        else:
            print(f"⚠️ الملف غير موجود: {file_name}")
    
    print(f"\n🎉 تم تحديث {updated_count} من أصل {total_count} ملف")
    print("✅ جميع الصفحات تحتوي الآن على تأثيرات أيقونات التواصل الاجتماعي!")

if __name__ == "__main__":
    main()
