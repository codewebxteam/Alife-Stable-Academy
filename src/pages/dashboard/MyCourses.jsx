import React, { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import CourseCard from "../../components/dashboard/CourseCard";
import { COURSES_DATA } from "../../data/coursesData";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";

const MyCourses = () => {
  const { currentUser } = useAuth();
  const [myCourses, setMyCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!currentUser) return;

    const ref = collection(
      db,
      "users",
      currentUser.uid,
      "enrolledCourses"
    );

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const merged = snapshot.docs
        .map((docSnap) => {
          const data = docSnap.data();
          const course = COURSES_DATA.find(
            (c) => c.id === data.courseId
          );

          if (!course) return null;

          return {
            ...course,
            progress: data.progress,
            completed: data.completed,
            lastActive: data.lastActive?.toDate?.() || null,
          };
        })
        .filter(Boolean);

      setMyCourses(merged);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const filteredCourses = myCourses.filter((course) => {
    if (activeTab === "progress") return course.progress < 100;
    if (activeTab === "completed") return course.progress === 100;
    return true;
  });

  return (
    <div className="space-y-8 pb-10">
      <h1 className="text-3xl font-bold">My Learning</h1>

      <div className="flex gap-6 border-b">
        <button onClick={() => setActiveTab("all")}>All</button>
        <button onClick={() => setActiveTab("progress")}>In Progress</button>
        <button onClick={() => setActiveTab("completed")}>Completed</button>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p>No courses yet</p>
          <Link to="/courses">Explore Courses</Link>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
