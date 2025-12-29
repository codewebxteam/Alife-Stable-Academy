import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { doc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

const CourseContext = createContext();

export const useCourse = () => useContext(CourseContext);

export const CourseProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const updateTimeoutRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      const docRef = doc(db, "enrolledCourses", currentUser.uid);
      
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setEnrolledCourses(docSnap.data().courses || []);
        } else {
          setEnrolledCourses([]);
        }
      });
      
      return () => unsubscribe();
    } else {
      setEnrolledCourses([]);
    }
  }, [currentUser]);

  const loadEnrolledCourses = async () => {
    if (!currentUser) return;
    try {
      const docRef = doc(db, "enrolledCourses", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEnrolledCourses(docSnap.data().courses || []);
      }
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  const enrollCourse = async (course) => {
    if (!currentUser) return;
    
    const courseId = String(course.id || course.courseId || "");
    const alreadyEnrolled = enrolledCourses.some(c => c.courseId === courseId);
    if (alreadyEnrolled) {
      throw new Error("Already enrolled in this course");
    }
    
    const newCourse = {
      courseId,
      title: String(course.title || "Untitled Course"),
      image: String(course.image || course.thumbnail || ""),
      instructor: String(course.instructor || "Unknown"),
      progress: 0,
      status: "in-progress",
      enrolledAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
      videoProgress: 0,
      totalDuration: String(course.duration || "0 hours"),
      watchedDuration: 0,
      price: String(course.price || "Free"),
      category: String(course.category || "General"),
      lectures: String(course.lectures || "0"),
      rating: Number(course.rating || 0),
      level: String(course.level || "Beginner"),
      videoUrl: String(course.videoUrl || ""),
      youtubeId: String(course.youtubeId || course.videoId || "")
    };

    const updatedCourses = [...enrolledCourses, newCourse];
    setEnrolledCourses(updatedCourses);
    
    const docRef = doc(db, "enrolledCourses", currentUser.uid);
    await setDoc(docRef, { courses: updatedCourses }, { merge: true });
  };

  const updateCourseProgress = useCallback(async (courseId, progress, watchedDuration) => {
    if (!currentUser) return;
    
    setEnrolledCourses(prevCourses => {
      const updatedCourses = prevCourses.map(course => {
        if (course.courseId === courseId) {
          return {
            ...course,
            progress: Math.min(Math.round(progress), 100),
            watchedDuration: watchedDuration,
            status: progress >= 100 ? "completed" : "in-progress",
            lastAccessed: new Date().toISOString()
          };
        }
        return course;
      });

      // Debounce Firebase update
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      updateTimeoutRef.current = setTimeout(async () => {
        try {
          const docRef = doc(db, "enrolledCourses", currentUser.uid);
          await updateDoc(docRef, { courses: updatedCourses });
        } catch (error) {
          console.error("Error updating progress:", error);
        }
      }, 3000);

      return updatedCourses;
    });
  }, [currentUser]);

  const isEnrolled = useCallback((courseId) => {
    return enrolledCourses.some(course => course.courseId === courseId);
  }, [enrolledCourses]);

  const getCourseProgress = useCallback((courseId) => {
    const course = enrolledCourses.find(c => c.courseId === courseId);
    return course ? course.progress : 0;
  }, [enrolledCourses]);

  const getEnrolledCourse = useCallback((courseId) => {
    return enrolledCourses.find(c => c.courseId === courseId);
  }, [enrolledCourses]);

  return (
    <CourseContext.Provider value={{ 
      enrolledCourses, 
      enrollCourse, 
      updateCourseProgress,
      isEnrolled,
      getCourseProgress,
      getEnrolledCourse
    }}>
      {children}
    </CourseContext.Provider>
  );
};
