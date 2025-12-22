import React from "react";
import { TrendingUp, Users, Wallet } from "lucide-react";

const CommissionStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Earnings */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-green-50 rounded-xl">
            <Wallet className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Your Profit</p>
            <h3 className="text-2xl font-bold text-slate-900">
              ₹{stats.totalProfit}
            </h3>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Total commission earned from markups
        </p>
      </div>

      {/* Course Sales */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <TrendingUp className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Sales</p>
            <h3 className="text-2xl font-bold text-slate-900">
              {stats.salesCount}
            </h3>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Number of students joined through your link
        </p>
      </div>

      {/* Payout Status */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-purple-50 rounded-xl">
            <Users className="text-purple-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Next Payout</p>
            <h3 className="text-2xl font-bold text-slate-900">
              ₹{stats.pendingPayout}
            </h3>
          </div>
        </div>
        <p className="text-xs text-orange-500 font-bold uppercase tracking-wider">
          Processing...
        </p>
      </div>
    </div>
  );
};

export default CommissionStats;
