import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  FileText, 
  Award, 
  ArrowRight, 
  HelpCircle,
  Clock,
  Printer,
  Trash2,
  Calendar
} from 'lucide-react';
import { 
  MasterGuru, 
  SupervisiGuru, 
  ScoreCategory,
  MadrasahProfile 
} from '../types';
import { GURU_SECTIONS, KBC_SMART_MAPPING } from '../data/mockData';

interface SupervisiGuruViewProps {
  guruList: MasterGuru[];
  supervisiList: SupervisiGuru[];
  profile: MadrasahProfile;
  onSaveSupervisi: (supervisi: SupervisiGuru) => Promise<void>;
  onDeleteSupervisi: (id: string) => Promise<void>;
  onPrintSupervisi: (item: SupervisiGuru) => void;
}

export const SupervisiGuruView: React.FC<SupervisiGuruViewProps> = ({
  guruList,
  supervisiList,
  profile,
  onSaveSupervisi,
  onDeleteSupervisi,
  onPrintSupervisi
}) => {
  // Form State
  const [selectedGuruId, setSelectedGuruId] = useState<string>(guruList[0]?.id || '');
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [kelas, setKelas] = useState<string>('Kelas XI MA Unggulan 1');

  // 4 Criterion Group Scores (1 to 4)
  const [skorTujuan, setSkorTujuan] = useState<number>(4);
  const [skorIndikator, setSkorIndikator] = useState<number>(4);
  const [skorMateri, setSkorMateri] = useState<number>(4);
  const [skorAktivitas, setSkorAktivitas] = useState<number>(4);

  // Sub-criteria detailed state
  const [subScores, setSubScores] = useState<Record<string, number>>({
    tuj_1: 4, tuj_2: 4, tuj_3: 4, tuj_4: 4,
    ind_1: 4, ind_2: 4, ind_3: 4,
    mat_1: 4, mat_2: 4, mat_3: 4,
    akt_1: 4, akt_2: 4, akt_3: 4, akt_4: 4, akt_5: 4
  });

  // Notes & Follow up (auto-filled by Smart Automation, editable by user)
  const [catatanTotal, setCatatanTotal] = useState<string>(KBC_SMART_MAPPING[4].catatan);
  const [rencanaTindakLanjut, setRencanaTindakLanjut] = useState<string>(KBC_SMART_MAPPING[4].tindak_lanjut);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'form' | 'riwayat'>('form');

  const selectedGuru = guruList.find(g => g.id === selectedGuruId) || guruList[0];

  // Calculate Average Score across 4 sections
  const avgSectionScore = (skorTujuan + skorIndikator + skorMateri + skorAktivitas) / 4;
  const roundedRating = Math.round(avgSectionScore) as 1 | 2 | 3 | 4;
  const totalSkorScaled = Math.round((avgSectionScore / 4) * 100);

  const getKategori = (scaledScore: number): ScoreCategory => {
    if (scaledScore >= 90) return 'Sangat Baik';
    if (scaledScore >= 75) return 'Baik';
    if (scaledScore >= 60) return 'Cukup';
    return 'Perlu Pembinaan';
  };

  const kategori = getKategori(totalSkorScaled);

  // SMART AUTOMATION TRIGGER: When user changes score
  const handleScoreChange = (section: 'tujuan' | 'indikator' | 'materi' | 'aktivitas', newScore: number) => {
    let newT = skorTujuan, newI = skorIndikator, newM = skorMateri, newA = skorAktivitas;
    if (section === 'tujuan') { newT = newScore; setSkorTujuan(newScore); }
    if (section === 'indikator') { newI = newScore; setSkorIndikator(newScore); }
    if (section === 'materi') { newM = newScore; setSkorMateri(newScore); }
    if (section === 'aktivitas') { newA = newScore; setSkorAktivitas(newScore); }

    const newAvg = (newT + newI + newM + newA) / 4;
    const mappedScore = Math.max(1, Math.min(4, Math.round(newAvg))) as 1 | 2 | 3 | 4;
    
    // Auto-update notes and follow-up suggestion based on Deep Learning & KBC logic
    const suggestion = KBC_SMART_MAPPING[mappedScore];
    setCatatanTotal(suggestion.catatan);
    setRencanaTindakLanjut(suggestion.tindak_lanjut);
  };

  const handleSubScoreChange = (subId: string, sectionId: 'tujuan' | 'indikator' | 'materi' | 'aktivitas', score: number) => {
    const updated = { ...subScores, [subId]: score };
    setSubScores(updated);

    // Calculate section average
    const sectionConfig = GURU_SECTIONS.find(s => s.id === sectionId);
    if (sectionConfig) {
      const subVals = sectionConfig.subItems.map(item => updated[item.id] || 4);
      const secAvg = Math.round(subVals.reduce((a, b) => a + b, 0) / subVals.length);
      handleScoreChange(sectionId, secAvg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuru) return;
    setIsSubmitting(true);

    const newSupervisi: SupervisiGuru = {
      id: `SG-${Date.now()}`,
      id_guru: selectedGuru.id,
      nama_guru: selectedGuru.nama,
      mapel: selectedGuru.mapel,
      tanggal,
      kelas,
      skor_tujuan: skorTujuan,
      skor_indikator: skorIndikator,
      skor_materi: skorMateri,
      skor_aktivitas: skorAktivitas,
      catatan_total: catatanTotal.trim(),
      rencana_tindak_lanjut: rencanaTindakLanjut.trim(),
      total_skor: totalSkorScaled,
      kategori,
      supervisor_nama: profile.kepalaMadrasah,
      supervisor_nip: profile.nipKepala,
      detail_sub: subScores,
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Supervisi Akademik Guru (Kurikulum Berbasis Cinta)
            </h2>
            <p className="text-xs text-slate-500">
              Evaluasi mendalam 4 pilar pedagogis: Tujuan, Indikator, Materi, & Aktivitas Belajar
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'form' ? 'bg-white text-emerald-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Formulir Evaluasi
          </button>
          <button
            onClick={() => setActiveTab('riwayat')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'riwayat' ? 'bg-white text-emerald-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Riwayat Evaluasi ({supervisiList.length})
          </button>
        </div>
      </div>

      {activeTab === 'form' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Teacher Selection & Class Meta */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <span>Identitas Guru & Waktu Supervisi</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Guru (Master_Guru) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedGuruId}
                  onChange={(e) => setSelectedGuruId(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                >
                  {guruList.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nama} — {g.mapel}
                    </option>
                  ))}
                </select>
                {selectedGuru && (
                  <div className="mt-1 text-[11px] text-slate-500">
                    NIP: {selectedGuru.nip || '-'} • Mapel: <strong className="text-emerald-800">{selectedGuru.mapel}</strong>
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
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ruang Kelas / Tingkat
                </label>
                <input
                  type="text"
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  placeholder="Contoh: Kelas X MA Reguler 2"
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: 4 KBC Deep Learning Sections */}
          <div className="space-y-4">
            {GURU_SECTIONS.map((section, sIdx) => {
              const currentScore = 
                section.id === 'tujuan' ? skorTujuan :
                section.id === 'indikator' ? skorIndikator :
                section.id === 'materi' ? skorMateri : skorAktivitas;

              return (
                <div key={section.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {section.nama}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {section.deskripsiKBC}
                      </p>
                    </div>

                    {/* Section Rating Button Bar (1-4) */}
                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase px-1.5">Skor Aspek:</span>
                      {[1, 2, 3, 4].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleScoreChange(section.id as any, val)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                            currentScore === val
                              ? val === 4 ? 'bg-emerald-600 text-white' :
                                val === 3 ? 'bg-blue-600 text-white' :
                                val === 2 ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sub-item checklists */}
                  <div className="p-4 space-y-2.5 divide-y divide-slate-100">
                    {section.subItems.map((sub, subIdx) => {
                      const itemScore = subScores[sub.id] || 4;
                      return (
                        <div key={sub.id} className={`pt-2.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2`}>
                          <div className="max-w-2xl">
                            <span className="text-xs font-bold text-slate-800">
                              {subIdx + 1}. {sub.nama}
                            </span>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                              {sub.deskripsi}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 self-start sm:self-center flex-shrink-0">
                            {[1, 2, 3, 4].map((v) => (
                              <button
                                key={v}
                                type="button"
                                onClick={() => handleSubScoreChange(sub.id, section.id as any, v)}
                                className={`w-6 h-6 rounded-md text-[11px] font-bold transition flex items-center justify-center ${
                                  itemScore === v
                                    ? v === 4 ? 'bg-emerald-600 text-white' :
                                      v === 3 ? 'bg-blue-600 text-white' :
                                      v === 2 ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                                title={v === 4 ? 'Sangat Baik' : v === 3 ? 'Baik' : v === 2 ? 'Cukup' : 'Perlu Pembinaan'}
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
              );
            })}
          </div>

          {/* Section 3: Smart Automation Output (Catatan & Tindak Lanjut) */}
          <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-emerald-800/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-800/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white">
                    Smart Automation: Catatan & Rencana Tindak Lanjut (KBC)
                  </h4>
                  <p className="text-xs text-emerald-200">
                    Dihasilkan otomatis berdasarkan filosofi Kurikulum Berbasis Cinta & Pembelajaran Mendalam (Dapat diedit bebas)
                  </p>
                </div>
              </div>

              {/* Total Score Meter */}
              <div className="flex items-center gap-3 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
                <div className="text-right">
                  <span className="text-[10px] text-emerald-300 uppercase font-bold block">Total Skor:</span>
                  <span className="text-base font-extrabold font-mono text-white">{totalSkorScaled} / 100</span>
                </div>
                <div className="h-6 w-px bg-white/20" />
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                  kategori === 'Sangat Baik' ? 'bg-emerald-500 text-emerald-950' :
                  kategori === 'Baik' ? 'bg-blue-500 text-white' :
                  kategori === 'Cukup' ? 'bg-amber-500 text-amber-950' : 'bg-rose-500 text-white'
                }`}>
                  {kategori}
                </span>
              </div>
            </div>

            {/* Editable Catatan Total */}
            <div>
              <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                Catatan Evaluasi Supervisi (Otomatis & Editable) <span className="text-rose-400">*</span>
              </label>
              <textarea
                value={catatanTotal}
                onChange={(e) => setCatatanTotal(e.target.value)}
                rows={3}
                className="w-full text-xs sm:text-sm bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:bg-white/20 focus:ring-2 focus:ring-emerald-400 focus:outline-none leading-relaxed"
                required
              />
            </div>

            {/* Editable Rencana Tindak Lanjut */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Rencana Tindak Lanjut & Rekomendasi Kepala Madrasah <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-amber-300 font-semibold">
                  ⚡ Otomatis masuk ke tab Tindak_Lanjut
                </span>
              </div>
              <textarea
                value={rencanaTindakLanjut}
                onChange={(e) => setRencanaTindakLanjut(e.target.value)}
                rows={3}
                className="w-full text-xs sm:text-sm bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:bg-white/20 focus:ring-2 focus:ring-emerald-400 focus:outline-none leading-relaxed"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold text-xs sm:text-sm shadow-lg transition transform active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Supervisi Guru & Terbitkan Tindak Lanjut'}</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Riwayat Evaluasi Guru Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">
              Rekap Tab Supervisi_Guru ({supervisiList.length} Catatan)
            </h3>
            <button
              onClick={() => setActiveTab('form')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              + Input Supervisi Baru
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-3">Guru & Mapel</th>
                  <th className="py-3 px-3">Tanggal</th>
                  <th className="py-3 px-3 text-center">Tujuan</th>
                  <th className="py-3 px-3 text-center">Indikator</th>
                  <th className="py-3 px-3 text-center">Materi</th>
                  <th className="py-3 px-3 text-center">Aktivitas</th>
                  <th className="py-3 px-3 text-center">Total Skor</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {supervisiList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      <div>{item.nama_guru}</div>
                      <div className="text-[11px] text-emerald-700 font-medium">{item.mapel}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {item.tanggal}
                    </td>
                    <td className="py-3 px-3 text-center font-bold font-mono">{item.skor_tujuan}</td>
                    <td className="py-3 px-3 text-center font-bold font-mono">{item.skor_indikator}</td>
                    <td className="py-3 px-3 text-center font-bold font-mono">{item.skor_materi}</td>
                    <td className="py-3 px-3 text-center font-bold font-mono">{item.skor_aktivitas}</td>
                    <td className="py-3 px-3 text-center font-black font-mono text-emerald-800">
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
