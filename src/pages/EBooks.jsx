import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BookRequestSection from "../components/BookRequestSection";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config"; // Live DB
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  Search, Book, Lock, Unlock, X, AlertTriangle,
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, EyeOff,
  CheckCircle, Loader2
} from "lucide-react";

const CATEGORIES = ["All", "Development", "Design", "Business", "Engineering"];

const EBooks = () => {
  const { currentUser } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [readingBook, setReadingBook] = useState(null);
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch Live EBooks ---
  useEffect(() => {
    const fetchLiveEBooks = async () => {
      try {
        setLoading(true);
        let q = query(collection(db, "ebooks"), where("status", "==", "Active"));
        if (activeCategory !== "All") {
          q = query(collection(db, "ebooks"), 
            where("status", "==", "Active"), 
            where("category", "==", activeCategory)
          );
        }
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEbooks(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchLiveEBooks();
  }, [activeCategory]);

  const filteredBooks = ebooks.filter((book) =>
    book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBuy = (book) => {
    if (currentUser) {
      alert(`🎉 Successfully added "${book.title}" to your library!`);
    } else {
      setIsAuthOpen(true);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#0891b2]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans">
      <div className="pt-20 md:pt-32 pb-0">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-2">
                Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5edff4] to-[#0891b2]">Library</span>
              </h1>
              <p className="text-slate-500">Secure access to premium PDF resources.</p>
            </div>
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-[#5edff4]" />
              <input 
                type="text" 
                placeholder="Search e-books..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 outline-none focus:border-[#5edff4] shadow-sm transition-all" 
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-10 justify-center md:justify-start">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)} 
                className={`px-5 py-2 rounded-full text-sm font-bold border transition-all ${activeCategory === cat ? "bg-[#5edff4] text-slate-900 border-[#5edff4] shadow-lg" : "bg-white text-slate-600 border-slate-200 hover:border-[#5edff4]"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} onRead={() => setReadingBook(book)} onBuy={() => handleBuy(book)} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        <BookRequestSection />
      </div>

      <AnimatePresence>
        {readingBook && (
          <SecurePDFViewer book={readingBook} onClose={() => setReadingBook(null)} />
        )}
      </AnimatePresence>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultMode="login" />
    </div>
  );
};

const BookCard = ({ book, onRead, onBuy }) => {
  const isFree = book.price === 0 || book.price === "Free";

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col h-full group">
      <Link to={`/ebooks/${book.id}`} className="relative w-full aspect-2/3 rounded-2xl overflow-hidden shadow-md mb-4 group-hover:shadow-2xl transition-all duration-500 block cursor-pointer">
        <img src={book.cover} alt={book.title} className="size-full object-cover" />
        <div className="absolute top-3 right-3">
          <div className="size-8 rounded-full flex items-center justify-center backdrop-blur-md bg-slate-900/80 text-white">
            <Lock className="size-4" />
          </div>
        </div>
      </Link>
      <div className="flex flex-col grow">
        <span className="text-[10px] font-bold text-[#0891b2] uppercase mb-1">{book.category}</span>
        <Link to={`/ebooks/${book.id}`}><h3 className="text-lg font-bold text-slate-900 leading-tight mb-1 hover:text-[#0891b2]">{book.title}</h3></Link>
        <p className="text-xs text-slate-500 mb-3">by {book.author}</p>
        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <span className={`text-lg font-bold ${isFree ? "text-green-600" : "text-slate-900"}`}>{isFree ? "FREE" : `₹${book.price}`}</span>
            <button onClick={onBuy} className={`px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg hover:scale-105 transition-all ${isFree ? "bg-green-600" : "bg-slate-900"}`}>
              {isFree ? "Get Free" : "Buy PDF"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- SECURE PDF VIEWER (UI Logic Maintained) ---
const SecurePDFViewer = ({ book, onClose }) => {
  const [pageNum, setPageNum] = useState(1);
  const [scale, setScale] = useState(1);
  const [isFocused, setIsFocused] = useState(true);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-60 bg-slate-900 flex flex-col select-none">
      <div className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-3 text-white">
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg"><X className="size-5" /></button>
          <div className="flex flex-col"><span className="font-bold text-sm">{book.title}</span><span className="text-[10px] text-slate-400">Read Only</span></div>
        </div>
      </div>
      <div className="flex-1 relative bg-[#333] flex justify-center p-8 overflow-auto">
        <motion.div animate={{ scale: scale }} className="bg-white shadow-2xl relative" style={{ width: "100%", maxWidth: "800px", aspectRatio: "1 / 1.414", height: "fit-content" }}>
          {/* Watermark and Simulation Content */}
          <div className="absolute inset-0 p-12 text-slate-200 pointer-events-none flex flex-col items-center justify-center italic font-black opacity-10 rotate-[-30deg] text-5xl">SECURE ACCESS ONLY</div>
          <div className="p-12 space-y-4 opacity-50">
             <div className="w-1/2 h-6 bg-slate-200" />
             <div className="w-full h-3 bg-slate-100" /><div className="w-full h-3 bg-slate-100" /><div className="w-full h-3 bg-slate-100" />
          </div>
        </motion.div>
      </div>
      <div className="h-14 bg-slate-800 border-t border-slate-700 flex items-center justify-center gap-6">
        <button onClick={() => setPageNum(p => Math.max(p-1, 1))} className="p-2 rounded-full bg-slate-700 text-white hover:bg-[#5edff4]"><ChevronLeft className="size-5"/></button>
        <span className="text-white text-sm">Page {pageNum} / {book.totalPages || 10}</span>
        <button onClick={() => setPageNum(p => p+1)} className="p-2 rounded-full bg-slate-700 text-white hover:bg-[#5edff4]"><ChevronRight className="size-5"/></button>
      </div>
    </motion.div>
  );
};

export default EBooks;