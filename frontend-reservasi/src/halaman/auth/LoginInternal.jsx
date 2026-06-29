import { useState } from 'react';
import { loginInternal } from '../../layanan/authApi';

export default function LoginInternal({ mode, tutup, sukses, beriNotifikasi }) {
  const [form, setForm] = useState({
    email: mode === 'admin' ? 'admin@dikacoffeshop.id' : 'pegawai@dikacoffeshop.id',
    password: mode === 'admin' ? 'admin123' : 'pegawai123',
  });
  const [loading, setLoading] = useState(false);

  async function masuk(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const user = await loginInternal(form);
      const roleBenar = mode === 'admin' ? 'ADMIN' : 'PEGAWAI';
      if (user.role !== roleBenar) {
        beriNotifikasi('Akses tidak sesuai', 'Akun ini tidak memiliki izin untuk halaman tersebut.', 'error');
        return;
      }
      sukses(user);
      beriNotifikasi('Login berhasil', `Selamat bekerja, ${user.fullName}.`, 'success');
    } catch (error) {
      beriNotifikasi('Login gagal', error.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <form className="login-panel" onSubmit={masuk}>
        <button type="button" className="modal-close" onClick={tutup}>×</button>
        <span className="eyebrow">Akses internal</span>
        <h2>{mode === 'admin' ? 'Login Admin' : 'Login Pegawai'}</h2>
        <p>Gunakan akun yang terdaftar di backend. Validasi email dan password diproses oleh Spring Boot.</p>

        <label>Email</label>
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="nama@dikacoffeshop.id" />

        <label>Password</label>
        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Masukkan password" />

        <button className="primary wide" disabled={loading}>{loading ? 'Memeriksa...' : 'Masuk ke Workspace'}</button>
      </form>
    </div>
  );
}
