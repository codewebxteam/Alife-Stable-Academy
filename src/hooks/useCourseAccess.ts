import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { hasAccessToCourse, isPackageActive } from "@/utils/courseAccess";

export const useCourseAccess = (courseId?: string) => {
  const { user } = useAuth();
  const [activePackage, setActivePackage] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const purchasesRef = ref(db, `users/${user.uid}/purchases`);
    const unsubscribe = onValue(purchasesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const purchaseList = Object.values(data);
        setPurchases(purchaseList);

        // Find active package
        const active = purchaseList.find((p: any) => 
          p.status === 'active' && isPackageActive(p.purchaseDate, p.packageId)
        );

        if (active) {
          setActivePackage(active.packageId);
          
          // Check course access if courseId provided
          if (courseId) {
            setHasAccess(hasAccessToCourse(active.packageId, courseId));
          }
        } else {
          setActivePackage(null);
          setHasAccess(false);
        }
      } else {
        setActivePackage(null);
        setHasAccess(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, courseId]);

  return { activePackage, purchases, loading, hasAccess };
};
