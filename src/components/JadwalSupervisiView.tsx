import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Printer, 
  Plus, 
  Search, 
  Filter, 
  GraduationCap, 
  Briefcase, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  ArrowRight,
  List,
  LayoutGrid,
  MapPin,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { 
  JadwalSupervisi, 
  MasterGuru, 
  MasterTendik, 
  MadrasahProfile 
} from '../types';
import { ActivePage } from './Sidebar';

interface JadwalSupervisiViewProps {
  jadwalList: JadwalSupervisi[];
  guruList: MasterGuru[];
  tendikList: MasterTendik[];
  profile: MadrasahProfile;
  onSaveJadwal: (item: JadwalSupervisi) => Promise<void>;
  onDeleteJadwal: (id: string) => Promise<void>;
  onOpenPrintJadwal: () => void;
  onStartSupervisiFromJadwal: (item: JadwalSupervisi) => void;
}

export const JadwalSupervisiView: React.FC<JadwalSupervisiViewProps> = ({
  jadwalList,
  guruList,
  tendikList,
  profile,
  onSaveJadwal,
  onDeleteJadwal,
  onOpenPrintJadwal,
  onStartSupervisiFromJadwal
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [filterRole, setFilterRole] = useState<'all' | 'guru' | 'tendik'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Terjadwal' | 'Selesai' | 'Ditunda'>('all');
  const [search, setSearch] = useState<string>('');

  // Modal Create/Edit Jadwal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [tipe, setTipe] = useState<'guru' | 'tendik'>('guru');
  const [personilId, setPersonilId] = useState<string>(guruList[0]?.id || '');
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [hari, setHari] = useState<string>('Senin');
  const [jamMulai, setJamMulai] = useState<string>('07:30');
  const [jamSelesai, setJamSelesai] = useState<string>('09:00');
  const [kelasRuang, setKelasRuang] = useState<string>('Kelas X MA Unggulan 1');
  const [fokusSupervisi, setFokusSupervisi] = useState<string>('Pemeriksaan Modul Ajar KBC, Asesmen Autentik, & Ruang Aman Berpendapat');
  const [status, setStatus] = useState<JadwalSupervisi['status']>('Terjadwal');
  const [keterangan, setKeterangan] = useState<string>('');

  const total = jadwalList.length;
  const guruCount = jadwalList.filter(j => j.tipe === 'guru').length;
  const tendikCount = jadwalList.filter(j => j.tipe === 'tendik').length;
  const selesaiCount = jadwalList.filter(j => j.status === 'Selesai').length;

  const handleOpenAdd = () => {
    setEditingId(null);
    setTipe('guru');
    setPersonilId(guruList[0]?.id || '');
    setTanggal(new Date().toISOString().split('T')[0]);
    setHari('Senin');
    setJamMulai('07:30');
    setJamSelesai('09:00');
    setKelasRuang('Kelas XI MA Unggulan A');
    setFokusSupervisi('Pemeriksaan Modul Ajar KBC, Asesmen Awal, & Dialog Kritis Siswa');
    setStatus('Terjadwal');
    setKeterangan('Mempersiapkan modul ajar dan rubrik asesmen.');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: JadwalSupervisi) => {
    setEditingId(item.id);
    setTipe(item.tipe);
    setPersonilId(item.personil_id);
    setTanggal(item.tanggal);
    setHari(item.hari || 'Senin');
    setJamMulai(item.jam_mulai);
    setJamSelesai(item.jam_selesai);
    setKelasRuang(item.kelas_ruang);
    setFokusSupervisi(item.fokus_supervisi);
    setStatus(item.status);
    setKeterangan(item.keterangan || '');
    setIsModalOpen(true);
  };

  const handlePersonilChange = (id: string) => {
    setPersonilId(id);
    if (tipe === 'guru') {
      const g = guruList.find(x => x.id === id);
      if (g) {
        setKelasRuang(`Ruang Kelas (${g.mapel})`);
        setFokusSupervisi(`Pemeriksaan Perangkat Pembelajaran ${g.mapel} & Dialog Kritis Siswa KBC`);
      }
    } else {
      const t = tendikList.find(x => x.id === id);
      if (t) {
        setKelasRuang(`Ruang Layanan ${t.bidang_tugas}`);
        setFokusSupervisi(`Pemeriksaan Administrasi & Kualitas Pelayanan Ramah ${t.bidang_tugas}`);
      }
    }
  };

  const handleTipeChange = (newTipe: 'guru' | 'tendik') => {
    setTipe(newTipe);
    if (newTipe === 'guru') {
      const firstG = guruList[0];
      setPersonilId(firstG?.id || '');
      setKelasRuang('Kelas X MA Unggulan 1');
      setFokusSupervisi('Pemeriksaan Modul Ajar KBC & Asesmen Autentik');
    } else {
      const firstT = tendikList[0];
      setPersonilId(firstT?.id || '');
      setKelasRuang('Ruang Tata Usaha');
      setFokusSupervisi('Pemeriksaan Ketertiban Administrasi & Pelayanan Ramah Madrasah');
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    let nama = '';
    let nip = '';
    let tugas = '';

    if (tipe === 'guru') {
      const g = guruList.find(x => x.id === personilId);
      nama = g?.nama || 'Guru Madrasah';
      nip = g?.nip || '';
      tugas = g?.mapel || 'Mata Pelajaran';
    } else {
      const t = tendikList.find(x => x.id === personilId);
      nama = t?.nama || 'Staf Madrasah';
      nip = t?.nip || '';
      tugas = t?.bidang_tugas || 'Administrasi';
    }

    const itemToSave: JadwalSupervisi = {
      id: editingId || `JDW-${Date.now()}`,
      tipe,
      personil_id: personilId,
      nama,
      nip,
      tugas,
      tanggal,
      hari,
      jam_mulai: jamMulai,
      jam_selesai: jamSelesai,
      kelas_ruang: kelasRuang.trim(),
      fokus_supervisi: fokusSupervisi.trim(),
      supervisor_nama: profile.kepalaMadrasah,
      supervisor_nip: profile.nipKepala,
      status,
      keterangan: keterangan.trim(),
      created_at: new Date().toISOString()
    };

    await onSaveJadwal(itemToSave);
    setIsModalOpen(false);
  };

  const filteredList = jadwalList.filter(item => {
    const matchRole = filterRole === 'all' || item.tipe === filterRole;
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch = item.nama.toLowerCase().includes(q) ||
                        item.tugas.toLowerCase().includes(q) ||
                        (item.nip && item.nip.includes(q)) ||
                        item.fokus_supervisi.toLowerCase().includes(q) ||
                        item.kelas_ruang.toLowerCase().includes(q);
    return matchRole && matchStatus && matchSearch;
  }).sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Jadwal Pelaksanaan Supervisi Guru & Tendik
              </h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {profile.tahun}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Lokasi: {profile.alamat}
            </p>
          </div>
        </div>

        {/* Action Buttons: Cetak & Tambah */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenPrintJadwal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Cetak Jadwal Resmi (A4)</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Jadwal Baru</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase text-slate-500">Total Sesi</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{total}</div>
          <span className="text-[10px] text-slate-400">Jadwal semester ini</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase text-emerald-700">Supervisi Guru</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">{guruCount}</div>
          <span className="text-[10px] text-slate-400">Tenaga Pendidik</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase text-teal-700">Supervisi Tendik</span>
          <div className="text-2xl font-black text-teal-800 mt-1">{tendikCount}</div>
          <span className="text-[10px] text-slate-400">Staf Kependidikan</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase text-blue-700">Telah Terlaksana</span>
          <div className="text-2xl font-black text-blue-800 mt-1">{selesaiCount}</div>
          <span className="text-[10px] text-slate-400">({Math.round((selesaiCount / (total || 1)) * 100)}% selesai)</span>
        </div>
      </div>

      {/* Filter and View Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
        {/* Role Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilterRole('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterRole === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Semua ({total})
          </button>
          <button
            onClick={() => setFilterRole('guru')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${
              filterRole === 'guru' ? 'bg-white text-emerald-900 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Guru ({guruCount})</span>
          </button>
          <button
            onClick={() => setFilterRole('tendik')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${
              filterRole === 'tendik' ? 'bg-white text-teal-900 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-teal-600" />
            <span>Tendik ({tendikCount})</span>
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
          >
            <option value="all">Semua Status</option>
            <option value="Terjadwal">Terjadwal</option>
            <option value="Selesai">Selesai</option>
            <option value="Ditunda">Ditunda</option>
          </select>

          {/* Search */}
          <div className="relative min-w-[200px]">
            <input
              type="text"
              placeholder="Cari guru, tendik, mapel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-3 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Toggle View */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              title="Tampilan Tabel"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md ${viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              title="Tampilan Kartu"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Schedule Content */}
      {viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-3">No</th>
                  <th className="py-3 px-3">Hari, Tanggal & Waktu</th>
                  <th className="py-3 px-3">Guru / Tendik</th>
                  <th className="py-3 px-3">Mata Pelajaran / Tugas</th>
                  <th className="py-3 px-3">Ruang / Kelas</th>
                  <th className="py-3 px-3">Fokus Supervisi (KBC)</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-3 font-mono text-slate-400 text-[11px]">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="font-bold text-slate-900 text-xs">
                        {item.hari}, {item.tanggal}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{item.jam_mulai} - {item.jam_selesai} WIB</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        {item.nama}
                      </div>
                      <div className="text-[10.5px] text-slate-500 font-mono">
                        NIP: {item.nip || '-'}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        item.tipe === 'guru' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-teal-50 text-teal-800 border border-teal-200'
                      }`}>
                        {item.tipe === 'guru' ? <GraduationCap className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                        {item.tugas}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-700 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{item.kelas_ruang}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 max-w-xs text-slate-600">
                      <p className="line-clamp-2 leading-relaxed">{item.fokus_supervisi}</p>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status === 'Selesai' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onStartSupervisiFromJadwal(item)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition shadow-2xs ${
                            item.status === 'Selesai'
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                          title="Lakukan Evaluasi Supervisi"
                        >
                          <span>{item.status === 'Selesai' ? 'Buka Form' : 'Mulai Nilai'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                          title="Ubah Jadwal"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus jadwal untuk ${item.nama}?`)) {
                              onDeleteJadwal(item.id);
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
                {filteredList.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-400 text-xs italic">
                      Tidak ada jadwal supervisi yang sesuai kriteria pencarian
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                    item.tipe === 'guru' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-teal-50 text-teal-800 border border-teal-200'
                  }`}>
                    {item.tipe === 'guru' ? <GraduationCap className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                    {item.tugas}
                  </span>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-2.5">
                  {item.nama}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  NIP: {item.nip || '-'}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.hari}, {item.tanggal}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.jam_mulai} - {item.jam_selesai} WIB</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.kelas_ruang}</span>
                  </div>
                </div>

                <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fokus Supervisi:</span>
                  <p className="text-xs text-slate-700 font-medium line-clamp-2 mt-0.5">
                    {item.fokus_supervisi}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus jadwal untuk ${item.nama}?`)) {
                        onDeleteJadwal(item.id);
                      }
                    }}
                    className="p-1.5 text-rose-400 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onStartSupervisiFromJadwal(item)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                    item.status === 'Selesai'
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  <span>{item.status === 'Selesai' ? 'Buka Form' : 'Mulai Nilai'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit Jadwal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {editingId ? 'Ubah Jadwal Supervisi' : 'Buat Jadwal Supervisi Baru'}
                </h3>
                <p className="text-xs text-slate-500">
                  MA Mambaul Ulum • Desa Sumberduren, Kec. Krucil, Kab. Probolinggo
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Tipe: Guru vs Tendik */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTipeChange('guru')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    tipe === 'guru' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-slate-50 text-slate-600 border-slate-300'
                  }`}
                >
                  Supervisi Guru (Akademik KBC)
                </button>
                <button
                  type="button"
                  onClick={() => handleTipeChange('tendik')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    tipe === 'tendik' ? 'bg-teal-600 text-white border-teal-600 shadow-xs' : 'bg-slate-50 text-slate-600 border-slate-300'
                  }`}
                >
                  Supervisi Tendik (Manajerial)
                </button>
              </div>

              {/* Personil Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama {tipe === 'guru' ? 'Guru' : 'Tenaga Kependidikan'} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={personilId}
                  onChange={(e) => handlePersonilChange(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  required
                >
                  {tipe === 'guru' ? (
                    guruList.map(g => (
                      <option key={g.id} value={g.id}>{g.nama} — {g.mapel}</option>
                    ))
                  ) : (
                    tendikList.map(t => (
                      <option key={t.id} value={t.id}>{t.nama} — {t.bidang_tugas}</option>
                    ))
                  )}
                </select>
              </div>

              {/* Tanggal, Hari, Waktu */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hari
                  </label>
                  <select
                    value={hari}
                    onChange={(e) => setHari(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                    <option value="Minggu">Minggu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Waktu (WIB)
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={jamMulai}
                      onChange={(e) => setJamMulai(e.target.value)}
                      placeholder="07:30"
                      className="w-1/2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-center"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      type="text"
                      value={jamSelesai}
                      onChange={(e) => setJamSelesai(e.target.value)}
                      placeholder="09:00"
                      className="w-1/2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Kelas / Ruang */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ruang Kelas / Lokasi Supervisi
                </label>
                <input
                  type="text"
                  value={kelasRuang}
                  onChange={(e) => setKelasRuang(e.target.value)}
                  placeholder="Contoh: Kelas XI MA Unggulan 1 / Ruang TU"
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              {/* Fokus Supervisi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Fokus & Indikator Supervisi <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={fokusSupervisi}
                  onChange={(e) => setFokusSupervisi(e.target.value)}
                  rows={2}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  required
                />
              </div>

              {/* Status & Keterangan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status Pelaksanaan
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-semibold"
                  >
                    <option value="Terjadwal">Terjadwal</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Ditunda">Ditunda</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Keterangan Tambahan
                  </label>
                  <input
                    type="text"
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    placeholder="Contoh: Menyiapkan instrumen dan modul ajar cetak"
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
