import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const navigasi = [
  ['home', 'Beranda'],
  ['reservation', 'Reservasi'],
  ['menu', 'Menu'],
  ['flow', 'Alur'],
  ['promo', 'Promo'],
];

export default function HeaderUtama({ ubahHalaman, bukaLogin, user, keluar }) {
  const [menuTerbuka, setMenuTerbuka] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saatScroll = () => setScrolled(window.scrollY > 38);
    saatScroll();
    window.addEventListener('scroll', saatScroll);
    return () => window.removeEventListener('scroll', saatScroll);
  }, []);

  function pindah(halaman) {
    ubahHalaman(halaman);
    setMenuTerbuka(false);
  }

  return (
    <header className={`site-header cafe-navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <button className="brand cafe-brand" onClick={() => pindah('home')} aria-label="Buka halaman utama BrewVibe">
        <span>B</span>
        <strong>BrewVibe</strong>
      </button>

      <nav className="desktop-nav">
        {navigasi.map(([key, label]) => (
          <button key={key} onClick={() => pindah(key)}>{label}</button>
        ))}
      </nav>

      <div className="header-actions desktop-actions">
        {user ? (
          <>
            <button className="ghost" onClick={() => pindah(user.role === 'ADMIN' ? 'admin' : 'pegawai')}>
              {user.role === 'ADMIN' ? 'Admin' : 'Pegawai'}
            </button>
            <button className="dark" onClick={keluar}>Logout</button>
          </>
        ) : (
          <>
            <button className="ghost" onClick={() => bukaLogin('pegawai')}>Pegawai</button>
            <button className="dark" onClick={() => bukaLogin('admin')}>Admin</button>
          </>
        )}
      </div>

      <button className="mobile-toggle" onClick={() => setMenuTerbuka((nilai) => !nilai)} aria-label="Buka menu navigasi">
        {menuTerbuka ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {menuTerbuka && (
          <motion.div
            className="mobile-nav-panel"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {navigasi.map(([key, label]) => (
              <button key={key} onClick={() => pindah(key)}>{label}</button>
            ))}
            <div className="mobile-nav-actions">
              <button onClick={() => { setMenuTerbuka(false); bukaLogin('pegawai'); }}>Login Pegawai</button>
              <button className="dark" onClick={() => { setMenuTerbuka(false); bukaLogin('admin'); }}>Login Admin</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
