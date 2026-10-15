import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { SupervisiGuru, SupervisiTendik, MadrasahProfile } from '../types';
import { GURU_SECTIONS, TENDIK_CHECKLIST_MAPPING } from '../data/mockData';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: SupervisiGuru | SupervisiTendik | null;
  type: 'guru' | 'tendik';
  profile: MadrasahProfile;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  item,
  type,
  profile
}) => {
  if (!isOpen || !item) return null;

  const isGuru = type === 'guru';
  const guruItem = isGuru ? (item as SupervisiGuru) : null;
  const tendikItem = !isGuru ? (item as SupervisiTendik) : null;

  const handlePrint = () => {
    window.print();
  };

  const formatIndoDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all my-4 print:my-0 print:border-none print:shadow-none print:max-w-none">
        
        {/* Top Control Bar (Hidden in Print) */}
        <div className="bg-emerald-950 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">
              Pratinjau Dokumen Cetak Laporan Supervisi Madrasah (Format A4 / PDF)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-extrabold transition shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang (A4 / PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area (Digitized Word Document format) */}
        <div className="p-8 sm:p-12 print:p-8 bg-white text-slate-900 print:text-black font-serif text-xs leading-relaxed max-h-[85vh] overflow-y-auto print:max-h-none print:overflow-visible">
          
          {/* KOP SURAT RESMI KEMENTERIAN AGAMA & MADRASAH */}
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
              NSM: {profile.nsm} • NPSN: {profile.npsn} • Pos-el: {profile.email} • Akreditasi: A (Unggul)
            </p>
          </div>

          {/* DOKUMEN JUDUL */}
          <div className="text-center my-6">
            <h3 className="text-sm font-bold uppercase tracking-wide underline underline-offset-4 decoration-1">
              {isGuru 
                ? 'LEMBAR LAPORAN HASIL SUPERVISI PEMBELAJARAN MENDALAM BERBASIS CINTA (KBC)'
                : 'LEMBAR LAPORAN HASIL SUPERVISI KINERJA PELAYANAN TENAGA KEPENDIDIKAN'}
            </h3>
            <p className="text-[11px] text-slate-600 font-sans mt-1">
              Tahun Ajaran {profile.tahun} — Semester {profile.semester}
            </p>
          </div>

          {/* IDENTITAS YANG DISUPERVISI */}
          <div className="mb-5 bg-slate-50 print:bg-transparent p-3.5 rounded-lg border border-slate-300 font-sans text-xs">
            <table className="w-full text-left">
              <tbody>
                <tr>
                  <td className="w-44 py-1 text-slate-600 font-medium">Nama Personil</td>
                  <td className="w-4 py-1">:</td>
                  <td className="py-1 font-bold text-slate-950">{isGuru ? guruItem?.nama_guru : tendikItem?.nama_tendik}</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-600 font-medium">Tugas / Mata Pelajaran</td>
                  <td className="py-1">:</td>
                  <td className="py-1 font-semibold">{isGuru ? `Guru ${guruItem?.mapel}` : `Staf ${tendikItem?.bidang_tugas}`}</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-600 font-medium">Hari / Tanggal Supervisi</td>
                  <td className="py-1">:</td>
                  <td className="py-1">{formatIndoDate(item.tanggal)}</td>
                </tr>
                {isGuru && (
                  <tr>
                    <td className="py-1 text-slate-600 font-medium">Ruang Kelas / Sasaran</td>
                    <td className="py-1">:</td>
                    <td className="py-1">{guruItem?.kelas || 'Kelas Reguler'}</td>
                  </tr>
                )}
                <tr>
                  <td className="py-1 text-slate-600 font-medium">Supervisor / Penilai</td>
                  <td className="py-1">:</td>
                  <td className="py-1 font-bold">{profile.kepalaMadrasah} (Kepala Madrasah)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TABEL HASIL PENILAIAN */}
          <div className="mb-5">
            <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
              A. Rincian Indikator Penilaian
            </h4>

            {isGuru && guruItem ? (
              <table className="w-full text-left border-collapse border border-slate-300 font-sans text-[11px]">
                <thead>
                  <tr className="bg-slate-100 print:bg-slate-200 text-slate-800 font-bold">
                    <th className="border border-slate-300 py-1.5 px-2 w-8 text-center">No</th>
                    <th className="border border-slate-300 py-1.5 px-2">Pilar Evaluasi Kurikulum Berbasis Cinta (KBC)</th>
                    <th className="border border-slate-300 py-1.5 px-2 w-24 text-center">Skor (1-4)</th>
                    <th className="border border-slate-300 py-1.5 px-2 w-32 text-center">Kategori</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 py-1.5 px-2 text-center">1</td>
                    <td className="border border-slate-300 py-1.5 px-2">
                      <div className="font-bold">Tujuan Pembelajaran (Esensi & Makna)</div>
                      <div className="text-[10px] text-slate-500">Berpusat pada potensi unik siswa, keterukuran, dan relevansi nyata.</div>
                    </td>
                    <td className="border border-slate-300 py-1.5 px-2 text-center font-bold font-mono">{guruItem.skor_tujuan}</td>
                    <td className="border border-slate-300 py-1.5 px-2 text-center">{guruItem.skor_tujuan === 4 ? 'Sangat Baik' : 'Baik'}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 py-1.5 px-2 text-center">2</td>
                    <td className="border border-slate-300 py-1.5 px-2">
                      <div className="font-bold">Indikator Pencapaian (Nalar Kritis)</div>
                      <div className="text-[10px] text-slate-500">Mengukur penalaran mendalam, bukan sekadar hafalan tekstual.</div>
                    </td>
                    <td className="border border-slate-300 py-1.5 px-2 text-center font-bold font-mono">{guruItem.skor_indikator}</td>
                    <td className="border border-slate-300 py-1.5 px-2 text-center">{guruItem.skor_indikator === 4 ? 'Sangat Baik' : 'Baik'}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 py-1.5 px-2 text-center">3</td>
                    <td className="border border-slate-300 py-1.5 px-2">
                      <div className="font-bold">Materi & Sumber Belajar (Menggugah Empati)</div>
                      <div className="text-[10px] text-slate-500">Konteks kehidupan nyata dan pemanfaatan media digital secara beradab.</div>
                    </td>
                    <td className="border border-slate-300 py-1.5 px-2 text-center font-bold font-mono">{guruItem.skor_materi}</td>
                    <td className="border border-slate-300 py-1.5 px-2 text-center">{guruItem.skor_materi === 4 ? 'Sangat Baik' : 'Baik'}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 py-1.5 px-2 text-center">4</td>
                    <td className="border border-slate-300 py-1.5 px-2">
                      <div className="font-bold">Aktivitas Pembelajaran (Ruang Aman Berpendapat)</div>
                      <div className="text-[10px] text-slate-500">Menyapa hati, dialogis, apresiatif, asesmen memberdayakan, dan refleksi mendalam.</div>
                    </td>
                    <td className="border border-slate-300 py-1.5 px-2 text-center font-bold font-mono">{guruItem.skor_aktivitas}</td>
                    <td className="border border-slate-300 py-1.5 px-2 text-center">{guruItem.skor_aktivitas === 4 ? 'Sangat Baik' : 'Baik'}</td>
                  </tr>
                </tbody>
              </table>
            ) : tendikItem ? (
              <table className="w-full text-left border-collapse border border-slate-300 font-sans text-[11px]">
                <thead>
                  <tr className="bg-slate-100 print:bg-slate-200 text-slate-800 font-bold">
                    <th className="border border-slate-300 py-1.5 px-2 w-8 text-center">No</th>
                    <th className="border border-slate-300 py-1.5 px-2">Indikator Kinerja Pelayanan Tendik ({tendikItem.bidang_tugas})</th>
                    <th className="border border-slate-300 py-1.5 px-2 w-24 text-center">Skor (1-4)</th>
                  </tr>
                </thead>
                <tbody>
                  {(TENDIK_CHECKLIST_MAPPING[tendikItem.bidang_tugas]?.items || []).map((desc, idx) => (
                    <tr key={idx}>
                      <td className="border border-slate-300 py-1.5 px-2 text-center font-mono">{idx + 1}</td>
                      <td className="border border-slate-300 py-1.5 px-2">{desc}</td>
                      <td className="border border-slate-300 py-1.5 px-2 text-center font-bold font-mono">
                        {tendikItem.skor_1_sd_8[idx] || 4}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>

          {/* REKAPITULASI SKOR */}
          <div className="mb-5 font-sans">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
              B. Rekapitulasi Skor & Kategori
            </h4>
            <div className="grid grid-cols-2 gap-4 border border-slate-300 p-3 rounded-lg bg-slate-50 print:bg-transparent text-center">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Skor Perolehan:</span>
                <span className="text-xl font-black text-emerald-900 font-mono">
                  {item.total_skor} / 100
                </span>
              </div>
              <div className="border-l border-slate-300">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Kategori Hasil Supervisi:</span>
                <span className="text-base font-extrabold text-emerald-800 uppercase">
                  {item.kategori}
                </span>
              </div>
            </div>
          </div>

          {/* CATATAN & RENCANA TINDAK LANJUT */}
          <div className="mb-6 font-sans space-y-3 text-xs">
            <div className="border border-slate-300 p-3 rounded-lg">
              <span className="font-bold text-slate-900 block text-[11px] mb-1">
                C. Catatan Temuan Evaluasi (Deep Learning & KBC):
              </span>
              <p className="text-slate-700 leading-relaxed italic">
                "{item.catatan_total}"
              </p>
            </div>

            <div className="border border-slate-300 p-3 rounded-lg">
              <span className="font-bold text-slate-900 block text-[11px] mb-1">
                D. Kesepakatan Rencana Tindak Lanjut Kepala Madrasah:
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">
                {item.rencana_tindak_lanjut}
              </p>
            </div>
          </div>

          {/* PENGESAHAN DUA TANDA TANGAN RESMI */}
          <div className="pt-4 font-sans text-xs">
            <div className="text-right text-slate-700 mb-4">
              Sumberduren, {formatIndoDate(item.tanggal)}
            </div>
            <div className="grid grid-cols-2 gap-8 text-center">
              <div>
                <p className="text-slate-600 font-medium">Yang Disupervisi,</p>
                <div className="h-16 flex items-center justify-center">
                  <span className="text-slate-400 italic text-xs">
                    [ Tanda Tangan Digital Sah ]
                  </span>
                </div>
                <p className="font-bold text-slate-950 underline underline-offset-2">
                  {isGuru ? guruItem?.nama_guru : tendikItem?.nama_tendik}
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {isGuru ? `Guru ${guruItem?.mapel}` : `Tendik ${tendikItem?.bidang_tugas}`}
                </p>
              </div>

              <div>
                <p className="text-slate-600 font-medium">Kepala Madrasah / Supervisor,</p>
                <div className="h-16 flex items-center justify-center">
                  <span className="text-slate-400 italic text-xs">
                    [ Disahkan oleh Kepala Madrasah ]
                  </span>
                </div>
                <p className="font-bold text-slate-950 underline underline-offset-2">
                  {profile.kepalaMadrasah}
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  NIP. {profile.nipKepala}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
