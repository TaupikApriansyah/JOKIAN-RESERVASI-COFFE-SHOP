import { useState } from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Coffee,
  Users,
  FileText,
  LogOut,
  RefreshCw,
  Table2,
  Utensils,
  UserCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from 'lucide-react';

const ikonTab = {
  Dashboard: LayoutDashboard,
  Reservasi: CalendarCheck,
  Pesanan: Coffee,
  Meja: Table2,
  Menu: Utensils,
  Laporan: FileText,
  Antrian: Users,
  'Check-in': UserCheck,
  'Status Meja': Table2,
};

export default function LayoutInternal({ jenis, tabAktif, setTabAktif, tabs, judul, deskripsi, catatan, children, tombolRefresh, loading, keluar }) {
  const admin = jenis === 'admin';
  const [sidebarRingkas, setSidebarRingkas] = useState(false);
  const [sidebarMobile, setSidebarMobile] = useState(false);

  function pilihTab(key) {
    setTabAktif(key);
    setSidebarMobile(false);
  }

  return (
    <div className={`ruang-internal ${sidebarRingkas ? 'sidebar-ringkas' : ''} ${sidebarMobile ? 'sidebar-mobile-open' : ''}`}>
      <button className="sidebar-overlay" aria-label="Tutup sidebar" onClick={() => setSidebarMobile(false)} />
      <aside className="sidebar-internal">
        <div className="sidebar-head-internal">
          <div className="logo-internal">
            <span>D</span>
            <div>
              <b>Dika Coffe Shop</b>
              <small>{admin ? 'Ruang Admin' : 'Ruang Pegawai'}</small>
            </div>
          </div>
          <button className="sidebar-close-mobile" aria-label="Tutup sidebar" onClick={() => setSidebarMobile(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="menu-internal">
          {tabs.map(([key, label]) => {
            const Ikon = ikonTab[label] || LayoutDashboard;
            return (
              <button key={key} className={tabAktif === key ? 'active' : ''} onClick={() => pilihTab(key)} title={label}>
                <Ikon size={19} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="catatan-shift">
          <b>{catatan.judul}</b>
          <span>{catatan.isi}</span>
        </div>

        <button className="logout-internal" onClick={keluar}>
          <LogOut size={16} /> <span>Keluar</span>
        </button>
      </aside>

      <section className="konten-internal">
        <header className="topbar-internal">
          <div className="topbar-kiri-internal">
            <button className="toggle-sidebar-mobile" aria-label="Buka sidebar" onClick={() => setSidebarMobile(true)}>
              <Menu size={20} />
            </button>
            <button className="toggle-sidebar-desktop" aria-label="Sembunyikan sidebar" onClick={() => setSidebarRingkas((nilai) => !nilai)}>
              {sidebarRingkas ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
            <div>
              <h1>{judul}</h1>
              <p>{deskripsi}</p>
            </div>
          </div>
          {tombolRefresh && (
            <button className="refresh-internal" onClick={tombolRefresh} disabled={loading}>
              <RefreshCw size={16} className={loading ? 'berputar' : ''} />
              {loading ? 'Sinkronisasi...' : 'Refresh Data'}
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
