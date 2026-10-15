import React, { useState } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  Printer, 
  Trash2, 
  Award,
  HelpCircle
} from 'lucide-react';
import { 
  MasterTendik, 
  SupervisiTendik, 
  ScoreCategory,
  MadrasahProfile 
} from '../types';
import { TENDIK_CHECKLIST_MAPPING, TENDIK_SMART_MAPPING } from '../data/mockData';

interface SupervisiTendikViewProps {
  tendikList: MasterTendik[];
  supervisiList: SupervisiTendik[];
  profile: MadrasahProfile;
  onSaveSupervisi: (supervisi: SupervisiTendik) => Promise<void>;
  onDeleteSupervisi: (id: string) => Promise<void>;
  onPrintSupervisi: (item: SupervisiTendik) => void;
}

export const SupervisiTendikView: React.FC<SupervisiTendikViewProps> = ({
  tendikList,
  supervisiList,
  profile,
  onSaveSupervisi,
  onDeleteSupervisi,
  onPrintSupervisi
}) => {
  const [selectedTendikId, setSelectedTendikId] = useState<string>(tendikList[0]?.id || '');
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // 8 Checklist item scores (1 to 4)
  const [itemScores, setItemScores] = useState<number[]>([4, 4, 4, 4, 4, 4, 4, 4]);
  
  // Smart Automation Notes & Follow up
  const [catatanTotal, setCatatanTotal] = useState<string>(TENDIK_SMART_MAPPING[4].catatan);
  const [rencanaTindakLanjut, setRencanaTindakLanjut] = useState<string>(TENDIK_SMART_MAPPING[4].tindak_lanjut);
  
  const [activeTab, setActiveTab] = useState<'form' | 'riwayat'>('form');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectedTendik = tendikList.find(t => t.id === selectedTendikId) || tendikList[0];
  const bidangTugas = selectedTendik?.bidang_tugas || 'Kepegawaian';

  // Get the 8 checklist items for this role
  const checklistConfig = TENDIK_CHECKLIST_MAPPING[bidangTugas] || TENDIK_CHECKLIST_MAPPING['Kepegawaian'];

  // Calculate Average & Scaled Total (0 - 100)
  const avgScore = itemScores.reduce((a, b) => a + b, 0) / 8;
  const totalSkorScaled = Math.round((avgScore / 4) * 100);

  const getKategori = (scaled: number): ScoreCategory => {
    if (scaled >= 90) return 'Sangat Baik';
    if (scaled >= 75) return 'Baik';
    if (scaled >= 60) return 'Cukup';
    return 'Perlu Pembinaan';
  };

  const kategori = getKategori(totalSkorScaled);

  const handleScoreChange = (index: number, val: number) => {
    const updated = [...itemScores];
    updated[index] = val;
    setItemScores(updated);

    // Trigger Smart Automation Proposal
    const newAvg = updated.reduce((a, b) => a + b, 0) / 8;
    const mappedVal = Math.max(1, Math.min(4, Math.round(newAvg))) as 1 | 2 | 3 | 4;
    const suggestion = TENDIK_SMART_MAPPING[mappedVal];
    setCatatanTotal(suggestion.catatan);
    setRencanaTindakLanjut(suggestion.tindak_lanjut);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTendik) return;
    setIsSubmitting(true);

    const newSupervisi: SupervisiTendik = {
      id: `ST-${Date.now()}`,
      id_tendik: selectedTendik.id,
      nama_tendik: selectedTendik.nama,
      bidang_tugas: selectedTendik.bidang_tugas,
      tanggal,
      skor_1_sd_8: itemScores,
      catatan_total: catatanTotal.trim(),
      rencana_tindak_lanjut: rencanaTindakLanjut.trim(),
      total_skor: totalSkorScaled,
      kategori,
      supervisor_nama: profile.kepalaMadrasah,
      created_at: new Date().toISOString()
    };

    try {
      await onSaveSupervisi(newSupervisi);
      setActiveTab('riwayat');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Supervisi Tenaga Kependidikan (Tendik)
            </h2>
            <p className="text-xs text-slate-500">
              Penilaian pelayanan ramah, solutif, dan iklim madrasah penuh kasih (8 Indikator Kerja)
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'form' ? 'bg-white text-teal-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Formulir Tendik
          </button>
          <button
            onClick={() => setActiveTab('riwayat')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'riwayat' ? 'bg-white text-teal-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Riwayat Evaluasi ({supervisiList.length})
          </button>
        </div>
      </div>

      {activeTab === 'form' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Staff selection & date */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900">
              Identitas Tenaga Kependidikan & Tugas
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Tendik (Master_Tendik) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedTendikId}
                  onChange={(e) => {
                    setSelectedTendikId(e.target.value);
                  }}
                  className="w-full text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                >
                  {tendikList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nama} — {t.bidang_tugas}
                    </option>
                  ))}
                </select>
                {selectedTendik && (
                  <div className="mt-1 text-[11px] text-slate-500">
                    Bidang: <strong className="text-teal-800">{selectedTendik.bidang_tugas}</strong> • NIP: {selectedTendik.nip || '-'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tanggal Supervisi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Fokus Pelayanan
                </label>
                <div className="text-xs p-2.5 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 font-semibold">
                  {checklistConfig.title}
                </div>
              </div>
            </div>
          </div>

          {/* 8 Items Checklist Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                  8 Indikator Kinerja & Pelayanan Humanis: {bidangTugas}
                </h4>
                <p className="text-xs text-slate-500">
                  Skala: 1 (Perlu Pembinaan), 2 (Cukup), 3 (Baik), 4 (Sangat Baik)
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 font-bold">Rata-Rata: </span>
                <span className="text-sm font-extrabold font-mono text-teal-800">{avgScore.toFixed(2)} / 4</span>
              </div>
            </div>

            <div className="p-4 space-y-3 divide-y divide-slate-100">
              {checklistConfig.items.map((desc, idx) => {
                const currentScore = itemScores[idx] || 4;
                return (
                  <div key={idx} className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5 max-w-2xl">
                      <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-800 leading-relaxed font-medium">
                        {desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 self-start sm:self-center flex-shrink-0">
                      {[1, 2, 3, 4].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => handleScoreChange(idx, v)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                            currentScore === v
                              ? v === 4 ? 'bg-teal-600 text-white' :
                                v === 3 ? 'bg-blue-600 text-white' :
                                v === 2 ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Smart Automation Notes & Follow-up */}
          <div className="bg-gradient-to-br from-teal-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-teal-800/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-teal-800/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white">
                    Smart Automation Catatan Tendik & Tindak Lanjut
                  </h4>
                  <p className="text-xs text-teal-200">
                    Otomatis diselaraskan dengan etos pelayanan prima & iklim madrasah yang penuh kasih
                  </p>
                </div>
              </div>

              {/* Score Meter */}
              <div className="flex items-center gap-3 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
                <div className="text-right">
                  <span className="text-[10px] text-teal-300 uppercase font-bold block">Total Skor:</span>
                  <span className="text-base font-extrabold font-mono text-white">{totalSkorScaled} / 100</span>
                </div>
                <div className="h-6 w-px bg-white/20" />
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                  kategori === 'Sangat Baik' ? 'bg-teal-400 text-teal-950' :
                  kategori === 'Baik' ? 'bg-blue-500 text-white' :
                  kategori === 'Cukup' ? 'bg-amber-500 text-amber-950' : 'bg-rose-500 text-white'
                }`}>
                  {kategori}
                </span>
              </div>
            </div>

            {/* Catatan Total */}
            <div>
              <label className="block text-xs font-bold text-teal-300 uppercase tracking-wider mb-1">
                Catatan Hasil Supervisi (Otomatis & Editable) <span className="text-rose-400">*</span>
              </label>
              <textarea
                value={catatanTotal}
                onChange={(e) => setCatatanTotal(e.target.value)}
                rows={3}
                className="w-full text-xs sm:text-sm bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:bg-white/20 focus:ring-2 focus:ring-teal-400 focus:outline-none leading-relaxed"
                required
              />
            </div>

            {/* Rencana Tindak Lanjut */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-teal-300 uppercase tracking-wider">
                  Rencana Tindak Lanjut & Pembinaan <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-amber-300 font-semibold">
                  ⚡ Otomatis masuk ke tab Tindak_Lanjut
                </span>
              </div>
              <textarea
                value={rencanaTindakLanjut}
                onChange={(e) => setRencanaTindakLanjut(e.target.value)}
                rows={3}
                className="w-full text-xs sm:text-sm bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:bg-white/20 focus:ring-2 focus:ring-teal-400 focus:outline-none leading-relaxed"
                required
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-teal-950 font-extrabold text-xs sm:text-sm shadow-lg transition transform active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Supervisi Tendik & Terbitkan Tindak Lanjut'}</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* History table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">
              Rekap Tab Supervisi_Tendik ({supervisiList.length} Catatan)
            </h3>
            <button
              onClick={() => setActiveTab('form')}
              className="text-xs font-bold text-teal-700 hover:underline"
            >
              + Input Supervisi Baru
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-3">Nama Tendik</th>
                  <th className="py-3 px-3">Bidang Tugas</th>
                  <th className="py-3 px-3">Tanggal</th>
                  <th className="py-3 px-3 text-center">Total Skor</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">Catatan Ringkas</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {supervisiList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {item.nama_tendik}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                        {item.bidang_tugas}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {item.tanggal}
                    </td>
                    <td className="py-3 px-3 text-center font-black font-mono text-teal-800">
                      {item.total_skor}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.kategori === 'Sangat Baik' ? 'bg-emerald-100 text-emerald-800' :
                        item.kategori === 'Baik' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.kategori}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                      {item.catatan_total}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPrintSupervisi(item)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                          title="Cetak Berkas"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteSupervisi(item.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
