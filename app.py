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
from generate_docx import generate_surat_docx, load_data
from database import db_manager

PORT = 8000

def get_template_path():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        os.path.join(base_dir, 'assets', 'templates', 'template_clean.docx'),
        os.path.join(base_dir, 'template_clean.docx'),
        'assets/templates/template_clean.docx',
        'template_clean.docx',
        os.path.join(base_dir, 'referensi', 'SURAT PENGANTAR PEMBIMBING PKL.docx'),
        os.path.join(base_dir, 'SURAT PENGANTAR PEMBIMBING PKL.docx'),
        'referensi/SURAT PENGANTAR PEMBIMBING PKL.docx'
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

        if path == '/api/generate-docx':
            try:
                req_data = json.loads(body.decode('utf-8'))
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
                    nama_sekolah=req_data.get('nama_sekolah', 'SMKN 1 FYJ Channel'),
                    tahun_ajaran=req_data.get('tahun_ajaran', '2026/2027'),
                    kepsek_nama=req_data.get('kepsek_nama', 'Sri Rejeki, S.Pd., M.Pd.'),
                    kepsek_nip=req_data.get('kepsek_nip', '19770309 200903 2 010'),
                    alamat_pkl=req_data.get('alamat_pkl', '')
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
                no_surat = req_data.get('no_surat', 'B.10.000/9546/SMKN1KLK/DIKPORA')
                tgl_surat = req_data.get('tgl_surat', '06 Oktober 2026')
                tgl_pelepasan = req_data.get('tgl_pelepasan', '13 November 2026')
                tgl_penarikan = req_data.get('tgl_penarikan', '30 April 2027')
                paragraf_pembuka = req_data.get('paragraf_pembuka')
                paragraf_penutup = req_data.get('paragraf_penutup')
                
                records = req_data.get('records', []) or load_data()
                
                # Group by guru
                from collections import defaultdict
                guru_map = defaultdict(lambda: {'nip': '', 'siswa': []})
                for r in records:
                    g = r.get('guru', '')
                    guru_map[g]['nip'] = r.get('nip', '')
                    guru_map[g]['siswa'].append(r)

                zip_buffer = io.BytesIO()
                template_path = get_template_path()
                
                settings = db_manager.get_all_settings()
                nama_sekolah = req_data.get('nama_sekolah', settings.get('namaSekolah', 'SMKN 1 FYJ Channel'))
                tahun_ajaran = req_data.get('tahun_ajaran', settings.get('tahunAjaran', '2026/2027'))
                periode_pkl = req_data.get('periode_pkl', settings.get('periodePkl', '13 November 2026 sampai dengan 30 April 2027'))
                kepsek_nama = req_data.get('kepsek_nama', settings.get('kepsekNama', 'Sri Rejeki, S.Pd., M.Pd.'))
                kepsek_nip = req_data.get('kepsek_nip', settings.get('kepsekNip', '19770309 200903 2 010'))

                with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as master_zip:
                    for idx, (g_name, info) in enumerate(guru_map.items(), 1):
                        tempat_set = set(s.get('tempat', '').strip() for s in info['siswa'] if s.get('tempat', '').strip())
                        target_tempat = list(tempat_set)[0] if len(tempat_set) == 1 else ''
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
                            kepsek_nip=kepsek_nip
                        )
                        safe_g = "".join(c for c in g_name if c.isalnum() or c in (' ', '_')).strip().replace(' ', '_')
                        master_zip.writestr(f"Surat_Pengantar_{idx:02d}_{safe_g}.docx", doc_bytes)

                zip_bytes = zip_buffer.getvalue()
                self.send_response(200)
                self.send_header('Content-Type', 'application/zip')
                self.send_header('Content-Disposition', 'attachment; filename="Surat_Pengantar_PKL_Semua_Guru.zip"')
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

