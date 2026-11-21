# Integrasi Aplikasi Surat Pengantar PKL ke Laravel (PHP)

Modul ini memudahkan Anda menghubungkan atau memasang **Aplikasi Surat Pengantar PKL - SMKN 1 FYJ Channel** ke dalam proyek berbasis **Laravel (Laravel 10 / 11)**.

---

## 📁 Struktur File Integrasi

```text
laravel/
├── app/
│   └── Http/
│       └── Controllers/
│           └── SuratPklApiController.php     <-- Controller API Data & Template
├── routes/
│   └── api.php                              <-- Route API Surat PKL
├── resources/
│   └── views/
│       └── surat-pkl.blade.php              <-- Tampilan Blade Terpadu
└── database/
    └── migrations/
        └── 2026_11_21_000000_create_surat_pkl_tables.php <-- Migrasi Database Laravel
```

---

## 🚀 Panduan Pemasangan Cepat

### 1. Salin File Controller & Route
* Salin `laravel/app/Http/Controllers/SuratPklApiController.php` ke folder `app/Http/Controllers/` proyek Laravel Anda.
* Tambahkan rute dari `laravel/routes/api.php` ke file `routes/api.php` proyek Laravel Anda.

### 2. Jalankan Migrasi Database
Jalankan perintah Artisan untuk membuat tabel `data_pkl`, `template_surat`, dan `pengaturan_aplikasi`:
```bash
php artisan migrate
```

### 3. Letakkan Aset Web di Folder `public/`
Salin folder aset aplikasi:
* `assets/` ➔ `public/assets/`
* `js/` ➔ `public/js/`
* Halaman HTML (`index.html`, `template.html`, `pengaturan.html`, `data.html`) dapat diletakkan di `public/surat-pkl/` atau di-render via Blade di `resources/views/surat-pkl.blade.php`.

### 4. Buka di Peramban
Akses melalui rute Laravel:
```text
http://localhost:8000/surat-pkl
```
Semua operasi baca/tulis data siswa, template surat, dan pengaturan otomatis terhubung ke database Laravel (MySQL, PostgreSQL, atau SQLite).
