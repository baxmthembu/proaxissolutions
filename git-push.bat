@echo off
cd /d C:\Users\baxmt\proaxissolutions
echo Removing stale git lock...
del /f /q ".git\index.lock" 2>nul
echo Staging changes...
git add -A
echo Committing...
git commit -m "feat: business cards flip to show live demos - index.html: 3D CSS card flip on click, demo loads as scaled iframe on card back, close button to flip back, lazy-load iframes, Esc key closes all - all 6 demo pages included"
echo Pushing to GitHub...
git push origin main
echo.
echo ===========================
echo DONE! All changes pushed.
echo ===========================
echo.
pause
