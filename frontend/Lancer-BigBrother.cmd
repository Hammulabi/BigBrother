@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Installer Node.js 22.12 ou plus recent, puis relancer ce fichier.
  pause
  exit /b 1
)
if not exist "node_modules\vite" (
  call npm.cmd ci
  if errorlevel 1 (
    echo Installation impossible. Verifier la connexion et reessayer.
    pause
    exit /b 1
  )
)
echo BigBrother - demonstration locale avec donnees fictives.
echo Ouvrir l'adresse Local affichee ci-dessous. Ctrl+C pour arreter.
set VITE_DATA_MODE=demo
call npm.cmd run dev
pause
