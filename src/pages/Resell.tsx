import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Copy, Check, Share2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { ref, onValue, query, orderByChild, equalTo } from "firebase/database";
import { db } from "@/lib/firebase";

const Resell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    if (!user || user.role !== 'partner') {
      navigate('/');
      return;
    }

    const name = user.fullName?.toLowerCase().replace(/\s+/g, '') || 
                 user.email?.split('@')[0].toLowerCase();
    const fullSubdomain = `${name}.alife-stable-academy.com`;
    setReferralCode(name);

    // Listen to real-time student count
    const usersRef = ref(db, 'users');
    const studentsQuery = query(usersRef, orderByChild('referralCode'), equalTo(fullSubdomain));
    
    const unsubscribe = onValue(studentsQuery, (snapshot) => {
      let count = 0;
      snapshot.forEach(() => {
        count++;
      });
      setStudentCount(count);
    });

    return () => unsubscribe();
  }, [user, navigate]);

  const handleCopy = () => {
    const subdomain = `${referralCode}.alife-stable-academy.com`;
    navigator.clipboard.writeText(subdomain);
    setCopied(true);
    toast.success("Subdomain copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const subdomain = `${referralCode}.alife-stable-academy.com`;
    const message = `Join alife-stable-academy using my link: ${subdomain}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'alife-stable-academy Partner Link',
          text: message,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-300 min-h-screen overflow-y-auto">
      <Card className="relative w-full max-w-md bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] border border-orange-500/30 rounded-xl sm:rounded-2xl shadow-2xl shadow-orange-500/20 backdrop-blur-xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 p-4 sm:p-6 my-4">
        <div className="text-center mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
            <Share2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Your Partner Referral</h1>
          <p className="text-xs sm:text-sm text-gray-400">Share this code with students</p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* Partner Info */}
          <div className="bg-white/5 border border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg">
                {user?.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">{user?.fullName}</h3>
                <p className="text-xs text-gray-400">{user?.instituteName || 'Partner'}</p>
              </div>
            </div>
          </div>

          {/* Referral Code Display */}
          <div className="bg-white/5 border border-orange-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <label className="text-xs font-semibold text-gray-400 mb-2 block">Your Subdomain</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2 py-2 sm:px-3 sm:py-3 font-mono text-xs sm:text-sm font-bold text-orange-400 text-center break-all">
                {referralCode}.alife-stable-academy.com
              </div>
              <Button
                onClick={handleCopy}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg flex items-center gap-2 transition-all"
              >
                {copied ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : <Copy className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Share this link with students</p>
          </div>

          {/* Instructions */}
          <div className="bg-white/5 border border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <h3 className="font-bold text-white text-xs sm:text-sm mb-2 flex items-center gap-2">
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />
              How to use
            </h3>
            <ul className="space-y-1.5 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">1.</span>
                <span>Share code with students</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">2.</span>
                <span>Students enter during signup</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">3.</span>
                <span>Earn commission on purchases</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <Button
              onClick={handleShare}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/40"
            >
              <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Share
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold bg-white/5 border border-white/20 text-white hover:bg-white/10 transition-all text-xs sm:text-sm"
            >
              Back
            </Button>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 sm:p-3 bg-white/5 border border-white/20 rounded-lg">
              <p className="text-lg sm:text-xl font-bold text-white">0</p>
              <p className="text-xs text-gray-400">Referrals</p>
            </div>
            <div className="text-center p-2 sm:p-3 bg-white/5 border border-white/20 rounded-lg">
              <p className="text-lg sm:text-xl font-bold text-white">₹0</p>
              <p className="text-xs text-gray-400">Earnings</p>
            </div>
            <div 
              onClick={() => navigate('/students-list')}
              className="text-center p-2 sm:p-3 bg-white/5 border border-orange-500/30 rounded-lg cursor-pointer hover:bg-white/10 transition-all hover:scale-105"
            >
              <p className="text-lg sm:text-xl font-bold text-orange-400">{studentCount}</p>
              <p className="text-xs text-gray-400">Students</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Resell;
