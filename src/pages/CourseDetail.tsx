import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { NavLink } from "@/components/NavLink";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useAuth } from "@/contexts/AuthContext";
import { ref, push } from "firebase/database";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import {
  Star,
  Users,
  Clock,
  BookOpen,
  Download,
  Share2,
  PlayCircle,
  CheckCircle2,
  Award,
  Globe,
  TrendingUp,
  Target,
} from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const { handleAuthAction } = useAuthRedirect();
  const { user, isAuthenticated } = useAuth();
  const [purchasing, setPurchasing] = useState(false);

  // Mock course data
  const course = {
    id: Number(id),
    title: "Complete Web Development Bootcamp",
    subtitle: "From Zero to Full-Stack Hero - Master HTML, CSS, JavaScript, React, Node.js & More",
    instructor: {
      name: "Sarah Johnson",
      title: "Senior Full-Stack Developer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      students: 125000,
      courses: 12,
      rating: 4.9,
    },
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 8942,
    students: 12500,
    duration: "48 hours",
    lessons: 156,
    level: "Beginner",
    language: "English",
    lastUpdated: "November 2024",
    price: "₹2,999",
    originalPrice: "₹9,999",
    description:
      "Transform your career with the most comprehensive web development course available. This bootcamp takes you from complete beginner to job-ready developer, covering everything you need to build modern, professional websites and web applications.",
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
      const amount = 2999;
      const commission = amount * 0.2;

      let partnerId = null;
      if (user.referralCode) {
        partnerId = user.referralCode.replace('.alife-stable-academy.com', '');
      }

      const saleData = {
        studentName: user.fullName,
        studentEmail: user.email,
        courseName: course.title,
        amount,
        purchaseDate,
        expiryDate,
        planDays,
        commission,
        status: 'pending',
        partnerId
      };

      await push(ref(db, 'sales'), saleData);
      toast.success('Course purchased successfully!');
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6 animate-fade-in">
              <Badge className="bg-primary/10 text-primary border-primary/20 w-fit">
                {course.level}
              </Badge>
              
              <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight">
                {course.title}
              </h1>
              
              <p className="text-xl text-muted-foreground">{course.subtitle}</p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="font-bold">{course.rating}</span>
                  <span className="text-muted-foreground">({course.reviewCount.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{course.duration} total</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <span>{course.lessons} lessons</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-4 pt-4">
                <img
                  src={course.instructor.image}
                  alt={course.instructor.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="text-sm text-muted-foreground">Created by</p>
                  <p className="font-semibold text-lg">{course.instructor.name}</p>
                  <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Video & CTA */}
            <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <Card className="glass sticky top-24 overflow-hidden">
                {/* Video Preview */}
                <div className="relative aspect-video bg-secondary group cursor-pointer">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PlayCircle className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <Badge className="absolute top-4 right-4 bg-black/70 text-white border-0">
                    Preview Course
                  </Badge>
                </div>

                <div className="p-6 space-y-6">
                  {/* Pricing */}
                  <div>
                    <div className="flex items-baseline gap-3 mb-2">
                      <div className="font-display text-4xl font-bold text-primary">
                        {course.price}
                      </div>
                      <div className="text-lg text-muted-foreground line-through">
                        {course.originalPrice}
                      </div>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                        70% OFF
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Limited time offer - ends soon!</p>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full h-12 bg-gradient-orange border-0 text-white font-semibold text-lg shadow-glow-orange hover:shadow-glow-orange hover:scale-105 transition-all"
                      onClick={handlePurchase}
                      disabled={purchasing}
                    >
                      {purchasing ? 'Processing...' : 'Enroll Now'}
                    </Button>
                    <Button variant="outline" className="w-full h-12 glass">
                      Add to Wishlist
                    </Button>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <p className="font-semibold">This course includes:</p>
                    <ul className="space-y-2 text-sm">
                      {course.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Share */}
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button variant="outline" className="flex-1 glass">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="glass w-full justify-start">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8 animate-fade-in">
                <Card className="glass p-8">
                  <h2 className="font-display text-2xl font-bold mb-4">About This Course</h2>
                  <p className="text-muted-foreground leading-relaxed">{course.description}</p>
                </Card>

                <Card className="glass p-8">
                  <h2 className="font-display text-2xl font-bold mb-6">What You'll Learn</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {course.learningOutcomes.map((outcome, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="glass p-8">
                  <h2 className="font-display text-2xl font-bold mb-6">Requirements</h2>
                  <ul className="space-y-3">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </TabsContent>

              {/* Curriculum Tab */}
              <TabsContent value="curriculum" className="animate-fade-in">
                <Card className="glass p-8">
                  <h2 className="font-display text-2xl font-bold mb-6">Course Curriculum</h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {course.curriculum.map((section, index) => (
                      <AccordionItem key={index} value={`section-${index}`} className="border border-border rounded-lg px-6 glass">
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="text-left">
                              <h3 className="font-semibold text-lg">{section.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {section.lessons} lectures • {section.duration}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pt-4">
                            {section.lectures.map((lecture, lectureIndex) => (
                              <div
                                key={lectureIndex}
                                className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-secondary/50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <PlayCircle className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{lecture.title}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  {lecture.free && (
                                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                                      Free Preview
                                    </Badge>
                                  )}
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
              </TabsContent>

              {/* Instructor Tab */}
              <TabsContent value="instructor" className="animate-fade-in">
                <Card className="glass p-8">
                  <div className="flex items-start gap-6 mb-8">
                    <img
                      src={course.instructor.image}
                      alt={course.instructor.name}
                      className="w-32 h-32 rounded-full"
                    />
                    <div className="flex-1">
                      <h2 className="font-display text-3xl font-bold mb-2">
                        {course.instructor.name}
                      </h2>
                      <p className="text-lg text-muted-foreground mb-4">{course.instructor.title}</p>
                      <div className="flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 fill-primary text-primary" />
                          <span>{course.instructor.rating} Instructor Rating</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          <span>{course.instructor.students.toLocaleString()} Students</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-muted-foreground" />
                          <span>{course.instructor.courses} Courses</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Sarah is a passionate educator and experienced full-stack developer with over 10 years in the industry. 
                    She has worked with leading tech companies and has taught thousands of students worldwide. Her practical, 
                    project-based approach ensures students gain real-world skills they can apply immediately.
                  </p>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6 animate-fade-in">
                {course.reviews.map((review, index) => (
                  <Card key={index} className="glass p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={review.image}
                        alt={review.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{review.name}</h4>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Course Info */}
            <Card className="glass p-6">
              <h3 className="font-display text-xl font-bold mb-6">Course Details</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Level</span>
                  <Badge className="bg-primary/10 text-primary border-primary/20">{course.level}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Lessons</span>
                  <span className="font-medium">{course.lessons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Language</span>
                  <span className="font-medium">{course.language}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium">{course.lastUpdated}</span>
                </div>
              </div>
            </Card>

            {/* Skills You'll Gain */}
            <Card className="glass p-6">
              <h3 className="font-display text-xl font-bold mb-6">Skills You'll Gain</h3>
              <div className="flex flex-wrap gap-2">
                {["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB", "Git", "API Design"].map((skill) => (
                  <Badge key={skill} variant="secondary" className="glass">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
