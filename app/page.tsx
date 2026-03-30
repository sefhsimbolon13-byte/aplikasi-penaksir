'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { useHpsStore } from '../store/useHpsStore';

export default function Home() {
  const { hpsData, setHpsData } = useHpsStore();
  const [fileName, setFileName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showSopModal, setShowSopModal] = useState(false);
  
  const [kondisi, setKondisi] = useState({
    batangan: false,        
    noAdaptor: false,       
    noKabel: false,         
    bateraiDrop: false,     
    fisik: 'mulus', 
    noTrueTone: false,
    noFaceId: false,
    bhService: false,
    icloudTerkunci: false,
    keyboardError: false,
    layarMinus: false, 
    portError: false,
    layarShadow: false,      
    touchscreenError: false  
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      let bestScore = 0;
      let headerIndex = 0;
      const keywords = ['NO', 'GROUP', 'JENIS', 'MEREK', 'MERK', 'TYPE', 'TIPE', 'HPS', 'HARGA', 'KARAT'];

      for (let i = 0; i < Math.min(lines.length, 20); i++) {
        let score = 0;
        const upperLine = lines[i].toUpperCase();
        keywords.forEach(kw => { if (upperLine.includes(kw)) score++; });
        if (score > bestScore) { bestScore = score; headerIndex = i; }
      }

      const cleanCsvText = lines.slice(headerIndex).join('\n');

      Papa.parse(cleanCsvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const actualHeaders = results.meta.fields || [];
          const findCol = (synonyms: string[]) => {
            const found = actualHeaders.find(header => synonyms.some(syn => header.trim().toUpperCase().includes(syn)));
            return found || ''; 
          };

          const colGroup = findCol(['GROUP', 'JENIS', 'KATEGORI']);
          const colMerek = findCol(['MEREK', 'MERK', 'KARAT', 'BRAND']);
          const colTipe = findCol(['TYPE', 'TIPE']); 
          const colHarga = findCol(['HPS', 'HARGA', 'GADAI', 'NOMINAL']);
          const colKet = findCol(['KET', 'GRAM', 'SYARAT']);

          const parsedData = results.data
            .filter((row: any) => row[colHarga]) 
            .map((row: any) => {
              let rawHarga = row[colHarga] || '0';
              let finalHarga: string | number = rawHarga;
              
              if (typeof rawHarga === 'string') {
                let cleanString = rawHarga.replace(/Rp/ig, '').replace(/\./g, '').trim();
                if (!isNaN(Number(cleanString)) && cleanString !== '') {
                  finalHarga = Number(cleanString);
                } else {
                  finalHarga = rawHarga.trim();
                }
              }

              return {
                group: colGroup ? (row[colGroup] || '') : '',
                merek: colMerek ? (row[colMerek] || '') : '',
                tipe: colTipe ? (row[colTipe] || '') : '', 
                hps: finalHarga, 
                keterangan: colKet ? (row[colKet] || '') : ''
              };
            });
          
          setHpsData([...hpsData, ...parsedData]); 
          alert(`Mantap! ${parsedData.length} data HPS berhasil di-update.`);
          event.target.value = '';
        }
      });
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if(confirm("Yakin mau mengosongkan semua data HPS saat ini?")) {
      setHpsData([]);
      setFileName('');
      setSearchQuery('');
    }
  };

  const filteredData = hpsData.filter((item) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    const gabunganText = `${item.merek} ${item.tipe} ${item.group}`.toLowerCase();
    return gabunganText.includes(searchLower);
  });

  const handleTaksir = (item: any) => {
    setSelectedItem(item);
    setKondisi({ 
      batangan: false, noAdaptor: false, noKabel: false, bateraiDrop: false, fisik: 'mulus',
      noTrueTone: false, noFaceId: false, bhService: false, icloudTerkunci: false,
      keyboardError: false, layarMinus: false, portError: false,
      layarShadow: false, touchscreenError: false
    });
  };

  const namaGabungan = selectedItem ? `${selectedItem.merek} ${selectedItem.tipe}`.toLowerCase() : '';
  const isIphone = namaGabungan.includes('iphone');
  const isLaptop = namaGabungan.includes('macbook') || namaGabungan.includes('laptop') || 
                   namaGabungan.includes('asus') || namaGabungan.includes('acer') || 
                   namaGabungan.includes('lenovo') || namaGabungan.includes('hp ') ||
                   namaGabungan.includes('msi') || namaGabungan.includes('rog');
  const isAndroid = !isIphone && !isLaptop; 

  const hitungRincianTaksiran = () => {
    if (!selectedItem) return null;
    let hargaDasar = Number(selectedItem.hps);
    if (isNaN(hargaDasar)) return null; 

    let rincian = {
      dasar: hargaDasar,
      potBatangan: 0, potAdaptor: 0, potKabel: 0, potBaterai: 0, potFisik: 0,
      potTrueTone: 0, potFaceId: 0,
      potKeyboard: 0, potLayarMinus: 0, potPort: 0,
      potLayarShadow: 0, potTouchscreen: 0, 
      namaFisik: '', totalPotongan: 0, bersih: 0, tolakGadai: false
    };
    
    if (kondisi.batangan) rincian.potBatangan = hargaDasar * 0.10; 
    if (kondisi.noAdaptor) rincian.potAdaptor = isLaptop ? 350000 : 150000; 
    if (kondisi.noKabel) rincian.potKabel = 100000;   

    if (isIphone) {
        if (kondisi.noTrueTone) rincian.potTrueTone = hargaDasar * 0.10; 
        if (kondisi.noFaceId) rincian.potFaceId = hargaDasar * 0.15;     
        if (kondisi.bhService) rincian.potBaterai = hargaDasar * 0.15;   
        if (kondisi.icloudTerkunci) rincian.tolakGadai = true;           
    } 
    else if (isLaptop) {
        if (kondisi.bateraiDrop) rincian.potBaterai = hargaDasar * 0.15; 
        if (kondisi.keyboardError) rincian.potKeyboard = hargaDasar * 0.10; 
        if (kondisi.layarMinus) rincian.potLayarMinus = hargaDasar * 0.20; 
        if (kondisi.portError) rincian.potPort = hargaDasar * 0.05; 
    } 
    else if (isAndroid) {
        if (kondisi.bateraiDrop) rincian.potBaterai = hargaDasar * 0.15; 
        if (kondisi.layarShadow) rincian.potLayarShadow = hargaDasar * 0.25; 
        if (kondisi.touchscreenError) rincian.potTouchscreen = hargaDasar * 0.15; 
    }

    if (kondisi.fisik === 'lecet') {
      rincian.potFisik = hargaDasar * 0.05;
      rincian.namaFisik = 'Lecet Pemakaian (-5%)';
    } else if (kondisi.fisik === 'dent') {
      rincian.potFisik = hargaDasar * 0.15;
      rincian.namaFisik = 'Dent/Penyok (-15%)';
    } else if (kondisi.fisik === 'layar') {
      rincian.potFisik = hargaDasar * 0.25;
      rincian.namaFisik = 'Layar Retak / Cacat (-25%)';
    }

    rincian.totalPotongan = rincian.potBatangan + rincian.potAdaptor + rincian.potKabel + rincian.potBaterai + 
                            rincian.potFisik + rincian.potTrueTone + rincian.potFaceId + 
                            rincian.potKeyboard + rincian.potLayarMinus + rincian.potPort +
                            rincian.potLayarShadow + rincian.potTouchscreen; 
    rincian.bersih = rincian.dasar - rincian.totalPotongan;
    
    if (rincian.bersih < 0 || rincian.tolakGadai) rincian.bersih = 0;

    return rincian;
  };

  const rincian = hitungRincianTaksiran();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans antialiased selection:bg-indigo-200">
      <div className="max-w-6xl mx-auto bg-white p-5 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        
        {/* HEADER MEWAH */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-5 border-b border-slate-100">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-indigo-900 mb-1">
              Budi Gadai <span className="text-indigo-500 font-light">| Penaksir</span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium">Sistem Estimasi Harga Gadai Otomatis</p>
          </div>
          <button 
            onClick={() => setShowSopModal(true)} 
            className="mt-5 md:mt-0 bg-amber-50 text-amber-700 border border-amber-200 px-5 py-2.5 rounded-xl font-bold hover:bg-amber-100 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base shadow-sm"
          >
            <span className="text-lg">📖</span> Buku Panduan SOP
          </button>
        </div>
        
        {/* AREA UPLOAD ELEGAN */}
        <div className="mb-8 p-6 md:p-8 border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-2xl text-center relative transition-colors hover:bg-indigo-50">
           <label className="block text-base md:text-lg font-bold text-indigo-900 mb-4">Upload File HPS (.CSV)</label>
           <div className="overflow-hidden flex justify-center">
             <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileUpload} 
                className="block w-full max-w-sm text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:cursor-pointer file:transition-colors file:shadow-md cursor-pointer" 
             />
           </div>
           
           {hpsData.length > 0 && (
             <div className="mt-5 flex flex-col items-center">
               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold mb-3">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 Database Aktif: {hpsData.length} Item
               </span>
               <button onClick={handleResetData} className="text-xs text-rose-600 font-bold hover:text-rose-800 underline underline-offset-4 transition-colors">Kosongkan Data</button>
             </div>
           )}
        </div>

        {/* AREA PENCARIAN & TABEL */}
        {hpsData.length > 0 && (
          <div className="mt-8 pt-4">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4">Cari Barang Nasabah</h2>
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <span className="text-slate-400 text-lg">🔍</span>
              </div>
              <input 
                type="text" 
                placeholder="Ketik tipe HP atau Laptop... (Contoh: A01 Core, Macbook)" 
                className="w-full pl-11 pr-4 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base md:text-lg text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all shadow-sm" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
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
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="font-bold text-slate-800">{item.merek}</span> 
                          <span className="text-[11px] text-slate-400 block mt-0.5 uppercase tracking-wide">{item.group}</span>
                        </td>
                        <td className="px-5 py-4 font-semibold text-indigo-900">{item.tipe}</td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${isNaN(Number(item.hps)) ? 'bg-rose-100 text-rose-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                            {isNaN(Number(item.hps)) ? item.hps : `Rp ${Number(item.hps).toLocaleString('id-ID')}`}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-center">
                          <button 
                            onClick={() => handleTaksir(item)} 
                            className="bg-indigo-600 text-white px-5 py-2 rounded-xl shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg active:scale-95 transition-all duration-200 text-sm font-bold opacity-90 group-hover:opacity-100"
                          >
                            Taksir Harga
                          </button>
                        </td>
                      </tr>
                    ))
                  : <tr><td colSpan={4} className="px-5 py-12 text-center text-slate-400 font-medium">Pencarian "{searchQuery}" tidak ditemukan di database.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL SOP (GLASSMORPHISM) */}
      {showSopModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative border border-slate-100">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 pb-4 mb-6 border-b-2 border-slate-100 flex items-center gap-3">
              <span className="text-amber-500">📖</span> Standar Operasional Penaksir
            </h2>
            
            <div className="space-y-5">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 transition-colors">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-3">🍏 1. Pengecekan iPhone / iPad</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600">
                  <li><strong>Cek True Tone:</strong> Tahan ikon Brightness di Control Center. Hilang = LCD Gantian (-10%).</li>
                  <li><strong>Cek Face ID:</strong> Coba daftar wajah baru. Gagal = (-15%).</li>
                  <li><strong>Battery Health:</strong> Jika tulisan "Servis" atau &lt; 80% = (-15%).</li>
                  <li><strong className="text-rose-600">FATAL:</strong> iCloud terkunci atau nyangkut = <strong>TOLAK GADAI.</strong></li>
                </ul>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 transition-colors">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-3">🤖 2. Pengecekan HP Android</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600">
                  <li><strong>Samsung Test:</strong> Ketik <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono text-sm">*#0*#</code>. Cek warna dan fungsi sentuh.</li>
                  <li><strong>Xiaomi Test:</strong> Ketik <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono text-sm">*#*#6484#*#*</code></li>
                  <li><strong>Oppo/Vivo:</strong> Ketik <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono text-sm">*#899#</code> (Oppo) atau <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono text-sm">*#558#</code> (Vivo).</li>
                  <li><strong>Layar Shadow:</strong> Berbayang merah di layar putih = (-25%).</li>
                </ul>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 transition-colors">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-3">💻 3. Pengecekan Laptop / MacBook</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600">
                  <li><strong>Cek Spek:</strong> Win + R, ketik <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono text-sm">dxdiag</code>.</li>
                  <li><strong>Cek Keyboard:</strong> Tes di situs "Keyboard Tester" online (-10%).</li>
                  <li><strong>Layar Whitespot:</strong> Cek di background putih polos (-20%).</li>
                  <li><strong>MacBook Cycle Count:</strong> Tahan Option &gt; Klik Logo Apple &gt; System Information &gt; Power.</li>
                </ul>
              </div>
            </div>

            <button onClick={() => setShowSopModal(false)} className="absolute top-4 right-4 bg-slate-100 text-slate-500 hover:bg-rose-500 hover:text-white w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors">
              ✕
            </button>
            
            <div className="mt-8 text-center">
              <button onClick={() => setShowSopModal(false)} className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-900 active:scale-95 transition-all shadow-lg w-full md:w-auto">
                Mengerti & Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KALKULATOR UTAMA (GLASSMORPHISM) */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-2 md:p-6 z-50">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto p-5 md:p-8 relative flex flex-col md:flex-row gap-6 md:gap-10 border border-slate-100">
            
            {/* PANEL KIRI: CEKLIS KONDISI */}
            <div className="flex-1 mt-6 md:mt-0">
              <div className="mb-6">
                <h3 className="text-sm font-bold text-indigo-500 uppercase tracking-wider mb-1">Kalkulasi Taksiran</h3>
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 pr-8 leading-tight">{selectedItem.merek} {selectedItem.tipe}</h2>
              </div>
              
              {isNaN(Number(selectedItem.hps)) ? (
                <div className="bg-rose-50 p-5 rounded-2xl border border-rose-200 text-center">
                  <p className="text-rose-700 font-black text-lg md:text-xl mb-1">⚠️ {selectedItem.hps}</p>
                  <p className="text-rose-600 text-sm font-medium">Berdasarkan HPS, barang ini tidak bisa digadai.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* KELENGKAPAN UMUM */}
                  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <p className="font-bold text-sm text-slate-500 uppercase tracking-wide mb-3">Kelengkapan Umum</p>
                    <div className="space-y-1">
                      <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-white rounded-xl transition-colors">
                        <input type="checkbox" checked={kondisi.batangan} onChange={(e) => setKondisi({...kondisi, batangan: e.target.checked})} className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 accent-indigo-600" />
                        <span className="text-base text-slate-700 font-medium">{isLaptop ? 'Tanpa Tas & Dusbuk (Batangan)' : 'Dusbuk Hilang (Batangan)'}</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-white rounded-xl transition-colors">
                        <input type="checkbox" checked={kondisi.noAdaptor} onChange={(e) => setKondisi({...kondisi, noAdaptor: e.target.checked})} className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 accent-indigo-600" />
                        <span className="text-base text-slate-700 font-medium">{isLaptop ? 'Tanpa Charger / Adaptor Ori' : 'Tanpa Kepala Adaptor'}</span>
                      </label>
                      {!isLaptop && (
                        <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-white rounded-xl transition-colors">
                          <input type="checkbox" checked={kondisi.noKabel} onChange={(e) => setKondisi({...kondisi, noKabel: e.target.checked})} className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 accent-indigo-600" />
                          <span className="text-base text-slate-700 font-medium">Tanpa Kabel Data Asli</span>
                        </label>
                      )}
                      {(!isIphone) && (
                        <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-white rounded-xl transition-colors">
                          <input type="checkbox" checked={kondisi.bateraiDrop} onChange={(e) => setKondisi({...kondisi, bateraiDrop: e.target.checked})} className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 accent-indigo-600" />
                          <span className="text-base text-slate-700 font-medium">Baterai Drop / Bocor</span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* KHUSUS IPHONE */}
                  {isIphone && (
                    <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                      <p className="font-bold text-sm text-indigo-600 uppercase tracking-wide mb-3 flex items-center gap-2"><span className="text-lg">🍏</span> Pengecekan Khusus iPhone</p>
                      <div className="space-y-1">
                        <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-indigo-100/50 rounded-xl transition-colors">
                          <input type="checkbox" checked={kondisi.noTrueTone} onChange={(e) => setKondisi({...kondisi, noTrueTone: e.target.checked})} className="w-5 h-5 accent-indigo-600" />
                          <span className="text-base text-indigo-900 font-medium">True Tone Mati / Ganti LCD</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-indigo-100/50 rounded-xl transition-colors">
                          <input type="checkbox" checked={kondisi.noFaceId} onChange={(e) => setKondisi({...kondisi, noFaceId: e.target.checked})} className="w-5 h-5 accent-indigo-600" />
                          <span className="text-base text-indigo-900 font-medium">Face ID / Touch ID Mati</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-indigo-100/50 rounded-xl transition-colors">
                          <input type="checkbox" checked={kondisi.bhService} onChange={(e) => setKondisi({...kondisi, bhService: e.target.checked})} className="w-5 h-5 accent-indigo-600" />
                          <span className="text-base text-indigo-900 font-medium">Battery Health Service (&lt; 80%)</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer p-3 mt-2 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors">
                          <input type="checkbox" checked={kondisi.icloudTerkunci} onChange={(e) => setKondisi({...kondisi, icloudTerkunci: e.target.checked})} className="w-5 h-5 accent-rose-600" />
                          <span className="text-base text-rose-700 font-bold">iCloud Terkunci / Nyangkut</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* KHUSUS LAPTOP & MACBOOK */}
                  {isLaptop && (
                    <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                      <p className="font-bold text-sm text-purple-600 uppercase tracking-wide mb-3 flex items-center gap-2"><span className="text-lg">💻</span> Hardware Laptop</p>
                      <div className="space-y-1">
                        <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-purple-100/50 rounded-xl transition-colors">
                          <input type="checkbox" checked={kondisi.keyboardError} onChange={(e) => setKondisi({...kondisi, keyboardError: e.target.checked})} className="w-5 h-5 accent-purple-600" />
                          <span className="text-base text-purple-900 font-medium">Keyboard Error / Tombol Mati</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-purple-100/50 rounded-xl transition-colors">
                          <input type="checkbox" checked={kondisi.layarMinus} onChange={(e) => setKondisi({...kondisi, layarMinus: e.target.checked})} className="w-5 h-5 accent-purple-600" />
                          <span className="text-base text-purple-900 font-medium">Layar Whitespot / Dead Pixel</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-purple-100/50 rounded-xl transition-colors">
                          <input type="checkbox" checked={kondisi.portError} onChange={(e) => setKondisi({...kondisi, portError: e.target.checked})} className="w-5 h-5 accent-purple-600" />
                          <span className="text-base text-purple-900 font-medium">Port USB / Speaker Bermasalah</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* KHUSUS ANDROID */}
                  {isAndroid && (
                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                      <p className="font-bold text-sm text-emerald-600 uppercase tracking-wide mb-3 flex items-center gap-2"><span className="text-lg">🤖</span> Hardware Android</p>
                      <div className="space-y-1">
                        <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-emerald-100/50 rounded-xl transition-colors">
                          <input type="checkbox" checked={kondisi.layarShadow} onChange={(e) => setKondisi({...kondisi, layarShadow: e.target.checked})} className="w-5 h-5 accent-emerald-600" />
                          <span className="text-base text-emerald-900 font-medium">Layar Shadow / Burn-in</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-emerald-100/50 rounded-xl transition-colors">
                          <input type="checkbox" checked={kondisi.touchscreenError} onChange={(e) => setKondisi({...kondisi, touchscreenError: e.target.checked})} className="w-5 h-5 accent-emerald-600" />
                          <span className="text-base text-emerald-900 font-medium">Touchscreen Error / Loncat</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* KONDISI FISIK */}
                  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <p className="font-bold text-sm text-slate-500 uppercase tracking-wide mb-3">Kondisi Fisik & Casing</p>
                    <select value={kondisi.fisik} onChange={(e) => setKondisi({...kondisi, fisik: e.target.value})} className="w-full p-3.5 border border-slate-200 rounded-xl text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium bg-white shadow-sm cursor-pointer">
                      <option value="mulus">🟢 Mulus / Like New</option>
                      <option value="lecet">🟡 Lecet Pemakaian Wajar</option>
                      <option value="dent">🟠 Dent / Penyok / Engsel Patah</option>
                      {(!isLaptop && !isAndroid) && <option value="layar">🔴 Layar Retak / Cacat Berat</option>}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* PANEL KANAN: STRUK RINCIAN (LEBIH ELEGAN) */}
            {!isNaN(Number(selectedItem.hps)) && rincian && (
              <div className="flex-1 flex flex-col justify-between mt-4 md:mt-0">
                <div className="bg-slate-50 p-5 md:p-6 rounded-3xl border border-slate-100 mb-4 h-full flex flex-col">
                  <h4 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-4 text-center">Rincian Taksiran Sistem</h4>
                  
                  <div className="flex justify-between items-center text-sm md:text-base mb-3">
                    <span className="text-slate-500 font-medium">HPS Dasar (Mulus)</span>
                    <span className="font-black text-slate-800">Rp {rincian.dasar.toLocaleString('id-ID')}</span>
                  </div>

                  <div className="space-y-2.5 my-4 border-t border-b border-dashed border-slate-300 py-4 flex-grow">
                    {rincian.potBatangan > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>Minus Kelengkapan</span><span>- Rp {rincian.potBatangan.toLocaleString('id-ID')}</span></div>}
                    {rincian.potAdaptor > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>Minus Charger/Adaptor</span><span>- Rp {rincian.potAdaptor.toLocaleString('id-ID')}</span></div>}
                    {rincian.potKabel > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>Minus Kabel Asli</span><span>- Rp {rincian.potKabel.toLocaleString('id-ID')}</span></div>}
                    
                    {rincian.potTrueTone > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>True Tone Mati (-10%)</span><span>- Rp {rincian.potTrueTone.toLocaleString('id-ID')}</span></div>}
                    {rincian.potFaceId > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>Face ID Mati (-15%)</span><span>- Rp {rincian.potFaceId.toLocaleString('id-ID')}</span></div>}
                    
                    {rincian.potKeyboard > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>Keyboard Error (-10%)</span><span>- Rp {rincian.potKeyboard.toLocaleString('id-ID')}</span></div>}
                    {rincian.potLayarMinus > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>Layar Minus (-20%)</span><span>- Rp {rincian.potLayarMinus.toLocaleString('id-ID')}</span></div>}
                    {rincian.potPort > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>Port/Speaker Minus (-5%)</span><span>- Rp {rincian.potPort.toLocaleString('id-ID')}</span></div>}

                    {rincian.potLayarShadow > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>Layar Shadow/Burn-in (-25%)</span><span>- Rp {rincian.potLayarShadow.toLocaleString('id-ID')}</span></div>}
                    {rincian.potTouchscreen > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>Touch Error (-15%)</span><span>- Rp {rincian.potTouchscreen.toLocaleString('id-ID')}</span></div>}

                    {rincian.potBaterai > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>Baterai Drop/Service (-15%)</span><span>- Rp {rincian.potBaterai.toLocaleString('id-ID')}</span></div>}
                    {rincian.potFisik > 0 && <div className="flex justify-between text-sm text-rose-500 font-medium"><span>{rincian.namaFisik}</span><span>- Rp {rincian.potFisik.toLocaleString('id-ID')}</span></div>}
                    
                    {rincian.totalPotongan === 0 && !rincian.tolakGadai && <div className="text-center text-sm text-emerald-500 italic py-2 bg-emerald-50/50 rounded-xl">✨ Barang lengkap dan kondisi sempurna.</div>}
                  </div>

                  {rincian.totalPotongan > 0 && !rincian.tolakGadai && (
                    <div className="flex justify-between text-sm font-bold text-slate-600 mt-2">
                      <span>Total Pemotongan</span><span>- Rp {rincian.totalPotongan.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                </div>

                {rincian.tolakGadai ? (
                  <div className="bg-rose-50 p-5 md:p-6 rounded-3xl text-center border border-rose-200">
                    <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-2">Peringatan Sistem</p>
                    <p className="text-2xl md:text-3xl font-black text-rose-600 tracking-tight">TOLAK GADAI</p>
                    <p className="text-sm font-medium text-rose-500 mt-2">iCloud Terkunci / Indikasi Barang Curian</p>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-5 md:p-6 rounded-3xl text-center shadow-lg shadow-indigo-200">
                    <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2 opacity-90">Taksiran Bersih Diterima</p>
                    <p className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-sm">Rp {rincian.bersih.toLocaleString('id-ID')}</p>
                  </div>
                )}
              </div>
            )}
            
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 bg-slate-100 text-slate-500 hover:bg-rose-500 hover:text-white w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors z-10 shadow-sm">
              ✕
            </button>
          </div>
        </div>
      )}
    </main>
  );
}