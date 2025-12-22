import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  checkSubdomainAvailability,
  saveAgencySetup,
} from "../../firebase/agencyService";
import {
  Globe,
  Layout,
  Palette,
  Share2,
  Rocket,
  CheckCircle2,
  AlertCircle,
  Upload,
  ArrowRight,
  Loader2,
} from "lucide-react";

const AgencySetup = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubdomainAvailable, setIsSubdomainAvailable] = useState(null);

  const [formData, setFormData] = useState({
    agencyName: "",
    subdomain: "",
    themeColor: "#0f172a",
    accentColor: "#5edff4",
    logoUrl: "",
    pricingMultiplier: 1.2, // Default 20% Markup
    socialLinks: {
      instagram: "",
      whatsapp: "",
      linkedin: "",
    },
  });

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
    try {
      await saveAgencySetup(currentUser.uid, formData);
      setStep(4); // Success Step
    } catch (err) {
      setError("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
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

        <motion.div
          layout
          className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
        >
          <AnimatePresence mode="wait">
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
                        name="pricingMultiplier"
                        value={(formData.pricingMultiplier - 1) * 100}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pricingMultiplier: e.target.value / 100 + 1,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 outline-none focus:border-[#5edff4] transition-all font-bold"
                        placeholder="20"
                      />
                      <p className="text-[10px] text-slate-400 mt-2">
                        Example: ₹500 course will sell for ₹
                        {(500 * formData.pricingMultiplier).toFixed(0)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden group">
                    <div className="relative z-10">
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
                    </div>
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
                    placeholder="WhatsApp Number (with country code)"
                  />

                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mt-6">
                    <p className="text-blue-800 text-sm font-bold flex items-center gap-2">
                      <AlertCircle size={18} /> Note on Payments
                    </p>
                    <p className="text-blue-600 text-xs mt-2 leading-relaxed">
                      All payments will be processed through Alife Stable
                      Academy's secure gateway. Your commission will be tracked
                      automatically and settled weekly.
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
                  Academy Launched!
                </h2>
                <p className="text-slate-500 mb-8 font-medium">
                  Your academy is now live at:
                  <br />
                  <span className="text-blue-600 font-bold">
                    {formData.subdomain}.alifestableacademy.com
                  </span>
                </p>
                <button
                  onClick={() =>
                    (window.location.href = `http://${formData.subdomain}.localhost:5173`)
                  }
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black"
                >
                  Visit Your Academy
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default AgencySetup;
