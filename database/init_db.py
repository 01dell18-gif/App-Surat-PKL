#!/usr/bin/env python3
"""
Script Inisialisasi Database Surat Pengantar PKL
SMKN 1 FYJ Channel
Menghasilkan:
1. database/surat_pkl.db (SQLite 3 Database)
2. database/surat_pkl.sql (SQL Dump Kompatibel SQLite / MySQL / MariaDB)
"""

import os
import sys
import json
import sqlite3
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'database', 'surat_pkl.db')
SQL_PATH = os.path.join(BASE_DIR, 'database', 'surat_pkl.sql')
JSON_PATH = os.path.join(BASE_DIR, 'js', 'data_pkl.json')

DEFAULT_SETTINGS = [
    ('namaSekolah', 'SMKN 1 FYJ Channel', 'lembaga', 'Nama resmi sekolah / instansi'),
    ('subJudulSekolah', 'SMKN 1 FYJ Channel • Tahun Ajaran 2026/2027', 'lembaga', 'Sub-judul sekolah di kop dan header'),
    ('alamatSekolah', 'Jalan Subali II, Banjar Siku, Desa Kamasan Telp. (0366) 23520 Klungkung', 'lembaga', 'Alamat lengkap instansi'),
    ('kepsekNama', 'Sri Rejeki, S.Pd., M.Pd.', 'kepsek', 'Nama lengkap dan gelar Kepala Sekolah'),
    ('kepsekPangkat', 'Pembina (IV/a)', 'kepsek', 'Pangkat dan golongan ruang Kepala Sekolah'),
    ('kepsekNip', '19770309 200903 2 010', 'kepsek', 'Nomor Induk Pegawai (NIP) Kepala Sekolah'),
    ('tahunAjaran', '2026/2027', 'jadwal', 'Tahun ajaran aktif pelaksanaan PKL'),
    ('periodePkl', '13 November 2026 sampai dengan 30 April 2027', 'jadwal', 'Rentang periode PKL'),
    ('tglPelepasan', '13 November 2026', 'jadwal', 'Tanggal pelepasan / pengantaran siswa ke DU/DI'),
    ('tglPenarikan', '30 April 2027', 'jadwal', 'Tanggal penarikan siswa dari DU/DI'),
    ('tglSurat', '06 Oktober 2026', 'jadwal', 'Tanggal penerbitan surat pengantar resmi'),
    ('noSurat', 'B.10.000/9546/SMKN1KLK/DIKPORA', 'jadwal', 'Nomor surat dinas standar'),
    ('kopUrl', '', 'media', 'Path / URL kustom kop surat (kosong = bawaan kop_fyj.png)'),
    ('ttdUrl', '', 'media', 'Path / URL kustom TTD barcode elektronik (kosong = bawaan ttdelektronik.jpg)'),
    ('ttdBasahUrl', '', 'media', 'Path / URL kustom TTD basah (kosong = bawaan ttd_basah.png)'),
    ('logoWebUrl', '', 'media', 'Path / URL kustom logo web aplikasi (kosong = bawaan logo_fyj.png)')
]

DEFAULT_TEMPLATE_HTML = """<p style="margin-bottom: 8px;">Dengan hormat,</p>
<p style="text-indent: 30px; margin-bottom: 8px; text-align: justify;">
  Dalam rangka pelaksanaan kegiatan Praktek Kerja Lapangan (PKL) bagi siswa/siswi {namaSekolah} Tahun Ajaran {tahunAjaran}, bersama ini kami menugaskan guru pembimbing untuk menyerahkan sekaligus mengantarkan siswa/siswi kami melaksanakan PKL di perusahaan/instansi yang Bapak/Ibu pimpin.
</p>
<p style="margin-bottom: 4px;">Adapun identitas Guru Pembimbing yang ditugaskan adalah sebagai berikut:</p>
<table style="width: 100%; margin-left: 20px; margin-bottom: 10px;">
  <tr>
    <td style="width: 130px; vertical-align: top;">Nama</td>
    <td style="width: 20px; vertical-align: top;">:</td>
    <td style="font-weight: bold; vertical-align: top;">{guruNama}</td>
  </tr>
  <tr>
    <td style="vertical-align: top;">NIP</td>
    <td style="vertical-align: top;">:</td>
    <td style="vertical-align: top;">{guruNip}</td>
  </tr>
  <tr>
    <td style="vertical-align: top;">Tempat PKL</td>
    <td style="vertical-align: top;">:</td>
    <td style="font-weight: bold; vertical-align: top;">{tempatPkl}</td>
  </tr>
</table>
<p style="text-indent: 30px; margin-bottom: 8px; text-align: justify;">
  Siswa yang diserahkan berjumlah sebagaimana terlampir, dan kegiatan PKL akan dilaksanakan terhitung mulai tanggal {periodePkl}.
</p>
<p style="text-indent: 30px; margin-bottom: 8px; text-align: justify;">
  Demikian surat pengantar ini kami sampaikan, atas bantuan dan kerja sama yang baik kami ucapkan terima kasih.
</p>"""

TEMPLATE_KETERANGAN_HTML = """<p style="margin-bottom: 8px;">Yang bertanda tangan dibawah ini :</p>
<table style="width: 100%; margin-left: 20px; margin-bottom: 12px; font-size: 11pt;">
  <tr>
    <td style="width: 130px; vertical-align: top;">Nama</td>
    <td style="width: 15px; vertical-align: top;">:</td>
    <td style="font-weight: bold; vertical-align: top;">{kepsekNama}</td>
  </tr>
  <tr>
    <td style="vertical-align: top;">NIP</td>
    <td style="vertical-align: top;">:</td>
    <td style="vertical-align: top;">{kepsekNip}</td>
  </tr>
  <tr>
    <td style="vertical-align: top;">Pangkat/Gol</td>
    <td style="vertical-align: top;">:</td>
    <td style="vertical-align: top;">{kepsekPangkat}</td>
  </tr>
  <tr>
    <td style="vertical-align: top;">Jabatan</td>
    <td style="vertical-align: top;">:</td>
    <td style="vertical-align: top;">Kepala {namaSekolah}</td>
  </tr>
  <tr>
    <td style="vertical-align: top;">Unit Kerja</td>
    <td style="vertical-align: top;">:</td>
    <td style="vertical-align: top;">{namaSekolah}</td>
  </tr>
</table>

<p style="margin-bottom: 8px;">Menerangkan kepada yang tersebut dibawah ini bahwa:</p>
<table style="width: 100%; margin-left: 20px; margin-bottom: 12px; font-size: 11pt;">
  <tr>
    <td style="width: 130px; vertical-align: top;">Nama</td>
    <td style="width: 15px; vertical-align: top;">:</td>
    <td style="font-weight: bold; vertical-align: top;">{siswaNama}</td>
  </tr>
  <tr>
    <td style="vertical-align: top;">Nama</td>
    <td style="width: 15px; vertical-align: top;">:</td>
    <td style="font-weight: bold; vertical-align: top;">{siswaNama}</td>
  </tr>
  <tr>
    <td style="vertical-align: top;">NIS</td>
    <td style="vertical-align: top;">:</td>
    <td style="vertical-align: top;">{siswaNis}</td>
  </tr>
  <tr>
    <td style="vertical-align: top;">NISN</td>
    <td style="vertical-align: top;">:</td>
    <td style="vertical-align: top;">{siswaNisn}</td>
  </tr>
  <tr>
    <td style="vertical-align: top;">Jurusan</td>
    <td style="vertical-align: top;">:</td>
    <td style="vertical-align: top;">{siswaJurusan}</td>
  </tr>
</table>

<p style="text-indent: 30px; margin-bottom: 12px; text-align: justify; line-height: 1.5;">
  Adalah benar telah melaksanakan PKL di <strong>{tempatPkl}</strong> selama 6 bulan dan yang bersangkutan telah melaksanakan tugasnya dengan baik dan penuh penuh tanggung jawab.
</p>

<p style="text-indent: 30px; margin-bottom: 14px; text-align: justify; line-height: 1.5;">
  Demikian Surat Keterangan ini dibuat dengan benar untuk digunakan sebagaimana mestinya.
</p>"""

def escape_sql(val):
    if val is None:
        return "NULL"
    s = str(val).replace("'", "''")
    return f"'{s}'"

def init_database():
    print(f"[*] Menyiapkan direktori database...")
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

    # 1. Load Data Siswa
    records = []
    if os.path.exists(JSON_PATH):
        with open(JSON_PATH, 'r', encoding='utf-8') as f:
            records = json.load(f)
        print(f"[OK] Memuat {len(records)} data siswa dari {JSON_PATH}")
    else:
        print(f"[WARN] File JSON tidak ditemukan di {JSON_PATH}")

    # 2. Buat Database SQLite
    if os.path.exists(DB_PATH):
        try:
            os.remove(DB_PATH)
            print(f"[*] Menghapus database lama: {DB_PATH}")
        except Exception as e:
            print(f"[WARN] Tidak dapat menghapus db lama: {e}")

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # DDL SQLite
    cur.execute("""
    CREATE TABLE IF NOT EXISTS siswa_pkl (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        no_urut INTEGER NOT NULL,
        guru VARCHAR(255) NOT NULL,
        nip VARCHAR(50) DEFAULT '',
        siswa VARCHAR(255) NOT NULL,
        nis VARCHAR(50) DEFAULT '',
        nisn VARCHAR(50) DEFAULT '',
        kelas VARCHAR(50) NOT NULL,
        jurusan VARCHAR(100) DEFAULT '',
        tempat VARCHAR(255) NOT NULL,
        alamat TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS pengaturan (
        kunci VARCHAR(100) PRIMARY KEY,
        nilai TEXT NOT NULL,
        kategori VARCHAR(50) DEFAULT 'umum',
        keterangan TEXT DEFAULT ''
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS template_surat (
        id VARCHAR(100) PRIMARY KEY,
        nama VARCHAR(255) NOT NULL,
        html_content TEXT NOT NULL,
        is_default INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Views
    cur.execute("""
    CREATE VIEW IF NOT EXISTS v_rekap_guru AS
    SELECT 
        guru, 
        nip, 
        COUNT(*) AS total_siswa, 
        GROUP_CONCAT(DISTINCT tempat) AS tempat_pkl_list
    FROM siswa_pkl
    GROUP BY guru, nip;
    """)

    cur.execute("""
    CREATE VIEW IF NOT EXISTS v_rekap_tempat AS
    SELECT 
        tempat, 
        alamat, 
        COUNT(*) AS total_siswa, 
        GROUP_CONCAT(DISTINCT kelas) AS kelas_list
    FROM siswa_pkl
    GROUP BY tempat, alamat;
    """)

    # Insert Data Siswa
    for r in records:
        cur.execute("""
        INSERT INTO siswa_pkl (no_urut, guru, nip, siswa, nis, nisn, kelas, jurusan, tempat, alamat)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            r.get('no', 0),
            r.get('guru', ''),
            r.get('nip', ''),
            r.get('siswa', ''),
            r.get('nis', ''),
            r.get('nisn', ''),
            r.get('kelas', ''),
            r.get('jurusan', ''),
            r.get('tempat', ''),
            r.get('alamat', '')
        ))

    # Insert Pengaturan
    for row in DEFAULT_SETTINGS:
        cur.execute("""
        INSERT OR REPLACE INTO pengaturan (kunci, nilai, kategori, keterangan)
        VALUES (?, ?, ?, ?)
        """, row)

    # Insert Template
    cur.execute("""
    INSERT OR REPLACE INTO template_surat (id, nama, html_content, is_default, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (
        'tpl_standar_resmi',
        'Template Standar Resmi SMKN 1 FYJ Channel',
        DEFAULT_TEMPLATE_HTML.strip(),
        1,
        'active',
        '2026-11-03 12:00:00'
    ))

    cur.execute("""
    INSERT OR REPLACE INTO template_surat (id, nama, html_content, is_default, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (
        'tpl_surat_keterangan_pkl',
        'Surat Keterangan PKL',
        TEMPLATE_KETERANGAN_HTML.strip(),
        0,
        'active',
        '2026-11-04 10:00:00'
    ))

    conn.commit()
    conn.close()
    print(f"[OK] Database SQLite berhasil dibuat: {DB_PATH}")

    # 3. Export ke SQL Dump (Universal: SQLite, MySQL, MariaDB, PostgreSQL)
    sql_lines = []
    sql_lines.append("-- ========================================================")
    sql_lines.append("-- Database Schema & Data: Surat Pengantar PKL")
    sql_lines.append("-- Instansi : SMKN 1 FYJ Channel")
    sql_lines.append(f"-- Dibuat   : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    sql_lines.append("-- Kompatibel: MySQL, MariaDB, PostgreSQL, SQLite")
    sql_lines.append("-- ========================================================\n")
    sql_lines.append("SET FOREIGN_KEY_CHECKS = 0;\n")

    # Table: siswa_pkl
    sql_lines.append("-- --------------------------------------------------------")
    sql_lines.append("-- Struktur Tabel: siswa_pkl")
    sql_lines.append("-- --------------------------------------------------------")
    sql_lines.append("DROP TABLE IF EXISTS `siswa_pkl`;")
    sql_lines.append("""CREATE TABLE `siswa_pkl` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `no_urut` INT NOT NULL DEFAULT 0,
  `guru` VARCHAR(255) NOT NULL,
  `nip` VARCHAR(50) DEFAULT '',
  `siswa` VARCHAR(255) NOT NULL,
  `nis` VARCHAR(50) DEFAULT '',
  `nisn` VARCHAR(50) DEFAULT '',
  `kelas` VARCHAR(50) NOT NULL,
  `jurusan` VARCHAR(100) DEFAULT '',
  `tempat` VARCHAR(255) NOT NULL,
  `alamat` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_guru` (`guru`),
  INDEX `idx_tempat` (`tempat`),
  INDEX `idx_kelas` (`kelas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n""")

    sql_lines.append("-- --------------------------------------------------------")
    sql_lines.append(f"-- Data Siswa PKL ({len(records)} baris)")
    sql_lines.append("-- --------------------------------------------------------")
    sql_lines.append("LOCK TABLES `siswa_pkl` WRITE;")
    if records:
        val_rows = []
        for r in records:
            v_no = r.get('no', 0)
            v_guru = escape_sql(r.get('guru', ''))
            v_nip = escape_sql(r.get('nip', ''))
            v_siswa = escape_sql(r.get('siswa', ''))
            v_nis = escape_sql(r.get('nis', ''))
            v_nisn = escape_sql(r.get('nisn', ''))
            v_kelas = escape_sql(r.get('kelas', ''))
            v_jurusan = escape_sql(r.get('jurusan', ''))
            v_tempat = escape_sql(r.get('tempat', ''))
            v_alamat = escape_sql(r.get('alamat', ''))
            val_rows.append(f"({v_no}, {v_guru}, {v_nip}, {v_siswa}, {v_nis}, {v_nisn}, {v_kelas}, {v_jurusan}, {v_tempat}, {v_alamat})")
        
        # Batch insert by 50 rows
        batch_size = 50
        for i in range(0, len(val_rows), batch_size):
            chunk = val_rows[i:i+batch_size]
            sql_lines.append("INSERT INTO `siswa_pkl` (`no_urut`, `guru`, `nip`, `siswa`, `nis`, `nisn`, `kelas`, `jurusan`, `tempat`, `alamat`) VALUES\n" + ",\n".join(chunk) + ";")
    sql_lines.append("UNLOCK TABLES;\n")

    # Table: pengaturan
    sql_lines.append("-- --------------------------------------------------------")
    sql_lines.append("-- Struktur Tabel: pengaturan")
    sql_lines.append("-- --------------------------------------------------------")
    sql_lines.append("DROP TABLE IF EXISTS `pengaturan`;")
    sql_lines.append("""CREATE TABLE `pengaturan` (
  `kunci` VARCHAR(100) NOT NULL,
  `nilai` MEDIUMTEXT NOT NULL,
  `kategori` VARCHAR(50) DEFAULT 'umum',
  `keterangan` TEXT,
  PRIMARY KEY (`kunci`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n""")

    sql_lines.append("-- Data Pengaturan Lembaga & Aplikasi")
    sql_lines.append("LOCK TABLES `pengaturan` WRITE;")
    setting_vals = []
    for k, v, cat, desc in DEFAULT_SETTINGS:
        setting_vals.append(f"({escape_sql(k)}, {escape_sql(v)}, {escape_sql(cat)}, {escape_sql(desc)})")
    sql_lines.append("INSERT INTO `pengaturan` (`kunci`, `nilai`, `kategori`, `keterangan`) VALUES\n" + ",\n".join(setting_vals) + ";")
    sql_lines.append("UNLOCK TABLES;\n")

    # Table: template_surat
    sql_lines.append("-- --------------------------------------------------------")
    sql_lines.append("-- Struktur Tabel: template_surat")
    sql_lines.append("-- --------------------------------------------------------")
    sql_lines.append("DROP TABLE IF EXISTS `template_surat`;")
    sql_lines.append("""CREATE TABLE `template_surat` (
  `id` VARCHAR(100) NOT NULL,
  `nama` VARCHAR(255) NOT NULL,
  `html_content` MEDIUMTEXT NOT NULL,
  `is_default` TINYINT(1) DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n""")

    sql_lines.append("-- Data Template Surat Resmi")
    sql_lines.append("LOCK TABLES `template_surat` WRITE;")
    sql_lines.append(f"INSERT INTO `template_surat` (`id`, `nama`, `html_content`, `is_default`, `status`) VALUES ('tpl_standar_resmi', 'Template Standar Resmi SMKN 1 FYJ Channel', {escape_sql(DEFAULT_TEMPLATE_HTML.strip())}, 1, 'active');")
    sql_lines.append("UNLOCK TABLES;\n")

    # Views
    sql_lines.append("-- --------------------------------------------------------")
    sql_lines.append("-- View: Rekap Pembimbing & Rekap Tempat PKL")
    sql_lines.append("-- --------------------------------------------------------")
    sql_lines.append("CREATE OR REPLACE VIEW `v_rekap_guru` AS")
    sql_lines.append("SELECT `guru`, `nip`, COUNT(*) AS `total_siswa`, GROUP_CONCAT(DISTINCT `tempat` SEPARATOR ', ') AS `tempat_pkl_list`")
    sql_lines.append("FROM `siswa_pkl` GROUP BY `guru`, `nip`;\n")

    sql_lines.append("CREATE OR REPLACE VIEW `v_rekap_tempat` AS")
    sql_lines.append("SELECT `tempat`, `alamat`, COUNT(*) AS `total_siswa`, GROUP_CONCAT(DISTINCT `kelas` SEPARATOR ', ') AS `kelas_list`")
    sql_lines.append("FROM `siswa_pkl` GROUP BY `tempat`, `alamat`;\n")

    sql_lines.append("SET FOREIGN_KEY_CHECKS = 1;")
    sql_lines.append("-- [SELESAI] Import database selesai dengan sukses.")

    with open(SQL_PATH, 'w', encoding='utf-8') as sf:
        sf.write("\n".join(sql_lines) + "\n")
    print(f"[OK] File SQL Dump berhasil diexport: {SQL_PATH}")

if __name__ == '__main__':
    init_database()

