import React, { useState } from 'react';
import { 
  Printer, 
  GraduationCap, 
  Briefcase, 
  Search, 
  Filter, 
  Download, 
  Award,
  Calendar,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { SupervisiGuru, SupervisiTendik } from '../types';

interface RekapLaporanViewProps {
  supervisiGuruList: SupervisiGuru[];
  supervisiTendikList: SupervisiTendik[];
  onOpenReportModal: (item: SupervisiGuru | SupervisiTendik, type: 'guru' | 'tendik') => void;
}

export const RekapLaporanView: React.FC<RekapLaporanViewProps> = ({
  supervisiGuruList,
  supervisiTendikList,
  onOpenReportModal
}) => {
  const [filterType, setFilterType] = useState<'all' | 'guru' | 'tendik'>('all');
  const [search, setSearch] = useState<string>('');

  const combinedList = [
    ...supervisiGuruList.map(g => ({ ...g, type: 'guru' as const, name: g.nama_guru, roleDetail: `Guru ${g.mapel}` })),
    ...supervisiTendikList.map(t => ({ ...t, type: 'tendik' as const, name: t.nama_tendik, roleDetail: `Tendik ${t.bidang_tugas}` }))
  ].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  const filtered = combinedList.filter(item => {
    const matchType = filterType === 'all' || item.type === filterType;
    const matchSearch = item.name?.toLowerCase().includes(search.toLowerCase()) ||
                        item.roleDetail.toLowerCase().includes(search.toLowerCase()) ||
                        item.kategori.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
            <Printer className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Rekapitulasi Nilai & Cetak Dokumen Laporan Supervisi
            </h2>
            <p className="text-xs text-slate-500">
              Cetak berkas resmi berformat Berita Acara & Instrumen Kurikulum Berbasis Cinta (A4 / PDF)
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'all' ? 'bg-white text-emerald-900 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Semua ({combinedList.length})
          </button>
          <button
            onClick={() => setFilterType('guru')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'guru' ? 'bg-white text-emerald-900 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Guru ({supervisiGuruList.length})
          </button>
          <button
            onClick={() => setFilterType('tendik')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'tendik' ? 'bg-white text-emerald-900 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Tendik ({supervisiTendikList.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Cari nama guru, staf, mata pelajaran..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-3 pr-8 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <span className="text-xs text-slate-500">
          Menampilkan {filtered.length} arsip supervisi
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3.5 px-4">Nama Personil</th>
                <th className="py-3.5 px-3">Peran / Tugas</th>
                <th className="py-3.5 px-3">Tanggal Supervisi</th>
                <th className="py-3.5 px-3 text-center">Total Skor</th>
                <th className="py-3.5 px-3">Kategori KBC</th>
                <th className="py-3.5 px-3">Rencana Tindak Lanjut</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${item.type === 'guru' ? 'bg-emerald-100 text-emerald-800' : 'bg-teal-100 text-teal-800'}`}>
                        {item.type === 'guru' ? <GraduationCap className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                      </div>
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-xs text-slate-700 font-semibold">{item.roleDetail}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                    {item.tanggal}
                  </td>
                  <td className="py-3.5 px-3 text-center font-black font-mono text-sm text-emerald-900">
                    {item.total_skor}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.kategori === 'Sangat Baik' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      item.kategori === 'Baik' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      item.kategori === 'Cukup' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.kategori}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 max-w-xs truncate text-[11px]">
                    {item.rencana_tindak_lanjut}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onOpenReportModal(item as any, item.type)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-xs">
                    Belum ada data supervisi yang cocok
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
