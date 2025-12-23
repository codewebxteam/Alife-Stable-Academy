import { db } from "../firebase/config";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

export const enrollCourseFirebase = async (uid, courseId) => {
  const ref = doc(
    db,
    "users",
    uid,
    "enrolledCourses",
    String(courseId)
  );

  const snap = await getDoc(ref);

  // already enrolled → kuch nahi karo
  if (snap.exists()) return;

  await setDoc(ref, {
    courseId,
    progress: 0,
    completed: false,
    enrolledAt: serverTimestamp(),
    lastActive: serverTimestamp(),
  });
};
