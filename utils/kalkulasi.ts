export const hitungTaksiran = (selectedItem: any, kondisi: any) => {
  if (!selectedItem) return null;
  let hargaDasar = Number(selectedItem.hps);
  if (isNaN(hargaDasar)) return null;

  const namaGabungan = `${selectedItem.merek} ${selectedItem.tipe}`.toLowerCase();
  const isIphone = namaGabungan.includes('iphone');
  const isLaptop = namaGabungan.includes('macbook') || namaGabungan.includes('laptop') ||
    namaGabungan.includes('asus') || namaGabungan.includes('acer') ||
    namaGabungan.includes('lenovo') || namaGabungan.includes('hp ') ||
    namaGabungan.includes('msi') || namaGabungan.includes('rog');
  const isAndroid = !isIphone && !isLaptop;

  let rincian = {
    dasar: hargaDasar,
    potBatangan: 0, potAdaptor: 0, potKabel: 0, potBaterai: 0, potFisik: 0,
    potTrueTone: 0, potFaceId: 0, potKeyboard: 0, potLayarMinus: 0, potPort: 0,
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
  } else if (isLaptop) {
    if (kondisi.bateraiDrop) rincian.potBaterai = hargaDasar * 0.15;
    if (kondisi.keyboardError) rincian.potKeyboard = hargaDasar * 0.10;
    if (kondisi.layarMinus) rincian.potLayarMinus = hargaDasar * 0.20;
    if (kondisi.portError) rincian.potPort = hargaDasar * 0.05;
  } else if (isAndroid) {
    if (kondisi.bateraiDrop) rincian.potBaterai = hargaDasar * 0.15;
    if (kondisi.layarShadow) rincian.potLayarShadow = hargaDasar * 0.25;
    if (kondisi.touchscreenError) rincian.potTouchscreen = hargaDasar * 0.15;
  }

  if (kondisi.fisik === 'mulus') {
    rincian.potFisik = hargaDasar * 0.00;
    rincian.namaFisik = 'Mulus / Like New';
  } else if (kondisi.fisik === 'lecet') {
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

  return { rincian, isIphone, isLaptop, isAndroid };
};

// KAMUS KASTA MEREK (Tier System)
export const getPlafonMerek = (namaBarang: string) => {
  const nama = namaBarang.toLowerCase();
  
  // KASTA ATAS (Plafon 60%)
  const kastaAtas = ['apple', 'iphone', 'macbook', 'rog', 'samsung s', 'samsung z', 'samsung flip', 'samsung fold'];
  if (kastaAtas.some(kw => nama.includes(kw))) {
    return { persen: 0.60, label: '🌟 Kasta Atas (Stabil)', warna: 'text-emerald-600' };
  }

  // KASTA BAWAH / RAWAN (Plafon 50%)
  const kastaBawah = ['axioo', 'advan', 'infinix', 'itel', 'tecno', 'evercoss', 'zyrex', 'pongo'];
  if (kastaBawah.some(kw => nama.includes(kw))) {
    return { persen: 0.50, label: '⚠️ Kasta Bawah (Anjlok)', warna: 'text-rose-600' };
  }

  // KASTA MENENGAH (Plafon 55%) - Default untuk merek lainnya (Oppo, Vivo, Xiaomi, dll)
  return { persen: 0.55, label: '⭐ Kasta Menengah (Standar)', warna: 'text-amber-600' };
};