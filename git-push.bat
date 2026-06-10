@echo off
cd /d C:\Users\baxmt\proaxissolutions
echo Removing stale git lock...
del /f /q ".git\index.lock" 2>nul
echo Staging changes...
git add -A
echo Committing...
git commit -m "feat: Web3Forms live + mobile responsive all pages - contact.html: Web3Forms key wired, form submissions now email to info@proaxissolutions.co.za - about.html: WOW flip loader - overflow-x fix + @media 768/480px on all pages"
echo Pushing to GitHub...
git push origin main
echo.
echo ===========================
echo DONE! All changes pushed.
echo ===========================
echo.
pause
