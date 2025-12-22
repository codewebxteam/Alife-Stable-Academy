import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase/config"; // [UPDATED] Import db for Firestore
import { doc, setDoc, getDoc } from "firebase/firestore"; // [NEW] Firestore methods

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null); // [NEW] To store Firestore user data (role, etc.)
  const [loading, setLoading] = useState(true);

  // 1. [UPDATED] Signup Function with Role Management
  const signup = async (email, password, name, role = "student") => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update Firebase Auth Profile
    await updateProfile(userCredential.user, { displayName: name });

    // [NEW] Save User Profile with Role in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      name: name,
      email: email,
      role: role, // 'student' or 'partner'
      createdAt: new Date().toISOString(),
    });

    return userCredential;
  };

  // 2. Login Function
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // 3. Logout Function
  const logout = () => {
    setUserData(null);
    return signOut(auth);
  };

  // 4. [UPDATED] Monitor Auth State & Fetch Firestore Data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // [NEW] Fetch user role and extra data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData, // [NEW] Provide role/extra data globally
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
