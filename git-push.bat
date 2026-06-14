@echo off
cd /d C:\Users\baxmt\proaxissolutions
echo Removing stale git lock...
del /f /q ".git\index.lock" 2>nul
echo Staging changes...
git add -A
echo Committing...
git commit -m "feat: POPIA/PAIA compliance pages + consent UX - privacy.html: full POPIA Privacy Notice - paia-manual.html: PAIA Section 51 Manual (all required sections) - records-notice.html: Automatically Available Records notice (PAIA Reg 5(2)) - contact.html: consent toggle + cookie bar - all pages: cookie bar + PAIA/Privacy footer links - sitemap.xml: 3 new compliance pages added"
echo Pushing to GitHub...
git push origin main
echo.
echo ===========================
echo DONE! All changes pushed.
echo ===========================
echo.
pause
