import React, { useState, useEffect } from "react";
import { Award, Download, Lock, PlayCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

const Certificates = () => {
  const { currentUser } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchCertificates();
    }
  }, [currentUser]);

  const fetchCertificates = async () => {
    try {
      // Get enrolled courses with progress from My Courses
      const enrolledDoc = await getDoc(doc(db, "enrolledCourses", currentUser.uid));
      const enrolledCourses = enrolledDoc.exists() ? enrolledDoc.data().courses || [] : [];

      // Create certificates data from enrolled courses
      const certsData = enrolledCourses.map(course => {
        return {
          id: course.courseId,
          courseTitle: course.title,
          instructor: course.instructor || "Platform Instructor",
          issueDate: course.progress === 100 ? new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null,
          progress: course.progress || 0,
          certificateId: course.progress === 100 ? `CERT-${course.courseId.slice(0, 8).toUpperCase()}` : null,
          status: course.status
        };
      });

      setCertificates(certsData);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Certificates</h1>
        <p className="text-slate-500 mt-1">
          Track your achievements and download credentials.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5edff4]"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {certificates.length > 0 ? (
            certificates.map((cert) => (
              <CertificateCard key={cert.id} data={cert} />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
              <Award size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                No Certificates Yet
              </h3>
              <p className="text-slate-500 mb-6">
                Purchase and complete videos to earn certificates
              </p>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#5edff4] text-slate-900 rounded-xl font-bold hover:bg-[#4ecee4] transition-all"
              >
                Browse Videos <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Component to handle Logic (Locked vs Unlocked)
const CertificateCard = ({ data }) => {
  const isUnlocked = data.progress === 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative border rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm transition-all
        ${
          isUnlocked
            ? "bg-white border-slate-200"
            : "bg-slate-50 border-slate-200 opacity-90"
        }
      `}
    >
      {/* 1. Certificate Thumbnail / Icon Area */}
      <div className="w-full md:w-64 aspect-4/3 rounded-xl flex items-center justify-center border relative overflow-hidden shrink-0">
        {isUnlocked ? (
          // Unlocked State Style
          <div className="bg-slate-100 w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2 border-slate-200">
            <Award className="size-12 text-[#5edff4]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Verified
            </span>
          </div>
        ) : (
          // Locked State Style
          <div className="bg-slate-200/50 w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
            <div className="p-3 bg-slate-300/50 rounded-full mb-1">
              <Lock className="size-8 text-slate-500" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Locked
            </span>
          </div>
        )}
      </div>

      {/* 2. Content Area */}
      <div className="flex-1 text-center md:text-left w-full">
        {/* Status Badge */}
        <div className="mb-2 flex justify-center md:justify-start">
          {isUnlocked ? (
            <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wide border border-green-100">
              Completed
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wide border border-slate-300">
              In Progress ({data.progress}%)
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-1">
          {data.courseTitle}
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Instructor: {data.instructor}
        </p>

        {isUnlocked ? (
          // === ACTION: Download (If Unlocked) ===
          <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
            <div className="text-xs text-slate-400 font-medium mb-2 md:mb-0 md:mr-auto mt-2">
              Issued on:{" "}
              <span className="text-slate-700">{data.issueDate}</span>
            </div>
            <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-[#5edff4] hover:text-slate-900 transition-all shadow-lg hover:shadow-[#5edff4]/20 flex items-center gap-2 cursor-pointer">
              <Download className="size-4" /> Download PDF
            </button>
          </div>
        ) : (
          // === ACTION: Resume (If Locked) ===
          <div className="w-full">
            {/* Progress Bar */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-400 rounded-full"
                  style={{ width: `${data.progress}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-500">
                {data.progress}%
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <p className="text-xs text-slate-400">
                Complete the course to unlock your certificate.
              </p>
              <Link
                to="/dashboard/my-courses"
                className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center gap-2"
              >
                <PlayCircle className="size-4" /> Resume Learning
              </Link>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Certificates;
