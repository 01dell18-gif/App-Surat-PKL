# 📋 Aplikasi Surat Pengantar PKL - SMK FYJ Channel

Aplikasi profesional berbasis web, database SQLite/SQL mandiri, dan Python untuk pembuatan, penyesuaian, pencetakan, dan ekspor massal **Surat Pengantar Pembimbing Praktek Kerja Lapangan (PKL)** SMK FYJ Channel.

---

## 🌟 Pembaruan & Fitur Utama (v2.6)

1. **Paket Offline Lengkap di Folder `installers/` (100% Bebas Kuota / Tanpa Internet)**:
   - Folder **`installers/`** berisi seluruh paket instalasi mandiri agar aplikasi dapat langsung dijalankan di komputer mana saja tanpa perlu koneksi internet untuk mengunduh apa pun:
     - 🐍 **`installers/python/`**: Lingkungan Python 3.11.9 Portable Mandiri (*zero install*). Dapat langsung mengeksekusi server aplikasi tanpa perlu hak administrator dan tanpa instalasi sistem.
     - 📦 **`installers/python-3.11.9-amd64.exe`**: Berkas installer resmi Windows untuk komputer yang ingin memasang Python secara permanen.
     - 📦 **`installers/python-3.11.9-embed-amd64.zip`**: Arsip portabel Python lengkap.
     - 🌐 **`installers/web_dependencies/` & `assets/vendor/`**: Berkas penuh pustaka web (*Tailwind CSS, Lucide Icons, JSZip, FileSaver, SheetJS*) sehingga tampilan dan fungsi cetak/ekspor bekerja 100% offline.

2. **File Peluncur Tunggal Anti-Keluar Sendiri (`start.bat`)**:
   - Skrip **`start.bat`** otomatis mendeteksi:
     1. Python Portable di `installers\python\python.exe`.
     2. Python sistem di Windows (`PATH`).
     3. Windows Python Launcher (`py`).
     4. Jika belum ada, otomatis menawarkan pemasangan dari `installers\python-3.11.9-amd64.exe`.
     5. Jika Python tidak ingin dipasang, aplikasi langsung membuka `index.html` di peramban web (100% offline).
   - Dilengkapi proteksi error dan penanganan spasi nama folder sehingga jendela CMD tetap terbuka stabil dan tidak keluar sendiri.

3. **Satu File HTML Utama (`index.html`)**:
   - Hanya ada 1 file antarmuka utama yaitu **`index.html`** pada direktori utama.

4. **Operasi Database CRUD Penuh (Tambah, Edit, Hapus, Import)**:
   - Seluruh perubahan data langsung tersimpan permanen ke basis data **`database/surat_pkl.db`** (SQLite) dan otomatis menyinkronkan berkas dump **`database/surat_pkl.sql`**:
     - ➕ **Tambah Siswa Baru**: Tombol **`+ Tambah Siswa`** di modal database dengan formulir input lengkap dan rekomendasi otomatis guru/tempat PKL.
     - ✏️ **Edit / Perbarui Data**: Tombol ikon pensil di setiap baris tabel untuk mengubah nama siswa, kelas, guru pembimbing, NIP, tempat PKL, dan alamat secara presisi.
     - 🗑️ **Hapus Data**: Tombol ikon tempat sampah dengan konfirmasi nama siswa dan penataan ulang nomor urut otomatis.
     - 📥 **Import Excel**: Unggah file `.xlsx` langsung memasukkan dan menyimpan data ke database SQLite.

5. **Logo Web (`logo_fyj.png`) & Tanda Tangan Basah Otomatis (`ttd_basah.png`)**:
   - Logo default aplikasi menggunakan `logo_fyj.png` (header dan favicon tab).
   - Tanda tangan basah `ttd_basah.png` otomatis digunakan ketika tanda tangan elektronik dimatikan.

---

## 📁 Struktur Direktori & Berkas

```
APP Surat PKL/
├── 📁 installers/                           # Paket installer & dependensi offline
│   ├── 📁 python/                          # Python Portable mandiri (langsung jalan)
│   ├── 📁 web_dependencies/                # Salinan pustaka JS/CSS offline
│   ├── python-3.11.9-amd64.exe             # Installer resmi Windows Python
│   └── python-3.11.9-embed-amd64.zip       # Berkas arsip Python portable
│
├── 📁 database/                            # Basis data aplikasi terpisah
│   ├── surat_pkl.db                        # Database biner SQLite 3 aktif
│   ├── surat_pkl.sql                       # Universal SQL Dump (MySQL, MariaDB, SQLite)
│   ├── db_manager.py                       # Modul Python operasi CRUD database
│   └── init_db.py                          # Skrip inisialisasi / seeder database
│
├── 📁 assets/
│   ├── 📁 vendor/                          # Pustaka offline: Tailwind, Lucide, JSZip, SheetJS
│   ├── 📁 images/                          # Aset gambar resmi (kop, logo, TTD basah, TTD elektronik)
│   └── 📁 templates/                       # Template Microsoft Word dinas (template_clean.docx)
│
├── 📁 js/                                  # Logika frontend, state & embedded base64
│   ├── app.js                              # Logika utama aplikasi, editor, preview & CRUD
│   ├── assets.js                           # Embedded base64 gambar resmi
│   ├── data_pkl.js                         # Dataset 258 siswa PKL (format JS)
│   ├── data_pkl.json                       # Dataset 258 siswa PKL (format JSON)
│   └── template_base64.js                  # Embedded template Word DOCX
│
├── 📁 referensi/                           # Berkas referensi dokumen sumber awal
│   ├── Data_Pembagian_Tugas_PKL.xlsx       # File Excel asli
│   ├── SURAT PENGANTAR PEMBIMBING PKL.docx # File Word asli
│   └── index_pkl_referensi_awal.html       # Cadangan tampilan awal
│
├── 📄 index.html                           # Satu-satunya antarmuka utama aplikasi web
├── ⚙️ app.py                                # Server backend HTTP & REST API CRUD Database
├── 🛠️ generate_docx.py                     # Skrip CLI generator dokumen Word dari DB
├── 🚀 start.bat                            # Peluncur tunggal aplikasi untuk Windows
└── 📖 README.md                            # Dokumentasi lengkap v2.6
```

---

## 🚀 Cara Menjalankan Aplikasi di Perangkat Mana Saja

### Cara 1: Menggunakan Peluncur `start.bat` (Rekomendasi Utama)
Klik dua kali file:
```
start.bat
```
- Skrip akan otomatis memilih Python Portable di folder `installers/` jika komputer belum memiliki Python.
- Jika Python belum ada sama sekali, skrip akan menginstalnya dari folder `installers/` secara offline.
- Peramban web akan otomatis terbuka di `http://localhost:8000`.
- Jendela CMD akan tetap terbuka dan tidak akan langsung menutup.

### Cara 2: Membuka Langsung Tanpa Server (100% Mandiri)
Cukup klik ganda file:
```
index.html
```
Aplikasi akan langsung terbuka di browser Anda (Chrome, Edge, Firefox) dan seluruh fitur pratinjau, pengeditan teks, dan cetak PDF tetap berfungsi normal.
