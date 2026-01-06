import { db } from "./config";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const getStartDate = (timeRange) => {
  const now = new Date();
  switch (timeRange) {
    case "Today":
      return new Date(now.setHours(0, 0, 0, 0)).toISOString();
    case "7D":
      return new Date(now.setDate(now.getDate() - 7)).toISOString();
    case "30D":
      return new Date(now.setDate(now.getDate() - 30)).toISOString();
    case "Quarter":
      return new Date(now.setMonth(now.getMonth() - 3)).toISOString();
    case "Year":
      return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
    default:
      return new Date(0).toISOString();
  }
};

export const subscribeToRevenueData = (timeRange, callback) => {
  const startDate = getStartDate(timeRange);
  const q = query(collection(db, "transactions"), where("createdAt", ">=", startDate));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, () => callback([]));
};

export const subscribeToStudentData = (callback) => {
  return onSnapshot(collection(db, "students"), (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, () => callback([]));
};

export const subscribeToPartnerData = (callback) => {
  return onSnapshot(collection(db, "partners"), (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, () => callback([]));
};

export const subscribeToCourseEnrollments = (callback) => {
  return onSnapshot(collection(db, "enrollments"), (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, () => callback([]));
};

export const subscribeToEbookSales = (callback) => {
  const q = query(collection(db, "transactions"), where("type", "==", "ebook"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, () => callback([]));
};

export const getInactivePartners = async () => {
  return [];
};

export const subscribeToPendingPayouts = (callback) => {
  const q = query(collection(db, "payouts"), where("status", "==", "pending"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, () => callback([]));
};

export const calculateMetrics = (transactions, students, partners, enrollments) => {
  const directRevenue = transactions.filter(t => t.source === "direct").reduce((sum, t) => sum + (t.amount || 0), 0);
  const partnerRevenue = transactions.filter(t => t.source === "partner").reduce((sum, t) => sum + (t.amount || 0), 0);
  const courseEnrollments = enrollments.filter(e => e.type === "course").length;
  const directEnrollments = enrollments.filter(e => e.source === "direct" && e.type === "course").length;
  const partnerEnrollments = enrollments.filter(e => e.source === "partner" && e.type === "course").length;
  const directStudents = students.filter(s => s.source === "direct").length;
  const partnerStudents = students.filter(s => s.source === "partner").length;
  
  return {
    totalRevenue: directRevenue + partnerRevenue,
    directRevenue,
    partnerRevenue,
    courseEnrollments,
    directEnrollments,
    partnerEnrollments,
    totalStudents: students.length,
    directStudents,
    partnerStudents,
    totalPartners: partners.length
  };
};
