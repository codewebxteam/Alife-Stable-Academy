export const generateReferralCode = () => {
  const letters = Math.random().toString(36).substring(2, 5).toUpperCase();
  const numbers = Math.floor(100 + Math.random() * 900);
  return letters + numbers; // Example -> ABC345
};
