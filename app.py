#!/usr/bin/env python3
"""
Server Aplikasi Surat Pengantar PKL - SMKN 1 FYJ Channel
Menyajikan antarmuka web dan API pembuatan dokumen DOCX
"""

import os
import sys
import json
import io
import zipfile
import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.parse
from generate_docx import generate_surat_docx, generate_keterangan_docx, load_data
from database import db_manager

PORT = 8000

def get_template_path():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        os.path.join(base_dir, 'assets', 'templates', 'template_clean.docx'),
        os.path.join(base_dir, 'template_clean.docx'),
        'assets/templates/template_clean.docx',
        'template_clean.docx'
    ]
    for c in candidates:
        if c and os.path.exists(c):
            return c
    return 'template_clean.docx'

class PKLRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and disable cache during development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == '/' or path == '/index.html':
            self.path = '/index.html'
            return super().do_GET()

        if path == '/api/db/init':
            try:
                from database.init_db import init_database
                init_database()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True, 'message': 'Database berhasil diinisialisasi ulang.'}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return

        if path == '/api/data':
            try:
                data = db_manager.get_all_records()
                if not data:
                    data = load_data()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return

        if path == '/api/settings':
            try:
                settings = db_manager.get_all_settings()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps(settings, ensure_ascii=False).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return

        if path == '/api/templates':
            try:
                templates = db_manager.get_all_templates()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps(templates, ensure_ascii=False).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return

        if path == '/api/db/download-db':
            db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database', 'surat_pkl.db')
            if os.path.exists(db_path):
                with open(db_path, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/x-sqlite3')
                self.send_header('Content-Disposition', 'attachment; filename="surat_pkl.db"')
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_response(404)
                self.end_headers()
            return

        if path == '/api/db/download-sql':
            sql_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database', 'surat_pkl.sql')
            if os.path.exists(sql_path):
                with open(sql_path, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/sql; charset=utf-8')
                self.send_header('Content-Disposition', 'attachment; filename="surat_pkl.sql"')
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_response(404)
                self.end_headers()
            return

        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length) if content_length > 0 else b''

        if path == '/api/db/init':
            try:
                from database.init_db import init_database
                init_database()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True, 'message': 'Database berhasil diinisialisasi ulang.'}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return

        if path == '/api/db/import':
            try:
                import base64
                req_data = json.loads(body.decode('utf-8'))
                filename = req_data.get('filename', '')
                file_b64 = req_data.get('data', '')
                if ',' in file_b64:
                    file_b64 = file_b64.split(',', 1)[1]
                file_bytes = base64.b64decode(file_b64)

                result = db_manager.restore_database_from_file(file_bytes, filename)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps(result, ensure_ascii=False).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return

        if path == '/api/db/import':
            try:
                import base64
                req_data = json.loads(body.decode('utf-8'))
                filename = req_data.get('filename', '')
                file_b64 = req_data.get('data', '')
                if ',' in file_b64:
                    file_b64 = file_b64.split(',', 1)[1]
                file_bytes = base64.b64decode(file_b64)

                result = db_manager.restore_database_from_file(file_bytes, filename)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps(result, ensure_ascii=False).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return

        if path == '/api/siswa':
            try:
                student_data = json.loads(body.decode('utf-8'))
                new_record = db_manager.add_student_record(student_data)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True, 'record': new_record}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return

        if path == '/api/siswa/update':
            try:
                student_data = json.loads(body.decode('utf-8'))
                success = db_manager.update_student_record(student_data)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': success}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return

        if path == '/api/siswa/delete':
            try:
                req_data = json.loads(body.decode('utf-8'))
                by_id = 'id' in req_data and 'no' not in req_data
                target = req_data.get('id') if by_id else req_data.get('no')
                success = db_manager.delete_student_record(target, by_id=by_id)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': success}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return

        if path == '/api/data':
            try:
                records = json.loads(body.decode('utf-8'))
                count = db_manager.save_all_records(records)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True, 'count': count}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return

        if path == '/api/settings':
            try:
                settings = json.loads(body.decode('utf-8'))
                db_manager.save_settings(settings)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return

        if path == '/api/templates':
            try:
                tpl = json.loads(body.decode('utf-8'))
                db_manager.save_template(tpl)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return

        if path == '/api/templates/delete':
            try:
                req_data = json.loads(body.decode('utf-8'))
                tpl_id = req_data.get('id')
                success = db_manager.delete_template(tpl_id)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': success}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return

        if path == '/api/upload-asset':
            try:
                import base64
                import time
                req_data = json.loads(body.decode('utf-8'))
                asset_type = req_data.get('type')  # 'kop', 'ttd', 'ttd_basah', 'logo'
                data_url = req_data.get('data', '')
                filename = req_data.get('filename', '')

                valid_types = {
                    'kop': 'kopUrl',
                    'ttd': 'ttdUrl',
                    'ttd_basah': 'ttdBasahUrl',
                    'logo': 'logoWebUrl'
                }

                if asset_type not in valid_types:
                    raise ValueError(f"Tipe aset tidak valid: {asset_type}")

                # Tentukan ekstensi file
                ext = '.png'
                if '.' in filename:
                    ext = '.' + filename.rsplit('.', 1)[1].lower()
                elif 'image/jpeg' in data_url or 'image/jpg' in data_url:
                    ext = '.jpg'
                elif 'image/webp' in data_url:
                    ext = '.webp'
                elif 'image/svg+xml' in data_url:
                    ext = '.svg'

                # Ekstrak data base64
                if ',' in data_url:
                    raw_b64 = data_url.split(',', 1)[1]
                else:
                    raw_b64 = data_url
                img_bytes = base64.b64decode(raw_b64)

                # Folder target: assets/images
                base_dir = os.path.dirname(os.path.abspath(__file__))
                images_dir = os.path.join(base_dir, 'assets', 'images')
                os.makedirs(images_dir, exist_ok=True)

                # Hapus file lama jika ada penggantian berkas
                prefix = f"upload_{asset_type}."
                for f_name in os.listdir(images_dir):
                    if f_name.startswith(prefix):
                        try:
                            os.remove(os.path.join(images_dir, f_name))
                            print(f"[OK] File lama dihapus: {f_name}")
                        except Exception as del_err:
                            print(f"[WARN] Gagal menghapus file lama {f_name}: {del_err}")

                # Simpan berkas baru
                new_filename = f"upload_{asset_type}{ext}"
                new_file_path = os.path.join(images_dir, new_filename)
                with open(new_file_path, 'wb') as f:
                    f.write(img_bytes)

                rel_url = f"assets/images/{new_filename}"
                v_url = f"{rel_url}?v={int(time.time())}"

                # Perbarui pengaturan di SQLite Database
                setting_key = valid_types[asset_type]
                db_manager.save_settings({setting_key: rel_url})

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': True,
                    'url': v_url,
                    'rel_path': rel_url,
                    'key': setting_key,
                    'message': f"Berkas {asset_type} berhasil disimpan di {rel_url}."
                }).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return

        if path == '/api/delete-asset':
            try:
                req_data = json.loads(body.decode('utf-8'))
                asset_type = req_data.get('type')

                valid_types = {
                    'kop': 'kopUrl',
                    'ttd': 'ttdUrl',
                    'ttd_basah': 'ttdBasahUrl',
                    'logo': 'logoWebUrl'
                }

                if asset_type in valid_types:
                    base_dir = os.path.dirname(os.path.abspath(__file__))
                    images_dir = os.path.join(base_dir, 'assets', 'images')
                    prefix = f"upload_{asset_type}."
                    if os.path.exists(images_dir):
                        for f_name in os.listdir(images_dir):
                            if f_name.startswith(prefix):
                                try:
                                    os.remove(os.path.join(images_dir, f_name))
                                    print(f"[OK] File dihapus: {f_name}")
                                except Exception as del_err:
                                    print(f"[WARN] Gagal menghapus {f_name}: {del_err}")

                    setting_key = valid_types[asset_type]
                    db_manager.save_settings({setting_key: ''})

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return

        if path == '/api/generate-docx':
            try:
                req_data = json.loads(body.decode('utf-8'))
                template_id = req_data.get('template_id', '')
                doc_type = req_data.get('doc_type', '')

                guru_nama = req_data.get('guru_nama', '')
                guru_nip = req_data.get('guru_nip', '')
                tempat_pkl = req_data.get('tempat_pkl', '')
                students = req_data.get('students', [])
                no_surat = req_data.get('no_surat', 'B.10.000/9546/SMKN1KLK/DIKPORA')
                tgl_surat = req_data.get('tgl_surat', '06 Oktober 2026')
                tgl_pelepasan = req_data.get('tgl_pelepasan', '13 November 2026')
                periode_pkl = req_data.get('periode_pkl', '13 November 2026 sampai dengan 30 April 2027')
                tgl_penarikan = req_data.get('tgl_penarikan', '30 April 2027')
                paragraf_pembuka = req_data.get('paragraf_pembuka')
                paragraf_penutup = req_data.get('paragraf_penutup')
                show_kop = req_data.get('show_kop', True)
                show_ttd = req_data.get('show_ttd', True)
                show_alamat = req_data.get('show_alamat', True)
                paper_size = req_data.get('paper_size', 'f4')
                nama_sekolah = req_data.get('nama_sekolah', 'SMKN 1 FYJ Channel')
                tahun_ajaran = req_data.get('tahun_ajaran', '2026/2027')
                kepsek_nama = req_data.get('kepsek_nama', 'Sri Rejeki, S.Pd., M.Pd.')
                kepsek_pangkat = req_data.get('kepsek_pangkat', 'Pembina (IV/a)')
                kepsek_nip = req_data.get('kepsek_nip', '19770309 200903 2 010')
                alamat_pkl = req_data.get('alamat_pkl', '')

                is_keterangan = (template_id == 'tpl_surat_keterangan_pkl' or doc_type == 'keterangan')

                if is_keterangan:
                    first_student = students[0] if (students and len(students) > 0) else {}
                    siswa_nama = first_student.get('siswa') or first_student.get('nama') or req_data.get('siswa_nama', '')
                    siswa_nis = first_student.get('nis') or req_data.get('siswa_nis', '-')
                    siswa_nisn = first_student.get('nisn') or req_data.get('siswa_nisn', '-')
                    siswa_kelas = first_student.get('kelas') or req_data.get('siswa_kelas', '')
                    siswa_jurusan = first_student.get('jurusan') or req_data.get('siswa_jurusan', '')
                    tempat_pkl_ket = tempat_pkl or first_student.get('tempat', 'Marvella')

                    file_bytes = generate_keterangan_docx(
                        template_path=None,
                        out_path=None,
                        siswa_nama=siswa_nama,
                        siswa_nis=siswa_nis,
                        siswa_nisn=siswa_nisn,
                        siswa_kelas=siswa_kelas,
                        siswa_jurusan=siswa_jurusan,
                        tempat_pkl=tempat_pkl_ket,
                        no_surat=no_surat,
                        tgl_surat=tgl_surat,
                        nama_sekolah=nama_sekolah,
                        kepsek_nama=kepsek_nama,
                        kepsek_pangkat=kepsek_pangkat,
                        kepsek_nip=kepsek_nip,
                        show_kop=show_kop,
                        show_ttd=show_ttd,
                        paper_size=paper_size
                    )
                    safe_name = "".join(c for c in (siswa_nama or 'Siswa') if c.isalnum() or c in (' ', '_')).strip().replace(' ', '_')
                    filename = f"Surat_Keterangan_PKL_{safe_name}.docx"
                else:
                    template_path = get_template_path()
                    file_bytes = generate_surat_docx(
                        template_path=template_path,
                        out_path=None,
                        guru_nama=guru_nama,
                        guru_nip=guru_nip,
                        tempat_pkl=tempat_pkl,
                        students=students,
                        no_surat=no_surat,
                        tgl_surat=tgl_surat,
                        tgl_pelepasan=tgl_pelepasan,
                        periode_pkl=periode_pkl,
                        tgl_penarikan=tgl_penarikan,
                        paragraf_pembuka=paragraf_pembuka,
                        paragraf_penutup=paragraf_penutup,
                        nama_sekolah=nama_sekolah,
                        tahun_ajaran=tahun_ajaran,
                        kepsek_nama=kepsek_nama,
                        kepsek_pangkat=kepsek_pangkat,
                        kepsek_nip=kepsek_nip,
                        alamat_pkl=alamat_pkl,
                        show_kop=show_kop,
                        show_ttd=show_ttd,
                        show_alamat=show_alamat,
                        paper_size=paper_size
                    )
                    safe_name = "".join(c for c in guru_nama if c.isalnum() or c in (' ', '_')).strip().replace(' ', '_')
                    filename = f"Surat_Pengantar_PKL_{safe_name}.docx"

                self.send_response(200)
                self.send_header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                self.send_header('Content-Disposition', f'attachment; filename="{filename}"')
                self.send_header('Content-Length', str(len(file_bytes)))
                self.end_headers()
                self.wfile.write(file_bytes)
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return

        if path == '/api/batch-docx-zip':
            try:
                req_data = json.loads(body.decode('utf-8')) if body else {}
                doc_type = req_data.get('doc_type', '')
                no_surat = req_data.get('no_surat', 'B.10.000/9546/SMKN1KLK/DIKPORA')
                tgl_surat = req_data.get('tgl_surat', '06 Oktober 2026')
                tgl_pelepasan = req_data.get('tgl_pelepasan', '13 November 2026')
                tgl_penarikan = req_data.get('tgl_penarikan', '30 April 2027')
                paragraf_pembuka = req_data.get('paragraf_pembuka')
                paragraf_penutup = req_data.get('paragraf_penutup')
                show_kop = req_data.get('show_kop', True)
                show_ttd = req_data.get('show_ttd', True)
                show_alamat = req_data.get('show_alamat', True)
                paper_size = req_data.get('paper_size', 'f4')
                
                records = req_data.get('records', []) or load_data()
                settings = db_manager.get_all_settings()
                nama_sekolah = req_data.get('nama_sekolah', settings.get('namaSekolah', 'SMKN 1 FYJ Channel'))
                tahun_ajaran = req_data.get('tahun_ajaran', settings.get('tahunAjaran', '2026/2027'))
                periode_pkl = req_data.get('periode_pkl', settings.get('periodePkl', '13 November 2026 sampai dengan 30 April 2027'))
                kepsek_nama = req_data.get('kepsek_nama', settings.get('kepsekNama', 'Sri Rejeki, S.Pd., M.Pd.'))
                kepsek_pangkat = req_data.get('kepsek_pangkat', settings.get('kepsekPangkat', 'Pembina (IV/a)'))
                kepsek_nip = req_data.get('kepsek_nip', settings.get('kepsekNip', '19770309 200903 2 010'))

                zip_buffer = io.BytesIO()

                if doc_type == 'keterangan':
                    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as master_zip:
                        for idx, s in enumerate(records, 1):
                            s_nama = s.get('siswa') or s.get('nama') or f'Siswa_{idx}'
                            s_nis = s.get('nis', '-')
                            s_nisn = s.get('nisn', '-')
                            s_kelas = s.get('kelas', '')
                            s_jurusan = s.get('jurusan', '')
                            s_tempat = s.get('tempat', 'Marvella')

                            doc_bytes = generate_keterangan_docx(
                                template_path=None,
                                out_path=None,
                                siswa_nama=s_nama,
                                siswa_nis=s_nis,
                                siswa_nisn=s_nisn,
                                siswa_kelas=s_kelas,
                                siswa_jurusan=s_jurusan,
                                tempat_pkl=s_tempat,
                                no_surat=no_surat,
                                tgl_surat=tgl_surat,
                                nama_sekolah=nama_sekolah,
                                kepsek_nama=kepsek_nama,
                                kepsek_pangkat=kepsek_pangkat,
                                kepsek_nip=kepsek_nip,
                                show_kop=show_kop,
                                show_ttd=show_ttd,
                                paper_size=paper_size
                            )
                            safe_s = re.sub(r'[^a-zA-Z0-9]', '_', s_nama)
                            master_zip.writestr(f"Surat_Keterangan_{idx:03d}_{safe_s}.docx", doc_bytes)
                else:
                    from collections import defaultdict
                    guru_map = defaultdict(lambda: {'nip': '', 'siswa': []})
                    for r in records:
                        g = r.get('guru', '')
                        guru_map[g]['nip'] = r.get('nip', '')
                        guru_map[g]['siswa'].append(r)

                    template_path = get_template_path()
                    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as master_zip:
                        for idx, (g_name, info) in enumerate(guru_map.items(), 1):
                            tempat_set = set(s.get('tempat', '').strip() for s in info['siswa'] if s.get('tempat', '').strip())
                            is_single_place = len(tempat_set) == 1
                            target_tempat = list(tempat_set)[0] if is_single_place else ''
                            target_alamat = info['siswa'][0].get('alamat', '') if (is_single_place and info['siswa']) else ''

                            doc_bytes = generate_surat_docx(
                                template_path=template_path,
                                out_path=None,
                                guru_nama=g_name,
                                guru_nip=info['nip'],
                                tempat_pkl=target_tempat,
                                students=info['siswa'],
                                no_surat=no_surat,
                                tgl_surat=tgl_surat,
                                tgl_pelepasan=tgl_pelepasan,
                                periode_pkl=periode_pkl,
                                tgl_penarikan=tgl_penarikan,
                                paragraf_pembuka=paragraf_pembuka,
                                paragraf_penutup=paragraf_penutup,
                                nama_sekolah=nama_sekolah,
                                tahun_ajaran=tahun_ajaran,
                                kepsek_nama=kepsek_nama,
                                kepsek_pangkat=kepsek_pangkat,
                                kepsek_nip=kepsek_nip,
                                alamat_pkl=target_alamat,
                                show_kop=show_kop,
                                show_ttd=show_ttd,
                                show_alamat=show_alamat,
                                paper_size=paper_size
                            )
                            safe_g = "".join(c for c in g_name if c.isalnum() or c in (' ', '_')).strip().replace(' ', '_')
                            master_zip.writestr(f"Surat_Pengantar_{idx:02d}_{safe_g}.docx", doc_bytes)

                zip_bytes = zip_buffer.getvalue()
                zip_filename = "Surat_Keterangan_PKL_Arsip.zip" if doc_type == 'keterangan' else "Surat_Pengantar_PKL_Semua_Guru.zip"
                self.send_response(200)
                self.send_header('Content-Type', 'application/zip')
                self.send_header('Content-Disposition', f'attachment; filename="{zip_filename}"')
                self.send_header('Content-Length', str(len(zip_bytes)))
                self.end_headers()
                self.wfile.write(zip_bytes)
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return

        self.send_response(404)
        self.end_headers()

def run_server(port=PORT):
    server_address = ('', port)
    try:
        httpd = HTTPServer(server_address, PKLRequestHandler)
    except OSError:
        port = port + 1
        server_address = ('', port)
        httpd = HTTPServer(server_address, PKLRequestHandler)

    url = f"http://localhost:{port}"
    print(f"=" * 60)
    print(f" Aplikasi Surat Pengantar PKL - SMKN 1 FYJ Channel")
    print(f" Server berjalan di: {url}")
    print(f" Tekan Ctrl+C untuk menghentikan server.")
    print(f"=" * 60)
    
    try:
        webbrowser.open(url)
    except:
        pass
        
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer dimatikan.")
        httpd.server_close()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    run_server(port)

