import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { EBOOKS_DATA } from "../data/ebooksData"; // Importing data
import BookHero from "../components/ebook-details/BookHero";
import BookContent from "../components/ebook-details/BookContent";
import BookPricingCard from "../components/ebook-details/BookPricingCard";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../context/AuthContext"; // [NEW] Auth Hook

const EBookDetails = () => {
  const { id } = useParams();
  const book =
    EBOOKS_DATA.find((b) => b.id.toString() === id) || EBOOKS_DATA[0];

  const { currentUser } = useAuth(); // [NEW] Get User
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Smart Action Handler
  const handleAction = () => {
    if (book.purchased) {
      // Logic to open reader (not implemented in details page view, usually happens on listing)
      alert("Opening reader...");
    } else {
      if (currentUser) {
        // Logged In -> Buy
        alert(`🎉 Successfully bought ${book.title}!`);
      } else {
        // Not Logged In -> Login
        setIsAuthOpen(true);
      }
    }
  };

  return (
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
  );
};

export default EBookDetails;
