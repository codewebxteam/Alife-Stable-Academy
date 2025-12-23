import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Briefcase, BarChart3, ArrowUpRight, Trash2, ShieldX } from "lucide-react";

// --- Sub-Component: StatCard ---
const StatCard = ({ title, val }) => (
  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
    <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{val}</h3>
    <div className="mt-4 flex items-center gap-2 text-emerald-500 font-bold text-xs">
      <ArrowUpRight size={14} /> +12% growth
    </div>
  </div>
);

const IntelligenceHub = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: <BarChart3 size={16} /> },
    { id: "partners", label: "Partners", icon: <Briefcase size={16} /> },
    { id: "students", label: "Students", icon: <Users size={16} /> },
  ];

  return (
    <div className="space-y-8">
      {/* Tabs Navigation */}
      <div className="flex p-1 bg-white rounded-2xl border border-slate-100 shadow-sm w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Total Platform Revenue" val="₹12,45,000" />
              <StatCard title="Active Partners" val="48" />
              <StatCard title="Total Students" val="1,250" />
            </div>
          )}

          {activeTab === "partners" && (
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center text-slate-900">
                <h3 className="text-xl font-black uppercase tracking-tighter">Partner Network</h3>
                <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Add Partner</button>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-10 py-6">Partner</th>
                    <th className="px-10 py-6">Domain</th>
                    <th className="px-10 py-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-10 py-7 font-bold text-slate-800">Tech Academy</td>
                    <td className="px-10 py-7 text-xs font-mono text-indigo-600">tech.alifestable.com</td>
                    <td className="px-10 py-7 flex gap-3">
                       <button className="p-2 bg-red-50 text-red-500 rounded-lg" title="Block Partner"><ShieldX size={16}/></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "students" && (
            <div className="bg-white p-20 rounded-[40px] border border-slate-100 text-center shadow-sm">
              <div className="size-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-400 font-bold italic uppercase text-xs tracking-widest">Syncing Student Data...</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default IntelligenceHub;