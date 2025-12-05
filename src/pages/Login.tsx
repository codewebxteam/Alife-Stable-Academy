import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, Eye, EyeOff, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userRole = await login(email, password);
      toast.success('Login successful!');
      
      if (userRole === 'partner') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.code === 'auth/invalid-credential' 
        ? 'Invalid email or password'
        : error.code === 'auth/user-not-found'
        ? 'No account found with this email'
        : error.code === 'auth/wrong-password'
        ? 'Incorrect password'
        : error.message || 'Login failed';
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
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-white">Welcome Back</h1>
            <p className="text-sm sm:text-base text-gray-400">Sign in to continue your journey</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
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
                placeholder="Password"
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

            <div className="text-right">
              <NavLink to="/forgot-password" className="text-sm text-orange-500 hover:text-orange-400 font-medium transition-colors">
                Forgot Password?
              </NavLink>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#0D1B2A] hover:bg-[#1B263B] border border-white/20 text-white font-bold rounded-xl hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login Now'}
              {!loading && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm">
            Don't have an account?{" "}
            <NavLink to="/signup" className="text-orange-500 font-bold hover:text-orange-400 transition-colors">
              Sign Up
            </NavLink>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
