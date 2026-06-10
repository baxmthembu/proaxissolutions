@echo off
cd /d C:\Users\baxmt\proaxissolutions
echo Removing stale git lock...
del /f /q ".git\index.lock" 2>nul
echo Staging changes...
git add -A
echo Committing...
git commit -m "feat: brand identity + SEO phase - brand/: logo SVG+PNG 7 sizes, favicon.ico, brand-sheet, GBP setup pack - nav: logo mark all main pages - SEO: unique titles/meta/OG/Twitter cards all pages - JSON-LD Organization+LocalBusiness schema - sitemap.xml + robots.txt"
echo Pushing to GitHub...
git push origin main
echo.
echo ===========================
echo DONE! All changes pushed.
echo ===========================
echo.
pause
