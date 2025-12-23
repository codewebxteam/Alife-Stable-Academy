import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { EBOOKS_DATA } from "../data/ebooksData";
import BookHero from "../components/ebook-details/BookHero";
import BookContent from "../components/ebook-details/BookContent";
import BookPricingCard from "../components/ebook-details/BookPricingCard";
import AuthModal from "../components/AuthModal";
import SecurePDFViewer from "../components/SecurePDFViewer";
import { useAuth } from "../context/AuthContext";
import { useEBook } from "../context/EBookContext";

const EBookDetails = () => {
  const { id } = useParams();
  const bookData = EBOOKS_DATA.find((b) => b.id.toString() === id) || EBOOKS_DATA[0];
  
  const { currentUser } = useAuth();
  const { purchasedBooks, purchaseBook } = useEBook();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  
  const isPurchased = purchasedBooks.includes(bookData.id);
  const book = { ...bookData, purchased: isPurchased };

  const handleAction = () => {
    if (isPurchased) {
      setShowPDFViewer(true);
    } else {
      if (currentUser) {
        purchaseBook(bookData.id);
      } else {
        setIsAuthOpen(true);
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 font-sans pb-20">
        <BookHero book={book} />

        <div className="max-w-7xl mx-auto px-6 mt-10">
          <div className="grid lg:grid-cols-3 gap-12 relative">
            <div className="lg:col-span-2 space-y-10">
              <div className="bg-white border border-slate-200 p-8 rounded-3xl">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  About this E-Book
                </h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {book.description}
                </p>
              </div>
              <BookContent chapters={book.chapters} />
            </div>

            <div className="lg:col-span-1 relative">
              <BookPricingCard book={book} onAction={handleAction} />
            </div>
          </div>
        </div>

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          defaultMode="login"
        />
      </div>
      
      {showPDFViewer && (
        <SecurePDFViewer book={book} onClose={() => setShowPDFViewer(false)} />
      )}
    </>
  );
};

export default EBookDetails;
