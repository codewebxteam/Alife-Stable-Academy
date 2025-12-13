import { GraduationCap, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function LandingPage() {
  const navigate = useNavigate();

  // ✅ ONLY CHANGE
  const { isAuthenticated, referralName } = useAuth();

  const isPartnerBrand = Boolean(referralName);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black/30 backdrop-blur-sm p-6 mt-[90px]">
      <div className="w-full max-w-4xl bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] border border-orange-500/30 rounded-3xl shadow-2xl p-10">

        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-white">
            {isPartnerBrand
              ? `${referralName} Academy`
              : "ALife Stable Academy"}
          </h1>

          <p className="text-gray-400 mt-3 text-lg max-w-xl mx-auto">
            {isPartnerBrand
              ? `${referralName} recommends these premium learning programs for you.`
              : "A next-generation learning platform with premium courses, books & materials."}
          </p>
        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/5 border border-orange-500/20 p-6 rounded-2xl text-center">
            <Users className="w-10 h-10 mx-auto text-orange-400" />
            <h3 className="text-xl font-bold text-white mt-3">
              Expert Instructors
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Top educators teaching practical skills.
            </p>
          </div>

          <div className="bg-white/5 border border-orange-500/20 p-6 rounded-2xl text-center">
            <Star className="w-10 h-10 mx-auto text-orange-400" />
            <h3 className="text-xl font-bold text-white mt-3">
              Premium Content
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Access high-quality course material.
            </p>
          </div>

          <div className="bg-white/5 border border-orange-500/20 p-6 rounded-2xl text-center">
            <GraduationCap className="w-10 h-10 mx-auto text-orange-400" />
            <h3 className="text-xl font-bold text-white mt-3">
              Learn Anywhere
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Study from any device with ease.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center gap-4">
          {isAuthenticated ? (
            <Button
              onClick={() => navigate("/home")}
              className="px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold"
            >
              Go to Home
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/signup")}
              className="px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold"
            >
              {isPartnerBrand
                ? `Join ${referralName} Academy`
                : "Get Started"}
            </Button>
          )}

          <Button
            onClick={() => navigate("/courses")}
            className="px-6 py-4 bg-black text-white rounded-xl border border-white/20"
          >
            Explore Courses
          </Button>
        </div>
      </div>
    </div>
  );
}
