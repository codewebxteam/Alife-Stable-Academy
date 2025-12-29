import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Banknote,
  Search,
  Filter,
  Download,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  FileText,
  Globe,
  Users,
  Wallet,
  XCircle,
  BookOpen,
  CheckCircle2,
  Clock,
} from "lucide-react";

// --- MOCK TRANSACTION DATA (Fixed Logic) ---
const TRANSACTIONS_DB = Array.from({ length: 85 })
  .map((_, i) => {
    const isEbook = i % 4 === 0; // Every 4th item is an E-Book
    const amount = isEbook ? 499 : i % 3 === 0 ? 4999 : 2499;
    const isPartnerSale = i % 2 === 0;
    const partnerComm = isPartnerSale ? Math.floor(amount * 0.3) : 0; // Fixed integer commission

    return {
      id: `TXN-${8000 + i}`,
      student: `Student ${i + 1}`,
      asset: isEbook
        ? "React Interview Guide (E-Book)"
        : i % 3 === 0
        ? "Full Stack Mastery"
        : "React Pro Bundle",
      // ✨ FIX: Explicit Type Field for filtering
      type: isEbook ? "E-Book" : "Course",
      date: i % 5 === 0 ? new Date().toISOString().split("T")[0] : "2024-02-15",
      amount: amount,
      source: isPartnerSale ? "Partner" : "Self",
      partnerId: isPartnerSale ? `PRT-${1000 + (i % 5)}` : null,
      partnerName: isPartnerSale ? `Nexus Academy ${i % 5}` : null,
      commission: partnerComm,
      // ✨ FIX: Explicit Payout Status for commission card
      payoutStatus: i % 3 === 0 ? "Paid" : "Pending",
      status: "Success",
      gateway: i % 2 === 0 ? "Razorpay" : "PhonePe",
      invoiceId: `INV-${202400 + i}`,
    };
  })
  .sort((a, b) => b.id.localeCompare(a.id));

const SalesManager = () => {
  // State
  const [transactions, setTransactions] = useState(TRANSACTIONS_DB);
  const [selectedTxn, setSelectedTxn] = useState(null);

  // Filters
  const [timeFilter, setTimeFilter] = useState("All Time");
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [customDates, setCustomDates] = useState({ start: "", end: "" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- FILTER LOGIC ---
  const filteredData = useMemo(() => {
    let data = transactions;

    // 1. Time Filter
    if (timeFilter !== "All Time") {
      const now = new Date();
      data = data.filter((t) => {
        const tDate = new Date(t.date);
        if (timeFilter === "Today")
          return tDate.toDateString() === now.toDateString();
        if (timeFilter === "Month") return tDate.getMonth() === now.getMonth();
        if (timeFilter === "Custom" && customDates.start && customDates.end) {
          return (
            tDate >= new Date(customDates.start) &&
            tDate <= new Date(customDates.end)
          );
        }
        return true;
      });
    }

    // 2. Search & Source Filter
    return data.filter((t) => {
      const matchesSearch =
        t.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.partnerId &&
          t.partnerId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSource = sourceFilter === "All" || t.source === sourceFilter;

      return matchesSearch && matchesSource;
    });
  }, [transactions, timeFilter, searchQuery, sourceFilter, customDates]);

  // Pagination Slicing
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- REAL-TIME METRICS (FIXED CALCULATIONS) ---
  const metrics = useMemo(() => {
    // Helper to safely count types
    const countTypes = (data) => ({
      courses: data.filter((t) => t.type === "Course").length,
      ebooks: data.filter((t) => t.type === "E-Book").length,
    });

    const selfData = filteredData.filter((t) => t.source === "Self");
    const partnerData = filteredData.filter((t) => t.source === "Partner");

    return {
      total: {
        rev: filteredData.reduce((acc, curr) => acc + curr.amount, 0),
        counts: countTypes(filteredData),
      },
      self: {
        rev: selfData.reduce((acc, curr) => acc + curr.amount, 0),
        counts: countTypes(selfData),
      },
      partner: {
        rev: partnerData.reduce((acc, curr) => acc + curr.amount, 0),
        counts: countTypes(partnerData),
      },
      commission: {
        total: partnerData.reduce((acc, curr) => acc + curr.commission, 0),
        paid: partnerData
          .filter((t) => t.payoutStatus === "Paid")
          .reduce((acc, curr) => acc + curr.commission, 0),
        pending: partnerData
          .filter((t) => t.payoutStatus === "Pending")
          .reduce((acc, curr) => acc + curr.commission, 0),
      },
    };
  }, [filteredData]);

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* --- HEADER --- */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
              Sales Intelligence
            </h1>
            <p className="text-sm text-slate-400 font-medium italic">
              Revenue Streams & Financial Splits
            </p>
          </div>

          <div className="flex items-center bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
            <Calendar size={16} className="text-slate-400 mr-3" />
            {timeFilter === "Custom" && (
              <div className="flex items-center gap-2 border-r border-slate-100 mr-3 pr-3">
                <input
                  type="date"
                  className="text-[10px] font-bold outline-none bg-slate-50 p-1.5 rounded-lg"
                  onChange={(e) =>
                    setCustomDates({ ...customDates, start: e.target.value })
                  }
                />
                <span className="text-[9px] font-black text-slate-300">TO</span>
                <input
                  type="date"
                  className="text-[10px] font-bold outline-none bg-slate-50 p-1.5 rounded-lg"
                  onChange={(e) =>
                    setCustomDates({ ...customDates, end: e.target.value })
                  }
                />
              </div>
            )}
            <div className="relative">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="appearance-none bg-transparent text-xs font-black uppercase text-slate-700 outline-none pr-8 cursor-pointer"
              >
                {["All Time", "Today", "Week", "Month", "Year", "Custom"].map(
                  (t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  )
                )}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* --- KPI CARDS (FIXED: DATA WILL SHOW NOW) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            label="Total Sales"
            val={`₹${metrics.total.rev.toLocaleString()}`}
            color="blue"
            icon={<Banknote />}
            renderSub={() => (
              <div className="flex gap-3 mt-2">
                <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                  <BookOpen size={10} /> {metrics.total.counts.courses} Courses
                </span>
                <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                  <FileText size={10} /> {metrics.total.counts.ebooks} E-Books
                </span>
              </div>
            )}
          />
          <KPICard
            label="Self Sales"
            val={`₹${metrics.self.rev.toLocaleString()}`}
            color="indigo"
            icon={<Globe />}
            renderSub={() => (
              <div className="flex gap-3 mt-2">
                <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                  <BookOpen size={10} /> {metrics.self.counts.courses} C
                </span>
                <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                  <FileText size={10} /> {metrics.self.counts.ebooks} E
                </span>
              </div>
            )}
          />
          <KPICard
            label="Partner Sales"
            val={`₹${metrics.partner.rev.toLocaleString()}`}
            color="emerald"
            icon={<Users />}
            renderSub={() => (
              <div className="flex gap-3 mt-2">
                <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                  <BookOpen size={10} /> {metrics.partner.counts.courses} C
                </span>
                <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                  <FileText size={10} /> {metrics.partner.counts.ebooks} E
                </span>
              </div>
            )}
          />
          <KPICard
            label="Total Commission"
            val={`₹${metrics.commission.total.toLocaleString()}`}
            color="orange"
            icon={<Wallet />}
            renderSub={() => (
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={10} /> Paid: ₹
                  {metrics.commission.paid.toLocaleString()}
                </span>
                <span className="text-[9px] font-bold text-orange-500 flex items-center gap-1">
                  <Clock size={10} /> Pending: ₹
                  {metrics.commission.pending.toLocaleString()}
                </span>
              </div>
            )}
          />
        </div>

        {/* --- TRANSACTION LEDGER --- */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="size-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                <ArrowUpRight size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase">
                Live Transaction Stream
              </h3>
            </div>

            {/* FILTERS */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* SOURCE FILTER */}
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                <Filter size={14} className="text-slate-400" />
                <select
                  value={sourceFilter}
                  onChange={(e) => {
                    setSourceFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-[10px] font-black uppercase outline-none text-slate-600 cursor-pointer"
                >
                  <option value="All">All Sources</option>
                  <option value="Self">Self Only</option>
                  <option value="Partner">Partner Only</option>
                </select>
              </div>

              {/* SEARCH */}
              <div className="flex-1 md:w-64 flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-xl border border-slate-100 focus-within:border-indigo-300 transition-all">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search ID, Partner..."
                  className="bg-transparent text-xs font-bold outline-none w-full placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button
                className="flex items-center justify-center size-10 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-200 hover:scale-105 transition-all"
                title="Export Ledger"
              >
                <Download size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Txn ID & Date</th>
                  <th className="px-8 py-5">Student & Product</th>
                  <th className="px-8 py-5">Source</th>
                  <th className="px-8 py-5">Financials</th>
                  <th className="px-8 py-5 text-center">Status</th>
                  <th className="px-8 py-5 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentItems.map((t) => (
                  <tr
                    key={t.id}
                    className="group hover:bg-slate-50/50 transition-all"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-[10px]">
                          TX
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900">
                            {t.id}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            {t.date}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-black text-slate-900">
                        {t.asset}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                        {t.type === "E-Book" ? (
                          <FileText size={10} />
                        ) : (
                          <BookOpen size={10} />
                        )}{" "}
                        {t.student}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      {t.source === "Self" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase">
                          <Globe size={10} /> Self
                        </span>
                      ) : (
                        <div className="flex flex-col">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-black uppercase w-fit">
                            <Users size={10} /> Partner
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 mt-1 pl-1">
                            ID: {t.partnerId}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">
                            ₹{t.amount.toLocaleString()}
                          </span>
                        </div>
                        {t.source === "Partner" && (
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-orange-500 bg-orange-50 px-1.5 rounded">
                              Comm: ₹{t.commission.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600">
                        {t.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => setSelectedTxn(t)}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                        title="View Invoice"
                      >
                        <FileText size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-slate-50 flex justify-between items-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- INVOICE MODAL --- */}
      <AnimatePresence>
        {selectedTxn && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="bg-slate-900 p-8 text-white relative">
                <h3 className="text-xl font-black uppercase tracking-tight">
                  Invoice Details
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase mt-1">
                  {selectedTxn.invoiceId}
                </p>
                <button
                  onClick={() => setSelectedTxn(null)}
                  className="absolute top-6 right-6 p-2 bg-white/10 rounded-xl hover:bg-white/20"
                >
                  <XCircle size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    Amount Paid
                  </span>
                  <span className="text-2xl font-black text-slate-900">
                    ₹{selectedTxn.amount}
                  </span>
                </div>
                <div className="space-y-3">
                  <InvoiceRow label="Product Type" val={selectedTxn.type} />
                  <InvoiceRow label="Asset" val={selectedTxn.asset} />
                  <InvoiceRow label="Student" val={selectedTxn.student} />
                  <InvoiceRow label="Date" val={selectedTxn.date} />
                  <InvoiceRow label="Source" val={selectedTxn.source} />
                  {selectedTxn.partnerName && (
                    <InvoiceRow label="Partner" val={selectedTxn.partnerName} />
                  )}
                  <InvoiceRow label="Gateway" val={selectedTxn.gateway} />
                </div>
                <button className="w-full py-4 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  <Download size={16} /> Download PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helpers
const KPICard = ({ label, val, color, icon, renderSub }) => {
  const styles = {
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    indigo: "text-indigo-600 bg-indigo-50",
    orange: "text-orange-600 bg-orange-50",
  };
  return (
    <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div
        className={`size-12 rounded-2xl flex items-center justify-center mb-4 ${styles[color]}`}
      >
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </p>
      <h3 className="text-2xl font-black text-slate-900 mt-1">{val}</h3>
      {renderSub && renderSub()}
    </div>
  );
};

const InvoiceRow = ({ label, val, highlight }) => (
  <div className="flex justify-between items-center">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
      {label}
    </span>
    <span className={`text-xs font-bold ${highlight || "text-slate-900"}`}>
      {val}
    </span>
  </div>
);


export default SalesManager;

