import React from 'react';
import { 
  LayoutDashboard, 
  Calendar,
  GraduationCap, 
  Briefcase, 
  CheckSquare, 
  Printer, 
  Database, 
  FileSpreadsheet, 
  HeartHandshake, 
  BookOpen, 
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { MadrasahProfile, GoogleSheetsConfig } from '../types';

export type ActivePage = 
  | 'dashboard' 
  | 'jadwal_supervisi'
  | 'supervisi_guru' 
  | 'supervisi_tendik' 
  | 'tindak_lanjut' 
  | 'rekap_laporan' 
  | 'master_data' 
  | 'integrasi_sheet';

interface SidebarProps {
  activePage: ActivePage;
  onSelectPage: (page: ActivePage) => void;
  profile: MadrasahProfile;
  sheetsConfig: GoogleSheetsConfig;
  pendingFollowUps: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  profile,
  sheetsConfig,
  pendingFollowUps
}) => {
  const menuItems: { id: ActivePage; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'Beranda & Statistik',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'jadwal_supervisi',
      label: 'Jadwal Supervisi',
      icon: <Calendar className="w-4 h-4" />
    },
    {
      id: 'supervisi_guru',
      label: 'Supervisi Guru (KBC)',
      icon: <GraduationCap className="w-4 h-4" />
    },
    {
      id: 'supervisi_tendik',
      label: 'Supervisi Tendik',
      icon: <Briefcase className="w-4 h-4" />
    },
    {
      id: 'tindak_lanjut',
      label: 'Tindak Lanjut & Kanban',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: pendingFollowUps > 0 ? pendingFollowUps : undefined,
      badgeColor: 'bg-amber-500 text-white'
    },
    {
      id: 'rekap_laporan',
      label: 'Rekap & Cetak Laporan',
      icon: <Printer className="w-4 h-4" />
    },
    {
      id: 'master_data',
      label: 'Master Guru & Tendik',
      icon: <Database className="w-4 h-4" />
    },
    {
      id: 'integrasi_sheet',
      label: 'Database Spreadsheet',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      badge: sheetsConfig.connected ? 'Terkoneksi' : 'Lokal',
      badgeColor: sheetsConfig.connected ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-emerald-300'
    }
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-emerald-950 via-slate-900 to-emerald-950 text-slate-100 flex flex-col border-r border-emerald-900/60 shadow-xl flex-shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-emerald-900/60 bg-emerald-950/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400/30 flex-shrink-0">
            <HeartHandshake className="w-5 h-5 text-emerald-100" />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold tracking-tight text-white truncate">
              SIM-SUPERVISI
            </h1>
            <p className="text-[11px] text-emerald-300 truncate font-medium">
              MA Mambaul Ulum
            </p>
          </div>
        </div>

        {/* Motto Pill */}
        <div className="mt-3 px-2.5 py-1 rounded-lg bg-emerald-900/40 border border-emerald-700/40 text-[10px] text-emerald-200 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
          <span className="truncate">Kurikulum Berbasis Cinta (KBC)</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-emerald-400/80">
          Menu Navigasi
        </div>
        {menuItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-900/40 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-emerald-900/30'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`${isActive ? 'text-white' : 'text-emerald-400 group-hover:text-emerald-300'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined ? (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-emerald-800 text-emerald-200'}`}>
                  {item.badge}
                </span>
              ) : (
                isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Madrasah Info Footer */}
      <div className="p-3.5 m-3 rounded-xl bg-emerald-900/30 border border-emerald-800/40 text-[11px] text-emerald-200 space-y-1">
        <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          <span>Kepala Madrasah</span>
        </div>
        <div className="font-bold text-white text-xs truncate">
          {profile.kepalaMadrasah}
        </div>
        <div className="text-[10px] text-slate-400">
          Tahun {profile.tahun} • Semester Ganjil
        </div>
      </div>
    </aside>
  );
};
