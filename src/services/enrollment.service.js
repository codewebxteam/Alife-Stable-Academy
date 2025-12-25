import { db } from "../firebase/config";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  serverTimestamp,
  increment,
} from "firebase/firestore";

/* ===============================
   🔥 ENROLL COURSE
================================ */
export const enrollCourseFirebase = async (uid, courseId) => {
  if (!uid || !courseId) return;

  const courseRef = doc(
    db,
    "enrollments",
    uid,
    "courses",
    String(courseId)
  );

  const existing = await getDoc(courseRef);
  if (existing.exists()) return;

  await setDoc(courseRef, {
    courseId,
    progress: 0,
    completed: false,
    enrolledAt: serverTimestamp(),
    lastActive: serverTimestamp(),
    lastTime: 0,
  });

  const snap = await getDocs(
    collection(db, "enrollments", uid, "courses")
  );

  await setDoc(
    doc(db, "dashboard", uid),
    {
      stats: {
        enrolledCourses: snap.size,
      },
      meta: {
        updatedAt: serverTimestamp(),
      },
    },
    { merge: true }
  );
};

/* ===============================
   🔥 GET ENROLLMENTS
================================ */
export const getMyEnrollmentsFirebase = async (uid) => {
  if (!uid) return [];

  const snap = await getDocs(
    collection(db, "enrollments", uid, "courses")
  );

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

/* ===============================
   🎯 UPDATE COURSE PROGRESS
================================ */
export const updateEnrollmentProgress = async (
  uid,
  courseId,
  progress,
  lastTime = 0
) => {
  if (!uid || !courseId) return;

  const ref = doc(
    db,
    "enrollments",
    uid,
    "courses",
    String(courseId)
  );

  await updateDoc(ref, {
    progress,
    lastTime,
    completed: progress >= 100,
    lastActive: serverTimestamp(),
  });
};

/* ===============================
   📊 UPDATE DASHBOARD FROM PLAYER
   ✅ ACTIVE HOURS IN SECONDS
================================ */
export const updateDashboardFromLearning = async (
  uid,
  courseId,
  progress,
  secondsWatched = 1
) => {
  if (!uid) return;

  const dashboardRef = doc(db, "dashboard", uid);

  await updateDoc(dashboardRef, {
    "stats.activeHours": increment(secondsWatched), // ✅ SECONDS
    currentCourse: {
      courseId,
      progress,
      updatedAt: serverTimestamp(),
    },
    "meta.lastActive": serverTimestamp(),
    "meta.updatedAt": serverTimestamp(),
  });

  console.log("⏱ Active seconds added:", secondsWatched);
};
