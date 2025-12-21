import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useAuth } from "@/contexts/AuthContext";
import { ref, push, onValue, update } from "firebase/database";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import {
  Star,
  Users,
  Clock,
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Share2,
  Target,
} from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const { handleAuthAction } = useAuthRedirect();
  const { user, isAuthenticated } = useAuth();
  const [purchasing, setPurchasing] = useState(false);
  const [partnerPrice, setPartnerPrice] = useState<number | null>(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const coursesData = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      subtitle: "From Zero to Full-Stack Hero - Master HTML, CSS, JavaScript, React, Node.js & More",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop",
      price: 2999,
      originalPrice: 9999,
      description: "Transform your career with the most comprehensive web development course available. This bootcamp takes you from complete beginner to job-ready developer, covering everything you need to build modern, professional websites and web applications.",
    },
    {
      id: 2,
      title: "AI & Machine Learning Mastery",
      subtitle: "Master Neural Networks, TensorFlow, and Cutting-Edge AI Applications",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop",
      price: 4999,
      originalPrice: 14999,
      description: "Deep dive into the world of artificial intelligence and machine learning. Learn to build intelligent systems, work with neural networks, and create AI-powered applications that solve real-world problems.",
    },
    {
      id: 3,
      title: "Digital Marketing & Growth Hacking",
      subtitle: "Master SEO, Social Media Marketing, Content Strategy, and Analytics",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop",
      price: 2499,
      originalPrice: 7999,
      description: "Learn the strategies and tactics used by top marketers to grow businesses online. Master SEO, social media marketing, content creation, and data-driven decision making.",
    },
    {
      id: 4,
      title: "UI/UX Design Complete Course",
      subtitle: "Master Figma, Prototyping, User Research, and Design Systems",
      thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&auto=format&fit=crop",
      price: 3499,
      originalPrice: 10999,
      description: "Become a professional UI/UX designer. Learn design thinking, user research, wireframing, prototyping, and how to create beautiful, user-friendly interfaces that people love.",
    },
    {
      id: 5,
      title: "Python for Data Analysis",
      subtitle: "Learn Pandas, NumPy, Matplotlib and Data Visualization Techniques",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop",
      price: 3299,
      originalPrice: 9999,
      description: "Master Python for data analysis and visualization. Learn to work with Pandas, NumPy, and Matplotlib to analyze data, create visualizations, and derive insights from complex datasets.",
    },
    {
      id: 6,
      title: "Advanced React & Next.js",
      subtitle: "Build Production-Ready Apps with React 18, Next.js 14, and TypeScript",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop",
      price: 4499,
      originalPrice: 13999,
      description: "Take your React skills to the next level. Learn advanced patterns, performance optimization, server-side rendering with Next.js, and build production-ready applications with TypeScript.",
    },
  ];

  const courseData = coursesData.find(c => c.id === Number(id)) || coursesData[0];

  useEffect(() => {
    if (!user?.uid) return;

    const userRef = ref(db, `users/${user.uid}/purchases`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const purchases = snapshot.val();
        const enrolled = Object.values(purchases).some((p: any) => 
          p.courseId === String(id) && p.status === 'active'
        );
        setIsEnrolled(enrolled);
      }
    });

    return () => unsubscribe();
  }, [user, id]);

  useEffect(() => {
    let referralCode = localStorage.getItem('pendingReferral') || localStorage.getItem('referralCode');
    
    if (user?.role === 'student' && user?.referralCode) {
      referralCode = user.referralCode;
    }
    
    if (!referralCode) {
      setIsLoadingPrice(false);
      return;
    }

    const cleanCode = referralCode.replace('.alife-stable-academy.com', '');

    const resellRef = ref(db, 'resellCourses');
    const unsubscribe = onValue(resellRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        
        const courseResell = Object.values(data).find((course: any) => {
          const match = (course.referralCode === cleanCode || course.partnerId === user?.uid) && 
                       (course.courseId === String(id) || course.courseId === Number(id) || course.courseId == id);
          return match;
        }) as any;
        
        if (courseResell) {
          setPartnerPrice(courseResell.sellingPrice);
        }
      }
      setIsLoadingPrice(false);
    });

    return () => unsubscribe();
  }, [user, id]);

  const displayPrice = isLoadingPrice ? '...' : `₹${(partnerPrice || courseData.price).toLocaleString()}`;
  const displayOriginalPrice = `₹${courseData.originalPrice.toLocaleString()}`;
  const discountPercentage = Math.round(((courseData.originalPrice - (partnerPrice || courseData.price)) / courseData.originalPrice) * 100);

  const course = {
    ...courseData,
    price: displayPrice,
    originalPrice: displayOriginalPrice,
    instructor: {
      name: "Sarah Johnson",
      title: "Senior Full-Stack Developer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      students: 125000,
      courses: 12,
      rating: 4.9,
    },
    thumbnail: courseData.thumbnail,
    rating: 4.8,
    reviewCount: 8942,
    students: 12500,
    duration: "48 hours",
    lessons: 156,
    level: "Beginner",
    language: "English",
    lastUpdated: "November 2024",
    description: courseData.description,
    features: [
      "48 hours of on-demand video content",
      "156 downloadable resources",
      "Full lifetime access",
      "Access on mobile and desktop",
      "Certificate of completion",
      "30-day money-back guarantee",
    ],
    learningOutcomes: [
      "Build 15+ real-world projects for your portfolio",
      "Master HTML, CSS, JavaScript, and modern frameworks",
      "Create full-stack applications with React and Node.js",
      "Deploy applications to production servers",
      "Work with databases like MongoDB and PostgreSQL",
      "Understand Git version control and GitHub",
      "Build RESTful APIs and work with authentication",
      "Write clean, maintainable, and scalable code",
    ],
    curriculum: [
      {
        title: "Web Development Fundamentals",
        lessons: 25,
        duration: "6 hours",
        lectures: [
          { title: "Introduction to Web Development", duration: "15:30", free: true },
          { title: "Setting Up Your Development Environment", duration: "22:15", free: true },
          { title: "HTML Basics and Structure", duration: "32:45", free: false },
          { title: "CSS Styling and Layouts", duration: "45:20", free: false },
          { title: "Responsive Design Principles", duration: "28:10", free: false },
        ],
      },
      {
        title: "JavaScript Essentials",
        lessons: 32,
        duration: "9 hours",
        lectures: [
          { title: "JavaScript Variables and Data Types", duration: "25:40", free: false },
          { title: "Functions and Scope", duration: "35:15", free: false },
          { title: "DOM Manipulation", duration: "42:30", free: false },
          { title: "Events and Event Handling", duration: "38:20", free: false },
        ],
      },
      {
        title: "Modern JavaScript (ES6+)",
        lessons: 28,
        duration: "8 hours",
        lectures: [
          { title: "Arrow Functions and Template Literals", duration: "30:15", free: false },
          { title: "Destructuring and Spread Operator", duration: "28:45", free: false },
          { title: "Promises and Async/Await", duration: "45:30", free: false },
        ],
      },
      {
        title: "React Fundamentals",
        lessons: 35,
        duration: "11 hours",
        lectures: [
          { title: "Introduction to React", duration: "20:30", free: false },
          { title: "Components and Props", duration: "35:40", free: false },
          { title: "State and Lifecycle", duration: "42:15", free: false },
          { title: "Hooks in Depth", duration: "55:20", free: false },
        ],
      },
      {
        title: "Backend Development with Node.js",
        lessons: 36,
        duration: "14 hours",
        lectures: [
          { title: "Node.js Fundamentals", duration: "32:10", free: false },
          { title: "Express.js Framework", duration: "48:25", free: false },
          { title: "RESTful API Design", duration: "52:30", free: false },
        ],
      },
    ],
    requirements: [
      "A computer with internet connection (Windows, Mac, or Linux)",
      "No prior programming experience required",
      "Passion to learn and dedication to complete the course",
    ],
    reviews: [
      {
        name: "Rahul Sharma",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
        rating: 5,
        date: "1 week ago",
        comment:
          "This course exceeded all my expectations! Sarah's teaching style is incredibly clear and engaging. I went from knowing nothing about web development to building my own full-stack applications. Highly recommended!",
      },
      {
        name: "Priya Patel",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "Best investment I've made in my career. The projects are practical and relevant to real-world scenarios. I got a junior developer job within 3 months of completing this course!",
      },
    ],
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      handleAuthAction();
      return;
    }

    setPurchasing(true);
    try {
      const purchaseDate = Date.now();
      const planDays = 365;
      const expiryDate = purchaseDate + (planDays * 24 * 60 * 60 * 1000);
      const finalAmount = partnerPrice || courseData.price;
      const commission = finalAmount * 0.2;

      let partnerId = null;
      if (user.referralCode) {
        partnerId = user.referralCode.replace('.alife-stable-academy.com', '');
      }

      const saleData = {
        studentName: user.fullName,
        studentEmail: user.email,
        courseName: course.title,
        amount: finalAmount,
        purchaseDate,
        expiryDate,
        planDays,
        commission,
        status: 'active',
        partnerId
      };

      await push(ref(db, 'sales'), saleData);
      
      await update(ref(db, `users/${user.uid}/purchases/${id}`), {
        courseId: String(id),
        courseName: course.title,
        price: finalAmount,
        purchaseDate,
        expiryDate,
        status: 'active'
      });

      toast.success('Course enrolled successfully!');
      setIsEnrolled(true);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Enrollment failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Banner */}
      <div className="relative h-[400px] overflow-hidden">
        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-12">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 mb-4">{course.level}</Badge>
            <h1 className="font-display text-5xl font-bold text-white mb-4 max-w-4xl">{course.title}</h1>
            <p className="text-xl text-white/90 mb-6 max-w-3xl">{course.subtitle}</p>
            <div className="flex items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-white">{course.rating}</span>
                <span>({course.reviewCount.toLocaleString()})</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{course.students.toLocaleString()} students</span>
              </div>
              <div className="flex items-center gap-2">
                <img src={course.instructor.image} alt={course.instructor.name} className="w-8 h-8 rounded-full" />
                <span>{course.instructor.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Price Card Mobile */}
            <Card className="lg:hidden glass p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary">{course.price}</span>
                    <span className="text-lg line-through text-muted-foreground">{course.originalPrice}</span>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-0 mt-2">{discountPercentage}% OFF</Badge>
                </div>
              </div>
              <Button className="w-full h-12 bg-gradient-orange text-white font-semibold" onClick={handlePurchase} disabled={purchasing || isEnrolled}>
                {isEnrolled ? 'Enrolled' : purchasing ? 'Processing...' : 'Enroll Now'}
              </Button>
            </Card>

            {/* What You'll Learn */}
            <Card className="glass p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                What You'll Learn
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {course.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{outcome}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Course Content */}
            <Card className="glass p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                Course Content
              </h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span>{course.curriculum.length} sections</span>
                <span>•</span>
                <span>{course.lessons} lectures</span>
                <span>•</span>
                <span>{course.duration} total</span>
              </div>
              <Accordion type="single" collapsible className="space-y-2">
                {course.curriculum.map((section, index) => (
                  <AccordionItem key={index} value={`section-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline py-3">
                      <div className="flex items-center justify-between w-full pr-4">
                        <span className="font-semibold">{section.title}</span>
                        <span className="text-sm text-muted-foreground">{section.lessons} lectures • {section.duration}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1 pt-2">
                        {section.lectures.map((lecture, lectureIndex) => (
                          <div key={lectureIndex} className="flex items-center justify-between py-2 px-3 rounded hover:bg-secondary/50">
                            <div className="flex items-center gap-2">
                              <PlayCircle className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{lecture.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {lecture.free && <Badge className="bg-green-500/10 text-green-500 border-0 text-xs">Preview</Badge>}
                              <span className="text-xs text-muted-foreground">{lecture.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>

            {/* Description */}
            <Card className="glass p-6">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{course.description}</p>
              <h3 className="font-semibold mb-3">Requirements</h3>
              <ul className="space-y-2">
                {course.requirements.map((req, index) => (
                  <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-primary">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Instructor */}
            <Card className="glass p-6">
              <h2 className="text-2xl font-bold mb-4">Instructor</h2>
              <div className="flex items-start gap-4">
                <img src={course.instructor.image} alt={course.instructor.name} className="w-20 h-20 rounded-full" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{course.instructor.name}</h3>
                  <p className="text-muted-foreground mb-3">{course.instructor.title}</p>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.instructor.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.instructor.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.instructor.courses} courses</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Reviews */}
            <Card className="glass p-6">
              <h2 className="text-2xl font-bold mb-4">Student Reviews</h2>
              <div className="space-y-4">
                {course.reviews.map((review, index) => (
                  <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start gap-3">
                      <img src={review.image} alt={review.name} className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold">{review.name}</span>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="flex gap-1 mb-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <Card className="glass sticky top-24 overflow-hidden">
              <div className="relative aspect-video bg-secondary group cursor-pointer">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlayCircle className="h-10 w-10 text-primary" />
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold text-primary">{course.price}</span>
                    <span className="text-lg line-through text-muted-foreground">{course.originalPrice}</span>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-0">{discountPercentage}% OFF</Badge>
                </div>
                <Button className="w-full h-12 bg-gradient-orange text-white font-semibold hover:scale-105 transition-all" onClick={handlePurchase} disabled={purchasing || isEnrolled}>
                  {isEnrolled ? 'Enrolled' : purchasing ? 'Processing...' : 'Enroll Now'}
                </Button>
                <Button variant="outline" className="w-full glass">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Course
                </Button>
                <div className="pt-4 border-t space-y-3 text-sm">
                  <h3 className="font-semibold">This course includes:</h3>
                  {course.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-medium">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Language</span>
                    <span className="font-medium">{course.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Updated</span>
                    <span className="font-medium">{course.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
