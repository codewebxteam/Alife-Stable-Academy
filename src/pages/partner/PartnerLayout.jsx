import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, X, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAgency } from "../../context/AgencyContext";
import AgencySidebar from "../../components/partner/AgencySidebar";

const PartnerLayout = () => {
  const { agency } = useAgency();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#fcfdfe]">
      {/* 1. DESKTOP SIDEBAR (Static & Large Screens) */}
      <aside className="w-72 bg-white border-r border-slate-100 hidden lg:block sticky top-0 h-screen overflow-y-auto">
        <AgencySidebar />
      </aside>

      {/* 2. MOBILE SIDEBAR OVERLAY (Framer Motion Animation) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-[101] lg:hidden shadow-2xl"
            >
              <div className="absolute top-4 right-4 lg:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <AgencySidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR - Mobile & Context Navigation */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[50] px-6 flex items-center justify-between lg:justify-end">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2.5 bg-slate-900 text-[#5edff4] rounded-xl shadow-lg shadow-slate-200"
          >
            <Menu size={24} />
          </button>

          {/* User & Notification Controls */}
          <div className="flex items-center gap-4">
            <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 size-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-slate-100 mx-2 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-black text-slate-900 leading-none">
                  Console Operator
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  ID: {agency.subdomain?.toUpperCase()}
                </p>
              </div>
              <div
                className="size-10 rounded-xl bg-slate-900 flex items-center justify-center text-[#5edff4] font-bold border border-slate-800"
                style={{ backgroundColor: agency.themeColor }}
              >
                {agency.agencyName[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* DYNAMIC PAGE CONTENT */}
        <main className="p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PartnerLayout;
