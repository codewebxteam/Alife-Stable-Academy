import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Check, ArrowRight, Star, Zap, Crown } from "lucide-react";

// --- Course Data ---
const products = [
  {
    id: 1,
    title: "UI/UX Design",
    price: "₹1,499",
    type: "Short Course",
    description: "Master Figma, Wireframing & Prototyping.",
    image:
      "https://images.unsplash.com/photo-1541462608143-0af7f589d4eb?q=80&w=800&auto=format&fit=crop",
    features: [
      "4 Weeks Duration",
      "Live Project Building",
      "Certificate of Completion",
      "Design System Assets",
    ],
    icon: Zap,
    color: "from-[#cff9fe] to-[#5edff4]",
  },
  {
    id: 2,
    title: "Software Engineer",
    price: "₹8,999",
    type: "Job Guarantee",
    description: "Zero to Hero: Full Stack MERN Development.",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
    features: [
      "6 Months Bootcamp",
      "100% Placement Support",
      "1-on-1 Mentorship",
      "Real-world Capstone",
    ],
    icon: Crown,
    popular: true,
    color: "from-[#5edff4] to-[#0891b2]",
  },
  {
    id: 3,
    title: "Digital Marketing",
    price: "₹3,499",
    type: "Career Track",
    description: "SEO, Google Ads, and Social Media Strategy.",
    image:
      "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=800&auto=format&fit=crop",
    features: [
      "8 Weeks Duration",
      "Agency Tools Access",
      "Live Ad Campaigns",
      "Portfolio Review",
    ],
    icon: Star,
    color: "from-purple-200 to-purple-400",
  },
];

const ProductCard = ({ product }) => {
  const ref = useRef(null);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  function onMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xOffset = clientX - left - width / 2;
    const yOffset = clientY - top - height / 2;
    x.set(xOffset / 25);
    y.set(yOffset / 25);
  }

  const transform = useMotionTemplate`perspective(1000px) rotateX(${mouseY}deg) rotateY(${mouseX}deg)`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ transformStyle: "preserve-3d", transform }}
      // Updated: rounded-[2rem] -> rounded-4xl
      className={`relative group h-full rounded-4xl transition-all duration-300
        ${product.popular ? "z-10 md:scale-105" : "hover:z-10"}
      `}
    >
      {/* --- Background Card --- */}
      <div
        // Updated: rounded-[2rem] -> rounded-4xl
        className={`absolute inset-0 rounded-4xl bg-slate-900 border border-slate-800 transition-colors duration-300 group-hover:border-[#5edff4]/30 ${
          product.popular
            ? "ring-1 ring-[#5edff4]/50 shadow-2xl shadow-[#5edff4]/20"
            : "hover:shadow-xl hover:shadow-[#5edff4]/10"
        }`}
      />

      {/* --- Popular Badge --- */}
      {product.popular && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-[#5edff4] to-[#0891b2] text-slate-900 px-4 py-1 rounded-full text-[10px] md:text-xs font-bold shadow-lg shadow-[#5edff4]/40 tracking-wide uppercase"
          style={{ transform: "translateZ(50px) translateX(-50%)" }}
        >
          Most Enrolled
        </div>
      )}

      {/* --- Image Area --- */}
      <div
        // Updated: rounded-t-[2rem] -> rounded-t-4xl
        className="relative h-36 md:h-40 rounded-t-4xl overflow-hidden"
        style={{ transform: "translateZ(20px)" }}
      >
        <div
          className={`absolute inset-0 bg-linear-to-b ${
            product.popular ? "from-[#5edff4]/20" : "from-slate-800/20"
          } to-slate-900 z-10`}
        />
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={product.image}
          alt={product.title}
          className="size-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
        <div className="absolute top-3 right-3 size-8 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center border border-white/10 z-20">
          <product.icon className="size-4 text-white" />
        </div>
      </div>

      {/* --- Content Area --- */}
      <div
        className="p-5 md:p-6 flex flex-col h-auto justify-between relative z-10"
        style={{ transform: "translateZ(30px)" }}
      >
        <div>
          {/* Type Tag */}
          <div
            className={`text-[10px] font-bold uppercase tracking-wider mb-1 bg-linear-to-r ${product.color} bg-clip-text text-transparent`}
          >
            {product.type}
          </div>

          <h3 className="text-lg md:text-xl font-bold text-white mb-2">
            {product.title}
          </h3>

          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-2xl md:text-3xl font-bold text-white">
              {product.price}
            </span>
            <span className="text-slate-500 text-[10px] md:text-xs">
              /one-time
            </span>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed mb-5 min-h-8">
            {product.description}
          </p>

          <div className="w-full h-px bg-slate-800 mb-5" />

          {/* Features List */}
          <ul className="space-y-2 mb-6">
            {product.features.map((feature, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-slate-300"
              >
                <Check
                  className={`size-3.5 mt-0.5 shrink-0 ${
                    product.popular ? "text-[#5edff4]" : "text-slate-500"
                  }`}
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <button
          className={`w-full py-3 rounded-xl font-bold text-xs md:text-sm transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer
            ${
              product.popular
                ? "bg-linear-to-r from-[#5edff4] to-[#0891b2] text-slate-900 shadow-lg shadow-[#5edff4]/25 hover:shadow-[#5edff4]/40"
                : "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700"
            }
        `}
        >
          Get Started
          <ArrowRight className="size-3.5" />
        </button>
      </div>

      {/* --- Hover Glow Effect --- */}
      <div
        // Updated: rounded-[2rem] -> rounded-4xl
        className={`absolute inset-0 rounded-4xl bg-linear-to-br ${product.color} opacity-0 group-hover:opacity-5 pointer-events-none transition-opacity duration-500`}
        style={{ transform: "translateZ(0px)" }}
      />
    </motion.div>
  );
};

const DigitalProducts = () => {
  return (
    <section className="relative w-full bg-slate-950 py-16 md:py-20 px-4 overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-75 bg-[#5edff4]/5 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-900 border border-slate-800 text-[#5edff4] text-[10px] font-bold tracking-widest uppercase mb-3">
            Unlock Your Potential
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
            Premium{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#5edff4] to-[#0891b2]">
              Courses
            </span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-sm mx-auto">
            Industry-standard curriculum designed to get you hired.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={product.popular ? "md:-mt-6 md:-mb-6" : ""}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DigitalProducts;
