import React from "react";
import { motion } from "framer-motion";
import {
  PlayCircle,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Zap,
  Calendar,
  MoreHorizontal,
  Flame,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // --- Mock Data for Chart ---
  const activityData = [
    { day: "M", hours: 2 },
    { day: "T", hours: 4.5 },
    { day: "W", hours: 1.5 },
    { day: "T", hours: 5 },
    { day: "F", hours: 3 },
    { day: "S", hours: 6 },
    { day: "S", hours: 4 },
  ];

  // --- Stats Data ---
  const stats = [
    {
      label: "Enrolled Courses",
      value: "3",
      icon: PlayCircle,
      color: "text-[#5edff4]",
      bg: "bg-[#5edff4]/10",
      path: "/dashboard/my-courses",
    },
    {
      label: "Active Hours",
      value: "26h",
      icon: Clock,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      path: "/dashboard/progress",
    },
    {
      label: "Certificates",
      value: "1",
      icon: Award,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      path: "/dashboard/certificates",
    },
    {
      label: "E-Books",
      value: "4",
      icon: BookOpen,
      color: "text-green-400",
      bg: "bg-green-400/10",
      path: "/dashboard/ebooks",
    },
  ];

  const continueLearning = {
    title: "Fullstack Web Development",
    progress: 65,
    chapter: "Chapter 4: React Hooks Deep Dive",
    timeLeft: "45m remaining",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
  };

  const upcomingEvents = [
    {
      title: "Live Q&A with Dr. Angela",
      time: "Tomorrow, 10:00 AM",
      type: "Live",
    },
    {
      title: "React Project Submission",
      time: "Sep 25, 11:59 PM",
      type: "Deadline",
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* 1. HERO SECTION (Split Layout) */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 relative rounded-[2rem] overflow-hidden bg-slate-900 text-white p-8 md:p-10 shadow-2xl shadow-slate-900/20 flex flex-col justify-between min-h-[280px]"
        >
          {/* Background Effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#5edff4]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold text-[#5edff4] mb-4 backdrop-blur-md">
              <Flame className="size-3 fill-[#5edff4]" />
              <span>7 Day Streak! Keep it up.</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Hello,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5edff4] to-[#0891b2]">
                {currentUser?.displayName?.split(" ")[0] || "Student"}
              </span>
            </h1>
            <p className="text-slate-300 text-lg max-w-lg">
              You've learned <span className="text-white font-bold">85%</span>{" "}
              more this week compared to last week. Your consistency is paying
              off.
            </p>
          </div>

          <div className="relative z-10 pt-8 flex gap-4">
            <button
              onClick={() => navigate("/dashboard/my-courses")}
              className="px-6 py-3 bg-[#5edff4] text-slate-900 font-bold rounded-xl hover:bg-[#4bcce0] transition-all shadow-lg shadow-[#5edff4]/20 flex items-center gap-2 active:scale-95"
            >
              <PlayCircle className="size-5" /> Resume Learning
            </button>
          </div>
        </motion.div>

        {/* Right: Gamification/Level Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#5edff4] to-purple-500" />

          <div className="size-24 rounded-full border-4 border-[#5edff4]/20 flex items-center justify-center mb-4 relative">
            <Zap className="size-10 text-[#5edff4] fill-[#5edff4]" />
            <div className="absolute inset-0 border-4 border-[#5edff4] rounded-full border-t-transparent animate-spin-slow" />
          </div>

          <h3 className="text-2xl font-bold text-slate-900">Level 4</h3>
          <p className="text-slate-500 text-sm mb-4">Intermediate Scholar</p>

          <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#5edff4] to-purple-500 w-[70%]" />
          </div>
          <p className="text-xs font-bold text-slate-400">
            2,400 / 3,000 XP to Level 5
          </p>
        </motion.div>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            onClick={() => navigate(stat.path)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            whileHover={{ y: -5 }}
            className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}
              >
                <stat.icon className="size-6" />
              </div>
              <div className="p-2 rounded-full hover:bg-slate-50 text-slate-300 hover:text-slate-600 transition-colors">
                <ArrowRight className="size-4 -rotate-45 group-hover:rotate-0 transition-transform" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">
              {stat.value}
            </p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* 3. MAIN CONTENT GRID */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Activity Chart Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Learning Activity
                </h3>
                <p className="text-slate-500 text-sm">Your daily study hours</p>
              </div>
              <select className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg px-3 py-2 outline-none">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: "bold" }}
                    dy={10}
                  />
                  <Tooltip
                    cursor={{ fill: "#f1f5f9", radius: 8 }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="hours" radius={[6, 6, 6, 6]} barSize={32}>
                    {activityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.hours > 4 ? "#5edff4" : "#cbd5e1"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Current Course Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm group cursor-pointer hover:border-[#5edff4] transition-colors"
            onClick={() => navigate("/dashboard/my-courses")}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                Continue Learning
              </h3>
              <MoreHorizontal className="text-slate-400" />
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 aspect-video rounded-2xl overflow-hidden relative shrink-0">
                <img
                  src={continueLearning.image}
                  alt=""
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center">
                  <div className="size-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <PlayCircle className="size-5 text-white fill-white" />
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-[#0891b2] transition-colors">
                      {continueLearning.title}
                    </h4>
                    <p className="text-sm font-medium text-slate-500">
                      {continueLearning.chapter}
                    </p>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                    <span>{continueLearning.progress}% Complete</span>
                    <span>{continueLearning.timeLeft}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${continueLearning.progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#5edff4] to-[#0891b2] rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN (1/3) */}
        <div className="lg:col-span-1 space-y-8">
          {/* Upcoming Schedule */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                <Calendar className="size-5" />
              </div>
              <h3 className="font-bold text-slate-900">Upcoming</h3>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((event, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-2xl transition-colors"
                >
                  <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-100 rounded-xl shrink-0 font-bold text-slate-600 text-xs">
                    <span>{event.time.split(" ")[0]}</span>
                    <span className="text-lg text-slate-900">
                      {Math.floor(Math.random() * 30) + 1}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                      {event.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">{event.time}</p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded mt-2 inline-block ${
                        event.type === "Live"
                          ? "bg-red-50 text-red-500"
                          : "bg-orange-50 text-orange-500"
                      }`}
                    >
                      {event.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-3 text-xs font-bold text-slate-500 hover:text-slate-900 border-t border-slate-100 transition-colors">
              View Full Calendar
            </button>
          </motion.div>

          {/* Explore Widget */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden flex flex-col items-center text-center"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="size-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 relative z-10 border border-white/10">
              <ShoppingBag className="size-6 text-[#5edff4]" />
            </div>
            <h3 className="text-xl font-bold mb-2 relative z-10">
              New Courses
            </h3>
            <p className="text-slate-400 text-sm mb-6 relative z-10">
              Unlock premium content to accelerate your career.
            </p>
            <button
              onClick={() => navigate("/dashboard/explore")}
              className="w-full py-3 bg-[#5edff4] text-slate-900 font-bold rounded-xl hover:bg-[#4bcce0] transition-colors relative z-10 shadow-lg shadow-[#5edff4]/20"
            >
              Explore Store
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
