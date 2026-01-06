import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  TrendingUp,
  BookOpen,
  GraduationCap,
  ChevronDown,
  ArrowUpRight,
  Filter,
  User,
  Clock,
  Plus,
  X,
  CheckCircle2,
  DollarSign,
  Briefcase,
  FileText,
} from "lucide-react";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const partnerId = currentUser?.uid;

  // --- STATES ---
  const [orders, setOrders] = useState([]);
  const [courses, setCourses] = useState([]);
  const [ebooks, setEbooks] = useState([]); // ✨ New: E-Books State
  const [loading, setLoading] = useState(true);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [graphData, setGraphData] = useState([]); // ✨ New: Real Graph Data

  // Enroll Form State
  const [enrollData, setEnrollData] = useState({
    productType: "Course", // ✨ New: Course or EBook
    studentName: "",
    studentEmail: "",
    studentPassword: "",
    selectedProductId: "", // Changed from selectedCourseId
    sellingPrice: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // --- FETCH DATA ---
  useEffect(() => {
    fetchInitialData();
  }, [partnerId]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Courses
      const coursesSnap = await getDocs(collection(db, "courseVideos"));
      const coursesList = coursesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "Course",
      }));
      setCourses(coursesList);

      // 2. Fetch E-Books (✨ Added)
      const ebooksSnap = await getDocs(collection(db, "ebooks"));
      const ebooksList = ebooksSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "E-Book",
      }));
      setEbooks(ebooksList);

      // 3. Fetch Orders
      if (partnerId) {
        const q = query(
          collection(db, "orders"),
          where("partnerId", "==", partnerId),
          orderBy("createdAt", "desc")
        );
        const ordersSnap = await getDocs(q);
        const ordersList = ordersSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAtDate: doc.data().createdAt?.toDate
            ? doc.data().createdAt.toDate()
            : new Date(),
        }));
        setOrders(ordersList);
        processGraphData(ordersList); // ✨ Process Real Data
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- REAL-TIME GRAPH LOGIC (Last 7 Days) ---
  const processGraphData = (data) => {
    const last7Days = [...Array(7)]
      .map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        return d;
      })
      .reverse();

    const chartData = last7Days.map((date) => {
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      // Filter orders for this specific day
      const dayOrders = data.filter((o) => {
        const orderDate = new Date(o.createdAtDate);
        return orderDate.toDateString() === date.toDateString();
      });

      const revenue = dayOrders.reduce(
        (sum, o) => sum + Number(o.sellingPrice || 0),
        0
      );
      const profit = dayOrders.reduce(
        (sum, o) => sum + Number(o.profit || 0),
        0
      );

      return { name: dayName, revenue, profit };
    });

    setGraphData(chartData);
  };

  // --- CALCULATE METRICS ---
  const metrics = useMemo(() => {
    let totalStudents = new Set(orders.map((o) => o.studentEmail)).size;
    let totalRevenue = 0;
    let totalCost = 0;

    orders.forEach((order) => {
      totalRevenue += Number(order.sellingPrice || 0);
      totalCost += Number(order.adminPrice || 0);
    });

    return {
      students: totalStudents,
      revenue: totalRevenue,
      profit: totalRevenue - totalCost,
    };
  }, [orders]);

  // --- HANDLERS ---
  const handleEnrollSubmit = async () => {
    if (
      !enrollData.studentName ||
      !enrollData.studentEmail ||
      !enrollData.selectedProductId ||
      !enrollData.sellingPrice
    ) {
      alert("Please fill all fields properly.");
      return;
    }

    // Find selected product (Course or E-Book)
    const productList = enrollData.productType === "Course" ? courses : ebooks;
    const selectedProduct = productList.find(
      (p) => p.id === enrollData.selectedProductId
    );

    if (!selectedProduct) return;

    setIsProcessing(true);
    try {
      const adminPrice = Number(
        selectedProduct.price || selectedProduct.discountPrice || 0
      ); // Handle different price field names if any
      const sellingPrice = Number(enrollData.sellingPrice);

      const orderPayload = {
        partnerId: partnerId,
        studentName: enrollData.studentName,
        studentEmail: enrollData.studentEmail,
        studentPassword: enrollData.studentPassword,
        courseId: selectedProduct.id, // Using generic ID field
        courseTitle: selectedProduct.title, // Title
        productType: enrollData.productType, // ✨ Store Type (Course/E-Book)
        adminPrice: adminPrice,
        sellingPrice: sellingPrice,
        profit: sellingPrice - adminPrice,
        status: "Success",
        createdAt: serverTimestamp(),
        type: "Enrollment",
      };

      await addDoc(collection(db, "orders"), orderPayload);

      setShowEnrollModal(false);
      setEnrollData({
        productType: "Course",
        studentName: "",
        studentEmail: "",
        studentPassword: "",
        selectedProductId: "",
        sellingPrice: "",
      });

      fetchInitialData(); // Refresh data & graph
      alert("✅ Student Enrolled Successfully!");
    } catch (error) {
      console.error("Enrollment failed:", error);
      alert("Failed to enroll student. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper to get selected product details for display
  const getSelectedProductDetails = () => {
    const list = enrollData.productType === "Course" ? courses : ebooks;
    return list.find((p) => p.id === enrollData.selectedProductId);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
            Partner Command Center
          </h2>
          <p className="text-sm text-slate-400 font-medium italic">
            Manage Enrollments & Track Profit
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowEnrollModal(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-600 transition-all shadow-xl"
          >
            <Plus size={16} /> New Enroll
          </button>
        </div>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Students */}
        <div className="bg-white p-7 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <Users size={80} className="text-blue-600" />
          </div>
          <div className="size-14 bg-blue-50 text-blue-600 rounded-[20px] mb-6 flex items-center justify-center">
            <Users size={24} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Total Students
          </p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
            {metrics.students}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 mt-2">
            Active Learners
          </p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-7 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp size={80} className="text-indigo-600" />
          </div>
          <div className="size-14 bg-indigo-50 text-indigo-600 rounded-[20px] mb-6 flex items-center justify-center">
            <Briefcase size={24} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Total Revenue
          </p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
            ₹{metrics.revenue.toLocaleString()}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 mt-2">
            Gross Sales Volume
          </p>
        </div>

        {/* Net Profit */}
        <div className="bg-slate-900 p-7 rounded-[40px] border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <DollarSign size={80} className="text-emerald-400" />
          </div>
          <div className="size-14 bg-white/10 text-emerald-400 rounded-[20px] mb-6 flex items-center justify-center backdrop-blur-sm">
            <DollarSign size={24} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Net Profit
          </p>
          <h3 className="text-4xl font-black text-white tracking-tighter">
            ₹{metrics.profit.toLocaleString()}
          </h3>
          <p className="text-[10px] font-bold text-emerald-400 mt-2">
            Your Total Earnings
          </p>
        </div>
      </div>

      {/* --- CHART & TABLE GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">
              Performance Pulse
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400">
                Last 7 Days Activity
              </span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData.length > 0 ? graphData : []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700 }}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#colorRev)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#colorProfit)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Enrollment Feed */}
        <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
              Recent Enrollments
            </h3>
            <div className="size-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center animate-pulse">
              <div className="size-2 bg-emerald-500 rounded-full" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar max-h-[300px]">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-[24px] border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div
                    className={`size-10 rounded-2xl flex items-center justify-center font-black shadow-sm border border-slate-100 ${
                      order.productType === "E-Book"
                        ? "bg-orange-50 text-orange-600"
                        : "bg-white text-slate-900"
                    }`}
                  >
                    {order.productType === "E-Book" ? (
                      <FileText size={16} />
                    ) : order.studentName ? (
                      order.studentName[0]
                    ) : (
                      "U"
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate">
                      {order.studentName}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 truncate flex items-center gap-1">
                      {order.productType === "E-Book" && (
                        <span className="text-[8px] bg-orange-100 text-orange-600 px-1 rounded">
                          E-BOOK
                        </span>
                      )}
                      {order.courseTitle}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-emerald-600">
                      +₹{order.profit}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400">
                      Profit
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-300">
                <Users size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-[10px] font-bold uppercase">
                  No enrollments yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- ENROLLMENT MODAL --- */}
      <AnimatePresence>
        {showEnrollModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEnrollModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="bg-slate-900 p-8 text-white relative shrink-0">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <GraduationCap size={100} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">
                  New Enrollment
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                  Create Access & Assign Product
                </p>
                <button
                  onClick={() => setShowEnrollModal(false)}
                  className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form */}
              <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                {/* 1. Student Details */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                    Student Credentials
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full bg-slate-50 p-4 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-indigo-100 focus:bg-white transition-all"
                      value={enrollData.studentName}
                      onChange={(e) =>
                        setEnrollData({
                          ...enrollData,
                          studentName: e.target.value,
                        })
                      }
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full bg-slate-50 p-4 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-indigo-100 focus:bg-white transition-all"
                      value={enrollData.studentEmail}
                      onChange={(e) =>
                        setEnrollData({
                          ...enrollData,
                          studentEmail: e.target.value,
                        })
                      }
                    />
                    <input
                      type="password"
                      placeholder="Create Password"
                      className="w-full bg-slate-50 p-4 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-indigo-100 focus:bg-white transition-all"
                      value={enrollData.studentPassword}
                      onChange={(e) =>
                        setEnrollData({
                          ...enrollData,
                          studentPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* 2. Product Selection (Course/E-Book) */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Allocation Type
                    </p>
                    {/* Toggle Button */}
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                      <button
                        onClick={() =>
                          setEnrollData({
                            ...enrollData,
                            productType: "Course",
                            selectedProductId: "",
                          })
                        }
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                          enrollData.productType === "Course"
                            ? "bg-white shadow-sm text-slate-900"
                            : "text-slate-400"
                        }`}
                      >
                        Course
                      </button>
                      <button
                        onClick={() =>
                          setEnrollData({
                            ...enrollData,
                            productType: "E-Book",
                            selectedProductId: "",
                          })
                        }
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                          enrollData.productType === "E-Book"
                            ? "bg-white shadow-sm text-slate-900"
                            : "text-slate-400"
                        }`}
                      >
                        E-Book
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      className="w-full bg-slate-50 p-4 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-indigo-100 focus:bg-white transition-all appearance-none cursor-pointer"
                      value={enrollData.selectedProductId}
                      onChange={(e) =>
                        setEnrollData({
                          ...enrollData,
                          selectedProductId: e.target.value,
                        })
                      }
                    >
                      <option value="">Select {enrollData.productType}</option>
                      {(enrollData.productType === "Course"
                        ? courses
                        : ebooks
                      ).map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.title} (Admin Rate: ₹{item.price})
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>

                  {enrollData.selectedProductId && (
                    <div className="flex justify-between items-center px-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Admin Base Price:
                      </span>
                      <span className="text-sm font-black text-slate-900">
                        ₹{getSelectedProductDetails()?.price}
                      </span>
                    </div>
                  )}
                </div>

                {/* 3. Financials */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                    Transaction Details
                  </p>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
                      Selling Price (To Student)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full bg-indigo-50/50 p-4 pl-10 rounded-2xl text-sm font-black outline-none border border-transparent focus:border-indigo-200 transition-all text-indigo-900"
                        value={enrollData.sellingPrice}
                        onChange={(e) =>
                          setEnrollData({
                            ...enrollData,
                            sellingPrice: e.target.value,
                          })
                        }
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 font-bold">
                        ₹
                      </span>
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 italic flex items-center gap-1">
                      <div className="size-1 rounded-full bg-orange-400" /> Only
                      for your revenue tracking, do not share with anyone.
                    </p>
                  </div>

                  {enrollData.selectedProductId && enrollData.sellingPrice && (
                    <div className="bg-emerald-50 p-4 rounded-2xl flex justify-between items-center border border-emerald-100">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                        Est. Profit
                      </span>
                      <span className="text-xl font-black text-emerald-600">
                        ₹
                        {Number(enrollData.sellingPrice) -
                          Number(getSelectedProductDetails()?.price)}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleEnrollSubmit}
                  disabled={isProcessing}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-600 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing
                    ? "Processing..."
                    : `Pay ₹${
                        enrollData.selectedProductId
                          ? getSelectedProductDetails()?.price
                          : "0"
                      } & Enroll`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PartnerDashboard;
