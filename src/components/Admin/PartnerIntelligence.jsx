import React, { useState, useMemo, useEffect } from "react";
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
  FileSpreadsheet,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import PartnerProfile from "./PartnerProfile";
import { listenToPartners } from "../../firebase/partners.service";
import * as XLSX from "xlsx";

const PartnerIntelligence = () => {
  // State
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);

  // Filters
  const [timeFilter, setTimeFilter] = useState("All Time");
  const [customDates, setCustomDates] = useState({ start: "", end: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- REAL-TIME FIREBASE CONNECTION ---
  useEffect(() => {
    setLoading(true);
    const unsubscribe = listenToPartners((data) => {
      setPartners(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- EXCEL EXPORT FUNCTION ---
  const exportToExcel = () => {
    const exportData = filteredLedgerData.map((p) => ({
      "Partner ID": p.id,
      "Agency Name": p.agency,
      Owner: p.owner,
      Email: p.email,
      Phone: p.phone,
      Domain: p.domain,
      Status: p.status,
      "Join Date": p.joinDate
        ? new Date(p.joinDate).toLocaleDateString("en-GB")
        : "N/A",
      "Courses Purchased": p.sales.courses,
      "E-Books Purchased": p.sales.ebooks,
      "Total Units": p.sales.totalUnits,
      "Total Business Volume": p.financials.generated,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Partners");
    XLSX.writeFile(
      wb,
      `Partners_Report_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  // --- 1. TIME FILTER LOGIC (FIXED) ---
  const timeFilteredPartners = useMemo(() => {
    if (timeFilter === "All Time") return partners;

    const now = new Date();
    // Normalize 'now' to ensure accurate day comparison if needed,
    // but usually standard comparison is fine.

    return partners.filter((p) => {
      // If no join date, exclude from time-based views
      if (!p.joinDate) return false;
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
        // Reset time to start of that day for broader inclusion
        weekAgo.setHours(0, 0, 0, 0);
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
        // Fix: Set start date to 00:00:00 and end date to 23:59:59
        const startDate = new Date(customDates.start);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(customDates.end);
        endDate.setHours(23, 59, 59, 999);

        return pDate >= startDate && pDate <= endDate;
      }
      return true;
    });
  }, [partners, timeFilter, customDates]);

  // --- 2. ELITE PARTNERS ---
  const elitePartners = useMemo(() => {
    return [...timeFilteredPartners]
      .sort((a, b) => b.financials.generated - a.financials.generated)
      .slice(0, 5);
  }, [timeFilteredPartners]);

  // --- 3. LEDGER DATA (Search & Status) ---
  const filteredLedgerData = useMemo(() => {
    return timeFilteredPartners.filter((p) => {
      const searchLower = searchQuery.toLowerCase();

      // Safe checks for strings
      const agencyName = p.agency ? p.agency.toLowerCase() : "";
      const email = p.email ? p.email.toLowerCase() : "";
      const id = p.id ? p.id.toLowerCase() : "";

      const matchesSearch =
        agencyName.includes(searchLower) ||
        email.includes(searchLower) ||
        id.includes(searchLower);

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
    totalVolume: timeFilteredPartners.reduce(
      (acc, curr) => acc + curr.financials.generated,
      0
    ),
    avgVolume:
      timeFilteredPartners.length > 0
        ? timeFilteredPartners.reduce(
            (acc, curr) => acc + curr.financials.generated,
            0
          ) / timeFilteredPartners.length
        : 0,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
            <p className="text-sm font-bold text-slate-400">
              Loading Partners Data...
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-10">
          {/* --- HEADER --- */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                Partner Command Center
              </h1>
              <p className="text-sm text-slate-400 font-medium italic">
                Agency Performance & Sales Audit
              </p>
            </div>

            {/* DATE FILTER */}
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
                  <span className="text-[9px] font-black text-slate-300">
                    TO
                  </span>
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

          {/* --- MACRO CARDS --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              label="Total Agencies"
              val={metrics.total}
              sub="Registered Partners"
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
              label="Total Business Volume"
              val={`₹${(metrics.totalVolume / 100000).toFixed(2)}L`}
              sub="Total Purchases"
              icon={<Globe />}
              color="indigo"
            />
            <KPICard
              label="Avg. Agency Vol."
              val={`₹${(metrics.avgVolume / 1000).toFixed(1)}k`}
              sub="Per Partner"
              icon={<ShoppingBag />}
              color="orange"
            />
          </div>

          {/* --- ELITE SCROLL --- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <Award className="text-amber-500" size={18} />
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                Top Performing Agencies{" "}
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
                      Total Purchases
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

          {/* --- AUDIT LEDGER --- */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="size-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                  <Briefcase size={20} />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase">
                  Agency Ledger
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
                    placeholder="Search Agency..."
                    className="bg-transparent text-xs font-bold outline-none w-full placeholder:text-slate-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <button
                  onClick={exportToExcel}
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
                    <th className="px-8 py-5">Purchase Units</th>
                    <th className="px-8 py-5">Total Volume</th>
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
                          {p.sales.totalUnits} Items
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">
                          {p.sales.courses} Courses • {p.sales.ebooks} E-Books
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-black text-slate-900">
                          ₹{p.financials.generated.toLocaleString()}
                        </span>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">
                          Lifetime Spend
                        </p>
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
      )}

      {/* --- PARTNER PROFILE MODAL --- */}
      <AnimatePresence>
        {selectedPartner && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <PartnerProfile
              partner={selectedPartner}
              onClose={() => setSelectedPartner(null)}
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
