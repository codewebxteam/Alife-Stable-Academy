import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();

  const hiddenNavbarRoutes = [
    "/dashboard",
    "/dashboard/courses",
    "/dashboard/purchases",
    "/social/new",
    "/social/newsfeed",
    "/social/chat"
  ];

  const hiddenFooterRoutes = [
    "/dashboard",
    "/dashboard/courses",
    "/dashboard/purchases",
    "/social/new",
    "/social/newsfeed",
    "/social/chat"
  ];

  const shouldHideNavbar = hiddenNavbarRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const shouldHideFooter = hiddenFooterRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideNavbar && <Navbar />}

      {/* ⭐ IMPORTANT: Replace children with <Outlet /> */}
      <main className="flex-1">
        <Outlet />
      </main>

      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default Layout;
