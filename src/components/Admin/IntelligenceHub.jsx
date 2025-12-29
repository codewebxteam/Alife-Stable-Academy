import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  Users,
  Briefcase,
  TrendingUp,
  Wallet,
  Clock,
  Award,
  AlertCircle,
  Calendar,
  ChevronDown,
  Filter,
  GraduationCap,
  BookOpen,
  ExternalLink,
  ArrowUpRight,
  ShoppingBag,
  Globe,
  Zap,
  ChevronRight,
} from "lucide-react";

// --- PRO-LEVEL DATA STREAMS ---
const WEEKLY_DATA = [
  { name: "Sun", partner: 4000, direct: 2400 },
  { name: "Mon", partner: 3000, direct: 1398 },
  { name: "Tue", partner: 5000, direct: 9800 },
  { name: "Wed", partner: 2780, direct: 3908 },
  { name: "Thu", partner: 1890, direct: 4800 },
  { name: "Fri", partner: 2390, direct: 3800 },
  { name: "Sat", partner: 3490, direct: 4300 },
];

const MONTHLY_DATA = [
  { name: "Jan", partner: 45000, direct: 22000 },
  { name: "Feb", partner: 52000, direct: 28000 },
  { name: "Mar", partner: 48000, direct: 35000 },
  { name: "Apr", partner: 61000, direct: 42000 },
  { name: "May", partner: 55000, direct: 39000 },
  { name: "Jun", partner: 67000, direct: 51000 },
  { name: "Jul", partner: 72000, direct: 58000 },
  { name: "Aug", partner: 69000, direct: 62000 },
  { name: "Sep", partner: 75000, direct: 68000 },
  { name: "Oct", partner: 82000, direct: 71000 },
  { name: "Nov", partner: 88000, direct: 79000 },
  { name: "Dec", partner: 95000, direct: 85000 },
];

const COURSE_PIE = [
  { name: "React Pro", value: 400, color: "#6366f1" },
  { name: "UI/UX Master", value: 300, color: "#8b5cf6" },
  { name: "Node Backend", value: 200, color: "#10b981" },
  { name: "Python AI", value: 100, color: "#f59e0b" },
];

const EBOOK_PIE = [
  { name: "JS Pocket", value: 500, color: "#f43f5e" },
  { name: "Tailwind Guide", value: 350, color: "#3b82f6" },
  { name: "Freelance 101", value: 250, color: "#10b981" },
];

const IntelligenceHub = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("7D");
  const [velocityToggle, setVelocityToggle] = useState("Weekly");

  // ✨ Mock List for Critical Alerts (Can be 10, 15, or 50)
  const INACTIVE_PARTNERS = [
    "Nexus Digital",
    "Global Learn Academy",
    "Creative Minds",
    "EduTech Pro",
    "Skyline Institute",
    "Alpha Learning",
    "Pioneer Academy",
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* --- OMNI-FILTER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
            Intelligence Neural Hub
          </h2>
          <p className="text-sm text-slate-400 font-medium italic">
            Comprehensive Cross-Database Analytics
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          {timeRange === "Custom" && (
            <div className="flex items-center gap-2 px-2 border-r border-slate-100 mr-2">
              <input
                type="date"
                className="text-[10px] font-bold p-1 bg-slate-50 rounded outline-none"
              />
              <span className="text-[10px] text-slate-300 font-black">TO</span>
              <input
                type="date"
                className="text-[10px] font-bold p-1 bg-slate-50 rounded outline-none"
              />
            </div>
          )}
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-slate-950 text-white pl-10 pr-10 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
            >
              {["Today", "7D", "30D", "Quarter", "Year", "Custom"].map(
                (opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                )
              )}
            </select>
            <Filter
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* --- 1. MACRO KPI ARCHITECTURE --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MacroCard
          title="Net Revenue Ecosystem"
          val="₹18.4L"
          subData={[
            { label: "Direct", value: "₹7.3L" },
            { label: "Partner", value: "₹11.1L" },
          ]}
          icon={<Globe size={20} />}
          color="indigo"
        />
        <MacroCard
          title="Course Acquisitions"
          val="2,840"
          subData={[
            { label: "Self", value: "1,200" },
            { label: "Partner", value: "1,640" },
          ]}
          icon={<GraduationCap size={20} />}
          color="emerald"
        />
        <MacroCard
          title="Growth Partners"
          val="Nexus & Sky"
          subData={[
            { label: "Rev", value: "₹4.2L" },
            { label: "Rev", value: "₹3.8L" },
          ]}
          icon={<Briefcase size={20} />}
          color="orange"
        />
        <MacroCard
          title="Student Universe"
          val="12,450"
          subData={[
            { label: "Self", value: "4.5k" },
            { label: "Partner", value: "7.9k" },
          ]}
          icon={<Users size={20} />}
          color="blue"
        />
      </div>

      {/* --- 2 & 3. DUAL-MODE VELOCITY & LIQUIDITY --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-lg font-black uppercase tracking-widest">
                Revenue Velocity Engine
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                Comparing Direct vs Partner performance
              </p>
            </div>
            <div className="flex p-1.5 bg-slate-100 rounded-2xl">
              <button
                onClick={() => setVelocityToggle("Weekly")}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                  velocityToggle === "Weekly"
                    ? "bg-white text-slate-900 shadow-lg"
                    : "text-slate-400"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setVelocityToggle("Monthly")}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                  velocityToggle === "Monthly"
                    ? "bg-white text-slate-900 shadow-lg"
                    : "text-slate-400"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={velocityToggle === "Weekly" ? WEEKLY_DATA : MONTHLY_DATA}
              >
                <defs>
                  <linearGradient id="colorPartner" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDirect" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                  tick={{ fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700 }}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "24px",
                    border: "none",
                    boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="partner"
                  stroke="#6366f1"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorPartner)"
                />
                <Area
                  type="monotone"
                  dataKey="direct"
                  stroke="#10b981"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorDirect)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-950 p-8 rounded-[48px] text-white relative overflow-hidden group">
            <h3 className="text-xl font-black mb-6 tracking-tighter uppercase italic">
              Liquidity Desk
            </h3>
            <div className="space-y-5 relative z-10">
              <div
                onClick={() => navigate("/admin/payments")}
                className="p-5 bg-white/5 rounded-[24px] border border-white/10 hover:bg-white/10 transition-all cursor-pointer group/card"
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Payouts Pending
                  </p>
                  <ArrowUpRight
                    size={14}
                    className="text-slate-500 group-hover/card:text-white transition-all"
                  />
                </div>
                <h4 className="text-3xl font-black text-emerald-400 tracking-tighter">
                  ₹4,25,000
                </h4>
              </div>
              <div
                onClick={() => navigate("/admin/payments")}
                className="p-5 bg-white/5 rounded-[24px] border border-white/10 hover:bg-white/10 transition-all cursor-pointer group/card"
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Withdrawal Queue
                  </p>
                  <ArrowUpRight
                    size={14}
                    className="text-slate-500 group-hover/card:text-white transition-all"
                  />
                </div>
                <h4 className="text-3xl font-black text-orange-400 tracking-tighter">
                  12 Requests
                </h4>
              </div>
            </div>
            <Zap
              size={140}
              className="absolute -bottom-10 -right-10 text-white/5 -rotate-12 group-hover:rotate-0 transition-all duration-700"
            />
          </div>

          <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-8 text-center">
              Course Sales Share
            </h3>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={COURSE_PIE}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {COURSE_PIE.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {COURSE_PIE.map((a) => (
                <div
                  key={a.name}
                  className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500"
                >
                  <div
                    className="size-2 rounded-full"
                    style={{ backgroundColor: a.color }}
                  />{" "}
                  {a.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- 4 & 5. DEEP SALES & ACADEMIC AUDIT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black uppercase tracking-widest mb-10">
            Academic Intelligence
          </h3>
          <div className="grid grid-cols-1 gap-4 mb-10">
            {["Not Started", "In-Progress", "Completed"].map((state, i) => (
              <div
                key={state}
                onClick={() => navigate("/admin/students")}
                className="flex justify-between items-center p-5 bg-slate-50 rounded-[24px] border border-slate-100 hover:border-indigo-300 transition-all cursor-pointer group"
              >
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                    {state}
                  </p>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tighter">
                    {[450, 1200, 850][i]}
                  </h4>
                </div>
                <div className="size-10 bg-white rounded-xl flex items-center justify-center text-slate-300 group-hover:text-indigo-500 shadow-sm transition-all">
                  <ChevronRight size={18} />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-4">
              Certification Audit
            </h4>
            {[
              { l: "Eligible", v: 120, c: "text-indigo-600" },
              { l: "Issued", v: 850, c: "text-emerald-600" },
              { l: "Stuck/Pending", v: 12, c: "text-red-500" },
            ].map((item) => (
              <div
                key={item.l}
                onClick={() => navigate("/admin/students")}
                className="flex justify-between items-center py-2 cursor-pointer group"
              >
                <span className="text-xs font-black text-slate-700 uppercase group-hover:text-indigo-600 transition-all">
                  {item.l}
                </span>
                <span className={`text-sm font-black ${item.c}`}>
                  {item.v}{" "}
                  <span className="text-[9px] text-slate-400 font-black">
                    STUDENTS
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-10 text-center">
            E-Book Sales Distribution
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={EBOOK_PIE}
                  innerRadius={0}
                  outerRadius={90}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {EBOOK_PIE.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-6">
            {EBOOK_PIE.map((e) => (
              <div
                key={e.name}
                className="flex justify-between items-center text-[10px] font-black uppercase"
              >
                <span className="text-slate-500 flex items-center gap-2">
                  <div
                    className="size-2 rounded-full"
                    style={{ backgroundColor: e.color }}
                  />{" "}
                  {e.name}
                </span>
                <span className="text-slate-900">{e.value} Units</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- 🚩 CRITICAL ALERTS RADAR (FIXED LOGIC) --- */}
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-10">
            <div className="size-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center animate-pulse shadow-inner">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-widest text-red-600">
              Critical Alerts
            </h3>
          </div>

          <div className="flex-1 space-y-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Inactive Partners (15+ Days Alert)
            </p>

            {/* Show Top 3 Inactive Partners ✨ */}
            {INACTIVE_PARTNERS.slice(0, 3).map((p) => (
              <div
                key={p}
                className="flex justify-between items-center p-5 bg-red-50/50 border border-red-100 rounded-[24px] group hover:bg-red-500 transition-all duration-500"
              >
                <span className="text-xs font-black text-slate-800 group-hover:text-white">
                  {p}
                </span>
                <button
                  onClick={() => navigate("/admin/partners")}
                  className="p-2 bg-white text-red-500 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                >
                  <ExternalLink size={14} />
                </button>
              </div>
            ))}

            {/* Show remaining count if more than 3 ✨ */}
            {INACTIVE_PARTNERS.length > 3 && (
              <div
                onClick={() => navigate("/admin/partners")}
                className="flex justify-center items-center p-4 bg-slate-50 border border-slate-100 border-dashed rounded-[24px] cursor-pointer hover:bg-slate-100 transition-all group"
              >
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900">
                  + {INACTIVE_PARTNERS.length - 3} Others Pending Inspection
                </p>
                <ChevronRight
                  size={14}
                  className="ml-2 text-slate-300 group-hover:text-slate-900"
                />
              </div>
            )}
          </div>

          <div className="mt-10 pt-10 border-t border-slate-50">
            <div className="bg-indigo-50 p-6 rounded-[32px] border border-indigo-100 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase mb-2">
                  Hot Asset Spotlight
                </p>
                <h4 className="text-lg font-black text-slate-900 leading-none">
                  React Pro Mastery
                </h4>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-indigo-600 tracking-tighter">
                  840
                </p>
                <p className="text-[9px] font-black text-indigo-400 uppercase">
                  Total Units
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MICRO-COMPONENTS ---
const MacroCard = ({ title, val, subData, icon, color, onClick }) => {
  const styles = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-blue-50 text-blue-600",
  };
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className="bg-white p-7 rounded-[40px] border border-slate-100 shadow-sm cursor-pointer group transition-all"
    >
      <div
        className={`size-14 rounded-[20px] mb-6 flex items-center justify-center transition-all group-hover:rotate-12 ${styles[color]}`}
      >
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
        {title}
      </p>
      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
        {val}
      </h3>
      <div className="mt-4 flex gap-2">
        {subData.map((s, i) => (
          <span
            key={i}
            className="text-[9px] font-black px-2.5 py-1.5 bg-slate-50 text-slate-500 rounded-xl border border-slate-100 uppercase tracking-tighter"
          >
            {s.label}: {s.value}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default IntelligenceHub;