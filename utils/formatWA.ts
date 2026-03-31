export const generateTeksWAMo = (profil: any, moForm: any) => {
  const hour = new Date().getHours();
  let sapaan = 'Pagi';
  if (hour >= 11 && hour <= 14) sapaan = 'Siang';
  else if (hour > 14 && hour <= 18) sapaan = 'Sore';
  else if (hour > 18) sapaan = 'Malam';

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const d = new Date();
  const dateStr = `${days[d.getDay()]} ${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;

  return `Selamat ${sapaan} Bapak/ibu
*IZIN BERTANYA HARGA :*

*Hari/tanggal:* ${dateStr}
📍 *Cabang:* ${profil.cabang}
👫 *Penaksir 1:* ${profil.penaksir}
🗣️ *Saksi:* ${profil.saksi}
🗣️ *Pemutus pinjaman:* ${profil.pemutus}

🔅 *Nama barang jaminan:* ${moForm.namaBarang || '-'}
🔅 *Tipe/jenis:* ${moForm.tipeJenis || '-'}
🔅 *Kondisi:* ${moForm.kondisi || '-'}
🔅 *Kelengkapan:* ${moForm.kelengkapan || '-'}
🔅 *HPS:* Rp.-
🔅 *Harga permintaan nasabah :* Rp. ${moForm.permintaan ? Number(moForm.permintaan.replace(/\D/g, '')).toLocaleString('id-ID') : '-'}
🔅 *Harga taksiran :* Rp.${moForm.taksiran ? Number(moForm.taksiran.replace(/\D/g, '')).toLocaleString('id-ID') : '-'}

Bagaimana bapak/ibu ?

Terima kasih`;
};