import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Ini cetakan bentuk data HPS kita
interface HpsItem {
  group: string;
  merek: string;
  tipe: string;
  hps: string | number;
  keterangan: string;
}

interface HpsStore {
  hpsData: HpsItem[];
  setHpsData: (data: HpsItem[]) => void;
}

// Fungsi create sekarang dibungkus dengan persist
export const useHpsStore = create<HpsStore>()(
  persist(
    (set) => ({
      hpsData: [],
      setHpsData: (data) => set({ hpsData: data }),
    }),
    {
      name: 'budi-gadai-hps-storage', // Ini nama rahasia untuk menyimpan data di memori browser
    }
  )
);