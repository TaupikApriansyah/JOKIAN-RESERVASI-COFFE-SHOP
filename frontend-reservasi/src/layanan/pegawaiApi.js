import { panggilApi } from './koneksiApi';

export async function ambilDataPegawai(tanggalHariIni, employeeName = '') {
  const employeeParam = employeeName ? `&employeeName=${encodeURIComponent(employeeName)}` : '';
  const orderParam = employeeName ? `?employeeName=${encodeURIComponent(employeeName)}` : '';
  const [reservasi, pesanan, meja] = await Promise.all([
    panggilApi(`/employee/reservations?date=${tanggalHariIni}${employeeParam}`),
    panggilApi(`/employee/orders/today${orderParam}`),
    panggilApi(`/tables?date=${tanggalHariIni}&time=19:00&guests=1`),
  ]);

  return { reservasi, pesanan, meja };
}

export function ubahStatusReservasiPegawai(id, status, actorName = 'Pegawai Dika Coffe Shop') {
  return panggilApi(`/employee/reservations/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, actorName }),
  });
}

export function ubahStatusPesananPegawai(id, status, actorName = 'Pegawai Dika Coffe Shop') {
  return panggilApi(`/employee/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, actorName }),
  });
}
