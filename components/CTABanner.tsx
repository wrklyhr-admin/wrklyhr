"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Users, Briefcase, TrendingUp } from "lucide-react";

const stats = [
  { Icon: Users, val: "1,000+", label: "People Jobs" },
  { Icon: Briefcase, val: "86M+", label: "Job Listings" },
  { Icon: TrendingUp, val: "5.7M+", label: "Candidates Placed" },
];

export default function CTABanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="cta" ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden min-h-[420px] flex items-center"
        >
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=520&fit=crop&crop=right&q=85"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Gradient overlay — left purple, right transparent to show person */}
          <div className="absolute inset-0 bg-gradient-to-r from-primaryDark via-primary/90 to-primary/50" />

          {/* Dot grid */}
          <div className="absolute inset-0 dot-grid opacity-20" />

          {/* Content */}
          <div className="relative z-10 px-10 md:px-16 py-14 max-w-2xl">
            {/* Label */}
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold uppercase tracking-widest mb-5">
              Looking For a Job?
            </span>

            {/* Heading */}
            <h2 className="font-jakarta text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
              Browse Verified Job{" "}
              <span className="text-accent">Listings</span> Now!!
            </h2>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mb-8">
              {stats.map(({ Icon, val, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-jakarta font-extrabold text-white text-lg leading-none">{val}</p>
                    <p className="text-white/60 text-xs">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="#jobs"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-primaryDark font-bold hover:bg-primaryLight transition-colors"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
