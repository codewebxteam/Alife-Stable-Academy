import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  History,
  AlertCircle,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Building2,
  CreditCard,
  Download,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

// --- MOCK DATA: PENDING PAYOUTS (Requests from Partners) ---
const PENDING_PAYOUTS = Array.from({ length: 15 }).map((_, i) => ({
  id: `REQ-${500 + i}`,
  partnerId: `PRT-${1000 + i}`,
  partnerName: `Nexus Academy ${i + 1}`,
  amount: 15000 + i * 1200,
  requestDate: "2024-03-20",
  method: i % 3 === 0 ? "Bank Transfer" : "UPI",
  accountDetails: i % 3 === 0 ? "HDFC •••• 4589" : "nexus@okicici",
  status: "Pending",
  urgency: i < 3 ? "High" : "Normal",
}));

// --- MOCK DATA: HISTORY ---
const PAYOUT_HISTORY = Array.from({ length: 45 }).map((_, i) => ({
  id: `TXN-${9000 + i}`,
  partnerName: `Elite Partner ${i + 1}`,
  amount: 8000 + i * 500,
  date: "2024-03-15",
  utr: `SBI${Math.floor(Math.random() * 100000000)}`,
  method: "Bank Transfer",
  status: "Settled",
}));

const PaymentManager = () => {
  // State
  const [activeTab, setActiveTab] = useState("pending"); // pending | history
  const [selectedRequest, setSelectedRequest] = useState(null); // For Payment Modal
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); // Simulate Loading

  // Stats
  const stats = {
    balance: 4500000, // Current Wallet Balance
    pending: PENDING_PAYOUTS.reduce((acc, curr) => acc + curr.amount, 0),
    processedToday: 125000,
    gatewayStatus: "Operational",
  };

  // Filter Logic
  const filteredData = useMemo(() => {
    const data = activeTab === "pending" ? PENDING_PAYOUTS : PAYOUT_HISTORY;
    return data.filter(
      (item) =>
        item.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeTab, searchQuery]);

  // Handle Payment Simulation
  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSelectedRequest(null);
      alert("Payment Processed Successfully! Ledger Updated.");
      // In real app, here you would call API to update status
    }, 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* --- HEADER & GATEWAY STATUS --- */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
              Financial Control
            </h1>
            <p className="text-sm text-slate-400 font-medium italic">
              Payout Settlement & Gateway Health
            </p>
          </div>

          {/* Gateway Pulse */}
          <div className="flex gap-3">
            <GatewayBadge name="Razorpay" status="online" />
            <GatewayBadge name="PhonePe" status="online" />
          </div>
        </div>

        {/* --- WALLET STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Balance */}
          <div className="bg-slate-900 text-white p-8 rounded-[32px] relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Wallet size={100} />
            </div>
            <div className="relative z-10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} /> Available Liquidity
              </p>
              <h2 className="text-4xl font-black mt-3">
                ₹{(stats.balance / 100000).toFixed(2)}L
              </h2>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                Ready for disbursement
              </p>
            </div>
          </div>

          {/* Pending Liability */}
          <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Pending Payouts
                </p>
                <h2 className="text-3xl font-black text-orange-500 mt-2">
                  ₹{stats.pending.toLocaleString()}
                </h2>
              </div>
              <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
                <AlertCircle size={24} />
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase">
              {PENDING_PAYOUTS.length} Requests Queued
            </p>
          </div>

          {/* Processed */}
          <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Settled Today
                </p>
                <h2 className="text-3xl font-black text-emerald-600 mt-2">
                  ₹{stats.processedToday.toLocaleString()}
                </h2>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle2 size={24} />
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase">
              Via Bank Transfer
            </p>
          </div>
        </div>

        {/* --- MAIN ACTION AREA --- */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
          {/* Tabs & Filters */}
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Tab Switcher */}
            <div className="flex p-1.5 bg-slate-50 rounded-xl border border-slate-100">
              <TabButton
                label="Pending Requests"
                active={activeTab === "pending"}
                onClick={() => setActiveTab("pending")}
                icon={<AlertCircle size={14} />}
              />
              <TabButton
                label="Payout History"
                active={activeTab === "history"}
                onClick={() => setActiveTab("history")}
                icon={<History size={14} />}
              />
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex-1 md:w-64 flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-xl border border-slate-100 focus-within:border-indigo-300 transition-all">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Partner or ID..."
                  className="bg-transparent text-xs font-bold outline-none w-full placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="flex items-center justify-center size-10 bg-slate-900 text-white rounded-xl shadow-lg hover:scale-105 transition-all">
                <Download size={18} />
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Request ID</th>
                  <th className="px-8 py-5">Partner Identity</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5">Method / Details</th>
                  <th className="px-8 py-5 text-center">Status</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-slate-50/50 transition-all"
                  >
                    <td className="px-8 py-6">
                      <span className="text-xs font-black text-slate-900">
                        {item.id}
                      </span>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                        {activeTab === "pending" ? item.requestDate : item.date}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-black text-slate-900">
                        {item.partnerName}
                      </p>
                      {activeTab === "pending" && (
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          {item.partnerId}
                        </p>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-slate-900">
                        ₹{item.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {activeTab === "pending" ? (
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Building2 size={12} />
                          </span>
                          <div>
                            <p className="text-[10px] font-black text-slate-700 uppercase">
                              {item.method}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400">
                              {item.accountDetails}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                            <CheckCircle2 size={12} />
                          </span>
                          <div>
                            <p className="text-[10px] font-black text-slate-700 uppercase">
                              UTR: {item.utr}
                            </p>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          item.status === "Pending"
                            ? "bg-orange-50 text-orange-500"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {activeTab === "pending" ? (
                        <button
                          onClick={() => setSelectedRequest(item)}
                          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-200"
                        >
                          Pay Now
                        </button>
                      ) : (
                        <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-all">
                          <ArrowUpRight size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- PAYMENT MODAL --- */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
                <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <Wallet size={18} /> Confirm Payout
                </h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="hover:bg-white/10 p-2 rounded-full transition-all"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                {/* Summary */}
                <div className="bg-indigo-50 p-6 rounded-2xl text-center border border-indigo-100">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                    Transfer Amount
                  </p>
                  <h2 className="text-4xl font-black text-indigo-900 mt-2">
                    ₹{selectedRequest.amount.toLocaleString()}
                  </h2>
                  <p className="text-xs font-bold text-indigo-500 mt-2">
                    To: {selectedRequest.partnerName}
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 uppercase">
                      Bank/UPI ID
                    </span>
                    <span className="text-slate-900">
                      {selectedRequest.accountDetails}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-bold p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 uppercase">Method</span>
                    <span className="text-slate-900">
                      {selectedRequest.method}
                    </span>
                  </div>
                </div>

                {/* Action Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase pl-1">
                    Enter Transaction Reference (UTR)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: SBI1234567890"
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 transition-all uppercase"
                  />
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="w-full py-4 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>Processing Settlement...</>
                  ) : (
                    <>
                      <CheckCircle2 size={16} /> Confirm Transfer
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENTS ---
const GatewayBadge = ({ name, status }) => (
  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
    <div
      className={`size-2 rounded-full ${
        status === "online" ? "bg-emerald-500 animate-pulse" : "bg-red-500"
      }`}
    ></div>
    <span className="text-[10px] font-black text-slate-700 uppercase">
      {name}
    </span>
  </div>
);

const TabButton = ({ label, active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all ${
      active
        ? "bg-white text-indigo-600 shadow-md"
        : "text-slate-400 hover:text-slate-600"
    }`}
  >
    {icon} {label}
  </button>
);

export default PaymentManager;