import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  Globe,
  GraduationCap,
  CreditCard,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  History,
  ShoppingBag,
  PackageCheck,
  Calendar,
  Hash,
  CheckCircle2,
} from "lucide-react";

const PartnerProfile = ({ partner, onClose }) => {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'history'

  // Purchase History State
  // Default to empty array if no history exists
  const [history] = useState(
    partner.purchaseHistory || partner.payoutHistory || []
  );

  // Pagination Settings
  const [histPage, setHistPage] = useState(1);
  const itemsPerPage = 5; // 5 items per page

  // Pagination Logic
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const currentHistory = history.slice(
    (histPage - 1) * itemsPerPage,
    histPage * itemsPerPage
  );

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: 20 }}
      className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl relative z-50 overflow-hidden flex flex-col max-h-[90vh]"
    >
      {/* --- HEADER: IDENTITY SECTION --- */}
      <div className="bg-slate-950 text-white p-8 sm:p-10 relative overflow-hidden flex-shrink-0">
        <div className="relative z-10 flex justify-between items-start">
          <div className="flex items-center gap-8">
            {/* Avatar / Logo */}
            <div className="size-24 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-4xl font-black shadow-2xl shadow-indigo-500/30 border-4 border-white/10">
              {partner.agency[0]}
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h2 className="text-4xl font-black uppercase tracking-tighter">
                  {partner.agency}
                </h2>
                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    partner.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}
                >
                  {partner.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-400">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <User size={14} className="text-indigo-400" />
                  <span className="text-slate-300">{partner.owner}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Mail size={14} className="text-indigo-400" />
                  <span className="text-slate-300">{partner.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Phone size={14} className="text-indigo-400" />
                  <span className="text-slate-300">{partner.phone}</span>
                </div>
                {partner.domain && (
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Globe size={14} className="text-indigo-400" />
                    <span className="text-slate-300">{partner.domain}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -right-24 size-96 bg-indigo-600/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-slate-800/20 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* --- TABS NAVIGATION --- */}
      <div className="px-10 pt-8 pb-4 bg-[#F8FAFC] border-b border-slate-100/50">
        <div className="flex gap-2 p-1.5 bg-white border border-slate-100 rounded-2xl w-fit shadow-sm">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "overview"
                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
          >
            <TrendingUp size={14} /> Agency Overview
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "history"
                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
          >
            <History size={14} /> Purchase History
          </button>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="p-10 overflow-y-auto custom-scrollbar flex-1 bg-[#F8FAFC]">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 h-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatBox
                label="Courses Purchased"
                val={partner.sales.courses}
                icon={<GraduationCap size={20} />}
                color="blue"
                subText="Core Assets"
              />
              <StatBox
                label="E-Books Purchased"
                val={partner.sales.ebooks}
                icon={<CreditCard size={20} />}
                color="orange"
                subText="Digital Assets"
              />
              <StatBox
                label="Total Lifetime Spend"
                val={`₹${partner.financials.generated.toLocaleString()}`}
                icon={<ShoppingBag size={20} />}
                color="emerald"
                subText="Total Volume"
              />
            </div>

            {/* Empty State / Info Box */}
            <div className="h-48 rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center p-8">
              <div className="size-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 text-slate-300">
                <PackageCheck size={24} />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Agency Status: {partner.status}
              </h3>
              <p className="text-xs text-slate-400 font-medium max-w-sm mt-2 leading-relaxed">
                This partner actively purchases inventory through the partner
                panel. Check the 'Purchase History' tab for a detailed ledger of
                all transactions.
              </p>
            </div>
          </motion.div>
        )}

        {/* TAB 2: PURCHASE HISTORY (WITH PAGINATION) */}
        {activeTab === "history" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden flex flex-col"
          >
            {/* Table Header */}
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <ShoppingBag size={16} />
                </div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                  Order Ledger
                </h4>
              </div>
              <div className="px-4 py-1.5 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-black text-slate-500 uppercase">
                Total Orders: {history.length}
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto min-h-[350px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    <th className="px-8 py-5">Order ID</th>
                    <th className="px-8 py-5">Date</th>
                    <th className="px-8 py-5">Student / Beneficiary</th>
                    <th className="px-8 py-5">Item Purchased</th>
                    <th className="px-8 py-5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {currentHistory.length > 0 ? (
                    currentHistory.map((txn, i) => (
                      <tr
                        key={i}
                        className="group hover:bg-slate-50/80 transition-all cursor-default"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <Hash size={12} className="text-slate-300" />
                            <span className="text-xs font-black text-slate-700 font-mono">
                              {txn.id || `#ORD-${1000 + i}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-slate-500">
                            <Calendar size={12} className="text-slate-300" />
                            <span className="text-[10px] font-bold uppercase">
                              {txn.date || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-xs font-bold text-slate-800">
                          {txn.studentName || txn.payer || "Unknown Student"}
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wide">
                            <CheckCircle2 size={10} />
                            {txn.item || txn.utr || "Course Bundle"}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <span className="text-sm font-black text-emerald-600 tracking-tight">
                            ₹{(txn.amount || 0).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center justify-center opacity-40">
                          <History size={48} className="text-slate-300 mb-4" />
                          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                            No Purchase History Found
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-5 border-t border-slate-100 bg-white flex justify-between items-center sticky bottom-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">
                  Showing Page{" "}
                  <span className="text-slate-900">{histPage}</span> of{" "}
                  {totalPages}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setHistPage((p) => Math.max(1, p - 1))}
                    disabled={histPage === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronLeft size={14} /> Previous
                  </button>
                  <button
                    onClick={() =>
                      setHistPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={histPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-900 rounded-xl text-[10px] font-black uppercase text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-slate-200"
                  >
                    Next Page <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// --- HELPER COMPONENT: STAT BOX ---
const StatBox = ({ label, val, color, icon, subText }) => {
  const styles = {
    indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
    orange: "bg-orange-50 text-orange-600 ring-orange-100",
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  };
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`size-12 rounded-2xl flex items-center justify-center ring-4 transition-all group-hover:scale-110 ${styles[color]}`}
        >
          {icon}
        </div>
        {subText && (
          <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-black uppercase rounded-lg">
            {subText}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-500 transition-colors">
          {label}
        </p>
        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">
          {val}
        </h4>
      </div>
    </div>
  );
};

export default PartnerProfile;
