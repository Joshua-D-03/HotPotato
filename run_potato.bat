@echo off
title Hot Potato - One Click Compression
set "folder=%~dp0"
:: Usage: core.py <folder> <mode>
python core.py "%folder%" balanced
pause
