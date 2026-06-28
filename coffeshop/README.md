# BrewVibe Back-End

Spring Boot REST API untuk aplikasi reservasi cafe.

## Akun Demo

- Customer: customer@brewvibe.id / customer123
- Admin: admin@brewvibe.id / admin123
- Pegawai: pegawai@brewvibe.id / pegawai123

## Endpoint Utama

- `POST /api/auth/login`
- `GET /api/menu`
- `GET /api/promos`
- `GET /api/tables`
- `POST /api/reservations`
- `POST /api/orders`
- `GET /api/admin/dashboard`
- `GET /api/admin/tables`
- `POST /api/admin/tables`
- `PUT /api/admin/tables/{id}`
- `DELETE /api/admin/tables/{id}`
- `GET /api/employee/reservations`
- `PUT /api/employee/reservations/{id}/status`
- `GET /api/realtime/stream`

## Database

Gunakan MySQL atau MariaDB. Database default: `brewvibe`.

## Data master meja

Seeder otomatis menjaga data meja menjadi tepat 13 data:

- A1 sampai A5: Indoor, total 5 meja
- B1 sampai B5: Outdoor, total 5 meja
- MR1 sampai MR3: Meeting Room, total 3 ruangan
- Data tersebar pada Lantai 1 dan Lantai 2

Jika database lama masih berisi meja A1 sampai A4 saja, jalankan ulang back-end dari paket ini. Seeder akan merapikan master meja agar menjadi 10 meja reguler dan 3 meeting room.
