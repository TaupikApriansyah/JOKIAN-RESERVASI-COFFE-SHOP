import { panggilApi } from './koneksiApi';

export async function ambilDataAdmin() {
  const [dashboard, reservasi, pesanan, meja, menu, pegawai] = await Promise.all([
    panggilApi('/admin/dashboard'),
    panggilApi('/admin/reservations'),
    panggilApi('/admin/orders/today'),
    panggilApi('/admin/tables'),
    panggilApi('/admin/menu'),
    panggilApi('/admin/employees'),
  ]);

  return { dashboard, reservasi, pesanan, meja, menu, pegawai };
}


export function simpanShiftPegawai(id, dataShift) {
  return panggilApi(`/admin/employees/${id}/shift`, {
    method: 'PUT',
    body: JSON.stringify(dataShift),
  });
}
