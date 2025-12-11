import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Users,
  BookOpen,
  ShoppingBag,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Search,
} from "lucide-react";


const StatCard = ({ icon: Icon, title, value, sub, delta, emphasis }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 flex flex-col hover:shadow-md transform hover:-translate-y-1 transition-all">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-gray-500 truncate">{title}</p>
          {delta && (
            <div
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                delta.up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              }`}
            >
              {delta.up ? <TrendingUp className="inline h-3 w-3 mr-1" /> : <TrendingDown className="inline h-3 w-3 mr-1" />}
              {delta.value}
            </div>
          )}
        </div>
        <p className={`${emphasis ? "text-lg sm:text-2xl font-bold text-gray-900" : "text-lg sm:text-xl font-semibold text-gray-800"} mt-1 truncate`}>
          {value}
        </p>
        {sub && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{sub}</p>}
      </div>
    </div>
  </div>
);

const MiniBar = ({ percentage, label }) => (
  <div className="flex items-center gap-3">
    <div className="flex-1 bg-gray-100 rounded-full h-2.5 sm:h-3 overflow-hidden">
      <div
        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        className="h-2.5 sm:h-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
      />
    </div>
    <div className="w-12 sm:w-16 text-xs text-gray-600 text-right">{label}</div>
  </div>
);

const TableRow = ({ cols }) => (
  <tr className="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
    {cols.map((c, i) => (
      <td key={i} className="py-2 sm:py-3 px-2 sm:px-4 text-sm text-gray-700 truncate">
        {c}
      </td>
    ))}
    <td className="py-2 sm:py-3 px-2 sm:px-4 text-sm text-gray-500 text-right">
      <button className="text-orange-600 hover:underline flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
        View <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
      </button>
    </td>
  </tr>
);

export default function AdminDashboard() {
  const location = useLocation();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // mock data — replace with API calls
  const [stats, setStats] = useState({
    revenue: 1298650,
    totalStudents: 12430,
    totalPartners: 84,
    coursesResold: 372,
    studentsBought: 8421,
  });

  const [topPartners, setTopPartners] = useState([
    { name: "Partner A", partnersId: "P-001", coursesResold: 120, revenue: 458000 },
    { name: "Partner B", partnersId: "P-014", coursesResold: 95, revenue: 320400 },
    { name: "Partner C", partnersId: "P-021", coursesResold: 62, revenue: 164200 },
  ]);

  const [recentStudents, setRecentStudents] = useState([
    { name: "Riya Sharma", email: "riya@example.com", boughtOn: "2025-11-30", amount: 2499 },
    { name: "Aman Singh", email: "aman@example.com", boughtOn: "2025-11-28", amount: 4999 },
    { name: "Sneha Roy", email: "sneha@example.com", boughtOn: "2025-11-22", amount: 999 },
  ]);

  useEffect(() => {
    // placeholder for real fetches
  }, []);

  const formatCurrency = (v) =>
    Number(v).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
        {/* Header with search & quick actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">Admin Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">Overview of platform activity & revenue</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none w-full sm:w-80">
              <input
                aria-label="Search students or partners"
                placeholder="Search students, partners, courses..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-100 bg-white shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-200 text-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-md text-sm">
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 items-stretch">
          <div className="lg:col-span-2 bg-gradient-to-br from-white to-orange-50 rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Revenue Generated</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 truncate">{formatCurrency(stats.revenue)}</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-2 truncate">
                  All-time gross revenue • <span className="font-medium text-gray-700">{stats.studentsBought} students</span>
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-xs text-gray-500">Month growth</div>
                <div className="text-sm font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-full">+8.4%</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="h-20 sm:h-24 rounded-lg bg-white border border-dashed border-gray-100 flex items-center justify-center text-sm text-gray-400">
                Revenue chart placeholder
              </div>
            </div>
          </div>

          <StatCard icon={Users} title="Total Students" value={stats.totalStudents} sub={`${stats.totalStudents - 230} new in last 30 days`} />
          <StatCard icon={BookOpen} title="Courses Resold" value={stats.coursesResold} sub={`Total resold courses by partners`} />
          <StatCard icon={ShoppingBag} title="Partner Accounts" value={stats.totalPartners} sub={`${topPartners.length} active partners`} delta={{ up: true, value: "2%" }} />
        </div>

        {/* Main content: left (revenue KPi) and right (partners) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Detailed Revenue + KPIs */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Revenue Breakdown</h3>
              <div className="text-xs text-gray-500">Updated: Nov 30, 2025</div>
            </div>

            <div className="space-y-3">
              <MiniBar percentage={62} label="Direct" />
              <MiniBar percentage={24} label="Partners" />
              <MiniBar percentage={9} label="Affiliates" />
              <MiniBar percentage={5} label="Other" />
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">Students who bought</p>
                <p className="text-lg sm:text-xl font-semibold text-gray-800 mt-2">{stats.studentsBought}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">Avg. Order Value</p>
                <p className="text-lg sm:text-xl font-semibold text-gray-800 mt-2">
                  {formatCurrency(Math.round(stats.revenue / Math.max(1, stats.studentsBought)))}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">Courses resold</p>
                <p className="text-lg sm:text-xl font-semibold text-gray-800 mt-2">{stats.coursesResold}</p>
              </div>
            </div>

            <div className="mt-4 h-36 sm:h-40 rounded-lg bg-white border border-dashed border-gray-100 flex items-center justify-center text-sm text-gray-400">
              Large chart placeholder
            </div>
          </div>

          {/* Right: Top Partners & Recent Students */}
          <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 shadow-sm flex flex-col">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Top Partners</h3>
            <div className="space-y-3 mb-3 max-h-60 overflow-y-auto pr-1">
              {topPartners.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-medium flex-shrink-0">
                      {p.name?.split(" ")[0]?.[0] || "P"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.coursesResold} courses resold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">{formatCurrency(p.revenue)}</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 mt-auto">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Students</h4>
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {recentStudents.map((s, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 bg-gray-50 p-2 rounded-lg">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                      <p className="text-xs text-gray-500 truncate">{s.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(s.amount)}</p>
                      <p className="text-xs text-gray-500">{s.boughtOn}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 shadow-sm overflow-x-auto">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Partners Detail</h4>
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-xs text-gray-500 text-left">
                  <th className="px-3 py-2">Partner</th>
                  <th className="px-3 py-2">Partner ID</th>
                  <th className="px-3 py-2">Courses Resold</th>
                  <th className="px-3 py-2">Revenue</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {topPartners.map((p, i) => (
                  <TableRow key={i} cols={[p.name, p.partnersId, p.coursesResold, formatCurrency(p.revenue)]} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 shadow-sm overflow-x-auto">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Purchases</h4>
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-xs text-gray-500 text-left">
                  <th className="px-3 py-2">Student</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((s, i) => (
                  <TableRow key={i} cols={[s.name, s.email, s.boughtOn, formatCurrency(s.amount)]} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}