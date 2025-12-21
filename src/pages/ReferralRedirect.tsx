import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import { useAuth } from "@/contexts/AuthContext";

export default function ReferralRedirect() {
  const { refCode } = useParams();
  const navigate = useNavigate();
  const { setReferralName } = useAuth();

  useEffect(() => {
    if (!refCode) return;

    const handleReferral = async () => {
      try {
        // ✅ Always save referral code (for signup)
        localStorage.setItem("pendingReferral", refCode);
        localStorage.setItem("referralCode", refCode);

        // 🔎 Find partner by referralCode
        const usersRef = ref(db, "users");
        const q = query(
          usersRef,
          orderByChild("referralCode"),
          equalTo(refCode)
        );

        const snapshot = await get(q);

        if (snapshot.exists()) {
          const partner = Object.values(snapshot.val())[0] as {
            fullName?: string;
          };

          if (partner?.fullName) {
            // ⭐ IMPORTANT FIX
            // Update BOTH context + localStorage (via context)
            setReferralName(partner.fullName);
          }
        }
      } catch (err) {
        console.error("Referral lookup failed:", err);
      }

      // ⏭ Redirect to signup
      setTimeout(() => {
        navigate("/signup", { replace: true });
      }, 400);
    };

    handleReferral();
  }, [refCode, navigate, setReferralName]);

  // ✅ Proper loading screen (no white flash)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mb-4"></div>
      <p className="text-sm text-gray-300">Redirecting you to signup…</p>
    </div>
  );
}
