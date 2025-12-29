// src/firebase/payouts.service.js
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./config";

/**
 * 🔹 FETCH PAYOUT HISTORY (ONE TIME)
 */
export const fetchPayoutHistory = async (partnerId) => {
  const q = query(
    collection(db, "partners", partnerId, "payoutHistory"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

/**
 * 🔥 REALTIME PAYOUT HISTORY
 */
export const listenToPayoutHistory = (partnerId, callback) => {
  const q = query(
    collection(db, "partners", partnerId, "payoutHistory"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    callback(data);
  });
};

/**
 * 🔹 CREATE PAYOUT (REQUEST PAYOUT BUTTON)
 */
export const createPayout = async ({
  partnerId,
  amount,
  payer,
  utr,
  paid,
  pending,
}) => {
  await updateDoc(doc(db, "partners", partnerId), {
    "financials.paid": Number(paid),
    "financials.pending": Number(pending),
  });

  await addDoc(
    collection(db, "partners", partnerId, "payoutHistory"),
    {
      amount: Number(amount),
      payer,
      utr,
      status: "Verified",
      createdAt: serverTimestamp(),
    }
  );
};
