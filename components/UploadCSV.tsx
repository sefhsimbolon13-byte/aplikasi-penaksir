import React from 'react';

interface UploadCSVProps {
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hpsDataLength: number;
  handleResetData: () => void;
}

export default function UploadCSV({ handleFileUpload, hpsDataLength, handleResetData }: UploadCSVProps) {
  return (
    <div className="mb-8 p-6 md:p-8 border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-2xl text-center relative transition-colors hover:bg-indigo-50">
       <label className="block text-base md:text-lg font-bold text-indigo-900 mb-4">Upload File HPS (.CSV)</label>
       <div className="overflow-hidden flex justify-center">
         <input type="file" accept=".csv" onChange={handleFileUpload} className="block w-full max-w-sm text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:cursor-pointer file:transition-colors file:shadow-md cursor-pointer" />
       </div>
       {hpsDataLength > 0 && (
         <div className="mt-5 flex flex-col items-center">
           <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold mb-3">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             Database Aktif: {hpsDataLength} Item
           </span>
           <button onClick={handleResetData} className="text-xs text-rose-600 font-bold hover:text-rose-800 underline underline-offset-4 transition-colors">Kosongkan Data</button>
         </div>
       )}
    </div>
  );
}