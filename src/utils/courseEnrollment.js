import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export const updateDashboardFromLearning = async (
  uid,
  courseId,
  progress,
  watchedSeconds
) => {
  if (!uid) return;

  const dashboardRef = doc(db, "dashboard", uid);
  const snap = await getDoc(dashboardRef);

  if (!snap.exists()) return;

  const data = snap.data();

  // 🗓️ find today index (M,T,W,T,F,S,S)
  const today = new Date();
  const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;

  const watchedHours = watchedSeconds / 3600;

  // clone activity safely
  const updatedActivity = [...data.activity];
  updatedActivity[dayIndex] = {
    ...updatedActivity[dayIndex],
    hours: Number(
      (updatedActivity[dayIndex].hours + watchedHours).toFixed(2)
    ),
  };

  await updateDoc(dashboardRef, {
    currentCourse: {
      courseId,
      progress,
      lastWatchedAt: serverTimestamp(),
    },

    activity: updatedActivity,

    "stats.activeHours": Number(
      (data.stats.activeHours + watchedHours).toFixed(2)
    ),

    meta: {
      ...data.meta,
      lastActive: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  });

  console.log("📊 Dashboard learning stats updated");
};
