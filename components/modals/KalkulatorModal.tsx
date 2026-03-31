import React from 'react';

interface KalkulatorModalProps {
  selectedItem: any;
  kondisi: any;
  setKondisi: (kondisi: any) => void;
  rincian: any;
  isIphone: boolean;
  isLaptop: boolean;
  isAndroid: boolean;
  simpanKeRiwayat: (nama: string, harga: number) => void;
  onClose: () => void;
}

export default function KalkulatorModal({
  selectedItem, kondisi, setKondisi, rincian, isIphone, isLaptop, isAndroid, simpanKeRiwayat, onClose
}: KalkulatorModalProps) {
  if (!selectedItem) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-2 md:p-6 z-40">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto p-5 md:p-8 relative flex flex-col md:flex-row gap-6 md:gap-10 border border-slate-100">
        
        {/* PANEL KIRI: CEKLIS KONDISI */}
        <div className="flex-1 mt-6 md:mt-0">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-indigo-500 uppercase tracking-wider mb-1">Kalkulasi Taksiran (Sesuai HPS)</h3>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 pr-8 leading-tight">{selectedItem.merek} {selectedItem.tipe}</h2>
          </div>
          
          {isNaN(Number(selectedItem.hps)) ? (
            <div className="bg-rose-50 p-5 rounded-2xl border border-rose-200 text-center">
              <p className="text-rose-700 font-black text-lg md:text-xl mb-1">⚠️ {selectedItem.hps}</p>
              <p className="text-rose-600 text-sm font-medium">Berdasarkan HPS, barang ini tidak bisa digadai.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <p className="font-bold text-sm text-slate-500 uppercase tracking-wide mb-3">Kelengkapan Umum</p>
                <div className="space-y-1">
                  <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-white rounded-xl transition-colors">
                    <input type="checkbox" checked={kondisi.batangan} onChange={(e) => setKondisi({...kondisi, batangan: e.target.checked})} className="w-5 h-5 accent-indigo-600" />
                    <span className="text-base text-slate-700 font-medium">{isLaptop ? 'Tanpa Tas & Dusbuk (Batangan)' : 'Dusbuk Hilang (Batangan)'}</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-white rounded-xl transition-colors">
                    <input type="checkbox" checked={kondisi.noAdaptor} onChange={(e) => setKondisi({...kondisi, noAdaptor: e.target.checked})} className="w-5 h-5 accent-indigo-600" />
                    <span className="text-base text-slate-700 font-medium">{isLaptop ? 'Tanpa Charger / Adaptor Ori' : 'Tanpa Kepala Adaptor'}</span>
                  </label>
                  {!isLaptop && (
                    <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-white rounded-xl transition-colors">
                      <input type="checkbox" checked={kondisi.noKabel} onChange={(e) => setKondisi({...kondisi, noKabel: e.target.checked})} className="w-5 h-5 accent-indigo-600" />
                      <span className="text-base text-slate-700 font-medium">Tanpa Kabel Data Asli</span>
                    </label>
                  )}
                  {(!isIphone) && (
                    <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-white rounded-xl transition-colors">
                      <input type="checkbox" checked={kondisi.bateraiDrop} onChange={(e) => setKondisi({...kondisi, bateraiDrop: e.target.checked})} className="w-5 h-5 accent-indigo-600" />
                      <span className="text-base text-slate-700 font-medium">Baterai Drop / Bocor</span>
                    </label>
                  )}
                </div>
              </div>
              {isIphone && (
                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                  <p className="font-bold text-sm text-indigo-600 uppercase tracking-wide mb-3 flex items-center gap-2"><span className="text-lg">🍏</span> Khusus iPhone</p>
                  <div className="space-y-1">
                    <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-indigo-100/50 rounded-xl transition-colors"><input type="checkbox" checked={kondisi.noTrueTone} onChange={(e) => setKondisi({...kondisi, noTrueTone: e.target.checked})} className="w-5 h-5 accent-indigo-600" /><span className="text-base text-indigo-900 font-medium">True Tone Mati / Ganti LCD</span></label>
                    <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-indigo-100/50 rounded-xl transition-colors"><input type="checkbox" checked={kondisi.noFaceId} onChange={(e) => setKondisi({...kondisi, noFaceId: e.target.checked})} className="w-5 h-5 accent-indigo-600" /><span className="text-base text-indigo-900 font-medium">Face ID / Touch ID Mati</span></label>
                    <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-indigo-100/50 rounded-xl transition-colors"><input type="checkbox" checked={kondisi.bhService} onChange={(e) => setKondisi({...kondisi, bhService: e.target.checked})} className="w-5 h-5 accent-indigo-600" /><span className="text-base text-indigo-900 font-medium">Battery Health Service (&lt; 80%)</span></label>
                    <label className="flex items-center space-x-3 cursor-pointer p-3 mt-2 bg-rose-50 border border-rose-200 rounded-xl transition-colors"><input type="checkbox" checked={kondisi.icloudTerkunci} onChange={(e) => setKondisi({...kondisi, icloudTerkunci: e.target.checked})} className="w-5 h-5 accent-rose-600" /><span className="text-base text-rose-700 font-bold">iCloud Terkunci / Nyangkut</span></label>
                  </div>
                </div>
              )}
              {isLaptop && (
                <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                  <p className="font-bold text-sm text-purple-600 uppercase tracking-wide mb-3 flex items-center gap-2"><span className="text-lg">💻</span> Hardware Laptop</p>
                  <div className="space-y-1">
                    <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-purple-100/50 rounded-xl transition-colors"><input type="checkbox" checked={kondisi.keyboardError} onChange={(e) => setKondisi({...kondisi, keyboardError: e.target.checked})} className="w-5 h-5 accent-purple-600" /><span className="text-base text-purple-900 font-medium">Keyboard Error / Tombol Mati</span></label>
                    <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-purple-100/50 rounded-xl transition-colors"><input type="checkbox" checked={kondisi.layarMinus} onChange={(e) => setKondisi({...kondisi, layarMinus: e.target.checked})} className="w-5 h-5 accent-purple-600" /><span className="text-base text-purple-900 font-medium">Layar Whitespot / Dead Pixel</span></label>
                    <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-purple-100/50 rounded-xl transition-colors"><input type="checkbox" checked={kondisi.portError} onChange={(e) => setKondisi({...kondisi, portError: e.target.checked})} className="w-5 h-5 accent-purple-600" /><span className="text-base text-purple-900 font-medium">Port USB / Speaker Bermasalah</span></label>
                  </div>
                </div>
              )}
              {isAndroid && (
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <p className="font-bold text-sm text-emerald-600 uppercase tracking-wide mb-3 flex items-center gap-2"><span className="text-lg">🤖</span> Hardware Android</p>
                  <div className="space-y-1">
                    <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-emerald-100/50 rounded-xl transition-colors"><input type="checkbox" checked={kondisi.layarShadow} onChange={(e) => setKondisi({...kondisi, layarShadow: e.target.checked})} className="w-5 h-5 accent-emerald-600" /><span className="text-base text-emerald-900 font-medium">Layar Shadow / Burn-in</span></label>
                    <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-emerald-100/50 rounded-xl transition-colors"><input type="checkbox" checked={kondisi.touchscreenError} onChange={(e) => setKondisi({...kondisi, touchscreenError: e.target.checked})} className="w-5 h-5 accent-emerald-600" /><span className="text-base text-emerald-900 font-medium">Touchscreen Error / Loncat</span></label>
                  </div>
                </div>
              )}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <p className="font-bold text-sm text-slate-500 uppercase tracking-wide mb-2">Fisik & Casing</p>
                <select value={kondisi.fisik} onChange={(e) => setKondisi({...kondisi, fisik: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium bg-white">
                  <option value="mulus">🟢 Mulus / Like New</option>
                  <option value="lecet">🟡 Lecet Pemakaian</option>
                  <option value="dent">🟠 Dent / Penyok</option>
                  {(!isLaptop && !isAndroid) && <option value="layar">🔴 Layar Retak</option>}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* PANEL KANAN: STRUK */}
        <div className="flex-1 flex flex-col justify-between mt-4 md:mt-0">
          {rincian && !rincian.tolakGadai ? (
            <>
              <div className="bg-slate-50 p-5 md:p-6 rounded-3xl border border-slate-100 mb-4 h-full flex flex-col">
                <h4 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-4 text-center">Rincian Taksiran Sistem</h4>
                <div className="flex justify-between items-center text-sm md:text-base mb-3"><span className="text-slate-500 font-medium">HPS Dasar (Mulus)</span><span className="font-black text-slate-800">Rp {rincian.dasar.toLocaleString('id-ID')}</span></div>
                
                {/* INI BAGIAN RINCIAN YANG SUDAH DIKEMBALIKAN */}
                <div className="space-y-2.5 my-4 border-t border-b border-dashed border-slate-300 py-4 flex-grow">
                  {rincian.potBatangan > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>Minus Kelengkapan</span><span>- Rp {rincian.potBatangan.toLocaleString('id-ID')}</span></div>}
                  {rincian.potAdaptor > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>Minus Adaptor</span><span>- Rp {rincian.potAdaptor.toLocaleString('id-ID')}</span></div>}
                  {rincian.potKabel > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>Minus Kabel Asli</span><span>- Rp {rincian.potKabel.toLocaleString('id-ID')}</span></div>}
                  {rincian.potTrueTone > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>True Tone Mati</span><span>- Rp {rincian.potTrueTone.toLocaleString('id-ID')}</span></div>}
                  {rincian.potFaceId > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>Face ID Mati</span><span>- Rp {rincian.potFaceId.toLocaleString('id-ID')}</span></div>}
                  {rincian.potKeyboard > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>Keyboard Error</span><span>- Rp {rincian.potKeyboard.toLocaleString('id-ID')}</span></div>}
                  {rincian.potLayarMinus > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>Layar Whitespot</span><span>- Rp {rincian.potLayarMinus.toLocaleString('id-ID')}</span></div>}
                  {rincian.potPort > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>Port/Speaker Minus</span><span>- Rp {rincian.potPort.toLocaleString('id-ID')}</span></div>}
                  {rincian.potLayarShadow > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>Layar Shadow</span><span>- Rp {rincian.potLayarShadow.toLocaleString('id-ID')}</span></div>}
                  {rincian.potTouchscreen > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>Touch Error</span><span>- Rp {rincian.potTouchscreen.toLocaleString('id-ID')}</span></div>}
                  {rincian.potBaterai > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>Baterai Drop/Service</span><span>- Rp {rincian.potBaterai.toLocaleString('id-ID')}</span></div>}
                  {rincian.potFisik > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>{rincian.namaFisik}</span><span>- Rp {rincian.potFisik.toLocaleString('id-ID')}</span></div>}
                  
                  {rincian.totalPotongan === 0 && <div className="text-center text-sm text-emerald-500 italic py-2 bg-emerald-50/50 rounded-xl">✨ Barang mulus tanpa minus.</div>}
                </div>
                
                {rincian.totalPotongan > 0 && <div className="flex justify-between text-sm font-bold text-slate-600 mt-2"><span>Total Pemotongan</span><span>- Rp {rincian.totalPotongan.toLocaleString('id-ID')}</span></div>}
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-5 rounded-2xl text-center shadow-lg shadow-indigo-200">
                  <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1 opacity-90">Harga Taksiran Bersih</p>
                  <p className="text-3xl font-black text-white tracking-tight drop-shadow-sm">Rp {rincian.bersih.toLocaleString('id-ID')}</p>
                </div>
                <button onClick={() => simpanKeRiwayat(`${selectedItem.merek} ${selectedItem.tipe}`, rincian.bersih)} className="w-full bg-slate-800 text-white p-3.5 rounded-2xl font-bold hover:bg-slate-900 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2">
                  <span>💾</span> Simpan ke Riwayat
                </button>
              </div>
            </>
          ) : rincian?.tolakGadai && (
            <div className="bg-rose-50 p-5 md:p-6 rounded-3xl text-center border border-rose-200 flex flex-col justify-center h-full">
              <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-2">Peringatan Sistem</p>
              <p className="text-2xl md:text-3xl font-black text-rose-600 tracking-tight">TOLAK GADAI</p>
              <p className="text-sm font-medium text-rose-500 mt-2">iCloud Terkunci / Nyangkut</p>
            </div>
          )}
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 bg-slate-100 text-slate-500 hover:bg-rose-500 hover:text-white w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors z-10 shadow-sm">✕</button>
      </div>
    </div>
  );
}