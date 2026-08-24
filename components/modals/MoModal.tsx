import React, { useState, useEffect } from 'react';
import { getPlafonMerek } from '../../utils/kalkulasi';

interface MoModalProps {
  moForm: any;
  setMoForm: (form: any) => void;
  handleFormatRupiahMO: (field: 'permintaan' | 'taksiran', value: string) => void;
  copyToWAMo: () => void;
  setShowMoModal: (v: boolean) => void;
}

export default function MoModal({ moForm, setMoForm, handleFormatRupiahMO, copyToWAMo, setShowMoModal }: MoModalProps) {
  const [hargaPasarBaru, setHargaPasarBaru] = useState('');
  
  const namaBarangAman = moForm.namaBarang || '';
  const infoKasta = getPlafonMerek(namaBarangAman);
  const isMerekDiisi = namaBarangAman.trim() !== '';

  useEffect(() => {
    const rawHarga = Number(hargaPasarBaru.replace(/\D/g, ''));
    if (rawHarga > 0) {
      const hasilTaksiran = Math.floor(rawHarga * infoKasta.persen);
      handleFormatRupiahMO('taksiran', hasilTaksiran.toString());
    } else {
      handleFormatRupiahMO('taksiran', '');
    }
  }, [hargaPasarBaru, moForm.namaBarang, infoKasta.persen]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[70] transition-opacity">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto p-6 md:p-8 relative border-t-8 border-t-[#25D366]">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2 flex items-center gap-3"><span className="text-[#25D366]">💬</span> Form Izin Harga MO</h2>
        <p className="text-slate-500 mb-6 border-b pb-4">Gunakan form ini untuk barang <strong>Non-HPS</strong> dengan sistem kasta merek otomatis.</p>
        
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-1">Merek Barang</label>
              <input type="text" value={moForm.namaBarang} onChange={(e) => setMoForm({...moForm, namaBarang: e.target.value})} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#25D366]" placeholder="Misal: Axioo atau iPhone" />
              {isMerekDiisi && (
                <p className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${infoKasta.warna}`}>
                  {infoKasta.label} - Potongan {Math.round((1 - infoKasta.persen) * 100)}%
                </p>
              )}
            </div>
            <div className="flex-1"><label className="block text-sm font-bold text-slate-700 mb-1">Tipe/Spek</label><input type="text" value={moForm.tipeJenis} onChange={(e) => setMoForm({...moForm, tipeJenis: e.target.value})} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#25D366]" placeholder="Misal: Pongo 7 atau 15 Pro" /></div>
          </div>

          {/* KEMBALIKAN INPUT KONDISI & KELENGKAPAN */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-1">Kondisi / Minus</label>
              <input type="text" value={moForm.kondisi} onChange={(e) => setMoForm({...moForm, kondisi: e.target.value})} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#25D366]" placeholder="Misal: Mulus, Layar shadow..." />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-1">Kelengkapan</label>
              <input type="text" value={moForm.kelengkapan} onChange={(e) => setMoForm({...moForm, kelengkapan: e.target.value})} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#25D366]" placeholder="Misal: Fullset, Batangan..." />
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-indigo-900">Harga Baru Pasaran (Google Shopping)</label>
              <a href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(`${moForm.namaBarang} ${moForm.tipeJenis}`.trim())}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-600 underline">Cek Harga Sekarang 🔍</a>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-3 text-indigo-400 font-bold">Rp</span>
              <input type="text" value={hargaPasarBaru} onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setHargaPasarBaru(val ? Number(val).toLocaleString('id-ID') : '');
              }} className="w-full p-3 pl-10 border border-indigo-200 rounded-xl text-indigo-900 font-bold focus:ring-2 focus:ring-indigo-500" placeholder="Masukkan harga baru dari Google..." />
            </div>
            
            {isMerekDiisi && (
              <p className="text-[10px] text-indigo-500 mt-2 italic">
                *Aplikasi akan otomatis menghitung usulan taksiran sebesar {Math.round(infoKasta.persen * 100)}% dari harga ini.
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-2">
            <div className="flex-1"><label className="block text-sm font-bold text-slate-700 mb-1">Permintaan Nasabah</label><div className="relative"><span className="absolute left-3 top-3 text-slate-500 font-bold">Rp</span><input type="text" value={moForm.permintaan} onChange={(e) => handleFormatRupiahMO('permintaan', e.target.value)} className="w-full p-3 pl-10 border border-slate-300 rounded-xl text-slate-800 font-bold" placeholder="0" /></div></div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-1">Usulan Taksiran Lae (Otomatis)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-white font-bold">Rp</span>
                <input type="text" value={moForm.taksiran} onChange={(e) => handleFormatRupiahMO('taksiran', e.target.value)} className="w-full p-3 pl-10 border border-[#25D366] rounded-xl text-white font-black bg-gradient-to-r from-[#25D366] to-[#128C7E]" placeholder="0" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3"><button onClick={() => setShowMoModal(false)} className="px-6 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200">Batal</button><button onClick={copyToWAMo} className="flex-1 bg-[#25D366] text-white py-3 rounded-xl font-bold hover:bg-[#128C7E] active:scale-95 shadow-lg flex justify-center items-center gap-2 text-lg"><span>📋</span> Salin Format ke WA</button></div>
        <button onClick={() => setShowMoModal(false)} className="absolute top-4 right-4 bg-slate-100 text-slate-500 hover:bg-rose-500 hover:text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm">✕</button>
      </div>
    </div>
  );
}