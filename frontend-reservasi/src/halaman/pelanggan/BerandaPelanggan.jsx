import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, CheckCircle, Coffee, Clock3, Minus, Percent, Plus } from 'lucide-react';
import { formatRupiah } from '../../utilitas/format';

const masukAtas = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: 'easeOut' } },
};

const grupBertahap = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const produkHero = [
  {
    id: 'kopi-latte',
    kategori: 'Coffee',
    nama: 'Dika Coffee Latte',
    judul: 'Find perfect drink',
    subjudul: 'crafted just for you',
    deskripsi: 'Latte lembut dengan espresso pilihan dan foam susu yang halus. Cocok dinikmati setelah reservasi meja berhasil dikonfirmasi.',
    harga: 45000,
    warna: '#10B981',
    warnaGelap: '#047857',
    gambar: '/images/produk-kopi.png',
    label: 'Signature coffee',
  },
  {
    id: 'nasi-goreng',
    kategori: 'Food',
    nama: 'Nasi Goreng Pedas',
    judul: 'Taste authentic',
    subjudul: 'spicy goodness',
    deskripsi: 'Nasi goreng premium dengan telur, sayuran segar, dan bumbu khas BrewVibe untuk pengalaman makan yang lebih lengkap.',
    harga: 35000,
    warna: '#FBBF24',
    warnaGelap: '#B45309',
    gambar: '/images/produk-makanan.png',
    label: 'Food recommendation',
  },
  {
    id: 'roti-bakar',
    kategori: 'Snack',
    nama: 'Roti Bakar Cokelat',
    judul: 'Sweet comfort',
    subjudul: 'in every bite',
    deskripsi: 'Roti bakar renyah dengan topping manis dan tekstur lembut. Pilihan snack yang pas untuk menemani kopi pilihan Anda.',
    harga: 22000,
    warna: '#F87171',
    warnaGelap: '#BE123C',
    gambar: '/images/produk-snack.png',
    label: 'Snack selection',
  },
];

const keunggulan = [
  {
    judul: 'Reservasi Terarah',
    teks: 'Pilih tanggal, jam, jumlah tamu, dan meja yang tersedia sebelum datang ke coffee shop.',
    ikon: Calendar,
  },
  {
    judul: 'Menu Setelah Meja Siap',
    teks: 'Pesanan menu baru dilanjutkan setelah reservasi berhasil dikonfirmasi oleh sistem.',
    ikon: Coffee,
  },
  {
    judul: 'Promo Otomatis',
    teks: 'Diskon dan bonus menu dihitung langsung dari backend sesuai nilai transaksi dan kombinasi pesanan.',
    ikon: Percent,
  },
  {
    judul: 'Operasional Terpantau',
    teks: 'Admin dan pegawai memantau reservasi, pesanan, meja, dan checkout dari workspace internal.',
    ikon: CheckCircle,
  },
];

const alurSingkat = [
  { nomor: '01', judul: 'Pilih Jadwal', teks: 'Tentukan tanggal, jam, dan jumlah tamu sesuai rencana kunjungan.' },
  { nomor: '02', judul: 'Pilih Meja', teks: 'Pilih meja yang tersedia dari denah visual berdasarkan jadwal tersebut.' },
  { nomor: '03', judul: 'Konfirmasi', teks: 'Lengkapi data pemesan agar reservasi tercatat di sistem.' },
  { nomor: '04', judul: 'Pesan Menu', teks: 'Setelah meja terkonfirmasi, pilih menu, cek promo, lalu checkout.' },
];

const produkFallback = [
  {
    id: 'fallback-1',
    name: 'Signature Latte',
    category: 'Coffee',
    price: 38000,
    description: 'Espresso lembut dengan susu segar dan karakter rasa seimbang.',
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'fallback-2',
    name: 'Iced Americano',
    category: 'Coffee',
    price: 32000,
    description: 'Kopi dingin yang ringan, bersih, dan cocok untuk menemani aktivitas.',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-0708ce153359?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'fallback-3',
    name: 'Matcha Cream',
    category: 'Non Coffee',
    price: 42000,
    description: 'Matcha creamy dengan aroma lembut dan tampilan premium.',
    imageUrl: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=600&auto=format&fit=crop',
  },
];

function KartuProdukInteraktif({ item, aktif, pilihProduk }) {
  return (
    <button
      type="button"
      className={`interactive-product-card ${aktif ? 'active' : ''}`}
      style={{ '--warna-produk': item.warna, '--warna-produk-gelap': item.warnaGelap }}
      onClick={() => pilihProduk(item)}
      aria-pressed={aktif}
    >
      <img src={item.gambar} alt={item.nama} />
      <span>{item.kategori}</span>
      <strong>{item.nama}</strong>
      <small>{formatRupiah(item.harga)}</small>
    </button>
  );
}

export default function BerandaPelanggan({ ubahHalaman, menu = [] }) {
  const [produkAktif, setProdukAktif] = useState(produkHero[0]);
  const [jumlah, setJumlah] = useState(2);
  const menuUnggulan = useMemo(() => (menu.length ? menu : produkFallback).slice(0, 3), [menu]);

  const warnaProduk = produkAktif.warna;
  const warnaGelap = produkAktif.warnaGelap;

  return (
    <section className="product-landing" id="home">
      <motion.div
        className="product-hero-shell interactive-hero-shell"
        initial="hidden"
        animate="visible"
        variants={grupBertahap}
        style={{ '--warna-produk': warnaProduk, '--warna-produk-gelap': warnaGelap }}
      >
        <div className="green-blob dynamic-product-shape" aria-hidden="true" />

        <div className="product-hero-content interactive-product-layout">
          <motion.div className="product-copy interactive-product-copy" variants={grupBertahap}>
            <motion.span variants={masukAtas} className="landing-eyebrow">BrewVibe Reservation System</motion.span>
            <AnimatePresence mode="wait">
              <motion.div
                key={produkAktif.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.34, ease: 'easeInOut' }}
              >
                <h1>
                  {produkAktif.judul} <br />
                  <span>{produkAktif.subjudul}</span>
                </h1>
                <strong className="hero-price" style={{ color: warnaProduk }}>
                  {formatRupiah(produkAktif.harga)}
                </strong>
                <p>{produkAktif.deskripsi}</p>
              </motion.div>
            </AnimatePresence>

            <motion.div variants={masukAtas} className="hero-control-row interactive-control-row">
              <div className="guest-counter" aria-label="Jumlah item">
                <button type="button" onClick={() => setJumlah((nilai) => Math.max(1, nilai - 1))}>
                  <Minus size={15} />
                </button>
                <span>{String(jumlah).padStart(2, '0')}</span>
                <button type="button" onClick={() => setJumlah((nilai) => Math.min(99, nilai + 1))}>
                  <Plus size={15} />
                </button>
              </div>
              <button className="green-cta dynamic-cta" onClick={() => ubahHalaman('reservation')}>
                Mulai Reservasi <Calendar size={17} />
              </button>
              <button className="ghost-cta" onClick={() => ubahHalaman('menu')}>
                Lihat Menu <ArrowRight size={17} />
              </button>
            </motion.div>

            <motion.div variants={masukAtas} className="interactive-product-grid" aria-label="Pilih produk unggulan BrewVibe">
              {produkHero.map((item) => (
                <KartuProdukInteraktif
                  key={item.id}
                  item={item}
                  aktif={produkAktif.id === item.id}
                  pilihProduk={setProdukAktif}
                />
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="product-visual-area interactive-showcase-area"
            initial={{ opacity: 0, scale: 0.94, x: 24 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div className="product-image-stage interactive-product-stage">
              <div className="product-image-glow" aria-hidden="true" />
              <AnimatePresence mode="wait">
                <motion.img
                  key={produkAktif.id}
                  className="hero-selected-product"
                  src={produkAktif.gambar}
                  alt={produkAktif.nama}
                  initial={{ opacity: 0, x: 46, scale: 0.82, rotate: -4 }}
                  animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, x: -36, scale: 0.86, rotate: 5 }}
                  transition={{ duration: 0.42, ease: 'easeInOut' }}
                />
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${produkAktif.id}-label`}
                  className="product-card-tag active-product-tag"
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                >
                  <b>{produkAktif.nama}</b>
                  <span>{produkAktif.label}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <section className="why-noir reveal" aria-label="Keunggulan sistem BrewVibe">
        <span className="landing-eyebrow">Why BrewVibe</span>
        <h2>Reservasi meja, pemesanan menu, dan promo dalam satu alur yang rapi.</h2>
        <div className="why-grid-noir">
          {keunggulan.map((item) => (
            <article key={item.judul}>
              <item.ikon size={24} />
              <div>
                <h3>{item.judul}</h3>
                <p>{item.teks}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="opening-panel-noir reveal">
        <div className="opening-content">
          <span className="landing-eyebrow">Jam Operasional</span>
          <h2>Kami siap menyambut kunjungan Anda setiap hari.</h2>
          <p>Reservasi disarankan dilakukan sebelum kedatangan agar meja dapat disiapkan sesuai jadwal dan jumlah tamu.</p>
          <div className="hours-box-noir">
            <span className="hours-icon"><Clock3 size={25} /></span>
            <div>
              <small>Setiap hari</small>
              <b>10.00 – 22.00</b>
            </div>
          </div>
          <button className="green-cta opening-cta" onClick={() => ubahHalaman('reservation')}>Mulai Reservasi <Calendar size={17} /></button>
        </div>
        <div className="opening-visual" aria-hidden="true">
          <div className="opening-soft-shape" />
          <span className="opening-bean opening-bean-one" />
          <span className="opening-bean opening-bean-two" />
          <span className="opening-bean opening-bean-three" />
          <img className="opening-product-cup" src="/images/produk-kopi.png" alt="" />
          <div className="opening-plant">
            <span className="leaf leaf-one" />
            <span className="leaf leaf-two" />
            <span className="leaf leaf-three" />
            <span className="leaf leaf-four" />
            <span className="plant-stem" />
            <span className="plant-pot" />
          </div>
        </div>
      </section>

      <section className="flow-noir reveal">
        <div className="section-title-row compact-title">
          <div>
            <span className="landing-eyebrow">Alur Reservasi</span>
            <h2>Reservasi meja terlebih dahulu, lalu lanjutkan pesanan menu.</h2>
          </div>
          <button className="secondary" onClick={() => ubahHalaman('reservation')}>Mulai dari Meja</button>
        </div>
        <div className="flow-line-noir">
          {alurSingkat.map((item) => (
            <article key={item.nomor}>
              <span>{item.nomor}</span>
              <h3>{item.judul}</h3>
              <p>{item.teks}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="menu-preview-noir reveal" aria-label="Menu unggulan BrewVibe">
        <div className="section-title-row compact-title">
          <div>
            <span className="landing-eyebrow">Menu Preview</span>
            <h2>Pilihan menu tersedia setelah reservasi berhasil dibuat.</h2>
          </div>
          <button className="secondary" onClick={() => ubahHalaman('menu')}>Buka Menu</button>
        </div>
        <div className="menu-line-noir">
          {menuUnggulan.map((item) => (
            <article key={item.id}>
              <img src={item.imageUrl} alt={item.name} />
              <div>
                <span>{item.category}</span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
              <strong>{formatRupiah(item.price)}</strong>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
