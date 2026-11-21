/**
 * Aplikasi Surat Pengantar PKL - SMKN 1 FYJ Channel
 * High-Performance Bun HTTP & SQLite Server (Bun Runtime Support)
 * Usage: bun run start / bun server.bun.js
 */

const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '8000', 10);
const DB_PATH = path.join(__dirname, 'database', 'surat_pkl.db');

// SQLite connection via native Bun SQLite or fallback
let db = null;
try {
  if (typeof Bun !== 'undefined') {
    const { Database } = require('bun:sqlite');
    db = new Database(DB_PATH);
    console.log(`[Bun Server] Database SQLite terhubung: ${DB_PATH}`);
  }
} catch (e) {
  console.warn('[Bun Server] Menjalankan dalam mode fallback memori/file:', e.message);
}

// MIME Types Map
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.sql': 'text/plain; charset=utf-8'
};

// Start Bun native server
if (typeof Bun !== 'undefined') {
  Bun.serve({
    port: PORT,
    async fetch(req) {
      const url = new URL(req.url);
      let pathname = decodeURIComponent(url.pathname);
      if (pathname === '/') pathname = '/index.html';

      // ================= API ENDPOINTS =================
      if (pathname === '/api/status') {
        let count = 0;
        if (db) {
          try {
            const row = db.query('SELECT COUNT(*) as c FROM data_pkl').get();
            count = row ? row.c : 0;
          } catch (_) {}
        }
        return Response.json({
          status: 'ok',
          backend: 'Bun Server (v' + (Bun.version || '1.0') + ')',
          database: db ? 'SQLite Connected' : 'Static Fallback',
          records: count
        });
      }

      if (pathname === '/api/records') {
        if (req.method === 'GET') {
          if (db) {
            try {
              const rows = db.query('SELECT * FROM data_pkl ORDER BY no ASC').all();
              return Response.json(rows);
            } catch (err) {
              return Response.json({ error: err.message }, { status: 500 });
            }
          }
          const dataJsonPath = path.join(__dirname, 'js', 'data_pkl.json');
          if (fs.existsSync(dataJsonPath)) {
            return new Response(fs.readFileSync(dataJsonPath), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return Response.json([]);
        }

        if (req.method === 'POST') {
          try {
            const body = await req.json();
            if (db && Array.isArray(body)) {
              const deleteStmt = db.prepare('DELETE FROM data_pkl');
              deleteStmt.run();
              const insertStmt = db.prepare(`
                INSERT INTO data_pkl (no, guru, nip, guru_pangkat, guru_jabatan, siswa, nis, nisn, kelas, jurusan, tempat, alamat)
                VALUES ($no, $guru, $nip, $pangkat, $jabatan, $siswa, $nis, $nisn, $kelas, $jurusan, $tempat, $alamat)
              `);
              for (const r of body) {
                insertStmt.run({
                  $no: r.no || 0,
                  $guru: r.guru || '',
                  $nip: r.nip || '',
                  $pangkat: r.guru_pangkat || '',
                  $jabatan: r.guru_jabatan || 'Guru Pembimbing PKL',
                  $siswa: r.siswa || r.nama || '',
                  $nis: r.nis || '',
                  $nisn: r.nisn || '',
                  $kelas: r.kelas || '',
                  $jurusan: r.jurusan || '',
                  $tempat: r.tempat || '',
                  $alamat: r.alamat || ''
                });
              }
              return Response.json({ success: true, count: body.length });
            }
            return Response.json({ success: true, count: Array.isArray(body) ? body.length : 0 });
          } catch (err) {
            return Response.json({ error: err.message }, { status: 500 });
          }
        }
      }

      if (pathname === '/api/templates') {
        if (req.method === 'GET') {
          if (db) {
            try {
              const rows = db.query('SELECT * FROM template_surat ORDER BY is_default DESC, id ASC').all();
              return Response.json(rows.map(r => ({
                id: r.id,
                name: r.nama,
                htmlContent: r.html_content,
                isDefault: r.is_default === 1,
                status: r.status,
                createdAt: r.created_at
              })));
            } catch (err) {
              return Response.json({ error: err.message }, { status: 500 });
            }
          }
          return Response.json([]);
        }

        if (req.method === 'POST') {
          try {
            const t = await req.json();
            if (db && t && t.id) {
              const stmt = db.prepare(`
                INSERT INTO template_surat (id, nama, html_content, is_default, status)
                VALUES ($id, $nama, $html, $def, $status)
                ON CONFLICT(id) DO UPDATE SET
                  nama = excluded.nama,
                  html_content = excluded.html_content,
                  is_default = excluded.is_default,
                  status = excluded.status
              `);
              stmt.run({
                $id: t.id,
                $nama: t.name || t.nama || 'Template Tanpa Judul',
                $html: t.htmlContent || t.html_content || '',
                $def: t.isDefault ? 1 : 0,
                $status: t.status || 'active'
              });
              return Response.json({ success: true });
            }
            return Response.json({ success: false });
          } catch (err) {
            return Response.json({ error: err.message }, { status: 500 });
          }
        }
      }

      if (pathname === '/api/templates/delete' && req.method === 'POST') {
        try {
          const body = await req.json();
          if (db && body && body.id) {
            const stmt = db.prepare('DELETE FROM template_surat WHERE id = $id');
            stmt.run({ $id: body.id });
            return Response.json({ success: true });
          }
          return Response.json({ success: false });
        } catch (err) {
          return Response.json({ error: err.message }, { status: 500 });
        }
      }

      // ================= STATIC FILE SERVING =================
      const filePath = path.join(__dirname, pathname.replace(/^\//, ''));
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const fileContent = fs.readFileSync(filePath);
        return new Response(fileContent, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache'
          }
        });
      }

      return new Response('404 Not Found', { status: 404 });
    }
  });

  console.log(`[Bun Server] Aplikasi Surat Pengantar PKL aktif di http://localhost:${PORT}`);
} else {
  console.log(`Untuk menjalankan dengan Bun, jalankan perintah: bun run start`);
}
