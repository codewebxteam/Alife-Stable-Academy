import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

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
import LandingPage from "./pages/LandingPage";
import ReferralRedirect from "./pages/ReferralRedirect";

// Admin
import Partners from "./pages/admin/Partners";
import Students from "./pages/admin/Students";
import PartnerDashboard from "./pages/PartnerDashboard";
import PricingPage from "./pages/PricingPage";

const queryClient = new QueryClient();

/* 🔥 Small wrapper so we can use context */
const AppRoutes = () => {
  const { referralName } = useAuth();
  const hasReferral = Boolean(referralName);

  return (
    <BrowserRouter>
      <Routes>
        {/* Referral */}
        <Route path="/r/:refCode" element={<ReferralRedirect />} />

        {/* Auth */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Layout */}
        <Route element={<Layout />}>
          <Route
            path="/"
            element={hasReferral ? <LandingPage /> : <Home />}
          />
          <Route
            path="/home"
            element={hasReferral ? <LandingPage /> : <Home />}
          />

          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/pricing" element={<PricingPage />} />

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
          <Route path="/students-list" element={<StudentsList />} />

          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/partnerdashboard" element={<PartnerDashboard />} />
          <Route path="/admin/partners" element={<Partners />} />
          <Route path="/admin/students" element={<Students />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
