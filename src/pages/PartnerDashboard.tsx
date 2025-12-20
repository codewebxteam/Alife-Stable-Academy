import { useState, useEffect } from "react";
import { ref, onValue, query, orderByChild, equalTo } from "firebase/database";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  BookOpen,
  IndianRupee,
  TrendingUp,
  X,
  Calendar,
  Clock,
  TrendingDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useGreeting } from "../hooks/useGreeting";

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
  const greeting = useGreeting();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("sales");
  const [selectedSale, setSelectedSale] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.referralCode) {
      setLoading(false);
      return;
    }

    const cleanCode = user.referralCode.replace('.alife-stable-academy.com', '');
    const referralUrl = `${cleanCode}.alife-stable-academy.com`;

    // Fetch students who signed up with this referral code
    const usersRef = ref(db, 'users');
    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const students = Object.values(data)
          .filter((u: any) => 
            u.role === 'student' && 
            (u.referralCode === cleanCode || u.referralCode === referralUrl)
          )
          .map((student: any) => ({
            name: student.fullName,
            email: student.email,
            mobile: student.mobile,
            plan: student.plan || 'N/A',
            joinedDate: 'Recently'
          }));
        setStudentsData(students);
      } else {
        setStudentsData([]);
      }
    });

    // Fetch sales data
    const salesRef = ref(db, 'sales');
    const unsubscribeSales = onValue(salesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const sales = Object.values(data)
          .filter((sale: any) => sale.partnerId === cleanCode)
          .map((sale: any) => ({
            customerName: sale.studentName,
            courseName: sale.courseName,
            amount: sale.amount || 0,
            purchaseDate: new Date(sale.purchaseDate).toLocaleDateString('en-IN'),
            expiryDate: sale.expiryDate === -1 ? 'Lifetime' : new Date(sale.expiryDate).toLocaleDateString('en-IN'),
            planDays: sale.planDays === -1 ? 'Lifetime' : `${sale.planDays} days`,
            commission: sale.commission || 0,
            status: sale.status || 'pending'
          }));
        setSalesData(sales);
      } else {
        setSalesData([]);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeSales();
    };
  }, [user]);

  const courseInsights = salesData.reduce((acc, sale) => {
    const existing = acc.find(c => c.name === sale.courseName);
    if (existing) {
      existing.sales += 1;
      existing.revenue += sale.amount;
    } else {
      acc.push({ name: sale.courseName, sales: 1, revenue: sale.amount, peakPeriod: 'Current' });
    }
    return acc;
  }, []);

  const earnings = salesData.reduce((acc, sale) => {
    acc.totalCommission += sale.commission || 0;
    if (sale.status === 'pending') {
      acc.pending += sale.commission || 0;
    } else {
      acc.cleared += sale.commission || 0;
    }
    return acc;
  }, { totalCommission: 0, pending: 0, cleared: 0, courses: courseInsights.map(c => ({
    name: c.name,
    sales: c.sales,
    commission: c.revenue * 0.2,
    status: 'pending'
  })) });

  const totalStudents = studentsData.length;
  const totalRevenue = salesData.reduce((sum, s) => sum + s.amount, 0);
  const totalCourses = new Set(salesData.map(s => s.courseName)).size;
  const commissionRate = 20;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {greeting}, Partner!
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Partner Agency Dashboard
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("sales")}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === "sales" ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-600 hover:text-gray-800"}`}
          >
            Sales
          </button>
          <button
            onClick={() => setActiveTab("insights")}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === "insights" ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-600 hover:text-gray-800"}`}
          >
            Course Insights
          </button>
          <button
            onClick={() => setActiveTab("earnings")}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === "earnings" ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-600 hover:text-gray-800"}`}
          >
            Earnings & Payments
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            icon={Users}
            title="Students Sold"
            value={totalStudents}
          />
          <StatCard
            icon={IndianRupee}
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
          />
          <StatCard
            icon={BookOpen}
            title="Courses Sold"
            value={totalCourses}
          />
          <StatCard
            icon={TrendingUp}
            title="Commission Rate"
            value={`${commissionRate}%`}
          />
          <StatCard
            icon={IndianRupee}
            title="Commission Earned"
            value={formatCurrency(earnings.totalCommission)}
          />
        </div>

        {/* Sales Tab */}
        {activeTab === "sales" && (
          <div className="space-y-6">
            {/* Students Overview */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-700">Students Overview</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">Live</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">Total: {studentsData.length}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500 text-left border-b">
                      <th className="px-3 py-2">Student Name</th>
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Mobile</th>
                      <th className="px-3 py-2">Plan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsData.length > 0 ? studentsData.map((student, i) => (
                      <tr key={i} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="px-3 py-2 font-medium text-gray-800">{student.name}</td>
                        <td className="px-3 py-2 text-gray-600">{student.email}</td>
                        <td className="px-3 py-2 text-gray-600">{student.mobile}</td>
                        <td className="px-3 py-2">
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                            {student.plan}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-3 py-8 text-center text-gray-500">
                          No students have joined with your referral code yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Course Purchases */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">Course Purchases</h3>
                <span className="text-xs text-gray-500">Total: {salesData.length}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500 text-left border-b">
                      <th className="px-3 py-2">Customer</th>
                      <th className="px-3 py-2">Course</th>
                      <th className="px-3 py-2">Amount</th>
                      <th className="px-3 py-2">Purchase Date</th>
                      <th className="px-3 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.length > 0 ? salesData.map((sale, i) => (
                      <tr key={i} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="px-3 py-2 font-medium text-gray-800">{sale.customerName}</td>
                        <td className="px-3 py-2 text-gray-600">{sale.courseName}</td>
                        <td className="px-3 py-2 font-semibold">{formatCurrency(sale.amount)}</td>
                        <td className="px-3 py-2 text-gray-500">{sale.purchaseDate}</td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() => setSelectedSale(sale)}
                            className="text-orange-600 hover:text-orange-700 text-xs font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-3 py-8 text-center text-gray-500">
                          No course purchases yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Course Insights Tab */}
        {activeTab === "insights" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Best Sellers Overview</h3>
              <div className="space-y-3">
                {courseInsights.length > 0 ? courseInsights.map((course, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedCourse(course)}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${course.sales > 50 ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <BookOpen className={`h-5 w-5 ${course.sales > 50 ? 'text-green-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{course.name}</p>
                        <p className="text-xs text-gray-500">{course.sales} sales</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {course.sales > 50 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm font-semibold text-gray-700">{formatCurrency(course.revenue)}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-gray-500 py-8">No course data available yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === "earnings" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <IndianRupee className="h-5 w-5 text-blue-600" />
                  <p className="text-sm text-gray-600">Total Commission</p>
                </div>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(earnings.totalCommission)}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(earnings.pending)}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-sm text-gray-600">Cleared</p>
                </div>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(earnings.cleared)}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Commission Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500 text-left border-b">
                      <th className="px-3 py-2">Course</th>
                      <th className="px-3 py-2">Sales</th>
                      <th className="px-3 py-2">Commission</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earnings.courses.length > 0 ? earnings.courses.map((course, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="px-3 py-2 font-medium text-gray-800">{course.name}</td>
                        <td className="px-3 py-2 text-gray-600">{course.sales}</td>
                        <td className="px-3 py-2 font-semibold">{formatCurrency(course.commission)}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.status === 'cleared' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {course.status === 'cleared' ? 'Cleared' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-3 py-8 text-center text-gray-500">
                          No commission data available yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Sale Details Popup */}
        {selectedSale && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Sale Details</h3>
                <button onClick={() => setSelectedSale(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Customer Name</p>
                  <p className="font-semibold text-gray-800">{selectedSale.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Course</p>
                  <p className="font-semibold text-gray-800">{selectedSale.courseName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payment Amount</p>
                    <p className="font-bold text-green-600">{formatCurrency(selectedSale.amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Plan Duration</p>
                    <p className="font-semibold text-gray-800">{selectedSale.planDays} days</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Purchase Date</p>
                      <p className="text-sm font-medium text-gray-800">{selectedSale.purchaseDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Expiry Date</p>
                      <p className="text-sm font-medium text-gray-800">{selectedSale.expiryDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Course Details Popup */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Course Analytics</h3>
                <button onClick={() => setSelectedCourse(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Course Name</p>
                  <p className="font-semibold text-gray-800 text-lg">{selectedCourse.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-xs text-blue-600 mb-1">Total Sales</p>
                    <p className="text-2xl font-bold text-blue-700">{selectedCourse.sales}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-xs text-green-600 mb-1">Revenue</p>
                    <p className="text-2xl font-bold text-green-700">{formatCurrency(selectedCourse.revenue)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Peak Sales Period</p>
                  <p className="font-medium text-gray-800">{selectedCourse.peakPeriod || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Trend</p>
                  <div className="flex items-center gap-2">
                    {selectedCourse.sales > 50 ? (
                      <>
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span className="text-green-600 font-medium">High Demand</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600 font-medium">Low Demand</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
