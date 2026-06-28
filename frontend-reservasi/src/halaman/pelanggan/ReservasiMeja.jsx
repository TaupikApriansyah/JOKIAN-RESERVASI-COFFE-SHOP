import { useEffect, useState } from 'react';
import { ambilMejaTersedia, buatReservasi } from '../../layanan/publikApi';
import { tanggalHariIni } from '../../utilitas/format';

export default function ReservasiMeja({ reservasiAktif, setReservasiAktif, beriNotifikasi }) {
  const [langkah, setLangkah] = useState(1);
  const [daftarMeja, setDaftarMeja] = useState([]);
  const [form, setForm] = useState({
    reservationDate: tanggalHariIni,
    reservationTime: '19:00',
    guestCount: 2,
    area: 'Indoor',
    tableCode: '',
    guestName: '',
    phone: '',
    specialRequest: '',
  });
  const [galatKolom, setGalatKolom] = useState({});
  const [memuatMeja, setMemuatMeja] = useState(false);
  const [mengirim, setMengirim] = useState(false);

  useEffect(() => {
    async function muatMeja() {
      setMemuatMeja(true);
      try {
        const data = await ambilMejaTersedia({
          tanggal: form.reservationDate,
          jam: form.reservationTime,
          jumlahTamu: form.guestCount,
          area: form.area,
        });
        setDaftarMeja(data);
      } catch (error) {
        beriNotifikasi('Gagal memuat meja', error.message, 'error');
      } finally {
        setMemuatMeja(false);
      }
    }
    muatMeja();
  }, [form.reservationDate, form.reservationTime, form.guestCount, form.area]);

  function ubah(field, nilai) {
    const resetMeja = ['area', 'guestCount', 'reservationDate', 'reservationTime'].includes(field);
    setForm((prev) => ({ ...prev, [field]: nilai, ...(resetMeja ? { tableCode: '' } : {}) }));
    setGalatKolom({});
  }

  function lanjut() {
    if (langkah === 1 && (!form.reservationDate || !form.reservationTime || !form.guestCount)) {
      beriNotifikasi('Data belum lengkap', 'Tanggal, jam, dan jumlah tamu wajib diisi.', 'error');
      return;
    }
    if (langkah === 2 && !form.tableCode) {
      beriNotifikasi('Meja belum dipilih', 'Silakan pilih meja yang berwarna tersedia.', 'error');
      return;
    }
    if (langkah === 3 && (!form.guestName || !form.phone)) {
      beriNotifikasi('Data tamu belum lengkap', 'Nama lengkap dan nomor WhatsApp wajib diisi.', 'error');
      return;
    }
    setLangkah((value) => Math.min(4, value + 1));
  }

  async function simpanReservasi() {
    setMengirim(true);
    try {
      const reservasi = await buatReservasi(form);
      setReservasiAktif(reservasi);
      setLangkah(1);
      beriNotifikasi('Reservasi berhasil', `Kode reservasi ${reservasi.code}. Anda dapat melanjutkan pemesanan menu.`, 'success');
    } catch (error) {
      setGalatKolom(error.details || {});
      beriNotifikasi('Reservasi belum dapat diproses', error.message, 'error');
    } finally {
      setMengirim(false);
    }
  }

  const mejaDipilih = daftarMeja.find((meja) => meja.code === form.tableCode);

  return (
    <section className="reservation-layout reveal" id="reservation">
      <div className="reservation-heading">
        <span className="eyebrow">Reservasi meja</span>
        <h2>Pilih meja berdasarkan waktu kunjungan.</h2>
        <p>Setiap meja dicek ke backend. Jika sudah ada reservasi pada slot waktu yang sama, warna meja berubah dan tidak bisa dipilih.</p>
      </div>

      <div className="stepper">
        {['Waktu', 'Meja', 'Data Tamu', 'Review'].map((label, index) => (
          <button key={label} className={langkah === index + 1 ? 'active' : ''} onClick={() => setLangkah(index + 1)}>{index + 1}. {label}</button>
        ))}
      </div>

      <div className="reservation-panel">
        {langkah === 1 && (
          <div className="form-grid minimal">
            <label>Tanggal kunjungan<input type="date" min={tanggalHariIni} value={form.reservationDate} onChange={(e) => ubah('reservationDate', e.target.value)} /></label>
            <label>Jam kedatangan<input type="time" value={form.reservationTime} onChange={(e) => ubah('reservationTime', e.target.value)} /></label>
            <label>Jumlah tamu<input type="number" min="1" max="12" value={form.guestCount} onChange={(e) => ubah('guestCount', Number(e.target.value))} /></label>
            <label>Preferensi area<select value={form.area} onChange={(e) => ubah('area', e.target.value)}><option>Indoor</option><option>Outdoor</option></select></label>
          </div>
        )}

        {langkah === 2 && (
          <div>
            <div className="table-legend">
              <span><i className="available" /> Tersedia</span>
              <span><i className="reserved" /> Terisi</span>
              <span><i className="selected" /> Dipilih</span>
              <span><i className="disabled" /> Tidak sesuai</span>
            </div>
            {memuatMeja ? <p>Memeriksa ketersediaan meja...</p> : (
              <div className="table-map">
                {daftarMeja.map((meja) => {
                  const dipilih = form.tableCode === meja.code;
                  const bisaDipilih = meja.availabilityStatus === 'AVAILABLE';
                  return (
                    <button
                      key={meja.code}
                      className={`table-box ${dipilih ? 'selected' : String(meja.availabilityStatus).toLowerCase()}`}
                      disabled={!bisaDipilih}
                      onClick={() => ubah('tableCode', meja.code)}
                      title={meja.reason}
                    >
                      <strong>{meja.code}</strong>
                      <small>{meja.area} · {meja.capacity} kursi</small>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {langkah === 3 && (
          <div className="form-grid minimal">
            <label>Nama lengkap<input value={form.guestName} onChange={(e) => ubah('guestName', e.target.value)} placeholder="Contoh: Adi Nugroho" />{galatKolom.guestName && <small className="field-error">{galatKolom.guestName}</small>}</label>
            <label>Nomor WhatsApp<input value={form.phone} onChange={(e) => ubah('phone', e.target.value)} placeholder="Contoh: 081234567890" />{galatKolom.phone && <small className="field-error">{galatKolom.phone}</small>}</label>
            <label className="full">Catatan khusus<textarea maxLength="200" value={form.specialRequest} onChange={(e) => ubah('specialRequest', e.target.value)} placeholder="Opsional. Contoh: kursi anak atau area lebih tenang." /></label>
          </div>
        )}

        {langkah === 4 && (
          <div className="review-lines">
            <p><span>Tanggal dan jam</span><strong>{form.reservationDate} · {form.reservationTime}</strong></p>
            <p><span>Meja</span><strong>{form.tableCode || '-'} {mejaDipilih ? `· ${mejaDipilih.area} · ${mejaDipilih.capacity} kursi` : ''}</strong></p>
            <p><span>Jumlah tamu</span><strong>{form.guestCount} orang</strong></p>
            <p><span>Nama</span><strong>{form.guestName}</strong></p>
            <p><span>WhatsApp</span><strong>{form.phone}</strong></p>
          </div>
        )}

        <div className="form-actions">
          {langkah > 1 && <button className="secondary" onClick={() => setLangkah(langkah - 1)}>Kembali</button>}
          {langkah < 4 && <button className="primary" onClick={lanjut}>Lanjut</button>}
          {langkah === 4 && <button className="primary" onClick={simpanReservasi} disabled={mengirim}>{mengirim ? 'Mengirim...' : 'Konfirmasi Reservasi'}</button>}
        </div>
      </div>

      {reservasiAktif && (
        <div className="reservation-success">
          <span>Kode Reservasi</span>
          <strong>{reservasiAktif.code}</strong>
          <p>Meja {reservasiAktif.tableCode} telah terhubung. Silakan lanjut memilih menu dan masukkan pesanan ke keranjang.</p>
        </div>
      )}
    </section>
  );
}
