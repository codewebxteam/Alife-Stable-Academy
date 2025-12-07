import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  Users,
  Bell,
  MessageCircle,
  User,
  Award,
  LogOut,
  ChevronRight,
  ChevronDown,
  Menu,
  GraduationCap,
  X,
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && user.role !== 'partner') {
      navigate('/');
    }
  }, [user, navigate]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSocialMenu, setShowSocialMenu] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileUserMenu, setShowMobileUserMenu] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileUserMenuRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({ courses: 0, score: 0, attendance: 0, lateEntries: 0 });
  const [courses, setCourses] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (mobileUserMenuRef.current && !mobileUserMenuRef.current.contains(event.target as Node)) {
        setShowMobileUserMenu(false);
      }
    };
    if (showDropdown || showMobileUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown, showMobileUserMenu]);

  useEffect(() => {
    if (!user?.uid || user.role !== 'partner') return;

    const unsubscribers: (() => void)[] = [];

    // Listen to user stats
    const statsQuery = query(collection(db, "userStats"), where("userId", "==", user.uid));
    unsubscribers.push(onSnapshot(statsQuery, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setStats({
          courses: data.totalCourses || 0,
          score: data.totalScore || 0,
          attendance: data.attendance || 0,
          lateEntries: data.lateEntries || 0
        });
      }
    }));

    // Listen to enrolled courses
    const coursesQuery = query(collection(db, "enrollments"), where("userId", "==", user.uid));
    unsubscribers.push(onSnapshot(coursesQuery, (snapshot) => {
      setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }));

    // Listen to upcoming classes
    const classesQuery = query(collection(db, "classes"), where("userId", "==", user.uid));
    unsubscribers.push(onSnapshot(classesQuery, (snapshot) => {
      setClasses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }));

    // Listen to notifications
    const notificationsQuery = query(collection(db, "notifications"), where("userId", "==", user.uid));
    unsubscribers.push(onSnapshot(notificationsQuery, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }));

    // Listen to tasks
    const tasksQuery = query(collection(db, "tasks"), where("userId", "==", user.uid));
    unsubscribers.push(onSnapshot(tasksQuery, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }));

    return () => unsubscribers.forEach(unsub => unsub());
  }, [user?.uid]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "Courses", path: "/dashboard/courses" },
    { icon: ShoppingBag, label: "Additional Purchases", path: "/dashboard/purchases" },
  ];

  const overviewCards = [
    { label: "Total Courses", value: stats.courses.toString(), color: "bg-blue-500" },
    { label: "Total Score", value: stats.score.toString(), color: "bg-green-500" },
    { label: "Attendance", value: `${stats.attendance}%`, color: "bg-orange-500" },
    { label: "Late Entries", value: stats.lateEntries.toString(), color: "bg-red-500" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Right Sidebar Overlay */}
      {showRightSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowRightSidebar(false)}
        />
      )}

      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Menu Button (Mobile Only) */}
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-800 text-lg">LearnSphere</span>
          </NavLink>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-6 flex-1 justify-center">
            <NavLink to="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">Home</NavLink>
            <NavLink to="/courses" className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">Courses</NavLink>
            <NavLink to="/books" className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">Books</NavLink>
            <NavLink to="/pre-recorded" className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">Pre-Recorded</NavLink>
            <NavLink to="/study-material" className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">Study Material</NavLink>
            <NavLink to="/consultation" className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">1:1 Consultation</NavLink>
            <NavLink to="/webinar" className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">Webinar</NavLink>
            <NavLink to="/blogs" className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">Blogs</NavLink>
          </nav>

          {/* Right: Desktop Icons & User Menu */}
          <div className="hidden xl:flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MessageCircle className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="relative" ref={dropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className="flex items-center gap-3 hover:bg-gray-50 rounded-full px-3 py-2 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                {user?.email?.[0].toUpperCase() || "U"}
              </div>
              <span className="font-medium text-gray-700">
                {user?.email?.split("@")[0] || "User"}
              </span>
            </button>

            {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-[100]">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm text-gray-500">Hi,</p>
                    <p className="font-semibold text-gray-800">
                      {user?.email?.split("@")[0] || "User"}
                    </p>
                  </div>
                  <div className="py-2">
                    {user?.role === 'partner' && (
                      <button 
                        onClick={() => { setShowDropdown(false); navigate('/resell'); }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span className="text-sm">Resell</span>
                      </button>
                    )}
                    {user?.role !== 'partner' && (
                      <>
                        <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700">
                          <User className="h-4 w-4" />
                          <span className="text-sm">My Profile</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700">
                          <ShoppingBag className="h-4 w-4" />
                          <span className="text-sm">Purchase History</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700">
                          <Award className="h-4 w-4" />
                          <span className="text-sm">My Certificates</span>
                        </button>
                      </>
                    )}
                    <div className="border-t border-gray-100 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Menu Button for Right Sidebar (Mobile/Tablet) */}
          <button
            onClick={() => setShowRightSidebar(true)}
            className="xl:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className={`fixed lg:static w-64 bg-white border-r border-gray-200 h-full flex flex-col z-40 transition-transform duration-300 lg:translate-x-0 ${
          showMobileSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-6 lg:hidden">
            <h2 className="text-2xl font-bold text-gray-800">LearnSphere</h2>
          </div>
        <nav className="px-4 space-y-2 flex-1">
          {sidebarItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
          
          {/* Social Connect with Dropdown */}
          <div>
            <button
              onClick={() => setShowSocialMenu(!showSocialMenu)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5" />
                <span className="font-medium">Social Connect</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${showSocialMenu ? 'rotate-180' : ''}`} />
            </button>
            {showSocialMenu && (
              <div className="ml-4 mt-2 space-y-1">
                <NavLink to="/social/newsfeed" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                  Newsfeed
                </NavLink>
                <NavLink to="/social/chat" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                  Chat
                </NavLink>
              </div>
            )}
          </div>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Dashboard Content */}
          <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {user?.email?.split("@")[0] || "User"}!
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Here's what's happening with your learning today</p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {overviewCards.map((card, i) => (
              <Card key={i} className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${card.color} rounded-lg mb-3 sm:mb-4 flex items-center justify-center`}>
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">{card.label}</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">{card.value}</p>
              </Card>
            ))}
          </div>

          {/* Grid Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* My Courses */}
            <Card className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">My Courses</h2>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {courses.length > 0 ? courses.slice(0, 3).map((course) => (
                  <div key={course.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{course.title || 'Course'}</p>
                      <p className="text-sm text-gray-500">Progress: {course.progress || 0}%</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 text-center py-4">No courses enrolled yet</p>
                )}
              </div>
            </Card>

            {/* Live/Upcoming Classes */}
            <Card className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Live/Upcoming Classes</h2>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {classes.length > 0 ? classes.slice(0, 2).map((cls) => (
                  <div key={cls.id} className="p-4 bg-blue-50 rounded-lg">
                    <p className="font-medium text-gray-800 mb-1">{cls.title || 'Class'}</p>
                    <p className="text-sm text-gray-600">{cls.schedule || 'TBD'}</p>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 text-center py-4">No upcoming classes</p>
                )}
              </div>
            </Card>

            {/* Notifications */}
            <Card className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Notifications</h2>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {notifications.length > 0 ? notifications.slice(0, 3).map((notif) => (
                  <div key={notif.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-800">{notif.message || 'Notification'}</p>
                      <p className="text-xs text-gray-500">{notif.time || 'Just now'}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 text-center py-4">No notifications</p>
                )}
              </div>
            </Card>

            {/* Tasks & Quiz */}
            <Card className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Tasks & Quiz</h2>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {tasks.length > 0 ? tasks.slice(0, 2).map((task) => (
                  <div key={task.id} className="p-4 border border-gray-200 rounded-lg">
                    <p className="font-medium text-gray-800 mb-1">{task.title || 'Task'}</p>
                    <p className="text-sm text-gray-600">Due: {task.dueDate || 'TBD'}</p>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 text-center py-4">No pending tasks</p>
                )}
              </div>
            </Card>
          </div>
        </div>
        </main>
      </div>

      {/* Right Sidebar */}
      <aside className={`fixed right-0 top-0 w-80 bg-white border-l border-gray-200 h-full flex flex-col z-50 transition-transform duration-300 shadow-2xl ${
        showRightSidebar ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Menu</h2>
          <button
            onClick={() => setShowRightSidebar(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-2 flex-1 overflow-y-auto">
          {/* Page Links */}
          <div className="mb-4 pb-4 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2 px-4">Pages</p>
            <NavLink to="/" onClick={() => setShowRightSidebar(false)} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              Home
            </NavLink>
            <NavLink to="/courses" onClick={() => setShowRightSidebar(false)} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              Courses
            </NavLink>
            <NavLink to="/books" onClick={() => setShowRightSidebar(false)} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              Books
            </NavLink>
            <NavLink to="/pre-recorded" onClick={() => setShowRightSidebar(false)} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              Pre-Recorded
            </NavLink>
            <NavLink to="/study-material" onClick={() => setShowRightSidebar(false)} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              Study Material
            </NavLink>
            <NavLink to="/consultation" onClick={() => setShowRightSidebar(false)} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              1:1 Consultation
            </NavLink>
            <NavLink to="/webinar" onClick={() => setShowRightSidebar(false)} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              Webinar
            </NavLink>
            <NavLink to="/blogs" onClick={() => setShowRightSidebar(false)} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              Blogs
            </NavLink>
          </div>

          {/* Dashboard Links */}
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2 px-4">Dashboard</p>
          {sidebarItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              onClick={() => setShowRightSidebar(false)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
          
          {/* Social Connect with Dropdown */}
          <div>
            <button
              onClick={() => setShowSocialMenu(!showSocialMenu)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5" />
                <span className="font-medium">Social Connect</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${showSocialMenu ? 'rotate-180' : ''}`} />
            </button>
            {showSocialMenu && (
              <div className="ml-4 mt-2 space-y-1">
                <NavLink 
                  to="/social/newsfeed" 
                  onClick={() => setShowRightSidebar(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Newsfeed
                </NavLink>
                <NavLink 
                  to="/social/chat" 
                  onClick={() => setShowRightSidebar(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Chat
                </NavLink>
              </div>
            )}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
              {user?.email?.[0].toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">
                {user?.email?.split("@")[0] || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 text-sm">
              <MessageCircle className="h-4 w-4" />
              <span>Messages</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 text-sm">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
              <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 text-sm">
              <User className="h-4 w-4" />
              <span>My Profile</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 text-sm">
              <Award className="h-4 w-4" />
              <span>Certificates</span>
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-red-600 hover:bg-red-50 mt-3 text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;
