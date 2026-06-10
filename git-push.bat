@echo off
cd /d C:\Users\baxmt\proaxissolutions
echo Removing stale git lock...
del /f /q ".git\index.lock" 2>nul
echo Staging changes...
git add -A
echo Committing...
git commit -m "feat: CRM dashboard + onboarding rebuild + flip cards fixed - leads-admin.html: full localStorage CRM with pipeline stages, notes, CSV export - onboarding.html: rebuilt 13->5 questions, Web3Forms wired - index.html: flip card functions fixed, mobile responsive - contact.html: Web3Forms key live - about/services: WOW flip loader + mobile CSS"
echo Pushing to GitHub...
git push origin main
echo.
echo ===========================
echo DONE! All changes pushed.
echo ===========================
echo.
pause
