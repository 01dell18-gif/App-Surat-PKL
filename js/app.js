// Helper: Save or Download Blob cleanly across browsers
function saveAsOrDownload(blob, fileName) {
  if (typeof saveAs !== 'undefined') {
    saveAs(blob, fileName);
  } else {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Helper: Get active students list for batch operations based on current mode and filter
function getActiveBatchStudents() {
  if (AppState.selectedMode === 'per-guru') {
    const curGuru = AppState.gurus[AppState.selectedGuruIdx];
    if (!curGuru) return AppState.records;
    let list = curGuru.siswa;
    if (AppState.selectedTempatFilter !== 'all') {
      list = list.filter(s => s.tempat === AppState.selectedTempatFilter);
    }
    if (AppState.selectedSiswaFilterPerGuru && AppState.selectedSiswaFilterPerGuru !== 'all') {
      list = list.filter(s => s.siswa === AppState.selectedSiswaFilterPerGuru);
    }
    return list.length > 0 ? list : curGuru.siswa;
  } else if (AppState.selectedMode === 'per-du-di') {
    const curPlace = AppState.places[AppState.selectedDuDiIdx];
    if (!curPlace) return AppState.records;
    let list = curPlace.siswa;
    if (AppState.selectedSiswaFilterPerDuDi && AppState.selectedSiswaFilterPerDuDi !== 'all') {
      list = list.filter(s => s.siswa === AppState.selectedSiswaFilterPerDuDi);
    }
    return list.length > 0 ? list : curPlace.siswa;
  } else {
    return AppState.records;
  }
}

// Helper: Deduce major (Jurusan) from class name (Kelas)
function getJurusanFromKelas(kelas) {
  if (!kelas) return '';
  const k = kelas.toString().toUpperCase().trim();
  if (k.includes('BD')) return 'Bisnis Digital';
  if (k.includes('DKV')) return 'Desain Komunikasi Visual';
  if (k.includes('AK')) return 'Akuntansi dan Keuangan Lembaga';
  if (k.includes('LPKKK') || k.includes('LPK')) return 'Layanan Perbankan Syariah';
  if (k.includes('LPB')) return 'Layanan Perbankan';
  if (k.includes('MP')) return 'Manajemen Perkantoran';
  if (k.includes('TKJ')) return 'Teknik Komputer dan Jaringan';
  if (k.includes('TSM')) return 'Teknik Sepeda Motor';
  return '';
}

// Auto-fill jurusan input when user types kelas in student modal
function autoFillJurusan(kelas) {
  const jurInput = document.getElementById('studentFormJurusan');
  if (jurInput && (!jurInput.value || jurInput.dataset.autofilled === 'true')) {
    const j = getJurusanFromKelas(kelas);
    if (j) {
      jurInput.value = j;
      jurInput.dataset.autofilled = 'true';
    }
  }
}

/**
 * Aplikasi Surat Pengantar PKL - SMKN 1 FYJ Channel
 * Frontend Application Logic (Template Management & WYSIWYG Edition v2.2)
 */

// Default Official Templates
const DEFAULT_TEMPLATES = [
  {
    id: 'tpl_standar_resmi',
    name: 'Template Standar Resmi SMKN 1 FYJ Channel',
    isDefault: true,
    status: 'active',
    createdAt: '2026-11-03',
    htmlContent: `<p style="margin-bottom: 8px;">Dengan hormat,</p>
<p style="text-indent: 30px; margin-bottom: 8px; text-align: justify;">
  Dalam rangka pelaksanaan kegiatan Praktek Kerja Lapangan (PKL) bagi siswa/siswi {namaSekolah} Tahun Ajaran {tahunAjaran}, bersama ini kami menugaskan guru pembimbing untuk menyerahkan sekaligus mengantarkan siswa/siswi kami melaksanakan PKL di perusahaan/instansi yang Bapak/Ibu pimpin.
</p>
<p style="margin-bottom: 4px;">Adapun identitas Guru Pembimbing yang ditugaskan adalah sebagai berikut:</p>
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
<p style="margin-bottom: 4px;">Sehubungan dengan hal tersebut, berikut kami sampaikan beberapa informasi terkait teknis pelaksanaan PKL:</p>
<ol style="margin-left: 20px; margin-bottom: 10px; list-style-type: decimal;">
  <li style="padding-left: 4px;">Pelepasan siswa/siswi PKL dilaksanakan pada tanggal <strong>{tglPelepasan}</strong>.</li>
  <li style="padding-left: 4px;">Pelaksanaan &amp; Monitoring PKL: Kegiatan PKL berlangsung mulai tanggal <strong>{periodePkl}</strong>. Selama periode tersebut, guru pembimbing akan melaksanakan kegiatan monitoring PKL secara berkala setiap seminggu sekali.</li>
  <li style="padding-left: 4px;">Penarikan siswa/siswi dari tempat PKL akan dilaksanakan pada tanggal <strong>{tglPenarikan}</strong>.</li>
</ol>
<p style="text-indent: 30px; margin-bottom: 14px; text-align: justify;">
  Daftar nama siswa/siswi peserta Praktek Kerja Lapangan (PKL) terlampir dalam surat ini. Demikian surat pengantar ini kami sampaikan. Atas perhatian, bimbingan, dan kerja sama yang baik dari Bapak/Ibu, kami ucapkan terima kasih.
</p>`
  },
  {
    id: 'tpl_pkl_terpadu',
    name: 'Template PKL Model Terpadu / Fleksibel',
    isDefault: false,
    status: 'inactive',
    createdAt: '2026-11-03',
    htmlContent: `<p style="margin-bottom: 8px;">Dengan hormat,</p>
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
</p>`
  },
  {
    id: 'tpl_surat_keterangan_pkl',
    name: 'Surat Keterangan PKL (Contoh Surat Keterangan PKL.docx)',
    isDefault: false,
    status: 'active',
    createdAt: '2026-11-04',
    htmlContent: `<p style="margin-bottom: 8px;">Yang bertanda tangan dibawah ini :</p>
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
    <td style="vertical-align: top;">NIS</td>
    <td style="vertical-align: top;">:</td>
    <td style="vertical-align: top;">{siswaNis}</td>
  </tr>
  <tr>
    <td style="vertical-align: top;">NISN</td>
    <td style="vertical-align: top;">:</td>
    <td style="vertical-align: top;">{siswaNisn}</td>
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
</p>`
  }
];

// Default Application & Institution Settings
const DEFAULT_APP_SETTINGS = {
  namaSekolah: 'SMKN 1 FYJ Channel',
  subJudulSekolah: 'SMKN 1 FYJ Channel • Tahun Ajaran 2026/2027',
  alamatSekolah: 'Jalan Subali II, Banjar Siku, Desa Kamasan Telp. (0366) 23520 Klungkung',
  kepsekNama: 'Sri Rejeki, S.Pd., M.Pd.',
  kepsekPangkat: 'Pembina (IV/a)',
  kepsekNip: '19770309 200903 2 010',
  tahunAjaran: '2026/2027',
  periodePkl: '13 November 2026 sampai dengan 30 April 2027',
  tglPelepasan: '13 November 2026',
  tglPenarikan: '30 April 2027',
  tglSurat: '06 Oktober 2026',
  noSurat: 'B.10.000/9546/SMKN1KLK/DIKPORA',
  kopUrl: '',
  ttdUrl: '',
  ttdBasahUrl: '',
  logoWebUrl: ''
};

// Application State
const AppState = {
  records: [],
  gurus: [],
  places: [],
  selectedMode: 'per-guru', // 'per-guru' | 'per-du-di' | 'per-siswa'
  selectedGuruIdx: 0,
  selectedTempatFilter: 'all',
  selectedDuDiIdx: 0,
  selectedSiswaFilterPerGuru: 'all',
  selectedSiswaFilterPerDuDi: 'all',
  selectedSiswaIdx: 0,
  
  // Settings Dokumen & Lembaga
  appSettings: Object.assign({}, DEFAULT_APP_SETTINGS),
  docSettings: null, // Initialized in loadStoredSettings

  // Templates State
  templates: [],
  activeTemplateId: 'tpl_standar_resmi',
  editingTemplateId: 'tpl_standar_resmi',
  isHtmlSourceMode: false,

  // Display Options
  displayOptions: {
    paperSize: 'f4', // 'f4' | 'a4'
    showKop: true,
    showTtd: true,
    showAlamat: true,
    zoom: 100
  },

  // Filter & Search in Database view
  dbSearchQuery: '',
  dbFilterKelas: 'all',
  isDatabaseConnected: false
};

// Initialize Application
function initApp() {
  loadStoredSettings();
  loadStoredRecords();
  loadStoredTemplates();
  rebuildIndices();
  populateDropdowns();
  populateSidebarTemplateSelect();
  setupEventListeners();
  setupDropdownDismiss();
  applyAppSettingsToUI();
  syncSidebarInputs();
  updateUIFromState();
  renderPreview();
  if (window.lucide) {
    lucide.createIcons();
  }
  // Check and sync with SQLite Database backend
  checkAndSyncDatabaseBackend();
}

// Load Application Settings from localStorage or DEFAULT_APP_SETTINGS
function loadStoredSettings() {
  try {
    const saved = localStorage.getItem('pkl_app_settings');
    if (saved) {
      AppState.appSettings = Object.assign({}, DEFAULT_APP_SETTINGS, JSON.parse(saved));
      // Otomatis migrasikan nama default sekolah lama jika ada sisa cache di peramban
      const oldVariants = ['SMK Negeri 1 Klungkung', 'SMK Negeri FYJ Channel', 'SMK FYJ Channel', 'SMK Negeri 1 KLUNGKUNG', 'SMKN 1 Klungkung'];
      if (oldVariants.includes(AppState.appSettings.namaSekolah)) {
        AppState.appSettings.namaSekolah = DEFAULT_APP_SETTINGS.namaSekolah;
      }
      if (!AppState.appSettings.subJudulSekolah || AppState.appSettings.subJudulSekolah.includes('Klungkung') || AppState.appSettings.subJudulSekolah.includes('SMK FYJ Channel') || AppState.appSettings.subJudulSekolah.includes('SMK Negeri FYJ Channel')) {
        AppState.appSettings.subJudulSekolah = DEFAULT_APP_SETTINGS.subJudulSekolah;
      }
    } else {
      AppState.appSettings = Object.assign({}, DEFAULT_APP_SETTINGS);
    }
  } catch (e) {
    console.error('Error loading settings from storage:', e);
    AppState.appSettings = Object.assign({}, DEFAULT_APP_SETTINGS);
  }
  AppState.docSettings = AppState.appSettings;
}

// Save Application Settings to localStorage
function saveSettingsToStorage() {
  try {
    localStorage.setItem('pkl_app_settings', JSON.stringify(AppState.appSettings));
  } catch (e) {
    console.error('Error saving settings to storage:', e);
  }
}

// Helper: Get Active Kop Surat (Custom or Default Base64/File)
function getKopSrc() {
  if (AppState.appSettings && AppState.appSettings.kopUrl) {
    return AppState.appSettings.kopUrl;
  }
  return (typeof ASSETS !== 'undefined' && ASSETS.kop) ? ASSETS.kop : 'assets/images/kop_fyj.png';
}

// Helper: Get Active TTD Elektronik (Custom or Default Base64/File)
function getTtdSrc() {
  if (AppState.appSettings && AppState.appSettings.ttdUrl) {
    return AppState.appSettings.ttdUrl;
  }
  return (typeof ASSETS !== 'undefined' && ASSETS.ttd) ? ASSETS.ttd : 'assets/images/ttdelektronik.jpg';
}

// Helper: Get Active TTD Basah (Custom or Default ttd_basah.png)
function getTtdBasahSrc() {
  if (AppState.appSettings && AppState.appSettings.ttdBasahUrl) {
    return AppState.appSettings.ttdBasahUrl;
  }
  return (typeof ASSETS !== 'undefined' && ASSETS.ttdBasah) ? ASSETS.ttdBasah : 'assets/images/ttd_basah.png';
}

// Helper: Get Active Web Logo (Custom or Default logo_fyj.png)
function getLogoWebSrc() {
  if (AppState.appSettings && AppState.appSettings.logoWebUrl) {
    return AppState.appSettings.logoWebUrl;
  }
  return (typeof ASSETS !== 'undefined' && ASSETS.logo) ? ASSETS.logo : 'assets/images/logo_fyj.png';
}

// Helper: Get Active Signature Block HTML (Dynamic Electronic Box vs Wet Signature) for Preview & Print
function getTtdHtml(ds, dOpt) {
  if (dOpt.showTtd) {
    if (AppState.appSettings.ttdUrl) {
      return `
        <div style="margin: 6px 0; text-align: left;">
          <img src="${AppState.appSettings.ttdUrl}" alt="TTD Elektronik" style="width: 220px; height: auto; display: block;">
        </div>
      `;
    } else {
      const logoBaliSrc = (typeof ASSETS !== 'undefined' && ASSETS.logoBali) ? ASSETS.logoBali : 'assets/images/logo_bali.png';
      const namaSekolahUpper = (AppState.appSettings.namaSekolah || ds.namaSekolah || 'SMKN 1 FYJ CHANNEL').toUpperCase();
      return `
        <div style="margin: 6px 0; display: inline-flex; align-items: center; border: 1.5px solid #666; background: #ffffff; padding: 5px 8px; width: 235px; box-sizing: border-box; gap: 8px; font-family: Arial, sans-serif; text-align: left;">
          <img src="${logoBaliSrc}" alt="Logo Bali" style="width: 48px; height: 50px; object-fit: contain; flex-shrink: 0; display: block;" onerror="this.src='assets/images/logo_bali.png'">
          <div style="font-size: 6.8pt; line-height: 1.25; color: #111; overflow: hidden;">
            <div style="text-decoration: underline; font-size: 6.2pt; margin-bottom: 2px; white-space: nowrap;">Ditandatangani secara elektronik oleh :</div>
            <div style="font-weight: bold; font-size: 7.2pt; line-height: 1.2;">KEPALA ${escapeXml(namaSekolahUpper)}</div>
            <div style="font-weight: bold; font-size: 7pt; margin-top: 2px;">${escapeXml(ds.kepsekNama)}</div>
            <div style="font-size: 6.8pt; color: #333;">${escapeXml(ds.kepsekPangkat)}</div>
            <div style="font-size: 6.8pt; color: #333;">NIP. ${escapeXml(ds.kepsekNip)}</div>
          </div>
        </div>
      `;
    }
  } else {
    // 2. TTD Basah (ttd_basah.png) + Nama & NIP
    const ttdBasahSrc = getTtdBasahSrc();
    return `
      <div style="margin: 4px 0 6px 0; text-align: left;">
        <img src="${ttdBasahSrc}" alt="TTD Basah Kepala Sekolah" style="width: 175px; height: auto; display: block;">
      </div>
      <div style="font-weight: bold; text-decoration: underline; font-size: 11pt;">${escapeXml(ds.kepsekNama)}</div>
      <div style="font-size: 10pt;">${escapeXml(ds.kepsekPangkat)}</div>
      <div style="font-size: 10pt;">NIP. ${escapeXml(ds.kepsekNip)}</div>
    `;
  }
}

// Apply App Settings to Header, Favicon, and Document UI
function applyAppSettingsToUI() {
  const s = AppState.appSettings;

  // Browser Window / Tab Title
  document.title = `Aplikasi Surat Pengantar PKL - ${s.namaSekolah}`;

  // Header Subtitle
  const subEl = document.getElementById('headerSchoolSubtitle');
  if (subEl) {
    subEl.textContent = `${s.namaSekolah} • Tahun Ajaran ${s.tahunAjaran}`;
  }

  // Header Brand Logo
  const brandWrapper = document.getElementById('headerBrandLogoWrapper');
  const activeLogo = getLogoWebSrc();
  if (brandWrapper) {
    brandWrapper.innerHTML = `<img src="${activeLogo}" alt="Logo Web" class="w-full h-full object-contain p-0.5">`;
  }

  // Browser Favicon
  let fav = document.getElementById('appFavicon');
  if (!fav) {
    fav = document.createElement('link');
    fav.id = 'appFavicon';
    fav.rel = 'icon';
    fav.type = 'image/png';
    document.head.appendChild(fav);
  }
  fav.href = activeLogo;

  // Signature School Name
  const docNamaSekolahTtd = document.getElementById('docNamaSekolahTtd');
  if (docNamaSekolahTtd) {
    docNamaSekolahTtd.textContent = s.namaSekolah;
  }
}

// Synchronize Sidebar Input Fields with Current App Settings
function syncSidebarInputs() {
  const s = AppState.appSettings;
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.value = val;
  };

  setVal('inputNoSurat', s.noSurat);
  setVal('inputTglSurat', s.tglSurat);
  setVal('inputTahunAjaran', s.tahunAjaran);
  setVal('inputTglPelepasan', s.tglPelepasan);
  setVal('inputPeriodePkl', s.periodePkl);
  setVal('inputTglPenarikan', s.tglPenarikan);
  setVal('inputKepsekNama', s.kepsekNama);
  setVal('inputKepsekPangkat', s.kepsekPangkat);
  setVal('inputKepsekNip', s.kepsekNip);
}

// Load data from localStorage or DEFAULT_PKL_DATA
function loadStoredRecords() {
  try {
    const saved = localStorage.getItem('pkl_records_data');
    let loaded = null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Pastikan data yang disimpan memiliki field nis dan jurusan
          const sample = parsed[0];
          if (sample && typeof sample.jurusan !== 'undefined') {
            loaded = parsed;
          }
        }
      } catch (err) {}
    }
    if (!loaded) {
      if (typeof INITIAL_PKL_RECORDS !== 'undefined' && Array.isArray(INITIAL_PKL_RECORDS) && INITIAL_PKL_RECORDS.length > 0) {
        loaded = [...INITIAL_PKL_RECORDS];
      } else if (typeof DEFAULT_PKL_DATA !== 'undefined' && Array.isArray(DEFAULT_PKL_DATA) && DEFAULT_PKL_DATA.length > 0) {
        loaded = [...DEFAULT_PKL_DATA];
      }
    }
    AppState.records = loaded || [];
  } catch (e) {
    console.error('Error loading saved records:', e);
    AppState.records = (typeof INITIAL_PKL_RECORDS !== 'undefined') ? [...INITIAL_PKL_RECORDS] : ((typeof DEFAULT_PKL_DATA !== 'undefined') ? [...DEFAULT_PKL_DATA] : []);
  }
}

// Save records to localStorage
function saveRecordsToStorage() {
  try {
    localStorage.setItem('pkl_records_data', JSON.stringify(AppState.records));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

// Load templates from localStorage or DEFAULT_TEMPLATES
function loadStoredTemplates() {
  try {
    const savedTemplates = localStorage.getItem('pkl_saved_templates_list');
    let needsSave = false;
    if (savedTemplates) {
      AppState.templates = JSON.parse(savedTemplates);
      // Sinkronkan template bawaan baru jika belum ada di cache browser pengguna
      // Sinkronkan selalu template keterangan bawaan jika masih versi lama
      const ketTpl = AppState.templates.find(t => t.id === 'tpl_surat_keterangan_pkl');
      const defKet = DEFAULT_TEMPLATES.find(t => t.id === 'tpl_surat_keterangan_pkl');
      if (ketTpl && defKet && (ketTpl.htmlContent.includes('{siswaKelas} / {siswaJurusan}') || ketTpl.htmlContent.includes('Jurusan</td>\n    <td style="vertical-align: top;">:</td>\n    <td style="vertical-align: top;">{siswaKelas}</td>'))) {
        ketTpl.htmlContent = defKet.htmlContent;
        needsSave = true;
      }
      DEFAULT_TEMPLATES.forEach(defTpl => {
        const found = AppState.templates.find(t => t.id === defTpl.id);
        if (!found) {
          AppState.templates.push(JSON.parse(JSON.stringify(defTpl)));
          needsSave = true;
        } else {
          // Perbarui nama dan isi html template bawaan ke versi terbaru
          found.name = defTpl.name;
          found.htmlContent = defTpl.htmlContent;
          needsSave = true;
        }
      });
    } else {
      AppState.templates = JSON.parse(JSON.stringify(DEFAULT_TEMPLATES));
      needsSave = true;
    }

    if (needsSave) {
      saveTemplatesToStorage();
    }

    const savedActiveId = localStorage.getItem('pkl_active_template_id');
    if (savedActiveId && AppState.templates.some(t => t.id === savedActiveId)) {
      AppState.activeTemplateId = savedActiveId;
    } else {
      AppState.activeTemplateId = AppState.templates[0].id;
    }
    AppState.editingTemplateId = AppState.activeTemplateId;
  } catch (e) {
    console.error('Error loading templates:', e);
    AppState.templates = JSON.parse(JSON.stringify(DEFAULT_TEMPLATES));
    AppState.activeTemplateId = AppState.templates[0].id;
    AppState.editingTemplateId = AppState.activeTemplateId;
    saveTemplatesToStorage();
  }
}

// Save templates to localStorage
function saveTemplatesToStorage() {
  try {
    localStorage.setItem('pkl_saved_templates_list', JSON.stringify(AppState.templates));
    localStorage.setItem('pkl_active_template_id', AppState.activeTemplateId);
  } catch (e) {
    console.error('Error saving templates:', e);
  }
}

// Get active template object
function getActiveTemplate() {
  return AppState.templates.find(t => t.id === AppState.activeTemplateId) || AppState.templates[0] || DEFAULT_TEMPLATES[0];
}

// Get editing template object
function getEditingTemplate() {
  return AppState.templates.find(t => t.id === AppState.editingTemplateId) || getActiveTemplate();
}

// Rebuild Guru and Tempat indices
function rebuildIndices() {
  const guruMap = new Map();
  const placeMap = new Map();

  AppState.records.forEach((r, idx) => {
    // Group Guru
    const gName = r.guru || 'Tanpa Guru';
    if (!guruMap.has(gName)) {
      guruMap.set(gName, {
        guru: gName,
        nip: r.nip || '-',
        siswa: [],
        tempatList: new Set()
      });
    }
    const gEntry = guruMap.get(gName);
    gEntry.siswa.push(r);
    if (r.tempat) gEntry.tempatList.add(r.tempat);

    // Group DU/DI (Tempat PKL)
    const pName = r.tempat || 'Tanpa Tempat';
    if (!placeMap.has(pName)) {
      placeMap.set(pName, {
        tempat: pName,
        alamat: r.alamat || '',
        siswa: [],
        gurus: new Map()
      });
    }
    const pEntry = placeMap.get(pName);
    pEntry.siswa.push(r);
    if (!pEntry.gurus.has(gName)) {
      pEntry.gurus.set(gName, { guru: gName, nip: r.nip, siswa: [] });
    }
    pEntry.gurus.get(gName).siswa.push(r);
  });

  AppState.gurus = Array.from(guruMap.values()).map(g => ({
    ...g,
    tempatList: Array.from(g.tempatList)
  }));

  AppState.places = Array.from(placeMap.values()).map(p => ({
    ...p,
    gurus: Array.from(p.gurus.values())
  }));

  // Update Stats in Header
  const statSiswa = document.getElementById('statTotalSiswa');
  const statGuru = document.getElementById('statTotalGuru');
  const statDuDi = document.getElementById('statTotalDuDi');
  if (statSiswa) statSiswa.textContent = AppState.records.length;
  if (statGuru) statGuru.textContent = AppState.gurus.length;
  if (statDuDi) statDuDi.textContent = AppState.places.length;
}

// Populate Dropdown Menus
function populateDropdowns() {
  // 1. Populate Guru Dropdown
  const guruSelect = document.getElementById('guruSelect');
  if (guruSelect) {
    guruSelect.innerHTML = '';
    AppState.gurus.forEach((g, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = `${idx + 1}. ${g.guru} (${g.siswa.length} Siswa)`;
      guruSelect.appendChild(opt);
    });
    if (AppState.selectedGuruIdx >= AppState.gurus.length) {
      AppState.selectedGuruIdx = 0;
    }
    guruSelect.value = AppState.selectedGuruIdx;
  }

  // 2. Populate Tempat Filter Dropdown for Selected Guru
  updateTempatFilterDropdown();

  // 3. Populate Siswa Filter Dropdown for Selected Guru
  updateSiswaFilterPerGuruDropdown();

  // 4. Populate DU/DI Select for Mode Per Tempat PKL
  const dudiSelect = document.getElementById('dudiSelect');
  if (dudiSelect) {
    dudiSelect.innerHTML = '';
    AppState.places.forEach((p, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = `${idx + 1}. ${p.tempat} (${p.siswa.length} Siswa)`;
      dudiSelect.appendChild(opt);
    });
    if (AppState.selectedDuDiIdx >= AppState.places.length) {
      AppState.selectedDuDiIdx = 0;
    }
    dudiSelect.value = AppState.selectedDuDiIdx;
  }

  // 5. Populate Siswa Filter Dropdown for Selected DU/DI
  updateSiswaFilterPerDuDiDropdown();

  // 6. Populate Siswa Select for Mode Per Siswa
  populateSiswaSelect();
}

// Update Sub-dropdown of Students for currently selected Guru
function updateSiswaFilterPerGuruDropdown() {
  const sel = document.getElementById('siswaFilterSelectPerGuru');
  if (!sel) return;
  const currentGuru = AppState.gurus[AppState.selectedGuruIdx];
  if (!currentGuru) return;

  let students = currentGuru.siswa;
  if (AppState.selectedTempatFilter !== 'all') {
    students = students.filter(s => s.tempat === AppState.selectedTempatFilter);
  }

  sel.innerHTML = '';
  const optAll = document.createElement('option');
  optAll.value = 'all';
  optAll.textContent = `★ Semua Siswa (${students.length} Siswa)`;
  sel.appendChild(optAll);

  students.forEach((s, idx) => {
    const opt = document.createElement('option');
    opt.value = s.siswa;
    opt.textContent = `${idx + 1}. ${s.siswa} (${s.kelas})`;
    sel.appendChild(opt);
  });

  const validVals = ['all', ...students.map(s => s.siswa)];
  if (!validVals.includes(AppState.selectedSiswaFilterPerGuru)) {
    AppState.selectedSiswaFilterPerGuru = 'all';
  }
  sel.value = AppState.selectedSiswaFilterPerGuru;
}

// Update Sub-dropdown of Students for currently selected DU/DI
function updateSiswaFilterPerDuDiDropdown() {
  const sel = document.getElementById('siswaFilterSelectPerDuDi');
  if (!sel) return;
  const currentPlace = AppState.places[AppState.selectedDuDiIdx];
  if (!currentPlace) return;

  const students = currentPlace.siswa;
  sel.innerHTML = '';
  const optAll = document.createElement('option');
  optAll.value = 'all';
  optAll.textContent = `★ Semua Siswa (${students.length} Siswa)`;
  sel.appendChild(optAll);

  students.forEach((s, idx) => {
    const opt = document.createElement('option');
    opt.value = s.siswa;
    opt.textContent = `${idx + 1}. ${s.siswa} (${s.kelas})`;
    sel.appendChild(opt);
  });

  const validVals = ['all', ...students.map(s => s.siswa)];
  if (!validVals.includes(AppState.selectedSiswaFilterPerDuDi)) {
    AppState.selectedSiswaFilterPerDuDi = 'all';
  }
  sel.value = AppState.selectedSiswaFilterPerDuDi;
}

// Populate Per-Siswa Mode Dropdown
function populateSiswaSelect() {
  const sel = document.getElementById('siswaSelect');
  if (!sel) return;
  sel.innerHTML = '';

  AppState.records.forEach((r, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = `${idx + 1}. ${r.siswa} - ${r.kelas} (${r.tempat || '-'})`;
    sel.appendChild(opt);
  });

  if (AppState.selectedSiswaIdx >= AppState.records.length) {
    AppState.selectedSiswaIdx = 0;
  }
  sel.value = AppState.selectedSiswaIdx;
}

// Populate Sidebar Template Selector

function populateEditorTemplateSelect() {
  const sel = document.getElementById('editorTemplateSelect');
  if (!sel) return;
  sel.innerHTML = '';
  AppState.templates.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    const isAct = t.id === AppState.activeTemplateId;
    opt.textContent = (isAct ? '★ ' : '  ') + t.name;
    if (t.id === (AppState.editingTemplateId || AppState.activeTemplateId)) {
      opt.selected = true;
    }
    sel.appendChild(opt);
  });
}

function onEditorTemplateSelectChange() {
  const sel = document.getElementById('editorTemplateSelect');
  if (!sel) return;
  loadTemplateIntoEditor(sel.value);
}

function populateSidebarTemplateSelect() {
  const select = document.getElementById('sidebarTemplateSelect');
  if (!select) return;
  select.innerHTML = '';
  AppState.templates.forEach((t) => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = (t.id === AppState.activeTemplateId ? '★ ' : '• ') + t.name;
    if (t.id === AppState.activeTemplateId) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
}

function onSidebarTemplateChange() {
  const select = document.getElementById('sidebarTemplateSelect');
  if (!select) return;
  setActiveTemplate(select.value);
}

// Update Sub-dropdown of Places for currently selected Guru
function updateTempatFilterDropdown() {
  const tempatSelect = document.getElementById('tempatFilterSelect');
  if (!tempatSelect) return;

  const currentGuru = AppState.gurus[AppState.selectedGuruIdx];
  if (!currentGuru) return;

  tempatSelect.innerHTML = '';
  const optAll = document.createElement('option');
  optAll.value = 'all';
  optAll.textContent = `★ Semua Lokasi PKL (${currentGuru.siswa.length} Siswa)`;
  tempatSelect.appendChild(optAll);

  currentGuru.tempatList.forEach(t => {
    const sCount = currentGuru.siswa.filter(s => s.tempat === t).length;
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = `• ${t} (${sCount} Siswa)`;
    tempatSelect.appendChild(opt);
  });

  tempatSelect.value = AppState.selectedTempatFilter;
}

// Dropdown Helper Functions
function toggleDropdown(menuId) {
  const targetMenu = document.getElementById(menuId);
  if (!targetMenu) return;
  const isHidden = targetMenu.classList.contains('hidden');
  closeAllDropdowns();
  if (isHidden) {
    targetMenu.classList.remove('hidden');
  }
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-menu-list').forEach(m => m.classList.add('hidden'));
}

function setupDropdownDismiss() {
  window.addEventListener('click', (e) => {
    if (!e.target.closest('#dropdownCetakWrapper') && 
        !e.target.closest('#dropdownUnduhWrapper') && 
        !e.target.closest('#dropdownExcelWrapper')) {
      closeAllDropdowns();
    }
  });
}

// Setup Event Listeners
function setupEventListeners() {
  // Input fields for document settings
  const bindInput = (id, stateKey) => {
    const el = document.getElementById(id);
    if (el) {
      el.value = (AppState.appSettings && AppState.appSettings[stateKey]) || '';
      el.addEventListener('input', (e) => {
        AppState.appSettings[stateKey] = e.target.value;
        AppState.docSettings[stateKey] = e.target.value;
        saveSettingsToStorage();
        if (stateKey === 'tahunAjaran' || stateKey === 'namaSekolah') {
          applyAppSettingsToUI();
        }
        renderPreview();
      });
    }
  };

  bindInput('inputNoSurat', 'noSurat');
  bindInput('inputTglSurat', 'tglSurat');
  bindInput('inputTglPelepasan', 'tglPelepasan');
  bindInput('inputPeriodePkl', 'periodePkl');
  bindInput('inputTglPenarikan', 'tglPenarikan');
  bindInput('inputTahunAjaran', 'tahunAjaran');
  bindInput('inputKepsekNama', 'kepsekNama');
  bindInput('inputKepsekNip', 'kepsekNip');
  bindInput('inputKepsekPangkat', 'kepsekPangkat');

  // Paper Size Selector
  const paperSelect = document.getElementById('paperSizeSelect');
  if (paperSelect) {
    paperSelect.value = AppState.displayOptions.paperSize;
    paperSelect.addEventListener('change', (e) => {
      AppState.displayOptions.paperSize = e.target.value;
      updatePaperSizeClass();
    });
  }

  // Toggles
  const toggleKop = document.getElementById('toggleKop');
  if (toggleKop) {
    toggleKop.checked = AppState.displayOptions.showKop;
    toggleKop.addEventListener('change', (e) => {
      AppState.displayOptions.showKop = e.target.checked;
      renderPreview();
    });
  }

  const toggleTtd = document.getElementById('toggleTtd');
  if (toggleTtd) {
    toggleTtd.checked = AppState.displayOptions.showTtd;
    toggleTtd.addEventListener('change', (e) => {
      AppState.displayOptions.showTtd = e.target.checked;
      renderPreview();
    });
  }

  const toggleAlamat = document.getElementById('toggleAlamat');
  if (toggleAlamat) {
    toggleAlamat.checked = AppState.displayOptions.showAlamat;
    toggleAlamat.addEventListener('change', (e) => {
      AppState.displayOptions.showAlamat = e.target.checked;
      renderPreview();
    });
  }

  // Live Quick Search Input
  const quickSearchInput = document.getElementById('quickSearchInput');
  if (quickSearchInput) {
    quickSearchInput.addEventListener('input', handleQuickSearch);
  }

  // Excel File Input for Upload
  const excelFileInput = document.getElementById('excelFileInput');
  if (excelFileInput) {
    excelFileInput.addEventListener('change', handleExcelUpload);
  }
}

// Update paper size css class on document container and inject dynamic @page print CSS
function updatePaperSizeClass() {
  const isF4 = (AppState.displayOptions.paperSize || 'f4') === 'f4';
  const pages = document.querySelectorAll('.doc-page');
  pages.forEach(p => {
    p.classList.remove('paper-f4', 'paper-a4');
    p.classList.add(isF4 ? 'paper-f4' : 'paper-a4');
  });

  let styleEl = document.getElementById('dynamicPrintPageStyle');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'dynamicPrintPageStyle';
    document.head.appendChild(styleEl);
  }
  if (isF4) {
    styleEl.innerHTML = `@media print { @page { size: 215mm 330mm; margin: 12mm 15mm 15mm 20mm; } }`;
  } else {
    styleEl.innerHTML = `@media print { @page { size: 210mm 297mm; margin: 12mm 15mm 15mm 20mm; } }`;
  }
}

// Switch between Selection Modes: 'per-guru' vs 'per-du-di' vs 'per-siswa'
function setSelectionMode(mode) {
  AppState.selectedMode = mode;
  const btnPerGuru = document.getElementById('btnModePerGuru');
  const btnPerDuDi = document.getElementById('btnModePerDuDi');
  const btnPerSiswa = document.getElementById('btnModePerSiswa');
  const panelPerGuru = document.getElementById('panelPerGuru');
  const panelPerDuDi = document.getElementById('panelPerDuDi');
  const panelPerSiswa = document.getElementById('panelPerSiswa');

  const activeCls = "py-2 text-[11px] font-semibold rounded-lg bg-indigo-600 text-white shadow-sm transition truncate px-1 text-center";
  const inactiveCls = "py-2 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition truncate px-1 text-center";

  if (btnPerGuru) btnPerGuru.className = mode === 'per-guru' ? activeCls : inactiveCls;
  if (btnPerDuDi) btnPerDuDi.className = mode === 'per-du-di' ? activeCls : inactiveCls;
  if (btnPerSiswa) btnPerSiswa.className = mode === 'per-siswa' ? activeCls : inactiveCls;

  if (panelPerGuru) {
    if (mode === 'per-guru') panelPerGuru.classList.remove('hidden');
    else panelPerGuru.classList.add('hidden');
  }
  if (panelPerDuDi) {
    if (mode === 'per-du-di') panelPerDuDi.classList.remove('hidden');
    else panelPerDuDi.classList.add('hidden');
  }
  if (panelPerSiswa) {
    if (mode === 'per-siswa') panelPerSiswa.classList.remove('hidden');
    else panelPerSiswa.classList.add('hidden');
  }

  updateUIFromState();
  renderPreview();
}

// Event handler when user selects a Guru from dropdown
function onGuruChange() {
  const select = document.getElementById('guruSelect');
  AppState.selectedGuruIdx = parseInt(select.value, 10);
  AppState.selectedTempatFilter = 'all';
  AppState.selectedSiswaFilterPerGuru = 'all';
  updateTempatFilterDropdown();
  updateSiswaFilterPerGuruDropdown();
  updateUIFromState();
  renderPreview();
}

// Event handler when user changes Tempat PKL filter for the selected Guru
function onTempatFilterChange() {
  const select = document.getElementById('tempatFilterSelect');
  AppState.selectedTempatFilter = select.value;
  AppState.selectedSiswaFilterPerGuru = 'all';
  updateSiswaFilterPerGuruDropdown();
  updateUIFromState();
  renderPreview();
}

// Event handler when user changes Siswa filter for Guru or DU/DI
function onSiswaFilterChange(context) {
  if (context === 'per-guru') {
    const sel = document.getElementById('siswaFilterSelectPerGuru');
    if (sel) AppState.selectedSiswaFilterPerGuru = sel.value;
  } else if (context === 'per-du-di') {
    const sel = document.getElementById('siswaFilterSelectPerDuDi');
    if (sel) AppState.selectedSiswaFilterPerDuDi = sel.value;
  }
  updateUIFromState();
  renderPreview();
}

// Event handler when user selects a DU/DI from dropdown (Mode Per Tempat PKL)
function onDuDiChange() {
  const select = document.getElementById('dudiSelect');
  AppState.selectedDuDiIdx = parseInt(select.value, 10);
  AppState.selectedSiswaFilterPerDuDi = 'all';
  updateSiswaFilterPerDuDiDropdown();
  updateUIFromState();
  renderPreview();
}

// Event handler when user selects a Student in Per Siswa mode
function onSiswaChange() {
  const select = document.getElementById('siswaSelect');
  if (select) {
    AppState.selectedSiswaIdx = parseInt(select.value, 10) || 0;
  }
  updateUIFromState();
  renderPreview();
}

// Get current active letter model
function getCurrentLetterData() {
  if (AppState.selectedMode === 'per-guru') {
    const guruData = AppState.gurus[AppState.selectedGuruIdx] || { guru: '-', nip: '-', siswa: [] };
    const isSpecificTempat = AppState.selectedTempatFilter !== 'all';
    let filteredSiswa = guruData.siswa;
    let targetTempat = '';
    let targetAlamat = '';

    if (isSpecificTempat) {
      filteredSiswa = guruData.siswa.filter(s => s.tempat === AppState.selectedTempatFilter);
      targetTempat = AppState.selectedTempatFilter;
      targetAlamat = filteredSiswa.length > 0 ? (filteredSiswa[0].alamat || '') : '';
    }

    if (AppState.selectedSiswaFilterPerGuru && AppState.selectedSiswaFilterPerGuru !== 'all') {
      filteredSiswa = filteredSiswa.filter(s => s.siswa === AppState.selectedSiswaFilterPerGuru);
      if (filteredSiswa.length > 0) {
        targetTempat = filteredSiswa[0].tempat;
        targetAlamat = filteredSiswa[0].alamat || targetAlamat;
      }
    }

    const firstStudent = filteredSiswa[0] || null;

    return {
      guruNama: guruData.guru,
      guruNip: guruData.nip || '-',
      tempatPkl: targetTempat,
      alamatPkl: targetAlamat,
      isSpecificTempat: isSpecificTempat || (AppState.selectedSiswaFilterPerGuru !== 'all'),
      students: filteredSiswa,
      totalSiswa: filteredSiswa.length,
      siswa: firstStudent ? (firstStudent.siswa || firstStudent.nama) : '-',
      nis: firstStudent ? (firstStudent.nis || '-') : '-',
      nisn: firstStudent ? (firstStudent.nisn || '-') : '-',
      kelas: firstStudent ? (firstStudent.kelas || '-') : '-',
      jurusan: firstStudent ? (firstStudent.jurusan || getJurusanFromKelas(firstStudent.kelas) || '-') : '-'
    };
  } else if (AppState.selectedMode === 'per-du-di') {
    // Mode per DU/DI
    const placeData = AppState.places[AppState.selectedDuDiIdx] || { tempat: '-', alamat: '', gurus: [], siswa: [] };
    let students = placeData.siswa;

    if (AppState.selectedSiswaFilterPerDuDi && AppState.selectedSiswaFilterPerDuDi !== 'all') {
      students = students.filter(s => s.siswa === AppState.selectedSiswaFilterPerDuDi);
    }

    let guruFirst = placeData.gurus.length > 0 ? placeData.gurus[0].guru : '-';
    let nipFirst = placeData.gurus.length > 0 ? placeData.gurus[0].nip : '-';
    if (students.length > 0 && students[0].guru) {
      guruFirst = students[0].guru;
      nipFirst = students[0].nip || nipFirst;
    }

    const firstStudent = students[0] || null;

    return {
      guruNama: guruFirst,
      guruNip: nipFirst,
      tempatPkl: placeData.tempat,
      alamatPkl: placeData.alamat,
      isSpecificTempat: true,
      students: students,
      totalSiswa: students.length,
      siswa: firstStudent ? (firstStudent.siswa || firstStudent.nama) : '-',
      nis: firstStudent ? (firstStudent.nis || '-') : '-',
      nisn: firstStudent ? (firstStudent.nisn || '-') : '-',
      kelas: firstStudent ? (firstStudent.kelas || '-') : '-',
      jurusan: firstStudent ? (firstStudent.jurusan || getJurusanFromKelas(firstStudent.kelas) || '-') : '-'
    };
  } else {
    // Mode per Siswa
    const rec = AppState.records[AppState.selectedSiswaIdx] || AppState.records[0] || {
      no: 1,
      siswa: '-',
      nis: '-',
      nisn: '-',
      kelas: '-',
      jurusan: '-',
      guru: '-',
      nip: '-',
      tempat: '-',
      alamat: ''
    };

    return {
      guruNama: rec.guru || '-',
      guruNip: rec.nip || '-',
      tempatPkl: rec.tempat || '-',
      alamatPkl: rec.alamat || '',
      isSpecificTempat: true,
      students: [rec],
      totalSiswa: 1,
      siswa: rec.siswa,
      nis: rec.nis || '-',
      nisn: rec.nisn || '-',
      kelas: rec.kelas || '-',
      jurusan: rec.jurusan || getJurusanFromKelas(rec.kelas) || '-'
    };
  }
}

// Update UI info cards and badges
function updateUIFromState() {
  const letter = getCurrentLetterData();

  const infoGuruNama = document.getElementById('infoGuruNama');
  const infoNip = document.getElementById('infoNip');
  const infoJumlahSiswa = document.getElementById('infoJumlahSiswa');
  const infoTempatTujuan = document.getElementById('infoTempatTujuan');

  if (infoGuruNama) infoGuruNama.textContent = letter.guruNama;
  if (infoNip) infoNip.textContent = letter.guruNip;
  if (infoJumlahSiswa) infoJumlahSiswa.textContent = letter.totalSiswa;
  if (infoTempatTujuan) {
    infoTempatTujuan.textContent = letter.isSpecificTempat ? letter.tempatPkl : `Semua Lokasi PKL (${letter.totalSiswa} Siswa)`;
  }

  // Update Detail Siswa Terpilih (jika 1 siswa difilter atau mode per-siswa)
  const detailRow = document.getElementById('infoSiswaDetailRow');
  if (detailRow) {
    if (letter.totalSiswa === 1 && letter.students && letter.students.length > 0) {
      const s = letter.students[0];
      detailRow.classList.remove('hidden');
      const sNama = document.getElementById('infoDetailSiswaNama');
      const sNis = document.getElementById('infoDetailSiswaNis');
      const sNisn = document.getElementById('infoDetailSiswaNisn');
      const sJurusan = document.getElementById('infoDetailSiswaJurusan');
      if (sNama) sNama.textContent = s.siswa || s.nama || '-';
      if (sNis) sNis.textContent = s.nis || '-';
      if (sNisn) sNisn.textContent = s.nisn || '-';
      if (sJurusan) sJurusan.textContent = s.jurusan || getJurusanFromKelas(s.kelas) || s.kelas || '-';
    } else {
      detailRow.classList.add('hidden');
    }
  }

  // Update Dynamic Text on Navbar Dropdowns (Cetak & Unduh)
  const activeTpl = getActiveTemplate();
  const isKeterangan = (activeTpl.id === 'tpl_surat_keterangan_pkl') || 
                       (activeTpl.name && activeTpl.name.toLowerCase().includes('keterangan'));

  const bPrintTitle = document.getElementById('navbarBatchPrintTitle');
  const bPrintDesc = document.getElementById('navbarBatchPrintDesc');
  const bZipTitle = document.getElementById('navbarBatchZipTitle');
  const bZipDesc = document.getElementById('navbarBatchZipDesc');

  if (isKeterangan) {
    if (bPrintTitle) bPrintTitle.textContent = 'Cetak Massal Surat Keterangan';
    if (bPrintDesc) bPrintDesc.textContent = 'Pilih & cetak surat keterangan siswa';
    const cPrintDesc = document.getElementById('navbarCurrentPrintDesc');
    if (cPrintDesc) cPrintDesc.textContent = 'Cetak 1 surat keterangan siswa aktif';
    if (bZipTitle) bZipTitle.textContent = 'Unduh Semua Siswa (.ZIP)';
    if (bZipDesc) bZipDesc.textContent = 'Arsip .docx surat keterangan siswa';
  } else {
    if (bPrintTitle) bPrintTitle.textContent = 'Cetak Massal (Semua Guru)';
    if (bPrintDesc) bPrintDesc.textContent = 'Pilih & cetak banyak surat sekaligus';
    const cPrintDesc = document.getElementById('navbarCurrentPrintDesc');
    if (cPrintDesc) cPrintDesc.textContent = 'Cetak 1 surat pengantar yang aktif';
    if (bZipTitle) bZipTitle.textContent = 'Unduh Semua Guru (.ZIP)';
    if (bZipDesc) bZipDesc.textContent = 'Arsip 54 berkas .docx lengkap';
  }
}

// Helper: Substitute dynamic variables into template HTML
function resolveTemplateVariables(templateHtml, letter, ds) {
  if (!templateHtml) return '';
  const s = AppState.appSettings || ds;
  const firstStudent = (letter.students && letter.students.length > 0) ? letter.students[0] : null;
  const siswaNama = firstStudent ? (firstStudent.siswa || firstStudent.nama) : (letter.siswa || '-');
  const siswaNis = firstStudent ? (firstStudent.nis || '-') : '-';
  const siswaNisn = firstStudent ? (firstStudent.nisn || '-') : '-';
  const siswaKelas = firstStudent ? (firstStudent.kelas || '-') : '-';
  const siswaJurusan = firstStudent ? (firstStudent.jurusan || getJurusanFromKelas(firstStudent.kelas) || '-') : '-';
  const tempatPkl = letter.tempatPkl || (firstStudent ? firstStudent.tempat : 'Marvella');

  return templateHtml
    .replace(/{tahunAjaran}/g, s.tahunAjaran)
    .replace(/{namaSekolah}/g, s.namaSekolah)
    .replace(/{sekolah}/g, s.namaSekolah)
    .replace(/{alamatSekolah}/g, s.alamatSekolah || '')
    .replace(/{tglPelepasan}/g, s.tglPelepasan)
    .replace(/{periodePkl}/g, s.periodePkl)
    .replace(/{tglPenarikan}/g, s.tglPenarikan)
    .replace(/{tglSurat}/g, s.tglSurat)
    .replace(/{noSurat}/g, s.noSurat)
    .replace(/{kepsekNama}/g, s.kepsekNama)
    .replace(/{kepsekNip}/g, s.kepsekNip)
    .replace(/{kepsekPangkat}/g, s.kepsekPangkat)
    .replace(/{guruNama}/g, letter.guruNama)
    .replace(/{guruNip}/g, letter.guruNip || '-')
    .replace(/{tempatPkl}/g, tempatPkl)
    .replace(/{alamatPkl}/g, letter.alamatPkl || '')
    .replace(/{siswaNama}/g, siswaNama)
    .replace(/{siswaNis}/g, siswaNis)
    .replace(/{siswaNisn}/g, siswaNisn)
    .replace(/{siswaKelas}/g, siswaKelas)
    .replace(/{siswaJurusan}/g, siswaJurusan)
    .replace(/{lamaPkl}/g, '6 bulan')
    .replace(/{jabatanGuru}/g, 'Guru Pembimbing PKL');
}

// Render the Live Document Preview
function renderPreview() {
  const letter = getCurrentLetterData();
  const ds = AppState.docSettings;
  const dOpt = AppState.displayOptions;
  const activeTpl = getActiveTemplate();
  const isKeterangan = (activeTpl.id === 'tpl_surat_keterangan_pkl') || 
                       (activeTpl.name && activeTpl.name.toLowerCase().includes('keterangan'));

  // 1. Kop Surat (GARIS GANDA DIHILANGKAN KARENA KOP_FYJ.PNG SUDAH MEMILIKI GARIS BAWAH RESMI)
  const kopContainer = document.getElementById('docKopContainer');
  if (kopContainer) {
    if (dOpt.showKop) {
      kopContainer.style.display = 'block';
      const kopSrc = getKopSrc();
      kopContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 8px;">
          <img src="${kopSrc}" alt="Kop Surat" style="width: 100%; max-height: 145px; object-fit: contain; display: block; margin: 0 auto;">
        </div>
      `;
    } else {
      kopContainer.style.display = 'none';
      kopContainer.innerHTML = '';
    }
  }

  // 2. Judul & Nomor Surat
  const docJudulSurat = document.getElementById('docJudulSurat');
  if (docJudulSurat) {
    docJudulSurat.textContent = isKeterangan ? 'SURAT KETERANGAN' : 'SURAT PENGANTAR';
  }

  const docNoSurat = document.getElementById('docNoSurat');
  if (docNoSurat) docNoSurat.textContent = ds.noSurat;

  // 3. Tujuan Surat (Untuk Surat Keterangan tidak ditampilkan; Untuk Surat Pengantar jika dipilih Semua Lokasi PKL, nama & alamat DU/DI tidak ditampilkan)
  const docTujuanSuratContainer = document.getElementById('docTujuanSuratContainer');
  if (docTujuanSuratContainer) {
    docTujuanSuratContainer.style.display = isKeterangan ? 'none' : 'block';
  }

  const docNamaTempat = document.getElementById('docNamaTempat');
  if (docNamaTempat) {
    if (!isKeterangan && letter.isSpecificTempat && letter.tempatPkl) {
      docNamaTempat.textContent = letter.tempatPkl;
      docNamaTempat.style.display = 'block';
    } else {
      docNamaTempat.textContent = '';
      docNamaTempat.style.display = 'none';
    }
  }

  const docAlamatTempat = document.getElementById('docAlamatTempat');
  if (docAlamatTempat) {
    if (!isKeterangan && letter.isSpecificTempat && dOpt.showAlamat && letter.alamatPkl) {
      docAlamatTempat.textContent = letter.alamatPkl;
      docAlamatTempat.style.display = 'block';
    } else {
      docAlamatTempat.textContent = '';
      docAlamatTempat.style.display = 'none';
    }
  }

  // 4. Render Dynamic Letter Body Content from Active Template
  const docIsiSuratContainer = document.getElementById('docIsiSuratContainer');
  if (docIsiSuratContainer) {
    docIsiSuratContainer.innerHTML = resolveTemplateVariables(activeTpl.htmlContent, letter, ds);
  }

  // 5. Tanggal Surat & Tanda Tangan
  const docTitimangsaHeader = document.getElementById('docTitimangsaHeader');
  if (docTitimangsaHeader) {
    if (isKeterangan) {
      docTitimangsaHeader.innerHTML = `<div>Ditetapkan di Klungkung</div><div>Pada Tanggal <span id="docTglSurat">${ds.tglSurat}</span></div>`;
    } else {
      docTitimangsaHeader.innerHTML = `<div>Klungkung, <span id="docTglSurat">${ds.tglSurat}</span></div>`;
    }
  }

  const docTglSurat = document.getElementById('docTglSurat');
  if (docTglSurat) docTglSurat.textContent = ds.tglSurat;

  const docNamaSekolahTtd = document.getElementById('docNamaSekolahTtd');
  if (docNamaSekolahTtd) docNamaSekolahTtd.textContent = AppState.appSettings.namaSekolah;

  const docTtdArea = document.getElementById('docTtdArea');
  if (docTtdArea) {
    docTtdArea.innerHTML = getTtdHtml(ds, dOpt);
  }

  // 6. Lampiran 2 Tabel Siswa (Disembunyikan otomatis jika Surat Keterangan agar tepat 1 halaman sesuai Word)
  const pageLampiran = document.getElementById('pageLampiran');
  const pageDividers = document.querySelectorAll('.page-break-divider');
  if (pageLampiran) {
    pageLampiran.style.display = isKeterangan ? 'none' : 'block';
  }
  pageDividers.forEach(div => {
    div.style.display = isKeterangan ? 'none' : 'block';
  });

  const tbody = document.getElementById('docTbodySiswa');
  if (tbody && !isKeterangan) {
    tbody.innerHTML = '';
    if (letter.students.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="4" style="text-align: center; padding: 12px; color: #888;">Tidak ada data siswa untuk filter ini.</td>`;
      tbody.appendChild(tr);
    } else {
      letter.students.forEach((s, idx) => {
        const tr = document.createElement('tr');
        tr.style.backgroundColor = (idx % 2 === 1) ? '#fafafa' : '#ffffff';
        tr.innerHTML = `
          <td style="padding: 6px 8px; text-align: center; border: 1px solid #000;">${idx + 1}</td>
          <td style="padding: 6px 8px; border: 1px solid #000; font-weight: 500;">${s.siswa || s.nama}</td>
          <td style="padding: 6px 8px; text-align: center; border: 1px solid #000;">${s.kelas}</td>
          <td style="padding: 6px 8px; border: 1px solid #000;">${s.tempat}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  }

  // Update paper size class
  updatePaperSizeClass();
}

// ================= MODAL TEMPLATE MANAGEMENT & WYSIWYG =================
function openTemplateModal(tab = 'list') {
  const modal = document.getElementById('templateManagerModal');
  if (!modal) return;
  populateEditorTemplateSelect();
  loadTemplateIntoEditor(AppState.editingTemplateId || AppState.activeTemplateId);
  renderTemplateTable();
  switchTemplateTab(tab);
  modal.style.display = 'flex';
  modal.classList.remove('hidden');
}

function closeTemplateModal() {
  const modal = document.getElementById('templateManagerModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.add('hidden');
  }
}

function switchTemplateTab(tab) {
  const btnTabEditor = document.getElementById('btnTabEditor');
  const btnTabList = document.getElementById('btnTabList');
  const viewEditor = document.getElementById('templateEditorView');
  const viewList = document.getElementById('templateListView');

  if (tab === 'editor') {
    btnTabEditor.className = "px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-sm flex items-center gap-1.5 transition";
    btnTabList.className = "px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition";
    viewEditor.classList.remove('hidden');
    viewList.classList.add('hidden');
  } else {
    btnTabList.className = "px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-sm flex items-center gap-1.5 transition";
    btnTabEditor.className = "px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition";
    viewList.classList.remove('hidden');
    viewEditor.classList.add('hidden');
    renderTemplateTable();
  }
}

// Load a specific template into WYSIWYG editor
function loadTemplateIntoEditor(templateId) {
  const tpl = AppState.templates.find(t => t.id === templateId) || getActiveTemplate();
  AppState.editingTemplateId = tpl.id;

  const nameInput = document.getElementById('inputTemplateName');
  if (nameInput) nameInput.value = tpl.name;

  const editorSel = document.getElementById('editorTemplateSelect');
  if (editorSel) editorSel.value = tpl.id;

  const editor = document.getElementById('wysiwygEditor');
  const textarea = document.getElementById('htmlEditorTextarea');

  if (editor) editor.innerHTML = tpl.htmlContent;
  if (textarea) textarea.value = tpl.htmlContent;

  AppState.isHtmlSourceMode = false;
  if (editor) editor.classList.remove('hidden');
  if (textarea) textarea.classList.add('hidden');
  const btnToggle = document.getElementById('btnToggleHtmlMode');
  if (btnToggle) btnToggle.innerHTML = `<i data-lucide="code" class="w-3.5 h-3.5"></i><span>Mode HTML</span>`;

  if (window.lucide) lucide.createIcons();
}

// Rich Text WYSIWYG Command Executor
function execEditorCmd(command, value = null) {
  const editor = document.getElementById('wysiwygEditor');
  if (!editor || AppState.isHtmlSourceMode) return;
  editor.focus();
  document.execCommand(command, false, value);
}

// Insert Variable tag into WYSIWYG editor
function insertEditorVariable(varTag) {
  const editor = document.getElementById('wysiwygEditor');
  const textarea = document.getElementById('htmlEditorTextarea');

  if (AppState.isHtmlSourceMode && textarea) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    textarea.value = text.substring(0, start) + varTag + text.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + varTag.length;
    textarea.focus();
    return;
  }

  if (editor) {
    editor.focus();
    const sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(varTag);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      document.execCommand('insertText', false, varTag);
    }
  }
}

// Toggle between Visual WYSIWYG and Raw HTML Mode
function toggleEditorHtmlMode() {
  const editor = document.getElementById('wysiwygEditor');
  const textarea = document.getElementById('htmlEditorTextarea');
  const btnToggle = document.getElementById('btnToggleHtmlMode');
  if (!editor || !textarea || !btnToggle) return;

  AppState.isHtmlSourceMode = !AppState.isHtmlSourceMode;

  if (AppState.isHtmlSourceMode) {
    textarea.value = editor.innerHTML;
    editor.classList.add('hidden');
    textarea.classList.remove('hidden');
    textarea.focus();
    btnToggle.innerHTML = `<i data-lucide="eye" class="w-3.5 h-3.5 text-indigo-600"></i><span>Mode Visual</span>`;
  } else {
    editor.innerHTML = textarea.value;
    textarea.classList.add('hidden');
    editor.classList.remove('hidden');
    editor.focus();
    btnToggle.innerHTML = `<i data-lucide="code" class="w-3.5 h-3.5"></i><span>Mode HTML</span>`;
  }
  if (window.lucide) lucide.createIcons();
}

// Reset Editor to Official Standard Template
function resetEditorToOfficialStandard() {
  if (!confirm('Kembalikan naskah template ke redaksi standar resmi SMKN 1 FYJ Channel?')) return;
  const officialTpl = DEFAULT_TEMPLATES[0];
  const editor = document.getElementById('wysiwygEditor');
  const textarea = document.getElementById('htmlEditorTextarea');
  if (editor) editor.innerHTML = officialTpl.htmlContent;
  if (textarea) textarea.value = officialTpl.htmlContent;
  showToast('Naskah di editor dikembalikan ke Standar Resmi.');
}

// Save changes to the currently edited template
function saveCurrentTemplateChanges() {
  const nameInput = document.getElementById('inputTemplateName');
  const editor = document.getElementById('wysiwygEditor');
  const textarea = document.getElementById('htmlEditorTextarea');

  const newName = nameInput ? nameInput.value.trim() : '';
  if (!newName) {
    alert('Harap isi nama template.');
    return;
  }

  const currentContent = AppState.isHtmlSourceMode && textarea ? textarea.value : (editor ? editor.innerHTML : '');
  const tpl = getEditingTemplate();
  tpl.name = newName;
  tpl.htmlContent = currentContent;

  saveTemplatesToStorage();
  populateSidebarTemplateSelect();
  populateEditorTemplateSelect();
  renderTemplateTable();
  if (tpl.id === AppState.activeTemplateId) {
    renderPreview();
  }
  showToast(`Perubahan template "${newName}" berhasil disimpan!`);

  // Sync template to SQLite backend
  if (window.fetch && window.location.protocol.startsWith('http')) {
    fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tpl)
    }).catch(() => {});
  }
}

// Save as a Brand New Template
function saveAsNewTemplate() {
  const nameInput = document.getElementById('inputTemplateName');
  const editor = document.getElementById('wysiwygEditor');
  const textarea = document.getElementById('htmlEditorTextarea');

  let newName = nameInput ? nameInput.value.trim() : '';
  if (!newName || newName === getEditingTemplate().name) {
    newName = prompt('Masukkan nama untuk template baru:', (newName || 'Template Surat PKL') + ' (Salinan)');
    if (!newName) return;
  }

  const currentContent = AppState.isHtmlSourceMode && textarea ? textarea.value : (editor ? editor.innerHTML : '');
  const newId = 'tpl_' + Date.now();

  const newTpl = {
    id: newId,
    name: newName,
    isDefault: false,
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0],
    htmlContent: currentContent
  };

  AppState.templates.push(newTpl);
  AppState.activeTemplateId = newId;
  AppState.editingTemplateId = newId;

  saveTemplatesToStorage();
  populateSidebarTemplateSelect();
  populateEditorTemplateSelect();
  renderTemplateTable();
  renderPreview();
  switchTemplateTab('list');
  showToast(`Template baru "${newName}" berhasil ditambahkan & diaktifkan!`);

  // Sync template to SQLite backend
  if (window.fetch && window.location.protocol.startsWith('http')) {
    fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTpl)
    }).catch(() => {});
  }
}

// Set a template as active
function setActiveTemplate(templateId) {
  const tpl = AppState.templates.find(t => t.id === templateId);
  if (!tpl) return;
  AppState.activeTemplateId = templateId;
  saveTemplatesToStorage();
  populateSidebarTemplateSelect();
  populateEditorTemplateSelect();
  renderTemplateTable();
  renderPreview();
  renderSelectedFilterInfo();
  showToast(`Template aktif diubah: "${tpl.name}"`);
}

// Delete a saved template
function deleteTemplate(templateId) {
  const tpl = AppState.templates.find(t => t.id === templateId);
  if (!tpl) return;
  if (tpl.isDefault) {
    alert('Template default resmi tidak dapat dihapus.');
    return;
  }
  if (!confirm(`Hapus template "${tpl.name}" dari daftar template?`)) return;

  AppState.templates = AppState.templates.filter(t => t.id !== templateId);
  if (AppState.activeTemplateId === templateId) {
    AppState.activeTemplateId = AppState.templates[0].id;
  }
  if (AppState.editingTemplateId === templateId) {
    AppState.editingTemplateId = AppState.activeTemplateId;
  }

  saveTemplatesToStorage();
  populateSidebarTemplateSelect();
  populateEditorTemplateSelect();
  renderTemplateTable();
  renderPreview();
  showToast(`Template "${tpl.name}" berhasil dihapus.`);

  // Delete from SQLite backend
  if (window.fetch && window.location.protocol.startsWith('http')) {
    fetch('/api/templates/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: templateId })
    }).catch(() => {});
  }
}

// Render Daftar Template Table matching Image 2
function renderTemplateTable() {
  const tbody = document.getElementById('templateTableBody');
  const countBadge = document.getElementById('templateTotalCount');
  if (!tbody) return;

  if (countBadge) countBadge.textContent = AppState.templates.length;

  tbody.innerHTML = '';
  AppState.templates.forEach((t, idx) => {
    const isActive = t.id === AppState.activeTemplateId;
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50 border-b border-slate-100 text-xs text-slate-700 transition";
    tr.innerHTML = `
      <td class="p-3">
        <div class="font-bold text-slate-800 text-xs">${t.name}</div>
        <div class="text-[10px] text-slate-400 mt-0.5">Dibuat: ${t.createdAt || '2026-11-03'} ${t.isDefault ? '• Standar Sistem' : ''}</div>
      </td>
      <td class="p-3 text-center">
        ${isActive ? `
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Aktif Digunakan</span>
          </span>
        ` : `
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
            Tersimpan
          </span>
        `}
      </td>
      <td class="p-3 text-center">
        <div class="flex items-center justify-center gap-2">
          ${!isActive ? `
            <button onclick="setActiveTemplate('${t.id}')" class="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded text-[11px] transition">
              Gunakan
            </button>
          ` : `
            <span class="text-[11px] font-bold text-emerald-700 px-2 py-1">Sedang Aktif</span>
          `}
          <button onclick="loadTemplateIntoEditor('${t.id}'); switchTemplateTab('editor');" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px] transition flex items-center gap-1">
            <i data-lucide="edit-3" class="w-3 h-3"></i>
            <span>Edit</span>
          </button>
          ${!t.isDefault ? `
            <button onclick="deleteTemplate('${t.id}')" class="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition" title="Hapus Template">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          ` : ''}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (window.lucide) lucide.createIcons();
}

// ================= MODAL PENGATURAN APLIKASI & LEMBAGA =================
function openSettingsModal(tab = 'media') {
  const modal = document.getElementById('settingsModal');
  if (!modal) return;

  const s = AppState.appSettings;

  // Populate school & year fields
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val !== undefined ? val : '';
  };

  setVal('settingsNamaSekolah', s.namaSekolah);
  setVal('settingsTahunAjaran', s.tahunAjaran);
  setVal('settingsAlamatSekolah', s.alamatSekolah);
  setVal('settingsKepsekNama', s.kepsekNama);
  setVal('settingsKepsekPangkat', s.kepsekPangkat);
  setVal('settingsKepsekNip', s.kepsekNip);
  setVal('settingsNoSurat', s.noSurat);
  setVal('settingsTglSurat', s.tglSurat);
  setVal('settingsTglPelepasan', s.tglPelepasan);
  setVal('settingsTglPenarikan', s.tglPenarikan);
  setVal('settingsPeriodePkl', s.periodePkl);

  // Clear or set URL inputs
  const urlKop = document.getElementById('inputUrlKop');
  if (urlKop) urlKop.value = (s.kopUrl && !s.kopUrl.startsWith('data:image/')) ? s.kopUrl : '';
  const urlTtd = document.getElementById('inputUrlTtd');
  if (urlTtd) urlTtd.value = (s.ttdUrl && !s.ttdUrl.startsWith('data:image/')) ? s.ttdUrl : '';
  const urlTtdBasah = document.getElementById('inputUrlTtdBasah');
  if (urlTtdBasah) urlTtdBasah.value = (s.ttdBasahUrl && !s.ttdBasahUrl.startsWith('data:image/')) ? s.ttdBasahUrl : '';
  const urlLogo = document.getElementById('inputUrlLogoWeb');
  if (urlLogo) urlLogo.value = (s.logoWebUrl && !s.logoWebUrl.startsWith('data:image/')) ? s.logoWebUrl : '';

  updateSettingsMediaPreviews();

  // Update DB tab stats
  const totalSiswaEl = document.getElementById('dbSettingTotalRows');
  if (totalSiswaEl) totalSiswaEl.textContent = AppState.records.length;
  const totalGurusEl = document.getElementById('dbSettingTotalGurus');
  if (totalGurusEl) totalGurusEl.textContent = AppState.gurus.length;
  const totalTempatEl = document.getElementById('dbSettingTotalTempat');
  if (totalTempatEl) {
    const tempatSet = new Set(AppState.records.map(r => (r.tempat || '').trim()).filter(Boolean));
    totalTempatEl.textContent = tempatSet.size;
  }

  switchSettingsTab(tab);
  modal.style.display = 'flex';
  modal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeSettingsModal() {
  const modal = document.getElementById('settingsModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.add('hidden');
  }
}

function switchSettingsTab(tab) {
  const btnMedia = document.getElementById('btnTabSettingMedia');
  const btnSchool = document.getElementById('btnTabSettingSchool');
  const btnDatabase = document.getElementById('btnTabSettingDatabase');
  const tabMedia = document.getElementById('settingsTabMedia');
  const tabSchool = document.getElementById('settingsTabSchool');
  const tabDatabase = document.getElementById('settingsTabDatabase');

  const activeBtnClass = "px-3.5 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-sm flex items-center gap-1.5 transition";
  const inactiveBtnClass = "px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition";

  if (btnMedia) btnMedia.className = (tab === 'media') ? activeBtnClass : inactiveBtnClass;
  if (btnSchool) btnSchool.className = (tab === 'school') ? activeBtnClass : inactiveBtnClass;
  if (btnDatabase) btnDatabase.className = (tab === 'database') ? activeBtnClass : inactiveBtnClass;

  if (tabMedia) tabMedia.classList.toggle('hidden', tab !== 'media');
  if (tabSchool) tabSchool.classList.toggle('hidden', tab !== 'school');
  if (tabDatabase) tabDatabase.classList.toggle('hidden', tab !== 'database');
  if (window.lucide) lucide.createIcons();
}

function updateSettingsMediaPreviews() {
  const kopSrc = getKopSrc();
  const ttdSrc = getTtdSrc();
  const ttdBasahSrc = getTtdBasahSrc();
  const logoSrc = getLogoWebSrc();

  const kopImg = document.getElementById('previewSettingsKop');
  if (kopImg) kopImg.src = kopSrc;

  const ttdImg = document.getElementById('previewSettingsTtd');
  if (ttdImg) ttdImg.src = ttdSrc;

  const ttdBasahImg = document.getElementById('previewSettingsTtdBasah');
  if (ttdBasahImg) ttdBasahImg.src = ttdBasahSrc;

  const logoImg = document.getElementById('previewSettingsLogoWeb');
  const logoPlaceholder = document.getElementById('placeholderSettingsLogoWeb');
  if (logoImg) {
    logoImg.src = logoSrc;
    logoImg.classList.remove('hidden');
  }
  if (logoPlaceholder) {
    logoPlaceholder.classList.add('hidden');
  }

  // Badges
  const kopBadge = document.getElementById('badgeSettingsKop');
  if (kopBadge) {
    kopBadge.textContent = AppState.appSettings.kopUrl ? 'Kustom Aktif' : 'Standar Bawaan (kop_fyj.png)';
    kopBadge.className = AppState.appSettings.kopUrl ? 'px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800' : 'px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600';
  }

  const ttdBadge = document.getElementById('badgeSettingsTtd');
  if (ttdBadge) {
    ttdBadge.textContent = AppState.appSettings.ttdUrl ? 'Kustom Aktif' : 'Standar Bawaan (ttdelektronik.jpg)';
    ttdBadge.className = AppState.appSettings.ttdUrl ? 'px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800' : 'px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600';
  }

  const ttdBasahBadge = document.getElementById('badgeSettingsTtdBasah');
  if (ttdBasahBadge) {
    ttdBasahBadge.textContent = AppState.appSettings.ttdBasahUrl ? 'Kustom Aktif' : 'Standar Bawaan (ttd_basah.png)';
    ttdBasahBadge.className = AppState.appSettings.ttdBasahUrl ? 'px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800' : 'px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600';
  }

  const logoBadge = document.getElementById('badgeSettingsLogoWeb');
  if (logoBadge) {
    logoBadge.textContent = AppState.appSettings.logoWebUrl ? 'Kustom Aktif' : 'Standar Bawaan (logo_fyj.png)';
    logoBadge.className = AppState.appSettings.logoWebUrl ? 'px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800' : 'px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600';
  }
}

// Helper Upload Asset Image directly to assets/images/ via Python backend (dengan penggantian berkas otomatis)
async function uploadAssetToServer(type, file) {
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onload = async function(evt) {
      const dataUrl = evt.target.result;
      try {
        const res = await fetch('/api/upload-asset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: type,
            filename: file.name,
            data: dataUrl
          })
        });
        if (res.ok) {
          const result = await res.json();
          resolve(result.url || result.rel_path);
          return;
        }
      } catch (err) {
        console.warn('Backend upload-asset tidak aktif, menggunakan fallback data URL:', err);
      }
      resolve(dataUrl);
    };
    reader.readAsDataURL(file);
  });
}

// Helper Delete Asset Image from assets/images/
async function deleteAssetFromServer(type) {
  try {
    await fetch('/api/delete-asset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: type })
    });
  } catch (err) {
    console.warn('Backend delete-asset tidak aktif:', err);
  }
}

// Kop Surat Handlers
async function handleKopFileUpload(e) {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    showToast('Mengunggah gambar kop surat ke folder assets...');
    const savedUrl = await uploadAssetToServer('kop', file);
    AppState.appSettings.kopUrl = savedUrl;
    updateSettingsMediaPreviews();
    showToast('Kop surat berhasil disimpan di folder assets!');
  }
}

function applyKopUrl() {
  const input = document.getElementById('inputUrlKop');
  const url = input ? input.value.trim() : '';
  if (!url) {
    alert('Masukkan tautan URL gambar kop surat.');
    return;
  }
  AppState.appSettings.kopUrl = url;
  updateSettingsMediaPreviews();
  showToast('Tautan URL kop surat berhasil diterapkan!');
}

async function resetKopToDefault() {
  await deleteAssetFromServer('kop');
  AppState.appSettings.kopUrl = '';
  const input = document.getElementById('inputUrlKop');
  if (input) input.value = '';
  const fileInput = document.getElementById('inputUploadKop');
  if (fileInput) fileInput.value = '';
  updateSettingsMediaPreviews();
  showToast('Kop surat dikembalikan ke gambar standar resmi.');
}

// TTD Handlers
async function handleTtdFileUpload(e) {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    showToast('Mengunggah berkas TTD ke folder assets...');
    const savedUrl = await uploadAssetToServer('ttd', file);
    AppState.appSettings.ttdUrl = savedUrl;
    updateSettingsMediaPreviews();
    showToast('Berkas TTD elektronik berhasil disimpan di folder assets!');
  }
}

function applyTtdUrl() {
  const input = document.getElementById('inputUrlTtd');
  const url = input ? input.value.trim() : '';
  if (!url) {
    alert('Masukkan tautan URL gambar TTD / barcode.');
    return;
  }
  AppState.appSettings.ttdUrl = url;
  updateSettingsMediaPreviews();
  showToast('Tautan URL TTD berhasil diterapkan!');
}

async function resetTtdToDefault() {
  await deleteAssetFromServer('ttd');
  AppState.appSettings.ttdUrl = '';
  const input = document.getElementById('inputUrlTtd');
  if (input) input.value = '';
  const fileInput = document.getElementById('inputUploadTtd');
  if (fileInput) fileInput.value = '';
  updateSettingsMediaPreviews();
  showToast('TTD elektronik dikembalikan ke tanda tangan standar bawaan.');
}

// TTD Basah Handlers
async function handleTtdBasahFileUpload(e) {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    showToast('Mengunggah berkas TTD Basah ke folder assets...');
    const savedUrl = await uploadAssetToServer('ttd_basah', file);
    AppState.appSettings.ttdBasahUrl = savedUrl;
    updateSettingsMediaPreviews();
    showToast('Berkas TTD Basah berhasil disimpan di folder assets!');
  }
}

function applyTtdBasahUrl() {
  const input = document.getElementById('inputUrlTtdBasah');
  const url = input ? input.value.trim() : '';
  if (!url) {
    alert('Masukkan tautan URL gambar TTD Basah.');
    return;
  }
  AppState.appSettings.ttdBasahUrl = url;
  updateSettingsMediaPreviews();
  showToast('Tautan URL TTD Basah berhasil diterapkan!');
}

async function resetTtdBasahToDefault() {
  await deleteAssetFromServer('ttd_basah');
  AppState.appSettings.ttdBasahUrl = '';
  const input = document.getElementById('inputUrlTtdBasah');
  if (input) input.value = '';
  const fileInput = document.getElementById('inputUploadTtdBasah');
  if (fileInput) fileInput.value = '';
  updateSettingsMediaPreviews();
  showToast('TTD Basah dikembalikan ke tanda tangan standar awal (ttd_basah.png).');
}

// Logo Web Handlers
async function handleLogoWebFileUpload(e) {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    showToast('Mengunggah logo web ke folder assets...');
    const savedUrl = await uploadAssetToServer('logo', file);
    AppState.appSettings.logoWebUrl = savedUrl;
    updateSettingsMediaPreviews();
    showToast('Logo web aplikasi berhasil disimpan di folder assets!');
  }
}

function applyLogoWebUrl() {
  const input = document.getElementById('inputUrlLogoWeb');
  const url = input ? input.value.trim() : '';
  if (!url) {
    alert('Masukkan tautan URL logo web.');
    return;
  }
  AppState.appSettings.logoWebUrl = url;
  updateSettingsMediaPreviews();
  showToast('Tautan URL logo web berhasil diterapkan!');
}

async function resetLogoWebToDefault() {
  await deleteAssetFromServer('logo');
  AppState.appSettings.logoWebUrl = '';
  const input = document.getElementById('inputUrlLogoWeb');
  if (input) input.value = '';
  const fileInput = document.getElementById('inputUploadLogoWeb');
  if (fileInput) fileInput.value = '';
  updateSettingsMediaPreviews();
  showToast('Logo web dikembalikan ke standar awal.');
}

// Save All Settings
function saveAppSettings() {
  const getVal = (id, fallback = '') => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : fallback;
  };

  const s = AppState.appSettings;
  s.namaSekolah = getVal('settingsNamaSekolah', s.namaSekolah);
  s.tahunAjaran = getVal('settingsTahunAjaran', s.tahunAjaran);
  s.alamatSekolah = getVal('settingsAlamatSekolah', s.alamatSekolah);
  s.kepsekNama = getVal('settingsKepsekNama', s.kepsekNama);
  s.kepsekPangkat = getVal('settingsKepsekPangkat', s.kepsekPangkat);
  s.kepsekNip = getVal('settingsKepsekNip', s.kepsekNip);
  s.noSurat = getVal('settingsNoSurat', s.noSurat);
  s.tglSurat = getVal('settingsTglSurat', s.tglSurat);
  s.tglPelepasan = getVal('settingsTglPelepasan', s.tglPelepasan);
  s.tglPenarikan = getVal('settingsTglPenarikan', s.tglPenarikan);
  s.periodePkl = getVal('settingsPeriodePkl', s.periodePkl);

  saveSettingsToStorage();
  syncSidebarInputs();
  applyAppSettingsToUI();
  renderPreview();
  closeSettingsModal();
  showToast('Seluruh pengaturan sekolah, kop, TTD & logo berhasil disimpan!');

  // Sync settings to SQLite database if backend available
  if (window.fetch && window.location.protocol.startsWith('http')) {
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(AppState.appSettings)
    }).catch(() => {});
  }
}

// Reset Settings to Default
function resetSettingsToDefault() {
  if (!confirm('Kembalikan seluruh pengaturan sekolah, tahun ajaran, kop surat, TTD, dan logo ke standar bawaan awal?')) {
    return;
  }
  AppState.appSettings = Object.assign({}, DEFAULT_APP_SETTINGS);
  AppState.docSettings = AppState.appSettings;
  saveSettingsToStorage();
  
  // Re-populate modal
  openSettingsModal('media');
  syncSidebarInputs();
  applyAppSettingsToUI();
  renderPreview();
  showToast('Pengaturan telah direset ke standar bawaan.');
}

// Quick Search Handler (instant jump to teacher / place)
function handleQuickSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  const resultsContainer = document.getElementById('quickSearchResults');
  if (!resultsContainer) return;

  if (!query) {
    resultsContainer.classList.add('hidden');
    resultsContainer.innerHTML = '';
    return;
  }

  // Find matches in Gurus, Students, Places
  const matches = [];

  // Search Gurus
  AppState.gurus.forEach((g, idx) => {
    if (g.guru.toLowerCase().includes(query) || (g.nip && g.nip.includes(query))) {
      matches.push({
        type: 'guru',
        title: g.guru,
        subtitle: `NIP: ${g.nip} • ${g.siswa.length} Siswa`,
        idx: idx
      });
    }
  });

  // Search Students
  AppState.records.forEach((s, sIdx) => {
    if ((s.siswa && s.siswa.toLowerCase().includes(query)) || (s.kelas && s.kelas.toLowerCase().includes(query))) {
      const gIdx = AppState.gurus.findIndex(g => g.guru === s.guru);
      matches.push({
        type: 'siswa',
        title: s.siswa,
        subtitle: `Kelas ${s.kelas} • Pembimbing: ${s.guru} • ${s.tempat}`,
        guruIdx: gIdx
      });
    }
  });

  // Search Places
  AppState.places.forEach((p, pIdx) => {
    if (p.tempat.toLowerCase().includes(query)) {
      matches.push({
        type: 'tempat',
        title: p.tempat,
        subtitle: `${p.siswa.length} Siswa • ${p.gurus.length} Pembimbing`,
        pIdx: pIdx
      });
    }
  });

  if (matches.length === 0) {
    resultsContainer.innerHTML = '<div class="p-3 text-xs text-slate-500 text-center">Tidak ditemukan hasil.</div>';
    resultsContainer.classList.remove('hidden');
    return;
  }

  resultsContainer.innerHTML = '';
  matches.slice(0, 8).forEach(m => {
    const item = document.createElement('div');
    item.className = "p-2.5 hover:bg-indigo-50 cursor-pointer border-b border-slate-100 last:border-0 transition";
    item.innerHTML = `
      <div class="text-xs font-semibold text-slate-800 flex items-center justify-between">
        <span>${m.title}</span>
        <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
          m.type === 'guru' ? 'bg-indigo-100 text-indigo-700' :
          m.type === 'tempat' ? 'bg-emerald-100 text-emerald-700' :
          'bg-amber-100 text-amber-700'
        }">${m.type}</span>
      </div>
      <div class="text-[11px] text-slate-500 mt-0.5">${m.subtitle}</div>
    `;
    item.addEventListener('click', () => {
      if (m.type === 'guru' && m.idx !== undefined) {
        setSelectionMode('per-guru');
        AppState.selectedGuruIdx = m.idx;
        document.getElementById('guruSelect').value = m.idx;
        onGuruChange();
      } else if (m.type === 'siswa' && m.guruIdx !== -1) {
        setSelectionMode('per-guru');
        AppState.selectedGuruIdx = m.guruIdx;
        document.getElementById('guruSelect').value = m.guruIdx;
        onGuruChange();
      } else if (m.type === 'tempat' && m.pIdx !== undefined) {
        setSelectionMode('per-du-di');
        AppState.selectedDuDiIdx = m.pIdx;
        document.getElementById('dudiSelect').value = m.pIdx;
        onDuDiChange();
      }
      resultsContainer.classList.add('hidden');
      e.target.value = '';
    });
    resultsContainer.appendChild(item);
  });
  resultsContainer.classList.remove('hidden');
}

// Convert Base64 string to Uint8Array binary
function base64ToUint8Array(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Convert Data URL to Uint8Array binary
function base64DataUrlToUint8Array(dataUrl) {
  const parts = dataUrl.split(',');
  const b64 = parts.length > 1 ? parts[1] : parts[0];
  return base64ToUint8Array(b64);
}

// Generate single DOCX in browser using JSZip & embedded template (or backend API)
async function downloadDocxClient() {
  const btn = document.getElementById('btnDownloadDocx');
  const originalText = btn ? btn.innerHTML : '';
  if (btn) btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i><span>Memproses...</span>`;

  try {
    const letter = getCurrentLetterData();
    const ds = AppState.docSettings;
    const dOpt = AppState.displayOptions;
    const activeTpl = getActiveTemplate();
    const isKeterangan = (activeTpl.id === 'tpl_surat_keterangan_pkl') || 
                         (activeTpl.name && activeTpl.name.toLowerCase().includes('keterangan'));

    // 1. Coba unduh via backend Python API (jika server start.bat / app.py aktif)
    let downloadedViaBackend = false;
    try {
      const payload = {
        template_id: activeTpl.id || '',
        doc_type: isKeterangan ? 'keterangan' : 'pengantar',
        guru_nama: letter.guruNama || '',
        guru_nip: letter.guruNip || '',
        tempat_pkl: (letter.isSpecificTempat && letter.tempatPkl) ? letter.tempatPkl : '',
        alamat_pkl: (letter.isSpecificTempat && dOpt.showAlamat && letter.alamatPkl) ? letter.alamatPkl : '',
        students: letter.students || [],
        siswa_nama: letter.siswa || '',
        siswa_nis: letter.nis || '-',
        siswa_nisn: letter.nisn || '-',
        siswa_kelas: letter.kelas || '',
        siswa_jurusan: letter.jurusan || '',
        no_surat: ds.noSurat || 'B.10.000/9546/SMKN1KLK/DIKPORA',
        tgl_surat: ds.tglSurat || '06 Oktober 2026',
        tgl_pelepasan: ds.tglPelepasan || '13 November 2026',
        periode_pkl: ds.periodePkl || '13 November 2026 sampai dengan 30 April 2027',
        tgl_penarikan: ds.tglPenarikan || '30 April 2027',
        nama_sekolah: ds.namaSekolah || AppState.appSettings.namaSekolah || 'SMKN 1 FYJ Channel',
        tahun_ajaran: ds.tahunAjaran || AppState.appSettings.tahunAjaran || '2026/2027',
        kepsek_nama: ds.kepsekNama || AppState.appSettings.kepsekNama || 'Sri Rejeki, S.Pd., M.Pd.',
        kepsek_pangkat: ds.kepsekPangkat || AppState.appSettings.kepsekPangkat || 'Pembina (IV/a)',
        kepsek_nip: ds.kepsekNip || AppState.appSettings.kepsekNip || '19770309 200903 2 010',
        show_kop: dOpt.showKop,
        show_ttd: dOpt.showTtd,
        show_alamat: dOpt.showAlamat,
        paper_size: dOpt.paperSize
      };

      const res = await fetch('/api/generate-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const blob = await res.blob();
        let fileName;
        if (isKeterangan) {
          const firstStudent = (letter.students && letter.students.length > 0) ? letter.students[0] : null;
          const sName = firstStudent ? (firstStudent.siswa || firstStudent.nama || 'Siswa') : (letter.siswa || 'Siswa');
          const safeSiswa = sName.replace(/[^a-zA-Z0-9]/g, '_');
          fileName = `Surat_Keterangan_PKL_${safeSiswa}.docx`;
        } else {
          const safeName = (letter.guruNama || 'Surat').replace(/[^a-zA-Z0-9]/g, '_');
          const safeTempat = (letter.isSpecificTempat && letter.tempatPkl) ? letter.tempatPkl.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20) : 'Semua_Lokasi';
          fileName = `Surat_Pengantar_PKL_${safeName}_${safeTempat}.docx`;
        }
        saveAsOrDownload(blob, fileName);
        downloadedViaBackend = true;
      }
    } catch (backendErr) {
      // Backend tidak aktif (misal buka index.html mandiri di GitHub Pages), gunakan engine JSZip client-side
    }

    if (!downloadedViaBackend) {
      if (typeof JSZip === 'undefined') {
        alert('Pustaka JSZip belum dimuat.');
        return;
      }

      if (isKeterangan) {
        // Generate Surat Keterangan PKL via Client JSZip
        if (typeof DOCX_KETERANGAN_TEMPLATE_B64 === 'undefined') {
          alert('Template DOCX Surat Keterangan belum tersedia di template_base64.js');
          return;
        }

        const templateBytes = base64ToUint8Array(DOCX_KETERANGAN_TEMPLATE_B64);
        const zip = await JSZip.loadAsync(templateBytes);
        let docXml = await zip.file('word/document.xml').async('text');

        // Paper Size
        if (dOpt.paperSize === 'a4') {
          docXml = docXml.replace(/<w:pgSz\b[^>]*\/>/, '<w:pgSz w:w="11906" w:h="16838"/>');
        } else {
          docXml = docXml.replace(/<w:pgSz\b[^>]*\/>/, '<w:pgSz w:w="12242" w:h="18722"/>');
        }

        // Kop visibility
        if (!dOpt.showKop) {
          docXml = docXml.replace(/<w:p\b[^>]*>[\s\S]*?rId8[\s\S]*?<\/w:p>/, '');
        }

        // Nomor Surat
        docXml = docXml.replace(/B\.10\.429\.1\/8464\/SMKN1KLK\/DIKPORA/g, escapeXml(ds.noSurat));
        docXml = docXml.replace(/B\.10\.000\/9546\/SMKN1KLK\/DIKPORA/g, escapeXml(ds.noSurat));

        // Kepsek info
        if (ds.kepsekNama) docXml = docXml.replace(/Sri Rejeki,S\.Pd\.M\.Pd\./g, escapeXml(ds.kepsekNama)).replace(/Sri Rejeki, S\.Pd\., M\.Pd\./g, escapeXml(ds.kepsekNama));
        if (ds.kepsekNip) docXml = docXml.replace(/19770309 200903 2 010/g, escapeXml(ds.kepsekNip));
        if (ds.kepsekPangkat) docXml = docXml.replace(/Pembina, IV\.a/g, escapeXml(ds.kepsekPangkat)).replace(/Pembina \(IV\/a\)/g, escapeXml(ds.kepsekPangkat));
        if (ds.namaSekolah) docXml = docXml.replace(/SMK Negeri 1 Klungkung/g, escapeXml(ds.namaSekolah));

        // Siswa Info
        const firstStudent = (letter.students && letter.students.length > 0) ? letter.students[0] : null;
        const sNama = firstStudent ? (firstStudent.siswa || firstStudent.nama || '-') : (letter.siswa || '-');
        const sNis = firstStudent ? (firstStudent.nis || '-') : (letter.nis || '-');
        const sNisn = firstStudent ? (firstStudent.nisn || '-') : (letter.nisn || '-');
        const sKelas = firstStudent ? (firstStudent.kelas || '-') : (letter.kelas || '-');
        const sJurusan = firstStudent ? (firstStudent.jurusan || getJurusanFromKelas(firstStudent.kelas) || firstStudent.kelas || '-') : (letter.jurusan || '-');
        const sTempat = letter.tempatPkl || (firstStudent ? firstStudent.tempat : 'Marvella');

        docXml = docXml.replace(/<w:p\b[^>]*>[\s\S]*?MERGEFIELD\s+NAMA_SISWA_YANG_DIBIMBING_[\s\S]*?<\/w:p>/, `
          <w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
            <w:pPr><w:tabs><w:tab w:val="left" w:pos="2410"/><w:tab w:val="left" w:pos="2552"/></w:tabs><w:ind w:left="567"/><w:jc w:val="both"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:eastAsia="Bookman Old Style" w:hAnsi="Bookman Old Style" w:cs="Bookman Old Style"/></w:rPr></w:pPr>
            <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:eastAsia="Bookman Old Style" w:hAnsi="Bookman Old Style" w:cs="Bookman Old Style"/></w:rPr><w:t>Nama</w:t></w:r>
            <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:eastAsia="Bookman Old Style" w:hAnsi="Bookman Old Style" w:cs="Bookman Old Style"/></w:rPr><w:tab/><w:t>: </w:t></w:r>
            <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:eastAsia="Bookman Old Style" w:hAnsi="Bookman Old Style" w:cs="Bookman Old Style"/><w:b/><w:sz w:val="24"/></w:rPr><w:t>${escapeXml(sNama)}</w:t></w:r>
          </w:p>
        `);

        let nisDisplay = sNis && sNis !== '-' ? sNis : '';
        if (sNisn && sNisn !== '-') {
          nisDisplay = nisDisplay ? `${nisDisplay} / NISN: ${sNisn}` : `NISN: ${sNisn}`;
        }
        if (!nisDisplay) nisDisplay = '-';

        docXml = docXml.replace(/(<w:t[^>]*>NIS<\/w:t>[\s\S]*?<w:t[^>]*>: <\/w:t>)(<\/w:r>)/, `$1<w:t xml:space="preserve">${escapeXml(nisDisplay)}</w:t>$2`);
        docXml = docXml.replace(/(<w:t[^>]*>Jurusan<\/w:t>[\s\S]*?<w:t[^>]*>:<\/w:t>[\s\S]*?<w:t[^>]*> <\/w:t>)(<\/w:r>)/, `$1<w:t xml:space="preserve">${escapeXml(sJurusan)}</w:t>$2`);

        if (sTempat) docXml = docXml.replace(/Marvella/g, escapeXml(sTempat));
        docXml = docXml.replace(/07 Oktober 2026/g, escapeXml(ds.tglSurat));

        // Custom Kop
        if (AppState.appSettings.kopUrl && AppState.appSettings.kopUrl.startsWith('data:image/')) {
          try {
            const kopBytes = base64DataUrlToUint8Array(AppState.appSettings.kopUrl);
            if (zip.file('word/media/image1.png')) zip.file('word/media/image1.png', kopBytes);
          } catch (err) {}
        }

        // TTD
        if (!dOpt.showTtd) {
          const activeBasah = getTtdBasahSrc();
          if (activeBasah && activeBasah.startsWith('data:image/')) {
            try {
              const ttdBasahBytes = base64DataUrlToUint8Array(activeBasah);
              if (zip.file('word/media/image2.png')) zip.file('word/media/image2.png', ttdBasahBytes);
            } catch (err) {}
          }
        } else if (AppState.appSettings.ttdUrl && AppState.appSettings.ttdUrl.startsWith('data:image/')) {
          try {
            const ttdBytes = base64DataUrlToUint8Array(AppState.appSettings.ttdUrl);
            if (zip.file('word/media/image2.png')) zip.file('word/media/image2.png', ttdBytes);
          } catch (err) {}
        }

        zip.file('word/document.xml', docXml);
        const blob = await zip.generateAsync({
          type: 'blob',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
        const safeSiswa = sNama.replace(/[^a-zA-Z0-9]/g, '_');
        saveAsOrDownload(blob, `Surat_Keterangan_PKL_${safeSiswa}.docx`);
      } else {
        // Generate Surat Pengantar PKL via Client JSZip (Existing)
        if (typeof DOCX_TEMPLATE_B64 === 'undefined') {
          alert('Template DOCX belum tersedia. Pastikan js/template_base64.js dimuat.');
          return;
        }

        const zip = await JSZip.loadAsync(base64ToUint8Array(DOCX_TEMPLATE_B64));
        let docXml = await zip.file('word/document.xml').async('text');

        if (dOpt.paperSize === 'a4') {
          docXml = docXml.replace(/<w:pgSz\b[^>]*\/>/, '<w:pgSz w:w="11906" w:h="16838"/>');
        } else {
          docXml = docXml.replace(/<w:pgSz\b[^>]*\/>/, '<w:pgSz w:w="12242" w:h="18722"/>');
        }

        if (!dOpt.showKop) {
          docXml = docXml.replace(/<w:p\b[^>]*>[\s\S]*?rId8[\s\S]*?<\/w:p>/, '');
        }

        docXml = docXml.replace(/B\.10\.000\/9546\/SMKN1KLK\/DIKPORA/g, ds.noSurat);

        if (!letter.isSpecificTempat || !letter.tempatPkl) {
          docXml = docXml.replace(/<w:p\b[^>]*>[\s\S]*?MERGEFIELD\s+Tempat_PKL[\s\S]*?<\/w:p>/, '');
        } else {
          let replaceXml = `
            <w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
              <w:pPr><w:spacing w:after="0"/><w:ind w:left="709"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:b/><w:sz w:val="24"/></w:rPr></w:pPr>
              <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:b/><w:sz w:val="24"/></w:rPr><w:t>${escapeXml(letter.tempatPkl)}</w:t></w:r>
            </w:p>
          `;
          if (dOpt.showAlamat && letter.alamatPkl) {
            replaceXml += `
              <w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
                <w:pPr><w:spacing w:after="0"/><w:ind w:left="709"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="21"/></w:rPr></w:pPr>
                <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="21"/></w:rPr><w:t>${escapeXml(letter.alamatPkl)}</w:t></w:r>
              </w:p>
            `;
          }
          docXml = docXml.replace(/<w:p\b[^>]*>[\s\S]*?MERGEFIELD\s+Tempat_PKL[\s\S]*?<\/w:p>/, replaceXml);
        }

        docXml = docXml.replace(/<w:p\b[^>]*>[\s\S]*?MERGEFIELD\s+Nama_Guru[\s\S]*?<\/w:p>/, `
          <w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
            <w:pPr><w:tabs><w:tab w:val="left" w:pos="2160"/></w:tabs><w:spacing w:after="0" w:line="360" w:lineRule="auto"/><w:ind w:left="720"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="24"/></w:rPr></w:pPr>
            <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="24"/></w:rPr><w:t xml:space="preserve">Nama </w:t></w:r>
            <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="24"/></w:rPr><w:tab/><w:t xml:space="preserve">: </w:t></w:r>
            <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:b/><w:sz w:val="24"/></w:rPr><w:t>${escapeXml(letter.guruNama)}</w:t></w:r>
          </w:p>
        `);

        docXml = docXml.replace(/<w:p\b[^>]*>[\s\S]*?MERGEFIELD\s+NIP[\s\S]*?<\/w:p>/, `
          <w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
            <w:pPr><w:tabs><w:tab w:val="left" w:pos="2160"/></w:tabs><w:spacing w:after="0" w:line="360" w:lineRule="auto"/><w:ind w:left="720"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="24"/></w:rPr></w:pPr>
            <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="24"/></w:rPr><w:t xml:space="preserve">NIP </w:t></w:r>
            <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="24"/></w:rPr><w:tab/><w:t xml:space="preserve">: </w:t></w:r>
            <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="24"/></w:rPr><w:t>${escapeXml(letter.guruNip || '-')}</w:t></w:r>
          </w:p>
        `);

        docXml = docXml.replace(
          /(<w:t[^>]*>Klungkung<\/w:t>[\s\S]*?<w:t[^>]*>),(\s*)<\/w:t>/,
          `<w:t>Klungkung, ${escapeXml(ds.tglSurat)}</w:t>`
        );
        docXml = docXml.replace(/13 November 2026 sampai dengan 30 April 2027/g, escapeXml(ds.periodePkl));
        docXml = docXml.replace(/13 November 2026/g, ds.tglPelepasan);
        docXml = docXml.replace(/30 April 2027/g, ds.tglPenarikan);
        if (ds.tahunAjaran) docXml = docXml.replace(/2026\/2027/g, escapeXml(ds.tahunAjaran));
        if (ds.namaSekolah) docXml = docXml.replace(/SMK Negeri 1 Klungkung/g, escapeXml(ds.namaSekolah));
        if (ds.kepsekNama) docXml = docXml.replace(/Sri Rejeki, S\.Pd\., M\.Pd\./g, escapeXml(ds.kepsekNama));
        if (ds.kepsekNip) docXml = docXml.replace(/19770309 200903 2 010/g, escapeXml(ds.kepsekNip));

        if (AppState.appSettings.kopUrl && AppState.appSettings.kopUrl.startsWith('data:image/')) {
          try {
            const kopBytes = base64DataUrlToUint8Array(AppState.appSettings.kopUrl);
            if (zip.file('word/media/image1.jpg')) zip.file('word/media/image1.jpg', kopBytes);
            if (zip.file('word/media/image2.jpeg')) zip.file('word/media/image2.jpeg', kopBytes);
          } catch (err) {}
        }

        if (!dOpt.showTtd) {
          const activeBasah = getTtdBasahSrc();
          if (activeBasah && activeBasah.startsWith('data:image/')) {
            try {
              const ttdBasahBytes = base64DataUrlToUint8Array(activeBasah);
              if (zip.file('word/media/image3.png')) zip.file('word/media/image3.png', ttdBasahBytes);
            } catch (err) {}
          }
          const ttdTextXml = `
            <w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
              <w:pPr><w:spacing w:after="0"/><w:ind w:left="5103"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:b/><w:u w:val="single"/><w:sz w:val="24"/></w:rPr></w:pPr>
              <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:b/><w:u w:val="single"/><w:sz w:val="24"/></w:rPr><w:t>${escapeXml(ds.kepsekNama)}</w:t></w:r>
            </w:p>
            <w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
              <w:pPr><w:spacing w:after="0"/><w:ind w:left="5103"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr></w:pPr>
              <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr><w:t>${escapeXml(ds.kepsekPangkat)}</w:t></w:r>
            </w:p>
            <w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
              <w:pPr><w:spacing w:after="0"/><w:ind w:left="5103"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr></w:pPr>
              <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr><w:t>NIP. ${escapeXml(ds.kepsekNip)}</w:t></w:r>
            </w:p>
          `;
          docXml = docXml.replace(/(<w:p\b[^>]*>[\s\S]*?rId10[\s\S]*?<\/w:p>)([\s\S]*?<w:p\b[^>]*>[\s\S]*?Lampiran 2)/, `$1\n${ttdTextXml}\n$2`);
        } else if (AppState.appSettings.ttdUrl && AppState.appSettings.ttdUrl.startsWith('data:image/')) {
          try {
            const ttdBytes = base64DataUrlToUint8Array(AppState.appSettings.ttdUrl);
            if (zip.file('word/media/image3.png')) zip.file('word/media/image3.png', ttdBytes);
          } catch (err) {}
        }

        // Lampiran rows
        const tblStartIdx = docXml.indexOf('<w:tbl');
        const tblEndIdx = docXml.indexOf('</w:tbl>', tblStartIdx) + 8;
        if (tblStartIdx !== -1 && tblEndIdx !== -1) {
          const tblXml = docXml.substring(tblStartIdx, tblEndIdx);
          const rowMatches = tblXml.match(/<w:tr[\s\S]*?<\/w:tr>/g);
          if (rowMatches && rowMatches.length >= 2) {
            const headerRow = rowMatches[0];
            let newTableRows = headerRow;

            letter.students.forEach((s, idx) => {
              const noVal = idx + 1;
              const namaVal = escapeXml(s.siswa || s.nama || '');
              const kelasVal = escapeXml(s.kelas || '');
              const tempatVal = escapeXml(s.tempat || '');

              const studentRowXml = `
                <w:tr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
                  <w:tc>
                    <w:tcPr><w:tcW w:w="699" w:type="dxa"/><w:tcMar><w:top w:w="100" w:type="dxa"/><w:left w:w="150" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:right w:w="150" w:type="dxa"/></w:tcMar></w:tcPr>
                    <w:p><w:pPr><w:jc w:val="center"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr><w:t>${noVal}</w:t></w:r></w:p>
                  </w:tc>
                  <w:tc>
                    <w:tcPr><w:tcW w:w="4050" w:type="dxa"/><w:tcMar><w:top w:w="100" w:type="dxa"/><w:left w:w="150" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:right w:w="150" w:type="dxa"/></w:tcMar></w:tcPr>
                    <w:p><w:pPr><w:jc w:val="left"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr><w:t>${namaVal}</w:t></w:r></w:p>
                  </w:tc>
                  <w:tc>
                    <w:tcPr><w:tcW w:w="1620" w:type="dxa"/><w:tcMar><w:top w:w="100" w:type="dxa"/><w:left w:w="150" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:right w:w="150" w:type="dxa"/></w:tcMar></w:tcPr>
                    <w:p><w:pPr><w:jc w:val="center"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr><w:t>${kelasVal}</w:t></w:r></w:p>
                  </w:tc>
                  <w:tc>
                    <w:tcPr><w:tcW w:w="3827" w:type="dxa"/><w:tcMar><w:top w:w="100" w:type="dxa"/><w:left w:w="150" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:right w:w="150" w:type="dxa"/></w:tcMar></w:tcPr>
                    <w:p><w:pPr><w:jc w:val="left"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr><w:t>${tempatVal}</w:t></w:r></w:p>
                  </w:tc>
                </w:tr>
              `;
              newTableRows += studentRowXml;
            });

            const tblPrMatch = tblXml.match(/<w:tblPr[\s\S]*?<\/w:tblPr>/);
            const tblGridMatch = tblXml.match(/<w:tblGrid[\s\S]*?<\/w:tblGrid>/);
            const tblPr = tblPrMatch ? tblPrMatch[0] : '';
            const tblGrid = tblGridMatch ? tblGridMatch[0] : '';

            const newTblXml = `<w:tbl xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">${tblPr}${tblGrid}${newTableRows}</w:tbl>`;
            docXml = docXml.substring(0, tblStartIdx) + newTblXml + docXml.substring(tblEndIdx);
          }
        }

        zip.file('word/document.xml', docXml);
        const blob = await zip.generateAsync({
          type: 'blob',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });

        const safeName = (letter.guruNama || 'Surat').replace(/[^a-zA-Z0-9]/g, '_');
        const safeTempat = (letter.isSpecificTempat && letter.tempatPkl) ? letter.tempatPkl.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20) : 'Semua_Lokasi';
        saveAsOrDownload(blob, `Surat_Pengantar_PKL_${safeName}_${safeTempat}.docx`);
      }
    }
  } catch (err) {
    console.error('Error generating DOCX:', err);
    alert('Terjadi kesalahan saat membuat file .DOCX: ' + err.message);
  } finally {
    if (btn) btn.innerHTML = originalText;
    if (window.lucide) lucide.createIcons();
  }
}

// Download All Letters in a single ZIP file (Adapts to Keterangan vs Pengantar)
async function downloadBatchZipClient() {
  const btn = document.getElementById('btnDownloadBatchZip');
  const originalText = btn ? btn.innerHTML : '';
  if (btn) btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i><span>Membuat ZIP...</span>`;

  try {
    const ds = AppState.docSettings;
    const dOpt = AppState.displayOptions;
    const activeTpl = getActiveTemplate();
    const isKeterangan = (activeTpl.id === 'tpl_surat_keterangan_pkl') || 
                         (activeTpl.name && activeTpl.name.toLowerCase().includes('keterangan'));

    // 1. Coba unduh via backend Python API jika aktif
    let downloadedViaBackend = false;
    try {
      const payload = {
        doc_type: isKeterangan ? 'keterangan' : 'pengantar',
        records: isKeterangan ? getActiveBatchStudents() : [],
        no_surat: ds.noSurat || 'B.10.000/9546/SMKN1KLK/DIKPORA',
        tgl_surat: ds.tglSurat || '06 Oktober 2026',
        tgl_pelepasan: ds.tglPelepasan || '13 November 2026',
        periode_pkl: ds.periodePkl || '13 November 2026 sampai dengan 30 April 2027',
        tgl_penarikan: ds.tglPenarikan || '30 April 2027',
        nama_sekolah: ds.namaSekolah || AppState.appSettings.namaSekolah || 'SMKN 1 FYJ Channel',
        tahun_ajaran: ds.tahunAjaran || AppState.appSettings.tahunAjaran || '2026/2027',
        kepsek_nama: ds.kepsekNama || AppState.appSettings.kepsekNama || 'Sri Rejeki, S.Pd., M.Pd.',
        kepsek_pangkat: ds.kepsekPangkat || AppState.appSettings.kepsekPangkat || 'Pembina (IV/a)',
        kepsek_nip: ds.kepsekNip || AppState.appSettings.kepsekNip || '19770309 200903 2 010',
        show_kop: dOpt.showKop,
        show_ttd: dOpt.showTtd,
        show_alamat: dOpt.showAlamat,
        paper_size: dOpt.paperSize
      };

      const res = await fetch('/api/batch-docx-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const blob = await res.blob();
        const fileName = isKeterangan ? 'Surat_Keterangan_PKL_Arsip.zip' : 'Surat_Pengantar_PKL_Semua_Guru.zip';
        saveAsOrDownload(blob, fileName);
        downloadedViaBackend = true;
      }
    } catch (backendErr) {}

    if (!downloadedViaBackend) {
      if (typeof JSZip === 'undefined') {
        alert('Library JSZip belum dimuat.');
        return;
      }

      const masterZip = new JSZip();

      if (isKeterangan) {
        // Client-side ZIP Generator untuk Surat Keterangan PKL
        if (typeof DOCX_KETERANGAN_TEMPLATE_B64 === 'undefined') {
          alert('Template DOCX Surat Keterangan belum tersedia.');
          return;
        }

        const templateBytes = base64ToUint8Array(DOCX_KETERANGAN_TEMPLATE_B64);
        const students = getActiveBatchStudents();

        for (let idx = 0; idx < students.length; idx++) {
          const s = students[idx];
          if (!s) continue;
          const singleZip = await JSZip.loadAsync(templateBytes);
          let docXml = await singleZip.file('word/document.xml').async('text');

          // Paper size
          if (dOpt.paperSize === 'a4') {
            docXml = docXml.replace(/<w:pgSz\b[^>]*\/>/, '<w:pgSz w:w="11906" w:h="16838"/>');
          } else {
            docXml = docXml.replace(/<w:pgSz\b[^>]*\/>/, '<w:pgSz w:w="12242" w:h="18722"/>');
          }

          if (!dOpt.showKop) {
            docXml = docXml.replace(/<w:p\b[^>]*>[\s\S]*?rId8[\s\S]*?<\/w:p>/, '');
          }

          docXml = docXml.replace(/B\.10\.429\.1\/8464\/SMKN1KLK\/DIKPORA/g, escapeXml(ds.noSurat));
          docXml = docXml.replace(/B\.10\.000\/9546\/SMKN1KLK\/DIKPORA/g, escapeXml(ds.noSurat));
          if (ds.kepsekNama) docXml = docXml.replace(/Sri Rejeki,S\.Pd\.M\.Pd\./g, escapeXml(ds.kepsekNama)).replace(/Sri Rejeki, S\.Pd\., M\.Pd\./g, escapeXml(ds.kepsekNama));
          if (ds.kepsekNip) docXml = docXml.replace(/19770309 200903 2 010/g, escapeXml(ds.kepsekNip));
          if (ds.kepsekPangkat) docXml = docXml.replace(/Pembina, IV\.a/g, escapeXml(ds.kepsekPangkat)).replace(/Pembina \(IV\/a\)/g, escapeXml(ds.kepsekPangkat));
          if (ds.namaSekolah) docXml = docXml.replace(/SMK Negeri 1 Klungkung/g, escapeXml(ds.namaSekolah));

          const sNama = s.siswa || s.nama || '-';
          const sNis = s.nis || '-';
          const sNisn = s.nisn || '-';
          const sJurusan = s.jurusan || getJurusanFromKelas(s.kelas) || s.kelas || '-';
          const sTempat = s.tempat || 'Marvella';

          docXml = docXml.replace(/<w:p\b[^>]*>[\s\S]*?MERGEFIELD\s+NAMA_SISWA_YANG_DIBIMBING_[\s\S]*?<\/w:p>/, `
            <w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
              <w:pPr><w:tabs><w:tab w:val="left" w:pos="2410"/><w:tab w:val="left" w:pos="2552"/></w:tabs><w:ind w:left="567"/><w:jc w:val="both"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:eastAsia="Bookman Old Style" w:hAnsi="Bookman Old Style" w:cs="Bookman Old Style"/></w:rPr></w:pPr>
              <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:eastAsia="Bookman Old Style" w:hAnsi="Bookman Old Style" w:cs="Bookman Old Style"/></w:rPr><w:t>Nama</w:t></w:r>
              <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:eastAsia="Bookman Old Style" w:hAnsi="Bookman Old Style" w:cs="Bookman Old Style"/></w:rPr><w:tab/><w:t>: </w:t></w:r>
              <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:eastAsia="Bookman Old Style" w:hAnsi="Bookman Old Style" w:cs="Bookman Old Style"/><w:b/><w:sz w:val="24"/></w:rPr><w:t>${escapeXml(sNama)}</w:t></w:r>
            </w:p>
          `);

          let nisDisplay = sNis && sNis !== '-' ? sNis : '';
          if (sNisn && sNisn !== '-') {
            nisDisplay = nisDisplay ? `${nisDisplay} / NISN: ${sNisn}` : `NISN: ${sNisn}`;
          }
          if (!nisDisplay) nisDisplay = '-';

          docXml = docXml.replace(/(<w:t[^>]*>NIS<\/w:t>[\s\S]*?<w:t[^>]*>: <\/w:t>)(<\/w:r>)/, `$1<w:t xml:space="preserve">${escapeXml(nisDisplay)}</w:t>$2`);
          docXml = docXml.replace(/(<w:t[^>]*>Jurusan<\/w:t>[\s\S]*?<w:t[^>]*>:<\/w:t>[\s\S]*?<w:t[^>]*> <\/w:t>)(<\/w:r>)/, `$1<w:t xml:space="preserve">${escapeXml(sJurusan)}</w:t>$2`);

          if (sTempat) docXml = docXml.replace(/Marvella/g, escapeXml(sTempat));
          docXml = docXml.replace(/07 Oktober 2026/g, escapeXml(ds.tglSurat));

          if (AppState.appSettings.kopUrl && AppState.appSettings.kopUrl.startsWith('data:image/')) {
            try {
              const kopBytes = base64DataUrlToUint8Array(AppState.appSettings.kopUrl);
              if (singleZip.file('word/media/image1.png')) singleZip.file('word/media/image1.png', kopBytes);
            } catch (err) {}
          }

          if (!dOpt.showTtd) {
            const activeBasah = getTtdBasahSrc();
            if (activeBasah && activeBasah.startsWith('data:image/')) {
              try {
                const ttdBasahBytes = base64DataUrlToUint8Array(activeBasah);
                if (singleZip.file('word/media/image2.png')) singleZip.file('word/media/image2.png', ttdBasahBytes);
              } catch (err) {}
            }
          } else if (AppState.appSettings.ttdUrl && AppState.appSettings.ttdUrl.startsWith('data:image/')) {
            try {
              const ttdBytes = base64DataUrlToUint8Array(AppState.appSettings.ttdUrl);
              if (singleZip.file('word/media/image2.png')) singleZip.file('word/media/image2.png', ttdBytes);
            } catch (err) {}
          }

          singleZip.file('word/document.xml', docXml);
          const singleBlob = await singleZip.generateAsync({ type: 'uint8array' });
          const safeS = sNama.replace(/[^a-zA-Z0-9]/g, '_');
          masterZip.file(`Surat_Keterangan_${String(idx + 1).padStart(3, '0')}_${safeS}.docx`, singleBlob);
        }

        const masterBlob = await masterZip.generateAsync({ type: 'blob' });
        saveAsOrDownload(masterBlob, 'Surat_Keterangan_PKL_Arsip.zip');
      } else {
        // Surat Pengantar ZIP (existing)
        if (typeof DOCX_TEMPLATE_B64 === 'undefined') {
          alert('Template DOCX belum tersedia.');
          return;
        }

        const templateBytes = base64ToUint8Array(DOCX_TEMPLATE_B64);

        for (let idx = 0; idx < AppState.gurus.length; idx++) {
          const g = AppState.gurus[idx];
          const singleZip = await JSZip.loadAsync(templateBytes);
          let docXml = await singleZip.file('word/document.xml').async('text');

          if (dOpt.paperSize === 'a4') {
            docXml = docXml.replace(/<w:pgSz\b[^>]*\/>/, '<w:pgSz w:w="11906" w:h="16838"/>');
          } else {
            docXml = docXml.replace(/<w:pgSz\b[^>]*\/>/, '<w:pgSz w:w="12242" w:h="18722"/>');
          }

          if (!dOpt.showKop) {
            docXml = docXml.replace(/<w:p\b[^>]*>[\s\S]*?rId8[\s\S]*?<\/w:p>/, '');
          }

          const isSinglePlace = (g.tempatList && g.tempatList.length === 1);
          const targetTempat = isSinglePlace ? g.tempatList[0] : '';
          const targetAlamat = (isSinglePlace && g.siswa && g.siswa.length > 0) ? (g.siswa[0].alamat || '') : '';

          docXml = docXml.replace(/B\.10\.000\/9546\/SMKN1KLK\/DIKPORA/g, ds.noSurat);

          if (!targetTempat) {
            docXml = docXml.replace(/<w:p\b[^>]*>[\s\S]*?MERGEFIELD\s+Tempat_PKL[\s\S]*?<\/w:p>/, '');
          } else {
            let replaceXml = `
              <w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
                <w:pPr><w:spacing w:after="0"/><w:ind w:left="709"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:b/><w:sz w:val="24"/></w:rPr></w:pPr>
                <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:b/><w:sz w:val="24"/></w:rPr><w:t>${escapeXml(targetTempat)}</w:t></w:r>
              </w:p>
            `;
            if (dOpt.showAlamat && targetAlamat) {
              replaceXml += `
                <w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
                  <w:pPr><w:spacing w:after="0"/><w:ind w:left="709"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="21"/></w:rPr></w:pPr>
                  <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="21"/></w:rPr><w:t>${escapeXml(targetAlamat)}</w:t></w:r>
                </w:p>
              `;
            }
            docXml = docXml.replace(/<w:p\b[^>]*>[\s\S]*?MERGEFIELD\s+Tempat_PKL[\s\S]*?<\/w:p>/, replaceXml);
          }

          docXml = docXml.replace(/<w:p\b[^>]*>[\s\S]*?MERGEFIELD\s+Nama_Guru[\s\S]*?<\/w:p>/, `
            <w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
              <w:pPr><w:tabs><w:tab w:val="left" w:pos="2160"/></w:tabs><w:spacing w:after="0" w:line="360" w:lineRule="auto"/><w:ind w:left="720"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="24"/></w:rPr></w:pPr>
              <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="24"/></w:rPr><w:t xml:space="preserve">Nama </w:t></w:r>
              <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="24"/></w:rPr><w:tab/><w:t xml:space="preserve">: </w:t></w:r>
              <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:b/><w:sz w:val="24"/></w:rPr><w:t>${escapeXml(g.guru)}</w:t></w:r>
            </w:p>
          `);

          docXml = docXml.replace(/<w:p\b[^>]*>[\s\S]*?MERGEFIELD\s+NIP[\s\S]*?<\/w:p>/, `
            <w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
              <w:pPr><w:tabs><w:tab w:val="left" w:pos="2160"/></w:tabs><w:spacing w:after="0" w:line="360" w:lineRule="auto"/><w:ind w:left="720"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="24"/></w:rPr></w:pPr>
              <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="24"/></w:rPr><w:t xml:space="preserve">NIP </w:t></w:r>
              <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="24"/></w:rPr><w:tab/><w:t xml:space="preserve">: </w:t></w:r>
              <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="24"/></w:rPr><w:t>${escapeXml(g.nip || '-')}</w:t></w:r>
            </w:p>
          `);

          docXml = docXml.replace(
            /(<w:t[^>]*>Klungkung<\/w:t>[\s\S]*?<w:t[^>]*>),(\s*)<\/w:t>/,
            `<w:t>Klungkung, ${escapeXml(ds.tglSurat)}</w:t>`
          );
          docXml = docXml.replace(/13 November 2026 sampai dengan 30 April 2027/g, escapeXml(ds.periodePkl));
          docXml = docXml.replace(/13 November 2026/g, ds.tglPelepasan);
          docXml = docXml.replace(/30 April 2027/g, ds.tglPenarikan);
          if (ds.tahunAjaran) docXml = docXml.replace(/2026\/2027/g, escapeXml(ds.tahunAjaran));
          if (ds.namaSekolah) docXml = docXml.replace(/SMK Negeri 1 Klungkung/g, escapeXml(ds.namaSekolah));
          if (ds.kepsekNama) docXml = docXml.replace(/Sri Rejeki, S\.Pd\., M\.Pd\./g, escapeXml(ds.kepsekNama));
          if (ds.kepsekNip) docXml = docXml.replace(/19770309 200903 2 010/g, escapeXml(ds.kepsekNip));

          if (AppState.appSettings.kopUrl && AppState.appSettings.kopUrl.startsWith('data:image/')) {
            try {
              const kopBytes = base64DataUrlToUint8Array(AppState.appSettings.kopUrl);
              if (singleZip.file('word/media/image1.jpg')) singleZip.file('word/media/image1.jpg', kopBytes);
              if (singleZip.file('word/media/image2.jpeg')) singleZip.file('word/media/image2.jpeg', kopBytes);
            } catch (err) {}
          }

          if (!dOpt.showTtd) {
            const activeBasah = getTtdBasahSrc();
            if (activeBasah && activeBasah.startsWith('data:image/')) {
              try {
                const ttdBasahBytes = base64DataUrlToUint8Array(activeBasah);
                if (singleZip.file('word/media/image3.png')) singleZip.file('word/media/image3.png', ttdBasahBytes);
              } catch (err) {}
            }
            const ttdTextXml = `
              <w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
                <w:pPr><w:spacing w:after="0"/><w:ind w:left="5103"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:b/><w:u w:val="single"/><w:sz w:val="24"/></w:rPr></w:pPr>
                <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:b/><w:u w:val="single"/><w:sz w:val="24"/></w:rPr><w:t>${escapeXml(ds.kepsekNama)}</w:t></w:r>
              </w:p>
              <w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
                <w:pPr><w:spacing w:after="0"/><w:ind w:left="5103"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr></w:pPr>
                <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr><w:t>${escapeXml(ds.kepsekPangkat)}</w:t></w:r>
              </w:p>
              <w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
                <w:pPr><w:spacing w:after="0"/><w:ind w:left="5103"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr></w:pPr>
                <w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr><w:t>NIP. ${escapeXml(ds.kepsekNip)}</w:t></w:r>
              </w:p>
            `;
            docXml = docXml.replace(/(<w:p\b[^>]*>[\s\S]*?rId10[\s\S]*?<\/w:p>)([\s\S]*?<w:p\b[^>]*>[\s\S]*?Lampiran 2)/, `$1\n${ttdTextXml}\n$2`);
          } else if (AppState.appSettings.ttdUrl && AppState.appSettings.ttdUrl.startsWith('data:image/')) {
            try {
              const ttdBytes = base64DataUrlToUint8Array(AppState.appSettings.ttdUrl);
              if (singleZip.file('word/media/image3.png')) singleZip.file('word/media/image3.png', ttdBytes);
            } catch (err) {}
          }

          // Lampiran rows
          const tblStartIdx = docXml.indexOf('<w:tbl');
          const tblEndIdx = docXml.indexOf('</w:tbl>', tblStartIdx) + 8;
          if (tblStartIdx !== -1 && tblEndIdx !== -1) {
            const tblXml = docXml.substring(tblStartIdx, tblEndIdx);
            const rowMatches = tblXml.match(/<w:tr[\s\S]*?<\/w:tr>/g);
            if (rowMatches && rowMatches.length >= 2) {
              const headerRow = rowMatches[0];
              let newTableRows = headerRow;

              g.siswa.forEach((s, sIdx) => {
                const noVal = sIdx + 1;
                const namaVal = escapeXml(s.siswa || s.nama || '');
                const kelasVal = escapeXml(s.kelas || '');
                const tempatVal = escapeXml(s.tempat || '');

                const studentRowXml = `
                  <w:tr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
                    <w:tc>
                      <w:tcPr><w:tcW w:w="699" w:type="dxa"/><w:tcMar><w:top w:w="100" w:type="dxa"/><w:left w:w="150" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:right w:w="150" w:type="dxa"/></w:tcMar></w:tcPr>
                      <w:p><w:pPr><w:jc w:val="center"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr><w:t>${noVal}</w:t></w:r></w:p>
                    </w:tc>
                    <w:tc>
                      <w:tcPr><w:tcW w:w="4050" w:type="dxa"/><w:tcMar><w:top w:w="100" w:type="dxa"/><w:left w:w="150" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:right w:w="150" w:type="dxa"/></w:tcMar></w:tcPr>
                      <w:p><w:pPr><w:jc w:val="left"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr><w:t>${namaVal}</w:t></w:r></w:p>
                    </w:tc>
                    <w:tc>
                      <w:tcPr><w:tcW w:w="1620" w:type="dxa"/><w:tcMar><w:top w:w="100" w:type="dxa"/><w:left w:w="150" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:right w:w="150" w:type="dxa"/></w:tcMar></w:tcPr>
                      <w:p><w:pPr><w:jc w:val="center"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr><w:t>${kelasVal}</w:t></w:r></w:p>
                    </w:tc>
                    <w:tc>
                      <w:tcPr><w:tcW w:w="3827" w:type="dxa"/><w:tcMar><w:top w:w="100" w:type="dxa"/><w:left w:w="150" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:right w:w="150" w:type="dxa"/></w:tcMar></w:tcPr>
                      <w:p><w:pPr><w:jc w:val="left"/><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Bookman Old Style" w:hAnsi="Bookman Old Style"/><w:sz w:val="22"/></w:rPr><w:t>${tempatVal}</w:t></w:r></w:p>
                    </w:tc>
                  </w:tr>
                `;
                newTableRows += studentRowXml;
              });

              const tblPrMatch = tblXml.match(/<w:tblPr[\s\S]*?<\/w:tblPr>/);
              const tblGridMatch = tblXml.match(/<w:tblGrid[\s\S]*?<\/w:tblGrid>/);
              const tblPr = tblPrMatch ? tblPrMatch[0] : '';
              const tblGrid = tblGridMatch ? tblGridMatch[0] : '';

              const newTblXml = `<w:tbl xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">${tblPr}${tblGrid}${newTableRows}</w:tbl>`;
              docXml = docXml.substring(0, tblStartIdx) + newTblXml + docXml.substring(tblEndIdx);
            }
          }

          singleZip.file('word/document.xml', docXml);
          const singleBlob = await singleZip.generateAsync({ type: 'uint8array' });
          const safeGuru = g.guru.replace(/[^a-zA-Z0-9]/g, '_');
          masterZip.file(`Surat_Pengantar_${String(idx + 1).padStart(2, '0')}_${safeGuru}.docx`, singleBlob);
        }

        const masterBlob = await masterZip.generateAsync({ type: 'blob' });
        saveAsOrDownload(masterBlob, 'Surat_Pengantar_PKL_Semua_Guru.zip');
      }
    }
  } catch (err) {
    console.error('Error generating batch ZIP:', err);
    alert('Terjadi kesalahan saat membuat file ZIP: ' + err.message);
  } finally {
    if (btn) btn.innerHTML = originalText;
    if (window.lucide) lucide.createIcons();
  }
}

// Print Current Document
function printCurrentDoc() {
  updatePaperSizeClass();
  window.print();
}

// Open Batch Print Modal
function openBatchPrintModal() {
  const modal = document.getElementById('batchPrintModal');
  const container = document.getElementById('batchPrintGuruList');
  if (!modal || !container) return;

  const activeTpl = getActiveTemplate();
  const isKeterangan = (activeTpl.id === 'tpl_surat_keterangan_pkl') || 
                       (activeTpl.name && activeTpl.name.toLowerCase().includes('keterangan'));

  const modalTitle = document.getElementById('batchPrintModalTitle');
  const modalSub = document.getElementById('batchPrintModalSubtitle');

  container.innerHTML = '';

  if (isKeterangan) {
    if (modalTitle) modalTitle.textContent = 'Cetak Massal Surat Keterangan PKL';
    if (modalSub) modalSub.textContent = 'Pilih siswa untuk dicetak Surat Keterangan PKL (1 halaman per siswa).';

    // Ambil daftar siswa aktif sesuai filter pemilihan surat yang sedang dipilih
    const students = getActiveBatchStudents();
    students.forEach((s, idx) => {
      const label = document.createElement('label');
      label.className = "flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-xs text-slate-700";
      label.innerHTML = `
        <input type="checkbox" value="${idx}" class="batch-print-item-check w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" checked>
        <span class="font-medium">${idx + 1}. ${escapeXml(s.siswa || s.nama || '-')}</span>
        <span class="text-slate-400 text-[11px] ml-auto">(${escapeXml(s.kelas || '-')} • ${escapeXml(s.tempat || '-')})</span>
      `;
      container.appendChild(label);
    });
  } else {
    if (modalTitle) modalTitle.textContent = 'Cetak Massal Surat Pengantar PKL';
    if (modalSub) modalSub.textContent = 'Pilih guru pembimbing untuk dicetak Surat Pengantar PKL & Lampiran 2.';

    AppState.gurus.forEach((g, idx) => {
      const label = document.createElement('label');
      label.className = "flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-xs text-slate-700";
      label.innerHTML = `
        <input type="checkbox" value="${idx}" class="batch-print-item-check w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" checked>
        <span class="font-medium">${idx + 1}. ${escapeXml(g.guru)}</span>
        <span class="text-slate-400 ml-auto">(${g.siswa.length} Siswa)</span>
      `;
      container.appendChild(label);
    });
  }

  modal.style.display = 'flex';
  modal.classList.remove('hidden');
}

// Close Batch Print Modal
function closeBatchPrintModal() {
  const modal = document.getElementById('batchPrintModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.add('hidden');
  }
}

// Toggle select all in Batch Print Modal
function toggleSelectAllBatch(checked) {
  const checks = document.querySelectorAll('.batch-print-item-check');
  checks.forEach(c => c.checked = checked);
}

// Execute Batch Print (Adaptive to Surat Keterangan vs Surat Pengantar)
function executeBatchPrint() {
  const checks = document.querySelectorAll('.batch-print-item-check:checked');
  if (checks.length === 0) {
    alert('Pilih minimal satu data untuk dicetak.');
    return;
  }

  const selectedIndices = Array.from(checks).map(c => parseInt(c.value, 10));
  const batchContainer = document.getElementById('batchPrintContainer');
  if (!batchContainer) return;

  batchContainer.innerHTML = '';
  const ds = AppState.docSettings;
  const dOpt = AppState.displayOptions;
  const activeTpl = getActiveTemplate();
  const kopSrc = getKopSrc();
  const isKeterangan = (activeTpl.id === 'tpl_surat_keterangan_pkl') || 
                       (activeTpl.name && activeTpl.name.toLowerCase().includes('keterangan'));

  if (isKeterangan) {
    // CETAK MASSAL SURAT KETERANGAN PKL (1 Halaman per siswa, Tanpa Lampiran 2)
    const students = getActiveBatchStudents();

    selectedIndices.forEach((sIdx) => {
      const s = students[sIdx];
      if (!s) return;

      const sNama = s.siswa || s.nama || '-';
      const sNis = s.nis || '-';
      const sNisn = s.nisn || '-';
      const sKelas = s.kelas || '-';
      const sJurusan = s.jurusan || getJurusanFromKelas(s.kelas) || s.kelas || '-';
      const sTempat = s.tempat || 'Marvella';

      const letterMock = {
        guruNama: s.guru || '-',
        guruNip: s.nip || '-',
        tempatPkl: sTempat,
        alamatPkl: s.alamat || '',
        isSpecificTempat: true,
        students: [s],
        totalSiswa: 1,
        siswa: sNama,
        nis: sNis,
        nisn: sNisn,
        kelas: sKelas,
        jurusan: sJurusan
      };

      const resolvedBody = resolveTemplateVariables(activeTpl.htmlContent, letterMock, ds);

      const pageWrapper = document.createElement('div');
      pageWrapper.className = `doc-page ${dOpt.paperSize === 'f4' ? 'paper-f4' : 'paper-a4'}`;
      pageWrapper.style.pageBreakAfter = 'always';
      pageWrapper.style.minHeight = '1000px';

      pageWrapper.innerHTML = `
        ${dOpt.showKop ? `
          <div style="text-align: center; margin-bottom: 8px;">
            <img src="${kopSrc}" alt="Kop Surat" style="width: 100%; max-height: 145px; object-fit: contain; display: block; margin: 0 auto;">
          </div>
        ` : ''}

        <div style="text-align: center; margin-top: 10px; margin-bottom: 14px;">
          <div style="font-size: 13pt; font-weight: bold; text-decoration: underline; letter-spacing: 1px;">SURAT KETERANGAN</div>
          <div style="font-size: 11pt; margin-top: 2px;">Nomor: ${escapeXml(ds.noSurat)}</div>
        </div>

        <div style="text-align: justify; line-height: 1.4; font-size: 11pt;">
          ${resolvedBody}
        </div>

        <div style="width: 100%; display: flex; justify-content: flex-end; margin-top: 16px; page-break-inside: avoid;">
          <div style="width: 250px; text-align: left;">
            <div>Ditetapkan di Klungkung</div>
            <div>Pada Tanggal ${escapeXml(ds.tglSurat)}</div>
            <div style="margin-top: 2px;">Kepala ${escapeXml(AppState.appSettings.namaSekolah || ds.namaSekolah)}</div>
            ${getTtdHtml(ds, dOpt)}
          </div>
        </div>
      `;

      batchContainer.appendChild(pageWrapper);
    });
  } else {
    // CETAK MASSAL SURAT PENGANTAR PKL (+ Lampiran 2 Siswa)
    selectedIndices.forEach((gIdx) => {
      const g = AppState.gurus[gIdx];
      if (!g) return;
      const isSinglePlace = g.tempatList && g.tempatList.length === 1;
      const targetTempat = isSinglePlace ? g.tempatList[0] : '';
      const targetAlamat = (isSinglePlace && g.siswa && g.siswa.length > 0) ? (g.siswa[0].alamat || '') : '';
      const letterMock = { 
        guruNama: g.guru, 
        guruNip: g.nip, 
        tempatPkl: targetTempat, 
        alamatPkl: targetAlamat, 
        isSpecificTempat: isSinglePlace,
        students: g.siswa
      };

      const pageWrapper = document.createElement('div');
      pageWrapper.className = `doc-page ${dOpt.paperSize === 'f4' ? 'paper-f4' : 'paper-a4'}`;
      pageWrapper.style.pageBreakAfter = 'always';

      let tableRows = '';
      g.siswa.forEach((s, sIdx) => {
        tableRows += `
          <tr>
            <td style="padding: 6px; text-align: center; border: 1px solid #000;">${sIdx + 1}</td>
            <td style="padding: 6px; border: 1px solid #000;">${escapeXml(s.siswa || s.nama)}</td>
            <td style="padding: 6px; text-align: center; border: 1px solid #000;">${escapeXml(s.kelas)}</td>
            <td style="padding: 6px; border: 1px solid #000;">${escapeXml(s.tempat)}</td>
          </tr>
        `;
      });

      const resolvedBody = resolveTemplateVariables(activeTpl.htmlContent, letterMock, ds);

      pageWrapper.innerHTML = `
        ${dOpt.showKop ? `
          <div style="text-align: center; margin-bottom: 8px;">
            <img src="${kopSrc}" alt="Kop Surat" style="width: 100%; max-height: 145px; object-fit: contain; display: block; margin: 0 auto;">
          </div>
        ` : ''}

        <div style="text-align: center; margin-top: 10px; margin-bottom: 14px;">
          <div style="font-size: 13pt; font-weight: bold; text-decoration: underline; letter-spacing: 1px;">SURAT PENGANTAR</div>
          <div style="font-size: 11pt; margin-top: 2px;">Nomor: ${escapeXml(ds.noSurat)}</div>
        </div>

        <div style="margin-bottom: 14px;">
          <table style="width: 100%;">
            <tr>
              <td style="width: 10%; vertical-align: top;">Kepada:</td>
              <td></td>
            </tr>
            <tr>
              <td style="vertical-align: top;">Yth.</td>
              <td>
                <div style="font-weight: bold;">Pimpinan DU/DI</div>
                ${targetTempat ? `<div style="font-weight: bold;">${escapeXml(targetTempat)}</div>` : ''}
                ${(targetTempat && dOpt.showAlamat && targetAlamat) ? `<div style="font-size: 9.5pt; color: #333;">${escapeXml(targetAlamat)}</div>` : ''}
                <div>di -</div>
                <div style="text-indent: 20px;">Tempat</div>
              </td>
            </tr>
          </table>
        </div>

        <div style="text-align: justify; line-height: 1.35; font-size: 11pt;">
          ${resolvedBody}
        </div>

        <div style="width: 100%; display: flex; justify-content: flex-end; margin-top: 10px; page-break-inside: avoid;">
          <div style="width: 250px; text-align: left;">
            <div>Klungkung, ${escapeXml(ds.tglSurat)}</div>
            <div>Kepala ${escapeXml(AppState.appSettings.namaSekolah || ds.namaSekolah)}</div>
            ${getTtdHtml(ds, dOpt)}
          </div>
        </div>

        <!-- Lampiran 2 -->
        <div style="page-break-before: always; margin-top: 30px;">
          <div style="font-weight: bold; margin-bottom: 10px;">
            Lampiran 2 : <br>
            Daftar Nama Siswa Peserta PKL
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 10.5pt;" border="1">
            <thead>
              <tr style="background-color: #f1f5f9; text-align: center; font-weight: bold;">
                <td style="padding: 6px; width: 35px; border: 1px solid #000;">No</td>
                <td style="padding: 6px; border: 1px solid #000;">Nama Siswa</td>
                <td style="padding: 6px; width: 85px; border: 1px solid #000;">Kelas</td>
                <td style="padding: 6px; border: 1px solid #000;">Tempat PKL</td>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      `;

      batchContainer.appendChild(pageWrapper);
    });
  }

  closeBatchPrintModal();
  updatePaperSizeClass();
  document.body.classList.add('batch-print-active');
  window.print();
  document.body.classList.remove('batch-print-active');
}

// ================= DATABASE SYNC & DOWNLOAD =================

// Database Backend Check and Sync
async function checkAndSyncDatabaseBackend() {
  let backendOk = false;
  try {
    const res = await fetch('/api/data', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        AppState.records = data;
        AppState.isDatabaseConnected = true;
        backendOk = true;
        saveRecordsToStorage();
        rebuildIndices();
        populateDropdowns();
        renderPreview();
        renderDatabaseTable();
        updateDatabaseStatusBadge();
        console.log(`[DB] Berhasil memuat ${data.length} data siswa dari database SQLite backend.`);
      }
    }
  } catch (err) {
    // Mode statis GitHub Pages / offline
  }

  if (!backendOk) {
    AppState.isDatabaseConnected = false;
    // Jika records masih kosong (misal baru pertama kali buka GitHub Pages), muat dari file js
    if (!AppState.records || AppState.records.length === 0) {
      if (typeof INITIAL_PKL_RECORDS !== 'undefined' && INITIAL_PKL_RECORDS.length > 0) {
        AppState.records = [...INITIAL_PKL_RECORDS];
      } else if (typeof DEFAULT_PKL_DATA !== 'undefined' && DEFAULT_PKL_DATA.length > 0) {
        AppState.records = [...DEFAULT_PKL_DATA];
      } else {
        try {
          const jsonRes = await fetch('js/data_pkl.json');
          if (jsonRes.ok) {
            const jsonData = await jsonRes.json();
            if (Array.isArray(jsonData) && jsonData.length > 0) {
              AppState.records = jsonData;
            }
          }
        } catch (e) {}
      }
      saveRecordsToStorage();
      rebuildIndices();
      populateDropdowns();
      renderPreview();
      renderDatabaseTable();
    }
    updateDatabaseStatusBadge();
  }

  // Sinkronkan daftar template dari backend SQLite jika backend aktif
  if (AppState.isDatabaseConnected) {
    try {
      const tplRes = await fetch('/api/templates?t=' + Date.now(), { cache: 'no-store' });
      if (tplRes.ok) {
        const tpls = await tplRes.json();
        if (Array.isArray(tpls) && tpls.length > 0) {
          tpls.forEach(serverTpl => {
            const existingIdx = AppState.templates.findIndex(t => t.id === serverTpl.id);
            if (existingIdx !== -1) {
              AppState.templates[existingIdx] = serverTpl;
            } else {
              AppState.templates.push(serverTpl);
            }
          });
          saveTemplatesToStorage();
          populateSidebarTemplateSelect();
          renderTemplateTable();
        }
      }
    } catch (tplErr) {}
  }
}

function updateDatabaseStatusBadge() {
  const badge = document.getElementById('dbConnectionStatus');
  if (!badge) return;
  if (AppState.isDatabaseConnected) {
    badge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-0.5';
    badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span><span>Database SQLite Server Aktif: <code>database/surat_pkl.db</code> (${AppState.records.length} data siswa aktif)</span>`;
  } else {
    badge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-0.5';
    badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500"></span><span>Database Web Aktif: (${AppState.records.length} data siswa aktif)</span>`;
  }
}

function downloadSqliteDatabase() {
  const isHttp = window.location.protocol.startsWith('http');
  const a = document.createElement('a');
  a.href = isHttp ? '/api/db/download-db' : 'database/surat_pkl.db';
  a.download = 'surat_pkl.db';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('Mengunduh berkas database SQLite (surat_pkl.db)...');
}

function downloadSqlDatabase() {
  const isHttp = window.location.protocol.startsWith('http');
  const a = document.createElement('a');
  a.href = isHttp ? '/api/db/download-sql' : 'database/surat_pkl.sql';
  a.download = 'surat_pkl.sql';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('Mengunduh berkas skrip database SQL (surat_pkl.sql)...');
}

async function handleDatabaseImport(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const fileName = file.name;
  const fileExt = fileName.split('.').pop().toLowerCase();
  if (!['db', 'sqlite', 'sqlite3', 'sql'].includes(fileExt)) {
    showToast('Format berkas tidak didukung. Harap pilih berkas .db, .sqlite, atau .sql', 'error');
    event.target.value = '';
    return;
  }

  const confirmMsg = `Apakah Anda yakin ingin memulihkan database dari berkas "${fileName}"?\n\nSistem akan mencadangkan database aktif saat ini ke surat_pkl.db.bak secara otomatis sebelum pemulihan dijalankan.`;
  if (!confirm(confirmMsg)) {
    event.target.value = '';
    return;
  }

  showToast(`Memproses pemulihan database dari ${fileName}...`);

  const reader = new FileReader();
  reader.onload = async (e) => {
    const dataUrl = e.target.result;
    const isHttp = window.location.protocol.startsWith('http');

    if (isHttp) {
      try {
        const res = await fetch('/api/db/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: fileName,
            data: dataUrl
          })
        });

        const resData = await res.json();
        if (res.ok && resData.success) {
          if (resData.records && Array.isArray(resData.records)) {
            AppState.records = resData.records;
            processData();
          }
          if (resData.settings) {
            AppState.appSettings = { ...AppState.appSettings, ...resData.settings };
            applyAppSettingsToUI();
          }
          if (resData.templates && Array.isArray(resData.templates)) {
            AppState.templates = resData.templates;
            renderTemplateSelect();
          }

          renderTable();
          renderPreview();
          updateDatabaseStatusBadge();

          // Refresh stats in settings tab
          const totalSiswaEl = document.getElementById('dbSettingTotalRows');
          if (totalSiswaEl) totalSiswaEl.textContent = AppState.records.length;
          const totalGurusEl = document.getElementById('dbSettingTotalGurus');
          if (totalGurusEl) totalGurusEl.textContent = AppState.gurus.length;
          const totalTempatEl = document.getElementById('dbSettingTotalTempat');
          if (totalTempatEl) {
            const tempatSet = new Set(AppState.records.map(r => (r.tempat || '').trim()).filter(Boolean));
            totalTempatEl.textContent = tempatSet.size;
          }

          showToast(`Berhasil memulihkan database! ${resData.count || AppState.records.length} data siswa aktif dimuat.`);
        } else {
          showToast(`Gagal memulihkan database: ${resData.error || 'Terjadi kesalahan pada server.'}`, 'error');
        }
      } catch (err) {
        showToast(`Gagal menghubungi server database: ${err.message}`, 'error');
      }
    } else {
      showToast('Pemulihan database penuh membutuhkan server backend aktif. Silakan buka aplikasi melalui start.bat.', 'warning');
    }

    event.target.value = '';
  };

  reader.onerror = () => {
    showToast('Gagal membaca berkas yang dipilih.', 'error');
    event.target.value = '';
  };

  reader.readAsDataURL(file);
}

async function syncRecordsToDatabase(showFeedback = true) {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(AppState.records)
    });
    if (res.ok) {
      const data = await res.json();
      AppState.isDatabaseConnected = true;
      updateDatabaseStatusBadge();
      if (showFeedback) showToast(`Berhasil menyimpan ${data.count || AppState.records.length} data siswa ke database SQLite!`);
    } else {
      if (showFeedback) showToast('Gagal menyinkronkan ke server database.', 'error');
    }
  } catch (err) {
    if (showFeedback) showToast('Mode offline: Data tersimpan di penyimpanan lokal peramban (localStorage).', 'info');
  }
}

async function rebuildDatabaseFromBackend() {
  if (!confirm('Inisialisasi ulang database dari file data_pkl.json dan pengaturan awal?')) return;
  try {
    const res = await fetch('/api/db/init', { method: 'POST' });
    if (res.ok) {
      showToast('Database SQLite berhasil diinisialisasi ulang dari sumber data!');
      await checkAndSyncDatabaseBackend();
    } else {
      showToast('Gagal menginisialisasi database.', 'error');
    }
  } catch (err) {
    showToast('Koneksi ke backend server tidak tersedia untuk inisialisasi ulang.', 'error');
  }
}

// Database Manager Modal
function openDatabaseModal() {
  const modal = document.getElementById('databaseModal');
  if (!modal) return;
  renderDatabaseTable();
  updateDatabaseStatusBadge();
  modal.style.display = 'flex';
  modal.classList.remove('hidden');
  if (window.lucide) {
    try { lucide.createIcons(); } catch(e) {}
  }
}

function closeDatabaseModal() {
  const modal = document.getElementById('databaseModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.add('hidden');
  }
}

// Render Database Table in Manager Modal
function renderDatabaseTable() {
  const tbody = document.getElementById('dbTableBody');
  const totalCount = document.getElementById('dbTotalRows');
  if (!tbody) return;

  const q = AppState.dbSearchQuery.toLowerCase();
  const fKelas = AppState.dbFilterKelas;

  const filtered = AppState.records.filter(r => {
    const matchSearch = !q || 
      (r.guru && r.guru.toLowerCase().includes(q)) ||
      (r.siswa && r.siswa.toLowerCase().includes(q)) ||
      (r.nis && r.nis.toLowerCase().includes(q)) ||
      (r.nisn && r.nisn.toLowerCase().includes(q)) ||
      (r.kelas && r.kelas.toLowerCase().includes(q)) ||
      (r.jurusan && r.jurusan.toLowerCase().includes(q)) ||
      (r.tempat && r.tempat.toLowerCase().includes(q));
    const matchKelas = fKelas === 'all' || r.kelas === fKelas;
    return matchSearch && matchKelas;
  });

  if (totalCount) totalCount.textContent = `${filtered.length} / ${AppState.records.length}`;

  tbody.innerHTML = '';
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="p-4 text-center text-slate-400 text-xs">Tidak ada data siswa ditemukan.</td></tr>`;
    return;
  }

  // Populate Unique Classes in Filter Dropdown if empty
  const filterSelect = document.getElementById('dbFilterKelasSelect');
  if (filterSelect && filterSelect.options.length <= 1) {
    const classes = Array.from(new Set(AppState.records.map(r => r.kelas).filter(Boolean))).sort();
    classes.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      filterSelect.appendChild(opt);
    });
  }

  filtered.slice(0, 100).forEach((r, idx) => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50 border-b border-slate-100 text-xs text-slate-700 transition";
    tr.innerHTML = `
      <td class="p-2.5 text-center font-medium">${idx + 1}</td>
      <td class="p-2.5 font-semibold text-slate-900">${r.siswa || ''}</td>
      <td class="p-2.5 text-center font-mono text-[11px] text-slate-600">${r.nis || '-'}</td>
      <td class="p-2.5 text-center font-mono text-[11px] text-slate-600">${r.nisn || '-'}</td>
      <td class="p-2.5 text-center"><span class="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px]">${r.kelas || ''}</span></td>
      <td class="p-2.5 text-slate-700 text-[11px]">${r.jurusan || getJurusanFromKelas(r.kelas) || '-'}</td>
      <td class="p-2.5">${r.guru || ''}</td>
      <td class="p-2.5 font-medium text-indigo-700">${r.tempat || ''}</td>
      <td class="p-2.5 text-slate-500 max-w-xs truncate" title="${r.alamat || ''}">${r.alamat || '-'}</td>
      <td class="p-2.5 text-center">
        <div class="flex items-center justify-center gap-1">
          <button onclick="openStudentModal('edit', ${r.no})" class="text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-50 transition" title="Edit Data Siswa">
            <i data-lucide="edit-3" class="w-4 h-4"></i>
          </button>
          <button onclick="deleteRecord(${r.no})" class="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 transition" title="Hapus Data Siswa">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (window.lucide) lucide.createIcons();
}

// Open Student Modal (Add or Edit)
function openStudentModal(mode, no) {
  const modal = document.getElementById('studentModal');
  const title = document.getElementById('studentModalTitle');
  const icon = document.getElementById('studentModalIcon');
  const submitText = document.getElementById('studentModalSubmitBtnText');
  const form = document.getElementById('studentForm');
  if (!modal || !form) return;

  // Populate Datalist Suggestions
  const guruList = document.getElementById('guruSuggestionsList');
  if (guruList) {
    const gurus = Array.from(new Set(AppState.records.map(r => r.guru).filter(Boolean))).sort();
    guruList.innerHTML = gurus.map(g => `<option value="${escapeXml(g)}">`).join('');
  }
  const tempatList = document.getElementById('tempatSuggestionsList');
  if (tempatList) {
    const places = Array.from(new Set(AppState.records.map(r => r.tempat).filter(Boolean))).sort();
    tempatList.innerHTML = places.map(p => `<option value="${escapeXml(p)}">`).join('');
  }

  // Setup auto-fill NIP and Alamat when Guru or Tempat is selected/typed
  const inputGuru = document.getElementById('studentFormGuru');
  const inputNip = document.getElementById('studentFormNip');
  if (inputGuru && inputNip) {
    inputGuru.onchange = function() {
      const match = AppState.records.find(r => r.guru && r.guru.toLowerCase() === inputGuru.value.trim().toLowerCase());
      if (match && match.nip && !inputNip.value) {
        inputNip.value = match.nip;
      }
    };
  }

  const inputTempat = document.getElementById('studentFormTempat');
  const inputAlamat = document.getElementById('studentFormAlamat');
  if (inputTempat && inputAlamat) {
    inputTempat.onchange = function() {
      const match = AppState.records.find(r => r.tempat && r.tempat.toLowerCase() === inputTempat.value.trim().toLowerCase());
      if (match && match.alamat && !inputAlamat.value) {
        inputAlamat.value = match.alamat;
      }
    };
  }

  if (mode === 'edit' && no !== undefined) {
    const rec = AppState.records.find(r => r.no === no);
    if (!rec) return;
    if (title) title.textContent = 'Edit Data Siswa PKL';
    if (icon) icon.setAttribute('data-lucide', 'edit-3');
    if (submitText) submitText.textContent = 'Perbarui Data';

    document.getElementById('studentFormNo').value = rec.no;
    document.getElementById('studentFormNama').value = rec.siswa || '';
    document.getElementById('studentFormNis').value = rec.nis || '';
    document.getElementById('studentFormNisn').value = rec.nisn || '';
    document.getElementById('studentFormKelas').value = rec.kelas || '';
    document.getElementById('studentFormJurusan').value = rec.jurusan || getJurusanFromKelas(rec.kelas) || '';
    document.getElementById('studentFormGuru').value = rec.guru || '';
    document.getElementById('studentFormNip').value = rec.nip || '';
    document.getElementById('studentFormTempat').value = rec.tempat || '';
    document.getElementById('studentFormAlamat').value = rec.alamat || '';
  } else {
    // Add mode
    if (title) title.textContent = 'Tambah Data Siswa PKL Baru';
    if (icon) icon.setAttribute('data-lucide', 'user-plus');
    if (submitText) submitText.textContent = 'Simpan Siswa Baru';

    document.getElementById('studentFormNo').value = '';
    document.getElementById('studentFormNama').value = '';
    document.getElementById('studentFormNis').value = '';
    document.getElementById('studentFormNisn').value = '';
    document.getElementById('studentFormKelas').value = '';
    document.getElementById('studentFormJurusan').value = '';
    const curGuru = AppState.gurus[AppState.selectedGuruIdx];
    document.getElementById('studentFormGuru').value = curGuru ? curGuru.guru : '';
    document.getElementById('studentFormNip').value = curGuru ? curGuru.nip : '';
    document.getElementById('studentFormTempat').value = '';
    document.getElementById('studentFormAlamat').value = '';
  }

  modal.style.display = 'flex';
  modal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeStudentModal() {
  const modal = document.getElementById('studentModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.add('hidden');
  }
}

async function saveStudentForm() {
  const noVal = document.getElementById('studentFormNo').value;
  const nama = document.getElementById('studentFormNama').value.trim();
  const nis = (document.getElementById('studentFormNis') ? document.getElementById('studentFormNis').value.trim() : '');
  const nisn = (document.getElementById('studentFormNisn') ? document.getElementById('studentFormNisn').value.trim() : '');
  const kelas = document.getElementById('studentFormKelas').value.trim();
  const rawJurusan = (document.getElementById('studentFormJurusan') ? document.getElementById('studentFormJurusan').value.trim() : '');
  const jurusan = rawJurusan || getJurusanFromKelas(kelas);
  const guru = document.getElementById('studentFormGuru').value.trim();
  const nip = document.getElementById('studentFormNip').value.trim();
  const tempat = document.getElementById('studentFormTempat').value.trim();
  const alamat = document.getElementById('studentFormAlamat').value.trim();

  if (!nama || !kelas || !guru || !tempat) {
    alert('Harap lengkapi semua kolom wajib (Nama Siswa, Kelas, Guru Pembimbing, dan Tempat PKL).');
    return;
  }

  if (noVal) {
    // Edit Mode
    const no = parseInt(noVal, 10);
    const idx = AppState.records.findIndex(r => r.no === no);
    if (idx !== -1) {
      AppState.records[idx].siswa = nama;
      AppState.records[idx].nis = nis;
      AppState.records[idx].nisn = nisn;
      AppState.records[idx].kelas = kelas;
      AppState.records[idx].jurusan = jurusan;
      AppState.records[idx].guru = guru;
      AppState.records[idx].nip = nip;
      AppState.records[idx].tempat = tempat;
      AppState.records[idx].alamat = alamat;
    }

    if (window.fetch && window.location.protocol.startsWith('http')) {
      try {
        await fetch('/api/siswa/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ no: no, siswa: nama, nis: nis, nisn: nisn, kelas: kelas, jurusan: jurusan, guru: guru, nip: nip, tempat: tempat, alamat: alamat })
        });
      } catch (e) {
        console.warn('Backend update error:', e);
      }
    }
    showToast(`Data siswa "${nama}" berhasil diperbarui dan disimpan ke database!`);
  } else {
    // Add Mode
    const maxNo = AppState.records.length > 0 ? Math.max(...AppState.records.map(r => r.no || 0)) : 0;
    const newNo = maxNo + 1;
    const newRec = {
      no: newNo,
      siswa: nama,
      nis: nis,
      nisn: nisn,
      kelas: kelas,
      jurusan: jurusan,
      guru: guru,
      nip: nip,
      tempat: tempat,
      alamat: alamat
    };
    AppState.records.push(newRec);

    if (window.fetch && window.location.protocol.startsWith('http')) {
      try {
        await fetch('/api/siswa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRec)
        });
      } catch (e) {
        console.warn('Backend add error:', e);
      }
    }
    showToast(`Data siswa baru "${nama}" berhasil ditambahkan ke database!`);
  }

  saveRecordsToStorage();
  rebuildIndices();
  populateDropdowns();
  updateUIFromState();
  renderPreview();
  renderDatabaseTable();
  updateDatabaseStatusBadge();
  closeStudentModal();
}

// Delete Record
async function deleteRecord(no) {
  const rec = AppState.records.find(r => r.no === no);
  const studentName = rec ? rec.siswa : `#${no}`;
  if (!confirm(`Hapus data siswa "${studentName}" dari database?`)) return;

  AppState.records = AppState.records.filter(r => r.no !== no);
  AppState.records.forEach((r, idx) => { r.no = idx + 1; });

  if (window.fetch && window.location.protocol.startsWith('http')) {
    try {
      await fetch('/api/siswa/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ no: no })
      });
    } catch (e) {
      console.warn('Backend delete error:', e);
    }
  }

  saveRecordsToStorage();
  rebuildIndices();
  populateDropdowns();
  updateUIFromState();
  renderPreview();
  renderDatabaseTable();
  updateDatabaseStatusBadge();
  showToast(`Data siswa "${studentName}" berhasil dihapus dari database.`);
}

// Reset data to initial default from Data_Pembagian_Tugas_PKL.xlsx
function resetToDefaultData() {
  if (!confirm('Apakah Anda yakin ingin mengembalikan seluruh data ke data asli dari Excel? Perubahan manual akan hilang.')) return;
  if (typeof DEFAULT_PKL_DATA !== 'undefined') {
    AppState.records = [...DEFAULT_PKL_DATA];
    saveRecordsToStorage();
    rebuildIndices();
    populateDropdowns();
    updateUIFromState();
    renderPreview();
    renderDatabaseTable();
    syncRecordsToDatabase(false);
    alert('Data berhasil direset ke versi asli!');
  }
}

// Handle Excel Upload (.xlsx) using SheetJS
function handleExcelUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (typeof XLSX === 'undefined') {
    alert('Pustaka SheetJS belum dimuat. Pastikan terhubung internet atau refresh halaman.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length <= 1) {
        alert('File Excel kosong atau tidak memiliki baris data.');
        return;
      }

      const headers = jsonData[0].map(h => (h || '').toString().trim().toLowerCase());
      const colNo = headers.findIndex(h => h.includes('no'));
      const colGuru = headers.findIndex(h => h.includes('guru'));
      const colNip = headers.findIndex(h => h.includes('nip'));
      const colSiswa = headers.findIndex(h => h.includes('siswa'));
      const colNis = headers.findIndex(h => h === 'nis' || h.includes('nomor induk') || h.includes('nis '));
      const colNisn = headers.findIndex(h => h.includes('nisn'));
      const colKelas = headers.findIndex(h => h.includes('kelas'));
      const colJurusan = headers.findIndex(h => h.includes('jurusan') || h.includes('keahlian') || h.includes('prodi'));
      const colTempat = headers.findIndex(h => h.includes('tempat'));
      const colAlamat = headers.findIndex(h => h.includes('alamat'));

      const newRecords = [];
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue;
        const siswa = row[colSiswa !== -1 ? colSiswa : 3] || '';
        if (!siswa) continue;

        const kelasVal = (row[colKelas !== -1 ? colKelas : 4] || '').toString().trim();
        const jurVal = (colJurusan !== -1 ? row[colJurusan] : '') || getJurusanFromKelas(kelasVal);

        newRecords.push({
          no: i,
          guru: (row[colGuru !== -1 ? colGuru : 1] || '').toString().trim(),
          nip: (row[colNip !== -1 ? colNip : 2] || '').toString().trim(),
          siswa: siswa.toString().trim(),
          nis: (colNis !== -1 ? (row[colNis] || '') : '').toString().trim(),
          nisn: (colNisn !== -1 ? (row[colNisn] || '') : '').toString().trim(),
          kelas: kelasVal,
          jurusan: (jurVal || '').toString().trim(),
          tempat: (row[colTempat !== -1 ? colTempat : 5] || '').toString().trim(),
          alamat: (row[colAlamat !== -1 ? colAlamat : 6] || '').toString().trim()
        });
      }

      if (newRecords.length === 0) {
        alert('Gagal mendeteksi kolom data siswa. Pastikan format kolom: No, Nama Guru, NIP, Nama Siswa, Kelas, Tempat PKL, Alamat PKL.');
        return;
      }

      AppState.records = newRecords;
      saveRecordsToStorage();
      rebuildIndices();
      populateDropdowns();
      updateUIFromState();
      renderPreview();
      renderDatabaseTable();
      syncRecordsToDatabase(false);
      alert(`Berhasil mengimpor ${newRecords.length} data siswa dari file Excel!`);
    } catch (err) {
      console.error('Error parsing Excel:', err);
      alert('Terjadi kesalahan saat membaca file Excel: ' + err.message);
    }
    e.target.value = '';
  };
  reader.readAsArrayBuffer(file);
}

// Export Records to Excel (.xlsx) using SheetJS
function exportRecordsToExcel() {
  if (typeof XLSX === 'undefined') {
    alert('Pustaka SheetJS belum dimuat.');
    return;
  }

  const rows = AppState.records.map((r, idx) => ({
    'No': idx + 1,
    'Nama Guru': r.guru || '',
    'NIP': r.nip || '',
    'Nama Siswa': r.siswa || '',
    'NIS': r.nis || '',
    'NISN': r.nisn || '',
    'Kelas': r.kelas || '',
    'Jurusan': r.jurusan || getJurusanFromKelas(r.kelas) || '',
    'Tempat PKL': r.tempat || '',
    'Alamat PKL': r.alamat || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data PKL');
  XLSX.writeFile(workbook, 'Data_Pembagian_Tugas_PKL_Export.xlsx');
}

// Toast notification helper
function showToast(msg) {
  const existing = document.getElementById('appToastNotice');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'appToastNotice';
  toast.className = 'fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-bounce';
  toast.innerHTML = `
    <i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i>
    <span>${msg}</span>
  `;
  document.body.appendChild(toast);
  if (window.lucide) lucide.createIcons();
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

// Helper: Escape XML special characters
function escapeXml(unsafe) {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', initApp);
