"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    quote: "WrklyHR didn't just find me a job — they found me a company that actually shares my values. Within three weeks I had three solid interviews, and I accepted an offer 25% above my target salary. Truly remarkable service.",
    name: "Priya Sharma",
    role: "Senior Product Designer",
    company: "Fintech Startup, NYC",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&q=80",
  },
  {
    quote: "As someone returning to work after a career break, I was nervous. WrklyHR's career advisors helped me reframe my experience and land a role at a company that genuinely celebrates diverse backgrounds. 10/10.",
    name: "James Whitfield",
    role: "Data Analytics Manager",
    company: "Healthcare Corp, London",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80",
  },
  {
    quote: "The job recommendations were spot-on from day one. Their platform understood what I was looking for better than I did. I found a fully remote role with a company I've admired for years. Couldn't be happier.",
    name: "Sofia Andersen",
    role: "Cloud Infrastructure Lead",
    company: "SaaS Scale-up, Remote",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&q=80",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section id="testimonials" ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT — photo */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="relative rounded-3xl overflow-hidden h-[460px] shadow-cardHover">
            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                src={t.avatar.replace("?w=120&h=120", "?w=600&h=560")}
                alt={t.name}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover object-top"
              />
            </AnimatePresence>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primaryDark/60 via-transparent to-transparent" />
            {/* Name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p className="font-jakarta font-bold text-xl">{t.name}</p>
              <p className="text-white/70 text-sm">{t.role} · {t.company}</p>
            </div>
          </div>

          {/* Purple accent blob */}
          <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-primaryLight rounded-full -z-10" />
        </motion.div>

        {/* RIGHT — quote */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
            Testimonials
          </span>
          <h2 className="font-jakarta text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-10">
            Listen To What{" "}
            <span className="text-gradient">They Say.</span>
          </h2>

          {/* Stars */}
          <div className="flex gap-1 mb-6">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} className="w-5 h-5 text-amber-400 fill-amber-400" />
            ))}
          </div>

          {/* Quote */}
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={current}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="text-gray-600 text-lg leading-relaxed mb-8 italic border-l-4 border-primaryLight pl-5"
            >
              &ldquo;{t.quote}&rdquo;
            </motion.blockquote>
          </AnimatePresence>

          {/* Author */}
          <div className="flex items-center gap-4 mb-8">
            <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <p className="font-jakarta font-bold text-gray-900">{t.name}</p>
              <p className="text-gray-500 text-sm">{t.role}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? "w-6 bg-primary" : "w-2 bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primaryDark transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
