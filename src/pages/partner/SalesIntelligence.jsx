import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  TrendingUp,
  ShoppingBag,
  BookOpen,
  GraduationCap,
  Filter,
  ChevronDown,
  Search,
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// --- DATA ENGINE: ASSET PERFORMANCE ---
const ASSET_PERFORMANCE = [
  {
    id: "A1",
    name: "React Pro Mastery",
    type: "Course",
    units: 45,
    revenue: "₹1,12,455",
  },
  {
    id: "A2",
    name: "UI/UX Bootcamp",
    type: "Course",
    units: 32,
    revenue: "₹1,59,968",
  },
  {
    id: "A3",
    name: "JS Survival Guide",
    type: "E-Book",
    units: 128,
    revenue: "₹63,872",
  },
  {
    id: "A4",
    name: "Backend Fundamentals",
    type: "Course",
    units: 12,
    revenue: "₹38,400",
  },
  {
    id: "A5",
    name: "Python AI Guide",
    type: "E-Book",
    units: 85,
    revenue: "₹67,915",
  },
  {
    id: "A6",
    name: "Modern CSS Mastery",
    type: "Course",
    units: 10,
    revenue: "₹15,000",
  },
];

// --- DATA ENGINE: DAILY LOGS ---
const DAILY_LOGS = [
  { date: "23 Dec 2023", courses: 12, ebooks: 24, totalRevenue: "₹45,000" },
  { date: "22 Dec 2023", courses: 8, ebooks: 15, totalRevenue: "₹28,500" },
  { date: "21 Dec 2023", courses: 15, ebooks: 40, totalRevenue: "₹52,200" },
  { date: "20 Dec 2023", courses: 5, ebooks: 10, totalRevenue: "₹12,400" },
  { date: "19 Dec 2023", courses: 20, ebooks: 55, totalRevenue: "₹68,900" },
  { date: "18 Dec 2023", courses: 7, ebooks: 12, totalRevenue: "₹18,200" },
  { date: "17 Dec 2023", courses: 10, ebooks: 20, totalRevenue: "₹30,000" },
];

// --- CHART DATA ---
const WEEKLY_TREND = [
  { name: "Sun", courses: 10, ebooks: 20 },
  { name: "Mon", courses: 4, ebooks: 12 },
  { name: "Tue", courses: 7, ebooks: 18 },
  { name: "Wed", courses: 5, ebooks: 10 },
  { name: "Thu", courses: 12, ebooks: 25 },
  { name: "Fri", courses: 9, ebooks: 15 },
  { name: "Sat", courses: 15, ebooks: 30 },
];

const MONTHLY_TREND = [
  { name: "Jan", courses: 40, ebooks: 100 },
  { name: "Feb", courses: 35, ebooks: 80 },
  { name: "Mar", courses: 50, ebooks: 120 },
  { name: "Apr", courses: 45, ebooks: 90 },
  { name: "May", courses: 60, ebooks: 150 },
  { name: "Jun", courses: 55, ebooks: 130 },
  { name: "Jul", courses: 70, ebooks: 180 },
  { name: "Aug", courses: 65, ebooks: 160 },
  { name: "Sep", courses: 80, ebooks: 200 },
  { name: "Oct", courses: 75, ebooks: 190 },
  { name: "Nov", courses: 90, ebooks: 220 },
  { name: "Dec", courses: 100, ebooks: 250 },
];

const SalesIntelligence = () => {
  const [timeRange, setTimeRange] = useState("7D");
  const [chartView, setChartView] = useState("Weekly");

  // Pagination States
  const [assetPage, setAssetPage] = useState(1);
  const [timelinePage, setTimelinePage] = useState(1);

  // Logic: Items Per Page
  const assetItemsPerPage = 5;
  const timelineItemsPerPage = 6; // ✨ Set to 6 as requested

  const currentAssets = ASSET_PERFORMANCE.slice(
    (assetPage - 1) * assetItemsPerPage,
    assetPage * assetItemsPerPage
  );
  const currentTimeline = DAILY_LOGS.slice(
    (timelinePage - 1) * timelineItemsPerPage,
    timelinePage * timelineItemsPerPage
  );

  const assetTotalPages = Math.ceil(
    ASSET_PERFORMANCE.length / assetItemsPerPage
  );
  const timelineTotalPages = Math.ceil(
    DAILY_LOGS.length / timelineItemsPerPage
  );

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Sales Intelligence
            </h1>
            <p className="text-sm text-slate-400 font-medium italic">
              Post-acquisition revenue data center
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            {timeRange === "Custom" && (
              <div className="flex items-center gap-2 px-2">
                <input
                  type="date"
                  className="text-[10px] font-bold p-1.5 bg-slate-50 rounded-lg outline-none"
                />
                <span className="text-slate-300 text-[10px] font-black uppercase">
                  To
                </span>
                <input
                  type="date"
                  className="text-[10px] font-bold p-1.5 bg-slate-50 rounded-lg outline-none"
                />
              </div>
            )}
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

        {/* --- KPI GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Course Revenue"
            val="₹4,12,500"
            sub="Units: 142"
            icon={<GraduationCap />}
            color="indigo"
          />
          <StatCard
            label="E-Book Revenue"
            val="₹98,200"
            sub="Units: 540"
            icon={<BookOpen />}
            color="orange"
          />
          <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Top 2 Courses
            </p>
            <div className="space-y-3">
              <TopAsset
                name="React Pro Mastery"
                units="45"
                color="bg-indigo-500"
              />
              <TopAsset
                name="UI/UX Bootcamp"
                units="32"
                color="bg-indigo-300"
              />
            </div>
          </div>
          <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Top 2 E-Books
            </p>
            <div className="space-y-3">
              <TopAsset
                name="JS Survival Guide"
                units="128"
                color="bg-orange-500"
              />
              <TopAsset name="Python AI" units="85" color="bg-orange-300" />
            </div>
          </div>
        </div>

        {/* --- VOLUME TREND --- */}
        <div className="bg-white p-8 sm:p-10 rounded-[48px] border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Acquisition Volume Trend
              </h3>
              <p className="text-xs text-slate-400 font-medium italic">
                Delivery lifecycle tracking
              </p>
            </div>
            <div className="flex p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setChartView("Weekly")}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                  chartView === "Weekly"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-400"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setChartView("Monthly")}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                  chartView === "Monthly"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-400"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartView === "Weekly" ? WEEKLY_TREND : MONTHLY_TREND}
              >
                <defs>
                  <linearGradient id="colorInd" x1="0" y1="0" x2="0" y2="1">
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
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#94A3B8" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#94A3B8" }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="courses"
                  stroke="#6366f1"
                  strokeWidth={4}
                  fill="url(#colorInd)"
                />
                <Area
                  type="monotone"
                  dataKey="ebooks"
                  stroke="#f59e0b"
                  strokeWidth={4}
                  fill="transparent"
                  strokeDasharray="6 6"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- TABLES --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                Asset Intelligence
              </h3>
              <ShoppingBag size={20} className="text-slate-300" />
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-8 py-5">Asset Name</th>
                    <th className="px-8 py-5 text-center">Units</th>
                    <th className="px-8 py-5 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {currentAssets.map((asset) => (
                    <tr
                      key={asset.id}
                      className="hover:bg-slate-50/50 transition-all"
                    >
                      <td className="px-8 py-6">
                        <p className="text-xs font-black text-slate-800">
                          {asset.name}
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">
                          {asset.type}
                        </p>
                      </td>
                      <td className="px-8 py-6 text-center text-xs font-black text-slate-600">
                        {asset.units}
                      </td>
                      <td className="px-8 py-6 text-right text-xs font-black text-slate-900">
                        {asset.revenue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              current={assetPage}
              total={assetTotalPages}
              setPage={setAssetPage}
            />
          </div>

          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-900 text-white">
              <h3 className="text-lg font-black uppercase tracking-tighter">
                Timeline Analytics
              </h3>
              <Calendar size={20} className="text-slate-500" />
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-8 py-5">Date</th>
                    <th className="px-8 py-5 text-center">C / E Mix</th>
                    <th className="px-8 py-5 text-right">Day Gross</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {currentTimeline.map((log, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-all">
                      <td className="px-8 py-6 text-xs font-black text-slate-800">
                        {log.date}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                            {log.courses}C
                          </span>
                          <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                            {log.ebooks}E
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right text-xs font-black text-emerald-600">
                        {log.totalRevenue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              current={timelinePage}
              total={timelineTotalPages}
              setPage={setTimelinePage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ current, total, setPage }) => (
  <div className="p-5 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
      Page {current} of {total}
    </p>
    <div className="flex gap-2">
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={current === 1}
        className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-30"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={() => setPage((p) => Math.min(total, p + 1))}
        disabled={current === total}
        className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-30"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  </div>
);

const StatCard = ({ label, val, sub, icon, color }) => {
  const themes = {
    indigo: "bg-indigo-50 text-indigo-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm hover:translate-y-[-4px] transition-all duration-500">
      <div className={`p-4 rounded-2xl w-fit mb-6 ${themes[color]}`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-1">
        {val}
      </h3>
      <p className="text-[10px] font-bold text-slate-300">{sub}</p>
    </div>
  );
};

const TopAsset = ({ name, units, color }) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex items-center gap-3 overflow-hidden">
      <div className={`size-2 shrink-0 rounded-full ${color}`} />
      <p className="text-xs font-bold text-slate-600 truncate">{name}</p>
    </div>
    <span className="text-[10px] font-black text-slate-900 bg-slate-50 px-2 py-1 rounded-lg">
      {units} Units
    </span>
  </div>
);

export default SalesIntelligence;
