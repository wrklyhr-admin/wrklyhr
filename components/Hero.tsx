"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, MapPin, Star } from "lucide-react";

const avatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&q=80",
];

export default function Hero() {
  return (
    <section className="relative pt-24 pb-0 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-10 items-center min-h-[90vh]">

        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="pb-20 lg:pb-0"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primaryLight text-primary text-xs font-semibold mb-6 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Inclusive workplace for all
          </div>

          {/* Heading */}
          <h1 className="font-jakarta text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-5">
            Job Finder with{" "}
            <span className="text-gradient">Diversity</span>{" "}
            Focus.
          </h1>

          <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
            Portfolio in companies focused on Diversity and Inclusion.
            Discover roles tailored to your level, background, and ambitions.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-10">
            <a
              href="/auth"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-white font-semibold hover:bg-primaryDark transition-colors"
            >
              Get Full List <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-gray-200 text-gray-700 font-semibold hover:border-primary hover:text-primary transition-colors"
            >
              <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <Play className="w-3 h-3 text-white fill-white" />
              </span>
              See How It Works
            </a>
          </div>

          {/* Trust row */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {avatars.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="user"
                  className="w-9 h-9 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-bold text-gray-900">1,000+</span> People Found Jobs
              </p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — hero image area */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="relative flex items-end justify-center h-[580px] lg:h-[640px]"
        >
          {/* Purple blob background — larger so it peeks around image */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[420px] h-[530px] bg-gradient-to-br from-violet-500 via-primary to-primaryDark hero-blob" />

          {/* Person image — clipped to show blob surround */}
          <div className="relative z-10 h-[510px] w-[320px] flex-shrink-0 rounded-t-[180px] overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=480&h=640&fit=crop&crop=top&q=85"
              alt="Job Seeker"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Floating "Available" card — top right */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            className="absolute top-10 right-2 lg:-right-6 z-20 bg-white rounded-2xl shadow-card px-4 py-3 flex items-center gap-3 min-w-[180px]"
          >
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=44&h=44&fit=crop&q=80"
              alt=""
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <p className="text-xs font-bold text-gray-900">James Wilson</p>
              <p className="text-xs text-gray-500">UX Designer</p>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-green-100 text-green-600 text-[10px] font-semibold">
                ● Available
              </span>
            </div>
          </motion.div>

          {/* Floating job card — left */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-24 -left-4 lg:-left-10 z-20 bg-white rounded-2xl shadow-card px-4 py-3 min-w-[170px]"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-primaryLight flex items-center justify-center">
                <span className="text-primary font-bold text-xs">G</span>
              </div>
              <p className="text-xs font-bold text-gray-900">Product Manager</p>
            </div>
            <p className="text-[10px] text-gray-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> New York, USA
            </p>
            <p className="text-xs font-semibold text-primary mt-1">$9.5k – $12k/mo</p>
          </motion.div>

          {/* Stats floating bottom-right */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-16 right-0 lg:-right-4 z-20 bg-white rounded-2xl shadow-card px-4 py-3"
          >
            <p className="text-2xl font-extrabold font-jakarta text-gray-900">86M<span className="text-primary">+</span></p>
            <p className="text-xs text-gray-500">Active Job Listings</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom stat bar */}
      <div className="bg-primaryXLight border-t border-primaryLight">
        <div className="max-w-7xl mx-auto px-5 py-5 flex flex-wrap justify-center md:justify-between items-center gap-6">
          {[
            { val: "86M+", label: "Verified Job Listings" },
            { val: "50K+", label: "Companies Hiring" },
            { val: "98%", label: "Placement Success" },
            { val: "5.7M+", label: "Candidates Placed" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <p className="font-jakarta text-2xl font-extrabold text-primary">{s.val}</p>
              <p className="text-sm text-gray-500 leading-tight max-w-[100px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
