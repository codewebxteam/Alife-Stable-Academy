import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, History, Clock, CheckCircle2, Search, ArrowUpRight } from "lucide-react";

const PaymentManager = () => {
  const [paymentTab, setPaymentTab] = useState("payouts"); // payouts | settlements

  return (
    <div className="space-y-8">
      {/* Finance Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Disbursed</p>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter">₹2,84,500</h3>
        </div>
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Requests</p>
          <h3 className="text-3xl font-black text-orange-500 tracking-tighter">₹12,200</h3>
        </div>
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Settlement Cycle</p>
          <h3 className="text-3xl font-black text-indigo-600 tracking-tighter">T+2 Days</h3>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button 
              onClick={() => setPaymentTab("payouts")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${paymentTab === "payouts" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}
            >
              <Clock size={14} /> Partner Payouts
            </button>
            <button 
              onClick={() => setPaymentTab("settlements")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${paymentTab === "settlements" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}
            >
              <CheckCircle2 size={14} /> Settled Logs
            </button>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100 w-full md:w-72">
            <Search size={16} className="text-slate-400" />
            <input type="text" placeholder="Search by ID or Partner..." className="bg-transparent border-none outline-none text-xs font-bold w-full" />
          </div>
        </div>

        {/* Premium Scroller */}
        <div className="overflow-y-auto max-h-[450px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white/95 backdrop-blur-md z-10 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-10 py-6">Transaction Ref</th>
                <th className="px-10 py-6">Partner / Method</th>
                <th className="px-10 py-6 text-center">Audit State</th>
                <th className="px-10 py-6 text-right">Net Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <tr key={item} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-7">
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">#PAY-100{item}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">24 Dec 2023</p>
                  </td>
                  <td className="px-10 py-7">
                    <p className="text-xs font-black text-slate-800 uppercase">TechAcademy Pro</p>
                    <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">UPI / HDFC Bank</p>
                  </td>
                  <td className="px-10 py-7 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${item === 1 ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}>
                      {item === 1 ? "Processing" : "Disbursed"}
                    </span>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <p className="text-base font-black text-slate-900 tracking-tighter">₹12,400</p>
                    <p className="text-[9px] font-bold text-slate-300 uppercase italic">Txn Verified</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default PaymentManager;