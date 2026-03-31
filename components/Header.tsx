import React from 'react';

interface HeaderProps {
  setShowRiwayatModal: (v: boolean) => void;
  setShowMoModal: (v: boolean) => void;
  setShowSettingsModal: (v: boolean) => void;
  setShowSopModal: (v: boolean) => void;
}

export default function Header({ setShowRiwayatModal, setShowMoModal, setShowSettingsModal, setShowSopModal }: HeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-5 border-b border-slate-100">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-indigo-900 mb-1">
          Budi Gadai <span className="text-indigo-500 font-light">| Penaksir</span>
        </h1>
        <p className="text-sm md:text-base text-slate-500 font-medium">Sistem Estimasi Harga Gadai Otomatis</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-5 md:mt-0">
        <button onClick={() => setShowRiwayatModal(true)} className="bg-indigo-100 text-indigo-700 border border-indigo-200 px-4 py-2.5 rounded-xl hover:bg-indigo-200 hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 font-bold w-full md:w-auto order-last md:order-first">
          <span className="text-lg">🕒</span> Riwayat
        </button>
        <button onClick={() => setShowMoModal(true)} className="bg-[#25D366] text-white px-4 py-2.5 rounded-xl font-bold hover:bg-[#128C7E] hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-2 w-full md:w-auto justify-center">
          <span>💬</span> Tanya MO
        </button>
        <button onClick={() => setShowSettingsModal(true)} className="bg-slate-100 text-slate-600 border border-slate-200 p-2.5 rounded-xl hover:bg-slate-200 hover:scale-105 active:scale-95 transition-all shadow-sm flex-1 md:flex-none flex justify-center" title="Pengaturan Profil WA">
          ⚙️
        </button>
        <button onClick={() => setShowSopModal(true)} className="bg-amber-50 text-amber-700 border border-amber-200 px-4 py-2.5 rounded-xl font-bold hover:bg-amber-100 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm flex-1 md:flex-none">
          <span className="text-lg">📖</span> SOP
        </button>
      </div>
    </div>
  );
}