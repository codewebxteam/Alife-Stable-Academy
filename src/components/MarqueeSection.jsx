import React from "react";
import { motion } from "framer-motion";
import { useAgency } from "../context/AgencyContext"; // [ADDED]

const MarqueeSection = () => {
  const { agency, isMainSite } = useAgency(); // [ADDED]

  // [LOGIC] Dynamic Name Logic
  // Agar Partner hai to uska naam (Uppercase me), nahi to Default
  const academyName =
    !isMainSite && agency ? agency.name.toUpperCase() : "ALIFESTABLE ACADEMY";

  const marqueeText = `INNOVATE • EDUCATE • ELEVATE • ${academyName} • `;

  return (
    <section className="relative w-full bg-slate-950 py-10 overflow-hidden border-y border-slate-900">
      {/* --- Gradient Overlays (Fade Effect on Edges) --- */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 hidden md:block pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 hidden md:block pointer-events-none" />

      {/* --- Scrolling Content --- */}
      <div className="flex whitespace-nowrap select-none">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{
            duration: 70, // Adjust speed here
            ease: "linear",
            repeat: Infinity,
          }}
          className="flex gap-8 items-center"
        >
          {/* Repeating the text block 4 times to ensure seamless loop on large screens */}
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-transparent"
              style={{
                // Using inline style for exact Neon Cyan stroke effect
                WebkitTextStroke: "1px #5edff4",
              }}
            >
              {marqueeText}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MarqueeSection;
