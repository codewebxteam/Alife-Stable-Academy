import React from "react";
import { Shield, ToggleLeft, Database, Globe } from "lucide-react";

const AdminSettings = () => (
  <div className="max-w-4xl space-y-6">
    <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
      <h3 className="text-xl font-black text-slate-900 mb-8 uppercase">Platform Configuration</h3>
      <div className="space-y-6">
        <SettingItem icon={<Shield />} label="Security Protocol" sub="Enable 2FA for all admins" />
        <SettingItem icon={<Globe />} label="Public Registration" sub="Allow new users to sign up" />
        <SettingItem icon={<Database />} label="Maintenance Mode" sub="Stop all platform operations" />
      </div>
    </div>
  </div>
);

const SettingItem = ({ icon, label, sub }) => (
  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[28px] border border-slate-100">
    <div className="flex items-center gap-4">
      <div className="size-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <div>
        <p className="text-sm font-black text-slate-900 uppercase">{label}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{sub}</p>
      </div>
    </div>
    <button className="text-slate-300 hover:text-indigo-600 transition-all">
      <ToggleLeft size={32} />
    </button>
  </div>
);

export default AdminSettings;