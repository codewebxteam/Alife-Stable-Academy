import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useAgency, AgencyProvider } from "./context/AgencyContext";
import { EBookProvider } from "./context/EBookContext";
import { db } from "./firebase/config";

// --- Components ---
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// --- Public Pages ---
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import EBooks from "./pages/EBooks";
import EBookDetails from "./pages/EBookDetails";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";

// --- Dashboard (Student) ---
import DashboardLayout from "./components/dashboard/DashboardLayout";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import MyCourses from "./pages/dashboard/MyCourses";
import EBookLibrary from "./pages/dashboard/EBookLibrary";
import ProgressReport from "./pages/dashboard/ProgressReport";
import ExploreCourses from "./pages/dashboard/ExploreCourses";
import Certificates from "./pages/dashboard/Certificates";
import Profile from "./pages/dashboard/Profile";

// --- [FINAL] Partner Pages ---
import PartnerLayout from "./pages/partner/PartnerLayout";
import PartnerDashboard from "./pages/partner/PartnerDashboard";
import Financials from "./pages/partner/Financials";
import AgencySetup from "./pages/partner/AgencySetup";
import CouponIntelligence from "./pages/partner/CouponIntelligence";
import SalesIntelligence from "./pages/partner/SalesIntelligence";
import StudentIntelligence from "./pages/partner/StudentIntelligence";

// --- Scroll To Top Helper ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- [PRESERVED] Protected Route Wrapper ---
const ProtectedRoute = ({ children }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) return null;
  if (!currentUser) return <Navigate to="/" replace />;

  if (userData && userData.role === "partner") {
    return <Navigate to="/partner" replace />;
  }

  return children;
};

// --- [PRESERVED] Partner Route Wrapper ---
const PartnerRoute = ({ children }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) return null;
  if (!currentUser) return <Navigate to="/" replace />;

  if (userData && userData.role !== "partner") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppContent = () => {
  const { loading: agencyLoading, isAgencyMode, agencyData } = useAgency();

  if (agencyLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5edff4]"></div>
          <p className="text-slate-400 font-bold animate-pulse">
            {isAgencyMode
              ? `Loading ${agencyData?.agencyName}...`
              : "Initializing Academy..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="/courses"
          element={
            <>
              <Navbar />
              <Courses />
              <Footer />
            </>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <>
              <Navbar />
              <CourseDetails />
              <Footer />
            </>
          }
        />
        <Route
          path="/ebooks"
          element={
            <>
              <Navbar />
              <EBooks />
              <Footer />
            </>
          }
        />
        <Route
          path="/ebooks/:id"
          element={
            <>
              <Navbar />
              <EBookDetails />
              <Footer />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <AboutUs />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Navbar />
              <ContactUs />
              <Footer />
            </>
          }
        />

        <Route
          path="/agency-setup"
          element={
            <PartnerRoute>
              <Navbar />
              <AgencySetup />
              <Footer />
            </PartnerRoute>
          }
        />

        {/* --- [UPDATED] PARTNER CONSOLE ROUTES --- */}
        <Route
          path="/partner"
          element={
            <PartnerRoute>
              <PartnerLayout />
            </PartnerRoute>
          }
        >
          <Route index element={<PartnerDashboard />} />
          <Route path="financials" element={<Financials />} />
          <Route path="students" element={<StudentIntelligence />} />
          <Route path="coupons" element={<CouponIntelligence />} />
          <Route path="sales" element={<SalesIntelligence />} />
          <Route path="settings" element={<AgencySetup />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* STUDENT DASHBOARD ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="ebooks" element={<EBookLibrary />} />
          <Route path="progress" element={<ProgressReport />} />
          <Route path="explore" element={<ExploreCourses />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AgencyProvider>
        <EBookProvider>
          <AppContent />
        </EBookProvider>
      </AgencyProvider>
    </Router>
  );
};

export default App;
