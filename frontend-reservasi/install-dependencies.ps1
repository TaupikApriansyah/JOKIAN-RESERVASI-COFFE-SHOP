Set-Location $PSScriptRoot
Write-Host "Membersihkan dependency lama..."
Remove-Item -Recurse -Force .\node_modules -ErrorAction SilentlyContinue
Remove-Item -Force .\package-lock.json -ErrorAction SilentlyContinue
npm config set registry https://registry.npmjs.org/
Write-Host "Menginstall dependency frontend BrewVibe..."
npm install --no-audit --no-fund
Write-Host "Selesai. Jalankan: npm run dev"
