import { useState, useRef, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  Users,
  Bell,
  MessageCircle,
  User,
  Award,
  LogOut,
  ChevronRight,
  ChevronDown,
  Menu,
  GraduationCap,
  X,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSocialMenu, setShowSocialMenu] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "Courses", path: "/dashboard/courses" },
    { icon: ShoppingBag, label: "Additional Purchases", path: "/dashboard/purchases" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Right Sidebar Overlay */}
      {showRightSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowRightSidebar(false)}
        />
      )}

      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Menu Button (Mobile Only) */}
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-800 text-lg">alife-stable-academy</span>
          </NavLink>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            <NavLink to="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Home</NavLink>
            <NavLink to="/courses" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Courses</NavLink>
            <NavLink to="/books" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Books</NavLink>
            <NavLink to="/study-material" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Study Material</NavLink>
            <NavLink to="/blogs" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Blogs</NavLink>
          </nav>

          {/* Right: Desktop Icons & User Menu */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative" ref={dropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className="flex items-center gap-3 hover:bg-gray-50 rounded-full px-3 py-2 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                {user?.email?.[0].toUpperCase() || "U"}
              </div>
              <span className="font-medium text-gray-700">
                {user?.email?.split("@")[0] || "User"}
              </span>
            </button>

            {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-[100]">
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
                </div>
              )}
            </div>
          </div>

          {/* Right: Menu Button for Right Sidebar (Mobile/Tablet) */}
          <button
            onClick={() => setShowRightSidebar(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className={`fixed lg:static w-64 bg-white border-r border-gray-200 h-full flex flex-col z-40 transition-transform duration-300 lg:translate-x-0 ${
          showMobileSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-6 lg:hidden">
            <h2 className="text-2xl font-bold text-gray-800">alife-stable-academy</h2>
          </div>
        <nav className="px-4 space-y-2 flex-1">
          {sidebarItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
          
          {/* Social Connect with Dropdown */}
          <div>
            <button
              onClick={() => setShowSocialMenu(!showSocialMenu)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5" />
                <span className="font-medium">Social Connect</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${showSocialMenu ? 'rotate-180' : ''}`} />
            </button>
            {showSocialMenu && (
              <div className="ml-4 mt-2 space-y-1">
                <NavLink to="/social/newsfeed" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                  Newsfeed
                </NavLink>
                <NavLink to="/social/chat" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                  Chat
                </NavLink>
              </div>
            )}
          </div>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Right Sidebar */}
      <aside className={`fixed right-0 top-0 w-80 bg-white border-l border-gray-200 h-full flex flex-col z-50 transition-transform duration-300 shadow-2xl ${
        showRightSidebar ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Menu</h2>
          <button
            onClick={() => setShowRightSidebar(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-2 flex-1 overflow-y-auto">
          {/* Page Links */}
          <div className="mb-4 pb-4 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2 px-4">Pages</p>
            <NavLink to="/" onClick={() => setShowRightSidebar(false)} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              Home
            </NavLink>
            <NavLink to="/courses" onClick={() => setShowRightSidebar(false)} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              Courses
            </NavLink>
            <NavLink to="/books" onClick={() => setShowRightSidebar(false)} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              Books
            </NavLink>
            <NavLink to="/study-material" onClick={() => setShowRightSidebar(false)} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              Study Material
            </NavLink>
            <NavLink to="/blogs" onClick={() => setShowRightSidebar(false)} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              Blogs
            </NavLink>
          </div>

          {/* Dashboard Links */}
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2 px-4">Dashboard</p>
          {sidebarItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              onClick={() => setShowRightSidebar(false)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
          
          {/* Social Connect with Dropdown */}
          <div>
            <button
              onClick={() => setShowSocialMenu(!showSocialMenu)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5" />
                <span className="font-medium">Social Connect</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${showSocialMenu ? 'rotate-180' : ''}`} />
            </button>
            {showSocialMenu && (
              <div className="ml-4 mt-2 space-y-1">
                <NavLink 
                  to="/social/newsfeed" 
                  onClick={() => setShowRightSidebar(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Newsfeed
                </NavLink>
                <NavLink 
                  to="/social/chat" 
                  onClick={() => setShowRightSidebar(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Chat
                </NavLink>
              </div>
            )}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
              {user?.email?.[0].toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">
                {user?.email?.split("@")[0] || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 text-sm">
              <MessageCircle className="h-4 w-4" />
              <span>Messages</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 text-sm">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
              <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 text-sm">
              <User className="h-4 w-4" />
              <span>My Profile</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 text-sm">
              <Award className="h-4 w-4" />
              <span>Certificates</span>
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-red-600 hover:bg-red-50 mt-3 text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default DashboardLayout;
