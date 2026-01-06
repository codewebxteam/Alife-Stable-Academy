import { db } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";

/**
 * Sample Data Seeder for Intelligence Hub
 * Run this once to populate your Firebase with test data
 */

export const seedIntelligenceData = async () => {
  try {
    console.log("🌱 Starting to seed Intelligence Hub data...");

    // 1. Seed Payments
    const payments = [
      { amount: 5000, status: "completed", source: "direct", type: "purchase", createdAt: Timestamp.now() },
      { amount: 7500, status: "completed", source: "partner", type: "purchase", partnerId: "partner1", createdAt: Timestamp.now() },
      { amount: 3000, status: "completed", source: "direct", type: "purchase", createdAt: Timestamp.now() },
      { amount: 425000, status: "pending", type: "payout", createdAt: Timestamp.now() },
      { amount: 50000, status: "pending", type: "withdrawal", createdAt: Timestamp.now() },
      { amount: 12000, status: "completed", source: "partner", type: "purchase", partnerId: "partner2", createdAt: Timestamp.now() },
    ];

    for (const payment of payments) {
      await addDoc(collection(db, "payments"), payment);
    }
    console.log("✅ Payments seeded");

    // 2. Seed Students
    const students = [
      { name: "John Doe", email: "john@example.com", source: "direct", courseStatus: "in_progress", certificationStatus: "eligible", createdAt: Timestamp.now() },
      { name: "Jane Smith", email: "jane@example.com", source: "partner", courseStatus: "completed", certificationStatus: "issued", createdAt: Timestamp.now() },
      { name: "Mike Johnson", email: "mike@example.com", source: "self", courseStatus: "not_started", certificationStatus: "pending", createdAt: Timestamp.now() },
      { name: "Sarah Williams", email: "sarah@example.com", source: "direct", courseStatus: "completed", certificationStatus: "issued", createdAt: Timestamp.now() },
      { name: "Tom Brown", email: "tom@example.com", source: "partner", courseStatus: "in_progress", certificationStatus: "eligible", createdAt: Timestamp.now() },
    ];

    for (const student of students) {
      await addDoc(collection(db, "students"), student);
    }
    console.log("✅ Students seeded");

    // 3. Seed Partners
    const partners = [
      { 
        name: "Nexus Digital", 
        email: "contact@nexus.com", 
        lastActive: Timestamp.fromDate(new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)), // 20 days ago
        status: "inactive", 
        createdAt: Timestamp.now() 
      },
      { 
        name: "Global Learn Academy", 
        email: "info@globallearn.com", 
        lastActive: Timestamp.fromDate(new Date(Date.now() - 16 * 24 * 60 * 60 * 1000)), // 16 days ago
        status: "inactive", 
        createdAt: Timestamp.now() 
      },
      { 
        name: "Skyline Institute", 
        email: "hello@skyline.com", 
        lastActive: Timestamp.now(),
        status: "active", 
        createdAt: Timestamp.now() 
      },
    ];

    for (const partner of partners) {
      await addDoc(collection(db, "partners"), partner);
    }
    console.log("✅ Partners seeded");

    // 4. Seed Enrollments
    const enrollments = [
      { courseName: "React Pro Mastery", source: "direct", studentId: "student1", createdAt: Timestamp.now() },
      { courseName: "React Pro Mastery", source: "partner", studentId: "student2", createdAt: Timestamp.now() },
      { courseName: "UI/UX Master", source: "self", studentId: "student3", createdAt: Timestamp.now() },
      { courseName: "Node Backend", source: "direct", studentId: "student4", createdAt: Timestamp.now() },
      { courseName: "Python AI", source: "partner", studentId: "student5", createdAt: Timestamp.now() },
      { courseName: "React Pro Mastery", source: "direct", studentId: "student6", createdAt: Timestamp.now() },
    ];

    for (const enrollment of enrollments) {
      await addDoc(collection(db, "enrollments"), enrollment);
    }
    console.log("✅ Enrollments seeded");

    // 5. Seed Ebook Sales
    const ebookSales = [
      { ebookName: "JS Pocket Guide", price: 299, studentId: "student1", createdAt: Timestamp.now() },
      { ebookName: "Tailwind Guide", price: 399, studentId: "student2", createdAt: Timestamp.now() },
      { ebookName: "Freelance 101", price: 499, studentId: "student3", createdAt: Timestamp.now() },
      { ebookName: "JS Pocket Guide", price: 299, studentId: "student4", createdAt: Timestamp.now() },
      { ebookName: "Tailwind Guide", price: 399, studentId: "student5", createdAt: Timestamp.now() },
    ];

    for (const sale of ebookSales) {
      await addDoc(collection(db, "ebook_sales"), sale);
    }
    console.log("✅ Ebook sales seeded");

    console.log("🎉 All Intelligence Hub data seeded successfully!");
    return { success: true, message: "Data seeded successfully" };
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    return { success: false, message: error.message };
  }
};

// Export for use in admin panel or console
export default seedIntelligenceData;
