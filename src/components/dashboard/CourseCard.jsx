import React from "react";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  // ✅ REAL progress
  const progress = course.progress ?? 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 overflow-hidden flex flex-col h-full group"
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-slate-900 overflow-hidden">
        <img
          src={
            course.image ||
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
          }
          alt={course.title}
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-60 transition-all duration-500"
        />

        {/* ▶️ PLAY → LEARNING COURSE */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to={`/dashboard/my-learning/${course.id}`}   // ✅ CORRECT ROUTE
            className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/50 text-white hover:bg-[#5edff4] hover:border-[#5edff4] hover:text-slate-900 transition-all"
          >
            <PlayCircle className="size-8" />
          </Link>
        </div>

        {/* Progress Badge */}
        <div className="absolute bottom-3 right-3 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-lg text-xs font-bold text-[#5edff4] border border-white/10">
          {progress}% Complete
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-[#0891b2] transition-colors">
            {course.title}
          </h3>

          <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
            <span className="size-2 rounded-full bg-green-500" />
            Last Active:{" "}
            {course.lastActive
              ? new Date(course.lastActive).toLocaleDateString()
              : "Just now"}
          </p>
        </div>

        {/* Progress */}
        <div className="mt-auto space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
              <span>Progress</span>
              <span>{progress}/100%</span>
            </div>

            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#5edff4] to-[#0891b2]"
              />
            </div>
          </div>

          {/* 👉 RESUME LEARNING */}
          <Link
            to={`/dashboard/my-learning/${course.id}`}   // ✅ CORRECT ROUTE
            className="w-full block text-center py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-[#5edff4] hover:text-slate-900 transition-all shadow-lg hover:shadow-[#5edff4]/20"
          >
            {progress === 100 ? "View Certificate" : "Resume Learning"}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
