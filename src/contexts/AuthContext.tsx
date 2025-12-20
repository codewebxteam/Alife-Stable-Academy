import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { auth, db, firestore } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";

/* ================= TYPES ================= */

export type UserRole = "partner" | "student";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  mobile: string;
  instituteName?: string;
  referralCode?: string;
  plan?: string;
}

/* ✅ IMPORTANT: DIRECT EXPORT (THIS FIXES SignupData ERROR) */
export interface SignupData {
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
  mobile: string;
  instituteName?: string;
  referralCode?: string;
  plan?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;

  // 🔥 referral branding (reactive)
  referralName: string | null;
  setReferralName: (name: string | null) => void;

  signup: (data: SignupData) => Promise<void>;
  login: (email: string, password: string) => Promise<UserRole>;
  logout: () => Promise<void>;
}

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

/* ================= PROVIDER ================= */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // ✅ GLOBAL + REACTIVE referral branding
  const [referralName, setReferralNameState] = useState<string | null>(
    localStorage.getItem("ref_by_name")
  );

  const setReferralName = (name: string | null) => {
    if (name) {
      localStorage.setItem("ref_by_name", name);
    } else {
      localStorage.removeItem("ref_by_name");
    }
    setReferralNameState(name);
  };

  /* 🔁 AUTH STATE LISTENER */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (isSigningUp) return;
      
      if (!firebaseUser) {
        setUser(null);
        return;
      }

      try {
        const snap = await get(ref(db, `users/${firebaseUser.uid}`));
        if (snap.exists()) {
          setUser(snap.val() as User);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    });

    return unsubscribe;
  }, [isSigningUp]);

  /* 🟢 SIGNUP */
  const signup = async (data: SignupData) => {
    setIsSigningUp(true);
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const uid = cred.user.uid;
      const autoReferral = Math.random().toString(36).substring(2, 8);

      const userData: User = {
        id: uid,
        email: data.email,
        role: data.role,
        fullName: data.fullName,
        mobile: data.mobile,

        ...(data.role === "student" &&
          data.referralCode && {
            referralCode: data.referralCode,
          }),

        ...(data.role === "student" &&
          data.plan && {
            plan: data.plan,
          }),

        ...(data.role === "partner" && {
          instituteName: data.instituteName,
          referralCode: autoReferral,
        }),
      };

      await set(ref(db, `users/${uid}`), userData);
      setUser(userData);
      setIsSigningUp(false);

      // Run async operations in background
      Promise.all([
        // Track partner referral for students
        (async () => {
          if (data.role === "student" && data.referralCode) {
            const referralCode = data.referralCode.replace('.alife-stable-academy.com', '');
            const usersRef = ref(db, 'users');
            const usersSnapshot = await get(usersRef);
            
            if (usersSnapshot.exists()) {
              const users = usersSnapshot.val();
              const partnerId = Object.keys(users).find(
                key => users[key].referralCode === referralCode && users[key].role === 'partner'
              );
              
              if (partnerId) {
                await addDoc(collection(firestore, "sales"), {
                  partnerId,
                  customerName: data.fullName,
                  customerEmail: data.email,
                  courseName: "Platform Registration",
                  amount: 0,
                  purchaseDate: serverTimestamp(),
                  expiryDate: null,
                  planDays: 0,
                  createdAt: serverTimestamp()
                });
              }
            }
          }
        })(),
        // Initialize partner data in Firestore
        (async () => {
          if (data.role === "partner") {
            await addDoc(collection(firestore, "partners"), {
              userId: uid,
              instituteName: data.instituteName,
              referralCode: autoReferral,
              commissionRate: 10,
              pendingCommission: 0,
              clearedCommission: 0,
              createdAt: serverTimestamp()
            });
          }
        })()
      ]).catch(err => console.error("Background operations error:", err));
    } catch (error) {
      setIsSigningUp(false);
      throw error;
    }
  };

  /* 🟢 LOGIN */
  const login = async (
    email: string,
    password: string
  ): Promise<UserRole> => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const snap = await get(ref(db, `users/${cred.user.uid}`));
    return (snap.val() as User).role;
  };

  /* 🔴 LOGOUT */
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setReferralName(null);
    localStorage.removeItem("pendingReferral");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        referralName,
        setReferralName,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
