 import React, { useState, useEffect } from "react";
import { 
  Plus, Edit3, BookOpen, Trash2, X, 
  CheckCircle2, ArrowRight, ArrowLeft,
  Sparkles, Layers, DollarSign, Rocket, ChevronUp, ChevronDown, 
  Loader2, FileText, Image as ImageIcon, GraduationCap, Link as LinkIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../../firebase/config";
import { 
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp 
} from "firebase/firestore";

const EBookManager = () => {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const CATEGORIES = ["Development", "Design", "Business", "Engineering"];

  const initialFormState = {
    title: "",
    author: "",
    category: "Development",
    price: 0,
    discountPrice: 0,
    cover: "", 
    totalPages: 1,
    status: "Active",
    chapters: [{ id: Date.now(), title: "", resourceUrl: "" }]
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchEBooks = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "ebooks"));
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEbooks(list);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchEBooks(); }, []);

  const handleLaunchNew = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setCurrentStep(1);
    setShowModal(true);
  };

  const handleEdit = (ebook) => {
    setEditingId(ebook.id);
    setFormData({ ...ebook });
    setCurrentStep(1);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this E-Book permanently?")) {
      try {
        await deleteDoc(doc(db, "ebooks", id));
        setEbooks(ebooks.filter(e => e.id !== id));
      } catch (error) { alert("Error deleting eBook"); }
    }
  };

  const handleFinalSubmit = async () => {
    if (!formData.title || !formData.cover) return alert("Please fill Title and Cover URL!");
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "ebooks", editingId), { ...formData, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "ebooks"), { ...formData, createdAt: serverTimestamp() });
      }
      setShowModal(false);
      fetchEBooks();
    } catch (error) { alert("Error saving eBook"); } finally { setIsSubmitting(false); }
  };

  const steps = [
    { id: 1, label: "Identity", icon: <Sparkles size={16} /> },
    { id: 2, label: "Index", icon: <Layers size={16} /> },
    { id: 3, label: "Pricing", icon: <DollarSign size={16} /> },
    { id: 4, label: "Review", icon: <Rocket size={16} /> },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[500px]">
      
      {/* 1. LEFT CARD: CTA (Same as CourseManager UI) */}
      <div className="w-full lg:w-[400px]">
        <div className="bg-slate-950 p-8 lg:p-10 rounded-[40px] text-white flex flex-col justify-between shadow-2xl sticky top-28 overflow-hidden">
          <div className="absolute top-0 right-0 size-64 bg-orange-500/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
          <div className="relative z-10">
            <div className="size-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-orange-500/20">
              <BookOpen size={32} className="text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter mb-4 leading-none uppercase">
              E-Book <br /> <span className="text-orange-400">Curator</span>
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed italic">
              "Publish your digital assets. Organize, Value, and Deploy."
            </p>
          </div>
          <button 
            onClick={handleLaunchNew}
            className="mt-12 flex items-center justify-center gap-3 w-full py-5 bg-white text-slate-950 rounded-[24px] font-black uppercase text-[11px] tracking-widest hover:bg-orange-400 hover:text-white transition-all duration-500 shadow-xl"
          >
            <Plus size={18} /> Upload New E-Book
          </button>
        </div>
      </div>
      
      {/* 2. RIGHT SIDE: E-BOOK LIST */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[75vh]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Library ({ebooks.length})</h3>
          {loading && <Loader2 size={16} className="animate-spin text-orange-500" />}
        </div>

        {ebooks.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
            <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No assets found. Start publishing!</p>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {ebooks.map((book) => (
            <motion.div 
              layout key={book.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-5 lg:p-6 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:shadow-2xl hover:border-orange-100 transition-all duration-500"
            >
              <div className="flex items-center gap-4 lg:gap-5">
                <div className="size-14 bg-slate-50 rounded-2xl overflow-hidden border">
                   <img src={book.cover} alt="" className="size-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{book.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-black text-orange-500 uppercase px-2 py-0.5 bg-orange-50 rounded-md border border-orange-100">{book.category}</span>
                    <span className="text-[10px] font-bold text-slate-400">₹{book.discountPrice || book.price} • {book.author}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <button onClick={() => handleEdit(book)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-orange-50 hover:text-orange-600 shadow-sm"><Edit3 size={16}/></button>
                <button onClick={() => handleDelete(book.id)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 shadow-sm"><Trash2 size={16}/></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* --- CREATION MODAL --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 lg:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              className="bg-white w-full max-w-6xl rounded-[40px] lg:rounded-[54px] shadow-2xl relative z-10 overflow-hidden flex flex-col lg:flex-row h-[90vh] lg:h-[85vh]"
            >
              
              {/* Sidebar Guide */}
              <div className="w-full lg:w-[320px] bg-slate-950 p-8 lg:p-10 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
                <div className="absolute top-0 left-0 size-64 bg-orange-500/20 rounded-full blur-[80px] -ml-20 -mt-20 pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-10 leading-none">Asset <br /><span className="text-orange-400">Blueprint</span></h3>
                  <div className="space-y-4">
                    {steps.map((step) => (
                      <button 
                        key={step.id} 
                        onClick={() => setCurrentStep(step.id)} 
                        className={`w-full flex items-center gap-4 text-left p-3 rounded-2xl transition-all ${currentStep === step.id ? "bg-white/10 opacity-100" : "opacity-30 hover:opacity-60"}`}
                      >
                        <div className={`size-10 rounded-xl flex items-center justify-center font-black border-2 transition-colors ${currentStep === step.id ? "bg-orange-500 border-orange-500" : "border-slate-800"}`}>
                          {step.icon}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{step.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Side */}
              <div className="flex-1 flex flex-col bg-white min-w-0 overflow-hidden">
                <div className="p-6 lg:p-8 border-b border-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="size-2 bg-orange-600 rounded-full animate-pulse" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{editingId ? "Modification Mode" : "New Creation"}</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar selection:bg-orange-100">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                      className="max-w-3xl mx-auto space-y-10"
                    >
                      {currentStep === 1 && <DetailsTab formData={formData} setFormData={setFormData} categories={CATEGORIES} />}
                      {currentStep === 2 && <IndexTab formData={formData} setFormData={setFormData} />}
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
                    <button onClick={() => setCurrentStep(s => s + 1)} className="px-10 py-4 bg-slate-950 text-white rounded-[20px] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200 hover:bg-orange-600 transition-all">
                      Continue <ArrowRight size={16} className="inline ml-2"/>
                    </button>
                  ) : (
                    <button 
                      onClick={handleFinalSubmit} 
                      disabled={isSubmitting}
                      className="px-10 py-4 bg-emerald-500 text-white rounded-[20px] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-100 hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                      Deploy to Library
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

// --- TAB COMPONENTS ---

const DetailsTab = ({ formData, setFormData, categories }) => (
  <div className="space-y-8">
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setFormData({...formData, category: cat})} 
            className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all ${formData.category === cat ? "bg-orange-600 border-orange-600 text-white" : "bg-slate-50 text-slate-500 hover:border-orange-200"}`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-Book Title</label>
        <input type="text" placeholder="e.g. Mastering Tailwind CSS" className="w-full bg-slate-50 p-5 rounded-[24px] border border-transparent focus:border-orange-100 focus:bg-white outline-none font-bold text-slate-900 transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Author Name</label>
        <input type="text" placeholder="e.g. Jane Doe" className="w-full bg-slate-50 p-5 rounded-[24px] border border-transparent focus:border-orange-100 focus:bg-white outline-none font-bold text-slate-900 transition-all" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cover Image URL</label>
          <input type="text" placeholder="https://..." className="w-full bg-slate-50 p-5 rounded-[24px] border border-transparent focus:border-orange-100 outline-none font-bold text-slate-900 transition-all" value={formData.cover} onChange={e => setFormData({...formData, cover: e.target.value})} />
      </div>
      <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Pages</label>
          <input type="number" className="w-full bg-slate-50 p-5 rounded-[24px] border border-transparent focus:border-orange-100 outline-none font-bold text-slate-900 transition-all" value={formData.totalPages} onChange={e => setFormData({...formData, totalPages: e.target.value})} />
      </div>
    </div>
  </div>
);

const IndexTab = ({ formData, setFormData }) => {
  const addChapter = () => setFormData({...formData, chapters: [...formData.chapters, { id: Date.now(), title: "", resourceUrl: "" }]});
  const updateChapter = (index, field, value) => {
    const newChapters = [...formData.chapters];
    newChapters[index][field] = value;
    setFormData({...formData, chapters: newChapters});
  };
  const removeChapter = (index) => setFormData({...formData, chapters: formData.chapters.filter((_, i) => i !== index)});

  return (
    <div className="space-y-6">
      {formData.chapters.map((chapter, index) => (
        <div key={chapter.id} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 relative group transition-all hover:bg-white hover:border-orange-100">
          <button onClick={() => removeChapter(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
          <div className="flex items-center gap-3 mb-4">
            <div className="size-8 bg-orange-600 text-white rounded-lg flex items-center justify-center font-black text-xs">{index + 1}</div>
            <input 
              type="text" 
              placeholder="Chapter / Section Title" 
              className="bg-transparent border-b border-slate-200 outline-none font-black text-slate-900 w-full focus:border-orange-400 transition-colors" 
              value={chapter.title} 
              onChange={e => updateChapter(index, 'title', e.target.value)} 
            />
          </div>
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100">
            <LinkIcon size={14} className="text-slate-400"/>
            <input 
              type="text" 
              placeholder="PDF URL or Content Link for this chapter" 
              className="text-[11px] font-bold outline-none w-full text-slate-600" 
              value={chapter.resourceUrl} 
              onChange={e => updateChapter(index, 'resourceUrl', e.target.value)}
            />
          </div>
        </div>
      ))}
      <button 
        onClick={addChapter} 
        className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[24px] text-slate-400 font-black uppercase text-[10px] tracking-widest hover:border-orange-400 hover:text-orange-600 transition-all"
      >
        + Add Chapter Entry
      </button>
    </div>
  );
};

const PricingTab = ({ formData, setFormData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <PriceControl label="Listing Price" value={formData.price} color="indigo" onChange={v => setFormData({...formData, price: v})} />
    <PriceControl label="Actual Value" value={formData.discountPrice} color="emerald" onChange={v => setFormData({...formData, discountPrice: v})} />
  </div>
);

const ReviewTab = ({ formData }) => (
  <div className="text-center py-6 space-y-6">
    <div className="size-24 bg-orange-50 text-orange-500 rounded-[36px] flex items-center justify-center mx-auto shadow-2xl shadow-orange-50 animate-bounce">
      <BookOpen size={40} />
    </div>
    <div className="space-y-2">
      <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Asset Ready</h3>
      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">"{formData.title || "New eBook"}" is ready for deployment.</p>
    </div>
    <div className="bg-slate-50 p-6 rounded-[32px] max-w-sm mx-auto border text-left">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Market Data</p>
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-slate-600">Category: {formData.category}</span>
        <span className="text-xl font-black text-slate-900">₹{formData.discountPrice}</span>
      </div>
    </div>
  </div>
);

const PriceControl = ({ label, value, onChange, color }) => (
  <div className={`p-8 bg-${color}-50/50 rounded-[40px] border border-${color}-100 transition-all`}>
    <p className={`text-[10px] font-black text-${color}-600 uppercase tracking-widest mb-4`}>{label}</p>
    <div className="flex items-center justify-between">
      <span className="text-4xl font-black text-slate-900 tracking-tighter">₹{value}</span>
      <div className="flex flex-col gap-1.5">
        <button onClick={() => onChange(Number(value) + 100)} className="p-2 bg-white rounded-xl shadow-sm hover:bg-orange-600 hover:text-white transition-all">
          <ChevronUp size={16} />
        </button>
        <button onClick={() => onChange(Math.max(0, Number(value) - 100))} className="p-2 bg-white rounded-xl shadow-sm hover:bg-red-500 hover:text-white transition-all">
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  </div>
);

export default EBookManager;