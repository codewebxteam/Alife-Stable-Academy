import React, { createContext, useContext, useState, useEffect } from "react";
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

  useEffect(() => {
    const detectAgency = async () => {
      const hostname = window.location.hostname;
      // Agar localhost hai to check karo subdomain hai ya nahi (e.g. zinstitute.localhost)
      const parts = hostname.split(".");

      // Logic: Agar parts > 2 hain, matlab subdomain exist karta hai
      // Example: zinstitute.alifestableacademy.com (3 parts)
      const isSubdomain =
        parts.length > (hostname.includes("localhost") ? 1 : 2);

      if (isSubdomain) {
        const subdomain = parts[0].toLowerCase();

        // Skip 'www' or main domain names
        if (subdomain !== "www" && subdomain !== "alifestableacademy") {
          try {
            // Check Firebase for this subdomain settings
            const agencyData = await fetchAgencyBySubdomain(subdomain);

            if (agencyData) {
              setAgency({
                ...agencyData,
                pricingMultiplier: agencyData.pricingMultiplier || 1.2,
              });
              setIsMainSite(false);
            }
          } catch (error) {
            console.error("Agency Fetch Error:", error);
          }
        }
      }
      setLoading(false);
    };

    detectAgency();
  }, []);

  // [PRO FEATURE] Global Dynamic CSS Injector
  // Ye partner ke colors ko poori app ke CSS variables mein inject kar dega
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

      // Update Tab Title
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
