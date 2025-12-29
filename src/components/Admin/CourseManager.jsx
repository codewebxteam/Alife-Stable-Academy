import React, { useState, useEffect } from "react";
import { 
  Plus, Edit3, GraduationCap, Trash2, X, 
  Upload, CheckCircle2, ArrowRight, ArrowLeft,
  Sparkles, Layers, DollarSign, Rocket, ChevronUp, ChevronDown, 
  Layout, BookOpen, Loader2, Video, FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../../firebase/config";
import { 
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp 
} from "firebase/firestore";

const CourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const CATEGORIES = ["Development", "Design", "Data Science", "Marketing", "Finance"];

  const initialFormState = {
    title: "",
    subtitle: "",
    category: "Development",
    level: "Beginner",
    price: 0,
    discountPrice: 0,
    thumbnail: "",
    status: "Active",
    chapters: [{ id: Date.now(), name: "", videoUrl: "", notesUrl: "" }]
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "courses"));
      const courseList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(courseList);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchCourses(); }, []);

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

  const handleDelete = async (id) => {
    if (window.confirm("Delete this course permanently?")) {
      try {
        await deleteDoc(doc(db, "courses", id));
        setCourses(courses.filter(c => c.id !== id));
      } catch (error) { alert("Error deleting course"); }
    }
  };

  const handleFinalSubmit = async () => {
    if (!formData.title || formData.price <= 0) return alert("Please fill Title and Pricing!");
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "courses", editingId), { ...formData, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "courses"), { ...formData, createdAt: serverTimestamp() });
      }
      setShowModal(false);
      fetchCourses();
    } catch (error) { alert("Error saving course"); } finally { setIsSubmitting(false); }
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
            <div className="size-16 bg-indigo-500 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-indigo-500/20"><GraduationCap size={32} /></div>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter mb-4 leading-none uppercase">Course <br /> <span className="text-indigo-400">Architect</span></h2>
            <p className="text-slate-400 text-sm font-medium italic">"Craft your digital academy. Design, Upload, Launch."</p>
          </div>
          <button onClick={handleLaunchNew} className="mt-12 flex items-center justify-center gap-3 w-full py-5 bg-white text-slate-950 rounded-[24px] font-black uppercase text-[11px] tracking-widest hover:bg-indigo-400 hover:text-white transition-all shadow-xl">
            <Plus size={18} /> Add New Course
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[75vh]">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Live Inventory ({courses.length})</h3>
        <AnimatePresence mode="popLayout">
          {courses.map((course) => (
            <motion.div layout key={course.id} className="bg-white p-5 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:shadow-2xl transition-all">
              <div className="flex items-center gap-4">
                <img src={course.thumbnail} className="size-14 rounded-2xl object-cover" alt="" />
                <div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{course.title}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{course.category} • {course.level}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => handleEdit(course)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600"><Edit3 size={16}/></button>
                <button onClick={() => handleDelete(course.id)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-red-500"><Trash2 size={16}/></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 lg:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-6xl rounded-[40px] shadow-2xl relative z-10 flex flex-col lg:flex-row h-[90vh]">
              
              <div className="w-full lg:w-[300px] bg-slate-950 p-10 text-white shrink-0">
                <h3 className="text-xl font-black uppercase mb-10">Blueprint</h3>
                <div className="space-y-4">
                  {steps.map((step) => (
                    <button key={step.id} onClick={() => setCurrentStep(step.id)} className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all ${currentStep === step.id ? "bg-white/10" : "opacity-30"}`}>
                      <div className={`size-10 rounded-xl flex items-center justify-center border-2 ${currentStep === step.id ? "bg-indigo-500 border-indigo-500" : "border-slate-800"}`}>{step.icon}</div>
                      <span className="text-[10px] font-black uppercase">{step.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex flex-col bg-white overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{editingId ? "Editing" : "Crafting"} Module</span>
                  <button onClick={() => setShowModal(false)} className="p-2 bg-slate-50 rounded-xl"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                  {currentStep === 1 && <IdentityTab formData={formData} setFormData={setFormData} categories={CATEGORIES} />}
                  {currentStep === 2 && <CurriculumTab formData={formData} setFormData={setFormData} />}
                  {currentStep === 3 && <PricingTab formData={formData} setFormData={setFormData} />}
                  {currentStep === 4 && <ReviewTab formData={formData} />}
                </div>

                <div className="p-8 bg-slate-50/50 border-t flex justify-between">
                  <button onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 1} className="px-6 py-3 text-slate-400 font-black uppercase text-[10px] tracking-widest disabled:opacity-0">Back</button>
                  {currentStep < 4 ? (
                    <button onClick={() => setCurrentStep(s => s + 1)} className="px-10 py-4 bg-slate-950 text-white rounded-[20px] font-black uppercase text-[10px] tracking-widest">Continue <ArrowRight size={16} className="inline ml-2"/></button>
                  ) : (
                    <button onClick={handleFinalSubmit} disabled={isSubmitting} className="px-10 py-4 bg-emerald-500 text-white rounded-[20px] font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                      {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Rocket size={16} />} Sync Marketplace
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- TAB SUB-COMPONENTS ---

const IdentityTab = ({ formData, setFormData, categories }) => (
  <div className="space-y-8 max-w-2xl mx-auto">
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFormData({...formData, category: cat})} className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all ${formData.category === cat ? "bg-indigo-600 border-indigo-600 text-white" : "bg-slate-50 text-slate-500"}`}>{cat}</button>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Course Title</label>
        <input type="text" className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-slate-900 border focus:border-indigo-200" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Level</label>
        <select className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-slate-900" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}>
          <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
        </select>
      </div>
    </div>
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thumbnail URL</label>
      <input type="text" className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold" value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})} />
    </div>
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
      <textarea className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-medium h-32 resize-none" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
    </div>
  </div>
);

const CurriculumTab = ({ formData, setFormData }) => {
  const addChapter = () => setFormData({...formData, chapters: [...formData.chapters, { id: Date.now(), name: "", videoUrl: "", notesUrl: "" }]});
  const updateChapter = (index, field, value) => {
    const newChapters = [...formData.chapters];
    newChapters[index][field] = value;
    setFormData({...formData, chapters: newChapters});
  };
  const removeChapter = (index) => setFormData({...formData, chapters: formData.chapters.filter((_, i) => i !== index)});

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {formData.chapters.map((chapter, index) => (
        <div key={chapter.id} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 relative group">
          <button onClick={() => removeChapter(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
          <div className="flex items-center gap-3 mb-4">
            <div className="size-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-black text-xs">{index + 1}</div>
            <input type="text" placeholder="Chapter Name" className="bg-transparent border-b border-slate-200 outline-none font-black text-slate-900 w-full" value={chapter.name} onChange={e => updateChapter(index, 'name', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 bg-white p-3 rounded-xl border"><Video size={14} className="text-slate-400"/><input type="text" placeholder="Video URL" className="text-[11px] outline-none w-full" value={chapter.videoUrl} onChange={e => updateChapter(index, 'videoUrl', e.target.value)}/></div>
            <div className="flex items-center gap-2 bg-white p-3 rounded-xl border"><FileText size={14} className="text-slate-400"/><input type="text" placeholder="Notes URL (PDF)" className="text-[11px] outline-none w-full" value={chapter.notesUrl} onChange={e => updateChapter(index, 'notesUrl', e.target.value)}/></div>
          </div>
        </div>
      ))}
      <button onClick={addChapter} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[24px] text-slate-400 font-black uppercase text-[10px] hover:border-indigo-400 hover:text-indigo-600 transition-all">+ Add Chapter</button>
    </div>
  );
};

const PricingTab = ({ formData, setFormData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
    <PriceControl label="Listing Price (Fake)" value={formData.price} color="indigo" onChange={v => setFormData({...formData, price: v})} />
    <PriceControl label="Offer Price (Actual)" value={formData.discountPrice} color="emerald" onChange={v => setFormData({...formData, discountPrice: v})} />
  </div>
);

const ReviewTab = ({ formData }) => (
  <div className="text-center py-6 space-y-6 max-w-md mx-auto">
    <div className="size-20 bg-emerald-50 text-emerald-500 rounded-[30px] flex items-center justify-center mx-auto shadow-xl"><Rocket size={32} /></div>
    <div className="bg-slate-50 p-6 rounded-[32px] text-left space-y-3">
      <p className="text-[11px] font-black uppercase text-slate-400">Preview</p>
      <h4 className="text-xl font-black text-slate-900">{formData.title}</h4>
      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase"><span>{formData.category}</span><span>₹{formData.discountPrice}</span></div>
      <p className="text-xs text-slate-400 italic line-clamp-2">{formData.subtitle}</p>
    </div>
  </div>
);

const PriceControl = ({ label, value, onChange, color }) => (
  <div className={`p-8 bg-${color}-50/50 rounded-[40px] border border-${color}-100`}>
    <p className={`text-[10px] font-black text-${color}-600 uppercase tracking-widest mb-4`}>{label}</p>
    <div className="flex items-center justify-between">
      <span className="text-4xl font-black text-slate-900 tracking-tighter">₹{value}</span>
      <div className="flex flex-col gap-1">
        <button onClick={() => onChange(Number(value) + 100)} className="p-1.5 bg-white rounded-lg shadow-sm"><ChevronUp size={14} /></button>
        <button onClick={() => onChange(Math.max(0, Number(value) - 100))} className="p-1.5 bg-white rounded-lg shadow-sm"><ChevronDown size={14} /></button>
      </div>
    </div>
  </div>
);

export default CourseManager;