import { 
  MasterGuru, 
  MasterTendik, 
  SupervisiGuru, 
  SupervisiTendik, 
  TindakLanjut,
  MadrasahProfile,
  GoogleSheetsConfig,
  JadwalSupervisi
} from '../types';
import { 
  defaultMadrasahProfile, 
  defaultMasterGuru, 
  defaultMasterTendik, 
  defaultSupervisiGuru, 
  defaultSupervisiTendik, 
  defaultTindakLanjut,
  defaultJadwalSupervisi
} from '../data/mockData';

const STORAGE_KEYS = {
  PROFILE: 'kbc_madrasah_profile_v2',
  MASTER_GURU: 'kbc_master_guru_v2',
  MASTER_TENDIK: 'kbc_master_tendik_v2',
  SUPERVISI_GURU: 'kbc_supervisi_guru_v2',
  SUPERVISI_TENDIK: 'kbc_supervisi_tendik_v2',
  TINDAK_LANJUT: 'kbc_tindak_lanjut_v2',
  JADWAL: 'kbc_jadwal_supervisi_v2',
  SHEETS_CONFIG: 'kbc_sheets_config_v2'
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// ==========================================
// CONFIGURATION FOR GOOGLE SHEETS / APPS SCRIPT
// ==========================================
export const getSheetsConfig = (): GoogleSheetsConfig => {
  const saved = localStorage.getItem(STORAGE_KEYS.SHEETS_CONFIG);
  if (saved) {
    try { return JSON.parse(saved); } catch (e) { /* ignore */ }
  }
  return {
    spreadsheetId: '',
    webAppUrl: '',
    autoSync: false,
    connected: false,
    lastSync: undefined
  };
};

export const saveSheetsConfig = (cfg: GoogleSheetsConfig): void => {
  localStorage.setItem(STORAGE_KEYS.SHEETS_CONFIG, JSON.stringify(cfg));
};

// ==========================================
// PROFILE MANAGEMENT
// ==========================================
export const fetchMadrasahProfile = async (): Promise<MadrasahProfile> => {
  await delay(100);
  const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      // Ensure address is updated to exact: Desa Sumberduren, Kecamatan Krucil, Kabupaten Probolinggo
      const targetAlamat = 'Desa Sumberduren, Kecamatan Krucil, Kabupaten Probolinggo';
      if (parsed.alamat !== targetAlamat) {
        const updated = {
          ...parsed,
          alamat: targetAlamat,
          kelurahan: 'Desa Sumberduren',
          kecamatan: 'Krucil',
          kabupaten: 'Kabupaten Probolinggo',
          provinsi: 'Jawa Timur'
        };
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
        return updated;
      }
      return parsed;
    } catch (e) { /* ignore */ }
  }
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(defaultMadrasahProfile));
  return defaultMadrasahProfile;
};

export const updateMadrasahProfile = async (profile: MadrasahProfile): Promise<MadrasahProfile> => {
  await delay(150);
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  return profile;
};

// ==========================================
// 1. MASTER_GURU (Columns: id, nama, mapel)
// ==========================================
export const fetchMasterGuru = async (): Promise<MasterGuru[]> => {
  await delay(150);
  const data = localStorage.getItem(STORAGE_KEYS.MASTER_GURU);
  if (data) {
    try { return JSON.parse(data); } catch (e) { /* ignore */ }
  }
  localStorage.setItem(STORAGE_KEYS.MASTER_GURU, JSON.stringify(defaultMasterGuru));
  return defaultMasterGuru;
};

export const saveMasterGuru = async (guru: MasterGuru): Promise<MasterGuru> => {
  await delay(150);
  const list = await fetchMasterGuru();
  const index = list.findIndex(g => g.id === guru.id);
  let updated: MasterGuru[];
  if (index >= 0) {
    updated = list.map(g => g.id === guru.id ? guru : g);
  } else {
    updated = [guru, ...list];
  }
  localStorage.setItem(STORAGE_KEYS.MASTER_GURU, JSON.stringify(updated));
  return guru;
};

export const deleteMasterGuru = async (id: string): Promise<boolean> => {
  await delay(150);
  const list = await fetchMasterGuru();
  const updated = list.filter(g => g.id !== id);
  localStorage.setItem(STORAGE_KEYS.MASTER_GURU, JSON.stringify(updated));
  return true;
};

// ==========================================
// 2. MASTER_TENDIK (Columns: id, nama, bidang_tugas)
// ==========================================
export const fetchMasterTendik = async (): Promise<MasterTendik[]> => {
  await delay(150);
  const data = localStorage.getItem(STORAGE_KEYS.MASTER_TENDIK);
  if (data) {
    try { return JSON.parse(data); } catch (e) { /* ignore */ }
  }
  localStorage.setItem(STORAGE_KEYS.MASTER_TENDIK, JSON.stringify(defaultMasterTendik));
  return defaultMasterTendik;
};

export const saveMasterTendik = async (tendik: MasterTendik): Promise<MasterTendik> => {
  await delay(150);
  const list = await fetchMasterTendik();
  const index = list.findIndex(t => t.id === tendik.id);
  let updated: MasterTendik[];
  if (index >= 0) {
    updated = list.map(t => t.id === tendik.id ? tendik : t);
  } else {
    updated = [tendik, ...list];
  }
  localStorage.setItem(STORAGE_KEYS.MASTER_TENDIK, JSON.stringify(updated));
  return tendik;
};

export const deleteMasterTendik = async (id: string): Promise<boolean> => {
  await delay(150);
  const list = await fetchMasterTendik();
  const updated = list.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.MASTER_TENDIK, JSON.stringify(updated));
  return true;
};

// ==========================================
// 3. SUPERVISI_GURU
// Columns: id, id_guru, tanggal, skor_tujuan, skor_indikator, skor_materi, skor_aktivitas, catatan_total, total_skor, kategori
// ==========================================
export const fetchSupervisiGuru = async (): Promise<SupervisiGuru[]> => {
  await delay(200);
  const data = localStorage.getItem(STORAGE_KEYS.SUPERVISI_GURU);
  if (data) {
    try { return JSON.parse(data); } catch (e) { /* ignore */ }
  }
  localStorage.setItem(STORAGE_KEYS.SUPERVISI_GURU, JSON.stringify(defaultSupervisiGuru));
  return defaultSupervisiGuru;
};

export const saveSupervisiGuru = async (
  item: SupervisiGuru,
  autoCreateFollowUp: boolean = true
): Promise<{ supervisi: SupervisiGuru; tindakLanjut?: TindakLanjut }> => {
  await delay(250);
  const list = await fetchSupervisiGuru();
  const guruList = await fetchMasterGuru();
  const matchedGuru = guruList.find(g => g.id === item.id_guru);

  const finalItem: SupervisiGuru = {
    ...item,
    nama_guru: item.nama_guru || matchedGuru?.nama || 'Guru Madrasah',
    mapel: item.mapel || matchedGuru?.mapel || '-'
  };

  let createdTL: TindakLanjut | undefined;

  // SMART AUTOMATION: Automatically create a new row in Tindak_Lanjut sheet!
  if (autoCreateFollowUp && finalItem.rencana_tindak_lanjut) {
    const tlId = finalItem.tindak_lanjut_id || `TL-GUR-${Date.now()}`;
    createdTL = {
      id: tlId,
      aspek: `Pembelajaran Guru (${finalItem.mapel || 'KBC'})`,
      personil_nama: finalItem.nama_guru,
      personil_id: finalItem.id_guru,
      temuan: finalItem.catatan_total,
      rencana: finalItem.rencana_tindak_lanjut,
      waktu: 'Bulan Depan (Tindak Lanjut Supervisi)',
      status: finalItem.kategori === 'Sangat Baik' ? 'Completed' : 'Pending',
      updated_at: new Date().toISOString()
    };
    finalItem.tindak_lanjut_id = tlId;
    await saveTindakLanjut(createdTL);
  }

  const index = list.findIndex(s => s.id === finalItem.id);
  let updatedList: SupervisiGuru[];
  if (index >= 0) {
    updatedList = list.map(s => s.id === finalItem.id ? finalItem : s);
  } else {
    updatedList = [finalItem, ...list];
  }
  localStorage.setItem(STORAGE_KEYS.SUPERVISI_GURU, JSON.stringify(updatedList));

  // Sync to remote Google Sheet if connected
  const cfg = getSheetsConfig();
  if (cfg.connected && cfg.webAppUrl) {
    syncToRemoteGoogleSheets();
  }

  return { supervisi: finalItem, tindakLanjut: createdTL };
};

export const deleteSupervisiGuru = async (id: string): Promise<boolean> => {
  await delay(150);
  const list = await fetchSupervisiGuru();
  const updated = list.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.SUPERVISI_GURU, JSON.stringify(updated));
  return true;
};

// ==========================================
// 4. SUPERVISI_TENDIK
// Columns: id, id_tendik, tanggal, bidang_tugas, skor_1_sd_8, catatan_total, total_skor, kategori
// ==========================================
export const fetchSupervisiTendik = async (): Promise<SupervisiTendik[]> => {
  await delay(200);
  const data = localStorage.getItem(STORAGE_KEYS.SUPERVISI_TENDIK);
  if (data) {
    try { return JSON.parse(data); } catch (e) { /* ignore */ }
  }
  localStorage.setItem(STORAGE_KEYS.SUPERVISI_TENDIK, JSON.stringify(defaultSupervisiTendik));
  return defaultSupervisiTendik;
};

export const saveSupervisiTendik = async (
  item: SupervisiTendik,
  autoCreateFollowUp: boolean = true
): Promise<{ supervisi: SupervisiTendik; tindakLanjut?: TindakLanjut }> => {
  await delay(250);
  const list = await fetchSupervisiTendik();
  const tendikList = await fetchMasterTendik();
  const matched = tendikList.find(t => t.id === item.id_tendik);

  const finalItem: SupervisiTendik = {
    ...item,
    nama_tendik: item.nama_tendik || matched?.nama || 'Tenaga Kependidikan',
    bidang_tugas: item.bidang_tugas || matched?.bidang_tugas || 'Administrasi'
  };

  let createdTL: TindakLanjut | undefined;

  // SMART AUTOMATION: Automatically create new row in Tindak_Lanjut
  if (autoCreateFollowUp && finalItem.rencana_tindak_lanjut) {
    const tlId = finalItem.tindak_lanjut_id || `TL-TND-${Date.now()}`;
    createdTL = {
      id: tlId,
      aspek: `Pelayanan & Administrasi (${finalItem.bidang_tugas})`,
      personil_nama: finalItem.nama_tendik,
      personil_id: finalItem.id_tendik,
      temuan: finalItem.catatan_total,
      rencana: finalItem.rencana_tindak_lanjut,
      waktu: 'Akhir Bulan Ini',
      status: finalItem.kategori === 'Sangat Baik' ? 'Completed' : 'Pending',
      updated_at: new Date().toISOString()
    };
    finalItem.tindak_lanjut_id = tlId;
    await saveTindakLanjut(createdTL);
  }

  const index = list.findIndex(s => s.id === finalItem.id);
  let updatedList: SupervisiTendik[];
  if (index >= 0) {
    updatedList = list.map(s => s.id === finalItem.id ? finalItem : s);
  } else {
    updatedList = [finalItem, ...list];
  }
  localStorage.setItem(STORAGE_KEYS.SUPERVISI_TENDIK, JSON.stringify(updatedList));

  return { supervisi: finalItem, tindakLanjut: createdTL };
};

export const deleteSupervisiTendik = async (id: string): Promise<boolean> => {
  await delay(150);
  const list = await fetchSupervisiTendik();
  const updated = list.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.SUPERVISI_TENDIK, JSON.stringify(updated));
  return true;
};

// ==========================================
// 5. TINDAK_LANJUT
// Columns: id, aspek, temuan, rencana, waktu, status
// ==========================================
export const fetchTindakLanjut = async (): Promise<TindakLanjut[]> => {
  await delay(150);
  const data = localStorage.getItem(STORAGE_KEYS.TINDAK_LANJUT);
  if (data) {
    try { return JSON.parse(data); } catch (e) { /* ignore */ }
  }
  localStorage.setItem(STORAGE_KEYS.TINDAK_LANJUT, JSON.stringify(defaultTindakLanjut));
  return defaultTindakLanjut;
};

export const saveTindakLanjut = async (item: TindakLanjut): Promise<TindakLanjut> => {
  await delay(150);
  const list = await fetchTindakLanjut();
  const index = list.findIndex(t => t.id === item.id);
  let updated: TindakLanjut[];
  const finalItem: TindakLanjut = {
    ...item,
    updated_at: new Date().toISOString()
  };
  if (index >= 0) {
    updated = list.map(t => t.id === finalItem.id ? finalItem : t);
  } else {
    updated = [finalItem, ...list];
  }
  localStorage.setItem(STORAGE_KEYS.TINDAK_LANJUT, JSON.stringify(updated));
  return finalItem;
};

export const updateTindakLanjutStatus = async (
  id: string, 
  status: TindakLanjut['status'], 
  catatan?: string
): Promise<TindakLanjut | null> => {
  await delay(150);
  const list = await fetchTindakLanjut();
  const target = list.find(t => t.id === id);
  if (!target) return null;

  const updatedItem: TindakLanjut = {
    ...target,
    status,
    catatan_penyelesaian: catatan !== undefined ? catatan : target.catatan_penyelesaian,
    updated_at: new Date().toISOString()
  };
  const updatedList = list.map(t => t.id === id ? updatedItem : t);
  localStorage.setItem(STORAGE_KEYS.TINDAK_LANJUT, JSON.stringify(updatedList));
  return updatedItem;
};

export const deleteTindakLanjut = async (id: string): Promise<boolean> => {
  await delay(150);
  const list = await fetchTindakLanjut();
  const updated = list.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TINDAK_LANJUT, JSON.stringify(updated));
  return true;
};

// ==========================================
// 6. JADWAL_SUPERVISI (Jadwal Guru & Tendik)
// ==========================================
export const fetchJadwalSupervisi = async (): Promise<JadwalSupervisi[]> => {
  await delay(150);
  const data = localStorage.getItem(STORAGE_KEYS.JADWAL);
  if (data) {
    try { return JSON.parse(data); } catch (e) { /* ignore */ }
  }
  localStorage.setItem(STORAGE_KEYS.JADWAL, JSON.stringify(defaultJadwalSupervisi));
  return defaultJadwalSupervisi;
};

export const saveJadwalSupervisi = async (item: JadwalSupervisi): Promise<JadwalSupervisi> => {
  await delay(150);
  const list = await fetchJadwalSupervisi();
  const index = list.findIndex(j => j.id === item.id);
  let updated: JadwalSupervisi[];
  if (index >= 0) {
    updated = list.map(j => j.id === item.id ? item : j);
  } else {
    updated = [item, ...list];
  }
  localStorage.setItem(STORAGE_KEYS.JADWAL, JSON.stringify(updated));
  return item;
};

export const deleteJadwalSupervisi = async (id: string): Promise<boolean> => {
  await delay(150);
  const list = await fetchJadwalSupervisi();
  const updated = list.filter(j => j.id !== id);
  localStorage.setItem(STORAGE_KEYS.JADWAL, JSON.stringify(updated));
  return true;
};

// ==========================================
// REAL GOOGLE SHEETS / APPS SCRIPT SYNC ENGINE
// ==========================================
export const syncToRemoteGoogleSheets = async (): Promise<{ success: boolean; message: string }> => {
  const cfg = getSheetsConfig();
  if (!cfg.webAppUrl) {
    return { success: false, message: 'URL Google Apps Script Web App belum diisi.' };
  }

  const payload = {
    action: 'syncAllKBC',
    Master_Guru: await fetchMasterGuru(),
    Master_Tendik: await fetchMasterTendik(),
    Supervisi_Guru: await fetchSupervisiGuru(),
    Supervisi_Tendik: await fetchSupervisiTendik(),
    Tindak_Lanjut: await fetchTindakLanjut(),
    Jadwal_Supervisi: await fetchJadwalSupervisi(),
    timestamp: new Date().toISOString()
  };

  try {
    const res = await fetch(cfg.webAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.success) {
      cfg.lastSync = new Date().toLocaleTimeString('id-ID');
      cfg.connected = true;
      saveSheetsConfig(cfg);
      return { success: true, message: 'Seluruh 5 sheet berhasil disinkronkan ke Google Spreadsheet!' };
    }
    return { success: false, message: result.error || 'Gagal sinkron ke Google Spreadsheet.' };
  } catch (err: any) {
    return { success: false, message: `Gagal tersambung: ${err.message || 'CORS / Jaringan'}` };
  }
};

export const resetMadrasahDatabase = async (): Promise<void> => {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(defaultMadrasahProfile));
  localStorage.setItem(STORAGE_KEYS.MASTER_GURU, JSON.stringify(defaultMasterGuru));
  localStorage.setItem(STORAGE_KEYS.MASTER_TENDIK, JSON.stringify(defaultMasterTendik));
  localStorage.setItem(STORAGE_KEYS.SUPERVISI_GURU, JSON.stringify(defaultSupervisiGuru));
  localStorage.setItem(STORAGE_KEYS.SUPERVISI_TENDIK, JSON.stringify(defaultSupervisiTendik));
  localStorage.setItem(STORAGE_KEYS.TINDAK_LANJUT, JSON.stringify(defaultTindakLanjut));
  localStorage.setItem(STORAGE_KEYS.JADWAL, JSON.stringify(defaultJadwalSupervisi));
};
