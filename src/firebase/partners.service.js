// src/firebase/partners.service.js
import { collection, onSnapshot, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "./config";

/**
 * 🔥 REALTIME PARTNERS LISTENER
 * Used for:
 * - Available payout
 * - Financial aggregates
 */
export const listenToPartners = (callback) => {
  const ref = collection(db, "partners");

  return onSnapshot(ref, (snapshot) => {
    const data = snapshot.docs.map((docSnap) => {
      const d = docSnap.data();
      return {
        id: docSnap.id,
        agency: d.agency || d.agencyName || "Unknown",
        owner: d.owner || "",
        email: d.email || "",
        phone: d.phone || "",
        domain: d.domain || "",
        status: d.status || "Inactive",
        joinDate: d.joinDate?.toDate?.() ?? null,
        stats: {
          coursesSold: d.stats?.coursesSold ?? 0,
          ebooksSold: d.stats?.ebooksSold ?? 0,
        },
        financials: {
          generated: d.financials?.generated ?? 0,
          earned: d.financials?.earned ?? 0,
          paid: d.financials?.paid ?? 0,
          pending: d.financials?.pending ?? 0,
        },
      };
    });
    callback(data);
  });
};

/**
 * 🔹 UPDATE PARTNER STATS AFTER ORDER
 */
export const updatePartnerAfterOrder = async ({
  partnerId,
  saleValue,
  commission,
  type, // course | ebook
}) => {
  const ref = doc(db, "partners", partnerId);

  await updateDoc(ref, {
    "financials.generated": increment(Number(saleValue)),
    "financials.earned": increment(Number(commission)),
    "financials.pending": increment(Number(commission)),
    ...(type === "course"
      ? { "stats.coursesSold": increment(1) }
      : { "stats.ebooksSold": increment(1) }),
  });
};
