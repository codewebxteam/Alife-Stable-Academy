import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  X,
  Crown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"partner" | "student">("student");

  const [fullName, setFullName] = useState("");
  const [instituteName, setInstituteName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (role === "partner" && !plan) {
      toast.error("Please select a plan");
      return;
    }
    
    setLoading(true);

    try {
      const signupData = {
        email,
        password,
        role,
        fullName,
        mobile,
        ...(role === "partner" && { instituteName }),
        ...(role === "partner" && plan && { plan }),
        ...(role === "student" &&
          referralCode && {
            referralCode: referralCode.toLowerCase().includes(
              ".alife-stable-academy.com"
            )
              ? referralCode.toLowerCase()
              : `${referralCode.toLowerCase()}.alife-stable-academy.com`,
          }),
      };

      await signup(signupData);
      toast.success("Account created successfully!");
      navigate(role === "partner" ? "/dashboard" : "/");
    } catch (error: any) {
      toast.error(
        error.code === "auth/email-already-in-use"
          ? "Email already registered"
          : error.code === "auth/weak-password"
          ? "Password should be at least 6 characters"
          : error.code === "auth/invalid-email"
          ? "Invalid email address"
          : "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm min-h-screen">
      <Card className="relative w-full max-w-md bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] border border-orange-500/30 rounded-3xl shadow-2xl">
        <NavLink
          to="/"
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
        >
          <X className="h-5 w-5" />
        </NavLink>

        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-white">
              {role === "partner" ? "Partner Signup" : "Create Account"}
            </h1>
            <p className="text-gray-400">
              Join us and start your journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Full name"
                className="pl-12 h-14 bg-white/5 border border-white/20 text-white rounded-xl"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {/* Institute Name */}
            {role === "partner" && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Institute name"
                  className="pl-12 h-14 bg-white/5 border border-white/20 text-white rounded-xl"
                  value={instituteName}
                  onChange={(e) => setInstituteName(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Mobile */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                +91
              </span>
              <Input
                placeholder="Mobile number"
                className="pl-16 h-14 bg-white/5 border border-white/20 text-white rounded-xl"
                value={mobile}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 10) setMobile(value);
                }}
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="email"
                placeholder="Email address"
                className="pl-12 h-14 bg-white/5 border border-white/20 text-white rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                className="pl-12 pr-12 h-14 bg-white/5 border border-white/20 text-white rounded-xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Plan Selection - Partner Only */}
            {role === "partner" && (
              <div className="relative">
                <Crown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                <Select value={plan} onValueChange={setPlan} required>
                  <SelectTrigger className="pl-12 h-14 bg-white/5 border border-white/20 text-white rounded-xl">
                    <SelectValue placeholder="Select your plan *" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1B263B] border border-white/20 text-white">
                    <SelectItem value="starter" className="hover:bg-white/10">Starter</SelectItem>
                    <SelectItem value="supreme-master" className="hover:bg-white/10">Supreme Master</SelectItem>
                    <SelectItem value="premium-elite" className="hover:bg-white/10">Premium Elite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Referral */}
            {role === "student" && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Referral code (optional)"
                  className="pl-12 h-14 bg-white/5 border border-white/20 text-white rounded-xl"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                />
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold rounded-xl"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </form>

          {/* Sign in */}
          <p className="text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="text-orange-500 font-bold"
            >
              Sign In
            </NavLink>
          </p>

          {/* Signup as Partner BELOW signin */}
          {role === "student" && (
            <div className="text-center">
              <button
                onClick={() => {
                  setRole("partner");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-orange-400 font-bold underline underline-offset-4 hover:text-orange-300"
              >
                Signup as a Partner
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Signup;
