import { useState, useEffect, useRef } from "react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Menu, X, GraduationCap, LogOut, User, ShoppingBag, Award, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsMobileMenuOpen(false);
    };

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  // ✅ ONLY CHANGE: referralName from context
  const { user, isAuthenticated, logout, referralName } = useAuth();

  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  // Logout (NO hard reload)
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/courses", label: "Courses" },
    { to: "/books", label: "Books" },
    { to: "/study-material", label: "Study Material" },
    { to: "/blogs", label: "Blogs" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b"
          : "bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* ✅ LOGO — NOW REACTIVE */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-orange flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>

            <span className="font-display text-2xl font-black text-[#0B1A2A]">
              {referralName
                ? `${referralName} Academy`
                : "alife-stable-academy"}
            </span>
          </NavLink>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
                activeClassName="text-primary"
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden xl:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-orange flex items-center justify-center text-white font-bold">
                    {user?.email?.[0]?.toUpperCase()}
                  </div>
                  <span className="font-semibold text-[#0B1A2A]">
                    {user?.email?.split("@")[0]}
                  </span>
                </button>

                {showDropdown && (
                  <div className={`absolute right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 ${
                    user?.role === "partner" ? "w-56" : "w-48"
                  }`}>
                    {user?.role === "partner" ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm text-gray-500">Hi,</p>
                          <p className="font-semibold text-gray-800">
                            {user?.email?.split("@")[0] || "User"}
                          </p>
                        </div>
                        <div className="py-2">
                          <button 
                            onClick={() => navigate("/dashboard")}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            <span className="text-sm">My Dashboard</span>
                          </button>
                          <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700">
                            <ShoppingBag className="h-4 w-4" />
                            <span className="text-sm">Purchase History</span>
                          </button>
                          <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700">
                            <Award className="h-4 w-4" />
                            <span className="text-sm">My Certificates</span>
                          </button>
                          <div className="border-t border-gray-100 my-2"></div>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-red-600"
                          >
                            <LogOut className="h-4 w-4" />
                            <span className="text-sm">Sign Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-red-600"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                <NavLink to="/login">
                  <Button variant="ghost">Log In</Button>
                </NavLink>
                <NavLink to="/signup">
                  <Button className="bg-gradient-orange text-white rounded-full px-6">
                    Get Started
                  </Button>
                </NavLink>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Links */}
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="block text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}

              {/* Mobile User Section */}
              {isAuthenticated ? (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-orange flex items-center justify-center text-white font-bold">
                      {user?.email?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hi,</p>
                      <p className="font-semibold text-gray-800">
                        {user?.email?.split("@")[0] || "User"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <button 
                      onClick={() => navigate("/dashboard")}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 rounded-lg"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span className="text-sm">My Dashboard</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 rounded-lg">
                      <ShoppingBag className="h-4 w-4" />
                      <span className="text-sm">Purchase History</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 rounded-lg">
                      <Award className="h-4 w-4" />
                      <span className="text-sm">My Certificates</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-red-600 rounded-lg"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full">Log In</Button>
                  </NavLink>
                  <NavLink to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="bg-gradient-orange text-white rounded-full px-6 w-full">
                      Get Started
                    </Button>
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
