import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { ref, onValue, query, orderByChild, equalTo } from "firebase/database";
import { useGreeting } from "../hooks/useGreeting";
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
  DollarSign,
  IndianRupee,
  TrendingUp,
  Calendar,
  Clock,
  TrendingDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const greeting = useGreeting();

  useEffect(() => {
    if (user && user.role !== 'partner') {
      navigate('/');
    }
  }, [user, navigate]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSocialMenu, setShowSocialMenu] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileUserMenu, setShowMobileUserMenu] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileUserMenuRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({ courses: 0, score: 0, attendance: 0, lateEntries: 0 });
  const [courses, setCourses] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("sales");
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [partnerData, setPartnerData] = useState<any>(null);

  const totalStudents = studentsData.length;
  const totalRevenue = salesData.reduce((sum, s) => sum + s.amount, 0);
  const totalCourses = new Set(salesData.map(s => s.courseName)).size;
  const commissionRate = 20;
  const totalCommission = salesData.reduce((sum, s) => sum + (s.commission || 0), 0);

  const courseInsights = salesData.reduce((acc: any[], sale) => {
    const existing = acc.find(c => c.name === sale.courseName);
    if (existing) {
      existing.sales++;
      existing.revenue += sale.amount;
    } else {
      acc.push({ name: sale.courseName, sales: 1, revenue: sale.amount, peakPeriod: sale.purchaseDate });
    }
    return acc;
  }, []).sort((a, b) => b.sales - a.sales);

  const earnings = {
    totalCommission,
    pending: partnerData?.pendingCommission || 0,
    cleared: partnerData?.clearedCommission || 0,
    courses: courseInsights.map(c => ({
      name: c.name,
      sales: c.sales,
      commission: c.revenue * (commissionRate / 100),
      status: Math.random() > 0.5 ? 'cleared' : 'pending'
    }))
  };

  const formatCurrency = (v: number) =>
    v.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (mobileUserMenuRef.current && !mobileUserMenuRef.current.contains(event.target as Node)) {
        setShowMobileUserMenu(false);
      }
    };
    if (showDropdown || showMobileUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown, showMobileUserMenu]);

  useEffect(() => {
    if (!user?.referralCode || user.role !== 'partner') return;

    const cleanCode = user.referralCode.replace('.alife-stable-academy.com', '');
    const referralUrl = `${cleanCode}.alife-stable-academy.com`;

    // Fetch students and their purchases
    const usersRef = ref(db, 'users');
    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const students = Object.entries(usersData)
          .filter(([uid, u]: [string, any]) => 
            u.role === 'student' && 
            (u.referralCode === cleanCode || u.referralCode === referralUrl)
          )
          .map(([uid, student]: [string, any]) => {
            const purchases = student.purchases || {};
            const activePurchase = Object.values(purchases).find((p: any) => p.status === 'active');
            
            return {
              name: student.fullName,
              email: student.email,
              mobile: student.mobile,
              paymentAmount: activePurchase?.price || 0,
              purchaseDate: activePurchase?.purchaseDate ? new Date(activePurchase.purchaseDate).toLocaleDateString('en-IN') : 'N/A',
              expiryDate: activePurchase?.expiryDate === -1 ? 'Lifetime' : activePurchase?.expiryDate ? new Date(activePurchase.expiryDate).toLocaleDateString('en-IN') : 'N/A',
              accessDays: activePurchase?.expiryDate === -1 ? 'Lifetime' : activePurchase?.expiryDate ? Math.ceil((activePurchase.expiryDate - Date.now()) / (1000 * 60 * 60 * 24)) + ' days' : 'N/A'
            };
          });
        setStudentsData(students);
      } else {
        setStudentsData([]);
      }
    });

    // Fetch sales
    const salesRef = ref(db, 'sales');
    const unsubscribeSales = onValue(salesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const sales = Object.values(data)
          .filter((sale: any) => sale.partnerId === cleanCode)
          .map((sale: any) => ({
            customerName: sale.studentName,
            courseName: sale.courseName,
            amount: sale.amount,
            purchaseDate: new Date(sale.purchaseDate).toLocaleDateString('en-IN'),
            expiryDate: sale.expiryDate === -1 ? 'Lifetime' : new Date(sale.expiryDate).toLocaleDateString('en-IN'),
            planDays: sale.planDays === -1 ? 'Lifetime' : sale.planDays,
            commission: sale.commission,
            status: sale.status
          }));
        setSalesData(sales);
      } else {
        setSalesData([]);
      }
    });

    return () => {
      unsubscribeUsers();
      unsubscribeSales();
    };
  }, [user?.referralCode]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "Courses", path: "/dashboard/courses" },
    { icon: ShoppingBag, label: "Additional Purchases", path: "/dashboard/purchases" },
  ];

  const overviewCards = [
    { label: "Students Sold", value: totalStudents.toString(), color: "bg-blue-500", icon: Users },
    { label: "Total Revenue", value: formatCurrency(totalRevenue), color: "bg-green-500", icon: IndianRupee },
    { label: "Courses Sold", value: totalCourses.toString(), color: "bg-orange-500", icon: BookOpen },
    { label: "Commission Rate", value: `${commissionRate}%`, color: "bg-purple-500", icon: TrendingUp },
    { label: "Commission Earned", value: formatCurrency(totalCommission), color: "bg-teal-500", icon: IndianRupee },
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
          <nav className="hidden xl:flex items-center gap-6 flex-1 justify-center">
            <NavLink to="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">Home</NavLink>
            <NavLink to="/courses" className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">Courses</NavLink>
            <NavLink to="/books" className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">Books</NavLink>
            <NavLink to="/study-material" className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">Study Material</NavLink>
            <NavLink to="/blogs" className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">Blogs</NavLink>
          </nav>

          {/* Right: Desktop Icons & User Menu */}
          <div className="hidden xl:flex items-center gap-4">
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

          {/* Right: User Avatar (Mobile/Tablet) */}
          <div className="xl:hidden relative" ref={mobileUserMenuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMobileUserMenu(!showMobileUserMenu);
              }}
              className="p-1"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                {user?.email?.[0].toUpperCase() || "U"}
              </div>
            </button>
            {showMobileUserMenu && (
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
          {/* Dashboard Content */}
          <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                {greeting}, {user?.email?.split("@")[0] || "User"}!
              </h1>
              <p className="text-sm sm:text-base text-gray-600">Here's what's happening with your learning today</p>
            </div>
            <button 
              onClick={() => navigate('/resell')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <DollarSign className="h-4 w-4" />
              <span className="font-medium text-sm">Resell</span>
            </button>
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

          {/* Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {overviewCards.map((card, i) => (
              <Card key={i} className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${card.color} rounded-lg mb-3 sm:mb-4 flex items-center justify-center`}>
                  <card.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">{card.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">{card.value}</p>
              </Card>
            ))}
          </div>



          {/* Sales Tab */}
          {activeTab === "sales" && (
            <div className="space-y-6">
              {/* Students Overview */}
              <Card className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
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
                      </tr>
                    </thead>
                    <tbody>
                      {studentsData.length > 0 ? studentsData.map((student, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedStudent(student)}>
                          <td className="px-3 py-3 font-medium text-gray-800">{student.name}</td>
                          <td className="px-3 py-3 text-gray-600">{student.email}</td>
                          <td className="px-3 py-3 text-gray-600">{student.mobile}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={3} className="px-3 py-8 text-center text-gray-500">
                            No students have joined with your referral code yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Course Purchases */}
              <Card className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
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
                        <th className="px-3 py-2">Purchase Date</th>
                        <th className="px-3 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData.length > 0 ? salesData.map((sale, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="px-3 py-3 text-gray-800">{sale.customerName}</td>
                          <td className="px-3 py-3 text-gray-600">{sale.courseName}</td>
                          <td className="px-3 py-3 text-gray-600">{sale.purchaseDate}</td>
                          <td className="px-3 py-3">
                            <button
                              onClick={() => setSelectedSale(sale)}
                              className="text-orange-500 hover:text-orange-600 font-semibold text-xs"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="px-3 py-8 text-center text-gray-500">
                            No course purchases yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* Course Insights Tab */}
          {activeTab === "insights" && (
            <Card className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Best Sellers Overview</h3>
              <div className="space-y-3">
                {courseInsights.length > 0 ? courseInsights.map((course, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedCourse(course)}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${course.sales > 30 ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <BookOpen className={`h-5 w-5 ${course.sales > 30 ? 'text-green-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{course.name}</p>
                        <p className="text-xs text-gray-500">{course.sales} sales</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {course.sales > 30 ? (
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
            </Card>
          )}

          {/* Earnings Tab */}
          {activeTab === "earnings" && (
            <div className="space-y-6">
              {/* Resell Summary */}
              <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-orange-600" />
                  Resell Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Courses Resold</p>
                    <p className="text-2xl font-bold text-gray-800">{totalCourses}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Total Earned</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCommission)}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Payment Status</p>
                    <div className="flex gap-2 mt-1">
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-semibold">
                        {formatCurrency(earnings.pending)} Pending
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                        {formatCurrency(earnings.cleared)} Cleared
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <IndianRupee className="h-5 w-5 text-blue-600" />
                    <p className="text-sm text-gray-600">Total Commission</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalCommission)}</p>
                </Card>
                <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(earnings.pending)}</p>
                </Card>
                <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-sm text-gray-600">Cleared</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(earnings.cleared)}</p>
                </Card>
              </div>

              <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
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
                      {earnings.courses.map((course, i) => (
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* Sale Details Modal */}
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

          {/* Student Details Modal */}
          {selectedStudent && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Student Details</h3>
                  <button onClick={() => setSelectedStudent(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Student Name</p>
                    <p className="font-semibold text-gray-800">{selectedStudent.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="font-semibold text-gray-800">{selectedStudent.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Mobile</p>
                    <p className="font-semibold text-gray-800">{selectedStudent.mobile}</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Purchase Information</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Payment Amount</p>
                        <p className="font-bold text-green-600">{formatCurrency(selectedStudent.paymentAmount || 0)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Access Days</p>
                        <p className="font-semibold text-gray-800">{selectedStudent.accessDays || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Purchase Date</p>
                          <p className="text-sm font-medium text-gray-800">{selectedStudent.purchaseDate || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Expiry Date</p>
                          <p className="text-sm font-medium text-gray-800">{selectedStudent.expiryDate || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Course Details Modal */}
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
                      {selectedCourse.sales > 30 ? (
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

export default Dashboard;
