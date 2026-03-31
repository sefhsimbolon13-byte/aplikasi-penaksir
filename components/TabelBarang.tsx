import React from 'react';

interface TabelBarangProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filteredData: any[];
  handleTaksir: (item: any) => void;
  setShowMoModal: (v: boolean) => void;
}

export default function TabelBarang({ searchQuery, setSearchQuery, filteredData, handleTaksir, setShowMoModal }: TabelBarangProps) {
  return (
    <div className="mt-8 pt-4">
      <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4">Cari Barang Nasabah</h2>
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"><span className="text-slate-400 text-lg">🔍</span></div>
        <input type="text" placeholder="Ketik tipe HP atau Laptop... (Contoh: A01 Core, Macbook)" className="w-full pl-11 pr-4 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base md:text-lg text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200 tracking-wider">
            <tr>
              <th className="px-5 py-4 font-bold">Merek / Kategori</th>
              <th className="px-5 py-4 font-bold min-w-[200px]">Tipe Barang</th>
              <th className="px-5 py-4 font-bold">HPS Maksimal</th>
              <th className="px-5 py-4 font-bold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.length > 0 ? filteredData.slice(0, 15).map((item, index) => (
                <tr key={index} className="bg-white hover:bg-slate-50/80 transition-colors group">
                  <td className="px-5 py-4 whitespace-nowrap"><span className="font-bold text-slate-800">{item.merek}</span><span className="text-[11px] text-slate-400 block mt-0.5 uppercase tracking-wide">{item.group}</span></td>
                  <td className="px-5 py-4 font-semibold text-indigo-900">{item.tipe}</td>
                  <td className="px-5 py-4 whitespace-nowrap"><span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${isNaN(Number(item.hps)) ? 'bg-rose-100 text-rose-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>{isNaN(Number(item.hps)) ? item.hps : `Rp ${Number(item.hps).toLocaleString('id-ID')}`}</span></td>
                  <td className="px-5 py-4 whitespace-nowrap text-center"><button onClick={() => handleTaksir(item)} className="bg-indigo-600 text-white px-5 py-2 rounded-xl shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all text-sm font-bold opacity-90 group-hover:opacity-100">Taksir Harga</button></td>
                </tr>
              ))
            : <tr>
                <td colSpan={4} className="px-5 py-12 text-center">
                  <p className="text-slate-400 font-medium mb-3">Pencarian "{searchQuery}" tidak ditemukan di database HPS.</p>
                  <button onClick={() => setShowMoModal(true)} className="text-indigo-600 font-bold hover:text-indigo-800 underline underline-offset-4">Klik di sini untuk bertanya ke MO</button>
                </td>
              </tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}