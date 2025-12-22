import React from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import CourseCard from "../../components/dashboard/CourseCard";
import { COURSES_DATA } from "../../data/coursesData"; // Importing your existing data

const MyCourses = () => {
  // Simulate "Enrolled" courses by just taking the first 4 for now
  // In real app: const { currentUser } = useAuth(); const myCourses = currentUser.enrolledCourses;
  const myCourses = COURSES_DATA.slice(0, 4);

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

      {/* Tabs (Optional) */}
      <div className="flex gap-6 border-b border-slate-200">
        <button className="pb-3 text-sm font-bold text-[#0891b2] border-b-2 border-[#0891b2]">
          All Courses ({myCourses.length})
        </button>
        <button className="pb-3 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          In Progress
        </button>
        <button className="pb-3 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          Completed
        </button>
      </div>

      {/* Course Grid */}
      {myCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        // Empty State
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <p className="text-slate-500 mb-4">
            You haven't enrolled in any courses yet.
          </p>
          <Link
            to="/courses"
            className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-[#5edff4] hover:text-slate-900 transition-all"
          >
            Explore Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
