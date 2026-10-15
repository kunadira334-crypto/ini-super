import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  User, 
  Award,
  Filter
} from 'lucide-react';
import { JadwalSupervisi, MadrasahProfile } from '../types';

interface PrintJadwalModalProps {
  isOpen: boolean;
  onClose: () => void;
  jadwalList: JadwalSupervisi[];
  profile: MadrasahProfile;
  filterType?: 'all' | 'guru' | 'tendik';
}

export const PrintJadwalModal: React.FC<PrintJadwalModalProps> = ({
  isOpen,
  onClose,
  jadwalList,
  profile,
  filterType = 'all'
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'guru' | 'tendik'>(filterType);
  const [printLayout, setPrintLayout] = useState<'tabel' | 'kartu'>('tabel');
  const [selectedPersonilId, setSelectedPersonilId] = useState<string>('all');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const filteredJadwal = jadwalList
    .filter(item => {
      if (activeFilter !== 'all' && item.tipe !== activeFilter) return false;
      if (printLayout === 'kartu' && selectedPersonilId !== 'all' && item.id !== selectedPersonilId) return false;
      return true;
    })
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

  const formatIndoDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const todayIndo = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const countAll = jadwalList.length;
  const countGuru = jadwalList.filter(j => j.tipe === 'guru').length;
  const countTendik = jadwalList.filter(j => j.tipe === 'tendik').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all my-4 print:my-0 print:border-none print:shadow-none print:max-w-none">
        
        {/* Top Control Bar (Hidden in Print) */}
        <div className="bg-emerald-950 text-white px-5 py-3.5 print:hidden space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Printer className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-bold text-sm">
                  Pratinjau Cetak Jadwal Supervisi Madrasah (Format A4)
                </h3>
                <p className="text-[11px] text-emerald-300">
                  {profile.nama} • {profile.alamat}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-extrabold transition shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF (A4)</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub Filters & Format Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-900/60">
            {/* Filter by Target */}
            <div className="flex items-center gap-1.5 bg-emerald-900/60 p-1 rounded-xl text-xs">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  activeFilter === 'all' 
                    ? 'bg-emerald-500 text-emerald-950 shadow-xs' 
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-800/40'
                }`}
              >
                Semua Jadwal ({countAll})
              </button>
              <button
                onClick={() => setActiveFilter('guru')}
                className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                  activeFilter === 'guru' 
                    ? 'bg-emerald-500 text-emerald-950 shadow-xs' 
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-800/40'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Guru ({countGuru})</span>
              </button>
              <button
                onClick={() => setActiveFilter('tendik')}
                className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                  activeFilter === 'tendik' 
                    ? 'bg-emerald-500 text-emerald-950 shadow-xs' 
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-800/40'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Tendik ({countTendik})</span>
              </button>
            </div>

            {/* Layout switch: Matriks vs Kartu Surat */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-300">Format Dokumen:</span>
              <div className="flex items-center gap-1 bg-emerald-900/60 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setPrintLayout('tabel')}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    printLayout === 'tabel' 
                      ? 'bg-white text-emerald-950 shadow-xs' 
                      : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  Tabel Matriks Lengkap
                </button>
                <button
                  onClick={() => setPrintLayout('kartu')}
                  className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                    printLayout === 'kartu' 
                      ? 'bg-white text-emerald-950 shadow-xs' 
                      : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  <span>Surat / Kartu Pemberitahuan</span>
                </button>
              </div>

              {printLayout === 'kartu' && (
                <select
                  value={selectedPersonilId}
                  onChange={(e) => setSelectedPersonilId(e.target.value)}
                  className="bg-emerald-900 border border-emerald-700 text-white text-xs rounded-xl px-2.5 py-1"
                >
                  <option value="all">Cetak Semua Guru & Tendik</option>
                  {jadwalList.map(j => (
                    <option key={j.id} value={j.id}>
                      {j.nama} ({j.tugas})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Printable Paper Area (A4 style) */}
        <div className="p-8 sm:p-12 print:p-6 bg-white text-slate-900 print:text-black font-serif text-xs leading-relaxed max-h-[85vh] overflow-y-auto print:max-h-none print:overflow-visible">
          
          {/* KOP SURAT RESMI KEMENTERIAN AGAMA */}
          <div className="text-center pb-3 border-b-4 border-double border-slate-900 relative">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              KEMENTERIAN AGAMA REPUBLIK INDONESIA
            </h4>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              KANTOR KEMENTERIAN AGAMA KABUPATEN PROBOLINGGO
            </h4>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 mt-1">
              {profile.nama}
            </h2>
            <p className="text-[11px] text-slate-700 font-sans mt-0.5 font-medium">
              Alamat: {profile.alamat}, {profile.provinsi}
            </p>
            <p className="text-[10px] text-slate-500 font-sans">
              NSM: {profile.nsm} • NPSN: {profile.npsn} • Pos-el: {profile.email} • Telp: {profile.telepon}
            </p>
          </div>

          {/* ============================================================== */}
          {/* LAYOUT 1: TABEL MATRIKS JADWAL RESMI */}
          {/* ============================================================== */}
          {printLayout === 'tabel' && (
            <>
              {/* JUDUL DOKUMEN */}
              <div className="text-center my-5">
                <h3 className="text-sm font-bold uppercase tracking-wide underline underline-offset-4 decoration-1">
                  JADWAL PELAKSANAAN SUPERVISI AKADEMIK GURU DAN MANAJERIAL TENDIK
                </h3>
                <p className="text-xs font-bold text-emerald-900 print:text-black font-sans mt-1">
                  KURIKULUM BERBASIS CINTA (KBC) & PEMBELAJARAN MENDALAM (DEEP LEARNING)
                </p>
                <p className="text-[11px] text-slate-600 font-sans">
                  Tahun Ajaran {profile.tahun} — Semester {profile.semester}
                </p>
              </div>

              {/* TABEL JADWAL LENGKAP */}
              <div className="mb-6 font-sans">
                <table className="w-full text-left border-collapse border border-slate-400 text-[10.5px]">
                  <thead>
                    <tr className="bg-slate-100 print:bg-slate-200 text-slate-900 font-bold text-center">
                      <th className="border border-slate-400 py-2 px-1.5 w-7">No</th>
                      <th className="border border-slate-400 py-2 px-2 w-28">Hari, Tanggal</th>
                      <th className="border border-slate-400 py-2 px-1.5 w-20">Waktu</th>
                      <th className="border border-slate-400 py-2 px-2.5">Nama Guru / Tendik & NIP</th>
                      <th className="border border-slate-400 py-2 px-2 w-28">Mata Pelajaran / Tugas</th>
                      <th className="border border-slate-400 py-2 px-2 w-28">Ruang / Sasaran</th>
                      <th className="border border-slate-400 py-2 px-2">Fokus Supervisi (KBC)</th>
                      <th className="border border-slate-400 py-2 px-2 w-24">Supervisor</th>
                      <th className="border border-slate-400 py-2 px-1.5 w-16">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJadwal.map((item, index) => (
                      <tr key={item.id} className="border-b border-slate-300">
                        <td className="border border-slate-400 py-2 px-1.5 text-center font-mono">
                          {index + 1}
                        </td>
                        <td className="border border-slate-400 py-2 px-2 whitespace-nowrap font-medium">
                          <div>{item.hari || 'Hari'},</div>
                          <div className="text-[10px] text-slate-600">{formatIndoDate(item.tanggal)}</div>
                        </td>
                        <td className="border border-slate-400 py-2 px-1.5 text-center font-mono whitespace-nowrap text-[10px]">
                          {item.jam_mulai} - {item.jam_selesai} WIB
                        </td>
                        <td className="border border-slate-400 py-2 px-2.5">
                          <div className="font-bold text-slate-950">{item.nama}</div>
                          <div className="text-[9.5px] text-slate-600 font-mono">NIP: {item.nip || '-'}</div>
                        </td>
                        <td className="border border-slate-400 py-2 px-2">
                          <span className="font-semibold text-slate-900">{item.tugas}</span>
                          <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                            {item.tipe === 'guru' ? 'Tenaga Pendidik' : 'Kependidikan'}
                          </div>
                        </td>
                        <td className="border border-slate-400 py-2 px-2 text-[10px]">
                          {item.kelas_ruang}
                        </td>
                        <td className="border border-slate-400 py-2 px-2 text-[10px] leading-relaxed">
                          {item.fokus_supervisi}
                        </td>
                        <td className="border border-slate-400 py-2 px-2 text-center text-[10px] font-medium">
                          {item.supervisor_nama}
                        </td>
                        <td className="border border-slate-400 py-2 px-1.5 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                            item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredJadwal.length === 0 && (
                      <tr>
                        <td colSpan={9} className="border border-slate-400 py-6 text-center text-slate-500 italic">
                          Tidak ada data jadwal supervisi yang sesuai kriteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* CATATAN PELAKSANAAN SUPERVISI */}
              <div className="mb-6 font-sans text-[11px] p-3.5 rounded-lg border border-slate-300 bg-slate-50 print:bg-transparent">
                <strong className="block text-slate-900 mb-1">Ketentuan Pelaksanaan Supervisi Madrasah:</strong>
                <ol className="list-decimal pl-4 space-y-0.5 text-slate-700 leading-normal">
                  <li>Bapak/Ibu Guru dimohon mempersiapkan dokumen persiapan pembelajaran (Modul Ajar/RPP KBC, ATP, Rubrik Asesmen Mendalam, & Media Belajar) paling lambat H-1 jadwal supervisi.</li>
                  <li>Tenaga Kependidikan (Tendik) dimohon menyiapkan buku register administrasi, rekap layanan, dan bukti fisik dokumen tugas pokok sesuai bidang masing-masing.</li>
                  <li>Supervisi mengedepankan asas <strong>Kurikulum Berbasis Cinta (KBC)</strong>: dialogis, saling memanusiakan, bebas rasa takut, apresiatif, dan reflektif.</li>
                  <li>Apabila berhalangan hadir karena tugas dinas khusus atau sakit, mohon konfirmasi ke Kepala Madrasah untuk penjadwalan ulang.</li>
                </ol>
              </div>

              {/* PENGESAHAN KEPALA MADRASAH */}
              <div className="pt-2 font-sans text-xs">
                <div className="w-72 ml-auto text-center">
                  <p className="text-slate-700">
                    Sumberduren, {todayIndo}
                  </p>
                  <p className="text-slate-800 font-semibold mt-0.5">
                    Kepala Madrasah Aliyah Mambaul Ulum,
                  </p>
                  <div className="h-16 flex items-center justify-center">
                    <span className="text-slate-400 italic text-[11px]">
                      [ Tanda Tangan & Cap Lembaga ]
                    </span>
                  </div>
                  <p className="font-bold text-slate-950 underline underline-offset-2 text-xs">
                    {profile.kepalaMadrasah}
                  </p>
                  <p className="text-[10px] text-slate-600 font-mono mt-0.5">
                    NIP. {profile.nipKepala}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ============================================================== */}
          {/* LAYOUT 2: KARTU / SURAT PEMBERITAHUAN INDIVIDU */}
          {/* ============================================================== */}
          {printLayout === 'kartu' && (
            <div className="space-y-8 my-4">
              {filteredJadwal.map((item, idx) => (
                <div 
                  key={item.id} 
                  className={`p-6 rounded-xl border border-slate-300 font-sans print:border-slate-800 ${
                    idx > 0 ? 'print:break-before-page' : ''
                  }`}
                >
                  <div className="flex justify-between items-start border-b pb-3 mb-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                        SURAT PEMBERITAHUAN JADWAL SUPERVISI MADRASAH
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1.5">
                        Supervisi {item.tipe === 'guru' ? 'Akademik & Persiapan Pembelajaran' : 'Manajerial & Tata Kelola Pelayanan'}
                      </h3>
                      <p className="text-xs text-slate-600">
                        Nomor: 421.3/MA-MU/SPV/{item.id.replace('JDW-', '')}/2026
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-slate-700">ID: {item.id}</span>
                      <div className="text-[10px] text-slate-500">Tahun {profile.tahun}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-800 mb-3">
                    Kepada Yth. Bapak/Ibu:
                  </p>
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 mb-4 text-xs space-y-1">
                    <div className="font-bold text-sm text-slate-900">{item.nama}</div>
                    <div className="text-slate-600">NIP: {item.nip || '-'}</div>
                    <div className="text-slate-700 font-medium">
                      Tugas/Mapel: <strong>{item.tugas}</strong> ({item.tipe === 'guru' ? 'Tenaga Pendidik' : 'Tenaga Kependidikan'})
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 mb-3 leading-relaxed">
                    Diberitahukan bahwa pelaksanaan supervisi persiapan pembelajaran / manajerial berbasis <strong>Kurikulum Berbasis Cinta (KBC)</strong> dan <strong>Pembelajaran Mendalam</strong> dijadwalkan pada:
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs mb-4 bg-emerald-50/50 p-3.5 rounded-lg border border-emerald-200/60">
                    <div>
                      <span className="text-slate-500 block text-[10.5px]">Hari / Tanggal:</span>
                      <strong className="text-slate-900">{item.hari}, {formatIndoDate(item.tanggal)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10.5px]">Waktu:</span>
                      <strong className="text-slate-900">{item.jam_mulai} - {item.jam_selesai} WIB</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10.5px]">Ruang / Lokasi:</span>
                      <strong className="text-slate-900">{item.kelas_ruang}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10.5px]">Supervisor:</span>
                      <strong className="text-slate-900">{item.supervisor_nama}</strong>
                    </div>
                  </div>

                  <div className="text-xs mb-4">
                    <span className="font-bold text-slate-800 block mb-1">Fokus Pelaksanaan & Instrumen:</span>
                    <p className="text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200">
                      {item.fokus_supervisi}
                    </p>
                  </div>

                  {item.keterangan && (
                    <div className="text-xs mb-4 text-slate-600 italic">
                      Catatan Tambahan: {item.keterangan}
                    </div>
                  )}

                  <div className="pt-4 flex justify-between items-end border-t border-slate-200 text-xs">
                    <div>
                      <p className="text-[11px] text-slate-500">Menerima Pemberitahuan,</p>
                      <div className="h-12 flex items-center">
                        <span className="text-slate-400 italic text-[10px]">( Paraf Pendidik / Tendik )</span>
                      </div>
                      <p className="font-bold text-slate-900">{item.nama}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-slate-700">Sumberduren, {todayIndo}</p>
                      <p className="font-semibold text-slate-900 mt-0.5">Kepala Madrasah,</p>
                      <div className="h-12 flex items-center justify-center">
                        <span className="text-slate-400 italic text-[10px]">[ Tanda Tangan & Cap ]</span>
                      </div>
                      <p className="font-bold text-slate-950 underline underline-offset-2">{profile.kepalaMadrasah}</p>
                      <p className="text-[10px] text-slate-600 font-mono">NIP. {profile.nipKepala}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
