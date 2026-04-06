"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const stats = [
  { val: "86M+", label: "Verified Job Listings across all industries" },
  { val: "546+", label: "Partner Companies actively hiring now" },
  { val: "5.71M+", label: "Candidates successfully placed" },
];

export default function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
            Why WrklyHR
          </span>
          <h2 className="font-jakarta text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Inclusive Opportunities,{" "}
            <span className="text-gradient">Tailored for You.</span>
          </h2>
          <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-lg">
            We partner with forward-thinking companies that prioritise diversity,
            equity and inclusion — so every candidate can find a place they truly
            belong.
          </p>

          {/* Stats */}
          <div className="space-y-5 mb-10">
            {stats.map((s, i) => (
              <motion.div
                key={s.val}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className="flex items-center gap-5"
              >
                <div className="flex-shrink-0 w-24 text-right">
                  <span className="font-jakarta font-extrabold text-3xl text-primary">{s.val}</span>
                </div>
                <div className="h-px flex-1 bg-primaryLight" />
                <p className="text-gray-500 text-sm max-w-[200px] leading-snug">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <a href="#jobs" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
            View More <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* RIGHT — photo collage */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="relative"
        >
          <div className="relative rounded-3xl overflow-hidden h-[420px] shadow-cardHover">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&h=500&fit=crop&q=85"
              alt="Diverse team"
              className="w-full h-full object-cover"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-primaryDark/40 to-transparent" />
          </div>

          {/* Floating stat card */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-card px-5 py-4"
          >
            <p className="font-jakarta font-extrabold text-2xl text-primary mb-0.5">98%</p>
            <p className="text-gray-500 text-xs">Client Retention Rate</p>
          </motion.div>

          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.8 }}
            className="absolute -top-5 -right-4 bg-primary rounded-2xl shadow-lg px-5 py-3 text-white"
          >
            <p className="font-jakarta font-bold text-lg">4.9 ★</p>
            <p className="text-xs text-white/80">Average Rating</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
