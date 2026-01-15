import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

const AgencyContext = createContext();

export const useAgency = () => useContext(AgencyContext);

export const AgencyProvider = ({ children }) => {
  // --- STATE ---
  const [agency, setAgency] = useState(null); // Partner Data (Name, Phone, Prices)
  const [isMainSite, setIsMainSite] = useState(true); // True = Main Site, False = Partner Site
  const [loading, setLoading] = useState(true);

  // --- REFRESH AGENCY LOGIC ---
  const refreshAgency = useCallback(async () => {
    setLoading(true);
    try {
      const hostname = window.location.hostname; // e.g., "nexus.codewebx.com"

      // 1. Detect Subdomain
      let subdomain = null;

      // Localhost handling (e.g., test.localhost:5173)
      if (hostname.includes("localhost")) {
        const parts = hostname.split(".");
        if (parts.length > 1 && parts[0] !== "www") {
          subdomain = parts[0].toLowerCase();
        }
      }
      // Production handling (e.g., academy.yoursite.com)
      else {
        const parts = hostname.split(".");
        // Check if there is a subdomain (not www)
        if (parts.length >= 3 && parts[0] !== "www") {
          subdomain = parts[0].toLowerCase();
        }
      }

      // If no subdomain, load Main Site
      if (!subdomain) {
        console.log("Loading Main Site");
        setAgency(null);
        setIsMainSite(true);
        setLoading(false);
        return;
      }

      console.log("🔍 Checking Agency for Subdomain:", subdomain);

      // 2. Fetch Owner ID from 'subdomains' collection
      const subDocRef = doc(db, "subdomains", subdomain);
      const subSnap = await getDoc(subDocRef);

      if (subSnap.exists()) {
        const { ownerId } = subSnap.data();

        // 3. Fetch Full Details from 'agencies' collection
        const agencyDocRef = doc(db, "agencies", ownerId);
        const agencySnap = await getDoc(agencyDocRef);

        if (agencySnap.exists()) {
          const data = agencySnap.data();
          setAgency({
            id: ownerId,
            name: data.name || "Academy",
            email: data.email,
            whatsapp: data.whatsapp,
            upi: data.upi,
            customPrices: data.customPrices || {}, // { courseId: sellingPrice }
            subdomain: subdomain,
          });
          setIsMainSite(false);
        } else {
          // Data consistency issue
          setIsMainSite(true);
        }
      } else {
        // Subdomain not found
        setIsMainSite(true);
      }
    } catch (error) {
      console.error("❌ Agency Context Error:", error);
      setIsMainSite(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    refreshAgency();
  }, [refreshAgency]);

  // --- HELPER: GET CUSTOM PRICE ---
  // Yeh function check karega ki Partner ne apna price set kiya hai ya nahi
  const getPrice = (courseId, originalPrice) => {
    // Agar Main Site hai ya Partner ne price set nahi kiya, toh Original Price dikhao
    if (isMainSite || !agency?.customPrices) return originalPrice;

    const customPrice = agency.customPrices[courseId];

    // Agar custom price exist karta hai (aur khali nahi hai), toh wahi return karo
    return customPrice !== undefined && customPrice !== ""
      ? customPrice
      : originalPrice;
  };

  // --- DYNAMIC TITLE UPDATE ---
  useEffect(() => {
    if (!loading) {
      document.title = isMainSite
        ? "CodeWebX Academy | Learn Coding"
        : `${agency?.name || "Academy"} | Powered by CodeWebX`;
    }
  }, [agency, isMainSite, loading]);

  return (
    <AgencyContext.Provider
      value={{
        agency,
        isMainSite,
        isPartner: !isMainSite, // Helper boolean
        loading,
        refreshAgency,
        getPrice, // ✨ Most Important: Use this in CourseCard
      }}
    >
      {children}
    </AgencyContext.Provider>
  );
};
