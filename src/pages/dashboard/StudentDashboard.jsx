import React, { useEffect, useState } from "react";
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
import { useCourse } from "../../context/CourseContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const { enrolledCourses } = useCourse();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState([]);
  const [stats, setStats] = useState([]);
  const [continueLearning, setContinueLearning] = useState(null);
  const [activeHours, setActiveHours] = useState(0);
  const [gamification, setGamification] = useState({
    level: 1,
    xp: 0,
    streak: 0,
  });

  const enrolledCoursesCount = enrolledCourses.length;

  // const upcomingEvents = [
  //   {
  //     title: "Live Q&A with Dr. Angela",
  //     time: "Tomorrow, 10:00 AM",
  //     type: "Live",
  //   },
  //   {
  //     title: "React Project Submission",
  //     time: "Sep 25, 11:59 PM",
  //     type: "Deadline",
  //   },
  // ];

  useEffect(() => {
    if (!currentUser) return;

    const ref = doc(db, "dashboard", currentUser.uid);

    const unsubscribe = onSnapshot(ref, async (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();

      if (data.stats.enrolledCourses !== enrolledCoursesCount) {
        await updateDoc(ref, {
          "stats.enrolledCourses": enrolledCoursesCount
        });
      }

      setStats([
        {
          label: "Enrolled Courses",
          value: enrolledCoursesCount,
          icon: PlayCircle,
          color: "text-[#5edff4]",
          bg: "bg-[#5edff4]/10",
          path: "/dashboard/my-courses",
        },
        {
          label: "Active Hours",
          value: `${data.stats.activeHours}h`,
          icon: Clock,
          color: "text-purple-400",
          bg: "bg-purple-400/10",
          path: "/dashboard/progress",
        },
        {
          label: "Certificates",
          value: data.stats.certificates,
          icon: Award,
          color: "text-yellow-400",
          bg: "bg-yellow-400/10",
          path: "/dashboard/certificates",
        },
        {
          label: "E-Books",
          value: data.stats.ebooks,
          icon: BookOpen,
          color: "text-green-400",
          bg: "bg-green-400/10",
          path: "/dashboard/ebooks",
        },
      ]);

      setActivityData(data.activity || []);
      setContinueLearning(data.currentCourse);
      setGamification(data.gamification);
      setActiveHours(data.stats.activeHours || 0);

      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, enrolledCoursesCount]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <span className="text-slate-500 font-semibold animate-pulse">
          Loading dashboard...
        </span>
      </div>
    );
  }

 const HOURS_PER_LEVEL = 10;

// Level calculation
const calculatedLevel = 1 + Math.floor(activeHours / HOURS_PER_LEVEL);

// Next level target in hours
const nextLevelTargetHours = calculatedLevel * HOURS_PER_LEVEL;

// Progress percentage (cumulative, never resets)
const progressPercent = Math.min(
  (activeHours / nextLevelTargetHours) * 100,
  100
);




  return (
    <div className="space-y-8 pb-10">
      {/* 1. HERO SECTION (Split Layout) */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 relative rounded-4xl overflow-hidden bg-slate-900 text-white p-8 md:p-10 shadow-2xl shadow-slate-900/20 flex flex-col justify-between min-h-70"
        >
          {/* Background Effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#5edff4]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold text-[#5edff4] mb-4 backdrop-blur-md">
              <Flame className="size-3 fill-[#5edff4]" />
              <span>{gamification.streak} Day Streak! Keep it up.</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Hello,{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#5edff4] to-[#0891b2]">
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
            {enrolledCoursesCount > 0 ? (
              <button
                onClick={() => navigate("/dashboard/my-courses")}
                className="
        px-6 py-3
        bg-[#5edff4]
        text-slate-900 font-bold
        rounded-xl
        hover:bg-[#4bcce0]
        transition-all
        shadow-lg shadow-[#5edff4]/20
        flex items-center gap-2
        active:scale-95
      "
              >
                <PlayCircle className="size-5" />
                Resume Learning
              </button>
            ) : (
              <button
                onClick={() => navigate("/dashboard/explore")}
                className="
        px-6 py-3
        bg-linear-to-r from-purple-500 to-indigo-500
        text-white font-bold
        rounded-xl
        hover:opacity-90
        transition-all
        shadow-lg shadow-purple-500/20
        flex items-center gap-2
        active:scale-95
      "
              >
                <ShoppingBag className="size-5" />
                Start Learning
              </button>
            )}
          </div>
        </motion.div>

        {/* Right: Gamification/Level Widget */}
        <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
  className="bg-white rounded-4xl border border-slate-200 p-8 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden"
>
  <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-[#5edff4] to-purple-500" />

  <div className="size-24 rounded-full border-4 border-[#5edff4]/20 flex items-center justify-center mb-4 relative">
    <Zap className="size-10 text-[#5edff4] fill-[#5edff4]" />
    <div className="absolute inset-0 border-4 border-[#5edff4] rounded-full border-t-transparent animate-spin-slow" />
  </div>

  <h3 className="text-2xl font-bold text-slate-900">
    Level {calculatedLevel}
  </h3>

  <p className="text-slate-500 text-sm mb-4">
    {activeHours >= 30 ? "Advanced Learner" : "Intermediate Scholar"}
  </p>

  {/* Progress Bar */}
  <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
    <div
      className="h-full bg-linear-to-r from-[#5edff4] to-purple-500 transition-all"
      style={{ width: `${progressPercent}%` }}
    />
  </div>

  <p className="text-xs font-bold text-slate-400">
   {activeHours} hrs / {nextLevelTargetHours} hrs to Level {calculatedLevel + 1}
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
            className="bg-white rounded-4xl border border-slate-200 p-8 shadow-sm"
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
            <div className="h-64 w-full min-h-50">
              {activityData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData}>
                    <XAxis dataKey="day" />
                    <Tooltip />
                    <Bar dataKey="hours" radius={[6, 6, 6, 6]}>
                      {activityData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={entry.hours > 4 ? "#5edff4" : "#cbd5e1"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* Current Course Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-4xl border border-slate-200 p-6 shadow-sm group cursor-pointer hover:border-[#5edff4] transition-colors"
            onClick={() => navigate("/dashboard/my-courses")}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                Continue Learning
              </h3>
              <MoreHorizontal className="text-slate-400" />
            </div>

            {continueLearning && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-4xl border border-slate-200 p-6 shadow-sm group cursor-pointer hover:border-[#5edff4] transition-colors"
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
                      src={continueLearning.image || "/placeholder-course.jpg"}
                      alt="Course thumbnail"
                      className="size-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
                      <PlayCircle className="size-6 text-white fill-white" />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="font-bold text-lg text-slate-900">
                      {continueLearning.title}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {continueLearning.chapter}
                    </p>

                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-2">
                        <span>{continueLearning.progress}% Complete</span>
                        <span>{continueLearning.timeLeft}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full">
                        <div
                          className="h-full bg-linear-to-r from-[#5edff4] to-[#0891b2]"
                          style={{ width: `${continueLearning.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* RIGHT COLUMN (1/3) */}
        <div className="lg:col-span-1 space-y-8">
          {/* Upcoming Schedule */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-4xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
                <Zap className="size-5" />
              </div>
              <h3 className="font-bold text-slate-900">Quick Actions</h3>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {enrolledCoursesCount > 0 ? (
                <>
                  {/* Continue Learning */}
                  <button
                    onClick={() => navigate("/dashboard/my-courses")}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl
            bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-200
            transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-sky-100 text-sky-600 group-hover:scale-110 transition-transform">
                        <PlayCircle className="size-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-sm text-slate-900">
                          Continue Learning
                        </p>
                        <p className="text-xs text-slate-500">
                          Resume where you left off
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="size-4 text-slate-400 group-hover:text-sky-600" />
                  </button>

                  {/* Certificates */}
                  <button
                    onClick={() => navigate("/dashboard/certificates")}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl
            bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200
            transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-100 text-amber-600 group-hover:scale-110 transition-transform">
                        <Award className="size-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-sm text-slate-900">
                          Certificates
                        </p>
                        <p className="text-xs text-slate-500">
                          View your achievements
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="size-4 text-slate-400 group-hover:text-amber-600" />
                  </button>
                </>
              ) : (
                <>
                  {/* Start Learning */}
                  <button
                    onClick={() => navigate("/dashboard/explore")}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl
            bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200
            transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform">
                        <PlayCircle className="size-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-sm text-slate-900">
                          Start Learning
                        </p>
                        <p className="text-xs text-slate-500">
                          Enroll in your first course
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="size-4 text-slate-400 group-hover:text-emerald-600" />
                  </button>

                  {/* Browse Courses */}
                  <button
                    onClick={() => navigate("/dashboard/explore")}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl
            bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200
            transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 group-hover:scale-110 transition-transform">
                        <ShoppingBag className="size-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-sm text-slate-900">
                          Browse Courses
                        </p>
                        <p className="text-xs text-slate-500">
                          Discover what to learn next
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="size-4 text-slate-400 group-hover:text-indigo-600" />
                  </button>
                </>
              )}
            </div>

            {/* Footer Hint (NOT a button) */}
            <div className="mt-6 text-center text-xs text-slate-400">
              {enrolledCoursesCount > 0
                ? "Keep your learning streak alive 🚀"
                : "Your learning journey starts here ✨"}
            </div>
          </motion.div>

          {/* Explore Widget */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-900 rounded-4xl p-8 text-white relative overflow-hidden flex flex-col items-center text-center"
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
