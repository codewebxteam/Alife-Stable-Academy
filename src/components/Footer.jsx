import React from "react";
import { motion } from "framer-motion";
import {
  Twitter,
  Linkedin,
  Instagram,
  Github,
  Send,
  Heart,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const footerLinks = {
  Academy: [
    { name: "All Courses", href: "/courses" },
    { name: "Live Bootcamps", href: "/bootcamps" },
    { name: "Success Stories", href: "/stories" },
    { name: "Scholarships", href: "/scholarships" },
  ],
  Company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Become a Mentor", href: "/teach" },
    { name: "Partners", href: "/partners" },
  ],
  Resources: [
    { name: "Blog", href: "/blog" },
    { name: "Community", href: "/community" },
    { name: "Cheatsheets", href: "/resources" },
    { name: "Help Center", href: "/help" },
  ],
  Legal: [
    { name: "Terms of Use", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Refund Policy", href: "/refund" },
  ],
};

const SocialIcon = ({ Icon, href }) => (
  <motion.a
    href={href}
    whileHover={{
      scale: 1.1,
      y: -3,
      backgroundColor: "#5edff4",
      color: "#0f172a", // slate-900
      borderColor: "#5edff4",
    }}
    whileTap={{ scale: 0.9 }}
    className="size-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 transition-all duration-300 hover:shadow-[0_0_15px_rgba(94,223,244,0.5)]"
  >
    <Icon className="size-5" />
  </motion.a>
);

const Footer = () => {
  return (
    <footer className="relative bg-slate-950 pt-24 pb-12 overflow-hidden font-sans border-t border-slate-900">
      {/* --- Background Effects --- */}
      {/* Glowing Blob (Top Left) */}
      <div className="absolute top-0 left-0 size-200 bg-[#5edff4]/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      {/* Glowing Blob (Bottom Right) */}
      <div className="absolute bottom-0 right-0 size-150 bg-[#0891b2]/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* --- Top Section: CTA & Newsletter --- */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20 pb-12 border-b border-slate-800/50">
          {/* Brand & Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              {/* Logo Placeholder */}
              <div className="size-10 bg-linear-to-br from-[#5edff4] to-[#0891b2] rounded-xl flex items-center justify-center shadow-lg shadow-[#5edff4]/20">
                <span className="text-slate-900 font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Alife Stable Academy
              </span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4 leading-tight">
              Start your journey <br /> to{" "}
              <span className="text-[#5edff4]">financial freedom</span>.
            </h3>
            <p className="text-slate-400 text-base md:text-lg max-w-md">
              Join 25,000+ students mastering the skills of tomorrow. No credit
              card required for the demo.
            </p>
          </motion.div>

          {/* Newsletter Box */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-r from-[#5edff4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <h4 className="text-white font-bold text-xl mb-2 relative z-10">
                Subscribe to our newsletter
              </h4>
              <p className="text-slate-400 mb-6 text-sm relative z-10">
                Get the latest trends, tips, and free resources weekly.
              </p>

              <form className="relative flex items-center z-10">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-slate-950 text-white border border-slate-800 rounded-full py-4 pl-6 pr-16 focus:outline-none focus:border-[#5edff4] focus:ring-1 focus:ring-[#5edff4] transition-all placeholder:text-slate-600"
                />
                <button
                  type="button"
                  className="absolute right-2 size-10 bg-[#5edff4] rounded-full flex items-center justify-center text-slate-900 hover:bg-[#cff9fe] hover:scale-105 transition-all shadow-lg shadow-[#5edff4]/25 cursor-pointer"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* --- Middle Section: Links Grid --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20">
          {Object.entries(footerLinks).map(([title, links], categoryIndex) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              <h4 className="text-white font-bold mb-6">{title}</h4>
              <ul className="space-y-4">
                {links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      className="group flex items-center gap-2 text-slate-400 hover:text-[#5edff4] transition-colors text-sm font-medium"
                    >
                      <span className="relative">
                        {link.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#5edff4] transition-all group-hover:w-full"></span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* --- Bottom Section: Copyright & Socials --- */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-800/50 gap-6">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span>© 2025 Alifestable Academy. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span>Made with</span>
            <Heart className="size-4 text-red-500 fill-red-500 animate-pulse" />
            <span>by</span>
            <a
              href="#"
              className="text-[#5edff4] hover:text-[#cff9fe] transition-colors font-bold"
            >
              CodeWebX
            </a>
          </div>

          <div className="flex items-center gap-4">
            <SocialIcon Icon={Twitter} href="#" />
            <SocialIcon Icon={Linkedin} href="#" />
            <SocialIcon Icon={Instagram} href="#" />
            <SocialIcon Icon={Github} href="#" />
          </div>
        </div>
      </div>

      {/* --- Giant Background Watermark (Animation) --- */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 w-full text-center pointer-events-none select-none overflow-hidden">
        <motion.h1
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.05 }}
          transition={{ duration: 2 }}
          className="text-[12vw] md:text-[15vw] font-black text-white leading-none tracking-tighter whitespace-nowrap"
        >
          ALIFESTABLE
        </motion.h1>
      </div>
    </footer>
  );
};

export default Footer;
