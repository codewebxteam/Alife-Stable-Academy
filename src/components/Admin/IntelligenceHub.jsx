import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { intelligenceService } from "../../services/intelligenceService";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
  Timestamp,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Briefcase,
  TrendingUp,
  Filter,
  GraduationCap,
  ExternalLink,
  ArrowUpRight,
  Globe,
  ChevronRight,
  Ticket,
  Plus,
  RefreshCw,
  X,
  Trash2,
  Pencil,
  Tag,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

// Fallback data for graphs
const FALLBACK_WEEKLY = [
  { name: "Sun", partner: 4000, direct: 2400 },
  { name: "Mon", partner: 3000, direct: 1398 },
  { name: "Tue", partner: 5000, direct: 9800 },
  { name: "Wed", partner: 2780, direct: 3908 },
  { name: "Thu", partner: 1890, direct: 4800 },
  { name: "Fri", partner: 2390, direct: 3800 },
  { name: "Sat", partner: 3490, direct: 4300 },
];

const FALLBACK_MONTHLY = [
  { name: "Jan", partner: 45000, direct: 22000 },
  { name: "Feb", partner: 52000, direct: 28000 },
  { name: "Mar", partner: 48000, direct: 35000 },
  { name: "Apr", partner: 61000, direct: 42000 },
  { name: "May", partner: 55000, direct: 39000 },
  { name: "Jun", partner: 67000, direct: 51000 },
];

const IntelligenceHub = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const partnerId = currentUser?.uid;

  // --- MAIN STATE ---
  const [timeRange, setTimeRange] = useState("7D");
  const [velocityToggle, setVelocityToggle] = useState("Weekly");
  const [loading, setLoading] = useState(false);
  const [customDates, setCustomDates] = useState({ start: "", end: "" });

  // --- COUPON INTELLIGENCE STATE ---
  const [coupons, setCoupons] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form States
  const [couponCode, setCouponCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [value, setValue] = useState("");
  const [limit, setLimit] = useState("");
  const [expiry, setExpiry] = useState("");

  // --- EXISTING INTELLIGENCE STATES ---
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    directRevenue: 0,
    partnerRevenue: 0,
  });
  const [courseData, setCourseData] = useState({
    total: 0,
    self: 0,
    partner: 0,
  });
  const [studentData, setStudentData] = useState({
    total: 0,
    self: 0,
    partner: 0,
  });
  const [velocityData, setVelocityData] = useState([]);
  const [coursePieData, setCoursePieData] = useState([]);
  const [ebookPieData, setEbookPieData] = useState([]);
  const [inactivePartners, setInactivePartners] = useState([]);
  const [hotAsset, setHotAsset] = useState({ name: "N/A", units: 0 });

  // --- EFFECTS ---

  // 1. Fetch Static/Service Data with instant initial values
  useEffect(() => {
    // Set default values immediately
    setRevenueData({ totalRevenue: 0, directRevenue: 0, partnerRevenue: 0 });
    setCourseData({ total: 0, self: 0, partner: 0 });
    setStudentData({ total: 0, self: 0, partner: 0 });
    setVelocityData(velocityToggle === "Weekly" ? FALLBACK_WEEKLY : FALLBACK_MONTHLY);
    setCoursePieData([]);
    setEbookPieData([]);
    setInactivePartners([]);
    setHotAsset({ name: "N/A", units: 0 });
    
    // Then fetch real data
    fetchAllData();
  }, [timeRange, velocityToggle, customDates]);

  // 2. Fetch Real-time Coupon Data (Firestore)
  useEffect(() => {
    if (!partnerId) return;

    // Listen for Coupons
    const couponRef = query(
      collection(db, "coupons"),
      where("partnerId", "==", partnerId),
      orderBy("createdAt", "desc")
    );

    const unsubCoupons = onSnapshot(couponRef, (snap) => {
      const now = new Date();
      const raw = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Auto-calculate status based on expiry
          status: data.expiry?.toDate?.() < now ? "Expired" : "Active",
        };
      });
      setCoupons(raw);
    });

    // Listen for Redemptions
    const redemptionRef = query(
      collection(db, "couponRedemptions"),
      where("partnerId", "==", partnerId),
      orderBy("createdAt", "desc")
    );

    const unsubRedemptions = onSnapshot(redemptionRef, (snap) => {
      setRedemptions(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => {
      unsubCoupons();
      unsubRedemptions();
    };
  }, [partnerId]);

  // --- HANDLERS ---

  const fetchAllData = async () => {
    if (timeRange === "Custom" && (!customDates.start || !customDates.end)) return;

    try {
      intelligenceService.getRevenueData(timeRange, customDates).then(setRevenueData).catch(() => {});
      intelligenceService.getCourseAcquisitions(timeRange, customDates).then(setCourseData).catch(() => {});
      intelligenceService.getStudentCount(timeRange, customDates).then(setStudentData).catch(() => {});
      intelligenceService.getRevenueVelocity(velocityToggle, timeRange, customDates).then(velocity => {
        if (velocity.length > 0) setVelocityData(velocity);
      }).catch(() => {});
      intelligenceService.getCourseSalesDistribution(timeRange, customDates).then(setCoursePieData).catch(() => {});
      intelligenceService.getEbookSalesDistribution(timeRange, customDates).then(setEbookPieData).catch(() => {});
      intelligenceService.getInactivePartners().then(setInactivePartners).catch(() => {});
      intelligenceService.getHotAssetSpotlight(timeRange, customDates).then(setHotAsset).catch(() => {});
    } catch (error) {
      console.error("Error fetching intelligence data:", error);
    }
  };

  // Coupon Handlers
  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++)
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    setCouponCode(result);
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setCouponCode(coupon.code);
    setDiscountType(coupon.type === "Percentage" ? "percentage" : "flat");
    setValue(coupon.value);
    setLimit(coupon.limit);
    setExpiry(coupon.expiry?.toDate?.().toISOString().split("T")[0]);
    setShowCreateModal(true);
  };

  const handleDeleteCoupon = async (couponId) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await deleteDoc(doc(db, "coupons", couponId));
    } catch (err) {
      console.error("Error deleting coupon:", err);
    }
  };

  const handleCreateCoupon = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      if (!currentUser || !partnerId) return;
      if (!couponCode || !value || !limit || !expiry) {
        alert("Please fill all fields");
        return;
      }

      const payload = {
        partnerId,
        code: couponCode.toUpperCase(),
        type: discountType === "percentage" ? "Percentage" : "Flat",
        value: Number(value),
        limit: Number(limit),
        expiry: Timestamp.fromDate(new Date(expiry)),
      };

      if (editingCoupon) {
        await updateDoc(doc(db, "coupons", editingCoupon.id), payload);
      } else {
        await addDoc(collection(db, "coupons"), {
          ...payload,
          used: 0,
          status: "Active",
          createdAt: Timestamp.now(),
        });
      }

      setShowCreateModal(false);
      setEditingCoupon(null);
      setCouponCode("");
      setValue("");
      setLimit("");
      setExpiry("");
    } catch (error) {
      console.error("Error saving coupon:", error);
      alert("Failed to save coupon");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper
  const formatDate = (ts) =>
    ts?.toDate?.().toLocaleDateString("en-IN") || "N/A";

  return (
    <div className="space-y-8 pb-10 relative">

      {/* --- OMNI-FILTER (FIXED) --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
            Intelligence Neural Hub
          </h2>
          <p className="text-sm text-slate-400 font-medium italic">
            Analytics & Campaign Management
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          {timeRange === "Custom" && (
            <div className="flex items-center gap-2 px-2 border-r border-slate-100 mr-2">
              <input
                type="date"
                value={customDates.start}
                onChange={(e) =>
                  setCustomDates((prev) => ({ ...prev, start: e.target.value }))
                }
                className="text-[10px] font-bold p-1 bg-slate-50 rounded outline-none text-slate-700"
              />
              <span className="text-[10px] text-slate-300 font-black">TO</span>
              <input
                type="date"
                value={customDates.end}
                onChange={(e) =>
                  setCustomDates((prev) => ({ ...prev, end: e.target.value }))
                }
                className="text-[10px] font-bold p-1 bg-slate-50 rounded outline-none text-slate-700"
              />
            </div>
          )}
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-slate-950 text-white pl-10 pr-10 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
            >
              {["Today", "7D", "30D", "Quarter", "Year", "Custom"].map(
                (opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                )
              )}
            </select>
            <Filter
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* --- 1. MACRO KPI ARCHITECTURE (WITH COUPON CARD) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MacroCard
          title="Net Revenue"
          val={
            revenueData.totalRevenue >= 100000
              ? `₹${(revenueData.totalRevenue / 100000).toFixed(1)}L`
              : `₹${revenueData.totalRevenue.toLocaleString()}`
          }
          subData={[
            {
              label: "Direct",
              value: `₹${(revenueData.directRevenue / 1000).toFixed(1)}k`,
            },
            {
              label: "Partner",
              value: `₹${(revenueData.partnerRevenue / 1000).toFixed(1)}k`,
            },
          ]}
          icon={<Globe size={20} />}
          color="indigo"
        />
        <MacroCard
          title="Acquisitions"
          val={courseData.total.toLocaleString()}
          subData={[
            { label: "Self", value: courseData.self.toLocaleString() },
            { label: "Partner", value: courseData.partner.toLocaleString() },
          ]}
          icon={<GraduationCap size={20} />}
          color="emerald"
        />

        {/* ✨ REPLACED GROWTH PARTNERS WITH ACTIVE CAMPAIGNS CARD ✨ */}
        <div
          onClick={() => {
            setEditingCoupon(null);
            setCouponCode("");
            setValue("");
            setLimit("");
            setExpiry("");
            setShowCreateModal(true);
          }}
          className="bg-slate-950 p-7 rounded-[40px] border border-slate-900 shadow-xl cursor-pointer group transition-all hover:scale-[1.02] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-5 opacity-10 group-hover:opacity-20 transition-all group-hover:rotate-12 transform">
            <Ticket size={100} className="text-white" />
          </div>
          <div className="size-14 bg-white/10 rounded-[20px] mb-6 flex items-center justify-center text-white backdrop-blur-md">
            <Ticket size={24} />
          </div>
          <div className="flex justify-between items-end relative z-10">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Active Campaigns
              </p>
              <h3 className="text-3xl font-black text-white tracking-tighter">
                {coupons.filter((c) => c.status === "Active").length}
              </h3>
            </div>
            <div className="size-8 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg animate-pulse">
              <Plus size={16} />
            </div>
          </div>
          <div className="mt-4 flex gap-2 relative z-10">
            <span className="text-[9px] font-black px-2.5 py-1.5 bg-white/10 text-slate-300 rounded-xl border border-white/5 uppercase tracking-tighter">
              Redeemed: {redemptions.length}
            </span>
          </div>
        </div>

        <MacroCard
          title="Students"
          val={studentData.total.toLocaleString()}
          subData={[
            { label: "Active", value: studentData.self },
            { label: "New", value: "+12" }, // Example dynamic
          ]}
          icon={<Users size={20} />}
          color="blue"
        />
      </div>

      {/* --- 2 & 3. VELOCITY & COUPON MONITOR --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Velocity Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-lg font-black uppercase tracking-widest">
                Revenue Velocity
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                Direct vs Partner Performance
              </p>
            </div>
            <div className="flex p-1.5 bg-slate-100 rounded-2xl">
              <button
                onClick={() => setVelocityToggle("Weekly")}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                  velocityToggle === "Weekly"
                    ? "bg-white text-slate-900 shadow-lg"
                    : "text-slate-400"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setVelocityToggle("Monthly")}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                  velocityToggle === "Monthly"
                    ? "bg-white text-slate-900 shadow-lg"
                    : "text-slate-400"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData}>
                <defs>
                  <linearGradient id="colorPartner" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDirect" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F1F5F9"
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
                    borderRadius: "24px",
                    border: "none",
                    boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="partner"
                  stroke="#6366f1"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorPartner)"
                />
                <Area
                  type="monotone"
                  dataKey="direct"
                  stroke="#10b981"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorDirect)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ✨ COUPON MONITOR (REPLACED LIQUIDITY DESK) ✨ */}
        <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
              Live Coupon Monitor
            </h3>
            <button
              onClick={() => navigate("/partner/coupon-intelligence")}
              className="size-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all"
            >
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {coupons.length > 0 ? (
              coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="group p-4 bg-slate-50 rounded-[24px] border border-slate-100 hover:border-indigo-200 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                        {coupon.code}
                      </span>
                      <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">
                        {coupon.type === "Percentage"
                          ? `${coupon.value}% OFF`
                          : `₹${coupon.value} OFF`}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditCoupon(coupon)}
                        className="p-1.5 text-slate-300 hover:text-indigo-500 transition-colors"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full ${
                        coupon.status === "Expired"
                          ? "bg-red-400"
                          : "bg-indigo-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          (coupon.used / coupon.limit) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400">
                    <span>
                      {coupon.used} / {coupon.limit} Used
                    </span>
                    <span
                      className={
                        coupon.status === "Expired"
                          ? "text-red-500"
                          : "text-emerald-500"
                      }
                    >
                      {coupon.status === "Expired"
                        ? "Expired"
                        : `Exp: ${formatDate(coupon.expiry)}`}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-[24px]">
                <Ticket size={24} className="mb-2 opacity-50" />
                <span className="text-[10px] font-black uppercase">
                  No Active Coupons
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- 4 & 5. REDEMPTION AUDIT & SALES DISTRIBUTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ✨ REDEMPTION AUDIT (REPLACED ACADEMIC INTELLIGENCE) ✨ */}
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black uppercase tracking-widest">
              Redemption Audit
            </h3>
            <Tag className="text-emerald-500" size={20} />
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {redemptions.length > 0 ? (
              redemptions.slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-[24px] border border-slate-100"
                >
                  <div className="mt-1 text-emerald-500 bg-emerald-50 p-2 rounded-xl">
                    <TrendingUp size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-slate-800">
                      {r.studentName}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                      Used{" "}
                      <span className="text-indigo-500">{r.couponCode}</span> on{" "}
                      {r.purchasedItem?.split(" ").slice(0, 2).join(" ")}...
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-900">
                      {r.discountValue}
                    </p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">
                      {formatDate(r.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-xs text-slate-400 font-bold">
                  No redemptions yet
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate("/partner/coupon-intelligence")}
            className="w-full mt-6 py-3 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
          >
            View Full Log
          </button>
        </div>

        {/* E-Book Sales (Existing) */}
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-10 text-center">
            E-Book Distribution
          </h3>
          <div className="h-[200px]">
            {ebookPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ebookPieData}
                    innerRadius={0}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {ebookPieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-xs text-slate-400 font-bold">
                  No ebook data
                </p>
              </div>
            )}
          </div>
          <div className="space-y-3 mt-6">
            {ebookPieData.slice(0, 3).map((e) => (
              <div
                key={e.name}
                className="flex justify-between items-center text-[10px] font-black uppercase"
              >
                <span className="text-slate-500 flex items-center gap-2">
                  <div
                    className="size-2 rounded-full"
                    style={{ backgroundColor: e.color }}
                  />{" "}
                  {e.name}
                </span>
                <span className="text-slate-900">{e.value} Units</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts (Existing) */}
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <div className="size-10 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center animate-pulse shadow-inner">
              <AlertCircle size={20} />
            </div>
            <h3 className="text-md font-black uppercase tracking-widest text-red-600">
              Alerts
            </h3>
          </div>

          <div className="flex-1 space-y-4">
            {inactivePartners.length > 0 ? (
              inactivePartners.slice(0, 2).map((p, index) => (
                <div
                  key={`partner-${index}`}
                  className="flex justify-between items-center p-4 bg-red-50/50 border border-red-100 rounded-[20px]"
                >
                  <span className="text-[10px] font-black text-slate-800">
                    {p}
                  </span>
                  <ExternalLink size={12} className="text-red-400" />
                </div>
              ))
            ) : (
              <p className="text-[10px] text-slate-400 font-bold uppercase">
                No Critical Alerts
              </p>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-50">
            <div className="bg-indigo-50 p-5 rounded-[24px] border border-indigo-100">
              <p className="text-[9px] font-black text-indigo-400 uppercase mb-1">
                Spotlight Asset
              </p>
              <div className="flex justify-between items-end">
                <h4 className="text-sm font-black text-slate-900">
                  {hotAsset.name}
                </h4>
                <span className="text-xl font-black text-indigo-600">
                  {hotAsset.units}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CREATE COUPON MODAL --- */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[40px] p-8 shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black tracking-tighter uppercase text-slate-900">
                  {editingCoupon ? "Edit Campaign" : "Forge Campaign"}
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Discount Type Toggle */}
                <div className="bg-slate-100 p-1 rounded-2xl flex relative">
                  <motion.div
                    className="absolute top-1 bottom-1 bg-white rounded-xl shadow-sm z-0"
                    initial={false}
                    animate={{
                      left: discountType === "percentage" ? "4px" : "50%",
                      width: "calc(50% - 4px)",
                    }}
                  />
                  {["percentage", "flat"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setDiscountType(type)}
                      className={`flex-1 py-3 text-[10px] font-black uppercase relative z-10 transition-colors ${
                        discountType === type
                          ? "text-slate-900"
                          : "text-slate-400"
                      }`}
                    >
                      {type === "percentage"
                        ? "Percentage (%)"
                        : "Flat Amount (₹)"}
                    </button>
                  ))}
                </div>

                {/* Code Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      placeholder="SUMMER50"
                      className="flex-1 bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl px-4 py-3 text-sm font-bold uppercase outline-none transition-all"
                    />
                    <button
                      onClick={generateRandomCode}
                      className="px-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-colors"
                    >
                      <RefreshCw size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Value
                    </label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={discountType === "percentage" ? "20" : "500"}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Limit
                    </label>
                    <input
                      type="number"
                      value={limit}
                      onChange={(e) => setLimit(e.target.value)}
                      placeholder="100"
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none transition-all text-slate-600"
                  />
                </div>

                <button
                  onClick={handleCreateCoupon}
                  disabled={isSaving}
                  className="w-full bg-slate-950 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving
                    ? "Processing..."
                    : editingCoupon
                    ? "Update Campaign"
                    : "Launch Campaign"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- MICRO-COMPONENTS ---
const MacroCard = ({ title, val, subData, icon, color, onClick }) => {
  const styles = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-blue-50 text-blue-600",
  };
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className="bg-white p-7 rounded-[40px] border border-slate-100 shadow-sm cursor-pointer group transition-all"
    >
      <div
        className={`size-14 rounded-[20px] mb-6 flex items-center justify-center transition-all group-hover:rotate-12 ${styles[color]}`}
      >
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
        {title}
      </p>
      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
        {val}
      </h3>
      <div className="mt-4 flex gap-2">
        {subData.map((s, i) => (
          <span
            key={i}
            className="text-[9px] font-black px-2.5 py-1.5 bg-slate-50 text-slate-500 rounded-xl border border-slate-100 uppercase tracking-tighter"
          >
            {s.label}: {s.value}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default IntelligenceHub;
