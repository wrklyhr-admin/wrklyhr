"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Cpu,
  HeartPulse,
  Banknote,
  ShoppingBag,
  GraduationCap,
  Building2,
  Rocket,
  Leaf,
} from "lucide-react";

const industries = [
  { icon: Cpu, label: "Technology", color: "#7C3AED" },
  { icon: HeartPulse, label: "Healthcare", color: "#84CC16" },
  { icon: Banknote, label: "Financial Services", color: "#2D2B8F" },
  { icon: ShoppingBag, label: "Retail & E-Commerce", color: "#F59E0B" },
  { icon: GraduationCap, label: "Education & EdTech", color: "#EC4899" },
  { icon: Building2, label: "Professional Services", color: "#06B6D4" },
  { icon: Rocket, label: "Startups & Scaleups", color: "#7C3AED" },
  { icon: Leaf, label: "Clean Energy", color: "#84CC16" },
];

export default function Industries() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="industries" className="py-24 bg-bgLight" ref={ref}>
      <div className="max-w-7xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            Sectors
          </span>
          <h2 className="font-syne text-4xl md:text-5xl font-extrabold text-bgDark leading-tight mb-4">
            Industries We Serve
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Deep sector expertise means we understand the nuances of your industry — and know exactly where to find your next hire.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {industries.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <motion.div
                key={ind.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="group relative rounded-2xl bg-white border border-gray-100 p-6 flex flex-col items-center text-center gap-4 cursor-pointer hover:border-accent/30 transition-all duration-300 glow-hover"
                style={{ "--glow-color": ind.color } as React.CSSProperties}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${ind.color}18` }}
                >
                  <Icon className="w-7 h-7" style={{ color: ind.color }} />
                </div>
                <p className="font-syne font-semibold text-bgDark text-sm leading-tight">
                  {ind.label}
                </p>

                {/* Hover glow overlay */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${ind.color}12, transparent 70%)`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
