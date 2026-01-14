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
  Layout,
  BookOpen,
  Youtube,
  Link as LinkIcon,
  List,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const initialFormState = {
    title: "",
    description: "",
    syllabus: "",
    price: 299,
    discountPrice: 999,
    lectures: [],
    driveLink: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [tempVideoUrl, setTempVideoUrl] = useState("");

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
      // Sort by newest first
      courseList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setCourses(courseList);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = courses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(courses.length / itemsPerPage);

  const extractVideoId = (url) => {
    if (!url) return null;
    let videoId = null;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes("youtube.com")) {
        videoId = urlObj.searchParams.get("v");
      } else if (urlObj.hostname.includes("youtu.be")) {
        videoId = urlObj.pathname.slice(1);
      }
    } catch (e) {}
    return videoId;
  };

  const handleLaunchNew = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setTempVideoUrl("");
    setCurrentStep(1);
    setShowModal(true);
  };

  const handleEdit = (course) => {
    setEditingId(course.id);

    // Convert old single video data to new list format if needed
    let existingLectures = course.lectures || [];
    if (existingLectures.length === 0 && course.videoId) {
      existingLectures = [
        {
          id: Date.now(),
          url: course.url || "",
          videoId: course.videoId,
          title: "Lecture 1",
        },
      ];
    }

    setFormData({
      title: course.title || "",
      description: course.description || "",
      syllabus: course.syllabus || "",
      price: course.price || 299,
      discountPrice: course.originalPrice || 999,
      lectures: existingLectures,
      driveLink: course.driveLink || "",
    });
    setTempVideoUrl("");
    setCurrentStep(1);
    setShowModal(true);
  };

  const addVideo = () => {
    const vidId = extractVideoId(tempVideoUrl);
    if (!vidId) return alert("Invalid Link");
    const newItem = {
      id: Date.now(),
      videoId: vidId,
      url: tempVideoUrl,
      title: `Lecture ${formData.lectures.length + 1}`,
    };
    setFormData({ ...formData, lectures: [...formData.lectures, newItem] });
    setTempVideoUrl("");
  };

  const removeVideo = (id) => {
    setFormData({
      ...formData,
      lectures: formData.lectures.filter((l) => l.id !== id),
    });
  };

  const handleFinalSubmit = async () => {
    if (!formData.title || formData.lectures.length === 0 || !formData.price) {
      alert("⚠️ Title, Price and at least one Video are required!");
      return;
    }

    setLoading(true);
    try {
      // [FIX] THUMBNAIL LOGIC: Always take from the 1st lecture
      const firstVid = formData.lectures[0];
      const thumbUrl = `https://img.youtube.com/vi/${firstVid.videoId}/maxresdefault.jpg`;

      const courseData = {
        title: formData.title,
        description: formData.description,
        syllabus: formData.syllabus,
        lectures: formData.lectures,

        // Ensure backward compatibility
        url: firstVid.url,
        videoId: firstVid.videoId,

        driveLink: formData.driveLink,
        price: formData.price.toString(),
        originalPrice: formData.discountPrice.toString(),
        updatedAt: new Date().toISOString(),

        // [FIX] Explicitly saving image
        image: thumbUrl,

        instructor: "Admin",
        rating: 4.8,
        lecturesCount: `${formData.lectures.length} Lectures`,
        duration: "Self Paced",
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
    if (
      !window.confirm("Are you sure? This will delete the course permanently.")
    )
      return;
    try {
      await deleteDoc(doc(db, "courseVideos", id));
      // Refresh list immediately
      const newCourses = courses.filter((course) => course.id !== id);
      setCourses(newCourses);
      // Optional: Refetch to be 100% sure
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Error deleting course. Check console.");
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
      {/* 1. MOBILE HEADER */}
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

      {/* 2. DESKTOP SIDEBAR */}
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

        {/* LIST GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {currentCourses.map((course) => (
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
                    {/* [FIX] Displaying Thumbnail properly */}
                    {course.image ? (
                      <img
                        src={course.image}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://img.youtube.com/vi/default/maxresdefault.jpg";
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-300 bg-slate-200">
                        <List size={24} />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {course.lectures ? course.lectures.length : 1} Videos
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

        {/* [NEW] Pagination Controls */}
        {courses.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-4 mt-8 pb-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-50 hover:bg-slate-50"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-bold text-slate-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-50 hover:bg-slate-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {courses.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen size={24} />
            </div>
            <p className="text-sm font-medium">No courses found.</p>
          </div>
        )}
      </div>

      {/* 4. MODAL */}
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
              {/* MODAL HEADER */}
              <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-white z-20">
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

              {/* MODAL CONTENT */}
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
                        <div className="space-y-6">
                          <div className="text-center mb-8">
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                              Basic Info
                            </h3>
                            <p className="text-slate-400 text-xs">
                              Define your course details
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block ml-1">
                              Title
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Complete React Guide"
                              className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-bold text-slate-900"
                              value={formData.title}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  title: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block ml-1">
                              Description
                            </label>
                            <textarea
                              rows="3"
                              placeholder="What will students learn?"
                              className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-medium text-slate-700"
                              value={formData.description}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block ml-1">
                              Syllabus
                            </label>
                            <textarea
                              rows="4"
                              placeholder="• Intro&#10;• Core Concepts"
                              className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-medium text-slate-700 font-mono"
                              value={formData.syllabus}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  syllabus: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      )}

                      {/* [STEP 2: CONTENT - MULTI VIDEO SUPPORT] */}
                      {currentStep === 2 && (
                        <div className="space-y-6">
                          <div className="text-center mb-8">
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                              Curriculum
                            </h3>
                            <p className="text-slate-400 text-xs">
                              Add videos to build the course
                            </p>
                          </div>

                          {/* Add Video Input */}
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block ml-1">
                              Add Video
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Paste YouTube Link here..."
                                className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-bold text-slate-900"
                                value={tempVideoUrl}
                                onChange={(e) =>
                                  setTempVideoUrl(e.target.value)
                                }
                                onKeyDown={(e) =>
                                  e.key === "Enter" && addVideo()
                                }
                              />
                              <button
                                onClick={addVideo}
                                className="bg-slate-900 text-white px-6 rounded-xl font-bold hover:bg-indigo-600 transition-colors flex items-center gap-2"
                              >
                                <Plus size={20} /> Add
                              </button>
                            </div>
                          </div>

                          {/* Added Videos List */}
                          <div className="space-y-2 mt-2">
                            {formData.lectures.length === 0 ? (
                              <div className="text-center py-8 text-slate-300 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <PlayCircle
                                  size={32}
                                  className="mx-auto mb-2 opacity-50"
                                />
                                <p className="text-xs font-bold">
                                  No videos added yet.
                                </p>
                              </div>
                            ) : (
                              formData.lectures.map((lecture, index) => (
                                <div
                                  key={lecture.id}
                                  className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm"
                                >
                                  <div className="text-slate-300 font-black text-sm w-6">
                                    #{index + 1}
                                  </div>
                                  <img
                                    src={`https://img.youtube.com/vi/${lecture.videoId}/default.jpg`}
                                    className="w-12 h-9 object-cover rounded"
                                    alt=""
                                  />
                                  <p className="text-xs font-bold text-slate-700 flex-1 truncate">
                                    {lecture.url}
                                  </p>
                                  <button
                                    onClick={() => removeVideo(lecture.id)}
                                    className="text-slate-400 hover:text-red-500 p-2"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>

                          {/* [FIX] Thumbnail Notice */}
                          {formData.lectures.length > 0 && (
                            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 justify-center">
                              <CheckCircle2 size={12} /> Thumbnail will be set
                              from Video #1
                            </p>
                          )}

                          <div className="pt-4 border-t border-slate-100">
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block ml-1">
                              Drive Folder (Optional)
                            </label>
                            <input
                              type="text"
                              placeholder="https://drive.google.com/..."
                              className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-medium text-slate-700"
                              value={formData.driveLink}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  driveLink: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      )}

                      {currentStep === 3 && (
                        <div className="space-y-6">
                          <div className="text-center mb-8">
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                              Pricing
                            </h3>
                          </div>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="p-4 bg-white border border-slate-200 rounded-2xl">
                              <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                                Selling Price
                              </p>
                              <input
                                type="number"
                                className="w-full text-2xl font-black text-emerald-600 outline-none"
                                value={formData.price}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    price: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="p-4 bg-white border border-slate-200 rounded-2xl">
                              <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                                Original Price
                              </p>
                              <input
                                type="number"
                                className="w-full text-xl font-bold text-slate-400 line-through outline-none"
                                value={formData.discountPrice}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    discountPrice: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 4 && (
                        <div className="text-center space-y-6 py-4">
                          <div className="size-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <Rocket size={32} />
                          </div>
                          <h3 className="text-2xl font-black text-slate-900">
                            Ready to Publish?
                          </h3>
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
                                <p className="font-bold text-emerald-600">
                                  ₹{formData.price}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-bold text-slate-400 uppercase">
                                  Content
                                </span>
                                <p className="font-bold text-slate-900">
                                  {formData.lectures.length} Videos
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* MODAL FOOTER */}
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

export default CourseManager;
