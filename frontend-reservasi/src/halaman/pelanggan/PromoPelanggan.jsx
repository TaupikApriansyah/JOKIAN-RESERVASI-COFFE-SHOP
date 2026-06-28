export default function PromoPelanggan({ promos }) {
  return (
    <section className="section promo-strip reveal">
      <div>
        <span className="eyebrow">Promo aktif</span>
        <h2>Benefit otomatis untuk pesanan tertentu.</h2>
      </div>
      <div className="promo-lines">
        {promos.map((promo) => (
          <article key={promo.title}>
            <b>{promo.badge}</b>
            <h3>{promo.title}</h3>
            <p>{promo.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
