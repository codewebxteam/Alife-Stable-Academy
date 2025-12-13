import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";

export default function ReferralRedirect() {
  const { refCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!refCode) return;

    const handleReferral = async () => {
      // Always save referral code
      localStorage.setItem("pendingReferral", refCode);

      try {
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
            localStorage.setItem("ref_by_name", partner.fullName);
          }
        }
      } catch (err) {
        console.error("Referral lookup failed", err);
      }

      // Small delay for smooth UX
      setTimeout(() => {
        navigate("/signup", { replace: true });
      }, 500);
    };

    handleReferral();
  }, [refCode, navigate]);

  // ✅ LOADING UI (NO MORE WHITE SCREEN)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mb-4"></div>
      <p className="text-sm text-gray-300">
        Redirecting you to signup…
      </p>
    </div>
  );
}
