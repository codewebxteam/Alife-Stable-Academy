import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { fetchAgencyBySubdomain } from "../firebase/agencyService";

const AgencyContext = createContext();

export const AgencyProvider = ({ children }) => {
  const [agency, setAgency] = useState({
    agencyName: "Alife Stable",
    themeColor: "#0f172a", // Navy
    accentColor: "#5edff4", // Cyan
    pricingMultiplier: 1, // Base Price
    logoUrl: null,
    socialLinks: {},
  });

  const [isMainSite, setIsMainSite] = useState(true);
  const [loading, setLoading] = useState(true);

  // --- REFRESH / DETECT AGENCY FUNCTION ---
  // यह फंक्शन URL चेक करेगा और बताएगा कि यह मेन साइट है या पार्टनर की साइट
  const refreshAgency = useCallback(async () => {
    setLoading(true);

    try {
      const hostname = window.location.hostname;
      const MAIN_DOMAIN = "alifestableacademy.com"; // आपका मुख्य डोमेन
      let subdomain = null;

      // 1. Localhost Handling (Testing ke liye)
      if (hostname.includes("localhost")) {
        const parts = hostname.split(".");
        if (parts.length > 1 && parts[0] !== "www") {
          subdomain = parts[0].toLowerCase();
        }
      }
      // 2. Production Domain Handling
      else if (hostname.endsWith(MAIN_DOMAIN)) {
        // e.g. partner.alifestableacademy.com -> parts = ['partner', 'alifestableacademy', 'com']
        const parts = hostname.split(".");
        // अगर 2 से ज्यादा पार्ट्स हैं (जैसे sub.domain.com), तो पहला वाला सबडोमेन है
        if (parts.length > 2 && parts[0] !== "www") {
          subdomain = parts[0].toLowerCase();
        }
      }

      // 3. Fetch Data if Subdomain Exists
      if (subdomain) {
        console.log("🔍 Detecting Agency for:", subdomain);
        const agencyData = await fetchAgencyBySubdomain(subdomain);

        if (agencyData) {
          setAgency({
            ...agencyData,
            pricingMultiplier: agencyData.pricingMultiplier || 1.2,
          });
          setIsMainSite(false);
        } else {
          console.warn("⚠️ Agency not found, loading main site.");
          setIsMainSite(true);
        }
      } else {
        setIsMainSite(true);
      }
    } catch (error) {
      console.error("❌ Agency Context Error:", error);
      setIsMainSite(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial Load par check karega
  useEffect(() => {
    refreshAgency();
  }, [refreshAgency]);

  // [PRO FEATURE] Global Dynamic CSS Injector
  // पार्टनर के कलर्स पूरी वेबसाइट पर अपने आप लग जाएंगे
  useEffect(() => {
    if (!loading) {
      document.documentElement.style.setProperty(
        "--brand-color",
        agency.themeColor
      );
      document.documentElement.style.setProperty(
        "--accent-color",
        agency.accentColor
      );

      // Tab Title Update
      document.title = isMainSite
        ? "Alife Stable Academy | Learn Smarter"
        : `${agency.agencyName} | Powered by Alife Stable`;
    }
  }, [agency, loading, isMainSite]);

  return (
    <AgencyContext.Provider
      value={{
        agency,
        isMainSite,
        isPartner: !isMainSite,
        loading,
        refreshAgency, // ✨ यहाँ फिक्स किया गया है (Ab ye available hai)
      }}
    >
      {children}
    </AgencyContext.Provider>
  );
};

export const useAgency = () => {
  const context = useContext(AgencyContext);
  if (!context) throw new Error("useAgency must be used within AgencyProvider");
  return context;
};
