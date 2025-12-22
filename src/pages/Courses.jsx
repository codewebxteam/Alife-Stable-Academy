import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  BookOpen,
  Clock,
  ShoppingCart,
  CheckCircle,
  ArrowRight,
  Eye,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import FAQSection from "../components/FAQSection";
import { COURSES_DATA } from "../data/coursesData"; // [NEW] Importing centralized data

const CATEGORIES = [
  "All",
  "Development",
  "Design",
  "Data Science",
  "Marketing",
  "Finance",
];

const Courses = () => {
  const { currentUser } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = COURSES_DATA.filter((course) => {
    const matchesCategory =
      activeCategory === "All" || course.category === activeCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle Buy Logic
  const handleBuyClick = (course) => {
    if (!currentUser) {
      setIsAuthOpen(true);
    } else {
      alert(
        `🎉 Successfully enrolled in ${course.title}! \n(Check your dashboard)`
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans">
      <div className="pt-20 md:pt-32 pb-20">
        {/* --- Header Section --- */}
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-2">
                Explore Our{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#5edff4] to-[#0891b2]">
                  Courses
                </span>
              </h1>
              <p className="text-slate-500">
                Transform your career with industry-leading skills.
              </p>
            </div>

            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="size-5 text-slate-400 group-focus-within:text-[#5edff4] transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search courses, mentors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 bg-white shadow-sm focus:outline-none focus:border-[#5edff4] focus:ring-1 focus:ring-[#5edff4] transition-all"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-10 justify-center md:justify-start">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 border cursor-pointer
                ${
                  activeCategory === cat
                    ? "bg-[#5edff4] text-slate-900 border-[#5edff4] shadow-lg shadow-[#5edff4]/25"
                    : "bg-white text-slate-600 border-slate-200 hover:border-[#5edff4] hover:text-[#0891b2]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* --- Courses Grid --- */}
        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            {filteredCourses.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onBuy={() => handleBuyClick(course)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="size-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="size-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  No courses found
                </h3>
                <p className="text-slate-500">
                  Try adjusting your search or filters.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <FAQSection />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultMode="login"
      />
    </div>
  );
};

// [UPDATED] Course Card with Separate EXPLORE and BUY Buttons
const CourseCard = ({ course, onBuy }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 group hover:shadow-2xl hover:shadow-[#5edff4]/10 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
    >
      {/* Clickable Image -> Goes to Details */}
      <Link
        to={`/courses/${course.id}`}
        className="relative h-48 overflow-hidden shrink-0 block cursor-pointer"
      >
        <img
          src={course.image}
          alt={course.title}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent opacity-60" />
        <div className="absolute top-4 left-4 flex gap-2">
          {course.tags &&
            course.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-slate-900 uppercase tracking-wide"
              >
                {tag}
              </span>
            ))}
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#0891b2] bg-[#f0fdff] px-2 py-1 rounded-md uppercase tracking-wider">
            {course.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="size-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-slate-700">
              {course.rating}
            </span>
            <span className="text-xs text-slate-400">({course.reviews})</span>
          </div>
        </div>

        {/* Clickable Title -> Goes to Details */}
        <Link to={`/courses/${course.id}`} className="block">
          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 min-h-14 leading-tight group-hover:text-[#0891b2] transition-colors">
            {course.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {course.duration}
          </div>
          <div className="size-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-1">
            <BookOpen className="size-3.5" />
            {course.lectures}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-5">
          <div className="size-8 rounded-full bg-slate-100 overflow-hidden border border-white shadow-sm">
            <img
              src={`https://ui-avatars.com/api/?name=${course.instructor}&background=random`}
              alt=""
            />
          </div>
          <span className="text-xs font-medium text-slate-600">
            By {course.instructor}
          </span>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              {course.price !== "Free" && (
                <span className="text-xs text-slate-400 line-through">
                  {course.originalPrice}
                </span>
              )}
              <span
                className={`text-xl font-bold ${
                  course.price === "Free" ? "text-green-600" : "text-slate-900"
                }`}
              >
                {course.price}
              </span>
            </div>
          </div>

          {/* TWO BUTTONS: Explore & Buy */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              to={`/courses/${course.id}`}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 hover:text-slate-900 transition-all text-center"
            >
              Explore
            </Link>

            <button
              onClick={onBuy}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-lg cursor-pointer
                ${
                  course.price === "Free"
                    ? "bg-green-600 hover:bg-green-500 shadow-green-600/20"
                    : "bg-slate-900 hover:bg-[#5edff4] hover:text-slate-900 shadow-slate-900/10 hover:shadow-[#5edff4]/30"
                }`}
            >
              {course.price === "Free" ? "Enroll" : "Buy Now"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Courses;
