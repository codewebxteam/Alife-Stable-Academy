import React from "react";
import { motion } from "framer-motion";
import {
  PlayCircle,
  ShieldCheck,
  Infinity,
  Trophy,
  Smartphone,
} from "lucide-react";
import { useAgency } from "../../context/AgencyContext"; // [NEW] Agency context

const PricingCard = ({ course, onEnroll }) => {
  const { agency, isPartner } = useAgency();

  // --- [DYNAMIC PRICING LOGIC] ---
  // Agar partner site hai, toh multiplier apply karo, varna original price
  const calculatePrice = (originalPriceStr) => {
    if (originalPriceStr === "Free") return "Free";

    // String se number nikalna (e.g., "₹499" -> 499)
    const numericPrice = parseInt(originalPriceStr.replace(/[^0-9]/g, ""));
    const finalPrice = isPartner
      ? Math.round(numericPrice * agency.pricingMultiplier)
      : numericPrice;

    return `₹${finalPrice.toLocaleString("en-IN")}`;
  };

  const displayPrice = calculatePrice(course.price);
  const displayOriginalPrice = calculatePrice(course.originalPrice);

  return (
    <div className="lg:absolute lg:-top-80 lg:right-0 w-full lg:w-95">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden sticky top-24"
      >
        <div className="relative h-48 bg-slate-900 group cursor-pointer overflow-hidden">
          <img
            src={course.image}
            alt="preview"
            className="size-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-14 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <PlayCircle className="size-6 text-slate-900 ml-1" />
            </div>
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="text-white font-bold text-sm">
              Preview this course
            </span>
          </div>
        </div>

        <div className="p-8">
          <div className="flex items-end gap-3 mb-6">
            <span className="text-4xl font-bold text-slate-900">
              {displayPrice}
            </span>
            <span className="text-lg text-slate-400 line-through mb-1">
              {displayOriginalPrice}
            </span>
            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded mb-1">
              {course.price === "Free" ? "100% off" : "Special Offer"}
            </span>
          </div>

          <button
            onClick={() =>
              onEnroll({
                ...course,
                finalPrice: displayPrice,
                commission: isPartner ? "Calculated at Checkout" : 0,
              })
            }
            className="w-full py-4 text-slate-900 font-bold text-lg rounded-xl transition-all shadow-lg active:scale-95 mb-4 cursor-pointer"
            style={{
              backgroundColor: agency.accentColor || "#5edff4",
              boxShadow: `0 10px 15px -3px ${agency.accentColor}33`,
            }}
          >
            Buy Now
          </button>

          <p className="text-center text-xs text-slate-500 mb-6">
            30-Day Money-Back Guarantee
          </p>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">
              This course includes:
            </h4>
            <FeatureItem icon={Infinity} text="Lifetime access" />
            <FeatureItem icon={Smartphone} text="Access on mobile and TV" />
            <FeatureItem icon={Trophy} text="Certificate of completion" />
            <FeatureItem icon={ShieldCheck} text="Expert Q&A Support" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const FeatureItem = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3 text-sm text-slate-600">
    <Icon className="size-4 text-slate-400" />
    <span>{text}</span>
  </div>
);

export default PricingCard;
