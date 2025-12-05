import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'partner' | 'student'>('student');
  const [fullName, setFullName] = useState('');
  const [instituteName, setInstituteName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signup({
        email,
        password,
        role,
        fullName,
        mobile,
        ...(role === 'partner' && { instituteName })
      });
      
      toast.success('Account created successfully!');
      
      if (role === 'partner') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = error.code === 'auth/email-already-in-use'
        ? 'Email already registered'
        : error.code === 'auth/weak-password'
        ? 'Password should be at least 6 characters'
        : error.code === 'auth/invalid-email'
        ? 'Invalid email address'
        : error.message || 'Signup failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-300 min-h-screen">
      <Card className="relative w-full max-w-md bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] border border-orange-500/30 rounded-2xl sm:rounded-3xl shadow-2xl shadow-orange-500/20 backdrop-blur-xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        <NavLink to="/" className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all z-10">
          <X className="h-5 w-5" />
        </NavLink>

        <div className="p-6 sm:p-8 md:p-10 space-y-5 sm:space-y-6">
          <div className="text-center space-y-1 sm:space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-white">Create Account</h1>
            <p className="text-sm sm:text-base text-gray-400">Join us and start your journey</p>
          </div>

          <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 h-12 rounded-xl transition-all ${
                  role === 'student'
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/20'
                }`}
              >
                Student
              </Button>
              <Button
                type="button"
                onClick={() => setRole('partner')}
                className={`flex-1 h-12 rounded-xl transition-all ${
                  role === 'partner'
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/20'
                }`}
              >
                Partner
              </Button>
            </div>

            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-orange-500 transition-colors" />
              <Input
                type="text"
                placeholder="Full name"
                className="pl-12 h-14 bg-white/5 border border-white/20 text-white placeholder:text-gray-500 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 focus:bg-white/10 transition-all"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {role === 'partner' && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-orange-500 transition-colors" />
                <Input
                  type="text"
                  placeholder="Institute name"
                  className="pl-12 h-14 bg-white/5 border border-white/20 text-white placeholder:text-gray-500 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 focus:bg-white/10 transition-all"
                  value={instituteName}
                  onChange={(e) => setInstituteName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">+91</span>
              <Input
                type="tel"
                placeholder="Mobile number"
                className="pl-16 h-14 bg-white/5 border border-white/20 text-white placeholder:text-gray-500 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 focus:bg-white/10 transition-all"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-orange-500 transition-colors" />
              <Input
                type="email"
                placeholder="Email address"
                className="pl-12 h-14 bg-white/5 border border-white/20 text-white placeholder:text-gray-500 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 focus:bg-white/10 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-orange-500 transition-colors" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                className="pl-12 pr-12 h-14 bg-white/5 border border-white/20 text-white placeholder:text-gray-500 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 focus:bg-white/10 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-[#FF7A2B] to-[#FF9E4A] hover:from-[#FF9E4A] hover:to-[#FF7A2B] text-white font-bold rounded-xl hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <NavLink to="/login" className="text-orange-500 font-bold hover:text-orange-400 transition-colors">
              Sign In
            </NavLink>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
