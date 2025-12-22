import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  PlayCircle,
  BarChart2,
  ShoppingCart,
  LogOut,
  X,
  GraduationCap,
  Award, // New Icon for Certificates
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: PlayCircle, label: "My Learning", path: "/dashboard/my-courses" },
    { icon: BookOpen, label: "E-Book Library", path: "/dashboard/ebooks" },
    { icon: Award, label: "Certificates", path: "/dashboard/certificates" }, // [NEW]
    { icon: BarChart2, label: "Progress Report", path: "/dashboard/progress" },
    {
      icon: ShoppingCart,
      label: "Explore Courses",
      path: "/dashboard/explore",
    },
  ];

  const SidebarContent = (
    <div className="h-full flex flex-col bg-slate-900 text-white border-r border-slate-800 relative">
      {/* 1. BRANDING AREA */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3 text-[#5edff4]">
          <div className="p-2 bg-[#5edff4]/10 rounded-xl">
            <GraduationCap className="size-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-wide text-white leading-none">
              Alife Stable
            </span>
            <span className="text-[10px] font-bold text-[#5edff4] tracking-widest uppercase">
              Academy
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="ml-auto lg:hidden text-slate-400 hover:text-white"
        >
          <X className="size-6" />
        </button>
      </div>

      {/* 2. MENU ITEMS */}
      <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-4 mb-4">
          Menu
        </div>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => window.innerWidth < 1024 && onClose()}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? "bg-[#5edff4] text-slate-900 font-bold shadow-[0_0_20px_rgba(94,223,244,0.3)]"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <item.icon className="size-5 relative z-10" />
            <span className="relative z-10">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* 3. LOGOUT BUTTON */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium"
        >
          <LogOut className="size-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* 4. LOGOUT CONFIRMATION POPUP (Overlay) */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-x-4 bottom-20 bg-slate-800 border border-slate-700 p-4 rounded-2xl shadow-2xl z-50"
          >
            <div className="flex items-center gap-3 mb-3 text-white">
              <div className="p-2 bg-red-500/20 rounded-full text-red-500">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Are you sure?</h4>
                <p className="text-xs text-slate-400">
                  You will be logged out.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 bg-slate-700 text-white text-xs font-bold rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
              >
                Yes, Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-72 shrink-0 h-screen sticky top-0 z-40">
        {SidebarContent}
      </div>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 z-[60] lg:hidden shadow-2xl"
            >
              {SidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
