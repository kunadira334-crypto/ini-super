export type ScoreCategory = 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Pembinaan';

export type FollowUpStatus = 'Pending' | 'In Progress' | 'Completed';

export interface MasterGuru {
  id: string;
  nama: string;
  mapel: string;
  nip?: string;
  pendidikan?: string;
  kontak?: string;
}

export interface MasterTendik {
  id: string;
  nama: string;
  bidang_tugas: 'Kepegawaian' | 'Sarana Prasarana' | 'Persuratan' | 'Kesiswaan' | string;
  nip?: string;
  kontak?: string;
}

export interface JadwalSupervisi {
  id: string;
  tipe: 'guru' | 'tendik';
  personil_id: string;
  nama: string;
  nip?: string;
  tugas: string; // Mata pelajaran (guru) atau Bidang tugas (tendik)
  tanggal: string; // YYYY-MM-DD
  hari?: string; // Senin, Selasa, Rabu, dsb.
  jam_mulai: string; // HH:mm
  jam_selesai: string; // HH:mm
  kelas_ruang: string; // e.g., 'Kelas XI MA Unggulan 1', 'Ruang Tata Usaha'
  fokus_supervisi: string;
  supervisor_nama: string;
  supervisor_nip?: string;
  status: 'Terjadwal' | 'Selesai' | 'Ditunda';
  keterangan?: string;
  created_at?: string;
}

export interface SubCriterionGuru {
  id: string;
  nama: string;
  deskripsi: string;
  skor: number; // 1 - 4
  catatan?: string;
}

export interface CriterionGroupGuru {
  id: 'tujuan' | 'indikator' | 'materi' | 'aktivitas';
  nama: string;
  deskripsiKBC: string;
  subKriteria: SubCriterionGuru[];
}

export interface SupervisiGuru {
  id: string;
  id_guru: string;
  nama_guru?: string;
  mapel?: string;
  tanggal: string; // YYYY-MM-DD
  kelas?: string;
  skor_tujuan: number; // 1 - 4
  skor_indikator: number; // 1 - 4
  skor_materi: number; // 1 - 4
  skor_aktivitas: number; // 1 - 4
  catatan_total: string;
  rencana_tindak_lanjut: string;
  total_skor: number; // average or scaled 0-100
  kategori: ScoreCategory;
  supervisor_nama: string;
  supervisor_nip?: string;
  detail_sub?: Record<string, number>;
  tindak_lanjut_id?: string;
  created_at: string;
}

export interface ChecklistItemTendik {
  no: number;
  aspek: string;
  skor: number; // 1 - 4
  catatan?: string;
}

export interface SupervisiTendik {
  id: string;
  id_tendik: string;
  nama_tendik?: string;
  tanggal: string;
  bidang_tugas: string;
  skor_1_sd_8: number[]; // 8 items
  catatan_total: string;
  rencana_tindak_lanjut: string;
  total_skor: number;
  kategori: ScoreCategory;
  supervisor_nama: string;
  tindak_lanjut_id?: string;
  created_at: string;
}

export interface TindakLanjut {
  id: string;
  aspek: string; // Pembelajaran / Administrasi / Sarpras / Kepegawaian / Kesiswaan
  personil_nama?: string;
  personil_id?: string;
  temuan: string; // From Catatan
  rencana: string; // Rencana Tindak Lanjut
  waktu: string; // e.g. "Minggu ke-3 November 2026"
  status: FollowUpStatus;
  catatan_penyelesaian?: string;
  updated_at?: string;
}

export interface MadrasahProfile {
  nama: string;
  nsm: string;
  npsn: string;
  kepalaMadrasah: string;
  nipKepala: string;
  tahun: string;
  semester: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  telepon: string;
  email: string;
  filosofi: string;
}

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  webAppUrl: string;
  apiKey?: string;
  autoSync: boolean;
  connected: boolean;
  lastSync?: string;
}
