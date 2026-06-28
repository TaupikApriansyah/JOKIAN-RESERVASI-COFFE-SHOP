import { useEffect, useMemo, useState } from 'react';
import { CalendarCheck, Clock, Coffee, DollarSign, Table2, FileText, Users } from 'lucide-react';
import { ambilDataAdmin } from '../../layanan/adminApi';
import { buatCsv, formatRupiah, tanggalHariIni } from '../../utilitas/format';
import LayoutInternal from '../../komponen/layout/LayoutInternal';
import StatusLabel from '../../komponen/ui/StatusLabel';
import Kosong from '../../komponen/ui/Kosong';
import TabelData from '../../komponen/ui/TabelData';
import GrafikRingkas from '../../komponen/ui/GrafikRingkas';

export default function RuangAdmin({ beriNotifikasi, keluar }) {
  const [tabAktif, setTabAktif] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [reservasi, setReservasi] = useState([]);
  const [pesanan, setPesanan] = useState([]);
  const [meja, setMeja] = useState([]);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);

  async function muatData() {
    setLoading(true);
    try {
      const data = await ambilDataAdmin();
      setDashboard(data.dashboard || {});
      setReservasi(data.reservasi || []);
      setPesanan(data.pesanan || []);
      setMeja(data.meja || []);
      setMenu(data.menu || []);
    } catch (error) {
      beriNotifikasi('Admin gagal memuat data', error.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { muatData(); }, []);

  const tabs = [
    ['dashboard', 'Dashboard'],
    ['reservasi', 'Reservasi'],
    ['pesanan', 'Pesanan'],
    ['meja', 'Meja'],
    ['menu', 'Menu'],
    ['laporan', 'Laporan'],
  ];

  const pendingReservasi = reservasi.filter((item) => item.status === 'PENDING').length;
  const mejaAktif = reservasi.filter((item) => item.status === 'CHECKED_IN').length;
  const revenueHariIni = pesanan.reduce((sum, item) => sum + Number(item.total || 0), 0);

  const statistik = [
    { label: 'Reservasi Hari Ini', value: dashboard?.totalReservationsToday ?? reservasi.length, icon: CalendarCheck, tone: 'coklat' },
    { label: 'Menunggu Konfirmasi', value: pendingReservasi, icon: Clock, tone: 'kuning' },
    { label: 'Meja Aktif', value: mejaAktif, icon: Users, tone: 'ungu' },
    { label: 'Revenue', value: formatRupiah(dashboard?.revenueToday ?? revenueHariIni), icon: DollarSign, tone: 'hijau' },
  ];

  const dataGrafikStatus = useMemo(() => {
    const daftarStatus = ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED'];
    return daftarStatus.map((status) => ({
      label: status.replace('_', ' '),
      nilai: reservasi.filter((item) => item.status === status).length,
    }));
  }, [reservasi]);

  const dataGrafikPesanan = useMemo(() => pesanan.slice(0, 5).map((item) => ({
    label: item.code,
    nilai: Number(item.total || 0),
  })), [pesanan]);

  function eksporCsv() {
    const baris = [
      ['Kode Reservasi', 'Tamu', 'Tanggal', 'Jam', 'Meja', 'Status'],
      ...reservasi.map((item) => [item.code, item.guestName, item.reservationDate, item.reservationTime, item.tableCode, item.status]),
    ];
    buatCsv(`brewvibe-reservasi-${tanggalHariIni}.csv`, baris);
  }

  return (
    <LayoutInternal
      jenis="admin"
      tabAktif={tabAktif}
      setTabAktif={setTabAktif}
      tabs={tabs}
      judul="Kontrol operasional harian"
      deskripsi="Pantau reservasi, pesanan, meja, menu, promo, dan laporan dari data Spring Boot + MySQL."
      catatan={{ judul: 'Admin Console', isi: 'Kelola data operasional cafe dari satu workspace yang terhubung ke backend.' }}
      tombolRefresh={muatData}
      loading={loading}
      keluar={keluar}
    >
      {tabAktif === 'dashboard' && (
        <div className="workspace-stack">
          <div className="stat-grid-kode-dua">
            {statistik.map((stat) => (
              <article key={stat.label} className="stat-card-kode-dua">
                <div className={`stat-icon ${stat.tone}`}><stat.icon size={23} /></div>
                <div>
                  <span>{stat.label}</span>
                  <b>{stat.value}</b>
                </div>
              </article>
            ))}
          </div>

          <div className="admin-dashboard-grid">
            <section className="panel-kode-dua panel-lebar">
              <div className="panel-title-row">
                <h2>Reservasi Terbaru</h2>
                <button onClick={() => setTabAktif('reservasi')}>Lihat Semua</button>
              </div>
              <div className="reservation-card-grid">
                {reservasi.slice(0, 6).length ? reservasi.slice(0, 6).map((item) => (
                  <article className="reservation-mini-card" key={item.id || item.code}>
                    <div className="mini-card-head">
                      <b>{item.guestName}</b>
                      <StatusLabel nilai={item.status} />
                    </div>
                    <p>{item.code} · {item.reservationDate} {String(item.reservationTime).slice(0, 5)}</p>
                    <span>Meja {item.tableCode} · {item.area} · {item.guestCount} tamu</span>
                  </article>
                )) : <Kosong judul="Reservasi belum tersedia" deskripsi="Pastikan backend berjalan dan database sudah memiliki data seed." />}
              </div>
            </section>

            <aside className="panel-kode-dua">
              <div className="panel-title-row">
                <h2>Pesanan Hari Ini</h2>
                <button onClick={() => setTabAktif('pesanan')}>Detail</button>
              </div>
              <div className="order-stack-kode-dua">
                {pesanan.slice(0, 5).length ? pesanan.slice(0, 5).map((item) => (
                  <article className="order-mini-kode-dua" key={item.id || item.code}>
                    <div>
                      <b>{item.code}</b>
                      <span>{item.appliedPromo || 'Tanpa promo'}</span>
                    </div>
                    <div>
                      <strong>{formatRupiah(item.total)}</strong>
                      <StatusLabel nilai={item.status} />
                    </div>
                  </article>
                )) : <Kosong judul="Belum ada pesanan" deskripsi="Pesanan akan tampil setelah customer checkout." ringkas />}
              </div>
            </aside>
          </div>

          <div className="chart-grid refined-chart-grid">
            <GrafikRingkas judul="Status reservasi" data={dataGrafikStatus} />
            <GrafikRingkas judul="Nominal pesanan" data={dataGrafikPesanan.length ? dataGrafikPesanan : [{ label: 'Belum ada', nilai: 0 }]} tipe="rupiah" />
          </div>
        </div>
      )}

      {tabAktif === 'reservasi' && <TabelData judul="Manajemen Reservasi" kolom={['Kode', 'Tamu', 'Kontak', 'Tanggal', 'Jam', 'Meja', 'Area', 'Status']} baris={reservasi.map((item) => [item.code, item.guestName, item.phone, item.reservationDate, item.reservationTime, item.tableCode, item.area, item.status])} />}
      {tabAktif === 'pesanan' && <TabelData judul="Manajemen Pesanan" kolom={['Kode', 'Reservasi', 'Status', 'Subtotal', 'Diskon', 'Total', 'Promo']} baris={pesanan.map((item) => [item.code, item.reservationCode, item.status, formatRupiah(item.subtotal), formatRupiah(item.discount), formatRupiah(item.total), item.appliedPromo || '-'])} />}

      {tabAktif === 'meja' && (
        <section className="panel-kode-dua panel-full">
          <div className="panel-title-row"><h2>Master Meja</h2><span>{meja.length} meja</span></div>
          <div className="admin-table-grid">
            {meja.map((item) => <div className={`admin-table-cell ${String(item.physicalStatus).toLowerCase()}`} key={item.code}><b>{item.code}</b><span>{item.area}</span><small>{item.capacity} kursi · {item.physicalStatus}</small></div>)}
          </div>
        </section>
      )}

      {tabAktif === 'menu' && (
        <section className="panel-kode-dua panel-full">
          <div className="panel-title-row"><h2>Master Menu</h2><span>{menu.length} item</span></div>
          <div className="admin-menu-grid menu-grid-kode-dua">
            {menu.map((item) => <div className="admin-menu-item" key={item.id}><img src={item.imageUrl} alt={item.name} /><div><span>{item.category}</span><b>{item.name}</b><small>{item.description}</small></div><strong>{formatRupiah(item.price)}</strong></div>)}
          </div>
        </section>
      )}

      {tabAktif === 'laporan' && (
        <section className="panel-kode-dua panel-full report-panel">
          <div>
            <span className="eyebrow">Laporan</span>
            <h2>Export data operasional</h2>
            <p>Unduh rekap reservasi dari MySQL dalam format CSV. Bagian ini disiapkan untuk laporan harian admin.</p>
          </div>
          <button className="primary" onClick={eksporCsv}><FileText size={16} /> Unduh CSV Reservasi</button>
        </section>
      )}
    </LayoutInternal>
  );
}
