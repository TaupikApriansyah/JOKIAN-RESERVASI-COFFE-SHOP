import { panggilApi } from './koneksiApi';

export function ambilMenuPublik() {
  return panggilApi('/menu');
}

export function ambilPromoPublik() {
  return panggilApi('/promos');
}

export function ambilMejaTersedia({ tanggal, jam, jumlahTamu, area, durasiMenit }) {
  const query = new URLSearchParams({
    date: tanggal,
    time: jam,
    guests: String(jumlahTamu),
    area,
    durationMinutes: String(durasiMenit || 120),
  });
  return panggilApi(`/tables?${query}`);
}

export function buatReservasi(dataReservasi) {
  return panggilApi('/reservations', {
    method: 'POST',
    body: JSON.stringify(dataReservasi),
  });
}

export function buatPesanan(dataPesanan) {
  return panggilApi('/orders', {
    method: 'POST',
    body: JSON.stringify(dataPesanan),
  });
}
