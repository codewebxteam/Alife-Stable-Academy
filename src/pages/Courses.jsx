import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  BookOpen,
  Clock,
  ShoppingCart,
  CheckCircle,
  Play,
  Lock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCourse } from "../context/CourseContext";
import AuthModal from "../components/AuthModal";
import FAQSection from "../components/FAQSection";
import CourseVideoPlayer from "../components/CourseVideoPlayer";
import { COURSES_DATA } from "../data/coursesData";
import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

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
  const { enrollCourse, isEnrolled, getEnrolledCourse } = useCourse();
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [purchasedVideos, setPurchasedVideos] = useState([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [playingCourse, setPlayingCourse] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "courseVideos"), (snapshot) => {
      const videoList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVideos(videoList);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = onSnapshot(doc(db, "userPurchases", currentUser.uid), (docSnap) => {
        if (docSnap.exists()) {
          setPurchasedVideos(docSnap.data().purchasedVideos || []);
        }
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  const completePurchase = async () => {
    if (!currentUser) return;
    try {
      if (selectedCourse.isVideo) {
        await confirmVideoUnlock(selectedCourse);
      } else {
        await enrollCourse(selectedCourse);
        setShowPurchaseModal(false);
        navigate('/dashboard/my-courses');
      }
    } catch (error) {
      console.error("Error completing purchase:", error);
      alert("Purchase failed. Please try again.");
    }
  };

  const handlePlayVideo = (courseId) => {
    const enrolledCourse = getEnrolledCourse(courseId);
    if (enrolledCourse) {
      setPlayingCourse(enrolledCourse);
      setShowVideoPlayer(true);
    }
  };

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
      setSelectedCourse(course);
      setShowPurchaseModal(true);
    }
  };

  const handleUnlockVideos = async (video) => {
    if (!currentUser) {
      setIsAuthOpen(true);
    } else {
      setSelectedCourse({
        id: video.id,
        videoId: video.videoId,
        title: video.title,
        price: video.price ? `₹${video.price}` : '₹299',
        duration: 'Premium Video',
        lectures: '1 Video',
        category: 'Premium',
        isVideo: true
      });
      setShowPurchaseModal(true);
    }
  };

  const confirmVideoUnlock = async (video) => {
    try {
      const videoId = video?.id || 'unlock-all';
      const updatedPurchasedVideos = [...purchasedVideos, videoId];
      
      await setDoc(doc(db, "userPurchases", currentUser.uid), {
        purchasedVideos: updatedPurchasedVideos,
        lastPurchase: {
          videoId: videoId,
          title: video?.title || 'Premium Video Access',
          price: video?.price ? `₹${video.price}` : '₹299',
          purchaseDate: new Date().toISOString(),
        },
        userId: currentUser.uid,
        userEmail: currentUser.email,
      });
      
      // Add video to My Courses
      await enrollCourse({
        id: videoId,
        title: video?.title || 'Premium Video',
        image: `https://img.youtube.com/vi/${video?.videoId}/maxresdefault.jpg`,
        instructor: 'Premium Content',
        duration: 'Video Course',
        lectures: '1 Video',
        price: video?.price ? `₹${video.price}` : '₹299',
        category: 'Premium',
        rating: 5,
        level: 'All Levels',
        videoId: video?.videoId,
        youtubeId: video?.videoId
      });
      
      setShowPurchaseModal(false);
      navigate('/dashboard/my-courses');
    } catch (error) {
      console.error("Error unlocking video:", error);
      alert("Failed to unlock video. Please try again.");
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5edff4] to-[#0891b2]">
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

        {/* --- YouTube Videos Section --- */}
        {videos.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Featured Videos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isLocked={!purchasedVideos.includes(video.id)}
                  onUnlock={() => handleUnlockVideos(video)}
                />
              ))}
            </div>
          </div>
        )}

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
                    isEnrolled={isEnrolled(course.id)}
                    onBuy={() => handleBuyClick(course)}
                    onPlay={() => handlePlayVideo(course.id)}
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

      {showVideoPlayer && playingCourse && (
        <CourseVideoPlayer 
          course={playingCourse} 
          onClose={() => setShowVideoPlayer(false)} 
        />
      )}

      {/* Purchase Confirmation Modal */}
      <AnimatePresence>
        {showPurchaseModal && selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPurchaseModal(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden"
            >
              {/* Header with Image */}
              {selectedCourse.image && !selectedCourse.isVideo && (
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={selectedCourse.image} 
                    alt={selectedCourse.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <div className="absolute bottom-4 left-6 right-6">
                    <h3 className="text-xl font-bold text-white line-clamp-2">
                      {selectedCourse.title}
                    </h3>
                  </div>
                </div>
              )}

              <div className="p-8">
                {selectedCourse.isVideo && (
                  <div className="text-center mb-6">
                    <div className="size-16 bg-[#5edff4]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Lock size={32} className="text-[#5edff4]" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {selectedCourse.title}
                    </h3>
                  </div>
                )}

                {!selectedCourse.isVideo && (
                  <div className="text-center mb-6">
                    <div className="size-16 bg-[#5edff4]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart size={32} className="text-[#5edff4]" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Confirm Purchase
                    </h3>
                    <p className="text-slate-500">
                      Review course details before enrolling
                    </p>
                  </div>
                )}

                {/* Course Details */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-6 mb-6 border border-slate-200">
                  {/* Price */}
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-slate-900">
                      {selectedCourse.price}
                    </span>
                    {selectedCourse.originalPrice && (
                      <span className="text-lg text-slate-400 line-through">
                        {selectedCourse.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Course Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white rounded-xl p-3 text-center border border-slate-200">
                      <Clock className="size-5 text-[#5edff4] mx-auto mb-2" />
                      <p className="text-xs text-slate-500 mb-1">Duration</p>
                      <p className="text-sm font-bold text-slate-900">
                        {selectedCourse.duration}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center border border-slate-200">
                      <BookOpen className="size-5 text-[#5edff4] mx-auto mb-2" />
                      <p className="text-xs text-slate-500 mb-1">Content</p>
                      <p className="text-sm font-bold text-slate-900">
                        {selectedCourse.lectures}
                      </p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {!selectedCourse.isVideo && (
                    <>
                      {selectedCourse.instructor && (
                        <div className="flex items-center gap-3 bg-white rounded-xl p-3 mb-3 border border-slate-200">
                          <div className="size-10 rounded-full bg-slate-100 overflow-hidden">
                            <img
                              src={`https://ui-avatars.com/api/?name=${selectedCourse.instructor}&background=random`}
                              alt=""
                            />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Instructor</p>
                            <p className="text-sm font-bold text-slate-900">
                              {selectedCourse.instructor}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedCourse.category && (
                        <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-slate-200">
                          <span className="text-xs text-slate-500">Category</span>
                          <span className="text-sm font-bold text-[#0891b2] bg-[#f0fdff] px-3 py-1 rounded-lg">
                            {selectedCourse.category}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Benefits */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="size-5 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-green-900 mb-1">
                        What you'll get:
                      </p>
                      <ul className="text-xs text-green-700 space-y-1">
                        <li>✓ Lifetime access to all content</li>
                        <li>✓ Learn at your own pace</li>
                        <li>✓ Certificate of completion</li>
                        {!selectedCourse.isVideo && <li>✓ Access on mobile and desktop</li>}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={completePurchase}
                    className="w-full py-4 bg-gradient-to-r from-[#5edff4] to-[#0891b2] text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-[#5edff4]/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    ✓ Confirm Purchase
                  </button>
                  <button
                    onClick={() => setShowPurchaseModal(false)}
                    className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-center text-xs text-slate-400 mt-4">
                  🔒 Secure test purchase - No payment required
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Video Card Component with Embedded Player
const VideoCard = ({ video, isLocked, onUnlock }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl hover:shadow-2xl transition-all relative"
    >
      <div className="aspect-video relative">
        {isLocked ? (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800')] opacity-10 bg-cover bg-center" />
            <div className="relative z-10 text-center px-6">
              <div className="size-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/20">
                <Lock size={32} className="text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Locked Content</h3>
              <p className="text-white/70 text-sm mb-4">Purchase any course to unlock</p>
              <button
                onClick={onUnlock}
                className="px-6 py-2.5 bg-[#5edff4] text-slate-900 rounded-xl font-bold hover:bg-[#4ecee4] transition-all shadow-lg"
              >
                Unlock Now
              </button>
            </div>
          </div>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-slate-900 line-clamp-2">
          {video.title}
        </h3>
        {isLocked && (
          <div className="flex items-center gap-2 mt-2">
            <Lock size={14} className="text-slate-400" />
            <span className="text-xs text-slate-500">Premium Content</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// [UPDATED] Course Card with Separate EXPLORE and BUY Buttons
const CourseCard = ({ course, isEnrolled, onBuy, onPlay }) => {
  const navigate = useNavigate();
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
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60" />
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

          {/* TWO BUTTONS: Explore & Buy/Watch */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              to={`/courses/${course.id}`}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 hover:text-slate-900 transition-all text-center"
            >
              Explore
            </Link>

            {isEnrolled ? (
              <button
                onClick={onPlay}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5edff4] text-slate-900 text-xs font-bold hover:bg-[#4ecee4] transition-all shadow-lg cursor-pointer"
              >
                <Play className="size-4" /> Watch Now
              </button>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Courses;
