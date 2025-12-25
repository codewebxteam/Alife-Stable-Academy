import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  GraduationCap,
  BookOpen,
  Settings,
  LogOut,
  Bell,
  Search,
  ShieldCheck,
  CreditCard,
  Menu,
  X,
  Command,
  Users,
  Briefcase,
  AlertCircle,
  Upload
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // ✨ State for Logout Modal

  // Modern Navigation Config
  const navItems = [
    {
      label: "Intelligence",
      path: "/Admin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Partners",
      path: "/Admin/partners",
      icon: <Briefcase size={20} />,
    }, // ✨ Added Partners Tab
    { label: "Students", path: "/Admin/students", icon: <Users size={20} /> }, // ✨ Added Students Tab
    { label: "Sales", path: "/Admin/sales", icon: <TrendingUp size={20} /> },
    {
      label: "Payments",
      path: "/Admin/payments",
      icon: <CreditCard size={20} />,
    },
    {
      label: "Courses",
      path: "/Admin/courses",
      icon: <GraduationCap size={20} />,
    },
    { label: "E-Books", path: "/Admin/ebooks", icon: <BookOpen size={20} /> },
    { label: "Bunny CDN", path: "/Admin/bunny", icon: <Upload size={20} /> },
    {
      label: "Settings",
      path: "/Admin/settings",
      icon: <Settings size={20} />,
    },
  ];

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // ✨ Handle Logout Trigger
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Perform any logout logic here (e.g., clearing tokens)
    setShowLogoutConfirm(false);
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] font-sans selection:bg-indigo-500/10">
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-[280px] bg-white border-r border-slate-200 sticky top-0 h-screen z-50">
        <div className="p-8 flex items-center gap-3">
          <div className="size-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tighter uppercase block leading-none">
              Admin <span className="text-indigo-600 font-medium">Pro</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Control Center
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all relative group ${
                  isActive
                    ? "bg-slate-950 text-white shadow-2xl shadow-slate-400"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span
                  className={
                    isActive ? "text-indigo-400" : "group-hover:text-indigo-600"
                  }
                >
                  {item.icon}
                </span>
                <span className="text-sm font-black uppercase tracking-tight">
                  {item.label}
                </span>
                {isActive && (
                  <div className="ml-auto size-2 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-slate-50">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <LogOut size={18} /> <span>Exit Console</span>
          </button>
        </div>
      </aside>

      {/* 2. MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white z-[101] lg:hidden flex flex-col p-6"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-lg font-black uppercase">
                    Admin Pro
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-slate-50 rounded-xl text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all ${
                      location.pathname === item.path
                        ? "bg-slate-950 text-white shadow-lg"
                        : "text-slate-400"
                    }`}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </nav>

              <button
                onClick={handleLogoutClick}
                className="mt-auto w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 font-black text-[11px] uppercase tracking-widest bg-red-50"
              >
                <LogOut size={18} /> <span>Terminate</span>
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 lg:h-24 bg-[#F4F7FE]/80 backdrop-blur-xl sticky top-0 z-40 px-4 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-3 bg-white border border-slate-200 text-slate-900 rounded-2xl shadow-sm"
            >
              <Menu size={20} />
            </button>

            <div className="hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                Superuser / <span className="text-slate-900">Console</span>
              </p>
              <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight uppercase tracking-tighter leading-none">
                Intelligence Hub
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 bg-white p-1.5 sm:p-2 rounded-[24px] shadow-sm border border-slate-100">
            <div className="hidden md:flex items-center gap-3 bg-[#F4F7FE] px-5 py-2.5 rounded-2xl border border-slate-100">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-[11px] font-bold text-slate-700 w-32"
              />
            </div>

            <button className="p-2 sm:p-3 text-slate-400 hover:text-slate-950 transition-all">
              <Bell size={20} />
            </button>

            <div className="size-9 sm:size-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black border-2 sm:border-4 border-slate-100 shadow-xl text-xs sm:text-sm">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* ✨ 4. LOGOUT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative z-10 border border-slate-100 text-center"
            >
              <div className="size-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                Exit Superuser Console?
              </h3>
              <p className="text-sm text-slate-500 font-medium mb-8">
                Are you sure you want to log out from the Admin Panel? You will
                need to re-authenticate to gain control again.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={confirmLogout}
                  className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-100"
                >
                  Confirm Exit
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
                >
                  Stay Active
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;
