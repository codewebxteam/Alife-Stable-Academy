import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  BookOpen,
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
  Link as LinkIcon,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

const EBookManager = () => {
  const [ebooks, setEbooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Removed Title, Author, Category, Chapters etc.
  const initialFormState = {
    price: 99, // Selling Price
    discountPrice: 499, // Original Price
    cover: "", // Cover Image URL
    driveLink: "", // PDF/EPUB Drive Link
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchEBooks();
  }, []);

  const fetchEBooks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "ebooks"));
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEbooks(list);
    } catch (error) {
      console.error("Error fetching ebooks:", error);
    }
  };

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

  const handleFinalSubmit = async () => {
    // Validation: Cover, File Link & Prices are Required
    if (!formData.cover || !formData.driveLink || !formData.price) {
      alert("⚠️ Cover Image, Drive Link and Pricing are strictly required!");
      return;
    }

    setLoading(true);
    try {
      // Auto-generating title
      const autoTitle = `E-Book Asset ${new Date().toLocaleDateString(
        "en-GB"
      )}`;

      await addDoc(collection(db, "ebooks"), {
        title: autoTitle, // Fallback title
        cover: formData.cover,
        driveLink: formData.driveLink,
        price: formData.price.toString(),
        discountPrice: formData.discountPrice.toString(), // Using discountPrice as original
        category: "General", // Default category
        status: "Active",
        createdAt: new Date().toISOString(),
      });

      setShowModal(false);
      fetchEBooks();
    } catch (error) {
      console.error("Error adding ebook:", error);
      alert("Failed to save ebook");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this digital asset?")) return;
    try {
      await deleteDoc(doc(db, "ebooks", id));
      fetchEBooks();
    } catch (error) {
      console.error("Error deleting ebook:", error);
    }
  };

  const steps = [
    { id: 1, label: "Book Assets", icon: <FileText size={16} /> },
    { id: 2, label: "Pricing", icon: <DollarSign size={16} /> },
    { id: 3, label: "Review", icon: <Rocket size={16} /> },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[500px]">
      {/* SIDEBAR DASHBOARD */}
      <div className="w-full lg:w-[400px]">
        <div className="bg-slate-950 p-8 lg:p-10 rounded-[40px] text-white flex flex-col justify-between shadow-2xl sticky top-28 overflow-hidden">
          <div className="absolute top-0 right-0 size-64 bg-orange-500/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
          <div className="relative z-10">
            <div className="size-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-orange-500/20">
              <BookOpen size={32} className="text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter mb-4 leading-none uppercase">
              Digital <br /> <span className="text-orange-400">Library</span>
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed italic">
              "Distribute knowledge instantly. Secure & Direct."
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

      {/* EBOOK LIST */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[75vh]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Shelf Inventory ({ebooks.length})
          </h3>
          <Layout size={16} className="text-slate-300" />
        </div>
        <AnimatePresence mode="popLayout">
          {ebooks.map((ebook) => (
            <motion.div
              layout
              key={ebook.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-5 lg:p-6 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:shadow-2xl hover:border-orange-100 transition-all duration-500"
            >
              <div className="flex items-center gap-4 lg:gap-5">
                <div className="size-16 lg:size-20 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center text-slate-400 group-hover:ring-4 ring-orange-50 transition-all duration-500 relative shrink-0">
                  {ebook.cover ? (
                    <img
                      src={ebook.cover}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileText size={24} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">
                    {ebook.title || "Untitled Asset"}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                      ₹{ebook.price}
                    </span>
                    {ebook.driveLink && (
                      <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
                        <CheckCircle2 size={10} /> Digital Ready
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <button
                  onClick={() => handleEdit(ebook)}
                  className="p-3 bg-slate-50 text-slate-500 rounded-xl hover:bg-orange-50 hover:text-orange-600 shadow-sm transition-colors"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(ebook.id)}
                  className="p-3 bg-slate-50 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-500 shadow-sm transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 lg:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-5xl rounded-[40px] lg:rounded-[54px] shadow-2xl relative z-10 overflow-hidden flex flex-col lg:flex-row h-[90vh] lg:h-[80vh]"
            >
              {/* STEPS SIDEBAR */}
              <div className="w-full lg:w-[300px] bg-slate-950 p-8 lg:p-10 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
                <div className="absolute top-0 left-0 size-64 bg-orange-500/20 rounded-full blur-[80px] -ml-20 -mt-20 pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-10 leading-none">
                    Asset <br />
                    <span className="text-orange-400">Manager</span>
                  </h3>
                  <div className="space-y-3">
                    {steps.map((step) => (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStep(step.id)}
                        className={`w-full flex items-center gap-4 text-left p-4 rounded-2xl transition-all border border-transparent ${
                          currentStep === step.id
                            ? "bg-white/10 opacity-100 border-white/5 shadow-lg"
                            : "opacity-40 hover:opacity-70"
                        }`}
                      >
                        <div
                          className={`size-8 rounded-lg flex items-center justify-center font-bold ${
                            currentStep === step.id
                              ? "text-orange-400"
                              : "text-slate-400"
                          }`}
                        >
                          {step.icon}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {step.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* FORM AREA */}
              <div className="flex-1 flex flex-col bg-white min-w-0 overflow-hidden">
                <div className="p-6 lg:p-8 border-b border-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="size-2 bg-orange-500 rounded-full animate-pulse" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      {editingId ? "Editing Asset" : "New Digital Asset"}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar selection:bg-orange-100">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="max-w-2xl mx-auto space-y-10"
                    >
                      {currentStep === 1 && (
                        <AssetsTab
                          formData={formData}
                          setFormData={setFormData}
                        />
                      )}
                      {currentStep === 2 && (
                        <PricingTab
                          formData={formData}
                          setFormData={setFormData}
                        />
                      )}
                      {currentStep === 3 && <ReviewTab formData={formData} />}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="p-6 lg:p-8 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center">
                  <button
                    onClick={() => setCurrentStep((s) => s - 1)}
                    disabled={currentStep === 1}
                    className="px-6 py-3 text-slate-400 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 disabled:opacity-0 hover:text-slate-950 transition-all"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  {currentStep < 3 ? (
                    <button
                      onClick={() => setCurrentStep((s) => s + 1)}
                      className="px-10 py-4 bg-slate-950 text-white rounded-[20px] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200 hover:bg-orange-500 transition-all flex items-center gap-3"
                    >
                      Next Step <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinalSubmit}
                      disabled={loading}
                      className="px-10 py-4 bg-emerald-500 text-white rounded-[20px] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-100 hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-3"
                    >
                      {loading ? "Saving..." : "Publish E-Book"}{" "}
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

// --- TAB COMPONENTS ---

const AssetsTab = ({ formData, setFormData }) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2 mb-10">
        <div className="size-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <FileText size={32} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 uppercase">
          Book Assets
        </h3>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          Link your visual and digital content
        </p>
      </div>

      <div className="space-y-6">
        {/* Cover Image */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            Cover Image URL <span className="text-red-500">*</span>
          </label>
          <div className="relative group">
            <input
              type="text"
              placeholder="https://imgur.com/..."
              className="w-full bg-slate-50 p-6 pl-6 pr-14 rounded-[28px] border-2 border-transparent focus:border-blue-100 focus:bg-white outline-none font-bold text-slate-900 transition-all text-sm"
              value={formData.cover || ""}
              onChange={(e) =>
                setFormData({ ...formData, cover: e.target.value })
              }
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
              <ImageIcon size={20} />
            </div>
          </div>
          {formData.cover && (
            <div className="mt-2 ml-2 flex items-center gap-2 text-[10px] text-emerald-600 font-bold animate-in fade-in">
              <CheckCircle2 size={12} /> Cover Linked
            </div>
          )}
        </div>

        {/* Drive Link */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            Book File (Drive Link) <span className="text-red-500">*</span>
          </label>
          <div className="relative group">
            <input
              type="text"
              placeholder="https://drive.google.com/..."
              className="w-full bg-slate-50 p-6 pl-6 pr-14 rounded-[28px] border-2 border-transparent focus:border-orange-100 focus:bg-white outline-none font-bold text-slate-900 transition-all text-sm"
              value={formData.driveLink || ""}
              onChange={(e) =>
                setFormData({ ...formData, driveLink: e.target.value })
              }
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
              <LinkIcon size={20} />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 ml-2">
            Ensure the Drive link is accessible to "Anyone with the link"
          </p>
        </div>
      </div>
    </div>
  );
};

const PricingTab = ({ formData, setFormData }) => (
  <div className="space-y-8">
    <div className="text-center space-y-2 mb-8">
      <h3 className="text-2xl font-black text-slate-900 uppercase">
        Set Pricing
      </h3>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
        Define the value of your content
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PriceControl
        label="Listing Price (Original)"
        value={formData.discountPrice}
        color="slate"
        onChange={(v) => setFormData({ ...formData, discountPrice: v })}
      />
      <PriceControl
        label="Offer Price (Selling)"
        value={formData.price}
        color="emerald"
        onChange={(v) => setFormData({ ...formData, price: v })}
      />
    </div>
  </div>
);

const ReviewTab = ({ formData }) => (
  <div className="text-center py-6 space-y-8">
    <div className="size-28 bg-emerald-50 text-emerald-500 rounded-[40px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-50/50 animate-bounce">
      <Rocket size={48} />
    </div>
    <div className="space-y-4">
      <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
        Ready to Deploy
      </h3>
      <div className="bg-slate-50 p-6 rounded-[32px] max-w-sm mx-auto space-y-3 border border-slate-100">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Selling Price
          </span>
          <span className="text-lg font-black text-emerald-600">
            ₹{formData.price}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Content
          </span>
          <span className="text-xs font-bold text-slate-900">
            {formData.driveLink ? "Linked" : "Missing"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Cover
          </span>
          <span className="text-xs font-bold text-slate-900">
            {formData.cover ? "Attached" : "None"}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const PriceControl = ({ label, value, onChange, color }) => (
  <div
    className={`p-8 bg-${color}-50/50 rounded-[40px] border border-${color}-100 transition-all hover:bg-${color}-50`}
  >
    <p
      className={`text-[10px] font-black text-${color}-600 uppercase tracking-widest mb-4`}
    >
      {label}
    </p>
    <div className="flex items-center justify-between">
      <span className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter">
        ₹{value}
      </span>
      <div className="flex flex-col gap-1.5">
        <button
          onClick={() => onChange(Number(value) + 100)}
          className="p-2 bg-white rounded-xl shadow-sm hover:bg-orange-600 hover:text-white transition-all"
        >
          <ChevronUp size={16} />
        </button>
        <button
          onClick={() => onChange(Math.max(0, Number(value) - 100))}
          className="p-2 bg-white rounded-xl shadow-sm hover:bg-red-500 hover:text-white transition-all"
        >
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  </div>
);

export default EBookManager;
