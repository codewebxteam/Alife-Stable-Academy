import React from "react";
import { Book, ShieldCheck, CheckCircle, ShoppingBag } from "lucide-react";

const BookPricingCard = ({ book, onAction }) => {
  const isFree = book.price === "Free";

  return (
    <div className="lg:absolute lg:-top-60 lg:right-0 w-full lg:w-96 z-20">
      <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden sticky top-24">
        {/* Cover Preview */}
        <div className="relative h-64 bg-slate-100 p-8 flex items-center justify-center">
          <img
            src={book.cover}
            alt={book.title}
            className="h-full object-contain shadow-xl rounded-md transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="p-8">
          {book.purchased ? (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full mb-4">
                <ShieldCheck className="size-4" /> Owned
              </div>
              <button
                onClick={onAction}
                className="w-full py-4 bg-[#5edff4] text-slate-900 font-bold text-lg rounded-xl hover:bg-[#22ccEB] transition-all shadow-lg shadow-[#5edff4]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Book className="size-5" /> Read Now
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-end gap-3 mb-6">
                <span
                  className={`text-4xl font-bold ${
                    isFree ? "text-green-600" : "text-slate-900"
                  }`}
                >
                  {book.price}
                </span>
                {!isFree && (
                  <span className="text-lg text-slate-400 line-through mb-1">
                    {book.originalPrice}
                  </span>
                )}
              </div>

              <button
                onClick={onAction}
                className={`w-full py-4 text-white font-bold text-lg rounded-xl transition-all shadow-xl active:scale-95 mb-4 cursor-pointer flex items-center justify-center gap-2
                        ${
                          isFree
                            ? "bg-green-600 hover:bg-green-500"
                            : "bg-slate-900 hover:bg-slate-800"
                        }`}
              >
                {isFree ? (
                  <CheckCircle className="size-5" />
                ) : (
                  <ShoppingBag className="size-5" />
                )}
                {isFree ? "Get for Free" : "Buy E-Book"}
              </button>
              <p className="text-center text-xs text-slate-500 mb-6">
                Instant Digital Delivery
              </p>
            </>
          )}

          <div className="space-y-4 border-t border-slate-100 pt-6">
            <h4 className="font-bold text-slate-900 text-sm">Includes:</h4>
            {book.features &&
              book.features.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-slate-600"
                >
                  <div className="size-1.5 rounded-full bg-[#5edff4]" />
                  <span>{feat}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookPricingCard;
