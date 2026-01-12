import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, MapPin, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

// --- Step Data ---
const steps = [
  {
    id: 1,
    title: "Login & Enroll", // [UPDATED]
    description: "Login, browse our course, and secure your seat now.", // [UPDATED]
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop",
    stat: "Step 1",
  },
  {
    id: 2,
    title: "Learn & Build",
    description:
      "Attend live classes, solve challenges, and build real-world projects.", // [UPDATED] Removed "coding"
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44c?q=80&w=1000&auto=format&fit=crop", // [UPDATED] Changed to Video Editing/Creative image
    stat: "Step 2",
  },
  {
    id: 3,
    title: "Capstone Project",
    description:
      "Learn by building real-world capstone projects that showcase your skills.", // [UPDATED]
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop",
    stat: "Step 3",
  },
  {
    id: 4,
    title: "Start Your Career", // [UPDATED]
    description:
      "Start your career as a professional Creator.", // [UPDATED]
    image:
      "https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=1000&auto=format&fit=crop", // [UPDATED] Changed to Creator/Camera image
    stat: "Goal",
  },
];

const RoadmapSection = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section className="w-full relative font-sans bg-linear-to-b from-white via-[#f0fdff] to-[#cff9fe] py-20 px-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none" />

      {/* --- Main Container --- */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
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
                {/* [UPDATED] New description text */}
                A carefully designed learning ecosystem covering AI filmmaking,
                2D, 3D, and video editing—built to transform beginners into
                industry-ready creative professionals.
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

        {/* --- Call to Action Button --- */}
        <div className="mt-12 flex justify-center">
          <Link to="/courses">
            <button className="px-8 py-4 rounded-full bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 flex items-center gap-3 cursor-pointer">
              Start Your Journey Now{" "}
              <Rocket className="size-5 text-[#5edff4]" />
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default RoadmapSection;