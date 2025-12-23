export const COURSES_DATA = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp",
    instructor: "Dr. Angela Yu",
    role: "Senior Developer",
    category: "Development",
    rating: 4.8,
    reviews: 1240,
    price: "₹499",
    originalPrice: "₹3,999",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
    tags: ["Best Seller", "Beginner"],
    duration: "60h Total",
    lectures: "450 Lectures",
    level: "Beginner to Advanced",
    lastUpdated: "March 2025",
    description:
      "Become a full-stack web developer with just one course. HTML, CSS, Javascript, Node, React, MongoDB, Web3 and DApps.",

    // 🔥 ADD THESE (NO BREAKING CHANGE)
    video: "/assets/videos/web-dev-intro.mp4", // local for now → AWS S3 later
    certificateAvailable: true,               // unlock at 100%

    syllabus: [
      {
        title: "Module 1: Front-End",
        lessons: [
          { title: "HTML5", time: "2h 15m" },
          { title: "CSS3", time: "3h 40m" }
        ]
      },
      {
        title: "Module 2: React.js",
        lessons: [{ title: "Hooks", time: "2h 00m" }]
      }
    ]
  },

  // baaki courses same rahenge
];
