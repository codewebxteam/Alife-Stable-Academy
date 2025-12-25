import React, { useState, useMemo, useEffect} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  Ticket,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  X,
  TrendingUp,
  UserCheck,
  ShoppingBag,
  Mail,
  Calendar,
  Tag,
  Percent,
  Banknote,
} from "lucide-react";
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
  Timestamp,
  where
} from "firebase/firestore";
import { db } from "../../firebase/config";

const ITEMS_PER_PAGE = 5;

const CouponIntelligence = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
   const [coupons, setCoupons] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [couponPage, setCouponPage] = useState(1);
  const [redemptionPage, setRedemptionPage] = useState(1);
  const [value, setValue] = useState("");
  const [limit, setLimit] = useState("");
  const [expiry, setExpiry] = useState("");
  const { currentUser } = useAuth();
  const partnerId = currentUser?.uid;

  // const COUPONS = [
  //   {
  //     id: "CP-05",
  //     code: "NEWYEAR24",
  //     type: "Percentage",
  //     value: "30",
  //     limit: "200",
  //     used: "0",
  //     expiry: "2024-01-05",
  //     status: "Scheduled",
  //     createdAt: "2023-12-23",
  //   },
  //   {
  //     id: "CP-04",
  //     code: "FIRSTBUY",
  //     type: "Flat",
  //     value: "100",
  //     limit: "100",
  //     used: "88",
  //     expiry: "2024-02-05",
  //     status: "Active",
  //     createdAt: "2023-12-05",
  //   },
  //   {
  //     id: "CP-03",
  //     code: "ALIFEPRO",
  //     type: "Percentage",
  //     value: "50",
  //     limit: "10",
  //     used: "10",
  //     expiry: "2023-12-15",
  //     status: "Expired",
  //     createdAt: "2023-12-10",
  //   },
  //   {
  //     id: "CP-02",
  //     code: "FLAT500",
  //     type: "Flat",
  //     value: "500",
  //     limit: "50",
  //     used: "50",
  //     expiry: "2023-11-10",
  //     status: "Expired",
  //     createdAt: "2023-12-15",
  //   },
  //   {
  //     id: "CP-01",
  //     code: "WELCOME20",
  //     type: "Percentage",
  //     value: "20",
  //     limit: "100",
  //     used: "45",
  //     expiry: "2024-12-30",
  //     status: "Active",
  //     createdAt: "2023-12-20",
  //   },
  // ];

  // const REDEMPTIONS = [
  //   {
  //     id: "RD-03",
  //     student: "Aryan Sharma",
  //     email: "aryan@example.com",
  //     couponUsed: "WELCOME20",
  //     purchasedItem: "React Pro Mastery",
  //     date: "2023-12-23 14:30",
  //     discountValue: "₹150",
  //   },
  //   {
  //     id: "RD-02",
  //     student: "Sanya Iyer",
  //     email: "sanya@example.com",
  //     couponUsed: "WELCOME20",
  //     purchasedItem: "UI/UX Bootcamp",
  //     date: "2023-12-22 10:15",
  //     discountValue: "₹100",
  //   },
  //   {
  //     id: "RD-01",
  //     student: "Vikram Raj",
  //     email: "vikram@example.com",
  //     couponUsed: "FLAT500",
  //     purchasedItem: "Backend Fundamentals",
  //     date: "2023-12-21 18:45",
  //     discountValue: "₹500",
  //   },
  // ];

  const normalizeCoupons = (list) => {
    const now = new Date();
    return list.map((c) => ({
      ...c,
      status:
        c.expiry?.toDate?.() < now ? "Expired" : c.status,
    }));
  };


  useEffect(() => {
    if (!partnerId) return;
    const couponRef = query(
      collection(db, "coupons"),
      where("partnerId", "==", partnerId),
      orderBy("createdAt", "desc")
    );

     const unsubCoupons = onSnapshot(couponRef, (snap) => {
      const raw = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCoupons(normalizeCoupons(raw));
    });

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

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++)
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    setCouponCode(result);
  };

  const formatDate = (ts) =>
  ts?.toDate?.().toLocaleDateString("en-IN");


   const handleCreateCoupon = async () => {
    if (!currentUser || !partnerId) {
    alert("User not ready. Please wait.");
    return;
  }
    if (!couponCode || !value || !limit || !expiry) return;
    


    await addDoc(collection(db, "coupons"), {
      partnerId: partnerId,
      code: couponCode.toUpperCase(),
      type: discountType === "percentage" ? "Percentage" : "Flat",
      value: Number(value),
      limit: Number(limit),
      used: 0,
      status: "Active",
      expiry: Timestamp.fromDate(new Date(expiry)),
      createdAt: Timestamp.now(),
    });

    setShowCreateModal(false);
    setCouponCode("");
    setValue("");
    setLimit("");
    setExpiry("");
  };

  const currentCoupons = coupons.slice(
    (couponPage - 1) * ITEMS_PER_PAGE,
    couponPage * ITEMS_PER_PAGE
  );
  const currentRedemptions = redemptions.slice(
    (redemptionPage - 1) * ITEMS_PER_PAGE,
    redemptionPage * ITEMS_PER_PAGE
  );
  


  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Coupon Intelligence
            </h1>
            <p className="text-sm text-slate-400 font-medium italic">
              Marketing Assets & Student Audit Trail
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-[24px] text-[11px] font-black uppercase tracking-widest shadow-xl active:scale-95"
          >
            <Plus size={18} /> Forge Campaign
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatMini label="Live Coupons" val={coupons.length} color="blue" />
          <StatMini label="Total Redeemed" val={redemptions.length} color="emerald" />
          <StatMini label="Revenue Burn" val="Auto" color="orange" />
        </div>

        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
              Campaign Configuration
            </h3>
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search codes..."
                className="bg-transparent text-[10px] font-bold outline-none w-32"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-10 py-5">Code / Created</th>
                  <th className="px-10 py-5">Value</th>
                  {/* ✨ MAIN TABLE ME ADD KIYA ✨ */}
                  <th className="px-10 py-5">Usage Quota</th>
                  <th className="px-10 py-5">Audit Status</th>
                  <th className="px-10 py-5 text-right">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentCoupons.map((c) => (
                  <tr
                    key={c.id}
                    className="group hover:bg-slate-50/30 transition-all cursor-pointer"
                    onClick={() => setSelectedCoupon(c)}
                  >
                    <td className="px-10 py-6">
                      <p className="text-sm font-black text-slate-900">
                        {c.code}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {formatDate(c.createdAt)}
                      </p>
                    </td>
                    <td className="px-10 py-6 text-xs font-bold text-slate-600">
                      {c.value}
                      {c.type === "Percentage" ? "%" : "₹"} OFF
                    </td>
                    {/* ✨ USAGE QUOTA COLUMN ✨ */}
                    <td className="px-10 py-6">
                      <p className="text-xs font-black text-slate-800">
                        {c.used} / {c.limit}
                      </p>
                    </td>
                    <td className="px-10 py-6">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-10 py-6 text-right">
                      <Eye
                        size={18}
                        className="inline text-slate-300 group-hover:text-slate-950"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            current={couponPage}
            total={Math.ceil(coupons.length / ITEMS_PER_PAGE)}
            setPage={setCouponPage}
          />
        </div>

        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-indigo-50/30">
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                Student Audit Trail
              </h3>
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-1">
                Real-time redemption intelligence
              </p>
            </div>
            <UserCheck className="text-indigo-400" size={24} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-10 py-5">Student / Timestamp</th>
                  <th className="px-10 py-5">Coupon Used</th>
                  <th className="px-10 py-5">Purchased Asset</th>
                  <th className="px-10 py-5 text-right">Audit Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentRedemptions.map((log) => (
                  <tr
                    key={log.id}
                    className="group hover:bg-slate-50/30 transition-all cursor-pointer"
                    onClick={() => setSelectedStudent(log)}
                  >
                    <td className="px-10 py-7">
                      <p className="text-sm font-black text-slate-900">
                        {log.studentName}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                       {formatDate(log.createdAt)}
                      </p>
                    </td>
                    <td className="px-10 py-7">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black">
                        {log.couponCode}
                      </span>
                    </td>
                    <td className="px-10 py-7 text-xs font-bold text-slate-600">
                      {log.purchasedItem}
                    </td>
                    <td className="px-10 py-7 text-right">
                      <Eye
                        size={18}
                        className="inline text-slate-300 group-hover:text-slate-950"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            current={redemptionPage}
            total={Math.ceil(redemptions.length / ITEMS_PER_PAGE)}
            setPage={setRedemptionPage}
          />
        </div>
      </div>

      <AnimatePresence>
        {selectedCoupon && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCoupon(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl relative z-10"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="size-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Ticket size={28} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Usage Quota
                  </p>
                  {/* ✨ POPUP ME USAGE QUOTA ✨ */}
                  <p className="text-lg font-black text-slate-900">
                    {selectedCoupon.used} / {selectedCoupon.limit}
                  </p>
                </div>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (selectedCoupon.used / selectedCoupon.limit) * 100
                    }%`,
                  }}
                  className="h-full bg-indigo-500"
                />
              </div>

              <h4 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
                Configuration: {selectedCoupon.code}
              </h4>
              <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <InfoRow
                  label="Discount Value"
                  val={`${selectedCoupon.value}${
                    selectedCoupon.type === "Percentage" ? "%" : "₹"
                  } OFF`}
                />
                <InfoRow label="Valid Until" val={formatDate(selectedCoupon.expiry)} />
                <InfoRow label="Created On" val={formatDate(selectedCoupon.createdAt)} />
                <InfoRow label="Status" val={selectedCoupon.status} highlight />
              </div>
              <button
                onClick={() => setSelectedCoupon(null)}
                className="mt-8 w-full py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
              >
                Close Settings
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl relative z-10"
            >
              <div className="size-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <UserCheck size={28} />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-1">
                {selectedStudent.studentName}
              </h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 border-b pb-4">
                Audit Receipt
              </p>
              <div className="space-y-6 text-left">
                <DetailItem
                  icon={<ShoppingBag size={14} />}
                  label="Asset Purchased"
                  val={selectedStudent.purchasedItem}
                />
                <DetailItem
                  icon={<Tag size={14} />}
                  label="Coupon Applied"
                  val={selectedStudent.couponCode}
                  color="indigo"
                />
                <DetailItem
                  icon={<TrendingUp size={14} />}
                  label="Saved Profit"
                  val={selectedStudent.discountValue}
                  color="emerald"
                />
                <DetailItem
                  icon={<Mail size={14} />}
                  label="Contact ID"
                  val={selectedStudent.email}
                />
                <DetailItem
                  icon={<Calendar size={14} />}
                  label="Timestamp"
                  val={selectedStudent.date}
                />
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="mt-10 w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
              >
                Close Audit
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
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
              className="bg-white w-full max-w-2xl rounded-[40px] p-12 shadow-2xl relative z-10 overflow-y-auto max-h-[95vh]"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black tracking-tighter uppercase">
                  Forge Campaign
                </h3>
                <X
                  className="cursor-pointer text-slate-400"
                  onClick={() => setShowCreateModal(false)}
                />
              </div>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Discount Engine
                  </label>
                  <div className="flex p-1 bg-slate-100 rounded-2xl relative">
                    <button
                      onClick={() => setDiscountType("percentage")}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase z-10 ${
                        discountType === "percentage"
                          ? "bg-white shadow-sm text-slate-900"
                          : "text-slate-400"
                      }`}
                    >
                      Percentage (%)
                    </button>
                    <button
                      onClick={() => setDiscountType("flat")}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase z-10 ${
                        discountType === "flat"
                          ? "bg-white shadow-sm text-slate-900"
                          : "text-slate-400"
                      }`}
                    >
                      Flat Amount (₹)
                    </button>
                    <motion.div
                      className="absolute top-1.5 bottom-1.5 bg-white rounded-2xl shadow-sm"
                      animate={{
                        left: discountType === "percentage" ? "6px" : "50%",
                        width: "calc(50% - 12px)",
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Coupon Identity
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        placeholder="OFF50"
                        className="flex-1 bg-slate-50 p-4 rounded-2xl text-sm font-bold uppercase outline-none focus:border-indigo-200 transition-all"
                      />
                      <button
                        onClick={generateRandomCode}
                        className="p-4 bg-slate-950 text-white rounded-2xl active:scale-90 transition-all"
                      >
                        <RefreshCw size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Benefit Value
                    </label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={
                        discountType === "percentage" ? "20%" : "₹500"
                      }
                      className="w-full bg-slate-50 p-4 rounded-2xl text-sm font-bold outline-none border border-transparent focus:border-indigo-200"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Quota (Limit)
                    </label>
                    <input
                      type="number"
                      value={limit}
                       onChange={(e) => setLimit(e.target.value)}
                      placeholder="1 for One-time"
                      className="w-full bg-slate-50 p-4 rounded-2xl text-sm font-bold outline-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full bg-slate-50 p-4 rounded-2xl text-sm font-bold outline-none"
                    />
                  </div>
                </div>
              </div>
              <button onClick={handleCreateCoupon} className="w-full py-5 bg-slate-950 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest mt-12 hover:bg-slate-800 transition-all shadow-xl">
                Activate Campaign
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatMini = ({ label, val, color }) => {
  const c = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <div className="bg-white p-7 rounded-4xl border border-slate-100 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
          {label}
        </p>
        <h3 className="text-2xl font-black text-slate-900">{val}</h3>
      </div>
      <div
        className={`size-11 rounded-2xl flex items-center justify-center ${c[color]}`}
      >
        <TrendingUp size={18} />
      </div>
    </div>
  );
};

const Pagination = ({ current, total, setPage }) => (
  <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
      Page {current} of {total}
    </p>
    <div className="flex gap-2">
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={current === 1}
        className="p-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-30"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={() => setPage((p) => Math.min(total, p + 1))}
        disabled={current === total}
        className="p-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-30"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  </div>
);

const InfoRow = ({ label, val, highlight }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-xs font-bold text-slate-400">{label}</span>
    <span
      className={`text-sm font-black ${
        highlight ? "text-emerald-500" : "text-slate-900"
      }`}
    >
      {val}
    </span>
  </div>
);

const DetailItem = ({ icon, label, val, color }) => (
  <div className="flex items-start gap-4">
    <div
      className={`mt-1 ${
        color === "emerald"
          ? "text-emerald-500"
          : color === "indigo"
          ? "text-indigo-500"
          : "text-slate-400"
      }`}
    >
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </p>
      <p className="text-sm font-black text-slate-800 tracking-tight leading-tight">
        {val}
      </p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const s = {
    Active: "bg-emerald-50 text-emerald-600",
    Expired: "bg-red-50 text-red-600",
    Scheduled: "bg-blue-50 text-blue-600",
  };
  return (
    <span
      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${s[status]}`}
    >
      {status}
    </span>
  );
};

export default CouponIntelligence;
