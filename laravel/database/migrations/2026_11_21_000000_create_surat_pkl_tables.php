<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Tabel Data Siswa PKL
        Schema::create('data_pkl', function (Blueprint $table) {
            $table->id();
            $table->integer('no')->default(0);
            $table->string('guru', 150)->nullable();
            $table->string('nip', 50)->nullable();
            $table->string('guru_pangkat', 100)->nullable();
            $table->string('guru_jabatan', 100)->default('Guru Pembimbing PKL');
            $table->string('siswa', 150);
            $table->string('nis', 30)->nullable();
            $table->string('nisn', 30)->nullable();
            $table->string('kelas', 50)->nullable();
            $table->string('jurusan', 100)->nullable();
            $table->string('tempat', 255)->nullable();
            $table->text('alamat')->nullable();
            $table->timestamps();
        });

        // 2. Tabel Template Surat
        Schema::create('template_surat', function (Blueprint $table) {
            $table->string('id', 80)->primary();
            $table->string('nama', 200);
            $table->longText('html_content');
            $table->boolean('is_default')->default(false);
            $table->string('status', 20)->default('active');
            $table->timestamps();
        });

        // 3. Tabel Pengaturan Aplikasi
        Schema::create('pengaturan_aplikasi', function (Blueprint $table) {
            $table->string('kunci', 100)->primary();
            $table->longText('nilai')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengaturan_aplikasi');
        Schema::dropIfExists('template_surat');
        Schema::dropIfExists('data_pkl');
    }
};
