import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Wallet,
  TrendingUp,
  BookOpen,
  GraduationCap,
  ChevronDown,
  ArrowUpRight,
  Filter,
  User,
  Clock,
  ArrowRight,
} from "lucide-react";

import { listenToOrders } from "./../../firebase/orders.service";
import { listenToPartners } from "./../../firebase/partners.service";
import { listenToPayoutHistory } from "./../../firebase/payouts.service";

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("7D");
  const [graphView, setGraphView] = useState("weekly");
  const [customDates, setCustomDates] = useState({ start: "", end: "" });
  const [isRequesting, setIsRequesting] = useState(false);

  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [payoutHistory, setPayoutHistory] = useState([]);

  useEffect(() => {
    const unsubPartners = listenToPartners(setPartners);
    return () => {
      unsubPartners && unsubPartners();
    };
  }, []);

  const activePartner = useMemo(() => {
    return partners.find((p) => p.status === "Active") || partners[0] || null;
  }, [partners]);

  useEffect(() => {
    if (!activePartner?.id) return;
    const unsubOrders = listenToOrders(activePartner.id, setOrders);
    return () => {
      unsubOrders && unsubOrders();
    };
  }, [activePartner]);

  useEffect(() => {
    if (!activePartner?.id) return;
    const unsub = listenToPayoutHistory(activePartner.id, setPayoutHistory);
    return () => unsub && unsub();
  }, [activePartner]);

  const partnerOrders = useMemo(() => {
    if (!activePartner?.id) return [];
    return orders.filter((o) => o.partnerId === activePartner.id);
  }, [orders, activePartner]);

  const activeData = useMemo(() => {
    const productRevenue = partnerOrders.reduce(
      (sum, o) => sum + Number(o.saleValue || 0),
      0
    );
    const commissionRevenue = partnerOrders.reduce(
      (sum, o) => sum + Number(o.commission || 0),
      0
    );

    const courses = partnerOrders.filter((o) => o.type === "course");
    const ebooks = partnerOrders.filter((o) => o.type === "ebook");

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec",
    ];

    const weeklyGraph = days.map((d, i) => {
      const filtered = partnerOrders.filter((o) => {
        if (!o.createdAt?.toDate) return false;
        const dt = o.createdAt.toDate();
        return dt >= startOfWeek && dt < endOfWeek && dt.getDay() === i;
      });
      return {
        name: d,
        sales: filtered.length,
        comm: filtered.reduce(
          (s, o) => s + Number(o.commission || 0),
          0
        ),
      };
    });

    const monthlyGraph = months.map((m, i) => {
      const filtered = partnerOrders.filter((o) => {
        if (!o.createdAt?.toDate) return false;
        const dt = o.createdAt.toDate();
        return (
          dt.getFullYear() === now.getFullYear() &&
          dt.getMonth() === i
        );
      });
      return {
        name: m,
        sales: filtered.length,
        comm: filtered.reduce(
          (s, o) => s + Number(o.commission || 0),
          0
        ),
      };
    });

    const assetTotals = {};
    partnerOrders.forEach((o) => {
      assetTotals[o.assetName] =
        (assetTotals[o.assetName] || 0) + Number(o.saleValue || 0);
    });
    const maxAsset = Math.max(...Object.values(assetTotals), 1);

    const assetPulseValues = {
      "React Pro Mastery": Math.round(
        ((assetTotals["React Pro Mastery"] || 0) / maxAsset) * 100
      ),
      "UI/UX Design Bootcamp": Math.round(
        ((assetTotals["UI/UX Design Bootcamp"] || 0) / maxAsset) * 100
      ),
      "JavaScript Survival Guide": Math.round(
        ((assetTotals["JavaScript Survival Guide"] || 0) / maxAsset) * 100
      ),
      "Next.js 14 Guide": Math.round(
        ((assetTotals["Next.js 14 Guide"] || 0) / maxAsset) * 100
      ),
    };

    const payoutPending = payoutHistory.reduce(
      (s, p) => s + Number(p.pending || 0),
      0
    );

    return {
      revenue: {
        total: (productRevenue + commissionRevenue).toLocaleString(),
        product: productRevenue.toLocaleString(),
        comm: commissionRevenue.toLocaleString(),
      },
      courses: {
        total: courses.length,
        top: Object.entries(
          courses.reduce((acc, c) => {
            acc[c.assetName] = (acc[c.assetName] || 0) + 1;
            return acc;
          }, {})
        )
          .slice(0, 2)
          .map(([name, units]) => ({ name, units })),
      },
      ebooks: {
        total: ebooks.length,
        top: Object.entries(
          ebooks.reduce((acc, e) => {
            acc[e.assetName] = (acc[e.assetName] || 0) + 1;
            return acc;
          }, {})
        )
          .slice(0, 2)
          .map(([name, units]) => ({ name, units })),
      },
      payout: payoutPending,
      graph: weeklyGraph,
      monthlyGraph,
      assetPulseValues,
    };
  }, [partnerOrders, payoutHistory]);

  const handleRequestPayout = () => {
    setIsRequesting(true);
    setTimeout(() => setIsRequesting(false), 2000);
  };

  const timeAgo = (ts) => {
    if (!ts?.toDate) return "Just now";
    const diff = Date.now() - ts.toDate().getTime();
    const mins = Math.floor(diff / 60000);
    if (mins <= 0) return "Just now";
    if (mins < 60) return `${mins} mins ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs} hrs ago`;
  };

  return (
    <div className="p-6 lg:p-10 bg-[#F8FAFC] min-h-screen font-sans text-slate-900 selection:bg-indigo-100">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Intelligence Console
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              System operational • Data synced just now
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            {timeRange === "Custom" && (
              <div className="flex items-center gap-2 px-3 animate-in slide-in-from-right-4 duration-300">
                <input
                  type="date"
                  className="text-[10px] font-bold uppercase p-2 bg-slate-50 border-none rounded-lg outline-none"
                  onChange={(e) =>
                    setCustomDates({ ...customDates, start: e.target.value })
                  }
                />
                <span className="text-slate-300">to</span>
                <input
                  type="date"
                  className="text-[10px] font-bold uppercase p-2 bg-slate-50 border-none rounded-lg outline-none"
                  onChange={(e) =>
                    setCustomDates({ ...customDates, end: e.target.value })
                  }
                />
              </div>
            )}

            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none bg-slate-950 text-white py-2.5 pl-10 pr-10 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-slate-800 transition-all outline-none"
              >
                {["Today", "7D", "30D", "Quarter", "Year", "Custom"].map(
                  (opt) => (
                    <option key={opt} value={opt}>
                      {opt === "7D" ? "This Week" : opt}
                    </option>
                  )
                )}
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
            label="Total Revenue"
            value={`₹${activeData.revenue.total}`}
            icon={<TrendingUp className="text-blue-500" />}
            footer={
              <div className="flex gap-6 mt-5 pt-5 border-t border-slate-50">
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase block tracking-tighter">
                    Product
                  </span>
                  <span className="text-xs font-bold">
                    ₹{activeData.revenue.product}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase block tracking-tighter">
                    Commission
                  </span>
                  <span className="text-xs font-bold">
                    ₹{activeData.revenue.comm}
                  </span>
                </div>
              </div>
            }
          />

          <StatCard
            label="Courses Sold"
            value={activeData.courses.total}
            icon={<GraduationCap className="text-indigo-500" />}
            footer={
              <div className="space-y-1 mt-5 pt-5 border-t border-slate-50">
                {activeData.courses.top.map((c, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-[10px] font-bold text-slate-500"
                  >
                    <span className="truncate">{c.name}</span>
                    <span className="text-slate-900">{c.units} Units</span>
                  </div>
                ))}
              </div>
            }
          />

          <StatCard
            label="E-Books Sold"
            value={activeData.ebooks.total}
            icon={<BookOpen className="text-emerald-500" />}
            footer={
              <div className="space-y-1 mt-5 pt-5 border-t border-slate-50">
                {activeData.ebooks.top.map((e, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-[10px] font-bold text-slate-500"
                  >
                    <span className="truncate">{e.name}</span>
                    <span className="text-slate-900">{e.units} Units</span>
                  </div>
                ))}
              </div>
            }
          />

          <div className="bg-white p-7 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="p-3 bg-slate-50 rounded-2xl w-fit mb-4 text-slate-900">
                <Wallet size={20} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Available Payout
              </p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                ₹{activeData.payout}
              </h3>
            </div>
            <button
              onClick={handleRequestPayout}
              disabled={isRequesting}
              className="mt-6 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-slate-200"
            >
              {isRequesting ? "Requesting..." : "Request Payout"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Revenue Stream
                </h3>
                <p className="text-sm text-slate-400 font-medium">
                  Performance tracking:{" "}
                  {graphView === "weekly" ? "Sun - Sat" : "Jan - Dec"}
                </p>
              </div>
              <div className="flex p-1 bg-slate-100 rounded-xl">
                {["weekly", "monthly"].map((view) => (
                  <button
                    key={view}
                    onClick={() => setGraphView(view)}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                      graphView === view
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={
                    graphView === "weekly"
                      ? activeData.graph
                      : activeData.monthlyGraph
                  }
                >
                  <defs>
                    <linearGradient id="colorComm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F1F5F9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 700 }}
                    dy={10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="comm"
                    stroke="#6366f1"
                    strokeWidth={4}
                    fill="url(#colorComm)"
                    animationDuration={1500}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="transparent"
                    strokeDasharray="6 6"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-10">
              Asset Pulse
            </h3>
            <div className="space-y-8">
              <PerformanceBar
                label="React Pro Mastery"
                val={activeData.assetPulseValues["React Pro Mastery"]}
                color="#6366f1"
              />
              <PerformanceBar
                label="UI/UX Design Bootcamp"
                val={activeData.assetPulseValues["UI/UX Design Bootcamp"]}
                color="#10b981"
              />
              <PerformanceBar
                label="JavaScript Survival Guide"
                val={activeData.assetPulseValues["JavaScript Survival Guide"]}
                color="#f59e0b"
              />
              <PerformanceBar
                label="Next.js 14 Guide"
                val={activeData.assetPulseValues["Next.js 14 Guide"]}
                color="#ec4899"
              />

              <div className="mt-12 p-8 bg-indigo-900 rounded-[32px] text-white relative overflow-hidden">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">
                  Growth Insight
                </p>
                <p className="text-sm font-bold leading-relaxed mb-4">
                  React Pro Mastery is trending. Launch a coupon to maximize
                  profit.
                </p>
                <button className="text-[10px] font-black uppercase underline">
                  Deploy Campaign
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Live Acquisition Stream
              </h3>
              <p className="text-sm text-slate-400 font-medium">
                Real-time student enrollment feed
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
              <Clock size={20} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Student Identity
                  </th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Enrollment Asset
                  </th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Sale Value
                  </th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Net Commission
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {partnerOrders.slice(0, 4).map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => navigate("/partner-dashboard/students")}
                    className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                  >
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-4">
                        <div className="size-11 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {o.studentName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium italic">
                            {o.studentEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7 text-center">
                      <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase border border-indigo-100">
                        {o.assetName}
                      </span>
                    </td>
                    <td className="px-10 py-7">
                      <p className="text-sm font-black text-slate-900">
                        ₹{o.saleValue}
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                        Verified Purchase
                      </p>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-emerald-500 font-black flex items-center gap-1">
                          <ArrowUpRight size={14} /> +₹{o.commission}
                        </span>
                        <span className="text-[9px] text-slate-300 font-medium">
                          {timeAgo(o.createdAt)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, footer }) => (
  <div className="bg-white p-7 rounded-[40px] border border-slate-100 shadow-sm group">
    <div className="flex justify-between items-start mb-5">
      <div className="p-4 bg-slate-50 rounded-[24px] text-slate-900 group-hover:rotate-12 transition-transform duration-500">
        {icon}
      </div>
      <div className="p-2 bg-slate-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight size={14} className="text-slate-400" />
      </div>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
      {label}
    </p>
    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
      {value}
    </h3>
    {footer}
  </div>
);

const PerformanceBar = ({ label, val, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
      <span className="italic">{label}</span>
      <span>{val}%</span>
    </div>
    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${val}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="h-full rounded-full shadow-sm"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length >= 2) {
    return (
      <div className="bg-slate-900 text-white p-6 rounded-[24px] shadow-2xl border border-white/10 backdrop-blur-md">
        <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">
          {payload[0].payload.name}
        </p>
        <div className="space-y-2">
          <div className="flex justify-between gap-10">
            <span className="text-xs font-bold text-slate-400">
              Net Commission
            </span>
            <span className="text-xs font-black text-emerald-400">
              ₹{payload[0].value}
            </span>
          </div>
          <div className="flex justify-between gap-10">
            <span className="text-xs font-bold text-slate-400">
              Units Sold
            </span>
            <span className="text-xs font-black text-indigo-400">
              {payload[1].value} Units
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default PartnerDashboard;
