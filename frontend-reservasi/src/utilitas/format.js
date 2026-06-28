export const tanggalHariIni = new Date().toISOString().slice(0, 10);

export function formatRupiah(nilai) {
  return 'Rp ' + Number(nilai || 0).toLocaleString('id-ID');
}

export function potongJam(nilai) {
  return String(nilai || '').slice(0, 5);
}

export function buatCsv(namaFile, baris) {
  const csv = baris
    .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = namaFile;
  link.click();
  URL.revokeObjectURL(url);
}
