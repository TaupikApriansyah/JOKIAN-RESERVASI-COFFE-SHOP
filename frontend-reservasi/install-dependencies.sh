#!/usr/bin/env bash
set -e
npm config set registry https://registry.npmjs.org/
npm install --no-audit --no-fund
printf '\nSelesai. Jalankan: npm run dev\n'
