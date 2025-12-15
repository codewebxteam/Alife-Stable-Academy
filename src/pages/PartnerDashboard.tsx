import {
  Users,
  BookOpen,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

/* ---------- Dummy Data ---------- */
const partnerData = {
  agencyName: "Elite Coders Partner Agency",
  totalStudents: 248,
  totalRevenue: 684200,
  coursesSold: 6,
  commissionRate: 20, // %
  students: [
    {
      name: "Riya Sharma",
      email: "riya@example.com",
      course: "React Mastery",
      amount: 2499,
      date: "2025-11-30",
    },
    {
      name: "Aman Singh",
      email: "aman@example.com",
      course: "Fullstack Bootcamp",
      amount: 4999,
      date: "2025-11-28",
    },
    {
      name: "Sneha Roy",
      email: "sneha@example.com",
      course: "Git & Open Source",
      amount: 999,
      date: "2025-11-22",
    },
  ],
};

/* ---------- Helpers ---------- */
const formatCurrency = (v: number) =>
  v.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

/* ---------- Reusable Stat Card ---------- */
const StatCard = ({ icon: Icon, title, value }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-4">
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  </div>
);

/* ---------- Main Component ---------- */
export default function PartnerDashboard() {
  const commissionEarned =
    (partnerData.totalRevenue * partnerData.commissionRate) / 100;

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {partnerData.agencyName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Partner Agency Dashboard
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            icon={Users}
            title="Students Sold"
            value={partnerData.totalStudents}
          />
          <StatCard
            icon={IndianRupee}
            title="Total Revenue"
            value={formatCurrency(partnerData.totalRevenue)}
          />
          <StatCard
            icon={BookOpen}
            title="Courses Sold"
            value={partnerData.coursesSold}
          />
          <StatCard
            icon={TrendingUp}
            title="Commission Rate"
            value={`${partnerData.commissionRate}%`}
          />
          <StatCard
            icon={IndianRupee}
            title="Commission Earned"
            value={formatCurrency(commissionEarned)}
          />
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">
              Students Purchased via Your Agency
            </h3>
            <span className="text-xs text-gray-500">
              Total: {partnerData.students.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-xs text-gray-500 text-left border-b">
                  <th className="px-3 py-2">Student</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Course</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {partnerData.students.map((s, i) => (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="px-3 py-2 font-medium text-gray-800">
                      {s.name}
                    </td>
                    <td className="px-3 py-2 text-gray-600">{s.email}</td>
                    <td className="px-3 py-2 text-gray-600">{s.course}</td>
                    <td className="px-3 py-2 font-semibold">
                      {formatCurrency(s.amount)}
                    </td>
                    <td className="px-3 py-2 text-gray-500">{s.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}
