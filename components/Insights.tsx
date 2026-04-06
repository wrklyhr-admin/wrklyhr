"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const featured = {
  category: "Career Growth",
  categoryColor: "bg-green-500",
  title: "Measuring the Arc of Your Career Progress",
  excerpt: "Understand the key performance signals that drive long-term career momentum and salary growth.",
  img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&h=600&fit=crop&q=85",
  stat: "86M+",
  statLabel: "Verified Job Listings",
};

const sidePosts = [
  {
    category: "Tips",
    categoryColor: "bg-violet-100 text-primary",
    title: "How to Build a Resume That Stands Out",
    excerpt: "Learn the top strategies hiring managers look for — from formatting to keyword optimisation that passes ATS filters.",
    img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=240&h=180&fit=crop&q=85",
    read: "5 min",
  },
  {
    category: "Networking",
    categoryColor: "bg-amber-100 text-amber-700",
    title: "How to Network Effectively in the Digital Age",
    excerpt: "Digital networking has transformed the job hunt. Discover the platforms and tactics that lead to real conversations.",
    img: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=240&h=180&fit=crop&q=85",
    read: "4 min",
  },
];

export default function Insights() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="insights" ref={ref} className="py-24 bg-bgLight">
      <div className="max-w-7xl mx-auto px-5">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-2">
              Our Blog
            </span>
            <h2 className="font-jakarta text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight max-w-lg">
              Discover Insights And Tips{" "}
              <span className="text-gradient">For Your Future.</span>
            </h2>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all text-sm flex-shrink-0">
            All articles <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Two-column layout: featured left, stacked right */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* Featured large card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="lg:col-span-3 relative rounded-3xl overflow-hidden min-h-[480px] group cursor-pointer"
          >
            <img
              src={featured.img}
              alt={featured.title}
              className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

            {/* Category badge */}
            <div className="absolute top-5 left-5">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${featured.categoryColor}`}>
                {featured.category}
              </span>
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {/* Stat chip */}
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2 mb-5">
                <p className="font-jakarta font-extrabold text-white text-2xl leading-none">{featured.stat}</p>
                <p className="text-white/70 text-xs leading-tight">{featured.statLabel}</p>
              </div>

              <h3 className="font-jakarta font-bold text-white text-xl leading-snug mb-2">
                {featured.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-2">
                {featured.excerpt}
              </p>
              <a href="#" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-primaryLight transition-colors">
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>

          {/* Two stacked side cards */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {sidePosts.map((p, i) => (
              <motion.article
                key={p.title}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.12 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-cardHover transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image */}
                <div className="overflow-hidden h-44 flex-shrink-0">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <span className={`inline-block self-start px-3 py-0.5 rounded-full text-xs font-semibold mb-3 ${p.categoryColor}`}>
                    {p.category}
                  </span>
                  <h3 className="font-jakarta font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
                    {p.excerpt}
                  </p>
                  <a href="#" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-3 transition-all">
                    Learn More <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
