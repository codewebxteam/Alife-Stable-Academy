import { db } from "./config"; // Ab ye error nahi dega
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";

// Subdomain Check logic
export const checkSubdomainAvailability = async (subdomain) => {
  const q = query(collection(db, "partners"), where("subdomain", "==", subdomain.toLowerCase()));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty;
};

// Save Agency Data logic
export const saveAgencySetup = async (userId, agencyData) => {
  try {
    const agencyRef = doc(db, "partners", userId);
    await setDoc(agencyRef, {
      ...agencyData,
      ownerId: userId,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    const mappingRef = doc(db, "subdomain_mapping", agencyData.subdomain.toLowerCase());
    await setDoc(mappingRef, { ownerId: userId });
    
    return { success: true };
  } catch (error) {
    throw error;
  }
};

// Fetch Agency logic
export const fetchAgencyBySubdomain = async (subdomain) => {
  const mappingRef = doc(db, "subdomain_mapping", subdomain.toLowerCase());
  const mappingSnap = await getDoc(mappingRef);
  
  if (mappingSnap.exists()) {
    const ownerId = mappingSnap.data().ownerId;
    const agencySnap = await getDoc(doc(db, "partners", ownerId));
    return agencySnap.exists() ? agencySnap.data() : null;
  }
  return null;
};