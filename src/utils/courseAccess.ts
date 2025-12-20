// Course access management based on pricing tiers
export const COURSE_PACKAGES = {
  BEGINNER: {
    id: 'pro_starter',
    name: 'Pro Starter',
    price: 999,
    courses: ['course1', 'course2', 'course3', 'course4', 'course5'],
    features: ['5 Core Courses', 'Community Support', 'Weekly Assignments', 'Certificate'],
    duration: 180 // days
  },
  PREMIUM: {
    id: 'premium_elite',
    name: 'Premium Elite',
    price: 2499,
    courses: ['course1', 'course2', 'course3', 'course4', 'course5', 'course6', 'course7', 'course8', 'course9', 'course10', 'course11', 'course12'],
    features: ['12 Advanced Courses', 'Priority Support', 'Case Studies', 'Portfolio Review'],
    duration: 365 // days
  },
  SUPREME: {
    id: 'supreme_master',
    name: 'Supreme Master',
    price: 4999,
    courses: 'all', // Access to all courses
    features: ['All Pro Features', '1-on-1 Mentorship', 'Job Placement', 'Lifetime Access'],
    duration: -1 // Lifetime
  }
} as const;

export const getPackageByPrice = (price: number) => {
  switch (price) {
    case 999:
      return COURSE_PACKAGES.BEGINNER;
    case 2499:
      return COURSE_PACKAGES.PREMIUM;
    case 4999:
      return COURSE_PACKAGES.SUPREME;
    default:
      return null;
  }
};

export const hasAccessToCourse = (userPackage: string | null, courseId: string): boolean => {
  if (!userPackage) return false;
  
  const pkg = Object.values(COURSE_PACKAGES).find(p => p.id === userPackage);
  if (!pkg) return false;
  
  if (pkg.courses === 'all') return true;
  return pkg.courses.includes(courseId);
};

export const isPackageActive = (purchaseDate: number, packageId: string): boolean => {
  const pkg = Object.values(COURSE_PACKAGES).find(p => p.id === packageId);
  if (!pkg) return false;
  
  if (pkg.duration === -1) return true; // Lifetime access
  
  const expiryDate = purchaseDate + (pkg.duration * 24 * 60 * 60 * 1000);
  return Date.now() < expiryDate;
};
