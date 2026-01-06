import { db } from "../firebase/config";
import { collection, getDocs, query, where, orderBy, limit, updateDoc, doc } from "firebase/firestore";

/**
 * Intelligence Hub Real-time Data Service
 * Fetches analytics data from Firebase Firestore
 */

export const intelligenceService = {
  // Fetch revenue data
  async getRevenueData(timeRange = "7D") {
    try {
      const paymentsRef = collection(db, "payments");
      const snapshot = await getDocs(paymentsRef);
      
      let totalRevenue = 0;
      let directRevenue = 0;
      let partnerRevenue = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === "completed") {
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
  async getCourseAcquisitions() {
    try {
      const enrollmentsRef = collection(db, "enrollments");
      const snapshot = await getDocs(enrollmentsRef);
      
      let total = 0;
      let self = 0;
      let partner = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        total++;
        if (data.source === "direct" || data.source === "self") {
          self++;
        } else {
          partner++;
        }
      });

      return { total, self, partner };
    } catch (error) {
      console.error("Error fetching course acquisitions:", error);
      return { total: 0, self: 0, partner: 0 };
    }
  },

  // Fetch student count (from enrollments - real enrolled students)
  async getStudentCount() {
    try {
      const enrollmentsRef = collection(db, "enrollments");
      const snapshot = await getDocs(enrollmentsRef);
      
      const uniqueStudents = new Set();
      const directStudents = new Set();
      const partnerStudents = new Set();

      snapshot.forEach((doc) => {
        const data = doc.data();
        const studentId = data.studentId;
        
        if (studentId) {
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
  async getRevenueVelocity(mode = "Weekly") {
    try {
      const paymentsRef = collection(db, "payments");
      const snapshot = await getDocs(paymentsRef);
      
      const now = new Date();
      const result = [];
      
      if (mode === "Weekly") {
        // Last 7 days
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        for (let i = 6; i >= 0; i--) {
          const targetDate = new Date(now);
          targetDate.setDate(now.getDate() - i);
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
        // Last 6 months
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        for (let i = 5; i >= 0; i--) {
          const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
          
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
  async getCourseSalesDistribution() {
    try {
      const enrollmentsRef = collection(db, "enrollments");
      const snapshot = await getDocs(enrollmentsRef);
      
      const courseMap = {};
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const courseName = data.courseName || "Unknown";
        courseMap[courseName] = (courseMap[courseName] || 0) + 1;
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
  async getEbookSalesDistribution() {
    try {
      const ebooksRef = collection(db, "ebook_sales");
      const snapshot = await getDocs(ebooksRef);
      
      const ebookMap = {};
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const ebookName = data.ebookName || "Unknown";
        ebookMap[ebookName] = (ebookMap[ebookName] || 0) + 1;
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
  async getHotAssetSpotlight() {
    try {
      const enrollmentsRef = collection(db, "enrollments");
      const snapshot = await getDocs(enrollmentsRef);
      
      const courseMap = {};
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const courseName = data.courseName || "Unknown";
        courseMap[courseName] = (courseMap[courseName] || 0) + 1;
      });
      
      const topCourse = Object.entries(courseMap).sort((a, b) => b[1] - a[1])[0];
      return topCourse ? { name: topCourse[0], units: topCourse[1] } : { name: "N/A", units: 0 };
    } catch (error) {
      console.error("Error fetching hot asset:", error);
      return { name: "N/A", units: 0 };
    }
  }
};
