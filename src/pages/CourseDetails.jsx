import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCourse } from "../context/CourseContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { Loader2, FileText, Download, Lock } from "lucide-react";

// Components
import CourseHero from "../components/course-details/CourseHero";
import Curriculum from "../components/course-details/Curriculum";
import PricingCard from "../components/course-details/PricingCard";
import AuthModal from "../components/AuthModal";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { enrollCourse, isEnrolled } = useCourse(); // [UPDATED] Get isEnrolled
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // [NEW] Check if user owns the course
  const userHasAccess = course ? isEnrolled(course.id) : false;

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const docRef = doc(db, "courseVideos", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCourse({
            id: docSnap.id,
            ...data,
            // [UPDATED] Defaults: Replaced "Alife Academy" with "Mentor"
            instructor: data.instructor || "Mentor",
            rating: data.rating || 4.8,
            reviews: data.reviews || 120,
            students: data.students || 1500,
            lectures: data.lectures || "1 Module",
            duration: data.duration || "Self-paced",
            category: data.category || "General",
            image:
              data.image ||
              (data.videoId
                ? `https://img.youtube.com/vi/${data.videoId}/maxresdefault.jpg`
                : "https://placehold.co/800x400"),
            description:
              data.description ||
              "Unlock your potential with this comprehensive course designed for all levels. Learn at your own pace and master new skills.",
            instructorBio:
              "Experienced mentor providing top-tier education and guidance in the industry.",
            syllabusContent: data.syllabus || "No syllabus provided.",
            driveLink: data.driveLink || "",
          });
        } else {
          setError("Course not found");
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleEnroll = async () => {
    if (currentUser) {
      try {
        await enrollCourse(course);
        navigate("/dashboard/my-courses");
      } catch (error) {
        console.error("Enrollment error:", error);
        alert(error.message || "Enrollment failed. Please try again.");
      }
    } else {
      setIsAuthOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="size-10 text-[#5edff4] animate-spin" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Oops! Course not found.
        </h2>
        <button
          onClick={() => navigate("/courses")}
          className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold"
        >
          Browse All Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* 1. Hero Section */}
      <CourseHero course={course} />

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* 2. Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About Course */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                About this Course
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                <p>{course.description}</p>
              </div>
            </div>

            {/* Study Material Section (Only if Link Exists) */}
            {course.driveLink && (
              <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="size-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Study Material & Notes
                    </h2>
                    <p className="text-sm text-slate-500">
                      Supplementary resources for this course
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Course Resources Bundle
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Includes PDF notes, assignments, and source code.
                    </p>
                  </div>

                  {userHasAccess ? (
                    <a
                      href={course.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                      <Download size={16} /> Download
                    </a>
                  ) : (
                    <button
                      disabled
                      className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-400 rounded-xl font-bold text-sm cursor-not-allowed"
                    >
                      <Lock size={16} /> Enroll to Access
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Curriculum */}
            <Curriculum course={course} syllabus={course.syllabusContent} />

            {/* Instructor */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Meet your Instructor
              </h2>
              <div className="flex items-start gap-6">
                <div className="size-16 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center font-bold text-2xl text-slate-400">
                  {course.instructor[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {course.instructor}
                  </h3>
                  <p className="text-sm text-[#0891b2] font-medium mb-4">
                    Senior Mentor
                  </p>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {course.instructorBio}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Sidebar (Pricing Card) */}
          <div className="lg:col-span-1 relative">
            <div className="sticky top-24">
              <PricingCard
                course={course}
                onEnroll={handleEnroll}
                isEnrolled={userHasAccess} // [IMPORTANT] Pass Enrolled Status
              />
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultMode="login"
      />
    </div>
  );
};

export default CourseDetails;
