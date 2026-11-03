@echo off
setlocal enabledelayedexpansion
title Aplikasi Surat Pengantar PKL - SMKN 1 FYJ Channel
color 0F

:: Pindah ke direktori tempat file bat ini berada
cd /d "%~dp0"

echo ====================================================================
echo        APLIKASI SURAT PENGANTAR PKL - SMKN 1 FYJ CHANNEL
echo ====================================================================
echo.
echo Memeriksa lingkungan sistem...

set "PYTHON_EXE="

:: 1. Cek Python Portable di folder installers\python\python.exe
if exist "%~dp0installers\python\python.exe" (
    set "PYTHON_EXE=%~dp0installers\python\python.exe"
    echo [OK] Menggunakan Python Portable mandiri di folder installers.
    goto LAUNCH_SERVER
)

:: 2. Cek Python sistem di Windows
python --version >nul 2>&1
if %errorlevel% equ 0 (
    set "PYTHON_EXE=python"
    echo [OK] Menggunakan Python sistem Windows.
    goto LAUNCH_SERVER
)

:: 3. Cek py launcher bawaan Windows
py --version >nul 2>&1
if %errorlevel% equ 0 (
    set "PYTHON_EXE=py"
    echo [OK] Menggunakan Python Launcher Windows.
    goto LAUNCH_SERVER
)

:: 4. Jika Python belum ada sama sekali di komputer ini
echo [PERINGATAN] Python belum terpasang di perangkat ini.
echo.
if exist "%~dp0installers\python-3.11.9-amd64.exe" (
    echo Ditemukan file installer Python di folder installers.
    echo Menjalankan penginstalan Python otomatis...
    echo.
    start /wait "" "%~dp0installers\python-3.11.9-amd64.exe" /passive PrependPath=1 Include_test=0
    
    python --version >nul 2>&1
    if !errorlevel! equ 0 (
        set "PYTHON_EXE=python"
        echo [SUKSES] Python berhasil dipasang.
        goto LAUNCH_SERVER
    )
)

:: 5. Mode Fallback langsung buka index.html
echo.
echo [INFO] Menjalankan antarmuka aplikasi langsung di peramban web...
start "" "%~dp0index.html"
echo.
echo Aplikasi telah dibuka di browser Anda.
echo ====================================================================
pause
exit /b 0

:LAUNCH_SERVER
echo.
echo Memulai Server Database dan Aplikasi di http://localhost:8000 ...
echo [INFO] Jangan tutup jendela ini selama menggunakan aplikasi.
echo [INFO] Tekan Ctrl + C untuk menghentikan server jika sudah selesai.
echo ====================================================================
echo.

:: Jalankan server backend Python (app.py akan otomatis membuka peramban 1 kali)
"%PYTHON_EXE%" "%~dp0app.py" 8000

if %errorlevel% neq 0 (
    echo.
    echo [CATATAN] Server backend telah dihentikan.
)

echo.
echo ====================================================================
echo Server telah selesai dijalankan.
pause
