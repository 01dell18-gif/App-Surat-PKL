<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;

class SuratPklApiController extends Controller
{
    /**
     * Cek status koneksi backend & jumlah data
     */
    public function status()
    {
        try {
            $count = DB::table('data_pkl')->count();
            return response()->json([
                'status' => 'ok',
                'backend' => 'Laravel Framework (PHP ' . PHP_VERSION . ')',
                'database' => 'Connected (' . config('database.default') . ')',
                'records' => $count
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'warning',
                'backend' => 'Laravel Framework',
                'database' => 'Not migrated yet (' . $e->getMessage() . ')',
                'records' => 0
            ]);
        }
    }

    /**
     * Ambil seluruh data siswa PKL
     */
    public function getRecords()
    {
        try {
            $records = DB::table('data_pkl')->orderBy('no', 'asc')->get();
            return response()->json($records);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Simpan / Timpa seluruh data siswa PKL (Batch Sync)
     */
    public function saveRecords(Request $request)
    {
        $data = $request->json()->all();
        if (!is_array($data)) {
            return response()->json(['error' => 'Format payload harus berupa array json'], 400);
        }

        DB::beginTransaction();
        try {
            DB::table('data_pkl')->truncate();

            $insertData = [];
            foreach ($data as $r) {
                $insertData[] = [
                    'no' => $r['no'] ?? 0,
                    'guru' => $r['guru'] ?? '',
                    'nip' => $r['nip'] ?? '',
                    'guru_pangkat' => $r['guru_pangkat'] ?? '',
                    'guru_jabatan' => $r['guru_jabatan'] ?? 'Guru Pembimbing PKL',
                    'siswa' => $r['siswa'] ?? ($r['nama'] ?? ''),
                    'nis' => $r['nis'] ?? '',
                    'nisn' => $r['nisn'] ?? '',
                    'kelas' => $r['kelas'] ?? '',
                    'jurusan' => $r['jurusan'] ?? '',
                    'tempat' => $r['tempat'] ?? '',
                    'alamat' => $r['alamat'] ?? '',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            if (!empty($insertData)) {
                // Insert per batch 100 baris agar aman dan cepat
                foreach (array_chunk($insertData, 100) as $chunk) {
                    DB::table('data_pkl')->insert($chunk);
                }
            }

            DB::commit();
            return response()->json(['success' => true, 'count' => count($insertData)]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Ambil seluruh template surat
     */
    public function getTemplates()
    {
        try {
            $templates = DB::table('template_surat')
                ->orderBy('is_default', 'desc')
                ->orderBy('id', 'asc')
                ->get();

            $result = $templates->map(function ($t) {
                return [
                    'id' => $t->id,
                    'name' => $t->nama,
                    'htmlContent' => $t->html_content,
                    'isDefault' => (bool)$t->is_default,
                    'status' => $t->status,
                    'createdAt' => $t->created_at
                ];
            });

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Simpan / Perbarui Template Surat
     */
    public function saveTemplate(Request $request)
    {
        $tpl = $request->json()->all();
        if (empty($tpl['id'])) {
            return response()->json(['error' => 'Template ID wajib disertakan'], 400);
        }

        try {
            $exists = DB::table('template_surat')->where('id', $tpl['id'])->exists();
            $data = [
                'nama' => $tpl['name'] ?? ($tpl['nama'] ?? 'Template Tanpa Judul'),
                'html_content' => $tpl['htmlContent'] ?? ($tpl['html_content'] ?? ''),
                'is_default' => !empty($tpl['isDefault']) ? 1 : 0,
                'status' => $tpl['status'] ?? 'active',
                'updated_at' => now(),
            ];

            if ($exists) {
                DB::table('template_surat')->where('id', $tpl['id'])->update($data);
            } else {
                $data['id'] = $tpl['id'];
                $data['created_at'] = now();
                DB::table('template_surat')->insert($data);
            }

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Hapus Template Surat
     */
    public function deleteTemplate(Request $request)
    {
        $id = $request->json('id');
        if (empty($id)) {
            return response()->json(['error' => 'Template ID tidak valid'], 400);
        }

        try {
            DB::table('template_surat')->where('id', $id)->delete();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Ambil pengaturan sekolah & dokumen
     */
    public function getSettings()
    {
        try {
            $settings = DB::table('pengaturan_aplikasi')->pluck('nilai', 'kunci');
            return response()->json($settings);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Simpan pengaturan sekolah & dokumen
     */
    public function saveSettings(Request $request)
    {
        $payload = $request->json()->all();
        try {
            foreach ($payload as $key => $val) {
                DB::table('pengaturan_aplikasi')->updateOrInsert(
                    ['kunci' => $key],
                    ['nilai' => is_array($val) ? json_encode($val) : (string)$val, 'updated_at' => now()]
                );
            }
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
