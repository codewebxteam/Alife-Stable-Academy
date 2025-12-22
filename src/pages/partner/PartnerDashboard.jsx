import React, { useState } from "react";
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
  Users,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
  Copy,
  Check,
  LayoutDashboard,
  Calendar,
  Info,
} from "lucide-react";
import { useAgency } from "../../context/AgencyContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CommissionStats from "../../components/partner/CommissionStats";

// --- DATA SETS (WEEKLY VS MONTHLY) ---
const WEEKLY_DATA = [
  { name: "Mon", sales: 4200 },
  { name: "Tue", sales: 3800 },
  { name: "Wed", sales: 5100 },
  { name: "Thu", sales: 4600 },
  { name: "Fri", sales: 7200 },
  { name: "Sat", sales: 8900 },
  { name: "Sun", sales: 8100 },
];

const MONTHLY_DATA = [
  { name: "Week 1", sales: 12000 },
  { name: "Week 2", sales: 18500 },
  { name: "Week 3", sales: 15200 },
  { name: "Week 4", sales: 22400 },
];

const PartnerDashboard = () => {
  const { agency } = useAgency();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);
  const [timeRange, setTimeRange] = useState("weekly"); // 'weekly' | 'monthly'

  const activeData = timeRange === "weekly" ? WEEKLY_DATA : MONTHLY_DATA;

  const stats = {
    totalProfit: "42,500",
    salesCount: 128,
    pendingPayout: "12,200",
  };

  const partnerLink = `${agency.subdomain}.alifestableacademy.com`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(partnerLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 lg:p-10 bg-[#fcfdfe] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* 1. HEADER & DYNAMIC URL SECTION */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-slate-900 text-[#5edff4] text-[10px] font-black uppercase tracking-widest rounded-full">
                Partner Mode
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 text-sm font-bold">
                {agency.agencyName}
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Intelligence Dashboard
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-white border border-slate-200 p-1.5 rounded-2xl flex items-center gap-3 shadow-sm group">
              <div className="pl-4 pr-6 py-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                  Gateway Link
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {partnerLink}
                </p>
              </div>
              <button
                onClick={copyToClipboard}
                className="p-3.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all active:scale-90 shadow-lg shadow-slate-200"
              >
                {copied ? (
                  <Check size={18} className="text-green-400" />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 2. STATS KPI GRID */}
        <CommissionStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* 3. MAIN ANALYTICS CHART (Weekly/Monthly Switcher) */}
          <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 p-8 shadow-xl shadow-slate-200/30 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 relative z-10">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  Revenue Stream <Info size={16} className="text-slate-300" />
                </h3>
                <p className="text-sm text-slate-400 font-medium">
                  Visualizing your profit generation
                </p>
              </div>

              {/* TOGGLE SWITCHER (PRO STYLE) */}
              <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
                <button
                  onClick={() => setTimeRange("weekly")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    timeRange === "weekly"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimeRange("monthly")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    timeRange === "monthly"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            <div className="h-[350px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeData}>
                  <defs>
                    <linearGradient
                      id="chartGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={agency.themeColor || "#0f172a"}
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="95%"
                        stopColor={agency.themeColor || "#0f172a"}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fontWeights: "bold",
                      fill: "#94a3b8",
                    }}
                    dy={15}
                  />
                  <YAxis hide domain={["auto", "auto"]} />
                  <Tooltip
                    cursor={{ stroke: "#e2e8f0", strokeWidth: 2 }}
                    contentStyle={{
                      borderRadius: "20px",
                      border: "none",
                      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                      padding: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke={agency.themeColor || "#0f172a"}
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#chartGradient)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. PERFORMANCE & ASSET STATUS */}
          <div className="space-y-8">
            {/* Branding Mini-Console */}
            <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <LayoutDashboard className="text-[#5edff4]" />
                  </div>
                  <button
                    onClick={() => navigate("/agency-setup")}
                    className="text-[10px] font-black uppercase tracking-tighter text-[#5edff4] hover:underline cursor-pointer"
                  >
                    Edit Setup
                  </button>
                </div>
                <h4 className="text-lg font-bold mb-1">Branding Hub</h4>
                <p className="text-slate-400 text-xs mb-6 font-medium">
                  Active Configuration
                </p>

                <div className="space-y-4">
                  <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-xs text-slate-400 font-bold">
                      Theme
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className="size-3 rounded-full"
                        style={{ backgroundColor: agency.themeColor }}
                      />
                      <span className="text-[10px] font-mono">
                        {agency.themeColor}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-xs text-slate-400 font-bold">
                      Markup
                    </span>
                    <span className="text-xs font-black text-[#5edff4]">
                      {agency.pricingMultiplier}x Profit
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 size-40 bg-[#5edff4]/10 blur-[80px] rounded-full group-hover:bg-[#5edff4]/20 transition-all duration-700" />
            </div>

            {/* AI Sales Insight */}
            <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
                <h4 className="font-bold text-slate-900">
                  Intelligence Insight
                </h4>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 relative">
                <p className="text-xs text-slate-600 font-bold leading-relaxed italic">
                  "Peak sales detected between 7PM - 10PM. Try scheduling your
                  promotional emails during this window to increase
                  conversions."
                </p>
                <div className="absolute -top-2 -right-2 size-6 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg">
                  <Info size={12} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. RECENT ENROLLMENTS TABLE (Enhanced Style) */}
        <div className="mt-10 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900">
              Live Acquisition Stream
            </h3>
            <button className="px-5 py-2 bg-slate-50 text-slate-600 rounded-full text-xs font-bold hover:bg-slate-100 transition-all">
              Export Report (.CSV)
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Student Identity
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Enrollment Asset
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Sale Value
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Net Profit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[1, 2, 3, 4].map((item) => (
                  <tr
                    key={item}
                    className="group hover:bg-slate-50/30 transition-all"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs group-hover:scale-110 transition-transform">
                          JD
                        </div>
                        <span className="font-bold text-slate-700">
                          John Doe{" "}
                          <span className="text-[10px] block font-medium text-slate-400">
                            j.doe@example.com
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
                        React Pro Mastery
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-black text-slate-900">
                      ₹749
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-green-600 font-black flex items-center justify-end gap-1">
                        <ArrowUpRight size={14} /> +₹250
                      </span>
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

export default PartnerDashboard;
