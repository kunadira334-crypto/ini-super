import React from 'react';
import { 
  Users, 
  Briefcase, 
  Award, 
  Clock, 
  Sparkles, 
  HeartHandshake, 
  BookOpen, 
  GraduationCap, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar
} from 'lucide-react';
import { 
  MasterGuru, 
  MasterTendik, 
  SupervisiGuru, 
  SupervisiTendik, 
  TindakLanjut,
  MadrasahProfile 
} from '../types';
import { ActivePage } from './Sidebar';

interface DashboardViewProps {
  profile: MadrasahProfile;
  guruList: MasterGuru[];
  tendikList: MasterTendik[];
  supervisiGuruList: SupervisiGuru[];
  supervisiTendikList: SupervisiTendik[];
  tindakLanjutList: TindakLanjut[];
  onNavigate: (page: ActivePage) => void;
  onOpenReportModal: (item: SupervisiGuru | SupervisiTendik, type: 'guru' | 'tendik') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  guruList,
  tendikList,
  supervisiGuruList,
  supervisiTendikList,
  tindakLanjutList,
  onNavigate,
  onOpenReportModal
}) => {
  const totalGuru = guruList.length;
  const totalTendik = tendikList.length;

  // Calculate average supervision score (from all guru and tendik evaluations)
  const allScores = [
    ...supervisiGuruList.map(g => g.total_skor),
    ...supervisiTendikList.map(t => t.total_skor)
  ];
  const avgScore = allScores.length > 0 
    ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1)
    : '0';

  const pendingFollowUps = tindakLanjutList.filter(t => t.status === 'Pending').length;
  const inProgressFollowUps = tindakLanjutList.filter(t => t.status === 'In Progress').length;
  const completedFollowUps = tindakLanjutList.filter(t => t.status === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner with KBC & Deep Learning ethos */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-lg border border-emerald-800/60">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
            <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
            <span>Kurikulum Berbasis Cinta (KBC) & Pembelajaran Mendalam</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Selamat Datang di Sistem Supervisi {profile.nama}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Mendigitalkan laporan supervisi manual menjadi ekosistem digital yang memanusiakan guru dan tendik. 
            Menitikberatkan pada <strong>empati, ruang aman emosional, nalar kritis, dan pemahaman konsep yang bermakna</strong> bagi santri dan civitas madrasah.
          </p>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-300 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{profile.alamat}</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('jadwal_supervisi')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs shadow-md transition transform active:scale-95 hover:bg-emerald-50"
            >
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>Jadwal Supervisi & Cetak</span>
            </button>

            <button
              onClick={() => onNavigate('supervisi_guru')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs shadow-md transition transform active:scale-95"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Supervisi Guru</span>
            </button>

            <button
              onClick={() => onNavigate('supervisi_tendik')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition"
            >
              <Briefcase className="w-4 h-4 text-emerald-300" />
              <span>Supervisi Tendik</span>
            </button>

            <button
              onClick={() => onNavigate('tindak_lanjut')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-bold text-xs transition"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Pantau Tindak Lanjut ({pendingFollowUps + inProgressFollowUps})</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative background Islamic geometric ring */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
      </div>

      {/* 4 Key KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Guru */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Master Guru</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalGuru}</span>
            <span className="text-xs text-slate-500 font-medium">Tenaga Pendidik</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-emerald-700 font-semibold pt-2 border-t border-slate-100">
            <span>{supervisiGuruList.length} telah disupervisi</span>
            <button onClick={() => onNavigate('master_data')} className="hover:underline flex items-center gap-0.5">
              <span>Kelola</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 2: Total Tendik */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-teal-300 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Master Tendik</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalTendik}</span>
            <span className="text-xs text-slate-500 font-medium">Staf Kependidikan</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-teal-700 font-semibold pt-2 border-t border-slate-100">
            <span>{supervisiTendikList.length} telah disupervisi</span>
            <button onClick={() => onNavigate('supervisi_tendik')} className="hover:underline flex items-center gap-0.5">
              <span>Cek</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Rata-Rata Nilai Kesiapan */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Rata-Rata Skor</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{avgScore}</span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[11px]">
              {Number(avgScore) >= 90 ? 'Sangat Baik' : Number(avgScore) >= 75 ? 'Baik' : 'Cukup'}
            </span>
            <span className="text-slate-500 text-[11px]">Kualitas KBC</span>
          </div>
        </div>

        {/* Card 4: Pending Follow-ups */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-amber-300 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tindak Lanjut</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">{pendingFollowUps}</span>
            <span className="text-xs text-slate-500 font-medium">Pending ({inProgressFollowUps} Proses)</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-amber-700 font-semibold pt-2 border-t border-slate-100">
            <span>{completedFollowUps} telah tuntas</span>
            <button onClick={() => onNavigate('tindak_lanjut')} className="hover:underline flex items-center gap-0.5">
              <span>Buka Kanban</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Recent Supervisions & Core KBC Philosophy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Riwayat Supervisi Terbaru */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Hasil Supervisi Pembelajaran & Layanan Terbaru
              </h3>
              <p className="text-xs text-slate-500">
                Pencatatan real-time otomatis tersimpan ke tab Supervisi_Guru & Supervisi_Tendik
              </p>
            </div>
            <button
              onClick={() => onNavigate('rekap_laporan')}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-bold hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {supervisiGuruList.slice(0, 3).map((item) => (
              <div key={item.id} className="py-3.5 flex items-start justify-between gap-3 hover:bg-slate-50/60 p-2 rounded-xl transition">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 flex-shrink-0 mt-0.5">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {item.nama_guru}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        {item.kategori} ({item.total_skor})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Mapel: <strong className="text-slate-700">{item.mapel}</strong> • Tgl: {item.tanggal} • Kelas: {item.kelas || 'Reguler'}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1 mt-1 italic">
                      "{item.catatan_total}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenReportModal(item, 'guru')}
                  className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-slate-200 transition flex-shrink-0"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Cetak</span>
                </button>
              </div>
            ))}

            {supervisiTendikList.slice(0, 2).map((item) => (
              <div key={item.id} className="py-3.5 flex items-start justify-between gap-3 hover:bg-slate-50/60 p-2 rounded-xl transition">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-teal-100 text-teal-800 flex-shrink-0 mt-0.5">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {item.nama_tendik}
                      </span>
                      <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                        {item.kategori} ({item.total_skor})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Tugas: <strong className="text-slate-700">{item.bidang_tugas}</strong> • Tgl: {item.tanggal}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1 mt-1 italic">
                      "{item.catatan_total}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenReportModal(item, 'tendik')}
                  className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-teal-700 bg-slate-100 hover:bg-teal-50 px-2.5 py-1.5 rounded-lg border border-slate-200 transition flex-shrink-0"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Cetak</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right (1 col): Kurikulum Berbasis Cinta & Pembelajaran Mendalam Spotlight */}
        <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-2xl p-5 border border-emerald-900/60 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>4 Pilar Pembelajaran Mendalam (KBC)</span>
            </div>

            <h4 className="text-base font-bold text-white leading-snug">
              Pedoman Supervisi Kepala Madrasah
            </h4>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="font-bold text-emerald-300 block">1. Menemukan Esensi & Hikmah</span>
                <span className="text-slate-300 text-[11px]">Bukan sekadar hafalan tekstual, melainkan menggugah nalar kritis dan pemaknaan konsep.</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="font-bold text-emerald-300 block">2. Ruang Aman Emosional</span>
                <span className="text-slate-300 text-[11px]">Menciptakan suasana kelas yang bebas rasa takut; santri dihargai martabat dan potensi uniknya.</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="font-bold text-emerald-300 block">3. Materi Menggugah Empati</span>
                <span className="text-slate-300 text-[11px]">Menghubungkan sains, bahasa, dan agama dengan rasa kasih sayang pada sesama dan alam semesta.</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="font-bold text-emerald-300 block">4. Asesmen Memberdayakan</span>
                <span className="text-slate-300 text-[11px]">Umpan balik yang membimbing pertumbuhan, bukan sekadar vonis angka.</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-emerald-800/40 text-[11px] text-emerald-300/80 flex items-center justify-between">
            <span>Kepala Madrasah: {profile.kepalaMadrasah}</span>
            <span className="font-mono">{profile.tahun}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
