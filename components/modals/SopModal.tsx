import React from 'react';

interface SopModalProps {
  setShowSopModal: (v: boolean) => void;
}

export default function SopModal({ setShowSopModal }: SopModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[80] transition-opacity">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative border border-slate-100">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 pb-4 mb-6 border-b-2 border-slate-100 flex items-center gap-3"><span className="text-amber-500">📖</span> Standar Operasional Penaksir</h2>
        <div className="space-y-5">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 transition-colors"><h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-3">🍏 1. Pengecekan iPhone / iPad</h3><ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600"><li><strong>Cek True Tone:</strong> Tahan ikon Brightness di Control Center. Hilang = LCD Gantian (-10%).</li><li><strong>Cek Face ID:</strong> Coba daftar wajah baru. Gagal = (-15%).</li><li><strong>Battery Health:</strong> Jika tulisan "Servis" atau &lt; 80% = (-15%).</li><li><strong className="text-rose-600">FATAL:</strong> iCloud terkunci atau nyangkut = <strong>TOLAK GADAI.</strong></li></ul></div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 transition-colors"><h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-3">🤖 2. Pengecekan HP Android</h3><ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600"><li><strong>Samsung Test:</strong> Ketik <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono text-sm">*#0*#</code>. Cek warna dan fungsi sentuh.</li><li><strong>Xiaomi Test:</strong> Ketik <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono text-sm">*#*#6484#*#*</code></li><li><strong>Oppo/Vivo:</strong> Ketik <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono text-sm">*#899#</code> (Oppo) atau <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono text-sm">*#558#</code> (Vivo).</li><li><strong>Layar Shadow:</strong> Berbayang merah di layar putih = (-25%).</li></ul></div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 transition-colors"><h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-3">💻 3. Pengecekan Laptop / MacBook</h3><ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600"><li><strong>Cek Spek:</strong> Win + R, ketik <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono text-sm">dxdiag</code>.</li><li><strong>Cek Keyboard:</strong> Tes di situs "Keyboard Tester" online (-10%).</li><li><strong>Layar Whitespot:</strong> Cek di background putih polos (-20%).</li><li><strong>MacBook Cycle Count:</strong> Tahan Option &gt; Klik Logo Apple &gt; System Information &gt; Power.</li></ul></div>
        </div>
        <button onClick={() => setShowSopModal(false)} className="absolute top-4 right-4 bg-slate-100 text-slate-500 hover:bg-rose-500 hover:text-white w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors">✕</button>
        <div className="mt-8 text-center"><button onClick={() => setShowSopModal(false)} className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-900 active:scale-95 transition-all shadow-lg w-full md:w-auto">Mengerti & Tutup Panduan</button></div>
      </div>
    </div>
  );
}