import React from "react";
import { ShieldCheck, CheckCircle, ShoppingBag, BookOpen } from "lucide-react";
// [FIXED IMPORT PATH]
import { useAgency } from "../../context/AgencyContext";
import { useAuth } from "../../context/AuthContext"; // [ADDED] Import Auth Context

const BookPricingCard = ({ book, onAction }) => {
  const { currentUser } = useAuth(); // [ADDED] Get User Data
  const { getPrice, agency, isMainSite } = useAgency(); // [UPDATED] Get Agency Data

  // [LOGIC] Get the correct price (Partner's or Admin's)
  const finalPrice = getPrice(book.id, book.price);

  // Check if it's free based on the FINAL price
  const isFree =
    String(finalPrice).toLowerCase() === "free" ||
    finalPrice === 0 ||
    finalPrice === "0";

  // --- [NEW] WhatsApp Redirect Logic with Beautiful Message ---
  const handlePartnerBuy = () => {
    if (!agency?.whatsapp) {
      alert("Contact support for enrollment.");
      return;
    }

    // Prepare Student Details
    const studentName = currentUser?.displayName || "Guest Student";
    const studentEmail = currentUser?.email || "Not Provided";

    // Construct "Sundar" Message 📝
    const message =
      `*New E-Book Purchase Request* 📚\n\n` +
      `Hello, I want to purchase this E-Book. Here are my details:\n\n` +
      `👤 *Student Name:* ${studentName}\n` +
      `📧 *Mail:* ${studentEmail}\n\n` +
      `📖 *Book Title:* ${book.title}\n` +
      `💰 *Price:* ₹${finalPrice}\n` +
      `🆔 *Book ID:* ${book.id}\n\n` +
      `Please guide me with the payment process.`;

    // WhatsApp URL
    const whatsappUrl = `https://wa.me/${agency.whatsapp.replace(
      /\D/g,
      ""
    )}?text=${encodeURIComponent(message)}`;

    // Open in new tab
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="lg:absolute lg:-top-60 lg:right-0 w-full lg:w-96 z-20">
      <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden sticky top-24">
        {/* Cover Preview with Fallback */}
        <div
          className="relative h-64 bg-slate-100 p-8 flex items-center justify-center group cursor-pointer"
          onClick={book.purchased ? onAction : null}
        >
          <img
            src={book.cover}
            alt={book.title}
            className="h-full object-contain shadow-xl rounded-md transform group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/600x900?text=Book+Cover";
            }}
          />
          {book.purchased && (
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-white/90 px-4 py-2 rounded-full text-xs font-bold shadow-sm">
                Click to Read
              </span>
            </div>
          )}
        </div>

        <div className="p-8">
          {book.purchased ? (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full mb-4 border border-emerald-100">
                <ShieldCheck className="size-4" /> Owned
              </div>
              <button
                onClick={onAction}
                className="w-full py-4 bg-[#5edff4] text-slate-900 font-bold text-lg rounded-xl hover:bg-[#4ecee4] transition-all shadow-lg shadow-[#5edff4]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <BookOpen className="size-5" /> Read Now
              </button>
              <p className="text-xs text-slate-400 mt-3">
                Unlimited access on all devices
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-end gap-3 mb-6">
                <span
                  className={`text-4xl font-black ${
                    isFree ? "text-emerald-600" : "text-slate-900"
                  }`}
                >
                  {/* [UPDATED] Show Final Dynamic Price */}
                  {isFree ? "Free" : `₹${finalPrice}`}
                </span>

                {/* Show Original Price only if it's different and not free */}
                {!isFree && book.originalPrice && (
                  <span className="text-lg text-slate-400 line-through mb-1 font-bold">
                    ₹{book.originalPrice}
                  </span>
                )}
              </div>

              <button
                // [UPDATED CLICK HANDLER]
                onClick={() => {
                  // Partner Site + Paid Book = WhatsApp Redirect
                  if (!isMainSite && !isFree) {
                    handlePartnerBuy();
                  } else {
                    // Main Site OR Free Book = Normal Action (Payment/Read)
                    onAction();
                  }
                }}
                className={`w-full py-4 text-white font-bold text-lg rounded-xl transition-all shadow-xl active:scale-95 mb-4 cursor-pointer flex items-center justify-center gap-2
                        ${
                          isFree
                            ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-200"
                            : "bg-slate-900 hover:bg-slate-800 shadow-slate-200"
                        }`}
              >
                {isFree ? (
                  <CheckCircle className="size-5" />
                ) : (
                  <ShoppingBag className="size-5" />
                )}
                {isFree ? "Read for Free" : "Buy Now"}
              </button>
              <p className="text-center text-xs text-slate-500 mb-6 flex items-center justify-center gap-1">
                <ShieldCheck size={12} /> Secure Payment • Instant Access
              </p>
            </>
          )}

          <div className="space-y-4 border-t border-slate-100 pt-6">
            <h4 className="font-bold text-slate-900 text-sm">
              This E-Book includes:
            </h4>
            {book.features &&
              book.features.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-slate-600 font-medium"
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
