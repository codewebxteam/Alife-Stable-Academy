import { useCourseAccess } from "@/hooks/useCourseAccess";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, BookOpen, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { COURSE_PACKAGES } from "@/utils/courseAccess";

const MyCourses = () => {
  const { activePackage, purchases, loading } = useCourseAccess();
  const navigate = useNavigate();

  if (loading) {
    return <div className="text-center py-8">Loading your courses...</div>;
  }

  if (!activePackage) {
    return (
      <Card className="p-8 text-center">
        <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-bold mb-2">No Active Package</h3>
        <p className="text-gray-600 mb-4">Purchase a package to access courses</p>
        <Button onClick={() => navigate("/pricing")}>View Packages</Button>
      </Card>
    );
  }

  const pkg = Object.values(COURSE_PACKAGES).find(p => p.id === activePackage);
  const activePurchase = purchases.find(p => p.packageId === activePackage);

  const getExpiryText = () => {
    if (!activePurchase) return "";
    if (activePurchase.expiryDate === -1) return "Lifetime Access";
    
    const daysLeft = Math.ceil((activePurchase.expiryDate - Date.now()) / (1000 * 60 * 60 * 24));
    return `${daysLeft} days remaining`;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{pkg?.name}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
              <Clock className="h-4 w-4" />
              {getExpiryText()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-orange-600">
              {pkg?.courses === 'all' ? 'All Courses' : `${pkg?.courses.length} Courses`}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pkg?.courses === 'all' ? (
          <p className="col-span-full text-center text-gray-600">
            You have access to all courses! Browse the courses page to start learning.
          </p>
        ) : (
          pkg?.courses.map((courseId, idx) => (
            <Card key={courseId} className="p-6 hover:shadow-lg transition-shadow">
              <BookOpen className="h-8 w-8 text-orange-500 mb-3" />
              <h4 className="font-bold text-lg mb-2">Course {idx + 1}</h4>
              <p className="text-sm text-gray-600 mb-4">Access granted</p>
              <Button className="w-full" onClick={() => navigate(`/course/${courseId}`)}>
                Start Learning
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MyCourses;
