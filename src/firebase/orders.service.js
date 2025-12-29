// src/firebase/orders.service.js
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

export const listenToOrders = (partnerId, callback) => {
  if (!partnerId || typeof partnerId !== "string") return () => {};

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

export const createOrder = async ({
  studentName,
  studentEmail,
  assetName,
  type,
  saleValue,
  commission,
  partnerId,
}) => {
  await addDoc(collection(db, "orders"), {
    studentName,
    studentEmail,
    assetName,
    type,
    saleValue: Number(saleValue),
    commission: Number(commission),
    partnerId: partnerId.trim(),
    status: "verified",
    createdAt: serverTimestamp(),
  });
};
