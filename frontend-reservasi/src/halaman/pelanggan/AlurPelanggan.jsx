export default function AlurPelanggan({ ubahHalaman }) {
  const langkah = [
    ['01', 'Reservasi meja', 'Pilih tanggal, jam, jumlah tamu, area, dan meja yang tersedia.'],
    ['02', 'Konfirmasi data', 'Lengkapi nama dan nomor WhatsApp untuk bukti reservasi.'],
    ['03', 'Pilih menu', 'Menu baru dapat dipesan setelah kode reservasi berhasil dibuat.'],
    ['04', 'Checkout pesanan', 'Keranjang menghitung subtotal, promo, dan total akhir dari backend.'],
  ];

  return (
    <section className="section flow-section reveal">
      <div className="section-intro">
        <span className="eyebrow">Alur customer</span>
        <h2>Reservasi dulu. Baru pesan makanan dan minuman.</h2>
        <p>Urutan dibuat agar meja tidak bentrok dan pesanan pelanggan langsung terhubung dengan kode reservasi.</p>
      </div>
      <div className="timeline">
        {langkah.map((item) => (
          <div className="timeline-item" key={item[0]}>
            <span>{item[0]}</span>
            <h3>{item[1]}</h3>
            <p>{item[2]}</p>
          </div>
        ))}
      </div>
      <button className="primary" onClick={() => ubahHalaman('reservation')}>Cek Ketersediaan Meja</button>
    </section>
  );
}
