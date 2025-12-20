import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ref, set, get } from "firebase/database";
import { db } from "@/lib/firebase";
import { COURSE_PACKAGES } from "@/utils/courseAccess";
import { toast } from "sonner";

const PricingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (packageId: string, price: number) => {
    if (!user) {
      toast.error("Please login to purchase");
      navigate("/login");
      return;
    }

    setLoading(packageId);

    try {
      // Get package details
      const pkg = Object.values(COURSE_PACKAGES).find(p => p.id === packageId);
      if (!pkg) throw new Error("Invalid package");

      const purchaseDate = Date.now();
      const expiryDate = pkg.duration === -1 ? -1 : purchaseDate + (pkg.duration * 24 * 60 * 60 * 1000);

      // Save purchase to user's account
      const purchaseRef = ref(db, `users/${user.uid}/purchases/${packageId}`);
      await set(purchaseRef, {
        packageId,
        packageName: pkg.name,
        price,
        purchaseDate,
        expiryDate,
        status: 'active',
        courses: pkg.courses
      });

      // Update user's active package
      await set(ref(db, `users/${user.uid}/activePackage`), packageId);

      // Track sale for partner if referral exists
      const userRef = ref(db, `users/${user.uid}`);
      const userSnap = await get(userRef);
      const userData = userSnap.val();

      if (userData?.referralCode) {
        // Extract partner code from referral (remove .alife-stable-academy.com if present)
        const partnerCode = userData.referralCode.replace('.alife-stable-academy.com', '');
        
        const saleRef = ref(db, `sales/${Date.now()}_${user.uid}`);
        await set(saleRef, {
          partnerId: partnerCode,
          studentId: user.uid,
          studentName: userData.fullName || userData.name || user.email,
          courseName: pkg.name,
          amount: price,
          commission: price * 0.2,
          purchaseDate,
          expiryDate,
          planDays: pkg.duration,
          status: 'pending'
        });
      }

      toast.success(`${pkg.name} purchased successfully!`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Purchase failed. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      ...COURSE_PACKAGES.BEGINNER,
      tag: 'BEGINNER',
      tagColor: 'bg-blue-500',
      tagline: 'Master the basics of digital marketing.',
      popular: false
    },
    {
      ...COURSE_PACKAGES.SUPREME,
      tag: 'MOST POPULAR',
      tagColor: 'bg-[#FF7A2B]',
      tagline: 'Mentorship, job placement & toolkits.',
      popular: true
    },
    {
      ...COURSE_PACKAGES.PREMIUM,
      tag: 'ADVANCED',
      tagColor: 'bg-[#9B5CF6]',
      tagline: 'Advanced strategies for scaling.',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#04060A] to-[#071426] py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-[#F7FAFC]">
            Path to <span className="text-gradient">Mastery</span>
          </h1>
          <p className="text-lg text-[#AAB3BD]">
            Select the package that fits your goals. Start out or scale up.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`relative bg-[#0B1520] rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                plan.popular ? 'md:scale-105 border-2 border-[#FF7A2B] shadow-2xl' : 'shadow-xl'
              }`}
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
                  <h3 className="text-2xl font-black text-[#F7FAFC] mb-2">{plan.name}</h3>
                  <div className="mb-3">
                    <span className="text-4xl font-black text-[#F7FAFC]">₹{plan.price.toLocaleString()}</span>
                    <span className="text-[#AAB3BD] text-sm ml-2">/one-time</span>
                  </div>
                  <p className="text-[#AAB3BD] text-sm">{plan.tagline}</p>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-[#F7FAFC]">
                      <Check className="h-5 w-5 text-[#FF7A2B] flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full rounded-full py-6 font-semibold transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-orange text-white hover:shadow-glow-orange' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  onClick={() => handlePurchase(plan.id, plan.price)}
                  disabled={loading === plan.id}
                >
                  {loading === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
