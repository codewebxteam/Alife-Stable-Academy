import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, Eye, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { EBOOKS_DATA } from "../../data/ebooksData";
import SecurePDFViewer from "../../components/SecurePDFViewer";
import { useEBook } from "../../context/EBookContext";

const EBookLibrary = () => {
  const { purchasedBooks } = useEBook();
  const [selectedBook, setSelectedBook] = useState(null);
  const myBooks = EBOOKS_DATA;

  const handleReadBook = (book) => {
    if (purchasedBooks.includes(book.id)) {
      setSelectedBook(book);
    }
  };

  return (
    <>
      <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              My E-Book Library
            </h1>
            <p className="text-slate-500 mt-1">
              Access your secure digital books here.
            </p>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-3 size-4 text-slate-400 group-focus-within:text-[#5edff4]" />
            <input
              type="text"
              placeholder="Search books..."
              className="bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:border-[#5edff4] focus:ring-1 focus:ring-[#5edff4] outline-none w-full sm:w-64 transition-all"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {myBooks.map((book) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col"
            >
              <div className="relative aspect-2/3 bg-slate-100 rounded-2xl overflow-hidden mb-4 shadow-inner">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                  {purchasedBooks.includes(book.id) ? (
                    <button
                      onClick={() => handleReadBook(book)}
                      className="px-4 py-2 bg-white text-slate-900 rounded-lg font-bold text-xs hover:bg-[#5edff4] transition-colors flex items-center gap-2"
                    >
                      <BookOpen className="size-4" /> Read Now
                    </button>
                  ) : (
                    <Link
                      to={`/ebooks/${book.id}`}
                      className="px-4 py-2 bg-white text-slate-900 rounded-lg font-bold text-xs hover:bg-[#5edff4] transition-colors flex items-center gap-2"
                    >
                      <Lock className="size-4" /> Buy Now
                    </Link>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-slate-900 line-clamp-1 mb-1">
                {book.title}
              </h3>
              <p className="text-xs text-slate-500 mb-4">{book.author}</p>

              <div className="mt-auto">
                {purchasedBooks.includes(book.id) ? (
                  <button
                    onClick={() => handleReadBook(book)}
                    className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-[#5edff4] hover:text-slate-900 transition-colors text-center shadow-lg hover:shadow-[#5edff4]/20 flex items-center justify-center gap-2"
                  >
                    <Eye className="size-4" /> Read Book
                  </button>
                ) : (
                  <Link
                    to={`/ebooks/${book.id}`}
                    className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-[#5edff4] hover:text-slate-900 transition-colors text-center shadow-lg hover:shadow-[#5edff4]/20 flex items-center justify-center gap-2"
                  >
                    <Lock className="size-4" /> Buy to Read
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {selectedBook && (
        <SecurePDFViewer 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
        />
      )}
    </>
  );
};

export default EBookLibrary;
