import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Copy, Check, Share2, ExternalLink, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { ref, onValue, query, orderByChild, equalTo, push, set, update } from "firebase/database";
import { db } from "@/lib/firebase";
import { APP_BASE_URL, REFERRAL_PATH } from "@/config/appConfig";

const availableCourses = [
  { id: 1, title: "Complete Web Development Bootcamp", price: 2999 },
  { id: 2, title: "AI & Machine Learning Mastery", price: 4999 },
  { id: 3, title: "Digital Marketing & Growth Hacking", price: 2499 },
  { id: 4, title: "UI/UX Design Complete Course", price: 3499 },
  { id: 5, title: "Python for Data Analysis", price: 3299 },
  { id: 6, title: "Advanced React & Next.js", price: 4499 },
];

const Resell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [studentCount, setStudentCount] = useState(0);
  const [showResellForm, setShowResellForm] = useState(false);
  const [resellCourses, setResellCourses] = useState([{ courseId: "", sellingPrice: "" }]);
  const [existingResellCourses, setExistingResellCourses] = useState<any[]>([]);

  useEffect(() => {
    if (!user || user.role !== "partner") {
      navigate("/");
      return;
    }

    if (!user.referralCode) {
      setReferralCode("");
      setStudentCount(0);
      return;
    }

    const partnerRefCode = user.referralCode;
    setReferralCode(partnerRefCode);

    const usersRef = ref(db, "users");
    const studentsQuery = query(
      usersRef,
      orderByChild("referralCode"),
      equalTo(partnerRefCode)
    );

    const unsubscribe = onValue(studentsQuery, (snapshot) => {
      if (!snapshot.exists()) {
        setStudentCount(0);
        return;
      }
      setStudentCount(Object.keys(snapshot.val()).length);
    });

    // Fetch existing resell courses
    const resellRef = ref(db, 'resellCourses');
    const unsubscribeResell = onValue(resellRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const cleanCode = partnerRefCode.replace('.alife-stable-academy.com', '');
        const filtered = Object.values(data).filter((course: any) => 
          course.referralCode === cleanCode || course.partnerId === user.uid
        );
        setExistingResellCourses(filtered);
      } else {
        setExistingResellCourses([]);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeResell();
    };
  }, [user, navigate]);

  // ✅ CONFIG-DRIVEN (ONLY appConfig.js controls domain)
  const referralLink = `${APP_BASE_URL}${REFERRAL_PATH}/${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = async () => {
    const message = `Join Alife Stable Academy using my referral link: ${referralLink}`;

    if (navigator.share) {
      await navigator.share({
        title: "Partner Referral",
        text: message,
      });
    } else {
      handleCopyLink();
    }
  };

  const addCourseRow = () => {
    setResellCourses([...resellCourses, { courseId: "", sellingPrice: "" }]);
  };

  const removeCourseRow = (index) => {
    setResellCourses(resellCourses.filter((_, i) => i !== index));
  };

  const updateCourse = (index, field, value) => {
    const updated = [...resellCourses];
    updated[index][field] = value;
    setResellCourses(updated);
  };

  const handleSubmitResell = async () => {
    const validCourses = resellCourses.filter(c => c.courseId && c.sellingPrice);
    if (validCourses.length === 0) {
      toast.error("Please add at least one course");
      return;
    }

    // Check for duplicates
    const existingCourseIds = existingResellCourses.map(c => c.courseId);
    const duplicates = validCourses.filter(c => existingCourseIds.includes(c.courseId));
    if (duplicates.length > 0) {
      toast.error("Some courses are already added. You can edit them from Dashboard.");
      return;
    }

    try {
      const partnerId = user?.uid || referralCode;
      const data = validCourses.map(c => {
        const course = availableCourses.find(ac => ac.id === parseInt(c.courseId));
        return {
          courseId: c.courseId,
          courseName: course.title,
          actualPrice: course.price,
          sellingPrice: parseInt(c.sellingPrice),
          commission: parseInt(c.sellingPrice) - course.price,
          status: "unpaid",
          partnerId: partnerId,
          referralCode: referralCode,
          createdAt: Date.now()
        };
      });
      
      for (const courseData of data) {
        const resellRef = push(ref(db, 'resellCourses'));
        await set(resellRef, courseData);
      }
      
      toast.success("Courses added for reselling!");
      setShowResellForm(false);
      setResellCourses([{ courseId: "", sellingPrice: "" }]);
    } catch (error) {
      console.error('Full error:', error);
      toast.error("Failed to add courses: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 backdrop-blur-sm p-4 sm:p-6">
      <Card className="w-full max-w-md bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] border border-orange-500/30 rounded-2xl shadow-2xl p-4 sm:p-6 my-6">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Share2 className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Partner Referral
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Share & earn commissions
          </p>
        </div>

        {/* Referral Code */}
        <div className="bg-white/5 border border-orange-500/30 rounded-xl p-3 sm:p-4 mb-4">
          <label className="text-xs font-semibold text-gray-400 mb-2 block">
            Your Referral Code
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 font-mono text-sm text-orange-400 text-center">
              {referralCode}
            </div>
            <Button onClick={handleCopyCode}>
              {copiedCode ? <Check size={16} /> : <Copy size={16} />}
            </Button>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-white/5 border border-orange-500/30 rounded-xl p-3 sm:p-4 mb-4">
          <label className="text-xs font-semibold text-gray-400 mb-2 block">
            Your Referral Link
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 font-mono text-xs text-orange-400 break-all text-center">
              {referralLink}
            </div>
            <Button onClick={handleCopyLink}>
              {copiedLink ? <Check size={16} /> : <Copy size={16} />}
            </Button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleShare} className="flex-1">
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
          <Button onClick={() => setShowResellForm(true)} className="flex-1">
            <Plus className="h-4 w-4 mr-2" /> Add Courses
          </Button>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Back
          </Button>
        </div>

      </Card>

      {/* Resell Form Modal */}
      {showResellForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 my-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Add Courses to Resell</h2>
              <button onClick={() => setShowResellForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {resellCourses.map((course, index) => {
                const selectedCourse = availableCourses.find(c => c.id === parseInt(course.courseId));
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Course {index + 1}</span>
                      {resellCourses.length > 1 && (
                        <button onClick={() => removeCourseRow(index)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Select Course</label>
                      <select
                        value={course.courseId}
                        onChange={(e) => updateCourse(index, "courseId", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="">Choose a course</option>
                        {availableCourses
                          .filter(c => !existingResellCourses.some(ec => ec.courseId === c.id.toString()))
                          .map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                      </select>
                    </div>

                    {selectedCourse && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Actual Price:</span>
                          <span className="font-semibold text-gray-800">₹{selectedCourse.price}</span>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">Your Selling Price</label>
                          <input
                            type="number"
                            value={course.sellingPrice}
                            onChange={(e) => updateCourse(index, "sellingPrice", e.target.value)}
                            placeholder="Enter selling price"
                            min={selectedCourse.price}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                        {course.sellingPrice && parseInt(course.sellingPrice) > selectedCourse.price && (
                          <div className="mt-2 text-sm text-green-600 font-medium">
                            Your Commission: ₹{parseInt(course.sellingPrice) - selectedCourse.price}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              <Button onClick={addCourseRow} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Another Course
              </Button>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSubmitResell} className="flex-1">
                  Submit Courses
                </Button>
                <Button onClick={() => setShowResellForm(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Resell;
