@echo off
cd /d "%~dp0"
echo Membersihkan dependency lama...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
npm config set registry https://registry.npmjs.org/
echo Menginstall dependency frontend BrewVibe...
npm install --no-audit --no-fund
echo Selesai. Jalankan: npm run dev
pause
