import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Search,
  Filter,
  Mail,
  Globe,
  TrendingUp,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  Building2,
  Calendar,
  ChevronDown,
  Award,
  CheckCircle2,
  X,
  FileSpreadsheet, // ✨ Excel icon added
} from "lucide-react";
import PartnerProfile from "./PartnerProfile"; // ✨ Corrected Import

// --- MOCK DATA ENGINE ---
const PARTNER_DATABASE = Array.from({ length: 45 })
  .map((_, i) => ({
    id: `PRT-${1000 + i}`,
    agency: i < 5 ? `Elite Academy ${i + 1}` : `Partner Institute ${i + 1}`,
    owner: `Rajesh Kumar ${i + 1}`,
    email: `director@agency${i + 1}.com`,
    phone: `+91 98765 ${10000 + i}`,
    domain: `agency${i + 1}.alifestable.com`,
    // ✨ Mixed dates to demonstrate filtering
    joinDate:
      i % 3 === 0
        ? new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "12 Dec 2023",
    status: i % 10 === 0 ? "Inactive" : "Active",
    sales: {
      courses: 120 + i * 5,
      ebooks: 45 + i * 2,
      totalUnits: 165 + i * 7,
    },
    financials: {
      generated: 250000 + i * 5000,
      earned: 125000 + i * 2500,
      paid: 100000 + i * 2000,
      pending: 125000 + i * 2500 - (100000 + i * 2000),
    },
    payoutHistory: [
      {
        id: "TXN-101",
        date: "20/12/2023",
        time: "14:30",
        amount: 50000,
        utr: "SBI998877",
        payer: "Admin",
        status: "Verified",
      },
    ],
  }))
  .sort((a, b) => b.financials.earned - a.financials.earned);

const PartnerIntelligence = () => {
  // State
  const [partners, setPartners] = useState(PARTNER_DATABASE);
  const [selectedPartner, setSelectedPartner] = useState(null);

  // Filters
  const [timeFilter, setTimeFilter] = useState("All Time"); // ✨ Default All Time
  const [customDates, setCustomDates] = useState({ start: "", end: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // All, Active, Inactive

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- 1. TIME FILTER LOGIC (Global) ---
  const timeFilteredPartners = useMemo(() => {
    if (timeFilter === "All Time") return partners;

    const now = new Date();
    return partners.filter((p) => {
      const pDate = new Date(p.joinDate);

      if (timeFilter === "Today") {
        return (
          pDate.getDate() === now.getDate() &&
          pDate.getMonth() === now.getMonth() &&
          pDate.getFullYear() === now.getFullYear()
        );
      }
      if (timeFilter === "Week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return pDate >= weekAgo;
      }
      if (timeFilter === "Month") {
        return (
          pDate.getMonth() === now.getMonth() &&
          pDate.getFullYear() === now.getFullYear()
        );
      }
      if (timeFilter === "Quarter") {
        const currentQuarter = Math.floor((now.getMonth() + 3) / 3);
        const pQuarter = Math.floor((pDate.getMonth() + 3) / 3);
        return (
          pQuarter === currentQuarter &&
          pDate.getFullYear() === now.getFullYear()
        );
      }
      if (timeFilter === "Year") {
        return pDate.getFullYear() === now.getFullYear();
      }
      if (timeFilter === "Custom" && customDates.start && customDates.end) {
        return (
          pDate >= new Date(customDates.start) &&
          pDate <= new Date(customDates.end)
        );
      }
      return true;
    });
  }, [partners, timeFilter, customDates]);

  // --- 2. ELITE PARTNERS (Derived from Time Filtered Data) ---
  const elitePartners = useMemo(() => {
    return [...timeFilteredPartners]
      .sort((a, b) => b.financials.generated - a.financials.generated)
      .slice(0, 5);
  }, [timeFilteredPartners]);

  // --- 3. LEDGER DATA (Search & Status on Time Filtered Data) ---
  const filteredLedgerData = useMemo(() => {
    return timeFilteredPartners.filter((p) => {
      const matchesSearch =
        p.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "All" || p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [timeFilteredPartners, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredLedgerData.length / itemsPerPage);
  const currentItems = filteredLedgerData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- MACRO METRICS ---
  const metrics = {
    total: timeFilteredPartners.length,
    active: timeFilteredPartners.filter((p) => p.status === "Active").length,
    revenue: timeFilteredPartners.reduce(
      (acc, curr) => acc + curr.financials.generated,
      0
    ),
    commission: timeFilteredPartners.reduce(
      (acc, curr) => acc + curr.financials.earned,
      0
    ),
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* --- 1. HEADER WITH GLOBAL DATE FILTER --- */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
              Partner Command Center
            </h1>
            <p className="text-sm text-slate-400 font-medium italic">
              Channel Performance & Financial Audit
            </p>
          </div>

          {/* TOP FILTER: DATE RANGE */}
          <div className="flex items-center bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
            <Calendar size={16} className="text-slate-400 mr-3" />
            {timeFilter === "Custom" && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                className="flex items-center gap-2 border-r border-slate-100 mr-3 pr-3"
              >
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
              </motion.div>
            )}
            <div className="relative">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="appearance-none bg-transparent text-xs font-black uppercase text-slate-700 outline-none pr-8 cursor-pointer"
              >
                {/* ✨ Added All Time */}
                {[
                  "All Time",
                  "Today",
                  "Week",
                  "Month",
                  "Quarter",
                  "Year",
                  "Custom",
                ].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* --- 2. MACRO CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            label="Total Partners"
            val={metrics.total}
            sub="In Selected Period"
            icon={<Building2 />}
            color="blue"
          />
          <KPICard
            label="Active Units"
            val={metrics.active}
            sub={`${metrics.total - metrics.active} Inactive`}
            icon={<TrendingUp />}
            color="emerald"
          />
          <KPICard
            label="Total Revenue"
            val={`₹${(metrics.revenue / 100000).toFixed(2)}L`}
            sub="Generated Volume"
            icon={<Globe />}
            color="indigo"
          />
          <KPICard
            label="Commission"
            val={`₹${(metrics.commission / 100000).toFixed(2)}L`}
            sub="Payout Burn"
            icon={<Wallet />}
            color="orange"
          />
        </div>

        {/* --- 3. ELITE SCROLL (Filtered by Time) --- */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Award className="text-amber-500" size={18} />
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">
              Elite Power Partners{" "}
              {timeFilter !== "All Time" && `(${timeFilter})`}
            </h4>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-6 no-scrollbar snap-x">
            {elitePartners.length > 0 ? (
              elitePartners.map((p, i) => (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedPartner(p)}
                  className="min-w-[260px] snap-center bg-white p-6 rounded-[32px] border border-slate-100 shadow-lg shadow-indigo-50/50 cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase border border-amber-100">
                      Rank #{i + 1}
                    </span>
                    <div className="size-8 bg-slate-50 rounded-full flex items-center justify-center font-black text-xs">
                      {p.agency[0]}
                    </div>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 truncate">
                    {p.agency}
                  </h4>
                  <p className="text-xl font-black text-slate-900 mt-2">
                    ₹{p.financials.generated.toLocaleString()}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">
                    Revenue Generated
                  </p>
                </motion.div>
              ))
            ) : (
              <div className="p-4 text-xs font-bold text-slate-400 italic">
                No partners found for this period.
              </div>
            )}
          </div>
        </div>

        {/* --- 4. AUDIT LEDGER --- */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="size-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                <Briefcase size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase">
                Partner Ledger
              </h3>
            </div>

            {/* TABLE CONTROLS */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                <Filter size={14} className="text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-[10px] font-black uppercase outline-none text-slate-600 cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex-1 md:w-64 flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-xl border border-slate-100 focus-within:border-indigo-300 transition-all">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Identity..."
                  className="bg-transparent text-xs font-bold outline-none w-full placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* ✨ DOWNLOAD EXCEL BUTTON */}
              <button
                className="flex items-center justify-center size-10 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-200 hover:scale-105 transition-all"
                title="Download Excel Report"
              >
                <FileSpreadsheet size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Agency Identity</th>
                  <th className="px-8 py-5">Sales Audit</th>
                  <th className="px-8 py-5">Financials</th>
                  <th className="px-8 py-5 text-center">Status</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentItems.map((p) => (
                  <tr
                    key={p.id}
                    className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                    onClick={() => setSelectedPartner(p)}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">
                          {p.agency[0]}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900">
                            {p.agency}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            {p.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-black text-slate-900">
                        {p.sales.totalUnits} Units
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">
                        {p.sales.courses}C / {p.sales.ebooks}E
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-500">
                          Earned:{" "}
                          <span className="text-slate-900">
                            ₹{p.financials.earned.toLocaleString()}
                          </span>
                        </span>
                        {p.financials.pending > 0 ? (
                          <span className="text-[9px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded w-fit">
                            Pending: ₹{p.financials.pending.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-[9px] font-black text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 size={10} /> Settled
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          p.status === "Active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPartner(p);
                        }}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase hover:bg-indigo-600 transition-all shadow-lg"
                      >
                        View Profile
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

      {/* --- 5. PARTNER PROFILE MODAL --- */}
      <AnimatePresence>
        {selectedPartner && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <PartnerProfile
              partner={selectedPartner}
              onClose={() => setSelectedPartner(null)}
              onPaymentComplete={(id, amount, txn) => {
                const updated = partners.map((p) => {
                  if (p.id === id) {
                    return {
                      ...p,
                      financials: {
                        ...p.financials,
                        paid: p.financials.paid + amount,
                        pending: p.financials.pending - amount,
                      },
                      payoutHistory: [txn, ...p.payoutHistory],
                    };
                  }
                  return p;
                });
                setPartners(updated);
              }}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- HELPER COMPONENT ---
const KPICard = ({ label, val, sub, icon, color }) => {
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
      <p className="text-[10px] font-bold text-slate-400 mt-1">{sub}</p>
    </div>
  );
};

export default PartnerIntelligence;