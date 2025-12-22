import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { COURSES_DATA } from "../../data/coursesData";

const ExploreCourses = () => {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Development", "Design", "Business", "Marketing"];

  // Safeguard: Ensure COURSES_DATA is an array before filtering
  const safeData = Array.isArray(COURSES_DATA) ? COURSES_DATA : [];

  const filteredCourses =
    filter === "All" ? safeData : safeData.filter((c) => c.category === filter);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Explore New Skills
        </h1>
        <p className="text-slate-500 text-lg">
          Discover premium courses curated for your career growth.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-3.5 size-5 text-slate-400" />
          <input
            type="text"
            placeholder="What do you want to learn?"
            className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 shadow-lg shadow-slate-200/20 outline-none focus:border-[#5edff4] focus:ring-2 focus:ring-[#5edff4]/20 transition-all"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${
              filter === cat
                ? "bg-slate-900 text-white shadow-lg scale-105"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <ExploreCard key={course.id} course={course} />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-slate-500">
              No courses found in this category.
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// Specialized Card (FIXED CLOSING TAG)
const ExploreCard = ({ course }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -8 }}
    className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
  >
    {/* Image */}
    <div className="relative h-48 overflow-hidden">
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
        <Star className="size-3 fill-yellow-400 text-yellow-400" />{" "}
        {course.rating}
      </div>
    </div>

    <div className="p-6 flex flex-col flex-1">
      <div className="mb-4">
        <span className="text-[10px] font-bold text-[#0891b2] uppercase tracking-wider">
          {course.category}
        </span>
        <h3 className="text-lg font-bold text-slate-900 leading-tight mt-1 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-xs text-slate-500 mt-2 line-clamp-2">
          By {course.instructor}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
        <div>
          <span className="block text-lg font-bold text-slate-900">
            {course.price}
          </span>
          <span className="text-xs text-slate-400 line-through">
            {course.originalPrice}
          </span>
        </div>
        <Link
          to={`/courses/${course.id}`}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-[#5edff4] hover:text-slate-900 transition-all shadow-lg hover:shadow-[#5edff4]/20 flex items-center gap-2"
        >
          <ShoppingCart className="size-4" /> Buy Now
        </Link>
      </div>
    </div>
  </motion.div> 
);

export default ExploreCourses;
