import { panggilApi } from './koneksiApi';

export async function ambilDataAdmin() {
  const [dashboard, reservasi, pesanan, meja, menu] = await Promise.all([
    panggilApi('/admin/dashboard'),
    panggilApi('/admin/reservations'),
    panggilApi('/admin/orders/today'),
    panggilApi('/admin/tables'),
    panggilApi('/admin/menu'),
  ]);

  return { dashboard, reservasi, pesanan, meja, menu };
}
