@echo off
cd /d "%~dp0"
echo Starting Ants vs. SomeBees web game...
echo.
echo Controls:
echo   1. Click Play Ants on the splash screen
echo   2. Click an ant type in the top row
echo   3. Click a tunnel square to place it
echo.
echo Difficulty flags (optional):
echo   play.bat -d easy
echo   play.bat -d normal
echo   play.bat -d hard
echo   play.bat -w
echo.
python gui.py %*
