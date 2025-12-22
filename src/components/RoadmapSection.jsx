import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, MapPin } from "lucide-react";

// --- Step Data ---
const steps = [
  {
    id: 1,
    title: "Apply & Enroll",
    description:
      "Submit your application, clear the basic assessment, and secure your seat.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop",
    stat: "Step 1",
  },
  {
    id: 2,
    title: "Learn & Build",
    description:
      "Attend live classes, solve coding challenges, and build real-world projects.",
    image:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000&auto=format&fit=crop",
    stat: "Step 2",
  },
  {
    id: 3,
    title: "Capstone Project",
    description:
      "Develop a full-stack application to showcase in your portfolio.",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop",
    stat: "Step 3",
  },
  {
    id: 4,
    title: "Get Hired",
    description:
      "Mock interviews, resume building, and direct referrals to top tech companies.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop",
    stat: "Goal",
  },
];

const RoadmapSection = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    // Updated: bg-gradient-to-b -> bg-linear-to-b
    <section className="w-full relative font-sans bg-linear-to-b from-white via-[#f0fdff] to-[#cff9fe] py-20 px-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none" />

      {/* --- Main Container --- */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        // Updated: rounded-[3rem] -> rounded-3xl or arbitrary rounded-[3rem] if needed,
        // using rounded-3xl (24px) for standard, or strictly following your style with clean classes.
        // Let's stick to standard max rounded-3xl for Tailwind 4, or custom arbitrary if really needed.
        // Using standard rounded-3xl.
        className="max-w-6xl mx-auto bg-white/60 backdrop-blur-sm rounded-3xl md:rounded-[3rem] p-6 md:p-12 shadow-2xl border border-white/50 relative z-10"
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* --- LEFT SIDE: Content & Steps --- */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            {/* Heading Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#5edff4]/30 bg-white w-fit mb-4 shadow-sm">
                <span className="size-2 rounded-full bg-[#5edff4] animate-pulse" />
                <span className="text-xs font-bold text-[#0891b2] tracking-wide uppercase">
                  How it works
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                Your Roadmap to <span className="text-[#0891b2]">Success</span>.
              </h2>
              <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed">
                A structured path designed to take you from beginner to
                industry-ready professional.
              </p>
            </motion.div>

            {/* Interactive Steps */}
            <div className="flex flex-col gap-3 mt-2">
              {steps.map((step, index) => (
                <motion.button
                  key={step.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  onClick={() => setActiveStep(step.id)}
                  className={`group relative flex items-center justify-between p-3 md:p-4 rounded-xl text-left transition-all duration-300 border cursor-pointer
                  ${
                    activeStep === step.id
                      ? "bg-white border-[#5edff4] shadow-md scale-[1.02]"
                      : "bg-transparent border-transparent hover:bg-[#f0fdff] hover:border-[#cff9fe]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Number Circle */}
                    <div
                      className={`size-8 md:size-10 shrink-0 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all
                      ${
                        activeStep === step.id
                          ? "bg-[#5edff4] text-slate-900 shadow-md"
                          : "bg-[#cff9fe] text-[#0891b2]"
                      }`}
                    >
                      {step.id}
                    </div>

                    {/* Text */}
                    <div>
                      <span
                        className={`text-base md:text-lg font-semibold block transition-colors ${
                          activeStep === step.id
                            ? "text-slate-900"
                            : "text-slate-500 group-hover:text-slate-700"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                  </div>

                  {/* Animated Arrow */}
                  <AnimatePresence>
                    {activeStep === step.id && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                      >
                        <ArrowRight className="text-[#0891b2] size-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </div>

          {/* --- RIGHT SIDE: Image Area --- */}
          <div className="relative h-64 md:h-112 w-full flex items-center justify-center lg:justify-end order-1 lg:order-2">
            {/* Background Blob Animation */}
            {/* Updated gradient to linear */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0], scale: [0.95, 1, 0.95] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-linear-to-tr from-[#cff9fe] to-white rounded-4xl blur-xl opacity-60"
            />

            {/* Main Image Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              // Updated: rounded-[2rem] -> rounded-4xl
              className="relative size-full rounded-4xl overflow-hidden shadow-xl border-4 border-white bg-white"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeStep}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  src={steps[activeStep - 1].image}
                  alt={steps[activeStep - 1].title}
                  className="size-full object-cover"
                />
              </AnimatePresence>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-transparent to-transparent" />

              {/* Text Content Overlay */}
              <motion.div
                key={`text-${activeStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-0 left-0 p-6 w-full"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#5edff4] text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {steps[activeStep - 1].stat}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                  {steps[activeStep - 1].title}
                </h3>
                <p className="text-slate-200 text-xs md:text-sm leading-relaxed max-w-sm line-clamp-2">
                  {steps[activeStep - 1].description}
                </p>
              </motion.div>
            </motion.div>

            {/* Floating "Step Complete" Card */}
            <motion.div
              initial={{ x: 20, opacity: 0, scale: 0.8 }}
              whileInView={{ x: 0, opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
              className="absolute -right-4 top-8 bg-white p-3 rounded-xl shadow-lg border border-slate-100 w-40 hidden sm:block"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="size-4 text-[#5edff4]" />
                <span className="font-bold text-slate-800 text-xs">
                  Step Complete
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "60%" }}
                  transition={{ duration: 1.5, delay: 1 }}
                  className="bg-[#5edff4] h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default RoadmapSection;
