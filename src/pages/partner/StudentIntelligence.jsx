import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  BookOpen,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Activity,
  Hash,
  ShieldCheck,
  Download,
  CheckCircle2,
  Award,
  AlertCircle,
  PlayCircle,
  Filter,
  ChevronDown,
} from "lucide-react";

// --- DYNAMIC DATA ENGINE ---
const STUDENT_RECORDS = [
  {
    id: "STU-1001",
    name: "Aryan Sharma",
    email: "aryan@example.com",
    phone: "+91 98765 43210",
    joinDate: "20 Dec 2025",
    status: "Active",
    learningState: "Completed",
    certStatus: "Issued",
    progress: 100,
    assets: [
      {
        name: "React Pro Mastery",
        type: "Course",
        price: "2499",
        date: "20 Dec 2025",
      },
      {
        name: "Tailwind Guide",
        type: "E-Book",
        price: "499",
        date: "21 Dec 2025",
      },
    ],
  },
  {
    id: "STU-1002",
    name: "Sanya Iyer",
    email: "sanya@example.com",
    phone: "+91 88776 55443",
    joinDate: "18 Dec 2025",
    status: "Active",
    learningState: "In-Progress",
    certStatus: "N/A",
    progress: 65,
    assets: [
      {
        name: "UI/UX Bootcamp",
        type: "Course",
        price: "4999",
        date: "18 Dec 2025",
      },
    ],
  },
  {
    id: "STU-1003",
    name: "Vikram Raj",
    email: "vikram@example.com",
    phone: "+91 70045 12345",
    joinDate: "15 Dec 2025",
    status: "Active",
    learningState: "Completed",
    certStatus: "Pending",
    progress: 100,
    assets: [
      {
        name: "Python for AI",
        type: "Course",
        price: "4500",
        date: "15 Dec 2025",
      },
    ],
  },
  {
    id: "STU-1004",
    name: "Priya Das",
    email: "priya.das@live.com",
    phone: "+91 91223 34455",
    joinDate: "10 Dec 2023",
    status: "Active",
    learningState: "Not Started",
    certStatus: "N/A",
    progress: 0,
    assets: [
      {
        name: "Node.js Mastery",
        type: "Course",
        price: "3200",
        date: "10 Dec 2023",
      },
    ],
  },
  {
    id: "STU-1005",
    name: "Rahul Roy",
    email: "rahul.roy@gmail.com",
    phone: "+91 88990 11223",
    joinDate: "05 Dec 2023",
    status: "Active",
    learningState: "In-Progress",
    certStatus: "N/A",
    progress: 92,
    assets: [
      {
        name: "Modern CSS",
        type: "Course",
        price: "1500",
        date: "05 Dec 2023",
      },
      {
        name: "JS Pocket Book",
        type: "E-Book",
        price: "199",
        date: "06 Dec 2023",
      },
    ],
  },
];

const StudentIntelligence = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [globalTime, setGlobalTime] = useState("7D");
  const [customDates, setCustomDates] = useState({ start: "", end: "" }); // ✨ Custom Date State
  const [auditFilter, setAuditFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredStudents = useMemo(() => {
    return STUDENT_RECORDS.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAudit =
        auditFilter === "All" ||
        (auditFilter === "Completed" && s.learningState === "Completed") ||
        (auditFilter === "InProgress" && s.learningState === "In-Progress") ||
        (auditFilter === "NotStarted" && s.learningState === "Not Started") ||
        (auditFilter === "PendingCert" && s.certStatus === "Pending") ||
        (auditFilter === "IssuedCert" && s.certStatus === "Issued");
      return matchesSearch && matchesAudit;
    }).sort((a, b) => b.id.localeCompare(a.id));
  }, [searchQuery, auditFilter]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const currentData = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* --- HEADER & GLOBAL FILTER --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
              Student Intelligence
            </h1>
            <p className="text-sm text-slate-400 font-medium italic">
              Lifecycle Auditing & Enrollment Data Center
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            {/* ✨ CUSTOM DATE PICKER LOGIC ✨ */}
            <AnimatePresence>
              {globalTime === "Custom" && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  className="flex items-center gap-2 px-2 border-r border-slate-100 mr-2 overflow-hidden"
                >
                  <input
                    type="date"
                    className="text-[10px] font-bold p-1.5 bg-slate-50 rounded-lg outline-none border-none"
                    onChange={(e) =>
                      setCustomDates({ ...customDates, start: e.target.value })
                    }
                  />
                  <span className="text-slate-300 text-[10px] font-black uppercase tracking-tighter">
                    To
                  </span>
                  <input
                    type="date"
                    className="text-[10px] font-bold p-1.5 bg-slate-50 rounded-lg outline-none border-none"
                    onChange={(e) =>
                      setCustomDates({ ...customDates, end: e.target.value })
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <select
                value={globalTime}
                onChange={(e) => setGlobalTime(e.target.value)}
                className="appearance-none bg-slate-900 text-white py-2.5 pl-10 pr-10 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
              >
                {["Today", "7D", "30D", "Year", "Custom"].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <Filter
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={14}
              />
            </div>
          </div>
        </div>

        {/* --- KPI GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Course Completed"
            val="42"
            icon={<CheckCircle2 />}
            color="emerald"
            onClick={() => setAuditFilter("Completed")}
            active={auditFilter === "Completed"}
          />
          <KPICard
            title="Pending Certificates"
            val="08"
            icon={<Award />}
            color="orange"
            onClick={() => setAuditFilter("PendingCert")}
            active={auditFilter === "PendingCert"}
          />
          <KPICard
            title="Active Learning"
            val="124"
            icon={<PlayCircle />}
            color="blue"
            onClick={() => setAuditFilter("InProgress")}
            active={auditFilter === "InProgress"}
          />
          <KPICard
            title="Yet to Start"
            val="15"
            icon={<AlertCircle />}
            color="indigo"
            onClick={() => setAuditFilter("NotStarted")}
            active={auditFilter === "NotStarted"}
          />
        </div>

        {/* --- STUDENT MASTER LEDGER --- */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                Audit Ledger
              </h3>
              <select
                value={auditFilter}
                onChange={(e) => setAuditFilter(e.target.value)}
                className="bg-slate-50 border-none text-[10px] font-black uppercase px-4 py-2 rounded-xl outline-none text-slate-500"
              >
                <option value="All">All Students</option>
                <option value="Completed">Completed</option>
                <option value="InProgress">In Progress</option>
                <option value="NotStarted">Not Started</option>
                <option value="PendingCert">Pending Certificates</option>
                <option value="IssuedCert">Issued Certificates</option>
              </select>
            </div>

            <div className="flex-1 max-w-sm flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search Identity..."
                className="bg-transparent border-none outline-none text-xs font-bold w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto min-h-[450px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-10 py-6">Identity / ID</th>
                  {/* ✨ UPDATED PURCHASES COLUMN ✨ */}
                  <th className="px-10 py-6 text-center">Purchases (C / E)</th>
                  <th className="px-10 py-6 text-center">Learning Progress</th>
                  <th className="px-10 py-6 text-center">Certificate</th>
                  <th className="px-10 py-6 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentData.map((student) => (
                  <tr
                    key={student.id}
                    className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-4">
                        <div className="size-11 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-black text-xs uppercase">
                          {student.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 tracking-tight">
                            {student.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                            {student.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* ✨ ASSET COUNT MIX ✨ */}
                    <td className="px-10 py-7">
                      <div className="flex items-center justify-center gap-2">
                        <span className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black tracking-tighter">
                          <GraduationCap size={12} />{" "}
                          {
                            student.assets.filter((a) => a.type === "Course")
                              .length
                          }
                        </span>
                        <span className="flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-black tracking-tighter">
                          <BookOpen size={12} />{" "}
                          {
                            student.assets.filter((a) => a.type === "E-Book")
                              .length
                          }
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          {student.learningState} ({student.progress}%)
                        </span>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${student.progress}%` }}
                            className="h-full bg-indigo-500"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7 text-center">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          student.certStatus === "Issued"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : student.certStatus === "Pending"
                            ? "bg-orange-50 text-orange-600 border-orange-100"
                            : "bg-slate-50 text-slate-400 border-slate-100"
                        }`}
                      >
                        {student.certStatus}
                      </span>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <Eye
                        size={18}
                        className="inline text-slate-300 group-hover:text-slate-950 transition-colors"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Page {currentPage} Out of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPage((p) => Math.max(1, p - 1));
                }}
                disabled={currentPage === 1}
                className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-20"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                }}
                disabled={currentPage === totalPages}
                className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-20"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL: STUDENT POPUP --- */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[48px] p-8 sm:p-12 shadow-2xl relative z-10 overflow-y-auto max-h-[90vh] no-scrollbar"
            >
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-6">
                  <div className="size-20 rounded-[32px] bg-slate-950 text-white flex items-center justify-center text-3xl font-black">
                    {selectedStudent.name[0]}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                      {selectedStudent.name}
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">
                      Audit ID: {selectedStudent.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-3 bg-slate-50 rounded-2xl text-slate-400"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b pb-4">
                  Enrolled Assets Intelligence
                </p>
                <div className="space-y-4">
                  {selectedStudent.assets.map((asset, i) => (
                    <div
                      key={i}
                      className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`size-12 rounded-2xl flex items-center justify-center ${
                            asset.type === "Course"
                              ? "bg-indigo-100 text-indigo-600"
                              : "bg-orange-100 text-orange-600"
                          }`}
                        >
                          {asset.type === "Course" ? (
                            <GraduationCap size={20} />
                          ) : (
                            <BookOpen size={20} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">
                            {asset.name}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            Purchased: {asset.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">
                          ₹{asset.price}
                        </p>
                        <p className="text-[9px] font-black text-emerald-500 uppercase">
                          Confirmed
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <DetailBox label="Contact Feed" icon={<Mail size={14} />}>
                  <p className="text-xs font-black text-slate-900 break-all">
                    {selectedStudent.email}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                    {selectedStudent.phone}
                  </p>
                </DetailBox>
                <DetailBox
                  label="Lifecycle State"
                  icon={<ShieldCheck size={14} />}
                >
                  <p className="text-sm font-black text-emerald-500 uppercase tracking-tight">
                    {selectedStudent.learningState} ({selectedStudent.progress}
                    %)
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                    Certificate: {selectedStudent.certStatus}
                  </p>
                </DetailBox>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full py-6 bg-slate-950 text-white rounded-[32px] text-[11px] font-black uppercase tracking-[0.3em] active:scale-95 shadow-xl transition-all"
              >
                Close Intelligence Audit
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- HELPERS ---
const KPICard = ({ title, val, icon, color, onClick, active }) => {
  const styles = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
  };
  return (
    <button
      onClick={onClick}
      className={`text-left bg-white p-7 rounded-[36px] border shadow-sm transition-all ${
        active ? "ring-2 ring-slate-950 scale-95" : "border-slate-100"
      }`}
    >
      <div
        className={`size-12 rounded-2xl flex items-center justify-center mb-6 ${styles[color]}`}
      >
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
        {title}
      </p>
      <h3 className="text-2xl font-black text-slate-900 tracking-tighter">
        {val}
      </h3>
    </button>
  );
};

const DetailBox = ({ label, icon, children }) => (
  <div className="bg-slate-50 p-7 rounded-[32px] border border-slate-100">
    <div className="flex items-center gap-2 mb-4">
      <div className="size-6 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm">
        {icon}
      </div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </p>
    </div>
    {children}
  </div>
);

const StatusBadge = ({ status }) => {
  const s = {
    Active: "bg-emerald-50 text-emerald-600",
    Blocked: "bg-red-50 text-red-600",
  };
  return (
    <span
      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${s[status]}`}
    >
      {status}
    </span>
  );
};

export default StudentIntelligence;
