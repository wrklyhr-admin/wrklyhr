"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Globe2, Award, Timer } from "lucide-react";

const stats = [
  { icon: TrendingUp, end: 2400, suffix: "+", label: "Successful Placements", desc: "Across all service lines" },
  { icon: Globe2, end: 28, suffix: "", label: "Countries Covered", desc: "Global talent, local insight" },
  { icon: Award, end: 98, suffix: "%", label: "Client Retention Rate", desc: "Year-on-year average" },
  { icon: Timer, end: 18, suffix: " days", label: "Avg. Time-to-Hire", desc: "Faster than industry average" },
];

function CountUp({ end, suffix, active }: { end: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1800;
    const step = Math.ceil(end / (duration / 16));
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, end);
      setCount(current);
      if (current >= end) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [active, end]);

  return (
    <span className="font-syne text-5xl font-extrabold text-white">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="stats" ref={ref} className="py-24 bg-primary relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/30 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-highlight text-sm font-semibold uppercase tracking-widest mb-3">
            By The Numbers
          </span>
          <h2 className="font-syne text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Impact That Speaks for Itself
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="flex flex-col items-center text-center bg-white/8 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-highlight/15 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-highlight" />
                </div>
                <CountUp end={s.end} suffix={s.suffix} active={inView} />
                <p className="font-syne font-semibold text-white mt-2 mb-1">{s.label}</p>
                <p className="text-gray-400 text-xs">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
