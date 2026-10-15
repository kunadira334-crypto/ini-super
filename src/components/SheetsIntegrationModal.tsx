import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Code2, 
  BookOpen, 
  Database, 
  Copy, 
  Check, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { GoogleSheetsConfig } from '../types';
import { KBC_APPS_SCRIPT_CODE_GS } from '../services/appsScriptTemplate';
import { syncToRemoteGoogleSheets } from '../services/googleSheetsService';

interface SheetsIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GoogleSheetsConfig;
  onSaveConfig: (cfg: GoogleSheetsConfig) => void;
  onRefreshData: () => Promise<void>;
}

export const SheetsIntegrationModal: React.FC<SheetsIntegrationModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'koneksi' | 'kode' | 'struktur' | 'panduan'>('koneksi');
  const [webAppUrl, setWebAppUrl] = useState<string>(config.webAppUrl || '');
  const [spreadsheetId, setSpreadsheetId] = useState<string>(config.spreadsheetId || '');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(KBC_APPS_SCRIPT_CODE_GS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTestAndSync = async () => {
    if (!webAppUrl.trim()) {
      setStatusMsg({ text: 'Harap masukkan URL Web App Apps Script terlebih dahulu.', success: false });
      return;
    }
    setIsSyncing(true);
    setStatusMsg(null);
    try {
      const updatedCfg: GoogleSheetsConfig = {
        ...config,
        webAppUrl: webAppUrl.trim(),
        spreadsheetId: spreadsheetId.trim(),
        connected: true,
        lastSync: new Date().toLocaleTimeString('id-ID')
      };
      onSaveConfig(updatedCfg);

      const res = await syncToRemoteGoogleSheets();
      setStatusMsg({ text: res.message, success: res.success });
      if (res.success) {
        await onRefreshData();
      }
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all my-6 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-950 px-6 py-4 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
              <FileSpreadsheet className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                Integrasi Database Google Spreadsheet (5 Tab Resmi)
              </h2>
              <p className="text-xs text-emerald-200">
                Hubungkan Master_Guru, Master_Tendik, Supervisi_Guru, Supervisi_Tendik, & Tindak_Lanjut
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 gap-2 text-xs font-semibold overflow-x-auto flex-shrink-0">
          <button
            onClick={() => setActiveTab('koneksi')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'koneksi' ? 'border-emerald-600 text-emerald-700 bg-white font-bold' : 'text-slate-600'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Koneksi & Sinkronisasi</span>
          </button>
          <button
            onClick={() => setActiveTab('kode')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'kode' ? 'border-emerald-600 text-emerald-700 bg-white font-bold' : 'text-slate-600'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Kode Apps Script (Code.gs)</span>
          </button>
          <button
            onClick={() => setActiveTab('struktur')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'struktur' ? 'border-emerald-600 text-emerald-700 bg-white font-bold' : 'text-slate-600'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Struktur 5 Tab Sheet</span>
          </button>
          <button
            onClick={() => setActiveTab('panduan')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'panduan' ? 'border-emerald-600 text-emerald-700 bg-white font-bold' : 'text-slate-600'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Panduan Pasang</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'koneksi' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                config.connected ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                {config.connected ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="text-xs">
                  <div className="font-bold text-sm">
                    {config.connected ? 'Status: Terhubung ke Google Spreadsheet' : 'Status: Berjalan Offline / Fallback Lokal'}
                  </div>
                  <p className="mt-0.5 text-slate-600">
                    Aplikasi dilengkapi Promise-based mock data otomatis sehingga Anda dapat menguji seluruh alur supervisi tanpa hambatan. Untuk menyimpan permanen ke Google Spreadsheet Madrasah, masukkan URL Apps Script Web App di bawah.
                  </p>
                  {config.lastSync && (
                    <div className="mt-1 font-mono text-[11px] text-slate-500">
                      Sinkron terakhir: {config.lastSync}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  URL Web App Google Apps Script
                </label>
                <input
                  type="url"
                  value={webAppUrl}
                  onChange={(e) => setWebAppUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Didapat dari menu Deploy &gt; New deployment &gt; Web app (Access: Anyone).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  ID Google Spreadsheet (Opsional)
                </label>
                <input
                  type="text"
                  value={spreadsheetId}
                  onChange={(e) => setSpreadsheetId(e.target.value)}
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {statusMsg && (
                <div className={`p-3 rounded-lg border text-xs font-semibold ${
                  statusMsg.success ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'
                }`}>
                  {statusMsg.text}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleTestAndSync}
                  disabled={isSyncing}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-xs disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Menyinkronkan...' : 'Simpan & Sinkronkan 5 Sheet Sekarang'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'kode' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    File Code.gs (Siap Tempel ke Apps Script)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Mencakup fungsi <code>setupMadrasahSpreadsheetDatabase()</code>, <code>doGet()</code>, dan <code>doPost()</code>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Seluruh Kode'}</span>
                </button>
              </div>

              <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[380px] border border-slate-700">
                <code>{KBC_APPS_SCRIPT_CODE_GS}</code>
              </pre>
            </div>
          )}

          {activeTab === 'struktur' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 text-emerald-950 rounded-xl border border-emerald-200">
                <strong>Struktur Kolom Database Google Spreadsheet Sesuai Permintaan:</strong>
              </div>

              <div className="border border-slate-200 p-3 rounded-xl bg-white">
                <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  1. Master_Guru
                </span>
                <p className="text-slate-600 mt-1 font-mono text-[11px]">
                  Columns: (id, nama, mapel)
                </p>
              </div>

              <div className="border border-slate-200 p-3 rounded-xl bg-white">
                <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                  2. Master_Tendik
                </span>
                <p className="text-slate-600 mt-1 font-mono text-[11px]">
                  Columns: (id, nama, bidang_tugas)
                </p>
              </div>

              <div className="border border-slate-200 p-3 rounded-xl bg-white">
                <span className="font-mono font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
                  3. Supervisi_Guru
                </span>
                <p className="text-slate-600 mt-1 font-mono text-[11px]">
                  Columns: (id, id_guru, tanggal, skor_tujuan, skor_indikator, skor_materi, skor_aktivitas, catatan_total, total_skor, kategori)
                </p>
              </div>

              <div className="border border-slate-200 p-3 rounded-xl bg-white">
                <span className="font-mono font-bold text-teal-900 bg-teal-100 px-2 py-0.5 rounded">
                  4. Supervisi_Tendik
                </span>
                <p className="text-slate-600 mt-1 font-mono text-[11px]">
                  Columns: (id, id_tendik, tanggal, bidang_tugas, skor_1_sd_8, catatan_total, total_skor, kategori)
                </p>
              </div>

              <div className="border border-slate-200 p-3 rounded-xl bg-white">
                <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                  5. Tindak_Lanjut
                </span>
                <p className="text-slate-600 mt-1 font-mono text-[11px]">
                  Columns: (id, aspek, temuan, rencana, waktu, status)
                </p>
              </div>
            </div>
          )}

          {activeTab === 'panduan' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center flex-shrink-0">1</div>
                <div>
                  <h5 className="font-bold text-slate-900">Buka Google Spreadsheet Baru</h5>
                  <p className="text-slate-600 mt-0.5">Buka <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold">sheets.new</a> dan beri nama "Database Supervisi MA Mambaul Ulum".</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center flex-shrink-0">2</div>
                <div>
                  <h5 className="font-bold text-slate-900">Buka Menu Ekstensi &gt; Apps Script</h5>
                  <p className="text-slate-600 mt-0.5">Hapus kode kosong, lalu tempel kode dari tab "Kode Apps Script".</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center flex-shrink-0">3</div>
                <div>
                  <h5 className="font-bold text-slate-900">Jalankan Fungsi Inisialisasi</h5>
                  <p className="text-slate-600 mt-0.5">Pilih fungsi <code>setupMadrasahSpreadsheetDatabase</code> di toolbar atas, lalu klik <strong>Jalankan (Run)</strong>. Seluruh 5 sheet akan otomatis terbuat beserta headernya.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center flex-shrink-0">4</div>
                <div>
                  <h5 className="font-bold text-slate-900">Deploy Sebagai Web App</h5>
                  <p className="text-slate-600 mt-0.5">Klik tombol biru <strong>Deploy &gt; New deployment</strong> &gt; Jenis: <strong>Web App</strong> &gt; Akses: <strong>Anyone (Siapa saja)</strong> &gt; Salin URL dan tempelkan ke tab Koneksi di aplikasi ini.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
