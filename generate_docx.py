def get_jurusan_from_kelas(kelas):
    if not kelas:
        return ''
    k = str(kelas).upper().strip()
    if 'BD' in k:
        return 'Bisnis Digital'
    if 'DKV' in k:
        return 'Desain Komunikasi Visual'
    if 'AK' in k:
        return 'Akuntansi dan Keuangan Lembaga'
    if 'LPKKK' in k or 'LPK' in k:
        return 'Layanan Perbankan Syariah'
    if 'LPB' in k:
        return 'Layanan Perbankan'
    if 'MP' in k:
        return 'Manajemen Perkantoran'
    if 'TKJ' in k:
        return 'Teknik Komputer dan Jaringan'
    if 'TSM' in k:
        return 'Teknik Sepeda Motor'
    return ''

#!/usr/bin/env python3
"""
Generator Surat Pengantar Pembimbing PKL
SMKN 1 FYJ Channel
Menggunakan data dari database/surat_pkl.db / data_pkl.json
Template: template_clean.docx
"""

import os
import sys
import io
import json
import copy
import zipfile
import argparse
import xml.etree.ElementTree as ET
from collections import defaultdict
try:
    from PIL import Image, ImageDraw, ImageFont
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

NS = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
}

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

def create_ttd_elektronik_bytes(nama_sekolah="SMKN 1 FYJ Channel", kepsek_nama="Sri Rejeki, S.Pd., M.Pd.", kepsek_pangkat="Pembina (IV/a)", kepsek_nip="19770309 200903 2 010"):
    """Menghasilkan berkas gambar JPEG TTD Elektronik dinamis sesuai sekolah & kepala sekolah."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    fallback_p = os.path.join(base_dir, 'assets', 'images', 'ttdelektronik.jpg')

    if not HAS_PIL:
        if os.path.exists(fallback_p):
            with open(fallback_p, 'rb') as f:
                return f.read()
        return None
    try:
        width, height = 850, 256
        im = Image.new('RGB', (width, height), color=(255, 255, 255))
        draw = ImageDraw.Draw(im)
        
        # Outer border
        draw.rectangle([(2, 2), (width - 3, height - 3)], outline=(120, 120, 120), width=3)
        
        # Logo Bali
        logo_path = os.path.join(base_dir, 'assets', 'images', 'logo_bali.png')
        if os.path.exists(logo_path):
            logo = Image.open(logo_path)
            logo = logo.resize((195, 198), Image.Resampling.LANCZOS)
            im.paste(logo, (35, 28))
            
        font_regular = None
        font_bold = None
        for font_p in ['C:/Windows/Fonts/arial.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf']:
            if os.path.exists(font_p):
                font_regular = ImageFont.truetype(font_p, 20)
                break
        for font_p in ['C:/Windows/Fonts/arialbd.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf']:
            if os.path.exists(font_p):
                font_bold = ImageFont.truetype(font_p, 23)
                break
                
        if not font_regular:
            font_regular = ImageFont.load_default()
        if not font_bold:
            font_bold = font_regular
            
        x_text = 255
        y = 25
        
        # Line 1: Header
        text_hdr = 'Ditandatangani secara elektronik oleh :'
        draw.text((x_text, y), text_hdr, fill=(30, 30, 30), font=font_regular)
        bbox = draw.textbbox((x_text, y), text_hdr, font=font_regular)
        draw.line([(x_text, bbox[3] + 2), (bbox[2], bbox[3] + 2)], fill=(30, 30, 30), width=1)
        
        # Line 2: KEPALA [SEKOLAH]
        y += 34
        draw.text((x_text, y), f'KEPALA {nama_sekolah.upper()}', fill=(0, 0, 0), font=font_bold)
        
        # Line 3: Nama Kepala Sekolah
        y += 38
        draw.text((x_text, y), kepsek_nama, fill=(0, 0, 0), font=font_bold)
        
        # Line 4: Pangkat
        y += 37
        draw.text((x_text, y), kepsek_pangkat, fill=(40, 40, 40), font=font_regular)
        
        # Line 5: NIP
        y += 35
        draw.text((x_text, y), f'NIP. {kepsek_nip}', fill=(40, 40, 40), font=font_regular)
        
        buf = io.BytesIO()
        im.save(buf, format='JPEG', quality=95)
        return buf.getvalue()
    except Exception as e:
        print('[WARN] Gagal membuat gambar TTD dinamis:', e)
        if os.path.exists(fallback_p):
            with open(fallback_p, 'rb') as f:
                return f.read()
        return None

def load_data(excel_path='Data_Pembagian_Tugas_PKL.xlsx', json_path='data_pkl.json'):
    base_dir = os.path.dirname(os.path.abspath(__file__))

    # 1. Prioritas Utama: Baca dari Database SQLite
    db_candidates = [
        os.path.join(base_dir, 'database', 'surat_pkl.db'),
        'database/surat_pkl.db',
        'surat_pkl.db'
    ]
    for db_p in db_candidates:
        if db_p and os.path.exists(db_p):
            try:
                import sqlite3
                conn = sqlite3.connect(db_p)
                cur = conn.cursor()
                cur.execute("SELECT no_urut, guru, nip, siswa, kelas, tempat, alamat FROM siswa_pkl ORDER BY no_urut ASC, id ASC")
                rows = cur.fetchall()
                conn.close()
                if rows:
                    records = []
                    for r in rows:
                        records.append({
                            'no': r[0],
                            'guru': r[1] or '',
                            'nip': r[2] or '',
                            'siswa': r[3] or '',
                            'kelas': r[4] or '',
                            'tempat': r[5] or '',
                            'alamat': r[6] or ''
                        })
                    return records
            except Exception:
                pass

    # 2. Prioritas Kedua: Baca dari JSON File
    json_candidates = [
        json_path,
        os.path.join(base_dir, 'js', 'data_pkl.json'),
        os.path.join(base_dir, 'data_pkl.json'),
        'js/data_pkl.json'
    ]
    for p in json_candidates:
        if p and os.path.exists(p):
            with open(p, 'r', encoding='utf-8') as f:
                return json.load(f)

    excel_candidates = [
        excel_path,
        os.path.join(base_dir, 'Data_Pembagian_Tugas_PKL.xlsx')
    ]
    for p in excel_candidates:
        if p and os.path.exists(p):
            import xml.etree.ElementTree as ET_XLSX
            with zipfile.ZipFile(p, 'r') as z:
                shared_strings = []
                if 'xl/sharedStrings.xml' in z.namelist():
                    root = ET_XLSX.fromstring(z.read('xl/sharedStrings.xml'))
                    for si in root.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
                        text = ''.join(t.text for t in si.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') if t.text)
                        shared_strings.append(text)
                sheet1_root = ET_XLSX.fromstring(z.read('xl/worksheets/sheet1.xml'))
                rows = sheet1_root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row')
                records = []
                for idx, r in enumerate(rows):
                    if idx == 0: continue
                    row_dict = {}
                    for c in r.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                        col = ''.join(filter(str.isalpha, c.get('r')))
                        t = c.get('t')
                        v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                        val = v.text if v is not None else ''
                        if t == 's' and val:
                            val = shared_strings[int(val)]
                        row_dict[col] = val.strip()
                    records.append({
                        'no': int(row_dict.get('A', idx)),
                        'guru': row_dict.get('B', '').strip(),
                        'nip': row_dict.get('C', '').strip(),
                        'siswa': row_dict.get('D', '').strip(),
                        'kelas': row_dict.get('E', '').strip(),
                        'tempat': row_dict.get('F', '').strip(),
                        'alamat': row_dict.get('G', '').strip()
                    })
                return records
    raise FileNotFoundError("Data file not found!")

def clean_fld_paragraph(p, field_name, new_value):
    """Replaces a MERGEFIELD construct inside a paragraph with new_value and removes mergefield tags."""
    p_text = ''.join(p.itertext())
    if field_name not in p_text:
        return False

    # Check if there are fldChar elements
    fld_chars = p.findall('.//w:fldChar', NS)
    instr_texts = p.findall('.//w:instrText', NS)
    
    # Remove all fldChar and instrText
    for r in list(p):
        for fc in r.findall('w:fldChar', NS):
            r.remove(fc)
        for it in r.findall('w:instrText', NS):
            r.remove(it)

    # In paragraph, find run containing the old value or set to new_value
    # Specifically:
    if field_name == 'MERGEFIELD Tempat_PKL':
        # Replace the entire text of paragraph's text runs with new_value
        runs = p.findall('w:r', NS)
        if runs:
            # clear all text except first
            for r in runs:
                for t in r.findall('w:t', NS):
                    t.text = ''
            t0 = runs[0].find('w:t', NS)
            if t0 is None:
                t0 = ET.SubElement(runs[0], f'{{{NS["w"]}}}t')
            t0.text = new_value
    elif field_name == 'MERGEFIELD Nama_Guru':
        # Text before was 'Nama ' followed by tab and ': '
        # Find runs after ': '
        found_colon = False
        runs = p.findall('w:r', NS)
        for r in runs:
            for t in r.findall('w:t', NS):
                if ':' in (t.text or ''):
                    found_colon = True
                    continue
                if found_colon:
                    t.text = ''
        if runs:
            # append new run or set last run
            last_r = runs[-1]
            t_last = last_r.find('w:t', NS)
            if t_last is None:
                t_last = ET.SubElement(last_r, f'{{{NS["w"]}}}t')
            t_last.text = new_value
    elif field_name == 'MERGEFIELD NIP':
        found_colon = False
        runs = p.findall('w:r', NS)
        for r in runs:
            for t in r.findall('w:t', NS):
                if ':' in (t.text or ''):
                    found_colon = True
                    continue
                if found_colon:
                    t.text = ''
        if runs:
            last_r = runs[-1]
            t_last = last_r.find('w:t', NS)
            if t_last is None:
                t_last = ET.SubElement(last_r, f'{{{NS["w"]}}}t')
            t_last.text = new_value
    return True

def set_p_text(p, text, bold=False, underline=False, font_size=24, indent="5103"):
    """Helper untuk mengatur teks, font, ukuran, tebal, garis bawah, dan indent pada paragraph w:p."""
    if p is None:
        return
    pPr = p.find(f'{{{NS["w"]}}}pPr')
    if pPr is None:
        pPr = ET.SubElement(p, f'{{{NS["w"]}}}pPr')
    
    # Indent
    ind = pPr.find(f'{{{NS["w"]}}}ind')
    if ind is None:
        ind = ET.SubElement(pPr, f'{{{NS["w"]}}}ind')
    ind.set(f'{{{NS["w"]}}}left', str(indent))
    
    # Spacing
    sp = pPr.find(f'{{{NS["w"]}}}spacing')
    if sp is None:
        sp = ET.SubElement(pPr, f'{{{NS["w"]}}}spacing')
    sp.set(f'{{{NS["w"]}}}after', '0')

    # Remove all existing runs & mergefield remnants
    for r in list(p.findall(f'{{{NS["w"]}}}r')):
        p.remove(r)
    for fc in list(p.findall(f'.//{{{NS["w"]}}}fldChar')):
        try: p.remove(fc)
        except: pass
    for it in list(p.findall(f'.//{{{NS["w"]}}}instrText')):
        try: p.remove(it)
        except: pass

    if not text:
        return

    r = ET.SubElement(p, f'{{{NS["w"]}}}r')
    rPr = ET.SubElement(r, f'{{{NS["w"]}}}rPr')
    rf = ET.SubElement(rPr, f'{{{NS["w"]}}}rFonts')
    rf.set(f'{{{NS["w"]}}}ascii', 'Bookman Old Style')
    rf.set(f'{{{NS["w"]}}}eastAsia', 'Bookman Old Style')
    rf.set(f'{{{NS["w"]}}}hAnsi', 'Bookman Old Style')
    rf.set(f'{{{NS["w"]}}}cs', 'Bookman Old Style')
    sz = ET.SubElement(rPr, f'{{{NS["w"]}}}sz')
    sz.set(f'{{{NS["w"]}}}val', str(font_size))
    szCs = ET.SubElement(rPr, f'{{{NS["w"]}}}szCs')
    szCs.set(f'{{{NS["w"]}}}val', str(font_size))

    if bold:
        ET.SubElement(rPr, f'{{{NS["w"]}}}b')
    if underline:
        u = ET.SubElement(rPr, f'{{{NS["w"]}}}u')
        u.set(f'{{{NS["w"]}}}val', 'single')

    t = ET.SubElement(r, f'{{{NS["w"]}}}t')
    t.text = str(text)

def create_table_row(template_row, no, nama, kelas, tempat):
    new_tr = copy.deepcopy(template_row)
    tcs = new_tr.findall('w:tc', NS)
    
    def set_cell_text(tc, text):
        p = tc.find(f'{{{NS["w"]}}}p')
        if p is None:
            p = ET.SubElement(tc, f'{{{NS["w"]}}}p')
        existing_rPr = p.find(f'.//{{{NS["w"]}}}rPr')
        for child in list(p):
            if child.tag != f'{{{NS["w"]}}}pPr':
                p.remove(child)
        new_r = ET.SubElement(p, f'{{{NS["w"]}}}r')
        if existing_rPr is not None:
            new_r.append(copy.deepcopy(existing_rPr))
        else:
            rPr = ET.SubElement(new_r, f'{{{NS["w"]}}}rPr')
            rf = ET.SubElement(rPr, f'{{{NS["w"]}}}rFonts')
            rf.set(f'{{{NS["w"]}}}ascii', 'Bookman Old Style')
            rf.set(f'{{{NS["w"]}}}hAnsi', 'Bookman Old Style')
            sz = ET.SubElement(rPr, f'{{{NS["w"]}}}sz')
            sz.set(f'{{{NS["w"]}}}val', '22')
        t = ET.SubElement(new_r, f'{{{NS["w"]}}}t')
        t.text = str(text)
    
    if len(tcs) >= 4:
        set_cell_text(tcs[0], str(no))
        set_cell_text(tcs[1], nama)
        set_cell_text(tcs[2], kelas)
        set_cell_text(tcs[3], tempat)
        
    return new_tr

def generate_surat_docx(template_path=None, out_path=None, guru_nama="", guru_nip="", tempat_pkl="", students=None, 
                        no_surat="B.10.000/9546/SMKN1KLK/DIKPORA", 
                        tgl_surat="06 Oktober 2026",
                        tgl_pelepasan="13 November 2026",
                        periode_pkl="13 November 2026 sampai dengan 30 April 2027",
                        tgl_penarikan="30 April 2027",
                        paragraf_pembuka=None,
                        paragraf_penutup=None,
                        nama_sekolah="SMKN 1 FYJ Channel",
                        tahun_ajaran="2026/2027",
                        kepsek_nama="Sri Rejeki, S.Pd., M.Pd.",
                        kepsek_pangkat="Pembina (IV/a)",
                        kepsek_nip="19770309 200903 2 010",
                        alamat_pkl="",
                        show_kop=True,
                        show_ttd=True,
                        show_alamat=True,
                        paper_size="f4"):
    
    if students is None:
        students = []

    if not template_path or not os.path.exists(template_path):
        template_path = get_template_path()

    with zipfile.ZipFile(template_path, 'r') as zin:
        doc_xml_bytes = zin.read('word/document.xml')
        
    root = ET.fromstring(doc_xml_bytes)
    body = root.find('w:body', NS)
    
    # 0. Sesuaikan Ukuran Kertas (Folio / F4 vs A4) pada Section Properties (w:sectPr)
    sectPr = body.find(f'{{{NS["w"]}}}sectPr') if body is not None else None
    if sectPr is not None:
        pgSz = sectPr.find(f'{{{NS["w"]}}}pgSz')
        if pgSz is None:
            pgSz = ET.SubElement(sectPr, f'{{{NS["w"]}}}pgSz')
        if paper_size and paper_size.lower() == 'a4':
            # Ukuran Internasional A4: 210mm x 297mm (11906 x 16838 twips)
            pgSz.set(f'{{{NS["w"]}}}w', '11906')
            pgSz.set(f'{{{NS["w"]}}}h', '16838')
        else:
            # Ukuran Folio / F4 Standar Indonesia: 215mm x 330mm (12242 x 18722 twips)
            pgSz.set(f'{{{NS["w"]}}}w', '12242')
            pgSz.set(f'{{{NS["w"]}}}h', '18722')

    # 1. Sesuaikan Opsi Tampilan Kop Surat: Jika unchecked (show_kop=False), hapus paragraf kop
    if not show_kop and body is not None:
        body_p_list = body.findall(f'{{{NS["w"]}}}p')
        if body_p_list:
            # Paragraf 0 adalah gambar kop (memiliki w:drawing)
            p0 = body_p_list[0]
            if p0.findall(f'.//{{{NS["w"]}}}drawing'):
                body.remove(p0)

    # Process paragraphs
    p_to_remove = []
    p_alamat_to_insert = []  # list of (target_p, new_p)

    for p in root.findall('.//w:p', NS):
        text = ''.join(p.itertext()).strip()
        
        # 1. Nomor Surat
        if 'B.10.000/9546/SMKN1KLK/DIKPORA' in text:
            for t in p.findall('.//w:t', NS):
                if 'B.10.000/9546/SMKN1KLK/DIKPORA' in (t.text or ''):
                    t.text = t.text.replace('B.10.000/9546/SMKN1KLK/DIKPORA', no_surat)
                    
        # 2. Tujuan DU/DI (Tempat_PKL & Alamat)
        if 'MERGEFIELD Tempat_PKL' in text and 'di' not in text and 'No' not in text:
            if tempat_pkl:
                clean_fld_paragraph(p, 'MERGEFIELD Tempat_PKL', tempat_pkl)
                if show_alamat and alamat_pkl and alamat_pkl.strip():
                    addr_p = ET.Element(f'{{{NS["w"]}}}p')
                    pPr = ET.SubElement(addr_p, f'{{{NS["w"]}}}pPr')
                    sp = ET.SubElement(pPr, f'{{{NS["w"]}}}spacing')
                    sp.set(f'{{{NS["w"]}}}after', '0')
                    ind = ET.SubElement(pPr, f'{{{NS["w"]}}}ind')
                    ind.set(f'{{{NS["w"]}}}left', '709')
                    jc = ET.SubElement(pPr, f'{{{NS["w"]}}}jc')
                    jc.set(f'{{{NS["w"]}}}val', 'both')
                    rPr_p = ET.SubElement(pPr, f'{{{NS["w"]}}}rPr')
                    rf_p = ET.SubElement(rPr_p, f'{{{NS["w"]}}}rFonts')
                    rf_p.set(f'{{{NS["w"]}}}ascii', 'Bookman Old Style')
                    rf_p.set(f'{{{NS["w"]}}}eastAsia', 'Bookman Old Style')
                    rf_p.set(f'{{{NS["w"]}}}hAnsi', 'Bookman Old Style')
                    rf_p.set(f'{{{NS["w"]}}}cs', 'Bookman Old Style')
                    sz_p = ET.SubElement(rPr_p, f'{{{NS["w"]}}}sz')
                    sz_p.set(f'{{{NS["w"]}}}val', '21')

                    r = ET.SubElement(addr_p, f'{{{NS["w"]}}}r')
                    rPr = ET.SubElement(r, f'{{{NS["w"]}}}rPr')
                    rf = ET.SubElement(rPr, f'{{{NS["w"]}}}rFonts')
                    rf.set(f'{{{NS["w"]}}}ascii', 'Bookman Old Style')
                    rf.set(f'{{{NS["w"]}}}eastAsia', 'Bookman Old Style')
                    rf.set(f'{{{NS["w"]}}}hAnsi', 'Bookman Old Style')
                    rf.set(f'{{{NS["w"]}}}cs', 'Bookman Old Style')
                    sz = ET.SubElement(rPr, f'{{{NS["w"]}}}sz')
                    sz.set(f'{{{NS["w"]}}}val', '21')
                    t = ET.SubElement(r, f'{{{NS["w"]}}}t')
                    t.text = alamat_pkl.strip()
                    p_alamat_to_insert.append((p, addr_p))
            else:
                # Sesuai pratinjau web: hilangkan baris tujuan dudi jika Semua Lokasi PKL dipilih
                if body is not None and p in list(body):
                    p_to_remove.append(p)
            
        # 3. Identitas Guru: Nama
        if 'MERGEFIELD Nama_Guru' in text:
            clean_fld_paragraph(p, 'MERGEFIELD Nama_Guru', guru_nama)
            
        # 4. Identitas Guru: NIP
        if 'MERGEFIELD NIP' in text:
            clean_fld_paragraph(p, 'MERGEFIELD NIP', guru_nip if guru_nip else '-')
            
        # 5. Tanggal Surat (Klungkung, ...)
        if 'Klungkung' in text and 'SMK' not in text and 'Nomor' not in text:
            for t in p.findall('.//w:t', NS):
                if 'Klungkung' in (t.text or ''):
                    t.text = f'Klungkung, {tgl_surat}'
                elif ',' in (t.text or '') or ' ' in (t.text or ''):
                    t.text = ''
                    
        # 6. Tanggal Pelepasan
        if 'Pelepasan siswa/siswi' in text:
            for t in p.findall('.//w:t', NS):
                if '13 November 2026' in (t.text or ''):
                    t.text = t.text.replace('13 November 2026', tgl_pelepasan)

        # 7. Periode PKL & Monitoring
        if 'Pelaksanaan & Monitoring PKL' in text:
            for t in p.findall('.//w:t', NS):
                if '13 November 2026 sampai dengan 30 April 2027' in (t.text or ''):
                    t.text = t.text.replace('13 November 2026 sampai dengan 30 April 2027', periode_pkl)
                    
        # 8. Tanggal Penarikan
        if 'Penarikan siswa' in text:
            for t in p.findall('.//w:t', NS):
                if '30 April 2027' in (t.text or ''):
                    t.text = t.text.replace('30 April 2027', tgl_penarikan)

        # 9. Nama Sekolah & Tahun Ajaran
        if 'SMK Negeri 1 Klungkung' in text:
            for t in p.findall('.//w:t', NS):
                if 'SMK Negeri 1 Klungkung' in (t.text or ''):
                    t.text = t.text.replace('SMK Negeri 1 Klungkung', nama_sekolah)
        if '2026/2027' in text and tahun_ajaran:
            for t in p.findall('.//w:t', NS):
                if '2026/2027' in (t.text or ''):
                    t.text = t.text.replace('2026/2027', tahun_ajaran)

        # 10. Data Kepala Sekolah
        if 'Sri Rejeki, S.Pd., M.Pd.' in text and kepsek_nama:
            for t in p.findall('.//w:t', NS):
                if 'Sri Rejeki, S.Pd., M.Pd.' in (t.text or ''):
                    t.text = t.text.replace('Sri Rejeki, S.Pd., M.Pd.', kepsek_nama)
        if '19770309 200903 2 010' in text and kepsek_nip:
            for t in p.findall('.//w:t', NS):
                if '19770309 200903 2 010' in (t.text or ''):
                    t.text = t.text.replace('19770309 200903 2 010', kepsek_nip)

        # 11. Custom Paragraf Pembuka
        if paragraf_pembuka and 'Dalam rangka pelaksanaan kegiatan' in text:
            t_elems = p.findall('.//w:t', NS)
            if t_elems:
                t_elems[0].text = paragraf_pembuka
                for t in t_elems[1:]:
                    t.text = ''

        # 12. Custom Paragraf Penutup
        if paragraf_penutup and 'Daftar nama siswa/siswi peserta' in text:
            t_elems = p.findall('.//w:t', NS)
            if t_elems:
                t_elems[0].text = paragraf_penutup
                for t in t_elems[1:]:
                    t.text = ''

    # Insert alamat paragraph if queued
    for target_p, new_p in p_alamat_to_insert:
        try:
            body_list = list(body)
            p_idx = body_list.index(target_p)
            body.insert(p_idx + 1, new_p)
        except Exception:
            pass

    # Remove paragraphs queued for deletion (e.g. Tempat_PKL when multi-location)
    for p in p_to_remove:
        try:
            body.remove(p)
        except:
            pass

    # 13. Atur Tanda Tangan: TTD Elektronik vs TTD Basah
    # Cari paragraf signature (yang memuat gambar rId10) dan 3 paragraf setelahnya di body
    if body is not None:
        body_children = list(body)
        sig_idx = -1
        for idx, child in enumerate(body_children):
            if child.tag == f'{{{NS["w"]}}}p':
                for blip in child.findall('.//{http://schemas.openxmlformats.org/drawingml/2006/main}blip'):
                    if 'rId10' in str(blip.attrib.values()):
                        sig_idx = idx
                        break
            if sig_idx != -1:
                break

        if sig_idx != -1 and len(body_children) > sig_idx + 3:
            p_nama = body_children[sig_idx + 1]
            p_pangkat = body_children[sig_idx + 2]
            p_nip = body_children[sig_idx + 3]

            if not show_ttd:
                # TTD Basah: tampilkan Nama lengkap bergaris bawah tebal, Pangkat, dan NIP
                set_p_text(p_nama, kepsek_nama, bold=True, underline=True, font_size=24, indent="5103")
                set_p_text(p_pangkat, kepsek_pangkat, bold=False, underline=False, font_size=22, indent="5103")
                set_p_text(p_nip, f"NIP. {kepsek_nip}", bold=False, underline=False, font_size=22, indent="5103")
            else:
                # TTD Elektronik: kosongkan teks di bawah gambar agar tidak redundan (sudah tercantum dalam kotak QR)
                set_p_text(p_nama, "")
                set_p_text(p_pangkat, "")
                set_p_text(p_nip, "")

    # Process Lampiran 2 Table
    tbl = root.find('.//w:tbl', NS)
    if tbl is not None:
        rows = tbl.findall('w:tr', NS)
        if len(rows) > 1:
            template_row = rows[1]
            tbl.remove(template_row)
            
            for idx, s in enumerate(students, 1):
                new_row = create_table_row(
                    template_row, 
                    idx, 
                    s.get('nama', s.get('siswa', '')), 
                    s.get('kelas', ''), 
                    s.get('tempat', '')
                )
                tbl.append(new_row)

    new_doc_xml = ET.tostring(root, encoding='utf-8', xml_declaration=True)
    
    # Cek apakah ada berkas kustom hasil upload pengguna di assets/images/
    base_dir = os.path.dirname(os.path.abspath(__file__))
    images_dir = os.path.join(base_dir, 'assets', 'images')
    custom_kop_bytes = None
    custom_ttd_bytes = None
    custom_ttd_basah_bytes = None

    if os.path.exists(images_dir):
        for f_name in os.listdir(images_dir):
            if f_name.startswith('upload_kop.'):
                try:
                    with open(os.path.join(images_dir, f_name), 'rb') as kf:
                        custom_kop_bytes = kf.read()
                    break
                except Exception as e:
                    print('[WARN] Gagal membaca custom kop:', e)
        for f_name in os.listdir(images_dir):
            if f_name.startswith('upload_ttd.'):
                try:
                    with open(os.path.join(images_dir, f_name), 'rb') as tf:
                        custom_ttd_bytes = tf.read()
                    break
                except Exception as e:
                    print('[WARN] Gagal membaca custom ttd:', e)
        for f_name in os.listdir(images_dir):
            if f_name.startswith('upload_ttd_basah.'):
                try:
                    with open(os.path.join(images_dir, f_name), 'rb') as bf:
                        custom_ttd_basah_bytes = bf.read()
                    break
                except Exception as e:
                    print('[WARN] Gagal membaca custom ttd basah:', e)

    # Tentukan bytes untuk gambar TTD (image3.png)
    if show_ttd:
        if custom_ttd_bytes:
            ttd_final_bytes = custom_ttd_bytes
        else:
            ttd_final_bytes = create_ttd_elektronik_bytes(
                nama_sekolah=nama_sekolah,
                kepsek_nama=kepsek_nama,
                kepsek_pangkat=kepsek_pangkat,
                kepsek_nip=kepsek_nip
            )
    else:
        if custom_ttd_basah_bytes:
            ttd_final_bytes = custom_ttd_basah_bytes
        else:
            basah_path = os.path.join(images_dir, 'ttd_basah.png')
            if os.path.exists(basah_path):
                with open(basah_path, 'rb') as bf:
                    ttd_final_bytes = bf.read()
            else:
                ttd_final_bytes = None

    def write_zip_contents(zin, zout):
        for item in zin.infolist():
            if item.filename == 'word/document.xml':
                zout.writestr(item, new_doc_xml)
            elif item.filename in ('word/media/image1.jpg', 'word/media/image2.jpeg'):
                if show_kop and custom_kop_bytes:
                    zout.writestr(item, custom_kop_bytes)
                elif show_kop:
                    kop_fyj_file = os.path.join(images_dir, 'kop_fyj.png')
                    if os.path.exists(kop_fyj_file):
                        with open(kop_fyj_file, 'rb') as kf:
                            zout.writestr(item, kf.read())
                    else:
                        zout.writestr(item, zin.read(item.filename))
                else:
                    zout.writestr(item, b'')
            elif item.filename == 'word/media/image3.png':
                if ttd_final_bytes:
                    zout.writestr(item, ttd_final_bytes)
                else:
                    zout.writestr(item, zin.read(item.filename))
            else:
                zout.writestr(item, zin.read(item.filename))
    
    if out_path:
        os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
        with zipfile.ZipFile(template_path, 'r') as zin:
            with zipfile.ZipFile(out_path, 'w', zipfile.ZIP_DEFLATED) as zout:
                write_zip_contents(zin, zout)
        print(f"[OK] Surat tersimpan: {out_path} ({len(students)} siswa)")
        return out_path
    else:
        mem_buffer = io.BytesIO()
        with zipfile.ZipFile(template_path, 'r') as zin:
            with zipfile.ZipFile(mem_buffer, 'w', zipfile.ZIP_DEFLATED) as zout:
                write_zip_contents(zin, zout)
        mem_buffer.seek(0)
        return mem_buffer.getvalue()

def generate_keterangan_docx(template_path=None, out_path=None, siswa_nama="", siswa_nis="-", siswa_nisn="-", siswa_kelas="", siswa_jurusan="", tempat_pkl="", no_surat="B.10.429.1/8464/SMKN1KLK/DIKPORA", tgl_surat="07 Oktober 2026",
                             nama_sekolah="SMKN 1 FYJ Channel", kepsek_nama="Sri Rejeki, S.Pd., M.Pd.",
                             kepsek_pangkat="Pembina (IV/a)", kepsek_nip="19770309 200903 2 010",
                             show_kop=True, show_ttd=True, paper_size="f4"):
    """Menghasilkan berkas Word DOCX Surat Keterangan PKL sesuai Contoh Surat Keterangan PKL.docx."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        template_path,
        os.path.join(base_dir, 'assets', 'templates', 'template_keterangan_clean.docx'),
        os.path.join(base_dir, 'assets', 'templates', 'template_keterangan.docx'),
        os.path.join(base_dir, 'Contoh Surat Keterangan PKL.docx'),
        'assets/templates/template_keterangan.docx',
        'Contoh Surat Keterangan PKL.docx'
    ]
    actual_tpl = None
    for c in candidates:
        if c and os.path.exists(c):
            actual_tpl = c
            break

    if not actual_tpl:
        raise FileNotFoundError("Template Surat Keterangan PKL tidak ditemukan.")

    with zipfile.ZipFile(actual_tpl, 'r') as zin:
        xml_content = zin.read('word/document.xml')
        all_files = {name: zin.read(name) for name in zin.namelist()}

    root = ET.fromstring(xml_content)
    body = root.find(f'{{{NS["w"]}}}body')

    # Update paper size
    for sectPr in root.iter(f'{{{NS["w"]}}}sectPr'):
        pgSz = sectPr.find(f'{{{NS["w"]}}}pgSz')
        if pgSz is not None:
            if paper_size == 'a4':
                pgSz.set(f'{{{NS["w"]}}}w', '11906')
                pgSz.set(f'{{{NS["w"]}}}h', '16838')
            else:
                pgSz.set(f'{{{NS["w"]}}}w', '12189')
                pgSz.set(f'{{{NS["w"]}}}h', '18709')

    # Check Kop visibility
    if not show_kop and body is not None:
        p_list = body.findall(f'{{{NS["w"]}}}p')
        if p_list and p_list[0].findall(f'.//{{{NS["w"]}}}drawing'):
            body.remove(p_list[0])

    # Check TTD visibility
    if not show_ttd and body is not None:
        for p in list(body.findall(f'{{{NS["w"]}}}p')):
            if p.findall(f'.//{{{NS["w"]}}}drawing'):
                body.remove(p)

    # Inject dynamic custom Kop image if available
    try:
        from database import db_manager
        db_settings = db_manager.get_all_settings()
        kop_url = db_settings.get('kopUrl', '')
        if kop_url and 'word/media/image1.png' in all_files:
            import base64
            if kop_url.startswith('data:image/'):
                all_files['word/media/image1.png'] = base64.b64decode(kop_url.split(',', 1)[1])
            elif os.path.exists(os.path.join(base_dir, kop_url)):
                with open(os.path.join(base_dir, kop_url), 'rb') as kf:
                    all_files['word/media/image1.png'] = kf.read()
        elif show_kop and 'word/media/image1.png' in all_files:
            default_kop_file = os.path.join(base_dir, 'assets', 'images', 'kop_fyj.png')
            if os.path.exists(default_kop_file):
                with open(default_kop_file, 'rb') as kf:
                    all_files['word/media/image1.png'] = kf.read()
    except Exception as img_err:
        print(f"[WARN] Gagal menyisipkan kustom kop: {img_err}")

    # Process paragraphs
    for p in root.findall('.//w:p', NS):
        text = ''.join(p.itertext()).strip()

        # Nomor Surat
        if 'B.10.429.1' in text or 'B.10.000' in text or ('Nomor:' in text and 'SURAT' not in text):
            for t in p.findall('.//w:t', NS):
                if 'B.10.429.1/8464/SMKN1KLK/DIKPORA' in (t.text or ''):
                    t.text = t.text.replace('B.10.429.1/8464/SMKN1KLK/DIKPORA', no_surat)
                elif 'B.10.000/9546/SMKN1KLK/DIKPORA' in (t.text or ''):
                    t.text = t.text.replace('B.10.000/9546/SMKN1KLK/DIKPORA', no_surat)

        # Identitas Kepala Sekolah
        if 'Sri Rejeki' in text and kepsek_nama:
            for t in p.findall('.//w:t', NS):
                if 'Sri Rejeki' in (t.text or ''):
                    t.text = kepsek_nama
        if '19770309 200903 2 010' in text and kepsek_nip:
            for t in p.findall('.//w:t', NS):
                if '19770309 200903 2 010' in (t.text or ''):
                    t.text = kepsek_nip
        if ('Pembina, IV.a' in text or 'Pembina (IV/a)' in text) and kepsek_pangkat:
            for t in p.findall('.//w:t', NS):
                if 'Pembina, IV.a' in (t.text or '') or 'Pembina (IV/a)' in (t.text or ''):
                    t.text = f':  {kepsek_pangkat}'
        if 'SMK Negeri 1 Klungkung' in text and nama_sekolah:
            for t in p.findall('.//w:t', NS):
                if 'SMK Negeri 1 Klungkung' in (t.text or ''):
                    t.text = t.text.replace('SMK Negeri 1 Klungkung', nama_sekolah)

        # Identitas Siswa
        if text.startswith('Nama:') and 'Sri' not in text and siswa_nama:
            r = ET.SubElement(p, f'{{{NS["w"]}}}r')
            rPr = ET.SubElement(r, f'{{{NS["w"]}}}rPr')
            rf = ET.SubElement(rPr, f'{{{NS["w"]}}}rFonts')
            rf.set(f'{{{NS["w"]}}}ascii', 'Bookman Old Style')
            b = ET.SubElement(rPr, f'{{{NS["w"]}}}b')
            sz = ET.SubElement(rPr, f'{{{NS["w"]}}}sz')
            sz.set(f'{{{NS["w"]}}}val', '24')
            t = ET.SubElement(r, f'{{{NS["w"]}}}t')
            t.text = f' {siswa_nama}'

        if text.startswith('NIS:'):
            r = ET.SubElement(p, f'{{{NS["w"]}}}r')
            rPr = ET.SubElement(r, f'{{{NS["w"]}}}rPr')
            rf = ET.SubElement(rPr, f'{{{NS["w"]}}}rFonts')
            rf.set(f'{{{NS["w"]}}}ascii', 'Bookman Old Style')
            sz = ET.SubElement(rPr, f'{{{NS["w"]}}}sz')
            sz.set(f'{{{NS["w"]}}}val', '24')
            t = ET.SubElement(r, f'{{{NS["w"]}}}t')
            nis_val = siswa_nis if (siswa_nis and siswa_nis != '-') else ''
            nisn_val = siswa_nisn if (siswa_nisn and siswa_nisn != '-') else ''
            if nis_val and nisn_val:
                t.text = f' {nis_val} / NISN: {nisn_val}'
            elif nis_val:
                t.text = f' {nis_val}'
            elif nisn_val:
                t.text = f' NISN: {nisn_val}'
            else:
                t.text = ' -'

        jur_val = siswa_jurusan if (siswa_jurusan and siswa_jurusan != "-") else (get_jurusan_from_kelas(siswa_kelas) or siswa_kelas)
        if text.startswith('Jurusan:') and jur_val:
            r = ET.SubElement(p, f'{{{NS["w"]}}}r')
            rPr = ET.SubElement(r, f'{{{NS["w"]}}}rPr')
            rf = ET.SubElement(rPr, f'{{{NS["w"]}}}rFonts')
            rf.set(f'{{{NS["w"]}}}ascii', 'Bookman Old Style')
            sz = ET.SubElement(rPr, f'{{{NS["w"]}}}sz')
            sz.set(f'{{{NS["w"]}}}val', '24')
            t = ET.SubElement(r, f'{{{NS["w"]}}}t')
            t.text = f' {jur_val}'

        # Tempat PKL
        if 'Marvella' in text and tempat_pkl:
            for t in p.findall('.//w:t', NS):
                if 'Marvella' in (t.text or ''):
                    t.text = t.text.replace('Marvella', tempat_pkl)

        # Tanggal Surat
        if 'Pada Tanggal' in text and tgl_surat:
            for t in p.findall('.//w:t', NS):
                if 'Oktober' in (t.text or '') or '202' in (t.text or ''):
                    t.text = ''
            t0 = p.find('.//w:t', NS)
            if t0 is not None:
                t0.text = f'Pada Tanggal {tgl_surat}'

    all_files['word/document.xml'] = ET.tostring(root, encoding='utf-8')

    out_buffer = io.BytesIO()
    with zipfile.ZipFile(out_buffer, 'w', zipfile.ZIP_DEFLATED) as zout:
        for name, data in all_files.items():
            zout.writestr(name, data)

    file_bytes = out_buffer.getvalue()

    if out_path:
        with open(out_path, 'wb') as f:
            f.write(file_bytes)
        print(f"[OK] Surat Keterangan PKL berhasil dibuat: {out_path}")

    return file_bytes

def main():
    parser = argparse.ArgumentParser(description="Generator Surat Pengantar PKL SMKN 1 FYJ Channel")
    parser.add_argument('--template', default='template_clean.docx', help='Path ke file template Word')
    parser.add_argument('--outdir', default='hasil_surat_docx', help='Folder output file docx')
    parser.add_argument('--mode', choices=['per-du-di', 'per-guru'], default='per-guru', help='Mode pembuatan surat')
    parser.add_argument('--no-surat', default='B.10.000/9546/SMKN1KLK/DIKPORA', help='Nomor surat')
    parser.add_argument('--tgl-surat', default='06 Oktober 2026', help='Tanggal surat')
    parser.add_argument('--tgl-pelepasan', default='13 November 2026', help='Tanggal pelepasan')
    parser.add_argument('--tgl-penarikan', default='30 April 2027', help='Tanggal penarikan')
    args = parser.parse_args()

    records = load_data()
    print(f"Data dimuat: {len(records)} baris siswa.")

    resolved_template = None
    template_candidates = [
        args.template,
        os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'templates', 'template_clean.docx'),
        os.path.join(os.path.dirname(os.path.abspath(__file__)), 'template_clean.docx'),
        'assets/templates/template_clean.docx',
        'template_clean.docx'
    ]
    for tc in template_candidates:
        if tc and os.path.exists(tc):
            resolved_template = tc
            break

    if not resolved_template:
        print(f"Error: Template {args.template} tidak ditemukan.")
        return
    args.template = resolved_template

    if args.mode == 'per-guru':
        # Group by guru
        guru_map = defaultdict(lambda: {'nip': '', 'siswa': []})
        for r in records:
            g = r['guru']
            guru_map[g]['nip'] = r['nip']
            guru_map[g]['siswa'].append(r)
            
        print(f"Membuat {len(guru_map)} surat pengantar berdasarkan Guru Pembimbing...")
        for g_name, info in guru_map.items():
            tempat_set = set(s['tempat'] for s in info['siswa'] if s.get('tempat'))
            tempat_val = list(tempat_set)[0] if len(tempat_set) == 1 else ''
            safe_name = "".join(c for c in g_name if c.isalnum() or c in (' ', '_', '-')).strip().replace(' ', '_')
            out_file = os.path.join(args.outdir, f"Surat_Pengantar_{safe_name}.docx")
            generate_surat_docx(
                template_path=args.template,
                out_path=out_file,
                guru_nama=g_name,
                guru_nip=info['nip'],
                tempat_pkl=tempat_val,
                students=info['siswa'],
                no_surat=args.no_surat,
                tgl_surat=args.tgl_surat,
                tgl_pelepasan=args.tgl_pelepasan,
                tgl_penarikan=args.tgl_penarikan
            )
    else:
        # Group by Tempat PKL + Guru
        du_di_map = defaultdict(lambda: defaultdict(list))
        for r in records:
            du_di_map[r['tempat']][r['guru']].append(r)
            
        print(f"Membuat surat pengantar berdasarkan DU/DI & Guru...")
        for t_name, gurus in du_di_map.items():
            for g_name, s_list in gurus.items():
                safe_t = "".join(c for c in t_name if c.isalnum() or c in (' ', '_', '-')).strip().replace(' ', '_')[:30]
                safe_g = "".join(c for c in g_name if c.isalnum() or c in (' ', '_', '-')).strip().replace(' ', '_')[:30]
                out_file = os.path.join(args.outdir, f"Surat_{safe_t}_{safe_g}.docx")
                generate_surat_docx(
                    template_path=args.template,
                    out_path=out_file,
                    guru_nama=g_name,
                    guru_nip=s_list[0]['nip'],
                    tempat_pkl=t_name,
                    students=s_list,
                    no_surat=args.no_surat,
                    tgl_surat=args.tgl_surat,
                    tgl_pelepasan=args.tgl_pelepasan,
                    tgl_penarikan=args.tgl_penarikan
                )

if __name__ == '__main__':
    main()

