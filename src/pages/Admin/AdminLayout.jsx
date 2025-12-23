 import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, TrendingUp, GraduationCap, BookOpen, 
  Settings, LogOut, Bell, Search, ShieldCheck, CreditCard 
} from "lucide-react";
import { motion } from "framer-motion";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Intelligence", path: "/Admin", icon: <LayoutDashboard size={20} /> },
    { label: "Sales", path: "/Admin/sales", icon: <TrendingUp size={20} /> },
    // ✨ NEW: Payments Option Added
    { label: "Payments", path: "/Admin/payments", icon: <CreditCard size={20} /> },
    { label: "Courses", path: "/Admin/courses", icon: <GraduationCap size={20} /> },
    { label: "E-Books", path: "/Admin/ebooks", icon: <BookOpen size={20} /> },
    { label: "Settings", path: "/Admin/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] font-sans">
      <aside className="hidden lg:flex flex-col w-[280px] bg-white border-r border-slate-200 sticky top-0 h-screen z-50">
        <div className="p-8 flex items-center gap-3">
          <div className="size-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tighter uppercase block leading-none">
              Admin <span className="text-indigo-600 font-medium">Pro</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Control Center</span>
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
                  isActive ? "bg-slate-950 text-white shadow-2xl shadow-slate-400" : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                <span className={isActive ? "text-indigo-400" : ""}>{item.icon}</span>
                <span className="text-sm font-black uppercase tracking-tight">{item.label}</span>
                {isActive && <div className="ml-auto size-2 bg-indigo-400 rounded-full animate-pulse" />}
              </button>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all">
            <LogOut size={18} /> <span>Exit Console</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 lg:h-24 bg-[#F4F7FE]/80 backdrop-blur-xl sticky top-0 z-40 px-6 lg:px-10 flex items-center justify-between">
          <div className="hidden lg:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Superuser / <span className="text-slate-900">Console</span></p>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase tracking-tighter">Finance Hub</h2>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-[24px] shadow-sm border border-slate-100">
             <button className="p-3 text-slate-400 hover:text-slate-950"><Bell size={20} /></button>
             <div className="size-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black border-4 border-slate-100 shadow-xl">AD</div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;