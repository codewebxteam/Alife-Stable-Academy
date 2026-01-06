import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useAgency } from "../../context/AgencyContext"; // Real-time UI update ke liye
import {
  checkSubdomainAvailability,
  saveAgencySetup,
} from "../../firebase/agencyService";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import {
  Globe,
  Palette,
  Share2,
  Rocket,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  Settings2,
  ExternalLink,
  Save,
} from "lucide-react";

const AgencySetup = () => {
  const { currentUser } = useAuth();
  const { agency: globalAgency, isPartner } = useAgency(); // Context se current settings lena

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubdomainAvailable, setIsSubdomainAvailable] = useState(null);
  const [hasExistingAgency, setHasExistingAgency] = useState(false);

  const [formData, setFormData] = useState({
    agencyName: "",
    subdomain: "",
    themeColor: "#0f172a",
    accentColor: "#5edff4",
    logoUrl: "",
    pricingMultiplier: 1.2,
    socialLinks: {
      instagram: "",
      whatsapp: "",
      linkedin: "",
    },
  });

  // 1. Load Existing Data on Mount
  useEffect(() => {
    const loadAgencyData = async () => {
      if (!currentUser) return;
      try {
        const docRef = doc(db, "partners", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(data);
          setHasExistingAgency(true);
          setStep(5); // Direct Dashboard/Settings View
        }
      } catch (err) {
        console.error("Error loading agency:", err);
      } finally {
        setInitialLoading(false);
      }
    };
    loadAgencyData();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateSubdomain = async () => {
    // Agar subdomain wahi hai jo pehle se saved hai, to valid hai
    if (hasExistingAgency && formData.subdomain === globalAgency.subdomain) {
      setStep(2);
      return;
    }

    if (formData.subdomain.length < 3) {
      setError("Subdomain must be at least 3 characters");
      return;
    }
    setLoading(true);
    const available = await checkSubdomainAvailability(formData.subdomain);
    setIsSubdomainAvailable(available);
    setLoading(false);
    if (available) setStep(2);
    else setError("This subdomain is already taken. Try another.");
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await saveAgencySetup(currentUser.uid, formData);
      setHasExistingAgency(true);
      setStep(4); // Success Step

      // Update local storage or trigger context refresh if needed
      setTimeout(() => setStep(5), 2000); // Redirect to settings view after success
    } catch (err) {
      setError("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header (Only show during first setup) */}
        {step < 5 && (
          <div className="flex justify-between mb-12">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex flex-col items-center flex-1">
                <div
                  className={`size-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= num
                      ? "bg-slate-900 text-[#5edff4]"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {step > num ? <CheckCircle2 size={20} /> : num}
                </div>
                <span
                  className={`text-xs mt-2 font-bold uppercase tracking-wider ${
                    step >= num ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {num === 1 ? "Identity" : num === 2 ? "Branding" : "Connect"}
                </span>
              </div>
            ))}
          </div>
        )}

        <motion.div
          layout
          className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Subdomain & Identity */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 sm:p-12"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                    <Globe size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">
                      Establish Your Domain
                    </h2>
                    <p className="text-slate-500">
                      Choose how people will find your academy
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Institute Name
                    </label>
                    <input
                      type="text"
                      name="agencyName"
                      value={formData.agencyName}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 outline-none focus:border-[#5edff4] transition-all font-bold"
                      placeholder="e.g. Z Institute of Technology"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Subdomain URL
                    </label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden px-6 focus-within:border-[#5edff4] transition-all">
                      <input
                        type="text"
                        name="subdomain"
                        value={formData.subdomain}
                        onChange={handleInputChange}
                        className="flex-1 bg-transparent py-4 outline-none font-bold lowercase"
                        placeholder="zinstitute"
                      />
                      <span className="text-slate-400 font-bold">
                        .alifestableacademy.com
                      </span>
                    </div>
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 text-red-500 text-sm font-bold">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}
                  <button
                    onClick={validateSubdomain}
                    disabled={
                      loading || !formData.subdomain || !formData.agencyName
                    }
                    className="w-full py-4 bg-slate-900 text-[#5edff4] rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-[#5edff4]/10 transition-all"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Verify & Continue"
                    )}{" "}
                    <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Branding */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 sm:p-12"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                    <Palette size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">
                      Design & Branding
                    </h2>
                    <p className="text-slate-500">
                      Make the academy truly yours
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Primary Theme Color
                      </label>
                      <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <input
                          type="color"
                          name="themeColor"
                          value={formData.themeColor}
                          onChange={handleInputChange}
                          className="size-12 rounded-lg border-none cursor-pointer bg-transparent"
                        />
                        <span className="font-mono font-bold text-slate-600">
                          {formData.themeColor.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Profit Markup (%)
                      </label>
                      <input
                        type="number"
                        value={((formData.pricingMultiplier - 1) * 100).toFixed(
                          0
                        )}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pricingMultiplier:
                              parseFloat(e.target.value) / 100 + 1,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 outline-none focus:border-[#5edff4] transition-all font-bold"
                      />
                      <p className="text-[10px] text-slate-400 mt-2">
                        Example: ₹500 course will sell for ₹
                        {(500 * formData.pricingMultiplier).toFixed(0)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden group">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#5edff4] mb-4">
                      Live Preview
                    </p>
                    <div className="h-8 w-24 bg-white/20 rounded-lg mb-4 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-white/10 rounded" />
                      <div className="h-4 w-2/3 bg-white/10 rounded" />
                    </div>
                    <button
                      className="mt-6 w-full py-2 rounded-lg font-bold text-xs"
                      style={{ backgroundColor: formData.themeColor }}
                    >
                      Example Button
                    </button>
                    <div className="absolute top-0 right-0 size-32 bg-[#5edff4]/10 blur-3xl rounded-full" />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-4 bg-slate-900 text-[#5edff4] rounded-2xl font-black"
                  >
                    Next Step
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Social & Finalize */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8 sm:p-12"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-cyan-50 rounded-2xl text-cyan-600">
                    <Share2 size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">
                      Finalize & Connect
                    </h2>
                    <p className="text-slate-500">Add your social presence</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    name="socialLinks.instagram"
                    value={formData.socialLinks.instagram}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 outline-none focus:border-[#5edff4] font-bold"
                    placeholder="Instagram Profile URL"
                  />
                  <input
                    type="text"
                    name="socialLinks.whatsapp"
                    value={formData.socialLinks.whatsapp}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 outline-none focus:border-[#5edff4] font-bold"
                    placeholder="WhatsApp Number"
                  />

                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mt-6 text-xs">
                    <p className="text-blue-800 font-bold flex items-center gap-2 mb-2">
                      <AlertCircle size={14} /> Note on Payments
                    </p>
                    <p className="text-blue-600 leading-relaxed">
                      Payments are processed via Alife Stable. Commissions are
                      settled weekly.
                    </p>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleFinalSubmit}
                      disabled={loading}
                      className="flex-1 py-4 bg-slate-900 text-[#5edff4] rounded-2xl font-black shadow-xl shadow-[#5edff4]/20 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          <Rocket size={20} /> Launch Academy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success Message */}
            {step === 4 && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 text-center"
              >
                <div className="size-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">
                  Academy Updated!
                </h2>
                <p className="text-slate-500 mb-8 font-medium">
                  Changes are now live on your domain.
                </p>
              </motion.div>
            )}

            {/* Step 5: Full Settings Dashboard (Partner can edit anytime) */}
            {step === 5 && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 sm:p-12"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 rounded-2xl text-[#5edff4]">
                      <Settings2 size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">
                        Academy Settings
                      </h2>
                      <p className="text-slate-500 font-medium text-sm">
                        Manage your brand and domain
                      </p>
                    </div>
                  </div>
                  <a
                    href={`http://${formData.subdomain}.localhost:5173`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors"
                  >
                    Visit Academy <ExternalLink size={16} />
                  </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Left Column: Form Fields */}
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                        General Information
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <input
                          type="text"
                          name="agencyName"
                          value={formData.agencyName}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:border-[#5edff4] font-bold"
                          placeholder="Academy Name"
                        />

                        <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden px-6">
                          <input
                            type="text"
                            name="subdomain"
                            value={formData.subdomain}
                            onChange={handleInputChange}
                            className="flex-1 bg-transparent py-4 outline-none font-bold"
                            placeholder="subdomain"
                          />
                          <span className="text-slate-400 text-sm font-bold">
                            .alifestableacademy.com
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                        Branding & Pricing
                      </h3>
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <input
                          type="color"
                          name="themeColor"
                          value={formData.themeColor}
                          onChange={handleInputChange}
                          className="size-12 rounded-lg cursor-pointer bg-transparent border-none"
                        />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-500">
                            Theme Color
                          </p>
                          <p className="font-mono font-bold text-slate-900">
                            {formData.themeColor.toUpperCase()}
                          </p>
                        </div>
                        <input
                          type="number"
                          step="1"
                          value={(
                            (formData.pricingMultiplier - 1) *
                            100
                          ).toFixed(0)}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              pricingMultiplier:
                                parseFloat(e.target.value) / 100 + 1,
                            })
                          }
                          className="w-24 bg-white border border-slate-200 rounded-xl py-2 px-3 outline-none font-bold text-center"
                        />
                        <span className="text-xs font-bold text-slate-400">
                          % Markup
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                        Social Links
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100 pr-4">
                          <div className="p-3 bg-pink-50 text-pink-500 rounded-xl">
                            <Share2 size={18} />
                          </div>
                          <input
                            type="text"
                            name="socialLinks.instagram"
                            value={formData.socialLinks.instagram}
                            onChange={handleInputChange}
                            className="flex-1 bg-transparent py-2 outline-none font-medium text-sm"
                            placeholder="Instagram URL"
                          />
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100 pr-4">
                          <div className="p-3 bg-green-50 text-green-500 rounded-xl">
                            <Share2 size={18} />
                          </div>
                          <input
                            type="text"
                            name="socialLinks.whatsapp"
                            value={formData.socialLinks.whatsapp}
                            onChange={handleInputChange}
                            className="flex-1 bg-transparent py-2 outline-none font-medium text-sm"
                            placeholder="WhatsApp Number"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Visual Preview */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                      Visual Preview
                    </h3>
                    <div className="aspect-video bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
                      <div className="flex justify-between items-center mb-10">
                        <div
                          className="h-6 w-20 rounded-md"
                          style={{ backgroundColor: formData.themeColor }}
                        />
                        <div className="flex gap-2">
                          <div className="size-2 rounded-full bg-white/20" />
                          <div className="size-2 rounded-full bg-white/20" />
                        </div>
                      </div>
                      <h4 className="text-xl font-black mb-2">
                        {formData.agencyName || "Your Academy"}
                      </h4>
                      <p className="text-white/50 text-xs mb-6 max-w-[200px]">
                        Unlock your potential with our expert-led courses.
                      </p>
                      <button
                        className="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg"
                        style={{ backgroundColor: formData.themeColor }}
                      >
                        Explore Courses
                      </button>
                      <div
                        className="absolute -bottom-10 -right-10 size-40 blur-[80px] rounded-full opacity-50"
                        style={{ backgroundColor: formData.themeColor }}
                      />
                    </div>

                    <button
                      onClick={handleFinalSubmit}
                      disabled={loading}
                      className="w-full py-5 bg-slate-900 text-[#5edff4] rounded-[24px] font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-200"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          <Save size={24} /> Save All Changes
                        </>
                      )}
                    </button>
                    {error && (
                      <p className="text-red-500 text-center font-bold text-sm">
                        {error}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default AgencySetup;
