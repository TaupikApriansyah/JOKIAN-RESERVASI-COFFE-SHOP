import { formatRupiah } from '../../utilitas/format';

export default function GrafikRingkas({ judul, data, tipe = 'angka' }) {
  const nilaiTertinggi = Math.max(1, ...data.map((item) => Number(item.nilai || 0)));

  return (
    <section className="grafik-panel">
      <div className="panel-heading">
        <h3>{judul}</h3>
        <span>visual ringkas</span>
      </div>
      <div className="grafik-batang">
        {data.map((item) => {
          const tinggi = Math.max(8, Math.round((Number(item.nilai || 0) / nilaiTertinggi) * 100));
          return (
            <div className="grafik-item" key={item.label}>
              <div className="grafik-kolom" style={{ height: `${tinggi}%` }} />
              <small>{item.label}</small>
              <b>{tipe === 'rupiah' ? formatRupiah(item.nilai) : item.nilai}</b>
            </div>
          );
        })}
      </div>
    </section>
  );
}
