import React from "react";
import { BookOpen, Download, Trash2 } from "lucide-react";

const EBookManager = () => (
  <div className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm">
    <div className="flex justify-between items-center mb-10">
      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Digital Library Hub</h3>
      <button className="px-6 py-3 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Upload E-Book</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 relative group">
          <div className="size-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm mb-6">
            <BookOpen size={24} />
          </div>
          <p className="text-xs font-black text-slate-900 uppercase mb-1">Tailwind CSS Guide</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Downloads: 450</p>
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
             <button className="p-2 bg-red-50 text-red-500 rounded-lg"><Trash2 size={14}/></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default EBookManager;