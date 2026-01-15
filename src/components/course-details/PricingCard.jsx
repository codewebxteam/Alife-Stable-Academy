import React from "react";
import { motion } from "framer-motion";
import {
  PlayCircle,
  ShieldCheck,
  Infinity,
  Trophy,
  Smartphone,
  FileText,
  CheckCircle,
} from "lucide-react";
import { useAgency } from "../../context/AgencyContext"; // Ensure correct path
import { useNavigate } from "react-router-dom";

const PricingCard = ({ course, onEnroll, isEnrolled }) => {
  // [FIX] Destructure getPrice from context
  const { agency, isPartner, getPrice } = useAgency();
  const navigate = useNavigate();

  // --- [FIXED DYNAMIC PRICING LOGIC] ---
  // Use getPrice helper to fetch Partner's Custom Price or Default Price
  const dynamicPrice = getPrice
    ? getPrice(course.id, course.price)
    : course.price;

  // Formatting Helper
  const formatCurrency = (amount) => {
    if (!amount) return "Free";
    const strAmount = String(amount).toLowerCase();
    if (strAmount === "free" || strAmount === "0") return "Free";

    // Clean string and convert to number
    const numericValue = parseInt(String(amount).replace(/[^0-9]/g, ""));

    // Check for valid number
    if (isNaN(numericValue) || numericValue === 0) return "Free";

    return `₹${numericValue.toLocaleString("en-IN")}`;
  };

  const displayPrice = formatCurrency(dynamicPrice);
  const displayOriginalPrice = formatCurrency(course.originalPrice);

  const calculateDiscount = () => {
    if (displayPrice === "Free" || !course.originalPrice) return "100% off";

    const offerPrice = parseInt(String(dynamicPrice).replace(/[^0-9]/g, ""));
    const listingPrice = parseInt(
      String(course.originalPrice).replace(/[^0-9]/g, "")
    );

    if (
      !isNaN(offerPrice) &&
      !isNaN(listingPrice) &&
      listingPrice > offerPrice
    ) {
      const discount = Math.round(
        ((listingPrice - offerPrice) / listingPrice) * 100
      );
      return `${discount}% off`;
    }
    return "Special Offer";
  };

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
          {/* Show "Purchased" status if enrolled */}
          {isEnrolled ? (
            <div className="mb-6 flex items-center gap-3 text-emerald-600 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              <CheckCircle className="size-6 shrink-0" />
              <div>
                <span className="font-black text-lg block leading-none mb-1">
                  You own this course
                </span>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                  Ready to watch
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="text-4xl font-black text-slate-900">
                {displayPrice}
              </span>
              {displayOriginalPrice &&
                displayOriginalPrice !== displayPrice &&
                displayOriginalPrice !== "Free" && (
                  <>
                    <span className="text-lg text-slate-400 line-through">
                      {displayOriginalPrice}
                    </span>
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                      {calculateDiscount()}
                    </span>
                  </>
                )}
            </div>
          )}

          {/* Button Change based on Enrollment */}
          {isEnrolled ? (
            <button
              onClick={() => navigate("/dashboard/my-courses")}
              className="w-full py-4 text-white font-bold text-lg rounded-xl transition-all shadow-lg active:scale-95 mb-4 cursor-pointer bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center gap-2"
              style={{
                boxShadow: `0 10px 15px -3px rgba(16, 185, 129, 0.3)`,
              }}
            >
              Go to Dashboard
            </button>
          ) : (
            <button
              onClick={() =>
                onEnroll({
                  ...course,
                  finalPrice: dynamicPrice, // Pass dynamic price
                  commission: isPartner ? "Calculated at Checkout" : 0,
                })
              }
              className="w-full py-4 text-slate-900 font-bold text-lg rounded-xl transition-all shadow-lg active:scale-95 mb-4 cursor-pointer"
              style={{
                backgroundColor: agency?.accentColor || "#5edff4", // Safe access
                boxShadow: `0 10px 15px -3px ${
                  agency?.accentColor || "#5edff4"
                }33`,
              }}
            >
              {displayPrice === "Free" ? "Enroll for Free" : "Buy Now"}
            </button>
          )}

          <p className="text-center text-xs text-slate-500 mb-6">
            30-Day Money-Back Guarantee
          </p>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">
              This course includes:
            </h4>
            <FeatureItem icon={Infinity} text="Lifetime access" />
            <FeatureItem icon={Smartphone} text="Access on mobile and TV" />
            {course.driveLink && (
              <FeatureItem icon={FileText} text="Downloadable Study Material" />
            )}
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
