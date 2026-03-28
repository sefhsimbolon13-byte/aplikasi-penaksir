'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { useHpsStore } from '../store/useHpsStore';

export default function Home() {
  const { hpsData, setHpsData } = useHpsStore();
  const [fileName, setFileName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [kondisi, setKondisi] = useState({
    batangan: false,        
    noAdaptor: false,       
    noKabel: false,         
    bateraiDrop: false,     
    fisik: 'mulus',         
  });

  // ==========================================
  // LOGIKA UPLOAD KHUSUS HP (Anti Blokir Jaringan)
  // ==========================================
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onerror = () => {
      alert("⚠️ Browser HP menolak membaca file ini (Akses Ditolak).");
      event.target.value = '';
    };

    reader.onload = (e) => {
      const text = e.target?.result as string;
      
      // SENSOR DEBUG: Cek isi asli file di HP
      if (!text || text.trim() === '') {
        alert("⚠️ GAGAL: Browser HP berhasil buka file, tapi isinya dianggap KOSONG (0 huruf). Pastikan file CSV tidak rusak.");
        event.target.value = '';
        return;
      }

      // Memunculkan cuplikan isi file untuk bukti bahwa HP berhasil baca teksnya
      alert(`✅ SENSOR HP TEMBUS!\n\nCuplikan isi file CSV Lae:\n${text.substring(0, 80)}...`);

      const lines = text.split(/\r\n|\n|\r/);
      let bestScore = 0;
      let headerIndex = 0;
      const keywords = ['NO', 'GROUP', 'JENIS', 'MEREK', 'MERK', 'TYPE', 'TIPE', 'HPS', 'HARGA'];

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
        delimiter: ";", // INI KUNCI RAHASIANYA LAE (TITIK KOMA)
        complete: (results) => {
          const actualHeaders = results.meta.fields || [];
          
          const findCol = (synonyms: string[]) => {
            const found = actualHeaders.find(header => 
              synonyms.some(syn => header.trim().toUpperCase().includes(syn))
            );
            return found || ''; 
          };

          const colGroup = findCol(['GROUP']);
          const colMerek = findCol(['MEREK', 'MERK']);
          const colTipe = findCol(['TYPE', 'TIPE']); 
          const colHarga = findCol(['HPS', 'HARGA']);
          const colKet = findCol(['KET']);

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

          if (parsedData.length === 0) {
            alert("⚠️ File terbaca, tapi datanya nol. Cek lagi format tabelnya.");
            event.target.value = '';
            return;
          }
          
          setHpsData([...hpsData, ...parsedData]); 
          alert(`Berhasil merapikan ${parsedData.length} data ke dalam tabel aplikasi!`);
          event.target.value = '';
        }
      });
    };
    
    // Pakai metode baca yang paling ramah HP
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
    setKondisi({ batangan: false, noAdaptor: false, noKabel: false, bateraiDrop: false, fisik: 'mulus' });
  };

  const hitungRincianTaksiran = () => {
    if (!selectedItem) return null;
    let hargaDasar = Number(selectedItem.hps);
    if (isNaN(hargaDasar)) return null; 

    let rincian = {
      dasar: hargaDasar,
      potBatangan: 0,
      potAdaptor: 0,
      potKabel: 0,
      potBaterai: 0,
      potFisik: 0,
      namaFisik: '',
      totalPotongan: 0,
      bersih: 0
    };
    
    if (kondisi.batangan) rincian.potBatangan = hargaDasar * 0.10; 
    if (kondisi.noAdaptor) rincian.potAdaptor = 150000; 
    if (kondisi.noKabel) rincian.potKabel = 100000;   
    if (kondisi.bateraiDrop) rincian.potBaterai = hargaDasar * 0.15; 

    if (kondisi.fisik === 'lecet') {
      rincian.potFisik = hargaDasar * 0.05;
      rincian.namaFisik = 'Lecet Pemakaian (-5%)';
    } else if (kondisi.fisik === 'dent') {
      rincian.potFisik = hargaDasar * 0.15;
      rincian.namaFisik = 'Dent/Penyok (-15%)';
    } else if (kondisi.fisik === 'layar') {
      rincian.potFisik = hargaDasar * 0.25;
      rincian.namaFisik = 'Layar Retak/Shadow (-25%)';
    }

    rincian.totalPotongan = rincian.potBatangan + rincian.potAdaptor + rincian.potKabel + rincian.potBaterai + rincian.potFisik;
    rincian.bersih = rincian.dasar - rincian.totalPotongan;
    
    if (rincian.bersih < 0) rincian.bersih = 0;

    return rincian;
  };

  const rincian = hitungRincianTaksiran();

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 relative">
      <div className="max-w-5xl mx-auto bg-white p-4 md:p-6 rounded-xl shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">Asisten Penaksir Pintar</h1>
        <p className="text-sm md:text-base text-gray-500 mb-6">Sistem estimasi harga gadai otomatis (Standar Nasional)</p>
        
        <div className="mb-6 p-4 md:p-6 border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg text-center relative">
           <label className="block text-sm font-medium text-blue-800 mb-3">Upload File HPS (.CSV)</label>
           <div className="overflow-hidden">
             <input type="file" accept=".csv" onChange={handleFileUpload} className="block w-full max-w-sm mx-auto text-xs md:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs md:file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" />
           </div>
           
           {hpsData.length > 0 && (
             <div className="mt-4 flex flex-col items-center">
               <p className="text-sm font-semibold text-green-600 mb-2">✅ Total Data: {hpsData.length} item</p>
               <button onClick={handleResetData} className="text-xs bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200 transition font-bold shadow-sm">Kosongkan Semua Data</button>
             </div>
           )}
        </div>

        {hpsData.length > 0 && (
          <div className="mt-6 md:mt-8 border-t-2 border-gray-100 pt-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Cari Barang Gadai</h2>
            <input type="text" placeholder="Ketik tipe HP/Laptop... (Contoh: A01 Core)" className="w-full p-3 md:p-4 border-2 border-blue-200 rounded-lg text-base md:text-lg focus:outline-none focus:border-blue-500 mb-4 shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
              <table className="w-full text-xs md:text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-blue-50 whitespace-nowrap">
                  <tr>
                    <th className="px-4 py-3 md:px-6 md:py-4">Merek / Kategori</th>
                    <th className="px-4 py-3 md:px-6 md:py-4 min-w-[200px]">Tipe Barang</th>
                    <th className="px-4 py-3 md:px-6 md:py-4">HPS Maksimal</th>
                    <th className="px-4 py-3 md:px-6 md:py-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? filteredData.slice(0, 15).map((item, index) => (
                      <tr key={index} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-4 py-3 md:px-6 md:py-4 font-medium text-gray-900 whitespace-nowrap">{item.merek} <span className="text-[10px] md:text-xs text-gray-400 block">{item.group}</span></td>
                        <td className="px-4 py-3 md:px-6 md:py-4 font-semibold text-blue-800">{item.tipe}</td>
                        <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                          <span className={`text-xs md:text-sm font-medium px-2 py-1 md:px-3 md:py-1 rounded-full ${isNaN(Number(item.hps)) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {isNaN(Number(item.hps)) ? item.hps : `Rp ${Number(item.hps).toLocaleString('id-ID')}`}
                          </span>
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                          <button onClick={() => handleTaksir(item)} className="bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded shadow hover:bg-blue-700 transition text-xs md:text-sm font-semibold">Taksir</button>
                        </td>
                      </tr>
                    ))
                  : <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">Pencarian "{searchQuery}" tidak ditemukan.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-2 md:p-4 z-50">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto p-4 md:p-6 relative flex flex-col md:flex-row gap-4 md:gap-6">
            
            <div className="flex-1 mt-4 md:mt-0">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 pr-8">Kalkulasi Taksiran</h3>
              <p className="text-blue-600 font-semibold mb-4 text-xs md:text-sm">{selectedItem.merek} - {selectedItem.tipe}</p>
              
              {isNaN(Number(selectedItem.hps)) ? (
                <div className="bg-red-100 p-3 md:p-4 rounded-lg text-center border border-red-300">
                  <p className="text-red-700 font-bold text-base md:text-lg">⚠️ BARANG {selectedItem.hps}</p>
                  <p className="text-red-600 text-xs md:text-sm mt-1">Sesuai HPS, barang ini tidak bisa digadai.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <p className="font-semibold text-sm md:text-base text-gray-700 border-b pb-1 md:pb-2 mb-2">Kelengkapan & Fungsi:</p>
                      <label className="flex items-center space-x-3 cursor-pointer p-1.5 md:p-2 hover:bg-gray-50 rounded"><input type="checkbox" checked={kondisi.batangan} onChange={(e) => setKondisi({...kondisi, batangan: e.target.checked})} className="w-4 h-4 md:w-5 md:h-5 text-blue-600 rounded" /><span className="text-sm md:text-base text-gray-700 font-medium">Dusbuk Hilang (Batangan)</span></label>
                      <label className="flex items-center space-x-3 cursor-pointer p-1.5 md:p-2 hover:bg-gray-50 rounded"><input type="checkbox" checked={kondisi.noAdaptor} onChange={(e) => setKondisi({...kondisi, noAdaptor: e.target.checked})} className="w-4 h-4 md:w-5 md:h-5 text-blue-600 rounded" /><span className="text-sm md:text-base text-gray-700 font-medium">Tanpa Kepala Adaptor</span></label>
                      <label className="flex items-center space-x-3 cursor-pointer p-1.5 md:p-2 hover:bg-gray-50 rounded"><input type="checkbox" checked={kondisi.noKabel} onChange={(e) => setKondisi({...kondisi, noKabel: e.target.checked})} className="w-4 h-4 md:w-5 md:h-5 text-blue-600 rounded" /><span className="text-sm md:text-base text-gray-700 font-medium">Tanpa Kabel Data Asli</span></label>
                      <label className="flex items-center space-x-3 cursor-pointer p-1.5 md:p-2 hover:bg-gray-50 rounded"><input type="checkbox" checked={kondisi.bateraiDrop} onChange={(e) => setKondisi({...kondisi, bateraiDrop: e.target.checked})} className="w-4 h-4 md:w-5 md:h-5 text-blue-600 rounded" /><span className="text-sm md:text-base text-gray-700 font-medium">Baterai Drop (&lt; 80%)</span></label>
                    </div>

                    <div>
                      <p className="font-semibold text-sm md:text-base text-gray-700 border-b pb-1 md:pb-2 mb-2 mt-2 md:mt-4">Kondisi Fisik & Layar:</p>
                      <select value={kondisi.fisik} onChange={(e) => setKondisi({...kondisi, fisik: e.target.value})} className="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base text-gray-700 focus:outline-none focus:border-blue-500 font-medium bg-white shadow-sm">
                        <option value="mulus">🟢 Mulus / Like New</option>
                        <option value="lecet">🟡 Lecet Pemakaian Wajar</option>
                        <option value="dent">🟠 Dent / Penyok / Sompel</option>
                        <option value="layar">🔴 Layar Shadow / Retak</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>

            {!isNaN(Number(selectedItem.hps)) && rincian && (
              <div className="flex-1 bg-gray-50 p-4 md:p-5 rounded-xl border border-gray-200 flex flex-col justify-between mt-2 md:mt-0">
                <div>
                  <h4 className="font-bold text-gray-700 border-b-2 border-gray-300 pb-2 mb-3 text-center text-sm md:text-base">Rincian Taksiran Sistem</h4>
                  <div className="flex justify-between text-xs md:text-sm mb-2"><span className="text-gray-500">HPS Dasar (Mulus)</span><span className="font-bold text-gray-800">Rp {rincian.dasar.toLocaleString('id-ID')}</span></div>
                  <div className="space-y-1 my-2 md:my-3 border-t border-b border-dashed border-gray-300 py-2 md:py-3">
                    {rincian.potBatangan > 0 && <div className="flex justify-between text-xs md:text-sm text-red-600"><span>Minus Dusbuk (-10%)</span><span>- Rp {rincian.potBatangan.toLocaleString('id-ID')}</span></div>}
                    {rincian.potAdaptor > 0 && <div className="flex justify-between text-xs md:text-sm text-red-600"><span>Minus Adaptor</span><span>- Rp {rincian.potAdaptor.toLocaleString('id-ID')}</span></div>}
                    {rincian.potKabel > 0 && <div className="flex justify-between text-xs md:text-sm text-red-600"><span>Minus Kabel Asli</span><span>- Rp {rincian.potKabel.toLocaleString('id-ID')}</span></div>}
                    {rincian.potBaterai > 0 && <div className="flex justify-between text-xs md:text-sm text-red-600"><span>Minus Baterai (-15%)</span><span>- Rp {rincian.potBaterai.toLocaleString('id-ID')}</span></div>}
                    {rincian.potFisik > 0 && <div className="flex justify-between text-xs md:text-sm text-red-600"><span>{rincian.namaFisik}</span><span>- Rp {rincian.potFisik.toLocaleString('id-ID')}</span></div>}
                    {rincian.totalPotongan === 0 && <div className="text-center text-xs md:text-sm text-green-600 italic py-1">Barang lengkap dan mulus.</div>}
                  </div>
                  {rincian.totalPotongan > 0 && <div className="flex justify-between text-xs md:text-sm font-semibold text-gray-600 mb-3 md:mb-4"><span>Total Potongan</span><span>- Rp {rincian.totalPotongan.toLocaleString('id-ID')}</span></div>}
                </div>
                <div className="bg-blue-100 p-3 md:p-4 rounded-lg text-center mt-auto border-2 border-blue-200 shadow-inner">
                  <p className="text-[10px] md:text-xs text-blue-800 font-bold mb-1 uppercase tracking-wider">Taksiran Bersih Diterima</p>
                  <p className="text-xl md:text-3xl font-black text-blue-700">Rp {rincian.bersih.toLocaleString('id-ID')}</p>
                </div>
              </div>
            )}
            
            <button onClick={() => setSelectedItem(null)} className="absolute top-2 right-2 md:-top-3 md:-right-3 bg-red-100 md:bg-red-500 text-red-600 md:text-white hover:bg-red-200 md:hover:bg-red-600 w-8 h-8 md:w-10 md:h-10 rounded-full shadow-sm md:shadow-lg flex items-center justify-center font-bold transition">X</button>
          </div>
        </div>
      )}
    </main>
  );
}