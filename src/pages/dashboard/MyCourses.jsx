import React, { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { COURSES_DATA } from "../../data/coursesData";
import { getMyEnrollmentsFirebase } from "../../services/enrollment.service";
import CourseCard from "../../components/dashboard/CourseCard";

const MyCourses = () => {
  const { currentUser } = useAuth();
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const load = async () => {
      console.log("🟢 UID:", currentUser.uid);
      const enrollments = await getMyEnrollmentsFirebase(
        currentUser.uid
      );

      const merged = enrollments
        .map((e) => {
          const course = COURSES_DATA.find(
            (c) => c.id === e.courseId
          );

          if (!course) return null;

          return {
            ...course,
            progress: e.progress ?? 0,
            completed: e.completed ?? false,
            lastActive: e.lastActive?.seconds
              ? e.lastActive.seconds * 1000
              : Date.now(),
          };
        })
        .filter(Boolean);

      console.log("🧠 FINAL COURSES:", merged);
      setMyCourses(merged);
    };

    load();
  }, [currentUser]);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Learning</h1>

        <div className="flex gap-2">
          <Search />
          <Filter />
        </div>
      </div>

      {myCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCourses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border">
          <p className="mb-4 text-slate-500">
            You haven't enrolled in any courses yet.
          </p>
          <Link
            to="/courses"
            className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold"
          >
            Explore Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
