"use client";

import { motion } from "framer-motion";

const logos = [
  { name: "NY Times", style: "font-serif font-black text-gray-800 text-lg tracking-tight" },
  { name: "IEA", style: "font-jakarta font-bold text-gray-500 text-base tracking-widest uppercase" },
  { name: "FUNCA", style: "font-inter font-semibold text-gray-700 text-base" },
  { name: "Monster", style: "font-jakarta font-extrabold text-violet-600 text-base" },
  { name: "Naturalis.io", style: "font-inter font-medium text-gray-600 text-sm" },
  { name: "SAMTTIV", style: "font-inter font-light text-gray-500 text-base tracking-widest uppercase" },
  { name: "Workday", style: "font-jakarta font-bold text-blue-600 text-base" },
];

export default function TrustBar() {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-5">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-gray-400 text-sm font-medium mb-8 uppercase tracking-widest"
        >
          Trusted by <span className="text-primary font-semibold">1,000+</span> companies to find the best talent
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5"
        >
          {logos.map((l) => (
            <span key={l.name} className={`${l.style} opacity-60 hover:opacity-100 transition-opacity cursor-default`}>
              {l.name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
