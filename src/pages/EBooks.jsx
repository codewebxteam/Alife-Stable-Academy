import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BookRequestSection from "../components/BookRequestSection";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../context/AuthContext";
import { useEBook } from "../context/EBookContext";
import { useAgency } from "../context/AgencyContext"; // [ADDED]
import { db } from "../firebase/config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import {
  Search,
  Book,
  Lock,
  X,
  Loader2,
  AlertTriangle,
  ShoppingBag,
  BookOpen,
} from "lucide-react";

const EBooks = () => {
  const { currentUser } = useAuth();
  const { purchasedBooks } = useEBook();
  const { getPrice } = useAgency(); // [ADDED] Get Dynamic Price Function
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [readingBook, setReadingBook] = useState(null);
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbPurchasedIds, setDbPurchasedIds] = useState([]);

  // --- Helper for Images ---
  const getValidImageUrl = (url) => {
    if (!url) return "https://placehold.co/400x600?text=No+Cover";
    try {
      if (url.includes("drive.google.com")) {
        let id = "";
        if (url.includes("/file/d/"))
          id = url.split("/file/d/")[1].split("/")[0];
        else if (url.includes("id=")) id = url.split("id=")[1].split("&")[0];
        if (id) return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
      }
    } catch (e) {
      console.error(e);
    }
    return url;
  };

  // 1. Fetch All E-Books
  useEffect(() => {
    const fetchLiveEBooks = async () => {
      try {
        setLoading(true);
        const q = collection(db, "ebooks");
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          image: getValidImageUrl(doc.data().image),
        }));
        setEbooks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveEBooks();
  }, []);

  // 2. Fetch Purchased Books from DB (Refresh Proof)
  useEffect(() => {
    const fetchPurchases = async () => {
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.purchasedBooks && Array.isArray(data.purchasedBooks)) {
              setDbPurchasedIds(data.purchasedBooks);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchPurchases();
  }, [currentUser]);

  const filteredBooks = ebooks.filter((book) => {
    const matchesSearch =
      (book.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (book.author?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleRead = (book) => {
    // Check ownership
    const isOwned =
      dbPurchasedIds.includes(book.id) || purchasedBooks.includes(book.id);
    if (currentUser && isOwned) {
      setReadingBook(book);
    } else {
      navigate(`/ebooks/${book.id}`); // Go to buy
    }
  };

  if (loading)
    return (
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
                Digital Library
              </h1>
              <p className="text-slate-500">
                Secure access to premium PDF resources.
              </p>
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
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {filteredBooks.map((book) => {
                // [LOGIC] Dynamic Price Check
                const finalPrice = getPrice(book.id, book.price);

                const isFree =
                  String(finalPrice).toLowerCase() === "free" ||
                  finalPrice === 0 ||
                  finalPrice === "0";

                const isPurchased =
                  dbPurchasedIds.includes(book.id) ||
                  purchasedBooks.includes(book.id) ||
                  isFree;

                return (
                  <BookCard
                    key={book.id}
                    book={book}
                    isPurchased={isPurchased}
                    onRead={() => handleRead(book)}
                    displayPrice={finalPrice} // [ADDED] Pass dynamic price prop
                    isFree={isFree} // [ADDED] Pass isFree flag
                  />
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
        <BookRequestSection />
      </div>

      <AnimatePresence>
        {readingBook && (
          <SecurePDFViewer
            book={readingBook}
            onClose={() => setReadingBook(null)}
          />
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultMode="login"
      />
    </div>
  );
};

const BookCard = ({ book, isPurchased, onRead, displayPrice, isFree }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col h-full group hover:-translate-y-1 transition-transform duration-300"
    >
      <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-md mb-4 bg-slate-100 block">
        {isPurchased ? (
          <div onClick={onRead} className="cursor-pointer h-full w-full">
            <img
              src={book.image}
              alt={book.title}
              className="size-full object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <Link to={`/ebooks/${book.id}`} className="h-full w-full block">
            <img
              src={book.image}
              alt={book.title}
              className="size-full object-cover"
              loading="lazy"
            />
          </Link>
        )}

        <div className="absolute top-3 right-3">
          <div
            className={`size-8 rounded-full flex items-center justify-center backdrop-blur-md text-white shadow-lg ${
              isPurchased ? "bg-green-500/90" : "bg-slate-900/80"
            }`}
          >
            {isPurchased ? (
              <BookOpen className="size-4" />
            ) : (
              <Lock className="size-4" />
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col grow">
        <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-xs text-slate-500 mb-3">by {book.author}</p>
        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <span
              className={`text-lg font-bold ${
                isFree ? "text-green-600" : "text-slate-900"
              }`}
            >
              {/* [UPDATED] Use dynamic price prop */}
              {isFree ? "FREE" : `₹${displayPrice}`}
            </span>

            {isPurchased ? (
              <button
                onClick={onRead}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-lg hover:bg-[#5edff4] hover:text-slate-900 transition-all flex items-center gap-2"
              >
                <BookOpen className="size-4" /> Read
              </button>
            ) : (
              <Link
                to={`/ebooks/${book.id}`}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <ShoppingBag className="size-4" /> Buy
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Secure PDF Viewer (No Download) ---
const SecurePDFViewer = ({ book, onClose }) => {
  const getEmbedUrl = (url) => {
    if (!url) return "";
    try {
      if (url.includes("drive.google.com")) {
        let id = "";
        if (url.includes("/file/d/"))
          id = url.split("/file/d/")[1].split("/")[0];
        else if (url.includes("id=")) id = url.split("id=")[1].split("&")[0];
        if (id) return `https://drive.google.com/file/d/${id}/preview`;
      }
    } catch (e) {
      console.error(e);
    }
    return url;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-slate-900 flex flex-col select-none"
    >
      <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 lg:px-8 z-50 shadow-md">
        <div className="flex items-center gap-4 text-white">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="size-6" />
          </button>
          <div className="flex flex-col">
            <span className="font-bold text-sm lg:text-base line-clamp-1">
              {book.title}
            </span>
            <span className="text-[10px] lg:text-xs text-slate-400">
              Secure Reader
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-slate-950 relative flex flex-col items-center justify-center p-0 lg:p-4">
        <div className="w-full h-full max-w-5xl bg-white lg:rounded-2xl overflow-hidden shadow-2xl relative">
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            onContextMenu={(e) => e.preventDefault()}
          ></div>
          <iframe
            src={getEmbedUrl(book.driveLink)}
            className="w-full h-full border-0"
            title="PDF Reader"
            allow="autoplay"
          ></iframe>
        </div>
      </div>
    </motion.div>
  );
};

export default EBooks;
