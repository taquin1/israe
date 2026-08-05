#!/bin/bash
# סקריפט לפריסת האפליקציה ל-GitHub Pages

# 1. אתחול מאגר Git (אם עדיין לא נעשה)
git init
git add .
git commit -m "feat: initial Qavé dating app MVP"

# 2. צרו מאגר חדש ב-GitHub בשם 'qave-dating' (ללא README) ואז הריצו:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/qave-dating.git
git push -u origin main

# 3. הגדרת Base URL ל-Vite
# ודאו שהקובץ vite.config.ts מכיל את השורה:
# base: '/qave-dating/',

# 4. התקנת תוסף הפריסה ופריסה ל-GitHub Pages
npm run build
npm run deploy

# האתר יהיה זמין בכתובת:
# https://YOUR_USERNAME.github.io/qave-dating/