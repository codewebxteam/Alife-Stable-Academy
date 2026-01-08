// src/firebase/orders.service.js
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "./config";

export const listenToOrders = (partnerId, callback) => {
  if (!partnerId || typeof partnerId !== "string") return () => { };

  const q = query(
    collection(db, "orders"),
    where("partnerId", "==", partnerId.trim()),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  });
};

export const listenToAllOrders = (callback) => {
  const q = query(
    collection(db, "orders"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  });
};

export const createOrder = async ({
  studentName,
  studentEmail,
  userId,
  assetName,
  type,
  saleValue,
  commission,
  partnerId,
  partnerName,
  courseId,
  ebookId,
}) => {
  await addDoc(collection(db, "orders"), {
    studentName,
    studentEmail,
    userId: userId || null,
    productName: assetName,
    productType: type,
    price: Number(saleValue),
    commission: Number(commission),
    partnerId: partnerId?.trim() || "direct",
    partnerName: partnerName || "Direct",
    courseId: courseId || null,
    ebookId: ebookId || null,
    videoProgress: 0,
    certificateIssued: false,
    status: "verified",
    purchasedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
};

export const updateCourseProgress = async (userId, courseId, progress) => {
  try {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      where("courseId", "==", courseId),
      where("productType", "==", "course")
    );
    const snapshot = await getDocs(q);

    snapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, {
        videoProgress: Math.min(Math.round(progress), 100),
        certificateIssued: progress >= 100 ? true : false
      });
    });
  } catch (error) {
    console.error("Error updating course progress:", error);
  }
};
