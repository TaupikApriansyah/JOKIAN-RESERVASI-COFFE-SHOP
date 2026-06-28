# BrewVibe Premium Frontend

Frontend React + Vite untuk aplikasi reservasi cafe. Layout tetap memakai desain lama, tetapi data sudah tersambung ke REST API Spring Boot.

## Cara menjalankan

Pastikan back-end berjalan di `http://localhost:8081`.

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
```

## Akun demo

Customer:
- Email: `customer@brewvibe.id`
- Password: `customer123`

Admin:
- Email: `admin@brewvibe.id`
- Password: `admin123`

Pegawai:
- Email: `pegawai@brewvibe.id`
- Password: `pegawai123`

## Data meja

Step reservasi meja menampilkan semua data secara default:

- 10 meja reguler
- 5 meja Indoor
- 5 meja Outdoor
- 3 Meeting Room
- Lantai 1 dan Lantai 2

Filter lantai dan area tetap tersedia. Pilih `Semua` agar seluruh 13 pilihan muncul.
