export default function StatusLabel({ nilai }) {
  const kelas = String(nilai || '').toLowerCase();
  return <span className={`status-pill ${kelas}`}>{nilai || '-'}</span>;
}
