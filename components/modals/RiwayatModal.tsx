import React from 'react';

interface RiwayatModalProps {
  riwayat: any[];
  hapusRiwayat: () => void;
  setShowRiwayatModal: (v: boolean) => void;
}

export default function RiwayatModal({ riwayat, hapusRiwayat, setShowRiwayatModal }: RiwayatModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[90] transition-opacity">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 relative border-t-8 border-t-indigo-500">
        <h2 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-3"><span className="text-indigo-500">🕒</span> Riwayat Taksiran</h2>
        <p className="text-slate-500 mb-6 border-b pb-4 text-sm">Daftar barang yang sudah lae taksir hari ini.</p>
        
        <div className="space-y-3 mb-6">
          {riwayat.length === 0 ? (
            <div className="text-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-4xl mb-2">📭</p>
              <p className="text-slate-500 font-medium">Belum ada riwayat taksiran hari ini.</p>
            </div>
          ) : (
            riwayat.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-200 transition-colors">
                <div>
                  <p className="font-bold text-slate-800 text-sm md:text-base line-clamp-1">{item.nama}</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">⏰ {item.waktu}</p>
                </div>
                <div className="text-right pl-4">
                  <p className="font-black text-indigo-700 whitespace-nowrap">Rp {item.harga.toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {riwayat.length > 0 && (
          <button onClick={hapusRiwayat} className="w-full bg-rose-50 text-rose-600 py-3 rounded-xl font-bold hover:bg-rose-100 transition-colors mb-2">
            🗑️ Bersihkan Semua Riwayat
          </button>
        )}
        <button onClick={() => setShowRiwayatModal(false)} className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">Tutup</button>
        <button onClick={() => setShowRiwayatModal(false)} className="absolute top-4 right-4 bg-slate-100 text-slate-500 hover:bg-rose-500 hover:text-white w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors shadow-sm">✕</button>
      </div>
    </div>
  );
}