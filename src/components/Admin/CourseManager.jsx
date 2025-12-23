import React from "react";
import { Plus, Edit3, Eye } from "lucide-react";

const CourseManager = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className="bg-slate-900 p-10 rounded-[48px] text-white flex flex-col justify-between">
      <div>
        <h2 className="text-3xl font-black tracking-tighter mb-4 uppercase">Academy Inventory</h2>
        <p className="text-slate-400 text-sm font-medium leading-relaxed">Add new training modules or update existing curriculum for students.</p>
      </div>
      <button className="mt-8 flex items-center justify-center gap-2 w-full py-5 bg-[#5edff4] text-slate-950 rounded-[24px] font-black uppercase text-xs tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-[#5edff4]/20">
        <Plus size={18} /> Launch New Course
      </button>
    </div>
    
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <div className="size-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
               <GraduationCap size={24} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 uppercase">React Pro Mastery</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Price: ₹1,499 • 12 Modules</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-900"><Edit3 size={16}/></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default CourseManager;