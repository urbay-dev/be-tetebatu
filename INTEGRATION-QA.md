# Integrasi Tetebatu

## Tampilan

- Beranda, jelajah, navbar, footer, kartu layanan, dan sidebar pilihan memakai komponen publik yang sudah ada.
- Dashboard mempertahankan banner, sidebar, kartu statistik, grafik area, dan diagram kategori. Grafik kini bersumber dari database; bukan angka contoh.
- Form CRUD layanan disederhanakan menjadi empat langkah. Draf dapat disimpan dari setiap langkah; kontak, harga, jadwal, terjemahan, dan foto dikelola tanpa JSON.
- Biaya layanan 2% dan rating/ulasan contoh dihapus karena tidak didukung brief/backend.

## Integrasi

- Publik: kategori, pencarian, area, pengurutan nama/rekomendasi, pagination, detail, galeri, harga, fasilitas, kontak, artikel, serta halaman tentang desa/platform.
- Kontak WhatsApp memakai pesan otomatis. Tanggal dan jumlah tamu pada sidebar hanya menjadi isi pertanyaan, bukan cek ketersediaan atau pemesanan otomatis.
- Admin: CRUD layanan, gambar, kategori bilingual, area, artikel, konten beranda, dan kata sandi.
- Backend: filter query tervalidasi, rute admin artikel/area tidak lagi tertangkap sebagai slug, dan pembaruan relasi layanan bersifat atomik.
- Grafik dashboard: konten dibuat per hari selama 30 hari menurut WITA serta jumlah layanan per kategori. Belum ada pelacakan visitor/pageview.

## Menjalankan

Backend: `cd backend` lalu `npm run dev` (port 5000).
Frontend: `cd frontend` lalu `npm run dev` (port 5173 jika tersedia).
Frontend memakai `/api` melalui proxy Vite. Pada deployment terpisah, isi `VITE_API_URL` dengan URL API backend sebelum build. Backend memerlukan konfigurasi database, JWT, Supabase Storage, dan origin frontend yang sesuai.

## Verifikasi 19 November 2026

- Build frontend dan backend berhasil.
- `backend/tests/integration-smoke.mjs`: filter publik, pagination tidak valid, proteksi admin, CRUD draf, pengosongan relasi/area, rollback perubahan kontak saat update gagal, unggah foto Supabase, foto utama, hapus foto, CRUD artikel, statistik dashboard. Seluruh pemeriksaan lolos dan data uji dibersihkan.
- `backend/tests/dashboard-read.mts`: 30 titik grafik, nilai tidak negatif, total kategori sama dengan total layanan; lolos.
- Browser: UI publik lama ditampilkan kembali, pencarian menuju direktori, data layanan terbaca, filter restoran menghasilkan keadaan kosong yang benar.
- Data yang sudah ada masih mengandung beberapa foto seed tidak valid dan layanan tanpa kontak/harga. Tidak diisi dengan informasi fiktif; admin perlu melengkapinya.

Untuk menjalankan smoke test, atur `TEST_API_URL` (default `http://127.0.0.1:5002/api/v1`) dan kredensial admin pada environment backend. Test membuat draf unik sementara dan membersihkannya di akhir. Jangan menjalankan bersamaan dengan smoke test lain.
