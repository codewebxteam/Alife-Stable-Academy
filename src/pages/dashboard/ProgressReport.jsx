import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Clock,
  Target,
  Flame,
  Zap,
  Award,
  BarChart3,
} from "lucide-react";

const ProgressReport = () => {
  const [timeRange, setTimeRange] = useState("Weekly");
  const [focusBar, setFocusBar] = useState(null);

  // Mock Data for Recharts
  const data = [
    { name: "Mon", hours: 2.5 },
    { name: "Tue", hours: 4.0 },
    { name: "Wed", hours: 1.5 },
    { name: "Thu", hours: 5.2 },
    { name: "Fri", hours: 3.0 },
    { name: "Sat", hours: 6.5 },
    { name: "Sun", hours: 4.8 },
  ];

  const courseProgress = [
    {
      title: "Complete Web Development Bootcamp",
      watched: "12h 30m",
      total: "60h",
      progress: 20,
      lastActive: "2 hours ago",
    },
    {
      title: "UI/UX Design Masterclass",
      watched: "8h 15m",
      total: "25h",
      progress: 33,
      lastActive: "Yesterday",
    },
    {
      title: "React JS - The Complete Guide",
      watched: "45h 00m",
      total: "50h",
      progress: 90,
      lastActive: "3 days ago",
    },
  ];

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl border border-slate-700">
          <p>{`${label} : ${payload[0].value} Hrs`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-10">
      {/* 1. HEADER & FILTER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Analytics</h1>
          <p className="text-slate-500 mt-1">
            Deep dive into your learning performance.
          </p>
        </div>
        <div className="bg-white p-1 rounded-xl border border-slate-200 flex shadow-sm">
          {["Weekly", "Monthly", "Yearly"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                timeRange === range
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* 2. HERO METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Clock}
          label="Total Watch Time"
          value="65.4 Hrs"
          subtext="+12% vs last week"
          color="text-[#5edff4]"
          bg="bg-slate-900"
          dark
        />
        <StatCard
          icon={Flame}
          label="Current Streak"
          value="12 Days"
          subtext="Don't break the chain!"
          color="text-orange-500"
          bg="bg-white"
        />
        <StatCard
          icon={Zap}
          label="Focus Score"
          value="88/100"
          subtext="High efficiency detected"
          color="text-purple-500"
          bg="bg-white"
        />
        <StatCard
          icon={Award}
          label="Lessons Completed"
          value="142"
          subtext="Top 5% of students"
          color="text-yellow-500"
          bg="bg-white"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 3. MAIN ACTIVITY CHART (Recharts Integration) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Learning Activity
              </h3>
              <p className="text-slate-500 text-sm">
                Hours spent watching content
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <TrendingUp className="size-4" /> +2.5 hrs avg
            </div>
          </div>

          {/* RECHARTS CONTAINER */}
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                onMouseMove={(state) => {
                  if (state.isTooltipActive) {
                    setFocusBar(state.activeTooltipIndex);
                  } else {
                    setFocusBar(null);
                  }
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: "bold" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "transparent" }}
                />
                <Bar
                  dataKey="hours"
                  radius={[8, 8, 8, 8]}
                  barSize={40}
                  animationDuration={1500}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={focusBar === index ? "#5edff4" : "#1e293b"} // Dark Blue (#1e293b) -> Light Blue on hover
                      className="transition-all duration-300 cursor-pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 4. COURSE-WISE BREAKDOWN */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col"
        >
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#5edff4]/10 rounded-full blur-[80px] pointer-events-none" />

          <h3 className="text-xl font-bold mb-6 relative z-10">
            Detailed Progress
          </h3>
          <div className="space-y-6 relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {courseProgress.map((course, i) => (
              <div key={i} className="group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-sm text-slate-100 line-clamp-1 flex-1 pr-4 group-hover:text-[#5edff4] transition-colors">
                    {course.title}
                  </h4>
                  <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                    {course.progress}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    className="h-full bg-[#5edff4] rounded-full shadow-[0_0_10px_#5edff4]"
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>
                    {course.watched} / {course.total} watched
                  </span>
                  <span className="text-slate-500">
                    Active {course.lastActive}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-auto pt-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
            <BarChart3 className="size-4" /> View Full Report
          </button>
        </motion.div>
      </div>

      {/* 5. FOCUS ANALYSIS */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="p-4 bg-orange-50 rounded-2xl text-orange-500">
            <Clock className="size-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">
              Peak Productivity
            </h4>
            <p className="text-slate-500 text-sm">
              You learn best between{" "}
              <span className="text-slate-900 font-bold">8 PM - 10 PM</span>.
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="p-4 bg-blue-50 rounded-2xl text-blue-500">
            <Target className="size-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">Weekly Goal</h4>
            <p className="text-slate-500 text-sm">
              You are{" "}
              <span className="text-green-600 font-bold">2.5 hours ahead</span>{" "}
              of your schedule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon: Icon, label, value, subtext, color, bg, dark }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`p-6 rounded-3xl border shadow-sm transition-all ${
      dark
        ? "bg-slate-900 border-slate-800 text-white shadow-slate-900/20"
        : "bg-white border-slate-100 text-slate-900 hover:shadow-lg"
    }`}
  >
    <div className="flex justify-between items-start mb-4">
      <div
        className={`p-3 rounded-2xl ${
          dark ? "bg-white/10" : "bg-slate-50"
        } ${color}`}
      >
        <Icon className="size-6" />
      </div>
      {dark && (
        <div className="px-2 py-1 rounded bg-[#5edff4]/20 text-[#5edff4] text-[10px] font-bold uppercase">
          Pro
        </div>
      )}
    </div>
    <h3 className="text-3xl font-bold mb-1">{value}</h3>
    <p
      className={`text-sm font-medium ${
        dark ? "text-slate-400" : "text-slate-500"
      }`}
    >
      {label}
    </p>
    <p
      className={`text-xs mt-3 font-bold ${
        dark ? "text-green-400" : "text-green-600"
      }`}
    >
      {subtext}
    </p>
  </motion.div>
);

export default ProgressReport;
