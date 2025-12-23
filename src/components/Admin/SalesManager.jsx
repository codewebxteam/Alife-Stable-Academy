 import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  ArrowUpRight, 
  Search, 
  Filter, 
  ShoppingCart, 
  BookOpen, 
  GraduationCap,
  ExternalLink
} from "lucide-react";

// --- Reusable StatCard (Consistency with IntelligenceHub) ---
const StatCard = ({ title, val, color = "indigo" }) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex-1">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{val}</h3>
  </div>
);

const SalesManager = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [salesType, setSalesType] = useState("direct"); // overview sub-tabs: direct | partner

  const tabs = [
    { id: "overview", label: "Sales Overview", icon: <TrendingUp size={16} /> },
    { id: "partners", label: "Partner Sales", icon: <Briefcase size={16} /> },
    { id: "students", label: "Student History", icon: <Users size={16} /> },
  ];

  return (
    <div className="space-y-8">
      {/* --- TOP HEADER & TOTAL --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <div>
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Global Sales Ledger</h3>
          <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest italic">Real-time revenue auditing</p>
        </div>
        <div className="p-6 bg-slate-950 text-white rounded-[32px] flex flex-col items-end shadow-xl shadow-slate-200">
          <span className="text-[10px] font-black text-slate-400 uppercase">Gross Platform Sales</span>
          <span className="text-3xl font-black text-emerald-400 tracking-tighter">₹4,82,900</span>
        </div>
      </div>

      {/* --- TAB NAVIGATION --- */}
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
          className="space-y-6"
        >
          {/* --- TAB 1: OVERVIEW --- */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Courses Sold" val="342 Units" />
                <StatCard title="Total E-Books Sold" val="892 Units" />
                <StatCard title="Direct Revenue" val="₹1,24,000" />
              </div>

              <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                  {/* Inner Sub-Tabs */}
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button 
                      onClick={() => setSalesType("direct")}
                      className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${salesType === "direct" ? "bg-white text-slate-950 shadow-sm" : "text-slate-400"}`}
                    >
                      Direct Sales
                    </button>
                    <button 
                      onClick={() => setSalesType("partner")}
                      className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${salesType === "partner" ? "bg-white text-slate-950 shadow-sm" : "text-slate-400"}`}
                    >
                      Via Partner
                    </button>
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase italic">
                    Showing Last 5 Transaction Logs
                  </div>
                </div>

                {/* Scroller Container */}
                <div className="overflow-y-auto max-h-[400px] custom-scrollbar selection:bg-indigo-100">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10 border-b border-slate-100">
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="px-10 py-5">Asset Intelligence</th>
                        <th className="px-10 py-5">Source / Partner</th>
                        <th className="px-10 py-5 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <tr key={item} className="hover:bg-slate-50/50 transition-all group">
                          <td className="px-10 py-7">
                            <div className="flex items-center gap-4">
                              <div className="size-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                {item % 2 === 0 ? <GraduationCap size={18}/> : <BookOpen size={18}/>}
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-800">React Mastery Pro</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{item % 2 === 0 ? "Course" : "E-Book"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-7">
                            {salesType === "direct" ? (
                              <span className="text-[10px] font-black text-emerald-500 uppercase px-3 py-1 bg-emerald-50 rounded-lg">Direct Acquisition</span>
                            ) : (
                              <div>
                                <p className="text-xs font-black text-slate-800 tracking-tight">TechAcademy Pro</p>
                                <p className="text-[9px] font-bold text-indigo-500 uppercase">ID: PART-99201</p>
                              </div>
                            )}
                          </td>
                          <td className="px-10 py-7 text-right font-black text-slate-950">₹2,499</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --- TAB 2: PARTNER --- */}
          {activeTab === "partners" && (
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50">
                <h4 className="text-xl font-black text-slate-900 uppercase">Partner Attribution Feed</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase">
                    <tr>
                      <th className="px-10 py-6">Partner Identity</th>
                      <th className="px-10 py-6">Student Info</th>
                      <th className="px-10 py-6">Asset Sold</th>
                      <th className="px-10 py-6 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <tr className="hover:bg-slate-50/50 transition-all">
                      <td className="px-10 py-7">
                        <p className="text-sm font-black text-slate-800">DesignHub Agency</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">DH-102</p>
                      </td>
                      <td className="px-10 py-7">
                        <p className="text-xs font-bold text-slate-800">Amit Sharma</p>
                        <p className="text-[9px] text-slate-400 font-medium">amit.sh@example.com</p>
                      </td>
                      <td className="px-10 py-7">
                        <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded">UI/UX Masterclass</span>
                      </td>
                      <td className="px-10 py-7 text-right text-[10px] font-bold text-slate-400 uppercase">
                        24 Dec, 10:45 AM
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- TAB 3: STUDENTS --- */}
          {activeTab === "students" && (
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-10">
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-[32px]">
                <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <Users className="text-slate-200" size={40} />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Student Purchase Intelligence</h3>
                <p className="text-sm text-slate-400 font-medium italic mt-2">Syncing global student acquisition data...</p>
                <button className="mt-8 px-8 py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200">
                  Generate Full Ledger
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default SalesManager;