import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { SignupData } from "@/contexts/AuthContext";

const Signup = () => {
  const { signup } = useAuth();

  const [form, setForm] = useState<SignupData>({
    fullName: "",
    email: "",
    password: "",
    mobile: "",
    role: "student",
    instituteName: "",
    referralCode: "",
  });

  // 🔥 Load referral reliably (multi-check fix)
  useEffect(() => {
    function loadReferral() {
      const ref = localStorage.getItem("pendingReferral");

      console.log("➡️ Checking referral:", ref);

      if (ref && ref !== form.referralCode) {
        setForm((prev) => ({
          ...prev,
          referralCode: ref,
        }));
      }
    }

    // Run immediately
    loadReferral();

    // Run again after redirect settles
    setTimeout(loadReferral, 200);
    setTimeout(loadReferral, 500);
  }, []);

  // Submit handler
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    console.log("➡️ SUBMITTING with REFERRAL:", form.referralCode);

    await signup(form);

    // Clear referral once used
    localStorage.removeItem("pendingReferral");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input
        type="text"
        placeholder="Full Name"
        value={form.fullName}
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Mobile"
        value={form.mobile}
        onChange={(e) => setForm({ ...form, mobile: e.target.value })}
        className="w-full border p-2 rounded"
      />

      {/* ⭐ Auto-filled Referral Code */}
      <input
        type="text"
        placeholder="Referral Code"
        value={form.referralCode}
        readOnly
        className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        className="w-full bg-orange-600 text-white py-2 rounded mt-2"
      >
        Signup
      </button>
    </form>
  );
};

export default Signup;
