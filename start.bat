@echo off
setlocal enabledelayedexpansion
title Aplikasi Surat Pengantar PKL - SMKN 1 FYJ Channel
color 0F

:: 1. Pastikan selalu berada di direktori tempat berkas start.bat ini berada
cd /d "%~dp0"

echo ====================================================================
echo        APLIKASI SURAT PENGANTAR PKL - SMKN 1 FYJ CHANNEL
echo ====================================================================
echo.
echo Memeriksa lingkungan sistem...

set "PYTHON_EXE="

:: 2. Prioritas 1: Gunakan Python Portable di folder installers\python
if exist "%~dp0installers\python\python.exe" (
    set "PYTHON_EXE=%~dp0installers\python\python.exe"
    echo [OK] Menggunakan Python Portable mandiri di folder installers.
    goto LAUNCH_SERVER
)

:: 3. Jika folder python belum diekstrak tetapi zip-nya ada, ekstrak otomatis
if exist "%~dp0installers\python-3.11.9-embed-amd64.zip" (
    echo [INFO] Menyiapkan Python Portable dari berkas arsip...
    powershell -NoProfile -Command "Expand-Archive -Path '%~dp0installers\python-3.11.9-embed-amd64.zip' -DestinationPath '%~dp0installers\python' -Force" >nul 2>&1
    if exist "%~dp0installers\python\python.exe" (
        set "PYTHON_EXE=%~dp0installers\python\python.exe"
        echo [OK] Python Portable berhasil disiapkan.
        goto LAUNCH_SERVER
    )
)

:: 4. Prioritas 2: Cek Python sistem di Windows
python -c "import sys; print(sys.version)" >nul 2>&1
if %errorlevel% equ 0 (
    set "PYTHON_EXE=python"
    echo [OK] Menggunakan Python sistem Windows.
    goto LAUNCH_SERVER
)

:: 5. Prioritas 3: Cek Python Launcher (py) bawaan Windows
py -3 -c "import sys; print(sys.version)" >nul 2>&1
if %errorlevel% equ 0 (
    set "PYTHON_EXE=py"
    echo [OK] Menggunakan Python Launcher Windows.
    goto LAUNCH_SERVER
)

:: 6. Prioritas 4: Jika installer Python tersedia, tawarkan pemasangan
echo.
echo [PERINGATAN] Python belum terpasang di perangkat ini.
if exist "%~dp0installers\python-3.11.9-amd64.exe" (
    echo Ditemukan file installer Python di folder installers.
    echo Menjalankan penginstalan Python resmi...
    echo Harap ikuti petunjuk penginstalan hingga selesai.
    echo.
    start /wait "" "%~dp0installers\python-3.11.9-amd64.exe" /passive PrependPath=1 Include_test=0
    
    python -c "import sys; print(sys.version)" >nul 2>&1
    if !errorlevel! equ 0 (
        set "PYTHON_EXE=python"
        echo [SUKSES] Python berhasil dipasang.
        goto LAUNCH_SERVER
    )
)

:: 7. Mode Mandiri (Buka langsung index.html tanpa server jika Python tidak ada)
echo.
echo [INFO] Menjalankan antarmuka aplikasi secara langsung di peramban web...
start "" "%~dp0index.html"
echo.
echo ====================================================================
echo  Aplikasi telah dibuka langsung di peramban web Anda.
echo  Semua fitur offline (pratinjau, cetak, unduh Word/ZIP client) tetap aktif.
echo ====================================================================
echo.
echo Tekan sembarang tombol untuk keluar...
pause >nul
exit /b 0

:LAUNCH_SERVER
echo.
echo ====================================================================
echo  MEMULAI SERVER DATABASE APLIKASI
echo ====================================================================
echo.
echo [INFO] Menjalankan backend SQLite & dokumen generator...
echo [INFO] Peramban web akan terbuka otomatis.
echo [INFO] Jangan tutup jendela ini selama menggunakan aplikasi web.
echo.

:: Jalankan server backend Python (app.py akan otomatis membuka peramban web)
"%PYTHON_EXE%" "%~dp0app.py" 8000

echo.
echo ====================================================================
echo  Server aplikasi telah dihentikan.
echo  Tekan sembarang tombol untuk menutup jendela ini...
echo ====================================================================
pause >nul
exit /b 0
