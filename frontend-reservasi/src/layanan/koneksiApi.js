export const API_DASAR = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

export async function panggilApi(jalur, opsi = {}) {
  const respons = await fetch(`${API_DASAR}${jalur}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(opsi.headers || {}),
    },
    ...opsi,
  });

  const teks = await respons.text();
  const isi = teks ? JSON.parse(teks) : null;

  if (!respons.ok) {
    const pesan = isi?.message || 'Terjadi kendala pada server.';
    const galat = new Error(pesan);
    galat.details = isi?.details || null;
    throw galat;
  }

  return isi;
}
