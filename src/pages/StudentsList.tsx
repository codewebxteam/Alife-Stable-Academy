import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { ref, onValue, query, orderByChild, equalTo, remove } from "firebase/database";
import { db } from "@/lib/firebase";

interface Student {
  id: string;
  email: string;
  fullName?: string;
  joinedAt?: string;
}

const StudentsList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'partner') {
      navigate('/');
      return;
    }

    const name = user.fullName?.toLowerCase().replace(/\s+/g, '') || 
                 user.email?.split('@')[0].toLowerCase();
    const fullSubdomain = `${name}.alife-stable-academy.com`;

    const usersRef = ref(db, 'users');
    const studentsQuery = query(usersRef, orderByChild('referralCode'), equalTo(fullSubdomain));
    
    const unsubscribe = onValue(studentsQuery, (snapshot) => {
      const studentsList: Student[] = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        studentsList.push({
          id: childSnapshot.key!,
          email: data.email,
          fullName: data.fullName,
          joinedAt: data.createdAt
        });
      });
      setStudents(studentsList);
    });

    return () => unsubscribe();
  }, [user, navigate]);

  const handleRemoveStudent = async (studentId: string, email: string) => {
    if (!confirm(`Remove ${email}?`)) return;
    
    try {
      await remove(ref(db, `users/${studentId}`));
      toast.success("Student removed");
    } catch (error) {
      toast.error("Failed to remove student");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
      <Card className="w-full max-w-lg bg-gradient-to-br from-[#0D1B2A]/95 via-[#1B263B]/95 to-[#0D1B2A]/95 border border-orange-500/30 rounded-2xl shadow-2xl backdrop-blur-xl p-6 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">My Students</h1>
              <p className="text-xs text-gray-400">{students.length} total</p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/resell')}
            size="sm"
            className="bg-white/5 border border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-y-auto space-y-2 flex-1 pr-2">
          {students.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No students yet</p>
            </div>
          ) : (
            students.map((student) => (
              <div
                key={student.id}
                className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {student.fullName?.[0]?.toUpperCase() || student.email[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium text-sm truncate">{student.fullName || 'Student'}</p>
                    <p className="text-xs text-gray-400 truncate">{student.email}</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleRemoveStudent(student.id, student.email)}
                  size="sm"
                  className="bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 px-2 py-1 ml-2 flex-shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default StudentsList;
