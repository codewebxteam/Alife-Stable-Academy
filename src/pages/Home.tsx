import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { ArrowRight, BookOpen, Users, Award, Check } from "lucide-react";
import SyllabusSection from "@/components/SyllabusSection";
import HeroSection from "@/components/herosection";

const Home = () => {
  const { handleAuthAction } = useAuthRedirect();
  const pricingRef = useRef<HTMLElement>(null);
  const [pricingVisible, setPricingVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPricingVisible(true);
      },
      { threshold: 0.2 }
    );
    if (pricingRef.current) observer.observe(pricingRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <HeroSection />

      {/* Syllabus Section */}
      <SyllabusSection />

      {/* Path to Mastery - Pricing Section */}
      <section 
        id="path-to-mastery" 
        ref={pricingRef as any}
        aria-labelledby="path-title"
        className="py-12 sm:py-16 md:py-24 px-4 bg-gradient-to-b from-[#04060A] to-[#071426] relative overflow-hidden scroll-mt-20"
      >
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-orange-500 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 id="path-title" className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 text-[#F7FAFC] px-4">
              Path to <span className="text-gradient">Mastery</span>
            </h2>
            <p className="text-base sm:text-lg text-[#AAB3BD] px-4">
              Select the package that fits your goals. Start out or scale up.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {[
              {
                tag: "BEGINNER",
                tagColor: "bg-blue-500",
                title: "Pro Starter",
                price: "₹999",
                tagline: "Master the basics of digital marketing.",
                features: ["5 Core Courses", "Community Support", "Weekly Assignments", "Certificate"],
                delay: 0,
                popular: false
              },
              {
                tag: "MOST POPULAR",
                tagColor: "bg-[#FF7A2B]",
                title: "Supreme Master",
                price: "₹4,999",
                tagline: "Mentorship, job placement & toolkits.",
                features: ["All Pro Features", "1-on-1 Mentorship", "Job Placement", "Lifetime Access"],
                delay: 200,
                popular: true
              },
              {
                tag: "ADVANCED",
                tagColor: "bg-[#9B5CF6]",
                title: "Premium Elite",
                price: "₹2,499",
                tagline: "Advanced strategies for scaling.",
                features: ["12 Advanced Courses", "Priority Support", "Case Studies", "Portfolio Review"],
                delay: 400,
                popular: false
              }
            ].map((plan, i) => (
              <article
                key={i}
                role="article"
                aria-label={`${plan.title} plan`}
                className={`relative bg-[#0B1520] rounded-3xl overflow-hidden transition-all duration-700 hover:-translate-y-2 ${
                  pricingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-9"
                } ${
                  plan.popular
                    ? "md:scale-105 border-l-2 border-[#FF7A2B] shadow-2xl hover:shadow-glow-orange"
                    : "shadow-xl"
                }`}
                style={{ transitionDelay: `${plan.delay}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="px-4 py-1 bg-[#FF7A2B] rounded-full text-xs font-bold text-white">
                      BEST VALUE
                    </div>
                  </div>
                )}

                <div className="relative h-32 bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0B1520]" />
                  <div className="absolute top-4 left-4">
                    <span className={`${plan.tagColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                      {plan.tag}
                    </span>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-[#F7FAFC] mb-2">{plan.title}</h3>
                    <div className="mb-3">
                      <span className="text-4xl font-black text-[#F7FAFC]">{plan.price}</span>
                      <span className="text-[#AAB3BD] text-sm ml-2">/one-time</span>
                    </div>
                    <p className="text-[#AAB3BD] text-sm">{plan.tagline}</p>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-[#F7FAFC]">
                        <Check className="h-5 w-5 text-[#FF7A2B]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full rounded-full py-6 font-semibold transition-all duration-300 ${
                      plan.popular
                        ? "bg-gradient-orange text-white hover:shadow-glow-orange hover:-translate-y-1"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                    onClick={() => (window.location.href = "/pricing")}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 bg-gradient-to-b from-white to-orange-50/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Everything You Need to <span className="text-gradient">Succeed</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Expert Content", desc: "Learn from industry professionals with real-world experience" },
              { icon: Users, title: "Community Learning", desc: "Connect with thousands of learners and grow together" },
              { icon: Award, title: "Industry Certificates", desc: "Earn recognized credentials to boost your career prospects" }
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-white rounded-3xl border-2 border-gray-100">
                <feature.icon className="h-8 w-8 text-[#FF7A2B] mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-[#667085]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
