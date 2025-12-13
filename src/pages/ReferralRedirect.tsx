import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";

export default function ReferralRedirect() {
  const { refCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleReferral = async () => {
      if (!refCode) return;

      console.log("➡️ Referral detected:", refCode);

      // Check if referral belongs to a partner
      const usersRef = ref(db, "users");
      const q = query(usersRef, orderByChild("referralCode"), equalTo(refCode));
      const snapshot = await get(q);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const partner = Object.values(data)[0] as { fullName: string };

        console.log("🔥 Referral belongs to:", partner.fullName);

        // Save partner name
        localStorage.setItem("ref_by_name", partner.fullName);
      } else {
        console.log("⚠️ No partner found for referral:", refCode);
      }

      // Always save referral code
      localStorage.setItem("pendingReferral", refCode);

      console.log("📌 pendingReferral saved:", refCode);

      // Delay to ensure storage completes before redirect
      setTimeout(() => navigate("/signup"), 300);
    };

    handleReferral();
  }, [refCode, navigate]);

  return null;
}
