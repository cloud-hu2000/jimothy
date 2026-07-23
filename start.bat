@echo off
setlocal
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or is not on PATH.
  echo Install the current LTS version from https://nodejs.org/ and try again.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing game files for the first launch...
  call npm install --ignore-scripts --no-audit --no-fund
  if errorlevel 1 (
    echo Installation failed.
    pause
    exit /b 1
  )
)

echo Starting Jimothy Clicker...
start "Jimothy Clicker Server" /min cmd /c "cd /d ""%~dp0"" && npm run dev"
timeout /t 2 /nobreak >nul
start "Jimothy Clicker" http://localhost:3000/
echo The game should now be open in your browser.
echo To stop it later, close the minimized Jimothy Clicker Server window.

endlocal
