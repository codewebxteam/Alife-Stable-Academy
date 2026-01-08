import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  GraduationCap,
  Trash2,
  X,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Rocket,
  ChevronUp,
  ChevronDown,
  Layout,
  BookOpen,
  Youtube,
  Link as LinkIcon,
  FileText,
  AlignLeft,
  List,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";

const CourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialFormState = {
    title: "",
    description: "",
    syllabus: "",
    price: 299,
    discountPrice: 999,
    youtubeUrl: "",
    youtubeId: "",
    driveLink: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "courseVideos"));
      const courseList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(courseList);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const extractVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleLaunchNew = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setCurrentStep(1);
    setShowModal(true);
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setFormData({
      title: course.title || "",
      description: course.description || "",
      syllabus: course.syllabus || "",
      price: course.price || 299,
      discountPrice: course.originalPrice || 999,
      youtubeUrl: course.url || "",
      youtubeId: course.videoId || "",
      driveLink: course.driveLink || "",
    });
    setCurrentStep(1);
    setShowModal(true);
  };

  const handleFinalSubmit = async () => {
    if (!formData.title || !formData.youtubeUrl || !formData.price) {
      alert("⚠️ Title, YouTube URL and Pricing are required!");
      return;
    }

    const videoId = extractVideoId(formData.youtubeUrl);
    if (!videoId) {
      alert("Invalid YouTube URL");
      return;
    }

    setLoading(true);
    try {
      const courseData = {
        title: formData.title,
        description: formData.description,
        syllabus: formData.syllabus,
        url: formData.youtubeUrl,
        videoId: videoId,
        driveLink: formData.driveLink,
        price: formData.price.toString(),
        originalPrice: formData.discountPrice.toString(),
        updatedAt: new Date().toISOString(),
        image: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        instructor: "Experienced Mentor",
        rating: 4.8,
        lectures: "1 Module",
        duration: "Flexible",
      };

      if (editingId) {
        await updateDoc(doc(db, "courseVideos", editingId), courseData);
      } else {
        await addDoc(collection(db, "courseVideos"), {
          ...courseData,
          createdAt: new Date().toISOString(),
        });
      }

      setShowModal(false);
      fetchCourses();
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Failed to save course");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this module?")) return;
    try {
      await deleteDoc(doc(db, "courseVideos", id));
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const steps = [
    { id: 1, label: "Info", icon: <Layout size={18} /> },
    { id: 2, label: "Content", icon: <Youtube size={18} /> },
    { id: 3, label: "Price", icon: <DollarSign size={18} /> },
    { id: 4, label: "Done", icon: <Rocket size={18} /> },
  ];

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col lg:flex-row gap-6">
      {/* 1. MOBILE HEADER (Only visible on small screens) */}
      <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <GraduationCap size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 leading-none">
              Courses
            </h2>
            <p className="text-xs text-slate-400 font-bold">
              {courses.length} Active
            </p>
          </div>
        </div>
        <button
          onClick={handleLaunchNew}
          className="size-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* 2. DESKTOP SIDEBAR (Hidden on mobile) */}
      <div className="hidden lg:flex w-[350px] flex-col">
        <div className="bg-slate-950 p-8 rounded-[40px] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden h-[500px] sticky top-0">
          <div className="absolute top-0 right-0 size-64 bg-indigo-500/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
          <div className="relative z-10">
            <div className="size-16 bg-indigo-500 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-indigo-500/20">
              <GraduationCap size={32} className="text-white" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter mb-4 leading-none uppercase">
              Course <br /> <span className="text-indigo-400">Manager</span>
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed italic">
              "Create and manage your curriculum efficiently."
            </p>
          </div>
          <button
            onClick={handleLaunchNew}
            className="mt-auto flex items-center justify-center gap-3 w-full py-5 bg-white text-slate-950 rounded-[24px] font-black uppercase text-[11px] tracking-widest hover:bg-indigo-400 hover:text-white transition-all duration-500 shadow-xl"
          >
            <Plus size={18} /> Create New Course
          </button>
        </div>
      </div>

      {/* 3. COURSE LIST AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 lg:pb-0">
        <div className="hidden lg:flex items-center justify-between mb-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Active Inventory ({courses.length})
          </h3>
          <Layout size={16} className="text-slate-300" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {courses.map((course) => (
              <motion.div
                layout
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-4 rounded-[24px] border border-slate-100 flex flex-col gap-4 group hover:shadow-xl hover:border-indigo-100 transition-all duration-300"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-100 rounded-2xl overflow-hidden shrink-0 relative">
                    {course.videoId ? (
                      <img
                        src={`https://img.youtube.com/vi/${course.videoId}/default.jpg`}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-300">
                        <BookOpen size={24} />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Video
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-tight line-clamp-2 mb-1">
                      {course.title || "Untitled Module"}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-auto">
                      {course.description || "No description provided."}
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        ₹{course.price}
                      </span>
                      {course.driveLink && (
                        <span className="p-1.5 bg-indigo-50 text-indigo-500 rounded-lg">
                          <LinkIcon size={14} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-50">
                  <button
                    onClick={() => handleEdit(course)}
                    className="flex-1 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="flex-1 py-2.5 bg-red-50 text-red-500 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {courses.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen size={24} />
            </div>
            <p className="text-sm font-medium">No courses found.</p>
            <button
              onClick={handleLaunchNew}
              className="mt-4 text-indigo-500 text-sm font-bold hover:underline lg:hidden"
            >
              Create your first course
            </button>
          </div>
        )}
      </div>

      {/* 4. RESPONSIVE MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-4xl h-[95vh] sm:h-[85vh] sm:rounded-[40px] rounded-t-[32px] shadow-2xl relative z-10 flex flex-col overflow-hidden"
            >
              {/* MODAL HEADER - Mobile Optimized */}
              <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-white z-20">
                {/* Mobile Steps Indicator */}
                <div className="flex gap-1 sm:hidden flex-1 mr-4">
                  {steps.map((step) => (
                    <div
                      key={step.id}
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        currentStep >= step.id
                          ? "bg-indigo-500"
                          : "bg-slate-100"
                      }`}
                    />
                  ))}
                </div>

                {/* Desktop Steps */}
                <div className="hidden sm:flex items-center gap-2">
                  {steps.map((step) => (
                    <div
                      key={step.id}
                      onClick={() => setCurrentStep(step.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all ${
                        currentStep === step.id
                          ? "bg-slate-900 text-white shadow-lg"
                          : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      {step.icon}
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="size-8 sm:size-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* MODAL CONTENT - Scrollable */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-10 custom-scrollbar bg-white">
                <div className="max-w-xl mx-auto pb-20 sm:pb-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {currentStep === 1 && (
                        <CourseInfoTab
                          formData={formData}
                          setFormData={setFormData}
                        />
                      )}
                      {currentStep === 2 && (
                        <VideoSourceTab
                          formData={formData}
                          setFormData={setFormData}
                        />
                      )}
                      {currentStep === 3 && (
                        <PricingTab
                          formData={formData}
                          setFormData={setFormData}
                        />
                      )}
                      {currentStep === 4 && <ReviewTab formData={formData} />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* MODAL FOOTER - Fixed Bottom */}
              <div className="p-4 sm:p-6 border-t border-slate-100 bg-white flex justify-between items-center z-20">
                <button
                  onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                  disabled={currentStep === 1}
                  className="px-4 py-2 sm:px-6 sm:py-3 text-slate-400 font-bold uppercase text-xs flex items-center gap-2 disabled:opacity-0 hover:text-slate-900 transition-all"
                >
                  <ArrowLeft size={16} /> Back
                </button>

                {currentStep < 4 ? (
                  <button
                    onClick={() => setCurrentStep((s) => Math.min(4, s + 1))}
                    className="px-6 py-3 sm:px-8 sm:py-3.5 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-bold uppercase text-xs tracking-widest shadow-lg hover:bg-indigo-600 transition-all flex items-center gap-2"
                  >
                    Next <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleFinalSubmit}
                    disabled={loading}
                    className="px-6 py-3 sm:px-8 sm:py-3.5 bg-emerald-500 text-white rounded-xl sm:rounded-2xl font-bold uppercase text-xs tracking-widest shadow-lg shadow-emerald-200 hover:scale-105 transition-all flex items-center gap-2"
                  >
                    {loading ? "Saving..." : "Publish"}{" "}
                    <CheckCircle2 size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const CourseInfoTab = ({ formData, setFormData }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <h3 className="text-xl sm:text-2xl font-black text-slate-900">
        Basic Info
      </h3>
      <p className="text-slate-400 text-xs">Define your course details</p>
    </div>

    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block ml-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Complete React Guide"
          className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none font-bold text-slate-900 transition-all text-sm"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block ml-1">
          Description
        </label>
        <textarea
          rows="3"
          placeholder="What will students learn?"
          className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none font-medium text-slate-700 transition-all text-sm resize-none"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block ml-1">
          Syllabus Highlights
        </label>
        <textarea
          rows="4"
          placeholder="• Intro&#10;• Core Concepts"
          className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none font-medium text-slate-700 transition-all text-sm resize-none font-mono"
          value={formData.syllabus}
          onChange={(e) =>
            setFormData({ ...formData, syllabus: e.target.value })
          }
        />
      </div>
    </div>
  </div>
);

const VideoSourceTab = ({ formData, setFormData }) => {
  const extractVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleYouTubeUrlChange = (url) => {
    const videoId = extractVideoId(url);
    setFormData({ ...formData, youtubeUrl: url, youtubeId: videoId || "" });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          Content
        </h3>
        <p className="text-slate-400 text-xs">Link your video & materials</p>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block ml-1">
          YouTube Link <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="https://youtu.be/..."
          className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 focus:border-red-500 focus:bg-white outline-none font-bold text-slate-900 transition-all text-sm"
          value={formData.youtubeUrl || ""}
          onChange={(e) => handleYouTubeUrlChange(e.target.value)}
        />
        {formData.youtubeId && (
          <div className="mt-2 p-2 bg-slate-50 rounded-lg flex items-center gap-3 border border-slate-100">
            <img
              src={`https://img.youtube.com/vi/${formData.youtubeId}/default.jpg`}
              className="w-12 h-9 object-cover rounded-md"
              alt=""
            />
            <span className="text-xs text-green-600 font-bold flex items-center gap-1">
              <CheckCircle2 size={12} /> Valid Video
            </span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block ml-1">
          Drive Folder Link (Optional)
        </label>
        <input
          type="text"
          placeholder="https://drive.google.com/..."
          className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:bg-white outline-none font-medium text-slate-700 transition-all text-sm"
          value={formData.driveLink || ""}
          onChange={(e) =>
            setFormData({ ...formData, driveLink: e.target.value })
          }
        />
      </div>
    </div>
  );
};

const PricingTab = ({ formData, setFormData }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <h3 className="text-xl sm:text-2xl font-black text-slate-900">Pricing</h3>
      <p className="text-slate-400 text-xs">Set your course value</p>
    </div>

    <div className="grid grid-cols-1 gap-4">
      <PriceControl
        label="Selling Price"
        value={formData.price}
        color="emerald"
        onChange={(v) => setFormData({ ...formData, price: v })}
      />
      <PriceControl
        label="Original Price (Strike-through)"
        value={formData.discountPrice}
        color="slate"
        onChange={(v) => setFormData({ ...formData, discountPrice: v })}
      />
    </div>
  </div>
);

const PriceControl = ({ label, value, onChange, color }) => (
  <div
    className={`p-4 sm:p-6 bg-white border border-slate-200 rounded-2xl flex items-center justify-between`}
  >
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase">{label}</p>
      <p
        className={`text-2xl sm:text-3xl font-black text-${
          color === "emerald" ? "emerald-600" : "slate-900"
        }`}
      >
        ₹{value}
      </p>
    </div>
    <div className="flex flex-col gap-1">
      <button
        onClick={() => onChange(Number(value) + 50)}
        className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg"
      >
        <ChevronUp size={16} />
      </button>
      <button
        onClick={() => onChange(Math.max(0, Number(value) - 50))}
        className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg"
      >
        <ChevronDown size={16} />
      </button>
    </div>
  </div>
);

const ReviewTab = ({ formData }) => (
  <div className="text-center space-y-6 py-4">
    <div className="size-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
      <Rocket size={32} />
    </div>
    <h3 className="text-2xl font-black text-slate-900">Ready to Publish?</h3>

    <div className="bg-slate-50 p-6 rounded-2xl text-left space-y-3 border border-slate-100 max-w-sm mx-auto">
      <div>
        <span className="text-xs font-bold text-slate-400 uppercase">
          Title
        </span>
        <p className="font-bold text-slate-900">
          {formData.title || "Untitled"}
        </p>
      </div>
      <div className="flex justify-between">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase">
            Price
          </span>
          <p className="font-bold text-emerald-600">₹{formData.price}</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Content
          </span>
          <p className="font-bold text-slate-900">
            {formData.youtubeId ? "Video Attached" : "No Video"}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default CourseManager;
