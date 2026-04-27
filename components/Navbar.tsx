"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";

const links = [
  { label: "Home", href: "#" },
  { label: "Find Talent", href: "#features" },
  { label: "Find Jobs", href: "#jobs" },
  { label: "Blog", href: "#insights" },
  { label: "Contacts", href: "#footer" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.header
      initial={{ y: -70 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-sm" : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-jakarta font-extrabold text-xl text-gray-900">
            Wrkly<span className="text-primary">HR</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <a href="/signup" className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors">
            Log in
          </a>
          <a
            href="/signup"
            className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primaryDark transition-colors"
          >
            Post a Job
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-gray-700 p-1">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 px-5 pb-5"
          >
            <nav className="flex flex-col gap-4 pt-4">
              {links.map((l) => (
                <a key={l.label} href={l.href} onClick={() => setOpen(false)}
                  className="text-sm font-medium text-gray-700 hover:text-primary">
                  {l.label}
                </a>
              ))}
              <a href="/signup" onClick={() => setOpen(false)}
                className="mt-1 text-center px-5 py-3 rounded-full bg-primary text-white font-semibold text-sm">
                Post a Job
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
