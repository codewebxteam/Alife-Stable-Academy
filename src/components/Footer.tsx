import { NavLink } from "@/components/NavLink";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, GraduationCap } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    platform: [
      { label: "Courses", to: "/courses" },
      { label: "Live Classes", to: "/live-classes" },
      { label: "Instructors", to: "/instructors" },
      { label: "Pricing", to: "/pricing" },
    ],
    company: [
      { label: "About Us", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Blog", to: "/blog" },
      { label: "Contact", to: "/contact" },
    ],
    support: [
      { label: "Help Center", to: "/help" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Admin Dashboard", to: "/adminDashboard" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-card/30 border-t border-border backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <NavLink to="/" className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-orange rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative bg-gradient-orange p-2 rounded-xl">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="font-display text-lg sm:text-xl font-bold">
                Learn<span className="gradient-text">Sphere</span>
              </span>
            </NavLink>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-sm">
              Empowering learners worldwide with cutting-edge courses, live mentorship, and a thriving community.
            </p>
            <div className="flex gap-3 sm:gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary hover:shadow-glow-orange transition-all"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg mb-3 sm:mb-4">Platform</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-base sm:text-lg mb-3 sm:mb-4">Company</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-base sm:text-lg mb-3 sm:mb-4">Support</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} alife-stable-academy. All rights reserved.
            </p>
            <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm">
              <NavLink to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms
              </NavLink>
              <NavLink to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </NavLink>
              <NavLink to="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                Cookies
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
