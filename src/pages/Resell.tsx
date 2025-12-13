import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Copy, Check, Share2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { ref, onValue, query, orderByChild, equalTo } from "firebase/database";
import { db } from "@/lib/firebase";
import { APP_BASE_URL, REFERRAL_PATH } from "@/config/appConfig";

const Resell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    if (!user || user.role !== "partner") {
      navigate("/");
      return;
    }

    if (!user.referralCode) {
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
      setStudentCount(Object.keys(snapshot.val()).length);
    });

    return () => unsubscribe();
  }, [user, navigate]);

  // ✅ CONFIG-DRIVEN (ONLY appConfig.js controls domain)
  const referralLink = `${APP_BASE_URL}${REFERRAL_PATH}/${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = async () => {
    const message = `Join Alife Stable Academy using my referral link: ${referralLink}`;

    if (navigator.share) {
      await navigator.share({
        title: "Partner Referral",
        text: message,
      });
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 backdrop-blur-sm p-4 sm:p-6">
      <Card className="w-full max-w-md bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] border border-orange-500/30 rounded-2xl shadow-2xl p-4 sm:p-6 my-6">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Share2 className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Partner Referral
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Share & earn commissions
          </p>
        </div>

        {/* Referral Code */}
        <div className="bg-white/5 border border-orange-500/30 rounded-xl p-3 sm:p-4 mb-4">
          <label className="text-xs font-semibold text-gray-400 mb-2 block">
            Your Referral Code
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 font-mono text-sm text-orange-400 text-center">
              {referralCode}
            </div>
            <Button onClick={handleCopyCode}>
              {copiedCode ? <Check size={16} /> : <Copy size={16} />}
            </Button>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-white/5 border border-orange-500/30 rounded-xl p-3 sm:p-4 mb-4">
          <label className="text-xs font-semibold text-gray-400 mb-2 block">
            Your Referral Link
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 font-mono text-xs text-orange-400 break-all text-center">
              {referralLink}
            </div>
            <Button onClick={handleCopyLink}>
              {copiedLink ? <Check size={16} /> : <Copy size={16} />}
            </Button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleShare} className="flex-1">
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Back
          </Button>
        </div>

      </Card>
    </div>
  );
};

export default Resell;
