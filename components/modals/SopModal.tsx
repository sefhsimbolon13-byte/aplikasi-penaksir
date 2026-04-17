import React, { useState } from 'react';

interface SopModalProps {
  setShowSopModal: (v: boolean) => void;
}

type TabId = 'pengecekan' | 'iphone-guide';

export default function SopModal({ setShowSopModal }: SopModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>('pengecekan');
  const [openStep, setOpenStep] = useState<number | null>(null);

  const iphoneGuides = [
    {
      id: 0,
      icon: '📍',
      title: 'Cara Menonaktifkan Find My iPhone (Lacak iPhone)',
      danger: 'WAJIB NONAKTIF sebelum gadai diterima',
      dangerColor: 'rose',
      steps: [
        'Buka Pengaturan (Settings) di iPhone.',
        'Tap nama akun / profil di paling atas (tempat Akun Apple).',
        'Pilih menu "Find My" (Lacak).',
        'Tap "Find My iPhone" (Lacak iPhone).',
        'Geser toggle "Find My iPhone" ke posisi MATI (abu-abu).',
        'Masukkan kata sandi Apple ID jika diminta.',
        'Konfirmasi dengan tap "Matikan" (Turn Off).',
      ],
      warning: 'Jika toggle tidak bisa digeser atau meminta kata sandi Apple ID yang tidak diketahui pemilik → TOLAK GADAI.',
    },
    {
      id: 1,
      icon: '🔐',
      title: 'Cara Menonaktifkan Perlindungan Perangkat Curian',
      danger: 'Harus nonaktif agar Find My bisa dimatikan',
      dangerColor: 'orange',
      steps: [
        'Buka Pengaturan (Settings).',
        'Pilih "Face ID & Kode Sandi" (Face ID & Passcode).',
        'Masukkan kode sandi iPhone.',
        'Scroll ke bawah, cari "Perlindungan Perangkat Curian" (Stolen Device Protection).',
        'Tap "Matikan Perlindungan" (Turn Off Protection).',
        'Autentikasi dengan Face ID atau Touch ID.',
        'Jika ada penundaan keamanan 1 jam → tunggu atau minta pemilik ke lokasi yang familiar (rumah/kantor).',
      ],
      warning: 'Fitur ini aktif secara otomatis di iOS 17.3+. Harus dinonaktifkan DULU sebelum bisa logout iCloud atau matikan Find My.',
    },
    {
      id: 2,
      icon: '☁️',
      title: 'Cara Logout iCloud (Keluar Akun Apple)',
      danger: 'iPhone harus bersih dari akun sebelum digadai',
      dangerColor: 'blue',
      steps: [
        'Pastikan Stolen Device Protection sudah MATI (langkah sebelumnya).',
        'Buka Pengaturan (Settings).',
        'Tap nama akun / profil di paling atas.',
        'Scroll ke bawah, tap "Keluar" (Sign Out).',
        'Masukkan kata sandi Apple ID.',
        'Tap "Matikan" untuk menonaktifkan Find My (jika belum).',
        'Pilih data apa yang tetap di iPhone (boleh skip semua).',
        'Tap "Keluar" di pojok kanan atas → Konfirmasi "Keluar".',
      ],
      warning: 'Jika tombol "Keluar" tidak muncul atau berwarna abu-abu → kemungkinan ada MDM (Management Profile). Cek di Pengaturan > Umum > VPN & Manajemen Perangkat.',
    },
    {
      id: 3,
      icon: '✅',
      title: 'Cara Verifikasi iPhone Sudah Bersih dari iCloud',
      danger: 'Lakukan ini setelah semua langkah di atas',
      dangerColor: 'green',
      steps: [
        'Buka Pengaturan (Settings).',
        'Pastikan bagian teratas menampilkan "Akun Apple – Masuk untuk mengakses iCloud..." (bukan nama/email).',
        'Pergi ke Pengaturan > Find My (Lacak) → Harus tampil tombol "Lacak iPhone" dalam kondisi MATI.',
        'Coba restart iPhone, pastikan tidak muncul layar aktivasi iCloud.',
        'Dokumentasikan dengan foto layar Pengaturan sebagai bukti.',
      ],
      warning: null,
    },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[80] transition-opacity">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative border border-slate-100">
        
        {/* Header */}
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 pb-4 mb-4 border-b-2 border-slate-100 flex items-center gap-3">
          <span className="text-amber-500">📖</span> Standar Operasional Penaksir
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('pengecekan')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'pengecekan'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            🔍 SOP Pengecekan
          </button>
          <button
            onClick={() => setActiveTab('iphone-guide')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'iphone-guide'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            🍏 Panduan iCloud & Find My
          </button>
        </div>

        {/* Tab: SOP Pengecekan */}
        {activeTab === 'pengecekan' && (
          <div className="space-y-5">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 transition-colors">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-3">🍏 1. Pengecekan iPhone / iPad</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600">
                <li><strong>Cek True Tone:</strong> Tahan ikon Brightness di Control Center. Hilang = LCD Gantian (-10%).</li>
                <li><strong>Cek Face ID:</strong> Coba daftar wajah baru. Gagal = (-15%).</li>
                <li><strong>Battery Health:</strong> Jika tulisan Servis atau &lt; 80% = (-15%).</li>
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
                <li><strong>Cek Keyboard:</strong> Tes di situs Keyboard Tester online (-10%).</li>
                <li><strong>Layar Whitespot:</strong> Cek di background putih polos (-20%).</li>
                <li><strong>MacBook Cycle Count:</strong> Tahan Option &gt; Klik Logo Apple &gt; System Information &gt; Power.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab: iPhone iCloud Guide */}
        {activeTab === 'iphone-guide' && (
          <div className="space-y-4">
            {/* Urutan penting */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
              <span className="text-amber-500 text-xl flex-shrink-0">⚠️</span>
              <div>
                <p className="font-bold text-amber-800 text-sm">Urutan Wajib Diikuti:</p>
                <p className="text-amber-700 text-sm mt-1">
                  1. Nonaktifkan <strong>Stolen Device Protection</strong> dulu →
                  2. Matikan <strong>Find My iPhone</strong> →
                  3. <strong>Logout iCloud</strong> →
                  4. <strong>Verifikasi</strong> bersih
                </p>
              </div>
            </div>

            {iphoneGuides.map((guide) => {
              const isOpen = openStep === guide.id;
              const borderColor = {
                rose: 'border-rose-200 hover:border-rose-400',
                orange: 'border-orange-200 hover:border-orange-400',
                blue: 'border-blue-200 hover:border-blue-400',
                green: 'border-green-200 hover:border-green-400',
              }[guide.dangerColor];
              const badgeBg = {
                rose: 'bg-rose-100 text-rose-700',
                orange: 'bg-orange-100 text-orange-700',
                blue: 'bg-blue-100 text-blue-700',
                green: 'bg-green-100 text-green-700',
              }[guide.dangerColor];

              return (
                <div
                  key={guide.id}
                  className={`bg-slate-50 border-2 rounded-2xl transition-all overflow-hidden ${borderColor}`}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => setOpenStep(isOpen ? null : guide.id)}
                    className="w-full p-4 flex items-start gap-3 text-left"
                  >
                    <span className="text-2xl flex-shrink-0">{guide.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 text-sm md:text-base">{guide.title}</p>
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${badgeBg}`}>
                        {guide.danger}
                      </span>
                    </div>
                    <span className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>

                  {/* Accordion Content */}
                  {isOpen && (
                    <div className="px-4 pb-4 border-t border-slate-200 pt-4">
                      <ol className="space-y-2">
                        {guide.steps.map((step, i) => (
                          <li key={i} className="flex gap-3 text-sm text-slate-700">
                            <span className="flex-shrink-0 w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </span>
                            <span className="pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                      {guide.warning && (
                        <div className="mt-4 bg-rose-50 border border-rose-200 rounded-xl p-3 flex gap-2">
                          <span className="text-rose-500 flex-shrink-0">⚡</span>
                          <p className="text-rose-700 text-xs font-medium">{guide.warning}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Close button */}
        <button
          onClick={() => setShowSopModal(false)}
          className="absolute top-4 right-4 bg-slate-100 text-slate-500 hover:bg-rose-500 hover:text-white w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors"
        >
          ✕
        </button>

        <div className="mt-8 text-center">
          <button
            onClick={() => setShowSopModal(false)}
            className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-900 active:scale-95 transition-all shadow-lg w-full md:w-auto"
          >
            Mengerti & Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
}