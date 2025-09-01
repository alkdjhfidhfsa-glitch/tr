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
        
        # التحقق من وجود hover-fix.css
        if 'hover-fix.css' not in content:
            # إضافة hover-fix.css بعد responsive.css
            content = re.sub(
                r'(<link rel="stylesheet" href="css/responsive\.css">)',
                r'\1\n    <link rel="stylesheet" href="css/hover-fix.css">',
                content
            )
            print(f"✅ تم إضافة hover-fix.css إلى {file_path}")
        
        # التحقق من وجود hover-fix.js
        if 'hover-fix.js' not in content:
            # إضافة hover-fix.js بعد main.js
            content = re.sub(
                r'(<script src="js/main\.js"></script>)',
                r'\1\n    <script src="js/hover-fix.js"></script>',
                content
            )
            print(f"✅ تم إضافة hover-fix.js إلى {file_path}")
        
        # حفظ الملف المحدث
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
