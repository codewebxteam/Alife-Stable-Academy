import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import CoursesPage from "./pages/CoursesPage";
import PurchasesPage from "./pages/PurchasesPage";
import NewPage from "./pages/NewPage";
import NewsfeedPage from "./pages/NewsfeedPage";
import ChatPage from "./pages/ChatPage";
import Books from "./pages/Books";
import StudyMaterial from "./pages/StudyMaterial";
import Blogs from "./pages/Blogs";
import Resell from "./pages/Resell";
import StudentsList from "./pages/StudentsList";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import Partners from "./pages/admin/Partners";
import Students from "./pages/admin/Students";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/courses" element={<CoursesPage />} />
              <Route path="/dashboard/purchases" element={<PurchasesPage />} />
              <Route path="/social/new" element={<NewPage />} />
              <Route path="/social/newsfeed" element={<NewsfeedPage />} />
              <Route path="/social/chat" element={<ChatPage />} />
              <Route path="/books" element={<Books />} />
              <Route path="/study-material" element={<StudyMaterial />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/resell" element={<Resell />} />
              main
              <Route path="/students-list" element={<StudentsList />} />
              =======
              <Route path="/admindashboard" element={<AdminDashboard />} />
              main
              <Route path="/admin/partners" element={<Partners />} />
      <Route path="/admin/students" element={<Students />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
