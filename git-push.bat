@echo off
cd /d C:\Users\baxmt\proaxissolutions
echo Removing stale git lock...
del /f /q ".git\index.lock" 2>nul
echo Staging changes...
git add -A
echo Committing...
git commit -m "feat: add 6 live demo prototypes with iframe modals - demo-hause-of-lace.html: hair salon booking, portfolio, loyalty card - demo-kasi-fresh-market.html: retail POS, inventory alerts - demo-larriecooks.html: food ordering, catering quote builder - demo-fixpro-sa.html: trades job board, instant quote - demo-primecare-clinic.html: clinic booking, doctor queue - demo-ndlovu-associates.html: law firm case tracker, consultation booking - index.html: openProto now loads iframes, iframe modal fullscreen"
echo Pushing to GitHub...
git push origin main
echo.
echo ===========================
echo DONE! All changes pushed.
echo ===========================
echo.
pause
