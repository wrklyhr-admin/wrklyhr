"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Get Matched With the Right Jobs",
    desc: "Create your profile and our AI-powered system instantly matches you with roles that fit your skills, values, and career goals.",
  },
  {
    num: "02",
    title: "Explore Verified Listings",
    desc: "Browse thousands of vetted opportunities at companies that actively champion diversity and offer real growth potential.",
  },
  {
    num: "03",
    title: "Access Career Resources",
    desc: "Use our free resume tools, interview coaching, and salary insights to ensure you stand out and land your next role confidently.",
  },
];

const benefits = [
  "Free to use for all job seekers",
  "60-day placement guarantee",
  "Dedicated career advisor",
  "Salary negotiation support",
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT — photo */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative order-2 lg:order-1"
        >
          {/* Available jobs mini widget */}
          <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-card px-5 py-4 z-20 min-w-[180px]">
            <p className="text-xs text-gray-500 mb-3 font-medium">Available Jobs</p>
            {[
              { label: "Marketing", pct: 75, color: "bg-primary" },
              { label: "Design", pct: 60, color: "bg-violet-400" },
              { label: "Remote Jobs", pct: 42, color: "bg-highlight" },
            ].map((b) => (
              <div key={b.label} className="mb-2 last:mb-0">
                <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                  <span>{b.label}</span>
                  <span>{b.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100">
                  <div className={`h-full rounded-full ${b.color}`} style={{ width: `${b.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl overflow-hidden h-[480px] shadow-cardHover">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=560&fit=crop&q=85"
              alt="Team working"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating bottom card */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            className="absolute -bottom-5 left-6 bg-primary rounded-2xl shadow-lg px-5 py-4 text-white z-20"
          >
            <p className="font-jakarta font-extrabold text-2xl">18 days</p>
            <p className="text-xs text-white/70 mt-0.5">Average Time-to-Hire</p>
          </motion.div>
        </motion.div>

        {/* RIGHT — steps */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="order-1 lg:order-2"
        >
          <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
            The Process
          </span>
          <h2 className="font-jakarta text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            How It Works to{" "}
            <span className="text-gradient">Find Your Job</span>
          </h2>
          <p className="text-gray-500 text-base mb-10 max-w-md">
            A simple, transparent process designed to get you from job seeker to hired — fast.
          </p>

          {/* Steps */}
          <div className="space-y-6 mb-10">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
                className="flex gap-5"
              >
                {/* Number circle */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primaryLight text-primary flex items-center justify-center font-jakarta font-extrabold text-sm border-2 border-primary/20">
                    {s.num}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 mt-2 bg-primaryLight" style={{ minHeight: 32 }} />
                  )}
                </div>
                {/* Text */}
                <div className="pb-4">
                  <h3 className="font-jakarta font-bold text-gray-900 text-lg mb-1">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-3">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                {b}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
