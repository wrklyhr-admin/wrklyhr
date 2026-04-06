"use client";

import { motion } from "framer-motion";
import { Zap, Mail, ArrowRight, Linkedin, Twitter, Instagram, Facebook, Youtube } from "lucide-react";

const navColumns = [
  {
    title: "Navigation",
    links: ["Home", "Find Talent", "Find Jobs", "Blog", "About Us"],
  },
  {
    title: "Find Jobs",
    links: ["Browse All Jobs", "Remote Jobs", "Full-time Roles", "Contract Work", "Executive Roles"],
  },
  {
    title: "Quick Links",
    links: ["How It Works", "Pricing", "Testimonials", "Career Resources", "Privacy Policy"],
  },
];

const socials = [
  { Icon: Linkedin, href: "#", label: "LinkedIn" },
  { Icon: Twitter, href: "#", label: "Twitter" },
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer id="footer" className="relative bg-[#0B0B18] text-gray-400 overflow-hidden">

      {/* Top gradient accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

      {/* Subtle radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Large background wordmark */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 font-jakarta font-extrabold text-[120px] lg:text-[180px] text-white/[0.025] whitespace-nowrap pointer-events-none select-none leading-none"
        aria-hidden="true"
      >
        WrklyHR
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5">

        {/* Top CTA band */}
        <div className="py-14 border-b border-white/[0.07] flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
              Ready to get started?
            </p>
            <h2 className="font-jakarta font-extrabold text-3xl md:text-4xl text-white leading-tight">
              Find your dream job{" "}
              <span className="bg-gradient-to-r from-violet-400 to-primary bg-clip-text text-transparent">
                today.
              </span>
            </h2>
          </div>

          {/* Newsletter / email CTA */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-0 bg-white/5 border border-white/10 rounded-full p-1.5 min-w-[320px] max-w-md w-full"
          >
            <Mail className="w-4 h-4 text-gray-500 ml-3 flex-shrink-0" />
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 px-3 outline-none"
            />
            <button
              type="submit"
              className="flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary hover:bg-primaryDark transition-colors text-white text-sm font-semibold"
            >
              Subscribe <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Main grid */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-6 gap-10 border-b border-white/[0.07]">

          {/* Brand col (spans 2) */}
          <div className="col-span-2 md:col-span-3">
            <a href="#" className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <Zap className="w-4.5 h-4.5 text-white fill-white" />
              </div>
              <span className="font-jakarta font-extrabold text-2xl text-white tracking-tight">
                Wrkly<span className="text-primary">HR</span>
              </span>
            </a>

            <p className="text-sm leading-relaxed text-gray-500 mb-8 max-w-sm">
              Connecting exceptional talent with inclusive, forward-thinking companies worldwide. 
              Diversity-first hiring made simple.
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5">
              {socials.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ y: -2 }}
                  className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:border-primary hover:bg-primary/10 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {navColumns.map((col) => (
            <div key={col.title} className="col-span-1">
              <h4 className="font-jakarta font-semibold text-white text-sm mb-5 tracking-wide">
                {col.title}
              </h4>
              <ul className="space-y-3.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 hover:text-white transition-colors duration-200 hover:translate-x-0.5 inline-block"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} WrklyHR Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((item) => (
              <a key={item} href="#" className="text-xs text-gray-600 hover:text-gray-300 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
