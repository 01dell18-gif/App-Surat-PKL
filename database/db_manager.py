#!/usr/bin/env python3
"""
Database Manager untuk Aplikasi Surat Pengantar PKL
Menghubungkan aplikasi ke database SQLite (database/surat_pkl.db)
dan menjaga sinkronisasi otomatis dengan database/surat_pkl.sql
"""

import os
import sqlite3
import json
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'database', 'surat_pkl.db')
SQL_PATH = os.path.join(BASE_DIR, 'database', 'surat_pkl.sql')

def ensure_db():
    if not os.path.exists(DB_PATH):
        try:
            from database.init_db import init_database
            init_database()
        except Exception as e:
            print(f"[ERROR] Inisialisasi DB otomatis gagal: {e}")

def get_connection():
    ensure_db()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def escape_sql(val):
    if val is None:
        return "NULL"
    s = str(val).replace("'", "''")
    return f"'{s}'"

def export_sql_dump():
    """Mengekspor kondisi database saat ini ke dalam database/surat_pkl.sql secara otomatis"""
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()

        # Baca seluruh siswa_pkl
        cur.execute("SELECT no_urut, guru, nip, siswa, kelas, tempat, alamat FROM siswa_pkl ORDER BY no_urut ASC, id ASC")
        records = cur.fetchall()

        # Baca pengaturan
        cur.execute("SELECT kunci, nilai, kategori, keterangan FROM pengaturan")
        settings = cur.fetchall()

        # Baca template
        cur.execute("SELECT id, nama, html_content, is_default, status FROM template_surat")
        templates = cur.fetchall()
        conn.close()

        sql_lines = []
        sql_lines.append("-- ========================================================")
        sql_lines.append("-- Database Schema & Data: Surat Pengantar PKL")
        sql_lines.append("-- Instansi : SMKN 1 FYJ Channel")
        sql_lines.append(f"-- Diperbarui : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        sql_lines.append("-- Kompatibel : MySQL, MariaDB, PostgreSQL, SQLite")
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
  `kelas` VARCHAR(50) NOT NULL,
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
                v_no = r['no_urut']
                v_guru = escape_sql(r['guru'])
                v_nip = escape_sql(r['nip'])
                v_siswa = escape_sql(r['siswa'])
                v_kelas = escape_sql(r['kelas'])
                v_tempat = escape_sql(r['tempat'])
                v_alamat = escape_sql(r['alamat'])
                val_rows.append(f"({v_no}, {v_guru}, {v_nip}, {v_siswa}, {v_kelas}, {v_tempat}, {v_alamat})")
            
            batch_size = 50
            for i in range(0, len(val_rows), batch_size):
                chunk = val_rows[i:i+batch_size]
                sql_lines.append("INSERT INTO `siswa_pkl` (`no_urut`, `guru`, `nip`, `siswa`, `kelas`, `tempat`, `alamat`) VALUES\n" + ",\n".join(chunk) + ";")
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
        if settings:
            setting_vals = []
            for r in settings:
                setting_vals.append(f"({escape_sql(r['kunci'])}, {escape_sql(r['nilai'])}, {escape_sql(r['kategori'])}, {escape_sql(r['keterangan'])})")
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
        for t in templates:
            sql_lines.append(f"INSERT INTO `template_surat` (`id`, `nama`, `html_content`, `is_default`, `status`) VALUES ({escape_sql(t['id'])}, {escape_sql(t['nama'])}, {escape_sql(t['html_content'])}, {1 if t['is_default'] else 0}, {escape_sql(t['status'] or 'active')});")
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
        sql_lines.append("-- [SELESAI] Sinkronisasi database selesai.")

        with open(SQL_PATH, 'w', encoding='utf-8') as sf:
            sf.write("\n".join(sql_lines) + "\n")
    except Exception as e:
        print(f"[WARN] Gagal menyinkronkan SQL dump: {e}")

def get_all_records():
    """Mengambil seluruh data siswa PKL dari tabel siswa_pkl"""
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT id, no_urut, guru, nip, siswa, kelas, tempat, alamat FROM siswa_pkl ORDER BY no_urut ASC, id ASC")
        rows = cur.fetchall()
        result = []
        for r in rows:
            result.append({
                'id': r['id'],
                'no': r['no_urut'],
                'guru': r['guru'] or '',
                'nip': r['nip'] or '',
                'siswa': r['siswa'] or '',
                'kelas': r['kelas'] or '',
                'tempat': r['tempat'] or '',
                'alamat': r['alamat'] or ''
            })
        return result
    finally:
        conn.close()

def add_student_record(data):
    """Menambah satu data siswa baru ke tabel siswa_pkl"""
    conn = get_connection()
    try:
        cur = conn.cursor()
        # Ambil max no_urut
        cur.execute("SELECT MAX(no_urut) FROM siswa_pkl")
        row = cur.fetchone()
        max_no = (row[0] or 0) + 1
        no_val = data.get('no') or max_no

        cur.execute("""
        INSERT INTO siswa_pkl (no_urut, guru, nip, siswa, kelas, tempat, alamat)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            no_val,
            data.get('guru', '').strip(),
            data.get('nip', '').strip(),
            data.get('siswa', '').strip(),
            data.get('kelas', '').strip(),
            data.get('tempat', '').strip(),
            data.get('alamat', '').strip()
        ))
        new_id = cur.lastrowid
        conn.commit()

        export_sql_dump()
        return {
            'id': new_id,
            'no': no_val,
            'guru': data.get('guru', '').strip(),
            'nip': data.get('nip', '').strip(),
            'siswa': data.get('siswa', '').strip(),
            'kelas': data.get('kelas', '').strip(),
            'tempat': data.get('tempat', '').strip(),
            'alamat': data.get('alamat', '').strip()
        }
    finally:
        conn.close()

def update_student_record(data):
    """Memperbarui data siswa pada tabel siswa_pkl berdasarkan no_urut atau id"""
    conn = get_connection()
    try:
        cur = conn.cursor()
        no_val = data.get('no')
        id_val = data.get('id')

        if id_val:
            cur.execute("""
            UPDATE siswa_pkl
            SET guru = ?, nip = ?, siswa = ?, kelas = ?, tempat = ?, alamat = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """, (
                data.get('guru', '').strip(),
                data.get('nip', '').strip(),
                data.get('siswa', '').strip(),
                data.get('kelas', '').strip(),
                data.get('tempat', '').strip(),
                data.get('alamat', '').strip(),
                id_val
            ))
        elif no_val:
            cur.execute("""
            UPDATE siswa_pkl
            SET guru = ?, nip = ?, siswa = ?, kelas = ?, tempat = ?, alamat = ?, updated_at = CURRENT_TIMESTAMP
            WHERE no_urut = ?
            """, (
                data.get('guru', '').strip(),
                data.get('nip', '').strip(),
                data.get('siswa', '').strip(),
                data.get('kelas', '').strip(),
                data.get('tempat', '').strip(),
                data.get('alamat', '').strip(),
                no_val
            ))
        conn.commit()
        export_sql_dump()
        return True
    finally:
        conn.close()

def delete_student_record(no_or_id, by_id=False):
    """Menghapus data siswa dari tabel siswa_pkl dan menata ulang nomor urut"""
    conn = get_connection()
    try:
        cur = conn.cursor()
        if by_id:
            cur.execute("DELETE FROM siswa_pkl WHERE id = ?", (no_or_id,))
        else:
            cur.execute("DELETE FROM siswa_pkl WHERE no_urut = ?", (no_or_id,))
        
        # Resequence no_urut agar tetap berurutan
        cur.execute("SELECT id FROM siswa_pkl ORDER BY no_urut ASC, id ASC")
        rows = cur.fetchall()
        for idx, r in enumerate(rows, 1):
            cur.execute("UPDATE siswa_pkl SET no_urut = ? WHERE id = ?", (idx, r['id']))
        
        conn.commit()
        export_sql_dump()
        return True
    finally:
        conn.close()

def save_all_records(records):
    """Menyimpan seluruh data siswa PKL (replace all) ke tabel siswa_pkl"""
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM siswa_pkl")
        for idx, r in enumerate(records, 1):
            no_val = r.get('no', idx)
            cur.execute("""
            INSERT INTO siswa_pkl (no_urut, guru, nip, siswa, kelas, tempat, alamat)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                no_val,
                r.get('guru', ''),
                r.get('nip', ''),
                r.get('siswa', ''),
                r.get('kelas', ''),
                r.get('tempat', ''),
                r.get('alamat', '')
            ))
        conn.commit()
        export_sql_dump()
        return len(records)
    finally:
        conn.close()

def get_all_settings():
    """Mengambil semua pengaturan aplikasi dari tabel pengaturan"""
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT kunci, nilai, kategori, keterangan FROM pengaturan")
        rows = cur.fetchall()
        settings = {}
        for r in rows:
            settings[r['kunci']] = r['nilai']
        return settings
    finally:
        conn.close()

def save_settings(settings_dict):
    """Menyimpan atau memperbarui pengaturan aplikasi"""
    conn = get_connection()
    try:
        cur = conn.cursor()
        for k, v in settings_dict.items():
            cur.execute("""
            INSERT INTO pengaturan (kunci, nilai) VALUES (?, ?)
            ON CONFLICT(kunci) DO UPDATE SET nilai=excluded.nilai
            """, (k, str(v) if v is not None else ''))
        conn.commit()
        export_sql_dump()
        return True
    finally:
        conn.close()

def get_all_templates():
    """Mengambil seluruh template surat dari tabel template_surat"""
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT id, nama, html_content, is_default, status, created_at FROM template_surat ORDER BY is_default DESC, created_at ASC")
        rows = cur.fetchall()
        result = []
        for r in rows:
            result.append({
                'id': r['id'],
                'name': r['nama'],
                'htmlContent': r['html_content'],
                'isDefault': bool(r['is_default']),
                'status': r['status'] or 'active',
                'createdAt': str(r['created_at'])[:10]
            })
        return result
    finally:
        conn.close()

def save_template(tpl):
    """Menyimpan atau memperbarui template surat"""
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("""
        INSERT INTO template_surat (id, nama, html_content, is_default, status)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            nama=excluded.nama,
            html_content=excluded.html_content,
            is_default=excluded.is_default,
            status=excluded.status,
            updated_at=CURRENT_TIMESTAMP
        """, (
            tpl.get('id'),
            tpl.get('name') or tpl.get('nama'),
            tpl.get('htmlContent') or tpl.get('html_content'),
            1 if tpl.get('isDefault') else 0,
            tpl.get('status', 'active')
        ))
        conn.commit()
        export_sql_dump()
        return True
    finally:
        conn.close()

def delete_template(tpl_id):
    """Menghapus template surat dari database"""
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM template_surat WHERE id = ?", (tpl_id,))
        conn.commit()
        export_sql_dump()
        return cur.rowcount > 0
    finally:
        conn.close()
