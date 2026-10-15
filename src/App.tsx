/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  MadrasahProfile, 
  MasterGuru, 
  MasterTendik, 
  SupervisiGuru, 
  SupervisiTendik, 
  TindakLanjut,
  GoogleSheetsConfig,
  FollowUpStatus,
  JadwalSupervisi
} from './types';
import { 
  fetchMadrasahProfile,
  fetchMasterGuru,
  saveMasterGuru,
  deleteMasterGuru,
  fetchMasterTendik,
  saveMasterTendik,
  deleteMasterTendik,
  fetchSupervisiGuru,
  saveSupervisiGuru,
  deleteSupervisiGuru,
  fetchSupervisiTendik,
  saveSupervisiTendik,
  deleteSupervisiTendik,
  fetchTindakLanjut,
  saveTindakLanjut,
  updateTindakLanjutStatus,
  deleteTindakLanjut,
  fetchJadwalSupervisi,
  saveJadwalSupervisi,
  deleteJadwalSupervisi,
  getSheetsConfig,
  saveSheetsConfig
} from './services/googleSheetsService';
import { Sidebar, ActivePage } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { JadwalSupervisiView } from './components/JadwalSupervisiView';
import { SupervisiGuruView } from './components/SupervisiGuruView';
import { SupervisiTendikView } from './components/SupervisiTendikView';
import { TindakLanjutView } from './components/TindakLanjutView';
import { RekapLaporanView } from './components/RekapLaporanView';
import { MasterDataView } from './components/MasterDataView';
import { SheetsIntegrationModal } from './components/SheetsIntegrationModal';
import { PrintReportModal } from './components/PrintReportModal';
import { PrintJadwalModal } from './components/PrintJadwalModal';
import { 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  HeartHandshake, 
  BookOpen, 
  RefreshCw, 
  MapPin,
  Printer
} from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');

  // Application Data States
  const [profile, setProfile] = useState<MadrasahProfile | null>(null);
  const [guruList, setGuruList] = useState<MasterGuru[]>([]);
  const [tendikList, setTendikList] = useState<MasterTendik[]>([]);
  const [supervisiGuruList, setSupervisiGuruList] = useState<SupervisiGuru[]>([]);
  const [supervisiTendikList, setSupervisiTendikList] = useState<SupervisiTendik[]>([]);
  const [tindakLanjutList, setTindakLanjutList] = useState<TindakLanjut[]>([]);
  const [jadwalList, setJadwalList] = useState<JadwalSupervisi[]>([]);
  const [sheetsConfig, setSheetsConfig] = useState<GoogleSheetsConfig>(getSheetsConfig);

  // Modals
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPrintJadwalModalOpen, setIsPrintJadwalModalOpen] = useState(false);
  const [selectedReportItem, setSelectedReportItem] = useState<{ item: SupervisiGuru | SupervisiTendik; type: 'guru' | 'tendik' } | null>(null);

  // Toast
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Initial Data Load
  const loadAllData = async () => {
    const [p, g, t, sg, st, tl, jd] = await Promise.all([
      fetchMadrasahProfile(),
      fetchMasterGuru(),
      fetchMasterTendik(),
      fetchSupervisiGuru(),
      fetchSupervisiTendik(),
      fetchTindakLanjut(),
      fetchJadwalSupervisi()
    ]);
    setProfile(p);
    setGuruList(g);
    setTendikList(t);
    setSupervisiGuruList(sg);
    setSupervisiTendikList(st);
    setTindakLanjutList(tl);
    setJadwalList(jd);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // CRUD Handlers for Jadwal Supervisi
  const handleSaveJadwal = async (item: JadwalSupervisi) => {
    const saved = await saveJadwalSupervisi(item);
    setJadwalList(prev => [saved, ...prev.filter(j => j.id !== saved.id)]);
    showToast(`Jadwal supervisi untuk ${item.nama} berhasil disimpan.`);
  };

  const handleDeleteJadwal = async (id: string) => {
    await deleteJadwalSupervisi(id);
    setJadwalList(prev => prev.filter(j => j.id !== id));
    showToast('Jadwal supervisi berhasil dihapus.', 'info');
  };

  const handleStartSupervisiFromJadwal = (item: JadwalSupervisi) => {
    if (item.tipe === 'guru') {
      setActivePage('supervisi_guru');
      showToast(`Membuka form supervisi guru: ${item.nama}`);
    } else {
      setActivePage('supervisi_tendik');
      showToast(`Membuka form supervisi tendik: ${item.nama}`);
    }
  };

  // CRUD Handlers for Guru Supervisi
  const handleSaveSupervisiGuru = async (newSup: SupervisiGuru) => {
    const res = await saveSupervisiGuru(newSup, true);
    setSupervisiGuruList(prev => [res.supervisi, ...prev.filter(s => s.id !== res.supervisi.id)]);
    if (res.tindakLanjut) {
      setTindakLanjutList(prev => [res.tindakLanjut!, ...prev.filter(t => t.id !== res.tindakLanjut!.id)]);
    }

    // Automatically mark matching schedule as 'Selesai'
    setJadwalList(prev => prev.map(j => {
      if (j.personil_id === newSup.id_guru || j.nama === newSup.nama_guru) {
        return { ...j, status: 'Selesai' as const };
      }
      return j;
    }));

    showToast(`Supervisi ${newSup.nama_guru} (${newSup.kategori}) tersimpan & Tindak Lanjut otomatis terbit!`);
  };

  const handleDeleteSupervisiGuru = async (id: string) => {
    if (window.confirm('Hapus arsip hasil supervisi guru ini?')) {
      await deleteSupervisiGuru(id);
      setSupervisiGuruList(prev => prev.filter(s => s.id !== id));
      showToast('Arsip supervisi guru berhasil dihapus.', 'info');
    }
  };

  // CRUD Handlers for Tendik Supervisi
  const handleSaveSupervisiTendik = async (newSup: SupervisiTendik) => {
    const res = await saveSupervisiTendik(newSup, true);
    setSupervisiTendikList(prev => [res.supervisi, ...prev.filter(s => s.id !== res.supervisi.id)]);
    if (res.tindakLanjut) {
      setTindakLanjutList(prev => [res.tindakLanjut!, ...prev.filter(t => t.id !== res.tindakLanjut!.id)]);
    }

    // Automatically mark matching schedule as 'Selesai'
    setJadwalList(prev => prev.map(j => {
      if (j.personil_id === newSup.id_tendik || j.nama === newSup.nama_tendik) {
        return { ...j, status: 'Selesai' as const };
      }
      return j;
    }));

    showToast(`Supervisi tendik ${newSup.nama_tendik} tersimpan & masuk ke Tindak_Lanjut!`);
  };

  const handleDeleteSupervisiTendik = async (id: string) => {
    if (window.confirm('Hapus arsip hasil supervisi tendik ini?')) {
      await deleteSupervisiTendik(id);
      setSupervisiTendikList(prev => prev.filter(s => s.id !== id));
      showToast('Arsip supervisi tendik berhasil dihapus.', 'info');
    }
  };

  // Tindak Lanjut Handlers
  const handleUpdateStatusTL = async (id: string, status: FollowUpStatus, catatan?: string) => {
    const updated = await updateTindakLanjutStatus(id, status, catatan);
    if (updated) {
      setTindakLanjutList(prev => prev.map(t => t.id === id ? updated : t));
      showToast(`Status tindak lanjut diperbarui menjadi: ${status}`);
    }
  };

  const handleDeleteTL = async (id: string) => {
    if (window.confirm('Hapus catatan tindak lanjut ini?')) {
      await deleteTindakLanjut(id);
      setTindakLanjutList(prev => prev.filter(t => t.id !== id));
      showToast('Catatan tindak lanjut berhasil dihapus.', 'info');
    }
  };

  const handleAddTL = async (item: TindakLanjut) => {
    const created = await saveTindakLanjut(item);
    setTindakLanjutList(prev => [created, ...prev]);
    showToast('Catatan tindak lanjut manual berhasil ditambahkan!');
  };

  // Master Data Handlers
  const handleSaveGuru = async (guru: MasterGuru) => {
    const saved = await saveMasterGuru(guru);
    setGuruList(prev => [saved, ...prev.filter(g => g.id !== saved.id)]);
    showToast(`Data guru ${guru.nama} berhasil disimpan.`);
  };

  const handleDeleteGuru = async (id: string) => {
    await deleteMasterGuru(id);
    setGuruList(prev => prev.filter(g => g.id !== id));
    showToast('Data guru berhasil dihapus.', 'info');
  };

  const handleSaveTendik = async (tendik: MasterTendik) => {
    const saved = await saveMasterTendik(tendik);
    setTendikList(prev => [saved, ...prev.filter(t => t.id !== saved.id)]);
    showToast(`Data tendik ${tendik.nama} berhasil disimpan.`);
  };

  const handleDeleteTendik = async (id: string) => {
    await deleteMasterTendik(id);
    setTendikList(prev => prev.filter(t => t.id !== id));
    showToast('Data tendik berhasil dihapus.', 'info');
  };

  // Print Report Handler
  const handleOpenReportModal = (item: SupervisiGuru | SupervisiTendik, type: 'guru' | 'tendik') => {
    setSelectedReportItem({ item, type });
    setIsPrintModalOpen(true);
  };

  const handleSaveSheetsConfig = (cfg: GoogleSheetsConfig) => {
    setSheetsConfig(cfg);
    saveSheetsConfig(cfg);
    showToast('Konfigurasi Google Spreadsheet berhasil disimpan!');
  };

  const pendingCount = tindakLanjutList.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs">
        Memuat Sistem Informasi Supervisi Madrasah...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-bold ${
            toast.type === 'success' ? 'bg-emerald-900 text-white border-emerald-600' :
            toast.type === 'error' ? 'bg-rose-900 text-white border-rose-600' : 'bg-slate-900 text-white border-slate-700'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
            <span>{toast.text}</span>
          </div>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar
        activePage={activePage}
        onSelectPage={(p) => {
          if (p === 'integrasi_sheet') {
            setIsSheetsModalOpen(true);
          } else {
            setActivePage(p);
          }
        }}
        profile={profile}
        sheetsConfig={sheetsConfig}
        pendingFollowUps={pendingCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shadow-2xs z-20">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-xs sm:text-sm font-extrabold text-slate-900">
              {profile.nama}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-medium">
              <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              <span>{profile.alamat}</span>
            </div>
            <span className="text-slate-300 hidden md:inline">•</span>
            <span className="text-xs text-slate-600 hidden md:inline">
              Kepala: <strong>{profile.kepalaMadrasah}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* Quick Print Schedule Button */}
            <button
              onClick={() => setIsPrintJadwalModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition shadow-xs cursor-pointer"
              title="Cetak Jadwal Pelaksanaan Supervisi (A4 / PDF)"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cetak Jadwal</span>
            </button>

            {/* Database Sheet Status */}
            <button
              onClick={() => setIsSheetsModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                sheetsConfig.connected
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">{sheetsConfig.connected ? 'Spreadsheet: Aktif' : 'Spreadsheet: Mode Simulasi'}</span>
            </button>
          </div>
        </header>

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' && (
            <DashboardView
              profile={profile}
              guruList={guruList}
              tendikList={tendikList}
              supervisiGuruList={supervisiGuruList}
              supervisiTendikList={supervisiTendikList}
              tindakLanjutList={tindakLanjutList}
              onNavigate={setActivePage}
              onOpenReportModal={handleOpenReportModal}
            />
          )}

          {activePage === 'jadwal_supervisi' && (
            <JadwalSupervisiView
              jadwalList={jadwalList}
              guruList={guruList}
              tendikList={tendikList}
              profile={profile}
              onSaveJadwal={handleSaveJadwal}
              onDeleteJadwal={handleDeleteJadwal}
              onOpenPrintJadwal={() => setIsPrintJadwalModalOpen(true)}
              onStartSupervisiFromJadwal={handleStartSupervisiFromJadwal}
            />
          )}

          {activePage === 'supervisi_guru' && (
            <SupervisiGuruView
              guruList={guruList}
              supervisiList={supervisiGuruList}
              profile={profile}
              onSaveSupervisi={handleSaveSupervisiGuru}
              onDeleteSupervisi={handleDeleteSupervisiGuru}
              onPrintSupervisi={(item) => handleOpenReportModal(item, 'guru')}
            />
          )}

          {activePage === 'supervisi_tendik' && (
            <SupervisiTendikView
              tendikList={tendikList}
              supervisiList={supervisiTendikList}
              profile={profile}
              onSaveSupervisi={handleSaveSupervisiTendik}
              onDeleteSupervisi={handleDeleteSupervisiTendik}
              onPrintSupervisi={(item) => handleOpenReportModal(item, 'tendik')}
            />
          )}

          {activePage === 'tindak_lanjut' && (
            <TindakLanjutView
              tindakLanjutList={tindakLanjutList}
              onUpdateStatus={handleUpdateStatusTL}
              onDeleteTindakLanjut={handleDeleteTL}
              onAddTindakLanjut={handleAddTL}
            />
          )}

          {activePage === 'rekap_laporan' && (
            <RekapLaporanView
              supervisiGuruList={supervisiGuruList}
              supervisiTendikList={supervisiTendikList}
              onOpenReportModal={handleOpenReportModal}
            />
          )}

          {activePage === 'master_data' && (
            <MasterDataView
              guruList={guruList}
              tendikList={tendikList}
              onSaveGuru={handleSaveGuru}
              onDeleteGuru={handleDeleteGuru}
              onSaveTendik={handleSaveTendik}
              onDeleteTendik={handleDeleteTendik}
            />
          )}
        </main>
      </div>

      {/* Sheets Integration Modal */}
      <SheetsIntegrationModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        config={sheetsConfig}
        onSaveConfig={handleSaveSheetsConfig}
        onRefreshData={loadAllData}
      />

      {/* Print PDF Report Modal */}
      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        item={selectedReportItem?.item || null}
        type={selectedReportItem?.type || 'guru'}
        profile={profile}
      />

      {/* Print Jadwal Supervisi Modal */}
      <PrintJadwalModal
        isOpen={isPrintJadwalModalOpen}
        onClose={() => setIsPrintJadwalModalOpen(false)}
        jadwalList={jadwalList}
        profile={profile}
      />
    </div>
  );
}
