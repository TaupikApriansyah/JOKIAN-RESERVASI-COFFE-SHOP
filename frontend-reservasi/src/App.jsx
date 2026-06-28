import { useEffect, useState } from 'react';
import './index.css';
import { ambilMenuPublik, ambilPromoPublik } from './layanan/publikApi';
import { useMunculSaatScroll } from './kait/useMunculSaatScroll';
import HeaderUtama from './komponen/layout/HeaderUtama';
import FooterProfesional from './komponen/layout/FooterProfesional';
import ToastInfo from './komponen/ui/ToastInfo';
import LoginInternal from './halaman/auth/LoginInternal';
import BerandaPelanggan from './halaman/pelanggan/BerandaPelanggan';
import AlurPelanggan from './halaman/pelanggan/AlurPelanggan';
import PromoPelanggan from './halaman/pelanggan/PromoPelanggan';
import ReservasiMeja from './halaman/pelanggan/ReservasiMeja';
import MenuKeranjang from './halaman/pelanggan/MenuKeranjang';
import RuangAdmin from './halaman/admin/RuangAdmin';
import RuangPegawai from './halaman/pegawai/RuangPegawai';

export default function App() {
  const [halaman, setHalaman] = useState('home');
  const [modeLogin, setModeLogin] = useState(null);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [menu, setMenu] = useState([]);
  const [promos, setPromos] = useState([]);
  const [reservasiAktif, setReservasiAktif] = useState(null);

  useMunculSaatScroll();

  function beriNotifikasi(judul, pesan, tipe = 'info') {
    setToast({ judul, pesan, tipe });
    setTimeout(() => setToast(null), 4500);
  }

  function keluar() {
    setUser(null);
    setHalaman('home');
  }

  useEffect(() => {
    Promise.all([ambilMenuPublik(), ambilPromoPublik()])
      .then(([dataMenu, dataPromo]) => {
        setMenu(dataMenu || []);
        setPromos(dataPromo || []);
      })
      .catch((error) => beriNotifikasi('Backend belum terhubung', `${error.message}. Pastikan Spring Boot berjalan di port 8081.`, 'error'));
  }, []);

  useEffect(() => {
    if (halaman === 'flow') document.querySelector('.flow-section')?.scrollIntoView({ behavior: 'smooth' });
    if (halaman === 'promo') document.querySelector('.promo-strip')?.scrollIntoView({ behavior: 'smooth' });
    if (halaman === 'reservation') document.querySelector('.reservation-layout')?.scrollIntoView({ behavior: 'smooth' });
    if (halaman === 'menu') document.querySelector('.menu-order')?.scrollIntoView({ behavior: 'smooth' });
  }, [halaman]);

  const sudahLoginAdmin = halaman === 'admin' && user?.role === 'ADMIN';
  const sudahLoginPegawai = halaman === 'pegawai' && user?.role === 'PEGAWAI';

  if (sudahLoginAdmin) {
    return (
      <>
        <RuangAdmin beriNotifikasi={beriNotifikasi} keluar={keluar} />
        <ToastInfo toast={toast} tutup={() => setToast(null)} />
      </>
    );
  }

  if (sudahLoginPegawai) {
    return (
      <>
        <RuangPegawai beriNotifikasi={beriNotifikasi} keluar={keluar} />
        <ToastInfo toast={toast} tutup={() => setToast(null)} />
      </>
    );
  }

  return (
    <>
      <HeaderUtama ubahHalaman={setHalaman} bukaLogin={setModeLogin} user={user} keluar={keluar} />
      <main>
        <BerandaPelanggan ubahHalaman={setHalaman} menu={menu} />
        <AlurPelanggan ubahHalaman={setHalaman} />
        <PromoPelanggan promos={promos} />
        <ReservasiMeja reservasiAktif={reservasiAktif} setReservasiAktif={setReservasiAktif} beriNotifikasi={beriNotifikasi} />
        <MenuKeranjang menu={menu} reservasiAktif={reservasiAktif} ubahHalaman={setHalaman} beriNotifikasi={beriNotifikasi} />
      </main>
      <FooterProfesional bukaLogin={setModeLogin} />
      {modeLogin && (
        <LoginInternal
          mode={modeLogin}
          tutup={() => setModeLogin(null)}
          sukses={(akun) => {
            setUser(akun);
            setModeLogin(null);
            setHalaman(akun.role === 'ADMIN' ? 'admin' : 'pegawai');
          }}
          beriNotifikasi={beriNotifikasi}
        />
      )}
      <ToastInfo toast={toast} tutup={() => setToast(null)} />
    </>
  );
}
