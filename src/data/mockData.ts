import { 
  MadrasahProfile, 
  MasterGuru, 
  MasterTendik, 
  SupervisiGuru, 
  SupervisiTendik, 
  TindakLanjut,
  ScoreCategory,
  JadwalSupervisi
} from '../types';

export const defaultMadrasahProfile: MadrasahProfile = {
  nama: 'Madrasah Aliyah Mambaul Ulum',
  nsm: '131235140028',
  npsn: '20581452',
  kepalaMadrasah: 'Muzakki, S.Pd.',
  nipKepala: '19780612 200501 1 003',
  tahun: '2026',
  semester: 'Ganjil 2026/2027',
  alamat: 'Desa Sumberduren, Kecamatan Krucil, Kabupaten Probolinggo',
  kelurahan: 'Desa Sumberduren',
  kecamatan: 'Krucil',
  kabupaten: 'Kabupaten Probolinggo',
  provinsi: 'Jawa Timur',
  telepon: '(0335) 841290',
  email: 'ma.mambaululum.krucil@kemenag.go.id',
  filosofi: 'Kurikulum Berbasis Cinta (KBC) & Pembelajaran Mendalam (Deep Learning)'
};

export const defaultMasterGuru: MasterGuru[] = [
  {
    id: 'GUR-01',
    nama: 'Ustadz Ahmad Farhan, S.Pd.I.',
    mapel: 'Al-Qur\'an Hadits',
    nip: '19840315 200912 1 002',
    pendidikan: 'S1 Pendidikan Agama Islam',
    kontak: '0812-4455-6677'
  },
  {
    id: 'GUR-02',
    nama: 'Siti Nurul Hidayah, S.Pd., M.Pd.',
    mapel: 'Bahasa Indonesia',
    nip: '19890520 201402 2 005',
    pendidikan: 'S2 Pendidikan Bahasa Indonesia',
    kontak: '0813-7788-9900'
  },
  {
    id: 'GUR-03',
    nama: 'M. Wildan Al-Ghozali, S.Pd.',
    mapel: 'Matematika Peminatan',
    nip: '19920810 201903 1 008',
    pendidikan: 'S1 Pendidikan Matematika',
    kontak: '0857-1122-3344'
  },
  {
    id: 'GUR-04',
    nama: 'Dewi Masruroh, M.Pd.',
    mapel: 'Biologi',
    nip: '19871114 201101 2 004',
    pendidikan: 'S2 Pendidikan Biologi',
    kontak: '0819-2233-4455'
  },
  {
    id: 'GUR-05',
    nama: 'K.H. Lukman Hakim, Lc., M.Hum.',
    mapel: 'Bahasa Arab',
    nip: '19790104 200604 1 007',
    pendidikan: 'S2 Filologi & Bahasa Arab (Al-Azhar)',
    kontak: '0821-3344-5566'
  },
  {
    id: 'GUR-06',
    nama: 'Anisa Rahmawati, S.Pd.',
    mapel: 'Bahasa Inggris',
    nip: '19940722 202012 2 012',
    pendidikan: 'S1 Pendidikan Bahasa Inggris',
    kontak: '0878-5566-7788'
  },
  {
    id: 'GUR-07',
    nama: 'Zainal Abidin, S.Ag.',
    mapel: 'Akidah Akhlak',
    nip: '19830218 200801 1 003',
    pendidikan: 'S1 Ushuluddin & Akhlak Tasawuf',
    kontak: '0815-6677-8899'
  },
  {
    id: 'GUR-08',
    nama: 'Nur Hayati, S.Si.',
    mapel: 'Kimia',
    nip: '19901205 201503 2 009',
    pendidikan: 'S1 Kimia Sains',
    kontak: '0822-7788-9911'
  }
];

export const defaultMasterTendik: MasterTendik[] = [
  {
    id: 'TND-01',
    nama: 'H. Abdul Rasyid, S.Sos.',
    bidang_tugas: 'Kepegawaian',
    nip: '19800412 200701 1 005',
    kontak: '0812-9988-7766'
  },
  {
    id: 'TND-02',
    nama: 'Bambang Sugiyanto, S.AP.',
    bidang_tugas: 'Sarana Prasarana',
    nip: '19850918 201001 1 009',
    kontak: '0813-2211-4433'
  },
  {
    id: 'TND-03',
    nama: 'Lailatul Fitriyah, A.Md.',
    bidang_tugas: 'Persuratan',
    nip: '19930625 201903 2 015',
    kontak: '0856-3344-5522'
  },
  {
    id: 'TND-04',
    nama: 'Syahrul Ramadhan, S.Kom.',
    bidang_tugas: 'Kesiswaan',
    nip: '19950117 202102 1 004',
    kontak: '0877-6655-4411'
  }
];

export const KBC_SMART_MAPPING = {
  4: {
    kategori: 'Sangat Baik' as ScoreCategory,
    catatan: 'Guru berhasil menciptakan ruang belajar yang penuh kasih, aman secara emosional, dan sukses menstimulasi nalar kritis serta pemahaman konsep yang bermakna (pembelajaran mendalam).',
    tindak_lanjut: 'Jadikan praktik baik (best practice). Bagikan strategi membangun koneksi batin dan pemikiran tingkat tinggi siswa kepada rekan sejawat.'
  },
  3: {
    kategori: 'Baik' as ScoreCategory,
    catatan: 'Pendekatan kasih sayang dan penguasaan materi esensial sudah terlihat baik, namun eksplorasi makna dan dialog kritis dengan siswa masih bisa dioptimalkan.',
    tindak_lanjut: 'Perbanyak dialog bermakna. Integrasikan lebih banyak studi kasus nyata yang menyentuh empati dan nalar kritis siswa.'
  },
  2: {
    kategori: 'Cukup' as ScoreCategory,
    catatan: 'Interaksi kelas masih kaku dan cenderung satu arah (teacher-centered). Belum terbangun koneksi emosional dan eksplorasi materi masih sebatas hafalan (surface learning).',
    tindak_lanjut: 'Lakukan refleksi pendekatan pedagogis. Kepala Madrasah akan mendampingi untuk merancang metode yang lebih memanusiakan siswa dan mendorong penalaran.'
  },
  1: {
    kategori: 'Perlu Pembinaan' as ScoreCategory,
    catatan: 'Suasana kelas kurang berpusat pada anak dan mengabaikan keberagaman potensi siswa. Prinsip Kurikulum Berbasis Cinta dan esensi belajar belum tampak.',
    tindak_lanjut: 'Pembinaan intensif wajib dilakukan. Direkomendasikan mengikuti mentoring/workshop \'Mendidik dengan Hati dan Membangun Nalar Kritis\'.'
  }
};

export const TENDIK_SMART_MAPPING = {
  4: {
    kategori: 'Sangat Baik' as ScoreCategory,
    catatan: 'Pelayanan sangat ramah, solutif, tertib administrasi, dan menciptakan iklim madrasah yang menenteramkan serta menopang pembelajaran bermakna.',
    tindak_lanjut: 'Pertahankan keteladanan prima dan tularkan budaya pelayanan ikhlas beramal dan penuh kasih kepada seluruh personil madrasah.'
  },
  3: {
    kategori: 'Baik' as ScoreCategory,
    catatan: 'Pelayanan sudah baik dan tertib, koordinasi dengan guru dan santri berjalan lancar dengan sedikit perbaikan pada kecepatan respon dan pengarsipan digital.',
    tindak_lanjut: 'Perkuat digitalisasi arsip dan tingkatkan proaktivitas dalam melayani kebutuhan sarana/administrasi KBM.'
  },
  2: {
    kategori: 'Cukup' as ScoreCategory,
    catatan: 'Pelayanan masih cenderung formalitas dan kaku. Penanganan keluhan administrasi atau sarana masih lambat merespon kebutuhan kelas.',
    tindak_lanjut: 'Lakukan refleksi budaya pelayanan madrasah. Kepala Madrasah akan mendampingi untuk restrukturisasi SOP pelayanan yang lebih responsif dan humanis.'
  },
  1: {
    kategori: 'Perlu Pembinaan' as ScoreCategory,
    catatan: 'Penataan dokumen/sarana kurang tertib dan komunikasi pelayanan terkesan kurang ramah. Menghambat iklim madrasah yang penuh kasih.',
    tindak_lanjut: 'Pembinaan manajerial intensif oleh Kepala Madrasah mengenai etika pelayanan berorientasi khidmat dan empati.'
  }
};

export const defaultTindakLanjut: TindakLanjut[] = [
  {
    id: 'TL-001',
    aspek: 'Pembelajaran Guru (Al-Qur\'an Hadits)',
    personil_nama: 'Ustadz Ahmad Farhan, S.Pd.I.',
    personil_id: 'GUR-01',
    temuan: 'Guru berhasil menciptakan ruang belajar yang penuh kasih, aman secara emosional, dan sukses menstimulasi nalar kritis serta pemahaman konsep yang bermakna (pembelajaran mendalam).',
    rencana: 'Jadikan praktik baik (best practice). Bagikan strategi membangun koneksi batin dan pemikiran tingkat tinggi siswa kepada rekan sejawat dalam Kombel Madrasah.',
    waktu: 'Minggu ke-1 November 2026',
    status: 'Completed',
    catatan_penyelesaian: 'Telah dipresentasikan dalam rapat pembinaan guru bulanan sebagai percontohan modul ajar berbasis cinta.',
    updated_at: '2026-10-12T10:00:00Z'
  },
  {
    id: 'TL-002',
    aspek: 'Pembelajaran Guru (Matematika Peminatan)',
    personil_nama: 'M. Wildan Al-Ghozali, S.Pd.',
    personil_id: 'GUR-03',
    temuan: 'Pendekatan kasih sayang dan penguasaan materi esensial sudah terlihat baik, namun eksplorasi makna dan dialog kritis dengan siswa masih bisa dioptimalkan.',
    rencana: 'Perbanyak dialog bermakna. Integrasikan lebih banyak studi kasus nyata yang menyentuh empati dan nalar kritis siswa (matematika dalam kehidupan sehari-hari).',
    waktu: 'Minggu ke-3 Oktober 2026',
    status: 'In Progress',
    catatan_penyelesaian: 'Sedang menyusun Lembar Kerja Berdiferensiasi berbasis studi kasus numerasi madrasah.',
    updated_at: '2026-10-14T08:30:00Z'
  },
  {
    id: 'TL-003',
    aspek: 'Administrasi Sarana Prasarana',
    personil_nama: 'Bambang Sugiyanto, S.AP.',
    personil_id: 'TND-02',
    temuan: 'Kebersihan dan kenyamanan ruang kelas sudah memadai, namun penandaan kode inventaris barcode belum merata di ruang laboratorium.',
    rencana: 'Lakukan re-labeling kode inventaris sarpras laboratorium dan pastikan fasilitas inklusif siswa berfungsi optimal.',
    waktu: 'Akhir Oktober 2026',
    status: 'Pending',
    updated_at: '2026-10-10T14:15:00Z'
  },
  {
    id: 'TL-004',
    aspek: 'Layanan Kesiswaan & Mutasi',
    personil_nama: 'Syahrul Ramadhan, S.Kom.',
    personil_id: 'TND-04',
    temuan: 'Penanganan keluhan siswa dan surat rekomendasi berjalan santun dan solutif. Database mutasi siswa tertata dalam Google Spreadsheet.',
    rencana: 'Tingkatkan integrasi sistem presensi digital dengan notifikasi cinta kepada orang tua/wali santri.',
    waktu: 'Minggu ke-2 November 2026',
    status: 'Pending',
    updated_at: '2026-10-14T09:00:00Z'
  }
];

export const defaultSupervisiGuru: SupervisiGuru[] = [
  {
    id: 'SG-2026-001',
    id_guru: 'GUR-01',
    nama_guru: 'Ustadz Ahmad Farhan, S.Pd.I.',
    mapel: 'Al-Qur\'an Hadits',
    tanggal: '2026-10-08',
    kelas: 'Kelas XI MA Unggulan A',
    skor_tujuan: 4,
    skor_indikator: 4,
    skor_materi: 4,
    skor_aktivitas: 4,
    catatan_total: 'Guru berhasil menciptakan ruang belajar yang penuh kasih, aman secara emosional, dan sukses menstimulasi nalar kritis serta pemahaman konsep yang bermakna (pembelajaran mendalam). Suasana tadabbur ayat berlangsung syahdu dan menggetarkan hati santri.',
    rencana_tindak_lanjut: 'Jadikan praktik baik (best practice). Bagikan strategi membangun koneksi batin dan pemikiran tingkat tinggi siswa kepada rekan sejawat.',
    total_skor: 100,
    kategori: 'Sangat Baik',
    supervisor_nama: 'Muzakki, S.Pd.',
    supervisor_nip: '19780612 200501 1 003',
    tindak_lanjut_id: 'TL-001',
    created_at: '2026-10-08T10:30:00Z'
  },
  {
    id: 'SG-2026-002',
    id_guru: 'GUR-03',
    nama_guru: 'M. Wildan Al-Ghozali, S.Pd.',
    mapel: 'Matematika Peminatan',
    tanggal: '2026-10-11',
    kelas: 'Kelas XII MIA 1',
    skor_tujuan: 3,
    skor_indikator: 3,
    skor_materi: 3,
    skor_aktivitas: 3,
    catatan_total: 'Pendekatan kasih sayang dan penguasaan materi esensial sudah terlihat baik, namun eksplorasi makna dan dialog kritis dengan siswa masih bisa dioptimalkan agar matematika dirasakan menyatu dengan kehidupan.',
    rencana_tindak_lanjut: 'Perbanyak dialog bermakna. Integrasikan lebih banyak studi kasus nyata yang menyentuh empati dan nalar kritis siswa.',
    total_skor: 75,
    kategori: 'Baik',
    supervisor_nama: 'Muzakki, S.Pd.',
    supervisor_nip: '19780612 200501 1 003',
    tindak_lanjut_id: 'TL-002',
    created_at: '2026-10-11T11:15:00Z'
  }
];

export const defaultSupervisiTendik: SupervisiTendik[] = [
  {
    id: 'ST-2026-001',
    id_tendik: 'TND-02',
    nama_tendik: 'Bambang Sugiyanto, S.AP.',
    tanggal: '2026-10-09',
    bidang_tugas: 'Sarana Prasarana',
    skor_1_sd_8: [4, 3, 4, 3, 4, 4, 3, 3],
    catatan_total: 'Pelayanan sarpras sangat suportif dan ramah terhadap kebutuhan guru dan santri. Lingkungan madrasah bersih dan asri, mendukung rasa aman dan nyaman untuk pembelajaran mendalam.',
    rencana_tindak_lanjut: 'Perkuat digitalisasi arsip pemeliharaan dan tuntaskan kode barcode barang sarpras.',
    total_skor: 87.5,
    kategori: 'Baik',
    supervisor_nama: 'Muzakki, S.Pd.',
    tindak_lanjut_id: 'TL-003',
    created_at: '2026-10-09T09:40:00Z'
  },
  {
    id: 'ST-2026-002',
    id_tendik: 'TND-04',
    nama_tendik: 'Syahrul Ramadhan, S.Kom.',
    tanggal: '2026-10-13',
    bidang_tugas: 'Kesiswaan',
    skor_1_sd_8: [4, 4, 4, 3, 4, 4, 4, 4],
    catatan_total: 'Pelayanan ramah, solutif, berempati tinggi terhadap permasalahan santri, dan sigap dalam memfasilitasi kegiatan ekstrakurikuler serta kepengurusan santri.',
    rencana_tindak_lanjut: 'Pertahankan keteladanan prima dan tularkan budaya pelayanan ikhlas beramal dan penuh kasih kepada seluruh personil madrasah.',
    total_skor: 96.88,
    kategori: 'Sangat Baik',
    supervisor_nama: 'Muzakki, S.Pd.',
    tindak_lanjut_id: 'TL-004',
    created_at: '2026-10-13T10:20:00Z'
  }
];

// Checklists for Guru (Teacher) based on Deep Learning & KBC
export const GURU_SECTIONS = [
  {
    id: 'tujuan',
    nama: '1. Tujuan Pembelajaran (Esensi & Bermakna)',
    deskripsiKBC: 'Fokus pada esensi/makna, berpusat pada potensi unik siswa, keterukuran capaian, dan relevansi nyata bagi kehidupan.',
    subItems: [
      { id: 'tuj_1', nama: 'Fokus pada Esensi & Kedalaman Makna', deskripsi: 'Tujuan pembelajaran tidak sekadar menghabiskan materi, tetapi membimbing siswa menemukan esensi hikmah dan pemahaman konsep yang mendalam.' },
      { id: 'tuj_2', nama: 'Berpusat pada Potensi & Kesiapan Siswa', deskripsi: 'Rumusan tujuan mengakomodasi keberagaman kecerdasan dan tingkat kesiapan belajar santri/siswa dengan penuh empati.' },
      { id: 'tuj_3', nama: 'Keterukuran & Kejelasan Capaian', deskripsi: 'Indikator ketercapaian tujuan terdefinisi secara jelas, terukur, dan memotivasi siswa untuk bertumbuh.' },
      { id: 'tuj_4', nama: 'Koneksi dengan Kehidupan Nyata', deskripsi: 'Tujuan mengaitkan materi ajar dengan fenomena sosial kemasyarakatan dan nilai-nilai akhlakul karimah.' }
    ]
  },
  {
    id: 'indikator',
    nama: '2. Indikator Pencapaian (Nalar Kritis & Keberagaman)',
    deskripsiKBC: 'Mengukur nalar kritis/bukan sekadar hafalan tekstual, memfasilitasi keberagaman siswa, dan selaras dengan asesmen autentik.',
    subItems: [
      { id: 'ind_1', nama: 'Stimulasi Nalar Kritis & Reflektif', deskripsi: 'Indikator menantang santri untuk menganalisis, membandingkan, dan merefleksikan, bukan sekadar mengingat (surface learning).' },
      { id: 'ind_2', nama: 'Mengakomodasi Diferensiasi Belajar', deskripsi: 'Menyediakan tangga capaian bergradasi untuk siswa dengan tempo belajar yang berbeda tanpa melabeli.' },
      { id: 'ind_3', nama: 'Keselarasan dengan Asesmen Autentik', deskripsi: 'Indikator berkorelasi langsung dengan rubrik asesmen performa, portofolio, atau proyek bermakna.' }
    ]
  },
  {
    id: 'materi',
    nama: '3. Materi & Sumber Belajar (Menggugah Empati)',
    deskripsiKBC: 'Materi yang menggugah empati dan kepedulian, sumber belajar beragam & kontekstual, serta pemanfaatan teknologi secara bijak.',
    subItems: [
      { id: 'mat_1', nama: 'Materi Menggugah Empati & Cinta Kasih', deskripsi: 'Materi disajikan dengan narasi yang menumbuhkan rasa cinta kepada ilmu, kepedulian terhadap sesama, dan kelestarian alam.' },
      { id: 'mat_2', nama: 'Keragaman Sumber Belajar Otentik', deskripsi: 'Memanfaatkan kitab turats, buku teks modern, artikel ilmiah, studi kasus nyata, dan lingkungan madrasah.' },
      { id: 'mat_3', nama: 'Pemanfaatan Teknologi Digital yang Beradab', deskripsi: 'Mengintegrasikan media digital interaktif dengan etika digital islami dan literasi informasi yang sehat.' }
    ]
  },
  {
    id: 'aktivitas',
    nama: '4. Aktivitas Pembelajaran (Ruang Aman Berpendapat)',
    deskripsiKBC: 'Pendahuluan yang menyapa hati, kegiatan inti dialogis/kritis, ruang aman berpendapat tanpa takut salah, asesmen memberdayakan, dan refleksi mendalam.',
    subItems: [
      { id: 'akt_1', nama: 'Pendahuluan yang Menyapa Hati (Warm Emotional Check-in)', deskripsi: 'Guru memulai dengan salam hangat, doa tulus, menanyakan kabar santri, dan membangun kesiapan psikologis siswa.' },
      { id: 'akt_2', nama: 'Kegiatan Inti Dialogis & Penalaran Kritis', deskripsi: 'Proses KBM mengedepankan diskusi terbuka, penyelidikan (inquiry), dan studi kolaboratif yang menggugah nalar.' },
      { id: 'akt_3', nama: 'Menciptakan Ruang Aman Secara Emosional', deskripsi: 'Siswa bebas mengekspresikan pendapat dan bertanya tanpa takut dihakimi, ditertawakan, atau dimarahi.' },
      { id: 'akt_4', nama: 'Asesmen Formatif yang Memberdayakan', deskripsi: 'Umpan balik disampaikan secara konstruktif dan penuh kasih untuk membimbing pertumbuhan belajar, bukan menghukum.' },
      { id: 'akt_5', nama: 'Refleksi Mendalam di Akhir Pembelajaran', deskripsi: 'Siswa diajak mengendapkan hikmah: apa yang dipelajari, bagaimana perasaannya, dan apa aksi nyata setelah kelas.' }
    ]
  }
];

// Checklists for Tendik (8 items per role)
export const TENDIK_CHECKLIST_MAPPING: Record<string, { title: string; items: string[] }> = {
  'Kepegawaian': {
    title: 'Supervisi Tenaga Administrasi Kepegawaian',
    items: [
      'Kelengkapan Buku Induk Pegawai dan biodata guru/tendik terbarui.',
      'Kerapian dan keteraturan dokumen fisik berkas kepegawaian (SK, ijazah, sertifikat).',
      'Ketertiban rekapitulasi daftar hadir harian dan presensi elektronik guru/tendik.',
      'Kejelasan pembagian tugas kerja dan uraian jabatan (Job Description).',
      'Ketepatan waktu penerbitan dan distribusi SK Pembagian Beban Mengajar/Tugas.',
      'Tertib administrasi perizinan, cuti pegawai, dan surat keterangan tugas.',
      'Sikap pelayanan yang ramah, santun, transparan, dan solutif kepada seluruh guru.',
      'Sistem pengarsipan digital kepegawaian terkelola aman dan mudah diakses.'
    ]
  },
  'Sarana Prasarana': {
    title: 'Supervisi Pengelola Sarana & Prasarana',
    items: [
      'Buku Inventaris Barang dan aset madrasah terdata secara akurat dan mutakhir.',
      'Pemberian kode barang dan penempelan Kartu Inventaris Ruangan (KIR) di setiap kelas.',
      'Kebersihan, kenyamanan, dan keasrian ruang kelas/laboratorium untuk pembelajaran mendalam.',
      'Optimalisasi pemanfaatan fasilitas pembelajaran (proyektor, sound, alat peraga).',
      'Jadwal dan realisasi pemeliharaan berkala sarpras madrasah berjalan konsisten.',
      'Kesiapan standar keamanan lingkungan madrasah, instalasi listrik, dan jalur evakuasi.',
      'Ketersediaan fasilitas inklusif dan ramah santri (tempat wudhu nyaman, sanitasi bersih).',
      'Penyusunan laporan pertanggungjawaban aset dan mutasi barang secara berkala.'
    ]
  },
  'Persuratan': {
    title: 'Supervisi Pengadministrasi Persuratan & Kearsipan',
    items: [
      'Pencatatan Buku Agenda Surat Masuk berlangsung rapi, tertib, dan sistematis.',
      'Pencatatan Buku Agenda Surat Keluar tertata dengan penomoran resmi yang konsisten.',
      'Ketepatan format surat dinas sesuai Tata Naskah Dinas Kementerian Agama.',
      'Proses lembar disposisi Kepala Madrasah berjalan cepat dan terdokumentasi.',
      'Distribusi surat masuk kepada pihak terkait tepat waktu tanpa penundaan.',
      'Pengarsipan surat fisik dalam ordner tematik dan backup file digital di cloud drive.',
      'Menjaga kerahasiaan dan keamanan dokumen rahasia madrasah.',
      'Pelayanan informasi persuratan yang ramah, komunikatif, dan responsif.'
    ]
  },
  'Kesiswaan': {
    title: 'Supervisi Staf Layanan Administrasi Kesiswaan',
    items: [
      'Buku Induk Peserta Didik dan Buku Klapper terisi lengkap dan selalu valid.',
      'Daftar mutasi santri masuk/keluar terdata rapi beserta kelengkapan berkas kepindahan.',
      'Sikap empati dan perhatian tulus dalam menangani santri yang menghadapi kendala administratif.',
      'Rekapitulasi presensi kehadiran santri dan pelaporan berkala ke wali kelas & orang tua.',
      'Proses Penerimaan Peserta Didik Baru (PPDB) yang humanis, ramah, dan tertib antrean.',
      'Pendataan alumni dan rekam jejak lulusan madrasah terpelihara dengan baik.',
      'Dukungan administratif yang cepat terhadap kegiatan organisasi santri (IPNU/IPPNU/OSIM).',
      'Penyimpanan arsip ijazah, rapor, dan piagam prestasi santri aman terlindungi.'
    ]
  }
};

export const defaultJadwalSupervisi: JadwalSupervisi[] = [
  {
    id: 'JDW-001',
    tipe: 'guru',
    personil_id: 'GUR-01',
    nama: 'Ustadz Ahmad Farhan, S.Pd.I.',
    nip: '19840315 200912 1 002',
    tugas: 'Al-Qur\'an Hadits',
    tanggal: '2026-10-08',
    hari: 'Kamis',
    jam_mulai: '07:30',
    jam_selesai: '09:00',
    kelas_ruang: 'Kelas XI MA Unggulan A',
    fokus_supervisi: 'Pemeriksaan Modul Ajar, Tadabbur Ayat Bermakna, & Ruang Aman Emosional KBC',
    supervisor_nama: 'Muzakki, S.Pd.',
    supervisor_nip: '19780612 200501 1 003',
    status: 'Selesai',
    keterangan: 'Telah terlaksana dengan predikat Sangat Baik (100).'
  },
  {
    id: 'JDW-002',
    tipe: 'tendik',
    personil_id: 'TND-02',
    nama: 'Bambang Sugiyanto, S.AP.',
    nip: '19850918 201001 1 009',
    tugas: 'Sarana Prasarana',
    tanggal: '2026-10-09',
    hari: 'Jumat',
    jam_mulai: '08:30',
    jam_selesai: '10:00',
    kelas_ruang: 'Ruang Inventaris & Sarpras',
    fokus_supervisi: 'Pemeriksaan Buku Inventaris, Kebersihan Kelas untuk KBM Nyaman, dan KIR',
    supervisor_nama: 'Muzakki, S.Pd.',
    supervisor_nip: '19780612 200501 1 003',
    status: 'Selesai',
    keterangan: 'Telah disupervisi dengan predikat Baik (87.5).'
  },
  {
    id: 'JDW-003',
    tipe: 'guru',
    personil_id: 'GUR-03',
    nama: 'M. Wildan Al-Ghozali, S.Pd.',
    nip: '19920810 201903 1 008',
    tugas: 'Matematika Peminatan',
    tanggal: '2026-10-11',
    hari: 'Minggu',
    jam_mulai: '09:15',
    jam_selesai: '10:45',
    kelas_ruang: 'Kelas XII MIA 1',
    fokus_supervisi: 'Observasi Pembelajaran Konsep Bermakna & Studi Kasus Nyata Kehidupan',
    supervisor_nama: 'Muzakki, S.Pd.',
    supervisor_nip: '19780612 200501 1 003',
    status: 'Selesai',
    keterangan: 'Telah dinilai dengan predikat Baik (75).'
  },
  {
    id: 'JDW-004',
    tipe: 'tendik',
    personil_id: 'TND-04',
    nama: 'Syahrul Ramadhan, S.Kom.',
    nip: '19950117 202102 1 004',
    tugas: 'Kesiswaan',
    tanggal: '2026-10-13',
    hari: 'Selasa',
    jam_mulai: '08:00',
    jam_selesai: '09:30',
    kelas_ruang: 'Ruang Pelayanan Kesiswaan & OSIM',
    fokus_supervisi: 'Pelayanan Ramah Siswa, Database Induk Klapper, dan Administrasi Beasiswa/Mutasi',
    supervisor_nama: 'Muzakki, S.Pd.',
    supervisor_nip: '19780612 200501 1 003',
    status: 'Selesai',
    keterangan: 'Telah dinilai dengan predikat Sangat Baik (96.88).'
  },
  {
    id: 'JDW-005',
    tipe: 'guru',
    personil_id: 'GUR-02',
    nama: 'Siti Nurul Hidayah, S.Pd., M.Pd.',
    nip: '19890520 201402 2 005',
    tugas: 'Bahasa Indonesia',
    tanggal: '2026-10-18',
    hari: 'Minggu',
    jam_mulai: '07:30',
    jam_selesai: '09:00',
    kelas_ruang: 'Kelas X MA Reguler 1',
    fokus_supervisi: 'Pembelajaran Menulis Cerpen Berbasis Empati & Dialog Kritis Siswa',
    supervisor_nama: 'Muzakki, S.Pd.',
    supervisor_nip: '19780612 200501 1 003',
    status: 'Terjadwal',
    keterangan: 'Guru telah menyiapkan modul ajar dan instrumen KBC.'
  },
  {
    id: 'JDW-006',
    tipe: 'guru',
    personil_id: 'GUR-04',
    nama: 'Dewi Masruroh, M.Pd.',
    nip: '19871114 201101 2 004',
    tugas: 'Biologi',
    tanggal: '2026-10-20',
    hari: 'Selasa',
    jam_mulai: '09:45',
    jam_selesai: '11:15',
    kelas_ruang: 'Laboratorium Biologi & Sains',
    fokus_supervisi: 'Praktikum Keanekaragaman Hayati Krucil, Kesadaran Lingkungan, & Asesmen Autentik',
    supervisor_nama: 'Muzakki, S.Pd.',
    supervisor_nip: '19780612 200501 1 003',
    status: 'Terjadwal',
    keterangan: 'Eksplorasi ekosistem lokal lereng Argopuro Krucil Probolinggo.'
  },
  {
    id: 'JDW-007',
    tipe: 'tendik',
    personil_id: 'TND-01',
    nama: 'H. Abdul Rasyid, S.Sos.',
    nip: '19800412 200701 1 005',
    tugas: 'Kepegawaian',
    tanggal: '2026-10-22',
    hari: 'Kamis',
    jam_mulai: '08:00',
    jam_selesai: '09:30',
    kelas_ruang: 'Ruang Tata Usaha Kepegawaian',
    fokus_supervisi: 'Kelengkapan Dokumen Fisik/Digital Guru, Rekap Presensi, & Layanan Ramah Pegawai',
    supervisor_nama: 'Muzakki, S.Pd.',
    supervisor_nip: '19780612 200501 1 003',
    status: 'Terjadwal',
    keterangan: 'Pemeriksaan berkas berkala kepegawaian.'
  },
  {
    id: 'JDW-008',
    tipe: 'guru',
    personil_id: 'GUR-05',
    nama: 'K.H. Lukman Hakim, Lc., M.Hum.',
    nip: '19790104 200604 1 007',
    tugas: 'Bahasa Arab',
    tanggal: '2026-10-25',
    hari: 'Minggu',
    jam_mulai: '07:30',
    jam_selesai: '09:00',
    kelas_ruang: 'Kelas XII Keagamaan',
    fokus_supervisi: 'Metode Muhadatsah Interaktif, Maharah Kalam, & Ruang Berbicara Tanpa Takut Salah',
    supervisor_nama: 'Muzakki, S.Pd.',
    supervisor_nip: '19780612 200501 1 003',
    status: 'Terjadwal',
    keterangan: 'Membangun koneksi batin santri dengan bahasa Al-Qur\'an.'
  },
  {
    id: 'JDW-009',
    tipe: 'tendik',
    personil_id: 'TND-03',
    nama: 'Lailatul Fitriyah, A.Md.',
    nip: '19930625 201903 2 015',
    tugas: 'Persuratan',
    tanggal: '2026-10-27',
    hari: 'Selasa',
    jam_mulai: '10:00',
    jam_selesai: '11:30',
    kelas_ruang: 'Meja Pengadministrasi Persuratan & Arsip',
    fokus_supervisi: 'Buku Agenda Masuk/Keluar, Format Tata Naskah Kemenag, & Kecepatan Disposisi',
    supervisor_nama: 'Muzakki, S.Pd.',
    supervisor_nip: '19780612 200501 1 003',
    status: 'Terjadwal',
    keterangan: 'Pemeriksaan buku ekspedisi surat dinas masuk.'
  },
  {
    id: 'JDW-010',
    tipe: 'guru',
    personil_id: 'GUR-06',
    nama: 'Anisa Rahmawati, S.Pd.',
    nip: '19940722 202012 2 012',
    tugas: 'Bahasa Inggris',
    tanggal: '2026-11-01',
    hari: 'Minggu',
    jam_mulai: '08:30',
    jam_selesai: '10:00',
    kelas_ruang: 'Kelas X MA Unggulan 2',
    fokus_supervisi: 'Pemanfaatan Media Pembelajaran Digital Menyenangkan & Asesmen Diagnostik',
    supervisor_nama: 'Muzakki, S.Pd.',
    supervisor_nip: '19780612 200501 1 003',
    status: 'Terjadwal',
    keterangan: 'Materi Descriptive Text seputar pesona Desa Sumberduren Krucil.'
  }
];
