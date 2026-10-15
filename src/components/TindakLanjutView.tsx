import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Search, 
  Filter, 
  Kanban, 
  List, 
  Calendar,
  Sparkles,
  ArrowRight,
  Trash2,
  Edit2
} from 'lucide-react';
import { TindakLanjut, FollowUpStatus } from '../types';

interface TindakLanjutViewProps {
  tindakLanjutList: TindakLanjut[];
  onUpdateStatus: (id: string, status: FollowUpStatus, catatan?: string) => Promise<void>;
  onDeleteTindakLanjut: (id: string) => Promise<void>;
  onAddTindakLanjut: (item: TindakLanjut) => Promise<void>;
}

export const TindakLanjutView: React.FC<TindakLanjutViewProps> = ({
  tindakLanjutList,
  onUpdateStatus,
  onDeleteTindakLanjut,
  onAddTindakLanjut
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState<string>('');
  const [filterAspek, setFilterAspek] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New manual item form
  const [aspek, setAspek] = useState<string>('Pembelajaran Guru');
  const [personilNama, setPersonilNama] = useState<string>('');
  const [temuan, setTemuan] = useState<string>('');
  const [rencana, setRencana] = useState<string>('');
  const [waktu, setWaktu] = useState<string>('Bulan Depan');

  const filteredItems = tindakLanjutList.filter(item => {
    const matchSearch = item.temuan.toLowerCase().includes(search.toLowerCase()) ||
                        item.rencana.toLowerCase().includes(search.toLowerCase()) ||
                        (item.personil_nama && item.personil_nama.toLowerCase().includes(search.toLowerCase())) ||
                        item.aspek.toLowerCase().includes(search.toLowerCase());
    const matchAspek = filterAspek === 'all' || item.aspek.toLowerCase().includes(filterAspek.toLowerCase());
    return matchSearch && matchAspek;
  });

  const pendingItems = filteredItems.filter(i => i.status === 'Pending');
  const inProgressItems = filteredItems.filter(i => i.status === 'In Progress');
  const completedItems = filteredItems.filter(i => i.status === 'Completed');

  const handleCreateManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!temuan.trim() || !rencana.trim()) return;

    const newItem: TindakLanjut = {
      id: `TL-MANUAL-${Date.now()}`,
      aspek,
      personil_nama: personilNama.trim() || 'Personil Madrasah',
      temuan: temuan.trim(),
      rencana: rencana.trim(),
      waktu,
      status: 'Pending',
      updated_at: new Date().toISOString()
    };

    await onAddTindakLanjut(newItem);
    setIsAddModalOpen(false);
    setTemuan('');
    setRencana('');
    setPersonilNama('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Papan Tindak Lanjut & Monitoring Pembinaan (Tindak_Lanjut)
            </h2>
            <p className="text-xs text-slate-500">
              Melacak kesepakatan coaching dan perbaikan KBC guru & tendik sampai tuntas
            </p>
          </div>
        </div>

        {/* View toggles & Add button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban Board</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Tabel Data</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah Catatan</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="Cari temuan, personil, atau rencana..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-3 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <select
            value={filterAspek}
            onChange={(e) => setFilterAspek(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">Semua Aspek</option>
            <option value="pembelajaran">Pembelajaran Guru</option>
            <option value="sarana">Sarana Prasarana</option>
            <option value="kepegawaian">Kepegawaian</option>
            <option value="kesiswaan">Kesiswaan</option>
            <option value="persuratan">Persuratan</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Menampilkan <strong>{filteredItems.length}</strong> catatan tindak lanjut
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Column 1: Pending */}
          <div className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/90 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Pending (Menunggu)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                {pendingItems.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      {item.aspek}
                    </span>
                    <button
                      onClick={() => onDeleteTindakLanjut(item.id)}
                      className="text-slate-400 hover:text-rose-600 transition"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {item.personil_nama && (
                    <div className="text-xs font-bold text-slate-900">
                      {item.personil_nama}
                    </div>
                  )}

                  <div className="bg-slate-50 p-2 rounded-lg text-xs text-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Temuan:</span>
                    <p className="line-clamp-2 mt-0.5 text-slate-600 italic">"{item.temuan}"</p>
                  </div>

                  <div className="text-xs text-slate-800">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Rencana Aksi KBC:</span>
                    <p className="line-clamp-2 font-medium mt-0.5">{item.rencana}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {item.waktu}
                    </span>
                    <button
                      onClick={() => onUpdateStatus(item.id, 'In Progress')}
                      className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[10px] transition"
                    >
                      Mulai Proses →
                    </button>
                  </div>
                </div>
              ))}
              {pendingItems.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs italic">
                  Tidak ada tindak lanjut pending
                </div>
              )}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/90 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  In Progress (Sedang Berjalan)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                {inProgressItems.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {inProgressItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                      {item.aspek}
                    </span>
                    <button
                      onClick={() => onDeleteTindakLanjut(item.id)}
                      className="text-slate-400 hover:text-rose-600 transition"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {item.personil_nama && (
                    <div className="text-xs font-bold text-slate-900">
                      {item.personil_nama}
                    </div>
                  )}

                  <div className="bg-slate-50 p-2 rounded-lg text-xs text-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Temuan:</span>
                    <p className="line-clamp-2 mt-0.5 text-slate-600 italic">"{item.temuan}"</p>
                  </div>

                  <div className="text-xs text-slate-800">
                    <span className="text-[10px] font-bold text-blue-800 uppercase block">Rencana Aksi:</span>
                    <p className="line-clamp-2 font-medium mt-0.5">{item.rencana}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <button
                      onClick={() => onUpdateStatus(item.id, 'Pending')}
                      className="text-[10px] text-slate-400 hover:underline"
                    >
                      ← Kembali
                    </button>
                    <button
                      onClick={() => onUpdateStatus(item.id, 'Completed')}
                      className="px-2 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-[10px] transition shadow-xs"
                    >
                      ✓ Selesai
                    </button>
                  </div>
                </div>
              ))}
              {inProgressItems.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs italic">
                  Tidak ada tindak lanjut dalam proses
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Completed */}
          <div className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/90 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Completed (Tuntas)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {completedItems.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {completedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs space-y-2 opacity-90"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {item.aspek}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>

                  {item.personil_nama && (
                    <div className="text-xs font-bold text-slate-900">
                      {item.personil_nama}
                    </div>
                  )}

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {item.rencana}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{item.waktu}</span>
                    <button
                      onClick={() => onUpdateStatus(item.id, 'In Progress')}
                      className="text-[10px] text-blue-600 hover:underline"
                    >
                      Buka Kembali
                    </button>
                  </div>
                </div>
              ))}
              {completedItems.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs italic">
                  Belum ada tindak lanjut yang selesai
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* TABLE VIEW (TABEL TINDAK_LANJUT) */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-3">Aspek</th>
                  <th className="py-3 px-3">Personil</th>
                  <th className="py-3 px-3">Temuan (Catatan)</th>
                  <th className="py-3 px-3">Rencana Tindak Lanjut</th>
                  <th className="py-3 px-3">Waktu</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {item.aspek}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900">
                      {item.personil_nama || '-'}
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs">
                      {item.temuan}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800 max-w-xs">
                      {item.rencana}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {item.waktu}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateStatus(item.id, e.target.value as FollowUpStatus)}
                        className="text-[11px] font-semibold bg-slate-50 border border-slate-300 rounded px-2 py-1"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add Manual Follow-up */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Tambah Catatan Tindak Lanjut Manual
            </h3>

            <form onSubmit={handleCreateManual} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Aspek Tindak Lanjut
                </label>
                <select
                  value={aspek}
                  onChange={(e) => setAspek(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                >
                  <option value="Pembelajaran Guru">Pembelajaran Guru</option>
                  <option value="Administrasi Sarana Prasarana">Administrasi Sarana Prasarana</option>
                  <option value="Administrasi Kepegawaian">Administrasi Kepegawaian</option>
                  <option value="Layanan Kesiswaan & Alumni">Layanan Kesiswaan & Alumni</option>
                  <option value="Tata Kelola Persuratan">Tata Kelola Persuratan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Personil (Guru / Tendik)
                </label>
                <input
                  type="text"
                  value={personilNama}
                  onChange={(e) => setPersonilNama(e.target.value)}
                  placeholder="Contoh: Ustadz Ahmad Farhan, S.Pd.I."
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Temuan / Masalah yang Dihadapi <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={temuan}
                  onChange={(e) => setTemuan(e.target.value)}
                  rows={2}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rencana Tindak Lanjut & Bimbingan KBC <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={rencana}
                  onChange={(e) => setRencana(e.target.value)}
                  rows={2}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Waktu Penyelesaian
                </label>
                <input
                  type="text"
                  value={waktu}
                  onChange={(e) => setWaktu(e.target.value)}
                  placeholder="Contoh: Akhir Bulan Ini"
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                >
                  Simpan Tindak Lanjut
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
