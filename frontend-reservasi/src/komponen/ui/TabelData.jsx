export default function TabelData({ judul, kolom, baris }) {
  return (
    <div className="data-section">
      <h3>{judul}</h3>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>{kolom.map((item) => <th key={item}>{item}</th>)}</tr>
          </thead>
          <tbody>
            {baris.length ? baris.map((row, index) => (
              <tr key={index}>{row.map((cell, i) => <td key={i}>{cell}</td>)}</tr>
            )) : (
              <tr><td colSpan={kolom.length}>Belum ada data.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
