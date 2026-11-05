-- ========================================================
-- Database Schema & Data: Surat Pengantar PKL
-- Instansi : SMKN 1 FYJ Channel
-- Diperbarui : 2026-11-05 15:13:00
-- Kompatibel : MySQL, MariaDB, PostgreSQL, SQLite
-- ========================================================

SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- Struktur Tabel: siswa_pkl
-- --------------------------------------------------------
DROP TABLE IF EXISTS `siswa_pkl`;
CREATE TABLE `siswa_pkl` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `no_urut` INT NOT NULL DEFAULT 0,
  `guru` VARCHAR(255) NOT NULL,
  `nip` VARCHAR(50) DEFAULT '',
  `siswa` VARCHAR(255) NOT NULL,
  `nis` VARCHAR(50) DEFAULT '',
  `nisn` VARCHAR(50) DEFAULT '',
  `kelas` VARCHAR(50) NOT NULL,
  `jurusan` VARCHAR(100) DEFAULT '',
  `tempat` VARCHAR(255) NOT NULL,
  `alamat` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_guru` (`guru`),
  INDEX `idx_tempat` (`tempat`),
  INDEX `idx_kelas` (`kelas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Data Siswa PKL (258 baris)
-- --------------------------------------------------------
LOCK TABLES `siswa_pkl` WRITE;
INSERT INTO `siswa_pkl` (`no_urut`, `guru`, `nip`, `siswa`, `nis`, `nisn`, `kelas`, `jurusan`, `tempat`, `alamat`) VALUES
(1, 'Ida Ayu Agung Endrayani, S.Pd.', '19670224 198902 2 002', 'Ni Komang Sri Damayanti', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / SEMARAPURA KLOD', 'Jl. Rama Ling. Semarapura Kelod, Kel. Semarapura Kelod, Kec. Klungkung, Kab. Klungkung'),
(2, 'Ida Ayu Agung Endrayani, S.Pd.', '19670224 198902 2 002', 'Ni Made Sari Astini', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / KUSANEGARA', 'Jl. Kusanegara Banjar Dinas Bandung, Kel. Gunaksa, Kec. Dawan, Kab. Klungkung'),
(3, 'Ida Ayu Agung Endrayani, S.Pd.', '19670224 198902 2 002', 'Ni Nyoman Manik Dalem Maharani', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / KUSANEGARA', 'Jl. Kusanegara Banjar Dinas Bandung, Kel. Gunaksa, Kec. Dawan, Kab. Klungkung'),
(4, 'Ida Ayu Agung Endrayani, S.Pd.', '19670224 198902 2 002', 'Putu Purnamawati', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / SEMARAPURA KLOD', 'Jl. Rama Ling. Semarapura Kelod, Kel. Semarapura Kelod, Kec. Klungkung, Kab. Klungkung'),
(5, 'Ida Ayu Agung Endrayani, S.Pd.', '19670224 198902 2 002', 'I Gede Ari Widnyana', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'Gemilang Motor', 'Jl. Flamboyan No.53, Semarapura Kauh, Kec. Klungkung, Kab. Klungkung, Bali'),
(6, 'Ida Ayu Agung Endrayani, S.Pd.', '19670224 198902 2 002', 'Kadek Angga Trisnawan', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'Gemilang Motor', 'Jl. Flamboyan No.53, Semarapura Kauh, Kec. Klungkung, Kab. Klungkung, Bali'),
(7, 'Ida Ayu Agung Endrayani, S.Pd.', '19670224 198902 2 002', 'Made Adi Mahardika', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'Gemilang Motor', 'Jl. Flamboyan No.53, Semarapura Kauh, Kec. Klungkung, Kab. Klungkung, Bali'),
(8, 'I Ketut Mutra, S.Pd., M.Pd.', '19670521 199512 1 005', 'Ketut Ananta Wardana', '', '', 'XII AK', 'Akuntansi', 'LPD Desa Pekraman Gelgel', 'Jl. Watu Renggong, Gelgel, Kec. Klungkung, Kab Klungkung'),
(9, 'I Ketut Mutra, S.Pd., M.Pd.', '19670521 199512 1 005', 'Ni Luh Nyoman Tri Githa Pramesti', '', '', 'XII AK', 'Akuntansi', 'LPD Desa Pekraman Gelgel', 'Jl. Watu Renggong, Gelgel, kec. Klungkung, Kab Klungkung'),
(10, 'I Ketut Mutra, S.Pd., M.Pd.', '19670521 199512 1 005', 'Anisa Safila', '', '', 'XII BD 2', 'Bisnis Digital', 'Toko Oneska Digital Store', 'Jl. Subali II, Br. Siku, Desa Kamasan, Klungkung'),
(11, 'I Ketut Mutra, S.Pd., M.Pd.', '19670521 199512 1 005', 'Luh Made Purnama Dewi', '', '', 'XII BD 2', 'Bisnis Digital', 'Toko Indrajaya', 'Jl. Raya Gelgel, Desa Tojan, Klungkung'),
(12, 'I Ketut Mutra, S.Pd., M.Pd.', '19670521 199512 1 005', 'Ni Komang Ayu Septianingsih', '', '', 'XII BD 2', 'Bisnis Digital', 'Toko Indrajaya', 'Jl. Raya Gelgel, Desa Tojan, Klungkung'),
(13, 'I Ketut Mutra, S.Pd., M.Pd.', '19670521 199512 1 005', 'Komang Ayu Seri Musthikarani', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'PT. PLN (PERSERO) ULP KLUNGKUNG', 'JALAN NGURAH RAI NO 40 SEMARAPURA TENGAH, KLUNGKUNG'),
(14, 'I Ketut Mutra, S.Pd., M.Pd.', '19670521 199512 1 005', 'Made Nitarianti', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'PT. PLN (PERSERO) ULP KLUNGKUNG', 'JALAN NGURAH RAI NO 40 SEMARAPURA TENGAH, KLUNGKUNG'),
(15, 'I Ketut Mutra, S.Pd., M.Pd.', '19670521 199512 1 005', 'Ni Kadek Ika Pradevi', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'PT. PLN (PERSERO) ULP KLUNGKUNG', 'JALAN NGURAH RAI NO 40 SEMARAPURA TENGAH, KLUNGKUNG'),
(16, 'I Gede Wiraguna, S.Pd.', '19791024 200312 1 004', 'Ni Kadek Anggun Putri Pramesti', '', '', 'XII AK', 'Akuntansi', 'PT. Pegadaian Persero Cabang Klungkung', 'Jl. Gn. Batukaru No.9, Semarapura Kelod Kangin, Kec. Klungkung'),
(17, 'I Gede Wiraguna, S.Pd.', '19791024 200312 1 004', 'Ni Ketut Catur Rahayu', '', '', 'XII AK', 'Akuntansi', 'PT. Pegadaian Persero Cabang Klungkung', 'Jl. Gn. Batukaru No.9, Semarapura Kelod Kangin, Kec. Klungkung'),
(18, 'I Gede Wiraguna, S.Pd.', '19791024 200312 1 004', 'Ni Putu Anggik Deswandari', '', '', 'XII AK', 'Akuntansi', 'PT. Pegadaian Persero Cabang Klungkung', 'Jl. Gn. Batukaru No.9, Semarapura Kelod Kangin, Kec. Klungkung'),
(19, 'I Gede Wiraguna, S.Pd.', '19791024 200312 1 004', 'Ni Made Ari Diana Sari', '', '', 'XII LPB', 'Layanan Perbankan', 'PT. BRI Persero, Tbk. Cabang Klungkung', 'Jl. Gunung Batukaru, No. 7, Semarapura Kelod Kangin, Kec. Klungkung'),
(20, 'I Made Miasa, S.Pd., M.Pd.', '19721231 200312 1 031', 'I Komang Sucitra', '', '', 'XII BD 2', 'Bisnis Digital', 'UD Merta Sari', 'Jl. Raya Nandini No.7 Desa Kamasan Klungkung'),
(21, 'I Made Miasa, S.Pd., M.Pd.', '19721231 200312 1 031', 'I Made Windya Arsana', '', '', 'XII BD 2', 'Bisnis Digital', 'UD Merta Sari', 'Jl. Raya Nandini No.7 Desa Kamasan Klungkung'),
(22, 'Anak Agung Istri Anom Kencananingsih, S.St.', '19670329 200604 2 001', 'Ni Kadek Ayu Dwipayani', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / BANJARANGKAN', 'Jl. Ida Bagus Puja Takmung, Kec. Bajarangkan Klungkung'),
(23, 'Anak Agung Istri Anom Kencananingsih, S.St.', '19670329 200604 2 001', 'Ni Kadek Widiantari', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / GAJAH MADA KLUNGKUNG', 'Jl. Gajah Mada Nomor 35B, Lingkungan Bendul, Kel. Semarapura Tengah,.Kec. Klungkung, Kab. Klungkung'),
(24, 'Anak Agung Istri Anom Kencananingsih, S.St.', '19670329 200604 2 001', 'Ni Putu Sariasih', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / GAJAH MADA KLUNGKUNG', 'Jl. Gajah Mada Nomor 35B, Lingkungan Bendul, Kel. Semarapura Tengah,.Kec. Klungkung, Kab. Klungkung'),
(25, 'Anak Agung Istri Anom Kencananingsih, S.St.', '19670329 200604 2 001', 'I Gede Sutawan', '', '', 'XII BD 2', 'Bisnis Digital', 'Toko Indrajaya', 'Jl. Raya Gelgel, Desa Tojan, Klungkung'),
(26, 'Anak Agung Istri Anom Kencananingsih, S.St.', '19670329 200604 2 001', 'Galang Damai Dinata', '', '', 'XII BD 2', 'Bisnis Digital', 'Toko Indrajaya', 'Jl. Raya Gelgel, Desa Tojan, Klungkung'),
(27, 'Anak Agung Istri Anom Kencananingsih, S.St.', '19670329 200604 2 001', 'I Komang Pebri Andika Saputra', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'PT. Nusantara Surya Sakti (NSS)', 'Jl. Kecubung, Semarapura Kelod, Kec. Klungkung, Kab. Klungkung, Bali'),
(28, 'Ni Luh Ekarini Suryaningsih Hadisaputri, SE.', '19800103 200803 2 001', 'Anak Agung Istri Prima Pebrianti', '', '', 'XII LPB', 'Layanan Perbankan', 'PT. BPR Tridarma Putri Klungkung', 'Jl. Diponogoro, No. 25, Semarapura, Kec.Klungkung'),
(29, 'Ni Luh Ekarini Suryaningsih Hadisaputri, SE.', '19800103 200803 2 001', 'Gede Risky Adi Permana', '', '', 'XII LPB', 'Layanan Perbankan', 'Tefa Bank Mini SMK N 1 Klungkung', 'Jl Subali II Br Siku Desa Kamasan Klungkung'),
(30, 'Ni Luh Ekarini Suryaningsih Hadisaputri, SE.', '19800103 200803 2 001', 'I Gusti Made Diah Purnama Sari', '', '', 'XII LPB', 'Layanan Perbankan', 'PT. BPR Tridarma Putri Klungkung', 'Jl. Diponogoro, No. 25, Semarapura, Kec.Klungkung'),
(31, 'I Ketut Sudarsana, S.Pd.', '19690805 200902 1 001', 'I Gede Resa Pradnya Andika', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'Ahas Cemerlang Motor', 'Jl Flamboyan 66 Klungkung'),
(32, 'I Ketut Sudarsana, S.Pd.', '19690805 200902 1 001', 'I Gusti Ngurah Sathya Dananjaya', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'SS 21 S Honda Motor', 'Jl. Untung Suropati No.45, Semarapura Kelod, Kec. Klungkung, Kab. Klungkung'),
(33, 'I Ketut Sudarsana, S.Pd.', '19690805 200902 1 001', 'I Kadek Kusuma Cahyadi', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'SS 21 S Honda Motor', 'Jl. Untung Suropati No.45, Semarapura Kelod, Kec. Klungkung, Kab. Klungkung'),
(34, 'I Ketut Sudarsana, S.Pd.', '19690805 200902 1 001', 'I Ketut Catur Yoga Saputra', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'SS 21 S Honda Motor', 'Jl. Untung Suropati No.45, Semarapura Kelod, Kec. Klungkung, Kab. Klungkung'),
(35, 'I Ketut Sudarsana, S.Pd.', '19690805 200902 1 001', 'I Putu Pande Sedaya Tana', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'SS 21 S Honda Motor', 'Jl. Untung Suropati No.45, Semarapura Kelod, Kec. Klungkung, Kab. Klungkung'),
(36, 'I Ketut Sudarsana, S.Pd.', '19690805 200902 1 001', 'I Wayan Surya Nanta', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'Ahas Cemerlang Motor', 'Jl Flamboyan 66 Klungkung'),
(37, 'I Ketut Sudarsana, S.Pd.', '19690805 200902 1 001', 'Muhammad Azizul Hakim', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'SS 21 S Honda Motor', 'Jl. Untung Suropati No.45, Semarapura Kelod, Kec. Klungkung, Kab. Klungkung'),
(38, 'I Ketut Sudarsana, S.Pd.', '19690805 200902 1 001', 'Yusuf Ardiansyah', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'SS 21 S Honda Motor', 'Jl. Untung Suropati No.45, Semarapura Kelod, Kec. Klungkung, Kab. Klungkung'),
(39, 'I Ketut Sudarsana, S.Pd.', '19690805 200902 1 001', 'Roberto Christiano', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'SS 21 S Honda Motor', 'Jl. Untung Suropati No.45, Semarapura Kelod, Kec. Klungkung, Kab. Klungkung'),
(40, 'Ni Made Ari Naswati, ST', '19830802 201001 2 026', 'Ni Putu Dian Cahyani', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'Mandala Gold', 'Jl. Kecubung, Semarapura Kelod, Kab. Klungkung'),
(41, 'I Putu Arnawa Putra, S.Pd.', '19800903 200604 1 010', 'Ni Komang Ayu Intan Pratiwi', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / LEBIH', 'Jl. By Pass IB Mantra Kel. Lebih Beten Klod, Kec. Lebih, Kab. Gianyar'),
(42, 'I Putu Arnawa Putra, S.Pd.', '19800903 200604 1 010', 'Ni Komang Purnama Sari', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / LEBIH', 'Jl. By Pass IB Mantra Kel. Lebih Beten Klod, Kec. Lebih, Kab. Gianyar'),
(43, 'I Putu Arnawa Putra, S.Pd.', '19800903 200604 1 010', 'Ni Kadek Putri Jayanti', '', '', 'XII BD 2', 'Bisnis Digital', 'Koperasi Nirmala', 'Jl. Raya By Pass Ida Bagus Mantra Desa Lepang, Klungkung'),
(44, 'I Putu Arnawa Putra, S.Pd.', '19800903 200604 1 010', 'Ni Nengah Febriani', '', '', 'XII BD 2', 'Bisnis Digital', 'Koperasi Nirmala', 'Jl. Raya By Pass Ida Bagus Mantra Desa Lepang, Klungkung'),
(45, 'Ketut Widisila, S.T., M.Pd.', '19790610 201001 1 023', 'Redno Fedrianzah', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'PT. Nusantara Surya Sakti (NSS)', 'Jl. Kecubung, Semarapura Kelod, Kec. Klungkung, Kab. Klungkung, Bali'),
(46, 'Anak Agung Ayu Puspa Kusuma Dhari, ST', '19781004 200902 2 007', 'Ni Putu Novi Armatiana', '', '', 'XII LPKKK 1', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Lestari', 'Jln. Flamboyan No.56, Semarapura Kauh, Kec. Klungkung, Kabupaten Klungkung'),
(47, 'Anak Agung Ayu Puspa Kusuma Dhari, ST', '19781004 200902 2 007', 'Ni Putu Indah Muliarni', '', '', 'XII LPKKK 2', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Visual Farma II', 'Dsn. Tengah Desa Akah ,Kec Klungkung ,Kab.Klungkung'),
(48, 'Luh Desy Dianayanti, S.Pd., M.Pd', '19841213 200902 2 009', 'Kadek Gita Anindita Kemulan', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'E Sanctuary Ubud', 'Jl. Raya Br. Tunon, Singakerta, Kecamatan Ubud, Kab. Gianyar, Bali'),
(49, 'Luh Desy Dianayanti, S.Pd., M.Pd', '19841213 200902 2 009', 'Ni Kadek Ita Sutriani', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'E Sanctuary Ubud', 'Jl. Raya Br. Tunon, Singakerta, Kecamatan Ubud, Kab. Gianyar, Bali'),
(50, 'I Putu Arya Padang Arnawa, S.Sn.', '19841213 200902 2 009', 'Arkananta Maulana Putra Apriliansyah', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'Karisma Motor', 'Jl. Untung Suropati No.15A, Semarapura Tengah, Kec. Klungkung, Kab. Klungkung, Bali');
INSERT INTO `siswa_pkl` (`no_urut`, `guru`, `nip`, `siswa`, `nis`, `nisn`, `kelas`, `jurusan`, `tempat`, `alamat`) VALUES
(51, 'I Putu Arya Padang Arnawa, S.Sn.', '19841213 200902 2 009', 'I Kadek Ipan Junata', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'Karisma Motor', 'Jl. Untung Suropati No.15A, Semarapura Tengah, Kec. Klungkung, Kab. Klungkung, Bali'),
(52, 'I Putu Arya Padang Arnawa, S.Sn.', '19841213 200902 2 009', 'I Putu Bayu Saputra', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'Karisma Motor', 'Jl. Untung Suropati No.15A, Semarapura Tengah, Kec. Klungkung, Kab. Klungkung, Bali'),
(53, 'I Nengah Sudarsana, S.Pd.', '19820523 200902 1 003', 'Ida Ayu Sinta Dewi', '', '', 'XII LPB', 'Layanan Perbankan', 'PT. BPD Cabang Klungkung', 'Jl. Gajah Mada, Semarapura Kelod Kangin, Kec. Klungkung'),
(54, 'I Nengah Sudarsana, S.Pd.', '19820523 200902 1 003', 'Ni Kadek Intan Satrya Wati', '', '', 'XII LPB', 'Layanan Perbankan', 'PT. BPD Cabang Klungkung', 'Jl. Gajah Mada, Semarapura Kelod Kangin, Kec. Klungkung'),
(55, 'I Nengah Sudarsana, S.Pd.', '19820523 200902 1 003', 'Desak Nyoman Widya Sari', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'PT.SUMBER ALFARIA TRIJAYA TBK.', 'Jalan. Prof Ida Bagus Mantra, Lingkungan Siut, Desa Tulikup, Gianyar'),
(56, 'I Nengah Sudarsana, S.Pd.', '19820523 200902 1 003', 'Ni Komang Rini Cahyani', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'PT.SUMBER ALFARIA TRIJAYA TBK.', 'Jalan. Prof Ida Bagus Mantra, Lingkungan Siut, Desa Tulikup, Gianyar'),
(57, 'I Nengah Sudarsana, S.Pd.', '19820523 200902 1 003', 'Ni Kadek Ayu Aprilia Dewi', '', '', 'XII MP 2', 'Manajemen Perkantoran', 'BADAN PUSAT STATISTIK KABUPATEN KLUNGKUNG', 'Jl. Gajah Mada, Akah, Kec. Klungkung, Kabupaten Klungkung, Bali 80714'),
(58, 'I Nengah Sudarsana, S.Pd.', '19820523 200902 1 003', 'Ni Komang Listia Dewi', '', '', 'XII MP 2', 'Manajemen Perkantoran', 'BADAN PUSAT STATISTIK KABUPATEN KLUNGKUNG', 'Jl. Gajah Mada, Akah, Kec. Klungkung, Kabupaten Klungkung, Bali 80714'),
(59, 'I Nengah Sudarsana, S.Pd.', '19820523 200902 1 003', 'Ni Komang Triana Pusparani', '', '', 'XII MP 2', 'Manajemen Perkantoran', 'BADAN PUSAT STATISTIK KABUPATEN KLUNGKUNG', 'Jl. Gajah Mada, Akah, Kec. Klungkung, Kabupaten Klungkung, Bali 80714'),
(60, 'Komang Ari Martini, S.Pd.', '19880525 201101 2 020', 'Ni Kadek Aprilia Lestari', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'BPJS KESEHATAN KLUNGKUNG', 'Jl. Gajah Mada No.55, Kec. Klungkung, Kabupaten Klungkung'),
(61, 'Komang Ari Martini, S.Pd.', '19880525 201101 2 020', 'Ni Kadek Sintia Wati', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'BPJS KESEHATAN KLUNGKUNG', 'Jl. Gajah Mada No.55, Kec. Klungkung, Kabupaten Klungkung'),
(62, 'Komang Ari Martini, S.Pd.', '19880525 201101 2 020', 'Ida Bagus Yuda Pratama', '', '', 'XII MP 2', 'Manajemen Perkantoran', 'DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA KABUPATEN KLUNGKUNG', 'Jalan Ngurah Rai, Semarapura, Kabupaten Klungkung'),
(63, 'Komang Ari Martini, S.Pd.', '19880525 201101 2 020', 'Irsyad Adiba Hafas Zidansyah', '', '', 'XII MP 2', 'Manajemen Perkantoran', 'DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA KABUPATEN KLUNGKUNG', 'Jalan Ngurah Rai, Semarapura, Kabupaten Klungkung'),
(64, 'Komang Ari Martini, S.Pd.', '19880525 201101 2 020', 'Ni Kadek Sriyanti', '', '', 'XII MP 2', 'Manajemen Perkantoran', 'DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL KABUPATEN KLUNGKUNG', 'Jl. Flamboyan No.27, Semarapura Kelod, Klungkung'),
(65, 'Komang Ari Martini, S.Pd.', '19880525 201101 2 020', 'Ni Komang Sutri Prantini', '', '', 'XII MP 2', 'Manajemen Perkantoran', 'DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL KABUPATEN KLUNGKUNG', 'Jl. Flamboyan No.27, Semarapura Kelod, Klungkung'),
(66, 'Ni Made Sunariani, SE', '19760411 201001 2 008', 'I Dewa Ayu Meira Dianra Sari', '', '', 'XII AK', 'Akuntansi', 'Koperasi Surya Artha Sedana Klungkung', 'Jl. Sahadewa, Semarapura Kangin, Klungkung'),
(67, 'Ni Made Sunariani, SE', '19760411 201001 2 008', 'Ni Putu Ayu Krisna Candra Dewi', '', '', 'XII AK', 'Akuntansi', 'Koperasi Surya Artha Sedana Klungkung', 'Jl. Sahadewa, Semarapura Kangin, Klungkung'),
(68, 'Ni Made Sunariani, SE', '19760411 201001 2 008', 'Ni Putu Diah Darmayanti', '', '', 'XII AK', 'Akuntansi', 'PT. BRI Persero, Tbk. Cabang Klungkung', 'Jl. Gunung Batukaru, No. 7, Semarapura Kelod Kangin, Kec. Klungkung'),
(69, 'Ni Made Sunariani, SE', '19760411 201001 2 008', 'Ni Wayan Chandra Rusita Devi', '', '', 'XII AK', 'Akuntansi', 'Koperasi Surya Artha Sedana Klungkung', 'Jl. Sahadewa, Semarapura Kangin, Klungkung'),
(70, 'Ni Made Sunariani, SE', '19760411 201001 2 008', 'I Gusti Ngurah Agus Januarta', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA KABUPATEN KLUNGKUNG', 'Jalan Ngurah Rai, Semarapura, Kabupaten Klungkung'),
(71, 'Ni Made Sunariani, SE', '19760411 201001 2 008', 'Ni Nengah Septia Dewi', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'CV. MANGGALA SURYA GEMILANG KLUNGKUNG', 'Jalan Flamboyan 55X Klungkung'),
(72, 'Ni Made Sunariani, SE', '19760411 201001 2 008', 'Ni Putu Eka Pramita Sari', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'CV. MANGGALA SURYA GEMILANG KLUNGKUNG', 'Jalan Flamboyan 55X Klungkung'),
(73, 'Ni Nengah Sumiartini, S.Pd.', '19880424 201101 2 020', 'I Gusti Ayu Wika Ariestari', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / SIYUT', 'Jl. By Pass I.B Mantra Lingk. Siyut, Kel. Tulikup, Kec. Gianyar'),
(74, 'Ni Nengah Sumiartini, S.Pd.', '19880424 201101 2 020', 'Kadek Suki Oktami', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / SIYUT', 'Jl. By Pass I.B Mantra Lingk. Siyut, Kel. Tulikup, Kec. Gianyar'),
(75, 'Ni Nengah Sumiartini, S.Pd.', '19880424 201101 2 020', 'Putu Agus Mahendra', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / IBM SARI BUWANA', 'Jl. By Pass Ida Bagus Mantra Banjar Rangkan, Kelurahan Ketewel, Kec. Sukawati, Kab. Gianyar'),
(76, 'Ni Nengah Sumiartini, S.Pd.', '19880424 201101 2 020', 'Rizki Ananta Ramadhani', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / IBM SARI BUWANA', 'Jl. By Pass Ida Bagus Mantra Banjar Rangkan, Kelurahan Ketewel, Kec. Sukawati, Kab. Gianyar'),
(77, 'Ni Nengah Sumiartini, S.Pd.', '19880424 201101 2 020', 'Ni Pande Wayan Yonika Damayani', '', '', 'XII BD 2', 'Bisnis Digital', 'Mini Mart El Mart', 'Jl. Rama Klungkung'),
(78, 'Ni Nengah Sumiartini, S.Pd.', '19880424 201101 2 020', 'Ni Putu Lia Trisnayanti', '', '', 'XII BD 2', 'Bisnis Digital', 'Mini Mart El Mart', 'Jl. Rama Klungkung'),
(79, 'Ni Putu Eka Wulandari, S.Pd.', '19881223 201101 2 021', 'I Wayan Wira Pradnyana', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'Kenak Medika Hospital Ubud', 'Mas, Kecamatan Ubud, Kabupaten Gianyar, Bali'),
(80, 'Ni Putu Eka Wulandari, S.Pd.', '19881223 201101 2 021', 'Ni Putu Selpi', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / IBM BETEN KELOD', 'Jl. I.B Mantra Br. Lebih Beten Klod, Kel. Lebih, Kec.Gianyar, Kab. Gianyar'),
(81, 'Ni Putu Eka Wulandari, S.Pd.', '19881223 201101 2 021', 'Ni Putu Sinta Purnama Yanti', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / IBM BETEN KELOD', 'Jl. I.B Mantra Br. Lebih Beten Klod, Kel. Lebih, Kec.Gianyar, Kab. Gianyar'),
(82, 'Ni Putu Eka Wulandari, S.Pd.', '19881223 201101 2 021', 'I Gede Candra Wiguna', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'Karisma Motor', 'Jl. Untung Suropati No.15A, Semarapura Tengah, Kec. Klungkung, Kab. Klungkung, Bali'),
(83, 'I Made Yuda Adi Putra, S.T.', '19800119 201403 1 001', 'Aldo Valentino', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'Ahas Cemerlang Motor', 'Jl Flamboyan 66 Klungkung'),
(84, 'I Made Yuda Adi Putra, S.T.', '19800119 201403 1 001', 'I Kadek Angga Aditya Putra', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'Aries 1 Motor', 'Jl. Ciung Wanara-Gianyar No.1 A, Gianyar, Kec. Gianyar, Kab. Gianyar, Bali'),
(85, 'I Made Yuda Adi Putra, S.T.', '19800119 201403 1 001', 'I Kadek Dwi Adi Darma Yudhi', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'Gemilang Motor', 'Jl. Flamboyan No.53, Semarapura Kauh, Kec. Klungkung, Kab. Klungkung, Bali'),
(86, 'I Made Yuda Adi Putra, S.T.', '19800119 201403 1 001', 'I Ketut Rianta', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'Ahas Cemerlang Motor', 'Jl Flamboyan 66 Klungkung'),
(87, 'I Made Yuda Adi Putra, S.T.', '19800119 201403 1 001', 'I Made Div Aditya Pramana', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'Aries 1 Motor', 'Jl. Ciung Wanara-Gianyar No.1 A, Gianyar, Kec. Gianyar, Kab. Gianyar, Bali'),
(88, 'I Made Yuda Adi Putra, S.T.', '19800119 201403 1 001', 'I Ngurah Komang Ari Artana', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'Ahas Cemerlang Motor', 'Jl Flamboyan 66 Klungkung'),
(89, 'I Made Yuda Adi Putra, S.T.', '19800119 201403 1 001', 'Juliantara Putra', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'Aries 1 Motor', 'Jl. Ciung Wanara-Gianyar No.1 A, Gianyar, Kec. Gianyar, Kab. Gianyar, Bali'),
(90, 'I Made Yuda Adi Putra, S.T.', '19800119 201403 1 001', 'Wiranto Sanjaya', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'Aries 1 Motor', 'Jl. Ciung Wanara-Gianyar No.1 A, Gianyar, Kec. Gianyar, Kab. Gianyar, Bali'),
(91, 'Faris Azka, S.Pd.', '19941008 201903 1 008', 'I Putu Juniarta', '', '', 'XII AK', 'Akuntansi', 'PT. BPR Tridarma Putri Klungkung', 'Jl. Diponogoro, No. 25, Semarapura, Kec.Klungkung'),
(92, 'Faris Azka, S.Pd.', '19941008 201903 1 008', 'Ni Kadek Ratih Sancikadewi', '', '', 'XII AK', 'Akuntansi', 'PT. BPR Tridarma Putri Klungkung', 'Jl. Diponogoro, No. 25, Semarapura, Kec. Klungkung'),
(93, 'Faris Azka, S.Pd.', '19941008 201903 1 008', 'Ni Kadek Santiasih', '', '', 'XII AK', 'Akuntansi', 'PT. BPR Tridarma Putri Klungkung', 'Jl. Diponogoro, No. 25, Semarapura, Kec. Klungkung'),
(94, 'Faris Azka, S.Pd.', '19941008 201903 1 008', 'I Gusti Ayu Putu Candra Widiantari', '', '', 'XII LPB', 'Layanan Perbankan', 'PT. BPR Sari Jaya Sedana Sampalan Klungkung', 'JL. Raya Sampalan,No. 88x,Dawan Klungkung'),
(95, 'Faris Azka, S.Pd.', '19941008 201903 1 008', 'Ida Ayu Indah Gangga Swari', '', '', 'XII LPB', 'Layanan Perbankan', 'PT. BPR Sari Jaya Sedana Sampalan Klungkung', 'JL. Raya Sampalan,No. 88x,Dawan Klungkung'),
(96, 'Arik Ardana, S.Pd.', '19860314 201903 1 012', 'I Gusti Ayu Diana Kristiani', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'BPJS TENAGA KERJA KAB.GIANYAR', 'Jalan Dharma Giri, Bypass Buruan, Gianyar, Bali 80581'),
(97, 'Arik Ardana, S.Pd.', '19860314 201903 1 012', 'Ni Kadek Darma Yanti', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'DINAS PEKERJAAN UMUM, PENATAAN RUANG PERUMAHAN DAN KAWASAN PEMUKIMAN KABUPATEN KLUNGKUNG', 'Jl. Gajah Mada No.47, Semarapura Tengah, Kec. Klungkung, Kabupaten Klungkung'),
(98, 'Arik Ardana, S.Pd.', '19860314 201903 1 012', 'Ni Komang Diah Anandita Permata', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'DINAS PEKERJAAN UMUM, PENATAAN RUANG PERUMAHAN DAN KAWASAN PEMUKIMAN KABUPATEN KLUNGKUNG', 'Jl. Gajah Mada No.47, Semarapura Tengah, Kec. Klungkung, Kabupaten Klungkung'),
(99, 'Arik Ardana, S.Pd.', '19860314 201903 1 012', 'Ni Luh Sri Nadi', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'DINAS PEKERJAAN UMUM, PENATAAN RUANG PERUMAHAN DAN KAWASAN PEMUKIMAN KABUPATEN KLUNGKUNG', 'Jl. Gajah Mada No.47, Semarapura Tengah, Kec. Klungkung, Kabupaten Klungkung'),
(100, 'Arik Ardana, S.Pd.', '19860314 201903 1 012', 'Anak Agung Istri Amira Vebriani', '', '', 'XII MP 2', 'Manajemen Perkantoran', '( MPP) PENANAMAN MODAL DAN PELAYANAN TERPADU SATU PINTU KABUPATEN KLUNGKUNG', 'Jalan Gajah Mada No.50 Semarapura');
INSERT INTO `siswa_pkl` (`no_urut`, `guru`, `nip`, `siswa`, `nis`, `nisn`, `kelas`, `jurusan`, `tempat`, `alamat`) VALUES
(101, 'Arik Ardana, S.Pd.', '19860314 201903 1 012', 'Ni Kadek Ayu Larasati', '', '', 'XII MP 2', 'Manajemen Perkantoran', '( MPP) PENANAMAN MODAL DAN PELAYANAN TERPADU SATU PINTU KABUPATEN KLUNGKUNG', 'Jalan Gajah Mada No.50 Semarapura'),
(102, 'Arik Ardana, S.Pd.', '19860314 201903 1 012', 'Ni Komang Padmawati', '', '', 'XII MP 2', 'Manajemen Perkantoran', '( MPP) PENANAMAN MODAL DAN PELAYANAN TERPADU SATU PINTU KABUPATEN KLUNGKUNG', 'Jalan Gajah Mada No.50 Semarapura'),
(103, 'Arik Ardana, S.Pd.', '19860314 201903 1 012', 'Ni Luh Vika Widyawati', '', '', 'XII MP 2', 'Manajemen Perkantoran', '( MPP) PENANAMAN MODAL DAN PELAYANAN TERPADU SATU PINTU KABUPATEN KLUNGKUNG', 'Jalan Gajah Mada No.50 Semarapura'),
(104, 'Arik Ardana, S.Pd.', '19860314 201903 1 012', 'Ni Putu Eka Widiantari', '', '', 'XII MP 2', 'Manajemen Perkantoran', '( MPP) PENANAMAN MODAL DAN PELAYANAN TERPADU SATU PINTU KABUPATEN KLUNGKUNG', 'Jalan Gajah Mada No.50 Semarapura'),
(105, 'Ni Ketut Budiati, S.Pd.', '19800810 202221 2 005', 'I Gede Ary Sudiantara', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA KABUPATEN KLUNGKUNG', 'Jalan Ngurah Rai, Semarapura, Kabupaten Klungkung'),
(106, 'Ni Ketut Budiati, S.Pd.', '19800810 202221 2 005', 'I Gede Nesa Wira Arsana', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA KABUPATEN KLUNGKUNG', 'Jalan Ngurah Rai, Semarapura, Kabupaten Klungkung'),
(107, 'Ni Ketut Budiati, S.Pd.', '19800810 202221 2 005', 'I Gede Tri Jaya Winnata', '', '', 'XII MP 2', 'Manajemen Perkantoran', 'SMK NEGERI 1 KLUNGKUNG', 'Jalan Subali II , Banjar Siku Desa Kamasan,Klungkung'),
(108, 'Ni Ketut Budiati, S.Pd.', '19800810 202221 2 005', 'Sang Made Arta Mahendra', '', '', 'XII MP 2', 'Manajemen Perkantoran', 'DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA KABUPATEN KLUNGKUNG', 'Jalan Ngurah Rai, Semarapura, Kabupaten Klungkung'),
(109, 'Eka Hikmahyanti, SE', '19840111 202221 2 002', 'Afrilia', '', '', 'XII LPB', 'Layanan Perbankan', 'PT. BPR Nusamba Manggis Klungkung', 'Jl. Untung Surapati No. 14. Semarapura, Kec. Klungkung'),
(110, 'Eka Hikmahyanti, SE', '19840111 202221 2 002', 'Ida Ayu Nyoman Reditya Oktaviani', '', '', 'XII LPB', 'Layanan Perbankan', 'PT. BPR Tata Anjungsari Klungkung', 'Jl. Darmawangsa, No. 05 Semarapura'),
(111, 'Eka Hikmahyanti, SE', '19840111 202221 2 002', 'Rina Agustina', '', '', 'XII LPB', 'Layanan Perbankan', 'PT. BPR Nusamba Manggis Klungkung', 'Jl. Untung Surapati No. 14. Semarapura, Kec. Klungkung'),
(112, 'Eka Hikmahyanti, SE', '19840111 202221 2 002', 'Meisya Fazrina', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'PT. PLN (PERSERO) UP3 BALI TIMUR', 'Jalan Batu Tabih 53 Semarapura Klungkung'),
(113, 'Eka Hikmahyanti, SE', '19840111 202221 2 002', 'Ni Komang Ayu Widiantari', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'BPJS TENAGA KERJA KAB.GIANYAR', 'Jalan Dharma Giri, Bypass Buruan, Gianyar, Bali 80581'),
(114, 'Eka Hikmahyanti, SE', '19840111 202221 2 002', 'Ni Luh Ayu Purnama Dewi', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'PT. PLN (PERSERO) ULP KLUNGKUNG', 'JALAN NGURAH RAI NO 40 SEMARAPURA TENGAH, KLUNGKUNG'),
(115, 'Eka Hikmahyanti, SE', '19840111 202221 2 002', 'Ni Putu Ayu Bintang', '', '', 'XII MP 2', 'Manajemen Perkantoran', 'DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL KABUPATEN KLUNGKUNG', 'Jl. Flamboyan No.27, Semarapura Kelod, Klungkung'),
(116, 'Eka Hikmahyanti, SE', '19840111 202221 2 002', 'Ni Putu Diah Arthasari', '', '', 'XII MP 2', 'Manajemen Perkantoran', 'DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL KABUPATEN KLUNGKUNG', 'Jl. Flamboyan No.27, Semarapura Kelod, Klungkung'),
(117, 'Eka Hikmahyanti, SE', '19840111 202221 2 002', 'Pande Putu Galuh Risanti Indira Yunika', '', '', 'XII MP 2', 'Manajemen Perkantoran', 'DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL KABUPATEN KLUNGKUNG', 'Jl. Flamboyan No.27, Semarapura Kelod, Klungkung'),
(118, 'Ni Kadek Winastri, S.Pd.', '19841122 202221 2 004', 'Luh Desiyani', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / BANJARANGKAN', 'Jl. Ida Bagus Puja Takmung, Kec. Bajarangkan Klungkung'),
(119, 'Ni Kadek Winastri, S.Pd.', '19841122 202221 2 004', 'Dewa Ayu Raras Variati', '', '', 'XII BD 2', 'Bisnis Digital', 'Toko Bisma', 'Jl. Raya Gelgel, Desa Gelgel, Klungkung'),
(120, 'Ni Kadek Winastri, S.Pd.', '19841122 202221 2 004', 'I Kadek Purnawirawan', '', '', 'XII BD 2', 'Bisnis Digital', 'Toko Bisma', 'Jl. Raya Gelgel, Desa Gelgel, Klungkung'),
(121, 'Ni Kadek Winastri, S.Pd.', '19841122 202221 2 004', 'Ni Kadek Meta Febriantari', '', '', 'XII BD 2', 'Bisnis Digital', 'Toko Bisma', 'Jl. Raya Gelgel, Desa Gelgel, Klungkung'),
(122, 'Kadek Sari Cuciati, S.Farm.', '19880624 202221 2 001', 'Ida Ayu Putu Diah Kamiswari', '', '', 'XII LPKKK 1', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Sinar Santi', 'Jln. Flamboyan No. 37 Semarapura, Kab. Klungkung'),
(123, 'Kadek Sari Cuciati, S.Farm.', '19880624 202221 2 001', 'Luh Ade Galuh Pratiwi', '', '', 'XII LPKKK 1', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Sinar Santi', 'Jln. Flamboyan No. 37 Semarapura, Kab. Klungkung'),
(124, 'Kadek Sari Cuciati, S.Farm.', '19880624 202221 2 001', 'Ni Wayan Nanda Pradnya Suari', '', '', 'XII LPKKK 1', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Tirta Farma', 'Jln. Raya Gelgel, Desa Gelgel, Kec Klungkung, Kab.Klungkung'),
(125, 'Kadek Sari Cuciati, S.Farm.', '19880624 202221 2 001', 'Elyska Kirana Putri', '', '', 'XII LPKKK 2', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Galiran', 'Jln. Puputan Semarapura No.108, Kab. Klungkung'),
(126, 'Kadek Sari Cuciati, S.Farm.', '19880624 202221 2 001', 'Mauli Diana Rahayu Putri', '', '', 'XII LPKKK 2', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Galiran', 'Jln. Puputan Semarapura No.108, Kab. Klungkung'),
(127, 'Kadek Sari Cuciati, S.Farm.', '19880624 202221 2 001', 'Ni Komang Sri Diah Lastari', '', '', 'XII LPKKK 2', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Galiran', 'Jln. Puputan Semarapura No.108, Kab. Klungkung'),
(128, 'Kadek Sari Cuciati, S.Farm.', '19880624 202221 2 001', 'Ni Putu Widya Wulandari', '', '', 'XII LPKKK 2', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Galiran', 'Jln. Puputan Semarapura No.108, Kab. Klungkung'),
(129, 'Ida Bagus Gde Agung Raditya Eka Putra, S.Fa', '19890205 202221 1 002', 'Ni Kadek Dian Candra Pratiwi', '', '', 'XII LPKKK 1', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Permata Farma', 'Jln.Plawa No.3A Semarapura Klod, Kab.Klungkung'),
(130, 'Ida Bagus Gde Agung Raditya Eka Putra, S.Fa', '19890205 202221 1 002', 'Ni Komang Widya Krista Yanti', '', '', 'XII LPKKK 1', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Permata Farma', 'Jln.Plawa No.3A Semarapura Klod, Kab.Klungkung'),
(131, 'Ida Bagus Gde Agung Raditya Eka Putra, S.Fa', '19890205 202221 1 002', 'Ni Wayan Ani Arthayasih', '', '', 'XII LPKKK 1', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Permata Farma', 'Jln.Plawa No.3A Semarapura Klod, Kab.Klungkung'),
(132, 'Ida Bagus Gde Agung Raditya Eka Putra, S.Fa', '19890205 202221 1 002', 'Yoneda Yebleb', '', '', 'XII LPKKK 1', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Permata Farma', 'Jln.Plawa No.3A Semarapura Klod, Kab.Klungkung'),
(133, 'Ida Bagus Gde Agung Raditya Eka Putra, S.Fa', '19890205 202221 1 002', 'I Gusti Ayu Indah Pertiwi', '', '', 'XII LPKKK 2', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Sekar Sari', 'Jln. Raya Takmung, No. 01 X Desa Takmung, Kab. Klungkung'),
(134, 'Ida Bagus Gde Agung Raditya Eka Putra, S.Fa', '19890205 202221 1 002', 'Ni Komang Leges Aria Sentani', '', '', 'XII LPKKK 2', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Sekar Sari', 'Jln. Raya Takmung, No. 01 X Desa Takmung, Kab. Klungkung'),
(135, 'Ida Bagus Gde Agung Raditya Eka Putra, S.Fa', '19890205 202221 1 002', 'Ni Luh Komang Divya Santhi', '', '', 'XII LPKKK 2', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Sekar Sari', 'Jln. Raya Takmung, No. 01 X Desa Takmung, Kab. Klungkung'),
(136, 'Ida Bagus Gde Agung Raditya Eka Putra, S.Fa', '19890205 202221 1 002', 'Ni Putu Galih Pratiwi Setiawan', '', '', 'XII LPKKK 2', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Sekar Sari', 'Jln. Raya Takmung, No. 01 X Desa Takmung, Kab. Klungkung'),
(137, 'I Wayan Warjana, S.Pd.', '19900604 202221 1 002', 'Dwi Retno Ayu Ningrum', '', '', 'XII TKJ', 'Teknik Komputer dan Jaringan', 'PT. GAYA MASA TEKNIKA', 'Jl. Pohon Jati, Sanur, Denpasar Selatan, Kota Denpasar, Bali'),
(138, 'Anak Agung Istri Eka Putri Sadiningtyas, S.Pd', '19910502 202221 2 005', 'I Gede Adi Putra', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / IBM SUKAWATI', 'Jl. By Pass Ida Bagus Mantra Lingk. Gelumpang, Desa Sukawati, Kec. Sukawati, Kab. Gianyar'),
(139, 'Anak Agung Istri Eka Putri Sadiningtyas, S.Pd', '19910502 202221 2 005', 'Ni Komang Trisna Yuni Astari', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / IBM SUKAWATI', 'Jl. By Pass Ida Bagus Mantra Lingk. Gelumpang, Desa Sukawati, Kec. Sukawati, Kab. Gianyar'),
(140, 'Anak Agung Istri Eka Putri Sadiningtyas, S.Pd', '19910502 202221 2 005', 'I Ketut Alit Rupawan', '', '', 'XII BD 2', 'Bisnis Digital', 'Koperasi Nirmala', 'Jl. Raya By Pass Ida Bagus Mantra Desa Lepang, Klungkung'),
(141, 'I Gede Adi Wirapradnyana, S.Pd.', '19910522 202221 1 002', 'Ni Komang Bintang Triasih', '', '', 'XII AK', 'Akuntansi', 'Hotel Komune -Gianyar', 'Jl Pantai Keramas Gianyar'),
(142, 'I Gede Adi Wirapradnyana, S.Pd.', '19910522 202221 1 002', 'Pande Made Shasmita Aurellia Putri', '', '', 'XII AK', 'Akuntansi', 'Maua Olea Ubud', 'Jl. Raya Pengosekan, Mas, Kecamatan Ubud, Kabupaten Gianyar, Bali 80571'),
(143, 'Dewa Ayu Putu Putri Sanjani, S.Pd.', '19920407 202221 2 004', 'Akbar Alfiansah', '', '', 'XII TKJ', 'Teknik Komputer dan Jaringan', 'CV. BALI MEDIA COMPUTAMA (BMC)', 'Jl. Pantai Purnama, Sukawati, Kec. Sukawati, Kab. Gianyar, Bali'),
(144, 'Dewa Ayu Putu Putri Sanjani, S.Pd.', '19920407 202221 2 004', 'I Gede Adtya Wedha Paramartha', '', '', 'XII TKJ', 'Teknik Komputer dan Jaringan', 'CV. BALI MEDIA COMPUTAMA (BMC)', 'Jl. Pantai Purnama, Sukawati, Kec. Sukawati, Kab. Gianyar, Bali'),
(145, 'Dewa Ayu Putu Putri Sanjani, S.Pd.', '19920407 202221 2 004', 'Made Pradnya Wahyu Radheya', '', '', 'XII TKJ', 'Teknik Komputer dan Jaringan', 'CV. BALI MEDIA COMPUTAMA (BMC)', 'Jl. Pantai Purnama, Sukawati, Kec. Sukawati, Kab. Gianyar, Bali'),
(146, 'Dewa Ayu Putu Putri Sanjani, S.Pd.', '19920407 202221 2 004', 'I Komang Giri Artawan', '', '', 'XII TKJ', 'Teknik Komputer dan Jaringan', 'PT. NANDIKA INTI GLOBAL', 'Jalan Matahari X, Desa Satra, Kec. Klungkung, Kab. Klungkung, Bali'),
(147, 'Dewa Ayu Putu Putri Sanjani, S.Pd.', '19920407 202221 2 004', 'Rizky Adib Irlan Syah', '', '', 'XII TKJ', 'Teknik Komputer dan Jaringan', 'PT. NANDIKA INTI GLOBAL', 'Jalan Matahari X, Desa Satra, Kec. Klungkung, Kab. Klungkung, Bali'),
(148, 'Dewa Ayu Putu Putri Sanjani, S.Pd.', '19920407 202221 2 004', 'Rizqy Al Farraby', '', '', 'XII TKJ', 'Teknik Komputer dan Jaringan', 'PT. NANDIKA INTI GLOBAL', 'Jalan Matahari X, Desa Satra, Kec. Klungkung, Kab. Klungkung, Bali'),
(149, 'Sri Reswati, S.Farm.', '19920422 202221 2 003', 'Ni Kadek Bintang Nopiani', '', '', 'XII LPKKK 2', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Banjarangkan Farma', 'Jln. Raya Banjarangkan No.36 Kec. Banjarangkan Kab. Klungkung'),
(150, 'Sri Reswati, S.Farm.', '19920422 202221 2 003', 'Ni Komang Anggraeni', '', '', 'XII LPKKK 2', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Banjarangkan Farma', 'Jln. Raya Banjarangkan No.36 Kec. Banjarangkan Kab. Klungkung');
INSERT INTO `siswa_pkl` (`no_urut`, `guru`, `nip`, `siswa`, `nis`, `nisn`, `kelas`, `jurusan`, `tempat`, `alamat`) VALUES
(151, 'Sri Reswati, S.Farm.', '19920422 202221 2 003', 'Ni Wayan Novi Lestari', '', '', 'XII LPKKK 2', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Visual Farma II', 'Dsn. Tengah Desa Akah ,Kec Klungkung ,Kab.Klungkung'),
(152, 'Sri Reswati, S.Farm.', '19920422 202221 2 003', 'Gusti Ayu Putu Alita Bintang Lestari', '', '', 'XII LPKKK 2', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Banjarangkan Farma', 'Jln. Raya Banjarangkan No.36 Kec. Banjarangkan Kab. Klungkung'),
(153, 'Putu Sri Satri Dewi, S.Pd.', '19940427 202221 2 002', 'Pande Ni Putu Adisty Kusuma Jati', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL KABUPATEN KLUNGKUNG', 'Jl. Flamboyan No.27, Semarapura Kelod, Klungkung'),
(154, 'Putu Sri Satri Dewi, S.Pd.', '19940427 202221 2 002', 'Ni Made Suci Manik Astari', '', '', 'XII MP 2', 'Manajemen Perkantoran', 'UPTD PPRD KABUPATEN KLUNGKUNG (SAMSAT KLUNGKUNG)', 'Jalan Ngurah Rai No.3, Semarapura Kauh, Kec. Klungkung, Kabupaten Klungkung, Bali 80711'),
(155, 'Putu Sri Satri Dewi, S.Pd.', '19940427 202221 2 002', 'Ni Putu Mei Wulandari', '', '', 'XII MP 2', 'Manajemen Perkantoran', 'UPTD PPRD KABUPATEN KLUNGKUNG (SAMSAT KLUNGKUNG)', 'Jalan Ngurah Rai No.3, Semarapura Kauh, Kec. Klungkung, Kabupaten Klungkung, Bali 80711'),
(156, 'Ni Komang Martini, S.Pd.', '19750501 202221 2 004', 'Ni Kadek Ayu Melani Ratna Dewi', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'Satya Studio Digital Printing', 'Jl. Ngurah Rai, Semarapura Tengah, Kec. Klungkung, Kab. Klungkung, Bali'),
(157, 'Ni Komang Martini, S.Pd.', '19750501 202221 2 004', 'I Dewa Ayu Awidiya Sari', '', '', 'XII AK', 'Akuntansi', 'KUD Panca Satya Dawan', 'Jl. Sawo Kabeh, Desa Dawan Kelod, Kec. Dawan, Klungkung'),
(158, 'Ni Komang Martini, S.Pd.', '19750501 202221 2 004', 'Ni Luh Putu Candra Cahyani', '', '', 'XII AK', 'Akuntansi', 'KPP Pratama Gianyar', 'Jalan By Pass Dharma Giri Desa Buruan, Kec.Blahbatuh, Buruan, Kec. Gianyar'),
(159, 'I Dewa Gede Sudiana, S.Pd.', '19820227 202221 1 010', 'I Wayan Kartika Adi Putra', '', '', 'XII TKJ', 'Teknik Komputer dan Jaringan', 'PT. GAYA MASA TEKNIKA', 'Jl. Pohon Jati, Sanur, Denpasar Selatan, Kota Denpasar, Bali'),
(160, 'I Dewa Gede Sudiana, S.Pd.', '19820227 202221 1 010', 'Agus Billy Fedrico', '', '', 'XII LPKKK 1', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Tirta Farma', 'Jln. Raya Gelgel, Desa Gelgel, Kec Klungkung, Kab.Klungkung'),
(161, 'I Dewa Gede Sudiana, S.Pd.', '19820227 202221 1 010', 'Agus Eka Widya Pradnyana', '', '', 'XII LPKKK 1', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Tirta Farma', 'Jln. Raya Gelgel, Desa Gelgel, Kec Klungkung, Kab.Klungkung'),
(162, 'I Dewa Gede Sudiana, S.Pd.', '19820227 202221 1 010', 'Ni Putu Martini Lestari', '', '', 'XII LPKKK 2', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Visual Farma II', 'Dsn. Tengah Desa Akah ,Kec Klungkung ,Kab.Klungkung'),
(163, 'I Dewa Gede Sudiana, S.Pd.', '19820227 202221 1 010', 'I Made Agus Bayu Widi', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'PT. Nusantara Surya Sakti (NSS)', 'Jl. Kecubung, Semarapura Kelod, Kec. Klungkung, Kab. Klungkung, Bali'),
(164, 'I Dewa Gede Sudiana, S.Pd.', '19820227 202221 1 010', 'Lorensius Kaka Lalo', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'PT. Nusantara Surya Sakti (NSS)', 'Jl. Kecubung, Semarapura Kelod, Kec. Klungkung, Kab. Klungkung, Bali'),
(165, 'I Gusti Ayu Made Sri Rahayu, S.Pd.', '19900218 202221 2 022', 'I Putu Agus Pratama Putra', '', '', 'XII TKJ', 'Teknik Komputer dan Jaringan', 'ARIK COMPUTER', 'Jl. Ahmad Yani, Semarapura Kaja, Kec. Klungkung, Kab. Klungkung, Bali'),
(166, 'I Gusti Ayu Made Sri Rahayu, S.Pd.', '19900218 202221 2 022', 'I Kadek Dodik Ramayoga', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'PT. Nusantara Surya Sakti (NSS)', 'Jl. Kecubung, Semarapura Kelod, Kec. Klungkung, Kab. Klungkung, Bali'),
(167, 'I Gusti Ayu Made Sri Rahayu, S.Pd.', '19900218 202221 2 022', 'I Komang Bayu Septi Permana', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'PT. Nusantara Surya Sakti (NSS)', 'Jl. Kecubung, Semarapura Kelod, Kabupaten Klungkung, Bali'),
(168, 'A.A. Istri Raka Yuliantari, S.Pd.', '19900225 202221 2 027', 'I Putu Rendy Galang Permana', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'Bali Stars Promosindo Ubud', 'Jl. Cok Rai Pudak, Mas, Kecamatan Ubud, Kab. Gianyar, Bali'),
(169, 'A.A. Istri Raka Yuliantari, S.Pd.', '19900225 202221 2 027', 'Ni Putu Ghina Anastasia Putri', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'Bali Stars Promosindo Ubud', 'Jl. Cok Rai Pudak, Mas, Kecamatan Ubud, Kab. Gianyar, Bali'),
(170, 'A.A. Istri Raka Yuliantari, S.Pd.', '19900225 202221 2 027', 'Ni Putu Dewik', '', '', 'XII AK', 'Akuntansi', 'Koperasi Serba Usaha Nirmala Klungkung', 'Jl. Bypass. Prof Ida Bagus Mantra, Dusun Lepang, Desa Takmung Klungkung'),
(171, 'A.A. Istri Raka Yuliantari, S.Pd.', '19900225 202221 2 027', 'Ni Putu Dian Ambarwati', '', '', 'XII AK', 'Akuntansi', 'Koperasi Serba Usaha Nirmala Klungkung', 'Jl. Bypass. Prof Ida Bagus Mantra, Dusun Lepang, Desa Takmung Klungkung'),
(172, 'I Made Juniarta, S.Pd.', '19900604 202221 1 018', 'Ni Komang Ayu Santika', '', '', 'XII LPKKK 1', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Visual Farma II', 'Dsn. Tengah Desa Akah ,Kec Klungkung ,Kab.Klungkung'),
(173, 'I Nyoman Anom Widyadarma, S.Kom.', '19830913 202321 1 009', 'I Made Sugiarta', '', '', 'XII TKJ', 'Teknik Komputer dan Jaringan', 'PT. GAYA MASA TEKNIKA', 'Jl. Pohon Jati, Sanur, Denpasar Selatan, Kota Denpasar, Bali'),
(174, 'I Nyoman Anom Widyadarma, S.Kom.', '19830913 202321 1 009', 'I Putu Adi Ari Endrawan', '', '', 'XII TKJ', 'Teknik Komputer dan Jaringan', 'PT. GAYA MASA TEKNIKA', 'Jl. Pohon Jati, Sanur, Denpasar Selatan, Kota Denpasar, Bali'),
(175, 'I Nyoman Anom Widyadarma, S.Kom.', '19830913 202321 1 009', 'Komang Jano Artha', '', '', 'XII TKJ', 'Teknik Komputer dan Jaringan', 'PT. GAYA MASA TEKNIKA', 'Jl. Pohon Jati, Sanur, Denpasar Selatan, Kota Denpasar, Bali'),
(176, 'I Nyoman Anom Widyadarma, S.Kom.', '19830913 202321 1 009', 'Ni Ketut Sinta', '', '', 'XII TKJ', 'Teknik Komputer dan Jaringan', 'PT. GAYA MASA TEKNIKA', 'Jl. Pohon Jati, Sanur, Denpasar Selatan, Kota Denpasar, Bali'),
(177, 'I Nyoman Anom Widyadarma, S.Kom.', '19830913 202321 1 009', 'Ni Komang Sila Triana Sari', '', '', 'XII TKJ', 'Teknik Komputer dan Jaringan', 'PT. GAYA MASA TEKNIKA', 'Jl. Pohon Jati, Sanur, Denpasar Selatan, Kota Denpasar, Bali'),
(178, 'I Nyoman Anom Widyadarma, S.Kom.', '19830913 202321 1 009', 'I Putu Gede Eka Yogantara Pratmaja', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'Gede Duta Visual', 'Gg. Sari Indah No.4, Tonja, Kec. Denpasar Utara, Kota Denpasar, Bali'),
(179, 'I Nyoman Anom Widyadarma, S.Kom.', '19830913 202321 1 009', 'Raditya Nugraha', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'Gede Duta Visual', 'Gg. Sari Indah No.4, Tonja, Kec. Denpasar Utara, Kota Denpasar, Bali'),
(180, 'I Dewa Ayu Ketut Candrayani, S.Pd.H', '19850225 202321 2 016', 'M. Afgansyah Al-Maghfirah', '', '', 'XII TKJ', 'Teknik Komputer dan Jaringan', 'UD. PRIMA COMPUTER', 'Jl. Raya Batu Tabih, Takmung, Kec. Banjarangkan, Kab. Klungkung, Bali'),
(181, 'I Dewa Ayu Ketut Candrayani, S.Pd.H', '19850225 202321 2 016', 'I Desak Ketut Patniki Astuti', '', '', 'XII AK', 'Akuntansi', 'Hotel Whyndham Tamansari Jivva Resort Klungkung', 'Pantai Lepang, Jl. Subak Lepang No.16, Takmung, Kec. Banjarangkan'),
(182, 'I Dewa Ayu Ketut Candrayani, S.Pd.H', '19850225 202321 2 016', 'Ni Putu Dian Maharani', '', '', 'XII AK', 'Akuntansi', 'Hotel Whyndham Tamansari Jivva Resort Klungkung', 'Pantai Lepang, Jl. Subak Lepang No.16, Takmung, Kec. Banjarangkan'),
(183, 'I Dewa Ayu Ketut Candrayani, S.Pd.H', '19850225 202321 2 016', 'Ketut Mahardika', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'Karisma Motor', 'Jl. Untung Suropati No.15A, Semarapura Tengah, Kec. Klungkung, Kab. Klungkung, Bali'),
(184, 'I Dewa Ayu Ketut Candrayani, S.Pd.H', '19850225 202321 2 016', 'Nyoman Yudhi Triananda Wibawa', '', '', 'XII TSM', 'Teknik Sepeda Motor', 'Karisma Motor', 'Jl. Untung Suropati No.15A, Semarapura Tengah, Kec. Klungkung, Kab. Klungkung, Bali'),
(185, 'Ni Komang Ayu Widyaningsih, S.Pd', '19860123 202321 2 013', 'Nabila Tusak Diah', '', '', 'XII LPB', 'Layanan Perbankan', 'PT. BPR Tata Anjungsari Klungkung', 'Jl. Darmawangsa, No. 05 Semarapura'),
(186, 'Putu Doantara Yasa, S.Pd.', '19860317 202321 1 012', 'Agustinus Poka Mete', '', '', 'XII TKJ', 'Teknik Komputer dan Jaringan', 'CV. MELODY INDAH COMPUTER', 'Jl. Ngurah Rai Pertokoan Pasar Gianyar Blok III No 14 Gianyar, Kab. Gianyar, Bali'),
(187, 'Putu Doantara Yasa, S.Pd.', '19860317 202321 1 012', 'I Putu Pasek Prawira Putra', '', '', 'XII TKJ', 'Teknik Komputer dan Jaringan', 'CV. MELODY INDAH COMPUTER', 'Jl. Ngurah Rai Pertokoan Pasar Gianyar Blok III No 14 Gianyar, Kab. Gianyar, Bali'),
(188, 'Putu Doantara Yasa, S.Pd.', '19860317 202321 1 012', 'I Komang Raka Danaswara', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'Bali Stars Promosindo Gianyar', 'Jl. Dharma Giri, Gianyar, Kec. Gianyar, Kab. Gianyar, Bali'),
(189, 'Putu Doantara Yasa, S.Pd.', '19860317 202321 1 012', 'I Made Dharma Mahardika', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'Bali Stars Promosindo Gianyar', 'Jl. Dharma Giri, Gianyar, Kec. Gianyar, Kab. Gianyar, Bali'),
(190, 'Putu Doantara Yasa, S.Pd.', '19860317 202321 1 012', 'Komang Aditya', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'Bali Stars Promosindo Gianyar', 'Jl. Dharma Giri, Gianyar, Kec. Gianyar, Kab. Gianyar, Bali'),
(191, 'Putu Doantara Yasa, S.Pd.', '19860317 202321 1 012', 'Ni Kadek Ranita Dewi', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'Marvella', 'Jl. Astina Timur, Kec. Gianyar, Kab. Gianyar, Bali'),
(192, 'Putu Doantara Yasa, S.Pd.', '19860317 202321 1 012', 'Ni Putu Rismayani Darma Swari', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'Marvella', 'Jl. Astina Timur, Kec. Gianyar, Kab. Gianyar, Bali'),
(193, 'Putu Doantara Yasa, S.Pd.', '19860317 202321 1 012', 'Wayan Satya Dharma', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'Satya Studio Digital Printing', 'Jl. Ngurah Rai, Semarapura Tengah, Kec. Klungkung, Kab. Klungkung, Bali'),
(194, 'Ni Kadek Dewi Sutarini, S.Pd.', '19890518 202321 2 017', 'Dewa Ayu Made Dwi Artika Darmayanti', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / IBM NEGARI', 'Jl. By Pass Profesor Ida Bagus Mantra Lingk Negari, Kel. Negari, Kec. Banjarangkan, Kab. Klungkung'),
(195, 'Ni Kadek Dewi Sutarini, S.Pd.', '19890518 202321 2 017', 'Ni Komang Henny Herdi Yani', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / IBM NEGARI', 'Jl. By Pass Profesor Ida Bagus Mantra Lingk Negari, Kel. Negari, Kec. Banjarangkan, Kab. Klungkung'),
(196, 'Ni Kadek Dewi Sutarini, S.Pd.', '19890518 202321 2 017', 'Ni Made Sukma Yanti', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / BATU TABIH', 'Jl. Batu Tabih Ling Takmung Desa Takmung Kec. Banjarangkan, Kab. Klungkung'),
(197, 'Ni Kadek Dewi Sutarini, S.Pd.', '19890518 202321 2 017', 'Putu Aryadinata', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / BATU TABIH', 'Jl. Batu Tabih Ling Takmung Desa Takmung Kec. Banjarangkan, Kab. Klungkung'),
(198, 'Ni Kadek Dewi Sutarini, S.Pd.', '19890518 202321 2 017', 'Kadek Agus Apriana Bajesti Putra', '', '', 'XII BD 2', 'Bisnis Digital', 'Koperasi Nirmala', 'Jl. Raya By Pass Ida Bagus Mantra Desa Lepang, Klungkung'),
(199, 'Kadek Hariasih, S.Fil.H', '19900102 202321 2 024', 'Ni Luh Putu Frema Sugi Maharani', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / PESINGGAHAN', 'Jl. Raya Goa Lawah Link. Suwitra Yasa, Desa Pesinggahan, Kec. Dawan, Kab. Klungkung'),
(200, 'Kadek Hariasih, S.Fil.H', '19900102 202321 2 024', 'Ni Putu Sari Astuti', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / PESINGGAHAN', 'Jl. Raya Goa Lawah Link. Suwitra Yasa, Desa Pesinggahan, Kec. Dawan, Kab. Klungkung');
INSERT INTO `siswa_pkl` (`no_urut`, `guru`, `nip`, `siswa`, `nis`, `nisn`, `kelas`, `jurusan`, `tempat`, `alamat`) VALUES
(201, 'Kadek Hariasih, S.Fil.H', '19900102 202321 2 024', 'I Putu Aditya Suputra', '', '', 'XII BD 2', 'Bisnis Digital', 'Toko Bisma', 'Jl. Raya Gelgel, Desa Gelgel, Klungkung'),
(202, 'Kadek Hariasih, S.Fil.H', '19900102 202321 2 024', 'Ni Putu Intan Merliani Putri', '', '', 'XII LPKKK 1', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Galiran', 'Jln. Puputan Semarapura No.108, Kab. Klungkung'),
(203, 'Kadek Hariasih, S.Fil.H', '19900102 202321 2 024', 'Ni Kadek Winda Wulandewi', '', '', 'XII LPKKK 2', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Galiran', 'Jln. Puputan Semarapura No.108, Kab. Klungkung'),
(204, 'Luh Nyoman Satria Purnama Dewi, S.Pd.H', '19910429 202321 2 012', 'Gek Danaya Anindia', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'Mandala Gold', 'Jl. Kecubung, Semarapura Kelod, Kab. Klungkung'),
(205, 'Luh Nyoman Satria Purnama Dewi, S.Pd.H', '19910429 202321 2 012', 'Ni Luh Putu Sekar Darma Yanti', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'Mandala Gold', 'Jl. Kecubung, Semarapura Kelod, Kab. Klungkung'),
(206, 'Luh Nyoman Satria Purnama Dewi, S.Pd.H', '19910429 202321 2 012', 'Ni Kadek Sinta Widyantini', '', '', 'XII AK', 'Akuntansi', 'KUD Panca Satya Dawan', 'Jl. Sawo Kabeh, Desa Dawan Kelod, Kec. Dawan, Klungkung'),
(207, 'Luh Nyoman Satria Purnama Dewi, S.Pd.H', '19910429 202321 2 012', 'Ni Kadek Sanjiani', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / NGURAH RAI KLUNGKUNG', 'Jl. Ngurah Rai Ling. Pegending Kel. Semarapura Kauh, Kec. Klungkung, Kab. Klungkung'),
(208, 'Luh Nyoman Satria Purnama Dewi, S.Pd.H', '19910429 202321 2 012', 'Ni Putu Eka Candra Dewi', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / NGURAH RAI KLUNGKUNG', 'Jl. Ngurah Rai Ling. Pegending Kel. Semarapura Kauh, Kec. Klungkung, Kab. Klungkung'),
(209, 'Luh Nyoman Satria Purnama Dewi, S.Pd.H', '19910429 202321 2 012', 'I Kadek Desta Prawira', '', '', 'XII BD 2', 'Bisnis Digital', 'Koperasi Nirmala', 'Jl. Raya By Pass Ida Bagus Mantra Desa Lepang, Klungkung'),
(210, 'Ni Luh Ririn Liana Dewi, S.Pd.', '19930523 202321 2 034', 'I Gusti Ngurah Wijana', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / IBM KETEWEL', 'Jl. By Pass Ida Bagus Mantra Lingk. Subur, Kel. Ketewel, Kec. Sukawati, Kab. Gianyar'),
(211, 'Ni Luh Ririn Liana Dewi, S.Pd.', '19930523 202321 2 034', 'I Kadek Yogi Iswara', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / KETEWEL GIANYAR', 'Jl. By Pass Ida Bagus Mantra Lingk. Subur, Kel. Ketewel, Kec. Sukawati, Kab. Gianyar'),
(212, 'Ni Luh Ririn Liana Dewi, S.Pd.', '19930523 202321 2 034', 'I Nyoman Candra Paranarta', '', '', 'XII BD 1', 'Bisnis Digital', 'PT. Sumber Alfaria Trijaya Tbk / IBM KETEWEL', 'Jl. By Pass Ida Bagus Mantra Lingk. Subur, Kel. Ketewel, Kec. Sukawati, Kab. Gianyar'),
(213, 'Ni Luh Ririn Liana Dewi, S.Pd.', '19930523 202321 2 034', 'Ni Luh Nova Sinta Riari', '', '', 'XII BD 2', 'Bisnis Digital', 'UD Merta Sari', 'Jl. Raya Nandini No.7 Desa Kamasan Klungkung'),
(214, 'Ni Luh Ririn Liana Dewi, S.Pd.', '19930523 202321 2 034', 'Putu Vera Agustin', '', '', 'XII BD 2', 'Bisnis Digital', 'UD Merta Sari', 'Jl. Raya Nandini No.7 Desa Kamasan Klungkung'),
(215, 'I Wayan Suteja, S.Pd.', '19741025 202321 1 002', 'I Dewa Ayu Juniantari', '', '', 'XII MP 2', 'Manajemen Perkantoran', 'DINAS SOSIAL PEMBERDAYAAN PEREMPUAN DAN PERLINDUNGAN ANAK', 'Jl. Gajah Mada No. 70,Semarapura Tengah, Kec. Klungkung'),
(216, 'I Wayan Suteja, S.Pd.', '19741025 202321 1 002', 'Ni Kadek Puspa Aryanti', '', '', 'XII MP 2', 'Manajemen Perkantoran', 'DINAS SOSIAL PEMBERDAYAAN PEREMPUAN DAN PERLINDUNGAN ANAK', 'Jl. Gajah Mada No. 70,Semarapura Tengah, Kec. Klungkung'),
(217, 'Bambang Hadi Subrata, S.Pd.', '19871202 202321 1 008', 'Radit', '', '', 'XII TKJ', 'Teknik Komputer dan Jaringan', 'UD. PRIMA COMPUTER', 'Jl. Raya Batu Tabih, Takmung, Kec. Banjarangkan, Kab. Klungkung, Bali'),
(218, 'Bambang Hadi Subrata, S.Pd.', '19871202 202321 1 008', 'Rizka Nurdiandari', '', '', 'XII TKJ', 'Teknik Komputer dan Jaringan', 'UD. PRIMA COMPUTER', 'Jl. Raya Batu Tabih, Takmung, Kec. Banjarangkan, Kab. Klungkung, Bali'),
(219, 'Ida Ayu Desi Lestari, SH., M.Ag', '19811218 200604 2 016', 'I Gede Putra Sang Pajar', '', '', 'XII TKJ', 'Teknik Komputer dan Jaringan', 'UD. PRIMA COMPUTER', 'Jl. Raya Batu Tabih, Takmung, Kec. Banjarangkan, Kab. Klungkung, Bali'),
(220, 'Ida Ayu Desi Lestari, SH., M.Ag', '19811218 200604 2 016', 'Anak Agung Dewi Suryaningrat', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'KEMENTRIAN AGAMA KABUPATEN KLUNGKUNG', 'Jalan Gajah Mada No 72 Semarapura'),
(221, 'Ida Ayu Desi Lestari, SH., M.Ag', '19811218 200604 2 016', 'I Dewa Ayu Bulan Sriasih', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'KEMENTRIAN AGAMA KABUPATEN KLUNGKUNG', 'Jalan Gajah Mada No 72 Semarapura'),
(222, 'Ida Ayu Desi Lestari, SH., M.Ag', '19811218 200604 2 016', 'Ni Luh Lisna Diantari', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'KEMENTRIAN AGAMA KABUPATEN KLUNGKUNG', 'Jalan Gajah Mada No 72 Semarapura'),
(223, 'Ida Ayu Desi Lestari, SH., M.Ag', '19811218 200604 2 016', 'Ni Komang Adelia Putri', '', '', 'XII MP 2', 'Manajemen Perkantoran', 'UPTD PPRD KABUPATEN KLUNGKUNG (SAMSAT KLUNGKUNG)', 'Jalan Ngurah Rai No.3, Semarapura Kauh, Kec. Klungkung, Kabupaten Klungkung, Bali 80711'),
(224, 'Ida Ayu Desi Lestari, SH., M.Ag', '19811218 200604 2 016', 'Ni Putu Tia Dewi', '', '', 'XII MP 2', 'Manajemen Perkantoran', 'UPTD PPRD KABUPATEN KLUNGKUNG (SAMSAT KLUNGKUNG)', 'Jalan Ngurah Rai No.3, Semarapura Kauh, Kec. Klungkung, Kabupaten Klungkung, Bali 80711'),
(225, 'Ida Ayu Desi Lestari, SH., M.Ag', '19811218 200604 2 016', 'Putu Juli Ayu Antari', '', '', 'XII MP 2', 'Manajemen Perkantoran', 'UPTD PPRD KABUPATEN KLUNGKUNG (SAMSAT KLUNGKUNG)', 'Jalan Ngurah Rai No.3, Semarapura Kauh, Kec. Klungkung, Kabupaten Klungkung, Bali 80711'),
(226, 'I Wayan Dedy Artana, S.Pd', '19891231 202421 1 019', 'Munifa Inayatur Rohma', '', '', 'XII LPKKK 1', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Lestari', 'Jln. Flamboyan No.56, Semarapura Kauh, Kec. Klungkung, Kabupaten Klungkung'),
(227, 'I Gede Aris Widnyana Pratama, S.Pd.', '19990118 202421 1 010', 'Ni Kadek Suadnyani Megeng', '', '', 'XII AK', 'Akuntansi', 'KPP Pratama Gianyar', 'Jalan By Pass Dharma Giri Desa Buruan, Kec. Blahbatuh, Buruan, Kec. Gianyar'),
(228, 'I Gede Aris Widnyana Pratama, S.Pd.', '19990118 202421 1 010', 'Ni Putu Echa Setyawati', '', '', 'XII AK', 'Akuntansi', 'KPP Pratama Gianyar', 'Jalan By Pass Dharma Giri Desa Buruan, Kec.Blahbatuh, Buruan, Kec. Gianyar'),
(229, 'I Gede Aris Widnyana Pratama, S.Pd.', '19990118 202421 1 010', 'Ni Putu Eka Pandewi', '', '', 'XII AK', 'Akuntansi', 'KPP Pratama Gianyar', 'Jalan By Pass Dharma Giri Desa Buruan, Kec.Blahbatuh, Buruan, Kec. Gianyar'),
(230, 'I Gede Aris Widnyana Pratama, S.Pd.', '19990118 202421 1 010', 'Yenny Febri Yanthy Ningsih', '', '', 'XII AK', 'Akuntansi', 'Hotel Sanna Ubud', 'Jl. Tegallalang, Br. Tengah, Tegalalang, Gianyar, Bali'),
(231, 'I Gede Aris Widnyana Pratama, S.Pd.', '19990118 202421 1 010', 'Ni Ketut Melia Purnama Sari', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'PT. PLN (PERSERO) UP3 BALI TIMUR', 'Jalan Batu Tabih 53 Semarapura Klungkung'),
(232, 'I Gede Aris Widnyana Pratama, S.Pd.', '19990118 202421 1 010', 'Tiara Yuliyanti', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'PT. PLN (PERSERO) UP3 BALI TIMUR', 'Jalan Batu Tabih 53 Semarapura Klungkung'),
(233, 'Kade Ferry Apriyana, S.Pd.', '19940413 202421 1 021', 'Ni Made Ayu Dwi Apriliani', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'Marvella', 'Jl. Astina Timur, Kec. Gianyar, Kab. Gianyar, Bali'),
(234, 'Kade Ferry Apriyana, S.Pd.', '19940413 202421 1 021', 'Queena Bilqist Mulyadi Putri', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'Marvella', 'Jl. Astina Timur, Kec. Gianyar, Kab. Gianyar, Bali'),
(235, 'Kade Ferry Apriyana, S.Pd.', '19940413 202421 1 021', 'Anak Agung Gede Dika Pradipta', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'Sayonara Photo', 'Jl. Kesatrian No.7A, Gianyar, Kec. Gianyar, Kab. Gianyar, Bali'),
(236, 'Kade Ferry Apriyana, S.Pd.', '19940413 202421 1 021', 'I Gede Ary Kesuma Suputra', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'Sayonara Photo', 'Jl. Kesatrian No.7A, Gianyar, Kec. Gianyar, Kab. Gianyar, Bali'),
(237, 'Kade Ferry Apriyana, S.Pd.', '19940413 202421 1 021', 'I Gede Rian Primayoga', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'Sayonara Photo', 'Jl. Kesatrian No.7A, Gianyar, Kec. Gianyar, Kab. Gianyar, Bali'),
(238, 'Kade Ferry Apriyana, S.Pd.', '19940413 202421 1 021', 'I Made Wahyu Adikusuma', '', '', 'XII DKV', 'Desain Komunikasi Visual', 'Sayonara Photo', 'Jl. Kesatrian No.7A, Gianyar, Kec. Gianyar, Kab. Gianyar, Bali'),
(239, 'I Gusti Ayu Karla Komala Dewi, S.Pd.', '19870902 202421 2 019', 'Dewa Ayu Sri Widyastuti', '', '', 'XII LPKKK 1', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Sinar Santi', 'Jln. Flamboyan No. 37 Semarapura, Kab. Klungkung'),
(240, 'I Gusti Ayu Karla Komala Dewi, S.Pd.', '19870902 202421 2 019', 'I Komang Edi Setiawan.', '', '', 'XII LPKKK 1', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Radika', 'Jln. Raya banjarangkan No.53 Kec. Banjarangkan Kab. Klungkung'),
(241, 'I Gusti Ayu Karla Komala Dewi, S.Pd.', '19870902 202421 2 019', 'Ni Kadek Evinayanti', '', '', 'XII LPKKK 1', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Sinar Santi', 'Jln. Flamboyan No. 37 Semarapura, Kab. Klungkung'),
(242, 'I Gusti Ayu Karla Komala Dewi, S.Pd.', '19870902 202421 2 019', 'Ni Made Juniari', '', '', 'XII LPKKK 1', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Radika', 'Jln. Raya banjarangkan No.53 Kec. Banjarangkan Kab. Klungkung'),
(243, 'I Gusti Ayu Karla Komala Dewi, S.Pd.', '19870902 202421 2 019', 'Aisyah Dwi Agusthina', '', '', 'XII LPKKK 2', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Griya Candra', 'Jln. Raya Besakih No.125, Ds. Akah, Kec, Klungkung, Kab. Klungkung'),
(244, 'I Gusti Ayu Karla Komala Dewi, S.Pd.', '19870902 202421 2 019', 'Ni Komang Tri Maetarani', '', '', 'XII LPKKK 2', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Griya Candra', 'Jln. Raya Besakih No.125, Ds. Akah, Kec, Klungkung, Kab. Klungkung'),
(245, 'I Gusti Ayu Karla Komala Dewi, S.Pd.', '19870902 202421 2 019', 'Ni Komang Trisna Dewi', '', '', 'XII LPKKK 2', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Griya Candra', 'Jln. Raya Besakih No.125, Ds. Akah, Kec, Klungkung, Kab. Klungkung'),
(246, 'I Gusti Ayu Karla Komala Dewi, S.Pd.', '19870902 202421 2 019', 'Rizqiana Ayudianingsih', '', '', 'XII LPKKK 2', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Griya Candra', 'Jln. Raya Besakih No.125, Ds. Akah, Kec, Klungkung, Kab. Klungkung'),
(247, 'P. Mirah Marlia Suari, S.Pd.', '19860310 202521 2 102', 'I Wayan Agus Septiadi', '', '', 'XII AK', 'Akuntansi', 'Koperasi Sri Amerta Semaya Klungkung', 'Jl. Kenyeri XIV No 18 Galiran Klungkung'),
(248, 'P. Mirah Marlia Suari, S.Pd.', '19860310 202521 2 102', 'Ni Putu Stefany Devita Putri', '', '', 'XII AK', 'Akuntansi', 'PT Federal International Finance - Klungkung', 'Jl Ngurah Rai No 17 Klungkung'),
(249, 'P. Mirah Marlia Suari, S.Pd.', '19860310 202521 2 102', 'Ni Putu Wita Sinta Pradnyani', '', '', 'XII AK', 'Akuntansi', 'PT Federal International Finance - Klungkung', 'Jl Ngurah Rai No 17 Klungkung'),
(250, 'P. Mirah Marlia Suari, S.Pd.', '19860310 202521 2 102', 'Ni Kadek Ayu Lestari', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL KABUPATEN KLUNGKUNG', 'Jl. Flamboyan No.27, Semarapura Kelod, Klungkung');
INSERT INTO `siswa_pkl` (`no_urut`, `guru`, `nip`, `siswa`, `nis`, `nisn`, `kelas`, `jurusan`, `tempat`, `alamat`) VALUES
(251, 'P. Mirah Marlia Suari, S.Pd.', '19860310 202521 2 102', 'Ni Kadek Risna Kumala Dewi', '', '', 'XII MP 1', 'Manajemen Perkantoran', 'DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL KABUPATEN KLUNGKUNG', 'Jl. Flamboyan No.27, Semarapura Kelod, Klungkung'),
(252, 'P. Mirah Marlia Suari, S.Pd.', '19860310 202521 2 102', 'Ni Komang Indah Jesika Dewi', '', '', 'XII MP 2', 'Manajemen Perkantoran', 'DINAS SOSIAL PEMBERDAYAAN PEREMPUAN DAN PERLINDUNGAN ANAK', 'Jl. Gajah Mada No. 70,Semarapura Tengah, Kec. Klungkung'),
(253, 'P. Mirah Marlia Suari, S.Pd.', '19860310 202521 2 102', 'Ni Putu Eka Semara Putri', '', '', 'XII MP 2', 'Manajemen Perkantoran', 'DINAS SOSIAL PEMBERDAYAAN PEREMPUAN DAN PERLINDUNGAN ANAK', 'Jl. Gajah Mada No. 70,Semarapura Tengah, Kec. Klungkung'),
(254, 'P. Mirah Marlia Suari, S.Pd.', '19860310 202521 2 102', 'Ni Putu Puspawati', '', '', 'XII MP 2', 'Manajemen Perkantoran', 'DINAS SOSIAL PEMBERDAYAAN PEREMPUAN DAN PERLINDUNGAN ANAK', 'Jl. Gajah Mada No. 70,Semarapura Tengah, Kec. Klungkung'),
(255, 'Luh Gd. Karisma Widiantari, S.Farm.Apt.', '-', 'I Dewa Ayu Dwi Cahya Indrayani', '', '', 'XII LPKKK 1', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Karisma', 'Jln. Bima Sampalan Tengah Kab. Klungkung'),
(256, 'Luh Gd. Karisma Widiantari, S.Farm.Apt.', '-', 'Ni Kadek Ayu Arsani', '', '', 'XII LPKKK 1', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Karisma', 'Jln. Bima Sampalan Tengah Kab. Klungkung'),
(257, 'Luh Gd. Karisma Widiantari, S.Farm.Apt.', '-', 'Ni Kadek Diah Dwi Adnyani', '', '', 'XII LPKKK 1', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Karisma', 'Jln. Bima Sampalan Tengah kab. Klungkung'),
(258, 'Luh Gd. Karisma Widiantari, S.Farm.Apt.', '-', 'Ni Made Shita Wulandari', '', '', 'XII LPKKK 1', 'Layanan Kefarmasian Klinis dan Komunitas', 'Apotek Karisma', 'Jln. Bima Sampalan Tengah Kab. Klungkung');
UNLOCK TABLES;

-- --------------------------------------------------------
-- Struktur Tabel: pengaturan
-- --------------------------------------------------------
DROP TABLE IF EXISTS `pengaturan`;
CREATE TABLE `pengaturan` (
  `kunci` VARCHAR(100) NOT NULL,
  `nilai` MEDIUMTEXT NOT NULL,
  `kategori` VARCHAR(50) DEFAULT 'umum',
  `keterangan` TEXT,
  PRIMARY KEY (`kunci`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data Pengaturan Lembaga & Aplikasi
LOCK TABLES `pengaturan` WRITE;
INSERT INTO `pengaturan` (`kunci`, `nilai`, `kategori`, `keterangan`) VALUES
('namaSekolah', 'SMKN 1 FYJ Channel', 'lembaga', 'Nama resmi sekolah / instansi'),
('subJudulSekolah', 'SMKN 1 FYJ Channel • Tahun Ajaran 2026/2027', 'lembaga', 'Sub-judul sekolah di kop dan header'),
('alamatSekolah', 'Jalan Subali II, Banjar Siku, Desa Kamasan Telp. (0366) 23520 Klungkung', 'lembaga', 'Alamat lengkap instansi'),
('kepsekNama', 'Sri Rejeki, S.Pd., M.Pd.', 'kepsek', 'Nama lengkap dan gelar Kepala Sekolah'),
('kepsekPangkat', 'Pembina (IV/a)', 'kepsek', 'Pangkat dan golongan ruang Kepala Sekolah'),
('kepsekNip', '19770309 200903 2 010', 'kepsek', 'Nomor Induk Pegawai (NIP) Kepala Sekolah'),
('tahunAjaran', '2026/2027', 'jadwal', 'Tahun ajaran aktif pelaksanaan PKL'),
('periodePkl', '13 November 2026 sampai dengan 30 April 2027', 'jadwal', 'Rentang periode PKL'),
('tglPelepasan', '13 November 2026', 'jadwal', 'Tanggal pelepasan / pengantaran siswa ke DU/DI'),
('tglPenarikan', '30 April 2027', 'jadwal', 'Tanggal penarikan siswa dari DU/DI'),
('tglSurat', '06 Oktober 2026', 'jadwal', 'Tanggal penerbitan surat pengantar resmi'),
('noSurat', 'B.10.000/9546/SMKN1KLK/DIKPORA', 'jadwal', 'Nomor surat dinas standar'),
('kopUrl', '', 'media', 'Path / URL kustom kop surat (kosong = bawaan kop_fyj.png)'),
('ttdUrl', '', 'media', 'Path / URL kustom TTD barcode elektronik (kosong = bawaan ttdelektronik.jpg)'),
('ttdBasahUrl', '', 'media', 'Path / URL kustom TTD basah (kosong = bawaan ttd_basah.png)'),
('logoWebUrl', '', 'media', 'Path / URL kustom logo web aplikasi (kosong = bawaan logo_fyj.png)');
UNLOCK TABLES;

-- --------------------------------------------------------
-- Struktur Tabel: template_surat
-- --------------------------------------------------------
DROP TABLE IF EXISTS `template_surat`;
CREATE TABLE `template_surat` (
  `id` VARCHAR(100) NOT NULL,
  `nama` VARCHAR(255) NOT NULL,
  `html_content` MEDIUMTEXT NOT NULL,
  `is_default` TINYINT(1) DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data Template Surat Resmi
LOCK TABLES `template_surat` WRITE;
INSERT INTO `template_surat` (`id`, `nama`, `html_content`, `is_default`, `status`) VALUES ('tpl_standar_resmi', 'Template Standar Resmi SMKN 1 FYJ Channel', '<p style="margin-bottom: 8px;">Dengan hormat,</p>
<p style="text-indent: 30px; margin-bottom: 8px; text-align: justify;">
  Dalam rangka pelaksanaan kegiatan Praktek Kerja Lapangan (PKL) bagi siswa/siswi {namaSekolah} Tahun Ajaran {tahunAjaran}, bersama ini kami menugaskan guru pembimbing untuk menyerahkan sekaligus mengantarkan siswa/siswi kami melaksanakan PKL di perusahaan/instansi yang Bapak/Ibu pimpin.
</p>
<p style="margin-bottom: 4px;">Adapun identitas Guru Pembimbing yang ditugaskan adalah sebagai berikut:</p>
<table style="width: 100%; margin-left: 20px; margin-bottom: 10px;">
  <tr>
    <td style="width: 130px; vertical-align: top;">Nama</td>
    <td style="width: 20px; vertical-align: top;">:</td>
    <td style="font-weight: bold; vertical-align: top;">{guruNama}</td>
  </tr>
  <tr>
    <td style="vertical-align: top;">NIP</td>
    <td style="vertical-align: top;">:</td>
    <td style="vertical-align: top;">{guruNip}</td>
  </tr>
  <tr>
    <td style="vertical-align: top;">Tempat PKL</td>
    <td style="vertical-align: top;">:</td>
    <td style="font-weight: bold; vertical-align: top;">{tempatPkl}</td>
  </tr>
</table>
<p style="text-indent: 30px; margin-bottom: 8px; text-align: justify;">
  Siswa yang diserahkan berjumlah sebagaimana terlampir, dan kegiatan PKL akan dilaksanakan terhitung mulai tanggal {periodePkl}.
</p>
<p style="text-indent: 30px; margin-bottom: 8px; text-align: justify;">
  Demikian surat pengantar ini kami sampaikan, atas bantuan dan kerja sama yang baik kami ucapkan terima kasih.
</p>', 1, 'active');
INSERT INTO `template_surat` (`id`, `nama`, `html_content`, `is_default`, `status`) VALUES ('tpl_surat_keterangan_pkl', 'Surat Keterangan PKL', '<p style="margin-bottom: 8px;">Yang bertanda tangan dibawah ini :</p>
<table style="width: 100%; margin-left: 20px; margin-bottom: 12px; font-size: 11pt;">
  <tr>
    <td style="width: 130px; vertical-align: top;">Nama</td>
    <td style="width: 15px; vertical-align: top;">:</td>
    <td style="font-weight: bold; vertical-align: top;">{kepsekNama}</td>
  </tr>
  <tr>
    <td style="vertical-align: top;">NIP</td>
    <td style="vertical-align: top;">:</td>
    <td style="vertical-align: top;">{kepsekNip}</td>
  </tr>
  <tr>
    <td style="vertical-align: top;">Pangkat/Gol</td>
    <td style="vertical-align: top;">:</td>
    <td style="vertical-align: top;">{kepsekPangkat}</td>
  </tr>
  <tr>
    <td style="vertical-align: top;">Jabatan</td>
    <td style="vertical-align: top;">:</td>
    <td style="vertical-align: top;">Kepala {namaSekolah}</td>
  </tr>
  <tr>
    <td style="vertical-align: top;">Unit Kerja</td>
    <td style="vertical-align: top;">:</td>
    <td style="vertical-align: top;">{namaSekolah}</td>
  </tr>
</table>

<p style="margin-bottom: 8px;">Menerangkan kepada yang tersebut dibawah ini bahwa:</p>
<table style="width: 100%; margin-left: 20px; margin-bottom: 12px; font-size: 11pt;">
  <tr>
    <td style="width: 130px; vertical-align: top;">Nama</td>
    <td style="width: 15px; vertical-align: top;">:</td>
    <td style="font-weight: bold; vertical-align: top;">{siswaNama}</td>
  </tr>
  <tr>
    <td style="vertical-align: top;">NIS/NISN</td>
    <td style="vertical-align: top;">:</td>
    <td style="vertical-align: top;">{siswaNisNisn}</td>
  </tr>
  <tr>
    <td style="vertical-align: top;">Jurusan</td>
    <td style="vertical-align: top;">:</td>
    <td style="vertical-align: top;">{siswaJurusan}</td>
  </tr>
</table>

<p style="text-indent: 30px; margin-bottom: 12px; text-align: justify; line-height: 1.5;">
  Adalah benar telah melaksanakan PKL di <strong>{tempatPkl}</strong> selama 6 bulan dan yang bersangkutan telah melaksanakan tugasnya dengan baik dan penuh penuh tanggung jawab.
</p>

<p style="text-indent: 30px; margin-bottom: 14px; text-align: justify; line-height: 1.5;">
  Demikian Surat Keterangan ini dibuat dengan benar untuk digunakan sebagaimana mestinya.
</p>', 0, 'active');
INSERT INTO `template_surat` (`id`, `nama`, `html_content`, `is_default`, `status`) VALUES ('tpl_surat_permohonan_pkl_murid', 'Surat Permohonan PKL Murid', '<table style="width: 100%; margin-bottom: 12px; font-size: 11pt; border-collapse: collapse; font-family: ''Arial Narrow'', Arial, sans-serif;">
  <tr>
    <td style="width: 80px; vertical-align: top;">Nomor</td>
    <td style="width: 15px; vertical-align: top;">:</td>
    <td style="vertical-align: top;">{noSurat}</td>
  </tr>
  <tr>
    <td style="vertical-align: top;">Lampiran</td>
    <td style="vertical-align: top;">:</td>
    <td style="vertical-align: top;">-</td>
  </tr>
  <tr>
    <td style="vertical-align: top;">Perihal</td>
    <td style="vertical-align: top;">:</td>
    <td style="vertical-align: top; font-weight: bold;">Permohonan Penerimaan Murid<br>Praktek Kerja Lapangan (PKL)</td>
  </tr>
</table>

<div style="margin-bottom: 12px; font-size: 11pt; font-family: ''Arial Narrow'', Arial, sans-serif;">
  <div>Kepada</div>
  <div>Yth. Bapak/Ibu Pimpinan <strong>{tempatPkl}</strong></div>
  <div>di</div>
  <div>Tempat</div>
</div>

<p style="margin-bottom: 8px; font-size: 11pt; font-family: ''Arial Narrow'', Arial, sans-serif;">Dengan hormat,</p>
<p style="text-indent: 30px; margin-bottom: 10px; text-align: justify; line-height: 1.4; font-size: 11pt; font-family: ''Arial Narrow'', Arial, sans-serif;">
  Sesuai dengan kurikulum {namaSekolah} terkait dengan Praktek Kerja Lapangan (PKL) murid kelas {tingkatKelas}, maka kami mohon bantuan Bapak/Ibu untuk dapat kiranya menerima murid kami konsentrasi keahlian {jurusanPkl} untuk melaksanakan Praktek Kerja Lapangan (PKL) pada perusahaan yang Bapak/Ibu pimpin. Adapun kegiatan PKL tersebut akan dilaksanakan pada tanggal {periodePkl}.
</p>
<p style="margin-bottom: 8px; font-size: 11pt; font-family: ''Arial Narrow'', Arial, sans-serif;">Adapun nama murid kami, sebagai berikut:</p>

{tabelSiswaPermohonan}

<p style="text-indent: 30px; margin-top: 10px; margin-bottom: 12px; text-align: justify; line-height: 1.4; font-size: 11pt; font-family: ''Arial Narrow'', Arial, sans-serif;">
  Demikian yang dapat kami sampaikan atas kerjasama Bapak/Ibu kami ucapkan terimakasih.
</p>', 0, 'active');
INSERT INTO `template_surat` (`id`, `nama`, `html_content`, `is_default`, `status`) VALUES ('tpl_pkl_terpadu', 'Template PKL Model Terpadu / Fleksibel', '<p style="margin-bottom: 8px;">Dengan hormat,</p>
<p style="text-indent: 30px; margin-bottom: 8px; text-align: justify;">
  Sehubungan dengan program kurikulum vokasi {namaSekolah} Tahun Ajaran {tahunAjaran}, kami bermaksud mendelegasikan siswa/siswi kami untuk melaksanakan kegiatan Praktek Kerja Lapangan (PKL) terpadu di perusahaan/instansi yang Bapak/Ibu pimpin.
</p>
<p style="margin-bottom: 4px;">Bersama surat ini, kami menugaskan guru pembimbing sebagai narahubung resmi:</p>
<table style="width: 100%; margin-left: 20px; margin-bottom: 10px;">
  <tr>
    <td style="width: 110px;">Nama</td>
    <td style="width: 15px;">:</td>
    <td style="font-weight: bold;">{guruNama}</td>
  </tr>
  <tr>
    <td>NIP</td>
    <td>:</td>
    <td>{guruNip}</td>
  </tr>
  <tr>
    <td>Jabatan</td>
    <td>:</td>
    <td>Guru Pembimbing PKL</td>
  </tr>
</table>
<p style="margin-bottom: 4px;">Adapun rincian jadwal pelaksanaan program PKL adalah sebagai berikut:</p>
<ol style="margin-left: 20px; margin-bottom: 10px; list-style-type: decimal;">
  <li style="padding-left: 4px;">Pelepasan siswa/siswi PKL: <strong>{tglPelepasan}</strong>.</li>
  <li style="padding-left: 4px;">Masa PKL &amp; Evaluasi Berkala: <strong>{periodePkl}</strong>. Monitoring dilaksanakan secara berkala untuk mengevaluasi perkembangan kompetensi siswa.</li>
  <li style="padding-left: 4px;">Penarikan resmi siswa: <strong>{tglPenarikan}</strong>.</li>
</ol>
<p style="text-indent: 30px; margin-bottom: 14px; text-align: justify;">
  Rincian nama siswa/siswi terlampir pada Lampiran 2 surat ini. Besar harapan kami agar kerja sama yang baik antara institusi pendidikan dan DU/DI terus terjalin erat. Atas perhatian dan kesediaan Bapak/Ibu, kami haturkan terima kasih.
</p>', 0, 'active');
UNLOCK TABLES;

-- --------------------------------------------------------
-- View: Rekap Pembimbing & Rekap Tempat PKL
-- --------------------------------------------------------
CREATE OR REPLACE VIEW `v_rekap_guru` AS
SELECT `guru`, `nip`, COUNT(*) AS `total_siswa`, GROUP_CONCAT(DISTINCT `tempat` SEPARATOR ', ') AS `tempat_pkl_list`
FROM `siswa_pkl` GROUP BY `guru`, `nip`;

CREATE OR REPLACE VIEW `v_rekap_tempat` AS
SELECT `tempat`, `alamat`, COUNT(*) AS `total_siswa`, GROUP_CONCAT(DISTINCT `kelas` SEPARATOR ', ') AS `kelas_list`
FROM `siswa_pkl` GROUP BY `tempat`, `alamat`;

SET FOREIGN_KEY_CHECKS = 1;
-- [SELESAI] Sinkronisasi database selesai.
