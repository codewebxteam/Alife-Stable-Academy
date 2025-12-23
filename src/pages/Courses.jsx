import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, BookOpen, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import FAQSection from "../components/FAQSection";
import { COURSES_DATA } from "../data/coursesData";
import { enrollCourseFirebase } from "../utils/courseEnrollment";

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
  const navigate = useNavigate();

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

  const handleBuyClick = async (course) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    await enrollCourseFirebase(currentUser.uid, course.id);

    // 🔥 redirect to My Learning
    navigate("/dashboard/my-learning");
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans">
      <div className="pt-20 md:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900">
                Explore Courses
              </h1>
              <p className="text-slate-500">
                Transform your career with industry-leading skills.
              </p>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-4 size-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence>
            <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onBuy={() => handleBuyClick(course)}
                />
              ))}
            </motion.div>
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

const CourseCard = ({ course, onBuy }) => (
  <motion.div className="bg-white rounded-3xl border shadow-xl p-6 flex flex-col">
    <Link to={`/courses/${course.id}`}>
      <img
        src={course.image}
        alt={course.title}
        className="h-40 w-full object-cover rounded-xl"
      />
    </Link>

    <h3 className="font-bold text-lg mt-4">{course.title}</h3>

    <div className="mt-auto grid grid-cols-2 gap-3 pt-4">
      <Link
        to={`/courses/${course.id}`}
        className="border rounded-xl py-2 text-center font-bold text-sm"
      >
        Explore
      </Link>

      <button
        onClick={onBuy}
        className="bg-slate-900 text-white rounded-xl py-2 font-bold text-sm"
      >
        {course.price === "Free" ? "Enroll" : "Buy Now"}
      </button>
    </div>
  </motion.div>
);

export default Courses;
