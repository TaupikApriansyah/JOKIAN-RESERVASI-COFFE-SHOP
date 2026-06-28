export default function Kosong({ judul, deskripsi, ringkas = false }) {
  return (
    <div className={`empty-workspace ${ringkas ? 'compact' : ''}`}>
      <b>{judul}</b>
      <p>{deskripsi}</p>
    </div>
  );
}
