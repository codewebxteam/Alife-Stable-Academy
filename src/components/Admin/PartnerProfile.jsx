import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  Globe,
  Building2,
  GraduationCap,
  CreditCard,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  ShieldCheck,
  History,
  Calendar,
  List,
} from "lucide-react";

const PartnerProfile = ({ partner, onClose, onPaymentComplete }) => {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'history'

  // Local State for Payout Logic
  const [currentBalance, setCurrentBalance] = useState(
    partner.financials.pending
  );
  const [totalPaid, setTotalPaid] = useState(partner.financials.paid);
  const [payMode, setPayMode] = useState(false);
  const [payForm, setPayForm] = useState({
    payerName: "",
    amount: "",
    utr: "",
  });

  // Payment History State (Pagination: 5 per page)
  // Ensure history is sorted by date/newest first initially if needed, here we assume passed data is sorted or we prepend new ones.
  const [history, setHistory] = useState(partner.payoutHistory || []);
  const [histPage, setHistPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination Logic
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const currentHistory = history.slice(
    (histPage - 1) * itemsPerPage,
    histPage * itemsPerPage
  );

  // Handle Payment Verification
  const processPayment = () => {
    if (!payForm.amount || !payForm.utr || !payForm.payerName) return;
    const amountNum = parseInt(payForm.amount);

    if (amountNum > currentBalance) {
      alert("Amount exceeds pending balance!");
      return;
    }

    // 1. Update Financials
    setCurrentBalance((prev) => prev - amountNum);
    setTotalPaid((prev) => prev + amountNum);

    // 2. Add to History (Newest First)
    const newTxn = {
      id: `TXN-${Math.floor(Math.random() * 99999)}`,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      amount: amountNum,
      utr: payForm.utr,
      payer: payForm.payerName,
      status: "Verified",
    };

    const updatedHistory = [newTxn, ...history];
    setHistory(updatedHistory);

    // 3. Reset Form
    setPayForm({ payerName: "", amount: "", utr: "" });
    setPayMode(false);

    // 4. Callback to update Parent Data
    if (onPaymentComplete) onPaymentComplete(partner.id, amountNum, newTxn);

    // 5. Optional: Switch to history tab to show the new record
    // setActiveTab("history");
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: 20 }}
      className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl relative z-50 overflow-hidden flex flex-col max-h-[90vh]"
    >
      {/* --- HEADER: IDENTITY --- */}
      <div className="bg-slate-900 text-white p-8 sm:p-10 relative overflow-hidden flex-shrink-0">
        <div className="relative z-10 flex justify-between items-start">
          <div className="flex items-center gap-6">
            <div className="size-24 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-4xl font-black shadow-inner border border-white/20">
              {partner.agency[0]}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-black uppercase tracking-tight">
                  {partner.agency}
                </h2>
                <span
                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    partner.status === "Active"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {partner.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-slate-400">
                <span className="flex items-center gap-2 text-xs font-bold">
                  <User size={14} /> {partner.owner}
                </span>
                <span className="flex items-center gap-2 text-xs font-bold">
                  <Mail size={14} /> {partner.email}
                </span>
                <span className="flex items-center gap-2 text-xs font-bold">
                  <Phone size={14} /> {partner.phone}
                </span>
                <span className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                  <Globe size={14} /> {partner.domain}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Decorative BG */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      </div>

      {/* --- TABS NAVIGATION --- */}
      <div className="px-8 sm:px-10 pt-6 pb-2 bg-[#F8FAFC]">
        <div className="flex gap-1 p-1.5 bg-slate-200/50 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "overview"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <TrendingUp size={14} /> Financial Overview
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "history"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <History size={14} /> Payment History
          </button>
        </div>
      </div>

      {/* --- BODY: CONTENT AREA --- */}
      <div className="p-8 sm:p-10 overflow-y-auto no-scrollbar flex-1 bg-[#F8FAFC]">
        {/* TAB 1: OVERVIEW (Stats + Payout Action) */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* 1. STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatBox
                label="Courses Sold"
                val={partner.sales.courses}
                icon={<GraduationCap size={18} />}
                color="blue"
              />
              <StatBox
                label="E-Books Sold"
                val={partner.sales.ebooks}
                icon={<CreditCard size={18} />}
                color="orange"
              />
              <StatBox
                label="Total Revenue"
                val={`₹${partner.financials.generated.toLocaleString()}`}
                icon={<TrendingUp size={18} />}
                color="indigo"
              />
              <StatBox
                label="Commission Earned"
                val={`₹${partner.financials.earned.toLocaleString()}`}
                icon={<Award size={18} />}
                color="emerald"
              />
            </div>

            {/* 2. PAYOUT TERMINAL SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Balance Card */}
              <div className="lg:col-span-1 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between h-full relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                    Remaining Payout
                  </p>
                  <h3
                    className={`text-4xl font-black tracking-tighter ${
                      currentBalance > 0 ? "text-slate-900" : "text-emerald-500"
                    }`}
                  >
                    ₹{currentBalance.toLocaleString()}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-500" />{" "}
                    Total Paid:{" "}
                    <span className="text-slate-900">
                      ₹{totalPaid.toLocaleString()}
                    </span>
                  </p>
                </div>

                {currentBalance > 0 ? (
                  <button
                    onClick={() => setPayMode(!payMode)}
                    className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl relative z-10"
                  >
                    {payMode ? "Cancel Transaction" : "Initiate Payout"}
                  </button>
                ) : (
                  <div className="mt-8 w-full py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-center border border-emerald-100">
                    All Settled
                  </div>
                )}

                {/* Background Pattern */}
                <div className="absolute -bottom-6 -right-6 size-32 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
              </div>

              {/* Right: Payment Form (Conditional) */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {payMode ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-slate-900 p-8 rounded-[32px] text-white h-full flex flex-col justify-center"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400">
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <h4 className="text-lg font-black uppercase">
                            Secure Payout Terminal
                          </h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                            Verify details before proceeding
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <InputGroup
                          label="Payer Name (Admin)"
                          placeholder="e.g. John Doe"
                          val={payForm.payerName}
                          setVal={(v) =>
                            setPayForm({ ...payForm, payerName: v })
                          }
                        />
                        <InputGroup
                          label="Amount (₹)"
                          placeholder={`Max: ${currentBalance}`}
                          val={payForm.amount}
                          setVal={(v) => setPayForm({ ...payForm, amount: v })}
                          type="number"
                        />
                        <InputGroup
                          label="UTR / Ref No."
                          placeholder="Bank Ref ID"
                          val={payForm.utr}
                          setVal={(v) => setPayForm({ ...payForm, utr: v })}
                        />
                      </div>
                      <button
                        onClick={processPayment}
                        className="mt-6 w-full py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2"
                      >
                        <Send size={14} /> Verify & Transfer Funds
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full bg-white p-8 rounded-[32px] border border-slate-100 flex items-center justify-center text-center opacity-50 border-dashed min-h-[250px]"
                    >
                      <div>
                        <CreditCard
                          size={40}
                          className="mx-auto text-slate-300 mb-2"
                        />
                        <p className="text-xs font-bold text-slate-400 uppercase">
                          Select "Initiate Payout" to open terminal
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: PAYMENT HISTORY LEDGER */}
        {activeTab === "history" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm"
          >
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <History size={16} className="text-slate-400" />
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                  Transaction History Ledger
                </h4>
              </div>
              <div className="px-3 py-1 bg-white rounded-lg border border-slate-200 text-[9px] font-black text-slate-400 uppercase">
                Total Records: {history.length}
              </div>
            </div>

            <div className="overflow-x-auto min-h-[300px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    <th className="px-6 py-4">Txn ID</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Payer (Admin)</th>
                    <th className="px-6 py-4">UTR No.</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {currentHistory.length > 0 ? (
                    currentHistory.map((txn, i) => (
                      <tr
                        key={i}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-xs font-bold text-slate-900">
                          {txn.id}
                        </td>
                        <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">
                          {txn.date} <span className="text-slate-300">|</span>{" "}
                          {txn.time}
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-700">
                          {txn.payer || "System"}
                        </td>
                        <td className="px-6 py-4 text-[10px] font-black text-indigo-500 uppercase bg-indigo-50 px-2 py-1 rounded w-fit">
                          {txn.utr}
                        </td>
                        <td className="px-6 py-4 text-right text-xs font-black text-emerald-600">
                          ₹{txn.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-xs font-bold text-slate-400 italic"
                      >
                        No transactions recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* History Pagination */}
            {totalPages > 0 && (
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <p className="text-[9px] font-black text-slate-400 uppercase">
                  Page {histPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setHistPage((p) => Math.max(1, p - 1))}
                    disabled={histPage === 1}
                    className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:text-slate-900 transition-all"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() =>
                      setHistPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={histPage === totalPages}
                    className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:text-slate-900 transition-all"
                  >
                    <ChevronRight size={14} />
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

// --- HELPER COMPONENTS ---
const StatBox = ({ label, val, color, icon }) => {
  const styles = {
    indigo: "bg-indigo-50 text-indigo-600",
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };
  return (
    <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
      <div
        className={`size-10 rounded-xl flex items-center justify-center ${styles[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <h4 className="text-lg font-black text-slate-900 tracking-tight">
          {val}
        </h4>
      </div>
    </div>
  );
};

const InputGroup = ({ label, placeholder, val, setVal, type = "text" }) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <input
      type={type}
      value={val}
      onChange={(e) => setVal(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-800 border-none rounded-xl text-xs font-bold text-white px-4 py-3 outline-none focus:ring-2 ring-emerald-500 placeholder:text-slate-600"
    />
  </div>
);

export default PartnerProfile;
