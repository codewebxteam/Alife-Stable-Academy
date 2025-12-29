import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
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
  ShoppingBag,
  BookOpen,
  GraduationCap,
  Filter,
  ChevronDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { listenToOrders } from "../../firebase/orders.service";
import { listenToPartners } from "../../firebase/partners.service";

const SalesIntelligence = () => {
  const [timeRange, setTimeRange] = useState("7D");
  const [chartView, setChartView] = useState("Weekly");

  const [partners, setPartners] = useState([]);
  const [orders, setOrders] = useState([]);

  const [assetPage, setAssetPage] = useState(1);
  const [timelinePage, setTimelinePage] = useState(1);

  const assetItemsPerPage = 5;
  const timelineItemsPerPage = 6;

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
    const assetsMap = {};
    const dailyMap = {};
    const weeklyMap = {};
    const monthlyMap = {};

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec",
    ];

    let courseRevenue = 0;
    let ebookRevenue = 0;
    let courseUnits = 0;
    let ebookUnits = 0;

    orders.forEach((o) => {
      if (!o.createdAt?.toDate) return;

      const dt = o.createdAt.toDate();
      const dayKey = dt.toDateString();
      const weekKey = days[dt.getDay()];
      const monthKey = months[dt.getMonth()];

      if (!assetsMap[o.assetName]) {
        assetsMap[o.assetName] = {
          id: o.assetName,
          name: o.assetName,
          type: o.type === "course" ? "Course" : "E-Book",
          units: 0,
          revenue: 0,
        };
      }

      assetsMap[o.assetName].units += 1;
      assetsMap[o.assetName].revenue += Number(o.saleValue);

      if (!dailyMap[dayKey]) {
        dailyMap[dayKey] = {
          date: dayKey,
          courses: 0,
          ebooks: 0,
          totalRevenue: 0,
        };
      }

      if (o.type === "course") {
        courseUnits += 1;
        courseRevenue += Number(o.saleValue);
        dailyMap[dayKey].courses += 1;
      } else {
        ebookUnits += 1;
        ebookRevenue += Number(o.saleValue);
        dailyMap[dayKey].ebooks += 1;
      }

      dailyMap[dayKey].totalRevenue += Number(o.saleValue);

      weeklyMap[weekKey] ||= { name: weekKey, courses: 0, ebooks: 0 };
      monthlyMap[monthKey] ||= { name: monthKey, courses: 0, ebooks: 0 };

      if (o.type === "course") {
        weeklyMap[weekKey].courses += 1;
        monthlyMap[monthKey].courses += 1;
      } else {
        weeklyMap[weekKey].ebooks += 1;
        monthlyMap[monthKey].ebooks += 1;
      }
    });

    const assets = Object.values(assetsMap)
      .map((a) => ({
        ...a,
        revenue: `₹${a.revenue.toLocaleString()}`,
      }))
      .sort((a, b) => b.units - a.units);

    const timeline = Object.values(dailyMap).map((d) => ({
      ...d,
      totalRevenue: `₹${d.totalRevenue.toLocaleString()}`,
    }));

    return {
      assets,
      timeline,
      weeklyTrend: days.map(
        (d) => weeklyMap[d] || { name: d, courses: 0, ebooks: 0 }
      ),
      monthlyTrend: months.map(
        (m) => monthlyMap[m] || { name: m, courses: 0, ebooks: 0 }
      ),
      courseRevenue,
      ebookRevenue,
      courseUnits,
      ebookUnits,
    };
  }, [orders]);

  const currentAssets = computed.assets.slice(
    (assetPage - 1) * assetItemsPerPage,
    assetPage * assetItemsPerPage
  );

  const currentTimeline = computed.timeline.slice(
    (timelinePage - 1) * timelineItemsPerPage,
    timelinePage * timelineItemsPerPage
  );

  const assetTotalPages = Math.ceil(computed.assets.length / assetItemsPerPage);
  const timelineTotalPages = Math.ceil(
    computed.timeline.length / timelineItemsPerPage
  );

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
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
            label="Course Revenue"
            val={`₹${computed.courseRevenue.toLocaleString()}`}
            sub={`Units: ${computed.courseUnits}`}
            icon={<GraduationCap />}
            color="indigo"
          />
          <StatCard
            label="E-Book Revenue"
            val={`₹${computed.ebookRevenue.toLocaleString()}`}
            sub={`Units: ${computed.ebookUnits}`}
            icon={<BookOpen />}
            color="orange"
          />
          <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Top 2 Courses
            </p>
            <div className="space-y-3">
              {computed.assets
                .filter((a) => a.type === "Course")
                .slice(0, 2)
                .map((a) => (
                  <TopAsset
                    key={a.id}
                    name={a.name}
                    units={a.units}
                    color="bg-indigo-500"
                  />
                ))}
            </div>
          </div>
          <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Top 2 E-Books
            </p>
            <div className="space-y-3">
              {computed.assets
                .filter((a) => a.type === "E-Book")
                .slice(0, 2)
                .map((a) => (
                  <TopAsset
                    key={a.id}
                    name={a.name}
                    units={a.units}
                    color="bg-orange-500"
                  />
                ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-[48px] border border-slate-100 shadow-sm">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={
                  chartView === "Weekly"
                    ? computed.weeklyTrend
                    : computed.monthlyTrend
                }
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
