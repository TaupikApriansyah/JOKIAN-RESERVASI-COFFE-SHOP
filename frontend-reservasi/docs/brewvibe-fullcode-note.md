# Dika Coffe Shop Frontend Full Code Note

File ini berisi full code frontend yang kamu kirim dalam satu file TypeScript/React.

## Cara Pakai

Simpan kode di bawah sebagai file React/TypeScript, misalnya:

```bash
src/App.tsx
```

Install dependency utama:

```bash
npm install react react-dom framer-motion lucide-react
npm install -D vite @vitejs/plugin-react typescript
```

Jalankan project:

```bash
npm run dev
```

## Full Code

```tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu as MenuIcon, X, CalendarCheck, Clock, Coffee, DollarSign, Table2, FileText,
  Users, PlayCircle, UserCheck, CheckCircle, ArrowRight, Calendar, Clock3, Minus,
  Percent, Plus, LayoutDashboard, LogOut, RefreshCw, Utensils, PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

// ==========================================
// 1. GLOBAL CSS & STYLES
// ==========================================
const globalCss = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cormorant+Garamond:wght@500;600;700&display=swap');

:root {
  --espresso: #1f140f; --coffee: #3c2a20; --caramel: #b38a5f; --cream: #f6efe6;
  --paper: #fbf7f1; --milk: #fffdfa; --sage: #365f4b; --sage-soft: #e8efe9;
  --line: rgba(42, 24, 17, 0.10); --text: #221711; --muted: #67584e; --soft-muted: #85756b;
  --shadow-sm: 0 12px 28px rgba(22, 15, 11, 0.05); --shadow-md: 0 24px 60px rgba(22, 15, 11, 0.08);
  --shadow-lg: 0 38px 100px rgba(22, 15, 11, 0.12);
  --site-gutter: clamp(20px, 5vw, 84px); --section-divider: rgba(42, 24, 17, 0.10);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; width: 100%; overflow-x: hidden; }
body, #root { width: 100%; min-width: 320px; margin: 0; overflow-x: hidden; }
body {
  color: var(--text); font-family: Inter, system-ui, -apple-system, Segoe UI, sans-serif;
  background: radial-gradient(circle at 80% 8%, rgba(179,138,95,.12), transparent 18rem),
              radial-gradient(circle at 14% 38%, rgba(54,95,75,.07), transparent 24rem),
              linear-gradient(180deg, #f9f3ea 0%, #f5ede3 45%, #fbf7f1 100%);
}
button, input, select, textarea { font: inherit; }
button { cursor: pointer; border: 0; background: none; }
button:disabled { opacity: .62; cursor: not-allowed; }
img { max-width: 100%; display: block; }
h1, h2, .brand strong, .product-copy h1, .interactive-product-copy h1, .why-noir h2, 
.opening-content h2, .flow-noir h2, .menu-preview-noir h2, .section-intro h2, 
.reservation-heading h2, .footer-pro h2, .footer-pro h3 { font-family: 'Cormorant Garamond', Georgia, serif; }

/* Komponen Dasar */
.site-header {
  position: sticky; top: 0; z-index: 50; width: 100%; min-height: 76px;
  padding: 14px var(--site-gutter); display: flex; align-items: center; justify-content: space-between;
  background: rgba(251,247,241,.86); border-bottom: 1px solid rgba(42,24,17,.10); backdrop-filter: blur(18px);
}
.brand { display: inline-flex; align-items: center; gap: 12px; color: var(--espresso); text-decoration: none; }
.brand span { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 14px; background: linear-gradient(135deg, #1f140f, #4a3427); color: #fff; font-weight: 900; }
.brand strong { font-weight: 900; font-size: 1.25rem; letter-spacing: -.03em; }
.desktop-nav, .header-actions { display: flex; align-items: center; gap: 8px; }
.desktop-nav button, .ghost { color: var(--muted); padding: 10px 14px; font-weight: 700; border-radius: 12px; }
.desktop-nav button:hover, .ghost:hover { color: var(--espresso); background: rgba(42,24,17,.05); }

.primary, .secondary, .dark, .green-cta, .ghost-cta, .dynamic-cta {
  min-height: 48px; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px 22px; border-radius: 14px; font-weight: 900; transition: all .32s ease;
}
.primary, .dark { background: linear-gradient(135deg, #221711, #3a2a21); color: white; }
.primary:hover, .dark:hover { transform: translateY(-3px); box-shadow: 0 12px 24px rgba(22,15,11,.12); }
.secondary, .ghost-cta { background: rgba(255,253,250,.74); color: var(--espresso); border: 1px solid var(--line); }
.green-cta, .dynamic-cta { background: linear-gradient(135deg, #365f4b, #244434); color: white; }
.green-cta:hover, .dynamic-cta:hover { background: linear-gradient(135deg, #2e543f, #1e382b); transform: translateY(-3px); box-shadow: 0 12px 24px rgba(22,15,11,.12); }
.wide { width: 100%; }

input, select, textarea { width: 100%; min-height: 48px; padding: 12px 14px; border: 1.5px solid var(--line); border-radius: 16px; outline: none; background: rgba(255,255,255,.88); font-weight: 500; }
input:focus, select:focus, textarea:focus { border-color: var(--caramel); }
.eyebrow, .landing-eyebrow { display: inline-block; color: var(--caramel); font-size: .76rem; font-weight: 900; letter-spacing: .16em; text-transform: uppercase; margin-bottom: 14px; }

/* Landing Page - Interaktif */
.product-landing { overflow-x: clip; padding-top: 0; }
.interactive-hero-shell {
  width: 100vw; margin-left: calc(50% - 50vw); min-height: calc(100vh - 76px); border-radius: 0 0 34px 34px;
  background: radial-gradient(circle at 22% 14%, rgba(255,255,255,.86), transparent 24rem), linear-gradient(120deg, #fbf6ef 0%, #f5ede2 50%, #efe3d4 100%);
}
.interactive-product-layout {
  display: grid; grid-template-columns: minmax(0, 1fr) minmax(420px, 0.95fr); padding: 42px var(--site-gutter) 60px;
}
.interactive-product-copy { position: relative; z-index: 2; max-width: 640px; }
.interactive-product-copy h1 { font-size: clamp(3.4rem, 6.6vw, 6.6rem); line-height: .9; margin: 12px 0 20px; color: var(--espresso); }
.hero-price { display: block; margin-bottom: 16px; color: var(--sage); font-size: clamp(1.9rem, 2.6vw, 3rem); font-weight: 900; }
.interactive-product-copy p { max-width: 540px; color: var(--muted); line-height: 1.82; }
.interactive-control-row { display: flex; flex-wrap: wrap; gap: 14px; margin: 32px 0 38px; position: relative; z-index: 3; }
.guest-counter { width: 132px; min-height: 48px; display: flex; align-items: center; justify-content: space-between; padding: 5px; border-radius: 14px; background: rgba(255,253,250,.70); border: 1px solid var(--line); backdrop-filter: blur(18px); }
.guest-counter button { width: 34px; height: 34px; border-radius: 50%; color: #604b3d; font-weight: 900; }

.interactive-product-grid { display: grid; grid-template-columns: repeat(3, minmax(124px, 162px)); gap: 16px; position: relative; z-index: 3; }
.interactive-product-card {
  min-height: 150px; padding: 56px 14px 14px; border-radius: 16px; display: grid; align-content: end; text-align: left; gap: 4px; color: white; cursor: pointer;
  background: linear-gradient(180deg, rgba(255,255,255,.16), rgba(0,0,0,.10)); border: 1px solid rgba(255,255,255,.20); backdrop-filter: blur(18px); box-shadow: 0 14px 34px rgba(24,17,13,.10); transition: all .32s ease;
}
.interactive-product-card:hover { transform: translateY(-6px); box-shadow: 0 12px 26px rgba(0,0,0,.08); }
.interactive-product-card.active { transform: translateY(-8px); border-color: rgba(255,255,255,.56); box-shadow: 0 18px 40px rgba(24,17,13,.18); }
.interactive-product-card img { position: absolute; left: 50%; top: -42px; width: 94px; height: 94px; transform: translateX(-50%); filter: drop-shadow(0 12px 20px rgba(38,23,12,.18)); }
.interactive-product-card span { font-size: .66rem; text-transform: uppercase; font-weight: 900; opacity: .8; }
.interactive-product-card strong { font-size: .86rem; line-height: 1.12; }

.interactive-showcase-area { min-height: clamp(560px, 68vh, 740px); display: grid; place-items: center; position: relative; }
.product-image-stage { width: min(620px, 100%); display: grid; place-items: center; position: relative; }
.dynamic-product-shape { position: absolute; right: -3%; top: -6%; width: 46%; height: 112%; background: linear-gradient(180deg, rgba(54,95,75,.96), rgba(32,56,44,.98)); border-radius: 160px 0 0 160px; z-index: 0; }
.product-image-glow { position: absolute; width: clamp(360px, 28vw, 520px); height: clamp(360px, 28vw, 520px); border-radius: 50%; background: radial-gradient(circle, rgba(255,248,240,.95), rgba(255,255,255,.18) 54%, transparent 74%); filter: blur(10px); }
.hero-selected-product { position: relative; z-index: 3; width: min(520px, 84%); max-height: 620px; object-fit: contain; filter: drop-shadow(0 38px 44px rgba(24,17,13,.24)); }
.active-product-tag { position: absolute; right: 4%; bottom: 18%; z-index: 4; min-width: 170px; padding: 12px 14px; border-radius: 16px; background: rgba(255,253,250,.70); border: 1px solid var(--line); backdrop-filter: blur(18px); box-shadow: 0 14px 28px rgba(24,17,13,.10); animation: glassFloat 4.5s ease-in-out infinite; }
@keyframes glassFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }

/* Section List (Global) */
.why-noir, .opening-panel-noir, .flow-noir, .menu-preview-noir, .section, .promo-strip, .reservation-layout, .menu-order { width: 100%; padding: clamp(48px, 4.5vw, 68px) var(--site-gutter); position: relative; }
.why-noir::before, .opening-panel-noir::before, .flow-noir::before, .menu-preview-noir::before, .section::before, .promo-strip::before, .reservation-layout::before, .menu-order::before { content: ''; position: absolute; left: var(--site-gutter); top: 22px; width: 72px; height: 2px; background: linear-gradient(90deg, var(--caramel), transparent); }
.why-noir h2, .opening-content h2, .flow-noir h2, .menu-preview-noir h2, .section-intro h2, .reservation-heading h2 { font-size: clamp(2.6rem, 4.5vw, 5rem); color: var(--espresso); margin-bottom: 18px; line-height: .96; }

.why-grid-noir { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px clamp(28px, 4vw, 64px); margin-top: 30px; }
.why-grid-noir article { display: grid; grid-template-columns: 48px 1fr; gap: 16px; padding: 22px; border-radius: 22px; background: linear-gradient(180deg, rgba(255,255,255,.34), rgba(255,255,255,.20)); backdrop-filter: blur(18px); border: 1px solid rgba(255,255,255,.22); transition: all .32s ease; }
.why-grid-noir article:hover { transform: translateY(-4px); box-shadow: 0 22px 52px rgba(22,15,11,.10); }
.why-grid-noir svg { width: 48px; height: 48px; padding: 12px; color: var(--caramel); background: rgba(179,138,95,.12); border-radius: 50%; }

.opening-panel-noir { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr); gap: clamp(28px, 4vw, 64px); align-items: center; background: radial-gradient(circle at 84% 64%, rgba(179,138,95,.12), transparent 22rem), linear-gradient(180deg, rgba(255,252,247,.14), rgba(255,255,255,.04)); }
.hours-box-noir { display: flex; align-items: center; gap: 16px; padding: 18px 22px; border-radius: 20px; background: rgba(255,253,250,.70); border: 1px solid var(--line); backdrop-filter: blur(18px); margin: 30px 0 20px; }
.hours-icon { width: 56px; height: 56px; display: grid; place-items: center; border-radius: 14px; background: rgba(54,95,75,.10); color: var(--sage); }

.flow-line-noir, .timeline { display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); margin: 30px 0; }
.flow-line-noir article, .timeline-item { padding: 30px 16px; border-right: 1px solid var(--line); transition: all .32s ease; }
.flow-line-noir article:last-child, .timeline-item:last-child { border-right: 0; }
.flow-line-noir article:hover, .timeline-item:hover { transform: translateY(-3px); background: rgba(255,255,255,.18); }
.flow-line-noir span, .timeline-item span { color: var(--caramel); font-size: .78rem; font-weight: 900; letter-spacing: .18em; }

.menu-line-noir { display: grid; gap: 14px; }
.menu-line-noir article, .menu-row { display: grid; grid-template-columns: 96px minmax(0, 1fr) auto auto; gap: 16px; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--line); transition: all .3s ease; }
.menu-line-noir article:hover, .menu-row:hover { transform: translateY(-2px); background: rgba(255,255,255,.16); padding-left: 10px; padding-right: 10px; border-radius: 12px; }
.menu-line-noir img, .menu-row img { width: 96px; height: 78px; object-fit: cover; border-radius: 14px; }

.promo-strip { display: grid; grid-template-columns: minmax(280px, .7fr) minmax(0, 1.3fr); gap: clamp(24px, 4vw, 56px); }
.promo-lines { display: grid; gap: 14px; }
.promo-lines article { display: grid; grid-template-columns: 84px .85fr 1.15fr; gap: 16px; padding: 18px; border-radius: 20px; background: linear-gradient(180deg, rgba(255,255,255,.34), rgba(255,255,255,.20)); backdrop-filter: blur(18px); border: 1px solid rgba(255,255,255,.22); transition: all .32s ease; }
.promo-lines article:hover { transform: translateY(-4px); box-shadow: 0 22px 52px rgba(22,15,11,.10); }

.stepper { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 26px; padding: 6px; border-radius: 16px; background: rgba(255,253,250,.78); border: 1px solid var(--line); width: fit-content; }
.stepper button { padding: 12px 16px; border-radius: 12px; color: var(--muted); font-weight: 900; }
.stepper button.active { background: linear-gradient(135deg, #221711, #3a2a21); color: #fff; }
.reservation-panel, .cart-panel { padding: 28px; border-radius: 18px; background: linear-gradient(180deg, rgba(255,255,255,.52), rgba(255,255,255,.32)); backdrop-filter: blur(18px); border: 1px solid rgba(255,255,255,.22); box-shadow: 0 18px 44px rgba(22,15,11,.08); }
.form-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
.form-grid.minimal label { display: grid; gap: 8px; color: var(--coffee); font-weight: 900; }
.form-grid .full { grid-column: 1 / -1; }
.table-map { display: grid; grid-template-columns: repeat(4, minmax(130px, 1fr)); gap: 12px; }
.table-box { min-height: 104px; padding: 16px; border-radius: 16px; text-align: left; }
.table-box.available { background: #edf5ef; color: #214734; border: 1px solid rgba(33,71,52,.1); }
.table-box.reserved { background: #fbefdc; color: #8c5b15; border: 1px solid rgba(140,91,21,.1); }
.table-box.selected { background: #221711; color: white; }
.table-legend { display: flex; gap: 18px; margin-bottom: 20px; font-weight: 800; }
.table-legend i { display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 8px; }
i.available { background: #edf5ef; border: 1px solid #214734; } i.reserved { background: #fbefdc; border: 1px solid #8c5b15; } i.selected { background: #221711; }

.menu-layout { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: clamp(22px, 3vw, 34px); align-items: start; }
.cart-panel { position: sticky; top: 96px; }
.cart-items { margin: 12px 0; }
.cart-line { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--line); }
.promo-hint { margin: 16px 0; padding: 13px; border-radius: 14px; background: rgba(54,95,75,.09); color: #214734; font-weight: 800; }

.footer-pro { display: grid; grid-template-columns: 1.4fr .9fr .9fr 1fr; gap: 28px; padding: 46px var(--site-gutter) 28px; background: linear-gradient(180deg, #1d130f, #34231a); color: rgba(255,255,255,.72); }
.footer-pro h2, .footer-pro h3 { color: #fff; margin: 0 0 14px; letter-spacing: -.02em; }
.footer-pro button { display: block; color: rgba(255,255,255,.74); text-align: left; padding: 6px 0; font-weight: 800; }
.footer-pro small { grid-column: 1/-1; padding-top: 24px; border-top: 1px solid rgba(255,255,255,.12); }

/* Internal Dashboard */
.ruang-internal { display: grid; grid-template-columns: 264px 1fr; min-height: 100vh; background: #fbf7f1; color: #221711; }
.sidebar-internal { background: #1f140f; color: #fffdfa; padding: 24px 18px; display: flex; flex-direction: column; }
.logo-internal { display: flex; align-items: center; gap: 12px; padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,.1); }
.logo-internal span { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 14px; background: #b38a5f; color: #fff; font-weight: 900; }
.menu-internal { flex: 1; margin-top: 24px; display: grid; gap: 8px; align-content: start; }
.menu-internal button { display: flex; align-items: center; gap: 12px; padding: 13px 14px; border-radius: 12px; color: rgba(255,255,255,.6); font-weight: 800; }
.menu-internal button.active { background: #b38a5f; color: #fff; }
.topbar-internal { display: flex; justify-content: space-between; align-items: center; padding: 18px 34px; background: rgba(251,247,241,.9); border-bottom: 1px solid rgba(42,24,17,.1); }
.topbar-internal h1 { font-size: 1.45rem; margin: 0; color: #221711; }
.isi-internal { padding: 28px 34px 42px; overflow-y: auto; height: calc(100vh - 78px); }
.stat-grid-kode-dua, .pegawai-stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.stat-card-kode-dua, .pegawai-stat-card { padding: 20px; border-radius: 20px; background: #fff; border: 1px solid rgba(42,24,17,.1); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 15px; }
.stat-icon { width: 48px; height: 48px; display: grid; place-items: center; border-radius: 14px; background: #f9f3ea; color: #b38a5f; }
.stat-card-kode-dua b { font-size: 1.6rem; color: #1f140f; }
.panel-kode-dua { padding: 24px; border-radius: 22px; background: #fff; border: 1px solid rgba(42,24,17,.1); box-shadow: var(--shadow-sm); }
.admin-dashboard-grid, .employee-board-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 22px; }
.queue-row-kode-dua, .reservation-mini-card { padding: 16px; border-radius: 16px; border: 1px solid rgba(42,24,17,.1); background: #fbf7f1; }
.status-pill { display: inline-flex; padding: 6px 10px; border-radius: 999px; font-size: .7rem; font-weight: 900; text-transform: uppercase; }
.status-pill.pending { background: #fbefdc; color: #8c5b15; }
.status-pill.confirmed, .status-pill.checked_in { background: #edf5ef; color: #214734; }
.status-pill.completed { background: #e8efe9; color: #365f4b; }
.admin-table-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.admin-table-cell { padding: 18px; border-radius: 16px; border: 1px solid rgba(42,24,17,.1); background: #f9f3ea; }
.admin-menu-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.admin-menu-item { display: flex; gap: 16px; padding: 16px; border-radius: 16px; border: 1px solid rgba(42,24,17,.1); background: #fff; }
.admin-menu-item img { width: 80px; height: 80px; border-radius: 12px; object-fit: cover; }

/* Modal & Toast */
.modal-backdrop { position: fixed; inset: 0; z-index: 100; background: rgba(31,20,15,.4); backdrop-filter: blur(8px); display: grid; place-items: center; }
.login-panel { width: min(420px, 100%); padding: 34px; border-radius: 24px; background: #fffdfa; box-shadow: var(--shadow-lg); position: relative; }
.toast { position: fixed; right: 24px; bottom: 24px; z-index: 110; padding: 18px; border-radius: 16px; background: #1f140f; color: #fff; display: flex; gap: 16px; box-shadow: var(--shadow-md); }
.toast.success { background: #214734; } .toast.error { background: #8c2515; }

@media (max-width: 760px) {
  .interactive-product-layout { grid-template-columns: 1fr; flex-direction: column-reverse; padding: 24px 16px; }
  .interactive-product-grid { grid-template-columns: repeat(3, minmax(0,1fr)); }
  .interactive-product-card { min-height: 132px; padding: 54px 10px 12px; }
  .interactive-product-card img { width: 74px; height: 74px; top: -34px; }
  .why-grid-noir, .admin-dashboard-grid, .employee-board-grid { grid-template-columns: 1fr; }
  .menu-layout { grid-template-columns: 1fr; }
  .footer-pro { grid-template-columns: 1fr; }
  .ruang-internal { grid-template-columns: 1fr; }
  .sidebar-internal { display: none; }
}
`;

function StyleInjector() {
  return <style>{globalCss}</style>;
}

// ==========================================
// 2. UTILS
// ==========================================
const tanggalHariIni = new Date().toISOString().slice(0, 10);
const formatRupiah = (nilai) => 'Rp ' + Number(nilai || 0).toLocaleString('id-ID');
const potongJam = (nilai) => String(nilai || '').slice(0, 5);
const buatCsv = (namaFile, baris) => {
  const csv = baris.map(row => row.map(cell => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = namaFile; link.click();
  URL.revokeObjectURL(url);
};

// ==========================================
// 3. MOCK API SERVICES
// ==========================================
const delay = (ms) => new Promise(res => setTimeout(res, ms));

const mockMenu = [
  { id: 'm1', category: 'Coffee', name: 'Dika Coffee Latte', description: 'Latte lembut dengan espresso pilihan dan foam susu yang halus.', price: 45000, imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop' },
  { id: 'm2', category: 'Food', name: 'Nasi Goreng Pedas', description: 'Nasi goreng premium dengan telur, sayuran segar, dan bumbu khas.', price: 35000, imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600&auto=format&fit=crop' },
  { id: 'm3', category: 'Snack', name: 'Roti Bakar Cokelat', description: 'Roti bakar renyah dengan topping manis dan tekstur lembut.', price: 22000, imageUrl: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=600&auto=format&fit=crop' },
  { id: 'm4', category: 'Coffee', name: 'Iced Americano', description: 'Kopi dingin yang ringan, bersih, dan cocok menemani aktivitas.', price: 32000, imageUrl: 'https://images.unsplash.com/photo-1461023058943-0708ce153359?q=80&w=600&auto=format&fit=crop' }
];

const mockPromos = [
  { title: 'Promo Diskon 20%', description: 'Otomatis aktif untuk total pesanan di atas Rp 300.000.', badge: 'PROMO 300K' },
  { title: 'Free Snack', description: 'Beli 3 kopi varian apa saja, gratis Roti Bakar.', badge: 'BUY 3 GET 1' }
];

let globalReservations = [];
let globalOrders = [];

const mockApi = {
  ambilMenuPublik: async () => { await delay(400); return mockMenu; },
  ambilPromoPublik: async () => { await delay(400); return mockPromos; },
  ambilMejaTersedia: async ({ area }) => {
    await delay(600);
    return [
      { code: 'T1', area: 'Indoor', capacity: 2, availabilityStatus: area === 'Indoor' ? 'AVAILABLE' : 'DISABLED' },
      { code: 'T2', area: 'Indoor', capacity: 4, availabilityStatus: area === 'Indoor' ? 'RESERVED' : 'DISABLED' },
      { code: 'T3', area: 'Outdoor', capacity: 4, availabilityStatus: area === 'Outdoor' ? 'AVAILABLE' : 'DISABLED' },
      { code: 'T4', area: 'Outdoor', capacity: 6, availabilityStatus: area === 'Outdoor' ? 'AVAILABLE' : 'DISABLED' },
    ];
  },
  buatReservasi: async (data) => {
    await delay(800);
    const newRes = { id: Date.now().toString(), code: `RSV-${Math.floor(1000+Math.random()*9000)}`, status: 'PENDING', ...data };
    globalReservations.push(newRes);
    return newRes;
  },
  buatPesanan: async (data) => {
    await delay(800);
    const total = data.items.reduce((sum, item) => {
      const menu = mockMenu.find(m => m.id === item.menuItemId);
      return sum + (menu.price * item.quantity);
    }, 0);
    const order = { id: Date.now().toString(), code: `ORD-${Math.floor(1000+Math.random()*9000)}`, reservationCode: data.reservationCode, status: 'PROCESSING', total, appliedPromo: total >= 300000 ? 'Diskon 20%' : null };
    globalOrders.push(order);
    return order;
  },
  loginInternal: async (data) => {
    await delay(600);
    if (data.email === 'admin@dikacoffeshop.id' && data.password === 'admin123') return { fullName: 'Admin Utama', role: 'ADMIN' };
    if (data.email === 'pegawai@dikacoffeshop.id' && data.password === 'pegawai123') return { fullName: 'Pegawai Shift 1', role: 'PEGAWAI' };
    throw new Error('Email atau password salah (Gunakan: admin@dikacoffeshop.id / admin123)');
  },
  ambilDataAdmin: async () => {
    await delay(600);
    return {
      dashboard: { totalReservationsToday: globalReservations.length, revenueToday: globalOrders.reduce((sum, o) => sum + o.total, 0) },
      reservasi: globalReservations, pesanan: globalOrders,
      meja: [{code: 'T1', area: 'Indoor', capacity: 2, physicalStatus: 'GOOD'}, {code: 'T2', area: 'Indoor', capacity: 4, physicalStatus: 'GOOD'}],
      menu: mockMenu
    };
  },
  ambilDataPegawai: async () => {
    await delay(600);
    return {
      reservasi: globalReservations, pesanan: globalOrders,
      meja: [{code: 'T1', area: 'Indoor', capacity: 2, availabilityStatus: 'AVAILABLE'}, {code: 'T2', area: 'Indoor', capacity: 4, availabilityStatus: 'RESERVED'}]
    };
  },
  ubahStatusReservasiPegawai: async (id, status) => {
    await delay(400);
    const res = globalReservations.find(r => r.id === id);
    if(res) res.status = status;
  },
  ubahStatusPesananPegawai: async (id, status) => {
    await delay(400);
    const ord = globalOrders.find(o => o.id === id);
    if(ord) ord.status = status;
  }
};


// ==========================================
// 4. UI COMPONENTS
// ==========================================
function Kosong({ judul, deskripsi, ringkas = false }) {
  return (
    <div style={{ padding: ringkas ? '18px' : '24px', border: '1px dashed rgba(42,24,17,.2)', borderRadius: '22px', background: 'rgba(255,255,255,.5)' }}>
      <b style={{ display: 'block', color: 'var(--espresso)', marginBottom: '8px' }}>{judul}</b>
      <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>{deskripsi}</p>
    </div>
  );
}

function StatusLabel({ nilai }) {
  const kelas = String(nilai || '').toLowerCase();
  return <span className={`status-pill ${kelas}`}>{nilai || '-'}</span>;
}

function TabelData({ judul, kolom, baris }) {
  return (
    <div className="panel-kode-dua panel-full">
      <div className="panel-title-row"><h2>{judul}</h2></div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>{kolom.map(item => <th key={item} style={{ padding: '12px', borderBottom: '1px solid var(--line)', color: 'var(--caramel)', fontSize: '0.8rem', textTransform: 'uppercase' }}>{item}</th>)}</tr>
          </thead>
          <tbody>
            {baris.length ? baris.map((row, index) => (
              <tr key={index}>{row.map((cell, i) => <td key={i} style={{ padding: '12px', borderBottom: '1px solid var(--line)', color: 'var(--muted)', fontSize: '0.9rem' }}>{cell}</td>)}</tr>
            )) : <tr><td colSpan={kolom.length} style={{ padding: '12px' }}>Belum ada data.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GrafikRingkas({ judul, data, tipe = 'angka' }) {
  const nilaiTertinggi = Math.max(1, ...data.map(item => Number(item.nilai || 0)));
  return (
    <section className="panel-kode-dua">
      <div className="panel-title-row"><h2>{judul}</h2></div>
      <div style={{ height: '210px', display: 'flex', alignItems: 'flex-end', gap: '14px', marginTop: '20px' }}>
        {data.map(item => {
          const tinggi = Math.max(8, Math.round((Number(item.nilai || 0) / nilaiTertinggi) * 100));
          return (
            <div key={item.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '100%', maxWidth: '40px', height: `${tinggi}%`, background: 'linear-gradient(180deg, var(--caramel), var(--coffee))', borderRadius: '8px 8px 0 0' }} />
              <small style={{ fontSize: '0.7rem', color: 'var(--muted)', textAlign: 'center' }}>{item.label}</small>
              <b style={{ fontSize: '0.8rem' }}>{tipe === 'rupiah' ? formatRupiah(item.nilai) : item.nilai}</b>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ToastInfo({ toast, tutup }) {
  if (!toast) return null;
  return (
    <div className={`toast ${toast.tipe || 'info'}`}>
      <div style={{ flex: 1 }}>
        <strong style={{ display: 'block', marginBottom: '4px' }}>{toast.judul}</strong>
        <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>{toast.pesan}</p>
      </div>
      <button onClick={tutup} style={{ color: 'white', fontSize: '1.2rem' }}>×</button>
    </div>
  );
}

// ==========================================
// 5. LAYOUTS
// ==========================================
function LayoutInternal({ jenis, tabAktif, setTabAktif, tabs, judul, deskripsi, catatan, children, tombolRefresh, loading, keluar }) {
  const admin = jenis === 'admin';
  return (
    <div className="ruang-internal">
      <aside className="sidebar-internal">
        <div className="logo-internal">
          <span>B</span>
          <div>
            <b style={{ fontSize: '1.2rem', display: 'block' }}>Dika Coffe Shop</b>
            <small style={{ color: 'rgba(255,255,255,.5)' }}>{admin ? 'Ruang Admin' : 'Ruang Pegawai'}</small>
          </div>
        </div>
        <nav className="menu-internal">
          {tabs.map(([key, label]) => (
            <button key={key} className={tabAktif === key ? 'active' : ''} onClick={() => setTabAktif(key)}>
              {label}
            </button>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,.05)', padding: '16px', borderRadius: '16px' }}>
          <b style={{ display: 'block', marginBottom: '6px' }}>{catatan.judul}</b>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,.6)' }}>{catatan.isi}</span>
        </div>
        <button onClick={keluar} style={{ marginTop: '16px', color: 'rgba(255,255,255,.6)', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <LogOut size={16} /> Keluar
        </button>
      </aside>
      <section style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <header className="topbar-internal">
          <div>
            <h1>{judul}</h1>
            <p style={{ margin: 0, color: 'var(--muted)' }}>{deskripsi}</p>
          </div>
          {tombolRefresh && (
            <button onClick={tombolRefresh} disabled={loading} style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#fff', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--line)', fontWeight: 'bold', color: 'var(--caramel)' }}>
              <RefreshCw size={16} className={loading ? 'berputar' : ''} /> {loading ? 'Memuat...' : 'Refresh'}
            </button>
          )}
        </header>
        <div className="isi-internal">
          {children}
        </div>
      </section>
    </div>
  );
}

function HeaderUtama({ ubahHalaman, bukaLogin, user, keluar }) {
  const navigasi = [['home', 'Beranda'], ['reservation', 'Reservasi'], ['menu', 'Menu'], ['flow', 'Alur'], ['promo', 'Promo']];
  return (
    <header className="site-header">
      <button className="brand" onClick={() => ubahHalaman('home')}>
        <span>B</span><strong>Dika Coffe Shop</strong>
      </button>
      <nav className="desktop-nav" style={{ display: 'flex', gap: '8px' }}>
        {navigasi.map(([key, label]) => (
          <button key={key} onClick={() => ubahHalaman(key)}>{label}</button>
        ))}
      </nav>
      <div className="header-actions">
        {user ? (
          <>
            <button className="ghost" onClick={() => ubahHalaman(user.role === 'ADMIN' ? 'admin' : 'pegawai')}>{user.role === 'ADMIN' ? 'Admin' : 'Pegawai'}</button>
            <button className="dark" onClick={keluar}>Logout</button>
          </>
        ) : (
          <>
            <button className="ghost" onClick={() => bukaLogin('pegawai')}>Pegawai</button>
            <button className="dark" onClick={() => bukaLogin('admin')}>Admin</button>
          </>
        )}
      </div>
    </header>
  );
}

function FooterProfesional({ bukaLogin }) {
  return (
    <footer className="footer-pro">
      <div>
        <h2>Dika Coffe Shop</h2>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>Sistem reservasi digital untuk mengelola meja, pesanan, promo, dan operasional coffee shop.</p>
      </div>
      <div>
        <h3>Layanan</h3>
        <button>Reservasi Meja</button><button>Menu Digital</button><button>Keranjang Pesanan</button>
      </div>
      <div>
        <h3>Operasional</h3>
        <button onClick={() => bukaLogin('pegawai')}>Login Pegawai</button>
        <button onClick={() => bukaLogin('admin')}>Login Admin</button>
      </div>
      <div>
        <h3>Kontak</h3>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>Jl. Aroma Kopi No. 21<br />Buka 09.00 - 22.00<br />support@dikacoffeshop.id</p>
      </div>
      <small>© 2026 Dika Coffe Shop Coffee Reservation System.</small>
    </footer>
  );
}

// ==========================================
// 6. PAGES
// ==========================================
function LoginInternal({ mode, tutup, sukses, beriNotifikasi }) {
  const [form, setForm] = useState({ email: mode === 'admin' ? 'admin@dikacoffeshop.id' : 'pegawai@dikacoffeshop.id', password: mode === 'admin' ? 'admin123' : 'pegawai123' });
  const [loading, setLoading] = useState(false);

  const masuk = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await mockApi.loginInternal(form);
      const roleBenar = mode === 'admin' ? 'ADMIN' : 'PEGAWAI';
      if (user.role !== roleBenar) throw new Error('Akses tidak sesuai.');
      sukses(user);
      beriNotifikasi('Login berhasil', `Selamat bekerja, ${user.fullName}.`, 'success');
    } catch (error) {
      beriNotifikasi('Login gagal', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <form className="login-panel" onSubmit={masuk}>
        <button type="button" onClick={tutup} style={{ position: 'absolute', right: '20px', top: '20px', fontSize: '1.2rem' }}>×</button>
        <span className="eyebrow">Akses Internal</span>
        <h2 style={{ margin: '10px 0 20px', fontSize: '2rem', color: 'var(--espresso)' }}>{mode === 'admin' ? 'Login Admin' : 'Login Pegawai'}</h2>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email</label>
          <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Password</label>
          <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        </div>
        <button className="primary wide" disabled={loading}>{loading ? 'Memeriksa...' : 'Masuk'}</button>
      </form>
    </div>
  );
}

function BerandaPelanggan({ ubahHalaman, menu }) {
  const produkHero = [
    { id: 'p1', kategori: 'Coffee', nama: 'Dika Coffee Latte', judul: 'Find perfect drink', subjudul: 'crafted just for you', deskripsi: 'Latte lembut dengan espresso pilihan dan foam susu yang halus.', harga: 45000, warna: 'rgba(54,95,75,0.96)', warnaGelap: '#1e382b', gambar: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop', label: 'Signature' },
    { id: 'p2', kategori: 'Food', nama: 'Nasi Goreng Pedas', judul: 'Taste authentic', subjudul: 'spicy goodness', deskripsi: 'Nasi goreng premium dengan telur, sayuran segar, dan bumbu khas.', harga: 35000, warna: 'rgba(179,138,95,0.96)', warnaGelap: '#8c5b15', gambar: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600&auto=format&fit=crop', label: 'Recommended' },
    { id: 'p3', kategori: 'Snack', nama: 'Roti Bakar', judul: 'Sweet comfort', subjudul: 'in every bite', deskripsi: 'Roti bakar renyah dengan topping manis dan tekstur lembut.', harga: 22000, warna: 'rgba(140,37,21,0.96)', warnaGelap: '#5c170e', gambar: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=600&auto=format&fit=crop', label: 'Snack' }
  ];
  
  const [produkAktif, setProdukAktif] = useState(produkHero[0]);
  const [jumlah, setJumlah] = useState(2);

  return (
    <section className="product-landing" id="home">
      <div className="interactive-hero-shell" style={{ '--warna-produk': produkAktif.warna, '--warna-produk-gelap': produkAktif.warnaGelap }}>
        <div className="interactive-product-layout">
          <div className="interactive-product-copy">
            <span className="landing-eyebrow">Dika Coffe Shop System</span>
            <AnimatePresence mode="wait">
              <motion.div key={produkAktif.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
                <h1>{produkAktif.judul} <br/><span>{produkAktif.subjudul}</span></h1>
                <strong className="hero-price" style={{ color: produkAktif.warna }}>{formatRupiah(produkAktif.harga)}</strong>
                <p>{produkAktif.deskripsi}</p>
              </motion.div>
            </AnimatePresence>

            <div className="interactive-control-row">
              <div className="guest-counter">
                <button onClick={() => setJumlah(Math.max(1, jumlah-1))}><Minus size={14}/></button>
                <span>{String(jumlah).padStart(2, '0')}</span>
                <button onClick={() => setJumlah(Math.min(99, jumlah+1))}><Plus size={14}/></button>
              </div>
              <button className="dynamic-cta" onClick={() => ubahHalaman('reservation')}>Mulai Reservasi <Calendar size={16}/></button>
              <button className="ghost-cta" onClick={() => ubahHalaman('menu')}>Lihat Menu</button>
            </div>

            <div className="interactive-product-grid">
              {produkHero.map(item => (
                <div key={item.id} className={`interactive-product-card ${produkAktif.id === item.id ? 'active' : ''}`} onClick={() => setProdukAktif(item)} style={{ background: `linear-gradient(180deg, ${item.warna}, rgba(0,0,0,0.8))` }}>
                  <img src={item.gambar} alt={item.nama} style={{ borderRadius: '50%' }} />
                  <span>{item.kategori}</span>
                  <strong>{item.nama}</strong>
                  <small>{formatRupiah(item.harga)}</small>
                </div>
              ))}
            </div>
          </div>
          <div className="interactive-showcase-area">
            <div className="product-image-stage">
              <div className="dynamic-product-shape" style={{ background: produkAktif.warna }} />
              <div className="product-image-glow" />
              <AnimatePresence mode="wait">
                <motion.img key={produkAktif.id} src={produkAktif.gambar} alt={produkAktif.nama} className="hero-selected-product" style={{ borderRadius: '24px' }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.4 }} />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AlurPelanggan({ ubahHalaman }) {
  const langkah = [['01', 'Pilih Jadwal', 'Tentukan tanggal, jam, dan jumlah tamu.'], ['02', 'Pilih Meja', 'Pilih meja yang tersedia dari denah visual.'], ['03', 'Konfirmasi', 'Lengkapi data pemesan.'], ['04', 'Pesan Menu', 'Setelah meja terkonfirmasi, pilih menu.']];
  return (
    <section className="flow-noir" id="flow">
      <div className="section-intro">
        <div>
          <span className="eyebrow">Alur Reservasi</span>
          <h2>Reservasi meja terlebih dahulu, lalu lanjutkan pesanan menu.</h2>
        </div>
        <button className="secondary" onClick={() => ubahHalaman('reservation')} style={{ width: 'fit-content' }}>Mulai dari Meja</button>
      </div>
      <div className="flow-line-noir">
        {langkah.map(item => (
          <article key={item[0]}>
            <span>{item[0]}</span>
            <h3>{item[1]}</h3>
            <p>{item[2]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PromoPelanggan({ promos }) {
  return (
    <section className="promo-strip" id="promo">
      <div>
        <span className="eyebrow">Promo aktif</span>
        <h2>Benefit otomatis untuk pesanan tertentu.</h2>
      </div>
      <div className="promo-lines">
        {promos.map(promo => (
          <article key={promo.title}>
            <b>{promo.badge}</b>
            <div>
              <h3>{promo.title}</h3>
              <p>{promo.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReservasiMeja({ reservasiAktif, setReservasiAktif, beriNotifikasi }) {
  const [langkah, setLangkah] = useState(1);
  const [daftarMeja, setDaftarMeja] = useState([]);
  const [form, setForm] = useState({ reservationDate: tanggalHariIni, reservationTime: '19:00', guestCount: 2, area: 'Indoor', tableCode: '', guestName: '', phone: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    mockApi.ambilMejaTersedia({ area: form.area }).then(setDaftarMeja);
  }, [form.area, form.reservationDate]);

  const lanjut = () => setLangkah(Math.min(4, langkah + 1));
  
  const submit = async () => {
    setLoading(true);
    try {
      const res = await mockApi.buatReservasi(form);
      setReservasiAktif(res);
      setLangkah(1);
      beriNotifikasi('Reservasi berhasil', `Kode: ${res.code}`, 'success');
    } catch (e) {
      beriNotifikasi('Gagal', e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="reservation-layout" id="reservation">
      <div className="reservation-heading">
        <span className="eyebrow">Reservasi Meja</span>
        <h2>Pilih meja berdasarkan waktu kunjungan.</h2>
      </div>
      <div className="stepper">
        {['Waktu', 'Meja', 'Data Tamu', 'Review'].map((label, idx) => (
          <button key={label} className={langkah === idx + 1 ? 'active' : ''} onClick={() => setLangkah(idx + 1)}>{idx + 1}. {label}</button>
        ))}
      </div>
      
      <div className="reservation-panel">
        {langkah === 1 && (
          <div className="form-grid minimal">
            <label>Tanggal <input type="date" value={form.reservationDate} onChange={e => setForm({...form, reservationDate: e.target.value})} /></label>
            <label>Jam <input type="time" value={form.reservationTime} onChange={e => setForm({...form, reservationTime: e.target.value})} /></label>
            <label>Tamu <input type="number" min="1" value={form.guestCount} onChange={e => setForm({...form, guestCount: e.target.value})} /></label>
            <label>Area <select value={form.area} onChange={e => setForm({...form, area: e.target.value, tableCode: ''})}><option>Indoor</option><option>Outdoor</option></select></label>
          </div>
        )}
        {langkah === 2 && (
          <div>
            <div className="table-legend">
              <span><i className="available"/> Tersedia</span><span><i className="reserved"/> Terisi</span><span><i className="selected"/> Dipilih</span>
            </div>
            <div className="table-map">
              {daftarMeja.map(meja => (
                <button key={meja.code} className={`table-box ${form.tableCode === meja.code ? 'selected' : meja.availabilityStatus.toLowerCase()}`} disabled={meja.availabilityStatus !== 'AVAILABLE'} onClick={() => setForm({...form, tableCode: meja.code})}>
                  <strong style={{ display: 'block', fontSize: '1.4rem', marginBottom: '8px' }}>{meja.code}</strong>
                  <small>{meja.capacity} kursi</small>
                </button>
              ))}
            </div>
          </div>
        )}
        {langkah === 3 && (
          <div className="form-grid minimal">
            <label style={{ gridColumn: 'span 2' }}>Nama <input value={form.guestName} onChange={e => setForm({...form, guestName: e.target.value})} placeholder="Adi Nugroho" /></label>
            <label style={{ gridColumn: 'span 2' }}>WhatsApp <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="0812..." /></label>
          </div>
        )}
        {langkah === 4 && (
          <div style={{ display: 'grid', gap: '12px' }}>
            <p>Tanggal: <b>{form.reservationDate} {form.reservationTime}</b></p>
            <p>Meja: <b>{form.tableCode} ({form.area})</b></p>
            <p>Nama: <b>{form.guestName}</b></p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
          {langkah > 1 && <button className="secondary" onClick={() => setLangkah(langkah-1)}>Kembali</button>}
          {langkah < 4 ? <button className="primary" onClick={lanjut}>Lanjut</button> : <button className="primary" onClick={submit} disabled={loading}>{loading ? 'Memproses...' : 'Konfirmasi'}</button>}
        </div>
      </div>
      
      {reservasiAktif && (
        <div style={{ marginTop: '24px', padding: '16px', background: 'var(--sage-soft)', borderRadius: '16px', color: 'var(--sage)' }}>
          Reservasi Berhasil! Kode: <strong>{reservasiAktif.code}</strong>. Silakan lanjut ke menu pemesanan.
        </div>
      )}
    </section>
  );
}

function MenuKeranjang({ menu, reservasiAktif, ubahHalaman, beriNotifikasi }) {
  const [keranjang, setKeranjang] = useState([]);
  const [hasilPesanan, setHasilPesanan] = useState(null);
  const subtotal = keranjang.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const tambah = (item) => {
    if (!reservasiAktif) { beriNotifikasi('Error', 'Buat reservasi meja dulu.', 'error'); ubahHalaman('reservation'); return; }
    setKeranjang(prev => {
      const exist = prev.find(i => i.id === item.id);
      if (exist) return prev.map(i => i.id === item.id ? {...i, qty: i.qty+1} : i);
      return [...prev, {...item, qty: 1}];
    });
  };

  const checkout = async () => {
    if (!keranjang.length) return;
    try {
      const res = await mockApi.buatPesanan({ reservationCode: reservasiAktif.code, items: keranjang.map(i => ({menuItemId: i.id, quantity: i.qty})) });
      setHasilPesanan(res); setKeranjang([]);
      beriNotifikasi('Sukses', `Pesanan ${res.code} berhasil dibuat`, 'success');
    } catch(e) {}
  };

  return (
    <section className="menu-order" id="menu">
      <div className="section-intro">
        <h2>Pilihan Menu</h2>
        <p>Pesanan menu akan terhubung langsung dengan kode reservasi Anda.</p>
      </div>
      <div className="menu-layout">
        <div className="menu-list-clean">
          {menu.map(item => (
            <div className="menu-row" key={item.id}>
              <img src={item.imageUrl} alt={item.name} />
              <div>
                <span>{item.category}</span>
                <h3 style={{ margin: '4px 0 8px' }}>{item.name}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{item.description}</p>
              </div>
              <strong style={{ color: 'var(--coffee)' }}>{formatRupiah(item.price)}</strong>
              <button onClick={() => tambah(item)}>Tambah</button>
            </div>
          ))}
        </div>
        <aside className="cart-panel">
          <span className="eyebrow">Keranjang</span>
          <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>{reservasiAktif ? `RSV: ${reservasiAktif.code}` : 'Belum ada reservasi aktif'}</p>
          <div className="cart-items">
            {keranjang.length === 0 ? <em style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Belum ada item.</em> : keranjang.map(item => (
              <div className="cart-line" key={item.id}>
                <span>{item.name} <small>x{item.qty}</small></span>
                <b>{formatRupiah(item.price * item.qty)}</b>
              </div>
            ))}
          </div>
          <div className="promo-hint">{subtotal >= 300000 ? 'Promo Rp300K Aktif!' : `Tambah ${formatRupiah(Math.max(0, 300000-subtotal))} untuk promo`}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', margin: '20px 0', fontWeight: 'bold' }}><span>Total</span> <span>{formatRupiah(subtotal)}</span></div>
          <button className="primary wide" onClick={checkout} disabled={!keranjang.length || !reservasiAktif}>Checkout</button>
          
          {hasilPesanan && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--line)' }}>
              <span className="eyebrow">Pesanan Berhasil</span>
              <h3 style={{ margin: '0 0 8px' }}>{hasilPesanan.code}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--sage)' }}>{hasilPesanan.appliedPromo || 'Tanpa promo'}</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

function RuangAdmin({ keluar, beriNotifikasi }) {
  const [tabAktif, setTabAktif] = useState('dashboard');
  const [data, setData] = useState(null);
  
  const muatData = () => mockApi.ambilDataAdmin().then(setData).catch(e => beriNotifikasi('Error', e.message, 'error'));
  useEffect(() => { muatData(); }, []);

  if (!data) return <LayoutInternal jenis="admin" tabAktif={tabAktif} setTabAktif={setTabAktif} tabs={[['dashboard', 'Dashboard']]} judul="Memuat..." catatan={{}} keluar={keluar} loading={true}/>;

  const tabs = [['dashboard', 'Dashboard'], ['reservasi', 'Reservasi'], ['pesanan', 'Pesanan'], ['meja', 'Meja'], ['menu', 'Menu']];
  const stat = [
    { label: 'Reservasi', value: data.dashboard.totalReservationsToday, icon: CalendarCheck },
    { label: 'Revenue', value: formatRupiah(data.dashboard.revenueToday), icon: DollarSign }
  ];

  return (
    <LayoutInternal jenis="admin" tabAktif={tabAktif} setTabAktif={setTabAktif} tabs={tabs} judul="Admin Dashboard" deskripsi="Pantau seluruh operasional hari ini." catatan={{ judul: 'Workspace', isi: 'Admin Panel (Mock Mode)' }} tombolRefresh={muatData} keluar={keluar}>
      {tabAktif === 'dashboard' && (
        <div style={{ display: 'grid', gap: '24px' }}>
          <div className="stat-grid-kode-dua">
            {stat.map(s => (
              <div key={s.label} className="stat-card-kode-dua">
                <div className="stat-icon"><s.icon size={24}/></div>
                <div><span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{s.label}</span><b>{s.value}</b></div>
              </div>
            ))}
          </div>
          <div className="admin-dashboard-grid">
            <div className="panel-kode-dua">
              <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Reservasi Terbaru</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {data.reservasi.map(r => (
                  <div key={r.id} className="reservation-mini-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <b>{r.guestName}</b> <StatusLabel nilai={r.status}/>
                    </div>
                    <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--muted)' }}>{r.code} • Meja {r.tableCode}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel-kode-dua">
               <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Pesanan</h2>
               <div style={{ display: 'grid', gap: '12px' }}>
                 {data.pesanan.map(o => (
                   <div key={o.id} style={{ padding: '12px', background: '#f9f3ea', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
                     <div><b style={{ display: 'block', fontSize: '0.9rem' }}>{o.code}</b><span style={{ fontSize: '0.75rem' }}>{o.reservationCode}</span></div>
                     <div style={{ textAlign: 'right' }}><b style={{ display: 'block', color: 'var(--caramel)' }}>{formatRupiah(o.total)}</b><StatusLabel nilai={o.status}/></div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      )}
      {tabAktif === 'reservasi' && <TabelData judul="Data Reservasi" kolom={['Kode', 'Tamu', 'Meja', 'Status']} baris={data.reservasi.map(r => [r.code, r.guestName, r.tableCode, r.status])} />}
      {tabAktif === 'pesanan' && <TabelData judul="Data Pesanan" kolom={['Kode', 'RSV', 'Total', 'Status']} baris={data.pesanan.map(o => [o.code, o.reservationCode, formatRupiah(o.total), o.status])} />}
      {tabAktif === 'meja' && (
        <div className="panel-kode-dua panel-full">
          <h2>Master Meja</h2>
          <div className="admin-table-grid" style={{ marginTop: '16px' }}>
             {data.meja.map(m => <div key={m.code} className="admin-table-cell"><b style={{ fontSize: '1.5rem', display: 'block' }}>{m.code}</b><small>{m.area} • {m.capacity} kursi</small></div>)}
          </div>
        </div>
      )}
      {tabAktif === 'menu' && (
        <div className="panel-kode-dua panel-full">
          <h2>Master Menu</h2>
          <div className="admin-menu-grid" style={{ marginTop: '16px' }}>
            {data.menu.map(m => (
              <div key={m.id} className="admin-menu-item">
                <img src={m.imageUrl} alt={m.name} />
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--caramel)', fontWeight: 'bold', textTransform: 'uppercase' }}>{m.category}</span>
                  <b style={{ display: 'block', margin: '4px 0' }}>{m.name}</b>
                  <strong style={{ color: 'var(--espresso)' }}>{formatRupiah(m.price)}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </LayoutInternal>
  );
}

function RuangPegawai({ keluar, beriNotifikasi }) {
  const [tabAktif, setTabAktif] = useState('antrian');
  const [data, setData] = useState(null);
  
  const muatData = () => mockApi.ambilDataPegawai().then(setData);
  useEffect(() => { muatData(); }, []);

  const updateRsv = async (id, status) => { await mockApi.ubahStatusReservasiPegawai(id, status); muatData(); beriNotifikasi('Sukses', `Status reservasi menjadi ${status}`, 'success'); }
  const updateOrd = async (id, status) => { await mockApi.ubahStatusPesananPegawai(id, status); muatData(); beriNotifikasi('Sukses', `Status pesanan menjadi ${status}`, 'success'); }

  if (!data) return <LayoutInternal jenis="pegawai" tabAktif={tabAktif} setTabAktif={setTabAktif} tabs={[['antrian', 'Antrian']]} judul="Memuat..." catatan={{}} keluar={keluar} loading={true}/>;

  return (
    <LayoutInternal jenis="pegawai" tabAktif={tabAktif} setTabAktif={setTabAktif} tabs={[['antrian', 'Antrian Check-in'], ['pesanan', 'Antrian Pesanan']]} judul="Workspace Pegawai" deskripsi="Kelola check-in tamu dan pesanan berjalan." catatan={{ judul: 'Shift', isi: 'Pegawai Panel (Mock)' }} tombolRefresh={muatData} keluar={keluar}>
      {tabAktif === 'antrian' && (
        <div className="panel-kode-dua">
          <h2>Antrian Check-in</h2>
          <div style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
            {data.reservasi.map(r => (
              <div key={r.id} className="queue-row-kode-dua" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><b style={{ fontSize: '1.1rem', display: 'block' }}>{r.guestName}</b><span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{r.code} • Meja {r.tableCode}</span></div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <StatusLabel nilai={r.status}/>
                  {r.status === 'PENDING' && <button className="primary" onClick={() => updateRsv(r.id, 'CHECKED_IN')}>Check-In</button>}
                  {r.status === 'CHECKED_IN' && <button className="green-cta" onClick={() => updateRsv(r.id, 'COMPLETED')} style={{ minHeight: '36px', padding: '8px 16px', borderRadius: '8px' }}>Selesai</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tabAktif === 'pesanan' && (
        <div className="panel-kode-dua">
          <h2>Pesanan Berjalan</h2>
          <div style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
            {data.pesanan.map(o => (
              <div key={o.id} className="queue-row-kode-dua" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><b style={{ fontSize: '1.1rem', display: 'block' }}>{o.code}</b><span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>RSV: {o.reservationCode}</span></div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <b style={{ color: 'var(--caramel)' }}>{formatRupiah(o.total)}</b>
                  <StatusLabel nilai={o.status}/>
                  {o.status === 'PROCESSING' && <button className="primary" onClick={() => updateOrd(o.id, 'READY')}>Siap</button>}
                  {o.status === 'READY' && <button className="green-cta" onClick={() => updateOrd(o.id, 'COMPLETED')} style={{ minHeight: '36px', padding: '8px 16px', borderRadius: '8px' }}>Selesai</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </LayoutInternal>
  );
}

// ==========================================
// 7. MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [halaman, setHalaman] = useState('home');
  const [modeLogin, setModeLogin] = useState(null);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [menu, setMenu] = useState([]);
  const [promos, setPromos] = useState([]);
  const [reservasiAktif, setReservasiAktif] = useState(null);

  const beriNotifikasi = (judul, pesan, tipe = 'info') => {
    setToast({ judul, pesan, tipe });
    setTimeout(() => setToast(null), 4500);
  };

  useEffect(() => {
    mockApi.ambilMenuPublik().then(setMenu);
    mockApi.ambilPromoPublik().then(setPromos);
  }, []);

  const keluar = () => { setUser(null); setHalaman('home'); };

  if (halaman === 'admin' && user?.role === 'ADMIN') return <><StyleInjector/><RuangAdmin keluar={keluar} beriNotifikasi={beriNotifikasi} /><ToastInfo toast={toast} tutup={() => setToast(null)} /></>;
  if (halaman === 'pegawai' && user?.role === 'PEGAWAI') return <><StyleInjector/><RuangPegawai keluar={keluar} beriNotifikasi={beriNotifikasi} /><ToastInfo toast={toast} tutup={() => setToast(null)} /></>;

  return (
    <>
      <StyleInjector />
      <HeaderUtama ubahHalaman={setHalaman} bukaLogin={setModeLogin} user={user} keluar={keluar} />
      <main>
        {halaman === 'home' && <BerandaPelanggan ubahHalaman={setHalaman} menu={menu} />}
        {halaman === 'flow' && <AlurPelanggan ubahHalaman={setHalaman} />}
        {halaman === 'promo' && <PromoPelanggan promos={promos} />}
        {halaman === 'reservation' && <ReservasiMeja reservasiAktif={reservasiAktif} setReservasiAktif={setReservasiAktif} beriNotifikasi={beriNotifikasi} />}
        {halaman === 'menu' && <MenuKeranjang menu={menu} reservasiAktif={reservasiAktif} ubahHalaman={setHalaman} beriNotifikasi={beriNotifikasi} />}
      </main>
      <FooterProfesional bukaLogin={setModeLogin} />
      
      {modeLogin && (
        <LoginInternal 
          mode={modeLogin} 
          tutup={() => setModeLogin(null)} 
          sukses={(akun) => { setUser(akun); setModeLogin(null); setHalaman(akun.role === 'ADMIN' ? 'admin' : 'pegawai'); }}
          beriNotifikasi={beriNotifikasi} 
        />
      )}
      <ToastInfo toast={toast} tutup={() => setToast(null)} />
    </>
  );
}
```
