import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, db } from '@/lib/firebase';

type UserRole = 'partner' | 'student';

interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  mobile: string;
  instituteName?: string;

  referralCode?: string;

  partnerSubdomain?: string;
  partnerCustomPricing?: number | null;
  commissionEarned?: number;
}

interface SignupData {
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
  mobile: string;
  instituteName?: string;
  referralCode?: string;
}


export type { SignupData };

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signup: (data: SignupData) => Promise<void>;
  login: (email: string, password: string) => Promise<UserRole>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await getUserData(firebaseUser.uid);
        setUser(userData);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  
  const getUserData = async (uid: string): Promise<User | null> => {
    try {
      const userRef = ref(db, `users/${uid}`);
      const snapshot = await get(userRef);
      return snapshot.exists() ? (snapshot.val() as User) : null;
    } catch {
      return null;
    }
  };

  
  const signup = async (data: SignupData) => {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const uid = userCredential.user.uid;

   
    const autoReferral = Math.random().toString(36).substring(2, 8);
    const cleanName = data.fullName.toLowerCase().replace(/\s+/g, "");
    const subdomain = `${cleanName}-academy`;

    const userData: User = {
      id: uid,
      email: data.email,
      role: data.role,
      fullName: data.fullName,
      mobile: data.mobile,

      
      ...(data.role === "student" && data.referralCode && {
        referralCode: data.referralCode
      }),

     
      ...(data.role === "partner" && {
        instituteName: data.instituteName,
        referralCode: autoReferral,
        partnerSubdomain: subdomain,
        partnerCustomPricing: null,
        commissionEarned: 0
      })
    };

    await set(ref(db, `users/${uid}`), userData);
    setUser(userData);
  };

  
  const login = async (email: string, password: string): Promise<UserRole> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userData = await getUserData(userCredential.user.uid);
    if (!userData) throw new Error("User data not found");
    return userData.role;
  };

  
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
