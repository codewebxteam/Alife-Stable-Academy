import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  Globe,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ChevronDown,
  GraduationCap,
  Zap,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config"; // Ensure path is correct based on your folder structure
import StudentProfile from "../partner/StudentProfile"; // Reusing the profile component

const StudentData = () => {
  // --- STATE ---
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Filters
  const [timeFilter, setTimeFilter] = useState("All Time");
  const [customDates, setCustomDates] = useState({ start: "", end: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- 1. FETCH REAL DATA FROM BACKEND ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // A. Fetch All Users (Students)
        const usersSnap = await getDocs(collection(db, "users"));
        const usersMap = {};

        usersSnap.docs.forEach((doc) => {
          const data = doc.data();
          // Only process if user is a student (optional check depending on your auth structure)
          if (!data.role || data.role === "student") {
            usersMap[data.email] = {
              id: doc.id,
              name: data.displayName || data.name || "Unknown",
              email: data.email,
              phone: data.phoneNumber || data.phone || "N/A",
              location: data.location || "N/A",
              joinDate: data.createdAt?.toDate
                ? data.createdAt.toDate()
                : new Date(),
              source: "Direct", // Default to Direct
              partnerName: null,
              status: data.status || "Active",
              courses: [],
              transactions: [],
              certificates: [],
              totalSpent: 0,
            };
          }
        });

        // B. Fetch All Orders to Link Courses & Determine Source
        const ordersSnap = await getDocs(
          query(collection(db, "orders"), orderBy("createdAt", "desc"))
        );

        ordersSnap.docs.forEach((doc) => {
          const order = doc.data();
          const email = order.studentEmail;

          // If user exists in map, enrich data. If not (maybe guest checkout?), create entry.
          if (!usersMap[email]) {
            usersMap[email] = {
              id: `GUEST-${doc.id.slice(0, 5)}`,
              name: order.studentName || "Guest Student",
              email: email,
              phone: order.studentPhone || "N/A",
              location: "N/A",
              joinDate: order.createdAt?.toDate
                ? order.createdAt.toDate()
                : new Date(),
              source: "Direct",
              partnerName: null,
              status: "Active",
              courses: [],
              transactions: [],
              certificates: [],
              totalSpent: 0,
            };
          }

          // 1. Add Transaction
          usersMap[email].transactions.push({
            id: doc.id,
            asset: order.courseTitle || order.productTitle || "Asset",
            date: order.createdAt?.toDate
              ? order.createdAt.toDate().toLocaleDateString("en-IN")
              : "N/A",
            amount: order.sellingPrice || order.amount,
          });

          // 2. Add Course to Portfolio (Avoid duplicates)
          const courseName = order.courseTitle || order.productTitle;
          if (
            courseName &&
            !usersMap[email].courses.some((c) => c.name === courseName)
          ) {
            usersMap[email].courses.push({
              name: courseName,
              type: order.productType || "Course",
              // We don't have progress in orders, so default to 0 or derive from another collection if available
              progress: 0,
              certificateIssued: false,
            });
          }

          // 3. Determine Source (If order has partnerId, they are Partner acquired)
          if (order.partnerId) {
            usersMap[email].source = "Partner";
            usersMap[email].partnerName = order.agencyName || "Unknown Partner"; // Ensure agencyName is saved in orders
          }

          // 4. Calc Total Spent
          usersMap[email].totalSpent += Number(
            order.sellingPrice || order.amount || 0
          );
        });

        // Convert Map to Array & Sort by Join Date
        const processedStudents = Object.values(usersMap).sort(
          (a, b) => b.joinDate - a.joinDate
        );
        setStudents(processedStudents);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 2. EXPORT TO CSV ---
  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Email,Phone,Source,Join Date,Total Spent,Courses Enrolled\n" +
      filteredData
        .map(
          (s) =>
            `"${s.name}","${s.email}","${s.phone}","${
              s.source
            }","${s.joinDate.toLocaleDateString()}","${s.totalSpent}","${
              s.courses.length
            }"`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  // --- 3. FILTER LOGIC ---
  const filteredData = useMemo(() => {
    let data = students;
    const now = new Date();

    // Time Filter
    if (timeFilter !== "All Time") {
      data = data.filter((s) => {
        const sDate = new Date(s.joinDate);
        if (timeFilter === "Today") {
          return sDate.toDateString() === now.toDateString();
        }
        if (timeFilter === "Week") {
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          return sDate >= weekAgo;
        }
        if (timeFilter === "Month") {
          return (
            sDate.getMonth() === now.getMonth() &&
            sDate.getFullYear() === now.getFullYear()
          );
        }
        if (timeFilter === "Year") {
          return sDate.getFullYear() === now.getFullYear();
        }
        if (timeFilter === "Custom" && customDates.start && customDates.end) {
          return (
            sDate >= new Date(customDates.start) &&
            sDate <= new Date(customDates.end)
          );
        }
        return true;
      });
    }

    // Search & Source Filter
    return data.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSource = sourceFilter === "All" || s.source === sourceFilter;

      return matchesSearch && matchesSource;
    });
  }, [students, timeFilter, customDates, searchQuery, sourceFilter]);

  // --- PAGINATION ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- MACRO METRICS ---
  const metrics = useMemo(
    () => ({
      total: filteredData.length,
      active: filteredData.filter((s) => s.status === "Active").length,
      direct: filteredData.filter((s) => s.source === "Direct").length,
      partner: filteredData.filter((s) => s.source === "Partner").length,
    }),
    [filteredData]
  );

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 size={40} className="text-indigo-600 animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Loading Student Universe...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* --- HEADER --- */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
              Student Universe
            </h1>
            <p className="text-sm text-slate-400 font-medium italic">
              Global Learning & Acquisition Data
            </p>
          </div>

          <div className="flex items-center bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
            <Calendar size={16} className="text-slate-400 mr-3" />
            {timeFilter === "Custom" && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                className="flex items-center gap-2 border-r border-slate-100 mr-3 pr-3"
              >
                <input
                  type="date"
                  className="text-[10px] font-bold outline-none bg-slate-50 p-1.5 rounded-lg"
                  onChange={(e) =>
                    setCustomDates({ ...customDates, start: e.target.value })
                  }
                />
                <span className="text-[9px] font-black text-slate-300">TO</span>
                <input
                  type="date"
                  className="text-[10px] font-bold outline-none bg-slate-50 p-1.5 rounded-lg"
                  onChange={(e) =>
                    setCustomDates({ ...customDates, end: e.target.value })
                  }
                />
              </motion.div>
            )}
            <div className="relative">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="appearance-none bg-transparent text-xs font-black uppercase text-slate-700 outline-none pr-8 cursor-pointer"
              >
                {["All Time", "Today", "Week", "Month", "Year", "Custom"].map(
                  (t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  )
                )}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* --- METRICS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            label="Total Enrolled"
            val={metrics.total}
            sub="In Selected Period"
            icon={<Users />}
            color="blue"
          />
          <KPICard
            label="Active Learners"
            val={metrics.active}
            sub="Currently Engaging"
            icon={<Zap />}
            color="emerald"
          />
          <KPICard
            label="Direct Acquisition"
            val={metrics.direct}
            sub="Self-Onboarded"
            icon={<Globe />}
            color="indigo"
          />
          <KPICard
            label="Partner Driven"
            val={metrics.partner}
            sub="Via Channel Partners"
            icon={<Users />}
            color="orange"
          />
        </div>

        {/* --- STUDENT LEDGER --- */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="size-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                <GraduationCap size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase">
                Student Ledger
              </h3>
            </div>

            {/* FILTERS */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                <Filter size={14} className="text-slate-400" />
                <select
                  value={sourceFilter}
                  onChange={(e) => {
                    setSourceFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-[10px] font-black uppercase outline-none text-slate-600 cursor-pointer"
                >
                  <option value="All">All Sources</option>
                  <option value="Direct">Direct Only</option>
                  <option value="Partner">Partner Only</option>
                </select>
              </div>
              <div className="flex-1 md:w-64 flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-xl border border-slate-100 focus-within:border-indigo-300 transition-all">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Student..."
                  className="bg-transparent text-xs font-bold outline-none w-full placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button
                onClick={handleExport}
                className="flex items-center justify-center size-10 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-200 hover:scale-105 transition-all"
                title="Download Excel Report"
              >
                <FileSpreadsheet size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Identity</th>
                  <th className="px-8 py-5">Acquisition Source</th>
                  <th className="px-8 py-5 text-center">Portfolio</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentItems.length > 0 ? (
                  currentItems.map((s) => (
                    <tr
                      key={s.id}
                      className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                      onClick={() => setSelectedStudent(s)}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="size-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs uppercase">
                            {s.name[0]}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900">
                              {s.name}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400">
                              {s.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {s.source === "Direct" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase">
                            <Globe size={10} /> Direct
                          </span>
                        ) : (
                          <div className="flex flex-col">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-black uppercase w-fit">
                              <Users size={10} /> Partner
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 mt-1 pl-1">
                              {s.partnerName}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                            {s.courses.length} Courses
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent(s);
                          }}
                          className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[9px] font-black uppercase hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-10 text-center">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        No students found matching filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-slate-50 flex justify-between items-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- STUDENT PROFILE MODAL --- */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <StudentProfile
              student={selectedStudent}
              onClose={() => setSelectedStudent(null)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- HELPER ---
const KPICard = ({ label, val, sub, icon, color }) => {
  const styles = {
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    indigo: "text-indigo-600 bg-indigo-50",
    orange: "text-orange-600 bg-orange-50",
  };
  return (
    <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div
        className={`size-12 rounded-2xl flex items-center justify-center mb-4 ${styles[color]}`}
      >
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </p>
      <h3 className="text-2xl font-black text-slate-900 mt-1">{val}</h3>
      <p className="text-[10px] font-bold text-slate-400 mt-1">{sub}</p>
    </div>
  );
};

export default StudentData;
