import React, { useState } from 'react';
import { 
  Database, 
  GraduationCap, 
  Briefcase, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  Search,
  UserCheck
} from 'lucide-react';
import { MasterGuru, MasterTendik } from '../types';

interface MasterDataViewProps {
  guruList: MasterGuru[];
  tendikList: MasterTendik[];
  onSaveGuru: (guru: MasterGuru) => Promise<void>;
  onDeleteGuru: (id: string) => Promise<void>;
  onSaveTendik: (tendik: MasterTendik) => Promise<void>;
  onDeleteTendik: (id: string) => Promise<void>;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  guruList,
  tendikList,
  onSaveGuru,
  onDeleteGuru,
  onSaveTendik,
  onDeleteTendik
}) => {
  const [activeTab, setActiveTab] = useState<'guru' | 'tendik'>('guru');
  const [search, setSearch] = useState<string>('');

  // Form states for Guru
  const [isEditingGuru, setIsEditingGuru] = useState<boolean>(false);
  const [guruId, setGuruId] = useState<string>('');
  const [guruNama, setGuruNama] = useState<string>('');
  const [guruMapel, setGuruMapel] = useState<string>('');
  const [guruNip, setGuruNip] = useState<string>('');
  const [guruPendidikan, setGuruPendidikan] = useState<string>('');

  // Form states for Tendik
  const [isEditingTendik, setIsEditingTendik] = useState<boolean>(false);
  const [tendikId, setTendikId] = useState<string>('');
  const [tendikNama, setTendikNama] = useState<string>('');
  const [tendikTugas, setTendikTugas] = useState<string>('Kepegawaian');
  const [tendikNip, setTendikNip] = useState<string>('');

  // Handler for Guru
  const handleOpenAddGuru = () => {
    setIsEditingGuru(true);
    setGuruId(`GUR-${String(guruList.length + 1).padStart(2, '0')}`);
    setGuruNama('');
    setGuruMapel('Al-Qur\'an Hadits');
    setGuruNip('');
    setGuruPendidikan('S1 Pendidikan');
  };

  const handleEditGuru = (g: MasterGuru) => {
    setIsEditingGuru(true);
    setGuruId(g.id);
    setGuruNama(g.nama);
    setGuruMapel(g.mapel);
    setGuruNip(g.nip || '');
    setGuruPendidikan(g.pendidikan || '');
  };

  const handleSubmitGuru = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guruNama.trim() || !guruMapel.trim()) return;
    await onSaveGuru({
      id: guruId,
      nama: guruNama.trim(),
      mapel: guruMapel.trim(),
      nip: guruNip.trim(),
      pendidikan: guruPendidikan.trim()
    });
    setIsEditingGuru(false);
  };

  // Handler for Tendik
  const handleOpenAddTendik = () => {
    setIsEditingTendik(true);
    setTendikId(`TND-${String(tendikList.length + 1).padStart(2, '0')}`);
    setTendikNama('');
    setTendikTugas('Kepegawaian');
    setTendikNip('');
  };

  const handleEditTendik = (t: MasterTendik) => {
    setIsEditingTendik(true);
    setTendikId(t.id);
    setTendikNama(t.nama);
    setTendikTugas(t.bidang_tugas);
    setTendikNip(t.nip || '');
  };

  const handleSubmitTendik = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tendikNama.trim()) return;
    await onSaveTendik({
      id: tendikId,
      nama: tendikNama.trim(),
      bidang_tugas: tendikTugas,
      nip: tendikNip.trim()
    });
    setIsEditingTendik(false);
  };

  const filteredGuru = guruList.filter(g => 
    g.nama.toLowerCase().includes(search.toLowerCase()) || 
    g.mapel.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTendik = tendikList.filter(t => 
    t.nama.toLowerCase().includes(search.toLowerCase()) || 
    t.bidang_tugas.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Master Data Personil Madrasah (Master_Guru & Master_Tendik)
            </h2>
            <p className="text-xs text-slate-500">
              Sinkron dengan tab Sheet Master_Guru dan Master_Tendik
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('guru'); setSearch(''); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
              activeTab === 'guru' ? 'bg-white text-emerald-900 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>Master Guru ({guruList.length})</span>
          </button>
          <button
            onClick={() => { setActiveTab('tendik'); setSearch(''); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
              activeTab === 'tendik' ? 'bg-white text-emerald-900 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            <Briefcase className="w-4 h-4 text-teal-600" />
            <span>Master Tendik ({tendikList.length})</span>
          </button>
        </div>
      </div>

      {/* Action and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder={activeTab === 'guru' ? "Cari nama guru atau mata pelajaran..." : "Cari nama tendik atau tugas..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-3 pr-8 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <button
          onClick={activeTab === 'guru' ? handleOpenAddGuru : handleOpenAddTendik}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>{activeTab === 'guru' ? 'Tambah Guru Baru' : 'Tambah Tendik Baru'}</span>
        </button>
      </div>

      {/* TAB GURU */}
      {activeTab === 'guru' && (
        <div className="space-y-4">
          {/* Guru Edit / Add Form */}
          {isEditingGuru && (
            <form onSubmit={handleSubmitGuru} className="bg-emerald-50/60 border border-emerald-200 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <span className="text-xs font-bold uppercase text-emerald-950">
                  {guruId ? 'Edit Data Guru' : 'Tambah Guru Baru'} (Columns: id, nama, mapel)
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingGuru(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Batal
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    ID Guru (id) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={guruId}
                    onChange={(e) => setGuruId(e.target.value)}
                    className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg p-2"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nama Lengkap & Gelar (nama) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={guruNama}
                    onChange={(e) => setGuruNama(e.target.value)}
                    placeholder="Contoh: Ustadz Ahmad Farhan, S.Pd.I."
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Mata Pelajaran (mapel) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={guruMapel}
                    onChange={(e) => setGuruMapel(e.target.value)}
                    placeholder="Contoh: Al-Qur'an Hadits"
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    NIP / NUPTK
                  </label>
                  <input
                    type="text"
                    value={guruNip}
                    onChange={(e) => setGuruNip(e.target.value)}
                    placeholder="19840315 200912 1 002"
                    className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Pendidikan Terakhir
                  </label>
                  <input
                    type="text"
                    value={guruPendidikan}
                    onChange={(e) => setGuruPendidikan(e.target.value)}
                    placeholder="S1 Pendidikan Agama Islam"
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-emerald-200">
                <button
                  type="button"
                  onClick={() => setIsEditingGuru(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                >
                  Simpan Guru
                </button>
              </div>
            </form>
          )}

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Nama Lengkap</th>
                  <th className="py-3 px-4">Mata Pelajaran (mapel)</th>
                  <th className="py-3 px-4">NIP / NUPTK</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGuru.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800">{g.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{g.nama}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {g.mapel}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{g.nip || '-'}</td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEditGuru(g)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus ${g.nama} dari Master Guru?`)) {
                              onDeleteGuru(g.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
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

      {/* TAB TENDIK */}
      {activeTab === 'tendik' && (
        <div className="space-y-4">
          {isEditingTendik && (
            <form onSubmit={handleSubmitTendik} className="bg-teal-50/60 border border-teal-200 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-teal-200 pb-2">
                <span className="text-xs font-bold uppercase text-teal-950">
                  {tendikId ? 'Edit Data Tendik' : 'Tambah Tendik Baru'} (Columns: id, nama, bidang_tugas)
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingTendik(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Batal
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    ID Tendik (id) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tendikId}
                    onChange={(e) => setTendikId(e.target.value)}
                    className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg p-2"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nama Lengkap & Gelar (nama) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tendikNama}
                    onChange={(e) => setTendikNama(e.target.value)}
                    placeholder="Contoh: H. Abdul Rasyid, S.Sos."
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Bidang Tugas (bidang_tugas) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={tendikTugas}
                    onChange={(e) => setTendikTugas(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-semibold"
                  >
                    <option value="Kepegawaian">Kepegawaian</option>
                    <option value="Sarana Prasarana">Sarana Prasarana</option>
                    <option value="Persuratan">Persuratan</option>
                    <option value="Kesiswaan">Kesiswaan</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-teal-200">
                <button
                  type="button"
                  onClick={() => setIsEditingTendik(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg"
                >
                  Simpan Tendik
                </button>
              </div>
            </form>
          )}

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Nama Lengkap</th>
                  <th className="py-3 px-4">Bidang Tugas (bidang_tugas)</th>
                  <th className="py-3 px-4">NIP</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTendik.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-teal-800">{t.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{t.nama}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                        {t.bidang_tugas}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{t.nip || '-'}</td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEditTendik(t)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus ${t.nama} dari Master Tendik?`)) {
                              onDeleteTendik(t.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
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
