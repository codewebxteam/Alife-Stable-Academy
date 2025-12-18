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
    referralCode: "",
  });


  useEffect(() => {
    const ref = localStorage.getItem("pendingReferral");
    if (ref) {
      setForm((prev) => ({
        ...prev,
        referralCode: ref,
      }));
    }
  }, []);

  // ✅ Proper typing
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await signup(form);

    // clear referral after use
    localStorage.removeItem("pendingReferral");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input
        type="text"
        placeholder="Full Name"
        value={form.fullName}
        onChange={(e) =>
          setForm((p) => ({ ...p, fullName: e.target.value }))
        }
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm((p) => ({ ...p, email: e.target.value }))
        }
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="text"
        placeholder="Mobile"
        value={form.mobile}
        onChange={(e) =>
          setForm((p) => ({ ...p, mobile: e.target.value }))
        }
        className="w-full border p-2 rounded"
        required
      />

      {/* ✅ Referral (readonly) */}
      <input
        type="text"
        placeholder="Referral Code"
        value={form.referralCode || ""}
        readOnly
        className="w-full border p-2 rounded bg-gray-100"
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) =>
          setForm((p) => ({ ...p, password: e.target.value }))
        }
        className="w-full border p-2 rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-orange-600 text-white py-2 rounded"
      >
        Signup
      </button>
    </form>
  );
};

export default Signup;
