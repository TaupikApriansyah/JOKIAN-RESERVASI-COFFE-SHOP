import { panggilApi } from './koneksiApi';

export async function ambilDataPegawai(tanggalHariIni) {
  const [reservasi, pesanan, meja] = await Promise.all([
    panggilApi(`/employee/reservations?date=${tanggalHariIni}`),
    panggilApi('/employee/orders/today'),
    panggilApi(`/tables?date=${tanggalHariIni}&time=19:00&guests=1`),
  ]);

  return { reservasi, pesanan, meja };
}

export function ubahStatusReservasiPegawai(id, status) {
  return panggilApi(`/employee/reservations/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export function ubahStatusPesananPegawai(id, status) {
  return panggilApi(`/employee/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}
