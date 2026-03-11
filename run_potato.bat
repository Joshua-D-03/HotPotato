@echo off
title Hot Potato - One Click Compression
echo [STEP 1] Detecting folder...
set "folder=%~dp0"
echo [STEP 2] Starting Core Engine...
:: Runs the script using python (if installed) or the exe (if you build it later)
python core.py "%folder%" 0.65
echo.
echo [COMPLETE] Your files are ready.
pause
