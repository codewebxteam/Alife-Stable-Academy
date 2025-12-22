import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Check, UserCheck, Star, Globe } from "lucide-react";
import { COURSES_DATA } from "../data/coursesData";
import { useAuth } from "../context/AuthContext"; // [NEW] Import Auth Context

// Components
import CourseHero from "../components/course-details/CourseHero";
import Curriculum from "../components/course-details/Curriculum";
import PricingCard from "../components/course-details/PricingCard";
import AuthModal from "../components/AuthModal";

const CourseDetails = () => {
  const { id } = useParams();
  const course =
    COURSES_DATA.find((c) => c.id.toString() === id) || COURSES_DATA[0];

  // [NEW] Real Auth State
  const { currentUser } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // [NEW] Smart Enroll Handler
  const handleEnroll = () => {
    if (currentUser) {
      // 1. User IS Logged In -> Process Enrollment
      alert(
        `🎉 Successfully enrolled in ${course.title}!\n\nWelcome aboard, ${currentUser.displayName}!`
      );
      // TODO: In future, save this to Firestore 'users' collection
    } else {
      // 2. User IS NOT Logged In -> Open Login Modal
      setIsAuthOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* 1. Hero Section */}
      <CourseHero course={course} />

      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="grid lg:grid-cols-3 gap-12 relative">
          {/* 2. Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Learning Points */}
            <div className="bg-white border border-slate-200 p-8 rounded-3xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                What you'll learn
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {course.learningPoints &&
                  course.learningPoints.map((point, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <Check className="size-5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600 leading-relaxed">
                        {point}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Syllabus */}
            {course.syllabus && <Curriculum syllabus={course.syllabus} />}

            {/* Requirements */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Requirements
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm marker:text-[#5edff4]">
                <li>Access to a computer with an internet connection.</li>
                <li>No prior programming experience needed.</li>
                <li>A willingness to learn and practice coding daily.</li>
              </ul>
            </div>

            {/* Instructor */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Instructor
              </h2>
              <div>
                <h3 className="text-lg font-bold text-[#0891b2] underline underline-offset-4 decoration-[#5edff4] mb-1">
                  {course.instructor}
                </h3>
                <p className="text-slate-500 text-sm mb-4">{course.role}</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="size-24 rounded-full overflow-hidden border-4 border-slate-100 shadow-lg shrink-0">
                    <img
                      src={`https://ui-avatars.com/api/?name=${course.instructor}&background=random`}
                      alt=""
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="space-y-2 text-xs font-bold text-slate-600">
                    <div className="flex gap-2 items-center">
                      <UserCheck className="size-4" />{" "}
                      {course.students
                        ? course.students.toLocaleString()
                        : "10k"}{" "}
                      Students
                    </div>
                    <div className="flex gap-2 items-center">
                      <Star className="size-4" /> {course.rating} Rating
                    </div>
                    <div className="flex gap-2 items-center">
                      <Globe className="size-4" /> 12 Courses
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {course.instructorBio}
                </p>
              </div>
            </div>
          </div>

          {/* 3. Sidebar (Pricing Card) */}
          <div className="lg:col-span-1 relative">
            <PricingCard
              course={course}
              onEnroll={handleEnroll} // Pass the smart handler
            />
          </div>
        </div>
      </div>

      {/* Auth Modal (Triggered if not logged in) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultMode="login"
      />
    </div>
  );
};

export default CourseDetails;
