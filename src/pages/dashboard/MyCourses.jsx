import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import CourseCard from "../../components/dashboard/CourseCard";
import CourseVideoPlayer from "../../components/CourseVideoPlayer";
import { useCourse } from "../../context/CourseContext";

const MyCourses = () => {
  const { enrolledCourses } = useCourse();
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const filteredCourses = enrolledCourses.filter(course => {
    if (filterStatus === "all") return true;
    if (filterStatus === "in-progress") return course.status === "in-progress";
    if (filterStatus === "completed") return course.status === "completed";
    return true;
  });

  const inProgressCount = enrolledCourses.filter(c => c.status === "in-progress").length;
  const completedCount = enrolledCourses.filter(c => c.status === "completed").length;

  const handlePlayCourse = (course) => {
    setSelectedCourse(course);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Learning</h1>
          <p className="text-slate-500 mt-1">
            Manage your courses and track your progress.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-3 size-4 text-slate-400 group-focus-within:text-[#5edff4]" />
            <input
              type="text"
              placeholder="Search my courses..."
              className="bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:border-[#5edff4] focus:ring-1 focus:ring-[#5edff4] outline-none w-full sm:w-64 transition-all"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
            <Filter className="size-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-200">
        <button 
          onClick={() => setFilterStatus("all")}
          className={`pb-3 text-sm font-bold transition-colors ${
            filterStatus === "all" 
              ? "text-[#0891b2] border-b-2 border-[#0891b2]" 
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          All Courses ({enrolledCourses.length})
        </button>
        <button 
          onClick={() => setFilterStatus("in-progress")}
          className={`pb-3 text-sm font-bold transition-colors ${
            filterStatus === "in-progress" 
              ? "text-[#0891b2] border-b-2 border-[#0891b2]" 
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          In Progress ({inProgressCount})
        </button>
        <button 
          onClick={() => setFilterStatus("completed")}
          className={`pb-3 text-sm font-bold transition-colors ${
            filterStatus === "completed" 
              ? "text-[#0891b2] border-b-2 border-[#0891b2]" 
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.courseId} course={course} onPlay={handlePlayCourse} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <p className="text-slate-500 mb-4">
            {filterStatus === "all" 
              ? "You haven't enrolled in any courses yet." 
              : `No ${filterStatus.replace("-", " ")} courses.`}
          </p>
          {filterStatus === "all" && (
            <Link
              to="/courses"
              className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-[#5edff4] hover:text-slate-900 transition-all"
            >
              Explore Courses
            </Link>
          )}
        </div>
      )}
      
      {selectedCourse && (
        <CourseVideoPlayer 
          course={selectedCourse} 
          onClose={() => setSelectedCourse(null)} 
        />
      )}
    </div>
  );
};

export default MyCourses;
