import React, { useState, useMemo, useEffect } from "react";
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

import { listenToOrders } from "../../firebase/orders.service";
import { listenToPartners } from "../../firebase/partners.service";

const Financials = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [timeRange, setTimeRange] = useState("7D");
  const [currentPage, setCurrentPage] = useState(1);
  const [customDates, setCustomDates] = useState({ start: "", end: "" });

  const [partners, setPartners] = useState([]);
  const [orders, setOrders] = useState([]);

  const itemsPerPage = 5;

  useEffect(() => {
    const unsub = listenToPartners(setPartners);
    return () => unsub && unsub();
  }, []);

  const activePartner = useMemo(() => {
    return partners.find((p) => p.status === "Active") || partners[0] || null;
  }, [partners]);

  useEffect(() => {
    if (!activePartner?.id) return;
    const unsub = listenToOrders(activePartner.id, setOrders);
    return () => unsub && unsub();
  }, [activePartner]);

  const computed = useMemo(() => {
    const sales = [];
    const payoutMap = {};

    let netEarnings = 0;
    let totalWithdrawn = 0;
    let pending = 0;

    orders.forEach((o) => {
      if (!o.createdAt?.toDate) return;

      const dt = o.createdAt.toDate();
      const ts = `${dt.toISOString().slice(0, 10)} ${dt
        .toTimeString()
        .slice(0, 5)}`;

      sales.push({
        id: o.id,
        student: o.studentName,
        asset: o.assetName,
        amount: o.saleValue,
        profit: o.commission,
        date: ts,
        status: "Successful",
      });

      netEarnings += Number(o.commission);

      const key = dt.toDateString();
      if (!payoutMap[key]) {
        payoutMap[key] = {
          id: key,
          amount: 0,
          method: "Bank Transfer",
          date: ts,
          status: "Processing",
        };
      }

      payoutMap[key].amount += Number(o.commission);
    });

    const payouts = Object.values(payoutMap).map((p) => {
      totalWithdrawn += p.amount;
      return {
        ...p,
        amount: p.amount.toFixed(2),
      };
    });

    return {
      sales: sales.sort((a, b) => b.id.localeCompare(a.id)),
      payouts: payouts.sort((a, b) => b.id.localeCompare(a.id)),
      netEarnings,
      totalWithdrawn,
      pending: 0,
      available: netEarnings - totalWithdrawn,
    };
  }, [orders]);

  const filteredData = useMemo(() => {
    return activeTab === "sales" ? computed.sales : computed.payouts;
  }, [activeTab, computed]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 lg:p-10 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Net Earnings"
            val={`₹${computed.netEarnings.toLocaleString()}`}
            sub="Aggregated Profit"
            icon={<TrendingUp />}
            color="blue"
          />
          <StatCard
            label="Available Balance"
            val={`₹${computed.available.toLocaleString()}`}
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
            val={`₹${computed.totalWithdrawn.toLocaleString()}`}
            sub="Settled Funds"
            icon={<Banknote />}
            color="slate"
          />
          <StatCard
            label="Pending"
            val={`₹${computed.pending.toLocaleString()}`}
            sub="Verification Stage"
            icon={<Clock />}
            color="orange"
          />
        </div>

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

            <div className="flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100 w-full md:w-72">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
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
                  <tr key={item.id}>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800">
                          {activeTab === "sales"
                            ? item.student
                            : item.id}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                          {item.date}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <p className="text-xs font-bold text-slate-600">
                        {activeTab === "sales"
                          ? item.asset
                          : item.method}
                      </p>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border bg-emerald-50 text-emerald-600 border-emerald-100">
                        Successful
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <p className="text-base font-black tracking-tight text-emerald-500">
                        ₹{activeTab === "sales"
                          ? item.profit
                          : item.amount}
                      </p>
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
                className="p-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-30"
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
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
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
