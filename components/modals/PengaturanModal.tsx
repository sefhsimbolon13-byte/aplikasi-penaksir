import React from 'react';

interface PengaturanModalProps {
  profil: any;
  setProfil: (profil: any) => void;
  handleSaveProfil: () => void;
  setShowSettingsModal: (v: boolean) => void;
}

export default function PengaturanModal({ profil, setProfil, handleSaveProfil, setShowSettingsModal }: PengaturanModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[60] transition-opacity">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 relative border border-slate-100">
        <h2 className="text-2xl font-black text-slate-800 mb-6 border-b pb-4">⚙️ Pengaturan Profil WA</h2>
        <div className="space-y-4">
          <div><label className="block text-sm font-bold text-slate-700 mb-1">📍 Cabang</label><input type="text" value={profil.cabang} onChange={(e) => setProfil({...profil, cabang: e.target.value})} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" /></div>
          <div><label className="block text-sm font-bold text-slate-700 mb-1">👫 Nama Penaksir</label><input type="text" value={profil.penaksir} onChange={(e) => setProfil({...profil, penaksir: e.target.value})} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" /></div>
          <div><label className="block text-sm font-bold text-slate-700 mb-1">🗣️ Nama Saksi</label><input type="text" value={profil.saksi} onChange={(e) => setProfil({...profil, saksi: e.target.value})} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" /></div>
          <div><label className="block text-sm font-bold text-slate-700 mb-1">🗣️ Pemutus Pinjaman</label><input type="text" value={profil.pemutus} onChange={(e) => setProfil({...profil, pemutus: e.target.value})} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" /></div>
        </div>
        <div className="mt-8 flex gap-3"><button onClick={() => setShowSettingsModal(false)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">Batal</button><button onClick={handleSaveProfil} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg transition-all">Simpan Profil</button></div>
      </div>
    </div>
  );
}