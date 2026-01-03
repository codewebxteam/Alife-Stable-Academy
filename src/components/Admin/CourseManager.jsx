import React, { useState, useEffect } from "react";
import { 
  Plus, Edit3, GraduationCap, Trash2, X, 
  Upload, CheckCircle2, ArrowRight, ArrowLeft,
  Sparkles, Layers, DollarSign, Rocket, ChevronUp, ChevronDown, 
  Layout, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";

const CourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialFormState = {
    title: "",
    subtitle: "",
    category: "Development",
    level: "Beginner",
    price: 299,           // Offer price (selling price)
    discountPrice: 999,   // Listing price (original price - cut wala)
    youtubeUrl: "",
    youtubeId: "",
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
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
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
    setFormData({ ...course });
    setCurrentStep(1);
    setShowModal(true);
  };

  const handleFinalSubmit = async () => {
    if (!formData.title || !formData.youtubeUrl || !formData.price) {
      alert("Please fill all required fields");
      return;
    }

    const videoId = extractVideoId(formData.youtubeUrl);
    if (!videoId) {
      alert("Invalid YouTube URL");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "courseVideos"), {
        title: formData.title,
        subtitle: formData.subtitle,
        level: formData.level,
        url: formData.youtubeUrl,
        videoId: videoId,
        price: formData.price.toString(),
        originalPrice: formData.discountPrice.toString(),
        createdAt: new Date().toISOString(),
      });
      setShowModal(false);
      fetchCourses();
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Failed to add course");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await deleteDoc(doc(db, "courseVideos", id));
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const steps = [
    { id: 1, label: "Identity", icon: <Sparkles size={16} /> },
    { id: 2, label: "Curriculum", icon: <Layers size={16} /> },
    { id: 3, label: "Pricing", icon: <DollarSign size={16} /> },
    { id: 4, label: "Review", icon: <Rocket size={16} /> },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[500px]">
      
      <div className="w-full lg:w-[400px]">
        <div className="bg-slate-950 p-8 lg:p-10 rounded-[40px] text-white flex flex-col justify-between shadow-2xl sticky top-28 overflow-hidden">
          <div className="absolute top-0 right-0 size-64 bg-indigo-500/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
          <div className="relative z-10">
            <div className="size-16 bg-indigo-500 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-indigo-500/20">
              <GraduationCap size={32} className="text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter mb-4 leading-none uppercase">
              Course <br /> <span className="text-indigo-400">Architect</span>
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed italic">
              "Create modules that inspire. Your knowledge, perfectly packaged."
            </p>
          </div>
          <button 
            onClick={handleLaunchNew}
            className="mt-12 flex items-center justify-center gap-3 w-full py-5 bg-white text-slate-950 rounded-[24px] font-black uppercase text-[11px] tracking-widest hover:bg-indigo-400 hover:text-white transition-all duration-500 shadow-xl"
          >
            <Plus size={18} /> Launch New Module
          </button>
        </div>
      </div>
      
      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[75vh]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Inventory ({courses.length})</h3>
          <Layout size={16} className="text-slate-300" />
        </div>
        <AnimatePresence mode="popLayout">
          {courses.map((course) => (
            <motion.div 
              layout key={course.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-5 lg:p-6 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:shadow-2xl hover:border-indigo-100 transition-all duration-500"
            >
              <div className="flex items-center gap-4 lg:gap-5">
                <div className="size-12 lg:size-14 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  {course.videoId ? (
                    <img
                      src={`https://img.youtube.com/vi/${course.videoId}/default.jpg`}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen size={24} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{course.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-black text-emerald-500 uppercase px-2 py-0.5 bg-emerald-50 rounded-md border border-emerald-100">Live</span>
                    <span className="text-[10px] font-bold text-slate-400">₹{course.price} • {course.level || 'Beginner'}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <button onClick={() => handleEdit(course)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 shadow-sm"><Edit3 size={16}/></button>
                <button onClick={() => handleDelete(course.id)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 shadow-sm"><Trash2 size={16}/></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 lg:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              className="bg-white w-full max-w-6xl rounded-[40px] lg:rounded-[54px] shadow-2xl relative z-10 overflow-hidden flex flex-col lg:flex-row h-[90vh] lg:h-[85vh]"
            >
              
              <div className="w-full lg:w-[320px] bg-slate-950 p-8 lg:p-10 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
                <div className="absolute top-0 left-0 size-64 bg-indigo-500/20 rounded-full blur-[80px] -ml-20 -mt-20 pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-10 leading-none">Design <br /><span className="text-indigo-400">Blueprint</span></h3>
                  <div className="space-y-4">
                    {steps.map((step) => (
                      <button 
                        key={step.id} 
                        onClick={() => setCurrentStep(step.id)}
                        className={`w-full flex items-center gap-4 text-left p-3 rounded-2xl transition-all ${currentStep === step.id ? "bg-white/10 opacity-100" : "opacity-30 hover:opacity-60"}`}
                      >
                        <div className={`size-10 rounded-xl flex items-center justify-center font-black border-2 transition-colors ${currentStep === step.id ? "bg-indigo-500 border-indigo-500" : "border-slate-800"}`}>
                          {step.icon}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{step.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col bg-white min-w-0 overflow-hidden">
                <div className="p-6 lg:p-8 border-b border-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="size-2 bg-indigo-600 rounded-full animate-pulse" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{editingId ? "Modification Mode" : "New Creation"}</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar selection:bg-indigo-100">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                      className="max-w-3xl mx-auto space-y-10"
                    >
                      {currentStep === 1 && <IdentityTab formData={formData} setFormData={setFormData} />}
                      {currentStep === 2 && <CurriculumTab />}
                      {currentStep === 3 && <PricingTab formData={formData} setFormData={setFormData} />}
                      {currentStep === 4 && <ReviewTab formData={formData} />}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="p-6 lg:p-8 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center">
                  <button onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 1} className="px-6 py-3 text-slate-400 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 disabled:opacity-0 hover:text-slate-950">
                    <ArrowLeft size={16}/> Back
                  </button>
                  {currentStep < 4 ? (
                    <button onClick={() => setCurrentStep(s => s + 1)} className="px-10 py-4 bg-slate-950 text-white rounded-[20px] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all">
                      Continue <ArrowRight size={16} className="inline ml-2"/>
                    </button>
                  ) : (
                    <button onClick={handleFinalSubmit} disabled={loading} className="px-10 py-4 bg-emerald-500 text-white rounded-[20px] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-100 hover:scale-105 transition-all disabled:opacity-50">
                      {loading ? "Saving..." : "Sync to Marketplace"} <CheckCircle2 size={16} className="inline ml-2"/>
                    </button>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

const IdentityTab = ({ formData, setFormData }) => {
  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleYouTubeUrlChange = (url) => {
    const videoId = extractVideoId(url);
    setFormData({...formData, youtubeUrl: url, youtubeId: videoId || ""});
  };

  return (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
        <input type="text" className="w-full bg-slate-50 p-5 rounded-[24px] border border-transparent focus:border-indigo-100 focus:bg-white outline-none font-bold text-slate-900 transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Skill Level</label>
        <select className="w-full bg-slate-50 p-5 rounded-[24px] outline-none font-bold text-slate-900 appearance-none cursor-pointer" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}>
          <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
        </select>
      </div>
    </div>
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Marketplace Subtitle</label>
        <textarea className="w-full bg-slate-50 p-5 rounded-[32px] border border-transparent focus:border-indigo-100 outline-none font-medium text-slate-600 h-32 resize-none transition-all" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
    </div>
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">YouTube Video URL</label>
      <input 
        type="text" 
        placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
        className="w-full bg-slate-50 p-5 rounded-[24px] border border-transparent focus:border-indigo-100 focus:bg-white outline-none font-bold text-slate-900 transition-all" 
        value={formData.youtubeUrl || ""} 
        onChange={e => handleYouTubeUrlChange(e.target.value)} 
      />
      {formData.youtubeId && (
        <div className="mt-2 p-3 bg-green-50 rounded-xl border border-green-200">
          <p className="text-[9px] text-green-700 font-bold">✓ Video ID Extracted: {formData.youtubeId}</p>
        </div>
      )}
      <p className="text-[9px] text-slate-400 ml-1">Paste full YouTube URL - Video ID will be extracted automatically</p>
    </div>
  </div>
);
};

const CurriculumTab = () => (
  <div className="space-y-6">
    <div className="p-10 bg-indigo-50 rounded-[40px] border border-indigo-100 text-center border-dashed">
      <Upload size={40} className="mx-auto text-indigo-200 mb-4" />
      <h4 className="text-sm font-black text-indigo-900 uppercase">Drop Curriculum Node</h4>
      <p className="text-[10px] font-bold text-indigo-400 uppercase mt-1 tracking-widest">Connect video streams & PDF manifests</p>
    </div>
  </div>
);

const PricingTab = ({ formData, setFormData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <PriceControl label="Listing Price (Original)" value={formData.discountPrice} color="slate" onChange={v => setFormData({...formData, discountPrice: v})} />
    <PriceControl label="Offer Price (Selling)" value={formData.price} color="emerald" onChange={v => setFormData({...formData, price: v})} />
  </div>
);

const ReviewTab = ({ formData }) => (
  <div className="text-center py-6 space-y-6">
    <div className="size-24 bg-emerald-50 text-emerald-500 rounded-[36px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-50 animate-bounce">
      <Rocket size={40} />
    </div>
    <div className="space-y-2">
      <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Broadcast Ready</h3>
      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">"{formData.title || "New Module"}" will go live.</p>
    </div>
  </div>
);

const PriceControl = ({ label, value, onChange, color }) => (
  <div className={`p-8 bg-${color}-50/50 rounded-[40px] border border-${color}-100 transition-all`}>
    <p className={`text-[10px] font-black text-${color}-600 uppercase tracking-widest mb-4`}>{label}</p>
    <div className="flex items-center justify-between">
      <span className="text-4xl font-black text-slate-900 tracking-tighter">₹{value}</span>
      <div className="flex flex-col gap-1.5">
        <button onClick={() => onChange(Number(value) + 100)} className="p-2 bg-white rounded-xl shadow-sm hover:bg-indigo-600 hover:text-white transition-all">
          <ChevronUp size={16} />
        </button>
        <button onClick={() => onChange(Math.max(0, Number(value) - 100))} className="p-2 bg-white rounded-xl shadow-sm hover:bg-red-500 hover:text-white transition-all">
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  </div>
);

export default CourseManager;
