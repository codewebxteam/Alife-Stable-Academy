import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Globe,
  Award,
  Zap,
  CheckCircle2,
  ArrowRight,
  Heart,
  Target,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans selection:bg-[#5edff4] selection:text-slate-900">
      {/* --- Main Spacing Wrapper (Matches Courses/Hero) --- */}
      <div className="pt-5 md:pt-28 pb-0">
        {/* =========================================
            1. HERO SECTION: Vision & Mission
        ========================================= */}
        <div className="max-w-7xl mx-auto px-6 mb-20 md:mb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f0fdff] border border-[#cff9fe] text-[#0891b2] text-[10px] md:text-xs font-bold tracking-widest uppercase shadow-sm mb-6">
                <span className="size-2 rounded-full bg-[#5edff4] animate-pulse" />
                Our Story
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-[1.1] mb-6">
                We Are Building The <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#5edff4] to-[#0891b2]">
                  Future of Learning.
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
                Alife Stable Academy wasn't built in a boardroom. It started
                with a simple idea: **Education should be accessible, practical,
                and life-changing.** We bridge the gap between theoretical
                knowledge and industry demands.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-white border border-slate-100 shadow-lg flex items-center justify-center">
                    <Target className="size-6 text-[#0891b2]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                      Mission
                    </p>
                    <p className="font-bold text-slate-900">
                      Empower 1M+ Developers
                    </p>
                  </div>
                </div>
                <div className="w-px h-12 bg-slate-200 hidden sm:block mx-4"></div>
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-white border border-slate-100 shadow-lg flex items-center justify-center">
                    <Heart className="size-6 text-[#5edff4]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                      Values
                    </p>
                    <p className="font-bold text-slate-900">
                      Students First, Always
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Image Collage (Abstract Representation) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Decorative Blobs */}
              <div className="absolute -top-10 -right-10 size-64 bg-[#5edff4]/20 blur-3xl rounded-full -z-10" />
              <div className="absolute -bottom-10 -left-10 size-64 bg-[#0891b2]/20 blur-3xl rounded-full -z-10" />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-8">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop"
                    alt="Team"
                    className="w-full h-48 object-cover rounded-2xl shadow-xl"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=400&auto=format&fit=crop"
                    alt="Work"
                    className="w-full h-64 object-cover rounded-2xl shadow-xl"
                  />
                </div>
                <div className="space-y-4">
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400&auto=format&fit=crop"
                    alt="Meeting"
                    className="w-full h-64 object-cover rounded-2xl shadow-xl"
                  />
                  <div className="w-full h-48 bg-slate-900 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center p-4">
                    <span className="text-5xl font-bold text-[#5edff4] mb-2">
                      15+
                    </span>
                    <span className="text-white text-sm font-medium">
                      Years of Excellence
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* =========================================
            2. STATS SECTION (Bento Style)
        ========================================= */}
        <div className="bg-slate-900 py-20 text-white relative overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
              {[
                { label: "Active Students", value: "12,000+", icon: Users },
                { label: "Courses Published", value: "350+", icon: Globe },
                { label: "Instructor Partners", value: "150+", icon: Zap },
                { label: "Global Awards", value: "24", icon: Award },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center group"
                >
                  <div className="size-12 mb-4 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-[#5edff4] group-hover:text-slate-900 transition-colors duration-300">
                    <stat.icon className="size-6" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-slate-400 text-sm uppercase tracking-widest">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================
            3. WHY CHOOSE US?
        ========================================= */}
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
              Why Alife Stable?
            </h2>
            <p className="text-slate-600">
              We don't just sell courses; we curate career paths. Here is what
              sets us apart from the crowd.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Curated Content",
                desc: "We manually verify every course. No outdated tutorials. Only industry-standard, high-quality lessons.",
                color: "bg-blue-50 text-blue-600",
              },
              {
                title: "Community Driven",
                desc: "Join a Discord server of 10k+ developers. Get code reviews, pair programming partners, and job referrals.",
                color: "bg-[#f0fdff] text-[#0891b2]",
              },
              {
                title: "Affordable Pricing",
                desc: "Premium education shouldn't break the bank. We partner directly with creators to offer the best regional pricing.",
                color: "bg-purple-50 text-purple-600",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div
                  className={`size-12 rounded-xl ${card.color} flex items-center justify-center mb-6`}
                >
                  <CheckCircle2 className="size-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {card.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* =========================================
            4. FOUNDER'S NOTE SECTION
        ========================================= */}
        <div className="bg-[#f0fdff] py-20 md:py-32 border-y border-[#cff9fe]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="size-48 md:size-64 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
                    alt="Founder"
                    className="size-full object-cover"
                  />
                </div>
                <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-lg">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
                    className="size-6"
                    alt="LinkedIn"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  A Note from the Founder
                </h3>
                <p className="text-[#0891b2] font-bold mb-6">
                  Alex Sterling, CEO
                </p>
                <div className="relative">
                  <span className="absolute -top-4 -left-4 text-6xl text-[#5edff4] opacity-50 font-serif">
                    "
                  </span>
                  <p className="text-lg md:text-xl text-slate-700 leading-relaxed italic relative z-10">
                    When I started coding 15 years ago, resources were scattered
                    and expensive. I built Alife Stable Academy to be the
                    platform I wish I had. A place where quality meets
                    affordability, and where "Self-Taught" doesn't mean "Alone".
                    Welcome to the family.
                  </p>
                </div>

                <div className="mt-8">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Signature_sample.svg"
                    alt="Signature"
                    className="h-12 opacity-60 mx-auto md:mx-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            5. CTA SECTION
        ========================================= */}
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-[3rem] p-10 md:p-20 relative overflow-hidden"
          >
            {/* Glows */}
            <div className="absolute top-0 right-0 size-96 bg-[#5edff4]/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
              Ready to start your journey?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg relative z-10">
              Join 12,000+ students transforming their careers today. Get
              unlimited access to our premium library.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <NavLink
                to="/courses"
                className="px-8 py-4 bg-[#5edff4] text-slate-900 rounded-full font-bold text-lg hover:bg-[#22ccEB] hover:-translate-y-1 transition-all shadow-lg shadow-[#5edff4]/20 flex items-center justify-center gap-2"
              >
                Explore Courses <ArrowRight className="size-5" />
              </NavLink>
              <NavLink
                to="/contact"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 hover:-translate-y-1 transition-all"
              >
                Contact Support
              </NavLink>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
