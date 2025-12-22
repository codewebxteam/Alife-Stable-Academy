import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowRight,
  CheckCircle2,
  Globe,
  HelpCircle,
  CreditCard,
  FileText,
  Smartphone,
} from "lucide-react";

const ContactUs = () => {
  const [formState, setFormState] = useState("idle"); // idle, submitting, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState("submitting");
    // Simulate API call
    setTimeout(() => {
      setFormState("success");
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans selection:bg-[#5edff4] selection:text-slate-900">
      {/* --- Main Spacing --- */}
      <div className="pt-16 md:pt-28 pb-0">
        {/* =========================================
            1. HEADER SECTION
        ========================================= */}
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f0fdff] border border-[#cff9fe] text-[#0891b2] text-[10px] md:text-xs font-bold tracking-widest uppercase shadow-sm mb-6">
              <span className="size-2 rounded-full bg-[#5edff4] animate-pulse" />
              24/7 Support
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Let's Start a <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#5edff4] to-[#0891b2]">
                Conversation.
              </span>
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Have a question about a course? Want to partner with us? Or just
              want to say hi? We are here to help you grow.
            </p>
          </motion.div>
        </div>

        {/* =========================================
            2. MAIN CONTACT INTERFACE
        ========================================= */}
        <div className="max-w-7xl mx-auto px-6 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col lg:flex-row border border-slate-100"
          >
            {/* --- LEFT COLUMN: Info (Dark Theme) --- */}
            <div className="lg:w-2/5 bg-slate-900 p-10 md:p-14 text-white relative overflow-hidden flex flex-col justify-between">
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 size-64 bg-[#5edff4]/10 blur-[60px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 size-64 bg-[#0891b2]/10 blur-[60px] rounded-full pointer-events-none" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />

              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Contact Information</h3>
                <p className="text-slate-400 mb-10 text-sm">
                  Reach out to us directly through these channels.
                </p>

                <div className="space-y-8">
                  <ContactItem
                    icon={Mail}
                    title="Email Us"
                    value="support@alifestable.com"
                    link="mailto:support@alifestable.com"
                  />
                  <ContactItem
                    icon={Phone}
                    title="Call Us"
                    value="+91 98765 43210"
                    link="tel:+919876543210"
                  />
                  <ContactItem
                    icon={MapPin}
                    title="Visit HQ"
                    value="Tech Park, Bangalore, India"
                  />
                </div>
              </div>

              <div className="relative z-10 mt-12 pt-12 border-t border-white/10">
                <div className="flex gap-4">
                  <SocialIcon />
                  <SocialIcon />
                  <SocialIcon />
                </div>
              </div>
            </div>

            {/* --- RIGHT COLUMN: Form (Light Theme) --- */}
            <div className="lg:w-3/5 p-10 md:p-14 bg-white relative">
              {formState === "success" ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="size-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6"
                  >
                    <CheckCircle2 className="size-10" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-slate-500 max-w-md">
                    Thank you for reaching out. Our team will get back to you
                    within 24 hours.
                  </p>
                  <button
                    onClick={() => setFormState("idle")}
                    className="mt-8 px-6 py-2 text-sm font-bold text-slate-900 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        First Name
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="John"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#5edff4] focus:ring-1 focus:ring-[#5edff4] transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Last Name
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Doe"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#5edff4] focus:ring-1 focus:ring-[#5edff4] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="john@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#5edff4] focus:ring-1 focus:ring-[#5edff4] transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+91..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#5edff4] focus:ring-1 focus:ring-[#5edff4] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Subject
                    </label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#5edff4] focus:ring-1 focus:ring-[#5edff4] transition-all cursor-pointer">
                      <option>General Inquiry</option>
                      <option>Course Support</option>
                      <option>Business Partnership</option>
                      <option>Report a Bug</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Message
                    </label>
                    <textarea
                      required
                      rows="4"
                      placeholder="How can we help you?"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#5edff4] focus:ring-1 focus:ring-[#5edff4] transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    disabled={formState === "submitting"}
                    className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-xl hover:bg-[#5edff4] hover:text-slate-900 transition-all shadow-lg hover:shadow-[#5edff4]/30 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {formState === "submitting" ? (
                      <>Processing...</>
                    ) : (
                      <>
                        Send Message <Send className="size-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* =========================================
            3. FREQUENTLY ASKED QUESTIONS (Expanded)
        ========================================= */}
        <div className="bg-white border-t border-slate-200 py-20 md:py-32">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-500">
                Quick answers to questions you might have. Can't find what
                you're looking for? Email us.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl">
                <h3 className="text-sm font-bold text-[#0891b2] uppercase tracking-wider mb-4">
                  📚 Courses & Access
                </h3>
                <div className="space-y-3">
                  <FAQItem
                    q="Do I get lifetime access to the courses?"
                    a="Yes! Once you purchase a course, it is yours forever. You can revisit the content, updates, and community discussions anytime."
                  />
                  <FAQItem
                    q="Are the courses suitable for beginners?"
                    a="Most of our courses are designed to take you from zero to hero. Look for the 'Beginner' tag on the course card."
                  />
                  <FAQItem
                    q="Can I download videos for offline viewing?"
                    a="Currently, video content is stream-only to protect intellectual property, but our E-books are downloadable within the secure reader."
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl">
                <h3 className="text-sm font-bold text-[#0891b2] uppercase tracking-wider mb-4">
                  💳 Payments & Refunds
                </h3>
                <div className="space-y-3">
                  <FAQItem
                    q="What payment methods do you accept?"
                    a="We accept all major Credit/Debit Cards, UPI, Net Banking, and Wallet payments through our secure gateway."
                    icon={CreditCard}
                  />
                  <FAQItem
                    q="What is your refund policy?"
                    a="We offer a 7-day money-back guarantee. If you are not satisfied with the content, email us within 7 days for a full refund."
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl">
                <h3 className="text-sm font-bold text-[#0891b2] uppercase tracking-wider mb-4">
                  🎓 Certification & Support
                </h3>
                <div className="space-y-3">
                  <FAQItem
                    q="Do you provide certificates?"
                    a="Yes, upon completing 100% of a course and the final project, you will receive a verifiable digital certificate."
                    icon={FileText}
                  />
                  <FAQItem
                    q="How does technical support work?"
                    a="Each course has a dedicated Q&A section where instructors and community members answer queries within 24 hours."
                    icon={HelpCircle}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub Components ---

const ContactItem = ({ icon: Icon, title, value, link }) => (
  <div className="flex items-start gap-4 group cursor-default">
    <div className="size-12 rounded-xl bg-white/10 flex items-center justify-center text-[#5edff4] group-hover:bg-[#5edff4] group-hover:text-slate-900 transition-all duration-300">
      <Icon className="size-6" />
    </div>
    <div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">
        {title}
      </p>
      {link ? (
        <a
          href={link}
          className="text-lg font-bold text-white hover:text-[#5edff4] transition-colors"
        >
          {value}
        </a>
      ) : (
        <p className="text-lg font-bold text-white">{value}</p>
      )}
    </div>
  </div>
);

const SocialIcon = () => (
  <div className="size-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 hover:border-white transition-all cursor-pointer">
    <Globe className="size-5" />
  </div>
);

const FAQItem = ({ q, a }) => (
  <details className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
    <summary className="flex items-center justify-between p-4 font-bold text-slate-800 cursor-pointer list-none hover:bg-slate-50/50 transition-colors">
      <span>{q}</span>
      <span className="transition-transform group-open:rotate-180">
        <ArrowRight className="size-4 text-slate-400 rotate-90" />
      </span>
    </summary>
    <div className="px-4 pb-4 text-slate-600 leading-relaxed text-sm">{a}</div>
  </details>
);

export default ContactUs;
