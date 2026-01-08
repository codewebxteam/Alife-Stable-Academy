import { db } from "../firebase/config";
import { collection, getDocs, query, where, orderBy, limit, updateDoc, doc } from "firebase/firestore";

/**
 * Intelligence Hub Real-time Data Service
 * Fetches analytics data from Firebase Firestore
 */

// Helper function to get date range based on timeRange
const getDateRange = (timeRange, customDates = null) => {
  const now = new Date();
  let startDate = new Date();
  
  switch (timeRange) {
    case "Today":
      startDate.setHours(0, 0, 0, 0);
      break;
    case "7D":
      startDate.setDate(now.getDate() - 7);
      break;
    case "30D":
      startDate.setDate(now.getDate() - 30);
      break;
    case "Quarter":
      startDate.setMonth(now.getMonth() - 3);
      break;
    case "Year":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case "Custom":
      if (customDates?.start && customDates?.end) {
        startDate = new Date(customDates.start);
        const endDate = new Date(customDates.end);
        endDate.setHours(23, 59, 59, 999);
        return { startDate, endDate };
      }
      startDate.setDate(now.getDate() - 7);
      break;
    default:
      startDate.setDate(now.getDate() - 7);
  }
  
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
};

export const intelligenceService = {
  // Fetch revenue data
  async getRevenueData(timeRange = "7D", customDates = null) {
    try {
      const paymentsRef = collection(db, "payments");
      const snapshot = await getDocs(paymentsRef);
      
      const { startDate, endDate } = getDateRange(timeRange, customDates);
      
      let totalRevenue = 0;
      let directRevenue = 0;
      let partnerRevenue = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const paymentDate = data.createdAt?.toDate();
        
        if (data.status === "completed" && paymentDate && paymentDate >= startDate && paymentDate <= endDate) {
          const amount = parseFloat(data.amount) || 0;
          totalRevenue += amount;
          
          if (data.source === "direct") {
            directRevenue += amount;
          } else {
            partnerRevenue += amount;
          }
        }
      });

      return { totalRevenue, directRevenue, partnerRevenue };
    } catch (error) {
      console.error("Error fetching revenue:", error);
      return { totalRevenue: 0, directRevenue: 0, partnerRevenue: 0 };
    }
  },

  // Fetch course acquisitions
  async getCourseAcquisitions(timeRange = "7D", customDates = null) {
    try {
      const enrollmentsRef = collection(db, "enrollments");
      const snapshot = await getDocs(enrollmentsRef);
      
      const { startDate, endDate } = getDateRange(timeRange, customDates);
      
      let total = 0;
      let self = 0;
      let partner = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const enrollDate = data.createdAt?.toDate() || data.enrolledAt?.toDate();
        
        if (enrollDate && enrollDate >= startDate && enrollDate <= endDate) {
          total++;
          if (data.source === "direct" || data.source === "self") {
            self++;
          } else {
            partner++;
          }
        }
      });

      return { total, self, partner };
    } catch (error) {
      console.error("Error fetching course acquisitions:", error);
      return { total: 0, self: 0, partner: 0 };
    }
  },

  // Fetch student count (from enrollments - real enrolled students)
  async getStudentCount(timeRange = "7D", customDates = null) {
    try {
      const enrollmentsRef = collection(db, "enrollments");
      const snapshot = await getDocs(enrollmentsRef);
      
      const { startDate, endDate } = getDateRange(timeRange, customDates);
      
      const uniqueStudents = new Set();
      const directStudents = new Set();
      const partnerStudents = new Set();

      snapshot.forEach((doc) => {
        const data = doc.data();
        const enrollDate = data.createdAt?.toDate() || data.enrolledAt?.toDate();
        const studentId = data.studentId;
        
        if (studentId && enrollDate && enrollDate >= startDate && enrollDate <= endDate) {
          uniqueStudents.add(studentId);
          
          if (data.source === "direct" || data.source === "self") {
            directStudents.add(studentId);
          } else if (data.source === "partner") {
            partnerStudents.add(studentId);
          }
        }
      });

      return { 
        total: uniqueStudents.size, 
        self: directStudents.size, 
        partner: partnerStudents.size 
      };
    } catch (error) {
      console.error("Error fetching students:", error);
      return { total: 0, self: 0, partner: 0 };
    }
  },

  // Fetch top partners
  async getTopPartners() {
    try {
      const partnersRef = collection(db, "partners");
      const snapshot = await getDocs(partnersRef);
      
      const partnerRevenue = [];
      
      for (const doc of snapshot.docs) {
        const partner = doc.data();
        const paymentsRef = collection(db, "payments");
        const q = query(paymentsRef, where("partnerId", "==", doc.id), where("status", "==", "completed"));
        const paymentSnapshot = await getDocs(q);
        
        let revenue = 0;
        paymentSnapshot.forEach((payDoc) => {
          revenue += parseFloat(payDoc.data().amount) || 0;
        });
        
        partnerRevenue.push({ name: partner.name, revenue });
      }
      
      partnerRevenue.sort((a, b) => b.revenue - a.revenue);
      return partnerRevenue.slice(0, 2);
    } catch (error) {
      console.error("Error fetching top partners:", error);
      return [];
    }
  },

  // Fetch revenue velocity data (weekly/monthly)
  async getRevenueVelocity(mode = "Weekly", timeRange = "7D", customDates = null) {
    try {
      const paymentsRef = collection(db, "payments");
      const snapshot = await getDocs(paymentsRef);
      
      const { startDate, endDate } = getDateRange(timeRange, customDates);
      const result = [];
      
      if (mode === "Weekly") {
        // Calculate number of days in the range
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const daysToShow = Math.min(daysDiff, 7);
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        
        for (let i = daysToShow - 1; i >= 0; i--) {
          const targetDate = new Date(endDate);
          targetDate.setDate(endDate.getDate() - i);
          targetDate.setHours(0, 0, 0, 0);
          
          const nextDate = new Date(targetDate);
          nextDate.setDate(targetDate.getDate() + 1);
          
          let direct = 0;
          let partner = 0;
          
          snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.status === "completed" && data.createdAt) {
              const paymentDate = data.createdAt.toDate();
              if (paymentDate >= targetDate && paymentDate < nextDate) {
                const amount = parseFloat(data.amount) || 0;
                if (data.source === "direct") {
                  direct += amount;
                } else {
                  partner += amount;
                }
              }
            }
          });
          
          result.push({
            name: dayNames[targetDate.getDay()],
            direct,
            partner
          });
        }
      } else {
        // Calculate number of months in the range
        const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                          (endDate.getMonth() - startDate.getMonth());
        const monthsToShow = Math.min(monthsDiff + 1, 6);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        for (let i = monthsToShow - 1; i >= 0; i--) {
          const targetDate = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1);
          const nextDate = new Date(endDate.getFullYear(), endDate.getMonth() - i + 1, 1);
          
          let direct = 0;
          let partner = 0;
          
          snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.status === "completed" && data.createdAt) {
              const paymentDate = data.createdAt.toDate();
              if (paymentDate >= targetDate && paymentDate < nextDate && 
                  paymentDate >= startDate && paymentDate <= endDate) {
                const amount = parseFloat(data.amount) || 0;
                if (data.source === "direct") {
                  direct += amount;
                } else {
                  partner += amount;
                }
              }
            }
          });
          
          result.push({
            name: monthNames[targetDate.getMonth()],
            direct,
            partner
          });
        }
      }
      
      return result;
    } catch (error) {
      console.error("Error fetching velocity data:", error);
      return [];
    }
  },

  // Fetch course sales distribution
  async getCourseSalesDistribution(timeRange = "7D", customDates = null) {
    try {
      const enrollmentsRef = collection(db, "enrollments");
      const snapshot = await getDocs(enrollmentsRef);
      
      const { startDate, endDate } = getDateRange(timeRange, customDates);
      const courseMap = {};
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const enrollDate = data.createdAt?.toDate() || data.enrolledAt?.toDate();
        
        if (enrollDate && enrollDate >= startDate && enrollDate <= endDate) {
          const courseName = data.courseName || "Unknown";
          courseMap[courseName] = (courseMap[courseName] || 0) + 1;
        }
      });
      
      const colors = ["#6366f1", "#8b5cf6", "#10b981", "#f59e0b"];
      return Object.entries(courseMap).map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
      }));
    } catch (error) {
      console.error("Error fetching course distribution:", error);
      return [];
    }
  },

  // Fetch ebook sales distribution
  async getEbookSalesDistribution(timeRange = "7D", customDates = null) {
    try {
      const ebooksRef = collection(db, "ebook_sales");
      const snapshot = await getDocs(ebooksRef);
      
      const { startDate, endDate } = getDateRange(timeRange, customDates);
      const ebookMap = {};
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const saleDate = data.createdAt?.toDate() || data.purchasedAt?.toDate();
        
        if (saleDate && saleDate >= startDate && saleDate <= endDate) {
          const ebookName = data.ebookName || "Unknown";
          ebookMap[ebookName] = (ebookMap[ebookName] || 0) + 1;
        }
      });
      
      const colors = ["#f43f5e", "#3b82f6", "#10b981"];
      return Object.entries(ebookMap).map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
      }));
    } catch (error) {
      console.error("Error fetching ebook distribution:", error);
      return [];
    }
  },

  // Fetch academic intelligence
  async getAcademicIntelligence() {
    try {
      const studentsRef = collection(db, "students");
      const snapshot = await getDocs(studentsRef);
      
      let notStarted = 0;
      let inProgress = 0;
      let completed = 0;
      let eligible = 0;
      let issued = 0;
      let pending = 0;
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        
        // Course status
        if (data.courseStatus === "not_started") notStarted++;
        else if (data.courseStatus === "in_progress") inProgress++;
        else if (data.courseStatus === "completed") completed++;
        
        // Certification status
        if (data.certificationStatus === "eligible") eligible++;
        else if (data.certificationStatus === "issued") issued++;
        else if (data.certificationStatus === "pending") pending++;
      });
      
      return { notStarted, inProgress, completed, eligible, issued, pending };
    } catch (error) {
      console.error("Error fetching academic intelligence:", error);
      return { notStarted: 0, inProgress: 0, completed: 0, eligible: 0, issued: 0, pending: 0 };
    }
  },

  // Fetch liquidity data
  async getLiquidityData() {
    try {
      const paymentsRef = collection(db, "payments");
      const q = query(paymentsRef, where("status", "==", "pending"));
      const snapshot = await getDocs(q);
      
      let payoutsPending = 0;
      let withdrawalQueue = 0;
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.type === "payout") {
          payoutsPending += parseFloat(data.amount) || 0;
        } else if (data.type === "withdrawal") {
          withdrawalQueue++;
        }
      });
      
      return { payoutsPending, withdrawalQueue };
    } catch (error) {
      console.error("Error fetching liquidity data:", error);
      return { payoutsPending: 0, withdrawalQueue: 0 };
    }
  },

  // Fetch inactive partners (no course sales in 15 days) and auto-disable them
  async getInactivePartners() {
    try {
      const partnersRef = collection(db, "partners");
      const snapshot = await getDocs(partnersRef);
      
      const inactivePartners = [];
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
      
      for (const docSnap of snapshot.docs) {
        const partner = docSnap.data();
        
        // Check last course sale date from orders collection
        const ordersRef = collection(db, "orders");
        const q = query(
          ordersRef, 
          where("partnerId", "==", docSnap.id)
        );
        const orderSnapshot = await getDocs(q);
        
        let lastSaleDate = null;
        orderSnapshot.forEach((doc) => {
          const orderDate = doc.data().createdAt?.toDate();
          if (orderDate && (!lastSaleDate || orderDate > lastSaleDate)) {
            lastSaleDate = orderDate;
          }
        });
        
        // If no sales in 15 days or never sold, mark as inactive and disable
        if (!lastSaleDate || lastSaleDate < fifteenDaysAgo) {
          inactivePartners.push(partner.name);
          
          // Auto-disable partner account
          if (partner.status !== "disabled") {
            const partnerDocRef = doc(db, "partners", docSnap.id);
            await updateDoc(partnerDocRef, { 
              status: "disabled",
              disabledAt: new Date(),
              disabledReason: "No course sales in 15 days"
            });
          }
        }
      }
      
      return inactivePartners;
    } catch (error) {
      console.error("Error fetching inactive partners:", error);
      return [];
    }
  },

  // Fetch hot asset spotlight
  async getHotAssetSpotlight(timeRange = "7D", customDates = null) {
    try {
      const enrollmentsRef = collection(db, "enrollments");
      const snapshot = await getDocs(enrollmentsRef);
      
      const { startDate, endDate } = getDateRange(timeRange, customDates);
      const courseMap = {};
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const enrollDate = data.createdAt?.toDate() || data.enrolledAt?.toDate();
        
        if (enrollDate && enrollDate >= startDate && enrollDate <= endDate) {
          const courseName = data.courseName || "Unknown";
          courseMap[courseName] = (courseMap[courseName] || 0) + 1;
        }
      });
      
      const topCourse = Object.entries(courseMap).sort((a, b) => b[1] - a[1])[0];
      return topCourse ? { name: topCourse[0], units: topCourse[1] } : { name: "N/A", units: 0 };
    } catch (error) {
      console.error("Error fetching hot asset:", error);
      return { name: "N/A", units: 0 };
    }
  }
};
