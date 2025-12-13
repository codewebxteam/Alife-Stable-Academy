import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Copy, Check, Share2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { ref, onValue, query, orderByChild, equalTo } from "firebase/database";
import { db } from "@/lib/firebase";
import { ROOT_DOMAIN } from "@/config/appConfig";
import { generatePartnerSubdomain } from "@/utils/subdomain";

const Resell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    if (!user || user.role !== "partner") {
      navigate("/");
      return;
    }

    if (!user.referralCode) {
      console.warn("Partner referralCode missing!");
      setReferralCode("");
      setStudentCount(0);
      return;
    }

    const partnerRefCode = user.referralCode;
    setReferralCode(partnerRefCode);

    const usersRef = ref(db, "users");
    const studentsQuery = query(
      usersRef,
      orderByChild("referralCode"),
      equalTo(partnerRefCode)
    );

    const unsubscribe = onValue(studentsQuery, (snapshot) => {
      if (!snapshot.exists()) {
        setStudentCount(0);
        return;
      }

      const count = Object.keys(snapshot.val()).length;
      setStudentCount(count);
    });

    return () => unsubscribe();
  }, [user, navigate]);

  const referralLink = `https://${ROOT_DOMAIN}/r/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const message = `Join alife-stable-academy using my referral link: ${referralLink}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Partner Referral Link",
          text: message,
        });
      } catch {
        console.log("Share cancelled");
      }
    } else {
      handleCopy();
    }
  };

  const partnerSub = generatePartnerSubdomain(user?.fullName || "");
  const futureSubdomainURL = `https://${partnerSub}.${ROOT_DOMAIN}`;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 sm:p-8 mt-[90px]">
      <Card
        className="w-full max-w-md sm:max-w-lg bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] 
        to-[#0D1B2A] border border-orange-500/30 rounded-3xl shadow-2xl p-6 sm:p-8"
      >

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-orange-600 
            rounded-full flex items-center justify-center mx-auto mb-3">
            <Share2 className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white">Your Partner Referral</h1>
          <p className="text-xs sm:text-sm text-gray-400">Share this link with students</p>
        </div>

        <div className="space-y-4">

          {/* PARTNER CARD */}
          <div className="bg-white/5 border border-white/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full 
                flex items-center justify-center text-white font-bold text-lg">
                {user?.fullName?.[0]?.toUpperCase()}
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">{user?.fullName}</h3>
                <p className="text-xs text-gray-400">{user?.instituteName || "Partner"}</p>
              </div>
            </div>
          </div>

          {/* ⭐ YOUR REFERRAL CODE */}
          <div className="bg-white/5 border border-orange-500/30 rounded-xl p-4">
            <label className="text-xs font-semibold text-gray-400 mb-2 block">
              Your Referral Code
            </label>

            <div className="bg-white/10 border border-white/20 rounded-lg px-3 py-3 
              font-mono text-sm text-orange-400 break-all text-center">
              {referralCode}
            </div>
          </div>

          {/* REFERRAL LINK */}
          <div className="bg-white/5 border border-orange-500/30 rounded-xl p-4">
            <label className="text-xs font-semibold text-gray-400 mb-2 block">Referral Link</label>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 sm:py-3 
                font-mono text-xs sm:text-sm text-orange-400 break-all">
                {referralLink}
              </div>

              <Button
                onClick={handleCopy}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:to-orange-700 text-white 
                  px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center gap-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-2 text-center">Share this link with students</p>
          </div>

          {/* FUTURE SUBDOMAIN */}
        

          {/* HOW TO USE */}
          <div className="bg-white/5 border border-white/20 rounded-xl p-4">
            <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-orange-400" /> How to use
            </h3>

            <ul className="space-y-1.5 text-xs text-gray-300">
              <li>1. Share the referral code & link with students</li>
              <li>2. Students signup using auto-filled referral code</li>
              <li>3. You earn commission on every purchase</li>
            </ul>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleShare}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:to-orange-700 
                text-white py-3 rounded-xl font-bold"
            >
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>

            <Button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 rounded-xl font-bold bg-white/5 border border-white/20 text-white 
                hover:bg-white/10"
            >
              Back
            </Button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-3 bg-white/5 border border-white/20 rounded-lg">
              <p className="text-xl font-bold text-white">0</p>
              <p className="text-xs text-gray-400">Referrals</p>
            </div>

            <div className="text-center p-3 bg-white/5 border border-white/20 rounded-lg">
              <p className="text-xl font-bold text-white">₹0</p>
              <p className="text-xs text-gray-400">Earnings</p>
            </div>

            <div
              onClick={() => navigate("/students-list")}
              className="text-center p-3 bg-white/5 border border-orange-500/30 rounded-lg 
                cursor-pointer hover:bg-white/10 transition-all"
            >
              <p className="text-xl font-bold text-orange-400">{studentCount}</p>
              <p className="text-xs text-gray-400">Students</p>
            </div>
          </div>

        </div>
      </Card>
    </div>
  );
};

export default Resell;
