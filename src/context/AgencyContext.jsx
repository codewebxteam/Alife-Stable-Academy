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
            themeColor: data.themeColor || "#0f172a", // [ADDED]
            accentColor: data.accentColor || "#5edff4", // [ADDED]
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

  // --- [FIXED] DYNAMIC TITLE & THEME UPDATE ---
  useEffect(() => {
    if (!loading) {
      if (!isMainSite && agency) {
        // --- PARTNER SITE ---
        // Partner ke colors inject karein
        document.documentElement.style.setProperty(
          "--brand-color",
          agency.themeColor || "#0f172a"
        );
        document.documentElement.style.setProperty(
          "--accent-color",
          agency.accentColor || "#5edff4"
        );
        // Partner ka Title
        document.title = `${agency.name} | Learning Portal`;
      } else {
        // --- MAIN SITE ---
        // Default colors par wapas layein
        document.documentElement.style.removeProperty("--brand-color");
        document.documentElement.style.removeProperty("--accent-color");
        // Main Site Title [UPDATED]
        document.title = "Alife Stable Academy | Learn Smarter";
      }
    }
  }, [agency, isMainSite, loading]);

  // --- HELPER: GET CUSTOM PRICE ---
  const getPrice = (courseId, originalPrice) => {
    if (isMainSite || !agency?.customPrices) return originalPrice;

    const customPrice = agency.customPrices[courseId];
    return customPrice !== undefined && customPrice !== ""
      ? customPrice
      : originalPrice;
  };

  return (
    <AgencyContext.Provider
      value={{
        agency,
        isMainSite,
        isPartner: !isMainSite, // Helper boolean
        loading,
        refreshAgency,
        getPrice,
      }}
    >
      {children}
    </AgencyContext.Provider>
  );
};
