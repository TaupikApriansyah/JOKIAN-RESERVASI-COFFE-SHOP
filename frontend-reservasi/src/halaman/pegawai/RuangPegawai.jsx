import { useEffect, useState } from 'react';
import { CalendarCheck, Coffee, PlayCircle, UserCheck, FileText, CheckCircle } from 'lucide-react';
import { ambilDataPegawai, ubahStatusPesananPegawai, ubahStatusReservasiPegawai } from '../../layanan/pegawaiApi';
import { formatRupiah, potongJam, tanggalHariIni } from '../../utilitas/format';
import LayoutInternal from '../../komponen/layout/LayoutInternal';
import StatusLabel from '../../komponen/ui/StatusLabel';
import Kosong from '../../komponen/ui/Kosong';

export default function RuangPegawai({ beriNotifikasi, keluar, user }) {
  const [tabAktif, setTabAktif] = useState('antrian');
  const [reservasi, setReservasi] = useState([]);
  const [pesanan, setPesanan] = useState([]);
  const [meja, setMeja] = useState([]);
  const [pencarian, setPencarian] = useState('');
  const [loading, setLoading] = useState(false);
  const actorName = user?.fullName || 'Pegawai Dika Coffe Shop';

  async function muatData() {
    setLoading(true);
    try {
      const data = await ambilDataPegawai(tanggalHariIni, actorName);
      setReservasi(data.reservasi || []);
      setPesanan(data.pesanan || []);
      setMeja(data.meja || []);
    } catch (error) {
      beriNotifikasi('Pegawai gagal memuat data', error.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { muatData(); }, []);

  async function updateReservasi(id, status) {
    try {
      await ubahStatusReservasiPegawai(id, status, actorName);
      await muatData();
      beriNotifikasi('Status diperbarui', `Reservasi menjadi ${status}.`, 'success');
    } catch (error) {
      beriNotifikasi('Gagal update status', error.message, 'error');
    }
  }

  async function updatePesanan(id, status) {
    try {
      await ubahStatusPesananPegawai(id, status, actorName);
      await muatData();
      beriNotifikasi('Status pesanan diperbarui', `Pesanan menjadi ${status}.`, 'success');
    } catch (error) {
      beriNotifikasi('Gagal update pesanan', error.message, 'error');
    }
  }

  const hasilCari = reservasi.filter((item) => {
    const q = pencarian.toLowerCase();
    return !q || item.code?.toLowerCase().includes(q) || item.phone?.toLowerCase().includes(q) || item.guestName?.toLowerCase().includes(q);
  });

  const perluAksi = reservasi.filter((item) => !['COMPLETED', 'CANCELLED'].includes(item.status)).length;
  const sudahCheckIn = reservasi.filter((item) => item.status === 'CHECKED_IN').length;
  const tabs = [['antrian', 'Antrian'], ['checkin', 'Check-in'], ['pesanan', 'Pesanan'], ['meja', 'Status Meja']];

  const statistik = [
    { label: 'Reservasi Hari Ini', value: reservasi.length, icon: CalendarCheck },
    { label: 'Pesanan Masuk', value: pesanan.length, icon: Coffee },
    { label: 'Perlu Aksi', value: perluAksi, icon: PlayCircle },
  ];

  return (
    <LayoutInternal
      jenis="pegawai"
      tabAktif={tabAktif}
      setTabAktif={setTabAktif}
      tabs={tabs}
      judul="Antrian reservasi dan pesanan"
      deskripsi="Konfirmasi reservasi, check-in customer, update pesanan, dan pantau meja dari satu workspace pegawai."
      catatan={{ judul: 'Shift Hari Ini', isi: `${actorName} • reservasi otomatis sesuai jadwal shift.` }}
      tombolRefresh={muatData}
      loading={loading}
      keluar={keluar}
    >
      <div className="pegawai-stat-grid">
        {statistik.map((stat) => (
          <article key={stat.label} className="pegawai-stat-card">
            <div><stat.icon size={24} /></div>
            <span>{stat.label}</span>
            <b>{stat.value}</b>
          </article>
        ))}
      </div>

      {tabAktif === 'antrian' && (
        <div className="employee-board-grid">
          <section className="panel-kode-dua panel-lebar">
            <div className="panel-title-row"><h2><UserCheck size={20} /> Antrian Check-in</h2><span>{tanggalHariIni}</span></div>
            <div className="queue-list-kode-dua">
              {reservasi.length ? reservasi.map((item) => (
                <article className="queue-row-kode-dua" key={item.id}>
                  <div className="time-badge-kode-dua">{potongJam(item.reservationTime)}</div>
                  <div className="queue-info-kode-dua">
                    <b>{item.guestName}</b>
                    <span>{item.code} · Meja {item.tableCode} · {item.guestCount} tamu</span>
                  </div>
                  <StatusLabel nilai={item.status} />
                  <div className="queue-actions-kode-dua">
                    {item.status === 'PENDING' && <button onClick={() => updateReservasi(item.id, 'CONFIRMED')}>Konfirmasi</button>}
                    {['PENDING', 'CONFIRMED'].includes(item.status) && <button className="aksi-utama" onClick={() => updateReservasi(item.id, 'CHECKED_IN')}>Check-in</button>}
                    {item.status === 'CONFIRMED' && <button onClick={() => updateReservasi(item.id, 'NO_SHOW')}>No-show</button>}
                    {['CHECKED_IN','SERVING'].includes(item.status) && <button className="aksi-selesai" onClick={() => updateReservasi(item.id, 'COMPLETED')}><CheckCircle size={15} /> Selesai</button>}
                    {item.status === 'COMPLETED' && <span className="done-chip">Done ✓</span>}
                  </div>
                </article>
              )) : <Kosong judul="Antrian masih kosong" deskripsi="Data akan muncul setelah customer membuat reservasi atau seed backend masuk ke MySQL." />}
            </div>
          </section>

          <aside className="panel-kode-dua">
            <div className="panel-title-row"><h2><FileText size={19} /> Pesanan Masuk</h2><span>{pesanan.length} order</span></div>
            <div className="order-stack-kode-dua">
              {pesanan.slice(0, 5).length ? pesanan.slice(0, 5).map((item) => (
                <article className="order-mini-kode-dua" key={item.id || item.code}>
                  <div><b>{item.code}</b><span>{item.reservationCode}</span></div>
                  <div><strong>{formatRupiah(item.total)}</strong><StatusLabel nilai={item.status} /></div>
                </article>
              )) : <Kosong judul="Belum ada pesanan" deskripsi="Pesanan akan muncul setelah customer checkout." ringkas />}
            </div>
          </aside>
        </div>
      )}

      {tabAktif === 'checkin' && (
        <section className="panel-kode-dua panel-full">
          <div className="panel-title-row"><h2>Quick check-in</h2><span>Cari kode, nama, atau nomor HP</span></div>
          <input className="workspace-search" value={pencarian} onChange={(e) => setPencarian(e.target.value)} placeholder="Cari: RSV-xxxx / 0812 / nama tamu" />
          <div className="queue-list-kode-dua search-results">
            {hasilCari.length ? hasilCari.map((item) => (
              <article className="queue-row-kode-dua" key={item.id}>
                <div className="time-badge-kode-dua">{potongJam(item.reservationTime)}</div>
                <div className="queue-info-kode-dua"><b>{item.guestName}</b><span>{item.phone} · {item.code} · Meja {item.tableCode}</span></div>
                <StatusLabel nilai={item.status} />
                <div className="queue-actions-kode-dua">{['PENDING','CONFIRMED'].includes(item.status) && <button className="aksi-utama" onClick={() => updateReservasi(item.id, 'CHECKED_IN')}>Check-in</button>}{item.status === 'CONFIRMED' && <button onClick={() => updateReservasi(item.id, 'NO_SHOW')}>No-show</button>}<button onClick={() => updateReservasi(item.id, 'CANCELLED')}>Cancel</button></div>
              </article>
            )) : <Kosong judul="Tidak ada hasil" deskripsi="Masukkan kode reservasi, nama, atau nomor WhatsApp customer." />}
          </div>
        </section>
      )}

      {tabAktif === 'pesanan' && (
        <section className="panel-kode-dua panel-full">
          <div className="panel-title-row"><h2>Update pesanan</h2><span>{pesanan.length} order</span></div>
          <div className="order-work-list">
            {pesanan.length ? pesanan.map((item) => (
              <article className="order-work-item" key={item.id || item.code}>
                <div><span>{item.code}</span><b>{formatRupiah(item.total)}</b><small>{item.reservationCode} · {item.appliedPromo || 'Tanpa promo'}</small></div>
                <StatusLabel nilai={item.status} />
                <div className="queue-actions-kode-dua">
                  {item.status === 'PENDING_PAYMENT' && <button onClick={() => updatePesanan(item.id, 'PROCESSING')}>Bayar & Proses</button>}
                  {item.status === 'PROCESSING' && <button className="aksi-utama" onClick={() => updatePesanan(item.id, 'READY')}>Siap</button>}
                  {item.status === 'READY' && <button className="aksi-selesai" onClick={() => updatePesanan(item.id, 'COMPLETED')}>Selesai</button>}
                  {['PENDING_PAYMENT','PROCESSING'].includes(item.status) && <button onClick={() => updatePesanan(item.id, 'CANCELLED')}>Batal</button>}
                </div>
              </article>
            )) : <Kosong judul="Pesanan kosong" deskripsi="Pesanan dari cart customer akan tampil di sini." />}
          </div>
        </section>
      )}

      {tabAktif === 'meja' && (
        <section className="panel-kode-dua panel-full">
          <div className="panel-title-row"><h2>Status meja</h2><span>{meja.length} meja · {sudahCheckIn} check-in aktif</span></div>
          <div className="admin-table-grid staff-table-view">
            {meja.map((item) => <div className={`admin-table-cell ${String(item.availabilityStatus).toLowerCase()}`} key={item.code}><b>{item.code}</b><span>{item.area}</span><small>{item.capacity} kursi · {item.availabilityStatus}</small></div>)}
          </div>
        </section>
      )}
    </LayoutInternal>
  );
}
