 import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

// IMAGES
import MainImage from "@/assets/heroi-mages/main-image.svg";
import Img1 from "@/assets/heroi-mages/1.svg";
import Img2 from "@/assets/heroi-mages/2.svg";
import Img3 from "@/assets/heroi-mages/3.svg";
import Img4 from "@/assets/heroi-mages/4.svg";
import Img5 from "@/assets/heroi-mages/5.svg";
import Img6 from "@/assets/heroi-mages/6.svg";
import Img7 from "@/assets/heroi-mages/7.svg";

const HeroSection = () => {
  const { handleAuthAction } = useAuthRedirect();

  return (
    <section className="relative bg-gradient-hero pt-24 sm:pt-28 pb-16 px-4 overflow-hidden">
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <div className="space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#FF7A2B]">
                Skill-Based Learning Platform
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
              Learn Job-Ready Skills.
              <br />
              <span className="text-gradient">Build Real Projects.</span>
              <br />
              Get Hired Faster.
            </h1>

            <p className="text-base sm:text-lg text-[#667085] max-w-xl mx-auto lg:mx-0">
              Industry-designed courses with live mentorship, hands-on projects,
              and certification to boost your career growth.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-[#344054] max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle className="h-4 w-4 text-orange-500" />
                Live Mentorship
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle className="h-4 w-4 text-orange-500" />
                Real Projects
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle className="h-4 w-4 text-orange-500" />
                Certification
              </div>
            </div>

            {/* BUTTONS (NO EXTRA GAP BELOW) */}
            <div className="flex flex-col sm:flex-row gap-4 pt-3 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={() => handleAuthAction()}
                className="bg-gradient-orange text-white rounded-full px-10 py-5 text-base sm:text-lg font-semibold shadow-glow-orange"
              >
                Start Learning Free
              </Button>

              <NavLink to="/courses">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-10 py-5 text-base sm:text-lg font-semibold border-2 border-[#0B1A2A]"
                >
                  Browse Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </NavLink>
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="hidden lg:block relative h-[520px]">

            {/* MAIN IMAGE */}
            <div className="absolute inset-0 flex items-end justify-center z-20">
              <img
                src={MainImage}
                alt="Learning Student"
                className="h-[500px] w-auto drop-shadow-2xl"
              />
            </div>

            {/* FLOATING BOOKS – FULLY VISIBLE */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <img src={Img1} className="absolute left-10 top-[-370px] w-21 animate-fall-slow" />
              <img src={Img2} className="absolute right-16 top-[-80px] w-24 animate-fall-medium" />
              <img src={Img3} className="absolute left-24 top-[-120px] w-21 animate-fall-fast" />

              <img src={Img4} className="absolute right-32 top-[-160px] w-21 animate-fall-slow" />
              <img src={Img5} className="absolute left-40 top-[-200px] w-21 animate-fall-medium" />
              <img src={Img6} className="absolute right-6 top-[-240px] w-16 animate-fall-fast" />
              <img src={Img7} className="absolute left-1/2 top-[-280px] w-20 animate-fall-slow" />
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTER BOTTOM GLOW */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-orange-300 via-orange-200 to-transparent pointer-events-none" />

      {/* ANIMATIONS (NO OPACITY / NO BLUR) */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-120px); }
          100% { transform: translateY(620px); }
        }
        .animate-fall-slow {
          animation: fall 14s linear infinite;
        }
        .animate-fall-medium {
          animation: fall 10s linear infinite;
        }
        .animate-fall-fast {
          animation: fall 8s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
