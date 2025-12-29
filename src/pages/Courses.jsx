 import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, BookOpen, Clock, Plus, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import FAQSection from "../components/FAQSection";
import { db } from "../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";

const CATEGORIES = ["All", "Development", "Design", "Data Science", "Marketing", "Finance"];

const Courses = () => {
  const { currentUser } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiveCourses = async () => {
      try {
        setLoading(true);
        // Base Query
        let q = query(collection(db, "courses"), where("status", "==", "Active"));
        
        // Category Filter from DB
        if (activeCategory !== "All") {
          q = query(collection(db, "courses"), 
            where("status", "==", "Active"), 
            where("category", "==", activeCategory)
          );
        }

        const querySnapshot = await getDocs(q);
        const liveData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(liveData);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchLiveCourses();
  }, [activeCategory]); // Re-fetch on category change

  const filteredCourses = courses.filter((course) => 
    course.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBuyClick = (course) => {
    if (!currentUser) setIsAuthOpen(true);
    else alert(`🎉 Successfully enrolled in ${course.title}!`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 animate-spin text-[#0891b2]" />
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans">
      <div className="pt-20 md:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-2">
                Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5edff4] to-[#0891b2]">Courses</span>
              </h1>
              <p className="text-slate-500">Transform your career with industry-leading skills.</p>
            </div>
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-[#5edff4]" />
              <input type="text" placeholder="Search courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 focus:border-[#5edff4] outline-none shadow-sm transition-all" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-10 justify-center md:justify-start">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-full text-sm font-bold transition-all border ${activeCategory === cat ? "bg-[#5edff4] text-slate-900 border-[#5edff4] shadow-lg" : "bg-white text-slate-600 border-slate-200 hover:border-[#5edff4]"}`}>{cat}</button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            {filteredCourses.length > 0 ? (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} onBuy={() => handleBuyClick(course)} />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <Search className="size-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900">No courses found</h3>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <FAQSection />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultMode="login" />
    </div>
  );
};

const CourseCard = ({ course, onBuy }) => (
  <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl group transition-all flex flex-col h-full">
    <Link to={`/courses/${course.id}`} className="relative h-48 overflow-hidden block">
      <img src={course.thumbnail} alt={course.title} className="size-full object-cover group-hover:scale-110 transition-duration-500" />
      <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-[10px] font-black uppercase text-indigo-600">{course.level}</div>
    </Link>
    <div className="p-6 flex flex-col flex-1">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-[#0891b2] bg-[#f0fdff] px-2 py-1 rounded-md">{course.category}</span>
        <div className="flex items-center gap-1"><Star className="size-3 text-yellow-400 fill-yellow-400" /><span className="text-xs font-bold">4.5</span></div>
      </div>
      <Link to={`/courses/${course.id}`} className="block">
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 min-h-12 hover:text-[#0891b2]">{course.title}</h3>
      </Link>
      <p className="text-slate-500 text-xs line-clamp-2 mb-4">{course.subtitle}</p>
      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 line-through">₹{course.price}</span>
          <span className="text-xl font-bold text-slate-900">₹{course.discountPrice}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Link to={`/courses/${course.id}`} className="flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-50">Explore</Link>
        <button onClick={onBuy} className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-[#5edff4] hover:text-slate-900 shadow-lg">Buy Now</button>
      </div>
    </div>
  </motion.div>
);

export default Courses;