import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlayCircle, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const CourseCard = ({ course, onPlay }) => {
  const progress = course.progress || 0;
  const isCompleted = course.status === "completed";
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const calculateTimeAgo = () => {
      if (!course.lastAccessed) return "Never";
      const now = new Date();
      const lastAccess = new Date(course.lastAccessed);
      const diffMs = now - lastAccess;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    setTimeAgo(calculateTimeAgo());
    const interval = setInterval(() => setTimeAgo(calculateTimeAgo()), 60000);
    return () => clearInterval(interval);
  }, [course.lastAccessed]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 overflow-hidden flex flex-col h-full group"
    >
      {/* Thumbnail Area */}
      <div className="relative h-48 bg-slate-900 overflow-hidden">
        <img
          src={
            course.image ||
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
          }
          alt={course.title}
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-60 transition-all duration-500"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onPlay && onPlay(course)}
            className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/50 text-white hover:bg-[#5edff4] hover:border-[#5edff4] hover:text-slate-900 transition-all"
          >
            <PlayCircle className="size-8" />
          </button>
        </div>

        {/* Progress Badge */}
        <div className="absolute bottom-3 right-3 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-lg text-xs font-bold text-[#5edff4] border border-white/10">
          {isCompleted ? "Completed" : `${Math.round(progress)}%`}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="font-bold text-lg text-slate-900 leading-tight mb-2 line-clamp-2 group-hover:text-[#0891b2] transition-colors">
            {course.title}
          </h3>
          <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
            <span className="size-2 rounded-full bg-green-500" />
            Last Active: {timeAgo}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-auto space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
              <span>Progress</span>
              <span>{Math.round(progress)}/100%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-linear-to-r from-[#5edff4] to-[#0891b2] rounded-full"
              />
            </div>
          </div>

          <button
            onClick={() => onPlay && onPlay(course)}
            className="w-full block text-center py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-[#5edff4] hover:text-slate-900 transition-all shadow-lg hover:shadow-[#5edff4]/20"
          >
            {isCompleted ? "View Certificate" : "Continue Learning"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
