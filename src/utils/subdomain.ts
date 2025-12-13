export const generatePartnerSubdomain = (name?: string) => {
  const safeName = name ?? ""; // fallback for undefined
  
  return safeName
    .toLowerCase()
    .replace(/\s+/g, "")          // remove spaces
    .replace(/[^a-z0-9]/g, "");   // remove special chars
};
