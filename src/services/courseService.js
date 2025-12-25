// src/services/courseService.js

const STORAGE_KEY = "my_courses";

// 🔹 Get all enrolled courses
export const getMyCourses = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// 🔹 Enroll in a course
export const enrollCourse = (courseId) => {
  const courses = getMyCourses();

  // prevent duplicate enroll
  if (courses.some((c) => c.courseId === courseId)) return;

  courses.push({
    courseId,
    progress: 0,
    completed: false,
    lastActive: Date.now(),
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
};

// 🔹 Update progress (future use)
export const updateProgress = (courseId, progress) => {
  const courses = getMyCourses().map((c) =>
    c.courseId === courseId
      ? {
          ...c,
          progress,
          completed: progress === 100,
          lastActive: Date.now(),
        }
      : c
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
};
