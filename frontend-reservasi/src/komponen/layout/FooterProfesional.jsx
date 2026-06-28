export default function FooterProfesional({ bukaLogin }) {
  return (
    <footer className="footer-pro">
      <div>
        <h2>BrewVibe</h2>
        <p>Sistem reservasi digital untuk mengelola meja, pesanan, promo, dan operasional coffee shop secara terhubung melalui Spring Boot dan MySQL.</p>
      </div>
      <div>
        <h3>Layanan</h3>
        <button>Reservasi Meja</button>
        <button>Menu Digital</button>
        <button>Keranjang Pesanan</button>
      </div>
      <div>
        <h3>Operasional</h3>
        <button onClick={() => bukaLogin('pegawai')}>Login Pegawai</button>
        <button onClick={() => bukaLogin('admin')}>Login Admin</button>
        <button>Backend Port 8081</button>
      </div>
      <div>
        <h3>Kontak</h3>
        <p>Jl. Aroma Kopi No. 21<br />Buka 09.00 sampai 22.00<br />support@brewvibe.id</p>
      </div>
      <small>© 2026 BrewVibe Coffee Reservation System. All rights reserved.</small>
    </footer>
  );
}
