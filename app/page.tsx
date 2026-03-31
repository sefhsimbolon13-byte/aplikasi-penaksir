'use client';

import { useState, useEffect } from 'react';
import { useHpsStore } from '../store/useHpsStore';
import Papa from 'papaparse';

// IMPORT UTILS
import { hitungTaksiran } from '../utils/kalkulasi';
import { generateTeksWAMo } from '../utils/formatWA';

// IMPORT COMPONENTS
import Header from '../components/Header';
import UploadCSV from '../components/UploadCSV';
import TabelBarang from '../components/TabelBarang';

// IMPORT MODALS
import SopModal from '../components/modals/SopModal';
import RiwayatModal from '../components/modals/RiwayatModal';
import PengaturanModal from '../components/modals/PengaturanModal';
import MoModal from '../components/modals/MoModal';
import KalkulatorModal from '../components/modals/KalkulatorModal';

export default function Home() {
  const { hpsData, setHpsData } = useHpsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // MODAL STATES
  const [showSopModal, setShowSopModal] = useState(false);
  const [showRiwayatModal, setShowRiwayatModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMoModal, setShowMoModal] = useState(false);

  // DATA STATES
  const [riwayat, setRiwayat] = useState<any[]>([]);
  const [profil, setProfil] = useState({ cabang: 'BGI 16', penaksir: 'Yosefh', saksi: 'Andre', pemutus: '@~Maret @~Togong U Sembiring' });
  const [moForm, setMoForm] = useState({ namaBarang: '', tipeJenis: '', kondisi: '', kelengkapan: '', permintaan: '', taksiran: '' });
  const [kondisi, setKondisi] = useState({ batangan: false, noAdaptor: false, noKabel: false, bateraiDrop: false, fisik: 'mulus', noTrueTone: false, noFaceId: false, bhService: false, icloudTerkunci: false, keyboardError: false, layarMinus: false, portError: false, layarShadow: false, touchscreenError: false });

  useEffect(() => {
    const p = localStorage.getItem('profilBGI'); if (p) setProfil(JSON.parse(p));
    const r = localStorage.getItem('riwayatBGI'); if (r) setRiwayat(JSON.parse(r));
  }, []);

  // LOGIC FUNCTIONS
// LOGIC FUNCTIONS
  const handleFileUpload = (e: any) => {
    const file = e.target.files?.[0]; 
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text !== 'string') return; // Memastikan data murni string biar TypeScript gak marah

      // Mengembalikan fitur pintar pendeteksi baris judul HPS
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
        complete: (res: any) => {
          const parsed = res.data.map((row: any) => ({
            group: row.GROUP || row.JENIS || '', 
            merek: row.MEREK || row.MERK || '',
            tipe: row.TYPE || row.TIPE || '', 
            hps: row.HPS || row.HARGA || '0',
            keterangan: row.KET || row.GRAM || row.SYARAT || ''
          }));
          setHpsData([...hpsData, ...parsed]); 
          alert("Database HPS berhasil di-update!");
        }
      });
    };
    reader.readAsText(file);
  };

  const simpanKeRiwayat = (nama: string, harga: number) => {
    const newR = [{ id: Date.now(), waktu: new Date().toLocaleTimeString('id-ID'), nama, harga }, ...riwayat];
    setRiwayat(newR); localStorage.setItem('riwayatBGI', JSON.stringify(newR)); alert("Disimpan!");
  };

  const copyToWAMo = () => {
    const txt = generateTeksWAMo(profil, moForm);
    navigator.clipboard.writeText(txt).then(() => { alert("Format WA Disalin!"); setShowMoModal(false); });
  };

  const filteredData = hpsData.filter(i => `${i.merek} ${i.tipe}`.toLowerCase().includes(searchQuery.toLowerCase()));
  const calcResult = hitungTaksiran(selectedItem, kondisi);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white p-5 md:p-8 rounded-3xl shadow-xl border border-slate-100">
        <Header setShowRiwayatModal={setShowRiwayatModal} setShowMoModal={setShowMoModal} setShowSettingsModal={setShowSettingsModal} setShowSopModal={setShowSopModal} />
        <UploadCSV handleFileUpload={handleFileUpload} hpsDataLength={hpsData.length} handleResetData={() => setHpsData([])} />
        <TabelBarang searchQuery={searchQuery} setSearchQuery={setSearchQuery} filteredData={filteredData} handleTaksir={setSelectedItem} setShowMoModal={setShowMoModal} />
      </div>

      {/* RENDER SEMUA MODAL */}
      {showSopModal && <SopModal setShowSopModal={setShowSopModal} />}
      {showRiwayatModal && <RiwayatModal riwayat={riwayat} hapusRiwayat={() => setRiwayat([])} setShowRiwayatModal={setShowRiwayatModal} />}
      {showSettingsModal && <PengaturanModal profil={profil} setProfil={setProfil} handleSaveProfil={() => {localStorage.setItem('profilBGI', JSON.stringify(profil)); setShowSettingsModal(false);}} setShowSettingsModal={setShowSettingsModal} />}
      {showMoModal && <MoModal moForm={moForm} setMoForm={setMoForm} handleFormatRupiahMO={(f, v) => setMoForm({...moForm, [f]: v})} copyToWAMo={copyToWAMo} setShowMoModal={setShowMoModal} />}
      {selectedItem && <KalkulatorModal selectedItem={selectedItem} kondisi={kondisi} setKondisi={setKondisi} rincian={calcResult?.rincian} isIphone={calcResult?.isIphone || false} isLaptop={calcResult?.isLaptop || false} isAndroid={calcResult?.isAndroid || false} simpanKeRiwayat={simpanKeRiwayat} onClose={() => setSelectedItem(null)} />}
    </main>
  );
}