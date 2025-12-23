import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const EBookContext = createContext();

export const useEBook = () => useContext(EBookContext);

export const EBookProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [purchasedBooks, setPurchasedBooks] = useState([]);

  useEffect(() => {
    if (currentUser) {
      loadPurchasedBooks();
    } else {
      setPurchasedBooks([]);
    }
  }, [currentUser]);

  const loadPurchasedBooks = async () => {
    if (!currentUser) return;
    const docRef = doc(db, "purchasedBooks", currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setPurchasedBooks(docSnap.data().bookIds || []);
    }
  };

  const purchaseBook = async (bookId) => {
    if (!currentUser) return;
    const newPurchased = [...purchasedBooks, bookId];
    setPurchasedBooks(newPurchased);
    
    const docRef = doc(db, "purchasedBooks", currentUser.uid);
    await setDoc(docRef, { bookIds: newPurchased }, { merge: true });
  };

  return (
    <EBookContext.Provider value={{ purchasedBooks, purchaseBook }}>
      {children}
    </EBookContext.Provider>
  );
};
