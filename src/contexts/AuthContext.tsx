import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { auth, db } from "@/lib/firebase";

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
      if (!firebaseUser) {
        setUser(null);
        return;
      }

      const snap = await get(ref(db, `users/${firebaseUser.uid}`));
      setUser(snap.exists() ? (snap.val() as User) : null);
    });

    return unsubscribe;
  }, []);

  /* 🟢 SIGNUP */
  const signup = async (data: SignupData) => {
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

      ...(data.role === "partner" && {
        instituteName: data.instituteName,
        referralCode: autoReferral,
      }),
    };

    await set(ref(db, `users/${uid}`), userData);
    setUser(userData);
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
