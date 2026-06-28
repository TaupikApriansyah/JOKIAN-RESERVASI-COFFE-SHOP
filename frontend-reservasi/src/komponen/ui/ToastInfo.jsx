export default function ToastInfo({ toast, tutup }) {
  if (!toast) return null;

  return (
    <div className={`toast ${toast.tipe || 'info'}`}>
      <div>
        <strong>{toast.judul}</strong>
        <p>{toast.pesan}</p>
      </div>
      <button onClick={tutup}>×</button>
    </div>
  );
}
