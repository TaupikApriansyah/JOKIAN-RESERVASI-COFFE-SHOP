import { useMemo, useState } from 'react';
import { buatPesanan } from '../../layanan/publikApi';
import { formatRupiah } from '../../utilitas/format';

export default function MenuKeranjang({ menu, reservasiAktif, ubahHalaman, beriNotifikasi }) {
  const [keranjang, setKeranjang] = useState([]);
  const [hasilPesanan, setHasilPesanan] = useState(null);
  const subtotal = useMemo(() => keranjang.reduce((sum, item) => sum + Number(item.price) * item.qty, 0), [keranjang]);

  function tambahMenu(menuItem) {
    if (!reservasiAktif) {
      beriNotifikasi('Reservasi diperlukan', 'Pesan menu hanya bisa dilakukan setelah meja berhasil dipesan.', 'error');
      ubahHalaman('reservation');
      return;
    }
    setKeranjang((prev) => {
      const ditemukan = prev.find((item) => item.id === menuItem.id);
      if (ditemukan) return prev.map((item) => item.id === menuItem.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...menuItem, qty: 1 }];
    });
  }

  function kurangiMenu(id) {
    setKeranjang((prev) => prev.flatMap((item) => item.id === id ? (item.qty > 1 ? [{ ...item, qty: item.qty - 1 }] : []) : [item]));
  }

  async function checkout() {
    if (!reservasiAktif) {
      beriNotifikasi('Reservasi belum tersedia', 'Selesaikan reservasi meja terlebih dahulu.', 'error');
      return;
    }
    if (!keranjang.length) {
      beriNotifikasi('Keranjang kosong', 'Pilih minimal satu menu sebelum checkout.', 'error');
      return;
    }
    try {
      const payload = {
        reservationCode: reservasiAktif.code,
        items: keranjang.map((item) => ({ menuItemId: item.id, quantity: item.qty })),
      };
      const order = await buatPesanan(payload);
      setHasilPesanan(order);
      setKeranjang([]);
      beriNotifikasi('Pesanan berhasil dibuat', `Kode pesanan ${order.code}. Total ${formatRupiah(order.total)}.`, 'success');
    } catch (error) {
      beriNotifikasi('Checkout gagal', error.message, 'error');
    }
  }

  const pesanPromo = subtotal >= 300000
    ? 'Promo Rp300K aktif saat checkout.'
    : subtotal > 0
      ? `Tambah ${formatRupiah(Math.max(0, 300000 - subtotal))} untuk promo Rp300K.`
      : 'Promo akan dihitung setelah ada item.';

  return (
    <section className="menu-order reveal" id="menu">
      <div className="section-intro compact">
        <span className="eyebrow">Menu dan keranjang</span>
        <h2>Pesanan menu terhubung ke kode reservasi.</h2>
        <p>React hanya mengirim pilihan menu. Perhitungan promo, total, dan validasi item diproses di Spring Boot.</p>
      </div>

      <div className="menu-layout">
        <div className="menu-list-clean">
          {menu.map((item) => (
            <div className="menu-row" key={item.id}>
              <img src={item.imageUrl} alt={item.name} />
              <div>
                <span>{item.category}</span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
              <strong>{formatRupiah(item.price)}</strong>
              <button onClick={() => tambahMenu(item)}>Tambah</button>
            </div>
          ))}
        </div>

        <aside className="cart-panel">
          <span className="eyebrow">Keranjang</span>
          {reservasiAktif ? <p>Reservasi aktif: <b>{reservasiAktif.code}</b></p> : <p>Reservasi meja diperlukan sebelum checkout.</p>}
          <div className="cart-items">
            {keranjang.length === 0 ? <em>Belum ada menu dipilih.</em> : keranjang.map((item) => (
              <div key={item.id} className="cart-line">
                <span>{item.name} <small>× {item.qty}</small></span>
                <div>
                  <b>{formatRupiah(Number(item.price) * item.qty)}</b>
                  <button onClick={() => kurangiMenu(item.id)}>−</button>
                </div>
              </div>
            ))}
          </div>
          <div className="promo-hint">{pesanPromo}</div>
          <div className="cart-total"><span>Subtotal</span><strong>{formatRupiah(subtotal)}</strong></div>
          <button className="primary wide" onClick={checkout}>Checkout Pesanan</button>
          {hasilPesanan && (
            <div className="order-result">
              <span>Order {hasilPesanan.code}</span>
              <p>{hasilPesanan.appliedPromo || 'Tidak ada promo aktif.'}</p>
              <strong>{formatRupiah(hasilPesanan.total)}</strong>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
