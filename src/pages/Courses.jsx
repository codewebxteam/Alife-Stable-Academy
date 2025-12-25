import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import FAQSection from "../components/FAQSection";
import { COURSES_DATA } from "../data/coursesData";
import { enrollCourseFirebase } from "../services/enrollment.service";

const Courses = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [loadingId, setLoadingId] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = COURSES_DATA.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleBuy = async (course) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    try {
      setLoadingId(course.id);
      await enrollCourseFirebase(currentUser.uid, course.id);
      navigate("/dashboard/my-learning");
    } catch (e) {
      console.error("❌ enroll failed", e);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-6">Explore Courses</h1>

        <div className="relative w-full max-w-md mb-10">
          <Search className="absolute left-3 top-3 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="pl-10 py-3 w-full border rounded-xl"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((course) => (
            <ExploreCourseCard
              key={course.id}
              course={course}
              loading={loadingId === course.id}
              onBuy={() => handleBuy(course)}
            />
          ))}
        </div>
      </div>

      <FAQSection />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
};

export default Courses;

/* ---------------- CARD ---------------- */

const ExploreCourseCard = ({ course, onBuy, loading }) => {
  return (
    <motion.div className="bg-white rounded-3xl border shadow-lg p-6 flex flex-col">
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
          disabled={loading}
          className="bg-slate-900 text-white rounded-xl py-2 font-bold text-sm disabled:opacity-60"
        >
          {loading ? "Enrolling..." : "Buy Now"}
        </button>
      </div>
    </motion.div>
  );
};
