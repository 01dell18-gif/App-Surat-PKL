<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SuratPklApiController;

/*
|--------------------------------------------------------------------------
| API Routes: Aplikasi Surat Pengantar PKL
|--------------------------------------------------------------------------
*/

Route::prefix('api')->group(function () {
    Route::get('/status', [SuratPklApiController::class, 'status']);
    
    // Data Siswa & DU/DI
    Route::get('/records', [SuratPklApiController::class, 'getRecords']);
    Route::post('/records', [SuratPklApiController::class, 'saveRecords']);
    Route::post('/jurusan/update', [SuratPklApiController::class, 'updateJurusan']);
    
    // Template Surat
    Route::get('/templates', [SuratPklApiController::class, 'getTemplates']);
    Route::post('/templates', [SuratPklApiController::class, 'saveTemplate']);
    Route::post('/templates/delete', [SuratPklApiController::class, 'deleteTemplate']);
    
    // Pengaturan Aplikasi & Sekolah
    Route::get('/settings', [SuratPklApiController::class, 'getSettings']);
    Route::post('/settings', [SuratPklApiController::class, 'saveSettings']);
});
