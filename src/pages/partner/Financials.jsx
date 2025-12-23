import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  Filter,
  ChevronDown,
  Search,
  Banknote,
  History,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";

// --- MOCK DATA ENGINE ---
const SALES_DATA = [
  {
    id: "SL-106",
    student: "Karan Johar",
    asset: "Python AI",
    amount: "999.00",
    profit: "350.00",
    date: "2023-12-23 11:00",
    status: "Successful",
  },
  {
    id: "SL-105",
    student: "Amit Verma",
    asset: "Node.js Mastery",
    amount: "1200.00",
    profit: "400.00",
    date: "2023-12-22 16:00",
    status: "Successful",
  },
  {
    id: "SL-104",
    student: "Priya Das",
    asset: "React Pro Mastery",
    amount: "749.00",
    profit: "250.00",
    date: "2023-12-21 09:20",
    status: "Successful",
  },
  {
    id: "SL-103",
    student: "Vikram Raj",
    asset: "JS Guide",
    amount: "299.00",
    profit: "100.00",
    date: "2023-12-21 08:45",
    status: "Successful",
  },
  {
    id: "SL-102",
    student: "Sanya Iyer",
    asset: "UI/UX Bootcamp",
    amount: "499.00",
    profit: "150.00",
    date: "2023-12-20 10:15",
    status: "Successful",
  },
  {
    id: "SL-101",
    student: "Aryan Sharma",
    asset: "React Pro Mastery",
    amount: "749.00",
    profit: "250.00",
    date: "2023-12-19 14:30",
    status: "Successful",
  },
];

const PAYOUT_DATA = [
  {
    id: "PY-503",
    amount: "8,200.00",
    method: "ICICI Bank",
    date: "2023-12-23 10:00",
    status: "Successful",
  },
  {
    id: "PY-502",
    amount: "12,000.00",
    method: "HDFC Bank",
    date: "2023-12-22 09:00",
    status: "Processing",
  },
  {
    id: "PY-501",
    amount: "5,500.00",
    method: "UPI / PhonePe",
    date: "2023-12-15 14:20",
    status: "Successful",
  },
];

const Financials = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [timeRange, setTimeRange] = useState("7D");
  const [currentPage, setCurrentPage] = useState(1);
  const [customDates, setCustomDates] = useState({ start: "", end: "" });
  const itemsPerPage = 5;

  // ✨ Logical Filter & Sort (Last Transaction First)
  const filteredData = useMemo(() => {
    let data = activeTab === "sales" ? [...SALES_DATA] : [...PAYOUT_DATA];
    // Sort by ID or Date to ensure latest is always top
    return data.sort((a, b) => b.id.localeCompare(a.id));
  }, [activeTab, timeRange]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 lg:p-10 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* --- HEADER & WORKING FILTER --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Financial Intelligence
            </h1>
            <p className="text-sm text-slate-400 font-medium">
              Real-time auditing and fund tracking
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            <AnimatePresence>
              {timeRange === "Custom" && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  className="flex items-center gap-2 px-2 border-r border-slate-100 mr-2 overflow-hidden"
                >
                  <input
                    type="date"
                    className="text-[10px] font-bold p-1.5 bg-slate-50 rounded-lg outline-none border-none"
                    onChange={(e) =>
                      setCustomDates({ ...customDates, start: e.target.value })
                    }
                  />
                  <span className="text-slate-300 text-[10px] font-black uppercase tracking-tighter">
                    To
                  </span>
                  <input
                    type="date"
                    className="text-[10px] font-bold p-1.5 bg-slate-50 rounded-lg outline-none border-none"
                    onChange={(e) =>
                      setCustomDates({ ...customDates, end: e.target.value })
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none bg-slate-900 text-white py-2.5 pl-10 pr-10 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
              >
                {["Today", "7D", "30D", "Year", "Custom"].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "7D" ? "This Week" : opt}
                  </option>
                ))}
              </select>
              <Filter
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={14}
              />
            </div>
          </div>
        </div>

        {/* --- STAT CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Net Earnings"
            val="₹1,42,500"
            sub="Aggregated Profit"
            icon={<TrendingUp />}
            color="blue"
          />
          <StatCard
            label="Available Balance"
            val="₹12,200"
            sub="Wallet Funds"
            icon={<Wallet />}
            color="emerald"
            action={
              <button className="mt-4 w-full py-3 bg-emerald-500 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-100">
                Withdraw Now
              </button>
            }
          />
          <StatCard
            label="Total Withdrawn"
            val="₹1,30,300"
            sub="Settled Funds"
            icon={<Banknote />}
            color="slate"
          />
          <StatCard
            label="Pending"
            val="₹2,400"
            sub="Verification Stage"
            icon={<Clock />}
            color="orange"
          />
        </div>

        {/* ✨ IMPORTANT FINANCIAL NOTE ✨ */}
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[32px] flex items-center gap-4">
          <div className="size-10 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="text-xs font-black text-indigo-900 uppercase tracking-tight">
              Withdrawal Policy
            </p>
            <p className="text-[11px] font-bold text-indigo-700/80 leading-relaxed">
              Once requested, your payment will be processed and credited to
              your registered bank account within{" "}
              <span className="text-indigo-900 underline underline-offset-2">
                24 to 48 hours
              </span>
              . Please ensure your KYC details are up to date.
            </p>
          </div>
        </div>

        {/* --- DYNAMIC LEDGER HUB --- */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden mt-6">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex p-1 bg-slate-100 rounded-2xl">
              <button
                onClick={() => {
                  setActiveTab("sales");
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${
                  activeTab === "sales"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <ShoppingBag size={14} /> Student Sales
              </button>
              <button
                onClick={() => {
                  setActiveTab("payouts");
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${
                  activeTab === "payouts"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <History size={14} /> Withdrawal Logs
              </button>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100 w-full md:w-72 group focus-within:border-indigo-200 transition-all">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Filter by ID, Student..."
                className="bg-transparent border-none outline-none text-xs font-bold w-full"
              />
            </div>
          </div>

          <div className="overflow-x-auto min-h-[460px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {activeTab === "sales"
                      ? "Student Intelligence"
                      : "Ref ID / Timestamp"}
                  </th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {activeTab === "sales"
                      ? "Course Metadata"
                      : "Payout Gateway"}
                  </th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Audit Status
                  </th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Settlement Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentItems.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-slate-50/30 transition-all duration-300"
                  >
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800">
                          {activeTab === "sales" ? item.student : item.id}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">
                          {activeTab === "sales" ? item.id : item.date}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <p className="text-xs font-bold text-slate-600">
                        {activeTab === "sales" ? item.asset : item.method}
                      </p>
                      {activeTab === "sales" && (
                        <p className="text-[9px] text-slate-400 mt-1.5 font-bold uppercase tracking-widest">
                          {item.date}
                        </p>
                      )}
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          item.status === "Successful"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <p
                        className={`text-base font-black tracking-tight ${
                          item.profit ? "text-emerald-500" : "text-slate-900"
                        }`}
                      >
                        {item.profit ? `+₹${item.profit}` : `-₹${item.amount}`}
                      </p>
                      {item.profit && (
                        <p className="text-[9px] text-slate-300 font-bold uppercase">
                          Net Profit
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 disabled:opacity-30 hover:text-slate-900 transition-all shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 disabled:opacity-30 hover:text-slate-900 transition-all shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, val, sub, icon, color, action }) => {
  const themes = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    slate: "bg-slate-50 text-slate-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between hover:translate-y-[-4px] transition-all duration-500">
      <div>
        <div className={`p-4 rounded-[20px] w-fit mb-6 ${themes[color]}`}>
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
          {label}
        </p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">
          {val}
        </h3>
        <p className="text-[10px] font-bold text-slate-300 italic">{sub}</p>
      </div>
      {action}
    </div>
  );
};

export default Financials;
