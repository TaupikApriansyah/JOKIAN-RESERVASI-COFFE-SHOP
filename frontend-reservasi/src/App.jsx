// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  display: flex; align-items: center;
  background-image:
    linear-gradient(90deg, rgba(248,241,232,.96) 0%, rgba(248,241,232,.88) 34%, rgba(248,241,232,.58) 58%, rgba(248,241,232,.34) 100%),
    radial-gradient(circle at 22% 14%, rgba(255,255,255,.38), transparent 24rem),
    url('/images/bg-beranda.png');
  background-size: cover, auto, cover;
  background-position: center, left top, center;
  background-repeat: no-repeat;
}
.interactive-product-layout {
  width: 100%; min-height: calc(100vh - 76px); display: grid; align-items: center;
  grid-template-columns: minmax(430px, .82fr) minmax(560px, 1.18fr);
  gap: clamp(36px, 6vw, 120px);
  padding: clamp(34px, 4vh, 54px) var(--site-gutter) clamp(48px, 6vh, 78px);
}
.interactive-product-copy { position: relative; z-index: 2; max-width: 580px; align-self: center; padding: 18px 18px 18px 0; }
.interactive-product-copy h1 { font-size: clamp(3.15rem, 5.35vw, 5.9rem); line-height: .93; margin: 10px 0 14px; color: var(--espresso); max-width: 600px; }
.hero-price { display: block; margin-bottom: 12px; color: var(--sage); font-size: clamp(1.9rem, 2.4vw, 2.75rem); font-weight: 900; }
.interactive-product-copy p { max-width: 500px; color: var(--muted); line-height: 1.65; }
.interactive-control-row { display: flex; flex-wrap: wrap; gap: 14px; margin: 26px 0 28px; position: relative; z-index: 3; }
.guest-counter { width: 132px; min-height: 48px; display: flex; align-items: center; justify-content: space-between; padding: 5px; border-radius: 14px; background: rgba(255,253,250,.70); border: 1px solid var(--line); backdrop-filter: blur(18px); }
.guest-counter button { width: 34px; height: 34px; border-radius: 50%; color: #604b3d; font-weight: 900; }

.interactive-product-grid { display: grid; grid-template-columns: repeat(2, minmax(170px, 1fr)); gap: 18px; position: relative; z-index: 3; max-width: 390px; }
.interactive-product-card {
  min-height: 148px; padding: 50px 16px 16px; border-radius: 18px; display: grid; align-content: end; text-align: left; gap: 4px; color: white; cursor: pointer;
  background: linear-gradient(180deg, rgba(255,255,255,.12), rgba(0,0,0,.16)); border: 1px solid rgba(255,255,255,.16); backdrop-filter: blur(18px); box-shadow: 0 14px 34px rgba(24,17,13,.10); transition: all .32s ease; overflow: hidden;
}
.interactive-product-card:hover { transform: translateY(-6px); box-shadow: 0 12px 26px rgba(0,0,0,.08); }
.interactive-product-card.active { transform: translateY(-8px); border-color: rgba(255,255,255,.56); box-shadow: 0 18px 40px rgba(24,17,13,.18); }
.interactive-product-card img { position: absolute; left: 50%; top: -12px; width: 108px; height: 108px; transform: translateX(-50%); filter: drop-shadow(0 10px 16px rgba(38,23,12,.18)); object-fit: contain; background: transparent !important; border-radius: 0 !important; }
.interactive-product-card span { font-size: .66rem; text-transform: uppercase; font-weight: 900; opacity: .82; margin-top: 18px; }
.interactive-product-card strong { font-size: .86rem; line-height: 1.12; }

.interactive-showcase-area { min-height: unset; align-self: stretch; display: flex; align-items: center; justify-content: center; position: relative; }
.product-image-stage { width: min(780px, 100%); min-height: min(600px, 64vh); display: grid; place-items: center; position: relative; background: transparent !important; }
.dynamic-product-shape { display: none !important; }
.product-image-glow { display: none !important; }
.hero-selected-product { position: relative; z-index: 3; width: min(820px, 100%); height: clamp(440px, 40vw, 660px); object-fit: contain; object-position: center; filter: drop-shadow(0 32px 36px rgba(24,17,13,.22)); }
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
.menu-line-noir img, .menu-row img { width: 96px; height: 78px; object-fit: contain; border-radius: 14px; background: transparent; }

.promo-strip { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: start; }
.promo-lines { display: grid; gap: 16px; grid-template-columns: 1fr; }
.promo-lines article { display: grid; grid-template-columns: 140px minmax(0, 1fr); align-items: center; gap: 18px; padding: 24px 22px; border-radius: 24px; background: linear-gradient(180deg, rgba(255,255,255,.42), rgba(255,255,255,.24)); backdrop-filter: blur(18px); border: 1px solid rgba(255,255,255,.28); transition: all .32s ease; }
.promo-lines article:hover { transform: translateY(-4px); box-shadow: 0 22px 52px rgba(22,15,11,.10); }
.promo-heading { max-width: 720px; }
.promo-heading h2 { margin-top: 6px; max-width: 560px; }
.promo-badge-card { font-size: 1.35rem; font-weight: 900; color: var(--espresso); line-height: 1.05; }
.promo-copy h3 { margin: 0 0 8px; font-size: 1.7rem; color: var(--espresso); }
.promo-copy p { margin: 0; color: var(--muted); font-size: 1rem; line-height: 1.6; }


.stepper { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 26px; padding: 6px; border-radius: 16px; background: rgba(255,253,250,.78); border: 1px solid var(--line); width: fit-content; }
.stepper button { padding: 12px 16px; border-radius: 12px; color: var(--muted); font-weight: 900; }
.stepper button.active { background: linear-gradient(135deg, #221711, #3a2a21); color: #fff; }
.reservation-panel, .cart-panel { padding: 28px; border-radius: 18px; background: linear-gradient(180deg, rgba(255,255,255,.52), rgba(255,255,255,.32)); backdrop-filter: blur(18px); border: 1px solid rgba(255,255,255,.22); box-shadow: 0 18px 44px rgba(22,15,11,.08); }
.form-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
.form-grid.minimal label { display: grid; gap: 8px; color: var(--coffee); font-weight: 900; }
.form-grid .full { grid-column: 1 / -1; }

.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 130;
  display: grid;
  place-items: center;
  background: transparent;
  backdrop-filter: none;
}
.loading-overlay-card {
  width: auto;
  min-height: auto;
  display: grid;
  place-items: center;
  padding: 0;
  border-radius: 0;
  background: transparent;
  border: 0;
  box-shadow: none;
}
.auth-helper-row {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;
  color: var(--muted);
  font-size: .88rem;
}
.auth-link-button {
  color: var(--sage);
  font-weight: 900;
  padding: 0;
  border: 0 !important;
  min-height: auto !important;
}
.admin-employee-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
}
.employee-account-card {
  padding: 18px;
  border-radius: 18px;
  background: rgba(255,253,250,.86);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm);
}
.employee-account-card h3 { margin: 0 0 8px; color: var(--espresso); }
.employee-shift-line { color: var(--muted); font-size: .88rem; line-height: 1.55; margin: 8px 0 12px; }

.cafe-reservation-shell {
  display: grid;
  grid-template-columns: minmax(250px, .36fr) minmax(0, .64fr);
  gap: 22px;
  align-items: start;
}
.cafe-sidebar-card {
  padding: 22px;
  border-radius: 22px;
  background: rgba(255,253,250,.88);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm);
}
.floor-tabs {
  display: flex;
  gap: 8px;
  padding: 6px;
  border-radius: 16px;
  background: #f3eee7;
  margin: 18px 0;
}
.floor-tabs button {
  flex: 1;
  min-height: 40px;
  border-radius: 12px;
  font-weight: 900;
  color: var(--muted);
}
.floor-tabs button.active {
  background: #fffdfa;
  color: var(--espresso);
  box-shadow: 0 8px 18px rgba(22,15,11,.08);
}
.cafe-map-container {
  position: relative;
  width: 100%;
  max-width: 620px;
  aspect-ratio: 1;
  margin: 0 auto;
  border-radius: 1rem;
  box-shadow: 0 16px 34px rgba(22,15,11,.12);
  background-color: #fdfbf7;
  overflow: hidden;
  border: 1px solid rgba(42, 24, 17, .12);
}
.floor-plan-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.cafe-tables {
  position: absolute;
  inset: 0;
  z-index: 2;
}
.table-spot {
  position: absolute;
  left: calc(var(--x) * 1%);
  top: calc(var(--y) * 1%);
  transform: translate(-50%, -50%);
  width: var(--size, 3.5rem);
  height: var(--size, 3.5rem);
  border-radius: var(--shape, 50%);
  background-color: var(--t-bg);
  border: 3px solid var(--t-border);
  box-shadow: 0 4px 6px rgba(0,0,0,.1), inset 0 2px 4px rgba(255,255,255,.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: var(--t-border);
  transition: all .3s cubic-bezier(.4,0,.2,1);
  cursor: pointer;
  z-index: 4;
}
.table-spot::after {
  content: '';
  width: 50%;
  height: 50%;
  border-radius: inherit;
  background-color: rgba(0,0,0,.05);
  position: absolute;
}
.table-spot b {
  position: relative;
  z-index: 2;
  font-size: .88rem;
}
.table-spot.available {
  --t-bg: #ecfdf5;
  --t-border: #10b981;
  --sign-bg: #10b981;
  --sign-color: #fff;
}
.table-spot.available:hover {
  transform: translate(-50%, -50%) scale(1.1);
  box-shadow: 0 10px 15px rgba(16,185,129,.3);
}
.table-spot.reserved {
  --t-bg: #fef2f2;
  --t-border: #ef4444;
  --sign-bg: #ef4444;
  --sign-color: #fff;
  cursor: not-allowed;
  opacity: .82;
}
.table-spot.selected {
  --t-bg: #e0f2fe;
  --t-border: #0ea5e9;
  --sign-bg: #0ea5e9;
  --sign-color: #fff;
  transform: translate(-50%, -50%) scale(1.15);
  box-shadow: 0 0 0 4px rgba(14,165,233,.3);
  animation: pulse-border 2s infinite;
}
.table-label {
  display: none;
  position: absolute;
  bottom: calc(100% + 15px);
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  width: max-content;
  z-index: 999;
  pointer-events: none;
}
.table-sign {
  align-items: center;
  background-color: var(--sign-bg);
  border-radius: .5rem;
  border: 2px solid #fff;
  box-shadow: 0 4px 6px rgba(0,0,0,.15);
  color: var(--sign-color);
  column-gap: .4em;
  display: flex;
  font-size: .78rem;
  font-weight: 800;
  justify-content: center;
  padding: .5em .8em;
  text-wrap: nowrap;
  position: relative;
}
.table-sign::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: var(--sign-bg) transparent transparent transparent;
}
.table-sign::before {
  content: attr(data-icon);
  font-size: 1.1em;
}
.table-spot:hover .table-label,
.table-spot.selected .table-label {
  animation: fadeup 300ms forwards ease-out;
  display: block;
}
.table-spot:hover .table-sign.anim::before,
.table-spot.selected .table-sign.anim::before {
  animation-duration: 500ms;
  animation-fill-mode: forwards;
}
.table-spot:hover .table-sign.anim-grow::before,
.table-spot.selected .table-sign.anim-grow::before {
  animation-name: grow;
  animation-timing-function: ease-in;
}
.table-spot:hover .table-sign.anim-slidein::before,
.table-spot.selected .table-sign.anim-slidein::before {
  animation-name: slidein;
  animation-timing-function: ease-out;
}
@keyframes fadeup {
  0% { opacity: 0; bottom: calc(100% + 0px); }
  100% { opacity: 1; bottom: calc(100% + 15px); }
}
@keyframes grow {
  0% { transform: translate(0, 100%) scale(0); }
  50% { transform: translate(0, -10%) scale(1.2); }
  100% { transform: translate(0, 0) scale(1); }
}
@keyframes slidein {
  0% { transform: translateX(-150%) scale(.5); opacity: 0; }
  100% { transform: translateX(0) scale(1); opacity: 1; }
}
@keyframes pulse-border {
  0% { box-shadow: 0 0 0 0 rgba(14,165,233,.4); }
  70% { box-shadow: 0 0 0 10px rgba(14,165,233,0); }
  100% { box-shadow: 0 0 0 0 rgba(14,165,233,0); }
}
.selected-table-summary {
  padding: 16px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid rgba(15,23,42,.09);
  margin-top: 14px;
}
.selected-table-summary p { margin: 4px 0; color: var(--muted); font-size: .9rem; }


/* RECOVERED MISSING BASE STYLES */
.table-map { display: grid; grid-template-columns: repeat(4, minmax(150px, 1fr)); gap: 14px; }
.table-box { min-height: 118px; padding: 16px; border-radius: 18px; text-align: left; display: grid; gap: 6px; align-content: start; }
.table-box.available { background: #edf5ef; color: #214734; border: 1px solid rgba(33,71,52,.1); }
.table-box.reserved { background: #fbefdc; color: #8c5b15; border: 1px solid rgba(140,91,21,.1); }
.table-box.selected { background: #221711; color: white; border: 1px solid rgba(34,23,17,.65); }
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
.status-pill.confirmed, .status-pill.checked_in, .status-pill.serving, .status-pill.occupied { background: #edf5ef; color: #214734; }
.status-pill.completed { background: #e8efe9; color: #365f4b; }
.status-pill.no_show, .status-pill.cancelled, .status-pill.maintenance { background: #fde8e4; color: #8a2f1f; }
.status-pill.reserved { background: #fbefdc; color: #8c5b15; }
.status-pill.available { background: #edf5ef; color: #214734; }

.customer-dashboard { width: 100%; padding: clamp(44px, 5vw, 70px) var(--site-gutter); }
.customer-dashboard-grid { display: grid; grid-template-columns: 1.2fr .8fr; gap: 22px; align-items: start; }
.customer-card { padding: 24px; border-radius: 24px; background: rgba(255,253,250,.78); border: 1px solid var(--line); box-shadow: var(--shadow-sm); }
.customer-card h3 { margin: 0 0 12px; color: var(--espresso); }
.customer-reservation-card { display: grid; gap: 12px; padding: 16px; border-radius: 18px; background: #fff; border: 1px solid var(--line); margin-top: 12px; }
.notification-list { display: grid; gap: 10px; }
.notification-item { padding: 12px 14px; border-radius: 14px; background: #f9f3ea; border: 1px solid var(--line); font-size: .9rem; color: var(--muted); }
.notification-item b { display: block; color: var(--espresso); margin-bottom: 4px; }
.history-list { display: grid; gap: 10px; margin-top: 12px; }
.history-item { padding: 14px; border-radius: 16px; background: #fbf7f1; border: 1px solid var(--line); }
.home-customer-area { width: 100%; padding: clamp(48px, 4.5vw, 72px) var(--site-gutter); background: linear-gradient(180deg, rgba(255,253,250,.46), rgba(249,243,234,.78)); border-top: 1px solid var(--line); }
.home-customer-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: clamp(18px, 3vw, 28px); align-items: start; }
.home-customer-card { padding: 24px; border-radius: 24px; background: rgba(255,253,250,.84); border: 1px solid var(--line); box-shadow: var(--shadow-sm); backdrop-filter: blur(12px); }
.home-customer-card h3 { margin: 0 0 12px; color: var(--espresso); }
.home-reservation-mini { display: grid; gap: 12px; padding: 18px; border-radius: 20px; background: #fffdfa; border: 1px solid var(--line); }
.home-history-list { display: grid; gap: 10px; margin-top: 12px; }
.home-history-item { padding: 14px; border-radius: 16px; background: #fbf7f1; border: 1px solid var(--line); }
.action-cell { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; min-width: 150px; }
.mini-action { min-height: 34px; padding: 7px 12px; border-radius: 10px; font-size: .78rem; font-weight: 900; line-height: 1; white-space: nowrap; }
.mini-action.next { background: linear-gradient(135deg, #221711, #3a2a21); color: #fff; }
.mini-action.cancel { background: #fffdfa; color: #8a2f1f; border: 1px solid rgba(138,47,31,.18); }
.mini-action.detail { background: #fffdfa; color: var(--espresso); border: 1px solid var(--line); }
.mini-action.done { background: #f3eee7; color: var(--muted); cursor: default; }
.mini-action:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 18px rgba(22,15,11,.08); }
.detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; padding: 4px 0; }
.detail-item { padding: 14px; border-radius: 14px; background: #f9f3ea; border: 1px solid var(--line); }
.detail-item span { display: block; color: var(--muted); font-size: .78rem; font-weight: 900; margin-bottom: 5px; text-transform: uppercase; letter-spacing: .04em; }
.detail-item b { color: var(--espresso); word-break: break-word; }
.admin-table-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.admin-table-cell { padding: 18px; border-radius: 16px; border: 1px solid rgba(42,24,17,.1); background: #f9f3ea; }
.admin-menu-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.admin-menu-item { display: flex; gap: 16px; padding: 16px; border-radius: 16px; border: 1px solid rgba(42,24,17,.1); background: #fff; }
.admin-menu-item img { width: 80px; height: 80px; border-radius: 12px; object-fit: cover; }

/* Modal & Toast */
.modal-backdrop { position: fixed; inset: 0; z-index: 100; background: rgba(31,20,15,.4); backdrop-filter: blur(8px); display: grid; place-items: center; }
.login-panel { width: min(420px, 100%); padding: 34px; border-radius: 24px; background: #fffdfa; box-shadow: var(--shadow-lg); position: relative; }
.admin-crud-backdrop { padding: 22px; overflow-y: auto; align-items: start; }
.crud-modal-panel { width: min(760px, 100%); margin: 32px auto; background: #fffdfa; border: 1px solid var(--line); border-radius: 26px; box-shadow: var(--shadow-lg); overflow: hidden; }
.crud-modal-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 18px; padding: 24px 26px 18px; border-bottom: 1px solid var(--line); background: linear-gradient(180deg, #fffdfa, #f9f3ea); }
.crud-modal-header h2 { margin: 0 0 4px; font-size: 1.9rem; color: var(--espresso); }
.crud-modal-header p { margin: 0; color: var(--muted); font-size: .92rem; }
.crud-modal-close { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 14px; background: rgba(42,24,17,.06); color: var(--espresso); }
.crud-modal-body { padding: 24px 26px 26px; }
.crud-modal-actions { display: flex; justify-content: flex-end; gap: 10px; grid-column: 1 / -1; padding-top: 6px; }
.admin-toolbar { display: flex; justify-content: space-between; gap: 14px; align-items: center; flex-wrap: wrap; }
.admin-toolbar-actions { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
.image-upload-box { grid-column: 1 / -1; display: grid; grid-template-columns: minmax(180px, 230px) 1fr; gap: 16px; align-items: center; padding: 14px; border: 1px dashed rgba(42,24,17,.22); border-radius: 18px; background: #fbf7f1; }
.image-upload-preview { width: 100%; min-height: 150px; border-radius: 16px; background: #fff; border: 1px solid var(--line); display: grid; place-items: center; overflow: hidden; }
.image-upload-preview img { width: 100%; height: 150px; object-fit: contain; padding: 10px; }
.file-note { display: block; margin-top: 8px; color: var(--muted); font-size: .78rem; font-weight: 700; word-break: break-word; }
.toast { position: fixed; right: 24px; bottom: 24px; z-index: 110; padding: 18px; border-radius: 16px; background: #1f140f; color: #fff; display: flex; gap: 16px; box-shadow: var(--shadow-md); }
.toast.success { background: #214734; } .toast.error { background: #8c2515; }



/* Uiverse inspired loading, button, checkbox, background, and table map refinements */
.coffee-loader {
  width: 100px;
  height: 100px;
  position: relative;
  animation: coffeeShake 3s infinite ease-in-out;
  margin: 0 auto;
}
.coffee-loader.compact {
  width: 100px;
  height: 100px;
  transform: scale(.46);
  transform-origin: center;
  animation: none;
  margin: -26px auto;
}
.coffee-cup {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 30px;
  background-color: #5b4022cb;
  border: 1px solid #2e2e2e;
  border-radius: 3px 3px 10px 10px;
  z-index: 1;
  animation: cupPulse 6s infinite ease-in-out;
}
.coffee-cup::before {
  content: "";
  position: absolute;
  bottom: -5px;
  width: calc(100% - 2px);
  height: 6px;
  background: #5b4022cb;
  border: 1px solid #2e2e2e;
  border-top: none;
  border-radius: 50%;
  z-index: -1;
  animation: cupPulse 6s infinite ease-in-out;
}
.coffee-cup::after {
  content: "";
  position: absolute;
  top: -2px;
  left: 1px;
  width: calc(100% - 2px);
  height: 4px;
  background: #da8920ca;
  border: 1px solid #2e2e2e;
  border-radius: 50%;
  animation: coffeeGlow 6s infinite ease-in-out;
}
.coffee-cup-handle {
  position: absolute;
  top: 5px;
  right: -10px;
  width: 10px;
  height: 15px;
  border: 2px solid #2e2e2e;
  border-left: none;
  border-radius: 0 10px 10px 0;
  background: transparent;
}
.coffee-smoke {
  position: absolute;
  bottom: 100%;
  left: 50%;
  width: 10px;
  height: 25px;
  background: rgba(72, 67, 67, 0.501);
  border-radius: 50%;
  transform: translateX(-50%);
  animation: coffeeRise 3s infinite ease-in-out;
  filter: blur(8px);
}
.coffee-smoke.two { animation-delay: .8s; }
.coffee-smoke.three { animation-delay: 1.6s; }
.coffee-load-text {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #2e2e2e;
  opacity: .68;
  white-space: nowrap;
  font-weight: 800;
}
.internal-loading-shell,
.inline-loading-shell {
  min-height: 280px;
  display: grid;
  place-items: center;
  border-radius: 0;
  background: transparent;
  border: 0;
  box-shadow: none;
}
.inline-loading-shell { min-height: 120px; margin: 12px 0; }
@keyframes coffeeRise {
  0% { transform: translate(-50%, 0) scale(.4); opacity: 0; }
  30% { opacity: .7; }
  60% { opacity: .4; }
  100% { transform: translate(-50%, -120px) scale(1); opacity: 0; }
}
@keyframes coffeeShake {
  0% { transform: translateX(0) translateY(0) rotate(0); }
  25% { transform: translateX(-4px) translateY(-2px) rotate(-2deg); }
  50% { transform: translateX(0) translateY(0) rotate(0); }
  75% { transform: translateX(4px) translateY(-2px) rotate(2deg); }
  100% { transform: translateX(0) translateY(0) rotate(0); }
}
@keyframes cupPulse {
  0%, 100% { background-color: #5b4022cb; }
  50% { background-color: #f5f5f5bd; }
}
@keyframes coffeeGlow {
  0%, 100% { background: #da8920ca; }
  50% { background: #fed197d5; }
}

.primary, .secondary, .dark, .green-cta, .ghost-cta, .ghost, .dynamic-cta,
.mini-action, .stepper button, .crud-modal-actions button, .admin-toolbar-actions button,
.queue-row-kode-dua button, .home-reservation-mini button, .customer-card button, .home-customer-card button {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  border: 1px solid rgba(91, 64, 34, .34);
  transition: color .3s ease-in, transform .3s ease, box-shadow .3s ease, border-color .3s ease;
}
.primary::before, .secondary::before, .dark::before, .green-cta::before, .ghost-cta::before, .ghost::before, .dynamic-cta::before,
.mini-action::before, .stepper button::before, .crud-modal-actions button::before, .admin-toolbar-actions button::before,
.queue-row-kode-dua button::before, .home-reservation-mini button::before, .customer-card button::before, .home-customer-card button::before,
.primary::after, .secondary::after, .dark::after, .green-cta::after, .ghost-cta::after, .ghost::after, .dynamic-cta::after,
.mini-action::after, .stepper button::after, .crud-modal-actions button::after, .admin-toolbar-actions button::after,
.queue-row-kode-dua button::after, .home-reservation-mini button::after, .customer-card button::after, .home-customer-card button::after {
  content: '';
  position: absolute;
  top: 0;
  width: 0;
  height: 100%;
  transform: skew(15deg);
  transition: all .5s ease;
  overflow: hidden;
  z-index: -1;
}
.primary::before, .secondary::before, .dark::before, .green-cta::before, .ghost-cta::before, .ghost::before, .dynamic-cta::before,
.mini-action::before, .stepper button::before, .crud-modal-actions button::before, .admin-toolbar-actions button::before,
.queue-row-kode-dua button::before, .home-reservation-mini button::before, .customer-card button::before, .home-customer-card button::before {
  left: -10px;
  background: #5b4022;
}
.primary::after, .secondary::after, .dark::after, .green-cta::after, .ghost-cta::after, .ghost::after, .dynamic-cta::after,
.mini-action::after, .stepper button::after, .crud-modal-actions button::after, .admin-toolbar-actions button::after,
.queue-row-kode-dua button::after, .home-reservation-mini button::after, .customer-card button::after, .home-customer-card button::after {
  right: -10px;
  background: #b38a5f;
}
.primary:hover:not(:disabled)::before, .secondary:hover:not(:disabled)::before, .dark:hover:not(:disabled)::before, .green-cta:hover:not(:disabled)::before, .ghost-cta:hover:not(:disabled)::before, .ghost:hover:not(:disabled)::before, .dynamic-cta:hover:not(:disabled)::before,
.mini-action:hover:not(:disabled)::before, .stepper button:hover:not(:disabled)::before, .crud-modal-actions button:hover:not(:disabled)::before, .admin-toolbar-actions button:hover:not(:disabled)::before,
.queue-row-kode-dua button:hover:not(:disabled)::before, .home-reservation-mini button:hover:not(:disabled)::before, .customer-card button:hover:not(:disabled)::before, .home-customer-card button:hover:not(:disabled)::before,
.primary:hover:not(:disabled)::after, .secondary:hover:not(:disabled)::after, .dark:hover:not(:disabled)::after, .green-cta:hover:not(:disabled)::after, .ghost-cta:hover:not(:disabled)::after, .ghost:hover:not(:disabled)::after, .dynamic-cta:hover:not(:disabled)::after,
.mini-action:hover:not(:disabled)::after, .stepper button:hover:not(:disabled)::after, .crud-modal-actions button:hover:not(:disabled)::after, .admin-toolbar-actions button:hover:not(:disabled)::after,
.queue-row-kode-dua button:hover:not(:disabled)::after, .home-reservation-mini button:hover:not(:disabled)::after, .customer-card button:hover:not(:disabled)::after, .home-customer-card button:hover:not(:disabled)::after {
  width: 58%;
}
.primary:hover:not(:disabled), .secondary:hover:not(:disabled), .dark:hover:not(:disabled), .green-cta:hover:not(:disabled), .ghost-cta:hover:not(:disabled), .ghost:hover:not(:disabled), .dynamic-cta:hover:not(:disabled),
.mini-action:hover:not(:disabled), .stepper button:hover:not(:disabled), .crud-modal-actions button:hover:not(:disabled), .admin-toolbar-actions button:hover:not(:disabled),
.queue-row-kode-dua button:hover:not(:disabled), .home-reservation-mini button:hover:not(:disabled), .customer-card button:hover:not(:disabled), .home-customer-card button:hover:not(:disabled) {
  color: #fffdfa;
  border-color: rgba(91, 64, 34, .72);
  transform: translateY(-2px);
}
.primary svg, .secondary svg, .dark svg, .green-cta svg, .ghost-cta svg, .ghost svg, .dynamic-cta svg,
.mini-action svg, .stepper button svg, .crud-modal-actions button svg, .admin-toolbar-actions button svg,
.queue-row-kode-dua button svg, .home-reservation-mini button svg, .customer-card button svg, .home-customer-card button svg {
  position: relative;
  z-index: 1;
}

.internal-main-shell {
  --s: 112px;
  --c1: rgba(251, 247, 241, .96);
  --c2: rgba(179, 138, 95, .42);
  --_g: var(--c2) 4% 14%, var(--c1) 14% 24%, var(--c2) 22% 34%,
    var(--c1) 34% 44%, var(--c2) 44% 56%, var(--c1) 56% 66%, var(--c2) 66% 76%,
    var(--c1) 76% 86%, var(--c2) 86% 96%;
  background: radial-gradient(100% 100% at 100% 0, var(--c1) 4%, var(--_g), rgba(0,0,0,.10) 96%, #0000),
    radial-gradient(100% 100% at 0 100%, #0000, rgba(0,0,0,.08) 4%, var(--_g), var(--c1) 96%) var(--c1);
  background-size: var(--s) var(--s);
}
.topbar-internal { background: rgba(255, 253, 250, .88); backdrop-filter: blur(16px); }
.isi-internal { background: rgba(255, 253, 250, .18); }
.panel-kode-dua, .stat-card-kode-dua, .pegawai-stat-card, .reservation-mini-card,
.queue-row-kode-dua, .admin-table-cell, .admin-menu-item, .home-customer-card, .customer-card {
  background-color: rgba(255, 253, 250, .86);
  backdrop-filter: blur(12px);
}

.checkbox-row {
  display: flex !important;
  align-items: center;
  gap: 12px !important;
  min-height: 48px;
  padding: 12px 14px;
  border: 1.5px solid var(--line);
  border-radius: 16px;
  background: rgba(255,255,255,.88);
  color: var(--coffee);
  font-weight: 900;
}
.ui-checkbox-input { display: none; }
.check {
  cursor: pointer;
  position: relative;
  margin: 0;
  width: 18px;
  height: 18px;
  -webkit-tap-highlight-color: transparent;
  transform: translate3d(0, 0, 0);
  flex: 0 0 auto;
}
.check:before {
  content: "";
  position: absolute;
  top: -15px;
  left: -15px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(91, 64, 34, .07);
  opacity: 0;
  transition: opacity .2s ease;
}
.check svg {
  position: relative;
  z-index: 1;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke: #c8ccd4;
  stroke-width: 1.5;
  transform: translate3d(0, 0, 0);
  transition: all .2s ease;
}
.check svg path { stroke-dasharray: 60; stroke-dashoffset: 0; }
.check svg polyline { stroke-dasharray: 22; stroke-dashoffset: 66; }
.check:hover:before { opacity: 1; }
.check:hover svg { stroke: var(--accent-color, #b38a5f); }
.ui-checkbox-input:checked + .check svg { stroke: var(--accent-color, #b38a5f); }
.ui-checkbox-input:checked + .check svg path { stroke-dashoffset: 60; transition: all .3s linear; }
.ui-checkbox-input:checked + .check svg polyline { stroke-dashoffset: 42; transition: all .2s linear; transition-delay: .15s; }
.checkbox-label-text { font-size: .92rem; color: var(--coffee); }

.table-map {
  position: relative;
  min-height: 520px;
  width: min(880px, 100%);
  margin: 0 auto;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(91, 64, 34, .14);
  box-shadow: 2px 2px 16px rgba(22, 15, 11, .12);
  background:
    radial-gradient(circle at 18% 18%, rgba(179,138,95,.24), transparent 16rem),
    radial-gradient(circle at 88% 72%, rgba(54,95,75,.18), transparent 14rem),
    linear-gradient(135deg, #fff7eb, #f3e1c8);
}
.table-map::before {
  content: "";
  position: absolute;
  inset: 18px;
  border: 2px dashed rgba(91,64,34,.16);
  border-radius: 22px;
  pointer-events: none;
}
.table-map::after {
  content: "BAR AREA";
  position: absolute;
  right: 22px;
  top: 22px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(91,64,34,.88);
  color: #fffdfa;
  font-size: .72rem;
  font-weight: 900;
  letter-spacing: .12em;
}
.table-box {
  position: absolute;
  left: calc(var(--x, 50) * 1% - 58px);
  top: calc(var(--y, 50) * 1% - 48px);
  width: 116px;
  min-height: 96px;
  padding: 13px 12px;
  border-radius: 999px 999px 20px 20px;
  text-align: center;
  display: grid;
  place-items: center;
  gap: 2px;
  line-height: 1.1;
  box-shadow: 0 14px 32px rgba(22, 15, 11, .12);
  transform-origin: bottom center;
}
.table-box::before {
  content: "•";
  position: absolute;
  left: 50%;
  top: -15px;
  transform: translateX(-50%);
  color: #2e2e2e;
  text-shadow: 0 1px 1px #fff;
  font-size: 1.1rem;
  z-index: 2;
}
.table-box::after {
  content: "📍";
  position: absolute;
  left: 50%;
  top: -31px;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
  transition: all .3s ease-out;
  clip-path: inset(-.5em 0 0 0);
  z-index: 2;
}
.table-box:hover:not(:disabled)::after { clip-path: inset(-.5em 0 .5em 0); transform: translateX(-50%) translateY(.5em); }
.table-box:hover:not(:disabled) { transform: translateY(-6px) scale(1.03); }
.table-box strong { font-size: 1.18rem !important; }
.table-box small { font-size: .72rem; font-weight: 800; opacity: .78; }
.table-box.available { background: rgba(237,245,239,.94); color: #214734; border: 1px solid rgba(33,71,52,.18); }
.table-box.reserved { background: rgba(251,239,220,.95); color: #8c5b15; border: 1px solid rgba(140,91,21,.18); cursor: not-allowed; }
.table-box.selected { background: rgba(34,23,17,.94); color: #fffdfa; border: 1px solid rgba(34,23,17,.76); }
.table-box.selected::after { content: "✅"; }

/* END RECOVERED MISSING BASE STYLES */


@media (max-width: 1120px) {
  .interactive-hero-shell { min-height: auto; }
  .interactive-product-layout { min-height: auto; grid-template-columns: 1fr; gap: 26px; padding: 34px var(--site-gutter) 54px; }
  .interactive-product-copy { max-width: 720px; }
  .interactive-showcase-area { min-height: 380px; }
  .product-image-stage { min-height: 420px; }
  .hero-selected-product { height: clamp(340px, 50vw, 500px); width: min(740px, 96%); }
}

@media (max-width: 760px) {
  .site-header { min-height: 68px; padding: 12px 16px; }
  .desktop-nav { display: none !important; }
  .header-actions { gap: 6px; }
  .header-actions .ghost, .header-actions .dark { padding: 9px 10px; font-size: .78rem; }
  .interactive-product-layout { padding: 26px 16px 44px; }
  .interactive-hero-shell {
    background-image:
      linear-gradient(180deg, rgba(248,241,232,.95) 0%, rgba(248,241,232,.86) 42%, rgba(248,241,232,.74) 100%),
      url('/images/bg-beranda.png');
    background-size: cover, cover;
    background-position: center, center;
  }
  .interactive-product-copy h1 { font-size: clamp(3rem, 15vw, 4.4rem); }
  .interactive-showcase-area { min-height: 310px; }
  .product-image-stage { min-height: 320px; }
  .hero-selected-product { width: 98%; height: 300px; border-radius: 22px !important; object-fit: contain; }
  .interactive-product-grid { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; max-width: 100%; }
  .interactive-product-card { min-height: 132px; padding: 44px 12px 12px; }
  .interactive-product-card img { width: 86px; height: 86px; top: -8px; }
  .why-grid-noir, .admin-dashboard-grid, .employee-board-grid { grid-template-columns: 1fr; }
  .menu-layout { grid-template-columns: 1fr; }
  .promo-lines article { grid-template-columns: 1fr; }
  .cafe-reservation-shell { grid-template-columns: 1fr; }
  .admin-employee-grid { grid-template-columns: 1fr; }
  .cafe-map-container { max-width: 100%; }
  .footer-pro { grid-template-columns: 1fr; }
  .ruang-internal { grid-template-columns: 1fr; }
  .sidebar-internal { display: none; }
}


/* Critical layout fixes after signup and denah integration */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 120;
  padding: 20px;
  display: grid;
  place-items: center;
  background: rgba(31, 20, 15, .46);
  backdrop-filter: blur(10px);
  overflow-y: auto;
}
.login-panel {
  width: min(440px, calc(100vw - 32px));
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  padding: 34px;
  border-radius: 24px;
  background: #fffdfa;
  box-shadow: var(--shadow-lg);
  position: relative;
}
.footer-pro {
  display: grid;
  grid-template-columns: 1.4fr .9fr .9fr 1fr;
  gap: 28px;
  padding: 46px var(--site-gutter) 28px;
  background: linear-gradient(180deg, #1d130f, #34231a);
  color: rgba(255,255,255,.72);
}
.footer-pro h2, .footer-pro h3 { color: #fff; margin: 0 0 14px; letter-spacing: -.02em; }
.footer-pro button { display: block; color: rgba(255,255,255,.74); text-align: left; padding: 6px 0; font-weight: 800; }
.footer-pro small { grid-column: 1/-1; padding-top: 24px; border-top: 1px solid rgba(255,255,255,.12); }
.coffee-loader {
  width: 100px;
  height: 100px;
  position: relative;
  animation: coffeeShake 3s infinite ease-in-out;
  margin: 0 auto;
}
.coffee-cup {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 30px;
  background-color: #5b4022cb;
  border: 1px solid #2e2e2e;
  border-radius: 3px 3px 10px 10px;
  z-index: 1;
  animation: cupPulse 6s infinite ease-in-out;
}
.coffee-cup::before {
  content: "";
  position: absolute;
  bottom: -5px;
  width: calc(100% - 2px);
  height: 6px;
  background: #5b4022cb;
  border: 1px solid #2e2e2e;
  border-top: none;
  border-radius: 50%;
  z-index: -1;
  animation: cupPulse 6s infinite ease-in-out;
}
.coffee-cup::after {
  content: "";
  position: absolute;
  top: -2px;
  left: 1px;
  width: calc(100% - 2px);
  height: 4px;
  background: #da8920ca;
  border: 1px solid #2e2e2e;
  border-radius: 50%;
  animation: coffeeGlow 6s infinite ease-in-out;
}
.coffee-cup-handle {
  position: absolute;
  top: 5px;
  right: -10px;
  width: 10px;
  height: 15px;
  border: 2px solid #2e2e2e;
  border-left: none;
  border-radius: 0 10px 10px 0;
  background: transparent;
}
.coffee-smoke {
  position: absolute;
  bottom: 100%;
  left: 50%;
  width: 10px;
  height: 25px;
  background: rgba(72, 67, 67, 0.501);
  border-radius: 50%;
  transform: translateX(-50%);
  animation: coffeeRise 3s infinite ease-in-out;
  filter: blur(8px);
}
.coffee-smoke.two { animation-delay: .8s; }
.coffee-smoke.three { animation-delay: 1.6s; }
.coffee-load-text {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #2e2e2e;
  opacity: .68;
  white-space: nowrap;
  font-weight: 800;
}
@keyframes coffeeRise {
  0% { transform: translate(-50%, 0) scale(.4); opacity: 0; }
  30% { opacity: .7; }
  60% { opacity: .4; }
  100% { transform: translate(-50%, -120px) scale(1); opacity: 0; }
}
@keyframes coffeeShake {
  0% { transform: translateX(0) translateY(0) rotate(0); }
  25% { transform: translateX(-4px) translateY(-2px) rotate(-2deg); }
  50% { transform: translateX(0) translateY(0) rotate(0); }
  75% { transform: translateX(4px) translateY(-2px) rotate(2deg); }
  100% { transform: translateX(0) translateY(0) rotate(0); }
}
@keyframes cupPulse {
  0%, 100% { background-color: #5b4022cb; }
  50% { background-color: #f5f5f5bd; }
}
@keyframes coffeeGlow {
  0%, 100% { background: #da8920ca; }
  50% { background: #fed197d5; }
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
const labelKolom = (key) => String(key || '').replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
const rowsDariObjek = (rows) => {
  const dataRows = Array.isArray(rows) ? rows : [];
  const keys = Array.from(new Set(dataRows.flatMap(row => Object.keys(row || {}))));
  return [keys.map(labelKolom), ...dataRows.map(row => keys.map(key => row?.[key] ?? ''))];
};
const buatExcel = (namaFile, rows) => {
  const data = rowsDariObjek(rows);
  const html = `<!doctype html><html><head><meta charset="utf-8"></head><body><table>${data.map(row => `<tr>${row.map(cell => `<td>${String(cell ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</td>`).join('')}</tr>`).join('')}</table></body></html>`;
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = namaFile.endsWith('.xls') ? namaFile : `${namaFile}.xls`; link.click();
  URL.revokeObjectURL(url);
};
const APP_BRAND = 'Dika Coffe Shop';

const bersihkanTeksPdf = (value) => String(value ?? '-')
  .replace(/\r?\n/g, ' ')
  .replace(/→/g, '->')
  .replace(/[–—]/g, '-')
  .replace(/[“”]/g, '"')
  .replace(/[‘’]/g, "'")
  .replace(/[^\x20-\x7E]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const escapePdf = (value) => bersihkanTeksPdf(value)
  .replace(/\\/g, '\\\\')
  .replace(/\(/g, '\\(')
  .replace(/\)/g, '\\)');

const namaFileAman = (judul) => `${bersihkanTeksPdf(judul).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'laporan'}.pdf`;

const wrapPdfText = (value, maxChars) => {
  const text = bersihkanTeksPdf(value);
  if (!text) return ['-'];
  const words = text.split(' ');
  const lines = [];
  let line = '';
  words.forEach(word => {
    if (word.length > maxChars) {
      if (line) { lines.push(line); line = ''; }
      for (let i = 0; i < word.length; i += maxChars) lines.push(word.slice(i, i + maxChars));
      return;
    }
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) { lines.push(line); line = word; }
    else line = next;
  });
  if (line) lines.push(line);
  return lines.slice(0, 5);
};

const buatPdfLaporan = (judul, sections) => {
  const pageWidth = 842;
  const pageHeight = 595;
  const margin = 30;
  const usableWidth = pageWidth - margin * 2;
  const bottomLimit = 38;
  const now = new Date();
  const generatedAt = now.toLocaleString('id-ID');
  let pages = [];
  let content = '';
  let y = 0;
  let currentPage = 0;

  const line = (x1, y1, x2, y2) => { content += `0.75 0.70 0.64 RG ${x1} ${y1} m ${x2} ${y2} l S\n`; };
  const rect = (x, yRect, w, h, fill = null) => {
    if (fill) content += `${fill} ${x} ${yRect} ${w} ${h} re f\n`;
    content += `0.82 0.76 0.68 RG ${x} ${yRect} ${w} ${h} re S\n`;
  };
  const text = (x, yText, value, size = 8, bold = false) => {
    content += `0.13 0.09 0.07 rg BT /${bold ? 'F2' : 'F1'} ${size} Tf ${x} ${yText} Td (${escapePdf(value)}) Tj ET\n`;
  };
  const mutedText = (x, yText, value, size = 8) => {
    content += `0.40 0.35 0.30 rg BT /F1 ${size} Tf ${x} ${yText} Td (${escapePdf(value)}) Tj ET\n`;
  };
  const caramelText = (x, yText, value, size = 8, bold = true) => {
    content += `0.55 0.40 0.25 rg BT /${bold ? 'F2' : 'F1'} ${size} Tf ${x} ${yText} Td (${escapePdf(value)}) Tj ET\n`;
  };

  const newPage = () => {
    if (content) pages.push(content);
    currentPage += 1;
    content = '';
    y = pageHeight - margin;
    text(margin, y, APP_BRAND, 18, true);
    caramelText(pageWidth - margin - 112, y + 1, 'ADMIN REPORT', 9, true);
    y -= 20;
    text(margin, y, judul, 13, true);
    mutedText(margin, y - 14, `Dibuat: ${generatedAt}`);
    mutedText(pageWidth - margin - 74, y - 14, `Halaman ${currentPage}`);
    line(margin, y - 24, pageWidth - margin, y - 24);
    y -= 46;
  };

  const ensureSpace = (needed) => { if (y - needed < bottomLimit) newPage(); };

  const drawTable = (sectionTitle, rows) => {
    const dataRows = Array.isArray(rows) ? rows : [];
    const keys = Array.from(new Set(dataRows.flatMap(row => Object.keys(row || {}))));
    ensureSpace(54);
    text(margin, y, sectionTitle, 12, true);
    mutedText(margin, y - 13, `${dataRows.length} baris data dari database`);
    y -= 26;

    if (!dataRows.length || !keys.length) {
      rect(margin, y - 24, usableWidth, 24, '0.98 0.96 0.93 rg');
      mutedText(margin + 8, y - 15, 'Belum ada data.');
      y -= 38;
      return;
    }

    const fontSize = keys.length > 8 ? 6 : keys.length > 5 ? 6.8 : 7.4;
    const headerSize = Math.max(5.8, fontSize - 0.1);
    const colWidth = usableWidth / keys.length;
    const maxChars = Math.max(7, Math.floor(colWidth / (fontSize * 0.52)));

    const drawHeader = () => {
      ensureSpace(28);
      rect(margin, y - 24, usableWidth, 24, '0.96 0.92 0.86 rg');
      keys.forEach((key, index) => {
        const x = margin + index * colWidth;
        if (index > 0) line(x, y, x, y - 24);
        const label = wrapPdfText(labelKolom(key).toUpperCase(), maxChars)[0] || labelKolom(key).toUpperCase();
        text(x + 4, y - 15, label, headerSize, true);
      });
      y -= 24;
    };

    drawHeader();
    dataRows.forEach((row, rowIndex) => {
      const lineSets = keys.map(key => wrapPdfText(row?.[key], maxChars));
      const lineCount = Math.max(1, ...lineSets.map(lines => lines.length));
      const rowHeight = Math.max(22, 9 + lineCount * (fontSize + 2));
      if (y - rowHeight < bottomLimit) {
        newPage();
        text(margin, y, `${sectionTitle} (lanjutan)`, 11, true);
        y -= 20;
        drawHeader();
      }
      rect(margin, y - rowHeight, usableWidth, rowHeight, rowIndex % 2 === 0 ? '1 1 1 rg' : '0.99 0.98 0.96 rg');
      keys.forEach((key, index) => {
        const x = margin + index * colWidth;
        if (index > 0) line(x, y, x, y - rowHeight);
        lineSets[index].forEach((lineValue, lineIndex) => {
          mutedText(x + 4, y - 13 - lineIndex * (fontSize + 2), lineValue, fontSize);
        });
      });
      y -= rowHeight;
    });
    y -= 18;
  };

  newPage();
  const normalizedSections = Array.isArray(sections?.[0]) ? sections : [[judul, sections]];
  normalizedSections.forEach(([sectionTitle, rows]) => drawTable(sectionTitle, rows || []));
  if (content) pages.push(content);

  const objects = [];
  const addObject = (body) => { objects.push(body); return objects.length; };
  addObject('<< /Type /Catalog /Pages 2 0 R >>');
  addObject('');
  addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  const pageIds = [];
  pages.forEach(pageContent => {
    const pageId = objects.length + 1;
    const contentId = objects.length + 2;
    pageIds.push(pageId);
    addObject(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`);
    addObject(`<< /Length ${pageContent.length} >>\nstream\n${pageContent}endstream`);
  });
  objects[1] = `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`;

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((body, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i += 1) pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = namaFileAman(judul);
  link.click();
  URL.revokeObjectURL(url);
};

const cetakPdf = (judul, rows) => buatPdfLaporan(judul, [[judul, rows]]);

// ==========================================
// 3. REST API SERVICES
// ==========================================
const API_URL = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8081/api').replace(/\/$/, '');
const API_ORIGIN = API_URL.replace(/\/api$/, '');
const assetUrl = (url) => {
  if (!url) return '/images/produk-utama.png';
  if (String(url).startsWith('/uploads/')) return `${API_ORIGIN}${url}`;
  return url;
};

async function api(path, options = {}) {
  const requestOptions = options;
  const method = (requestOptions.method || 'GET').toUpperCase();
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), requestOptions.timeout || 15000);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(requestOptions.headers || {}) },
      ...requestOptions,
      signal: controller.signal,
    });

    if (!response.ok) {
      let message = 'Terjadi kesalahan koneksi API.';
      try {
        const error = await response.json();
        message = error.message || error.error || message;
      } catch (_) {
        message = await response.text() || message;
      }
      throw new Error(message);
    }

    if (response.status === 204) return null;
    return response.json();
  } catch (error) {
    // GET boleh dicoba ulang sekali agar aplikasi lebih stabil saat backend baru bangun dari idle.
    if (method === 'GET' && !requestOptions.__retried) {
      await new Promise(resolve => window.setTimeout(resolve, 700));
      return api(path, { ...requestOptions, __retried: true });
    }
    if (error?.name === 'AbortError') throw new Error('Koneksi ke server terlalu lama. Coba muat ulang.');
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

const todayIso = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const currentTime = () => new Date().toTimeString().slice(0, 5);

const statusReservasiPegawaiAktif = new Set(['PENDING', 'CONFIRMED', 'CHECKED_IN', 'SERVING']);
const menitDariJam = (nilai) => {
  const [jam, menit] = potongJam(nilai || '00:00').split(':').map(Number);
  return (Number.isFinite(jam) ? jam : 0) * 60 + (Number.isFinite(menit) ? menit : 0);
};
const waktuMasukShift = (mulaiReservasi, selesaiReservasi, mulaiShift, selesaiShift) => {
  const rStart = menitDariJam(mulaiReservasi);
  let rEnd = selesaiReservasi ? menitDariJam(selesaiReservasi) : rStart + 120;
  const sStart = menitDariJam(mulaiShift || '00:00');
  const sEnd = menitDariJam(selesaiShift || '23:59');
  if (rEnd <= rStart) rEnd += 24 * 60;
  if (sStart === sEnd) return true;
  if (sStart < sEnd) return rStart < sEnd && rEnd > sStart;
  return rStart >= sStart || rStart < sEnd || rEnd > sStart;
};
const identitasPegawaiSama = (reservasi, pegawai) => {
  const assigned = String(reservasi?.assignedEmployee || '').toLowerCase();
  const nama = String(pegawai?.fullName || '').toLowerCase();
  const email = String(pegawai?.email || '').toLowerCase();
  return Boolean(assigned && ((nama && assigned === nama) || (email && assigned === email) || assigned.includes(nama)));
};
const filterReservasiUntukShiftPegawai = (rows, pegawai) => {
  const shiftName = String(pegawai?.shiftName || '').toLowerCase();
  const backup = shiftName.includes('backup');
  const today = todayIso();
  return (Array.isArray(rows) ? rows : [])
    .filter(row => statusReservasiPegawaiAktif.has(row?.status))
    .filter(row => !row?.reservationDate || row.reservationDate >= today)
    .filter(row => backup || identitasPegawaiSama(row, pegawai) || waktuMasukShift(row?.reservationTime, row?.reservationEndTime, pegawai?.shiftStart, pegawai?.shiftEnd))
    .sort((a, b) => `${a.reservationDate || ''} ${potongJam(a.reservationTime)}`.localeCompare(`${b.reservationDate || ''} ${potongJam(b.reservationTime)}`));
};

const statusPesananPegawaiAktif = new Set(['PENDING_PAYMENT', 'PROCESSING', 'READY']);
const gabungPesananDenganReservasi = (order, reservasiByCode) => {
  const r = reservasiByCode?.get?.(order?.reservationCode) || {};
  return {
    ...order,
    reservationDate: order?.reservationDate || r.reservationDate,
    reservationTime: order?.reservationTime || r.reservationTime,
    reservationEndTime: order?.reservationEndTime || r.reservationEndTime,
    guestName: order?.guestName || r.guestName,
    phone: order?.phone || r.phone,
    area: order?.area || r.area,
    floor: order?.floor || r.floor,
    tableCode: order?.tableCode || r.tableCode,
    assignedEmployee: order?.assignedEmployee || r.assignedEmployee,
    reservationStatus: order?.reservationStatus || r.status,
  };
};
const filterPesananUntukShiftPegawai = (orders, reservations, pegawai) => {
  const reservasiByCode = new Map((Array.isArray(reservations) ? reservations : []).map(r => [r.code, r]));
  const shiftName = String(pegawai?.shiftName || '').toLowerCase();
  const backup = shiftName.includes('backup');
  const today = todayIso();
  return (Array.isArray(orders) ? orders : [])
    .map(order => gabungPesananDenganReservasi(order, reservasiByCode))
    .filter(order => statusPesananPegawaiAktif.has(order?.status))
    .filter(order => !order?.reservationDate || order.reservationDate >= today)
    .filter(order => backup || identitasPegawaiSama(order, pegawai) || waktuMasukShift(order?.reservationTime, order?.reservationEndTime, pegawai?.shiftStart, pegawai?.shiftEnd))
    .sort((a, b) => `${a.reservationDate || ''} ${potongJam(a.reservationTime)} ${a.createdAt || ''}`.localeCompare(`${b.reservationDate || ''} ${potongJam(b.reservationTime)} ${b.createdAt || ''}`));
};
const semuaPesananDariReservasi = async (reservasiRows) => {
  const rows = Array.isArray(reservasiRows) ? reservasiRows : [];
  const results = await Promise.allSettled(rows.map(r => mockApi.ambilPesananReservasi(r.code)));
  return results.flatMap(result => result.status === 'fulfilled' && Array.isArray(result.value) ? result.value : []);
};
const labelPembayaran = (status) => {
  if (status === 'PENDING_PAYMENT') return 'Menunggu pembayaran';
  if (['PROCESSING', 'READY', 'COMPLETED'].includes(status)) return 'Pembayaran diterima';
  if (status === 'CANCELLED') return 'Dibatalkan';
  return status || '-';
};

function useRealtime(refresh) {
  const refreshRef = useRef(refresh);

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  useEffect(() => {
    let source = null;
    const run = () => refreshRef.current?.();
    const interval = window.setInterval(run, 15000);
    window.addEventListener('dikacoffeshop-refresh', run);

    try {
      source = new EventSource(`${API_URL}/realtime/stream`);
      source.addEventListener('dikacoffeshop-update', run);
      source.onmessage = run;
      source.onerror = () => {
        source?.close();
        source = null;
      };
    } catch (_) {
      source = null;
    }

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('dikacoffeshop-refresh', run);
      if (source) source.close();
    };
  }, []);
}

const mockApi = {
  ambilMenuPublik: async () => api('/menu'),
  ambilPromoPublik: async () => api('/promos'),
  ambilMejaTersedia: async ({ area, floor, reservationDate, reservationTime, guestCount, durationMinutes }) => {
    const params = new URLSearchParams({
      date: reservationDate || todayIso(),
      time: reservationTime || '19:00',
      guests: String(guestCount || 1),
      area: area || '',
      floor: floor || '',
      durationMinutes: String(durationMinutes || 120),
    });
    return api(`/tables?${params.toString()}`);
  },
  buatReservasi: async (data) => api('/reservations', {
    method: 'POST',
    body: JSON.stringify({
      reservationDate: data.reservationDate,
      reservationTime: data.reservationTime,
      guestCount: Number(data.guestCount || 1),
      area: data.area,
      tableCode: data.tableCode,
      guestName: data.guestName,
      phone: data.phone,
      specialRequest: data.specialRequest || '',
      durationMinutes: Number(data.durationMinutes || 120),
    }),
  }),
  ambilReservasiCustomer: async (phone) => {
    if (!phone) return [];
    return api(`/reservations?phone=${encodeURIComponent(phone)}`);
  },
  ambilPesananReservasi: async (reservationCode) => {
    if (!reservationCode) return [];
    return api(`/orders?reservationCode=${encodeURIComponent(reservationCode)}`);
  },
  buatPesanan: async (data) => api('/orders', {
    method: 'POST',
    body: JSON.stringify({ reservationCode: data.reservationCode, items: data.items }),
  }),
  loginInternal: async (data) => api('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  daftarCustomer: async (data) => api('/auth/register/customer', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  uploadGambarMenuAdmin: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_URL}/admin/menu/upload`, { method: 'POST', body: formData });
    if (!response.ok) {
      let message = 'Upload gambar gagal.';
      try {
        const error = await response.json();
        message = error.message || error.error || message;
      } catch (_) {
        message = await response.text() || message;
      }
      throw new Error(message);
    }
    return response.json();
  },
  ambilDataAdmin: async () => {
    const [dashboard, reservasi, pesanan, meja, menu, promos, laporan, employees] = await Promise.all([
      api('/admin/dashboard'),
      api('/admin/reservations'),
      api('/admin/orders'),
      api('/admin/tables'),
      api('/admin/menu'),
      api('/admin/promos'),
      api('/admin/reports'),
      api('/admin/employees'),
    ]);
    return { dashboard, reservasi, pesanan, meja, menu, promos, laporan, employees };
  },
  ambilDataPegawai: async (employeeIdentity = '', employeeContext = null) => {
    // Workspace pegawai tidak dikunci ke tanggal hari ini saja.
    // Untuk demo, reservasi aktif hari ini dan mendatang tetap muncul selama jamnya masuk ke shift pegawai login.
    const employeeParam = employeeIdentity ? `?employeeName=${encodeURIComponent(employeeIdentity)}` : '';
    const orderParam = employeeIdentity ? `?employeeName=${encodeURIComponent(employeeIdentity)}` : '';
    const [reservasiResult, pesananResult, mejaResult] = await Promise.allSettled([
      api(`/employee/reservations${employeeParam}`),
      api(`/employee/orders/today${orderParam}`),
      api(`/tables?date=${todayIso()}&time=${currentTime()}&guests=1&area=&floor=`),
    ]);
    const errors = [reservasiResult, pesananResult, mejaResult]
      .filter(result => result.status === 'rejected')
      .map(result => result.reason?.message || 'Endpoint pegawai gagal dimuat.');
    if (errors.length) console.warn('Sebagian data pegawai gagal dimuat:', errors);

    let reservasi = reservasiResult.status === 'fulfilled' ? reservasiResult.value : [];
    let pesanan = pesananResult.status === 'fulfilled' ? pesananResult.value : [];
    let semuaReservasi = null;

    // Fallback penting untuk demo: kalau backend lama masih mengembalikan data kosong karena filter tanggal,
    // frontend mengambil daftar admin lalu memfilter sendiri berdasarkan email, nama, dan jam shift.
    if (employeeContext && employeeIdentity && reservasi.length === 0) {
      try {
        semuaReservasi = await api('/admin/reservations');
        reservasi = filterReservasiUntukShiftPegawai(semuaReservasi, employeeContext);
      } catch (error) {
        console.warn('Fallback reservasi pegawai gagal:', error?.message || error);
      }
    }

    // Payment/pesanan disamakan dengan reservasi: ambil dari jadwal reservasi, bukan tanggal order dibuat.
    // Kalau endpoint pegawai belum mengirim data, frontend tetap bisa join order dengan reservasi admin untuk demo.
    if (employeeContext && employeeIdentity) {
      try {
        if (!semuaReservasi) semuaReservasi = await api('/admin/reservations');
        const adminPesanan = await api('/admin/orders').catch(() => []);
        const mergedPesanan = Array.from(new Map([...(Array.isArray(pesanan) ? pesanan : []), ...(Array.isArray(adminPesanan) ? adminPesanan : [])].map(order => [order.id, order])).values());
        pesanan = filterPesananUntukShiftPegawai(mergedPesanan, semuaReservasi, employeeContext);
      } catch (error) {
        console.warn('Fallback payment pegawai gagal:', error?.message || error);
      }
    }

    return {
      reservasi,
      pesanan,
      meja: mejaResult.status === 'fulfilled' ? mejaResult.value : [],
      errors,
    };
  },
  ubahStatusReservasiPegawai: async (id, status, actorName = 'Pegawai Dika Coffe Shop', reason = '') => api(`/employee/reservations/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, actorName, reason }),
  }),
  ubahStatusPesananPegawai: async (id, status, actorName = 'Pegawai Dika Coffe Shop') => api(`/employee/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, actorName }),
  }),
  ubahStatusReservasiAdmin: async (id, status, actorName = 'Admin Dika Coffe Shop', reason = '') => api(`/admin/reservations/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, actorName, reason }),
  }),
  ubahStatusPesananAdmin: async (id, status, actorName = 'Admin Dika Coffe Shop') => api(`/admin/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, actorName }),
  }),
  batalReservasiCustomer: async (id, phone, reason = 'Dibatalkan customer') => api(`/reservations/${id}/cancel`, {
    method: 'PUT',
    body: JSON.stringify({ phone, reason }),
  }),
  simpanMejaAdmin: async (data) => {
    const payload = {
      code: data.code,
      area: data.area,
      floor: data.floor,
      capacity: Number(data.capacity || 1),
      physicalStatus: data.physicalStatus || 'AVAILABLE',
    };
    if (data.id) {
      return api(`/admin/tables/${data.id}`, { method: 'PUT', body: JSON.stringify(payload) });
    }
    return api('/admin/tables', { method: 'POST', body: JSON.stringify(payload) });
  },
  hapusMejaAdmin: async (id) => api(`/admin/tables/${id}`, { method: 'DELETE' }),
  simpanPegawaiAdmin: async (data) => api('/admin/employees', {
    method: 'POST',
    body: JSON.stringify({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phone: data.phone || '',
      shiftName: data.shiftName,
      shiftStart: data.shiftStart,
      shiftEnd: data.shiftEnd,
      active: Boolean(data.active),
    }),
  }),
  updateShiftPegawaiAdmin: async (id, data) => api(`/admin/employees/${id}/shift`, {
    method: 'PUT',
    body: JSON.stringify({
      shiftName: data.shiftName,
      shiftStart: data.shiftStart,
      shiftEnd: data.shiftEnd,
      active: Boolean(data.active),
    }),
  }),
  simpanMenuAdmin: async (data) => {
    const payload = {
      name: data.name, category: data.category, description: data.description,
      price: Number(data.price || 0), available: Boolean(data.available), imageUrl: data.imageUrl || '/images/produk-utama.png',
    };
    if (data.id) return api(`/admin/menu/${data.id}`, { method: 'PUT', body: JSON.stringify(payload) });
    return api('/admin/menu', { method: 'POST', body: JSON.stringify(payload) });
  },
  hapusMenuAdmin: async (id) => api(`/admin/menu/${id}`, { method: 'DELETE' }),
  simpanPromoAdmin: async (data) => {
    const payload = { title: data.title, description: data.description, badge: data.badge, active: Boolean(data.active), startDate: data.startDate || null, endDate: data.endDate || null };
    if (data.id) return api(`/admin/promos/${data.id}`, { method: 'PUT', body: JSON.stringify(payload) });
    return api('/admin/promos', { method: 'POST', body: JSON.stringify(payload) });
  },
  hapusPromoAdmin: async (id) => api(`/admin/promos/${id}`, { method: 'DELETE' }),
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


function CoffeeLoader({ label = 'Loading...', compact = false }) {
  return (
    <div className={`coffee-loader ${compact ? 'compact' : ''}`} aria-label={label} role="status">
      <div className="coffee-cup">
        <div className="coffee-cup-handle"></div>
        <div className="coffee-smoke one"></div>
        <div className="coffee-smoke two"></div>
        <div className="coffee-smoke three"></div>
      </div>
      <div className="coffee-load-text">{label}</div>
    </div>
  );
}

function LoadingOverlay({ label = 'Loading...' }) {
  return (
    <div className="loading-overlay">
      <CoffeeLoader label={label} />
    </div>
  );
}

function CustomCheckbox({ id, checked, onChange, label }) {
  return (
    <label className="checkbox-row" htmlFor={id}>
      <input
        className="ui-checkbox-input"
        type="checkbox"
        id={id}
        checked={Boolean(checked)}
        onChange={e => onChange?.(e.target.checked)}
      />
      <span className="check" aria-hidden="true">
        <svg width="18px" height="18px" viewBox="0 0 18 18">
          <path d="M 1 9 L 1 9 c 0 -5 3 -8 8 -8 L 9 1 C 14 1 17 5 17 9 L 17 9 c 0 4 -4 8 -8 8 L 9 17 C 5 17 1 14 1 9 L 1 9 Z"></path>
          <polyline points="1 9 7 14 15 4"></polyline>
        </svg>
      </span>
      <span className="checkbox-label-text">{label}</span>
    </label>
  );
}

function AdminFormModal({ terbuka, judul, deskripsi, tutup, children }) {
  if (!terbuka) return null;
  return (
    <div className="modal-backdrop admin-crud-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) tutup?.(); }}>
      <motion.div className="crud-modal-panel" initial={{ opacity: 0, y: 20, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }}>
        <div className="crud-modal-header">
          <div>
            <h2>{judul}</h2>
            <p>{deskripsi}</p>
          </div>
          <button className="crud-modal-close" type="button" onClick={tutup} aria-label="Tutup form"><X size={20}/></button>
        </div>
        <div className="crud-modal-body">{children}</div>
      </motion.div>
    </div>
  );
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
          <span>D</span>
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
      <section className="internal-main-shell" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
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
          {loading && !children ? <div className="internal-loading-shell"><CoffeeLoader label="Loading..." /></div> : children}
        </div>
      </section>
    </div>
  );
}

function HeaderUtama({ ubahHalaman, bukaLogin, user, keluar }) {
  const navigasi = user?.role === 'CUSTOMER'
    ? [['home', 'Beranda'], ['reservation', 'Reservasi'], ['menu', 'Menu'], ['riwayat', 'Riwayat'], ['promo', 'Promo']]
    : [['home', 'Beranda'], ['menu', 'Menu'], ['promo', 'Promo']];
  const pindahHalaman = (key) => {
    if (!user && ['reservation', 'riwayat', 'customer'].includes(key)) {
      bukaLogin('customer', key === 'reservation' ? 'reservation' : 'riwayat');
      return;
    }
    ubahHalaman(key);
  };
  return (
    <header className="site-header">
      <button className="brand" onClick={() => ubahHalaman(user?.role === 'ADMIN' ? 'admin' : user?.role === 'PEGAWAI' ? 'pegawai' : 'home')}>
        <span>D</span><strong>Dika Coffe Shop</strong>
      </button>
      <nav className="desktop-nav" style={{ display: 'flex', gap: '8px' }}>
        {navigasi.map(([key, label]) => (
          <button key={key} onClick={() => pindahHalaman(key)}>{label}</button>
        ))}
      </nav>
      <div className="header-actions">
        {user ? (
          <>
            <button className="ghost" onClick={() => ubahHalaman(user.role === 'ADMIN' ? 'admin' : user.role === 'PEGAWAI' ? 'pegawai' : 'home')}>{user.role === 'ADMIN' ? 'Admin' : user.role === 'PEGAWAI' ? 'Pegawai' : 'Customer'}</button>
            <button className="dark" onClick={keluar}>Logout</button>
          </>
        ) : (
          <>
            <button className="ghost" onClick={() => bukaLogin('customer')}>Customer</button>
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
        <button onClick={() => bukaLogin('customer')}>Login Customer</button>
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
function LoginInternal({ mode, tutup, sukses, beriNotifikasi, wajib = false, ubahMode }) {
  const akunDemo = {
    customer: { email: 'customer@dikacoffeshop.id', password: 'customer123', role: 'CUSTOMER', label: 'Login Customer' },
    admin: { email: 'admin@dikacoffeshop.id', password: 'admin123', role: 'ADMIN', label: 'Login Admin' },
    pegawai: { email: 'pegawai@dikacoffeshop.id', password: 'pegawai123', role: 'PEGAWAI', label: 'Login Pegawai' },
  };
  const preset = akunDemo[mode] || akunDemo.customer;
  const [authView, setAuthView] = useState('login');
  const [form, setForm] = useState({ email: preset.email, password: preset.password });
  const [signupForm, setSignupForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthView('login');
    setForm({ email: preset.email, password: preset.password });
    setSignupForm({ fullName: '', email: '', phone: '', password: '' });
  }, [mode]);

  const masuk = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await mockApi.loginInternal(form);
      if (user.role !== preset.role) throw new Error('Akses tidak sesuai.');
      sukses(user);
      beriNotifikasi('Login berhasil', `Selamat datang, ${user.fullName}.`, 'success');
    } catch (error) {
      beriNotifikasi('Login gagal', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const daftarCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await mockApi.daftarCustomer(signupForm);
      sukses(user);
      beriNotifikasi('Sign up berhasil', `Akun customer ${user.fullName} sudah dibuat.`, 'success');
    } catch (error) {
      beriNotifikasi('Sign up gagal', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const isSignup = mode === 'customer' && authView === 'signup';

  return (
    <div className="modal-backdrop">
      {loading && <LoadingOverlay label={isSignup ? 'Membuat akun...' : 'Memeriksa...'} />}
      <form className="login-panel" onSubmit={isSignup ? daftarCustomer : masuk}>
        {!wajib && <button type="button" onClick={tutup} style={{ position: 'absolute', right: '20px', top: '20px', fontSize: '1.2rem' }}>×</button>}
        <span className="eyebrow">Akses Pengguna</span>
        <h2 style={{ margin: '10px 0 10px', fontSize: '2rem', color: 'var(--espresso)' }}>{isSignup ? 'Sign Up Customer' : preset.label}</h2>
        {wajib && <p style={{ margin: '0 0 18px', color: 'var(--muted)', lineHeight: 1.5 }}>Silakan login terlebih dahulu. Customer, Admin, dan Pegawai tetap memakai akses masing-masing.</p>}
        {ubahMode && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
            {[['customer','Customer'], ['pegawai','Pegawai'], ['admin','Admin']].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => ubahMode(key)}
                className={mode === key ? 'dark' : 'ghost'}
                style={{ padding: '10px', borderRadius: '12px', fontWeight: 800 }}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {isSignup ? (
          <>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Nama Lengkap</label>
              <input value={signupForm.fullName} onChange={e => setSignupForm({...signupForm, fullName: e.target.value})} placeholder="Nama customer" required />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email</label>
              <input type="email" value={signupForm.email} onChange={e => setSignupForm({...signupForm, email: e.target.value})} placeholder="customer@email.com" required />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>WhatsApp</label>
              <input value={signupForm.phone} onChange={e => setSignupForm({...signupForm, phone: e.target.value})} placeholder="0812..." required />
            </div>
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Password</label>
              <input type="password" value={signupForm.password} onChange={e => setSignupForm({...signupForm, password: e.target.value})} placeholder="Minimal 6 karakter" required />
            </div>
            <button className="primary wide" disabled={loading}>Daftar Customer</button>
            <div className="auth-helper-row">
              <span>Sudah punya akun?</span>
              <button type="button" className="auth-link-button" onClick={() => setAuthView('login')}>Login</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email</label>
              <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Password</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <button className="primary wide" disabled={loading}>Masuk</button>
            {mode === 'customer' && (
              <div className="auth-helper-row">
                <span>Belum punya akun?</span>
                <button type="button" className="auth-link-button" onClick={() => setAuthView('signup')}>Sign up customer</button>
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
}

function BerandaPelanggan({ ubahHalaman, bukaLogin, user, menu, reservasiAktif, setReservasiAktif, beriNotifikasi }) {
  const produkHero = [
    { id: 'p1', kategori: 'Coffee', nama: 'Dika Coffee Latte', judul: 'Find perfect drink', subjudul: 'crafted just for you', deskripsi: 'Latte lembut dengan espresso pilihan dan foam susu yang halus.', harga: 45000, warna: 'rgba(54,95,75,0.96)', warnaGelap: '#1e382b', gambar: '/images/produk-utama.png', gambarKartu: '/images/produk-kopi.png', label: 'Signature' },
    { id: 'p2', kategori: 'Food', nama: 'Nasi Goreng Pedas', judul: 'Taste authentic', subjudul: 'spicy goodness', deskripsi: 'Nasi goreng premium dengan telur, sayuran segar, dan bumbu khas.', harga: 35000, warna: 'rgba(179,138,95,0.96)', warnaGelap: '#8c5b15', gambar: '/images/produk-makanan.png', gambarKartu: '/images/produk-makanan.png', label: 'Recommended' },
    { id: 'p3', kategori: 'Snack', nama: 'Roti Bakar', judul: 'Sweet comfort', subjudul: 'in every bite', deskripsi: 'Roti bakar renyah dengan topping manis dan tekstur lembut.', harga: 22000, warna: 'rgba(140,37,21,0.96)', warnaGelap: '#5c170e', gambar: '/images/produk-snack.png', gambarKartu: '/images/produk-snack.png', label: 'Snack' },
    { id: 'p4', kategori: 'Coffee', nama: 'Dika Americano', judul: 'Bold aroma', subjudul: 'for coffee lovers', deskripsi: 'Americano hangat dengan body yang kuat, simple, bersih, dan cocok untuk menemani aktivitas.', harga: 32000, warna: 'rgba(42,24,17,0.96)', warnaGelap: '#1f140f', gambar: '/images/produk-americano.png', gambarKartu: '/images/produk-americano.png', label: 'Classic' }
  ];
  
  const [produkAktif, setProdukAktif] = useState(produkHero[0]);

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
              <button className="dynamic-cta" onClick={() => user?.role === 'CUSTOMER' ? ubahHalaman('reservation') : bukaLogin('customer', 'reservation')}>Mulai Reservasi <Calendar size={16}/></button>
              <button className="ghost-cta" onClick={() => ubahHalaman('menu')}>Lihat Menu</button>
            </div>

            <div className="interactive-product-grid">
              {produkHero.map(item => (
                <div key={item.id} className={`interactive-product-card ${produkAktif.id === item.id ? 'active' : ''}`} onClick={() => setProdukAktif(item)} style={{ background: `linear-gradient(180deg, ${item.warna}, rgba(0,0,0,0.8))` }}>
                  <img src={item.gambarKartu || item.gambar} alt={item.nama} />
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
      {user?.role === 'CUSTOMER' && (
        <RiwayatCustomerRingkas
          user={user}
          reservasiAktif={reservasiAktif}
          setReservasiAktif={setReservasiAktif}
          ubahHalaman={ubahHalaman}
          beriNotifikasi={beriNotifikasi}
        />
      )}
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
      <div className="promo-heading">
        <span className="eyebrow">Promo aktif</span>
        <h2>Benefit otomatis untuk pesanan tertentu.</h2>
      </div>
      <div className="promo-lines">
        {promos.map(promo => (
          <article key={promo.title}>
            <div className="promo-badge-card">{promo.badge}</div>
            <div className="promo-copy">
              <h3>{promo.title}</h3>
              <p>{promo.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReservasiMeja({ reservasiAktif, setReservasiAktif, beriNotifikasi, user, ubahHalaman }) {
  const [langkah, setLangkah] = useState(1);
  const [daftarMeja, setDaftarMeja] = useState([]);
  const [lantaiDenah, setLantaiDenah] = useState(1);
  const [form, setForm] = useState({ reservationDate: tanggalHariIni, reservationTime: '19:00', durationMinutes: 120, guestCount: 2, floor: 'Semua', area: 'Semua', tableCode: '', guestName: user?.fullName || '', phone: user?.phone || '', specialRequest: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(prev => ({ ...prev, guestName: prev.guestName || user?.fullName || '', phone: prev.phone || user?.phone || '' }));
  }, [user?.fullName, user?.phone]);

  useEffect(() => {
    if (form.floor === 'Lantai 1') setLantaiDenah(1);
    if (form.floor === 'Lantai 2') setLantaiDenah(2);
  }, [form.floor]);

  const muatMeja = async () => {
    try {
      const hasil = await mockApi.ambilMejaTersedia(form);
      setDaftarMeja(hasil);
    } catch (e) {
      beriNotifikasi('Koneksi API gagal', e.message, 'error');
    }
  };

  useEffect(() => { muatMeja(); }, [form.area, form.floor, form.reservationDate, form.reservationTime, form.durationMinutes, form.guestCount]);
  useRealtime(muatMeja);

  const mejaTerpilih = useMemo(() => daftarMeja.find(meja => meja.code === form.tableCode), [daftarMeja, form.tableCode]);
  const lantaiLabel = `Lantai ${lantaiDenah}`;

  const posisiMeja = {
    IN1: { x: 20, y: 40, size: '3.5rem', shape: '50%' },
    IN2: { x: 45, y: 45, size: '4rem', shape: '8px' },
    IN3: { x: 18, y: 60, size: '3.5rem', shape: '50%' },
    IN4: { x: 45, y: 65, size: '4rem', shape: '8px' },
    IN5: { x: 30, y: 55, size: '3rem', shape: '50%' },
    OD1: { x: 81, y: 18, size: '3.5rem', shape: '50%' },
    OD2: { x: 81, y: 35, size: '3.5rem', shape: '50%' },
    OD3: { x: 81, y: 52, size: '3.5rem', shape: '50%' },
    OD4: { x: 81, y: 69, size: '3.5rem', shape: '50%' },
    OD5: { x: 81, y: 86, size: '3.5rem', shape: '50%' },
    MR1: { x: 14, y: 17, size: '4.5rem', shape: '10px' },
    MR2: { x: 34, y: 17, size: '4.5rem', shape: '10px' },
    MR3: { x: 54, y: 17, size: '4.5rem', shape: '10px' },
    IN6: { x: 50, y: 40, size: '4rem', shape: '8px' },
    IN7: { x: 75, y: 45, size: '4rem', shape: '8px' },
    IN8: { x: 45, y: 65, size: '3.5rem', shape: '50%' },
    IN9: { x: 65, y: 65, size: '4.5rem', shape: '50%' },
    IN10: { x: 85, y: 60, size: '3.5rem', shape: '50%' },
    OD6: { x: 18, y: 20, size: '3.5rem', shape: '50%' },
    OD7: { x: 18, y: 38, size: '3.5rem', shape: '50%' },
    OD8: { x: 18, y: 56, size: '3.5rem', shape: '50%' },
    OD9: { x: 18, y: 74, size: '3.5rem', shape: '50%' },
    OD10: { x: 18, y: 92, size: '3.5rem', shape: '50%' },
    MR4: { x: 46, y: 17, size: '4.5rem', shape: '10px' },
    MR5: { x: 66, y: 17, size: '4.5rem', shape: '10px' },
    MR6: { x: 86, y: 17, size: '4.5rem', shape: '10px' },
  };
  const kodeDenahResmi = useMemo(() => new Set(Object.keys(posisiMeja)), []);
  const mejaLantaiAktif = useMemo(() => {
    const mejaDiLantai = daftarMeja.filter(meja => meja.floor === lantaiLabel);
    const punyaDenahResmi = mejaDiLantai.some(meja => kodeDenahResmi.has(meja.code));
    return punyaDenahResmi ? mejaDiLantai.filter(meja => kodeDenahResmi.has(meja.code)) : mejaDiLantai;
  }, [daftarMeja, lantaiLabel, kodeDenahResmi]);

  const pilihLantaiDenah = (floor) => {
    setLantaiDenah(floor);
    setForm(prev => ({ ...prev, floor: `Lantai ${floor}`, tableCode: '' }));
  };

  const pilihMeja = (meja) => {
    if (meja.availabilityStatus !== 'AVAILABLE') return;
    setForm(prev => ({ ...prev, tableCode: prev.tableCode === meja.code ? '' : meja.code }));
  };

  const statusMeja = (meja) => {
    if (form.tableCode === meja.code) return 'selected';
    return meja.availabilityStatus === 'AVAILABLE' ? 'available' : 'reserved';
  };

  const iconMeja = (meja) => {
    if (form.tableCode === meja.code) return '✅';
    if (meja.availabilityStatus !== 'AVAILABLE') return '🔒';
    if (meja.area === 'Meeting Room') return '💼';
    if (meja.area === 'Outdoor') return '🌴';
    return '☕';
  };

  const labelMeja = (meja) => {
    const status = meja.availabilityStatus === 'AVAILABLE' ? `${meja.capacity} Kursi` : meja.reason || 'Tidak tersedia';
    return `${meja.code} - ${status}`;
  };

  const lanjut = () => {
    if (langkah === 1 && (!form.reservationDate || !form.reservationTime || Number(form.guestCount) < 1)) return beriNotifikasi('Data belum lengkap', 'Tanggal, jam, dan jumlah tamu wajib diisi.', 'error');
    if (langkah === 2 && !form.tableCode) return beriNotifikasi('Pilih meja dulu', 'Klik salah satu meja yang tersedia pada denah.', 'error');
    if (langkah === 3 && (!form.guestName || !form.phone)) return beriNotifikasi('Data tamu belum lengkap', 'Nama dan nomor WhatsApp wajib diisi.', 'error');
    setLangkah(Math.min(4, langkah + 1));
  };
  
  const submit = async () => {
    setLoading(true);
    try {
      const res = await mockApi.buatReservasi({ ...form, area: mejaTerpilih?.area || form.area, floor: mejaTerpilih?.floor || form.floor });
      setReservasiAktif(res);
      localStorage.setItem('dika-reservasi-aktif', JSON.stringify(res));
      localStorage.setItem('dika-customer-phone', res.phone || form.phone || '');
      setLangkah(1);
      beriNotifikasi('Reservasi berhasil', `Kode: ${res.code}. Reservasi masuk ke dashboard customer dan pegawai shift secara realtime.`, 'success');
      window.dispatchEvent(new Event('dikacoffeshop-refresh'));
      ubahHalaman?.('home');
    } catch (e) {
      beriNotifikasi('Gagal', e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const batalkanReservasi = async () => {
    if (!reservasiAktif || !confirm(`Batalkan reservasi ${reservasiAktif.code}?`)) return;
    setLoading(true);
    try {
      const res = await mockApi.batalReservasiCustomer(reservasiAktif.id, reservasiAktif.phone, 'Dibatalkan melalui halaman customer');
      setReservasiAktif(res);
      localStorage.setItem('dika-reservasi-aktif', JSON.stringify(res));
      await muatMeja();
      window.dispatchEvent(new Event('dikacoffeshop-refresh'));
      beriNotifikasi('Reservasi dibatalkan', 'Meja kembali tersedia dan admin/pegawai langsung melihat status CANCELLED.', 'success');
    } catch (e) {
      beriNotifikasi('Gagal batal reservasi', e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderFloorPlan = () => (
    <svg viewBox="0 0 500 500" className="floor-plan-svg">
      {lantaiDenah === 1 ? (
        <>
          <path d="M 15 485 L 15 15 L 485 15 L 485 485 L 290 485 M 210 485 L 15 485" fill="none" stroke="#2c1e16" strokeWidth="8" strokeLinecap="round"></path>
          <text x="250" y="490" fontFamily="Inter, sans-serif" fontSize="14" fill="#8b7667" textAnchor="middle" fontWeight="bold" letterSpacing="2">PINTU MASUK UTAMA</text>
          <rect x="330" y="20" width="150" height="460" fill="#e8f5e9" opacity="0.62" rx="8"></rect>
          <path d="M 330 20 L 330 480" fill="none" stroke="#a7f3d0" strokeWidth="4" strokeDasharray="10, 10"></path>
          <text x="405" y="45" fontFamily="Inter, sans-serif" fontSize="16" fill="#16a34a" textAnchor="middle" fontWeight="bold" opacity="0.42" letterSpacing="4">OUTDOOR</text>
          <rect x="20" y="20" width="300" height="120" fill="#f1f5f9" opacity="0.86" rx="8"></rect>
          <path d="M 120 20 L 120 140 M 220 20 L 220 140" fill="none" stroke="#cbd5e1" strokeWidth="4"></path>
          <path d="M 20 140 L 320 140" fill="none" stroke="#94a3b8" strokeWidth="6"></path>
          <text x="70" y="40" fontFamily="Inter, sans-serif" fontSize="12" fill="#64748b" textAnchor="middle" fontWeight="bold">MR 1</text>
          <text x="170" y="40" fontFamily="Inter, sans-serif" fontSize="12" fill="#64748b" textAnchor="middle" fontWeight="bold">MR 2</text>
          <text x="270" y="40" fontFamily="Inter, sans-serif" fontSize="12" fill="#64748b" textAnchor="middle" fontWeight="bold">MR 3</text>
          <text x="170" y="280" fontFamily="Inter, sans-serif" fontSize="32" fill="#cbd5e1" textAnchor="middle" fontWeight="900" opacity="0.34" letterSpacing="8">INDOOR</text>
          <g transform="translate(30, 390)">
            <rect x="0" y="0" width="160" height="70" rx="8" fill="#5c4033"></rect>
            <rect x="10" y="10" width="140" height="50" rx="4" fill="#8b5a2b"></rect>
            <text x="80" y="40" fontFamily="Inter, sans-serif" fontSize="12" fill="#fff" textAnchor="middle" fontWeight="600">BAR & KASIR LT 1</text>
          </g>
          <circle cx="450" cy="450" r="18" fill="#4ade80" opacity="0.6"></circle>
          <circle cx="450" cy="450" r="10" fill="#16a34a"></circle>
        </>
      ) : (
        <>
          <path d="M 15 485 L 15 15 L 485 15 L 485 485 L 15 485" fill="none" stroke="#2c1e16" strokeWidth="8" strokeLinecap="round"></path>
          <path d="M 200 485 L 200 420 L 300 420 L 300 485" fill="none" stroke="#94a3b8" strokeWidth="4"></path>
          <path d="M 200 435 L 300 435 M 200 450 L 300 450 M 200 465 L 300 465" fill="none" stroke="#cbd5e1" strokeWidth="2"></path>
          <text x="250" y="445" fontFamily="Inter, sans-serif" fontSize="12" fill="#64748b" textAnchor="middle" fontWeight="bold">TANGGA NAIK</text>
          <rect x="20" y="20" width="150" height="460" fill="#e8f5e9" opacity="0.62" rx="8"></rect>
          <path d="M 170 20 L 170 480" fill="none" stroke="#a7f3d0" strokeWidth="4" strokeDasharray="10, 10"></path>
          <text x="95" y="45" fontFamily="Inter, sans-serif" fontSize="16" fill="#16a34a" textAnchor="middle" fontWeight="bold" opacity="0.42" letterSpacing="2">BALKON</text>
          <rect x="180" y="20" width="300" height="120" fill="#f1f5f9" opacity="0.86" rx="8"></rect>
          <path d="M 280 20 L 280 140 M 380 20 L 380 140" fill="none" stroke="#cbd5e1" strokeWidth="4"></path>
          <path d="M 180 140 L 480 140" fill="none" stroke="#94a3b8" strokeWidth="6"></path>
          <text x="230" y="40" fontFamily="Inter, sans-serif" fontSize="12" fill="#64748b" textAnchor="middle" fontWeight="bold">MR 4</text>
          <text x="330" y="40" fontFamily="Inter, sans-serif" fontSize="12" fill="#64748b" textAnchor="middle" fontWeight="bold">MR 5</text>
          <text x="430" y="40" fontFamily="Inter, sans-serif" fontSize="12" fill="#64748b" textAnchor="middle" fontWeight="bold">MR 6</text>
          <text x="330" y="280" fontFamily="Inter, sans-serif" fontSize="32" fill="#cbd5e1" textAnchor="middle" fontWeight="900" opacity="0.34" letterSpacing="8">INDOOR</text>
          <g transform="translate(350, 390)">
            <rect x="0" y="0" width="110" height="50" rx="8" fill="#5c4033"></rect>
            <text x="55" y="30" fontFamily="Inter, sans-serif" fontSize="12" fill="#fff" textAnchor="middle" fontWeight="600">BAR LT 2</text>
          </g>
        </>
      )}
    </svg>
  );

  return (
    <section className="reservation-layout" id="reservation">
      {loading && <LoadingOverlay label={langkah === 4 ? 'Menyimpan reservasi...' : 'Memproses...'} />}
      <div className="reservation-heading">
        <span className="eyebrow">Reservasi Meja</span>
        <h2>Pilih meja berdasarkan denah kafe.</h2>
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
            <label>Jumlah Tamu <input type="number" min="1" value={form.guestCount} onChange={e => setForm({...form, guestCount: e.target.value, tableCode: ''})} /></label>
            <label>Durasi <select value={form.durationMinutes} onChange={e => setForm({...form, durationMinutes: Number(e.target.value), tableCode: ''})}><option value={120}>2 jam</option><option value={180}>3 jam</option><option value={240}>4 jam</option></select></label>
            <label>Lantai <select value={form.floor} onChange={e => setForm({...form, floor: e.target.value, tableCode: ''})}><option>Semua</option><option>Lantai 1</option><option>Lantai 2</option></select></label>
            <label>Area <select value={form.area} onChange={e => setForm({...form, area: e.target.value, tableCode: ''})}><option>Semua</option><option>Indoor</option><option>Outdoor</option><option>Meeting Room</option></select></label>
            <label className="full">Preferensi <input value={`${form.floor} • ${form.area}`} readOnly /></label>
          </div>
        )}
        {langkah === 2 && (
          <div className="cafe-reservation-shell">
            <div className="cafe-sidebar-card">
              <h3 style={{ margin: '0 0 8px', color: 'var(--espresso)' }}>Denah meja</h3>
              <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.55 }}>Pilih lantai, zona, dan meja yang tersedia. Warna hijau berarti bisa dipesan.</p>
              <div className="floor-tabs">
                <button className={lantaiDenah === 1 ? 'active' : ''} onClick={() => pilihLantaiDenah(1)}>Lantai 1</button>
                <button className={lantaiDenah === 2 ? 'active' : ''} onClick={() => pilihLantaiDenah(2)}>Lantai 2</button>
              </div>
              <div className="table-legend" style={{ display: 'grid', gap: '10px' }}>
                <span><i className="available"/> Tersedia</span>
                <span><i className="reserved"/> Tidak tersedia</span>
                <span><i className="selected"/> Meja pilihan</span>
              </div>
              <div className="selected-table-summary">
                <p>Menampilkan <b>{mejaLantaiAktif.length}</b> meja pada <b>{lantaiLabel}</b>.</p>
                <p>Filter area: <b>{form.area === 'Semua' ? 'semua area' : form.area}</b>.</p>
                {mejaTerpilih ? <p>Dipilih: <b>{mejaTerpilih.code}</b>, {mejaTerpilih.area}, {mejaTerpilih.capacity} kursi.</p> : <p>Klik meja hijau pada denah.</p>}
              </div>
            </div>
            <div className="cafe-map-container">
              {renderFloorPlan()}
              <div className="cafe-tables">
                {mejaLantaiAktif.length === 0 && (
                  <div style={{ position: 'absolute', inset: '38% 12% auto', zIndex: 8 }}>
                    <Kosong judul="Belum ada meja" deskripsi="Tidak ada meja yang cocok dengan filter ini." />
                  </div>
                )}
                {mejaLantaiAktif.map((meja, index) => {
                  const pos = posisiMeja[meja.code] || { x: 20 + (index % 4) * 18, y: 30 + Math.floor(index / 4) * 18, size: '3.5rem', shape: '50%' };
                  const kelas = statusMeja(meja);
                  return (
                    <button
                      key={meja.code}
                      type="button"
                      style={{ '--x': pos.x, '--y': pos.y, '--size': pos.size, '--shape': pos.shape }}
                      className={`table-spot ${kelas}`}
                      disabled={meja.availabilityStatus !== 'AVAILABLE'}
                      onClick={() => pilihMeja(meja)}
                    >
                      <b>{meja.code}</b>
                      <div className="table-label"><span data-icon={iconMeja(meja)} className="table-sign anim anim-grow">{labelMeja(meja)}</span></div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {langkah === 3 && (
          <div className="form-grid minimal">
            <label style={{ gridColumn: 'span 2' }}>Nama <input value={form.guestName} onChange={e => setForm({...form, guestName: e.target.value})} placeholder="Adi Nugroho" /></label>
            <label style={{ gridColumn: 'span 2' }}>WhatsApp <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="0812..." /></label>
            <label className="full">Catatan <input value={form.specialRequest} onChange={e => setForm({...form, specialRequest: e.target.value})} placeholder="Opsional, contoh: dekat jendela" /></label>
          </div>
        )}
        {langkah === 4 && (
          <div style={{ display: 'grid', gap: '12px' }}>
            <p>Tanggal: <b>{form.reservationDate} {form.reservationTime}</b></p>
            <p>Durasi: <b>{Number(form.durationMinutes || 120) / 60} jam</b></p>
            <p>Meja: <b>{form.tableCode} ({mejaTerpilih?.floor || form.floor} • {mejaTerpilih?.area || form.area})</b></p>
            <p>Nama: <b>{form.guestName}</b></p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
          {langkah > 1 && <button className="secondary" onClick={() => setLangkah(langkah-1)}>Kembali</button>}
          {langkah < 4 ? <button className="primary" onClick={lanjut}>Lanjut</button> : <button className="primary" onClick={submit} disabled={loading}>Konfirmasi</button>}
        </div>
      </div>
      
      {reservasiAktif && (
        <div style={{ marginTop: '24px', padding: '16px', background: reservasiAktif.status === 'CANCELLED' ? '#fbefdc' : 'var(--sage-soft)', borderRadius: '16px', color: reservasiAktif.status === 'CANCELLED' ? '#8c5b15' : 'var(--sage)', display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            Status reservasi: <strong>{reservasiAktif.code}</strong> • <b>{reservasiAktif.status}</b>. {reservasiAktif.status === 'CANCELLED' ? 'Reservasi sudah dibatalkan.' : 'Silakan lanjut ke menu pemesanan atau batalkan jika jadwal berubah.'}
          </div>
          {['PENDING','CONFIRMED'].includes(reservasiAktif.status) && <button className="secondary" onClick={batalkanReservasi}>Batalkan Reservasi</button>}
        </div>
      )}
    </section>
  );
}


function RiwayatCustomerRingkas({ user, reservasiAktif, setReservasiAktif, ubahHalaman, beriNotifikasi }) {
  const [reservasi, setReservasi] = useState([]);
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const statusCacheRef = useRef({});
  const loadedOnceRef = useRef(false);
  const phone = user?.phone || reservasiAktif?.phone || localStorage.getItem('dika-customer-phone') || '';

  const muatCustomer = async () => {
    if (!phone) { setLoading(false); return; }
    try {
      const rows = await mockApi.ambilReservasiCustomer(phone);
      if (loadedOnceRef.current) {
        rows.forEach(row => {
          const oldStatus = statusCacheRef.current[row.code];
          if (oldStatus && oldStatus !== row.status) {
            beriNotifikasi('Update reservasi', `${row.code} berubah dari ${oldStatus} menjadi ${row.status}.`, 'info');
          }
        });
      }
      statusCacheRef.current = Object.fromEntries(rows.map(row => [row.code, row.status]));
      loadedOnceRef.current = true;
      setReservasi(rows);
      const orders = await semuaPesananDariReservasi(rows);
      setPesanan(orders);
      const aktif = rows.find(r => ['PENDING','CONFIRMED','CHECKED_IN','SERVING'].includes(r.status)) || null;
      if (aktif) {
        setReservasiAktif(aktif);
        localStorage.setItem('dika-reservasi-aktif', JSON.stringify(aktif));
      }
    } catch (e) {
      beriNotifikasi('Gagal memuat riwayat customer', e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { muatCustomer(); }, [phone]);
  useRealtime(muatCustomer);

  const aktif = reservasi.find(r => ['PENDING','CONFIRMED','CHECKED_IN','SERVING'].includes(r.status)) || reservasiAktif;
  const riwayat = reservasi.filter(r => ['COMPLETED','CANCELLED','NO_SHOW'].includes(r.status));
  const bisaBatal = aktif && ['PENDING','CONFIRMED'].includes(aktif.status);
  const bisaOrder = aktif && ['CONFIRMED','CHECKED_IN','SERVING'].includes(aktif.status);

  const batalkan = async () => {
    if (!aktif || !confirm(`Batalkan reservasi ${aktif.code}?`)) return;
    try {
      const res = await mockApi.batalReservasiCustomer(aktif.id, aktif.phone, 'Dibatalkan melalui halaman customer');
      setReservasiAktif(res);
      localStorage.setItem('dika-reservasi-aktif', JSON.stringify(res));
      await muatCustomer();
      window.dispatchEvent(new Event('dikacoffeshop-refresh'));
      beriNotifikasi('Reservasi dibatalkan', 'Status reservasi sudah berubah dan terlihat di admin serta pegawai.', 'success');
    } catch (e) {
      beriNotifikasi('Gagal membatalkan', e.message, 'error');
    }
  };

  return (
    <section className="home-customer-area" id="riwayat">
      <div className="section-intro">
        <div>
          <span className="eyebrow">Area Customer</span>
          <h2>Riwayat dan status reservasi Anda.</h2>
          <p>Bagian ini muncul setelah customer login, tetapi tampilan utama tetap seperti beranda coffee shop.</p>
        </div>
        <button className="secondary" onClick={() => ubahHalaman('reservation')}>Buat Reservasi</button>
      </div>
      <div className="home-customer-grid">
        <div className="home-customer-card">
          <h3>Reservasi Aktif</h3>
          {loading && <p style={{ color: 'var(--muted)' }}>Memuat reservasi...</p>}
          {!loading && !aktif && <Kosong judul="Belum ada reservasi aktif" deskripsi="Klik Mulai Reservasi untuk memilih meja dan jadwal kunjungan." ringkas />}
          {aktif && (
            <div className="home-reservation-mini">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <b style={{ fontSize: '1.35rem' }}>{aktif.code}</b><br />
                  <small style={{ color: 'var(--muted)' }}>{aktif.reservationDate} • {potongJam(aktif.reservationTime)} sampai {potongJam(aktif.reservationEndTime)} • Meja {aktif.tableCode}</small>
                </div>
                <StatusLabel nilai={aktif.status} />
              </div>
              <p style={{ margin: 0, color: 'var(--muted)' }}>PIC shift: <b>{aktif.assignedEmployee || '-'}</b> • {aktif.guestCount} tamu • {aktif.area}</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="green-cta" disabled={!bisaOrder} onClick={() => ubahHalaman('menu')}>Order Menu</button>
                <button className="secondary" onClick={() => ubahHalaman('reservation')}>Reservasi Baru</button>
                {bisaBatal && <button className="ghost" onClick={batalkan}>Batalkan</button>}
              </div>
            </div>
          )}
        </div>

        <div className="home-customer-card">
          <h3>Payment & Tracking</h3>
          {pesanan.length > 0 && (
            <div className="home-history-list">
              {pesanan.map(o => (
                <div className="home-history-item" key={o.id}>
                  <b>{o.code}</b> <StatusLabel nilai={o.status} /><br />
                  <small>{labelPembayaran(o.status)} • RSV {o.reservationCode} • {o.reservationDate || '-'} {potongJam(o.reservationTime)} • {formatRupiah(o.total)}</small>
                </div>
              ))}
            </div>
          )}
          {riwayat.length === 0 ? <Kosong judul="Belum ada riwayat" deskripsi="Reservasi selesai, batal, atau no-show akan tampil di sini." ringkas /> : (
            <div className="home-history-list">
              {riwayat.map(r => (
                <div className="home-history-item" key={r.id}>
                  <b>{r.code}</b> <StatusLabel nilai={r.status} /><br />
                  <small>{r.reservationDate} • {potongJam(r.reservationTime)} • Meja {r.tableCode}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


function DashboardCustomer({ user, reservasiAktif, setReservasiAktif, ubahHalaman, beriNotifikasi }) {
  const [reservasi, setReservasi] = useState([]);
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const statusCacheRef = useRef({});
  const loadedOnceRef = useRef(false);

  const phone = user?.phone || reservasiAktif?.phone || localStorage.getItem('dika-customer-phone') || '';

  const muatCustomer = async () => {
    if (!phone) { setLoading(false); return; }
    try {
      const rows = await mockApi.ambilReservasiCustomer(phone);
      if (loadedOnceRef.current) {
        rows.forEach(row => {
          const oldStatus = statusCacheRef.current[row.code];
          if (oldStatus && oldStatus !== row.status) {
            beriNotifikasi('Update reservasi', `${row.code} berubah dari ${oldStatus} menjadi ${row.status}.`, 'info');
          }
        });
      }
      statusCacheRef.current = Object.fromEntries(rows.map(row => [row.code, row.status]));
      loadedOnceRef.current = true;
      setReservasi(rows);
      const orders = await semuaPesananDariReservasi(rows);
      setPesanan(orders);
      const aktif = rows.find(r => ['PENDING','CONFIRMED','CHECKED_IN','SERVING'].includes(r.status)) || rows[0] || null;
      if (aktif) {
        setReservasiAktif(aktif);
        localStorage.setItem('dika-reservasi-aktif', JSON.stringify(aktif));
      }
    } catch (e) {
      beriNotifikasi('Gagal memuat dashboard customer', e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { muatCustomer(); }, [phone]);
  useRealtime(muatCustomer);

  const aktif = reservasi.find(r => ['PENDING','CONFIRMED','CHECKED_IN','SERVING'].includes(r.status)) || reservasiAktif;
  const riwayat = reservasi.filter(r => ['COMPLETED','CANCELLED','NO_SHOW'].includes(r.status));
  const bisaBatal = aktif && ['PENDING','CONFIRMED'].includes(aktif.status);
  const bisaOrder = aktif && ['CONFIRMED','CHECKED_IN','SERVING'].includes(aktif.status);

  const batalkan = async () => {
    if (!aktif || !confirm(`Batalkan reservasi ${aktif.code}?`)) return;
    try {
      const res = await mockApi.batalReservasiCustomer(aktif.id, aktif.phone, 'Dibatalkan melalui dashboard customer');
      setReservasiAktif(res);
      localStorage.setItem('dika-reservasi-aktif', JSON.stringify(res));
      await muatCustomer();
      window.dispatchEvent(new Event('dikacoffeshop-refresh'));
      beriNotifikasi('Reservasi dibatalkan', 'Status reservasi sudah berubah dan terlihat di admin serta pegawai.', 'success');
    } catch (e) {
      beriNotifikasi('Gagal membatalkan', e.message, 'error');
    }
  };

  return (
    <section className="customer-dashboard">
      <div className="section-intro">
        <span className="eyebrow">Dashboard Customer</span>
        <h2>Selamat datang, {user?.fullName || 'Customer'}.</h2>
        <p>Reservasi, status meja, dan pesanan Anda tersimpan di database dan diperbarui otomatis.</p>
      </div>
      <div className="customer-dashboard-grid">
        <div className="customer-card">
          <h3>Reservasi Aktif</h3>
          {loading && <p style={{ color: 'var(--muted)' }}>Memuat reservasi...</p>}
          {!loading && !aktif && <Kosong judul="Belum ada reservasi aktif" deskripsi="Klik Buat Reservasi untuk memilih meja dan jadwal kunjungan." />}
          {aktif && (
            <div className="customer-reservation-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <b style={{ fontSize: '1.35rem' }}>{aktif.code}</b><br />
                  <small style={{ color: 'var(--muted)' }}>{aktif.reservationDate} • {potongJam(aktif.reservationTime)} sampai {potongJam(aktif.reservationEndTime)} • Meja {aktif.tableCode}</small>
                </div>
                <StatusLabel nilai={aktif.status} />
              </div>
              <p style={{ margin: 0, color: 'var(--muted)' }}>PIC shift: <b>{aktif.assignedEmployee || '-'}</b> • {aktif.guestCount} tamu • {aktif.area}</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="primary" onClick={() => ubahHalaman('reservation')}>Buat Reservasi Baru</button>
                <button className="green-cta" disabled={!bisaOrder} onClick={() => ubahHalaman('menu')}>Order Menu</button>
                {bisaBatal && <button className="secondary" onClick={batalkan}>Batalkan Reservasi</button>}
              </div>
            </div>
          )}
          <h3 style={{ marginTop: 24 }}>Payment & Tracking Pesanan</h3>
          {pesanan.length === 0 ? <Kosong judul="Belum ada payment/pesanan" deskripsi="Checkout menu akan muncul di sini lengkap dengan status pembayaran." ringkas /> : (
            <div className="history-list">
              {pesanan.map(o => <div className="history-item" key={o.id}><b>{o.code}</b> <StatusLabel nilai={o.status} /><br/><small>{labelPembayaran(o.status)} • RSV {o.reservationCode} • {o.reservationDate || '-'} {potongJam(o.reservationTime)} • {formatRupiah(o.total)}</small></div>)}
            </div>
          )}
        </div>
        <div className="customer-card">
          <h3>Notifikasi</h3>
          <div className="notification-list">
            <div className="notification-item"><b>Update realtime aktif</b>Status reservasi dan pesanan akan refresh otomatis dari backend.</div>
            {aktif && <div className="notification-item"><b>Status reservasi</b>{aktif.code} saat ini {aktif.status}. {bisaOrder ? 'Anda sudah bisa order menu.' : 'Tunggu status aktif untuk order menu.'}</div>}
            <div className="notification-item"><b>Promo</b>Cek promo aktif sebelum checkout untuk mendapatkan potongan otomatis.</div>
          </div>
          <h3 style={{ marginTop: 24 }}>Riwayat</h3>
          {riwayat.length === 0 ? <Kosong judul="Belum ada riwayat" deskripsi="Reservasi selesai, batal, atau no-show akan tampil di sini." ringkas /> : (
            <div className="history-list">
              {riwayat.map(r => <div className="history-item" key={r.id}><b>{r.code}</b> <StatusLabel nilai={r.status} /><br/><small>{r.reservationDate} • {potongJam(r.reservationTime)} • Meja {r.tableCode}</small></div>)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function MenuKeranjang({ menu, reservasiAktif, ubahHalaman, beriNotifikasi, user, bukaLogin }) {
  const [keranjang, setKeranjang] = useState([]);
  const [hasilPesanan, setHasilPesanan] = useState(null);
  const subtotal = keranjang.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const tambah = (item) => {
    if (!user) { beriNotifikasi('Login diperlukan', 'Untuk checkout menu, login sebagai customer lalu buat reservasi dulu.', 'info'); bukaLogin?.('customer', 'reservation'); return; }
    if (!reservasiAktif) { beriNotifikasi('Buat reservasi dulu', 'Pilih jadwal dan meja terlebih dahulu sebelum checkout menu.', 'error'); ubahHalaman('reservation'); return; }
    if (!['CONFIRMED','CHECKED_IN','SERVING'].includes(reservasiAktif.status)) { beriNotifikasi('Reservasi belum aktif', 'Order menu hanya bisa dilakukan jika reservasi sudah CONFIRMED.', 'error'); return; }
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
      localStorage.setItem('dika-last-order', JSON.stringify(res));
      beriNotifikasi('Sukses', `Pesanan ${res.code} berhasil dibuat dan akan tampil realtime di pegawai shift.`, 'success');
      window.dispatchEvent(new Event('dikacoffeshop-refresh'));
    } catch(e) {
      beriNotifikasi('Gagal membuat pesanan', e.message, 'error');
    }
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
              <img src={assetUrl(item.imageUrl)} alt={item.name} />
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
          <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>{!user ? 'Login customer dan reservasi dulu untuk checkout' : reservasiAktif ? `RSV: ${reservasiAktif.code}` : 'Belum ada reservasi aktif'}</p>
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
          {!user ? (
            <button className="primary wide" onClick={() => bukaLogin?.('customer', 'reservation')}>Login untuk Reservasi</button>
          ) : (
            <button className="primary wide" onClick={checkout} disabled={!keranjang.length || !reservasiAktif || !['CONFIRMED','CHECKED_IN','SERVING'].includes(reservasiAktif?.status)}>Checkout</button>
          )}
          
          {hasilPesanan && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--line)' }}>
              <span className="eyebrow">Payment Dibuat</span>
              <h3 style={{ margin: '0 0 8px' }}>{hasilPesanan.code}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--sage)' }}>{labelPembayaran(hasilPesanan.status)}. Pesanan ini akan muncul di pegawai shift reservasi.</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{hasilPesanan.appliedPromo || 'Tanpa promo'}</p>
              <button className="secondary" onClick={() => ubahHalaman('riwayat')} style={{ marginTop: '10px' }}>Lihat Payment</button>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}


function TabelLaporan({ judul, rows }) {
  const dataRows = Array.isArray(rows) ? rows : [];
  const keys = Array.from(new Set(dataRows.flatMap(row => Object.keys(row || {}))));
  return (
    <div className="panel-kode-dua panel-full" style={{ marginBottom: '18px' }}>
      <div className="panel-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div>
          <h2 style={{ marginBottom: '4px' }}>{judul}</h2>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '.9rem' }}>{dataRows.length} baris data dari database.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="secondary" onClick={() => cetakPdf(judul, dataRows)} style={{ minHeight: '38px', padding: '8px 12px' }}>Download PDF</button>
          <button className="primary" onClick={() => buatExcel(`${judul.toLowerCase().replaceAll(' ', '-')}.xls`, dataRows)} style={{ minHeight: '38px', padding: '8px 12px' }}>Export Excel</button>
        </div>
      </div>
      <div style={{ overflowX: 'auto', marginTop: '14px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead><tr>{keys.map(key => <th key={key} style={{ padding: '10px', borderBottom: '1px solid var(--line)', color: 'var(--caramel)', fontSize: '.75rem', textTransform: 'uppercase' }}>{labelKolom(key)}</th>)}</tr></thead>
          <tbody>
            {dataRows.length ? dataRows.slice(0, 12).map((row, idx) => <tr key={idx}>{keys.map(key => <td key={key} style={{ padding: '10px', borderBottom: '1px solid var(--line)', color: 'var(--muted)', fontSize: '.86rem' }}>{String(row?.[key] ?? '-')}</td>)}</tr>) : <tr><td colSpan={keys.length || 1} style={{ padding: '12px' }}>Belum ada data.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LaporanAdmin({ laporan }) {
  const sections = [
    ['Laporan Reservasi', laporan?.reservations],
    ['Laporan Shift Pegawai', laporan?.shift],
    ['Laporan Keuangan', laporan?.finance],
    ['Laporan Penggunaan Meja', laporan?.tables],
    ['Laporan Customer', laporan?.customers],
    ['Laporan Pembatalan Reservasi', laporan?.cancellations],
    ['Laporan No-Show', laporan?.noShows],
    ['Timeline Flow Reservasi', laporan?.flow],
    ['Laporan Menu Terlaris', laporan?.menu],
    ['Laporan Promo', laporan?.promos],
    ['Laporan Maintenance Meja', laporan?.maintenance],
    ['Audit Log Aktivitas', laporan?.audit],
  ];
  const allRows = sections.flatMap(([judul, rows]) => (rows || []).map(row => ({ laporan: judul, ...row })));
  return (
    <div style={{ display: 'grid', gap: '18px' }}>
      <div className="panel-kode-dua panel-full">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <span className="eyebrow">Pusat Laporan Admin</span>
            <h2 style={{ margin: '0 0 8px' }}>Semua laporan terkoneksi database</h2>
            <p style={{ margin: 0, color: 'var(--muted)' }}>Admin dapat mencetak PDF dan export Excel untuk laporan reservasi, shift pegawai, keuangan, meja, customer, pembatalan, no-show, timeline flow, promo, menu, maintenance, dan audit log.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="secondary" onClick={() => buatPdfLaporan('Semua Laporan Dika Coffe Shop', sections)}>Download Semua PDF</button>
            <button className="primary" onClick={() => buatExcel('semua-laporan-dikacoffeshop.xls', allRows)}>Export Semua Excel</button>
          </div>
        </div>
      </div>
      {sections.map(([judul, rows]) => <TabelLaporan key={judul} judul={judul} rows={rows || []} />)}
    </div>
  );
}

function RuangAdmin({ keluar, beriNotifikasi }) {
  const [tabAktif, setTabAktif] = useState('dashboard');
  const [data, setData] = useState(null);
  const [formMeja, setFormMeja] = useState({ id: null, code: '', floor: 'Lantai 1', area: 'Indoor', capacity: 4, physicalStatus: 'AVAILABLE' });
  const [formMenu, setFormMenu] = useState({ id: null, name: '', category: 'Coffee', description: '', price: 30000, available: true, imageUrl: '/images/produk-utama.png' });
  const [formPromo, setFormPromo] = useState({ id: null, title: '', description: '', badge: 'Promo', active: true, startDate: '', endDate: '' });
  const [formPegawai, setFormPegawai] = useState({ id: null, fullName: '', email: '', password: 'pegawai123', phone: '', shiftName: 'Shift Pagi', shiftStart: '09:00', shiftEnd: '15:00', active: true });
  const [modalAktif, setModalAktif] = useState(null);
  const [detailPanel, setDetailPanel] = useState(null);
  const [sedangUploadGambar, setSedangUploadGambar] = useState(false);
  const actorName = 'Admin Dika Coffe Shop';
  
  const muatData = () => mockApi.ambilDataAdmin().then(setData).catch(e => beriNotifikasi('Error', e.message, 'error'));
  useEffect(() => { muatData(); }, []);
  useRealtime(muatData);

  const resetFormMeja = () => setFormMeja({ id: null, code: '', floor: 'Lantai 1', area: 'Indoor', capacity: 4, physicalStatus: 'AVAILABLE' });
  const bukaTambahMeja = () => { resetFormMeja(); setModalAktif('meja'); };
  const editMeja = (meja) => { setFormMeja({ id: meja.id, code: meja.code, floor: meja.floor, area: meja.area, capacity: meja.capacity, physicalStatus: meja.physicalStatus || 'AVAILABLE' }); setModalAktif('meja'); };
  const simpanMeja = async (e) => {
    e.preventDefault();
    try {
      await mockApi.simpanMejaAdmin(formMeja);
      resetFormMeja(); setModalAktif(null); await muatData(); window.dispatchEvent(new Event('dikacoffeshop-refresh'));
      beriNotifikasi('Sukses', 'Data meja berhasil disimpan.', 'success');
    } catch (error) { beriNotifikasi('Gagal menyimpan meja', error.message, 'error'); }
  };
  const hapusMeja = async (meja) => {
    if (!confirm(`Hapus meja ${meja.code}?`)) return;
    try { await mockApi.hapusMejaAdmin(meja.id); await muatData(); window.dispatchEvent(new Event('dikacoffeshop-refresh')); beriNotifikasi('Sukses', `Meja ${meja.code} berhasil dihapus.`, 'success'); }
    catch (error) { beriNotifikasi('Gagal menghapus meja', error.message, 'error'); }
  };

  const resetFormMenu = () => setFormMenu({ id: null, name: '', category: 'Coffee', description: '', price: 30000, available: true, imageUrl: '/images/produk-utama.png' });
  const bukaTambahMenu = () => { resetFormMenu(); setModalAktif('menu'); };
  const editMenu = (menu) => { setFormMenu({ id: menu.id, name: menu.name, category: menu.category, description: menu.description, price: Number(menu.price || 0), available: menu.available, imageUrl: menu.imageUrl || '/images/produk-utama.png' }); setModalAktif('menu'); };
  const handleGambarMenu = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { beriNotifikasi('File tidak valid', 'Pilih file gambar JPG, PNG, WEBP, atau GIF.', 'error'); return; }
    if (file.size > 2 * 1024 * 1024) { beriNotifikasi('File terlalu besar', 'Ukuran gambar maksimal 2 MB.', 'error'); return; }
    try {
      setSedangUploadGambar(true);
      const hasil = await mockApi.uploadGambarMenuAdmin(file);
      setFormMenu(prev => ({ ...prev, imageUrl: hasil.imageUrl || '/images/produk-utama.png' }));
      beriNotifikasi('Upload berhasil', 'Gambar menu sudah tersimpan di server.', 'success');
    } catch (error) {
      beriNotifikasi('Upload gambar gagal', error.message, 'error');
    } finally {
      setSedangUploadGambar(false);
    }
  };
  const simpanMenu = async (e) => {
    e.preventDefault();
    try { await mockApi.simpanMenuAdmin(formMenu); resetFormMenu(); setModalAktif(null); await muatData(); window.dispatchEvent(new Event('dikacoffeshop-refresh')); beriNotifikasi('Sukses', 'Data menu berhasil disimpan.', 'success'); }
    catch (error) { beriNotifikasi('Gagal menyimpan menu', error.message, 'error'); }
  };
  const hapusMenu = async (menu) => {
    if (!confirm(`Hapus menu ${menu.name}?`)) return;
    try { await mockApi.hapusMenuAdmin(menu.id); await muatData(); window.dispatchEvent(new Event('dikacoffeshop-refresh')); beriNotifikasi('Sukses', 'Menu berhasil dihapus.', 'success'); }
    catch (error) { beriNotifikasi('Gagal menghapus menu', error.message, 'error'); }
  };


  const resetFormPegawai = () => setFormPegawai({ id: null, fullName: '', email: '', password: 'pegawai123', phone: '', shiftName: 'Shift Pagi', shiftStart: '09:00', shiftEnd: '15:00', active: true });
  const bukaTambahPegawai = () => { resetFormPegawai(); setModalAktif('pegawai'); };
  const editShiftPegawai = (pegawai) => {
    setFormPegawai({
      id: pegawai.id,
      fullName: pegawai.fullName,
      email: pegawai.email,
      password: '',
      phone: pegawai.phone || '',
      shiftName: pegawai.shiftName || 'Shift Pagi',
      shiftStart: potongJam(pegawai.shiftStart || '09:00'),
      shiftEnd: potongJam(pegawai.shiftEnd || '15:00'),
      active: Boolean(pegawai.active),
    });
    setModalAktif('shiftPegawai');
  };
  const simpanPegawai = async (e) => {
    e.preventDefault();
    try {
      await mockApi.simpanPegawaiAdmin(formPegawai);
      resetFormPegawai(); setModalAktif(null); await muatData(); window.dispatchEvent(new Event('dikacoffeshop-refresh'));
      beriNotifikasi('Sukses', 'Akun pegawai berhasil dibuat.', 'success');
    } catch (error) { beriNotifikasi('Gagal membuat pegawai', error.message, 'error'); }
  };
  const simpanShiftPegawai = async (e) => {
    e.preventDefault();
    try {
      await mockApi.updateShiftPegawaiAdmin(formPegawai.id, formPegawai);
      setModalAktif(null); await muatData(); window.dispatchEvent(new Event('dikacoffeshop-refresh'));
      beriNotifikasi('Sukses', 'Jadwal shift pegawai berhasil diperbarui.', 'success');
    } catch (error) { beriNotifikasi('Gagal update shift', error.message, 'error'); }
  };

  const resetFormPromo = () => setFormPromo({ id: null, title: '', description: '', badge: 'Promo', active: true, startDate: '', endDate: '' });
  const bukaTambahPromo = () => { resetFormPromo(); setModalAktif('promo'); };
  const editPromo = (promo) => { setFormPromo({ id: promo.id, title: promo.title, description: promo.description, badge: promo.badge || 'Promo', active: promo.active, startDate: promo.startDate || '', endDate: promo.endDate || '' }); setModalAktif('promo'); };
  const simpanPromo = async (e) => {
    e.preventDefault();
    try { await mockApi.simpanPromoAdmin(formPromo); resetFormPromo(); setModalAktif(null); await muatData(); window.dispatchEvent(new Event('dikacoffeshop-refresh')); beriNotifikasi('Sukses', 'Data promo berhasil disimpan.', 'success'); }
    catch (error) { beriNotifikasi('Gagal menyimpan promo', error.message, 'error'); }
  };
  const hapusPromo = async (promo) => {
    if (!confirm(`Hapus promo ${promo.title}?`)) return;
    try { await mockApi.hapusPromoAdmin(promo.id); await muatData(); window.dispatchEvent(new Event('dikacoffeshop-refresh')); beriNotifikasi('Sukses', 'Promo berhasil dihapus.', 'success'); }
    catch (error) { beriNotifikasi('Gagal menghapus promo', error.message, 'error'); }
  };

  const updateReservasi = async (r, status) => {
    try { await mockApi.ubahStatusReservasiAdmin(r.id, status, actorName); await muatData(); window.dispatchEvent(new Event('dikacoffeshop-refresh')); beriNotifikasi('Sukses', `Reservasi ${r.code} menjadi ${status}`, 'success'); }
    catch (error) { beriNotifikasi('Gagal update reservasi', error.message, 'error'); }
  };
  // Admin tidak assign pegawai manual. Sistem otomatis menentukan pegawai berdasarkan jam reservasi dan jadwal shift.
  const updatePesanan = async (o, status) => {
    try { await mockApi.ubahStatusPesananAdmin(o.id, status, actorName); await muatData(); window.dispatchEvent(new Event('dikacoffeshop-refresh')); beriNotifikasi('Sukses', `Pesanan ${o.code} menjadi ${status}`, 'success'); }
    catch (error) { beriNotifikasi('Gagal update pesanan', error.message, 'error'); }
  };

  if (!data) return <LayoutInternal jenis="admin" tabAktif={tabAktif} setTabAktif={setTabAktif} tabs={[[ 'dashboard', 'Dashboard' ]]} judul="Memuat..." catatan={{}} keluar={keluar} loading={true}/>;

  const tabs = [['dashboard', 'Dashboard'], ['reservasi', 'Reservasi'], ['pesanan', 'Pesanan'], ['meja', 'Meja'], ['menu', 'Menu'], ['promo', 'Promo'], ['pegawai', 'Pegawai'], ['laporan', 'Laporan']];
  const stat = [
    { label: 'Reservasi Hari Ini', value: data.dashboard.totalReservationsToday, icon: CalendarCheck },
    { label: 'Pending', value: data.dashboard.pendingReservations, icon: Clock3 },
    { label: 'Meja Aktif', value: data.dashboard.activeTables, icon: Table2 },
    { label: 'Revenue Hari Ini', value: formatRupiah(data.dashboard.revenueToday), icon: DollarSign }
  ];
  const rsvStatuses = ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'SERVING', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
  const statusOptions = (status) => ({
    PENDING: ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CANCELLED'],
    CONFIRMED: ['CONFIRMED', 'CHECKED_IN', 'CANCELLED', 'NO_SHOW'],
    CHECKED_IN: ['CHECKED_IN', 'SERVING', 'COMPLETED', 'CANCELLED'],
    SERVING: ['SERVING', 'COMPLETED', 'CANCELLED'],
    COMPLETED: ['COMPLETED'],
    CANCELLED: ['CANCELLED'],
    NO_SHOW: ['NO_SHOW'],
  }[status] || rsvStatuses);
  const orderStatuses = ['PENDING_PAYMENT', 'PROCESSING', 'READY', 'COMPLETED', 'CANCELLED'];
  // Admin hanya melihat detail. Update status operasional dilakukan oleh Pegawai sesuai shift.
  const bukaDetailReservasi = (r) => setDetailPanel({
    judul: `Detail Reservasi ${r.code}`,
    deskripsi: 'Admin memantau detail reservasi, sedangkan perubahan status operasional dilakukan di ruang pegawai.',
    rows: [
      ['Kode', r.code], ['Tamu', r.guestName], ['Nomor HP', r.phone], ['Tanggal', r.reservationDate],
      ['Jam', potongJam(r.reservationTime)], ['Meja', r.tableCode], ['Area', r.area], ['Lantai', r.floor],
      ['Jumlah Tamu', r.guestCount], ['Status', r.status], ['Shift/Pegawai', r.assignedEmployee || 'Belum ada shift aktif'],
      ['Catatan', r.specialRequest || '-']
    ]
  });
  const bukaDetailPesanan = (o) => setDetailPanel({
    judul: `Detail Pesanan ${o.code}`,
    deskripsi: 'Admin memantau data pesanan untuk rekap dan laporan. Proses pesanan dilakukan oleh pegawai.',
    rows: [
      ['Kode Pesanan', o.code], ['Kode Reservasi', o.reservationCode], ['Jumlah Item', `${o.items?.length || 0} item`],
      ['Subtotal', formatRupiah(o.subtotal || 0)], ['Diskon', formatRupiah(o.discount || 0)], ['Total', formatRupiah(o.total || 0)],
      ['Status', o.status], ['Pegawai', o.handledBy || '-'], ['Promo', o.appliedPromo || '-']
    ]
  });
  const renderAksiReservasi = (r) => (
    <button className="mini-action detail" onClick={() => bukaDetailReservasi(r)}>Detail</button>
  );
  const renderAksiPesanan = (o) => (
    <button className="mini-action detail" onClick={() => bukaDetailPesanan(o)}>Detail</button>
  );

  return (
    <LayoutInternal jenis="admin" tabAktif={tabAktif} setTabAktif={setTabAktif} tabs={tabs} judul="Admin Dashboard" deskripsi="CRUD, realtime, laporan, dan export data tersambung ke database." catatan={{ judul: 'Workspace', isi: 'Admin Panel API Realtime' }} tombolRefresh={muatData} keluar={keluar}>
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
                {data.reservasi.slice(0, 6).map(r => (
                  <div key={r.id} className="reservation-mini-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><b>{r.guestName}</b> <StatusLabel nilai={r.status}/></div>
                    <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--muted)' }}>{r.code} • Meja {r.tableCode} • {potongJam(r.reservationTime)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel-kode-dua">
               <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Pesanan</h2>
               <div style={{ display: 'grid', gap: '12px' }}>
                 {data.pesanan.slice(0, 6).map(o => (
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

      {tabAktif === 'reservasi' && (
        <div className="panel-kode-dua panel-full">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
            <h2>Data Reservasi</h2>
            <div style={{ display: 'flex', gap: '8px' }}><button className="secondary" onClick={() => cetakPdf('Data Reservasi', data.laporan?.reservations || [])}>Download PDF</button><button className="primary" onClick={() => buatExcel('data-reservasi.xls', data.laporan?.reservations || [])}>Export Excel</button></div>
          </div>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr>{['Kode','Tamu','Tanggal','Jam','Meja','Status','Shift/Pegawai','Detail'].map(h => <th key={h} style={{ padding: '12px', borderBottom: '1px solid var(--line)', textAlign: 'left' }}>{h}</th>)}</tr></thead><tbody>{data.reservasi.map(r => <tr key={r.id}><td style={{ padding: '12px' }}>{r.code}</td><td>{r.guestName}</td><td>{r.reservationDate}</td><td>{potongJam(r.reservationTime)}</td><td>{r.tableCode}</td><td><StatusLabel nilai={r.status}/></td><td>{r.assignedEmployee || 'Belum ada shift aktif'}</td><td>{renderAksiReservasi(r)}</td></tr>)}</tbody></table></div>
        </div>
      )}

      {tabAktif === 'pesanan' && (
        <div className="panel-kode-dua panel-full">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
            <h2>Data Pesanan</h2>
            <div style={{ display: 'flex', gap: '8px' }}><button className="secondary" onClick={() => cetakPdf('Data Pesanan', data.laporan?.orders || [])}>Download PDF</button><button className="primary" onClick={() => buatExcel('data-pesanan.xls', data.laporan?.orders || [])}>Export Excel</button></div>
          </div>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr>{['Kode','RSV','Customer','Total','Status','Pegawai','Detail'].map(h => <th key={h} style={{ padding: '12px', borderBottom: '1px solid var(--line)', textAlign: 'left' }}>{h}</th>)}</tr></thead><tbody>{data.pesanan.map(o => <tr key={o.id}><td style={{ padding: '12px' }}>{o.code}</td><td>{o.reservationCode}</td><td>{o.items?.length || 0} item</td><td>{formatRupiah(o.total)}</td><td><StatusLabel nilai={o.status}/></td><td>{o.handledBy || '-'}</td><td>{renderAksiPesanan(o)}</td></tr>)}</tbody></table></div>
        </div>
      )}

      {tabAktif === 'meja' && (
        <div className="panel-kode-dua panel-full">
          <div className="admin-toolbar"><div><h2>Master Meja</h2><p style={{ color: 'var(--muted)', marginTop: 0 }}>Admin mengatur denah 2 lantai: tiap lantai memiliki 5 meja indoor, 5 meja outdoor, dan 3 meeting room.</p></div><div className="admin-toolbar-actions"><button className="primary" onClick={bukaTambahMeja}><Plus size={16}/> Tambah Meja</button><button className="secondary" onClick={() => cetakPdf('Master Meja', data.laporan?.tables || [])}>Download PDF</button><button className="secondary" onClick={() => buatExcel('master-meja.xls', data.laporan?.tables || [])}>Export Excel</button></div></div>
          <div className="admin-table-grid" style={{ marginTop: '16px' }}>{data.meja.map(m => <div key={m.code} className="admin-table-cell"><b style={{ fontSize: '1.5rem', display: 'block' }}>{m.code}</b><small>{m.floor} • {m.area} • {m.capacity} kursi • {m.physicalStatus}</small><div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}><button className="secondary" onClick={() => editMeja(m)} style={{ minHeight: '34px', padding: '7px 12px', borderRadius: '10px' }}>Edit</button><button className="ghost" onClick={() => hapusMeja(m)} style={{ minHeight: '34px', padding: '7px 12px', borderRadius: '10px' }}>Hapus</button></div></div>)}</div>
        </div>
      )}

      {tabAktif === 'menu' && (
        <div className="panel-kode-dua panel-full">
          <div className="admin-toolbar"><h2>CRUD Master Menu</h2><div className="admin-toolbar-actions"><button className="primary" onClick={bukaTambahMenu}><Plus size={16}/> Tambah Menu</button><button className="secondary" onClick={() => cetakPdf('Master Menu', data.laporan?.menu || [])}>Download PDF</button><button className="secondary" onClick={() => buatExcel('master-menu.xls', data.laporan?.menu || [])}>Export Excel</button></div></div>
          <div className="admin-menu-grid" style={{ marginTop: '16px' }}>{data.menu.map(m => <div key={m.id} className="admin-menu-item"><img src={assetUrl(m.imageUrl)} alt={m.name} /><div style={{ flex: 1 }}><span style={{ fontSize: '0.7rem', color: 'var(--caramel)', fontWeight: 'bold', textTransform: 'uppercase' }}>{m.category}</span><b style={{ display: 'block', margin: '4px 0' }}>{m.name}</b><strong>{formatRupiah(m.price)}</strong><p style={{ margin: '8px 0', color: 'var(--muted)', fontSize: '.8rem' }}>{m.available ? 'Tersedia' : 'Tidak tersedia'}</p><div style={{ display: 'flex', gap: '8px' }}><button className="secondary" onClick={() => editMenu(m)} style={{ minHeight: '34px', padding: '7px 12px' }}>Edit</button><button className="ghost" onClick={() => hapusMenu(m)} style={{ minHeight: '34px', padding: '7px 12px' }}>Hapus</button></div></div></div>)}</div>
        </div>
      )}

      {tabAktif === 'promo' && (
        <div className="panel-kode-dua panel-full">
          <div className="admin-toolbar"><h2>CRUD Promo</h2><div className="admin-toolbar-actions"><button className="primary" onClick={bukaTambahPromo}><Plus size={16}/> Tambah Promo</button><button className="secondary" onClick={() => cetakPdf('Master Promo', data.laporan?.promos || [])}>Download PDF</button><button className="secondary" onClick={() => buatExcel('master-promo.xls', data.laporan?.promos || [])}>Export Excel</button></div></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px', marginTop: '16px' }}>{data.promos.map(p => <div key={p.id} className="reservation-mini-card"><span className="eyebrow">{p.badge}</span><h3 style={{ margin: '0 0 8px' }}>{p.title}</h3><p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>{p.description}</p><StatusLabel nilai={p.active ? 'AKTIF' : 'NONAKTIF'} /><div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}><button className="secondary" onClick={() => editPromo(p)} style={{ minHeight: '34px', padding: '7px 12px' }}>Edit</button><button className="ghost" onClick={() => hapusPromo(p)} style={{ minHeight: '34px', padding: '7px 12px' }}>Hapus</button></div></div>)}</div>
        </div>
      )}

      {tabAktif === 'pegawai' && (
        <div className="panel-kode-dua panel-full">
          <div className="admin-toolbar">
            <div>
              <h2>Akun dan Shift Pegawai</h2>
              <p style={{ color: 'var(--muted)', marginTop: 0 }}>Admin dapat membuat akun pegawai baru dan mengatur jadwal shift. Reservasi otomatis masuk ke pegawai sesuai jam shift.</p>
            </div>
            <div className="admin-toolbar-actions">
              <button className="primary" onClick={bukaTambahPegawai}><Plus size={16}/> Tambah Pegawai</button>
              <button className="secondary" onClick={() => cetakPdf('Data Pegawai', data.employees || [])}>Download PDF</button>
              <button className="secondary" onClick={() => buatExcel('data-pegawai.xls', data.employees || [])}>Export Excel</button>
            </div>
          </div>
          <div className="admin-employee-grid">
            {(data.employees || []).map(pegawai => (
              <div key={pegawai.id} className="employee-account-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'flex-start' }}>
                  <div>
                    <h3>{pegawai.fullName}</h3>
                    <small style={{ color: 'var(--muted)' }}>{pegawai.email}</small>
                  </div>
                  <StatusLabel nilai={pegawai.active ? 'AKTIF' : 'NONAKTIF'} />
                </div>
                <p className="employee-shift-line">
                  Shift: <b>{pegawai.shiftName || '-'}</b><br />
                  Jam: <b>{potongJam(pegawai.shiftStart)} - {potongJam(pegawai.shiftEnd)}</b><br />
                  WhatsApp: <b>{pegawai.phone || '-'}</b>
                </p>
                <button className="secondary" onClick={() => editShiftPegawai(pegawai)} style={{ minHeight: '38px', padding: '8px 12px', borderRadius: '12px' }}>Atur Shift</button>
              </div>
            ))}
            {(data.employees || []).length === 0 && <Kosong judul="Belum ada pegawai" deskripsi="Klik Tambah Pegawai untuk membuat akun pegawai pertama." />}
          </div>
        </div>
      )}

      {tabAktif === 'laporan' && <LaporanAdmin laporan={data.laporan} />}

      <AnimatePresence>
        {detailPanel && (
          <AdminFormModal terbuka={true} judul={detailPanel.judul} deskripsi={detailPanel.deskripsi} tutup={() => setDetailPanel(null)}>
            <div className="detail-grid">
              {detailPanel.rows.map(([label, value]) => (
                <div className="detail-item" key={label}>
                  <span>{label}</span>
                  <b>{String(value ?? '-')}</b>
                </div>
              ))}
            </div>
            <div className="crud-modal-actions"><button className="primary" onClick={() => setDetailPanel(null)}>Tutup</button></div>
          </AdminFormModal>
        )}
        {modalAktif === 'pegawai' && (
          <AdminFormModal terbuka={true} judul="Tambah Akun Pegawai" deskripsi="Akun pegawai dibuat oleh admin dan langsung diberi jadwal shift kerja." tutup={() => setModalAktif(null)}>
            <form className="form-grid minimal" onSubmit={simpanPegawai}>
              <label>Nama Pegawai <input value={formPegawai.fullName} onChange={e => setFormPegawai({...formPegawai, fullName: e.target.value})} placeholder="Nama pegawai" required /></label>
              <label>Email <input type="email" value={formPegawai.email} onChange={e => setFormPegawai({...formPegawai, email: e.target.value})} placeholder="pegawai@email.com" required /></label>
              <label>Password <input type="password" value={formPegawai.password} onChange={e => setFormPegawai({...formPegawai, password: e.target.value})} placeholder="Minimal 6 karakter" required /></label>
              <label>WhatsApp <input value={formPegawai.phone} onChange={e => setFormPegawai({...formPegawai, phone: e.target.value})} placeholder="0812..." /></label>
              <label>Nama Shift <select value={formPegawai.shiftName} onChange={e => setFormPegawai({...formPegawai, shiftName: e.target.value})}><option>Shift Pagi</option><option>Shift Sore</option><option>Shift Malam</option><option>Backup</option></select></label>
              <label>Mulai Shift <input type="time" value={formPegawai.shiftStart} onChange={e => setFormPegawai({...formPegawai, shiftStart: e.target.value})} required /></label>
              <label>Selesai Shift <input type="time" value={formPegawai.shiftEnd} onChange={e => setFormPegawai({...formPegawai, shiftEnd: e.target.value})} required /></label>
              <CustomCheckbox id="employee-active-check" checked={formPegawai.active} onChange={checked => setFormPegawai({...formPegawai, active: checked})} label={formPegawai.active ? 'Akun pegawai aktif' : 'Akun pegawai nonaktif'} />
              <div className="crud-modal-actions"><button type="button" className="secondary" onClick={() => setModalAktif(null)}>Batal</button><button className="primary" type="submit">Simpan Pegawai</button></div>
            </form>
          </AdminFormModal>
        )}
        {modalAktif === 'shiftPegawai' && (
          <AdminFormModal terbuka={true} judul={`Atur Shift ${formPegawai.fullName}`} deskripsi="Perubahan shift akan memengaruhi pembagian reservasi otomatis pada workspace pegawai." tutup={() => setModalAktif(null)}>
            <form className="form-grid minimal" onSubmit={simpanShiftPegawai}>
              <label>Nama Pegawai <input value={formPegawai.fullName} readOnly /></label>
              <label>Email <input value={formPegawai.email} readOnly /></label>
              <label>Nama Shift <select value={formPegawai.shiftName} onChange={e => setFormPegawai({...formPegawai, shiftName: e.target.value})}><option>Shift Pagi</option><option>Shift Sore</option><option>Shift Malam</option><option>Backup</option></select></label>
              <label>Mulai Shift <input type="time" value={formPegawai.shiftStart} onChange={e => setFormPegawai({...formPegawai, shiftStart: e.target.value})} required /></label>
              <label>Selesai Shift <input type="time" value={formPegawai.shiftEnd} onChange={e => setFormPegawai({...formPegawai, shiftEnd: e.target.value})} required /></label>
              <CustomCheckbox id="employee-shift-active-check" checked={formPegawai.active} onChange={checked => setFormPegawai({...formPegawai, active: checked})} label={formPegawai.active ? 'Akun pegawai aktif' : 'Akun pegawai nonaktif'} />
              <div className="crud-modal-actions"><button type="button" className="secondary" onClick={() => setModalAktif(null)}>Batal</button><button className="primary" type="submit">Update Shift</button></div>
            </form>
          </AdminFormModal>
        )}
        {modalAktif === 'meja' && (
          <AdminFormModal terbuka={true} judul={formMeja.id ? 'Edit Meja' : 'Tambah Meja'} deskripsi="Form meja dibuat terpisah dalam popup agar CRUD admin lebih rapi." tutup={() => setModalAktif(null)}>
            <form className="form-grid minimal" onSubmit={simpanMeja}>
              <label>Kode <input value={formMeja.code} onChange={e => setFormMeja({...formMeja, code: e.target.value})} placeholder="A1 / B1 / MR1" /></label>
              <label>Lantai <select value={formMeja.floor} onChange={e => setFormMeja({...formMeja, floor: e.target.value})}><option>Lantai 1</option><option>Lantai 2</option></select></label>
              <label>Area <select value={formMeja.area} onChange={e => setFormMeja({...formMeja, area: e.target.value})}><option>Indoor</option><option>Outdoor</option><option>Meeting Room</option></select></label>
              <label>Kapasitas <input type="number" min="1" max="30" value={formMeja.capacity} onChange={e => setFormMeja({...formMeja, capacity: Number(e.target.value)})} /></label>
              <label>Status <select value={formMeja.physicalStatus} onChange={e => setFormMeja({...formMeja, physicalStatus: e.target.value})}><option value="AVAILABLE">AVAILABLE</option><option value="MAINTENANCE">MAINTENANCE</option></select></label>
              <div className="crud-modal-actions"><button type="button" className="secondary" onClick={() => setModalAktif(null)}>Batal</button><button className="primary" type="submit">{formMeja.id ? 'Update Meja' : 'Simpan Meja'}</button></div>
            </form>
          </AdminFormModal>
        )}
        {modalAktif === 'menu' && (
          <AdminFormModal terbuka={true} judul={formMenu.id ? 'Edit Menu' : 'Tambah Menu'} deskripsi="Upload gambar menggunakan tombol Choose File. Path gambar otomatis tersimpan ke database." tutup={() => setModalAktif(null)}>
            <form className="form-grid minimal" onSubmit={simpanMenu}>
              <label>Nama <input value={formMenu.name} onChange={e => setFormMenu({...formMenu, name: e.target.value})} placeholder="Nama menu" /></label>
              <label>Kategori <input value={formMenu.category} onChange={e => setFormMenu({...formMenu, category: e.target.value})} placeholder="Coffee/Food" /></label>
              <label>Harga <input type="number" min="1" value={formMenu.price} onChange={e => setFormMenu({...formMenu, price: Number(e.target.value)})} /></label>
              <CustomCheckbox id="menu-available-check" checked={formMenu.available} onChange={checked => setFormMenu({...formMenu, available: checked})} label={formMenu.available ? 'Menu tersedia' : 'Menu tidak tersedia'} />
              <label className="full">Deskripsi <input value={formMenu.description} onChange={e => setFormMenu({...formMenu, description: e.target.value})} placeholder="Deskripsi menu" /></label>
              <div className="image-upload-box">
                <div className="image-upload-preview"><img src={assetUrl(formMenu.imageUrl)} alt="Preview menu" /></div>
                <label>Gambar Menu
                  <input type="file" accept="image/*" onChange={handleGambarMenu} disabled={sedangUploadGambar} />
                  <span className="file-note">{sedangUploadGambar ? 'Mengupload gambar...' : `Gambar aktif: ${formMenu.imageUrl || '-'}`}</span>
                </label>
              </div>
              <div className="crud-modal-actions"><button type="button" className="secondary" onClick={() => setModalAktif(null)}>Batal</button><button className="primary" type="submit" disabled={sedangUploadGambar}>{formMenu.id ? 'Update Menu' : 'Simpan Menu'}</button></div>
            </form>
          </AdminFormModal>
        )}
        {modalAktif === 'promo' && (
          <AdminFormModal terbuka={true} judul={formPromo.id ? 'Edit Promo' : 'Tambah Promo'} deskripsi="Form promo dibuat dalam popup supaya halaman admin tetap bersih." tutup={() => setModalAktif(null)}>
            <form className="form-grid minimal" onSubmit={simpanPromo}>
              <label>Judul <input value={formPromo.title} onChange={e => setFormPromo({...formPromo, title: e.target.value})} placeholder="Judul promo" /></label>
              <label>Badge <input value={formPromo.badge} onChange={e => setFormPromo({...formPromo, badge: e.target.value})} placeholder="Rp300K+" /></label>
              <CustomCheckbox id="promo-active-check" checked={formPromo.active} onChange={checked => setFormPromo({...formPromo, active: checked})} label={formPromo.active ? 'Promo aktif' : 'Promo nonaktif'} />
              <label>Mulai <input type="date" value={formPromo.startDate} onChange={e => setFormPromo({...formPromo, startDate: e.target.value})} /></label>
              <label>Selesai <input type="date" value={formPromo.endDate} onChange={e => setFormPromo({...formPromo, endDate: e.target.value})} /></label>
              <label className="full">Deskripsi <input value={formPromo.description} onChange={e => setFormPromo({...formPromo, description: e.target.value})} placeholder="Deskripsi promo" /></label>
              <div className="crud-modal-actions"><button type="button" className="secondary" onClick={() => setModalAktif(null)}>Batal</button><button className="primary" type="submit">{formPromo.id ? 'Update Promo' : 'Simpan Promo'}</button></div>
            </form>
          </AdminFormModal>
        )}
      </AnimatePresence>
    </LayoutInternal>
  );
}


function RuangPegawai({ keluar, beriNotifikasi, user }) {
  const [tabAktif, setTabAktif] = useState('antrian');
  const [data, setData] = useState(null);
  const actorName = user?.fullName || 'Pegawai Dika Coffe Shop';
  const employeeIdentity = user?.email || actorName;
  const shiftName = user?.shiftName || '';
  const isBackupShift = shiftName.toLowerCase().includes('backup');
  const employeeFilter = isBackupShift ? '' : employeeIdentity;
  
  const muatData = () => mockApi.ambilDataPegawai(employeeFilter, user).then(setData).catch(e => beriNotifikasi('Error', e.message, 'error'));
  useEffect(() => { muatData(); }, []);
  useRealtime(muatData);

  const updateRsv = async (id, status) => {
    try {
      await mockApi.ubahStatusReservasiPegawai(id, status, actorName);
      await muatData(); window.dispatchEvent(new Event('dikacoffeshop-refresh'));
      beriNotifikasi('Sukses', `Status reservasi menjadi ${status}`, 'success');
    } catch (error) { beriNotifikasi('Gagal update reservasi', error.message, 'error'); }
  };
  const updateOrd = async (id, status) => {
    try {
      await mockApi.ubahStatusPesananPegawai(id, status, actorName);
      await muatData(); window.dispatchEvent(new Event('dikacoffeshop-refresh'));
      beriNotifikasi('Sukses', `Status pesanan menjadi ${status}`, 'success');
    } catch (error) { beriNotifikasi('Gagal update pesanan', error.message, 'error'); }
  };

  if (!data) return <LayoutInternal jenis="pegawai" tabAktif={tabAktif} setTabAktif={setTabAktif} tabs={[[ 'antrian', 'Antrian' ]]} judul="Memuat..." catatan={{}} keluar={keluar} loading={true}/>;

  const totalAktif = data.reservasi.filter(r => ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'SERVING'].includes(r.status)).length;
  const orderAktif = data.pesanan.filter(o => ['PENDING_PAYMENT', 'PROCESSING', 'READY'].includes(o.status)).length;

  return (
    <LayoutInternal jenis="pegawai" tabAktif={tabAktif} setTabAktif={setTabAktif} tabs={[[ 'antrian', 'Antrian Check-in' ], [ 'pesanan', 'Payment & Pesanan' ], [ 'meja', 'Status Meja' ]]} judul="Workspace Pegawai" deskripsi="Reservasi otomatis masuk sesuai jadwal shift. Pegawai hanya memproses reservasi dan pesanan yang masuk ke shift kerja." catatan={{ judul: 'Shift', isi: `${actorName}${shiftName ? ` (${shiftName})` : ''} • ${user?.email || '-'} • ${isBackupShift ? 'Melihat semua shift' : 'Reservasi shift saya'} • ${totalAktif} reservasi aktif • ${orderAktif} pesanan aktif` }} tombolRefresh={muatData} keluar={keluar}>
      {tabAktif === 'antrian' && (
        <div className="panel-kode-dua">
          <h2>Antrian Check-in</h2>
          <p style={{ color: 'var(--muted)', marginTop: 0 }}>Pegawai bisa konfirmasi, check-in, menyelesaikan, atau membatalkan reservasi. Semua perubahan masuk laporan shift admin.</p>
          {data.errors?.length > 0 && <div style={{ background: '#fff1ed', border: '1px solid #f0c7b8', color: '#8c2515', padding: '12px', borderRadius: '12px', marginTop: '12px' }}>Sebagian data gagal dimuat dari server. Cek terminal Spring Boot untuk detail error.</div>}
          <div style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
            {data.reservasi.length === 0 && <Kosong judul="Belum ada reservasi" deskripsi="Reservasi customer akan muncul realtime sesuai shift pegawai yang login." />}
            {data.reservasi.map(r => (
              <div key={r.id} className="queue-row-kode-dua" style={{ display: 'grid', gridTemplateColumns: '1.5fr auto', gap: '14px', alignItems: 'center' }}>
                <div><b style={{ fontSize: '1.1rem', display: 'block' }}>{r.guestName}</b><span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{r.code} • Meja {r.tableCode} • {potongJam(r.reservationTime)} • {r.guestCount} tamu • PIC: {r.assignedEmployee || '-'}</span></div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <StatusLabel nilai={r.status}/>
                  {r.status === 'PENDING' && <button className="secondary" onClick={() => updateRsv(r.id, 'CONFIRMED')} style={{ minHeight: '36px', padding: '8px 14px' }}>Konfirmasi</button>}
                  {['PENDING','CONFIRMED'].includes(r.status) && <button className="primary" onClick={() => updateRsv(r.id, 'CHECKED_IN')} style={{ minHeight: '36px', padding: '8px 14px' }}>Check-In</button>}
                  {r.status === 'CHECKED_IN' && <button className="primary" onClick={() => updateRsv(r.id, 'SERVING')} style={{ minHeight: '36px', padding: '8px 14px' }}>Layani</button>}
                  {['CHECKED_IN','SERVING'].includes(r.status) && <button className="green-cta" onClick={() => updateRsv(r.id, 'COMPLETED')} style={{ minHeight: '36px', padding: '8px 14px', borderRadius: '8px' }}>Selesai</button>}
                  {r.status === 'CONFIRMED' && <button className="ghost" onClick={() => updateRsv(r.id, 'NO_SHOW')} style={{ minHeight: '36px', padding: '8px 14px' }}>No-Show</button>}
                  {['PENDING','CONFIRMED'].includes(r.status) && <button className="ghost" onClick={() => updateRsv(r.id, 'CANCELLED')} style={{ minHeight: '36px', padding: '8px 14px' }}>Batal</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tabAktif === 'pesanan' && (
        <div className="panel-kode-dua">
          <h2>Payment & Pesanan Berjalan</h2>
          <p style={{ color: 'var(--muted)', marginTop: 0 }}>Payment customer otomatis masuk ke pegawai sesuai shift reservasi. Pegawai konfirmasi bayar, proses dapur, siap, lalu selesai.</p>
          <div style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
            {data.pesanan.length === 0 && <Kosong judul="Belum ada payment/pesanan" deskripsi="Payment dan pesanan customer akan muncul realtime sesuai shift pegawai yang login." />}
            {data.pesanan.map(o => (
              <div key={o.id} className="queue-row-kode-dua" style={{ display: 'grid', gridTemplateColumns: '1.4fr auto', gap: '14px', alignItems: 'center' }}>
                <div><b style={{ fontSize: '1.1rem', display: 'block' }}>{o.code}</b><span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>RSV: {o.reservationCode} • {o.reservationDate || '-'} {potongJam(o.reservationTime)} sampai {potongJam(o.reservationEndTime)} • Meja {o.tableCode || '-'} • {o.items?.length || 0} item • {labelPembayaran(o.status)}</span></div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <b style={{ color: 'var(--caramel)' }}>{formatRupiah(o.total)}</b>
                  <StatusLabel nilai={o.status}/>
                  {o.status === 'PENDING_PAYMENT' && <button className="primary" onClick={() => updateOrd(o.id, 'PROCESSING')} style={{ minHeight: '36px', padding: '8px 14px' }}>Konfirmasi Bayar</button>}
                  {o.status === 'PROCESSING' && <button className="primary" onClick={() => updateOrd(o.id, 'READY')} style={{ minHeight: '36px', padding: '8px 14px' }}>Siap</button>}
                  {o.status === 'READY' && <button className="green-cta" onClick={() => updateOrd(o.id, 'COMPLETED')} style={{ minHeight: '36px', padding: '8px 14px', borderRadius: '8px' }}>Selesai</button>}
                  {['PENDING_PAYMENT','PROCESSING'].includes(o.status) && <button className="ghost" onClick={() => updateOrd(o.id, 'CANCELLED')} style={{ minHeight: '36px', padding: '8px 14px' }}>Batal</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tabAktif === 'meja' && (
        <div className="panel-kode-dua">
          <h2>Status Meja Hari Ini</h2>
          <p style={{ color: 'var(--muted)', marginTop: 0 }}>Pegawai melihat status meja dari database. Perubahan admin langsung tampil realtime.</p>
          <div className="admin-table-grid" style={{ marginTop: '16px' }}>
            {data.meja.map(m => <div key={m.code} className="admin-table-cell"><b style={{ fontSize: '1.4rem', display: 'block' }}>{m.code}</b><small>{m.floor} • {m.area} • {m.capacity} kursi</small><br/><StatusLabel nilai={m.availabilityStatus || m.physicalStatus}/></div>)}
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
  const bacaUserTersimpan = () => {
    try { return JSON.parse(localStorage.getItem('dika-user') || 'null'); } catch (_) { return null; }
  };
  const halamanAwalDariUser = (akun) => akun?.role === 'ADMIN' ? 'admin' : akun?.role === 'PEGAWAI' ? 'pegawai' : 'home';
  const userAwal = bacaUserTersimpan();

  const [halaman, setHalaman] = useState(() => halamanAwalDariUser(userAwal));
  const [user, setUser] = useState(userAwal);
  const [modeLogin, setModeLogin] = useState(null);
  const [tujuanSetelahLogin, setTujuanSetelahLogin] = useState(null);
  const [toast, setToast] = useState(null);
  const [menu, setMenu] = useState([]);
  const [promos, setPromos] = useState([]);
  const [reservasiAktif, setReservasiAktif] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dika-reservasi-aktif') || 'null'); } catch (_) { return null; }
  });

  const beriNotifikasi = (judul, pesan, tipe = 'info') => {
    setToast({ judul, pesan, tipe });
    setTimeout(() => setToast(null), 4500);
  };

  const bukaLogin = (mode = 'customer', tujuan = null) => {
    setTujuanSetelahLogin(tujuan);
    setModeLogin(mode);
  };

  useEffect(() => {
    mockApi.ambilMenuPublik().then(setMenu).catch(e => beriNotifikasi('Koneksi menu gagal', e.message, 'error'));
    mockApi.ambilPromoPublik().then(setPromos).catch(() => setPromos([]));
  }, []);

  const keluar = () => { localStorage.removeItem('dika-user'); localStorage.removeItem('dika-reservasi-aktif'); setUser(null); setReservasiAktif(null); setHalaman('home'); setModeLogin(null); setTujuanSetelahLogin(null); };

  useEffect(() => {
    if (!user) {
      if (['customer', 'reservation', 'riwayat'].includes(halaman)) setHalaman('home');
      return;
    }
    if (user.role === 'CUSTOMER' && halaman === 'customer') setHalaman('home');
    if (user.role === 'ADMIN' && halaman !== 'admin') setHalaman('admin');
    if (user.role === 'PEGAWAI' && halaman !== 'pegawai') setHalaman('pegawai');
  }, [user, halaman]);

  if (halaman === 'admin' && user?.role === 'ADMIN') return <><StyleInjector/><RuangAdmin keluar={keluar} beriNotifikasi={beriNotifikasi} /><ToastInfo toast={toast} tutup={() => setToast(null)} /></>;
  if (halaman === 'pegawai' && user?.role === 'PEGAWAI') return <><StyleInjector/><RuangPegawai keluar={keluar} beriNotifikasi={beriNotifikasi} user={user} /><ToastInfo toast={toast} tutup={() => setToast(null)} /></>;

  return (
    <>
      <StyleInjector />
      <HeaderUtama ubahHalaman={setHalaman} bukaLogin={bukaLogin} user={user} keluar={keluar} />
      <main>
        {halaman === 'home' && <BerandaPelanggan ubahHalaman={setHalaman} bukaLogin={bukaLogin} user={user} menu={menu} reservasiAktif={reservasiAktif} setReservasiAktif={setReservasiAktif} beriNotifikasi={beriNotifikasi} />}
        {halaman === 'riwayat' && user?.role === 'CUSTOMER' && <RiwayatCustomerRingkas user={user} reservasiAktif={reservasiAktif} setReservasiAktif={setReservasiAktif} ubahHalaman={setHalaman} beriNotifikasi={beriNotifikasi} />}
        {halaman === 'promo' && <PromoPelanggan promos={promos} />}
        {halaman === 'reservation' && user?.role === 'CUSTOMER' && <ReservasiMeja reservasiAktif={reservasiAktif} setReservasiAktif={setReservasiAktif} beriNotifikasi={beriNotifikasi} user={user} ubahHalaman={setHalaman} />}
        {halaman === 'menu' && <MenuKeranjang menu={menu} reservasiAktif={reservasiAktif} ubahHalaman={setHalaman} beriNotifikasi={beriNotifikasi} user={user} bukaLogin={bukaLogin} />}
      </main>
      <FooterProfesional bukaLogin={bukaLogin} />
      
      {modeLogin && (
        <LoginInternal 
          mode={modeLogin || 'customer'} 
          wajib={Boolean(tujuanSetelahLogin)}
          ubahMode={(mode) => setModeLogin(mode)}
          tutup={() => { setModeLogin(null); setTujuanSetelahLogin(null); }} 
          sukses={(akun) => {
            localStorage.setItem('dika-user', JSON.stringify(akun));
            setUser(akun);
            setModeLogin(null);
            const target = akun.role === 'ADMIN' ? 'admin' : akun.role === 'PEGAWAI' ? 'pegawai' : (tujuanSetelahLogin || 'home');
            setTujuanSetelahLogin(null);
            setHalaman(target);
          }}
          beriNotifikasi={beriNotifikasi} 
        />
      )}
      <ToastInfo toast={toast} tutup={() => setToast(null)} />
    </>
  );
}