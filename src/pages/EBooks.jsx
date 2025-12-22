import React, { useState } from "react";
import { Link } from "react-router-dom"; // Added Link
import { motion, AnimatePresence } from "framer-motion";
import BookRequestSection from "../components/BookRequestSection";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../context/AuthContext"; // [NEW] Auth Hook
import { EBOOKS_DATA } from "../data/ebooksData"; // [NEW] Central Data
import {
  Search,
  Book,
  Lock,
  Unlock,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  EyeOff,
  CheckCircle,
} from "lucide-react";

const CATEGORIES = ["All", "Development", "Design", "Business", "Engineering"];

const EBooks = () => {
  const { currentUser } = useAuth(); // [NEW] Get User
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [readingBook, setReadingBook] = useState(null);

  // Filter Logic
  const filteredBooks = EBOOKS_DATA.filter((book) => {
    const matchesCategory =
      activeCategory === "All" || book.category === activeCategory;
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // [NEW] Smart Buy Handler
  const handleBuy = (book) => {
    if (currentUser) {
      // Logic for logged-in user
      alert(`🎉 Successfully added "${book.title}" to your library!`);
      // In a real app, update DB here
    } else {
      // Logic for guest
      setIsAuthOpen(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans">
      <div className="pt-20 md:pt-32 pb-0">
        {/* --- Header --- */}
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-2">
                Digital{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#5edff4] to-[#0891b2]">
                  Library
                </span>
              </h1>
              <p className="text-slate-500">
                Secure access to premium PDF resources.
              </p>
            </div>
            {/* Search Input */}
            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="size-5 text-slate-400 group-focus-within:text-[#5edff4] transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search e-books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 bg-white shadow-sm focus:outline-none focus:border-[#5edff4] focus:ring-1 focus:ring-[#5edff4] transition-all"
              />
            </div>
          </div>
          {/* Categories */}
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

        {/* --- Grid --- */}
        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onRead={() => setReadingBook(book)}
                  onBuy={() => handleBuy(book)} // Pass handler
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        <BookRequestSection />
      </div>

      {/* --- Secure PDF Viewer Modal --- */}
      <AnimatePresence>
        {readingBook && (
          <SecurePDFViewer
            book={readingBook}
            onClose={() => setReadingBook(null)}
          />
        )}
      </AnimatePresence>

      {/* --- Auth Modal --- */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultMode="login"
      />
    </div>
  );
};

// ==========================================
// 1. BOOK CARD (Updated for Free Logic)
// ==========================================
const BookCard = ({ book, onRead, onBuy }) => {
  const isFree = book.price === "Free";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col h-full group"
    >
      <Link
        to={`/ebooks/${book.id}`}
        className="block relative w-full aspect-2/3 rounded-2xl overflow-hidden shadow-md mb-4 group-hover:shadow-2xl transition-all duration-500 bg-slate-100 cursor-pointer"
      >
        <img
          src={book.cover}
          alt={book.title}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-tr from-black/20 to-transparent pointer-events-none" />
        <div className="absolute top-3 right-3">
          <div
            className={`size-8 rounded-full flex items-center justify-center backdrop-blur-md ${
              book.purchased
                ? "bg-[#5edff4]/90 text-slate-900"
                : "bg-slate-900/80 text-white"
            }`}
          >
            {book.purchased ? (
              <Unlock className="size-4" />
            ) : (
              <Lock className="size-4" />
            )}
          </div>
        </div>
      </Link>

      <div className="flex flex-col grow">
        <span className="text-[10px] font-bold text-[#0891b2] uppercase tracking-wider mb-1">
          {book.category}
        </span>
        <Link to={`/ebooks/${book.id}`}>
          <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1 hover:text-[#0891b2] transition-colors">
            {book.title}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 mb-3">by {book.author}</p>
        <div className="mt-auto">
          {book.purchased ? (
            <button
              onClick={onRead}
              className="w-full py-2.5 rounded-xl bg-[#5edff4] text-slate-900 font-bold text-sm hover:bg-[#22ccEB] transition-all shadow-lg shadow-[#5edff4]/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Book className="size-4" /> Open Secure PDF
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <span
                className={`text-lg font-bold ${
                  isFree ? "text-green-600" : "text-slate-900"
                }`}
              >
                {book.price}
              </span>
              <button
                onClick={onBuy}
                className={`px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-2
                ${
                  isFree
                    ? "bg-green-600 hover:bg-green-500"
                    : "bg-slate-900 hover:bg-slate-800"
                }`}
              >
                {isFree ? <CheckCircle className="size-3.5" /> : null}
                {isFree ? "Get Free" : "Buy PDF"}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// 2. SECURE PDF VIEWER (Unchanged)
// ==========================================
const SecurePDFViewer = ({ book, onClose }) => {
  const [pageNum, setPageNum] = useState(1);
  const [scale, setScale] = useState(1);
  const [isFocused, setIsFocused] = useState(true);
  const [securityWarning, setSecurityWarning] = useState(false);

  // --- SECURITY LOGIC ---
  useEffect(() => {
    // 1. Blur on Focus Loss (Prevents Snipping Tool)
    const handleBlur = () => setIsFocused(false);
    const handleFocus = () => setIsFocused(true);

    // 2. Disable Key Combinations
    const handleKeyDown = (e) => {
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && e.key === "p") ||
        (e.ctrlKey && e.shiftKey && e.key === "s") ||
        (e.metaKey && e.shiftKey && e.key === "4")
      ) {
        e.preventDefault();
        setSecurityWarning(true);
        setTimeout(() => setSecurityWarning(false), 2000);
      }
    };

    const handleContextMenu = (e) => e.preventDefault();

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 bg-slate-900 flex flex-col select-none"
    >
      {/* Toolbar */}
      <div className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 z-50 shrink-0">
        <div className="flex items-center gap-3 text-white">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg cursor-pointer"
          >
            <X className="size-5" />
          </button>
          <div className="flex flex-col">
            <span className="font-bold text-sm truncate max-w-37.5 md:max-w-xs">
              {book.title}
            </span>
            <span className="text-[10px] text-slate-400">Read Only Mode</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setScale((s) => Math.max(s - 0.2, 0.6))}
            className="p-1.5 hover:bg-slate-700 rounded-md text-slate-300 cursor-pointer"
          >
            <ZoomOut className="size-4" />
          </button>
          <span className="text-xs text-slate-300 w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(s + 0.2, 2.0))}
            className="p-1.5 hover:bg-slate-700 rounded-md text-slate-300 cursor-pointer"
          >
            <ZoomIn className="size-4" />
          </button>
        </div>
      </div>

      {/* Viewer Area */}
      <div className="flex-1 relative bg-[#333] overflow-auto flex justify-center p-4 md:p-8">
        {!isFocused && (
          <div className="absolute inset-0 z-100 bg-slate-900/95 backdrop-blur-3xl flex flex-col items-center justify-center">
            <EyeOff className="size-16 text-slate-500 mb-4" />
            <h2 className="text-xl font-bold text-white">Content Hidden</h2>
            <p className="text-slate-400 text-sm">
              Return to this window to continue reading.
            </p>
          </div>
        )}

        <AnimatePresence>
          {securityWarning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-100 bg-black/90 flex flex-col items-center justify-center text-center p-6"
            >
              <AlertTriangle className="size-16 text-red-500 mb-4 animate-bounce" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Screenshot Detected
              </h2>
              <p className="text-slate-300">
                This action has been logged. Content is protected.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          animate={{ scale: scale }}
          className="relative bg-white shadow-2xl origin-top"
          style={{
            width: "100%",
            maxWidth: "800px",
            aspectRatio: "1 / 1.414",
            height: "fit-content",
          }}
        >
          {/* CONTENT SIMULATION */}
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col text-slate-800 pointer-events-none">
            <div className="w-full border-b-2 border-slate-100 pb-4 mb-8 flex justify-between items-center opacity-50">
              <span className="text-xs font-bold uppercase">{book.title}</span>
              <span className="text-xs">Page {pageNum}</span>
            </div>
            <div className="space-y-4 opacity-80">
              <div className="w-3/4 h-8 bg-slate-800 rounded mb-8"></div>
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-full h-3 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
          {/* WATERMARK */}
          <div className="absolute inset-0 z-40 pointer-events-none opacity-[0.05] flex flex-wrap content-center justify-center overflow-hidden gap-16 rotate-[-30deg]">
            {[...Array(20)].map((_, i) => (
              <span
                key={i}
                className="text-2xl font-black text-black whitespace-nowrap"
              >
                DO NOT COPY
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Pagination */}
      <div className="h-14 bg-slate-800 border-t border-slate-700 flex items-center justify-center gap-6 shrink-0 z-50">
        <button
          onClick={() => setPageNum((p) => Math.max(p - 1, 1))}
          className="p-2 rounded-full bg-slate-700 text-white hover:bg-[#5edff4] hover:text-slate-900 transition-all cursor-pointer"
        >
          <ChevronLeft className="size-5" />
        </button>
        <span className="text-white font-mono text-sm">
          Page {pageNum} / {book.totalPages}
        </span>
        <button
          onClick={() => setPageNum((p) => Math.min(p + 1, book.totalPages))}
          className="p-2 rounded-full bg-slate-700 text-white hover:bg-[#5edff4] hover:text-slate-900 transition-all cursor-pointer"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default EBooks;
